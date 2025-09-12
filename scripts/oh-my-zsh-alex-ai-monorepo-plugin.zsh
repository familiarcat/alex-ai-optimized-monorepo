# =============================================================================
# Alex AI Monorepo Oh-My-Zsh Plugin
# =============================================================================
# 
# This plugin enhances your zsh shell with monorepo intelligence, providing:
#   • Workspace awareness and detection
#   • Latest milestone tracking
#   • Turborepo integration
#   • Git status with monorepo context
#   • Crew personality integration
#   • Performance monitoring
#   • Security validation
#
# =============================================================================

# =============================================================================
# PLUGIN CONFIGURATION
# =============================================================================

# Plugin name
ZSH_ALEX_AI_MONOREPO_PLUGIN_NAME="alex-ai-monorepo"

# Plugin directory (where this file is located)
ZSH_ALEX_AI_MONOREPO_PLUGIN_DIR="${0:A:h}"

# Shell intelligence script path
ZSH_ALEX_AI_SHELL_INTELLIGENCE="$ZSH_ALEX_AI_MONOREPO_PLUGIN_DIR/alex-ai-monorepo-shell-intelligence.sh"

# =============================================================================
# COLOR DEFINITIONS
# =============================================================================

# Crew personality colors
ZSH_ALEX_AI_DATA_COLOR='%F{cyan}'
ZSH_ALEX_AI_GEORDI_COLOR='%F{yellow}'
ZSH_ALEX_AI_WORF_COLOR='%F{red}'
ZSH_ALEX_AI_CRUSHER_COLOR='%F{magenta}'
ZSH_ALEX_AI_PICARD_COLOR='%F{blue}'
ZSH_ALEX_AI_RIKER_COLOR='%F{green}'
ZSH_ALEX_AI_TROI_COLOR='%F{white}'
ZSH_ALEX_AI_UHURA_COLOR='%F{blue}'
ZSH_ALEX_AI_QUARK_COLOR='%F{yellow}'
ZSH_ALEX_AI_NC='%f'

# =============================================================================
# CORE FUNCTIONS
# =============================================================================

# Check if shell intelligence script exists
alex_ai_check_dependencies() {
    if [[ ! -f "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" ]]; then
        echo "Warning: Alex AI shell intelligence script not found at $ZSH_ALEX_AI_SHELL_INTELLIGENCE"
        return 1
    fi
    return 0
}

# Get workspace info for prompt
alex_ai_get_workspace_info() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" prompt
    else
        echo "❌ Alex AI unavailable"
    fi
}

# Get milestone info for prompt
alex_ai_get_milestone_info() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" milestone-prompt
    else
        echo "❌ Alex AI unavailable"
    fi
}

# Get crew personality for prompt
alex_ai_get_crew_prompt() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" crew-prompt
    else
        echo "❌ Alex AI unavailable"
    fi
}

# =============================================================================
# PROMPT FUNCTIONS
# =============================================================================

# Enhanced prompt with monorepo intelligence
alex_ai_prompt() {
    # Get workspace info
    local workspace_info=$(alex_ai_get_workspace_info)
    
    # Get milestone info
    local milestone_info=$(alex_ai_get_milestone_info)
    
    # Get crew personality
    local crew_prompt=$(alex_ai_get_crew_prompt)
    
    # Display in prompt
    echo ""
    echo "$ZSH_ALEX_AI_DATA_COLOR$workspace_info$ZSH_ALEX_AI_NC"
    echo "$ZSH_ALEX_AI_UHURA_COLOR$milestone_info$ZSH_ALEX_AI_NC"
    echo "$crew_prompt"
}

# Compact prompt for smaller terminals
alex_ai_prompt_compact() {
    local workspace_info=$(alex_ai_get_workspace_info)
    echo "$ZSH_ALEX_AI_DATA_COLOR$workspace_info$ZSH_ALEX_AI_NC"
}

# =============================================================================
# ALIASES AND FUNCTIONS
# =============================================================================

# Dashboard command
alex_ai_dashboard() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" dashboard
    else
        echo "Error: Alex AI shell intelligence not available"
    fi
}

# Quick status command
alex_ai_status() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" status
    else
        echo "Error: Alex AI shell intelligence not available"
    fi
}

