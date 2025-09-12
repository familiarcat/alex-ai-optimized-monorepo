#!/bin/bash

# Test script to verify enhanced status display
echo "🧪 Testing Enhanced Status Display"
echo "=================================="
echo ""

# Test the enhanced monorepo status function
echo "Testing enhanced monorepo status:"
source ~/.zshrc
alex_monorepo_status

echo ""
echo "Testing detailed status command:"
if [[ -f "scripts/alex-ai-detailed-status.sh" ]]; then
    chmod +x scripts/alex-ai-detailed-status.sh
    ./scripts/alex-ai-detailed-status.sh quick
else
    echo "Detailed status script not found"
fi

echo ""
echo "✅ Status display test complete"

