#!/bin/bash

# Setup Supabase Tables for Alex AI
# This script provides instructions and tools for setting up Supabase tables

set -e

echo "🏗️  Alex AI Supabase Tables Setup"
echo "================================="

# Load credentials
echo "🔐 Loading credentials..."
source ./scripts/load-credentials.sh

echo ""
echo "📋 Supabase Setup Instructions:"
echo "==============================="
echo ""
echo "1. Go to your Supabase Dashboard:"
echo "   https://supabase.com/dashboard"
echo ""
echo "2. Select your project:"
echo "   URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""
echo "3. Navigate to SQL Editor (left sidebar)"
echo ""
echo "4. Copy and paste the following SQL script:"
echo ""

# Display the SQL schema
echo "```sql"
cat supabase_schema.sql
echo "```"
echo ""

echo "5. Click 'Run' to execute the script"
echo ""
echo "6. Verify tables were created by checking the 'Table Editor'"
echo ""
echo "📊 Expected Tables:"
echo "  - job_opportunities"
echo "  - contacts"
echo "  - applications"
echo "  - user_analytics_events"
echo "  - user_sessions"
echo "  - scraping_jobs"
echo "  - scheduled_scraping_configs"
echo "  - scheduled_scraping_status"
echo "  - user_polling_preferences"
echo ""

echo "🧪 Testing Database Connection:"
echo "==============================="

# Test the database connection
echo "Testing Supabase connection..."
test_response=$(curl -s -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/job_opportunities?select=count" || echo "Connection failed")

if echo "$test_response" | grep -q "count\|error"; then
    echo "✅ Supabase connection successful"
    echo "Response: $test_response"
else
    echo "❌ Supabase connection failed"
    echo "Response: $test_response"
    echo ""
    echo "Please ensure:"
    echo "1. Tables are created in Supabase"
    echo "2. RLS policies are set up correctly"
    echo "3. API keys are valid"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Verify tables in Supabase Dashboard"
echo "2. Test the API endpoints"
echo "3. Deploy N8N webhooks"
echo "4. Begin live data collection"
echo ""
