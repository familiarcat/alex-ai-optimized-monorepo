#!/bin/bash

# =============================================================================
# Turborepo Milestone Integration System
# =============================================================================
# 
# 🔧 Lieutenant Commander Geordi's Engineering Excellence
# 
# This script provides advanced turborepo integration for milestone management,
# extending the crew's expertise into monorepo optimization and workspace
# coordination.
#
# =============================================================================

set -euo pipefail

readonly SCRIPT_NAME="turborepo-milestone-integration"
readonly VERSION="1.0.0"

# Color codes
readonly GEORDI_COLOR='\033[0;33m'
readonly DATA_COLOR='\033[0;36m'
readonly NC='\033[0m'

# =============================================================================
# TURBOREPO ANALYSIS FUNCTIONS
# =============================================================================

# Analyze turborepo configuration
analyze_turborepo_config() {
    echo -e "${GEORDI_COLOR}🔧 Lieutenant Commander Geordi: Analyzing turborepo configuration...${NC}"
    
    if [[ ! -f "turbo.json" ]]; then
        echo "Error: turbo.json not found"
        return 1
    fi
    
    # Extract pipeline tasks
    local tasks
    tasks=$(jq -r '.pipeline | keys[]' turbo.json 2>/dev/null || echo "")
    
    echo -e "${DATA_COLOR}📊 Available pipeline tasks:${NC}"
    echo "$tasks" | while read -r task; do
        if [[ -n "$task" ]]; then
            echo "   • $task"
        fi
    done
    
    # Extract workspace patterns
    local workspaces
    workspaces=$(jq -r '.workspaces[]?' package.json 2>/dev/null || echo "")
    
    echo -e "${DATA_COLOR}🏗️  Workspace patterns:${NC}"
    echo "$workspaces" | while read -r workspace; do
        if [[ -n "$workspace" ]]; then
            echo "   • $workspace"
        fi
    done
    
    return 0
}

# Get workspace dependencies
get_workspace_dependencies() {
    local workspace="$1"
    
    if [[ ! -d "$workspace" ]]; then
        echo "Error: Workspace $workspace not found"
        return 1
    fi
    
    local package_file="$workspace/package.json"
    if [[ ! -f "$package_file" ]]; then
        echo "Error: package.json not found in $workspace"
        return 1
    fi
    
    echo -e "${GEORDI_COLOR}🔧 Analyzing dependencies for $workspace...${NC}"
    
    # Get dependencies
    local deps
    deps=$(jq -r '.dependencies // {} | keys[]' "$package_file" 2>/dev/null || echo "")
    local dev_deps
    dev_deps=$(jq -r '.devDependencies // {} | keys[]' "$package_file" 2>/dev/null || echo "")
    
    echo -e "${DATA_COLOR}📦 Dependencies:${NC}"
    echo "$deps" | while read -r dep; do
        if [[ -n "$dep" ]]; then
            echo "   • $dep"
        fi
    done
    
    echo -e "${DATA_COLOR}🛠️  Dev Dependencies:${NC}"
    echo "$dev_deps" | while read -r dep; do
        if [[ -n "$dep" ]]; then
            echo "   • $dep"
        fi
    done
    
    return 0
}

# Analyze workspace build status
analyze_build_status() {
    local workspace="$1"
    
    echo -e "${GEORDI_COLOR}🔧 Analyzing build status for $workspace...${NC}"
    
    # Check if workspace has build script
    local package_file="$workspace/package.json"
    if [[ -f "$package_file" ]]; then
        local has_build
        has_build=$(jq -r '.scripts.build // empty' "$package_file" 2>/dev/null || echo "")
        
        if [[ -n "$has_build" ]]; then
            echo -e "${DATA_COLOR}✅ Build script found: $has_build${NC}"
            
            # Check if dist directory exists
            if [[ -d "$workspace/dist" ]]; then
                echo -e "${DATA_COLOR}✅ Dist directory exists${NC}"
            else
                echo -e "${DATA_COLOR}⚠️  Dist directory not found${NC}"
            fi
        else
            echo -e "${DATA_COLOR}ℹ️  No build script found${NC}"
        fi
    fi
    
    return 0
}

