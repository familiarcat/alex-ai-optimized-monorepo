#!/usr/bin/env python3
"""
Consolidated Script: setup-secure-api-keys
================================

This script consolidates the following similar scripts:
- ./scripts/setup-secure-api-keys.sh
- ./alexai-base-package/setup-secure-api-keys.sh

Generated: 2025-09-06 20:27:37
"""

#!/bin/bash

# Setup secure API key management for Alex AI
echo "🔐 Alex AI Secure API Key Management Setup"
echo "=========================================="

# Create a secure directory for API keys
SECURE_DIR="$HOME/.alexai-keys"
mkdir -p "$SECURE_DIR"
chmod 700 "$SECURE_DIR"

echo "✅ Created secure directory: $SECURE_DIR"

# Create the API keys file
API_KEYS_FILE="$SECURE_DIR/api-keys.env"

echo "📝 Creating secure API keys file: $API_KEYS_FILE"

# Check if we can extract a working key from your current setup
echo "🔍 Looking for existing working API key..."

# Check if there's a working key in your environment or backup files
WORKING_KEY=""

# Check backup files for a potentially working key
for backup in ~/.zshrc.backup.*; do
    if [ -f "$backup" ]; then
        echo "   Checking backup: $backup"
        # Look for a key that might be the original working one
        POTENTIAL_KEY=$(grep 'export ANTHROPIC_API_KEY=' "$backup" | head -1 | cut -d'"' -f2)
        if [ -n "$POTENTIAL_KEY" ] && [ ${#POTENTIAL_KEY} -ge 80 ] && [ ${#POTENTIAL_KEY} -le 120 ]; then
            echo "   Found potential key in backup: ${POTENTIAL_KEY:0:20}... (${#POTENTIAL_KEY} chars)"
            
            # Test this key
            echo "   Testing key from backup..."
            TEST_RESULT=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
              -H "x-api-key: $POTENTIAL_KEY" \
              -H "anthropic-version: 2023-06-01" \
              -H "content-type: application/json" \
              -d '{
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 50,
                "messages": [{"role": "user", "content": "Test"}]
              }' 2>/dev/null)
            
            if echo "$TEST_RESULT" | grep -q "content"; then
                echo "   🎉 Found working key in backup!"
                WORKING_KEY="$POTENTIAL_KEY"
                break
            fi
        fi
    fi
done

# If we found a working key, use it
if [ -n "$WORKING_KEY" ]; then
    echo "✅ Using working key from backup"
    
    # Create the secure API keys file
    cat > "$API_KEYS_FILE" << EOF
# Alex AI Secure API Keys
# Generated: $(date)
# This file contains your API keys in a secure location

# Anthropic Claude API Key
ANTHROPIC_API_KEY="$WORKING_KEY"

# Claude API Key (alias for compatibility)
CLAUDE_API_KEY="$WORKING_KEY"

# Other API Keys (add as needed)
# OPENAI_API_KEY="your-openai-key-here"
# OPENROUTER_API_KEY="your-openrouter-key-here"
EOF

    chmod 600 "$API_KEYS_FILE"
    echo "✅ Created secure API keys file with working key"
    
else
    echo "❌ No working key found in backups"
    echo "📝 Creating template for manual key entry..."
    
    # Create a template file
    cat > "$API_KEYS_FILE" << EOF
# Alex AI Secure API Keys
# Generated: $(date)
# Replace the placeholder with your actual API key

# Anthropic Claude API Key
ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY_HERE"

# Claude API Key (alias for compatibility)
CLAUDE_API_KEY="\$ANTHROPIC_API_KEY"

# Other API Keys (add as needed)
# OPENAI_API_KEY="your-openai-key-here"
# OPENROUTER_API_KEY="your-openrouter-key-here"
EOF

    chmod 600 "$API_KEYS_FILE"
    echo "📝 Created template file. Please edit it with your actual API key:"
    echo "   nano $API_KEYS_FILE"
fi

# Update .zshrc to source the secure keys file
echo "🔄 Updating ~/.zshrc to use secure key management..."

# Remove old API key lines and add secure sourcing
sed -i '' '/export ANTHROPIC_API_KEY=/d' ~/.zshrc
sed -i '' '/export CLAUDE_API_KEY=/d' ~/.zshrc

# Add secure key sourcing at the end of .zshrc
cat >> ~/.zshrc << EOF

# ========================================
# Alex AI Secure API Key Management
# ========================================
# Source API keys from secure location
if [ -f "$API_KEYS_FILE" ]; then
    source "$API_KEYS_FILE"
    echo "🔐 Alex AI API keys loaded securely"
else
    echo "⚠️  Alex AI API keys file not found: $API_KEYS_FILE"
fi
EOF

echo "✅ Updated ~/.zshrc to use secure key management"

# Create a key management script
cat > "$SECURE_DIR/manage-keys.sh" << 'EOF'
#!/bin/bash

# Alex AI API Key Management Script
SECURE_DIR="$HOME/.alexai-keys"
API_KEYS_FILE="$SECURE_DIR/api-keys.env"

case "$1" in
    "status")
        echo "🔐 Alex AI API Key Status"
        echo "========================="
        if [ -f "$API_KEYS_FILE" ]; then
            echo "✅ Keys file exists: $API_KEYS_FILE"
            echo "📊 Key status:"
            source "$API_KEYS_FILE"
            if [ -n "$ANTHROPIC_API_KEY" ] && [ "$ANTHROPIC_API_KEY" != "YOUR_ANTHROPIC_API_KEY_HERE" ]; then
                echo "   ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY:0:20}... (${#ANTHROPIC_API_KEY} chars)"
                
                # Test the key
                echo "🧪 Testing API key..."
                TEST_RESULT=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
                  -H "x-api-key: $ANTHROPIC_API_KEY" \
                  -H "anthropic-version: 2023-06-01" \
                  -H "content-type: application/json" \
                  -d '{
                    "model": "claude-3-5-sonnet-20241022",
                    "max_tokens": 50,
                    "messages": [{"role": "user", "content": "Test"}]
                  }' 2>/dev/null)
                
                if echo "$TEST_RESULT" | grep -q "content"; then
                    echo "   ✅ API key is working!"
                else
                    echo "   ❌ API key is not working"
                fi
            else
                echo "   ❌ ANTHROPIC_API_KEY not set or is placeholder"
            fi
        else
            echo "❌ Keys file not found: $API_KEYS_FILE"
        fi
        ;;
    "edit")
        echo "📝 Opening API keys file for editing..."
        nano "$API_KEYS_FILE"
        echo "🔄 Reloading keys..."
        source "$API_KEYS_FILE"
        ;;
    "reload")
        echo "🔄 Reloading API keys..."
        source "$API_KEYS_FILE"
        echo "✅ Keys reloaded"
        ;;
    "backup")
        BACKUP_FILE="$SECURE_DIR/api-keys.backup.$(date +%Y%m%d_%H%M%S).env"
        cp "$API_KEYS_FILE" "$BACKUP_FILE"
        echo "✅ Created backup: $BACKUP_FILE"
        ;;
    *)
        echo "🔐 Alex AI API Key Management"
        echo "Usage: $0 {status|edit|reload|backup}"
        echo ""
        echo "Commands:"
        echo "  status  - Check API key status and test connection"
        echo "  edit    - Edit the API keys file"
        echo "  reload  - Reload API keys into current session"
        echo "  backup  - Create a backup of current keys"
        ;;
