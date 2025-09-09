#!/bin/bash

# Alex AI Supabase Table Setup Script
# This script guides you through setting up the required Supabase tables

set -e

echo "🗄️  Alex AI Supabase Table Setup"
echo "================================="
echo ""

# Load credentials from ~/.zshrc
echo "ℹ️  Loading credentials from ~/.zshrc..."
if [ -f ~/.zshrc ]; then
    while IFS= read -r line; do
        if [[ $line == export* ]]; then
            eval "$line" 2>/dev/null || true
        fi
    done < ~/.zshrc
    echo "✅ Credentials loaded"
else
    echo "❌ ~/.zshrc not found"
    exit 1
fi

echo ""
echo "📋 Supabase Project Information:"
echo "  URL: $SUPABASE_URL"
echo "  Project: $SUPABASE_PROJECT_NAME"
echo ""

echo "🔧 Manual Setup Required:"
echo "========================="
echo ""
echo "Since we need to create tables in Supabase, please follow these steps:"
echo ""
echo "1. Open your Supabase dashboard:"
echo "   https://supabase.com/dashboard/project/$SUPABASE_PROJECT_NAME"
echo ""
echo "2. Go to the SQL Editor"
echo ""
echo "3. Copy and paste the following SQL script:"
echo ""
echo "--- START SQL SCRIPT ---"
cat scripts/create-supabase-tables.sql
echo ""
echo "--- END SQL SCRIPT ---"
echo ""
echo "4. Click 'Run' to execute the script"
echo ""
echo "5. Verify the tables were created by checking the Table Editor"
echo ""

echo "📊 Expected Tables:"
echo "  - job_opportunities"
echo "  - contacts" 
echo "  - applications"
echo "  - crew_memories"
echo "  - user_analytics"
echo ""

echo "✅ After creating the tables, run the following to test the connection:"
echo "   pnpm run dev"
echo ""

echo "🔍 To verify tables were created, you can run:"
echo "   curl -X GET '$SUPABASE_URL/rest/v1/job_opportunities?select=*' \\"
echo "        -H 'apikey: $SUPABASE_ANON_KEY' \\"
echo "        -H 'Authorization: Bearer $SUPABASE_ANON_KEY'"
echo ""

echo "🎉 Once tables are created, the application should work properly!"