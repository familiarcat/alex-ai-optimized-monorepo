#!/bin/bash
# String validation system for Alex AI

validate_strings() {
    local file="$1"
    local issues=0
    
    echo "Validating: $file"
    
    # Check for problematic echo patterns
    if grep -q 'echo.*".*$' "$file" && grep -A1 'echo.*".*$' "$file" | grep -q 'echo'; then
        echo "  ❌ Multi-line echo detected"
        issues=$((issues + 1))
    fi
    
    # Check for unclosed quotes
    if grep -q 'echo.*"[^"]*$' "$file"; then
        echo "  ❌ Unclosed quote detected"
        issues=$((issues + 1))
    fi
    
    # Check for complex quote mixing
    if grep -q 'echo.*".*".*"' "$file"; then
        echo "  ❌ Complex quote mixing detected"
        issues=$((issues + 1))
    fi
    
    if [ $issues -eq 0 ]; then
        echo "  ✅ No string issues found"
    else
        echo "  ⚠️  Found $issues string issues"
    fi
    
    return $issues
}

# Validate all scripts
    
    find scripts/ -name "*.sh" -type f | while read script; do
        validate_strings "$script"
        total_issues=$((total_issues + $?))
    done
    
    if [ $total_issues -eq 0 ]; then
        echo "✅ All scripts validated - no string issues found"
    else
        echo "⚠️  Found $total_issues total string issues"
    fi
}

main "$@"
