#!/bin/bash

# API Key Validation Script
# Validates API keys without exposing them

set -euo pipefail

# Configuration
VALIDATION_LOG="api-key-validation.log"

# Logging function
}

# Validate API key format
validate_key_format() {
    local key="$1"
    local key_type="$2"
    
    case "$key_type" in
        "anthropic")
            if [[ "$key" =~ ^sk-ant-api[0-9]+--[A-Za-z0-9_-]+$ ]]; then
                return 0
            else
                return 1
            fi
            ;;
        "openai")
            if [[ "$key" =~ ^sk-[A-Za-z0-9]{48}$ ]]; then
                return 0
            else
                return 1
            fi
            ;;
        *)
            return 1
            ;;
    esac
}

# Test API key connectivity
test_api_connectivity() {
    local key="$1"
    local key_type="$2"
    
    case "$key_type" in
        "anthropic")
            # Test with minimal request
            local response
            if response=$(curl -s -w "%{http_code}" -H "x-api-key: $key" \
                -H "Content-Type: application/json" \
                -d '{"model":"claude-3-haiku-20240307","max_tokens":1,"messages":[{"role":"user","content":"test"}]}' \
                https://api.anthropic.com/v1/messages 2>/dev/null); then
                
                local http_code="${response: -3}"
                if [[ "$http_code" == "200" ]]; then
                    return 0
                else
                    log "API test failed with HTTP code: $http_code"
                    return 1
                fi
            else
                log "API request failed"
                return 1
            fi
            ;;
        "openai")
            # Test with minimal request
            local response
            if response=$(curl -s -w "%{http_code}" -H "Authorization: Bearer $key" \
                -H "Content-Type: application/json" \
                -d '{"model":"gpt-3.5-turbo","max_tokens":1,"messages":[{"role":"user","content":"test"}]}' \
                https://api.openai.com/v1/chat/completions 2>/dev/null); then
                
                local http_code="${response: -3}"
                if [[ "$http_code" == "200" ]]; then
                    return 0
                else
                    log "API test failed with HTTP code: $http_code"
                    return 1
                fi
            else
                log "API request failed"
                return 1
            fi
            ;;
        *)
            log "Unknown API key type: $key_type"
            return 1
            ;;
    esac
}

# Validate all API keys
validate_all_keys() {
    log "Starting API key validation"
    
    # Load keys securely
    if [[ -f "$HOME/.alexai-keys/api-keys.env" ]]; then
        source "$HOME/.alexai-keys/api-keys.env"
    else
        log "ERROR: API keys file not found"
        return 1
    fi
    
    local validation_results=()
    
    # Validate Anthropic key
    if [[ -n "${ANTHROPIC_API_KEY:-}" ]]; then
        log "Validating Anthropic API key..."
        
        if validate_key_format "$ANTHROPIC_API_KEY" "anthropic"; then
            log "✅ Anthropic key format is valid"
            
            if test_api_connectivity "$ANTHROPIC_API_KEY" "anthropic"; then
                log "✅ Anthropic API connectivity test passed"
                validation_results+=("anthropic:PASS")
            else
                log "❌ Anthropic API connectivity test failed"
                validation_results+=("anthropic:FAIL:connectivity")
            fi
        else
            log "❌ Anthropic key format is invalid"
            validation_results+=("anthropic:FAIL:format")
        fi
    else
        log "⚠️  Anthropic API key not found"
        validation_results+=("anthropic:WARN:missing")
    fi
    
    # Validate OpenAI key (if present)
    if [[ -n "${OPENAI_API_KEY:-}" ]]; then
        log "Validating OpenAI API key..."
        
        if validate_key_format "$OPENAI_API_KEY" "openai"; then
            log "✅ OpenAI key format is valid"
            
            if test_api_connectivity "$OPENAI_API_KEY" "openai"; then
                log "✅ OpenAI API connectivity test passed"
                validation_results+=("openai:PASS")
            else
                log "❌ OpenAI API connectivity test failed"
                validation_results+=("openai:FAIL:connectivity")
            fi
        else
            log "❌ OpenAI key format is invalid"
            validation_results+=("openai:FAIL:format")
        fi
    else
        log "ℹ️  OpenAI API key not configured"
        validation_results+=("openai:INFO:not_configured")
    fi
    
    # Summary
    log ""
    log "API Key Validation Summary"
    log "========================="
    
    local pass_count=0
    local fail_count=0
    local warn_count=0
    
    for result in "${validation_results[@]}"; do
        IFS=':' read -r service status details <<< "$result"
        
        case "$status" in
            "PASS")
                log "✅ $service: Valid and working"
                ((pass_count++))
                ;;
            "FAIL")
                log "❌ $service: Failed ($details)"
                ((fail_count++))
                ;;
            "WARN"|"INFO")
                log "⚠️  $service: $status ($details)"
                ((warn_count++))
                ;;
        esac
    done
    
    log ""
    log "Total: $((pass_count + fail_count + warn_count)) keys checked"
    log "Passed: $pass_count"
    log "Failed: $fail_count"
    log "Warnings: $warn_count"
    
    if [[ $fail_count -eq 0 ]]; then
        log "🎉 All API keys are valid!"
        return 0
    else
        log "⚠️  Some API keys have issues. Review the log for details."
        return 1
    fi
}

# Main execution
        "validate")
            validate_all_keys
            ;;
        "help")
            echo "API Key Validation Script"
            echo "Usage: $0 [validate|help]"
            echo ""
            echo "Commands:"
            echo "  validate  - Validate all configured API keys"
            echo "  help      - Show this help message"
            ;;
        *)
            echo "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"
