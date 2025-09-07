#!/bin/bash

# Security Audit System
# Comprehensive security assessment for Alex AI system

set -euo pipefail

# Configuration
AUDIT_DIR="security-audit-results"
LOG_FILE="${AUDIT_DIR}/security-audit.log"

# Ensure audit directory exists
mkdir -p "$AUDIT_DIR"

# Audit counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# Audit result tracking
audit_result() {
    local check_name="$1"
    local result="$2"
    local details="${3:-}"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    case "$result" in
        "PASS")
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            log "✅ PASS: $check_name"
            ;;
        "FAIL")
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            log "❌ FAIL: $check_name - $details"
            ;;
        "WARN")
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
            log "⚠️  WARN: $check_name - $details"
            ;;
    esac
}

# Check file permissions
check_file_permissions() {
    log "Checking file permissions..."
    
    # Check API key file permissions
    if [[ -f "$HOME/.alexai-keys/api-keys.env" ]]; then
        local perms=$(stat -f "%OLp" "$HOME/.alexai-keys/api-keys.env" 2>/dev/null || echo "000")
        if [[ "$perms" == "600" ]]; then
            audit_result "API Key File Permissions" "PASS"
        else
            audit_result "API Key File Permissions" "FAIL" "Expected 600, got $perms"
        fi
    else
        audit_result "API Key File Permissions" "FAIL" "File does not exist"
    fi
    
    # Check secure directory permissions
    if [[ -d "$HOME/.alexai-keys" ]]; then
        local dir_perms=$(stat -f "%OLp" "$HOME/.alexai-keys" 2>/dev/null || echo "000")
        if [[ "$dir_perms" == "700" ]]; then
            audit_result "Secure Directory Permissions" "PASS"
        else
            audit_result "Secure Directory Permissions" "FAIL" "Expected 700, got $dir_perms"
        fi
    else
        audit_result "Secure Directory Permissions" "FAIL" "Directory does not exist"
    fi
    
    # Check script permissions
    local scripts=(
        "scripts/production-shell-engine.sh"
        "scripts/quick-production-test.sh"
        "scripts/security-audit.sh"
    )
    
    for script in "${scripts[@]}"; do
        if [[ -f "$script" ]]; then
            local script_perms=$(stat -f "%OLp" "$script" 2>/dev/null || echo "000")
            if [[ "$script_perms" == "755" ]]; then
                audit_result "Script Permissions: $(basename "$script")" "PASS"
            else
                audit_result "Script Permissions: $(basename "$script")" "WARN" "Expected 755, got $script_perms"
            fi
        else
            audit_result "Script Permissions: $(basename "$script")" "FAIL" "File does not exist"
        fi
    done
}

# Check for sensitive data exposure
check_sensitive_data() {
    log "Checking for sensitive data exposure..."
    
    # Check for hardcoded API keys in scripts
    local sensitive_patterns=(
        "sk-ant-api"
        "sk-"
        "password"
        "secret"
        "token"
    )
    
    for pattern in "${sensitive_patterns[@]}"; do
        if grep -r "$pattern" scripts/ --exclude-dir=generated --exclude-dir=test-results 2>/dev/null | grep -v "YOUR_.*_HERE" | grep -v "placeholder" >/dev/null; then
            audit_result "Hardcoded Sensitive Data: $pattern" "FAIL" "Found potential sensitive data in scripts"
        else
            audit_result "Hardcoded Sensitive Data: $pattern" "PASS"
        fi
    done
    
    # Check for API keys in git history
    if git log --all --full-history --grep="sk-ant" >/dev/null 2>&1; then
        audit_result "API Keys in Git History" "FAIL" "Found API keys in git history"
    else
        audit_result "API Keys in Git History" "PASS"
    fi
}

# Check environment security
check_environment_security() {
    log "Checking environment security..."
    
    # Check if .env files are in .gitignore
    if grep -q "\.env" .gitignore 2>/dev/null; then
        audit_result "Environment Files in .gitignore" "PASS"
    else
        audit_result "Environment Files in .gitignore" "FAIL" ".env files not ignored"
    fi
    
    # Check for .env files in repository
    if find . -name "*.env" -not -path "./.git/*" | grep -v ".alexai-keys" >/dev/null; then
        audit_result "Environment Files in Repository" "WARN" "Found .env files in repository"
    else
        audit_result "Environment Files in Repository" "PASS"
    fi
    
    # Check for backup files
    if find . -name "*.bak" -o -name "*.backup" -o -name "*~" | grep -v ".git" >/dev/null; then
        audit_result "Backup Files" "WARN" "Found backup files in repository"
    else
        audit_result "Backup Files" "PASS"
    fi
}

# Check API key management
check_api_key_management() {
    log "Checking API key management..."
    
    # Check if API keys are loaded from secure location
    if [[ -f "$HOME/.alexai-keys/manage-keys.sh" ]]; then
        audit_result "API Key Management Script" "PASS"
    else
        audit_result "API Key Management Script" "FAIL" "Management script missing"
    fi
    
    # Check if .zshrc sources secure keys
    if grep -q "source.*alexai-keys" "$HOME/.zshrc" 2>/dev/null; then
        audit_result "Secure Key Loading in .zshrc" "PASS"
    else
        audit_result "Secure Key Loading in .zshrc" "WARN" "Not using secure key loading"
    fi
    
    # Check for API key validation
    if [[ -f "scripts/validate-api-keys.sh" ]]; then
        audit_result "API Key Validation Script" "PASS"
    else
        audit_result "API Key Validation Script" "WARN" "No validation script found"
    fi
}

