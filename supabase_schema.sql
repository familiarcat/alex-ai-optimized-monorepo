-- Alex AI Job Search Database Schema
-- Run this script in Supabase SQL Editor to create all required tables

-- Create job_opportunities table
CREATE TABLE IF NOT EXISTS job_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  remote_option TEXT,
  salary_range TEXT,
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  application_url TEXT,
  source TEXT DEFAULT 'manual',
  scraped_at TIMESTAMP WITH TIME ZONE,
  alex_ai_score INTEGER DEFAULT 0,
  st_louis_area BOOLEAN DEFAULT false,
  st_louis_focus BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  position TEXT,
  linkedin_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES job_opportunities(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied',
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_analytics_events table
CREATE TABLE IF NOT EXISTS user_analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id TEXT,
  first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_visits INTEGER DEFAULT 1,
  average_session_duration INTEGER DEFAULT 0,
  preferred_update_frequency INTEGER DEFAULT 1440,
  last_manual_refresh TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_automatic_refresh TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_manual_refreshes INTEGER DEFAULT 0,
  total_automatic_refreshes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scraping_jobs table
CREATE TABLE IF NOT EXISTS scraping_jobs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  search_term TEXT NOT NULL,
  location TEXT NOT NULL,
  max_results INTEGER NOT NULL,
  status TEXT DEFAULT 'started',
  jobs_found INTEGER DEFAULT 0,
  jobs_stored INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  triggered_by TEXT DEFAULT 'manual',
  scheduled BOOLEAN DEFAULT false,
  config_id TEXT
);

-- Create scheduled_scraping_configs table
CREATE TABLE IF NOT EXISTS scheduled_scraping_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  search_term TEXT NOT NULL,
  location TEXT NOT NULL,
  max_results INTEGER NOT NULL,
  frequency_minutes INTEGER DEFAULT 60,
  enabled BOOLEAN DEFAULT true,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_scraping_status table
CREATE TABLE IF NOT EXISTS scheduled_scraping_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_id UUID REFERENCES scheduled_scraping_configs(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  jobs_found INTEGER DEFAULT 0,
  jobs_stored INTEGER DEFAULT 0,
  error_message TEXT
);

-- Create user_polling_preferences table
CREATE TABLE IF NOT EXISTS user_polling_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  preferred_frequency_minutes INTEGER DEFAULT 1440,
  is_active_user BOOLEAN DEFAULT false,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_opportunities_created_at ON job_opportunities(created_at);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_company ON job_opportunities(company);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_position ON job_opportunities(position);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_location ON job_opportunities(location);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_alex_ai_score ON job_opportunities(alex_ai_score);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);

CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

CREATE INDEX IF NOT EXISTS idx_user_analytics_events_session_id ON user_analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_events_timestamp ON user_analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_analytics_events_event_type ON user_analytics_events(event_type);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);

CREATE INDEX IF NOT EXISTS idx_scraping_jobs_started_at ON scraping_jobs(started_at);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);

CREATE INDEX IF NOT EXISTS idx_scheduled_scraping_configs_enabled ON scheduled_scraping_configs(enabled);
CREATE INDEX IF NOT EXISTS idx_scheduled_scraping_configs_next_run ON scheduled_scraping_configs(next_run);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_scraping_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_scraping_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_polling_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access to job_opportunities" ON job_opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to job_opportunities" ON job_opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to job_opportunities" ON job_opportunities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to job_opportunities" ON job_opportunities FOR DELETE USING (true);

CREATE POLICY "Allow public read access to contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to contacts" ON contacts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to contacts" ON contacts FOR DELETE USING (true);

CREATE POLICY "Allow public read access to applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to applications" ON applications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to applications" ON applications FOR DELETE USING (true);

CREATE POLICY "Allow public read access to user_analytics_events" ON user_analytics_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to user_analytics_events" ON user_analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to user_sessions" ON user_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to user_sessions" ON user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to user_sessions" ON user_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to scraping_jobs" ON scraping_jobs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to scraping_jobs" ON scraping_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to scraping_jobs" ON scraping_jobs FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to scheduled_scraping_configs" ON scheduled_scraping_configs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to scheduled_scraping_configs" ON scheduled_scraping_configs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to scheduled_scraping_configs" ON scheduled_scraping_configs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to scheduled_scraping_configs" ON scheduled_scraping_configs FOR DELETE USING (true);

CREATE POLICY "Allow public read access to scheduled_scraping_status" ON scheduled_scraping_status FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to scheduled_scraping_status" ON scheduled_scraping_status FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to user_polling_preferences" ON user_polling_preferences FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to user_polling_preferences" ON user_polling_preferences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to user_polling_preferences" ON user_polling_preferences FOR UPDATE USING (true);

-- Insert some sample data
INSERT INTO job_opportunities (company, position, location, remote_option, salary_range, description, alex_ai_score, st_louis_area, st_louis_focus) VALUES
('TechCorp', 'Senior AI Engineer', 'St. Louis, MO', 'Hybrid', '$120,000 - $150,000', 'Leading AI development team', 95, true, true),
('DataFlow Inc', 'Machine Learning Engineer', 'Remote', 'Remote', '$100,000 - $130,000', 'Building ML pipelines', 88, false, false),
('InnovateLab', 'AI Research Scientist', 'St. Louis, MO', 'On-site', '$140,000 - $180,000', 'Cutting-edge AI research', 92, true, true),
('CloudTech', 'DevOps Engineer', 'Remote', 'Remote', '$90,000 - $120,000', 'Cloud infrastructure management', 75, false, false),
('StartupXYZ', 'Full Stack Developer', 'St. Louis, MO', 'Hybrid', '$80,000 - $110,000', 'Building web applications', 70, true, false)
ON CONFLICT DO NOTHING;

INSERT INTO contacts (name, email, company, position, linkedin_url) VALUES
('John Smith', 'john@techcorp.com', 'TechCorp', 'HR Manager', 'https://linkedin.com/in/johnsmith'),
('Sarah Johnson', 'sarah@dataflow.com', 'DataFlow Inc', 'Recruiter', 'https://linkedin.com/in/sarahjohnson'),
('Mike Davis', 'mike@innovatelab.com', 'InnovateLab', 'Engineering Manager', 'https://linkedin.com/in/mikedavis')
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_job_opportunities_updated_at BEFORE UPDATE ON job_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scheduled_scraping_configs_updated_at BEFORE UPDATE ON scheduled_scraping_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_polling_preferences_updated_at BEFORE UPDATE ON user_polling_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database schema created successfully!' as message;
