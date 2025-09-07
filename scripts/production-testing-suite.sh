#!/bin/bash

# Production Testing Suite
# Comprehensive testing for Alex AI system

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_RESULTS_DIR="${SCRIPT_DIR}/test-results"
LOG_FILE="${TEST_RESULTS_DIR}/test-suite.log"

# Ensure test results directory exists
mkdir -p "$TEST_RESULTS_DIR"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# Test result tracking
test_result() {
    local test_name="$1"
    local result="$2"
    local details="${3:-}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [[ "$result" == "PASS" ]]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        log "✅ PASS: $test_name"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log "❌ FAIL: $test_name - $details"
    fi
}

# Test shell script generation
test_shell_generation() {
    log "Testing shell script generation..."
    
    local test_script="${TEST_RESULTS_DIR}/test-generated.sh"
    
    # Test basic script generation
    if ./scripts/production-shell-engine.sh generate "test-generated.sh" "basic" "$TEST_RESULTS_DIR"; then
        test_result "Shell Script Generation" "PASS"
    else
        test_result "Shell Script Generation" "FAIL" "Failed to generate basic script"
        return 1
    fi
    
    # Test script execution
    if "$test_script" >/dev/null 2>&1; then
        test_result "Generated Script Execution" "PASS"
    else
        test_result "Generated Script Execution" "FAIL" "Generated script failed to execute"
        return 1
    fi
    
    # Test script validation
    if [[ -x "$test_script" ]]; then
        test_result "Script Permissions" "PASS"
    else
        test_result "Script Permissions" "FAIL" "Script is not executable"
        return 1
    fi
}

# Test API key management
test_api_key_management() {
    log "Testing API key management..."
    
    # Test secure key directory exists
    if [[ -d "$HOME/.alexai-keys" ]]; then
        test_result "Secure Key Directory" "PASS"
    else
        test_result "Secure Key Directory" "FAIL" "Secure key directory does not exist"
        return 1
    fi
    
    # Test API key file exists
    if [[ -f "$HOME/.alexai-keys/api-keys.env" ]]; then
        test_result "API Key File" "PASS"
    else
        test_result "API Key File" "FAIL" "API key file does not exist"
        return 1
    fi
    
    # Test API key file permissions
    local key_file_perms=$(stat -f "%OLp" "$HOME/.alexai-keys/api-keys.env" 2>/dev/null || echo "000")
    if [[ "$key_file_perms" == "600" ]]; then
        test_result "API Key File Permissions" "PASS"
    else
        test_result "API Key File Permissions" "FAIL" "Expected 600, got $key_file_perms"
        return 1
    fi
    
    # Test key loading
    if source "$HOME/.alexai-keys/manage-keys.sh" 2>/dev/null; then
        test_result "API Key Loading" "PASS"
    else
        test_result "API Key Loading" "FAIL" "Failed to load API keys"
        return 1
    fi
}

