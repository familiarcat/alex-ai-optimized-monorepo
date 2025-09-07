#!/bin/bash
# Safe status output template

safe_status() {
    local component="$1"
    local status="$2"
    local icon="$3"
    
    printf "%-20s: %s %s\n" "$component" "$icon" "$status"
}

# Usage examples:
# safe_status "API Integration" "Working" "✅"
# safe_status "Database" "Connecting" "🔄"
# safe_status "Error" "Failed" "❌"
