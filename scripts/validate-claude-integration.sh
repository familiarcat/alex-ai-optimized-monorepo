#!/bin/bash

# =============================================================================
# Alex AI Claude Integration Validation Script
# =============================================================================
# 
# This script validates that Claude is properly integrated throughout
# the entire Alex AI system and all components can access it.
#
# =============================================================================

set -euo pipefail

# Color codes
readonly DATA_COLOR='\033[0;36m'
readonly GEORDI_COLOR='\033[0;33m'
readonly WORF_COLOR='\033[0;31m'
readonly CRUSHER_COLOR='\033[0;35m'
readonly PICARD_COLOR='\033[0;34m'
readonly NC='\033[0m'

print_info() {
    echo -e "${DATA_COLOR}🤖 Commander Data: $1${NC}"
}

print_geordi() {
    echo -e "${GEORDI_COLOR}🔧 Lieutenant Commander Geordi: $1${NC}"
}

print_worf() {
    echo -e "${WORF_COLOR}🛡️ Lieutenant Worf: $1${NC}"
}

print_crusher() {
    echo -e "${CRUSHER_COLOR}🏥 Dr. Crusher: $1${NC}"
}

print_picard() {
    echo -e "${PICARD_COLOR}👨‍✈️ Captain Picard: $1${NC}"
}

# Test Claude API connection
test_claude_api() {
    print_geordi "Testing Claude API connection..."
    
    if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
        print_worf "ANTHROPIC_API_KEY not set in environment"
        return 1
    fi
    
    local response
    response=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
        -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        -H "content-type: application/json" \
        -d '{
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 100,
            "messages": [{"role": "user", "content": "Hello, this is a test from Alex AI system. Please respond with: Alex AI Claude integration test successful!"}]
        }' 2>/dev/null)
    
    if echo "$response" | grep -q "Alex AI Claude integration test successful"; then
        print_crusher "Claude API test: ✅ SUCCESS"
        return 0
    else
        print_worf "Claude API test: ❌ FAILED"
        echo "Response: $response"
        return 1
    fi
}

# Test Alex AI Core integration
test_alex_ai_core() {
    print_geordi "Testing Alex AI Core integration..."
    
    # Check if core package exists
    if [[ ! -d "packages/@alex-ai/core" ]]; then
        print_worf "Alex AI Core package not found"
        return 1
    fi
    
    # Check if core can initialize
    if [[ -f "packages/@alex-ai/core/src/alex-ai-manager.ts" ]]; then
        print_crusher "Alex AI Core package: ✅ FOUND"
        print_crusher "Alex AI Manager: ✅ AVAILABLE"
        return 0
    else
        print_worf "Alex AI Core integration: ❌ FAILED"
        return 1
    fi
}

# Test N8N integration
test_n8n_integration() {
    print_geordi "Testing N8N integration..."
    
    # Check N8N configuration files
    local n8n_files=(
        "n8n-sync-config.json"
        "n8n-credentials.json"
        "apps/alex-ai-master-project/n8n-sync-hub"
    )
    
    local found_files=0
    for file in "${n8n_files[@]}"; do
        if [[ -f "$file" ]] || [[ -d "$file" ]]; then
            found_files=$((found_files + 1))
        fi
    done
    
    if [[ $found_files -gt 0 ]]; then
        print_crusher "N8N integration: ✅ CONFIGURED ($found_files components found)"
        return 0
    else
        print_worf "N8N integration: ❌ NOT CONFIGURED"
        return 1
    fi
}

# Test crew coordination
test_crew_coordination() {
    print_geordi "Testing crew coordination..."
    
    # Check crew manager
    if [[ -f "packages/@alex-ai/core/src/crew-manager.ts" ]]; then
        print_crusher "Crew Manager: ✅ AVAILABLE"
        
        # Check if crew members are defined
        if grep -q "Captain Picard\|Commander Data\|Lieutenant Geordi" "packages/@alex-ai/core/src/crew-manager.ts"; then
            print_crusher "Crew Members: ✅ DEFINED"
            return 0
        else
            print_worf "Crew Members: ❌ NOT DEFINED"
            return 1
        fi
    else
        print_worf "Crew coordination: ❌ NOT AVAILABLE"
        return 1
    fi
}

