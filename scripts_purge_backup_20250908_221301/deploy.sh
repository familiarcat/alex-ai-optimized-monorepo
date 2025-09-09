#!/bin/bash
# Turborepo Deployment Script

set -e

echo "🚀 Starting Turborepo deployment..."

# Check if we're in CI
if [ "$CI" = "true" ]; then
    echo "📦 CI environment detected"
    export TURBO_TOKEN="$TURBO_TOKEN"
    export TURBO_TEAM="$TURBO_TEAM"
fi

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install --frozen-lockfile

# Type check
echo "🔍 Running type checks..."
pnpm turbo run type-check

# Lint
echo "🧹 Running linter..."
pnpm turbo run lint

# Build
echo "🏗️ Building applications..."
pnpm turbo run build

# Test
echo "🧪 Running tests..."
pnpm turbo run test

echo "✅ Deployment preparation complete!"
