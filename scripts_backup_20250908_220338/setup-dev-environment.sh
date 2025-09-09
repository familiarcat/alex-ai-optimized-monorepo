#!/bin/bash

# Alex AI Development Environment Setup
# This script sets up the complete development environment with automatic credential loading

set -e

echo "🚀 Alex AI Development Environment Setup"
echo "========================================"

# Check if ~/.zshrc exists and has Alex AI credentials
if [ -f ~/.zshrc ]; then
    echo "📁 Checking ~/.zshrc for Alex AI credentials..."
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" ~/.zshrc; then
        echo "✅ Supabase credentials found in ~/.zshrc"
    else
        echo "⚠️  Supabase credentials not found in ~/.zshrc"
        echo "   Please add your credentials to ~/.zshrc:"
        echo "   export NEXT_PUBLIC_SUPABASE_URL='your-supabase-url'"
        echo "   export NEXT_PUBLIC_SUPABASE_ANON_KEY='your-supabase-key'"
    fi
    
    if grep -q "N8N_URL" ~/.zshrc; then
        echo "✅ N8N Federation Crew credentials found in ~/.zshrc"
    else
        echo "⚠️  N8N Federation Crew credentials not found in ~/.zshrc"
        echo "   Please add your credentials to ~/.zshrc:"
        echo "   export N8N_URL='https://n8n.pbradygeorgen.com'"
        echo "   export N8N_API_KEY='your-n8n-api-key'"
    fi
else
    echo "❌ ~/.zshrc not found. Creating template..."
    cat > ~/.zshrc << 'EOF'
# Alex AI Credentials
# Add your actual credentials here
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-key"
export N8N_URL="https://n8n.pbradygeorgen.com"
export N8N_API_KEY="your-n8n-api-key"
export OPENAI_API_KEY="your-openai-key"
export ANTHROPIC_API_KEY="your-anthropic-key"
export OPENROUTER_API_KEY="your-openrouter-key"
export GITHUB_TOKEN="your-github-token"
export ALEX_AI_ENVIRONMENT="development"
export ALEX_AI_VERSION="1.0.0"
EOF
    echo "✅ Template ~/.zshrc created. Please update with your actual credentials."
fi

# Load credentials
echo "🔐 Loading credentials from ~/.zshrc..."
source ~/.zshrc

# Run the universal credentials loader
echo "🌐 Running universal credentials loader..."
./scripts/load-credentials.sh

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Verify setup
echo "🔍 Verifying development environment..."

# Check if apps exist
if [ -d "apps/alex-ai-job-search" ]; then
    echo "✅ Alex AI Job Search app found"
else
    echo "❌ Alex AI Job Search app not found"
fi

# Check if packages exist
if [ -d "packages" ]; then
    echo "✅ Packages directory found"
    echo "   Found $(ls -1 packages | wc -l) packages"
else
    echo "❌ Packages directory not found"
fi

# Test credential loading
echo "🧪 Testing credential loading..."
if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ] && [ -n "$N8N_URL" ]; then
    echo "✅ Credentials loaded successfully"
else
    echo "❌ Failed to load credentials"
    echo "   Please check your ~/.zshrc file"
fi

# Create development aliases
echo "🔧 Creating development aliases..."
cat >> ~/.zshrc << 'EOF'

# Alex AI Development Aliases
alias alex-dev="cd /Users/bradygeorgen/Documents/workspace/alex-ai-optimized-monorepo-clean && pnpm run dev"
alias alex-build="cd /Users/bradygeorgen/Documents/workspace/alex-ai-optimized-monorepo-clean && pnpm run build"
alias alex-test="cd /Users/bradygeorgen/Documents/workspace/alex-ai-optimized-monorepo-clean && pnpm run test"
alias alex-creds="cd /Users/bradygeorgen/Documents/workspace/alex-ai-optimized-monorepo-clean && ./scripts/load-credentials.sh"
alias alex-n8n="curl -s https://n8n.pbradygeorgen.com/webhook/federation-mission -H 'Content-Type: application/json' -d '{\"action\": \"status\", \"timestamp\": \"'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'\"}'"
EOF

echo "✅ Development aliases added to ~/.zshrc"

echo ""
echo "🎉 Alex AI Development Environment Setup Complete!"
echo ""
echo "Available commands:"
echo "  alex-dev     - Start development server"
echo "  alex-build   - Build all applications"
echo "  alex-test    - Run all tests"
echo "  alex-creds   - Reload credentials"
echo "  alex-n8n     - Check N8N Federation Crew status"
echo ""
echo "Next steps:"
echo "1. Reload your shell: source ~/.zshrc"
echo "2. Start development: alex-dev"
echo "3. Or use: pnpm run dev"
echo ""