esac
EOF

chmod +x "$SECURE_DIR/manage-keys.sh"

echo "✅ Created key management script: $SECURE_DIR/manage-keys.sh"

# Create convenient aliases
cat >> ~/.zshrc << EOF

# Alex AI Key Management Aliases
alias alexai-keys="\$HOME/.alexai-keys/manage-keys.sh"
alias alexai-status="alexai-keys status"
alias alexai-edit="alexai-keys edit"
alias alexai-reload="alexai-keys reload"
EOF

echo "✅ Added convenient aliases to ~/.zshrc"

echo ""
echo "🎉 Secure API Key Management Setup Complete!"
echo "==========================================="
echo ""
echo "📁 Secure directory: $SECURE_DIR"
echo "🔐 Keys file: $API_KEYS_FILE"
echo "🛠️  Management script: $SECURE_DIR/manage-keys.sh"
echo ""
echo "🚀 Quick Commands:"
echo "   alexai-status  - Check API key status"
echo "   alexai-edit    - Edit API keys"
echo "   alexai-reload  - Reload keys"
echo ""
echo "🔄 Next steps:"
echo "1. source ~/.zshrc"
echo "2. alexai-status"
echo "3. If needed: alexai-edit (to add your API key)"
echo ""
echo "🔒 Your API keys are now stored securely and managed locally!"
