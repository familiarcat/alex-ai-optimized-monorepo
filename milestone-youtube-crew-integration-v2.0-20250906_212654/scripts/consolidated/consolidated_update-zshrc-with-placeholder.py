#!/usr/bin/env python3
"""
Consolidated Script: update-zshrc-with-placeholder
================================

This script consolidates the following similar scripts:
- ./scripts/update-zshrc-with-placeholder.sh
- ./alexai-base-package/update-zshrc-with-placeholder.sh

Generated: 2025-09-06 20:27:37
"""

#!/bin/bash

# Update ~/.zshrc with a placeholder for the ANTHROPIC_API_KEY
echo "🔧 Updating ~/.zshrc with API key placeholder"
echo "============================================="

# Backup the original file
cp ~/.zshrc ~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Created backup: ~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)"

# Create a temporary file with the corrected line
TEMP_FILE=$(mktemp)

# Replace the malformed ANTHROPIC_API_KEY line
sed 's|export ANTHROPIC_API_KEY=.*|export ANTHROPIC_API_KEY="YOUR_NEW_ANTHROPIC_API_KEY_HERE"|' ~/.zshrc > "$TEMP_FILE"

# Replace the CLAUDE_API_KEY line to reference the ANTHROPIC_API_KEY
sed -i '' 's|export CLAUDE_API_KEY=.*|export CLAUDE_API_KEY="$ANTHROPIC_API_KEY"|' "$TEMP_FILE"

# Replace the original file
mv "$TEMP_FILE" ~/.zshrc

echo "✅ Updated ~/.zshrc with placeholder"
echo ""
echo "📝 Next steps:"
echo "1. Go to: https://console.anthropic.com/"
echo "2. Create a new API key"
echo "3. Replace 'YOUR_NEW_ANTHROPIC_API_KEY_HERE' in ~/.zshrc with your new key"
echo "4. Run: source ~/.zshrc"
echo "5. Test your Alex AI system"
echo ""
echo "🎯 The corrected line in your ~/.zshrc should look like:"
echo "   export ANTHROPIC_API_KEY=\"sk-ant-api03-your-actual-key-here\""
echo "   export CLAUDE_API_KEY=\"\$ANTHROPIC_API_KEY\""
echo ""
echo "🧪 After updating, test with:"
echo "   curl -X POST 'https://api.anthropic.com/v1/messages' \\"
echo "     -H 'x-api-key: \$ANTHROPIC_API_KEY' \\"
echo "     -H 'anthropic-version: 2023-06-01' \\"
echo "     -H 'content-type: application/json' \\"
echo "     -d '{\"model\": \"claude-3-5-sonnet-20241022\", \"max_tokens\": 50, \"messages\": [{\"role\": \"user\", \"content\": \"Test\"}]}'"
