#!/bin/bash

# Shell Safety Guide for Alex AI Scripts
# This script demonstrates best practices to avoid shell quote issues

echo "🛡️  Alex AI Shell Safety Guide"
echo "=============================="
echo ""

echo "❌ COMMON SHELL QUOTE ISSUES:"
echo "   • Unclosed quotes in echo statements"
echo "   • Nested quotes without proper escaping"
echo "   • Complex strings with special characters"
echo "   • Multi-line commands with quotes"
echo ""

echo "✅ BEST PRACTICES:"
echo ""

echo "1. Use single quotes for simple strings:"
echo "   echo 'Simple string without issues'"
echo ""

echo "2. Use printf for complex formatting:"
echo "   printf 'Complex string with %s and %s\n' 'variables' 'formatting'"
echo ""

echo "3. Use here-documents for multi-line content:"
echo "   cat << 'EOF'"
echo "   Multi-line content"
echo "   with no quote issues"
echo "   EOF"
echo ""

echo "4. Use arrays for complex data:"
echo "   declare -a messages=("
echo "       'Message 1'"
echo "       'Message 2'"
echo "       'Message 3'"
echo "   )"
echo ""

echo "5. Use functions to encapsulate complex logic:"
echo "   test_system() {"
echo "       local message='Safe message'"
echo "       echo \"\$message\""
echo "   }"
echo ""

echo "6. Always use set -e for error handling:"
echo "   set -e  # Exit on any error"
echo ""

echo "7. Use proper quoting in variable assignments:"
echo "   local var=\"\$USER\"  # Double quotes for variable expansion"
echo "   local var='\$USER'   # Single quotes for literal text"
echo ""

echo "🔧 QUICK FIXES FOR COMMON ISSUES:"
echo ""

echo "• If you see 'dquote>' prompt:"
echo "  - Press Ctrl+C to cancel"
echo "  - Check for unclosed quotes"
echo "  - Use the robust-test.sh script instead"
echo ""

echo "• For complex echo statements:"
echo "  - Use printf instead of echo"
echo "  - Use here-documents for multi-line"
echo "  - Break into multiple simple commands"
echo ""

echo "• For API calls with JSON:"
echo "  - Use jq for JSON processing"
echo "  - Store JSON in files, not command line"
echo "  - Use curl with proper escaping"
echo ""

echo "🎯 RECOMMENDED APPROACH:"
echo "   Use the robust-test.sh script for all system testing"
echo "   It handles all these issues automatically!"
echo ""

echo "✅ Your Alex AI system is now protected from shell quote issues!"
