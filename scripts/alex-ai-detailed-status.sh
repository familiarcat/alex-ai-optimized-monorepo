#!/bin/bash

# =============================================================================
# Alex AI Detailed Status Command
# =============================================================================
# 
# Shows detailed information about git changes and monorepo status
#
# =============================================================================

# Color codes
readonly DATA_COLOR='\033[0;36m'
readonly GEORDI_COLOR='\033[0;33m'
readonly PICARD_COLOR='\033[0;34m'
readonly WORF_COLOR='\033[0;31m'
readonly CRUSHER_COLOR='\033[0;35m'
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

print_crusher() {
    echo -e "${CRUSHER_COLOR}🏥 Dr. Crusher: $1${NC}"
}

# Show detailed git status
show_detailed_status() {
    print_picard "Alex AI Detailed Status Report"
    echo ""
    
    # Current directory and branch
    print_info "Current Directory: $(pwd)"
    print_info "Git Branch: $(git branch --show-current 2>/dev/null || echo 'Not a git repository')"
    echo ""
    
    # Check if we're in a monorepo
    if [[ -f "package.json" && -f "turbo.json" ]] || [[ -f "pnpm-workspace.yaml" ]]; then
        print_geordi "Monorepo Status: ACTIVE"
        local workspace=$(pwd | sed "s|$HOME|~|" | sed "s|.*/alex-ai-optimized-monorepo-clean/||")
        print_info "Workspace: $workspace"
        echo ""
    else
        print_worf "Monorepo Status: NOT DETECTED"
        echo ""
    fi
    
    # Git status details
    print_crusher "Git Status Details:"
    echo ""
    
    # Staged changes
    local staged_files=$(git diff --cached --name-only 2>/dev/null)
    if [[ -n "$staged_files" ]]; then
        local staged_count=$(echo "$staged_files" | wc -l)
        print_geordi "📦 Staged Changes ($staged_count):"
        echo "$staged_files" | sed 's/^/  - /'
        echo ""
    fi
    
    # Modified files
    local modified_files=$(git diff --name-only 2>/dev/null)
    if [[ -n "$modified_files" ]]; then
        local modified_count=$(echo "$modified_files" | wc -l)
        print_worf "✏️ Modified Files ($modified_count):"
        echo "$modified_files" | sed 's/^/  - /'
        echo ""
    fi
    
    # Untracked files
    local untracked_files=$(git ls-files --others --exclude-standard 2>/dev/null)
    if [[ -n "$untracked_files" ]]; then
        local untracked_count=$(echo "$untracked_files" | wc -l)
        print_info "🆕 Untracked Files ($untracked_count):"
        echo "$untracked_files" | sed 's/^/  - /'
        echo ""
    fi
    
    # Summary
    local total_staged=$(git diff --cached --name-only 2>/dev/null | wc -l)
    local total_modified=$(git diff --name-only 2>/dev/null | wc -l)
    local total_untracked=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l)
    local total_changes=$((total_staged + total_modified + total_untracked))
    
    if [[ $total_changes -eq 0 ]]; then
        print_picard "✅ Working directory is clean - no changes detected"
    else
        print_geordi "📊 Summary: $total_changes total changes ($total_staged staged, $total_modified modified, $total_untracked untracked)"
    fi
    
    echo ""
    print_picard "Status report complete"
}

# Show quick status (for prompt)
show_quick_status() {
    local staged=$(git diff --cached --name-only 2>/dev/null | wc -l)
    local modified=$(git diff --name-only 2>/dev/null | wc -l)
    local untracked=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l)
    
    if [[ $staged -gt 0 || $modified -gt 0 || $untracked -gt 0 ]]; then
        echo "Changes: "
        [[ $staged -gt 0 ]] && echo -n "📦$staged "
        [[ $modified -gt 0 ]] && echo -n "✏️$modified "
        [[ $untracked -gt 0 ]] && echo -n "🆕$untracked "
        echo ""
    else
        echo "✅ Clean"
    fi
}

# Main function
main() {
    case "${1:-detailed}" in
        "detailed"|"full")
            show_detailed_status
            ;;
        "quick"|"q")
            show_quick_status
            ;;
        "help"|"--help"|"-h")
            echo "Alex AI Detailed Status Command"
            echo "==============================="
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  detailed, full  - Show detailed status report"
            echo "  quick, q        - Show quick status summary"
            echo "  help, -h        - Show this help"
            echo ""
            ;;
        *)
            show_detailed_status
            ;;
    esac
}

# Run main function
main "$@"
