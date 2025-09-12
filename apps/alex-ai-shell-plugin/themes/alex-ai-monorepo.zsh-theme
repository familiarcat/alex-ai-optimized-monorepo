# =============================================================================
# Alex AI Monorepo Zsh Theme
# =============================================================================
# 
# A custom oh-my-zsh theme that integrates with Alex AI monorepo intelligence,
# providing workspace awareness, milestone tracking, and crew personality integration.
#
# =============================================================================

# =============================================================================
# THEME CONFIGURATION
# =============================================================================

# Theme name
ZSH_THEME_NAME="alex-ai-monorepo"

# Theme version
ZSH_THEME_VERSION="1.0.0"

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

# Standard colors
ZSH_ALEX_AI_RED='%F{red}'
ZSH_ALEX_AI_GREEN='%F{green}'
ZSH_ALEX_AI_YELLOW='%F{yellow}'
ZSH_ALEX_AI_BLUE='%F{blue}'
ZSH_ALEX_AI_MAGENTA='%F{magenta}'
ZSH_ALEX_AI_CYAN='%F{cyan}'
ZSH_ALEX_AI_WHITE='%F{white}'
ZSH_ALEX_AI_GRAY='%F{gray}'

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

# Check if we're in a monorepo
alex_ai_is_monorepo() {
    [[ -f "package.json" && -f "turbo.json" ]] || [[ -f "pnpm-workspace.yaml" ]] || [[ -f "lerna.json" ]]
}

# Get current workspace
alex_ai_get_workspace() {
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
        echo "unknown"
    fi
}

# Get git branch
alex_ai_get_git_branch() {
    local branch=$(git branch --show-current 2>/dev/null)
    if [[ -n "$branch" ]]; then
        echo "$branch"
    else
        echo ""
    fi
}

# Get git status
alex_ai_get_git_status() {
    local changes=$(git status --porcelain 2>/dev/null | wc -l)
    local ahead=$(git rev-list --count @{upstream}..HEAD 2>/dev/null || echo "0")
    local behind=$(git rev-list --count HEAD..@{upstream} 2>/dev/null || echo "0")
    
    local status=""
    if [[ "$changes" -gt 0 ]]; then
        status="$status$ZSH_ALEX_AI_YELLOW📝$changes$ZSH_ALEX_AI_NC"
    fi
    if [[ "$ahead" -gt 0 ]]; then
        status="$status$ZSH_ALEX_AI_GREEN⬆️$ahead$ZSH_ALEX_AI_NC"
    fi
    if [[ "$behind" -gt 0 ]]; then
        status="$status$ZSH_ALEX_AI_RED⬇️$behind$ZSH_ALEX_AI_NC"
    fi
    
    echo "$status"
}

# Get package manager
alex_ai_get_package_manager() {
    if [[ -f "pnpm-lock.yaml" ]]; then
        echo "📦 pnpm"
    elif [[ -f "package-lock.json" ]]; then
        echo "📦 npm"
    elif [[ -f "yarn.lock" ]]; then
        echo "📦 yarn"
    else
        echo ""
    fi
}

# Get turborepo status
alex_ai_get_turbo_status() {
    if [[ -f "turbo.json" ]]; then
        local tasks=$(jq -r '.pipeline | keys[]' turbo.json 2>/dev/null | wc -l)
        echo "🚀 $tasks tasks"
    else
        echo ""
    fi
}

# Get crew personality based on time
alex_ai_get_crew_personality() {
    local hour=$(date +%H)
    local crew_member=""
    local color=""
    local emoji=""
    
    case $((hour % 9)) in
        0) crew_member="Captain Picard"; color="$ZSH_ALEX_AI_PICARD_COLOR"; emoji="👨‍✈️" ;;
        1) crew_member="Commander Data"; color="$ZSH_ALEX_AI_DATA_COLOR"; emoji="🤖" ;;
        2) crew_member="Lieutenant Commander Geordi"; color="$ZSH_ALEX_AI_GEORDI_COLOR"; emoji="🔧" ;;
        3) crew_member="Lieutenant Worf"; color="$ZSH_ALEX_AI_WORF_COLOR"; emoji="🛡️" ;;
        4) crew_member="Dr. Crusher"; color="$ZSH_ALEX_AI_CRUSHER_COLOR"; emoji="🏥" ;;
        5) crew_member="Commander Riker"; color="$ZSH_ALEX_AI_RIKER_COLOR"; emoji="⚡" ;;
        6) crew_member="Counselor Troi"; color="$ZSH_ALEX_AI_TROI_COLOR"; emoji="💭" ;;
        7) crew_member="Lieutenant Uhura"; color="$ZSH_ALEX_AI_UHURA_COLOR"; emoji="📡" ;;
        8) crew_member="Quark"; color="$ZSH_ALEX_AI_QUARK_COLOR"; emoji="💰" ;;
    esac
    
    echo "$color$emoji $crew_member$ZSH_ALEX_AI_NC"
}

