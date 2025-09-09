#!/bin/bash

# Production Readiness Assessment
# Comprehensive evaluation of system readiness for public release

set -euo pipefail

# Configuration
ASSESSMENT_DIR="production-readiness-results"
LOG_FILE="${ASSESSMENT_DIR}/readiness-assessment.log"

# Ensure assessment directory exists
mkdir -p "$ASSESSMENT_DIR"

# Assessment counters
TOTAL_CRITERIA=0
PASSED_CRITERIA=0
FAILED_CRITERIA=0
WARNING_CRITERIA=0

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# Assessment result tracking
assess_result() {
    local criterion="$1"
    local result="$2"
    local details="${3:-}"
    
    TOTAL_CRITERIA=$((TOTAL_CRITERIA + 1))
    
    case "$result" in
        "PASS")
            PASSED_CRITERIA=$((PASSED_CRITERIA + 1))
            log "✅ PASS: $criterion"
            ;;
        "FAIL")
            FAILED_CRITERIA=$((FAILED_CRITERIA + 1))
            log "❌ FAIL: $criterion - $details"
            ;;
        "WARN")
            WARNING_CRITERIA=$((WARNING_CRITERIA + 1))
            log "⚠️  WARN: $criterion - $details"
            ;;
    esac
}

# 1. Technical Requirements Assessment
assess_technical_requirements() {
    log "Assessing technical requirements..."
    
    # Shell script generation engine
    if [[ -f "scripts/deployment/general/consolidated_general.py" && -x "scripts/deployment/general/consolidated_general.py" ]]; then
        if ./scripts/deployment/general/consolidated_general.py generate "test-readiness.sh" "basic" "$ASSESSMENT_DIR" >/dev/null 2>&1; then
            assess_result "Shell Script Generation Engine" "PASS"
        else
            assess_result "Shell Script Generation Engine" "FAIL" "Engine not functional"
        fi
    else
        assess_result "Shell Script Generation Engine" "FAIL" "Engine not found or not executable"
    fi
    
    # Testing system
    if [[ -f "scripts/deployment/unit_testing/consolidated_unit_testing.py" && -x "scripts/deployment/unit_testing/consolidated_unit_testing.py" ]]; then
        if ./scripts/deployment/unit_testing/consolidated_unit_testing.py >/dev/null 2>&1; then
            assess_result "Testing System" "PASS"
        else
            assess_result "Testing System" "FAIL" "Tests not passing"
        fi
    else
        assess_result "Testing System" "FAIL" "Testing system not found"
    fi
    
    # Error handling
    if grep -r "set -euo pipefail" scripts/ --exclude-dir=generated --exclude-dir=test-results >/dev/null 2>&1; then
        assess_result "Error Handling" "PASS"
    else
        assess_result "Error Handling" "FAIL" "Insufficient error handling"
    fi
    
    # API key management
    if [[ -f "scripts/deployment/api_integration/consolidated_api_integration.py" && -x "scripts/deployment/api_integration/consolidated_api_integration.py" ]]; then
        assess_result "API Key Management" "PASS"
    else
        assess_result "API Key Management" "FAIL" "API key management not implemented"
    fi
}

# 2. Security Assessment
assess_security() {
    log "Assessing security..."
    
    # Security audit system
    if [[ -f "scripts/deployment/general/consolidated_general.py" && -x "scripts/deployment/general/consolidated_general.py" ]]; then
        assess_result "Security Audit System" "PASS"
    else
        assess_result "Security Audit System" "FAIL" "Security audit not available"
    fi
    
    # Secure API key storage
    if [[ -d "$HOME/.alexai-keys" && -f "$HOME/.alexai-keys/api-keys.env" ]]; then
        local key_perms=$(stat -f "%OLp" "$HOME/.alexai-keys/api-keys.env" 2>/dev/null || echo "000")
        if [[ "$key_perms" == "600" ]]; then
            assess_result "Secure API Key Storage" "PASS"
        else
            assess_result "Secure API Key Storage" "FAIL" "Insecure key file permissions: $key_perms"
        fi
    else
        assess_result "Secure API Key Storage" "FAIL" "Secure key storage not configured"
    fi
    
    # Input validation
    if grep -r "validate_" scripts/ --exclude-dir=generated --exclude-dir=test-results >/dev/null 2>&1; then
        assess_result "Input Validation" "PASS"
    else
        assess_result "Input Validation" "WARN" "Limited input validation found"
    fi
    
    # HTTPS usage
    if grep -r "https://" scripts/ --exclude-dir=generated --exclude-dir=test-results >/dev/null 2>&1; then
        assess_result "HTTPS API Usage" "PASS"
    else
        assess_result "HTTPS API Usage" "WARN" "No HTTPS API calls found"
    fi
}

