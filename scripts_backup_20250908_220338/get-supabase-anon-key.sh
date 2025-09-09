#!/bin/bash

# Script to get the correct Supabase anon key
# This script helps identify the correct JWT anon key for Supabase

set -e

echo "🔑 Supabase Anon Key Helper"
echo "==========================="
echo ""

# Load credentials from ~/.zshrc
echo "ℹ️  Loading credentials from ~/.zshrc..."
if [ -f ~/.zshrc ]; then
    while IFS= read -r line; do
        if [[ $line == export* ]]; then
            eval "$line" 2>/dev/null || true
        fi
    done < ~/.zshrc
    echo "✅ Credentials loaded"
else
    echo "❌ ~/.zshrc not found"
    exit 1
fi

echo ""
echo "📋 Current Supabase Configuration:"
echo "  URL: $SUPABASE_URL"
echo "  Current Anon Key: $SUPABASE_ANON_KEY"
echo ""

echo "🔍 Analysis:"
echo "============"
echo ""

# Check if the current key is a JWT token
if [[ $SUPABASE_ANON_KEY == eyJ* ]]; then
    echo "✅ Current anon key appears to be a JWT token"
    echo "   Format: JWT (starts with 'eyJ')"
else
    echo "❌ Current anon key is NOT a JWT token"
    echo "   Format: $SUPABASE_ANON_KEY"
    echo "   Expected: JWT token starting with 'eyJ'"
fi

echo ""
echo "🔧 How to get the correct anon key:"
echo "==================================="
echo ""
echo "1. Go to your Supabase dashboard:"
echo "   https://supabase.com/dashboard/project/$SUPABASE_PROJECT_NAME"
echo ""
echo "2. Go to Settings > API"
echo ""
echo "3. Copy the 'anon public' key (it should start with 'eyJ')"
echo ""
echo "4. Update your ~/.zshrc file:"
echo "   export SUPABASE_ANON_KEY=\"eyJ...\""
echo ""
echo "5. Reload your shell:"
echo "   source ~/.zshrc"
echo ""
echo "6. Re-run the credential manager:"
echo "   bash scripts/secure-credential-manager.sh"
echo ""

echo "📝 Example of correct JWT anon key format:"
echo "   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwa2trYnVmZHd4bWphZXJiYm4iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjI0NzQ0MCwiZXhwIjoyMDUxODIzNDQwfQ.example_signature"
echo ""

echo "⚠️  Important: The anon key should be a JWT token, not a service key!"
echo "   Service keys start with 'sb_' and should NOT be used in the frontend."
echo "   Anon keys start with 'eyJ' and are safe for frontend use."



