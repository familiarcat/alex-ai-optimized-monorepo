#!/usr/bin/env python3
"""
Consolidated Script: claude-api-key-guide
================================

This script consolidates the following similar scripts:
- ./scripts/testing/api_integration/consolidated_api_integration.py
- ./alexai-base-package/claude-api-key-guide.sh

Generated: 2025-09-06 20:27:37
"""

#!/bin/bash

# Guide to finding API key in the new Claude UI
echo "🔍 Finding Your API Key in the New Claude UI"
echo "============================================="
echo ""

echo "📋 Step-by-Step Guide:"
echo ""
echo "1. 🌐 Go to the Anthropic Console:"
echo "   https://console.anthropic.com/"
echo ""
echo "2. 🔐 Sign in to your account"
echo ""
echo "3. 🎯 Look for one of these options in the new UI:"
echo "   • 'API Keys' in the left sidebar"
echo "   • 'Developers' section in the main menu"
echo "   • 'Settings' or 'Account' menu"
echo "   • 'API' tab in the top navigation"
echo ""
echo "4. 🔑 Once you find the API Keys section:"
echo "   • Click 'Create New Key' or 'Generate Key'"
echo "   • Give it a name like 'Alex AI Integration'"
echo "   • Copy the key (starts with 'sk-ant-api03-')"
echo ""
echo "5. 📝 The key should look like this:"
echo "   sk-ant-api03-API_KEY_PLACEHOLDER01VWX234YZ567890"
echo "   (about 100 characters long)"
echo ""

echo "🎨 New UI Features to Look For:"
echo "   • Modern sidebar navigation"
echo "   • 'Developers' or 'API' section"
echo "   • Clean, card-based layout"
echo "   • 'Create' or 'Generate' buttons"
echo ""

echo "💡 If You Can't Find It:"
echo "   • Try the 'Developers' section"
echo "   • Look for 'API Keys' in account settings"
echo "   • Check the 'Billing' or 'Usage' section"
echo "   • The new UI might have it under 'Integrations'"
echo ""

echo "🚨 Important Notes:"
echo "   • Copy the key immediately - you won't see it again"
echo "   • The key starts with 'sk-ant-api03-'"
echo "   • It should be about 100 characters long"
echo "   • Keep it secure and don't share it"
echo ""

echo "🔄 Once You Have Your Key:"
echo "   1. Run: alexai-edit"
echo "   2. Replace 'YOUR_ANTHROPIC_API_KEY_HERE' with your actual key"
echo "   3. Save the file (Ctrl+X, then Y, then Enter in nano)"
echo "   4. Run: alexai-reload"
echo "   5. Run: alexai-status"
echo ""

echo "🎯 Quick Commands After Getting Your Key:"
echo "   alexai-edit    # Edit your secure keys file"
echo "   alexai-reload  # Reload the keys"
echo "   alexai-status  # Test the connection"
echo ""

echo "🚀 Your Alex AI system will be fully operational once the key is added!"
