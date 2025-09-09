#!/bin/bash

# Alex AI Hourly Job Scraping Setup Script
# This script sets up automatic hourly job scraping

set -e

echo "🕐 Setting up Alex AI Hourly Job Scraping..."
echo "=============================================="

# Configuration
APP_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
CRON_SECRET="${CRON_SECRET:-alex-ai-cron-secret}"

# Function to check if URL is accessible
check_url() {
    local url=$1
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK"; then
        return 0
    else
        return 1
    fi
}

# Function to setup database schema
setup_database() {
    echo "📊 Setting up database schema..."
    
    if check_url "$APP_URL/api/setup-scheduled-scraping-schema"; then
        curl -X POST "$APP_URL/api/setup-scheduled-scraping-schema" \
            -H "Content-Type: application/json" \
            -d '{}' || {
            echo "⚠️  Warning: Could not setup database schema automatically"
            echo "   Please run the setup manually in the UI"
        }
    else
        echo "⚠️  Warning: App not accessible at $APP_URL"
        echo "   Please ensure the app is running and accessible"
    fi
}

# Function to initialize default configurations
initialize_configs() {
    echo "⚙️  Initializing default configurations..."
    
    if check_url "$APP_URL/api/scheduled-scraping"; then
        curl -X POST "$APP_URL/api/scheduled-scraping" \
            -H "Content-Type: application/json" \
            -d '{"action": "initialize"}' || {
            echo "⚠️  Warning: Could not initialize default configurations"
            echo "   Please run the initialization manually in the UI"
        }
    else
        echo "⚠️  Warning: App not accessible at $APP_URL"
    fi
}

# Function to test the cron endpoint
test_cron_endpoint() {
    echo "🧪 Testing cron endpoint..."
    
    if check_url "$APP_URL/api/cron-scheduler?action=status&secret=$CRON_SECRET"; then
        echo "✅ Cron endpoint is accessible"
        
        # Test the status endpoint
        response=$(curl -s "$APP_URL/api/cron-scheduler?action=status&secret=$CRON_SECRET")
        echo "📊 Current status: $response"
    else
        echo "❌ Cron endpoint is not accessible"
        echo "   Please check your app configuration and CRON_SECRET"
    fi
}

# Function to create cron job
create_cron_job() {
    echo "⏰ Setting up cron job..."
    
    # Create the cron command
    cron_command="0 * * * * curl -s '$APP_URL/api/cron-scheduler?action=run-scheduled&secret=$CRON_SECRET' > /dev/null 2>&1"
    
    # Check if cron job already exists
    if crontab -l 2>/dev/null | grep -q "cron-scheduler"; then
        echo "⚠️  Cron job already exists"
        echo "   Current cron jobs:"
        crontab -l 2>/dev/null | grep "cron-scheduler" || true
    else
        # Add the cron job
        (crontab -l 2>/dev/null; echo "$cron_command") | crontab -
        echo "✅ Cron job added successfully"
        echo "   Command: $cron_command"
    fi
}

# Function to create systemd timer (alternative to cron)
create_systemd_timer() {
    echo "🔄 Creating systemd timer (alternative to cron)..."
    
    # Create the service file
    sudo tee /etc/systemd/system/alex-ai-scraping.service > /dev/null << EOF
[Unit]
Description=Alex AI Hourly Job Scraping
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/bin/curl -s '$APP_URL/api/cron-scheduler?action=run-scheduled&secret=$CRON_SECRET'
User=www-data
Group=www-data
EOF

    # Create the timer file
    sudo tee /etc/systemd/system/alex-ai-scraping.timer > /dev/null << EOF
[Unit]
Description=Run Alex AI Hourly Job Scraping
Requires=alex-ai-scraping.service

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
EOF

    # Enable and start the timer
    sudo systemctl daemon-reload
    sudo systemctl enable alex-ai-scraping.timer
    sudo systemctl start alex-ai-scraping.timer
    
    echo "✅ Systemd timer created and started"
    echo "   Status: $(sudo systemctl is-active alex-ai-scraping.timer)"
}

# Function to create webhook-based scheduling (for cloud platforms)
create_webhook_scheduling() {
    echo "🌐 Creating webhook-based scheduling instructions..."
    
    cat << EOF

📋 Webhook-Based Scheduling Instructions:

For cloud platforms (Vercel, Netlify, etc.), use external cron services:

1. **Cron-job.org** (Free):
   - URL: https://cron-job.org/
   - Schedule: Every hour (0 * * * *)
   - URL: $APP_URL/api/cron-scheduler?action=run-scheduled&secret=$CRON_SECRET

2. **EasyCron** (Free tier):
   - URL: https://www.easycron.com/
   - Schedule: Every hour
   - URL: $APP_URL/api/cron-scheduler?action=run-scheduled&secret=$CRON_SECRET

3. **GitHub Actions** (if using GitHub):
   - Create .github/workflows/hourly-scraping.yml
   - Schedule: '0 * * * *'
   - Use: curl -X GET "$APP_URL/api/cron-scheduler?action=run-scheduled&secret=$CRON_SECRET"

4. **Vercel Cron** (if using Vercel):
   - Add to vercel.json:
     "crons": [{"path": "/api/cron-scheduler?action=run-scheduled&secret=$CRON_SECRET", "schedule": "0 * * * *"}]

EOF
}

# Main execution
    echo ""
    
    # Check if app is running
    if ! check_url "$APP_URL"; then
        echo "❌ App is not accessible at $APP_URL"
        echo "   Please ensure the Alex AI app is running"
        echo "   You can start it with: pnpm run dev"
        exit 1
    fi
    
    echo "✅ App is accessible at $APP_URL"
    echo ""
    
    # Setup database
    setup_database
    echo ""
    
    # Initialize configurations
    initialize_configs
    echo ""
    
    # Test cron endpoint
    test_cron_endpoint
    echo ""
    
    # Choose scheduling method
    echo "📅 Choose scheduling method:"
    echo "1) Cron job (Linux/macOS)"
    echo "2) Systemd timer (Linux)"
    echo "3) Webhook-based (Cloud platforms)"
    echo "4) Skip scheduling setup"
    
    read -p "Enter choice (1-4): " choice
    
    case $choice in
        1)
            create_cron_job
            ;;
        2)
            create_systemd_timer
            ;;
        3)
            create_webhook_scheduling
            ;;
        4)
            echo "⏭️  Skipping scheduling setup"
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
    
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Access the Alex AI app at: $APP_URL"
    echo "2. Go to the Scheduled Scraping dashboard"
    echo "3. Review and customize the default configurations"
    echo "4. Test manual execution of scheduled jobs"
    echo "5. Monitor the scheduled jobs in the dashboard"
    echo ""
    echo "🔧 Configuration:"
    echo "   App URL: $APP_URL"
    echo "   Cron Secret: $CRON_SECRET"
    echo "   Cron Endpoint: $APP_URL/api/cron-scheduler?action=run-scheduled&secret=$CRON_SECRET"
    echo ""
    echo "📊 Monitoring:"
    echo "   Status: $APP_URL/api/cron-scheduler?action=status&secret=$CRON_SECRET"
    echo "   Due Jobs: $APP_URL/api/cron-scheduler?action=check-due&secret=$CRON_SECRET"
}

# Run main function
main "$@"
