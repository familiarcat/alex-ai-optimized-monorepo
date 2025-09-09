#!/bin/bash
# Safe command execution system for Alex AI

# Function to safely execute commands
    local description="$2"
    
    printf "🔄 Executing: %s\n" "$description"
    
    # Validate command for string issues
    if echo "$command" | grep -q 'echo.*".*$' && echo "$command" | grep -A1 'echo.*".*$' | grep -q 'echo'; then
        printf "⚠️  Detected potential string issue - using safe alternative\n"
        # Convert to safe format
        local safe_command=$(echo "$command" | sed 's/echo "/printf "%s\\n" "/g')
        eval "$safe_command"
    else
        eval "$command"
    fi
    
    if [ $? -eq 0 ]; then
        printf "✅ Success: %s\n" "$description"
    else
        printf "❌ Failed: %s\n" "$description"
        return 1
    fi
}

# Function to safely output status
safe_status() {
    local component="$1"
    local status="$2"
    local icon="$3"
    
    printf "%-20s: %s %s\n" "$component" "$icon" "$status"
}

# Function to safely output milestone
safe_milestone() {
    local title="$1"
    local description="$2"
    
    printf "🎉 MILESTONE: %s\n" "$title"
    printf "==================================\n"
    printf "\n"
    printf "✅ %s\n" "$description"
    printf "\n"
}

# Function to safely output progress
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

# Function to safely output list
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

# Export functions for use in other scripts
export -f safe_execute
export -f safe_status
export -f safe_milestone
export -f safe_progress
export -f safe_list



# Merged functionality:

# From master-safe-execute.sh:
#!/bin/bash

# Master Safe Execution Script for Alex AI
# Provides all safe string manipulation functions

set -e

# Safe output function
}

# Safe status function
    local status="$2"
    local icon="$3"
    printf "%-20s: %s %s\n" "$component" "$icon" "$status"
}

# Safe milestone function
    local description="$2"
    printf "🎉 MILESTONE: %s\n" "$title"
    printf "==================================\n"
    printf "\n"
    printf "✅ %s\n" "$description"
    printf "\n"
}

# Safe progress function
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
    safe_status "Safe Functions" "Available" "✅"
    safe_progress "Script Loading" "completed"
}

# Run main function
main "$@"

