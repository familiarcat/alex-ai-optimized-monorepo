#!/bin/bash

# Master Safe Execution Script for Alex AI
# Provides all safe string manipulation functions

set -e

# Safe output function
safe_echo() {
    printf "%s\n" "$1"
}

# Safe status function
safe_status() {
    local component="$1"
    local status="$2"
    local icon="$3"
    printf "%-20s: %s %s\n" "$component" "$icon" "$status"
}

# Safe milestone function
safe_milestone() {
    local title="$1"
    local description="$2"
    printf "🎉 MILESTONE: %s\n" "$title"
    printf "==================================\n"
    printf "\n"
    printf "✅ %s\n" "$description"
    printf "\n"
}

# Safe progress function
safe_progress() {
    local step="$1"
    local status="$2"
    case "$status" in
        "completed") printf "✅ %s - COMPLETED\n" "$step" ;;
        "in_progress") printf "🔄 %s - IN PROGRESS\n" "$step" ;;
        "pending") printf "⏳ %s - PENDING\n" "$step" ;;
        "failed") printf "❌ %s - FAILED\n" "$step" ;;
        *) printf "❓ %s - UNKNOWN STATUS\n" "$step" ;;
    esac
}

# Safe list function
safe_list() {
    local title="$1"
    shift
    local items=("$@")
    printf "📋 %s\n" "$title"
    printf "========================\n"
    printf "\n"
    for item in "${items[@]}"; do
        printf "  • %s\n" "$item"
    done
    printf "\n"
}

# Safe command execution
safe_execute() {
    local command="$1"
    local description="$2"
    printf "🔄 Executing: %s\n" "$description"
    
    if eval "$command"; then
        printf "✅ Success: %s\n" "$description"
    else
        printf "❌ Failed: %s\n" "$description"
        return 1
    fi
}

# Export all functions
export -f safe_echo
export -f safe_status
export -f safe_milestone
export -f safe_progress
export -f safe_list
export -f safe_execute

# Main execution
main() {
    safe_echo "🛡️ Master Safe Execution Script Loaded"
    safe_status "Safe Functions" "Available" "✅"
    safe_progress "Script Loading" "completed"
}

# Run main function
main "$@"
