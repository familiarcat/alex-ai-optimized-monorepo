#!/bin/bash

# N8N Change Monitor Script
# Monitors N8N for changes and syncs to development
set -e

# Configuration
N8N_URL="${N8N_URL}"
N8N_API_KEY="${N8N_API_KEY}"
WORKFLOWS_DIR="workflows"
CHANGE_LOG="n8n-changes.log"
ANALYSIS_DIR="analysis"
BACKUP_DIR="backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    echo "$(date): INFO: $1" >> "$CHANGE_LOG"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    echo "$(date): SUCCESS: $1" >> "$CHANGE_LOG"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    echo "$(date): WARNING: $1" >> "$CHANGE_LOG"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    echo "$(date): ERROR: $1" >> "$CHANGE_LOG"
}

# Check prerequisites
check_prerequisites() {
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
    
    if ! command -v git &> /dev/null; then
        log_error "git is required but not installed"
        exit 1
    fi
    
    # Create necessary directories
    mkdir -p "$WORKFLOWS_DIR" "$ANALYSIS_DIR" "$BACKUP_DIR"
    
    log_success "Prerequisites check passed"
}

# Test N8N connection
test_n8n_connection() {
    local response=$(curl -s -w "%{http_code}" -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_URL/api/v1/workflows")
    local http_code="${response: -3}"
    
    if [ "$http_code" != "200" ]; then
        log_error "Failed to connect to N8N (HTTP $http_code)"
        exit 1
    fi
    
    log_success "N8N connection successful"
}

# Get current workflows from N8N
get_n8n_workflows() {
    log_info "Fetching current workflows from N8N..."
    
    local response=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_URL/api/v1/workflows")
    
    if echo "$response" | jq -e '.data' > /dev/null 2>&1; then
        echo "$response"
    else
        log_error "Failed to retrieve workflows from N8N"
        exit 1
    fi
}

# Compare workflows
compare_workflows() {
    local n8n_workflow="$1"
    local local_file="$2"
    
    if [ ! -f "$local_file" ]; then
        return 1  # Local file doesn't exist
    fi
    
    # Normalize both workflows for comparison
    local n8n_normalized=$(echo "$n8n_workflow" | jq -S .)
    local local_normalized=$(jq -S . "$local_file")
    
    if [ "$n8n_normalized" = "$local_normalized" ]; then
        return 0  # No changes
    else
        return 1  # Changes detected
    fi
}

# Create backup of local file
backup_local_file() {
    local local_file="$1"
    local backup_file="$BACKUP_DIR/$(basename "$local_file").backup.$(date +%Y%m%d-%H%M%S)"
    
    cp "$local_file" "$backup_file"
    log_info "Backup created: $backup_file"
}

# Sync workflow changes to development
sync_workflow_to_dev() {
    local workflow_name="$1"
    local n8n_workflow="$2"
    local local_file="$3"
    
    log_info "Syncing changes for: $workflow_name"
    
    # Create backup of local file
    backup_local_file "$local_file"
    
    # Update local file with N8N version
    echo "$n8n_workflow" | jq . > "$local_file"
    
    # Analyze changes
    analyze_workflow_changes "$workflow_name" "$local_file"
    
    # Commit to Git
    commit_workflow_changes "$workflow_name" "$local_file"
    
    log_success "Successfully synced: $workflow_name"
}

# Sync new workflow to development
sync_new_workflow_to_dev() {
    local workflow_name="$1"
    local n8n_workflow="$2"
    
    log_info "Syncing new workflow: $workflow_name"
    
    # Create local file
    local local_file="$WORKFLOWS_DIR/${workflow_name// /_}.json"
    echo "$n8n_workflow" | jq . > "$local_file"
    
    # Analyze new workflow
    analyze_workflow_changes "$workflow_name" "$local_file"
    
    # Commit to Git
    commit_workflow_changes "$workflow_name" "$local_file"
    
    log_success "Successfully synced new workflow: $workflow_name"
}

# Analyze workflow changes
analyze_workflow_changes() {
    local workflow_name="$1"
    local workflow_file="$2"
    
    log_info "Analyzing changes for: $workflow_name"
    
    # Create analysis directory
    mkdir -p "$ANALYSIS_DIR"
    
    # Generate change analysis
    local analysis_file="$ANALYSIS_DIR/${workflow_name// /_}-analysis-$(date +%Y%m%d-%H%M%S).json"
    
    # Get workflow metrics
    local node_count=$(jq '.nodes | length' "$workflow_file")
    local connection_count=$(jq '.connections | length' "$workflow_file")
    local webhook_count=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.webhook")] | length' "$workflow_file")
    local function_count=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.function")] | length' "$workflow_file")
    local http_request_count=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.httpRequest")] | length' "$workflow_file")
    
    # Generate analysis
    cat > "$analysis_file" << EOF
{
  "workflow_name": "$workflow_name",
  "analysis_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "change_source": "n8n_production",
  "sync_timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "analysis": {
    "node_count": $node_count,
    "connection_count": $connection_count,
    "webhook_count": $webhook_count,
    "function_count": $function_count,
    "http_request_count": $http_request_count,
    "complexity_score": $((node_count + connection_count + webhook_count + function_count))
  },
  "security_analysis": {
    "has_webhooks": $([ $webhook_count -gt 0 ] && echo "true" || echo "false"),
    "has_functions": $([ $function_count -gt 0 ] && echo "true" || echo "false"),
    "has_http_requests": $([ $http_request_count -gt 0 ] && echo "true" || echo "false")
  },
  "recommendations": [
    "Review changes for security implications",
    "Test workflow functionality in development",
    "Consider impact on dependent workflows",
    "Verify webhook endpoints are secure",
    "Check function code for vulnerabilities"
  ],
  "next_steps": [
    "Test workflow in development environment",
    "Review security implications",
    "Deploy to production if approved",
    "Monitor performance after deployment"
  ]
}
EOF
    
    log_success "Analysis saved: $analysis_file"
}

