#!/bin/bash

# N8N CI/CD Synchronization Script
# Automatically syncs local workflows with deployed N8N instance

set -e

# Configuration
N8N_URL="${N8N_URL}"
N8N_API_KEY="${N8N_API_KEY}"
WORKFLOWS_DIR="workflows"
BACKUP_DIR="n8n-backup-$(date +%Y%m%d-%H%M%S)"
TARGET_ENV="${TARGET_ENV:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
}

}

}

}

# Check prerequisites
    
    if [ -z "$N8N_URL" ] || [ -z "$N8N_API_KEY" ]; then
        log_error "N8N_URL and N8N_API_KEY environment variables are required"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Test N8N connection
test_n8n_connection() {
    log_info "Testing N8N connection..."
    
    local response=$(curl -s -w "%{http_code}" -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_URL/api/v1/workflows")
    local http_code="${response: -3}"
    
    if [ "$http_code" != "200" ]; then
        log_error "Failed to connect to N8N (HTTP $http_code)"
        exit 1
    fi
    
    log_success "N8N connection successful"
}

# Create backup of current workflows
backup_workflows() {
    log_info "Creating backup of current workflows..."
    
    mkdir -p "$BACKUP_DIR"
    
    local response=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_URL/api/v1/workflows")
    
    if echo "$response" | jq -e '.data' > /dev/null 2>&1; then
        echo "$response" > "$BACKUP_DIR/deployed-workflows.json"
        log_success "Backup created: $BACKUP_DIR/deployed-workflows.json"
    else
        log_error "Failed to retrieve workflows for backup"
        exit 1
    fi
}

# Validate workflow file
validate_workflow() {
    local workflow_file="$1"
    log_info "Validating workflow: $workflow_file"
    
    # Validate JSON syntax
    if ! jq empty "$workflow_file" 2>/dev/null; then
        log_error "Invalid JSON in $workflow_file"
        return 1
    fi
    
    # Validate required fields
    if ! jq -e '.name and .nodes' "$workflow_file" > /dev/null 2>&1; then
        log_error "Missing required fields (name, nodes) in $workflow_file"
        return 1
    fi
    
    # Validate workflow name
    local workflow_name=$(jq -r '.name' "$workflow_file")
    if [ -z "$workflow_name" ] || [ "$workflow_name" = "null" ]; then
        log_error "Invalid workflow name in $workflow_file"
        return 1
    fi
    
    log_success "Workflow validation passed: $workflow_name"
    return 0
}

# Get existing workflow ID
get_workflow_id() {
    local workflow_name="$1"
    
    curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
         "$N8N_URL/api/v1/workflows" | \
         jq -r ".data[] | select(.name == \"$workflow_name\") | .id"
}

# Deploy workflow
deploy_workflow() {
    local workflow_file="$1"
    local workflow_name=$(jq -r '.name' "$workflow_file")
    
    log_info "Deploying workflow: $workflow_name"
    
    # Get existing workflow ID
    local existing_id=$(get_workflow_id "$workflow_name")
    
    # Prepare workflow data with metadata
    local workflow_data=$(jq --arg env "$TARGET_ENV" \
                           --arg commit "$GITHUB_SHA" \
                           --arg branch "$GITHUB_REF_NAME" \
                           --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
                           '. + {
                             "meta": {
                               "deployment": {
                                 "environment": $env,
                                 "gitCommit": $commit,
                                 "gitBranch": $branch,
                                 "deployedAt": $timestamp,
                                 "deployedBy": "ci-cd-pipeline"
                               }
                             }
                           }' "$workflow_file")
    
    if [ "$existing_id" != "null" ] && [ -n "$existing_id" ]; then
        # Update existing workflow
        log_info "Updating existing workflow: $existing_id"
        
        local response=$(curl -s -w "%{http_code}" \
                             -X PUT \
                             -H "X-N8N-API-KEY: $N8N_API_KEY" \
                             -H "Content-Type: application/json" \
                             -d "$workflow_data" \
                             "$N8N_URL/api/v1/workflows/$existing_id")
        
        local http_code="${response: -3}"
        
        if [ "$http_code" = "200" ]; then
            log_success "Workflow updated successfully: $workflow_name"
        else
            log_error "Failed to update workflow: $workflow_name (HTTP $http_code)"
            return 1
        fi
    else
        # Create new workflow
        log_info "Creating new workflow: $workflow_name"
        
        local response=$(curl -s -w "%{http_code}" \
                             -X POST \
                             -H "X-N8N-API-KEY: $N8N_API_KEY" \
                             -H "Content-Type: application/json" \
                             -d "$workflow_data" \
                             "$N8N_URL/api/v1/workflows")
        
        local http_code="${response: -3}"
        
        if [ "$http_code" = "201" ]; then
            log_success "Workflow created successfully: $workflow_name"
        else
            log_error "Failed to create workflow: $workflow_name (HTTP $http_code)"
            return 1
        fi
    fi
}

# Test deployed workflow
test_workflow() {
    local workflow_name="$1"
    log_info "Testing workflow: $workflow_name"
    
    # Get workflow webhook path
    local webhook_path=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
                            "$N8N_URL/api/v1/workflows" | \
                            jq -r ".data[] | select(.name == \"$workflow_name\") | .nodes[] | select(.type == \"n8n-nodes-base.webhook\") | .parameters.path")
    
    if [ -n "$webhook_path" ] && [ "$webhook_path" != "null" ]; then
        log_info "Testing webhook endpoint: $webhook_path"
        
        local test_response=$(curl -s -w "%{http_code}" \
                                  -X POST \
                                  -H "Content-Type: application/json" \
                                  -d '{"test": "cicd_validation", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' \
                                  "$N8N_URL/webhook/$webhook_path")
        
        local http_code="${test_response: -3}"
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
            log_success "Webhook test successful: $webhook_path"
        else
            log_warning "Webhook test returned HTTP $http_code: $webhook_path"
        fi
    else
        log_warning "No webhook endpoint found for workflow: $workflow_name"
    fi
}

