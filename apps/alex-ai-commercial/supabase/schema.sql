-- Alex AI Job Search Database Schema
-- This schema supports the complete job search and tracking system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE job_status AS ENUM ('saved', 'applied', 'interview_scheduled', 'interviewed', 'offer_received', 'rejected', 'withdrawn');
CREATE TYPE contact_type AS ENUM ('hr_general', 'hiring_manager', 'talent_acquisition', 'application_submission', 'general_contact');
CREATE TYPE confidence_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE company_type AS ENUM ('tech', 'advertising', 'marketing', 'remote_first', 'established', 'fine_arts');

-- Job opportunities table
CREATE TABLE job_opportunities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    remote_option VARCHAR(50),
    salary_range VARCHAR(100),
    alex_ai_score INTEGER CHECK (alex_ai_score >= 0 AND alex_ai_score <= 100),
    application_url TEXT,
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    work_life_balance TEXT,
    alex_ai_leverage TEXT,
    company_type company_type,
    st_louis_area BOOLEAN DEFAULT FALSE,
    central_timezone BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    title VARCHAR(255),
    email VARCHAR(255),
    linkedin VARCHAR(255),
    phone VARCHAR(50),
    confidence_level confidence_level DEFAULT 'medium',
    contact_type contact_type,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES job_opportunities(id) ON DELETE CASCADE,
    user_id UUID, -- Will be linked to auth.users when auth is implemented
    resume_version VARCHAR(255),
    cover_letter TEXT,
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status job_status DEFAULT 'applied',
    response_date TIMESTAMP WITH TIME ZONE,
    interview_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume analysis table
CREATE TABLE resume_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID, -- Will be linked to auth.users when auth is implemented
    resume_path TEXT,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    key_skills TEXT[],
    experience_level VARCHAR(255),
    alex_ai_expertise TEXT,
    best_matches JSONB,
    analysis_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job tracking events table
