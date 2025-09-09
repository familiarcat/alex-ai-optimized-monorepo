#!/bin/bash

# Deploy Missing N8N Webhook Endpoints
# This script creates and activates the missing webhook endpoints for Alex AI

set -e

echo "🔗 Deploying Missing N8N Webhook Endpoints"
echo "==========================================="
echo ""

# Load credentials from ~/.zshrc
echo "ℹ️  Loading credentials from ~/.zshrc..."
if [ -f ~/.zshrc ]; then
    while IFS= read -r line; do
        if [[ $line == export* ]]; then
            eval "$line" 2>/dev/null || true
        fi
    done < ~/.zshrc
    echo "✅ Credentials loaded"
else
    echo "❌ ~/.zshrc not found"
    exit 1
fi

N8N_URL="${N8N_URL:-https://n8n.pbradygeorgen.com}"
N8N_API_KEY="${N8N_API_KEY}"

if [ -z "$N8N_API_KEY" ]; then
    echo "❌ N8N_API_KEY not found in environment"
    exit 1
fi

echo "📋 N8N Configuration:"
echo "  URL: $N8N_URL"
echo "  API Key: ${N8N_API_KEY:0:20}..."
echo ""

# Function to create a webhook workflow
create_webhook_workflow() {
    local webhook_name="$1"
    local webhook_path="$2"
    local description="$3"
    
    echo "🔧 Creating $webhook_name webhook..."
    
    # Convert webhook name to lowercase for ID
    local webhook_id=$(echo "$webhook_name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    local webhook_path_clean=$(echo "$webhook_path" | tr '/' '-')
    
    # Create the workflow JSON
    cat > "/tmp/${webhook_name}-workflow.json" << EOF
{
  "name": "$webhook_name",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "$webhook_path",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-$webhook_id",
      "name": "$webhook_name Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "alex-ai-$webhook_path_clean"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ \\\$json }}"
      },
      "id": "respond-success",
      "name": "Respond with Success",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [460, 300]
    }
  ],
  "connections": {
    "webhook-$webhook_id": {
      "main": [
        [
          {
            "node": "respond-success",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {},
  "versionId": "1"
}
EOF

    # Deploy the workflow
    local response=$(curl -s -X POST \
        "$N8N_URL/api/v1/workflows" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d @"/tmp/${webhook_name}-workflow.json")
    
    if echo "$response" | grep -q '"id"'; then
        echo "✅ $webhook_name webhook created successfully"
        local workflow_id=$(echo "$response" | jq -r '.id')
        echo "   Workflow ID: $workflow_id"
        
        # Activate the workflow
        local activate_response=$(curl -s -X POST \
            "$N8N_URL/api/v1/workflows/$workflow_id/activate" \
            -H "X-N8N-API-KEY: $N8N_API_KEY")
        
        if echo "$activate_response" | grep -q '"active":true'; then
            echo "✅ $webhook_name webhook activated successfully"
        else
            echo "⚠️  $webhook_name webhook created but activation failed"
        fi
    else
        echo "❌ Failed to create $webhook_name webhook"
        echo "   Response: $response"
    fi
    
    # Clean up temp file
    rm -f "/tmp/${webhook_name}-workflow.json"
    echo ""
}

# Create missing webhook endpoints
echo "🚀 Creating missing webhook endpoints..."
echo ""

create_webhook_workflow "Alex AI Resume Analysis" "alex-ai-resume-analysis" "Resume analysis and optimization webhook"
create_webhook_workflow "Alex AI MCP Requests" "alex-ai-mcp-requests" "MCP knowledge management webhook"

echo "🔍 Verifying webhook endpoints..."
echo ""

# Test the webhooks
test_webhook() {
    local webhook_name="$1"
    local webhook_path="$2"
    
    echo "Testing $webhook_name..."
    local response=$(curl -s -w "%{http_code}" -X POST \
        "$N8N_URL/webhook/$webhook_path" \
        -H "Content-Type: application/json" \
        -d '{"test": "health_check"}')
    
    local http_code="${response: -3}"
    local body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo "✅ $webhook_name is responding correctly"
    elif [ "$http_code" = "404" ]; then
        echo "⚠️  $webhook_name webhook not found (may need activation)"
    else
        echo "❌ $webhook_name returned HTTP $http_code"
    fi
}

test_webhook "Resume Analysis" "alex-ai-resume-analysis"
test_webhook "MCP Requests" "alex-ai-mcp-requests"

echo ""
echo "🎉 Webhook deployment complete!"
echo ""
echo "📋 Summary:"
echo "  - Resume Analysis webhook: $N8N_URL/webhook/alex-ai-resume-analysis"
echo "  - MCP Requests webhook: $N8N_URL/webhook/alex-ai-mcp-requests"
echo ""
echo "🔧 Next steps:"
echo "  1. Test the application: pnpm run dev"
echo "  2. Check N8N health: The health manager should now detect these webhooks"
echo "  3. Verify end-to-end flow: Next.js → N8N → Supabase → N8N → Next.js"