# Get latest milestone
alex_ai_get_milestone() {
    local milestone=$(git log --oneline --grep="MILESTONE:" -1 2>/dev/null | sed 's/.*MILESTONE: //' | head -c 30)
    if [[ -n "$milestone" ]]; then
        echo "$ZSH_ALEX_AI_UHURA_COLOR🎯 $milestone$ZSH_ALEX_AI_NC"
    else
        echo ""
    fi
}

# =============================================================================
# PROMPT COMPONENTS
# =============================================================================

# Workspace info component
alex_ai_workspace_component() {
    if alex_ai_is_monorepo; then
        local workspace=$(alex_ai_get_workspace)
        local pkg_mgr=$(alex_ai_get_package_manager)
        local turbo_status=$(alex_ai_get_turbo_status)
        
        echo "$ZSH_ALEX_AI_DATA_COLOR🏗️  $workspace$ZSH_ALEX_AI_NC"
        if [[ -n "$pkg_mgr" ]]; then
            echo "$ZSH_ALEX_AI_GEORDI_COLOR$pkg_mgr$ZSH_ALEX_AI_NC"
        fi
        if [[ -n "$turbo_status" ]]; then
            echo "$ZSH_ALEX_AI_GEORDI_COLOR$turbo_status$ZSH_ALEX_AI_NC"
        fi
    fi
}

# Git status component
alex_ai_git_component() {
    local branch=$(alex_ai_get_git_branch)
    if [[ -n "$branch" ]]; then
        local status=$(alex_ai_get_git_status)
        echo "$ZSH_ALEX_AI_RIKER_COLOR🌿 $branch$ZSH_ALEX_AI_NC $status"
    fi
}

# Crew personality component
alex_ai_crew_component() {
    echo "$(alex_ai_get_crew_personality)"
}

# Milestone component
alex_ai_milestone_component() {
    local milestone=$(alex_ai_get_milestone)
    if [[ -n "$milestone" ]]; then
        echo "$milestone"
    fi
}

# =============================================================================
# MAIN PROMPT
# =============================================================================

# Build the prompt
alex_ai_build_prompt() {
    # Clear the prompt
    PROMPT=""
    
    # Add workspace info if in monorepo
    if alex_ai_is_monorepo; then
        PROMPT+="$(alex_ai_workspace_component)"
        PROMPT+="\n"
    fi
    
    # Add git status
    local git_status=$(alex_ai_git_component)
    if [[ -n "$git_status" ]]; then
        PROMPT+="$git_status"
        PROMPT+="\n"
    fi
    
    # Add milestone info
    local milestone=$(alex_ai_milestone_component)
    if [[ -n "$milestone" ]]; then
        PROMPT+="$milestone"
        PROMPT+="\n"
    fi
    
    # Add crew personality
    PROMPT+="$(alex_ai_crew_component)"
    PROMPT+="\n"
    
    # Add the actual prompt line
    PROMPT+="$ZSH_ALEX_AI_PICARD_COLOR➜$ZSH_ALEX_AI_NC "
}

# =============================================================================
# RIGHT PROMPT
# =============================================================================

# Build the right prompt
alex_ai_build_rprompt() {
    RPROMPT=""
    
    # Add current time
    RPROMPT+="$ZSH_ALEX_AI_GRAY$(date +%H:%M)$ZSH_ALEX_AI_NC"
    
    # Add current directory (shortened)
    local dir=$(pwd | sed "s|$HOME|~|")
    if [[ ${#dir} -gt 30 ]]; then
        dir="...${dir: -27}"
    fi
    RPROMPT+=" $ZSH_ALEX_AI_CYAN$dir$ZSH_ALEX_AI_NC"
}

# =============================================================================
# INITIALIZATION
# =============================================================================

# Initialize the theme
alex_ai_init_theme() {
    # Build the prompts
    alex_ai_build_prompt
    alex_ai_build_rprompt
    
    # Set up prompt expansion
    setopt PROMPT_SUBST
    
    # Success message
    echo "$ZSH_ALEX_AI_PICARD_COLOR👨‍✈️ Captain Picard: Alex AI Monorepo theme initialized!$ZSH_ALEX_AI_NC"
    echo "$ZSH_ALEX_AI_DATA_COLOR🤖 Commander Data: Theme provides workspace awareness, milestone tracking, and crew integration$ZSH_ALEX_AI_NC"
}

# Auto-initialize
alex_ai_init_theme

# =============================================================================
# THEME INFORMATION
# =============================================================================

# Export theme info
export ZSH_THEME_NAME
export ZSH_THEME_VERSION
