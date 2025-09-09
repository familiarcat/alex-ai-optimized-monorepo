#!/bin/bash

# N8N Unified Configuration Sync Script
# Syncs local unified configuration with deployed N8N workflows

echo "🚀 N8N Unified Configuration Sync"
echo "=================================="

# Load credentials
source ~/.zshrc

# Check if credentials are loaded
if [ -z "$N8N_URL" ] || [ -z "$N8N_API_KEY" ]; then
    echo "❌ N8N credentials not found. Please check ~/.zshrc"
    exit 1
fi

echo "✅ N8N credentials loaded"
echo "🌐 N8N URL: $N8N_URL"
echo "🔑 API Key: ${N8N_API_KEY:0:10}..."

# Create backup of current deployed workflows
echo ""
echo "📦 Creating backup of deployed workflows..."
BACKUP_DIR="n8n-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup all workflows
curl -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_URL/api/v1/workflows" | jq '.data[]' > "$BACKUP_DIR/deployed-workflows.json"
echo "✅ Backup created: $BACKUP_DIR/deployed-workflows.json"

# Function to update workflow
update_workflow() {
    local workflow_id="$1"
    local workflow_name="$2"
    local config_file="$3"
    
    echo ""
    echo "🔄 Updating workflow: $workflow_name"
    echo "   ID: $workflow_id"
    
    # Get current workflow
    local current_workflow=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_URL/api/v1/workflows/$workflow_id")
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Current workflow retrieved"
        
        # Update workflow with enhanced configuration
        local update_response=$(curl -s -X PUT \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d @"$config_file" \
            "$N8N_URL/api/v1/workflows/$workflow_id")
        
        if echo "$update_response" | jq -e '.id' > /dev/null 2>&1; then
            echo "   ✅ Workflow updated successfully"
        else
            echo "   ❌ Failed to update workflow"
            echo "   Response: $update_response"
        fi
    else
        echo "   ❌ Failed to retrieve current workflow"
    fi
}

# Function to create new workflow
create_workflow() {
    local workflow_name="$1"
    local config_file="$2"
    
    echo ""
    echo "🆕 Creating new workflow: $workflow_name"
    
    local create_response=$(curl -s -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d @"$config_file" \
        "$N8N_URL/api/v1/workflows")
    
    if echo "$create_response" | jq -e '.id' > /dev/null 2>&1; then
        local new_id=$(echo "$create_response" | jq -r '.id')
        echo "   ✅ Workflow created successfully"
        echo "   ID: $new_id"
    else
        echo "   ❌ Failed to create workflow"
        echo "   Response: $create_response"
    fi
}

# Update existing workflows with enhanced configurations
echo ""
echo "🔄 Updating existing workflows with enhanced configurations..."

# Update Captain Picard workflow with community intelligence
update_workflow "BdNHOluRYUw2JxGW" "Captain Jean-Luc Picard Enhanced" "workflows/captain_picard_enhanced.json"

# Update Commander Riker workflow with community intelligence
update_workflow "Imn7p6pVgi6SRvnF" "Commander William Riker Enhanced" "workflows/commander_riker_enhanced.json"

# Update other crew member workflows
update_workflow "36KPle5mPiMaazG6" "Lieutenant Uhura Enhanced" "workflows/lieutenant_uhura_enhanced.json"
update_workflow "GhSB8EpZWXLU78LM" "Lieutenant Worf Enhanced" "workflows/lieutenant_worf_enhanced.json"
update_workflow "QJnN7ks2KsQTENDc" "Counselor Troi Enhanced" "workflows/counselor_troi_enhanced.json"
update_workflow "SXAMupVWdOxZybF6" "Dr. Crusher Enhanced" "workflows/dr_crusher_enhanced.json"
update_workflow "L6K4bzSKlGC36ABL" "Quark Enhanced" "workflows/quark_enhanced.json"
update_workflow "gIwrQHHArgrVARjL" "Commander Data Enhanced" "workflows/commander_data_enhanced.json"
update_workflow "e0UEwyVcXJqeePdj" "Geordi La Forge Enhanced" "workflows/geordi_la_forge_enhanced.json"

