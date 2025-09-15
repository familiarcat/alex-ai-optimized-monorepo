#!/bin/bash

# 🚀 Alex AI Migration to Standalone Repository Script
# This script migrates core packages from the monorepo to the standalone repository

set -e

echo "🚀 Migrating Alex AI to Standalone Repository..."

# Check if standalone repo exists
STANDALONE_REPO="../alex-ai-universal"
if [ ! -d "$STANDALONE_REPO" ]; then
    echo "❌ Standalone repository not found: $STANDALONE_REPO"
    echo "Please run create-standalone-repo.sh first"
    exit 1
fi

echo "📦 Migrating core packages..."

# Core package migration
echo "📁 Migrating @alex-ai/core..."
if [ -d "packages/@alex-ai/core" ]; then
    cp -r packages/@alex-ai/core/* "$STANDALONE_REPO/packages/core/"
    echo "✅ Core package migrated"
else
    echo "⚠️  Core package not found in monorepo"
fi

# Universal package migration
echo "📁 Migrating @alex-ai/universal..."
if [ -d "packages/@alex-ai/universal" ]; then
    cp -r packages/@alex-ai/universal/* "$STANDALONE_REPO/packages/core/"
    echo "✅ Universal package migrated"
else
    echo "⚠️  Universal package not found in monorepo"
fi

# Universal CLI package migration
echo "📁 Migrating @alex-ai/universal-cli..."
if [ -d "packages/@alex-ai/universal-cli" ]; then
    cp -r packages/@alex-ai/universal-cli/* "$STANDALONE_REPO/packages/cli/"
    echo "✅ CLI package migrated"
else
    echo "⚠️  Universal CLI package not found in monorepo"
fi

# Scripts migration
echo "📁 Migrating scripts..."
if [ -d "scripts" ]; then
    # Copy security and integration scripts
    cp scripts/security-memory-guard.js "$STANDALONE_REPO/scripts/"
    cp scripts/universal-integration-service.js "$STANDALONE_REPO/scripts/"
    cp scripts/universal-alex-ai-cursor-integration.js "$STANDALONE_REPO/scripts/"
    cp scripts/test-security-guard.js "$STANDALONE_REPO/scripts/"
    echo "✅ Scripts migrated"
else
    echo "⚠️  Scripts directory not found"
fi

# Documentation migration
echo "📁 Migrating documentation..."
if [ -f "ALEX_AI_STANDALONE_REPOSITORY_STRATEGY.md" ]; then
    cp ALEX_AI_STANDALONE_REPOSITORY_STRATEGY.md "$STANDALONE_REPO/docs/"
fi
if [ -f "GLOBAL_ALEX_AI_SECURITY_INTEGRATION.md" ]; then
    cp GLOBAL_ALEX_AI_SECURITY_INTEGRATION.md "$STANDALONE_REPO/docs/"
fi
if [ -f "INTELLIGENT_SECURITY_REDACTION_SYSTEM.md" ]; then
    cp INTELLIGENT_SECURITY_REDACTION_SYSTEM.md "$STANDALONE_REPO/docs/"
fi
if [ -f "SECURITY_MEMORY_GUARD_DOCUMENTATION.md" ]; then
    cp SECURITY_MEMORY_GUARD_DOCUMENTATION.md "$STANDALONE_REPO/docs/"
fi
echo "✅ Documentation migrated"

# Create package.json files for each package
echo "📝 Creating package.json files..."

# Core package.json
cat > "$STANDALONE_REPO/packages/core/package.json" << 'EOF'
{
  "name": "@alex-ai/core",
  "version": "1.0.0",
  "description": "Core AI engine and crew management for Alex AI",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "keywords": [
    "ai",
    "code-assistant",
    "crew-management",
    "alex-ai"
  ],
  "author": "Alex AI Team",
  "license": "MIT",
  "dependencies": {
    "commander": "^12.0.0",
    "fs-extra": "^11.2.0",
    "simple-git": "^3.24.0",
    "yaml": "^2.4.2"
  },
  "devDependencies": {
    "@types/fs-extra": "^11.0.4",
    "@types/node": "^20.12.7",
    "typescript": "^5.4.5",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0"
  },
  "files": [
    "dist/**/*",
    "src/**/*",
    "README.md"
  ],
  "publishConfig": {
    "access": "public"
  }
}
EOF

