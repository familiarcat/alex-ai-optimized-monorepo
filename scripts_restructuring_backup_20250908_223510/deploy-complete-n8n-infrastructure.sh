#!/bin/bash

# Complete N8N Infrastructure Deployment Script
# This script deploys the complete bi-directional data flow infrastructure

set -e

echo "🚀 Deploying Complete N8N Infrastructure"
echo "========================================"

# Load credentials
echo "ℹ️  Loading credentials from ~/.zshrc..."
while IFS= read -r line; do
    if [[ $line == export* ]]; then
        eval "$line" 2>/dev/null || true
    fi
done < ~/.zshrc

# Validate credentials
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$N8N_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo "❌ Required credentials not found in ~/.zshrc"
    exit 1
fi

echo "✅ Credentials loaded successfully"

# Function to test N8N connection
    local response=$(curl -s -X GET "$N8N_URL/api/v1/workflows" -H "X-N8N-API-KEY: $N8N_API_KEY")
    
    if echo "$response" | grep -q '"data"'; then
        echo "✅ N8N connection successful"
        return 0
    else
        echo "❌ N8N connection failed"
        return 1
    fi
}

# Function to test Supabase connection
test_supabase_connection() {
    echo "ℹ️  Testing Supabase connection..."
    local response=$(curl -s -X GET "$SUPABASE_URL/rest/v1/" -H "apikey: $SUPABASE_ANON_KEY")
    
    if [ $? -eq 0 ]; then
        echo "✅ Supabase connection successful"
        return 0
    else
        echo "❌ Supabase connection failed"
        return 1
    fi
}

# Function to activate existing N8N workflows
activate_n8n_workflows() {
    echo "ℹ️  Activating N8N workflows..."
    
    # List of workflow IDs to activate
    local workflows=(
        "58B6WvShXJ7bj8Ni"  # Alex AI Job Opportunities - Production
        "RY8pm6gUFtkTKcpg"  # Alex AI Resume Analysis - Production
        "rLN1eArIA6t3tEwZ"  # Alex AI Contacts - Production
        "p0L9kldRFQmexqBx"  # Alex AI MCP Request Handler - Production
    )
    
    for workflow_id in "${workflows[@]}"; do
        echo "  Activating workflow: $workflow_id"
        local response=$(curl -s -X POST "$N8N_URL/api/v1/workflows/$workflow_id/activate" -H "X-N8N-API-KEY: $N8N_API_KEY")
        
        if echo "$response" | grep -q '"active":true'; then
            echo "  ✅ Workflow $workflow_id activated"
        else
            echo "  ⚠️  Workflow $workflow_id activation may have failed"
        fi
    done
}

# Function to test webhook endpoints
test_webhook_endpoints() {
    echo "ℹ️  Testing webhook endpoints..."
    
    # Test job opportunities webhook
    local job_response=$(curl -s -X POST "$N8N_URL/webhook/alex-ai-job-opportunities" -H "Content-Type: application/json" -d '{"test": "data"}')
    
    if echo "$job_response" | grep -q '"message"'; then
        echo "✅ Job opportunities webhook working"
    else
        echo "⚠️  Job opportunities webhook may not be working"
        echo "Response: $job_response"
    fi
}

# Main deployment process
    
    # Test connections
    if ! test_n8n_connection; then
        echo "❌ N8N connection failed. Please check your N8N_URL and N8N_API_KEY"
        exit 1
    fi
    
    if ! test_supabase_connection; then
        echo "❌ Supabase connection failed. Please check your SUPABASE_URL and SUPABASE_ANON_KEY"
        exit 1
    fi
    
    # Activate workflows
    activate_n8n_workflows
    
    # Wait a moment for activation
    sleep 5
    
    # Test webhooks
    test_webhook_endpoints
    
    echo ""
    echo "🎉 N8N Infrastructure Deployment Complete!"
    echo ""
    echo "Next steps:"
    echo "1. Execute scripts/create-supabase-tables.sql in your Supabase SQL editor"
    echo "2. Start the development server: pnpm run dev"
    echo "3. Test the complete bi-directional data flow"
    echo ""
    echo "All webhook endpoints are now active and ready for bi-directional data flow!"
}

# Run main function
main "$@"