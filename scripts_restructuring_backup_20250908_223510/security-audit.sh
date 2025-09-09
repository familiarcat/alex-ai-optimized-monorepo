#!/bin/bash

# Security Audit Script for Alex AI Monorepo
# This script performs comprehensive security checks

set -e

echo "🔒 ALEX AI SECURITY AUDIT"
echo "========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "PASS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "FAIL")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
    esac
}

# Function to check for secrets in files
check_secrets() {
    echo "🔍 Checking for exposed secrets..."
    
    local secrets_found=false
    
    # Check for common secret patterns
    if grep -r -i "sk-proj-" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.log" > /dev/null 2>&1; then
        print_status "FAIL" "OpenAI API keys found in codebase"
        secrets_found=true
    fi
    
    if grep -r -i "sb_publishable_" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.log" > /dev/null 2>&1; then
        print_status "FAIL" "Supabase keys found in codebase"
        secrets_found=true
    fi
    
    if grep -r -i "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.log" > /dev/null 2>&1; then
        print_status "FAIL" "JWT tokens found in codebase"
        secrets_found=true
    fi
    
    if grep -r -i "sk-or-v1-" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.log" > /dev/null 2>&1; then
        print_status "FAIL" "OpenRouter API keys found in codebase"
        secrets_found=true
    fi
    
    if [ "$secrets_found" = false ]; then
        print_status "PASS" "No exposed secrets found"
    fi
}

# Function to check environment files
check_env_files() {
    echo ""
    echo "🔍 Checking environment configuration..."
    
    if [ -f "apps/alex-ai-job-search/.env.local" ]; then
        print_status "WARN" ".env.local file exists (should not be committed)"
    else
        print_status "PASS" "No .env.local file found"
    fi
    
    if [ -f "apps/alex-ai-job-search/.env.production" ]; then
        print_status "WARN" ".env.production file exists (should not be committed)"
    else
        print_status "PASS" "No .env.production file found"
    fi
    
    if [ -f "apps/alex-ai-job-search/env.example" ]; then
        print_status "PASS" "env.example file exists for reference"
    else
        print_status "FAIL" "env.example file missing"
    fi
}

# Function to check security headers
check_security_headers() {
    echo ""
    echo "🔍 Checking security configuration..."
    
    if [ -f "apps/alex-ai-job-search/next.config.js" ]; then
        if grep -q "X-Frame-Options" apps/alex-ai-job-search/next.config.js; then
            print_status "PASS" "Security headers configured in Next.js"
        else
            print_status "FAIL" "Security headers not configured"
        fi
    else
        print_status "FAIL" "Next.js config file missing"
    fi
    
    if [ -f "apps/alex-ai-job-search/src/middleware.ts" ]; then
        print_status "PASS" "Security middleware exists"
    else
        print_status "FAIL" "Security middleware missing"
    fi
}

# Function to check dependencies
check_dependencies() {
    echo ""
    echo "🔍 Checking dependencies for vulnerabilities..."
    
    if command -v npm &> /dev/null; then
        cd apps/alex-ai-job-search
        if npm audit --audit-level=moderate > /dev/null 2>&1; then
            print_status "PASS" "No high-severity vulnerabilities found"
        else
            print_status "WARN" "Vulnerabilities found - run 'npm audit' for details"
        fi
        cd ../..
    else
        print_status "WARN" "npm not available for dependency audit"
    fi
}

# Function to check git configuration
check_git_security() {
    echo ""
    echo "🔍 Checking Git security..."
    
    if [ -f ".gitignore" ]; then
        if grep -q "\.env" .gitignore; then
            print_status "PASS" ".env files are gitignored"
        else
            print_status "FAIL" ".env files not in .gitignore"
        fi
        
        if grep -q "node_modules" .gitignore; then
            print_status "PASS" "node_modules is gitignored"
        else
            print_status "FAIL" "node_modules not in .gitignore"
        fi
    else
        print_status "FAIL" ".gitignore file missing"
    fi
}

# Function to check file permissions
check_file_permissions() {
    echo ""
    echo "🔍 Checking file permissions..."
    
    # Check for overly permissive files
    local permissive_files=$(find . -type f -perm /o+w -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | wc -l)
    
    if [ "$permissive_files" -eq 0 ]; then
        print_status "PASS" "No overly permissive file permissions found"
    else
        print_status "WARN" "$permissive_files files with world-write permissions found"
    fi
}

# Function to generate security report
generate_report() {
    echo ""
    echo "📊 SECURITY AUDIT SUMMARY"
    echo "========================="
    echo "Date: $(date)"
    echo "Repository: $(git remote get-url origin 2>/dev/null || echo 'Not a git repository')"
    echo "Branch: $(git branch --show-current 2>/dev/null || echo 'Not a git repository')"
    echo ""
    echo "Security checks completed. Review any FAIL or WARN items above."
    echo ""
    echo "🔒 Security Recommendations:"
    echo "1. Never commit .env files or API keys"
    echo "2. Use environment variables for all sensitive data"
    echo "3. Regularly update dependencies"
    echo "4. Enable GitHub security features (Dependabot, Code scanning)"
    echo "5. Use HTTPS for all external connections"
    echo "6. Implement proper authentication and authorization"
    echo "7. Monitor for security events and log them"
}

# Main execution
    check_env_files
    check_security_headers
    check_dependencies
    check_git_security
    check_file_permissions
    generate_report
}

# Run the audit
main