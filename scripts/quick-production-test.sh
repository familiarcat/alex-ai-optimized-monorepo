#!/bin/bash

# Quick Production Test
# Focused testing on critical production issues

set -euo pipefail

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test result tracking
test_result() {
    local test_name="$1"
    local result="$2"
    local details="${3:-}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [[ "$result" == "PASS" ]]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        printf '%s\n' "✅ PASS: $test_name"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        printf '%s\n' "❌ FAIL: $test_name - $details"
    fi
}

# Test 1: Shell Script Generation
test_shell_generation() {
    local test_dir="test-output"
    mkdir -p "$test_dir"
    
    # Generate a test script
    if ./scripts/deployment/general/consolidated_general.py generate "quick-test.sh" "basic" "$test_dir" >/dev/null 2>&1; then
        test_result "Shell Script Generation" "PASS"
    else
        test_result "Shell Script Generation" "FAIL" "Failed to generate script"
        return 1
    fi
    
    # Test script execution
    local test_script="$test_dir/quick-test.sh"
    if "$test_script" >/dev/null 2>&1; then
        test_result "Generated Script Execution" "PASS"
    else
        test_result "Generated Script Execution" "FAIL" "Script failed to execute"
        return 1
    fi
    
    # Cleanup
    rm -rf "$test_dir"
}

# Test 2: API Key Security
test_api_security() {
    printf '%s\n' "Testing API key security..."
    
    # Check secure directory exists
    if [[ -d "$HOME/.alexai-keys" ]]; then
        test_result "Secure Key Directory" "PASS"
    else
        test_result "Secure Key Directory" "FAIL" "Directory missing"
        return 1
    fi
    
    # Check file permissions
    if [[ -f "$HOME/.alexai-keys/api-keys.env" ]]; then
        local perms=$(stat -f "%OLp" "$HOME/.alexai-keys/api-keys.env" 2>/dev/null || echo "000")
        if [[ "$perms" == "600" ]]; then
            test_result "API Key File Permissions" "PASS"
        else
            test_result "API Key File Permissions" "FAIL" "Expected 600, got $perms"
            return 1
        fi
    else
        test_result "API Key File" "FAIL" "File missing"
        return 1
    fi
}

# Test 3: Next.js Application
test_nextjs() {
    printf '%s\n' "Testing Next.js application..."
    
    # Check package.json
    if [[ -f "package.json" ]]; then
        test_result "Package.json" "PASS"
    else
        test_result "Package.json" "FAIL" "Missing package.json"
        return 1
    fi
    
    # Check node_modules
    if [[ -d "node_modules" ]]; then
        test_result "Node Modules" "PASS"
    else
        test_result "Node Modules" "FAIL" "Missing node_modules"
        return 1
    fi
}

# Test 4: Error Handling
test_error_handling() {
    # Test invalid input
    if ! ./scripts/deployment/general/consolidated_general.py generate "invalid" "basic" 2>/dev/null; then
        test_result "Invalid Input Handling" "PASS"
    else
        test_result "Invalid Input Handling" "FAIL" "Should reject invalid input"
        return 1
    fi
}

# Test 5: Performance
test_performance() {
    local start_time=$(date +%s)
    
    # Quick batch test
    local test_dir="perf-test"
    mkdir -p "$test_dir"
    
    if ./scripts/deployment/general/consolidated_general.py batch "$test_dir" >/dev/null 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        if [[ $duration -lt 5 ]]; then
            test_result "Performance Test" "PASS" "Completed in ${duration}s"
        else
            test_result "Performance Test" "FAIL" "Too slow: ${duration}s"
            return 1
        fi
    else
        test_result "Performance Test" "FAIL" "Batch generation failed"
        return 1
    fi
    
    # Cleanup
    rm -rf "$test_dir"
}

# Main execution
main() {
    printf '%s\n' "===================="
    printf '%s\n' "Alex AI Production Test"
    printf '%s\n' "===================="
    printf '%s\n' ""
    
    # Run tests
    test_shell_generation
    test_api_security
    test_nextjs
    test_error_handling
    test_performance
    
    # Summary
    printf '%s\n' ""
    printf '%s\n' "Test Summary"
    printf '%s\n' "==========="
    printf '%s\n' "Total Tests: $TOTAL_TESTS"
    printf '%s\n' "Passed: $PASSED_TESTS"
    printf '%s\n' "Failed: $FAILED_TESTS"
    printf '%s\n' "Success Rate: $((PASSED_TESTS * 100 / TOTAL_TESTS))%"
    
    if [[ $FAILED_TESTS -eq 0 ]]; then
        printf '%s\n' ""
        printf '%s\n' "🎉 All tests passed! Core system is functional."
        exit 0
    else
        printf '%s\n' ""
        printf '%s\n' "⚠️  $FAILED_TESTS test(s) failed. Address issues before production."
        exit 1
    fi
}

# Execute
main "$@"
