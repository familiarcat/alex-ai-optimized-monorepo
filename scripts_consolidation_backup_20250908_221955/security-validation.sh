#!/bin/bash

# Security Validation Script
# Validates workflow security and compliance

set -e

# Configuration
WORKFLOWS_DIR="workflows"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check for hardcoded credentials
check_hardcoded_credentials() {
    log_info "Checking for hardcoded credentials..."
    
    local found_issues=false
    
    # Check for common credential patterns
    local patterns=(
        "api_key"
        "password"
        "secret"
        "token"
        "auth"
        "credential"
    )
    
    for pattern in "${patterns[@]}"; do
        if grep -r -i "$pattern" "$WORKFLOWS_DIR"/*.json | grep -v "genericCredentialType" | grep -v "authentication"; then
            log_error "Potential hardcoded credential found: $pattern"
            found_issues=true
        fi
    done
    
    if [ "$found_issues" = false ]; then
        log_success "No hardcoded credentials found"
    else
        log_error "Hardcoded credentials detected"
        return 1
    fi
}

# Validate authentication methods
validate_authentication() {
    log_info "Validating authentication methods..."
    
    local found_issues=false
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            
            # Check for insecure authentication
            local insecure_auth=$(jq -r '.nodes[] | select(.parameters.authentication and .parameters.authentication != "genericCredentialType") | .parameters.authentication' "$workflow_file" 2>/dev/null)
            
            if [ -n "$insecure_auth" ] && [ "$insecure_auth" != "null" ]; then
                log_error "Insecure authentication method found in $workflow_name: $insecure_auth"
                found_issues=true
            fi
        fi
    done
    
    if [ "$found_issues" = false ]; then
        log_success "All authentication methods are secure"
    else
        log_error "Insecure authentication methods detected"
        return 1
    fi
}

# Check for dangerous commands
check_dangerous_commands() {
    log_info "Checking for dangerous commands..."
    
    local found_issues=false
    local dangerous_commands=(
        "rm"
        "del"
        "format"
        "fdisk"
        "mkfs"
        "dd"
        "shutdown"
        "reboot"
        "halt"
    )
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            
            for cmd in "${dangerous_commands[@]}"; do
                if jq -r '.nodes[] | select(.type == "n8n-nodes-base.executeCommand") | .parameters.command' "$workflow_file" 2>/dev/null | grep -q "$cmd"; then
                    log_error "Dangerous command found in $workflow_name: $cmd"
                    found_issues=true
                fi
            done
        fi
    done
    
    if [ "$found_issues" = false ]; then
        log_success "No dangerous commands found"
    else
        log_error "Dangerous commands detected"
        return 1
    fi
}

# Validate URL security
validate_url_security() {
    log_info "Validating URL security..."
    
    local found_issues=false
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            
            # Check for HTTP URLs (should use HTTPS)
            local http_urls=$(jq -r '.nodes[] | select(.parameters.url) | .parameters.url' "$workflow_file" 2>/dev/null | grep -E "^http://" || true)
            
            if [ -n "$http_urls" ]; then
                log_warning "HTTP URLs found in $workflow_name (consider using HTTPS):"
                echo "$http_urls" | while read -r url; do
                    log_warning "  - $url"
                done
            fi
            
            # Check for localhost URLs in production
            local localhost_urls=$(jq -r '.nodes[] | select(.parameters.url) | .parameters.url' "$workflow_file" 2>/dev/null | grep -E "localhost|127\.0\.0\.1" || true)
            
            if [ -n "$localhost_urls" ]; then
                log_error "Localhost URLs found in $workflow_name (not suitable for production):"
                echo "$localhost_urls" | while read -r url; do
                    log_error "  - $url"
                done
                found_issues=true
            fi
        fi
    done
    
    if [ "$found_issues" = false ]; then
        log_success "URL security validation passed"
    else
        log_error "URL security issues detected"
        return 1
    fi
}

# Check for sensitive data exposure
check_sensitive_data() {
    log_info "Checking for sensitive data exposure..."
    
    local found_issues=false
    local sensitive_patterns=(
        "ssn"
        "social_security"
        "credit_card"
        "bank_account"
        "private_key"
        "personal_data"
    )
    
    for pattern in "${sensitive_patterns[@]}"; do
        if grep -r -i "$pattern" "$WORKFLOWS_DIR"/*.json; then
            log_warning "Potential sensitive data pattern found: $pattern"
            found_issues=true
        fi
    done
    
    if [ "$found_issues" = false ]; then
        log_success "No sensitive data patterns found"
    else
        log_warning "Potential sensitive data patterns detected"
    fi
}

# Validate workflow permissions
validate_workflow_permissions() {
    log_info "Validating workflow permissions..."
    
    local found_issues=false
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            
            # Check for file system access
            local file_operations=$(jq -r '.nodes[] | select(.type == "n8n-nodes-base.readFile" or .type == "n8n-nodes-base.writeFile") | .name' "$workflow_file" 2>/dev/null)
            
            if [ -n "$file_operations" ]; then
                log_warning "File system operations found in $workflow_name:"
                echo "$file_operations" | while read -r operation; do
                    log_warning "  - $operation"
                done
            fi
            
            # Check for database access
            local db_operations=$(jq -r '.nodes[] | select(.type | contains("database") or contains("sql")) | .name' "$workflow_file" 2>/dev/null)
            
            if [ -n "$db_operations" ]; then
                log_info "Database operations found in $workflow_name (ensure proper access controls):"
                echo "$db_operations" | while read -r operation; do
                    log_info "  - $operation"
                done
            fi
        fi
    done
    
    log_success "Workflow permissions validation completed"
}

# Main security validation function
main() {
    echo "🔒 Starting security validation..."
    echo ""
    
    local total_checks=0
    local passed_checks=0
    local failed_checks=0
    
    # Run all security checks
    local checks=(
        "check_hardcoded_credentials"
        "validate_authentication"
        "check_dangerous_commands"
        "validate_url_security"
        "check_sensitive_data"
        "validate_workflow_permissions"
    )
    
    for check in "${checks[@]}"; do
        echo "Running: $check"
        echo "----------------------------------------"
        
        ((total_checks++))
        
        if $check; then
            log_success "Security check passed: $check"
            ((passed_checks++))
        else
            log_error "Security check failed: $check"
            ((failed_checks++))
        fi
        
        echo ""
    done
    
    # Summary
    echo "📊 Security Validation Summary:"
    echo "   Total checks: $total_checks"
    echo "   ✅ Passed: $passed_checks"
    echo "   ❌ Failed: $failed_checks"
    
    if [ $failed_checks -gt 0 ]; then
        log_error "Security validation failed"
        exit 1
    else
        log_success "All security checks passed!"
    fi
}

# Run main function
main "$@"
