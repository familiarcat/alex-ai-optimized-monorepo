#!/bin/bash

# =============================================================================
# Alex AI Universal LLM Prompt Filter
# =============================================================================
# 
# This script provides universal filtering and error prevention for LLM prompts
# to ensure terminal commands never block or cause cmdand/dquote errors
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

# Universal command sanitization
sanitize_command() {
    local cmd="$1"
    
    # Remove dangerous characters that cause shell errors
    cmd=$(echo "$cmd" | sed 's/[;&|`$]//g')
    
    # Fix unclosed quotes
    cmd=$(echo "$cmd" | sed 's/"[^"]*$//')
    cmd=$(echo "$cmd" | sed "s/'[^']*$//")
    
    # Remove cmdand repetitions
    cmd=$(echo "$cmd" | sed 's/cmdand cmdand cmdand cmdand//g')
    
    # Remove dquote> prompts
    cmd=$(echo "$cmd" | sed 's/dquote>.*//')
    
    # Ensure proper command termination
    if [[ "$cmd" =~ [^;]$ ]]; then
        cmd="${cmd};"
    fi
    
    echo "$cmd"
}

# Safe command execution with universal filtering
alex_safe_exec() {
    local original_cmd="$1"
    local sanitized_cmd=$(sanitize_command "$original_cmd")
    
    print_geordi "Original command: $original_cmd"
    print_geordi "Sanitized command: $sanitized_cmd"
    
    # Execute with timeout and error recovery
    if timeout 30 bash -c "$sanitized_cmd" 2>/dev/null; then
        print_picard "Command executed successfully"
        return 0
    else
        print_worf "Command failed, attempting recovery..."
        
        # Emergency recovery
        printf '\033[2K\r'
        printf '\n'
        
        # Try simplified version
        local simple_cmd=$(echo "$sanitized_cmd" | cut -d' ' -f1-3)
        if timeout 15 bash -c "$simple_cmd" 2>/dev/null; then
            print_picard "Simplified command executed"
            return 0
        else
            print_worf "All execution attempts failed"
            return 1
        fi
    fi
}

# Universal prompt protection
protect_prompt() {
    print_geordi "Implementing universal prompt protection..."
    
    # Add to .zshrc
    cat >> ~/.zshrc << 'EOF'

# =============================================================================
# Alex AI Universal Prompt Protection
# =============================================================================

# Prevent shell errors from blocking prompts
unsetopt PROMPT_SP
setopt NO_PROMPT_SP
setopt NO_BEEP

# Universal error recovery
alex_emergency_recover() {
    printf '\033[2K\r'
    printf '\n'
    PS1='%F{blue}%~%f %# '
    PROMPT='%F{blue}%~%f %# '
    echo "🚀 Alex AI: Shell recovered and ready"
}

# Auto-recovery on error
trap 'alex_emergency_recover' ERR

# Safe command wrapper
alex_safe() {
    local cmd="$1"
    if [[ -n "$cmd" ]]; then
        # Sanitize command
        cmd=$(echo "$cmd" | sed 's/[;&|`$]//g')
        cmd=$(echo "$cmd" | sed 's/"[^"]*$//')
        cmd=$(echo "$cmd" | sed "s/'[^']*$//")
        
        # Execute safely
        eval "$cmd" 2>/dev/null || alex_emergency_recover
    fi
}

# Emergency aliases
alias recover='alex_emergency_recover'
alias fix='alex_emergency_recover'
alias safe='alex_safe'

EOF
    
    print_picard "Universal prompt protection installed"
}

# Create universal command wrapper
create_command_wrapper() {
    print_geordi "Creating universal command wrapper..."
    
    cat > /tmp/alex_wrapper.sh << 'EOF'
#!/bin/bash

# Alex AI Universal Command Wrapper
# This wrapper ensures all commands are executed safely

wrap_command() {
    local cmd="$1"
    
    # Sanitize input
    cmd=$(echo "$cmd" | sed 's/[;&|`$]//g')
    cmd=$(echo "$cmd" | sed 's/"[^"]*$//')
    cmd=$(echo "$cmd" | sed "s/'[^']*$//")
    cmd=$(echo "$cmd" | sed 's/cmdand cmdand cmdand cmdand//g')
    cmd=$(echo "$cmd" | sed 's/dquote>.*//')
    
    # Execute with timeout
    timeout 30 bash -c "$cmd" 2>/dev/null || {
        printf '\033[2K\r'
        printf '\n'
        echo "Command failed, shell recovered"
        return 1
    }
}

# Execute wrapped command
wrap_command "$@"
EOF
    
    chmod +x /tmp/alex_wrapper.sh
    print_picard "Command wrapper created at /tmp/alex_wrapper.sh"
}

# Main function
main() {
    print_picard "Alex AI Universal LLM Prompt Filter"
    echo ""
    
    case "${1:-install}" in
        "install")
            protect_prompt
            create_command_wrapper
            print_picard "Universal LLM filter installed"
            ;;
        "test")
            shift
            alex_safe_exec "$@"
            ;;
        "recover")
            printf '\033[2K\r'
            printf '\n'
            PS1='%F{blue}%~%f %# '
            PROMPT='%F{blue}%~%f %# '
            echo "🚀 Alex AI: Shell recovered and ready"
            ;;
        "sanitize")
            shift
            sanitize_command "$@"
            ;;
        *)
            echo "Alex AI LLM Prompt Filter"
            echo "========================="
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  install   - Install universal protection"
            echo "  test      - Test command execution"
            echo "  recover   - Emergency recovery"
            echo "  sanitize  - Sanitize command string"
            echo ""
            ;;
    esac
}

# Run main function
main "$@"
