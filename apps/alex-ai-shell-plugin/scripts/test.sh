#!/bin/bash

# =============================================================================
# Alex AI Shell Plugin Test Script
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

test_shell_intelligence() {
    print_geordi "Testing shell intelligence script..."
    
    local script_path="$OH_MY_ZSH_DIR/custom/plugins/alex-ai-monorepo-shell-intelligence.sh"
    if [[ -f "$script_path" ]]; then
        print_crusher "Shell intelligence script: ✅ Found"
        
        # Test basic commands
        "$script_path" status >/dev/null 2>&1 && print_crusher "Status command: ✅ Working"
        "$script_path" workspace >/dev/null 2>&1 && print_crusher "Workspace command: ✅ Working"
        "$script_path" milestone >/dev/null 2>&1 && print_crusher "Milestone command: ✅ Working"
        "$script_path" crew >/dev/null 2>&1 && print_crusher "Crew command: ✅ Working"
    else
        print_worf "Shell intelligence script: ❌ Not found"
        return 1
    fi
}

test_plugin() {
    print_geordi "Testing oh-my-zsh plugin..."
    
    local plugin_path="$OH_MY_ZSH_DIR/custom/plugins/alex-ai-monorepo/alex-ai-monorepo.plugin.zsh"
    if [[ -f "$plugin_path" ]]; then
        print_crusher "Plugin file: ✅ Found"
        
        # Test plugin functions
        if grep -q "alex_ai_dashboard" "$plugin_path"; then
            print_crusher "Dashboard function: ✅ Found"
        else
            print_worf "Dashboard function: ❌ Missing"
        fi
        
        if grep -q "alex_ai_status" "$plugin_path"; then
            print_crusher "Status function: ✅ Found"
        else
            print_worf "Status function: ❌ Missing"
        fi
    else
        print_worf "Plugin file: ❌ Not found"
        return 1
    fi
}

test_theme() {
    print_geordi "Testing custom theme..."
    
    local theme_path="$OH_MY_ZSH_DIR/custom/themes/alex-ai-monorepo.zsh-theme"
    if [[ -f "$theme_path" ]]; then
        print_crusher "Theme file: ✅ Found"
        
        # Test theme functions
        if grep -q "alex_ai_build_prompt" "$theme_path"; then
            print_crusher "Prompt function: ✅ Found"
        else
            print_worf "Prompt function: ❌ Missing"
        fi
        
        if grep -q "alex_ai_get_crew_personality" "$theme_path"; then
            print_crusher "Crew function: ✅ Found"
        else
            print_worf "Crew function: ❌ Missing"
        fi
    else
        print_worf "Theme file: ❌ Not found"
        return 1
    fi
}

test_zshrc() {
    print_geordi "Testing .zshrc configuration..."
    
    if [[ -f "$ZSHRC_FILE" ]]; then
        if grep -q "alex-ai-monorepo" "$ZSHRC_FILE"; then
            print_crusher ".zshrc configuration: ✅ Found"
        else
            print_worf ".zshrc configuration: ❌ Missing"
            return 1
        fi
    else
        print_worf ".zshrc file: ❌ Not found"
        return 1
    fi
}

main() {
    echo "🧪 Alex AI Shell Plugin Test Suite v1.0.0"
    echo "========================================="
    echo ""
    
    print_picard "Initiating comprehensive test protocol..."
    echo ""
    
    local test_results=0
    
    # Run tests
    test_shell_intelligence || test_results=$((test_results + 1))
    echo ""
    
    test_plugin || test_results=$((test_results + 1))
    echo ""
    
    test_theme || test_results=$((test_results + 1))
    echo ""
    
    test_zshrc || test_results=$((test_results + 1))
    echo ""
    
    # Results
    if [[ $test_results -eq 0 ]]; then
        print_crusher "All tests passed! ✅"
        print_picard "Alex AI Shell Plugin is fully operational!"
    else
        print_worf "Some tests failed! ❌"
        print_worf "Failed tests: $test_results"
        return 1
    fi
}

# Set up paths
readonly OH_MY_ZSH_DIR="$HOME/.oh-my-zsh"
readonly ZSHRC_FILE="$HOME/.zshrc"

main "$@"
