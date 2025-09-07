#!/bin/bash
# Alex AI Secure Credential Loader
# Loads credentials securely for all Alex AI superagents

# Load from ~/.zshrc
if [ -f ~/.zshrc ]; then
    source ~/.zshrc
fi

# Load from secure credential file if it exists
if [ -f ~/.alexai-credentials/secure-credentials.json ]; then
    # This would be implemented with proper decryption
    echo "🔐 Loading secure credentials..."
fi

# Validate required credentials
required_creds=("SUPABASE_URL" "SUPABASE_ANON_KEY" "N8N_BASE_URL" "N8N_API_KEY" "ANTHROPIC_API_KEY" "OPENROUTER_API_KEY")

for cred in "${required_creds[@]}"; do
    if [ -z "${!cred}" ]; then
        echo "❌ Missing credential: $cred"
        exit 1
    fi
done

echo "✅ All credentials loaded successfully"
