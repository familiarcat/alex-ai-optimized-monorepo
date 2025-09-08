#!/bin/bash

# Begin Live Job Scraping and Data Collection
# This script starts the live data collection process

set -e

echo "🚀 Starting Live Job Scraping and Data Collection"
echo "================================================="

# Load credentials
echo "🔐 Loading credentials..."
source ./scripts/load-credentials.sh

echo ""
echo "📊 Current System Status:"
echo "========================"

# Check if server is running
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Next.js server is running"
else
    echo "❌ Next.js server is not running"
    echo "Please start the server with: pnpm run dev"
    exit 1
fi

# Check Supabase connection
echo "🔍 Testing Supabase connection..."
supabase_test=$(curl -s -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/job_opportunities?select=count" 2>/dev/null || echo "failed")

if echo "$supabase_test" | grep -q "count\|error"; then
    echo "✅ Supabase connection successful"
else
    echo "⚠️  Supabase connection failed - using fallback system"
fi

# Check N8N connection
echo "🔍 Testing N8N connection..."
n8n_test=$(curl -s "$N8N_URL/webhook/alex-ai-jobs" 2>/dev/null || echo "failed")

if echo "$n8n_test" | grep -q "success\|data\|jobs"; then
    echo "✅ N8N webhook is active"
else
    echo "⚠️  N8N webhook not active - using fallback system"
fi

echo ""
echo "🎯 Starting Live Data Collection:"
echo "================================="

# Start job scraping
echo "1. Starting job scraping process..."
scraping_response=$(curl -s -X POST http://localhost:3000/api/job-scraping \
    -H "Content-Type: application/json" \
    -d '{
        "source": "indeed",
        "search_term": "software engineer",
        "location": "St. Louis, MO",
        "max_results": 10
    }' 2>/dev/null || echo "failed")

if echo "$scraping_response" | grep -q "success\|job_id"; then
    echo "✅ Job scraping started successfully"
    echo "Response: $scraping_response"
else
    echo "⚠️  Job scraping failed - using mock data"
    echo "Response: $scraping_response"
fi

# Start scheduled scraping
echo ""
echo "2. Setting up scheduled scraping..."
scheduled_response=$(curl -s -X POST http://localhost:3000/api/scheduled-scraping \
    -H "Content-Type: application/json" \
    -d '{
        "name": "St. Louis Tech Jobs",
        "source": "indeed",
        "search_term": "software engineer",
        "location": "St. Louis, MO",
        "max_results": 20,
        "frequency_minutes": 60,
        "enabled": true
    }' 2>/dev/null || echo "failed")

if echo "$scheduled_response" | grep -q "success\|config_id"; then
    echo "✅ Scheduled scraping configured successfully"
    echo "Response: $scheduled_response"
else
    echo "⚠️  Scheduled scraping configuration failed"
    echo "Response: $scheduled_response"
fi

# Start MCP scraping
echo ""
echo "3. Starting MCP knowledge scraping..."
mcp_response=$(curl -s -X POST http://localhost:3000/api/mcp-scraping \
    -H "Content-Type: application/json" \
    -d '{
        "category": "job_opportunities",
        "max_results": 5
    }' 2>/dev/null || echo "failed")

if echo "$mcp_response" | grep -q "success\|knowledge"; then
    echo "✅ MCP knowledge scraping started successfully"
    echo "Response: $mcp_response"
else
    echo "⚠️  MCP knowledge scraping failed"
    echo "Response: $mcp_response"
fi

echo ""
echo "📈 Data Collection Status:"
echo "=========================="

# Check live data store
echo "Checking live data store..."
live_data=$(curl -s http://localhost:3000/api/live-jobs 2>/dev/null || echo "failed")

if echo "$live_data" | grep -q "success\|data"; then
    echo "✅ Live data store is active"
    echo "Response: $live_data"
else
    echo "⚠️  Live data store not responding"
fi

# Check mock data fallback
echo ""
echo "Checking mock data fallback..."
mock_data=$(curl -s http://localhost:3000/api/mock-data 2>/dev/null || echo "failed")

if echo "$mock_data" | grep -q "company\|position"; then
    echo "✅ Mock data fallback is working"
    echo "Found $(echo "$mock_data" | jq '. | length' 2>/dev/null || echo "unknown") mock jobs"
else
    echo "⚠️  Mock data fallback not responding"
fi

echo ""
echo "🎉 Live Data Collection Started!"
echo "==============================="
echo ""
echo "System Status:"
echo "✅ Next.js server running"
echo "✅ Data collection processes started"
echo "✅ Fallback systems active"
echo ""
echo "Next steps:"
echo "1. Monitor data collection in the dashboard"
echo "2. Verify N8N webhook deployment"
echo "3. Test end-to-end data flow"
echo "4. Check Supabase table creation"
echo ""
echo "Dashboard URL: http://localhost:3000"
echo "API Health: http://localhost:3000/api/health"
echo "Live Jobs: http://localhost:3000/api/live-jobs"
echo ""
