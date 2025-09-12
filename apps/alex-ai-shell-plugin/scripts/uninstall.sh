#!/bin/bash

# =============================================================================
# Alex AI Shell Plugin Uninstall Script
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

main() {
    echo "🗑️ Alex AI Shell Plugin Uninstaller v1.0.0"
    echo "=========================================="
    echo ""
    
    print_picard "Initiating uninstall protocol..."
    
    # Remove plugin files
    print_geordi "Removing plugin files..."
    rm -rf "$OH_MY_ZSH_DIR/custom/plugins/alex-ai-monorepo"
    rm -f "$OH_MY_ZSH_DIR/custom/plugins/alex-ai-monorepo-shell-intelligence.sh"
    rm -f "$OH_MY_ZSH_DIR/custom/themes/alex-ai-monorepo.zsh-theme"
    
    # Remove from .zshrc
    print_geordi "Removing from .zshrc..."
    if [[ -f "$ZSHRC_FILE" ]]; then
        # Create backup
        cp "$ZSHRC_FILE" "$ZSHRC_FILE.backup.uninstall.$(date +%Y%m%d_%H%M%S)"
        
        # Remove Alex AI lines
        sed -i.bak '/# Alex AI Monorepo Plugin/,/^$/d' "$ZSHRC_FILE"
        sed -i.bak '/plugins+=(alex-ai-monorepo)/d' "$ZSHRC_FILE"
        sed -i.bak '/ZSH_THEME="alex-ai-monorepo"/d' "$ZSHRC_FILE"
        rm -f "$ZSHRC_FILE.bak"
    fi
    
    print_crusher "Uninstall complete!"
    print_picard "Alex AI Shell Plugin has been removed from your system."
    echo ""
    echo "🔄 Please reload your shell: source ~/.zshrc"
}

main "$@"
