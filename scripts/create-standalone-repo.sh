#!/bin/bash

# 🚀 Alex AI Standalone Repository Creation Script
# This script creates the new standalone repository structure

set -e

echo "🚀 Creating Alex AI Standalone Repository Structure..."

# Create the new repository directory
REPO_NAME="alex-ai-universal"
REPO_PATH="../$REPO_NAME"

if [ -d "$REPO_PATH" ]; then
    echo "❌ Repository directory already exists: $REPO_PATH"
    echo "Please remove it first or choose a different name."
    exit 1
fi

echo "📁 Creating repository structure..."

# Create main directory
mkdir -p "$REPO_PATH"
cd "$REPO_PATH"

# Create package directories
mkdir -p packages/{core,cli,vscode-extension,cursor-extension,web-interface,enterprise}
mkdir -p docs/{api,guides,examples}
mkdir -p scripts/{build,deploy,testing}
mkdir -p examples/{react-project,node-project,python-project}

# Create root files
cat > package.json << 'EOF'
{
  "name": "alex-ai-universal",
  "version": "1.0.0",
  "description": "Universal AI Code Assistant - Standalone Repository",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "bootstrap": "lerna bootstrap",
    "build": "lerna run build",
    "test": "lerna run test",
    "lint": "lerna run lint",
    "clean": "lerna clean",
    "publish": "lerna publish",
    "version": "lerna version"
  },
  "devDependencies": {
    "lerna": "^8.0.0",
    "typescript": "^5.4.5",
    "@types/node": "^20.12.7",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/alex-ai-universal.git"
  },
  "keywords": [
    "ai",
    "code-assistant",
    "vscode-extension",
    "cursor-ai",
    "cli",
    "universal"
  ],
  "author": "Alex AI Team",
  "license": "MIT"
}
EOF

# Create Lerna configuration
cat > lerna.json << 'EOF'
{
  "version": "independent",
  "npmClient": "npm",
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish"
    },
    "version": {
      "conventionalCommits": true,
      "message": "chore(release): version"
    }
  },
  "packages": ["packages/*"]
}
EOF

# Create TypeScript configuration
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true
  },
  "include": ["packages/*/src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF

# Create ESLint configuration
cat > .eslintrc.js << 'EOF'
module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
EOF

# Create Prettier configuration
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/
EOF

# Create README
cat > README.md << 'EOF'
# 🚀 Alex AI Universal

**Universal AI Code Assistant** - Works with any IDE, any project, anywhere.

[![npm version](https://badge.fury.io/js/%40alex-ai%2Fcli.svg)](https://badge.fury.io/js/%40alex-ai%2Fcli)
[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue)](https://marketplace.visualstudio.com/items?itemName=alex-ai.alex-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🤖 Crew-Based AI**: 9 specialized AI agents for different tasks
- **🔒 Security-First**: Built-in security guard with intelligent redaction
- **🌍 Universal**: Works with VSCode, Cursor, terminal, and more
- **💾 Memory System**: Persistent learning across projects
- **🔧 N8N Integration**: Workflow automation
- **📊 MCP Support**: Model Context Protocol

## 🚀 Quick Start

### CLI Installation
```bash
npm install -g @alex-ai/cli
alex-ai engage
```

### VSCode Extension
```bash
ext install alex-ai.alex-ai
```

### Cursor Integration
Built-in support - just engage Alex AI in any Cursor chat!

## 📦 Packages

- **`@alex-ai/core`** - Core AI engine and crew management
- **`@alex-ai/cli`** - Command-line interface
- **`@alex-ai/vscode`** - VSCode extension
- **`@alex-ai/cursor`** - Cursor AI integration
- **`@alex-ai/web`** - Web-based interface
- **`@alex-ai/enterprise`** - Enterprise features

## 🏗️ Development

```bash
# Clone repository
git clone https://github.com/your-username/alex-ai-universal.git
cd alex-ai-universal

# Install dependencies
npm install

# Bootstrap packages
npm run bootstrap

# Build all packages
npm run build

# Run tests
npm test
```

## 📚 Documentation

- [API Documentation](docs/api/)
- [User Guides](docs/guides/)
- [Examples](docs/examples/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🌟 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/alex-ai-universal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/alex-ai-universal/discussions)
- **Email**: support@alex-ai.dev

---

**Made with ❤️ by the Alex AI Team**
EOF

# Create GitHub Actions workflow
mkdir -p .github/workflows
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Bootstrap packages
      run: npm run bootstrap
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Build packages
      run: npm run build

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
    - uses: actions/checkout@v4
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
        registry-url: 'https://registry.npmjs.org'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Bootstrap packages
      run: npm run bootstrap
    
    - name: Build packages
      run: npm run build
    
    - name: Publish packages
      run: npm run publish
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
EOF

# Create CONTRIBUTING.md
cat > CONTRIBUTING.md << 'EOF'
# Contributing to Alex AI Universal

Thank you for your interest in contributing to Alex AI Universal! 🚀

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** and add tests
5. **Submit a pull request**

## 📋 Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/alex-ai-universal.git
cd alex-ai-universal

# Install dependencies
npm install

# Bootstrap packages
npm run bootstrap

# Start development
npm run dev
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm run test -- --scope=@alex-ai/core

# Run tests in watch mode
npm run test -- --watch
```

## 📝 Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow our ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Conventional Commits**: Use conventional commit messages

## 🐛 Bug Reports

When reporting bugs, please include:
- **OS and version**
- **Node.js version**
- **Package version**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**

## ✨ Feature Requests

When requesting features, please include:
- **Use case description**
- **Proposed solution**
- **Alternatives considered**
- **Additional context**

## 📄 Pull Request Process

1. **Update documentation** for any new features
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update CHANGELOG.md**
5. **Request review** from maintainers

## 🎯 Areas for Contribution

- **Core AI Engine**: Improve crew coordination
- **Security Guard**: Enhance pattern detection
- **IDE Integrations**: VSCode, Cursor, IntelliJ
- **CLI Tools**: Terminal interface improvements
- **Documentation**: Guides, examples, API docs
- **Testing**: Unit tests, integration tests
- **Performance**: Optimization and monitoring

## 📞 Questions?

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and discussions
- **Email**: dev@alex-ai.dev

Thank you for contributing! 🙏
EOF

# Create CHANGELOG.md
cat > CHANGELOG.md << 'EOF'
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial repository structure
- Core package architecture
- CLI package foundation
- VSCode extension structure
- Cursor integration package
- CI/CD pipeline setup
- Documentation framework

### Changed
- Migrated from monorepo to standalone repository

### Security
- Integrated security memory guard
- Implemented intelligent redaction system
EOF

# Create LICENSE
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 Alex AI Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

echo "✅ Repository structure created successfully!"
echo "📁 Location: $REPO_PATH"
echo ""
echo "🚀 Next steps:"
echo "1. cd $REPO_PATH"
echo "2. git init"
echo "3. git add ."
echo "4. git commit -m 'Initial commit: Alex AI Universal repository structure'"
echo "5. Create GitHub repository and push"
echo ""
echo "📦 Then run the migration script to copy packages from the monorepo"