# Check network security
check_network_security() {
    log "Checking network security..."
    
    # Check for HTTPS usage in API calls
    if grep -r "https://" scripts/ --exclude-dir=generated --exclude-dir=test-results 2>/dev/null | grep -q "api"; then
        audit_result "HTTPS API Usage" "PASS"
    else
        audit_result "HTTPS API Usage" "WARN" "No HTTPS API calls found"
    fi
    
    # Check for HTTP usage (should be minimal)
    if grep -r "http://" scripts/ --exclude-dir=generated --exclude-dir=test-results 2>/dev/null | grep -v "localhost" >/dev/null; then
        audit_result "HTTP Usage" "WARN" "Found HTTP calls (should use HTTPS)"
    else
        audit_result "HTTP Usage" "PASS"
    fi
}

# Check input validation
check_input_validation() {
    log "Checking input validation..."
    
    # Check for input validation in shell scripts
    local validation_patterns=(
        "set -euo pipefail"
        "validate_"
        "check_"
    )
    
    for pattern in "${validation_patterns[@]}"; do
        if grep -r "$pattern" scripts/ --exclude-dir=generated --exclude-dir=test-results 2>/dev/null >/dev/null; then
            audit_result "Input Validation: $pattern" "PASS"
        else
            audit_result "Input Validation: $pattern" "WARN" "Limited input validation found"
        fi
    done
}

# Check error handling
check_error_handling() {
    log "Checking error handling..."
    
    # Check for error handling patterns
    local error_patterns=(
        "trap.*ERR"
        "handle_error"
        "set -e"
    )
    
    for pattern in "${error_patterns[@]}"; do
        if grep -r "$pattern" scripts/ --exclude-dir=generated --exclude-dir=test-results 2>/dev/null >/dev/null; then
            audit_result "Error Handling: $pattern" "PASS"
        else
            audit_result "Error Handling: $pattern" "WARN" "Limited error handling found"
        fi
    done
}

# Generate security report
generate_security_report() {
    local report_file="${AUDIT_DIR}/security-report.md"
    
    cat > "$report_file" << EOF
# Security Audit Report

**Generated:** $(date)
**Audit System:** Security Audit v1.0

## Summary

- **Total Checks:** $TOTAL_CHECKS
- **Passed:** $PASSED_CHECKS
- **Failed:** $FAILED_CHECKS
- **Warnings:** $WARNING_CHECKS
- **Security Score:** $((PASSED_CHECKS * 100 / TOTAL_CHECKS))%

## Detailed Results

EOF

    # Add detailed results from log
    grep -E "(PASS|FAIL|WARN):" "$LOG_FILE" >> "$report_file"
    
    cat >> "$report_file" << EOF

## Recommendations

EOF

    if [[ $FAILED_CHECKS -eq 0 && $WARNING_CHECKS -eq 0 ]]; then
        cat >> "$report_file" << EOF
✅ **Excellent security posture!** All checks passed.

### Next Steps:
1. Continue regular security audits
2. Monitor for new security threats
3. Keep dependencies updated
EOF
    elif [[ $FAILED_CHECKS -eq 0 ]]; then
        cat >> "$report_file" << EOF
⚠️  **Good security posture with warnings.** Address warnings for improved security.

### Action Items:
- Review and address $WARNING_CHECKS warning(s)
- Implement recommended improvements
- Schedule follow-up audit
EOF
    else
        cat >> "$report_file" << EOF
❌ **Security issues found.** Address critical issues immediately.

### Critical Actions:
- Fix $FAILED_CHECKS critical security issue(s)
- Address $WARNING_CHECKS warning(s)
- Implement security improvements
- Re-run security audit
EOF
    fi
    
    log "Security report generated: $report_file"
}

# Main audit execution
main() {
    log "Starting Security Audit"
    log "======================"
    
    # Run all security checks
    check_file_permissions
    check_sensitive_data
    check_environment_security
    check_api_key_management
    check_network_security
    check_input_validation
    check_error_handling
    
    # Generate report
    generate_security_report
    
    # Final summary
    log ""
    log "Security Audit Complete"
    log "======================"
    log "Total Checks: $TOTAL_CHECKS"
    log "Passed: $PASSED_CHECKS"
    log "Failed: $FAILED_CHECKS"
    log "Warnings: $WARNING_CHECKS"
    log "Security Score: $((PASSED_CHECKS * 100 / TOTAL_CHECKS))%"
    
    if [[ $FAILED_CHECKS -eq 0 ]]; then
        log "🔒 Security audit passed! System is secure."
        exit 0
    else
        log "🚨 Security issues found! Review report for details."
        exit 1
    fi
}

# Execute main function
main "$@"
