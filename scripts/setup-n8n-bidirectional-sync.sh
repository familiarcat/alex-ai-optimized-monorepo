#!/bin/bash

# N8N Bi-Directional Sync Setup Script
# ====================================
# This script sets up the complete bi-directional sync system for N8N workflows

set -e

echo "🚀 N8N Bi-Directional Sync Setup"
echo "================================="
echo ""

# Configuration
N8N_URL="${N8N_URL:-https://n8n.pbradygeorgen.com}"
WORKFLOWS_DIR="workflows"
ANALYSIS_DIR="analysis"
SCRIPTS_DIR="scripts"
DASHBOARD_DIR="dashboard"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
}

}

}

}

# Check prerequisites
    
    # Check if N8N_API_KEY is set
    if [ -z "$N8N_API_KEY" ]; then
        log_error "N8N_API_KEY environment variable not set"
        log_info "Please set N8N_API_KEY in your environment or ~/.zshrc"
        exit 1
    fi
    
    # Check if Python 3 is available
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is required but not installed"
        exit 1
    fi
    
    # Check if required Python packages are available
    python3 -c "import requests, json, hashlib, datetime" 2>/dev/null || {
        log_error "Required Python packages not available"
        log_info "Installing required packages..."
        pip3 install requests
    }
    
    log_success "Prerequisites check passed"
}

# Create directory structure
create_directories() {
    log_info "Creating directory structure..."
    
    mkdir -p "$WORKFLOWS_DIR"
    mkdir -p "$ANALYSIS_DIR"
    mkdir -p "$DASHBOARD_DIR"
    
    log_success "Directory structure created"
}

# Setup Python scripts
setup_python_scripts() {
    log_info "Setting up Python scripts..."
    
    # Make scripts executable
    chmod +x "$SCRIPTS_DIR/n8n-bidirectional-sync.py"
    chmod +x "$SCRIPTS_DIR/n8n-sync-monitor.py"
    
    # Test Python scripts
    log_info "Testing Python scripts..."
    
    # Test sync script
    if python3 "$SCRIPTS_DIR/n8n-bidirectional-sync.py" --test 2>/dev/null; then
        log_success "Sync script test passed"
    else
        log_warning "Sync script test failed (this is normal if N8N is not accessible)"
    fi
    
    log_success "Python scripts configured"
}

# Create configuration files
create_config_files() {
    log_info "Creating configuration files..."
    
    # Create .env file for sync system
    cat > .env.sync << EOF
# N8N Bi-Directional Sync Configuration
N8N_URL=$N8N_URL
N8N_API_KEY=$N8N_API_KEY
WORKFLOWS_DIR=$WORKFLOWS_DIR
ANALYSIS_DIR=$ANALYSIS_DIR
MONITOR_INTERVAL=60
ALERT_THRESHOLD=5
EOF
    
    # Create sync configuration
    cat > n8n-sync-config.json << EOF
{
  "n8n": {
    "url": "$N8N_URL",
    "api_key": "$N8N_API_KEY"
  },
  "sync": {
    "workflows_dir": "$WORKFLOWS_DIR",
    "analysis_dir": "$ANALYSIS_DIR",
    "monitor_interval": 60,
    "alert_threshold": 5
  },
  "dashboard": {
    "refresh_interval": 30000,
    "data_file": "n8n-sync-dashboard.json"
  }
}
EOF
    
    log_success "Configuration files created"
}

# Setup cron jobs
setup_cron_jobs() {
    log_info "Setting up automated sync..."
    
    # Get current directory
    CURRENT_DIR=$(pwd)
    
    # Create cron job for sync
    CRON_JOB="*/15 * * * * cd $CURRENT_DIR && python3 $SCRIPTS_DIR/n8n-bidirectional-sync.py >> n8n-sync.log 2>&1"
    
    # Check if cron job already exists
    if crontab -l 2>/dev/null | grep -q "n8n-bidirectional-sync.py"; then
        log_warning "Cron job already exists"
    else
        # Add cron job
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        log_success "Cron job added for automated sync (every 15 minutes)"
    fi
    
    # Create cron job for monitoring
    MONITOR_CRON="*/5 * * * * cd $CURRENT_DIR && python3 $SCRIPTS_DIR/n8n-sync-monitor.py >> n8n-monitor.log 2>&1"
    
    if crontab -l 2>/dev/null | grep -q "n8n-sync-monitor.py"; then
        log_warning "Monitor cron job already exists"
    else
        (crontab -l 2>/dev/null; echo "$MONITOR_CRON") | crontab -
        log_success "Monitor cron job added (every 5 minutes)"
    fi
}