# 3. Documentation Assessment
assess_documentation() {
    log "Assessing documentation..."
    
    # User guide
    if [[ -f "docs/USER_GUIDE.md" ]]; then
        local guide_size=$(wc -l < "docs/USER_GUIDE.md")
        if [[ $guide_size -gt 100 ]]; then
            assess_result "User Documentation" "PASS"
        else
            assess_result "User Documentation" "WARN" "User guide too short: $guide_size lines"
        fi
    else
        assess_result "User Documentation" "FAIL" "User guide not found"
    fi
    
    # Deployment guide
    if [[ -f "docs/DEPLOYMENT_GUIDE.md" ]]; then
        local deploy_size=$(wc -l < "docs/DEPLOYMENT_GUIDE.md")
        if [[ $deploy_size -gt 200 ]]; then
            assess_result "Deployment Documentation" "PASS"
        else
            assess_result "Deployment Documentation" "WARN" "Deployment guide too short: $deploy_size lines"
        fi
    else
        assess_result "Deployment Documentation" "FAIL" "Deployment guide not found"
    fi
    
    # API documentation
    if grep -q "API Reference" docs/USER_GUIDE.md; then
        assess_result "API Documentation" "PASS"
    else
        assess_result "API Documentation" "WARN" "API documentation incomplete"
    fi
    
    # Troubleshooting guide
    if grep -q "Troubleshooting" docs/USER_GUIDE.md; then
        assess_result "Troubleshooting Documentation" "PASS"
    else
        assess_result "Troubleshooting Documentation" "WARN" "Troubleshooting guide missing"
    fi
}

# 4. Performance Assessment
assess_performance() {
    log "Assessing performance..."
    
    # Shell script generation performance
    local start_time=$(date +%s)
    if ./scripts/deployment/general/consolidated_general.py batch "$ASSESSMENT_DIR" >/dev/null 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        if [[ $duration -lt 10 ]]; then
            assess_result "Shell Script Generation Performance" "PASS" "Completed in ${duration}s"
        else
            assess_result "Shell Script Generation Performance" "WARN" "Slow performance: ${duration}s"
        fi
    else
        assess_result "Shell Script Generation Performance" "FAIL" "Performance test failed"
    fi
    
    # Next.js build performance
    if [[ -f "package.json" ]]; then
        local start_time=$(date +%s)
        if npm run build >/dev/null 2>&1; then
            local end_time=$(date +%s)
            local duration=$((end_time - start_time))
            
            if [[ $duration -lt 60 ]]; then
                assess_result "Next.js Build Performance" "PASS" "Built in ${duration}s"
            else
                assess_result "Next.js Build Performance" "WARN" "Slow build: ${duration}s"
            fi
        else
            assess_result "Next.js Build Performance" "FAIL" "Build failed"
        fi
    else
        assess_result "Next.js Build Performance" "FAIL" "package.json not found"
    fi
}

# 5. Integration Assessment
assess_integration() {
    log "Assessing integration..."
    
    # Alex AI integration
    if [[ -d ".alexai" ]]; then
        assess_result "Alex AI Integration" "PASS"
    else
        assess_result "Alex AI Integration" "WARN" "Alex AI not initialized"
    fi
    
    # Python environment
    if [[ -d "alexai_env" ]]; then
        assess_result "Python Environment" "PASS"
    else
        assess_result "Python Environment" "WARN" "Python environment not set up"
    fi
    
    # N8N workflow configuration
    if [[ -f "n8n-shell-validation-workflow.json" ]]; then
        assess_result "N8N Workflow Configuration" "PASS"
    else
        assess_result "N8N Workflow Configuration" "WARN" "N8N workflow not configured"
    fi
    
    # Cursor AI integration
    if [[ -f "scripts/cursor-ai-shell-helper.sh" ]]; then
        assess_result "Cursor AI Integration" "PASS"
    else
        assess_result "Cursor AI Integration" "WARN" "Cursor AI integration incomplete"
    fi
}

# 6. Support System Assessment
assess_support_system() {
    log "Assessing support system..."
    
    # Logging system
    if find scripts/ -name "*.log" -o -name "*log*" | head -1 >/dev/null 2>&1; then
        assess_result "Logging System" "PASS"
    else
        assess_result "Logging System" "WARN" "Limited logging found"
    fi
    
    # Error reporting
    if grep -r "ERROR\|error" scripts/ --exclude-dir=generated --exclude-dir=test-results >/dev/null 2>&1; then
        assess_result "Error Reporting" "PASS"
    else
        assess_result "Error Reporting" "WARN" "Limited error reporting"
    fi
    
    # Help system
    if grep -r "help\|usage" scripts/ --exclude-dir=generated --exclude-dir=test-results >/dev/null 2>&1; then
        assess_result "Help System" "PASS"
    else
        assess_result "Help System" "WARN" "Limited help system"
    fi
}

