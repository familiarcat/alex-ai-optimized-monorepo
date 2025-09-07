#!/bin/bash

# Alex AI Git Remote Setup Script
# Helps set up remote repository for pushing milestone

echo "🚀 ALEX AI GIT REMOTE SETUP"
echo "============================"
echo ""

# Check current git status
echo "📊 Current Git Status:"
git status --short
echo ""

# Check if remote exists
if git remote -v | grep -q origin; then
    echo "✅ Remote 'origin' already configured:"
    git remote -v
    echo ""
    echo "🔄 Ready to push! Run:"
    echo "   git push origin alex-ai-job-search-app"
else
    echo "❌ No remote repository configured"
    echo ""
    echo "🔧 To set up remote repository:"
    echo ""
    echo "Option 1 - If you have a GitHub repository:"
    echo "   git remote add origin https://github.com/pbradygeorgen/musician-show-tour-app.git"
    echo "   git push -u origin alex-ai-job-search-app"
    echo ""
    echo "Option 2 - Create new GitHub repository:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Repository name: musician-show-tour-app"
    echo "   3. Description: Alex AI Superagent System for Musician Show and Tour Management"
    echo "   4. Don't initialize with README"
    echo "   5. Click 'Create repository'"
    echo "   6. Copy the commands GitHub shows you"
    echo ""
    echo "Option 3 - Use this script with repository URL:"
    echo "   ./setup-git-remote.sh https://github.com/pbradygeorgen/musician-show-tour-app.git"
fi

# If URL provided as argument, set it up
if [ $# -eq 1 ]; then
    REPO_URL=$1
    echo ""
    echo "🔧 Setting up remote with provided URL: $REPO_URL"
    git remote add origin $REPO_URL
    echo "✅ Remote added successfully!"
    echo ""
    echo "🚀 Pushing to remote repository..."
    git push -u origin alex-ai-job-search-app
    echo ""
    echo "🎉 Push completed!"
fi

echo ""
echo "📋 Current branch: $(git branch --show-current)"
echo "📊 Commit count: $(git rev-list --count HEAD)"
echo "🏷️  Latest commit: $(git log -1 --oneline)"