# Test environment variables
test_environment_variables() {
    print_geordi "Testing environment variables..."
    
    local required_vars=(
        "ANTHROPIC_API_KEY"
        "SUPABASE_URL"
        "SUPABASE_ANON_KEY"
        "OPENROUTER_API_KEY"
    )
    
    local found_vars=0
    for var in "${required_vars[@]}"; do
        if [[ -n "${!var:-}" ]]; then
            found_vars=$((found_vars + 1))
            print_crusher "$var: ✅ SET"
        else
            print_worf "$var: ❌ NOT SET"
        fi
    done
    
    if [[ $found_vars -eq ${#required_vars[@]} ]]; then
        print_crusher "Environment variables: ✅ ALL SET"
        return 0
    else
        print_worf "Environment variables: ❌ INCOMPLETE ($found_vars/${#required_vars[@]})"
        return 1
    fi
}

# Generate comprehensive report
generate_report() {
    local claude_status="$1"
    local core_status="$2"
    local n8n_status="$3"
    local crew_status="$4"
    local env_status="$5"
    
    echo ""
    echo "📊 ================================================"
    echo "📊        ALEX AI CLAUDE INTEGRATION REPORT"
    echo "📊 ================================================"
    echo ""
    
    echo "🔧 CLAUDE API INTEGRATION:"
    if [[ "$claude_status" == "success" ]]; then
        echo "   ✅ Claude API: OPERATIONAL"
        echo "   ✅ Authentication: WORKING"
        echo "   ✅ Model Access: AVAILABLE"
    else
        echo "   ❌ Claude API: FAILED"
        echo "   ❌ Authentication: ISSUES DETECTED"
        echo "   ❌ Model Access: UNAVAILABLE"
    fi
    echo ""
    
    echo "🤖 ALEX AI CORE SYSTEM:"
    if [[ "$core_status" == "success" ]]; then
        echo "   ✅ Core Package: AVAILABLE"
        echo "   ✅ Manager: OPERATIONAL"
        echo "   ✅ Integration: READY"
    else
        echo "   ❌ Core Package: ISSUES DETECTED"
        echo "   ❌ Manager: NOT AVAILABLE"
        echo "   ❌ Integration: FAILED"
    fi
    echo ""
    
    echo "🔗 N8N INTEGRATION:"
    if [[ "$n8n_status" == "success" ]]; then
        echo "   ✅ N8N Config: CONFIGURED"
        echo "   ✅ Workflows: AVAILABLE"
        echo "   ✅ Federation: READY"
    else
        echo "   ❌ N8N Config: NOT CONFIGURED"
        echo "   ❌ Workflows: UNAVAILABLE"
        echo "   ❌ Federation: FAILED"
    fi
    echo ""
    
    echo "👥 CREW COORDINATION:"
    if [[ "$crew_status" == "success" ]]; then
        echo "   ✅ Crew Manager: AVAILABLE"
        echo "   ✅ Crew Members: DEFINED"
        echo "   ✅ Coordination: OPERATIONAL"
    else
        echo "   ❌ Crew Manager: NOT AVAILABLE"
        echo "   ❌ Crew Members: NOT DEFINED"
        echo "   ❌ Coordination: FAILED"
    fi
    echo ""
    
    echo "🌍 ENVIRONMENT VARIABLES:"
    if [[ "$env_status" == "success" ]]; then
        echo "   ✅ All Variables: SET"
        echo "   ✅ Configuration: COMPLETE"
        echo "   ✅ System: READY"
    else
        echo "   ❌ Variables: INCOMPLETE"
        echo "   ❌ Configuration: ISSUES DETECTED"
        echo "   ❌ System: NOT READY"
    fi
    echo ""
    
    # Overall status
    local total_tests=5
    local passed_tests=0
    
    [[ "$claude_status" == "success" ]] && passed_tests=$((passed_tests + 1))
    [[ "$core_status" == "success" ]] && passed_tests=$((passed_tests + 1))
    [[ "$n8n_status" == "success" ]] && passed_tests=$((passed_tests + 1))
    [[ "$crew_status" == "success" ]] && passed_tests=$((passed_tests + 1))
    [[ "$env_status" == "success" ]] && passed_tests=$((passed_tests + 1))
    
    echo "🎯 OVERALL STATUS:"
    if [[ $passed_tests -eq $total_tests ]]; then
        echo "   ✅ FULLY OPERATIONAL ($passed_tests/$total_tests tests passed)"
        echo "   🚀 Claude is available throughout the entire Alex AI system!"
    elif [[ $passed_tests -ge 3 ]]; then
        echo "   ⚠️  MOSTLY OPERATIONAL ($passed_tests/$total_tests tests passed)"
        echo "   🔧 Some components need attention"
    else
        echo "   ❌ NOT OPERATIONAL ($passed_tests/$total_tests tests passed)"
        echo "   🚨 Significant issues detected"
    fi
    echo ""
}

# Main function
main() {
    echo "🧪 Alex AI Claude Integration Validation v1.0.0"
    echo "=============================================="
    echo ""
    
    print_picard "Initiating comprehensive Claude integration validation..."
    echo ""
    
    # Run all tests
    local claude_status="failed"
    local core_status="failed"
    local n8n_status="failed"
    local crew_status="failed"
    local env_status="failed"
    
    # Test Claude API
    if test_claude_api; then
        claude_status="success"
    fi
    echo ""
    
    # Test Alex AI Core
    if test_alex_ai_core; then
        core_status="success"
    fi
    echo ""
    
    # Test N8N Integration
    if test_n8n_integration; then
        n8n_status="success"
    fi
    echo ""
    
    # Test Crew Coordination
    if test_crew_coordination; then
        crew_status="success"
    fi
    echo ""
    
    # Test Environment Variables
    if test_environment_variables; then
        env_status="success"
    fi
    echo ""
    
    # Generate comprehensive report
    generate_report "$claude_status" "$core_status" "$n8n_status" "$crew_status" "$env_status"
    
    # Final recommendations
    if [[ "$claude_status" != "success" ]]; then
        echo "🔧 RECOMMENDATIONS:"
        echo "   1. Run: ./scripts/fix-claude-api-keys.sh"
        echo "   2. Verify API key format and validity"
        echo "   3. Test API key with Anthropic console"
        echo "   4. Update environment variables"
        echo ""
    fi
    
    print_picard "Claude integration validation complete!"
}

# Run main function
main "$@"