CREATE TABLE job_tracking_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID, -- Will be linked to auth.users when auth is implemented
    location_preference VARCHAR(255),
    salary_min INTEGER,
    salary_max INTEGER,
    work_life_balance_priority INTEGER CHECK (work_life_balance_priority >= 1 AND work_life_balance_priority <= 5),
    alex_ai_score_min INTEGER CHECK (alex_ai_score_min >= 0 AND alex_ai_score_min <= 100),
    company_types company_type[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_job_opportunities_company ON job_opportunities(company);
CREATE INDEX idx_job_opportunities_alex_ai_score ON job_opportunities(alex_ai_score DESC);
CREATE INDEX idx_job_opportunities_st_louis ON job_opportunities(st_louis_area);
CREATE INDEX idx_job_opportunities_central_timezone ON job_opportunities(central_timezone);
CREATE INDEX idx_job_opportunities_company_type ON job_opportunities(company_type);

CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_contacts_confidence_level ON contacts(confidence_level);
CREATE INDEX idx_contacts_contact_type ON contacts(contact_type);

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_application_date ON applications(application_date);

CREATE INDEX idx_job_tracking_events_application_id ON job_tracking_events(application_id);
CREATE INDEX idx_job_tracking_events_event_type ON job_tracking_events(event_type);

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

-- Insert sample job opportunities
INSERT INTO job_opportunities (company, position, location, remote_option, salary_range, alex_ai_score, application_url, description, requirements, benefits, work_life_balance, alex_ai_leverage, company_type, st_louis_area, central_timezone) VALUES
('Microsoft', 'Software Engineer - AI/ML', 'Redmond, WA', 'Hybrid', '$120k-180k', 95, 'https://careers.microsoft.com/us/en/job/123456', 'AI/ML platform development for Azure services with focus on sustainability and environmental impact tracking.', 'Python, Machine Learning, Azure, AI/ML, TypeScript', 'Health, 401k, Stock options, Unlimited PTO', 'Flexible hours, remote options, work-life balance focus', 'Direct AI/ML expertise, Alex AI system development, enterprise-scale solutions', 'tech', false, false),
('HubSpot', 'Marketing Automation Specialist', 'Cambridge, MA', 'Remote', '$90k-130k', 90, 'https://www.hubspot.com/careers/job/123456', 'Marketing automation and CRM optimization with Alex AI integration expertise.', 'Marketing automation, CRM, AI tools, client management', 'Health, 401k, Unlimited PTO, Remote work', 'Remote-first, flexible schedule, work-life balance', 'Marketing automation expertise, Alex AI implementation, CRM optimization', 'tech', false, true),
('Wpromote', 'Managing Director - Central Region', 'St. Louis, MO', 'Hybrid', '$100k-150k', 85, 'https://www.wpromote.com/careers/', 'Lead integrated marketing teams and client portfolios in the Central Region.', 'Digital marketing, leadership, client management, team building', 'Health, 401k, Performance bonus, Flexible schedule', 'Flexible schedule, work-life balance focus, local St. Louis presence', 'Client-facing leadership, Alex AI implementation experience, business acumen', 'advertising', true, true),
('Breakthrough Fuel', 'Solutions Architect', 'St. Louis, MO', 'Hybrid', '$110k-160k', 88, 'https://www.breakthroughfuel.com/careers', 'Data-driven transportation solutions and sustainability initiatives.', 'AWS, data analytics, sustainability, architecture, TypeScript', 'Health, 401k, Stock options, Flexible hours', 'Flexible hours, remote options, work-life balance, local St. Louis', 'Solutions architecture, sustainability focus, Alex AI optimization', 'tech', true, true),
('Daugherty Business Solutions', 'Senior Consultant III', 'St. Louis, MO', 'Hybrid', '$95k-140k', 92, 'https://www.daugherty.com/careers', 'IT consulting and custom software development with existing relationship advantage.', 'AWS, React, Node.js, consulting, leadership, TypeScript', 'Health, 401k, Profit sharing, Flexible schedule', 'Flexible schedule, work-life balance focus, local St. Louis', 'Existing 9+ year relationship, Alex AI client implementations, network advantage', 'tech', true, true);

-- Insert sample contacts
INSERT INTO contacts (company, name, title, email, confidence_level, contact_type) VALUES
('Microsoft', 'Eric Boyd', 'VP AI Platform', 'eric.boyd@microsoft.com', 'high', 'hiring_manager'),
('Microsoft', 'HR Department', 'Human Resources', 'hr@microsoft.com', 'high', 'hr_general'),
('Microsoft', 'Talent Acquisition', 'Recruitment', 'talent@microsoft.com', 'high', 'talent_acquisition'),
('HubSpot', 'Dharmesh Shah', 'CTO & Co-founder', 'dharmesh@hubspot.com', 'high', 'hiring_manager'),
('HubSpot', 'HR Department', 'Human Resources', 'hr@hubspot.com', 'high', 'hr_general'),
('Wpromote', 'Michael Mothner', 'CEO', 'michael@wpromote.com', 'high', 'hiring_manager'),
('Wpromote', 'HR Department', 'Human Resources', 'hr@wpromote.com', 'high', 'hr_general'),
('Breakthrough Fuel', 'CTO', 'Chief Technology Officer', 'cto@breakthroughfuel.com', 'high', 'hiring_manager'),
('Breakthrough Fuel', 'HR Department', 'Human Resources', 'hr@breakthroughfuel.com', 'high', 'hr_general'),
('Daugherty Business Solutions', 'Ron Daugherty', 'CEO', 'ron@daugherty.com', 'high', 'hiring_manager');

-- Create RLS (Row Level Security) policies
ALTER TABLE job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (will be updated when auth is implemented)
CREATE POLICY "Enable read access for all users" ON job_opportunities FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON contacts FOR SELECT USING (true);

-- Create policies for authenticated users (placeholder for future auth implementation)
CREATE POLICY "Enable all access for authenticated users" ON applications FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON resume_analysis FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON job_tracking_events FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON user_preferences FOR ALL USING (true);
