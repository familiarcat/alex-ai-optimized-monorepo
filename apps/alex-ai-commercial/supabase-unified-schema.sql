-- Unified Data Architecture Schema for Alex AI Job Search
-- This schema ensures both localhost and production use the same data structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create job_opportunities table with enhanced fields for n8n integration
CREATE TABLE IF NOT EXISTS job_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE, -- ID from n8n or external source
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    remote_option VARCHAR(100),
    salary_range VARCHAR(100),
    alex_ai_score INTEGER DEFAULT 0,
    application_url TEXT,
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    work_life_balance TEXT,
    alex_ai_leverage TEXT,
    company_type VARCHAR(50),
    st_louis_area BOOLEAN DEFAULT FALSE,
    st_louis_focus BOOLEAN DEFAULT FALSE,
    remote_friendly BOOLEAN DEFAULT FALSE,
    is_remote BOOLEAN DEFAULT FALSE,
    central_timezone BOOLEAN DEFAULT FALSE,
    
    -- n8n integration fields
    n8n_workflow_id VARCHAR(255),
    n8n_execution_id VARCHAR(255),
    n8n_data_source VARCHAR(100) DEFAULT 'n8n',
    
    -- Alex AI crew analysis
    alex_ai_crew_analysis JSONB,
    alex_ai_memory_id VARCHAR(255),
    alex_ai_leverage_factors TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table with enhanced fields
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE,
    company VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    title VARCHAR(255),
    email VARCHAR(255),
    linkedin TEXT,
    phone VARCHAR(50),
    confidence_level VARCHAR(20) CHECK (confidence_level IN ('low', 'medium', 'high')),
    contact_type VARCHAR(50) CHECK (contact_type IN ('hr_general', 'hiring_manager', 'talent_acquisition', 'application_submission', 'general_contact')),
    notes TEXT,
    
    -- n8n integration fields
    n8n_workflow_id VARCHAR(255),
    n8n_execution_id VARCHAR(255),
    n8n_data_source VARCHAR(100) DEFAULT 'n8n',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resume_analysis table
CREATE TABLE IF NOT EXISTS resume_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    resume_path TEXT,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    key_skills TEXT[],
    experience_level VARCHAR(100),
    alex_ai_expertise TEXT,
    best_matches JSONB,
    analysis_data JSONB,
    
    -- n8n integration fields
    n8n_workflow_id VARCHAR(255),
    n8n_execution_id VARCHAR(255),
    n8n_data_source VARCHAR(100) DEFAULT 'n8n',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES job_opportunities(id) ON DELETE CASCADE,
    user_id UUID,
    resume_version VARCHAR(100),
    cover_letter TEXT,
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) CHECK (status IN ('saved', 'applied', 'interview_scheduled', 'interviewed', 'offer_received', 'rejected', 'withdrawn')),
    response_date TIMESTAMP WITH TIME ZONE,
    interview_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    
    -- n8n integration fields
    n8n_workflow_id VARCHAR(255),
    n8n_execution_id VARCHAR(255),
    n8n_data_source VARCHAR(100) DEFAULT 'n8n',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_tracking_events table
CREATE TABLE IF NOT EXISTS job_tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- n8n integration fields
    n8n_workflow_id VARCHAR(255),
    n8n_execution_id VARCHAR(255),
    n8n_data_source VARCHAR(100) DEFAULT 'n8n',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    location_preference VARCHAR(255),
    salary_min INTEGER,
    salary_max INTEGER,
    work_life_balance_priority INTEGER DEFAULT 5,
    alex_ai_score_min INTEGER DEFAULT 70,
    company_types TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create data_sync_log table for tracking sync operations
CREATE TABLE IF NOT EXISTS data_sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sync_type VARCHAR(100) NOT NULL, -- 'n8n_to_supabase', 'supabase_to_n8n', 'manual_sync'
    source VARCHAR(100) NOT NULL, -- 'n8n', 'supabase', 'local'
    target VARCHAR(100) NOT NULL, -- 'supabase', 'n8n', 'local'
    table_name VARCHAR(100) NOT NULL,
    records_processed INTEGER DEFAULT 0,
    records_successful INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    sync_duration_ms INTEGER,
    error_message TEXT,
    sync_data JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_opportunities_company ON job_opportunities(company);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_position ON job_opportunities(position);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_alex_ai_score ON job_opportunities(alex_ai_score);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_company_type ON job_opportunities(company_type);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_st_louis ON job_opportunities(st_louis_area);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_remote ON job_opportunities(remote_friendly);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_external_id ON job_opportunities(external_id);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_updated_at ON job_opportunities(updated_at);

CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_type ON contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_external_id ON contacts(external_id);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

CREATE INDEX IF NOT EXISTS idx_job_tracking_events_application_id ON job_tracking_events(application_id);
CREATE INDEX IF NOT EXISTS idx_job_tracking_events_event_type ON job_tracking_events(event_type);