# CLI package.json
cat > "$STANDALONE_REPO/packages/cli/package.json" << 'EOF'
{
  "name": "@alex-ai/cli",
  "version": "1.0.0",
  "description": "Command-line interface for Alex AI Universal",
  "main": "dist/index.js",
  "bin": {
    "alex-ai": "dist/cli.js",
    "engage-alex-ai": "dist/cli.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "keywords": [
    "ai",
    "cli",
    "code-assistant",
    "alex-ai"
  ],
  "author": "Alex AI Team",
  "license": "MIT",
  "dependencies": {
    "@alex-ai/core": "^1.0.0",
    "commander": "^12.0.0",
    "fs-extra": "^11.2.0",
    "simple-git": "^3.24.0",
    "yaml": "^2.4.2",
    "chalk": "^5.3.0",
    "inquirer": "^9.2.12"
  },
  "devDependencies": {
    "@types/fs-extra": "^11.0.4",
    "@types/node": "^20.12.7",
    "typescript": "^5.4.5",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0"
  },
  "files": [
    "dist/**/*",
    "src/**/*",
    "README.md"
  ],
  "publishConfig": {
    "access": "public"
  }
}
EOF

# VSCode extension package.json
cat > "$STANDALONE_REPO/packages/vscode-extension/package.json" << 'EOF'
{
  "name": "@alex-ai/vscode",
  "version": "1.0.0",
  "description": "VSCode extension for Alex AI Universal",
  "displayName": "Alex AI Universal",
  "publisher": "alex-ai",
  "engines": {
    "vscode": "^1.74.0"
  },
  "categories": [
    "Other",
    "Machine Learning",
    "Snippets"
  ],
  "activationEvents": [
    "onCommand:alex-ai.engage",
    "onCommand:alex-ai.status"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "alex-ai.engage",
        "title": "Engage Alex AI",
        "category": "Alex AI"
      },
      {
        "command": "alex-ai.status",
        "title": "Alex AI Status",
        "category": "Alex AI"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "alex-ai.engage",
          "when": "editorTextFocus"
        },
        {
          "command": "alex-ai.status",
          "when": "editorTextFocus"
        }
      ]
    },
    "views": {
      "alex-ai": [
        {
          "id": "alex-ai-crew",
          "name": "Alex AI Crew"
        }
      ]
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "package": "vsce package"
  },
  "keywords": [
    "ai",
    "vscode-extension",
    "code-assistant",
    "alex-ai"
  ],
  "author": "Alex AI Team",
  "license": "MIT",
  "dependencies": {
    "@alex-ai/core": "^1.0.0"
  },
  "devDependencies": {
    "@types/vscode": "^1.74.0",
    "@types/node": "^20.12.7",
    "typescript": "^5.4.5",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@vscode/vsce": "^2.22.0"
  },
  "files": [
    "dist/**/*",
    "src/**/*",
    "README.md"
  ],
  "publishConfig": {
    "access": "public"
  }
}
EOF

# Cursor extension package.json
cat > "$STANDALONE_REPO/packages/cursor-extension/package.json" << 'EOF'
{
  "name": "@alex-ai/cursor",
  "version": "1.0.0",
  "description": "Cursor AI integration for Alex AI Universal",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "keywords": [
    "ai",
    "cursor-ai",
    "code-assistant",
    "alex-ai"
  ],
  "author": "Alex AI Team",
  "license": "MIT",
  "dependencies": {
    "@alex-ai/core": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.12.7",
    "typescript": "^5.4.5",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0"
  },
  "files": [
    "dist/**/*",
    "src/**/*",
    "README.md"
  ],
  "publishConfig": {
    "access": "public"
  }
}
EOF

echo "✅ Migration completed successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. cd $STANDALONE_REPO"
echo "2. npm install"
echo "3. npm run bootstrap"
echo "4. npm run build"
echo "5. Test the packages"
echo "6. Initialize git and push to GitHub"
echo ""
echo "📦 Packages created:"
echo "  - @alex-ai/core (Core AI engine)"
echo "  - @alex-ai/cli (Command-line interface)"
echo "  - @alex-ai/vscode (VSCode extension)"
echo "  - @alex-ai/cursor (Cursor AI integration)"
echo ""
echo "🔧 Scripts migrated:"
echo "  - security-memory-guard.js"
echo "  - universal-integration-service.js"
echo "  - universal-alex-ai-cursor-integration.js"
echo "  - test-security-guard.js"
