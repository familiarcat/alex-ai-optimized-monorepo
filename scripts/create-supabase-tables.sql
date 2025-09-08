-- Alex AI Supabase Tables Creation Script
-- Execute this script in your Supabase SQL editor

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

-- Insert test data
INSERT INTO job_opportunities (
    company, position, location, remote_option, salary_range, 
    description, requirements, benefits, application_url, source,
    alex_ai_score, st_louis_area, st_louis_focus
) VALUES (
    'Test Company', 'Software Engineer', 'St. Louis, MO', 'Hybrid', 
    '$80,000 - $120,000', 'Test job description for Alex AI', 
    'React, TypeScript, Node.js', 'Health insurance, 401k, remote work',
    'https://example.com/apply', 'test', 85, true, true
) ON CONFLICT DO NOTHING;

INSERT INTO crew_memories (
    crew_member, knowledge_type, title, content, tags, metadata
) VALUES (
    'data', 'technical', 'Supabase Setup Complete', 
    'All Supabase tables have been created and configured successfully',
    ARRAY['setup', 'supabase', 'database'],
    '{"setup_complete": true, "timestamp": "' || NOW() || '"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Verify tables were created
SELECT 'Tables created successfully' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('job_opportunities', 'contacts', 'applications', 'crew_memories', 'user_analytics');