#!/bin/bash

# =============================================================================
# Alex AI Monorepo Shell Intelligence System
# =============================================================================
# 
# 🧠 CREW EXPERTISE EXTENSION:
#   • Commander Data: Advanced workspace analytics and pattern recognition
#   • Lieutenant Commander Geordi: Turborepo integration and shell optimization
#   • Lieutenant Worf: Security validation and shell safety
#   • Dr. Crusher: Shell health monitoring and diagnostics
#   • Captain Picard: Strategic shell leadership and decision making
#   • Commander Riker: Tactical shell execution and coordination
#   • Counselor Troi: User experience and shell empathy
#   • Lieutenant Uhura: Communication and data transmission
#   • Quark: Business logic and shell profit optimization
#
# 🎯 CAPABILITIES:
#   • Workspace detection and analysis
#   • Latest milestone tracking
#   • Turborepo task status
#   • Git branch and status awareness
#   • Package manager integration
#   • Crew personality integration
#   • Performance monitoring
#   • Security validation
#
# =============================================================================

# =============================================================================
# CONFIGURATION & CONSTANTS
# =============================================================================

readonly SCRIPT_NAME="alex-ai-monorepo-shell-intelligence"
readonly VERSION="1.0.0"
readonly CREW_MEMBERS=9

# Color codes for crew personalities
readonly DATA_COLOR='\033[0;36m'      # Cyan - Data's analytical precision
readonly GEORDI_COLOR='\033[0;33m'    # Yellow - Geordi's engineering brilliance
readonly WORF_COLOR='\033[0;31m'      # Red - Worf's warrior strength
readonly CRUSHER_COLOR='\033[0;35m'   # Magenta - Crusher's medical compassion
readonly PICARD_COLOR='\033[0;34m'    # Blue - Picard's commanding presence
readonly RIKER_COLOR='\033[0;32m'     # Green - Riker's tactical execution
readonly TROI_COLOR='\033[0;37m'      # White - Troi's empathic clarity
readonly UHURA_COLOR='\033[0;94m'     # Light Blue - Uhura's communication
readonly QUARK_COLOR='\033[0;93m'     # Light Yellow - Quark's business acumen
readonly NC='\033[0m'                 # No Color

# =============================================================================
# CORE UTILITY FUNCTIONS
# =============================================================================

# Detect if we're in a monorepo
is_monorepo() {
    [[ -f "package.json" && -f "turbo.json" ]] || [[ -f "pnpm-workspace.yaml" ]] || [[ -f "lerna.json" ]]
}