CREATE INDEX IF NOT EXISTS idx_data_sync_log_sync_type ON data_sync_log(sync_type);
CREATE INDEX IF NOT EXISTS idx_data_sync_log_created_at ON data_sync_log(created_at);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_job_opportunities_search ON job_opportunities USING gin(to_tsvector('english', company || ' ' || position || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_contacts_search ON contacts USING gin(to_tsvector('english', company || ' ' || COALESCE(name, '') || ' ' || COALESCE(title, '')));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_job_opportunities_updated_at BEFORE UPDATE ON job_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analysis ENABLE ROW LEVEL SECURITY;

-- Allow public read access to job_opportunities and contacts (for job search)
CREATE POLICY "Allow public read access to job_opportunities" ON job_opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to contacts" ON contacts FOR SELECT USING (true);

-- Allow public read access to resume_analysis (for analysis display)
CREATE POLICY "Allow public read access to resume_analysis" ON resume_analysis FOR SELECT USING (true);

-- Allow authenticated users to manage their own data
CREATE POLICY "Allow users to manage their own applications" ON applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to manage their own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to manage their own resume analysis" ON resume_analysis FOR ALL USING (auth.uid() = user_id);

-- Allow service role to manage all data (for sync operations)
CREATE POLICY "Allow service role full access" ON job_opportunities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON contacts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON applications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON job_tracking_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON user_preferences FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON resume_analysis FOR ALL USING (auth.role() = 'service_role');

-- Create function to log sync operations
CREATE OR REPLACE FUNCTION log_sync_operation(
    p_sync_type VARCHAR(100),
    p_source VARCHAR(100),
    p_target VARCHAR(100),
    p_table_name VARCHAR(100),
    p_records_processed INTEGER,
    p_records_successful INTEGER,
    p_records_failed INTEGER,
    p_sync_duration_ms INTEGER,
    p_error_message TEXT DEFAULT NULL,
    p_sync_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO data_sync_log (
        sync_type, source, target, table_name, records_processed,
        records_successful, records_failed, sync_duration_ms,
        error_message, sync_data
    ) VALUES (
        p_sync_type, p_source, p_target, p_table_name, p_records_processed,
        p_records_successful, p_records_failed, p_sync_duration_ms,
        p_error_message, p_sync_data
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get sync status
CREATE OR REPLACE FUNCTION get_sync_status()
RETURNS TABLE (
    table_name VARCHAR(100),
    last_sync TIMESTAMP WITH TIME ZONE,
    total_records BIGINT,
    sync_success_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name,
        MAX(t.last_synced_at) as last_sync,
        COUNT(*) as total_records,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND(
                    (COUNT(*) FILTER (WHERE t.last_synced_at > NOW() - INTERVAL '1 hour'))::NUMERIC / COUNT(*)::NUMERIC * 100, 
                    2
                )
            ELSE 0 
        END as sync_success_rate
    FROM (
        SELECT 'job_opportunities' as table_name, last_synced_at FROM job_opportunities
        UNION ALL
        SELECT 'contacts' as table_name, last_synced_at FROM contacts
        UNION ALL
        SELECT 'resume_analysis' as table_name, last_synced_at FROM resume_analysis
    ) t
    GROUP BY t.table_name
    ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO job_opportunities (
    external_id, company, position, location, remote_option, salary_range,
    alex_ai_score, application_url, description, requirements, benefits,
    work_life_balance, alex_ai_leverage, company_type, st_louis_area,
    remote_friendly, central_timezone, n8n_data_source
) VALUES (
    'n8n-job-1', 'Microsoft', 'Software Engineer - AI/ML', 'Redmond, WA', 'Hybrid',
    '$120k-180k', 95, 'https://careers.microsoft.com/us/en/job/123456',
    'AI/ML platform development for Azure services',
    'Python, Machine Learning, Azure, AI/ML',
    'Health, 401k, Stock options, Unlimited PTO',
    'Flexible hours, remote options, work-life balance focus',
    'Direct AI/ML expertise, Alex AI system development',
    'tech', false, true, true, 'n8n'
) ON CONFLICT (external_id) DO NOTHING;

-- Create view for unified job search
CREATE OR REPLACE VIEW unified_job_search AS
SELECT 
    jo.*,
    c.name as contact_name,
    c.title as contact_title,
    c.email as contact_email,
    c.linkedin as contact_linkedin,
    c.phone as contact_phone,
    c.confidence_level as contact_confidence,
    c.contact_type,
    CASE 
        WHEN jo.alex_ai_score >= 90 THEN 'Excellent Match'
        WHEN jo.alex_ai_score >= 80 THEN 'Strong Match'
        WHEN jo.alex_ai_score >= 70 THEN 'Good Match'
        ELSE 'Fair Match'
    END as match_quality
FROM job_opportunities jo
LEFT JOIN contacts c ON jo.company = c.company
WHERE jo.alex_ai_score >= 70
ORDER BY jo.alex_ai_score DESC, jo.updated_at DESC;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

