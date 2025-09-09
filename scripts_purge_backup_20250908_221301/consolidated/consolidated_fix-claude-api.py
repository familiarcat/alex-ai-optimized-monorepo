#!/usr/bin/env python3
"""
Consolidated Script: fix-claude-api
================================

This script consolidates the following similar scripts:
- ./scripts/deployment/api_integration/consolidated_api_integration.py
- ./alexai-base-package/fix-claude-api.sh

Generated: 2025-09-06 20:27:37
"""

#!/bin/bash

# Quick fix script to extract the correct Claude API key
# This attempts to extract a valid key from your current malformed one

echo "🔧 Alex AI Claude API Key Quick Fix"
echo "===================================="

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not found in environment"
    exit 1
fi

echo "📊 Analyzing current key..."
echo "Length: ${#ANTHROPIC_API_KEY} characters"

# Try to extract the first valid-looking key
# Look for the pattern: sk-ant-api03-[alphanumeric characters]
FIRST_KEY=$(echo "$ANTHROPIC_API_KEY" | grep -o 'sk-ant-api03-[A-Za-z0-9_-]*' | head -1)

if [ -n "$FIRST_KEY" ]; then
    echo "✅ Found potential valid key:"
    echo "   ${FIRST_KEY:0:20}...${FIRST_KEY: -10}"
    echo "   Length: ${#FIRST_KEY} characters"
    
    if [ ${#FIRST_KEY} -ge 80 ] && [ ${#FIRST_KEY} -le 120 ]; then
        echo ""
        echo "🎯 This looks like a valid API key format!"
        echo "   To use this key, run:"
        echo "   export ANTHROPIC_API_KEY=\"$FIRST_KEY\""
        echo "   export CLAUDE_API_KEY=\"$FIRST_KEY\""
        echo ""
        echo "🧪 Test the key with:"
        echo "   curl -X POST 'https://api.anthropic.com/v1/messages' \\"
        echo "     -H 'x-api-key: $FIRST_KEY' \\"
        echo "     -H 'anthropic-version: 2023-06-01' \\"
        echo "     -H 'content-type: application/json' \\"
        echo "     -d '{\"model\": \"claude-3-5-sonnet-20241022\", \"max_tokens\": 50, \"messages\": [{\"role\": \"user\", \"content\": \"Test\"}]}'"
    else
        echo "⚠️  Key length (${#FIRST_KEY}) is outside expected range (80-120)"
        echo "   Recommend generating a new key from Anthropic Console"
    fi
else
    echo "❌ Could not extract a valid-looking API key"
    echo "   Recommend generating a new key from Anthropic Console"
fi

echo ""
echo "📝 To permanently fix this:"
echo "1. Generate new key: https://console.anthropic.com/"
echo "2. Update your ~/.zshrc or ~/.bashrc:"
echo "   export ANTHROPIC_API_KEY=\"your-new-key-here\""
echo "   export CLAUDE_API_KEY=\"your-new-key-here\""
echo "3. Reload your shell: source ~/.zshrc"
echo "4. Test with the curl command above"