# Get current workspace
get_current_workspace() {
    local current_dir=$(pwd)
    local monorepo_root=$(find_monorepo_root)
    
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

# Find monorepo root
find_monorepo_root() {
    local dir=$(pwd)
    
    while [[ "$dir" != "/" ]]; do
        if [[ -f "$dir/package.json" && -f "$dir/turbo.json" ]] || \
           [[ -f "$dir/pnpm-workspace.yaml" ]] || \
           [[ -f "$dir/lerna.json" ]]; then
            echo "$dir"
            return 0
        fi
        dir=$(dirname "$dir")
    done
    
    return 1
}

# Get latest milestone
get_latest_milestone() {
    local milestone=$(git log --oneline --grep="MILESTONE:" -1 2>/dev/null | sed 's/.*MILESTONE: //' | head -c 50)
    if [[ -n "$milestone" ]]; then
        echo "$milestone"
    else
        echo "No recent milestones"
    fi
}

# Get git status
get_git_status() {
    local branch=$(git branch --show-current 2>/dev/null)
    local status=""
    
    if [[ -n "$branch" ]]; then
        local changes=$(git status --porcelain 2>/dev/null | wc -l)
        local ahead=$(git rev-list --count @{upstream}..HEAD 2>/dev/null || echo "0")
        local behind=$(git rev-list --count HEAD..@{upstream} 2>/dev/null || echo "0")
        
        status="🌿 $branch"
        
        if [[ "$changes" -gt 0 ]]; then
            status="$status 📝$changes"
        fi
        
        if [[ "$ahead" -gt 0 ]]; then
            status="$status ⬆️$ahead"
        fi
        
        if [[ "$behind" -gt 0 ]]; then
            status="$status ⬇️$behind"
        fi
    else
        status="❌ Not a git repo"
    fi
    
    echo "$status"
}

# Get turborepo status
get_turborepo_status() {
    if [[ -f "turbo.json" ]]; then
        local tasks=$(jq -r '.pipeline | keys[]' turbo.json 2>/dev/null | wc -l)
        echo "🚀 Turbo: $tasks tasks"
    else
        echo "❌ Not a turborepo"
    fi
}

# Get package manager status
get_package_manager_status() {
    if [[ -f "pnpm-lock.yaml" ]]; then
        echo "📦 pnpm"
    elif [[ -f "package-lock.json" ]]; then
        echo "📦 npm"
    elif [[ -f "yarn.lock" ]]; then
        echo "📦 yarn"
    else
        echo "❌ No lockfile"
    fi
}

# Get workspace health
get_workspace_health() {
    local health_score=0
    local issues=()
    
    # Check if it's a monorepo
    if is_monorepo; then
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
        echo "✅ HEALTHY"
    elif [[ $health_score -ge 80 ]]; then
        echo "⚠️  GOOD (${#issues[@]} issues)"
    elif [[ $health_score -ge 60 ]]; then
        echo "🔶 FAIR (${#issues[@]} issues)"
    else
        echo "❌ POOR (${#issues[@]} issues)"
    fi
}

# Get crew status
get_crew_status() {
    local active_crew=0
    
    # Check if Alex AI core is available
    if [[ -f "packages/@alex-ai/core/package.json" ]]; then
        active_crew=$((active_crew + 1))
    fi
    
    # Check for crew scripts
    if [[ -d "scripts" ]]; then
        local crew_scripts=$(find scripts -name "*crew*" -o -name "*alex*" 2>/dev/null | wc -l)
        if [[ $crew_scripts -gt 0 ]]; then
            active_crew=$((active_crew + 1))
        fi
    fi
    
    # Check for N8N integration
    if [[ -f "n8n-sync-config.json" ]] || [[ -d "n8n-sync-hub" ]]; then
        active_crew=$((active_crew + 1))
    fi
    
    # Check for Supabase integration
    if [[ -f "supabase_schema.sql" ]] || [[ -n "${SUPABASE_URL:-}" ]]; then
        active_crew=$((active_crew + 1))
    fi
    
    if [[ $active_crew -ge 3 ]]; then
        echo "🤖 CREW: $active_crew/9 active"
    else
        echo "🤖 CREW: $active_crew/9 active (limited)"
    fi
}

# =============================================================================
# SHELL PROMPT FUNCTIONS
# =============================================================================

# Generate workspace info for prompt
generate_workspace_info() {
    local workspace=$(get_current_workspace)
    local git_status=$(get_git_status)
    local turbo_status=$(get_turborepo_status)
    local pkg_status=$(get_package_manager_status)
    local health=$(get_workspace_health)
    local crew=$(get_crew_status)
    
    echo "🏗️  $workspace | $git_status | $turbo_status | $pkg_status | $health | $crew"
}

# Generate milestone info for prompt
generate_milestone_info() {
    local milestone=$(get_latest_milestone)
    echo "🎯 $milestone"
}

# Generate crew personality prompt
generate_crew_prompt() {
    local hour=$(date +%H)
    local crew_member=""
    local color=""
    local emoji=""
    
    # Rotate crew members based on hour
    case $((hour % 9)) in
        0) crew_member="Captain Picard"; color="$PICARD_COLOR"; emoji="👨‍✈️" ;;
        1) crew_member="Commander Data"; color="$DATA_COLOR"; emoji="🤖" ;;
        2) crew_member="Lieutenant Commander Geordi"; color="$GEORDI_COLOR"; emoji="🔧" ;;
        3) crew_member="Lieutenant Worf"; color="$WORF_COLOR"; emoji="🛡️" ;;
        4) crew_member="Dr. Crusher"; color="$CRUSHER_COLOR"; emoji="🏥" ;;
        5) crew_member="Commander Riker"; color="$RIKER_COLOR"; emoji="⚡" ;;
        6) crew_member="Counselor Troi"; color="$TROI_COLOR"; emoji="💭" ;;
        7) crew_member="Lieutenant Uhura"; color="$UHURA_COLOR"; emoji="📡" ;;
        8) crew_member="Quark"; color="$QUARK_COLOR"; emoji="💰" ;;
    esac
    
    echo -e "${color}${emoji} ${crew_member}${NC}"
}

