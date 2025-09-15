#!/bin/bash
# Alex AI Unified CLI System
# Provides comprehensive command-line interface for all Alex AI capabilities

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

# Function to print colored output
print_status() {
    local status="$1"
    local message="$2"
    case "$status" in
        "info") echo -e "${BLUE}ℹ️  $message${NC}" ;;
        "success") echo -e "${GREEN}✅ $message${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "error") echo -e "${RED}❌ $message${NC}" ;;
        "header") echo -e "${PURPLE}🚀 $message${NC}" ;;
        "subheader") echo -e "${CYAN}  $message${NC}" ;;
        "crew") echo -e "${WHITE}👥 $message${NC}" ;;
    esac
}

# Function to show main help
show_help() {
    print_status "header" "Alex AI Unified CLI System"
    echo ""
    echo "Usage: $0 <module> <command> [options]"
    echo ""
    echo "Modules:"
    echo "  lottie     - Lottie animation management"
    echo "  milestone  - Milestone management"
    echo "  crew       - Crew coordination"
    echo "  rag        - RAG system management"
    echo "  n8n        - N8N workflow management"
    echo "  supabase   - Supabase database operations"
    echo "  status     - System status and health"
    echo ""
    echo "Examples:"
    echo "  $0 lottie search 'button hover' carson 10"
    echo "  $0 milestone create 'New Feature Complete' apps/my-app"
    echo "  $0 crew coordinate build"
    echo "  $0 rag integrate lottie"
    echo "  $0 status"
    echo ""
    echo "For module-specific help:"
    echo "  $0 <module> help"
}

# Function to show Lottie help
show_lottie_help() {
    print_status "header" "Alex AI Lottie Animation CLI"
    echo ""
    echo "Usage: $0 lottie <command> [options]"
    echo ""
    echo "Commands:"
    echo "  search <query> [design-theory] [limit]  Search for Lottie animations"
    echo "  generate <element-type> <design-theory> <visual-style>  Generate custom animation"
    echo "  store <animation-id>                    Store animation in RAG system"
    echo "  memories <query> [design-theory]        Search stored animation memories"
    echo "  workflow                                Create N8N workflow for Lottie management"
    echo "  integrate                               Run comprehensive Lottie integration"
    echo "  status                                  Show Lottie system status"
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
}

# Function to show milestone help
show_milestone_help() {
    print_status "header" "Alex AI Milestone Management CLI"
    echo ""
    echo "Usage: $0 milestone <command> [options]"
    echo ""
    echo "Commands:"
    echo "  create <title> <workspace>              Create a new milestone"
    echo "  list [workspace]                        List milestones"
    echo "  status <milestone-id>                   Show milestone status"
    echo "  push <milestone-id>                     Push milestone to remote"
    echo "  sync                                    Sync all milestones"
    echo ""
    echo "Examples:"
    echo "  $0 milestone create 'Feature Complete' apps/my-app"
    echo "  $0 milestone list apps/my-app"
    echo "  $0 milestone push milestone-123"
}

# Function to show crew help
show_crew_help() {
    print_status "header" "Alex AI Crew Coordination CLI"
    echo ""
    echo "Usage: $0 crew <command> [options]"
    echo ""
    echo "Commands:"
    echo "  coordinate <task>                       Coordinate crew for task execution"
    echo "  status                                  Show crew status"
    echo "  assign <member> <task>                  Assign specific task to crew member"
    echo "  meeting                                 Start crew coordination meeting"
    echo "  debrief                                 Generate crew debrief report"
    echo ""
    echo "Crew Members:"
    echo "  captain-picard     - Strategic Leadership"
    echo "  commander-riker    - Tactical Execution"
    echo "  commander-data     - Analytics & Logic"
    echo "  geordi-la-forge    - Infrastructure"
    echo "  lieutenant-worf    - Security"
    echo "  counselor-troi     - User Experience"
    echo "  lieutenant-uhura   - Communications"
    echo "  dr-crusher         - Health & Diagnostics"
    echo "  quark              - Business Intelligence"
}

