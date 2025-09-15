#!/bin/bash
# Alex AI Lottie Animation CLI
# Provides command-line interface for Lottie animation management

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PYTHON_SCRIPT="$PROJECT_ROOT/scripts/python/alex_ai_lottie_integration.py"

# Function to print colored output
print_status() {
    local status="$1"
    local message="$2"
    case "$status" in
        "info") echo -e "${BLUE}ℹ️  $message${NC}" ;;
        "success") echo -e "${GREEN}✅ $message${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "error") echo -e "${RED}❌ $message${NC}" ;;
        "header") echo -e "${PURPLE}🎨 $message${NC}" ;;
        "subheader") echo -e "${CYAN}  $message${NC}" ;;
    esac
}

# Function to show help
show_help() {
    print_status "header" "Alex AI Lottie Animation CLI"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  search <query> [design-theory] [limit]  Search for Lottie animations"
    echo "  generate <element-type> <design-theory> <visual-style>  Generate custom animation"
    echo "  store <animation-id>                    Store animation in RAG system"
    echo "  memories <query> [design-theory]        Search stored animation memories"
    echo "  workflow                                Create N8N workflow for Lottie management"
    echo "  status                                  Show system status"
    echo "  help                                    Show this help message"
    echo ""
    echo "Design Theories:"
    echo "  carson     - Experimental, chaotic, bold, unconventional"
    echo "  brockmann  - Systematic, minimal, functional, precise"
    echo "  hybrid     - Balanced, modern, accessible, innovative"
    echo ""
    echo "Element Types:"
    echo "  button, card, navigation, form, hero, footer, sidebar, modal, tooltip, badge, progress, notification"
    echo ""
    echo "Visual Styles:"
    echo "  experimental, minimalist, bold, subtle, dynamic, static"
    echo ""
    echo "Examples:"
    echo "  $0 search 'button hover' carson 10"
    echo "  $0 generate button carson experimental"
    echo "  $0 memories 'loading animation' brockmann"
    echo "  $0 workflow"
}

# Function to search Lottie animations
search_animations() {
    local query="$1"
    local design_theory="${2:-hybrid}"
    local limit="${3:-10}"
    
    print_status "header" "Searching Lottie Animations"
    print_status "info" "Query: $query"
    print_status "info" "Design Theory: $design_theory"
    print_status "info" "Limit: $limit"
    echo ""
    
    python3 "$PYTHON_SCRIPT" search "$query" "$design_theory" "$limit"
}

# Function to generate custom animation
generate_animation() {
    local element_type="$1"
    local design_theory="$2"
    local visual_style="$3"
    
    if [[ -z "$element_type" || -z "$design_theory" || -z "$visual_style" ]]; then
        print_status "error" "Missing required parameters for generation"
        echo "Usage: $0 generate <element-type> <design-theory> <visual-style>"
        return 1
    fi
    
    print_status "header" "Generating Custom Lottie Animation"
    print_status "info" "Element Type: $element_type"
    print_status "info" "Design Theory: $design_theory"
    print_status "info" "Visual Style: $visual_style"
    echo ""
    
    python3 "$PYTHON_SCRIPT" generate "$element_type" "$design_theory" "$visual_style"
}

# Function to store animation in RAG
store_animation() {
    local animation_id="$1"
    
    if [[ -z "$animation_id" ]]; then
        print_status "error" "Animation ID required"
        echo "Usage: $0 store <animation-id>"
        return 1
    fi
    
    print_status "header" "Storing Animation in RAG System"
    print_status "info" "Animation ID: $animation_id"
    echo ""
    
    python3 "$PYTHON_SCRIPT" store "$animation_id"
}

# Function to search memories
search_memories() {
    local query="$1"
    local design_theory="${2:-all}"
    
    print_status "header" "Searching Animation Memories"
    print_status "info" "Query: $query"
    print_status "info" "Design Theory: $design_theory"
    echo ""
    
    python3 "$PYTHON_SCRIPT" memories "$query" "$design_theory"
}

# Function to create N8N workflow
create_workflow() {
    print_status "header" "Creating N8N Lottie Workflow"
    echo ""
    
    python3 "$PYTHON_SCRIPT" workflow
}

# Function to show system status
show_status() {
    print_status "header" "Alex AI Lottie System Status"
    echo ""
    
    # Check Python script
    if [[ -f "$PYTHON_SCRIPT" ]]; then
        print_status "success" "Python integration script found"
    else
        print_status "error" "Python integration script not found"
    fi
    
    # Check data directory
    local data_dir="$PROJECT_ROOT/data/lottie_animations"
    if [[ -d "$data_dir" ]]; then
        local count=$(find "$data_dir" -name "*.json" | wc -l)
        print_status "success" "Local storage directory found ($count animations)"
    else
        print_status "warning" "Local storage directory not found"
    fi
    
    # Check workflow directory
    local workflow_dir="$PROJECT_ROOT/workflows"
    if [[ -d "$workflow_dir" ]]; then
        local workflow_count=$(find "$workflow_dir" -name "*lottie*" | wc -l)
        print_status "success" "Workflow directory found ($workflow_count Lottie workflows)"
    else
        print_status "warning" "Workflow directory not found"
    fi
    
    # Check Supabase connection
    if [[ -n "$SUPABASE_URL" && -n "$SUPABASE_ANON_KEY" ]]; then
        print_status "success" "Supabase credentials configured"
    else
        print_status "warning" "Supabase credentials not configured"
    fi
    
    echo ""
    print_status "info" "System ready for Lottie animation management"
}

# Function to run comprehensive integration
run_integration() {
    print_status "header" "Running Comprehensive Lottie Integration"
    echo ""
    
    # Run the Python integration script
    python3 "$PYTHON_SCRIPT"
    
    if [[ $? -eq 0 ]]; then
        print_status "success" "Lottie integration completed successfully"
    else
        print_status "error" "Lottie integration failed"
        return 1
    fi
}

# Main command handling
main() {
    local command="$1"
    
    case "$command" in
        "search")
            search_animations "$2" "$3" "$4"
            ;;
        "generate")
            generate_animation "$2" "$3" "$4"
            ;;
        "store")
            store_animation "$2"
            ;;
        "memories")
            search_memories "$2" "$3"
            ;;
        "workflow")
            create_workflow
            ;;
        "status")
            show_status
            ;;
        "integrate"|"run")
            run_integration
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            print_status "error" "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
