#!/bin/bash

# =============================================================================
# Alex AI Shell Enhancement Installation Script
# =============================================================================
# 
# This script installs the Alex AI monorepo shell intelligence system
# into your oh-my-zsh configuration, providing workspace awareness,
# milestone tracking, and crew personality integration.
#
# =============================================================================

set -euo pipefail

# =============================================================================
# CONFIGURATION
# =============================================================================

readonly SCRIPT_NAME="install-alex-ai-shell-enhancement"
readonly VERSION="1.0.0"

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
readonly PLUGINS_DIR="$CUSTOM_DIR/plugins"
readonly THEMES_DIR="$CUSTOM_DIR/themes"

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Print colored output
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

# Check if oh-my-zsh is installed
check_oh_my_zsh() {
    if [[ ! -d "$OH_MY_ZSH_DIR" ]]; then
        print_worf "Oh-My-Zsh not found at $OH_MY_ZSH_DIR"
        echo "Please install oh-my-zsh first: https://ohmyz.sh/"
        return 1
    fi
    return 0
}

# Check if zsh is the current shell
check_zsh_shell() {
    if [[ "$SHELL" != "/bin/zsh" ]] && [[ "$SHELL" != "/usr/bin/zsh" ]]; then
        print_worf "Current shell is $SHELL, but zsh is required"
        echo "Please change your shell to zsh: chsh -s /bin/zsh"
        return 1
    fi
    return 0
}

# Create necessary directories
create_directories() {
    print_geordi "Creating necessary directories..."
    
    mkdir -p "$PLUGINS_DIR"
    mkdir -p "$THEMES_DIR"
    
    print_geordi "Directories created successfully"
}

# Install shell intelligence script
install_shell_intelligence() {
    print_geordi "Installing shell intelligence script..."
    
    local source_script="$(dirname "$0")/alex-ai-monorepo-shell-intelligence.sh"
    local target_script="$PLUGINS_DIR/alex-ai-monorepo-shell-intelligence.sh"
    
    if [[ ! -f "$source_script" ]]; then
        print_worf "Source script not found: $source_script"
        return 1
    fi
    
    cp "$source_script" "$target_script"
    chmod +x "$target_script"
    
    print_geordi "Shell intelligence script installed successfully"
}

# Install oh-my-zsh plugin
install_plugin() {
    print_geordi "Installing oh-my-zsh plugin..."
    
    local source_plugin="$(dirname "$0")/oh-my-zsh-alex-ai-monorepo-plugin.zsh"
    local target_plugin="$PLUGINS_DIR/alex-ai-monorepo/alex-ai-monorepo.plugin.zsh"
    
    if [[ ! -f "$source_plugin" ]]; then
        print_worf "Source plugin not found: $source_plugin"
        return 1
    fi
    
    mkdir -p "$(dirname "$target_plugin")"
    cp "$source_plugin" "$target_plugin"
    
    print_geordi "Oh-my-zsh plugin installed successfully"
}

# Install custom theme
install_theme() {
    print_geordi "Installing custom theme..."
    
    local source_theme="$(dirname "$0")/alex-ai-monorepo.zsh-theme"
    local target_theme="$THEMES_DIR/alex-ai-monorepo.zsh-theme"
    
    if [[ ! -f "$source_theme" ]]; then
        print_worf "Source theme not found: $source_theme"
        return 1
    fi
    
    cp "$source_theme" "$target_theme"
    
    print_geordi "Custom theme installed successfully"
}

# Update .zshrc configuration
update_zshrc() {
    print_geordi "Updating .zshrc configuration..."
    
    # Backup existing .zshrc
    if [[ -f "$ZSHRC_FILE" ]]; then
        cp "$ZSHRC_FILE" "$ZSHRC_FILE.backup.$(date +%Y%m%d_%H%M%S)"
        print_geordi "Backup created: $ZSHRC_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Check if plugin is already in .zshrc
    if grep -q "alex-ai-monorepo" "$ZSHRC_FILE" 2>/dev/null; then
        print_geordi "Plugin already configured in .zshrc"
        return 0
    fi
    
    # Add plugin to .zshrc
    echo "" >> "$ZSHRC_FILE"
    echo "# Alex AI Monorepo Plugin" >> "$ZSHRC_FILE"
    echo "plugins+=(alex-ai-monorepo)" >> "$ZSHRC_FILE"
    echo "" >> "$ZSHRC_FILE"
    echo "# Alex AI Monorepo Theme (uncomment to use)" >> "$ZSHRC_FILE"
    echo "# ZSH_THEME=\"alex-ai-monorepo\"" >> "$ZSHRC_FILE"
    echo "" >> "$ZSHRC_FILE"
    
    print_geordi ".zshrc configuration updated successfully"
}

