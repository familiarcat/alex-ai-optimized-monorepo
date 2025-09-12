#!/usr/bin/env python3
"""
Create Supabase tables using Supabase CLI
"""

import os
import subprocess
import sys
import tempfile

def create_sql_file():
    """Create a temporary SQL file with table definitions"""
    sql_content = """
-- Alex AI Supabase Tables Creation SQL
-- This will be executed via Supabase CLI

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
"""
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False) as f:
        f.write(sql_content)
        return f.name

def run_supabase_cli_command(sql_file):
    """Run Supabase CLI command to execute SQL"""
    print("🔧 Executing SQL via Supabase CLI...")
    
    try:
        # Try to execute SQL using supabase db push or similar command
        # First, let's try to check if we're in a Supabase project
        result = subprocess.run(['supabase', 'status'], capture_output=True, text=True)
        if result.returncode != 0:
            print("⚠️  Not in a Supabase project directory. Trying direct SQL execution...")
            
            # Try to execute SQL directly
            cmd = ['supabase', 'db', 'reset', '--db-url', 'postgresql://postgres:password@localhost:54322/postgres']
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                print("❌ Supabase CLI commands failed. Manual setup required.")
                return False
        
        # Try to execute the SQL file
        cmd = ['supabase', 'db', 'push', '--file', sql_file]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ SQL executed successfully via Supabase CLI!")
            return True
        else:
            print(f"⚠️  Supabase CLI push failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error running Supabase CLI: {e}")
        return False

def test_tables_via_api():
    """Test if tables are accessible via API"""
    print("\n🧪 Testing table access via API...")
    
    try:
        # Load credentials from ~/.zshrc
        result = subprocess.run(['bash', '-c', 'source ~/.zshrc && env | grep SUPABASE'], 
                              capture_output=True, text=True)
        
        if result.returncode != 0:
            print("❌ Failed to load credentials")
            return False
        
        env_vars = {}
        for line in result.stdout.strip().split('\n'):
            if '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value
        
        supabase_url = env_vars.get('SUPABASE_URL')
        supabase_key = env_vars.get('SUPABASE_ANON_KEY') or env_vars.get('SUPABASE_KEY')
        
        if not supabase_url or not supabase_key:
            print("❌ Missing credentials")
            return False
        
        # Test each table
        import requests
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json"
        }
        
        tables = ["job_opportunities", "contacts", "applications"]
        success_count = 0
        
        for table in tables:
            try:
                url = f"{supabase_url}/rest/v1/{table}"
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    print(f"✅ {table} table is accessible")
                    success_count += 1
                else:
                    print(f"❌ {table} table error: {response.status_code}")
            except Exception as e:
                print(f"❌ {table} table error: {e}")
        
        return success_count == len(tables)
        
    except Exception as e:
        print(f"❌ Error testing tables: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Alex AI Supabase CLI Setup")
    print("=" * 50)
    
    # Create SQL file
    sql_file = create_sql_file()
    print(f"📝 Created SQL file: {sql_file}")
    
    try:
        # Try to execute via Supabase CLI
        if run_supabase_cli_command(sql_file):
            print("✅ Tables created via Supabase CLI!")
        else:
            print("⚠️  Supabase CLI method failed. Manual setup required.")
            print(f"   SQL file available at: {sql_file}")
            print("   Copy the contents to Supabase SQL Editor")
        
        # Test table access
        if test_tables_via_api():
            print("\n🎉 All tables are accessible! Alex AI platform is ready!")
        else:
            print("\n⚠️  Some tables may not be accessible yet.")
            
    finally:
        # Clean up temporary file
        try:
            os.unlink(sql_file)
            print(f"🧹 Cleaned up temporary file: {sql_file}")
        except:
            pass

if __name__ == "__main__":
    main()








