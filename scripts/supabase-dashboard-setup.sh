#!/bin/bash

# Alex AI Supabase Dashboard Setup Script
# This script will help you set up the Supabase tables for Alex AI

echo "🚀 Alex AI Supabase Dashboard Setup"
echo "=================================="
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS - opening Supabase dashboard..."
    
    # Open Supabase dashboard
    open "https://supabase.com/dashboard/project/strange-new-world/sql"
    
    echo "✅ Supabase dashboard opened in your browser"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy the contents of 'scripts/generate-supabase-setup.sql'"
    echo "2. Paste it into the SQL Editor in the dashboard"
    echo "3. Click 'Run' to execute the SQL"
    echo "4. Verify the tables are created successfully"
    echo ""
    echo "🔍 To copy the SQL file content, run:"
    echo "   cat scripts/generate-supabase-setup.sql | pbcopy"
    echo ""
    echo "   Or manually open: scripts/generate-supabase-setup.sql"
    
else
    echo "🖥️  Please open your browser and go to:"
    echo "   https://supabase.com/dashboard/project/strange-new-world/sql"
    echo ""
    echo "📋 Then follow these steps:"
    echo "1. Copy the contents of 'scripts/generate-supabase-setup.sql'"
    echo "2. Paste it into the SQL Editor in the dashboard"
    echo "3. Click 'Run' to execute the SQL"
    echo "4. Verify the tables are created successfully"
fi

echo ""
echo "🎯 After running the SQL, test with:"
echo "   python3 scripts/test-supabase-tables.py"
echo ""
echo "🏁 Once tables are created, Alex AI will be completely untouchable!"
