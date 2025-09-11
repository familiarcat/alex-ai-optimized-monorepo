#!/bin/bash

# =============================================================================
# Milestone Script Consolidation Utility
# =============================================================================
# 
# This script helps consolidate and optimize the existing milestone scripts
# by identifying redundancies and creating a migration plan.
#
# =============================================================================

set -euo pipefail

readonly SCRIPT_NAME="consolidate-milestone-scripts"
readonly VERSION="1.0.0"

# Color codes
readonly DATA_COLOR='\033[0;36m'
readonly GEORDI_COLOR='\033[0;33m'
readonly WORF_COLOR='\033[0;31m'
readonly CRUSHER_COLOR='\033[0;35m'
readonly NC='\033[0m'

# =============================================================================
# ANALYSIS FUNCTIONS
# =============================================================================

# Find all milestone-related scripts
find_milestone_scripts() {
    echo -e "${DATA_COLOR}🤖 Commander Data: Scanning for milestone-related scripts...${NC}"
    
    local scripts=()
    
    # Find shell scripts
    while IFS= read -r -d '' script; do
        if grep -l -i "milestone" "$script" >/dev/null 2>&1; then
            scripts+=("$script")
        fi
    done < <(find scripts -name "*.sh" -print0 2>/dev/null)
    
    # Find Python scripts
    while IFS= read -r -d '' script; do
        if grep -l -i "milestone" "$script" >/dev/null 2>&1; then
            scripts+=("$script")
        fi
    done < <(find scripts -name "*.py" -print0 2>/dev/null)
    
    echo -e "${DATA_COLOR}📊 Found ${#scripts[@]} milestone-related scripts${NC}"
    
    for script in "${scripts[@]}"; do
        echo "   • $script"
    done
    
    echo "${scripts[@]}"
}