# Function to show RAG help
show_rag_help() {
    print_status "header" "Alex AI RAG System CLI"
    echo ""
    echo "Usage: $0 rag <command> [options]"
    echo ""
    echo "Commands:"
    echo "  integrate <type>                        Integrate knowledge into RAG system"
    echo "  search <query> [type]                   Search RAG system"
    echo "  store <content> <type>                  Store content in RAG system"
    echo "  optimize                               Optimize RAG system"
    echo "  status                                 Show RAG system status"
    echo ""
    echo "Integration Types:"
    echo "  lottie        - Lottie animation knowledge"
    echo "  design-theory - Design theory knowledge"
    echo "  crew-memories - Crew member memories"
    echo "  project-data  - Project-specific data"
}

# Function to show N8N help
show_n8n_help() {
    print_status "header" "Alex AI N8N Workflow CLI"
    echo ""
    echo "Usage: $0 n8n <command> [options]"
    echo ""
    echo "Commands:"
    echo "  status                                  Show N8N system status"
    echo "  workflows                               List available workflows"
    echo "  trigger <workflow-id>                   Trigger specific workflow"
    echo "  create <workflow-name>                  Create new workflow"
    echo "  deploy                                  Deploy all workflows"
    echo "  logs <workflow-id>                      Show workflow logs"
}

# Function to show Supabase help
show_supabase_help() {
    print_status "header" "Alex AI Supabase CLI"
    echo ""
    echo "Usage: $0 supabase <command> [options]"
    echo ""
    echo "Commands:"
    echo "  status                                  Show Supabase connection status"
    echo "  tables                                  List database tables"
    echo "  query <sql>                             Execute SQL query"
    echo "  backup                                  Create database backup"
    echo "  restore <backup-file>                   Restore from backup"
    echo "  migrate                                 Run database migrations"
}

# Function to show system status
show_system_status() {
    print_status "header" "Alex AI System Status"
    echo ""
    
    # Check Python scripts
    print_status "subheader" "Python Scripts:"
    local scripts=(
        "scripts/python/alex_ai_lottie_integration.py"
        "scripts/python/lottie_rag_integration.py"
        "scripts/python/crew_coordinator.py"
        "scripts/python/mcp_integration_system.py"
    )
    
    for script in "${scripts[@]}"; do
        if [[ -f "$PROJECT_ROOT/$script" ]]; then
            print_status "success" "$script"
        else
            print_status "error" "$script (missing)"
        fi
    done
    
    # Check shell scripts
    print_status "subheader" "Shell Scripts:"
    local shell_scripts=(
        "scripts/alex-ai-lottie-cli.sh"
        "scripts/alex-ai-unified-milestone-system.sh"
    )
    
    for script in "${shell_scripts[@]}"; do
        if [[ -f "$PROJECT_ROOT/$script" ]]; then
            print_status "success" "$script"
        else
            print_status "error" "$script (missing)"
        fi
    done
    
    # Check data directories
    print_status "subheader" "Data Directories:"
    local data_dirs=(
        "data/lottie_animations"
        "data/lottie_memories"
        "workflows"
        "reports"
    )
    
    for dir in "${data_dirs[@]}"; do
        if [[ -d "$PROJECT_ROOT/$dir" ]]; then
            local count=$(find "$PROJECT_ROOT/$dir" -type f | wc -l)
            print_status "success" "$dir ($count files)"
        else
            print_status "warning" "$dir (not found)"
        fi
    done
    
    # Check environment variables
    print_status "subheader" "Environment Variables:"
    local env_vars=(
        "SUPABASE_URL"
        "SUPABASE_ANON_KEY"
        "N8N_URL"
        "OPENAI_API_KEY"
    )
    
    for var in "${env_vars[@]}"; do
        if [[ -n "${!var:-}" ]]; then
            print_status "success" "$var (configured)"
        else
            print_status "warning" "$var (not set)"
        fi
    done
    
    echo ""
    print_status "info" "System ready for Alex AI operations"
}