# Create management scripts
create_management_scripts() {
    log_info "Creating management scripts..."
    
    # Create start sync script
    cat > start-sync.sh << 'EOF'
#!/bin/bash
echo "🔄 Starting N8N Bi-Directional Sync..."
python3 scripts/deployment/sync_operations/consolidated_sync_operations.py
EOF
    
    # Create start monitor script
    cat > start-monitor.sh << 'EOF'
#!/bin/bash
echo "🔍 Starting N8N Sync Monitor..."
python3 scripts/deployment/sync_operations/consolidated_sync_operations.py
EOF
    
    # Create dashboard script
    cat > start-dashboard.sh << 'EOF'
#!/bin/bash
echo "📊 Starting N8N Sync Dashboard..."
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080 --directory scripts
    echo "Dashboard available at: http://localhost:8080/n8n-sync-dashboard.html"
else
    echo "Python 3 not available. Please open scripts/n8n-sync-dashboard.html in your browser"
fi
EOF
    
    # Create status script
    cat > sync-status.sh << 'EOF'
#!/bin/bash
echo "📊 N8N Sync Status"
echo "=================="
echo ""

if [ -f "n8n-sync-dashboard.json" ]; then
    echo "Dashboard Data:"
    python3 -c "
import json
try:
    with open('n8n-sync-dashboard.json', 'r') as f:
        data = json.load(f)
    sync_status = data.get('sync_status', {})
    print(f'  Health: {\"✅ Healthy\" if sync_status.get(\"is_healthy\") else \"❌ Unhealthy\"}')
    print(f'  Last Sync: {sync_status.get(\"last_sync\", \"Never\")}')
    print(f'  Workflows: {sync_status.get(\"active_workflows\", 0)}/{sync_status.get(\"total_workflows\", 0)}')
    print(f'  Errors (24h): {sync_status.get(\"sync_errors\", 0)}')
except Exception as e:
    print(f'  Error reading dashboard data: {e}')
"
else
    echo "No dashboard data available"
fi

echo ""
echo "Recent Sync Operations:"
if [ -f "n8n-sync-history.json" ]; then
    python3 -c "
import json
try:
    with open('n8n-sync-history.json', 'r') as f:
        data = json.load(f)
    operations = data.get('sync_operations', [])
    for op in operations[-5:]:
        print(f'  {op.get(\"timestamp\", \"Unknown\")} - {op.get(\"operation\", \"Unknown\")} - {op.get(\"workflow_name\", \"Unknown\")}')
except Exception as e:
    print(f'  Error reading sync history: {e}')
"
else
    echo "  No sync history available"
fi
EOF
    
    # Make scripts executable
    chmod +x start-sync.sh
    chmod +x start-monitor.sh
    chmod +x start-dashboard.sh
    chmod +x sync-status.sh
    
    log_success "Management scripts created"
}

# Test the setup
test_setup() {
    log_info "Testing setup..."
    
    # Test N8N connectivity
    log_info "Testing N8N connectivity..."
    if curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_URL/health" > /dev/null; then
        log_success "N8N connectivity test passed"
    else
        log_warning "N8N connectivity test failed (this may be normal if N8N is not accessible)"
    fi
    
    # Test Python scripts
    log_info "Testing Python scripts..."
    if python3 -c "import requests, json, hashlib, datetime" 2>/dev/null; then
        log_success "Python dependencies test passed"
    else
        log_error "Python dependencies test failed"
        exit 1
    fi
    
    log_success "Setup test completed"
}

# Create documentation
create_documentation() {
    log_info "Creating documentation..."
    
    cat > N8N_SYNC_README.md << EOF
# N8N Bi-Directional Sync System

## Overview

This system provides comprehensive bi-directional synchronization between your development environment and N8N production instance at $N8N_URL.

## Features

- **Bi-Directional Sync**: Changes flow both ways between dev and production
- **Real-time Monitoring**: Live monitoring of sync operations
- **Change Analysis**: Automatic analysis of workflow changes
- **Conflict Resolution**: Intelligent conflict detection and resolution
- **Web Dashboard**: Real-time dashboard for monitoring
- **Automated Scheduling**: Cron-based automated sync operations

## Quick Start

### 1. Start Sync
\`\`\`bash
./start-sync.sh
\`\`\`

### 2. Start Monitor
\`\`\`bash
./start-monitor.sh
\`\`\`

### 3. View Dashboard
\`\`\`bash
./start-dashboard.sh
\`\`\`
Then open http://localhost:8080/n8n-sync-dashboard.html

### 4. Check Status
\`\`\`bash
./sync-status.sh
\`\`\`

## Configuration

- **N8N_URL**: $N8N_URL
- **Workflows Directory**: $WORKFLOWS_DIR
- **Analysis Directory**: $ANALYSIS_DIR
- **Sync Interval**: Every 15 minutes
- **Monitor Interval**: Every 5 minutes

## Files Created

- \`n8n-sync-config.json\` - Main configuration
- \`n8n-sync-history.json\` - Sync operation history
- \`n8n-sync-dashboard.json\` - Dashboard data
- \`workflows/\` - Synced workflow files
- \`analysis/\` - Workflow change analyses

## Management Scripts

- \`start-sync.sh\` - Run sync manually
- \`start-monitor.sh\` - Start monitoring
- \`start-dashboard.sh\` - Start web dashboard
- \`sync-status.sh\` - Check sync status

## Logs

- \`n8n-sync.log\` - Sync operation logs
- \`n8n-monitor.log\` - Monitor logs

## Troubleshooting

1. **Check N8N connectivity**: Ensure N8N_API_KEY is set correctly
2. **Check logs**: Review log files for errors
3. **Check status**: Run \`./sync-status.sh\` for current status
4. **Manual sync**: Run \`./start-sync.sh\` for manual sync

## Support

For issues or questions, check the log files and run the status script.
EOF
    
    log_success "Documentation created"
}

# Main setup function
    log_info "Starting N8N Bi-Directional Sync Setup..."
    echo ""
    
    check_prerequisites
    create_directories
    setup_python_scripts
    create_config_files
    setup_cron_jobs
    create_management_scripts
    test_setup
    create_documentation
    
    echo ""
    log_success "N8N Bi-Directional Sync Setup Complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Run './start-sync.sh' to perform initial sync"
    echo "2. Run './start-monitor.sh' to start monitoring"
    echo "3. Run './start-dashboard.sh' to view the dashboard"
    echo "4. Run './sync-status.sh' to check status"
    echo ""
    echo "📚 Documentation: See N8N_SYNC_README.md"
    echo ""
    echo "🎉 Your N8N bi-directional sync system is ready!"
}

# Run main function
main "$@"

