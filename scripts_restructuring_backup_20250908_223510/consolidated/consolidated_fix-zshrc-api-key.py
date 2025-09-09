#!/usr/bin/env python3
"""
Consolidated Script: fix-zshrc-api-key
================================

This script consolidates the following similar scripts:
- ./scripts/testing/api_integration/consolidated_api_integration.py
- ./alexai-base-package/fix-zshrc-api-key.sh

Generated: 2025-09-06 20:27:37
"""

#!/bin/bash

# Fix the duplicated ANTHROPIC_API_KEY in ~/.zshrc
echo "🔧 Fixing duplicated ANTHROPIC_API_KEY in ~/.zshrc"
echo "=================================================="

# Backup the original file
cp ~/.zshrc ~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Created backup: ~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)"

# The current malformed key from your .zshrc
CURRENT_KEY="sk-ant-api03-API_KEY_PLACEHOLDER012345678901234567890123sk-ant-api03-zDNB_API_KEY_PLACEHOLDERRjHt6v-ep2mh9ltqu2a0_4s2DfGJo6WQlJ5eo49kg-y4MmbgAA"

echo "📊 Current key analysis:"
echo "   Length: ${#CURRENT_KEY} characters"
echo "   Contains 'sk-ant-api03' twice: $(echo "$CURRENT_KEY" | grep -o "sk-ant-api03" | wc -l) times"

# Try to extract the first valid key by finding where the duplication starts
# Look for the pattern where the second key starts
SECOND_KEY_START=$(echo "$CURRENT_KEY" | grep -o "sk-ant-api03" | head -2 | tail -1)

if [ -n "$SECOND_KEY_START" ]; then
    # Find the position of the second occurrence
    POSITION=$(echo "$CURRENT_KEY" | grep -b "sk-ant-api03" | head -2 | tail -1 | cut -d: -f1)
    echo "   Second key starts at position: $POSITION"
    
    # Extract the first key (everything before the second occurrence)
    FIRST_KEY="${CURRENT_KEY:0:$POSITION}"
    echo "   First key length: ${#FIRST_KEY}"
    echo "   First key: ${FIRST_KEY:0:20}...${FIRST_KEY: -10}"
    
    if [ ${#FIRST_KEY} -ge 80 ] && [ ${#FIRST_KEY} -le 120 ]; then
        echo "✅ Found potential valid key!"
        
        # Test the key
        echo "🧪 Testing the extracted key..."
        TEST_RESULT=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
          -H "x-api-key: $FIRST_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "content-type: application/json" \
          -d '{
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 50,
            "messages": [{"role": "user", "content": "Test"}]
          }' 2>/dev/null)
        
        if echo "$TEST_RESULT" | grep -q "content"; then
            echo "🎉 SUCCESS! The extracted key works!"
            echo "   Updating ~/.zshrc with the corrected key..."
            
            # Update the .zshrc file
            sed -i '' "s|export ANTHROPIC_API_KEY=.*|export ANTHROPIC_API_KEY=\"$FIRST_KEY\"|" ~/.zshrc
            sed -i '' "s|export CLAUDE_API_KEY=.*|export CLAUDE_API_KEY=\"$FIRST_KEY\"|" ~/.zshrc
            
            echo "✅ Updated ~/.zshrc with corrected API key"
            echo "🔄 Please run: source ~/.zshrc"
            echo "🧪 Then test with: echo \$ANTHROPIC_API_KEY"
            
        else
            echo "❌ Extracted key doesn't work. You'll need to generate a new one."
            echo "   Go to: https://console.anthropic.com/"
        fi
    else
        echo "❌ Extracted key length (${#FIRST_KEY}) is outside expected range (80-120)"
        echo "   You'll need to generate a new key from Anthropic Console"
    fi
else
    echo "❌ Could not find the duplication pattern"
    echo "   You'll need to generate a new key from Anthropic Console"
fi

echo ""
echo "📝 Next steps:"
echo "1. If successful: source ~/.zshrc"
echo "2. If failed: Generate new key at https://console.anthropic.com/"
echo "3. Test your Alex AI system once the key is working"
