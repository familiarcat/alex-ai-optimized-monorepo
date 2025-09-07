#!/bin/bash

# Production Changes Analysis Script
# Analyzes production changes for impact and recommendations
set -e

ANALYSIS_DIR="analysis"
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

# Analyze all production changes
analyze_production_changes() {
    log_info "Analyzing production changes..."
    
    # Create analysis summary
    local summary_file="$ANALYSIS_DIR/production-changes-summary-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$summary_file" << EOF
# Production Changes Analysis

**Analysis Date**: $(date)
**Source**: N8N Production (n8n.pbradygeorgen.com)
**Analysis Type**: Bi-directional sync impact assessment

## Executive Summary

This analysis covers all workflow changes detected from the N8N production environment and their potential impact on the development workflow.

## Changes Detected

EOF
    
    # Analyze each workflow
    local total_workflows=0
    local analyzed_workflows=0
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            analyze_workflow_impact "$workflow_name" "$workflow_file" "$summary_file"
            ((total_workflows++))
            ((analyzed_workflows++))
        fi
    done
    
    cat >> "$summary_file" << EOF

## Analysis Summary

- **Total Workflows Analyzed**: $analyzed_workflows
- **Analysis Completion**: $(date)
- **Risk Level**: $(assess_overall_risk)

## Recommendations

1. **Review All Changes**: Carefully review each workflow modification
2. **Test Functionality**: Test all modified workflows in development
3. **Security Check**: Verify no security implications
4. **Dependency Check**: Check for impact on dependent workflows
5. **Performance Check**: Monitor performance impact
6. **Integration Test**: Test integration with other systems

## Next Steps

- [ ] Review individual workflow analyses
- [ ] Test modified workflows in development
- [ ] Perform security validation
- [ ] Deploy to production if approved
- [ ] Monitor production performance
- [ ] Update documentation

## Risk Assessment

$(generate_risk_assessment)

## Change Impact Matrix

$(generate_impact_matrix)

EOF
    
    log_success "Analysis summary created: $summary_file"
}

# Analyze individual workflow impact
analyze_workflow_impact() {
    local workflow_name="$1"
    local workflow_file="$2"
    local summary_file="$3"
    
    log_info "Analyzing impact for: $workflow_name"
    
    # Get workflow metrics
    local node_count=$(jq '.nodes | length' "$workflow_file")
    local connection_count=$(jq '.connections | length' "$workflow_file")
    local webhook_count=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.webhook")] | length' "$workflow_file")
    local function_count=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.function")] | length' "$workflow_file")
    local http_request_count=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.httpRequest")] | length' "$workflow_file")
    
    # Calculate complexity score
    local complexity_score=$((node_count + connection_count + webhook_count + function_count))
    
    # Determine risk level
    local risk_level="LOW"
    if [ $complexity_score -gt 20 ]; then
        risk_level="HIGH"
    elif [ $complexity_score -gt 10 ]; then
        risk_level="MEDIUM"
    fi
    
    # Add to summary
    cat >> "$summary_file" << EOF

### $workflow_name

**Metrics**:
- **Nodes**: $node_count
- **Connections**: $connection_count
- **Webhooks**: $webhook_count
- **Functions**: $function_count
- **HTTP Requests**: $http_request_count
- **Complexity Score**: $complexity_score
- **Risk Level**: $risk_level

**Analysis**: $(get_workflow_analysis "$workflow_file")

**Security Implications**: $(get_security_analysis "$workflow_file")

**Performance Impact**: $(get_performance_analysis "$workflow_file")

**Dependencies**: $(get_dependency_analysis "$workflow_file")

EOF
}