# Function to handle Lottie commands
handle_lottie() {
    local command="$2"  # Second argument is the command
    shift 2  # Remove 'lottie' and command from arguments
    
    case "$command" in
        "search")
            "$PROJECT_ROOT/scripts/alex-ai-lottie-cli.sh" search "$@"
            ;;
        "generate")
            "$PROJECT_ROOT/scripts/alex-ai-lottie-cli.sh" generate "$@"
            ;;
        "store")
            "$PROJECT_ROOT/scripts/alex-ai-lottie-cli.sh" store "$@"
            ;;
        "memories")
            "$PROJECT_ROOT/scripts/alex-ai-lottie-cli.sh" memories "$@"
            ;;
        "workflow")
            "$PROJECT_ROOT/scripts/alex-ai-lottie-cli.sh" workflow
            ;;
        "integrate")
            "$PROJECT_ROOT/scripts/alex-ai-lottie-cli.sh" integrate
            ;;
        "status")
            "$PROJECT_ROOT/scripts/alex-ai-lottie-cli.sh" status
            ;;
        "help"|"--help"|"-h")
            show_lottie_help
            ;;
        "")
            show_lottie_help
            ;;
        *)
            print_status "error" "Unknown Lottie command: $command"
            show_lottie_help
            exit 1
            ;;
    esac
}

# Function to handle milestone commands
handle_milestone() {
    local command="$2"  # Second argument is the command
    shift 2  # Remove 'milestone' and command from arguments
    
    case "$command" in
        "create")
            "$PROJECT_ROOT/scripts/alex-ai-unified-milestone-system.sh" "$@"
            ;;
        "list")
            print_status "info" "Listing milestones..."
            # Implementation for listing milestones
            ;;
        "status")
            print_status "info" "Checking milestone status..."
            # Implementation for milestone status
            ;;
        "push")
            print_status "info" "Pushing milestone..."
            # Implementation for pushing milestone
            ;;
        "sync")
            print_status "info" "Syncing milestones..."
            # Implementation for syncing milestones
            ;;
        "help"|"--help"|"-h")
            show_milestone_help
            ;;
        "")
            show_milestone_help
            ;;
        *)
            print_status "error" "Unknown milestone command: $command"
            show_milestone_help
            exit 1
            ;;
    esac
}

# Function to handle crew commands
handle_crew() {
    local command="$2"  # Second argument is the command
    shift 2  # Remove 'crew' and command from arguments
    
    case "$command" in
        "coordinate")
            print_status "crew" "Coordinating crew for task: $1"
            python3 "$PROJECT_ROOT/scripts/python/crew_coordinator.py" "$@"
            ;;
        "status")
            print_status "crew" "Crew status:"
            python3 "$PROJECT_ROOT/scripts/python/crew_coordinator.py" status
            ;;
        "assign")
            print_status "crew" "Assigning task to crew member..."
            python3 "$PROJECT_ROOT/scripts/python/crew_coordinator.py" assign "$@"
            ;;
        "meeting")
            print_status "crew" "Starting crew coordination meeting..."
            python3 "$PROJECT_ROOT/scripts/python/crew_coordinator.py" meeting
            ;;
        "debrief")
            print_status "crew" "Generating crew debrief report..."
            python3 "$PROJECT_ROOT/scripts/python/crew_coordinator.py" debrief
            ;;
        "help"|"--help"|"-h")
            show_crew_help
            ;;
        "")
            show_crew_help
            ;;
        *)
            print_status "error" "Unknown crew command: $command"
            show_crew_help
            exit 1
            ;;
    esac
}

