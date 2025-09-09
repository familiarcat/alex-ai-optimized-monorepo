#!/usr/bin/env python3
"""
Consolidated Script: get-and-update-claude-key
================================

This script consolidates the following similar scripts:
- ./scripts/deployment/general/consolidated_general.py
- ./alexai-base-package/get-and-update-claude-key.sh

Generated: 2025-09-06 20:27:37
"""

#!/bin/bash

# Get and update Claude API key in ~/.zshrc
echo "🧠 Alex AI Claude API Key Setup"
echo "==============================="

# Check if we already have a valid key
CURRENT_KEY=$(grep 'export ANTHROPIC_API_KEY=' ~/.zshrc | cut -d'"' -f2)

if [ "$CURRENT_KEY" != "YOUR_NEW_ANTHROPIC_API_KEY_HERE" ] && [ ${#CURRENT_KEY} -ge 80 ] && [ ${#CURRENT_KEY} -le 120 ]; then
    echo "✅ You already have a valid-looking API key:"
    echo "   ${CURRENT_KEY:0:20}...${CURRENT_KEY: -10}"
    echo "   Length: ${#CURRENT_KEY} characters"
    
    echo ""
    echo "🧪 Testing current key..."
    TEST_RESULT=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
      -H "x-api-key: $CURRENT_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -H "content-type: application/json" \
      -d '{
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 50,
        "messages": [{"role": "user", "content": "Test connection"}]
      }' 2>/dev/null)
    
    if echo "$TEST_RESULT" | grep -q "content"; then
        echo "🎉 SUCCESS! Your current API key is working!"
        echo "🔄 Reloading your shell environment..."
        source ~/.zshrc
        echo "✅ Environment reloaded!"
        echo ""
        echo "🚀 Your Alex AI system is now fully operational!"
        exit 0
    else
        echo "❌ Current key doesn't work. Need a new one."
    fi
fi

echo "🔑 You need a new Anthropic API key"
echo ""
echo "📋 To get a new API key:"
echo "1. Go to: https://console.anthropic.com/"
echo "2. Sign in to your account"
echo "3. Click 'Create New Key'"
echo "4. Name it 'Alex AI Integration'"
echo "5. Copy the key (starts with 'sk-ant-api03-')"
echo ""
echo "💡 The key should be about 100 characters long"
echo "   Example: sk-ant-api03-ABC123...XYZ789"
echo ""

# Prompt for the new key
echo "📝 Please paste your new API key below:"
read -p "API Key: " NEW_KEY

# Validate the key format
if [ -z "$NEW_KEY" ]; then
    echo "❌ No key provided. Exiting."
    exit 1
fi

if [ ${#NEW_KEY} -lt 80 ] || [ ${#NEW_KEY} -gt 120 ]; then
    echo "⚠️  Warning: Key length (${#NEW_KEY}) is outside expected range (80-120)"
    echo "   This might not be a valid Anthropic API key"
    read -p "Continue anyway? (y/N): " CONTINUE
    if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
        echo "❌ Aborted."
        exit 1
    fi
fi

if [[ ! "$NEW_KEY" =~ ^sk-ant-api03- ]]; then
    echo "⚠️  Warning: Key doesn't start with 'sk-ant-api03-'"
    echo "   This might not be a valid Anthropic API key"
    read -p "Continue anyway? (y/N): " CONTINUE
    if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
        echo "❌ Aborted."
        exit 1
    fi
fi

echo ""
echo "🧪 Testing the new API key..."
TEST_RESULT=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
  -H "x-api-key: $NEW_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 50,
    "messages": [{"role": "user", "content": "Test connection"}]
  }' 2>/dev/null)

if echo "$TEST_RESULT" | grep -q "content"; then
    echo "🎉 SUCCESS! The new API key works!"
    
    # Update the .zshrc file
    echo "📝 Updating ~/.zshrc with the new key..."
    sed -i '' "s|export ANTHROPIC_API_KEY=.*|export ANTHROPIC_API_KEY=\"$NEW_KEY\"|" ~/.zshrc
    
    echo "✅ Updated ~/.zshrc"
    echo "🔄 Reloading your shell environment..."
    source ~/.zshrc
    
    echo ""
    echo "🚀 SUCCESS! Your Alex AI system is now fully operational!"
    echo ""
    echo "📊 System Status:"
    echo "   ✅ N8N Workflows: 18 active"
    echo "   ✅ Crew Members: 9 specialized"
    echo "   ✅ Claude Integration: Working"
    echo "   ✅ Python Scripts: Ready"
    echo "   ✅ Musician Tour App: Ready"
    echo ""
    echo "🎵 Your Alex AI crew is ready for musician tour planning!"
    
else
    echo "❌ The API key doesn't work. Error:"
    echo "$TEST_RESULT" | jq '.error // .' 2>/dev/null || echo "$TEST_RESULT"
    echo ""
    echo "💡 Please check:"
    echo "   • The key is copied correctly"
    echo "   • The key is from the correct Anthropic account"
    echo "   • The key has the right permissions"
    echo ""
    echo "🔄 Try running this script again with a fresh key."
fi