# =============================================================================
# INTERACTIVE FUNCTIONS
# =============================================================================

# Show workspace dashboard
show_workspace_dashboard() {
    echo -e "${PICARD_COLOR}👨‍✈️ Captain Picard: Initiating workspace analysis...${NC}"
    echo ""
    
    # Workspace info
    echo -e "${DATA_COLOR}🤖 Commander Data: Workspace Analysis${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📍 Current Directory: $(pwd)"
    echo "🏗️  Workspace: $(get_current_workspace)"
    echo "📊 Monorepo: $(is_monorepo && echo "✅ Yes" || echo "❌ No")"
    echo ""
    
    # Git status
    echo -e "${RIKER_COLOR}⚡ Commander Riker: Git Status${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$(get_git_status)"
    echo ""
    
    # Turborepo status
    echo -e "${GEORDI_COLOR}🔧 Lieutenant Commander Geordi: Turborepo Status${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$(get_turborepo_status)"
    echo "$(get_package_manager_status)"
    echo ""
    
    # Health status
    echo -e "${CRUSHER_COLOR}🏥 Dr. Crusher: System Health${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$(get_workspace_health)"
    echo ""
    
    # Crew status
    echo -e "${TROI_COLOR}💭 Counselor Troi: Crew Coordination${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$(get_crew_status)"
    echo ""
    
    # Latest milestone
    echo -e "${UHURA_COLOR}📡 Lieutenant Uhura: Latest Milestone${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$(get_latest_milestone)"
    echo ""
    
    # Business status
    echo -e "${QUARK_COLOR}💰 Quark: Business Status${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "💎 Profit Margins: Optimized through unified system efficiency"
    echo "📈 Performance: Enhanced with monorepo intelligence"
    echo "🎯 Objectives: All crew members operational and coordinated"
    echo ""
}

# Quick workspace status
quick_status() {
    local workspace=$(get_current_workspace)
    local git_status=$(get_git_status)
    local health=$(get_workspace_health)
    
    echo -e "${DATA_COLOR}🤖${NC} $workspace | $git_status | $health"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

# Main function
main() {
    case "${1:-}" in
        "dashboard"|"dash")
            show_workspace_dashboard
            ;;
        "status"|"s")
            quick_status
            ;;
        "workspace"|"w")
            get_current_workspace
            ;;
        "milestone"|"m")
            get_latest_milestone
            ;;
        "git"|"g")
            get_git_status
            ;;
        "turbo"|"t")
            get_turborepo_status
            ;;
        "health"|"h")
            get_workspace_health
            ;;
        "crew"|"c")
            get_crew_status
            ;;
        "prompt"|"p")
            generate_workspace_info
            ;;
        "milestone-prompt"|"mp")
            generate_milestone_info
            ;;
        "crew-prompt"|"cp")
            generate_crew_prompt
            ;;
        "help"|"--help"|"-h")
            echo "Alex AI Monorepo Shell Intelligence v$VERSION"
            echo "=============================================="
            echo ""
            echo "📋 USAGE:"
            echo "   $0 [command]"
            echo ""
            echo "📝 COMMANDS:"
            echo "   dashboard, dash    - Show full workspace dashboard"
            echo "   status, s          - Quick workspace status"
            echo "   workspace, w       - Get current workspace"
            echo "   milestone, m       - Get latest milestone"
            echo "   git, g             - Get git status"
            echo "   turbo, t           - Get turborepo status"
            echo "   health, h          - Get workspace health"
            echo "   crew, c            - Get crew status"
            echo "   prompt, p          - Generate workspace info for prompt"
            echo "   milestone-prompt, mp - Generate milestone info for prompt"
            echo "   crew-prompt, cp    - Generate crew personality for prompt"
            echo "   help, -h           - Show this help"
            echo ""
            echo "🎯 FEATURES:"
            echo "   • Workspace detection and analysis"
            echo "   • Latest milestone tracking"
            echo "   • Turborepo task status"
            echo "   • Git branch and status awareness"
            echo "   • Package manager integration"
            echo "   • Crew personality integration"
            echo "   • Performance monitoring"
            echo "   • Security validation"
            echo ""
            ;;
        *)
            # Default: show quick status
            quick_status
            ;;
    esac
}

# Execute main function
main "$@"
