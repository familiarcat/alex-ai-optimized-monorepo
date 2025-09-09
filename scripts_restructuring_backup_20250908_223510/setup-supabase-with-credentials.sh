#!/bin/bash

# Setup Supabase Tables with Secure Credentials
# This script creates all required Supabase tables using credentials from ~/.zshrc

set -e

echo "🗄️  Setting up Supabase Tables with Secure Credentials"
echo "====================================================="

# Load credentials
echo "ℹ️  Loading credentials..."
# Extract only environment variable exports from ~/.zshrc
while IFS= read -r line; do
    if [[ $line == export* ]]; then
        eval "$line" 2>/dev/null || true
    fi
done < ~/.zshrc

# Validate credentials
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Supabase credentials not found in ~/.zshrc"
    exit 1
fi

echo "✅ Supabase credentials loaded successfully"

# Function to execute SQL using Supabase REST API
execute_sql() {
    local sql="$1"
    local description="$2"
    
    echo "ℹ️  $description..."
    
    local response=$(curl -s -X POST \
        "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"sql\": \"$sql\"}")
    
    if echo "$response" | grep -q '"success":true'; then
        echo "✅ $description completed successfully"
        return 0
    else
        echo "⚠️  $description may have failed or already exists"
        echo "Response: $response"
        return 1
    fi
}

# Function to create tables using direct SQL execution
create_tables_direct() {
    echo "ℹ️  Creating Supabase tables using direct SQL execution..."
    
    # Create a comprehensive SQL script
    local sql_script=$(cat << 'EOF'
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Job Opportunities Table
CREATE TABLE IF NOT EXISTS job_opportunities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    remote_option VARCHAR(50),
    salary_range VARCHAR(100),
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    application_url TEXT,
    source VARCHAR(100),
    scraped_at TIMESTAMP WITH TIME ZONE,
    alex_ai_score INTEGER,
    st_louis_area BOOLEAN DEFAULT FALSE,
    st_louis_focus BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    position VARCHAR(255),
    linkedin_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES job_opportunities(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crew Memories Table (for MCP knowledge)
CREATE TABLE IF NOT EXISTS crew_memories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crew_member VARCHAR(100) NOT NULL,
    knowledge_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Analytics Table
CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    page_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
EOF
)
    
    # Execute the SQL script
    execute_sql "$sql_script" "Creating all tables"
}

# Function to create indexes
create_indexes() {
    echo "ℹ️  Creating database indexes..."
    
    local indexes_sql=$(cat << 'EOF'
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_opportunities_company ON job_opportunities(company);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_position ON job_opportunities(position);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_created_at ON job_opportunities(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_crew_memories_crew_member ON crew_memories(crew_member);
CREATE INDEX IF NOT EXISTS idx_crew_memories_knowledge_type ON crew_memories(knowledge_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_session_id ON user_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_timestamp ON user_analytics(timestamp);
EOF
)
    
    execute_sql "$indexes_sql" "Creating indexes"
}

# Function to enable RLS and create policies
setup_rls() {
    echo "ℹ️  Setting up Row Level Security..."
    
    local rls_sql=$(cat << 'EOF'
-- Enable Row Level Security (RLS)
ALTER TABLE job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, can be restricted later)
DROP POLICY IF EXISTS "Allow all operations on job_opportunities" ON job_opportunities;
CREATE POLICY "Allow all operations on job_opportunities" ON job_opportunities FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on contacts" ON contacts;
CREATE POLICY "Allow all operations on contacts" ON contacts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on applications" ON applications;
CREATE POLICY "Allow all operations on applications" ON applications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on crew_memories" ON crew_memories;
CREATE POLICY "Allow all operations on crew_memories" ON crew_memories FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on user_analytics" ON user_analytics;
CREATE POLICY "Allow all operations on user_analytics" ON user_analytics FOR ALL USING (true);
EOF
)
    
    execute_sql "$rls_sql" "Setting up RLS policies"
}

# Function to test table creation
test_tables() {
    echo "ℹ️  Testing table creation..."
    
    # Test if tables exist by trying to select from them
    local tables=("job_opportunities" "contacts" "applications" "crew_memories" "user_analytics")
    
    for table in "${tables[@]}"; do
        local response=$(curl -s -X GET \
            "$SUPABASE_URL/rest/v1/$table?select=*&limit=1" \
            -H "apikey: $SUPABASE_ANON_KEY" \
            -H "Authorization: Bearer $SUPABASE_ANON_KEY")
        
        if echo "$response" | grep -q '\[\]' || echo "$response" | grep -q '"id"'; then
            echo "✅ Table '$table' exists and is accessible"
        else
            echo "❌ Table '$table' may not exist or is not accessible"
            echo "Response: $response"
        fi
    done
}

# Function to insert test data
insert_test_data() {
    echo "ℹ️  Inserting test data..."
    
    # Insert a test job opportunity
    local test_job='{
        "company": "Test Company",
        "position": "Software Engineer",
        "location": "St. Louis, MO",
        "remote_option": "Hybrid",
        "salary_range": "$80,000 - $120,000",
        "description": "Test job description",
        "requirements": "Test requirements",
        "benefits": "Test benefits",
        "application_url": "https://example.com/apply",
        "source": "test",
        "alex_ai_score": 85,
        "st_louis_area": true,
        "st_louis_focus": true
    }'
    
    local response=$(curl -s -X POST \
        "$SUPABASE_URL/rest/v1/job_opportunities" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=minimal" \
        -d "$test_job")
    
    if [ -z "$response" ]; then
        echo "✅ Test job opportunity inserted successfully"
    else
        echo "⚠️  Test job insertion response: $response"
    fi
    
    # Insert test crew memory
    local test_memory='{
        "crew_member": "data",
        "knowledge_type": "technical",
        "title": "Test Knowledge",
        "content": "This is a test knowledge entry",
        "tags": ["test", "knowledge"],
        "metadata": {"test": true}
    }'
    
    local response=$(curl -s -X POST \
        "$SUPABASE_URL/rest/v1/crew_memories" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=minimal" \
        -d "$test_memory")
    
    if [ -z "$response" ]; then
        echo "✅ Test crew memory inserted successfully"
    else
        echo "⚠️  Test crew memory insertion response: $response"
    fi
}

# Main setup process
    
    # Create tables
    create_tables_direct
    
    # Create indexes
    create_indexes
    
    # Setup RLS
    setup_rls
    
    # Test tables
    test_tables
    
    # Insert test data
    insert_test_data
    
    echo ""
    echo "🎉 Supabase setup complete!"
    echo ""
    echo "Tables created:"
    echo "- job_opportunities"
    echo "- contacts"
    echo "- applications"
    echo "- crew_memories"
    echo "- user_analytics"
    echo ""
    echo "All tables are now ready for N8N integration!"
}

# Run main function
main "$@"