# Test Claude API connectivity
test_claude_api() {
    log "Testing Claude API connectivity..."
    
    # Load API keys
    source "$HOME/.alexai-keys/manage-keys.sh" 2>/dev/null || true
    
    # Test API key format
    if [[ -n "${ANTHROPIC_API_KEY:-}" && ${#ANTHROPIC_API_KEY} -gt 50 ]]; then
        test_result "API Key Format" "PASS"
    else
        test_result "API Key Format" "FAIL" "API key is missing or too short"
        return 1
    fi
    
    # Test API connectivity
    local api_response
    if api_response=$(curl -s -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"model":"claude-3-haiku-20240307","max_tokens":10,"messages":[{"role":"user","content":"test"}]}' \
        https://api.anthropic.com/v1/messages 2>/dev/null); then
        
        if echo "$api_response" | grep -q "content"; then
            test_result "Claude API Connectivity" "PASS"
        else
            test_result "Claude API Connectivity" "FAIL" "API response invalid: $api_response"
            return 1
        fi
    else
        test_result "Claude API Connectivity" "FAIL" "API request failed"
        return 1
    fi
}

# Test Next.js application
test_nextjs_app() {
    log "Testing Next.js application..."
    
    # Test package.json exists
    if [[ -f "package.json" ]]; then
        test_result "Package.json Exists" "PASS"
    else
        test_result "Package.json Exists" "FAIL" "package.json not found"
        return 1
    fi
    
    # Test node_modules exists
    if [[ -d "node_modules" ]]; then
        test_result "Node Modules" "PASS"
    else
        test_result "Node Modules" "FAIL" "node_modules not found"
        return 1
    fi
    
    # Test Next.js build
    if npm run build >/dev/null 2>&1; then
        test_result "Next.js Build" "PASS"
    else
        test_result "Next.js Build" "FAIL" "Build failed"
        return 1
    fi
    
    # Test .next directory created
    if [[ -d ".next" ]]; then
        test_result "Next.js Output Directory" "PASS"
    else
        test_result "Next.js Output Directory" "FAIL" ".next directory not created"
        return 1
    fi
}

# Test Alex AI integration
test_alexai_integration() {
    log "Testing Alex AI integration..."
    
    # Test Alex AI directory exists
    if [[ -d ".alexai" ]]; then
        test_result "Alex AI Directory" "PASS"
    else
        test_result "Alex AI Directory" "FAIL" ".alexai directory not found"
        return 1
    fi
    
    # Test crew coordinator exists
    if [[ -f "crew_coordinator.py" ]]; then
        test_result "Crew Coordinator" "PASS"
    else
        test_result "Crew Coordinator" "FAIL" "crew_coordinator.py not found"
        return 1
    fi
    
    # Test enhanced router exists
    if [[ -f "enhanced_unified_router.py" ]]; then
        test_result "Enhanced Router" "PASS"
    else
        test_result "Enhanced Router" "FAIL" "enhanced_unified_router.py not found"
        return 1
    fi
    
    # Test Python environment
    if [[ -d "alexai_env" ]]; then
        test_result "Python Environment" "PASS"
    else
        test_result "Python Environment" "FAIL" "Python virtual environment not found"
        return 1
    fi
}

# Test error handling
test_error_handling() {
    log "Testing error handling..."
    
    # Test invalid script generation
    if ! ./scripts/production-shell-engine.sh generate "invalid-name" "basic" 2>/dev/null; then
        test_result "Invalid Input Handling" "PASS"
    else
        test_result "Invalid Input Handling" "FAIL" "Should have failed with invalid input"
        return 1
    fi
    
    # Test missing file handling
    if ! ./scripts/production-shell-engine.sh test "nonexistent.sh" 2>/dev/null; then
        test_result "Missing File Handling" "PASS"
    else
        test_result "Missing File Handling" "FAIL" "Should have failed with missing file"
        return 1
    fi
}

# Test performance
test_performance() {
    log "Testing performance..."
    
    local start_time=$(date +%s)
    
    # Test batch script generation performance
    if ./scripts/production-shell-engine.sh batch "$TEST_RESULTS_DIR" >/dev/null 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        if [[ $duration -lt 10 ]]; then
            test_result "Performance Test" "PASS" "Completed in ${duration}s"
        else
            test_result "Performance Test" "FAIL" "Too slow: ${duration}s"
            return 1
        fi
    else
        test_result "Performance Test" "FAIL" "Batch generation failed"
        return 1
    fi
}

# Generate test report
generate_test_report() {
    local report_file="${TEST_RESULTS_DIR}/test-report.md"
    
    cat > "$report_file" << EOF
# Alex AI System Test Report

**Generated:** $(date)
**Test Suite:** Production Testing Suite v1.0

## Test Summary

- **Total Tests:** $TOTAL_TESTS
- **Passed:** $PASSED_TESTS
- **Failed:** $FAILED_TESTS
- **Success Rate:** $((PASSED_TESTS * 100 / TOTAL_TESTS))%

## Test Results

EOF

    # Add detailed results from log
    grep -E "(PASS|FAIL):" "$LOG_FILE" >> "$report_file"
    
    cat >> "$report_file" << EOF

## Recommendations

EOF

    if [[ $FAILED_TESTS -eq 0 ]]; then
        cat >> "$report_file" << EOF
✅ **All tests passed!** The system is ready for production deployment.

### Next Steps:
1. Deploy to staging environment
2. Conduct user acceptance testing
3. Prepare for production release
EOF
    else
        cat >> "$report_file" << EOF
❌ **$FAILED_TESTS test(s) failed.** Address the following issues before production:

### Critical Issues:
- Review failed tests above
- Fix identified problems
- Re-run test suite
- Consider additional testing
EOF
    fi
    
    log "Test report generated: $report_file"
}

# Main test execution
main() {
    log "Starting Production Testing Suite"
    log "================================="
    
    # Run all test suites
    test_shell_generation
    test_api_key_management
    test_claude_api
    test_nextjs_app
    test_alexai_integration
    test_error_handling
    test_performance
    
    # Generate report
    generate_test_report
    
    # Final summary
    log ""
    log "Testing Complete"
    log "==============="
    log "Total Tests: $TOTAL_TESTS"
    log "Passed: $PASSED_TESTS"
    log "Failed: $FAILED_TESTS"
    log "Success Rate: $((PASSED_TESTS * 100 / TOTAL_TESTS))%"
    
    if [[ $FAILED_TESTS -eq 0 ]]; then
        log "🎉 All tests passed! System is production-ready."
        exit 0
    else
        log "⚠️  $FAILED_TESTS test(s) failed. Review test report for details."
        exit 1
    fi
}

# Execute main function
main "$@"