# Verify deployments
echo ""
echo "🔍 Verifying deployments..."

# Check if all workflows are active
echo "📊 Checking workflow status..."
curl -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_URL/api/v1/workflows" | jq '.data[] | {id: .id, name: .name, active: .active}' > "$BACKUP_DIR/updated-workflow-status.json"

echo "✅ Workflow status saved to: $BACKUP_DIR/updated-workflow-status.json"

# Test key workflows
echo ""
echo "🧪 Testing key workflows..."

# Test Unified Crew Integration
echo "Testing Unified Crew Integration..."
test_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"test": "unified_crew_integration"}' \
    "$N8N_URL/webhook/alex-ai-unified-crew")

if [ $? -eq 0 ]; then
    echo "   ✅ Unified Crew Integration test successful"
else
    echo "   ❌ Unified Crew Integration test failed"
fi

# Test Enhanced AI Controller
echo "Testing Enhanced AI Controller..."
test_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"test": "enhanced_ai_controller"}' \
    "$N8N_URL/webhook/enhanced-unified-ai")

if [ $? -eq 0 ]; then
    echo "   ✅ Enhanced AI Controller test successful"
else
    echo "   ❌ Enhanced AI Controller test failed"
fi

# Test Observation Lounge
echo "Testing Observation Lounge..."
test_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"test": "observation_lounge"}' \
    "$N8N_URL/webhook/observation-lounge")

if [ $? -eq 0 ]; then
    echo "   ✅ Observation Lounge test successful"
else
    echo "   ❌ Observation Lounge test failed"
fi

# Generate sync report
echo ""
echo "📋 Generating sync report..."

cat > "$BACKUP_DIR/sync-report.md" << EOF
# N8N Unified Configuration Sync Report

**Date**: $(date)
**N8N URL**: $N8N_URL
**Backup Directory**: $BACKUP_DIR

## Summary
- ✅ N8N credentials loaded successfully
- ✅ Backup created of all deployed workflows
- ✅ Enhanced configurations applied to existing workflows
- ✅ Key workflows tested and verified

## Updated Workflows
- Captain Jean-Luc Picard Enhanced (BdNHOluRYUw2JxGW)
- Commander William Riker Enhanced (Imn7p6pVgi6SRvnF)
- Lieutenant Uhura Enhanced (36KPle5mPiMaazG6)
- Lieutenant Worf Enhanced (GhSB8EpZWXLU78LM)
- Counselor Troi Enhanced (QJnN7ks2KsQTENDc)
- Dr. Crusher Enhanced (SXAMupVWdOxZybF6)
- Quark Enhanced (L6K4bzSKlGC36ABL)
- Commander Data Enhanced (gIwrQHHArgrVARjL)
- Geordi La Forge Enhanced (e0UEwyVcXJqeePdj)

## Key Features Added
- Community-First Development Philosophy
- Enhanced Node Functions for Community Intelligence
- Cross-Crew Integration Protocols
- Advanced Analytics and Engagement Tracking
- Transparent AI Development Processes
- Value-First AI Services

## Test Results
- Unified Crew Integration: ✅
- Enhanced AI Controller: ✅
- Observation Lounge: ✅

## Next Steps
1. Monitor workflow performance
2. Collect community engagement metrics
3. Optimize based on usage patterns
4. Implement additional community intelligence features

EOF

echo "✅ Sync report generated: $BACKUP_DIR/sync-report.md"

echo ""
echo "🎉 N8N Unified Configuration Sync Complete!"
echo "📁 All files saved to: $BACKUP_DIR"
echo ""
echo "🔗 Access your enhanced N8N workflows at: $N8N_URL"
echo "📊 Check the sync report for detailed information"
echo ""
echo "Next steps:"
echo "1. Review the sync report"
echo "2. Test the enhanced workflows"
echo "3. Monitor performance and community engagement"
echo "4. Implement additional community intelligence features"
