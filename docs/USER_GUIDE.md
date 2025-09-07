# Alex AI System User Guide

## Overview

The Alex AI System is a comprehensive AI-powered development platform that integrates multiple AI agents, secure API key management, and automated project generation capabilities.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Basic Usage](#basic-usage)
4. [Advanced Features](#advanced-features)
5. [Troubleshooting](#troubleshooting)
6. [Security](#security)
7. [API Reference](#api-reference)

## Installation

### Prerequisites

- macOS, Linux, or Windows with WSL
- Node.js 18+ and npm
- Python 3.8+
- Git
- Shell access (bash/zsh)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd musician-show-tour-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. **Initialize Alex AI:**
   ```bash
   ./scripts/alexai-init.sh
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

## Configuration

### API Keys Setup

1. **Get your API keys:**
   - Anthropic Claude: [console.anthropic.com](https://console.anthropic.com)
   - OpenAI: [platform.openai.com](https://platform.openai.com)

2. **Configure secure storage:**
   ```bash
   ./scripts/setup-secure-api-keys.sh
   ```

3. **Add your keys:**
   ```bash
   # Edit the secure key file
   nano ~/.alexai-keys/api-keys.env
   ```

4. **Validate keys:**
   ```bash
   ./scripts/validate-api-keys.sh
   ```

### Environment Configuration

The system uses secure environment variables stored in `~/.alexai-keys/api-keys.env`:

```bash
# Anthropic Claude API Key
ANTHROPIC_API_KEY="your-key-here"

# OpenAI API Key (optional)
OPENAI_API_KEY="your-key-here"

# OpenRouter API Key (optional)
OPENROUTER_API_KEY="your-key-here"
```

## Basic Usage

### Starting the System

1. **Initialize Alex AI:**
   ```bash
   ./scripts/alexai-init.sh
   ```

2. **Check system status:**
   ```bash
   ./scripts/quick-production-test.sh
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### Generating Shell Scripts

The system includes a robust shell script generation engine:

```bash
# Generate a basic script
./scripts/production-shell-engine.sh generate my-script.sh basic

# Generate a status script
./scripts/production-shell-engine.sh generate status.sh status

# Generate a progress script
./scripts/production-shell-engine.sh generate progress.sh progress

# Batch generation
./scripts/production-shell-engine.sh batch
```

### Testing the System

Run comprehensive tests:

```bash
# Quick production test
./scripts/quick-production-test.sh

# Full testing suite
./scripts/production-testing-suite.sh

# Security audit
./scripts/security-audit.sh
```

## Advanced Features

### Alex AI Crew System

The system includes 22 specialized AI agents:

- **Project Manager**: Oversees project development
- **Code Architect**: Designs system architecture
- **Security Specialist**: Ensures security best practices
- **Quality Assurance**: Tests and validates code
- **Documentation Expert**: Creates comprehensive docs

### N8N Workflow Integration

The system integrates with N8N for workflow automation:

1. **Enhanced Unified AI Controller**: Routes tasks between AI agents
2. **Observation Lounge**: Coordinates crew responses
3. **Shell Script Validation**: Validates generated scripts

### Supabase Memory System

Alex AI stores knowledge and learns from interactions:

- Project patterns and best practices
- User preferences and configurations
- Error patterns and solutions
- Performance metrics

## Troubleshooting

### Common Issues

#### API Key Problems

**Issue**: "Invalid API key" errors

**Solution**:
1. Check key format: `sk-ant-api03-...`
2. Validate key: `./scripts/validate-api-keys.sh`
3. Regenerate key if needed

#### Shell Script Issues

**Issue**: Scripts fail with `dquote>` errors

**Solution**:
1. Use the production shell engine: `./scripts/production-shell-engine.sh`
2. Avoid complex multi-line echo statements
3. Use `printf` for complex output

#### Permission Errors

**Issue**: "Permission denied" when running scripts

**Solution**:
```bash
chmod +x scripts/*.sh
```

#### Node.js Issues

**Issue**: "Module not found" errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable debug logging:

```bash
export DEBUG=alexai:*
./scripts/alexai-init.sh
```

### Log Files

Check log files for detailed error information:

- `scripts/shell-engine.log` - Shell script generation logs
- `scripts/test-results/test-suite.log` - Test execution logs
- `security-audit-results/security-audit.log` - Security audit logs

## Security

### Best Practices

1. **API Key Security**:
   - Store keys in `~/.alexai-keys/` (chmod 700)
   - Use `chmod 600` for key files
   - Never commit keys to git

2. **File Permissions**:
   - Scripts: `chmod 755`
   - Key files: `chmod 600`
   - Directories: `chmod 700`

3. **Regular Audits**:
   ```bash
   ./scripts/security-audit.sh
   ```

### Security Features

- Secure API key storage
- Input validation and sanitization
- Error handling and logging
- HTTPS-only API communications
- File permission enforcement

## API Reference

### Shell Script Generation API

```bash
# Generate script
./scripts/production-shell-engine.sh generate <name> <type> [output_dir]

# Types: basic, status, progress
# Example:
./scripts/production-shell-engine.sh generate my-script.sh basic ./output
```

### Testing API

```bash
# Quick test
./scripts/quick-production-test.sh

# Full test suite
./scripts/production-testing-suite.sh

# Security audit
./scripts/security-audit.sh
```

### Validation API

```bash
# Validate API keys
./scripts/validate-api-keys.sh

# Validate shell script
./scripts/production-shell-engine.sh test <script_path>
```

## Support

### Getting Help

1. **Check the logs**: Review log files for error details
2. **Run diagnostics**: Use the testing and audit scripts
3. **Review documentation**: Check this guide and inline comments
4. **Security issues**: Run security audit and address findings

### Reporting Issues

When reporting issues, include:

1. System information (`uname -a`)
2. Error messages and logs
3. Steps to reproduce
4. Expected vs actual behavior

### Contributing

1. Follow security best practices
2. Run tests before submitting changes
3. Update documentation as needed
4. Ensure all scripts pass security audit

---

**Version**: 1.0  
**Last Updated**: $(date)  
**Maintainer**: Alex AI System
