# =============================================================================
# Alex AI Monorepo Enhanced Zsh Theme
# =============================================================================
# 
# A comprehensive oh-my-zsh theme that displays monorepo management system
# information directly in the shell prompt, including workspace awareness,
# milestone tracking, git status, and crew personality integration.
#
# Based on research of oh-my-zsh best practices and custom theme development
#
# =============================================================================

# =============================================================================
# THEME CONFIGURATION
# =============================================================================

# Theme name
ZSH_THEME_NAME="alex-ai-monorepo-enhanced"

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

# Get git branch with status
alex_ai_get_git_info() {
    local branch=$(git branch --show-current 2>/dev/null)
    if [[ -n "$branch" ]]; then
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
        
        echo "$ZSH_ALEX_AI_RIKER_COLOR🌿 $branch$ZSH_ALEX_AI_NC $status"
    else
        echo ""
    fi
}

# Get package manager
alex_ai_get_package_manager() {
    if [[ -f "pnpm-lock.yaml" ]]; then
        echo "$ZSH_ALEX_AI_GEORDI_COLOR📦 pnpm$ZSH_ALEX_AI_NC"
    elif [[ -f "package-lock.json" ]]; then
        echo "$ZSH_ALEX_AI_GEORDI_COLOR📦 npm$ZSH_ALEX_AI_NC"
    elif [[ -f "yarn.lock" ]]; then
        echo "$ZSH_ALEX_AI_GEORDI_COLOR📦 yarn$ZSH_ALEX_AI_NC"
    else
        echo ""
    fi
}

# Get turborepo status
alex_ai_get_turbo_status() {
    if [[ -f "turbo.json" ]]; then
        local tasks=$(jq -r '.pipeline | keys[]' turbo.json 2>/dev/null | wc -l)
        echo "$ZSH_ALEX_AI_GEORDI_COLOR🚀 $tasks tasks$ZSH_ALEX_AI_NC"
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

# Get workspace health
alex_ai_get_health() {
    local health_score=0
    local issues=()
    
    # Check if it's a monorepo
    if alex_ai_is_monorepo; then
        health_score=$((health_score + 20))
    else
        issues+=("Not a monorepo")
    fi
    
    # Check git status
    if git rev-parse --git-dir >/dev/null 2>&1; then
        health_score=$((health_score + 20))
    else
        issues+=("Not a git repo")
    fi
    
    # Check for lockfile
    if [[ -f "pnpm-lock.yaml" ]] || [[ -f "package-lock.json" ]] || [[ -f "yarn.lock" ]]; then
        health_score=$((health_score + 20))
    else
        issues+=("No lockfile")
    fi
    
    # Check for node_modules
    if [[ -d "node_modules" ]]; then
        health_score=$((health_score + 20))
    else
        issues+=("No node_modules")
    fi
    
    # Check for build artifacts
    if [[ -d "dist" ]] || [[ -d "build" ]] || [[ -d ".next" ]]; then
        health_score=$((health_score + 20))
    else
        issues+=("No build artifacts")
    fi
    
    if [[ $health_score -eq 100 ]]; then
        echo "$ZSH_ALEX_AI_GREEN✅ HEALTHY$ZSH_ALEX_AI_NC"
    elif [[ $health_score -ge 80 ]]; then
        echo "$ZSH_ALEX_AI_YELLOW⚠️  GOOD (${#issues[@]} issues)$ZSH_ALEX_AI_NC"
    elif [[ $health_score -ge 60 ]]; then
        echo "$ZSH_ALEX_AI_YELLOW🔶 FAIR (${#issues[@]} issues)$ZSH_ALEX_AI_NC"
    else
        echo "$ZSH_ALEX_AI_RED❌ POOR (${#issues[@]} issues)$ZSH_ALEX_AI_NC"
    fi
}

# =============================================================================
# PROMPT COMPONENTS
# =============================================================================

# Main prompt line with workspace info
alex_ai_build_main_prompt() {
    local prompt=""
    
    # Add workspace info if in monorepo
    if alex_ai_is_monorepo; then
        local workspace=$(alex_ai_get_workspace)
        prompt+="$ZSH_ALEX_AI_DATA_COLOR🏗️  $workspace$ZSH_ALEX_AI_NC"
        
        # Add package manager
        local pkg_mgr=$(alex_ai_get_package_manager)
        if [[ -n "$pkg_mgr" ]]; then
            prompt+=" | $pkg_mgr"
        fi
        
        # Add turborepo status
        local turbo_status=$(alex_ai_get_turbo_status)
        if [[ -n "$turbo_status" ]]; then
            prompt+=" | $turbo_status"
        fi
        
        prompt+="\n"
    fi
    
    # Add git status
    local git_info=$(alex_ai_get_git_info)
    if [[ -n "$git_info" ]]; then
        prompt+="$git_info\n"
    fi
    
    # Add milestone info
    local milestone=$(alex_ai_get_milestone)
    if [[ -n "$milestone" ]]; then
        prompt+="$milestone\n"
    fi
    
    # Add crew personality
    prompt+="$(alex_ai_get_crew_personality)\n"
    
    # Add the actual prompt line
    prompt+="$ZSH_ALEX_AI_PICARD_COLOR➜$ZSH_ALEX_AI_NC "
    
    echo "$prompt"
}

# Right prompt with additional info
alex_ai_build_right_prompt() {
    local rprompt=""
    
    # Add current time
    rprompt+="$ZSH_ALEX_AI_GRAY$(date +%H:%M)$ZSH_ALEX_AI_NC"
    
    # Add current directory (shortened)
    local dir=$(pwd | sed "s|$HOME|~|")
    if [[ ${#dir} -gt 30 ]]; then
        dir="...${dir: -27}"
    fi
    rprompt+=" $ZSH_ALEX_AI_CYAN$dir$ZSH_ALEX_AI_NC"
    
    # Add health status if in monorepo
    if alex_ai_is_monorepo; then
        local health=$(alex_ai_get_health)
        rprompt+=" $health"
    fi
    
    echo "$rprompt"
}

# =============================================================================
# MAIN PROMPT SETUP
# =============================================================================

# Set up the prompt
PROMPT='$(alex_ai_build_main_prompt)'
RPROMPT='$(alex_ai_build_right_prompt)'

# Enable prompt substitution
setopt PROMPT_SUBST

# =============================================================================
# THEME INITIALIZATION
# =============================================================================

# Initialize the theme
alex_ai_init_enhanced_theme() {
    # Success message
    echo "$ZSH_ALEX_AI_PICARD_COLOR👨‍✈️ Captain Picard: Alex AI Enhanced Monorepo theme initialized!$ZSH_ALEX_AI_NC"
    echo "$ZSH_ALEX_AI_DATA_COLOR🤖 Commander Data: Enhanced prompt displays workspace, milestone, git status, and crew integration$ZSH_ALEX_AI_NC"
    echo "$ZSH_ALEX_AI_GEORDI_COLOR🔧 Lieutenant Commander Geordi: Monorepo awareness and turborepo integration active$ZSH_ALEX_AI_NC"
}

# Auto-initialize
alex_ai_init_enhanced_theme

# =============================================================================
# THEME INFORMATION
# =============================================================================

# Export theme info
export ZSH_THEME_NAME
export ZSH_THEME_VERSION
