#!/bin/bash
# Safe progress output template

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

# Usage:
# safe_progress "Database Setup" "completed"
