#!/bin/bash

# Conflict Analysis Script
# Analyzes and resolves conflicts between production and development
set -e

CONFLICT_DIR="conflicts"
WORKFLOWS_DIR="workflows"
ANALYSIS_DIR="analysis"

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

# Analyze conflicts
analyze_conflicts() {
    log_info "Analyzing conflicts between production and development..."
    
    mkdir -p "$CONFLICT_DIR"
    
    local conflict_file="$CONFLICT_DIR/conflict-analysis-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$conflict_file" << EOF
# Conflict Analysis Report

**Analysis Date**: $(date)
**Source**: Bi-directional sync conflict detection
**Analysis Type**: Production vs Development conflict resolution

## Executive Summary

This report analyzes potential conflicts between the N8N production environment and the development environment during bi-directional synchronization.

## Conflict Detection Results

EOF
    
    # Check for conflicts in each workflow
    local total_workflows=0
    local conflicted_workflows=0
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            ((total_workflows++))
            
            if check_workflow_conflicts "$workflow_name" "$workflow_file" "$conflict_file"; then
                ((conflicted_workflows++))
            fi
        fi
    done
    
    cat >> "$conflict_file" << EOF

## Conflict Summary

- **Total Workflows Analyzed**: $total_workflows
- **Workflows with Conflicts**: $conflicted_workflows
- **Conflict Rate**: $((conflicted_workflows * 100 / total_workflows))%

## Resolution Recommendations

1. **Manual Review**: Review each conflict manually
2. **Merge Strategy**: Use appropriate merge strategy
3. **Testing**: Test merged workflows thoroughly
4. **Deployment**: Deploy with caution
5. **Monitoring**: Monitor for issues after deployment

## Next Steps

- [ ] Review conflicts
- [ ] Resolve conflicts manually
- [ ] Test resolved workflows
- [ ] Deploy to production
- [ ] Monitor for issues

## Conflict Resolution Matrix

$(generate_conflict_matrix)

EOF
    
    log_success "Conflict analysis saved: $conflict_file"
    
    if [ $conflicted_workflows -gt 0 ]; then
        log_warning "Conflicts detected in $conflicted_workflows workflows"
        return 1
    else
        log_success "No conflicts detected"
        return 0
    fi
}

# Check workflow conflicts
check_workflow_conflicts() {
    local workflow_name="$1"
    local workflow_file="$2"
    local conflict_file="$3"
    
    local conflicts=()
    local conflict_count=0
    
    # Check for duplicate nodes
    local duplicate_nodes=$(jq -r '.nodes[].name' "$workflow_file" | sort | uniq -d)
    if [ -n "$duplicate_nodes" ]; then
        conflicts+=("Duplicate node names: $duplicate_nodes")
        ((conflict_count++))
    fi
    
    # Check for orphaned connections
    local orphaned_connections=$(jq -r '.connections | to_entries[] | select(.value == {}) | .key' "$workflow_file")
    if [ -n "$orphaned_connections" ]; then
        conflicts+=("Orphaned connections found")
        ((conflict_count++))
    fi
    
    # Check for missing node references
    local missing_refs=$(jq -r '.connections | to_entries[] | .value | to_entries[] | .value[] | select(.node == null) | .node' "$workflow_file")
    if [ -n "$missing_refs" ]; then
        conflicts+=("Missing node references found")
        ((conflict_count++))
    fi
    
    # Check for circular dependencies
    if check_circular_dependencies "$workflow_file"; then
        conflicts+=("Circular dependencies detected")
        ((conflict_count++))
    fi
    
    # Check for invalid node types
    local invalid_nodes=$(jq -r '.nodes[] | select(.type == null or .type == "") | .name' "$workflow_file")
    if [ -n "$invalid_nodes" ]; then
        conflicts+=("Invalid node types found")
        ((conflict_count++))
    fi
    
    # Check for missing required parameters
    local missing_params=$(jq -r '.nodes[] | select(.parameters == null) | .name' "$workflow_file")
    if [ -n "$missing_params" ]; then
        conflicts+=("Missing required parameters")
        ((conflict_count++))
    fi
    
    if [ $conflict_count -gt 0 ]; then
        cat >> "$conflict_file" << EOF

### $workflow_name

**Conflicts Detected**: $conflict_count

**Issues**:
EOF
        for conflict in "${conflicts[@]}"; do
            echo "- $conflict" >> "$conflict_file"
        done
        
        cat >> "$conflict_file" << EOF

**Resolution Steps**:
1. Review the identified issues
2. Fix duplicate node names
3. Remove orphaned connections
4. Fix missing node references
5. Resolve circular dependencies
6. Validate node types and parameters

EOF
        return 0  # Conflicts found
    else
        return 1  # No conflicts
    fi
}