# Generate readiness report
generate_readiness_report() {
    local report_file="${ASSESSMENT_DIR}/readiness-report.md"
    
    cat > "$report_file" << EOF
# Production Readiness Assessment Report

**Generated:** $(date)
**Assessment System:** Production Readiness v1.0

## Executive Summary

- **Total Criteria:** $TOTAL_CRITERIA
- **Passed:** $PASSED_CRITERIA
- **Failed:** $FAILED_CRITERIA
- **Warnings:** $WARNING_CRITERIA
- **Readiness Score:** $((PASSED_CRITERIA * 100 / TOTAL_CRITERIA))%

## Assessment Results

EOF

    # Add detailed results from log
    grep -E "(PASS|FAIL|WARN):" "$LOG_FILE" >> "$report_file"
    
    cat >> "$report_file" << EOF

## Production Readiness Recommendation

EOF

    local readiness_score=$((PASSED_CRITERIA * 100 / TOTAL_CRITERIA))
    
    if [[ $readiness_score -ge 90 && $FAILED_CRITERIA -eq 0 ]]; then
        cat >> "$report_file" << EOF
🎉 **PRODUCTION READY** - System meets all critical requirements for public release.

### Status: APPROVED FOR PRODUCTION
- All critical systems functional
- Security requirements met
- Documentation complete
- Performance acceptable
- Support systems in place

### Next Steps:
1. Deploy to staging environment
2. Conduct user acceptance testing
3. Prepare marketing materials
4. Launch to public
EOF
    elif [[ $readiness_score -ge 80 && $FAILED_CRITERIA -le 2 ]]; then
        cat >> "$report_file" << EOF
⚠️  **NEARLY READY** - System is close to production readiness with minor issues.

### Status: CONDITIONAL APPROVAL
- Most systems functional
- Minor issues to address
- Documentation mostly complete
- Performance acceptable

### Action Items:
- Address $FAILED_CRITERIA critical issue(s)
- Review $WARNING_CRITERIA warning(s)
- Complete missing documentation
- Re-run assessment
EOF
    elif [[ $readiness_score -ge 70 ]]; then
        cat >> "$report_file" << EOF
🔧 **NEEDS WORK** - System requires significant improvements before production.

### Status: NOT READY FOR PRODUCTION
- Several systems need attention
- Multiple issues to resolve
- Documentation incomplete
- Performance concerns

### Critical Actions:
- Fix $FAILED_CRITERIA critical issue(s)
- Address $WARNING_CRITERIA warning(s)
- Complete documentation
- Improve performance
- Re-run assessment
EOF
    else
        cat >> "$report_file" << EOF
❌ **NOT READY** - System is not suitable for production release.

### Status: REJECTED FOR PRODUCTION
- Major systems non-functional
- Critical security issues
- Insufficient documentation
- Poor performance

### Required Actions:
- Complete system development
- Fix all critical issues
- Implement security measures
- Create comprehensive documentation
- Achieve acceptable performance
- Re-run assessment
EOF
    fi
    
    log "Readiness report generated: $report_file"
}

# Main assessment execution
main() {
    log "Starting Production Readiness Assessment"
    log "======================================="
    
    # Run all assessments
    assess_technical_requirements
    assess_security
    assess_documentation
    assess_performance
    assess_integration
    assess_support_system
    
    # Generate report
    generate_readiness_report
    
    # Final summary
    log ""
    log "Production Readiness Assessment Complete"
    log "======================================="
    log "Total Criteria: $TOTAL_CRITERIA"
    log "Passed: $PASSED_CRITERIA"
    log "Failed: $FAILED_CRITERIA"
    log "Warnings: $WARNING_CRITERIA"
    log "Readiness Score: $((PASSED_CRITERIA * 100 / TOTAL_CRITERIA))%"
    
    local readiness_score=$((PASSED_CRITERIA * 100 / TOTAL_CRITERIA))
    
    if [[ $readiness_score -ge 90 && $FAILED_CRITERIA -eq 0 ]]; then
        log "🎉 SYSTEM IS PRODUCTION READY!"
        exit 0
    elif [[ $readiness_score -ge 80 && $FAILED_CRITERIA -le 2 ]]; then
        log "⚠️  System is nearly ready. Address minor issues."
        exit 1
    else
        log "❌ System is not ready for production. Significant work needed."
        exit 1
    fi
}

# Execute main function
main "$@"
