#!/bin/bash

# Deploy N8N Webhooks for Alex AI
# This script deploys the webhook workflows to n8n.pbradygeorgen.com

set -e

echo "🚀 Deploying N8N Webhooks for Alex AI"
echo "====================================="

# Load credentials
echo "🔐 Loading credentials..."
source ./scripts/deployment/general/consolidated_general.py

# Check if N8N credentials are available
if [ -z "$N8N_API_KEY" ]; then
    echo "❌ N8N_API_KEY not found in credentials"
    echo "Please add N8N_API_KEY to your ~/.zshrc file"
    exit 1
fi

N8N_BASE_URL="https://n8n.pbradygeorgen.com"
N8N_API_URL="$N8N_BASE_URL/api/v1"

echo "📡 N8N API URL: $N8N_API_URL"

# Function to deploy a workflow
deploy_workflow() {
    local workflow_file="$1"
    local workflow_name=$(basename "$workflow_file" .json)
    
    echo "📦 Deploying workflow: $workflow_name"
    
    # Check if workflow exists
    local existing_workflow=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_API_URL/workflows" | \
        jq -r ".data[] | select(.name == \"$workflow_name\") | .id")
    
    if [ -n "$existing_workflow" ] && [ "$existing_workflow" != "null" ]; then
        echo "🔄 Updating existing workflow: $existing_workflow"
        
        # Update existing workflow
        local response=$(curl -s -X PUT \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d @"$workflow_file" \
            "$N8N_API_URL/workflows/$existing_workflow")
        
        local workflow_id=$(echo "$response" | jq -r '.id')
        
        if [ "$workflow_id" != "null" ] && [ -n "$workflow_id" ]; then
            echo "✅ Workflow updated successfully: $workflow_id"
            
            # Activate the workflow
            echo "🟢 Activating workflow..."
            local activate_response=$(curl -s -X POST \
                -H "X-N8N-API-KEY: $N8N_API_KEY" \
                "$N8N_API_URL/workflows/$workflow_id/activate")
            
            if echo "$activate_response" | jq -e '.active' > /dev/null; then
                echo "✅ Workflow activated successfully"
            else
                echo "⚠️ Failed to activate workflow"
            fi
        else
            echo "❌ Failed to update workflow"
            echo "Response: $response"
        fi
    else
        echo "🆕 Creating new workflow"
        
        # Create new workflow
        local response=$(curl -s -X POST \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d @"$workflow_file" \
            "$N8N_API_URL/workflows")
        
        local workflow_id=$(echo "$response" | jq -r '.id')
        
        if [ "$workflow_id" != "null" ] && [ -n "$workflow_id" ]; then
            echo "✅ Workflow created successfully: $workflow_id"
            
            # Activate the workflow
            echo "🟢 Activating workflow..."
            local activate_response=$(curl -s -X POST \
                -H "X-N8N-API-KEY: $N8N_API_KEY" \
                "$N8N_API_URL/workflows/$workflow_id/activate")
            
            if echo "$activate_response" | jq -e '.active' > /dev/null; then
                echo "✅ Workflow activated successfully"
            else
                echo "⚠️ Failed to activate workflow"
            fi
        else
            echo "❌ Failed to create workflow"
            echo "Response: $response"
        fi
    fi
    
    echo ""
}

# Deploy the Alex AI Jobs webhook workflow
deploy_workflow "workflows/alex-ai-jobs-webhook-workflow.json"

# Test the webhook
echo "🧪 Testing webhook deployment..."
sleep 5

echo "Testing GET /webhook/alex-ai-jobs..."
test_response=$(curl -s "$N8N_BASE_URL/webhook/alex-ai-jobs" || echo "Failed to connect")

if echo "$test_response" | grep -q "success\|data\|jobs"; then
    echo "✅ Webhook is responding correctly"
    echo "Response: $test_response"
else
    echo "⚠️ Webhook may not be fully activated yet"
    echo "Response: $test_response"
fi

echo ""
echo "🎉 N8N Webhook Deployment Complete!"
echo "=================================="
echo "Webhook URL: $N8N_BASE_URL/webhook/alex-ai-jobs"
echo "API Documentation: $N8N_BASE_URL/docs"
echo ""
echo "Next steps:"
echo "1. Verify webhook is active in N8N dashboard"
echo "2. Test the webhook endpoints"
echo "3. Update frontend to use N8N as primary data source"