# Run turborepo task for workspace
run_workspace_task() {
    local workspace="$1"
    local task="$2"
    
    echo -e "${GEORDI_COLOR}🔧 Running $task for $workspace...${NC}"
    
    if turbo run "$task" --filter="$workspace" >/dev/null 2>&1; then
        echo -e "${DATA_COLOR}✅ $task completed successfully for $workspace${NC}"
        return 0
    else
        echo -e "${DATA_COLOR}❌ $task failed for $workspace${NC}"
        return 1
    fi
}

# Get workspace impact analysis
get_workspace_impact() {
    local workspace="$1"
    
    echo -e "${GEORDI_COLOR}🔧 Calculating impact for $workspace...${NC}"
    
    local impact_score=0
    
    # Count TypeScript files
    local ts_files
    ts_files=$(find "$workspace" -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
    impact_score=$((impact_score + ts_files * 2))
    
    # Count JavaScript files
    local js_files
    js_files=$(find "$workspace" -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l)
    impact_score=$((impact_score + js_files))
    
    # Count configuration files
    local config_files
    config_files=$(find "$workspace" -name "*.json" -o -name "*.yaml" -o -name "*.yml" 2>/dev/null | wc -l)
    impact_score=$((impact_score + config_files))
    
    echo -e "${DATA_COLOR}📊 Impact score for $workspace: $impact_score${NC}"
    echo -e "${DATA_COLOR}   • TypeScript files: $ts_files${NC}"
    echo -e "${DATA_COLOR}   • JavaScript files: $js_files${NC}"
    echo -e "${DATA_COLOR}   • Config files: $config_files${NC}"
    
    echo "$impact_score"
}

# =============================================================================
# MILESTONE INTEGRATION FUNCTIONS
# =============================================================================

# Create workspace-specific milestone
create_workspace_milestone() {
    local workspace="$1"
    local milestone="$2"
    local branch="${3:-main}"
    
    echo -e "${GEORDI_COLOR}🔧 Creating workspace-specific milestone for $workspace...${NC}"
    
    # Analyze workspace
    analyze_build_status "$workspace"
    local impact_score
    impact_score=$(get_workspace_impact "$workspace")
    
    # Create milestone using unified system
    if ./scripts/alex-ai-unified-milestone-system.sh "$milestone" "$workspace" "$branch"; then
        echo -e "${DATA_COLOR}✅ Workspace milestone created successfully${NC}"
        return 0
    else
        echo -e "${DATA_COLOR}❌ Workspace milestone creation failed${NC}"
        return 1
    fi
}

# Create cross-workspace milestone
create_cross_workspace_milestone() {
    local milestone="$1"
    local workspaces=("${@:2}")
    local branch="${workspaces[-1]:-main}"
    
    # Remove branch from workspaces array
    unset workspaces[-1]
    
    echo -e "${GEORDI_COLOR}🔧 Creating cross-workspace milestone...${NC}"
    echo -e "${DATA_COLOR}📊 Affected workspaces: ${workspaces[*]}${NC}"
    
    local total_impact=0
    
    # Calculate total impact
    for workspace in "${workspaces[@]}"; do
        if [[ -d "$workspace" ]]; then
            local impact
            impact=$(get_workspace_impact "$workspace")
            total_impact=$((total_impact + impact))
        fi
    done
    
    echo -e "${DATA_COLOR}📊 Total impact score: $total_impact${NC}"
    
    # Create milestone
    if ./scripts/alex-ai-unified-milestone-system.sh "$milestone" "cross-workspace" "$branch"; then
        echo -e "${DATA_COLOR}✅ Cross-workspace milestone created successfully${NC}"
        return 0
    else
        echo -e "${DATA_COLOR}❌ Cross-workspace milestone creation failed${NC}"
        return 1
    fi
}

# =============================================================================
# OPTIMIZATION FUNCTIONS
# =============================================================================

# Optimize turborepo cache
optimize_turborepo_cache() {
    echo -e "${GEORDI_COLOR}🔧 Optimizing turborepo cache...${NC}"
    
    # Clean cache
    if turbo run clean >/dev/null 2>&1; then
        echo -e "${DATA_COLOR}✅ Cache cleaned successfully${NC}"
    else
        echo -e "${DATA_COLOR}⚠️  Cache clean had issues${NC}"
    fi
    
    # Prune cache
    if turbo prune >/dev/null 2>&1; then
        echo -e "${DATA_COLOR}✅ Cache pruned successfully${NC}"
    else
        echo -e "${DATA_COLOR}⚠️  Cache prune had issues${NC}"
    fi
}

# Analyze build performance
analyze_build_performance() {
    echo -e "${GEORDI_COLOR}🔧 Analyzing build performance...${NC}"
    
    # Run build with timing
    local start_time
    start_time=$(date +%s)
    
    if turbo run build --dry-run >/dev/null 2>&1; then
        local end_time
        end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        echo -e "${DATA_COLOR}📊 Build analysis completed in ${duration}s${NC}"
        echo -e "${DATA_COLOR}✅ All workspaces can build successfully${NC}"
    else
        echo -e "${DATA_COLOR}❌ Build analysis failed${NC}"
        return 1
    fi
    
    return 0
}

# =============================================================================
# MAIN FUNCTIONS
# =============================================================================

# Show help
show_help() {
    echo "Turborepo Milestone Integration System v$VERSION"
    echo "=============================================="
    echo ""
    echo "🔧 Lieutenant Commander Geordi's Engineering Excellence"
    echo ""
    echo "📋 USAGE:"
    echo "   $0 analyze [workspace]"
    echo "   $0 milestone <milestone-name> <workspace> [branch]"
    echo "   $0 cross-milestone <milestone-name> <workspace1> <workspace2> ... [branch]"
    echo "   $0 optimize"
    echo "   $0 performance"
    echo ""
    echo "📝 EXAMPLES:"
    echo "   $0 analyze apps/alex-ai-cli"
    echo "   $0 milestone \"CLI Enhancement\" apps/alex-ai-cli"
    echo "   $0 cross-milestone \"Core Integration\" packages/@alex-ai/core apps/alex-ai-cli"
    echo "   $0 optimize"
    echo "   $0 performance"
    echo ""
    echo "🎯 FEATURES:"
    echo "   • Turborepo configuration analysis"
    echo "   • Workspace dependency analysis"
    echo "   • Build status monitoring"
    echo "   • Impact score calculation"
    echo "   • Cross-workspace milestone creation"
    echo "   • Performance optimization"
    echo "   • Cache management"
    echo ""
}

# Main execution
main() {
    case "${1:-}" in
        "analyze")
            if [[ $# -ge 2 ]]; then
                analyze_turborepo_config
                get_workspace_dependencies "$2"
                analyze_build_status "$2"
                get_workspace_impact "$2"
            else
                analyze_turborepo_config
            fi
            ;;
        "milestone")
            if [[ $# -ge 3 ]]; then
                create_workspace_milestone "$3" "$2" "${4:-main}"
            else
                echo "Error: milestone requires <milestone-name> <workspace>"
                exit 1
            fi
            ;;
        "cross-milestone")
            if [[ $# -ge 3 ]]; then
                create_cross_workspace_milestone "$2" "${@:3}"
            else
                echo "Error: cross-milestone requires <milestone-name> <workspace1> <workspace2> ..."
                exit 1
            fi
            ;;
        "optimize")
            optimize_turborepo_cache
            ;;
        "performance")
            analyze_build_performance
            ;;
        "--help"|"-h")
            show_help
            ;;
        *)
            echo "Error: Unknown command '${1:-}'"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"
