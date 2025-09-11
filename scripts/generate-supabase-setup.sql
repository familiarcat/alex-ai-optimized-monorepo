-- Alex AI Supabase Tables Setup
-- Copy and paste this entire script into your Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/strange-new-world/sql

-- ========================================
-- ALEX AI JOB SEARCH PLATFORM TABLES
-- ========================================

-- Create job_opportunities table
CREATE TABLE IF NOT EXISTS job_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE,
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

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    position VARCHAR(255),
    notes TEXT,
    linkedin_url TEXT,
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_opportunity_id UUID REFERENCES job_opportunities(id),
    contact_id UUID REFERENCES contacts(id),
    status VARCHAR(50) NOT NULL,
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    resume_version VARCHAR(255),
    cover_letter_version VARCHAR(255),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SAMPLE DATA FOR TESTING
-- ========================================

-- Insert sample job opportunities
INSERT INTO job_opportunities (company, position, location, description, source, alex_ai_score, st_louis_area, st_louis_focus) VALUES
('Alex AI Technologies', 'Senior AI Engineer', 'St. Louis, MO', 'Join our cutting-edge AI team to build the future of intelligent systems. We are looking for passionate engineers who want to revolutionize how AI is used in job search and career development.', 'alex_ai', 95, true, true),
('TechCorp Inc', 'Full Stack Developer', 'Remote', 'Build scalable web applications using modern technologies including React, Node.js, and cloud infrastructure. Work with a distributed team of talented developers.', 'job_board', 85, false, false),
('Innovation Labs', 'Data Scientist', 'St. Louis, MO', 'Analyze complex datasets to drive business insights and AI model development. Work with machine learning models and big data technologies.', 'linkedin', 90, true, true),
('Global Tech Solutions', 'DevOps Engineer', 'St. Louis, MO', 'Manage cloud infrastructure and deployment pipelines. Experience with AWS, Docker, and Kubernetes required.', 'indeed', 88, true, false),
('StartupXYZ', 'Product Manager', 'Remote', 'Lead product development for our AI-powered platform. Experience with agile methodologies and user research preferred.', 'angel_list', 82, false, false)
ON CONFLICT DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts (name, email, company, position, source) VALUES
('Alex AI Test Contact', 'test@alexai.com', 'Alex AI Technologies', 'AI Engineer', 'alex_ai_test'),
('John Doe', 'john.doe@techcorp.com', 'TechCorp Inc', 'Hiring Manager', 'linkedin'),
('Jane Smith', 'jane.smith@innovationlabs.com', 'Innovation Labs', 'Data Science Lead', 'linkedin'),
('Mike Johnson', 'mike.johnson@globaltech.com', 'Global Tech Solutions', 'DevOps Lead', 'indeed'),
('Sarah Wilson', 'sarah.wilson@startupxyz.com', 'StartupXYZ', 'Founder', 'angel_list')
ON CONFLICT (email) DO NOTHING;

-- Insert sample applications
INSERT INTO applications (status, notes, resume_version, source) VALUES
('applied', 'Applied via Alex AI platform - high confidence match', 'v1.0', 'alex_ai'),
('interview_scheduled', 'Phone interview scheduled for next week', 'v1.1', 'alex_ai'),
('under_review', 'Application under review by hiring team', 'v1.0', 'alex_ai'),
('rejected', 'Position filled internally', 'v1.0', 'alex_ai'),
('accepted', 'Job offer accepted!', 'v1.2', 'alex_ai')
ON CONFLICT DO NOTHING;

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Job opportunities indexes
CREATE INDEX IF NOT EXISTS idx_job_opportunities_company ON job_opportunities(company);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_location ON job_opportunities(location);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_source ON job_opportunities(source);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_st_louis ON job_opportunities(st_louis_area);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_score ON job_opportunities(alex_ai_score);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);

-- Applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_contact_id ON applications(contact_id);

-- ========================================
-- PERMISSIONS AND SECURITY
-- ========================================

-- Grant necessary permissions
GRANT ALL ON job_opportunities TO anon, authenticated;
GRANT ALL ON contacts TO anon, authenticated;
GRANT ALL ON applications TO anon, authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to job_opportunities" ON job_opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to applications" ON applications FOR SELECT USING (true);

-- Create policies for insert/update
CREATE POLICY "Allow public insert to job_opportunities" ON job_opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to applications" ON applications FOR INSERT WITH CHECK (true);

-- Create policies for update
CREATE POLICY "Allow public update to job_opportunities" ON job_opportunities FOR UPDATE USING (true);
CREATE POLICY "Allow public update to contacts" ON contacts FOR UPDATE USING (true);
CREATE POLICY "Allow public update to applications" ON applications FOR UPDATE USING (true);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Verify tables were created
SELECT 'job_opportunities' as table_name, COUNT(*) as record_count FROM job_opportunities
UNION ALL
SELECT 'contacts' as table_name, COUNT(*) as record_count FROM contacts
UNION ALL
SELECT 'applications' as table_name, COUNT(*) as record_count FROM applications;

-- Show sample data
SELECT 'Sample Job Opportunities:' as info;
SELECT company, position, location, alex_ai_score FROM job_opportunities LIMIT 3;

SELECT 'Sample Contacts:' as info;
SELECT name, email, company FROM contacts LIMIT 3;

SELECT 'Sample Applications:' as info;
SELECT status, notes, resume_version FROM applications LIMIT 3;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
SELECT '🎉 Alex AI Supabase tables created successfully!' as success_message;
SELECT '✅ All tables are ready for the Alex AI platform!' as ready_message;
SELECT '🚀 Live data flow is now operational!' as operational_message;







