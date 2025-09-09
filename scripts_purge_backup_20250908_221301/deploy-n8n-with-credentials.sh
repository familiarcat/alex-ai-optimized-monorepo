#!/bin/bash

# Deploy N8N Workflows with Secure Credentials
# This script deploys N8N workflows and configures them with Supabase credentials

set -e

echo "🚀 Deploying N8N Workflows with Secure Credentials"
echo "================================================="

# Load credentials
echo "ℹ️  Loading credentials..."
# Extract only environment variable exports from ~/.zshrc
while IFS= read -r line; do
    if [[ $line == export* ]]; then
        eval "$line" 2>/dev/null || true
    fi
done < ~/.zshrc

# Validate credentials
if [ -z "$N8N_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo "❌ N8N credentials not found in ~/.zshrc"
    exit 1
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Supabase credentials not found in ~/.zshrc"
    exit 1
fi

echo "✅ Credentials loaded successfully"

# Function to create Supabase credentials in N8N
create_supabase_credentials() {
    echo "ℹ️  Creating Supabase credentials in N8N..."
    
    local credential_data=$(cat << EOF
{
  "name": "Supabase Production",
  "type": "supabaseApi",
  "data": {
    "host": "$SUPABASE_URL",
    "serviceRole": "$SUPABASE_ANON_KEY"
  }
}
EOF
)
    
    local response=$(curl -s -X POST \
        "$N8N_URL/api/v1/credentials" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$credential_data")
    
    if echo "$response" | grep -q '"id"'; then
        echo "✅ Supabase credentials created in N8N"
        echo "$response" | jq -r '.id' > .n8n-supabase-credential-id
    else
        echo "⚠️  Supabase credentials may already exist or failed to create"
        echo "Response: $response"
    fi
}

# Function to deploy workflow
deploy_workflow() {
    local workflow_file="$1"
    local workflow_name="$2"
    
    echo "ℹ️  Deploying workflow: $workflow_name"
    
    if [ ! -f "$workflow_file" ]; then
        echo "❌ Workflow file not found: $workflow_file"
        return 1
    fi
    
    local response=$(curl -s -X POST \
        "$N8N_URL/api/v1/workflows" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d @"$workflow_file")
    
    if echo "$response" | grep -q '"id"'; then
        echo "✅ Workflow deployed successfully: $workflow_name"
        local workflow_id=$(echo "$response" | jq -r '.id')
        echo "$workflow_id" > ".n8n-workflow-$workflow_name-id"
        return 0
    else
        echo "❌ Failed to deploy workflow: $workflow_name"
        echo "Response: $response"
        return 1
    fi
}

# Function to activate workflow
activate_workflow() {
    local workflow_id="$1"
    local workflow_name="$2"
    
    echo "ℹ️  Activating workflow: $workflow_name"
    
    local response=$(curl -s -X POST \
        "$N8N_URL/api/v1/workflows/$workflow_id/activate" \
        -H "X-N8N-API-KEY: $N8N_API_KEY")
    
    if echo "$response" | grep -q '"active":true'; then
        echo "✅ Workflow activated: $workflow_name"
    else
        echo "⚠️  Failed to activate workflow: $workflow_name"
        echo "Response: $response"
    fi
}

# Function to test webhook endpoints
test_webhooks() {
    echo "ℹ️  Testing webhook endpoints..."
    
    # Test GET jobs endpoint
    local get_response=$(curl -s -X GET \
        "$N8N_URL/webhook/alex-ai-jobs-get" \
        -H "Content-Type: application/json")
    
    if echo "$get_response" | grep -q '"success"'; then
        echo "✅ GET jobs webhook working"
    else
        echo "⚠️  GET jobs webhook may not be working"
        echo "Response: $get_response"
    fi
    
    # Test POST jobs endpoint
    local test_job='{"company":"Test Company","position":"Test Position","location":"Test Location"}'
    local post_response=$(curl -s -X POST \
        "$N8N_URL/webhook/alex-ai-jobs-post" \
        -H "Content-Type: application/json" \
        -d "$test_job")
    
    if echo "$post_response" | grep -q '"success"'; then
        echo "✅ POST jobs webhook working"
    else
        echo "⚠️  POST jobs webhook may not be working"
        echo "Response: $post_response"
    fi
}

# Main deployment process
main() {
    echo "Starting N8N deployment process..."
    
    # Create Supabase credentials in N8N
    create_supabase_credentials
    
    # Deploy workflows
    deploy_workflow "workflows/alex-ai-jobs-production.json" "alex-ai-jobs-production"
    
    # Get workflow ID and activate
    if [ -f ".n8n-workflow-alex-ai-jobs-production-id" ]; then
        local workflow_id=$(cat ".n8n-workflow-alex-ai-jobs-production-id")
        activate_workflow "$workflow_id" "alex-ai-jobs-production"
    fi
    
    # Wait a moment for activation
    sleep 5
    
    # Test webhooks
    test_webhooks
    
    echo ""
    echo "🎉 N8N deployment complete!"
    echo ""
    echo "Webhook endpoints:"
    echo "- GET Jobs: $N8N_URL/webhook/alex-ai-jobs-get"
    echo "- POST Jobs: $N8N_URL/webhook/alex-ai-jobs-post"
    echo ""
    echo "Next steps:"
    echo "1. Create Supabase tables using the generated SQL script"
    echo "2. Test the complete bi-directional data flow"
    echo "3. Begin live job scraping"
}

# Run main function
main "$@"
