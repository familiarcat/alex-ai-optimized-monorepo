#!/bin/bash

# Alex AI Credential Validator
# Validates that all required credentials are properly loaded

set -e

echo "🔐 Alex AI Credential Validator"
echo "==============================="

# Load credentials first
echo "ℹ️  Loading credentials from ~/.zshrc..."
source ./scripts/deployment/general/consolidated_general.py

echo ""
echo "ℹ️  Validating required credentials..."

# Check required credentials
required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "N8N_URL"
    "N8N_API_KEY"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "✅ All required credentials are present"
else
    echo "❌ Missing required credentials:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    echo "❌ Required credentials validation failed"
    exit 1
fi

echo ""
echo "ℹ️  Validating optional credentials..."

# Check optional credentials
optional_vars=(
    "OPENAI_API_KEY"
    "ANTHROPIC_API_KEY"
    "OPENROUTER_API_KEY"
    "GITHUB_TOKEN"
    "VERCEL_TOKEN"
)

available_optional=()
for var in "${optional_vars[@]}"; do
    if [ -n "${!var}" ]; then
        available_optional+=("$var")
    fi
done

if [ ${#available_optional[@]} -gt 0 ]; then
    echo "✅ Available optional credentials:"
    for var in "${available_optional[@]}"; do
        echo "  ✅ $var"
    done
else
    echo "⚠️  No optional credentials found"
fi

echo ""
echo "🎉 Credential validation complete!"
echo "All required credentials are properly loaded and available."

