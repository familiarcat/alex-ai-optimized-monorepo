-- Alex AI Supabase Tables Creation SQL
-- Run this in your Supabase SQL Editor

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

-- Insert some sample data for testing
INSERT INTO job_opportunities (company, position, location, description, source) VALUES
('Alex AI Technologies', 'Senior AI Engineer', 'St. Louis, MO', 'Join our cutting-edge AI team to build the future of intelligent systems.', 'alex_ai'),
('TechCorp Inc', 'Full Stack Developer', 'Remote', 'Build scalable web applications using modern technologies.', 'job_board'),
('Innovation Labs', 'Data Scientist', 'St. Louis, MO', 'Analyze complex datasets to drive business insights and AI model development.', 'linkedin')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_opportunities_company ON job_opportunities(company);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_location ON job_opportunities(location);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_source ON job_opportunities(source);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Grant necessary permissions
GRANT ALL ON job_opportunities TO anon, authenticated;
GRANT ALL ON contacts TO anon, authenticated;
GRANT ALL ON applications TO anon, authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access to job_opportunities" ON job_opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to applications" ON applications FOR SELECT USING (true);

-- Create policies for insert/update (adjust as needed)
CREATE POLICY "Allow public insert to job_opportunities" ON job_opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to applications" ON applications FOR INSERT WITH CHECK (true);
