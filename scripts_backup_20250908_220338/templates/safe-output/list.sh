#!/bin/bash
# Safe list output template

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

# Usage:
# safe_list "Components" "API" "Database" "Frontend"
