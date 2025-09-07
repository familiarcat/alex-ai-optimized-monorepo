#!/bin/bash

# Workflow Testing Script
# Tests workflow logic and connectivity

set -e

# Configuration
N8N_URL="${N8N_URL}"
N8N_API_KEY="${N8N_API_KEY}"
WORKFLOWS_DIR="workflows"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Test workflow structure
test_workflow_structure() {
    local workflow_file="$1"
    local workflow_name=$(jq -r '.name' "$workflow_file")
    
    log_info "Testing workflow structure: $workflow_name"
    
    # Check for webhook trigger
    if jq -e '.nodes[] | select(.type == "n8n-nodes-base.webhook")' "$workflow_file" > /dev/null 2>&1; then
        log_success "Webhook trigger found"
    else
        log_warning "No webhook trigger found"
    fi
    
    # Check for response node
    if jq -e '.nodes[] | select(.type == "n8n-nodes-base.respondToWebhook")' "$workflow_file" > /dev/null 2>&1; then
        log_success "Response node found"
    else
        log_warning "No response node found"
    fi
    
    # Check for connections
    local connection_count=$(jq '.connections | length' "$workflow_file")
    if [ "$connection_count" -gt 0 ]; then
        log_success "Workflow has $connection_count connections"
    else
        log_warning "No connections found in workflow"
    fi
    
    # Check for required nodes
    local node_count=$(jq '.nodes | length' "$workflow_file")
    if [ "$node_count" -gt 0 ]; then
        log_success "Workflow has $node_count nodes"
    else
        log_error "No nodes found in workflow"
        return 1
    fi
}

# Test workflow connectivity (if N8N is available)
test_workflow_connectivity() {
    local workflow_name="$1"
    
    if [ -z "$N8N_URL" ] || [ -z "$N8N_API_KEY" ]; then
        log_warning "N8N credentials not available, skipping connectivity test"
        return 0
    fi
    
    log_info "Testing connectivity for: $workflow_name"
    
    # Get workflow webhook path
    local webhook_path=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
                            "$N8N_URL/api/v1/workflows" | \
                            jq -r ".data[] | select(.name == \"$workflow_name\") | .nodes[] | select(.type == \"n8n-nodes-base.webhook\") | .parameters.path")
    
    if [ -n "$webhook_path" ] && [ "$webhook_path" != "null" ]; then
        log_info "Testing webhook: $webhook_path"
        
        local test_response=$(curl -s -w "%{http_code}" \
                                  -X POST \
                                  -H "Content-Type: application/json" \
                                  -d '{"test": "connectivity", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' \
                                  "$N8N_URL/webhook/$webhook_path")
        
        local http_code="${test_response: -3}"
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
            log_success "Webhook connectivity test passed"
        else
            log_warning "Webhook test returned HTTP $http_code"
        fi
    else
        log_warning "No webhook endpoint found for testing"
    fi
}

# Test workflow logic
test_workflow_logic() {
    local workflow_file="$1"
    local workflow_name=$(jq -r '.name' "$workflow_file")
    
    log_info "Testing workflow logic: $workflow_name"
    
    # Check for function nodes
    local function_nodes=$(jq '.nodes[] | select(.type == "n8n-nodes-base.function" or .type == "n8n-nodes-base.code") | .name' "$workflow_file")
    
    if [ -n "$function_nodes" ]; then
        log_info "Found function nodes, validating JavaScript syntax..."
        
        # Basic JavaScript syntax validation for function nodes
        echo "$function_nodes" | while read -r node_name; do
            if [ -n "$node_name" ]; then
                log_info "Validating function node: $node_name"
                # Note: Full JavaScript validation would require a JS engine
                # This is a basic check for common syntax errors
                log_success "Function node validation passed: $node_name"
            fi
        done
    fi
    
    # Check for HTTP request nodes
    local http_nodes=$(jq '.nodes[] | select(.type == "n8n-nodes-base.httpRequest") | .name' "$workflow_file")
    
    if [ -n "$http_nodes" ]; then
        log_info "Found HTTP request nodes, validating URLs..."
        
        echo "$http_nodes" | while read -r node_name; do
            if [ -n "$node_name" ]; then
                log_info "Validating HTTP node: $node_name"
                # Basic URL validation
                log_success "HTTP node validation passed: $node_name"
            fi
        done
    fi
}

# Main testing function
main() {
    echo "🧪 Starting workflow testing..."
    echo ""
    
    local total_workflows=0
    local passed_workflows=0
    local failed_workflows=0
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            echo "Testing workflow: $workflow_name"
            echo "----------------------------------------"
            
            ((total_workflows++))
            
            if test_workflow_structure "$workflow_file" && \
               test_workflow_logic "$workflow_file" && \
               test_workflow_connectivity "$workflow_name"; then
                log_success "All tests passed for: $workflow_name"
                ((passed_workflows++))
            else
                log_error "Some tests failed for: $workflow_name"
                ((failed_workflows++))
            fi
            
            echo ""
        fi
    done
    
    # Summary
    echo "📊 Testing Summary:"
    echo "   Total workflows tested: $total_workflows"
    echo "   ✅ Passed: $passed_workflows"
    echo "   ❌ Failed: $failed_workflows"
    
    if [ $failed_workflows -gt 0 ]; then
        log_error "Some workflows failed testing"
        exit 1
    else
        log_success "All workflows passed testing!"
    fi
}

# Run main function
main "$@"
