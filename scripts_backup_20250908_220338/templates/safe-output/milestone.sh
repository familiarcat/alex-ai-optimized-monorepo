#!/bin/bash
# Safe milestone output template

safe_milestone() {
    local title="$1"
    local description="$2"
    
    printf "🎉 MILESTONE: %s\n" "$title"
    printf "==================================\n"
    printf "\n"
    printf "✅ %s\n" "$description"
    printf "\n"
}

# Usage:
# safe_milestone "Project Complete" "All systems operational"