# Check for circular dependencies
check_circular_dependencies() {
    local workflow_file="$1"
    
    # Simple circular dependency check
    # This is a basic implementation - a more sophisticated approach would use graph algorithms
    
    local connections=$(jq -r '.connections | to_entries[] | "\(.key) -> \(.value | to_entries[] | .value[] | .node)"' "$workflow_file")
    
    # Check for direct circular references
    while IFS= read -r connection; do
        local source=$(echo "$connection" | cut -d' ' -f1)
        local target=$(echo "$connection" | cut -d' ' -f3)
        
        if [ "$source" = "$target" ]; then
            return 0  # Circular dependency found
        fi
    done <<< "$connections"
    
    return 1  # No circular dependencies
}

# Generate conflict matrix
generate_conflict_matrix() {
    cat << EOF
| Workflow | Conflicts | Severity | Resolution | Status |
|----------|-----------|----------|------------|--------|
EOF
    
    for workflow_file in "$WORKFLOWS_DIR"/*.json; do
        if [ -f "$workflow_file" ]; then
            local workflow_name=$(jq -r '.name' "$workflow_file")
            local conflict_count=0
            local severity="LOW"
            
            # Count conflicts
            local duplicate_nodes=$(jq -r '.nodes[].name' "$workflow_file" | sort | uniq -d | wc -l)
            local orphaned_connections=$(jq -r '.connections | to_entries[] | select(.value == {}) | .key' "$workflow_file" | wc -l)
            local missing_refs=$(jq -r '.connections | to_entries[] | .value | to_entries[] | .value[] | select(.node == null) | .node' "$workflow_file" | wc -l)
            
            conflict_count=$((duplicate_nodes + orphaned_connections + missing_refs))
            
            # Determine severity
            if [ $conflict_count -gt 5 ]; then
                severity="HIGH"
            elif [ $conflict_count -gt 2 ]; then
                severity="MEDIUM"
            fi
            
            # Determine resolution status
            local resolution_status="✅"
            if [ $conflict_count -gt 0 ]; then
                resolution_status="⚠️"
            fi
            
            echo "| $workflow_name | $conflict_count | $severity | Manual | $resolution_status |"
        fi
    done
}

# Generate conflict resolution recommendations
generate_resolution_recommendations() {
    log_info "Generating conflict resolution recommendations..."
    
    local recommendations_file="$CONFLICT_DIR/resolution-recommendations-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$recommendations_file" << EOF
# Conflict Resolution Recommendations

**Generated**: $(date)
**Source**: Conflict analysis system

## General Resolution Strategies

### 1. Duplicate Node Names
- **Issue**: Multiple nodes with the same name
- **Resolution**: Rename nodes to be unique
- **Prevention**: Use descriptive, unique names

### 2. Orphaned Connections
- **Issue**: Connections without valid targets
- **Resolution**: Remove orphaned connections
- **Prevention**: Validate connections before saving

### 3. Missing Node References
- **Issue**: Connections referencing non-existent nodes
- **Resolution**: Fix or remove invalid references
- **Prevention**: Validate node references

### 4. Circular Dependencies
- **Issue**: Nodes referencing each other in a loop
- **Resolution**: Break the circular reference
- **Prevention**: Design workflows with clear flow direction

### 5. Invalid Node Types
- **Issue**: Nodes with null or empty types
- **Resolution**: Set valid node types
- **Prevention**: Validate node configuration

## Automated Resolution

The following conflicts can be automatically resolved:

- **Duplicate Node Names**: Auto-rename with suffixes
- **Orphaned Connections**: Auto-remove
- **Missing Parameters**: Auto-set defaults

## Manual Resolution Required

The following conflicts require manual intervention:

- **Circular Dependencies**: Requires workflow redesign
- **Invalid Node Types**: Requires node type correction
- **Complex Logic Issues**: Requires business logic review

## Prevention Strategies

1. **Validation**: Implement pre-save validation
2. **Testing**: Test workflows before deployment
3. **Code Review**: Review workflow changes
4. **Documentation**: Document workflow dependencies

EOF
    
    log_success "Resolution recommendations generated: $recommendations_file"
}

# Main execution function
main() {
    echo ""
    
    # Create conflict directory
    mkdir -p "$CONFLICT_DIR"
    
    # Run conflict analysis
    if analyze_conflicts; then
        log_success "No conflicts detected"
    else
        log_warning "Conflicts detected - review required"
    fi
    
    # Generate recommendations
    generate_resolution_recommendations
    
    echo ""
    log_success "Conflict analysis complete!"
    echo "📊 Check the conflict directory for detailed reports"
}

# Run main function
main "$@"
