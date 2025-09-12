#!/bin/bash

# =============================================================================
# Simple Monorepo Prompt Enhancement
# =============================================================================
# 
# This script adds simple monorepo status information directly to your .zshrc
# without complex plugin configurations. It shows:
# - Current workspace within monorepo
# - Git branch and status
# - Package manager
# - Simple health indicator
#
# =============================================================================

# Color codes
readonly DATA_COLOR='\033[0;36m'
readonly GEORDI_COLOR='\033[0;33m'
readonly WORF_COLOR='\033[0;31m'
readonly CRUSHER_COLOR='\033[0;35m'
readonly PICARD_COLOR='\033[0;34m'
readonly NC='\033[0m'

# Paths
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

# Get current workspace
get_workspace() {
    local current_dir=$(pwd)
    local monorepo_root=""
    
    # Find monorepo root
    local dir=$(pwd)
    while [[ "$dir" != "/" ]]; do
        if [[ -f "$dir/package.json" && -f "$dir/turbo.json" ]] || \
           [[ -f "$dir/pnpm-workspace.yaml" ]] || \
           [[ -f "$dir/lerna.json" ]]; then
            monorepo_root="$dir"
            break
        fi
        dir=$(dirname "$dir")
    done
    
    if [[ -n "$monorepo_root" ]]; then
        local relative_path=${current_dir#$monorepo_root/}
        if [[ "$relative_path" != "$current_dir" ]]; then
            echo "$relative_path"
        else
            echo "root"
        fi
    else
        echo ""
    fi
}

# Get git status
get_git_status() {
    local branch=$(git branch --show-current 2>/dev/null)
    if [[ -n "$branch" ]]; then
        local changes=$(git status --porcelain 2>/dev/null | wc -l)
        local ahead=$(git rev-list --count @{upstream}..HEAD 2>/dev/null || echo "0")
        local behind=$(git rev-list --count HEAD..@{upstream} 2>/dev/null || echo "0")
        
        local status=""
        if [[ "$changes" -gt 0 ]]; then
            status="$status📝$changes"
        fi
        if [[ "$ahead" -gt 0 ]]; then
            status="$status⬆️$ahead"
        fi
        if [[ "$behind" -gt 0 ]]; then
            status="$status⬇️$behind"
        fi
        
        echo "🌿$branch$status"
    else
        echo ""
    fi
}

# Get package manager
get_package_manager() {
    if [[ -f "pnpm-lock.yaml" ]]; then
        echo "📦pnpm"
    elif [[ -f "package-lock.json" ]]; then
        echo "📦npm"
    elif [[ -f "yarn.lock" ]]; then
        echo "📦yarn"
    else
        echo ""
    fi
}

# Check if in monorepo
is_monorepo() {
    [[ -f "package.json" && -f "turbo.json" ]] || [[ -f "pnpm-workspace.yaml" ]] || [[ -f "lerna.json" ]]
}

# Create monorepo prompt function
create_monorepo_prompt_function() {
    cat << 'EOF'

# =============================================================================
# Alex AI Monorepo Prompt Functions
# =============================================================================

# Get current workspace
alex_workspace() {
    local current_dir=$(pwd)
    local monorepo_root=""
    
    # Find monorepo root
    local dir=$(pwd)
    while [[ "$dir" != "/" ]]; do
        if [[ -f "$dir/package.json" && -f "$dir/turbo.json" ]] || \
           [[ -f "$dir/pnpm-workspace.yaml" ]] || \
           [[ -f "$dir/lerna.json" ]]; then
            monorepo_root="$dir"
            break
        fi
        dir=$(dirname "$dir")
    done
    
    if [[ -n "$monorepo_root" ]]; then
        local relative_path=${current_dir#$monorepo_root/}
        if [[ "$relative_path" != "$current_dir" ]]; then
            echo "$relative_path"
        else
            echo "root"
        fi
    else
        echo ""
    fi
}

# Get git status
alex_git_status() {
    local branch=$(git branch --show-current 2>/dev/null)
    if [[ -n "$branch" ]]; then
        local changes=$(git status --porcelain 2>/dev/null | wc -l)
        local ahead=$(git rev-list --count @{upstream}..HEAD 2>/dev/null || echo "0")
        local behind=$(git rev-list --count HEAD..@{upstream} 2>/dev/null || echo "0")
        
        local status=""
        if [[ "$changes" -gt 0 ]]; then
            status="$status📝$changes"
        fi
        if [[ "$ahead" -gt 0 ]]; then
            status="$status⬆️$ahead"
        fi
        if [[ "$behind" -gt 0 ]]; then
            status="$status⬇️$behind"
        fi
        
        echo "🌿$branch$status"
    else
        echo ""
    fi
}

# Get package manager
alex_package_manager() {
    if [[ -f "pnpm-lock.yaml" ]]; then
        echo "📦pnpm"
    elif [[ -f "package-lock.json" ]]; then
        echo "📦npm"
    elif [[ -f "yarn.lock" ]]; then
        echo "📦yarn"
    else
        echo ""
    fi
}

# Check if in monorepo
alex_is_monorepo() {
    [[ -f "package.json" && -f "turbo.json" ]] || [[ -f "pnpm-workspace.yaml" ]] || [[ -f "lerna.json" ]]
}

# Monorepo status line
alex_monorepo_status() {
    if alex_is_monorepo; then
        local workspace=$(alex_workspace)
        local git_status=$(alex_git_status)
        local pkg_mgr=$(alex_package_manager)
        
        local status=""
        if [[ -n "$workspace" ]]; then
            status="$status🏗️$workspace"
        fi
        if [[ -n "$git_status" ]]; then
            status="$status $git_status"
        fi
        if [[ -n "$pkg_mgr" ]]; then
            status="$status $pkg_mgr"
        fi
        
        if [[ -n "$status" ]]; then
            echo "$status"
        fi
    fi
}

EOF
}

# Update .zshrc with simple monorepo prompt
update_zshrc_simple() {
    print_geordi "Updating .zshrc with simple monorepo prompt..."
    
    # Backup existing .zshrc
    if [[ -f "$ZSHRC_FILE" ]]; then
        cp "$ZSHRC_FILE" "$ZSHRC_FILE.backup.simple.$(date +%Y%m%d_%H%M%S)"
        print_geordi "Backup created: $ZSHRC_FILE.backup.simple.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Remove old Alex AI configuration
    sed -i.bak '/# Alex AI Monorepo/,/^$/d' "$ZSHRC_FILE" 2>/dev/null || true
    sed -i.bak '/alex_monorepo_status/d' "$ZSHRC_FILE" 2>/dev/null || true
    rm -f "$ZSHRC_FILE.bak" 2>/dev/null || true
    
    # Add monorepo functions
    create_monorepo_prompt_function >> "$ZSHRC_FILE"
    
    # Add simple prompt modification
    cat >> "$ZSHRC_FILE" << 'EOF'

# =============================================================================
# Simple Monorepo Prompt Enhancement
# =============================================================================

# Enable prompt substitution
setopt PROMPT_SUBST

# Add monorepo status to existing prompt
# This will show monorepo info above your current prompt
if [[ -n "$PROMPT" ]]; then
    # If PROMPT is already set, prepend monorepo status
    PROMPT='$(alex_monorepo_status)'$'\n'$PROMPT
else
    # If no PROMPT is set, create a simple one
    PROMPT='$(alex_monorepo_status)'$'\n''%F{blue}%~%f %# '
fi

EOF

    print_geordi ".zshrc updated with simple monorepo prompt"
}

# Test the configuration
test_simple_config() {
    print_crusher "Testing simple configuration..."
    
    # Test functions
    if grep -q "alex_monorepo_status" "$ZSHRC_FILE"; then
        print_crusher "Monorepo functions: ✅ Added"
    else
        print_worf "Monorepo functions: ❌ Missing"
        return 1
    fi
    
    if grep -q "setopt PROMPT_SUBST" "$ZSHRC_FILE"; then
        print_crusher "Prompt substitution: ✅ Enabled"
    else
        print_worf "Prompt substitution: ❌ Not enabled"
        return 1
    fi
    
    print_crusher "Simple configuration test: ✅ PASSED"
}

# Show usage instructions
show_simple_usage() {
    print_picard "Simple monorepo prompt setup complete!"
    echo ""
    echo "🎯 WHAT YOU NOW HAVE:"
    echo "   • Workspace name displayed above prompt"
    echo "   • Git branch and status indicators"
    echo "   • Package manager detection"
    echo "   • Simple, non-intrusive display"
    echo ""
    echo "🔄 TO ACTIVATE:"
    echo "   source ~/.zshrc"
    echo "   # or restart your terminal"
    echo ""
    echo "📋 MANUAL COMMANDS:"
    echo "   alex_workspace        - Get current workspace"
    echo "   alex_git_status       - Get git status"
    echo "   alex_package_manager  - Get package manager"
    echo "   alex_monorepo_status  - Get full status line"
    echo ""
    print_picard "Your shell will now show monorepo status above the prompt!"
}

# Main function
main() {
    echo "🎯 Simple Monorepo Prompt Setup v1.0.0"
    echo "======================================"
    echo ""
    
    print_picard "Initiating simple monorepo prompt setup..."
    
    # Update configuration
    update_zshrc_simple
    
    echo ""
    
    # Test configuration
    test_simple_config
    
    echo ""
    
    # Show usage instructions
    show_simple_usage
}

# Run main function
main "$@"