# Function to handle RAG commands
handle_rag() {
    local command="$2"  # Second argument is the command
    shift 2  # Remove 'rag' and command from arguments
    
    case "$command" in
        "integrate")
            if [[ "$1" == "lottie" ]]; then
                print_status "info" "Integrating Lottie knowledge into RAG system..."
                python3 "$PROJECT_ROOT/scripts/python/simple_lottie_rag_integration.py"
            else
                print_status "info" "Integrating $1 knowledge into RAG system..."
                # Implementation for other integration types
            fi
            ;;
        "search")
            print_status "info" "Searching RAG system for: $1"
            # Implementation for RAG search
            ;;
        "store")
            print_status "info" "Storing content in RAG system..."
            # Implementation for RAG storage
            ;;
        "optimize")
            print_status "info" "Optimizing RAG system..."
            # Implementation for RAG optimization
            ;;
        "status")
            print_status "info" "RAG system status:"
            # Implementation for RAG status
            ;;
        "help"|"--help"|"-h")
            show_rag_help
            ;;
        "")
            show_rag_help
            ;;
        *)
            print_status "error" "Unknown RAG command: $command"
            show_rag_help
            exit 1
            ;;
    esac
}

# Function to handle N8N commands
handle_n8n() {
    local command="$2"  # Second argument is the command
    shift 2  # Remove 'n8n' and command from arguments
    
    case "$command" in
        "status")
            print_status "info" "Checking N8N system status..."
            curl -s "${N8N_URL:-http://localhost:5678}/api/v1/workflows" | jq '.data | length' 2>/dev/null || echo "N8N not accessible"
            ;;
        "workflows")
            print_status "info" "Listing N8N workflows..."
            curl -s "${N8N_URL:-http://localhost:5678}/api/v1/workflows" | jq '.data[] | {id, name, active}' 2>/dev/null || echo "N8N not accessible"
            ;;
        "trigger")
            print_status "info" "Triggering workflow: $1"
            curl -X POST "${N8N_URL:-http://localhost:5678}/api/v1/workflows/$1/execute" 2>/dev/null || echo "Failed to trigger workflow"
            ;;
        "create")
            print_status "info" "Creating workflow: $1"
            # Implementation for workflow creation
            ;;
        "deploy")
            print_status "info" "Deploying all workflows..."
            # Implementation for workflow deployment
            ;;
        "logs")
            print_status "info" "Showing logs for workflow: $1"
            # Implementation for workflow logs
            ;;
        "help"|"--help"|"-h")
            show_n8n_help
            ;;
        "")
            show_n8n_help
            ;;
        *)
            print_status "error" "Unknown N8N command: $command"
            show_n8n_help
            exit 1
            ;;
    esac
}

# Function to handle Supabase commands
handle_supabase() {
    local command="$2"  # Second argument is the command
    shift 2  # Remove 'supabase' and command from arguments
    
    case "$command" in
        "status")
            print_status "info" "Checking Supabase connection..."
            if [[ -n "${SUPABASE_URL:-}" && -n "${SUPABASE_ANON_KEY:-}" ]]; then
                print_status "success" "Supabase credentials configured"
            else
                print_status "error" "Supabase credentials not configured"
            fi
            ;;
        "tables")
            print_status "info" "Listing Supabase tables..."
            # Implementation for listing tables
            ;;
        "query")
            print_status "info" "Executing SQL query..."
            # Implementation for SQL query execution
            ;;
        "backup")
            print_status "info" "Creating database backup..."
            # Implementation for database backup
            ;;
        "restore")
            print_status "info" "Restoring from backup: $1"
            # Implementation for database restore
            ;;
        "migrate")
            print_status "info" "Running database migrations..."
            # Implementation for database migrations
            ;;
        "help"|"--help"|"-h")
            show_supabase_help
            ;;
        "")
            show_supabase_help
            ;;
        *)
            print_status "error" "Unknown Supabase command: $command"
            show_supabase_help
            exit 1
            ;;
    esac
}

# Main command handling
main() {
    local module="$1"
    
    case "$module" in
        "lottie")
            handle_lottie "$@"
            ;;
        "milestone")
            handle_milestone "$@"
            ;;
        "crew")
            handle_crew "$@"
            ;;
        "rag")
            handle_rag "$@"
            ;;
        "n8n")
            handle_n8n "$@"
            ;;
        "supabase")
            handle_supabase "$@"
            ;;
        "status")
            show_system_status
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            print_status "error" "Unknown module: $module"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
