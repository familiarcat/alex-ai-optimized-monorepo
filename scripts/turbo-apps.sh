#!/bin/bash

# =============================================================================
# Turborepo App Management Script
# =============================================================================
# 
# Simple script to list and select between turborepo apps
#
# =============================================================================

# Color codes
readonly DATA_COLOR='\033[0;36m'
readonly GEORDI_COLOR='\033[0;33m'
readonly PICARD_COLOR='\033[0;34m'
readonly NC='\033[0m'

print_info() {
    echo -e "${DATA_COLOR}🤖 Commander Data: $1${NC}"
}

print_geordi() {
    echo -e "${GEORDI_COLOR}🔧 Lieutenant Commander Geordi: $1${NC}"
}

print_picard() {
    echo -e "${PICARD_COLOR}👨‍✈️ Captain Picard: $1${NC}"
}

# List all apps in the monorepo
list_apps() {
    print_geordi "Scanning turborepo for available apps..."
    echo ""
    
    local apps=()
    local count=0
    
    # Find all apps directories
    for app_dir in apps/*/; do
        if [[ -d "$app_dir" ]] && [[ -f "$app_dir/package.json" ]]; then
            local app_name=$(basename "$app_dir")
            local package_name=$(grep '"name"' "$app_dir/package.json" | cut -d'"' -f4)
            local description=$(grep '"description"' "$app_dir/package.json" | cut -d'"' -f4)
            
            apps+=("$app_name:$package_name:$description")
            count=$((count + 1))
        fi
    done
    
    if [[ $count -eq 0 ]]; then
        print_info "No apps found in the monorepo"
        return 1
    fi
    
    print_picard "Found $count apps in the turborepo:"
    echo ""
    
    for i in "${!apps[@]}"; do
        IFS=':' read -r app_name package_name description <<< "${apps[$i]}"
        echo "  $((i + 1)). $app_name"
        echo "     Package: $package_name"
        echo "     Description: $description"
        echo ""
    done
    
    return 0
}

# Select and navigate to an app
select_app() {
    list_apps || return 1
    
    echo "Select an app to navigate to (1-$count):"
    read -p "Choice: " choice
    
    if [[ "$choice" =~ ^[0-9]+$ ]] && [[ "$choice" -ge 1 ]] && [[ "$choice" -le "$count" ]]; then
        local selected_app=$(ls apps/ | sed -n "${choice}p")
        print_geordi "Navigating to apps/$selected_app..."
        cd "apps/$selected_app"
        print_picard "Now in: $(pwd)"
        return 0
    else
        print_info "Invalid selection"
        return 1
    fi
}

# Show current app info
current_app() {
    local current_dir=$(pwd)
    local monorepo_root=""
    
    # Find monorepo root
    local dir=$(pwd)
    while [[ "$dir" != "/" ]]; do
        if [[ -f "$dir/package.json" && -f "$dir/turbo.json" ]]; then
            monorepo_root="$dir"
            break
        fi
        dir=$(dirname "$dir")
    done
    
    if [[ -n "$monorepo_root" ]]; then
        local relative_path=${current_dir#$monorepo_root/}
        if [[ "$relative_path" =~ ^apps/ ]]; then
            local app_name=$(basename "$relative_path")
            print_picard "Current app: $app_name"
            
            if [[ -f "package.json" ]]; then
                local package_name=$(grep '"name"' package.json | cut -d'"' -f4)
                local description=$(grep '"description"' package.json | cut -d'"' -f4)
                echo "  Package: $package_name"
                echo "  Description: $description"
            fi
        else
            print_info "Not in an app directory (currently in: $relative_path)"
        fi
    else
        print_info "Not in a turborepo"
    fi
}

# Run commands in current app
run_in_app() {
    local current_dir=$(pwd)
    local app_name=$(basename "$current_dir")
    
    if [[ -f "package.json" ]]; then
        print_geordi "Running '$*' in $app_name..."
        pnpm run "$@"
    else
        print_info "No package.json found in current directory"
        return 1
    fi
}

# Main function
main() {
    case "${1:-}" in
        "list"|"ls")
            list_apps
            ;;
        "select"|"sel")
            select_app
            ;;
        "current"|"cur")
            current_app
            ;;
        "run"|"r")
            shift
            run_in_app "$@"
            ;;
        "help"|"--help"|"-h")
            echo "Turborepo App Management"
            echo "======================="
            echo ""
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  list, ls     - List all available apps"
            echo "  select, sel  - Select and navigate to an app"
            echo "  current, cur - Show current app information"
            echo "  run, r       - Run command in current app"
            echo "  help, -h     - Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 list"
            echo "  $0 select"
            echo "  $0 current"
            echo "  $0 run dev"
            echo "  $0 run build"
            ;;
        *)
            print_picard "Turborepo App Management System"
            echo ""
            echo "Available commands:"
            echo "  list    - List all apps"
            echo "  select  - Select an app"
            echo "  current - Show current app"
            echo "  run     - Run command in app"
            echo "  help    - Show help"
            echo ""
            echo "Use: $0 help for detailed usage"
            ;;
    esac
}

# Run main function
main "$@"