# Workspace command
alex_ai_workspace() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" workspace
    else
        echo "Error: Alex AI shell intelligence not available"
    fi
}

# Milestone command
alex_ai_milestone() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" milestone
    else
        echo "Error: Alex AI shell intelligence not available"
    fi
}

# Git status with monorepo context
alex_ai_git() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" git
    else
        echo "Error: Alex AI shell intelligence not available"
    fi
}

# Turborepo status
alex_ai_turbo() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" turbo
    else
        echo "Error: Alex AI shell intelligence not available"
    fi
}

# Health check
alex_ai_health() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" health
    else
        echo "Error: Alex AI shell intelligence not available"
    fi
}

# Crew status
alex_ai_crew() {
    if alex_ai_check_dependencies; then
        "$ZSH_ALEX_AI_SHELL_INTELLIGENCE" crew
    else
        echo "Error: Alex AI shell intelligence not available"
    fi
}

# =============================================================================
# ALIASES
# =============================================================================

# Main aliases
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

# =============================================================================
# PROMPT INTEGRATION
# =============================================================================

# Function to add to your prompt
alex_ai_prompt_info() {
    # Check if we're in a monorepo
    if [[ -f "package.json" && -f "turbo.json" ]] || [[ -f "pnpm-workspace.yaml" ]] || [[ -f "lerna.json" ]]; then
        local workspace_info=$(alex_ai_get_workspace_info)
        echo "$ZSH_ALEX_AI_DATA_COLOR$workspace_info$ZSH_ALEX_AI_NC"
    fi
}

# =============================================================================
# COMPLETION FUNCTIONS
# =============================================================================

# Completion for alex commands
_alex_ai_completion() {
    local -a commands
    commands=(
        'dashboard:Show full workspace dashboard'
        'status:Quick workspace status'
        'workspace:Get current workspace'
        'milestone:Get latest milestone'
        'git:Get git status'
        'turbo:Get turborepo status'
        'health:Get workspace health'
        'crew:Get crew status'
    )
    
    _describe 'alex commands' commands
}

# Add completion
compdef _alex_ai_completion alex-dash alex-status alex-workspace alex-milestone alex-git alex-turbo alex-health alex-crew

# =============================================================================
# INITIALIZATION
# =============================================================================

# Initialize the plugin
alex_ai_init() {
    # Check dependencies
    if ! alex_ai_check_dependencies; then
        echo "Warning: Alex AI Monorepo plugin dependencies not found"
        return 1
    fi
    
    # Set up prompt integration
    if [[ -n "$ZSH_THEME" ]]; then
        # Add to existing prompt
        if [[ "$ZSH_THEME" == "robbyrussell" ]]; then
            # For robbyrussell theme, add to PROMPT
            PROMPT='$(alex_ai_prompt_info)'$PROMPT
        fi
    fi
    
    # Success message
    echo "$ZSH_ALEX_AI_PICARD_COLOR👨‍✈️ Captain Picard: Alex AI Monorepo plugin initialized successfully!$ZSH_ALEX_AI_NC"
    echo "$ZSH_ALEX_AI_DATA_COLOR🤖 Commander Data: Use 'alex-dash' for full dashboard or 'alex-status' for quick status$ZSH_ALEX_AI_NC"
}

# Auto-initialize if dependencies are available
if alex_ai_check_dependencies; then
    alex_ai_init
else
    echo "Alex AI Monorepo plugin: Dependencies not found, manual initialization required"
fi

# =============================================================================
# PLUGIN INFORMATION
# =============================================================================

# Plugin metadata
ZSH_ALEX_AI_MONOREPO_PLUGIN_VERSION="1.0.0"
ZSH_ALEX_AI_MONOREPO_PLUGIN_DESCRIPTION="Alex AI Monorepo Intelligence for Oh-My-Zsh"
ZSH_ALEX_AI_MONOREPO_PLUGIN_AUTHOR="Alex AI Crew"
ZSH_ALEX_AI_MONOREPO_PLUGIN_URL="https://github.com/familiarcat/alex-ai-optimized-monorepo"

# Export plugin info
export ZSH_ALEX_AI_MONOREPO_PLUGIN_NAME
export ZSH_ALEX_AI_MONOREPO_PLUGIN_VERSION
export ZSH_ALEX_AI_MONOREPO_PLUGIN_DESCRIPTION
