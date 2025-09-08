#!/bin/bash

# Safe Milestone Push Script
# Handles quotes and special characters properly to avoid shell errors

set -e  # Exit on any error

# Function to safely escape quotes in commit messages
escape_quotes() {
    local message="$1"
    # Escape double quotes and backslashes
    echo "$message" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g'
}

# Function to create a safe commit message
create_safe_commit_message() {
    local milestone="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Use single quotes to avoid shell interpretation issues
    echo "🎉 MILESTONE: $milestone - $timestamp"
}

# Function to safely add and commit files
safe_commit() {
    local milestone="$1"
    local files="${2:-.}"
    
    echo "📝 Adding files to git..."
    git add $files
    
    echo "💾 Creating commit with safe message..."
    local commit_msg=$(create_safe_commit_message "$milestone")
    
    # Use printf to avoid shell interpretation of special characters
    printf '%s\n' "$commit_msg" | git commit -F -
    
    echo "✅ Commit created successfully"
}

# Function to safely push to remote
safe_push() {
    local branch="${1:-main}"
    
    echo "🚀 Pushing to origin/$branch..."
    git push origin "$branch"
    
    echo "✅ Push completed successfully"
}

# Main milestone push function
milestone_push() {
    local milestone="$1"
    local files="${2:-.}"
    local branch="${3:-main}"
    
    if [ -z "$milestone" ]; then
        echo "❌ Error: Milestone name is required"
        echo "Usage: $0 <milestone_name> [files] [branch]"
        exit 1
    fi
    
    echo "🎯 Starting safe milestone push for: $milestone"
    echo "📁 Files: $files"
    echo "🌿 Branch: $branch"
    echo ""
    
    # Check git status
    echo "📊 Checking git status..."
    git status --porcelain
    
    # Create safe commit
    safe_commit "$milestone" "$files"
    
    # Push to remote
    safe_push "$branch"
    
    echo ""
    echo "🎉 Milestone push completed successfully!"
    echo "📋 Milestone: $milestone"
    echo "⏰ Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
}

# Check if script is being sourced or executed
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    # Script is being executed directly
    milestone_push "$@"
else
    # Script is being sourced, export functions
    export -f milestone_push safe_commit safe_push create_safe_commit_message escape_quotes
fi