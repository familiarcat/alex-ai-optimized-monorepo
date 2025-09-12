#!/bin/bash

# =============================================================================
# Alex AI Universal Shell Error Recovery System
# =============================================================================
# 
# This script provides universal error recovery for shell interactions
# to prevent cmdand, dquote, and other shell errors from blocking LLM prompts
#
# =============================================================================

# Color codes
readonly DATA_COLOR='\033[0;36m'
readonly GEORDI_COLOR='\033[0;33m'
readonly PICARD_COLOR='\033[0;34m'
readonly WORF_COLOR='\033[0;31m'
readonly NC='\033[0m'

print_info() {
    echo -e "${DATA_COLOR}🤖 Commander Data: $1${NC}"
}

print_geordi() {
    echo -e "${GEORDI_COLOR}🔧 Lieutenant Commander Geordi: $1${NC}"
}

print_picard() {
    echo -e "${PICARD_COLOR}👨‍✈️ Captain Picard: $1${NC}"
}

print_worf() {
    echo -e "${WORF_COLOR}🛡️ Lieutenant Worf: $1${NC}"
}

# Universal shell error recovery function
alex_shell_recovery() {
    print_worf "Initiating shell error recovery protocol..."
    
    # Kill any hanging processes
    jobs -p | xargs -r kill 2>/dev/null
    
    # Reset shell state
    set +e
    set +u
    
    # Clear any incomplete command lines
    printf '\033[2K\r'
    
    # Reset prompt
    PS1='%F{blue}%~%f %# '
    PROMPT='%F{blue}%~%f %# '
    
    # Clear any unclosed quotes or command continuations
    printf '\n'
    
    print_geordi "Shell state reset complete"
}

# Safe command execution with error recovery
alex_safe_exec() {
    local cmd="$1"
    local max_retries=3
    local retry_count=0
    
    while [[ $retry_count -lt $max_retries ]]; do
        print_geordi "Executing: $cmd (attempt $((retry_count + 1)))"
        
        # Execute command with timeout and error handling
        if timeout 30 bash -c "$cmd" 2>/dev/null; then
            print_picard "Command executed successfully"
            return 0
        else
            retry_count=$((retry_count + 1))
            print_worf "Command failed, retrying... ($retry_count/$max_retries)"
            
            if [[ $retry_count -lt $max_retries ]]; then
                sleep 1
                alex_shell_recovery
            fi
        fi
    done
    
    print_worf "Command failed after $max_retries attempts"
    return 1
}

# Universal prompt fix
alex_fix_prompt() {
    print_geordi "Analyzing and fixing shell prompt configuration..."
    
    # Backup current .zshrc
    cp ~/.zshrc ~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)
    
    # Check for common prompt issues
    local issues_found=0
    
    # Check for unclosed quotes
    if grep -q '"[^"]*$' ~/.zshrc; then
        print_worf "Found unclosed quotes in .zshrc"
        issues_found=1
    fi
    
    # Check for malformed PROMPT assignments
    if grep -q 'PROMPT.*\$.*\$' ~/.zshrc; then
        print_worf "Found malformed PROMPT assignment"
        issues_found=1
    fi
    
    if [[ $issues_found -eq 1 ]]; then
        print_geordi "Fixing prompt configuration..."
        
        # Create a clean prompt configuration
        cat > /tmp/clean_prompt.zsh << 'EOF'
# Clean Alex AI Prompt Configuration
setopt PROMPT_SUBST

# Simple monorepo status display
alex_monorepo_status() {
    if [[ -f "package.json" && -f "turbo.json" ]] || [[ -f "pnpm-workspace.yaml" ]]; then
        local workspace=$(pwd | sed "s|$HOME|~|" | sed "s|.*/alex-ai-optimized-monorepo-clean/||")
        local git_branch=$(git branch --show-current 2>/dev/null)
        local changes=$(git status --porcelain 2>/dev/null | wc -l)
        
        echo "🏗️  $workspace ${git_branch:+🌿 $git_branch} ${changes:+📝$changes}"
    fi
}

# Set clean prompt
PROMPT='$(alex_monorepo_status)'$'\n''%F{blue}%~%f %# '

# Turborepo App Management Aliases
alias apps='./scripts/turbo-apps.sh list'
alias app='./scripts/turbo-apps.sh select'
alias current='./scripts/turbo-apps.sh current'
alias run='./scripts/turbo-apps.sh run'
EOF
        
        # Replace problematic prompt section
        sed -i.bak '/# Clean Alex AI Prompt Configuration/,$d' ~/.zshrc
        cat /tmp/clean_prompt.zsh >> ~/.zshrc
        rm /tmp/clean_prompt.zsh
        
        print_picard "Prompt configuration fixed"
    else
        print_info "No prompt issues detected"
    fi
}

# Universal error prevention
alex_prevent_errors() {
    print_geordi "Implementing universal error prevention measures..."
    
    # Add error handling to .zshrc
    cat >> ~/.zshrc << 'EOF'

# =============================================================================
# Alex AI Universal Error Prevention
# =============================================================================

# Prevent cmdand and dquote errors
unsetopt PROMPT_SP
setopt NO_PROMPT_SP

# Safe command execution
alex_safe_cmd() {
    local cmd="$1"
    if [[ -n "$cmd" ]]; then
        eval "$cmd" 2>/dev/null || {
            echo "Command failed: $cmd"
            return 1
        }
    fi
}

# Auto-recovery for hanging prompts
if [[ -n "$ZSH_VERSION" ]]; then
    # Zsh-specific error prevention
    setopt NO_BEEP
    setopt NO_LIST_BEEP
    unsetopt AUTO_MENU
    setopt COMPLETE_IN_WORD
fi

# Universal error recovery function
alex_recover() {
    printf '\033[2K\r'
    printf '\n'
    PS1='%F{blue}%~%f %# '
    PROMPT='%F{blue}%~%f %# '
    echo "Shell recovered - ready for commands"
}

# Emergency recovery alias
alias recover='alex_recover'
alias fix='alex_recover'

EOF
    
    print_picard "Universal error prevention measures installed"
}

# Main recovery function
main() {
    print_picard "Alex AI Universal Shell Error Recovery System"
    echo ""
    
    case "${1:-recover}" in
        "recover")
            alex_shell_recovery
            ;;
        "fix-prompt")
            alex_fix_prompt
            ;;
        "prevent")
            alex_prevent_errors
            ;;
        "safe-exec")
            shift
            alex_safe_exec "$@"
            ;;
        "full")
            alex_shell_recovery
            alex_fix_prompt
            alex_prevent_errors
            print_picard "Full recovery and prevention system deployed"
            ;;
        *)
            echo "Alex AI Shell Recovery System"
            echo "============================="
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  recover     - Immediate shell recovery"
            echo "  fix-prompt  - Fix prompt configuration"
            echo "  prevent     - Install error prevention"
            echo "  safe-exec   - Execute command safely"
            echo "  full        - Full recovery and prevention"
            echo ""
            ;;
    esac
}

# Run main function
main "$@"
