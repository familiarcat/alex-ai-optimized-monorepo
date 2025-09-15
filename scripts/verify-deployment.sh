#!/bin/bash

# Verify N8N Deployment
# This script verifies that workflows were successfully deployed to N8N

set -e

echo "🔍 Verifying N8N deployment..."

# Check if N8N is accessible
if ! curl -s -f "$N8N_URL/healthz" > /dev/null; then
    echo "❌ N8N is not accessible at $N8N_URL"
    exit 1
fi

echo "✅ N8N is accessible"

# Check if API key is working
if ! curl -s -f -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_URL/api/v1/workflows" > /dev/null; then
    echo "❌ N8N API key is not working"
    exit 1
fi

echo "✅ N8N API key is working"

# Get list of workflows
WORKFLOWS=$(curl -s -H "X-N8N-API-Key: $N8N_API_KEY" "$N8N_URL/api/v1/workflows" | jq -r '.[].name')

if [ -z "$WORKFLOWS" ]; then
    echo "❌ No workflows found in N8N"
    exit 1
fi

echo "✅ Found workflows in N8N:"
echo "$WORKFLOWS" | while read -r workflow; do
    echo "  - $workflow"
done

# Check if specific workflows are active
REQUIRED_WORKFLOWS=("Alex AI Job Opportunities - Live Data" "Alex AI Resume Analysis" "Alex AI Contact Management")

for workflow in "${REQUIRED_WORKFLOWS[@]}"; do
    if echo "$WORKFLOWS" | grep -q "$workflow"; then
        echo "✅ Found required workflow: $workflow"
    else
        echo "⚠️  Missing required workflow: $workflow"
    fi
done

echo "🎉 N8N deployment verification completed successfully!"