# Analyze script functionality
analyze_script_functionality() {
    local script="$1"
    
    echo -e "${GEORDI_COLOR}🔧 Lieutenant Commander Geordi: Analyzing $script...${NC}"
    
    local functions=()
    local capabilities=()
    
    # Extract function names
    if [[ "$script" == *.sh ]]; then
        while IFS= read -r line; do
            if [[ "$line" =~ ^[a-zA-Z_][a-zA-Z0-9_]*\(\) ]]; then
                functions+=("$line")
            fi
        done < "$script"
    elif [[ "$script" == *.py ]]; then
        while IFS= read -r line; do
            if [[ "$line" =~ ^def\ [a-zA-Z_][a-zA-Z0-9_]* ]]; then
                functions+=("$line")
            fi
        done < "$script"
    fi
    
    # Extract capabilities based on keywords
    if grep -q -i "git.*commit\|commit.*git" "$script"; then
        capabilities+=("git-commit")
    fi
    
    if grep -q -i "git.*push\|push.*git" "$script"; then
        capabilities+=("git-push")
    fi
    
    if grep -q -i "turbo\|turborepo" "$script"; then
        capabilities+=("turborepo")
    fi
    
    if grep -q -i "security\|validate\|check" "$script"; then
        capabilities+=("security")
    fi
    
    if grep -q -i "health\|monitor\|diagnose" "$script"; then
        capabilities+=("health")
    fi
    
    if grep -q -i "crew\|alex.*ai" "$script"; then
        capabilities+=("crew-integration")
    fi
    
    echo -e "${DATA_COLOR}📋 Functions: ${#functions[@]}${NC}"
    if [[ ${#functions[@]} -gt 0 ]]; then
        for func in "${functions[@]}"; do
            echo "   • $func"
        done
    fi
    
    echo -e "${DATA_COLOR}🎯 Capabilities: ${#capabilities[@]}${NC}"
    for cap in "${capabilities[@]}"; do
        echo "   • $cap"
    done
    
    echo "${capabilities[@]}"
}

# Create migration plan
create_migration_plan() {
    local scripts=("$@")
    
    echo -e "${GEORDI_COLOR}🔧 Lieutenant Commander Geordi: Creating migration plan...${NC}"
    
    local migration_file="milestone-script-migration-plan.md"
    
    cat > "$migration_file" << EOF
# Milestone Script Migration Plan

## Overview
This document outlines the migration from multiple milestone scripts to the unified Alex AI Milestone Management System.

## Current Scripts Analysis

EOF

    for script in "${scripts[@]}"; do
        echo "### $script" >> "$migration_file"
        echo "" >> "$migration_file"
        
        # Get capabilities
        local capabilities
        capabilities=$(analyze_script_functionality "$script")
        
        echo "**Capabilities:**" >> "$migration_file"
        for cap in $capabilities; do
            echo "- $cap" >> "$migration_file"
        done
        echo "" >> "$migration_file"
        
        # Determine migration status
        if [[ "$script" == *"unified-milestone-system"* ]]; then
            echo "**Status:** ✅ KEEP - This is the new unified system" >> "$migration_file"
        elif [[ "$script" == *"turborepo-milestone-integration"* ]]; then
            echo "**Status:** ✅ KEEP - This is the turborepo integration system" >> "$migration_file"
        elif [[ "$script" == *"consolidate-milestone-scripts"* ]]; then
            echo "**Status:** ✅ KEEP - This is the consolidation utility" >> "$migration_file"
        else
            echo "**Status:** 🔄 MIGRATE - Functionality moved to unified system" >> "$migration_file"
        fi
        echo "" >> "$migration_file"
    done
    
    cat >> "$migration_file" << EOF

## Migration Strategy

### Phase 1: Consolidation
1. ✅ Create unified milestone system
2. ✅ Create turborepo integration system
3. ✅ Update package.json scripts
4. 🔄 Archive old scripts
5. 🔄 Update documentation

### Phase 2: Testing
1. Test unified system with existing workflows
2. Validate turborepo integration
3. Verify crew personality integration
4. Test security and health monitoring

### Phase 3: Cleanup
1. Move old scripts to archived directory
2. Update all references
3. Clean up redundant files
4. Optimize performance

## New Script Structure

### Primary Scripts
- \`alex-ai-unified-milestone-system.sh\` - Main milestone management
- \`turborepo-milestone-integration.sh\` - Turborepo integration
- \`consolidate-milestone-scripts.sh\` - This consolidation utility

### Package.json Integration
- \`milestone\` - Main milestone creation
- \`milestone:safe\` - Safe milestone creation
- \`milestone:turbo\` - Turborepo integration
- \`milestone:analyze\` - Workspace analysis
- \`milestone:optimize\` - Cache optimization
- \`milestone:performance\` - Performance analysis

## Benefits of Consolidation

1. **Unified Interface**: Single command for all milestone operations
2. **Crew Integration**: All 9 crew members with extended expertise
3. **Turborepo Optimization**: Advanced monorepo integration
4. **Security Enhancement**: Comprehensive validation and monitoring
5. **Health Monitoring**: System diagnostics and optimization
6. **Performance**: Optimized execution and caching
7. **Maintainability**: Single codebase for all milestone operations

## Next Steps

1. Test the unified system
2. Archive old scripts
3. Update team documentation
4. Train crew on new system
5. Monitor performance and optimize

EOF

    echo -e "${DATA_COLOR}📋 Migration plan created: $migration_file${NC}"
}

# Archive old scripts
archive_old_scripts() {
    local scripts=("$@")
    
    echo -e "${WORF_COLOR}🛡️ Lieutenant Worf: Archiving old scripts for security...${NC}"
    
    local archive_dir="scripts/archived/milestone-scripts-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$archive_dir"
    
    for script in "${scripts[@]}"; do
        if [[ "$script" != *"unified-milestone-system"* ]] && \
           [[ "$script" != *"turborepo-milestone-integration"* ]] && \
           [[ "$script" != *"consolidate-milestone-scripts"* ]]; then
            
            echo -e "${DATA_COLOR}📦 Archiving $script...${NC}"
            cp "$script" "$archive_dir/"
            
            # Create deprecation notice
            cat > "$archive_dir/$(basename "$script").deprecated" << EOF
# DEPRECATED SCRIPT

This script has been deprecated and replaced by the Alex AI Unified Milestone Management System.

## Migration Path
- Use: \`pnpm run milestone\` for basic milestone operations
- Use: \`pnpm run milestone:turbo\` for turborepo integration
- Use: \`pnpm run milestone:analyze\` for workspace analysis

## New Features
- Crew personality integration
- Advanced security validation
- Health monitoring
- Turborepo optimization
- Performance analysis

## Archive Date
$(date)

## Original Location
$script
EOF
        fi
    done
    
    echo -e "${CRUSHER_COLOR}🏥 Dr. Crusher: Archive created successfully${NC}"
    echo -e "${DATA_COLOR}📁 Archive location: $archive_dir${NC}"
}

# =============================================================================
# MAIN FUNCTIONS
# =============================================================================

# Show help
show_help() {
    echo "Milestone Script Consolidation Utility v$VERSION"
    echo "=============================================="
    echo ""
    echo "📋 USAGE:"
    echo "   $0 analyze"
    echo "   $0 migrate"
    echo "   $0 archive"
    echo "   $0 help"
    echo ""
    echo "📝 EXAMPLES:"
    echo "   $0 analyze    # Analyze all milestone scripts"
    echo "   $0 migrate    # Create migration plan"
    echo "   $0 archive    # Archive old scripts"
    echo ""
    echo "🎯 FEATURES:"
    echo "   • Script discovery and analysis"
    echo "   • Functionality mapping"
    echo "   • Migration plan generation"
    echo "   • Safe archiving of old scripts"
    echo "   • Crew integration validation"
    echo ""
}

# Main execution
main() {
    case "${1:-}" in
        "analyze")
            echo -e "${DATA_COLOR}🤖 Commander Data: Starting milestone script analysis...${NC}"
            local scripts
            read -ra scripts <<< "$(find_milestone_scripts)"
            
            for script in "${scripts[@]}"; do
                analyze_script_functionality "$script"
                echo ""
            done
            ;;
        "migrate")
            echo -e "${GEORDI_COLOR}🔧 Lieutenant Commander Geordi: Creating migration plan...${NC}"
            local scripts
            read -ra scripts <<< "$(find_milestone_scripts)"
            create_migration_plan "${scripts[@]}"
            ;;
        "archive")
            echo -e "${WORF_COLOR}🛡️ Lieutenant Worf: Archiving old scripts...${NC}"
            local scripts
            read -ra scripts <<< "$(find_milestone_scripts)"
            archive_old_scripts "${scripts[@]}"
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            echo "Error: Unknown command '${1:-}'"
            echo "Use 'help' for usage information"
            exit 1
            ;;
    esac
}

# Execute main function
main "$@"