# Test installation
test_installation() {
    print_crusher "Testing installation..."
    
    # Test shell intelligence script
    if [[ -f "$PLUGINS_DIR/alex-ai-monorepo-shell-intelligence.sh" ]]; then
        print_crusher "Shell intelligence script: ✅ Available"
    else
        print_crusher "Shell intelligence script: ❌ Missing"
        return 1
    fi
    
    # Test plugin
    if [[ -f "$PLUGINS_DIR/alex-ai-monorepo/alex-ai-monorepo.plugin.zsh" ]]; then
        print_crusher "Oh-my-zsh plugin: ✅ Available"
    else
        print_crusher "Oh-my-zsh plugin: ❌ Missing"
        return 1
    fi
    
    # Test theme
    if [[ -f "$THEMES_DIR/alex-ai-monorepo.zsh-theme" ]]; then
        print_crusher "Custom theme: ✅ Available"
    else
        print_crusher "Custom theme: ❌ Missing"
        return 1
    fi
    
    print_crusher "Installation test: ✅ PASSED"
}

# Show usage instructions
show_usage_instructions() {
    print_picard "Installation complete! Here's how to use your enhanced shell:"
    echo ""
    echo "📋 AVAILABLE COMMANDS:"
    echo "   alex-dash     - Show full workspace dashboard"
    echo "   alex-status   - Quick workspace status"
    echo "   alex-workspace - Get current workspace"
    echo "   alex-milestone - Get latest milestone"
    echo "   alex-git      - Get git status with monorepo context"
    echo "   alex-turbo    - Get turborepo status"
    echo "   alex-health   - Get workspace health"
    echo "   alex-crew     - Get crew status"
    echo ""
    echo "🎨 THEME USAGE:"
    echo "   To use the Alex AI Monorepo theme, edit your .zshrc:"
    echo "   ZSH_THEME=\"alex-ai-monorepo\""
    echo ""
    echo "🔄 RELOAD SHELL:"
    echo "   source ~/.zshrc"
    echo "   # or restart your terminal"
    echo ""
    echo "🎯 FEATURES:"
    echo "   • Workspace awareness and detection"
    echo "   • Latest milestone tracking"
    echo "   • Turborepo integration"
    echo "   • Git status with monorepo context"
    echo "   • Crew personality integration"
    echo "   • Performance monitoring"
    echo "   • Security validation"
    echo ""
    print_picard "Make it so! Your shell is now enhanced with Alex AI monorepo intelligence."
}

# =============================================================================
# MAIN INSTALLATION FUNCTION
# =============================================================================

main() {
    echo "🚀 Alex AI Shell Enhancement Installation v$VERSION"
    echo "=================================================="
    echo ""
    
    print_picard "Initiating shell enhancement protocol..."
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    if ! check_oh_my_zsh; then
        exit 1
    fi
    
    if ! check_zsh_shell; then
        exit 1
    fi
    
    print_info "Prerequisites check: ✅ PASSED"
    echo ""
    
    # Install components
    create_directories
    install_shell_intelligence
    install_plugin
    install_theme
    update_zshrc
    
    echo ""
    
    # Test installation
    test_installation
    
    echo ""
    
    # Show usage instructions
    show_usage_instructions
}

# =============================================================================
# SCRIPT EXECUTION
# =============================================================================

# Check for help flag
if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
    echo "Alex AI Shell Enhancement Installation Script v$VERSION"
    echo "======================================================"
    echo ""
    echo "This script installs the Alex AI monorepo shell intelligence system"
    echo "into your oh-my-zsh configuration."
    echo ""
    echo "USAGE:"
    echo "   $0 [--help]"
    echo ""
    echo "FEATURES:"
    echo "   • Workspace awareness and detection"
    echo "   • Latest milestone tracking"
    echo "   • Turborepo integration"
    echo "   • Git status with monorepo context"
    echo "   • Crew personality integration"
    echo "   • Performance monitoring"
    echo "   • Security validation"
    echo ""
    echo "REQUIREMENTS:"
    echo "   • oh-my-zsh installed"
    echo "   • zsh as current shell"
    echo "   • git repository"
    echo ""
    exit 0
fi

# Run main installation
main "$@"