# Generate deployment report
generate_deployment_report() {
    log_info "Generating deployment report..."
    
    local report_file="deployment-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# N8N Deployment Report

**Date**: $(date)
**Environment**: $TARGET_ENV
**Git Commit**: ${GITHUB_SHA:-"local"}
**Git Branch**: ${GITHUB_REF_NAME:-"local"}
**Backup Directory**: $BACKUP_DIR

## Deployed Workflows

EOF
    
    # List deployed workflows
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            echo "- ✅ $workflow_name" >> "$report_file"
        fi
    done
    
    cat >> "$report_file" << EOF

## Deployment Summary

- **Total Workflows Processed**: $(ls "$WORKFLOWS_DIR"/*.json 2>/dev/null | wc -l)
- **Environment**: $TARGET_ENV
- **Deployment Method**: CI/CD Pipeline
- **Backup Created**: Yes ($BACKUP_DIR)

## Next Steps

1. Monitor workflow performance
2. Collect usage metrics
3. Optimize based on performance data
4. Review deployment logs if issues occur

## Rollback Information

If rollback is needed, use the backup files in: \`$BACKUP_DIR\`

EOF
    
    log_success "Deployment report generated: $report_file"
}

# Main execution function
    echo "Environment: $TARGET_ENV"
    echo "N8N URL: $N8N_URL"
    echo ""
    
    # Run all steps
    check_prerequisites
    test_n8n_connection
    backup_workflows
    
    # Process workflow files
    local processed_count=0
    local failed_count=0
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            if validate_workflow "$workflow_file"; then
                if deploy_workflow "$workflow_file"; then
                    local workflow_name=$(jq -r '.name' "$workflow_file")
                    test_workflow "$workflow_name"
                    ((processed_count++))
                else
                    ((failed_count++))
                fi
            else
                ((failed_count++))
            fi
        fi
    done
    
    # Generate report
    generate_deployment_report
    
    # Summary
    echo ""
    echo "📊 Deployment Summary:"
    echo "   ✅ Successfully processed: $processed_count workflows"
    echo "   ❌ Failed: $failed_count workflows"
    echo "   📁 Backup created: $BACKUP_DIR"
    
    if [ $failed_count -gt 0 ]; then
        log_error "Some workflows failed to deploy"
        exit 1
    else
        log_success "All workflows deployed successfully!"
    fi
}

# Run main function
main "$@"