# Get workflow analysis
get_workflow_analysis() {
    local workflow_file="$1"
    
    # Check for potential issues
    local issues=()
    local recommendations=()
    
    # Check for webhook endpoints
    if [ "$(jq '[.nodes[] | select(.type == "n8n-nodes-base.webhook")] | length' "$workflow_file")" -eq 0 ]; then
        issues+=("No webhook triggers found")
        recommendations+=("Consider adding webhook triggers for external integration")
    fi
    
    # Check for response nodes
    if [ "$(jq '[.nodes[] | select(.type == "n8n-nodes-base.respondToWebhook")] | length' "$workflow_file")" -eq 0 ]; then
        issues+=("No response nodes found")
        recommendations+=("Add response nodes for proper webhook handling")
    fi
    
    # Check for function nodes
    if [ "$(jq '[.nodes[] | select(.type == "n8n-nodes-base.function")] | length' "$workflow_file")" -gt 0 ]; then
        issues+=("Contains custom functions - review code")
        recommendations+=("Review custom function code for security and performance")
    fi
    
    # Check for HTTP requests
    if [ "$(jq '[.nodes[] | select(.type == "n8n-nodes-base.httpRequest")] | length' "$workflow_file")" -gt 0 ]; then
        issues+=("Contains HTTP requests - verify endpoints")
        recommendations+=("Verify HTTP endpoints are secure and accessible")
    fi
    
    # Check for error handling
    local error_handling=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.if" or .type == "n8n-nodes-base.switch")] | length' "$workflow_file")
    if [ "$error_handling" -eq 0 ]; then
        recommendations+=("Consider adding error handling nodes")
    fi
    
    local result=""
    if [ ${#issues[@]} -eq 0 ]; then
        result="No issues detected"
    else
        result="Issues: $(printf '%s; ' "${issues[@]}")"
    fi
    
    if [ ${#recommendations[@]} -gt 0 ]; then
        result="$result Recommendations: $(printf '%s; ' "${recommendations[@]}")"
    fi
    
    echo "$result"
}

# Get security analysis
get_security_analysis() {
    local workflow_file="$1"
    
    local security_issues=()
    
    # Check for authentication
    local auth_nodes=$(jq '[.nodes[] | select(.parameters.authentication)] | length' "$workflow_file")
    if [ "$auth_nodes" -eq 0 ]; then
        security_issues+=("No authentication configured")
    fi
    
    # Check for HTTPS URLs
    local http_urls=$(jq -r '.nodes[] | select(.parameters.url) | .parameters.url' "$workflow_file" 2>/dev/null | grep -E "^http://" || true)
    if [ -n "$http_urls" ]; then
        security_issues+=("HTTP URLs detected (use HTTPS)")
    fi
    
    # Check for sensitive data
    local sensitive_patterns=$(jq -r '.nodes[] | select(.parameters.data) | .parameters.data' "$workflow_file" 2>/dev/null | grep -iE "(password|secret|key|token)" || true)
    if [ -n "$sensitive_patterns" ]; then
        security_issues+=("Potential sensitive data exposure")
    fi
    
    if [ ${#security_issues[@]} -eq 0 ]; then
        echo "No security issues detected"
    else
        echo "Security concerns: $(printf '%s; ' "${security_issues[@]}")"
    fi
}

# Get performance analysis
get_performance_analysis() {
    local workflow_file="$1"
    
    local performance_issues=()
    
    # Check for large workflows
    local node_count=$(jq '.nodes | length' "$workflow_file")
    if [ $node_count -gt 50 ]; then
        performance_issues+=("Large workflow ($node_count nodes) - consider optimization")
    fi
    
    # Check for complex connections
    local connection_count=$(jq '.connections | length' "$workflow_file")
    if [ $connection_count -gt 100 ]; then
        performance_issues+=("Complex connections ($connection_count) - review for optimization")
    fi
    
    # Check for function nodes
    local function_count=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.function")] | length' "$workflow_file")
    if [ $function_count -gt 10 ]; then
        performance_issues+=("Many function nodes ($function_count) - review for performance")
    fi
    
    if [ ${#performance_issues[@]} -eq 0 ]; then
        echo "No performance concerns detected"
    else
        echo "Performance considerations: $(printf '%s; ' "${performance_issues[@]}")"
    fi
}

# Get dependency analysis
get_dependency_analysis() {
    local workflow_file="$1"
    
    local dependencies=()
    
    # Check for external API calls
    local api_calls=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.httpRequest")] | length' "$workflow_file")
    if [ $api_calls -gt 0 ]; then
        dependencies+=("External API dependencies ($api_calls calls)")
    fi
    
    # Check for database connections
    local db_connections=$(jq '[.nodes[] | select(.type | contains("database") or contains("sql"))] | length' "$workflow_file")
    if [ $db_connections -gt 0 ]; then
        dependencies+=("Database dependencies ($db_connections connections)")
    fi
    
    # Check for file system access
    local file_access=$(jq '[.nodes[] | select(.type == "n8n-nodes-base.readFile" or .type == "n8n-nodes-base.writeFile")] | length' "$workflow_file")
    if [ $file_access -gt 0 ]; then
        dependencies+=("File system dependencies ($file_access operations)")
    fi
    
    if [ ${#dependencies[@]} -eq 0 ]; then
        echo "No external dependencies detected"
    else
        echo "Dependencies: $(printf '%s; ' "${dependencies[@]}")"
    fi
}

# Assess overall risk
assess_overall_risk() {
    local high_risk_count=0
    local medium_risk_count=0
    local low_risk_count=0
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local node_count=$(jq '.nodes | length' "$workflow_file")
            local complexity_score=$((node_count + $(jq '.connections | length' "$workflow_file")))
            
            if [ $complexity_score -gt 20 ]; then
                ((high_risk_count++))
            elif [ $complexity_score -gt 10 ]; then
                ((medium_risk_count++))
            else
                ((low_risk_count++))
            fi
        fi
    done
    
    if [ $high_risk_count -gt 0 ]; then
        echo "HIGH"
    elif [ $medium_risk_count -gt 0 ]; then
        echo "MEDIUM"
    else
        echo "LOW"
    fi
}

# Generate risk assessment
generate_risk_assessment() {
    cat << EOF
| Risk Level | Count | Description |
|------------|-------|-------------|
| HIGH | $(count_risk_level "HIGH") | Complex workflows requiring careful review |
| MEDIUM | $(count_risk_level "MEDIUM") | Moderate complexity workflows |
| LOW | $(count_risk_level "LOW") | Simple workflows with minimal risk |

**Overall Risk Assessment**: $(assess_overall_risk)
EOF
}

# Count risk level
count_risk_level() {
    local risk_level="$1"
    local count=0
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local node_count=$(jq '.nodes | length' "$workflow_file")
            local complexity_score=$((node_count + $(jq '.connections | length' "$workflow_file")))
            
            case "$risk_level" in
                "HIGH")
                    if [ $complexity_score -gt 20 ]; then
                        ((count++))
                    fi
                    ;;
                "MEDIUM")
                    if [ $complexity_score -gt 10 ] && [ $complexity_score -le 20 ]; then
                        ((count++))
                    fi
                    ;;
                "LOW")
                    if [ $complexity_score -le 10 ]; then
                        ((count++))
                    fi
                    ;;
            esac
        fi
    done
    
    echo $count
}

# Generate impact matrix
generate_impact_matrix() {
    cat << EOF
| Workflow | Complexity | Risk | Security | Performance | Dependencies |
|----------|------------|------|----------|-------------|--------------|
EOF
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            local node_count=$(jq '.nodes | length' "$workflow_file")
            local complexity_score=$((node_count + $(jq '.connections | length' "$workflow_file")))
            
            local risk_level="LOW"
            if [ $complexity_score -gt 20 ]; then
                risk_level="HIGH"
            elif [ $complexity_score -gt 10 ]; then
                risk_level="MEDIUM"
            fi
            
            local security_status="✅"
            if [ "$(jq '[.nodes[] | select(.parameters.authentication)] | length' "$workflow_file")" -eq 0 ]; then
                security_status="⚠️"
            fi
            
            local performance_status="✅"
            if [ $node_count -gt 50 ]; then
                performance_status="⚠️"
            fi
            
            local dependency_status="✅"
            if [ "$(jq '[.nodes[] | select(.type == "n8n-nodes-base.httpRequest")] | length' "$workflow_file")" -gt 0 ]; then
                dependency_status="⚠️"
            fi
            
            echo "| $workflow_name | $complexity_score | $risk_level | $security_status | $performance_status | $dependency_status |"
        fi
    done
}

# Main execution function
main() {
    echo "🔍 Starting production changes analysis..."
    echo ""
    
    # Create analysis directory
    mkdir -p "$ANALYSIS_DIR"
    
    # Run analysis
    analyze_production_changes
    
    echo ""
    log_success "Production changes analysis complete!"
    echo "📊 Check the analysis directory for detailed reports"
}

# Run main function
main "$@"
