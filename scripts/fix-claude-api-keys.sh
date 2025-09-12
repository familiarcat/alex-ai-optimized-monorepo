#!/bin/bash

# =============================================================================
# Alex AI Claude API Key Formatting Fix
# =============================================================================
# 
# This script fixes Claude API key formatting issues to ensure Claude is
# always available throughout the entire Alex AI system.
#
# Issues addressed:
# - Duplicated/concatenated API keys (185+ characters)
# - Invalid key formats
# - Missing environment variables
# - Inconsistent key naming
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

# Paths
readonly ZSHRC_FILE="$HOME/.zshrc"
readonly BACKUP_DIR="$HOME/.alex-ai-backups"

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

# Validate API key format
validate_api_key() {
    local key="$1"
    
    # Check if key is empty
    if [[ -z "$key" ]]; then
        return 1
    fi
    
    # Check if key starts with correct prefix
    if [[ ! "$key" =~ ^sk-ant-api03- ]]; then
        return 1
    fi
    
    # Check if key length is reasonable (80-120 characters)
    if [[ ${#key} -lt 80 ]] || [[ ${#key} -gt 120 ]]; then
        return 1
    fi
    
    # Check if key contains spaces or newlines
    if [[ "$key" =~ [[:space:]] ]]; then
        return 1
    fi
    
    # Check if key appears to be duplicated
    if [[ ${#key} -gt 140 ]]; then
        return 1
    fi
    
    return 0
}

# Test API key with Claude API
test_api_key() {
    local key="$1"
    
    print_geordi "Testing API key with Claude API..."
    
    local response
    response=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
        -H "x-api-key: $key" \
        -H "anthropic-version: 2023-06-01" \
        -H "content-type: application/json" \
        -d '{
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 50,
            "messages": [{"role": "user", "content": "Test connection"}]
        }' 2>/dev/null)
    
    if echo "$response" | grep -q "content"; then
        print_crusher "API key test: ✅ SUCCESS"
        return 0
    else
        print_worf "API key test: ❌ FAILED"
        echo "Response: $response"
        return 1
    fi
}

# Get current API key from .zshrc
get_current_api_key() {
    local key=""
    
    # Try different possible variable names
    key=$(grep -E 'export (ANTHROPIC_API_KEY|CLAUDE_API_KEY)=' "$ZSHRC_FILE" 2>/dev/null | head -1 | cut -d'"' -f2)
    
    if [[ -n "$key" ]]; then
        echo "$key"
    else
        echo ""
    fi
}

# Fix API key in .zshrc
fix_api_key_in_zshrc() {
    local new_key="$1"
    
    print_geordi "Updating API key in .zshrc..."
    
    # Create backup
    mkdir -p "$BACKUP_DIR"
    cp "$ZSHRC_FILE" "$BACKUP_DIR/.zshrc.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Remove old API key lines
    sed -i.bak '/export ANTHROPIC_API_KEY=/d' "$ZSHRC_FILE" 2>/dev/null || true
    sed -i.bak '/export CLAUDE_API_KEY=/d' "$ZSHRC_FILE" 2>/dev/null || true
    rm -f "$ZSHRC_FILE.bak" 2>/dev/null || true
    
    # Add new API key
    cat >> "$ZSHRC_FILE" << EOF

# =============================================================================
# Alex AI Claude API Configuration
# =============================================================================
export ANTHROPIC_API_KEY="$new_key"
export CLAUDE_API_KEY="$new_key"

EOF
    
    print_geordi "API key updated in .zshrc"
}

# Interactive API key setup
interactive_api_key_setup() {
    print_picard "Interactive Claude API Key Setup"
    echo ""
    
    echo "📋 To get a new API key:"
    echo "1. Go to: https://console.anthropic.com/"
    echo "2. Sign in to your account"
    echo "3. Click 'Create New Key'"
    echo "4. Name it 'Alex AI Integration'"
    echo "5. Copy the key (starts with 'sk-ant-api03-')"
    echo ""
    echo "💡 The key should be about 100 characters long"
    echo "   Example: sk-ant-api03-ABC123...XYZ789"
    echo ""
    
    # Prompt for the new key
    echo "📝 Please paste your new API key below:"
    read -p "API Key: " NEW_KEY
    
    # Validate the key format
    if ! validate_api_key "$NEW_KEY"; then
        print_worf "Invalid API key format!"
        echo "Expected format: sk-ant-api03-[80-120 characters]"
        return 1
    fi
    
    # Test the key
    if ! test_api_key "$NEW_KEY"; then
        print_worf "API key test failed!"
        return 1
    fi
    
    # Update .zshrc
    fix_api_key_in_zshrc "$NEW_KEY"
    
    print_crusher "API key setup complete!"
    return 0
}

# Auto-fix existing API key
auto_fix_api_key() {
    local current_key
    current_key=$(get_current_api_key)
    
    if [[ -z "$current_key" ]]; then
        print_worf "No API key found in .zshrc"
        return 1
    fi
    
    print_info "Found existing API key (length: ${#current_key})"
    
    # Check if key is already valid
    if validate_api_key "$current_key" && test_api_key "$current_key"; then
        print_crusher "API key is already valid and working!"
        return 0
    fi
    
    # Try to fix duplicated key
    if [[ ${#current_key} -gt 140 ]]; then
        print_geordi "Detected duplicated API key, attempting to extract valid key..."
        
        # Try to find a valid key within the duplicated string
        local fixed_key=""
        local i=0
        while [[ $i -lt ${#current_key} ]]; do
            local test_key="${current_key:$i:100}"
            if [[ "$test_key" =~ ^sk-ant-api03- ]] && validate_api_key "$test_key"; then
                if test_api_key "$test_key"; then
                    fixed_key="$test_key"
                    break
                fi
            fi
            i=$((i + 10))
        done
        
        if [[ -n "$fixed_key" ]]; then
            print_geordi "Successfully extracted valid API key!"
            fix_api_key_in_zshrc "$fixed_key"
            print_crusher "API key auto-fix complete!"
            return 0
        fi
    fi
    
    print_worf "Could not auto-fix API key. Manual setup required."
    return 1
}

# Update environment variables
update_environment() {
    print_geordi "Updating environment variables..."
    
    # Source the updated .zshrc
    source "$ZSHRC_FILE" 2>/dev/null || true
    
    # Verify the key is loaded
    if [[ -n "${ANTHROPIC_API_KEY:-}" ]]; then
        print_crusher "Environment variables updated successfully"
        return 0
    else
        print_worf "Failed to load environment variables"
        return 1
    fi
}

# Main function
main() {
    echo "🔧 Alex AI Claude API Key Formatting Fix v1.0.0"
    echo "=============================================="
    echo ""
    
    print_picard "Initiating Claude API key formatting fix protocol..."
    
    # Try auto-fix first
    if auto_fix_api_key; then
        echo ""
        print_picard "Auto-fix successful! Testing system integration..."
        
        # Update environment
        if update_environment; then
            echo ""
            print_crusher "🎉 Claude API key formatting fix complete!"
            print_picard "Alex AI system is now fully operational with Claude integration!"
            echo ""
            echo "🔄 Please restart your terminal or run: source ~/.zshrc"
            return 0
        fi
    fi
    
    echo ""
    print_worf "Auto-fix failed. Starting interactive setup..."
    echo ""
    
    # Interactive setup
    if interactive_api_key_setup; then
        echo ""
        print_picard "Interactive setup complete! Testing system integration..."
        
        # Update environment
        if update_environment; then
            echo ""
            print_crusher "🎉 Claude API key formatting fix complete!"
            print_picard "Alex AI system is now fully operational with Claude integration!"
            echo ""
            echo "🔄 Please restart your terminal or run: source ~/.zshrc"
            return 0
        fi
    fi
    
    echo ""
    print_worf "❌ Claude API key formatting fix failed!"
    print_worf "Please check your API key and try again."
    return 1
}

# Run main function
main "$@"
