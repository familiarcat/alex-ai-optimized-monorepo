#!/bin/bash

# Alex AI Claude API Key Update Script
# This script helps you update your Claude API key for Alex AI integration

echo "🧠 Alex AI Claude API Key Update Script"
echo "========================================"

# Check current API key status
echo "📊 Current API Key Analysis:"
echo "Length: ${#ANTHROPIC_API_KEY} characters"
echo "Starts with: ${ANTHROPIC_API_KEY:0:10}"

# Check if key appears to be duplicated
if echo "$ANTHROPIC_API_KEY" | grep -q "sk-ant-api03.*sk-ant-api03"; then
    echo "⚠️  WARNING: API key appears to be duplicated/concatenated"
    echo "   This is likely causing the authentication error"
fi

echo ""
echo "🔧 To fix this issue:"
echo "1. Go to: https://console.anthropic.com/"
echo "2. Navigate to API Keys section"
echo "3. Create a new API key"
echo "4. Copy the new key (should be ~100 characters, starting with 'sk-ant-api03-')"
echo "5. Update your environment variables"

echo ""
echo "📝 Environment Variables to Update:"
echo "   ANTHROPIC_API_KEY"
echo "   CLAUDE_API_KEY (if different)"

echo ""
echo "🔄 After updating, test with:"
echo "   curl -X POST 'https://api.anthropic.com/v1/messages' \\"
echo "     -H 'x-api-key: \$ANTHROPIC_API_KEY' \\"
echo "     -H 'anthropic-version: 2023-06-01' \\"
echo "     -H 'content-type: application/json' \\"
echo "     -d '{\"model\": \"claude-3-5-sonnet-20241022\", \"max_tokens\": 50, \"messages\": [{\"role\": \"user\", \"content\": \"Test\"}]}'"

echo ""
echo "🎯 Expected API Key Format:"
echo "   - Starts with: sk-ant-api03-"
echo "   - Length: ~100 characters"
echo "   - No spaces or special characters"
echo "   - Single key (not concatenated)"

echo ""
echo "✅ Once updated, your Alex AI system will be fully operational!"

# Check if we can detect the issue
if [ ${#ANTHROPIC_API_KEY} -gt 120 ]; then
    echo ""
    echo "🚨 ISSUE DETECTED:"
    echo "   Your API key is ${#ANTHROPIC_API_KEY} characters long"
    echo "   Expected length is ~100 characters"
    echo "   This suggests the key may be duplicated or corrupted"
    echo ""
    echo "💡 SOLUTION:"
    echo "   Generate a new API key from Anthropic Console"
    echo "   The current key appears to be malformed"
fi
