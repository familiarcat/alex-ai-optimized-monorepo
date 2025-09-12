#!/bin/bash

# =============================================================================
# Alex AI Enhanced Prompt Setup Script
# =============================================================================
# 
# This script sets up the enhanced shell prompt that displays monorepo
# management system information directly in the shell command line.
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
readonly OH_MY_ZSH_DIR="$HOME/.oh-my-zsh"
readonly ZSHRC_FILE="$HOME/.zshrc"
readonly CUSTOM_DIR="$OH_MY_ZSH_DIR/custom"
readonly THEMES_DIR="$CUSTOM_DIR/themes"

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

# Install enhanced theme
install_enhanced_theme() {
    print_geordi "Installing enhanced theme..."
    
    local source_theme="$(dirname "$0")/../themes/alex-ai-monorepo-enhanced.zsh-theme"
    local target_theme="$THEMES_DIR/alex-ai-monorepo-enhanced.zsh-theme"
    
    if [[ ! -f "$source_theme" ]]; then
        print_worf "Source theme not found: $source_theme"
        return 1
    fi
    
    cp "$source_theme" "$target_theme"
    print_geordi "Enhanced theme installed successfully"
}

# Update .zshrc with enhanced configuration
update_zshrc_enhanced() {
    print_geordi "Updating .zshrc with enhanced configuration..."
    
    # Backup existing .zshrc
    if [[ -f "$ZSHRC_FILE" ]]; then
        cp "$ZSHRC_FILE" "$ZSHRC_FILE.backup.enhanced.$(date +%Y%m%d_%H%M%S)"
        print_geordi "Backup created: $ZSHRC_FILE.backup.enhanced.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Remove old Alex AI configuration
    sed -i.bak '/# Alex AI Monorepo Plugin/,/^$/d' "$ZSHRC_FILE" 2>/dev/null || true
    sed -i.bak '/plugins+=(alex-ai-monorepo)/d' "$ZSHRC_FILE" 2>/dev/null || true
    sed -i.bak '/ZSH_THEME="alex-ai-monorepo"/d' "$ZSHRC_FILE" 2>/dev/null || true
    rm -f "$ZSHRC_FILE.bak" 2>/dev/null || true
    
    # Add enhanced configuration
    cat >> "$ZSHRC_FILE" << 'EOF'

# =============================================================================
# Alex AI Enhanced Monorepo Shell Configuration
# =============================================================================

# Load the Alex AI monorepo plugin
plugins+=(alex-ai-monorepo)

# Set the enhanced theme
ZSH_THEME="alex-ai-monorepo-enhanced"

# Enable prompt substitution for dynamic content
setopt PROMPT_SUBST

# Enable colors
autoload -U colors && colors

# Alex AI shell intelligence path
export ALEX_AI_SHELL_INTELLIGENCE_PATH="$HOME/.oh-my-zsh/custom/plugins/alex-ai-monorepo-shell-intelligence.sh"

# Crew rotation interval (hours)
export ALEX_AI_CREW_ROTATION_HOURS=1

# Enable/disable specific features
export ALEX_AI_ENABLE_MILESTONE_TRACKING=true
export ALEX_AI_ENABLE_HEALTH_MONITORING=true
export ALEX_AI_ENABLE_CREW_INTEGRATION=true

# Aliases for quick access
alias alex-dash='alex_ai_dashboard'
alias alex-status='alex_ai_status'
alias alex-workspace='alex_ai_workspace'
alias alex-milestone='alex_ai_milestone'
alias alex-git='alex_ai_git'
alias alex-turbo='alex_ai_turbo'
alias alex-health='alex_ai_health'
alias alex-crew='alex_ai_crew'

# Short aliases
alias ad='alex_ai_dashboard'
alias as='alex_ai_status'
alias aw='alex_ai_workspace'
alias am='alex_ai_milestone'
alias ag='alex_ai_git'
alias at='alex_ai_turbo'
alias ah='alex_ai_health'
alias ac='alex_ai_crew'

EOF

    print_geordi ".zshrc enhanced configuration updated successfully"
}

# Test enhanced configuration
test_enhanced_config() {
    print_crusher "Testing enhanced configuration..."
    
    # Test theme file
    if [[ -f "$THEMES_DIR/alex-ai-monorepo-enhanced.zsh-theme" ]]; then
        print_crusher "Enhanced theme: ✅ Found"
    else
        print_worf "Enhanced theme: ❌ Missing"
        return 1
    fi
    
    # Test .zshrc configuration
    if grep -q "alex-ai-monorepo-enhanced" "$ZSHRC_FILE"; then
        print_crusher "Enhanced .zshrc: ✅ Configured"
    else
        print_worf "Enhanced .zshrc: ❌ Not configured"
        return 1
    fi
    
    print_crusher "Enhanced configuration test: ✅ PASSED"
}

# Show usage instructions
show_enhanced_usage() {
    print_picard "Enhanced prompt setup complete! Here's what you now have:"
    echo ""
    echo "🎨 ENHANCED PROMPT FEATURES:"
    echo "   • Workspace information displayed in prompt"
    echo "   • Git status with monorepo context"
    echo "   • Latest milestone tracking"
    echo "   • Crew personality rotation"
    echo "   • Package manager detection"
    echo "   • Turborepo task status"
    echo "   • Workspace health monitoring"
    echo "   • Color-coded information display"
    echo ""
    echo "📋 AVAILABLE COMMANDS:"
    echo "   alex-dash, ad     - Full workspace dashboard"
    echo "   alex-status, as   - Quick workspace status"
    echo "   alex-workspace, aw - Current workspace"
    echo "   alex-milestone, am - Latest milestone"
    echo "   alex-git, ag      - Git status with context"
    echo "   alex-turbo, at    - Turborepo status"
    echo "   alex-health, ah   - Workspace health"
    echo "   alex-crew, ac     - Crew status"
    echo ""
    echo "🔄 RELOAD SHELL:"
    echo "   source ~/.zshrc"
    echo "   # or restart your terminal"
    echo ""
    print_picard "Your shell now displays monorepo management system information directly in the prompt!"
}

# Main function
main() {
    echo "🎨 Alex AI Enhanced Prompt Setup v1.0.0"
    echo "======================================="
    echo ""
    
    print_picard "Initiating enhanced prompt setup protocol..."
    
    # Install components
    install_enhanced_theme
    update_zshrc_enhanced
    
    echo ""
    
    # Test configuration
    test_enhanced_config
    
    echo ""
    
    # Show usage instructions
    show_enhanced_usage
}

# Run main function
main "$@"
