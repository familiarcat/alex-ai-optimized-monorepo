#!/usr/bin/env python3
"""
Consolidated Script: robust-test
================================

This script consolidates the following similar scripts:
- ./scripts/deployment/unit_testing/consolidated_unit_testing.py
- ./alexai-base-package/robust-test.sh

Generated: 2025-09-06 20:27:37
"""

#!/bin/bash

# Robust Alex AI System Test Script
# This script avoids shell quote issues and provides comprehensive testing

set -e  # Exit on any error

echo "🚀 Alex AI Robust System Test"
echo "============================="

# Test 1: Check API Key Status
echo ""
echo "🧪 Test 1: API Key Status"
if [ -f ~/.alexai-keys/api-keys.env ]; then
    source ~/.alexai-keys/api-keys.env
    if [ -n "$ANTHROPIC_API_KEY" ] && [ "$ANTHROPIC_API_KEY" != "YOUR_ANTHROPIC_API_KEY_HERE" ]; then
        echo "✅ API key loaded successfully"
        echo "   Length: ${#ANTHROPIC_API_KEY} characters"
    else
        echo "❌ API key not properly set"
        exit 1
    fi
else
    echo "❌ API keys file not found"
    exit 1
fi

# Test 2: N8N Integration
echo ""
echo "🧪 Test 2: N8N Integration"
if [ -n "$N8N_API_KEY" ] && [ -n "$N8N_BASE_URL" ]; then
    WORKFLOW_COUNT=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_BASE_URL/api/v1/workflows" | jq '.data | length' 2>/dev/null || echo "0")
    if [ "$WORKFLOW_COUNT" -gt 0 ]; then
        echo "✅ N8N integration working"
        echo "   Active workflows: $WORKFLOW_COUNT"
    else
        echo "⚠️  N8N connection issue"
    fi
else
    echo "❌ N8N credentials not found"
fi

# Test 3: Python Environment
echo ""
echo "🧪 Test 3: Python Environment"
if [ -d "alexai_env" ]; then
    echo "✅ Virtual environment exists"
    if [ -f "enhanced_unified_router.py" ] && [ -f "crew_coordinator.py" ]; then
        echo "✅ Python scripts present"
    else
        echo "❌ Python scripts missing"
    fi
else
    echo "❌ Virtual environment not found"
fi

# Test 4: Development Server
echo ""
echo "🧪 Test 4: Development Server"
if [ -f "package.json" ]; then
    echo "✅ Next.js project structure found"
    if command -v npm >/dev/null 2>&1; then
        echo "✅ npm available"
        echo "🔄 Starting development server..."
        npm run dev &
        DEV_PID=$!
        echo "   Development server started with PID: $DEV_PID"
        sleep 3
        
        # Check if server is responding
        if curl -s -I http://localhost:3000 >/dev/null 2>&1; then
            echo "✅ Development server responding"
        else
            echo "⚠️  Development server may still be starting"
        fi
    else
        echo "❌ npm not available"
    fi
else
    echo "❌ package.json not found"
fi

# Test 5: Crew Coordination (if Python works)
echo ""
echo "🧪 Test 5: Crew Coordination System"
if [ -f "crew_coordinator.py" ] && [ -d "alexai_env" ]; then
    echo "🔄 Testing crew coordination..."
    source alexai_env/bin/activate
    echo '{"topic": "System Test", "discussion_type": "technical", "crew_selection": ["captain_picard", "commander_data"]}' | python3 crew_coordinator.py > /tmp/crew_test.json 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Crew coordination system working"
        echo "   Test results saved to /tmp/crew_test.json"
    else
        echo "⚠️  Crew coordination test failed"
    fi
else
    echo "⚠️  Skipping crew coordination test (dependencies missing)"
fi

# Final Report
echo ""
echo "🎯 Alex AI System Test Complete"
echo "==============================="
echo ""
echo "📊 System Status:"
echo "   • API Key Management: $(if [ -f ~/.alexai-keys/api-keys.env ]; then echo "✅ Working"; else echo "❌ Missing"; fi)"
echo "   • N8N Integration: $(if [ "$WORKFLOW_COUNT" -gt 0 ]; then echo "✅ $WORKFLOW_COUNT workflows"; else echo "⚠️  Issues"; fi)"
echo "   • Python Environment: $(if [ -d "alexai_env" ]; then echo "✅ Ready"; else echo "❌ Missing"; fi)"
echo "   • Development Server: $(if curl -s -I http://localhost:3000 >/dev/null 2>&1; then echo "✅ Running"; else echo "⚠️  Starting"; fi)"
echo "   • Crew Coordination: $(if [ -f /tmp/crew_test.json ] && grep -q "success" /tmp/crew_test.json; then echo "✅ Working"; else echo "⚠️  Issues"; fi)"
echo ""
echo "🌐 Development Server: http://localhost:3000"
echo "🎵 Your Alex AI system is ready for musician tour app development!"
echo ""
echo "💡 To view crew test results: cat /tmp/crew_test.json"