# Commit workflow changes to Git
commit_workflow_changes() {
    local workflow_name="$1"
    local workflow_file="$2"
    
    log_info "Committing changes to Git: $workflow_name"
    
    # Check if there are changes to commit
    if git diff --quiet "$workflow_file"; then
        log_warning "No changes to commit for: $workflow_name"
        return 0
    fi
    
    # Add to Git
    git add "$workflow_file"
    
    # Add analysis file if it exists
    local analysis_file="$ANALYSIS_DIR/${workflow_name// /_}-analysis-$(date +%Y%m%d)*.json"
    if ls $analysis_file 1> /dev/null 2>&1; then
        git add $analysis_file
    fi
    
    # Commit with descriptive message
    git commit -m "🔄 Sync workflow from N8N production: $workflow_name

- Source: N8N Production (n8n.pbradygeorgen.com)
- Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- Auto-synced from production changes
- Analysis: $ANALYSIS_DIR/${workflow_name// /_}-analysis-*.json

Changes detected and synced from production environment.
Please review and test before deploying to production." || {
        log_warning "No changes to commit for: $workflow_name"
        return 0
    }
    
    # Push to repository
    git push origin main || {
        log_error "Failed to push changes to Git"
        return 1
    }
    
    log_success "Changes committed and pushed to Git: $workflow_name"
}

# Monitor N8N for changes
monitor_n8n_changes() {
    log_info "Monitoring N8N for changes..."
    
    # Get current workflows from N8N
    local n8n_workflows=$(get_n8n_workflows)
    
    # Process each workflow
    local total_workflows=0
    local changed_workflows=0
    local new_workflows=0
    
    for workflow_name in $(echo "$n8n_workflows" | jq -r '.data[].name'); do
        local workflow_id=$(echo "$n8n_workflows" | jq -r ".data[] | select(.name == \"$workflow_name\") | .id")
        local n8n_workflow=$(echo "$n8n_workflows" | jq ".data[] | select(.name == \"$workflow_name\")")
        
        # Create local file path
        local local_file="$WORKFLOWS_DIR/${workflow_name// /_}.json"
        
        ((total_workflows++))
        
        if [ -f "$local_file" ]; then
            # Compare workflows
            if ! compare_workflows "$n8n_workflow" "$local_file"; then
                log_info "Changes detected in workflow: $workflow_name"
                sync_workflow_to_dev "$workflow_name" "$n8n_workflow" "$local_file"
                ((changed_workflows++))
            else
                log_info "No changes in workflow: $workflow_name"
            fi
        else
            log_info "New workflow detected: $workflow_name"
            sync_new_workflow_to_dev "$workflow_name" "$n8n_workflow"
            ((new_workflows++))
        fi
    done
    
    # Summary
    log_info "Sync summary:"
    log_info "  Total workflows: $total_workflows"
    log_info "  Changed workflows: $changed_workflows"
    log_info "  New workflows: $new_workflows"
    
    if [ $changed_workflows -gt 0 ] || [ $new_workflows -gt 0 ]; then
        log_success "Sync completed with changes"
    else
        log_info "No changes detected"
    fi
}

# Generate sync report
generate_sync_report() {
    log_info "Generating sync report..."
    
    local report_file="$ANALYSIS_DIR/sync-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# N8N Production Sync Report

**Sync Date**: $(date)
**Source**: N8N Production (n8n.pbradygeorgen.com)
**Target**: Development Environment

## Sync Summary

- **Total Workflows Processed**: $(ls "$WORKFLOWS_DIR"/*.json 2>/dev/null | wc -l)
- **Sync Timestamp**: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- **Sync Status**: Success

## Recent Changes

EOF
    
    # List recent analysis files
    for analysis_file in "$ANALYSIS_DIR"/*-analysis-*.json; do
        if [ -f "$analysis_file" ]; then
            local workflow_name=$(jq -r '.workflow_name' "$analysis_file")
            local timestamp=$(jq -r '.analysis_timestamp' "$analysis_file")
            echo "- **$workflow_name**: $timestamp" >> "$report_file"
        fi
    done
    
    cat >> "$report_file" << EOF

## Next Steps

1. **Review Changes**: Review all synced workflows
2. **Test Functionality**: Test workflows in development
3. **Security Check**: Verify security implications
4. **Deploy**: Deploy to production if approved

## Files Modified

EOF
    
    # List modified files
    git diff --name-only HEAD~1 HEAD >> "$report_file" 2>/dev/null || echo "No recent changes" >> "$report_file"
    
    log_success "Sync report generated: $report_file"
}

# Main execution function
main() {
    echo "N8N URL: $N8N_URL"
    echo "Workflows Directory: $WORKFLOWS_DIR"
    echo ""
    
    # Initialize change log
    echo "=== N8N Change Monitor Log - $(date) ===" > "$CHANGE_LOG"
    
    # Run all steps
    check_prerequisites
    test_n8n_connection
    monitor_n8n_changes
    generate_sync_report
    
    echo ""
    log_success "N8N change monitoring completed!"
    echo "📊 Check the analysis directory for detailed reports"
    echo "📝 Check the change log: $CHANGE_LOG"
}

# Run main function
main "$@"
