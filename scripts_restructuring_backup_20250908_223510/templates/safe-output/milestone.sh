#!/bin/bash
# Safe milestone output template

    local description="$2"
    
    printf "🎉 MILESTONE: %s\n" "$title"
    printf "==================================\n"
    printf "\n"
    printf "✅ %s\n" "$description"
    printf "\n"
}

# Usage:
# safe_milestone "Project Complete" "All systems operational"
