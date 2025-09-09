#!/usr/bin/env python3
"""
Create missing Supabase tables for Alex AI Job Search
"""

import os
import requests
import json

# Supabase configuration
SUPABASE_URL = "https://rpkkkbufdwxmjaerbhbn.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_ibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU"

def create_job_opportunities_table():
    """Create the job_opportunities table"""
    print("🔨 Creating job_opportunities table...")
    
    # SQL to create the table
    sql = """
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
        alex_ai_score INTEGER DEFAULT 0,
        st_louis_area BOOLEAN DEFAULT FALSE,
        st_louis_focus BOOLEAN DEFAULT FALSE,
        remote_friendly BOOLEAN DEFAULT FALSE,
        is_remote BOOLEAN DEFAULT FALSE,
        central_timezone BOOLEAN DEFAULT FALSE,
        work_life_balance VARCHAR(100),
        alex_ai_leverage TEXT,
        company_type VARCHAR(100),
        n8n_workflow_id VARCHAR(255),
        n8n_execution_id VARCHAR(255),
        n8n_data_source VARCHAR(100),
        alex_ai_crew_analysis JSONB,
        alex_ai_memory_id VARCHAR(255),
        alex_ai_leverage_factors JSONB,
        work_life_balance_score INTEGER DEFAULT 5,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_synced_at TIMESTAMP WITH TIME ZONE
    );
    """
    
    # Try to execute via REST API
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json"
            },
            json={"sql": sql}
        )
        
        if response.status_code == 200:
            print("✅ job_opportunities table created successfully")
            return True
        else:
            print(f"❌ Failed to create table: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creating table: {e}")
        return False

def create_contacts_table():
    """Create the contacts table"""
    print("🔨 Creating contacts table...")
    
    sql = """
    CREATE TABLE IF NOT EXISTS contacts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        external_id VARCHAR(255) UNIQUE,
        company VARCHAR(255),
        name VARCHAR(255),
        title VARCHAR(255),
        email VARCHAR(255),
        linkedin VARCHAR(255),
        phone VARCHAR(50),
        confidence_level INTEGER DEFAULT 0,
        contact_type VARCHAR(100),
        notes TEXT,
        n8n_workflow_id VARCHAR(255),
        n8n_execution_id VARCHAR(255),
        n8n_data_source VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_synced_at TIMESTAMP WITH TIME ZONE
    );
    """
    
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json"
            },
            json={"sql": sql}
        )
        
        if response.status_code == 200:
            print("✅ contacts table created successfully")
            return True
        else:
            print(f"❌ Failed to create table: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creating table: {e}")
        return False

def create_applications_table():
    """Create the applications table"""
    print("🔨 Creating applications table...")
    
    sql = """
    CREATE TABLE IF NOT EXISTS applications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        job_id UUID REFERENCES job_opportunities(id),
        status VARCHAR(50) DEFAULT 'applied',
        application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        notes TEXT,
        follow_up_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json"
            },
            json={"sql": sql}
        )
        
        if response.status_code == 200:
            print("✅ applications table created successfully")
            return True
        else:
            print(f"❌ Failed to create table: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creating table: {e}")
        return False

def test_table_access():
    """Test if we can access the created tables"""
    print("🧪 Testing table access...")
    
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/job_opportunities?select=*&limit=1",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
            }
        )
        
        if response.status_code == 200:
            print("✅ job_opportunities table is accessible")
            return True
        else:
            print(f"❌ Cannot access job_opportunities: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing table access: {e}")
        return False

def main():
    print("🚀 Creating Supabase tables for Alex AI Job Search...")
    
    # Create tables
    tables_created = []
    tables_created.append(create_job_opportunities_table())
    tables_created.append(create_contacts_table())
    tables_created.append(create_applications_table())
    
    # Test access
    if all(tables_created):
        test_table_access()
        print("✅ All tables created successfully!")
    else:
        print("❌ Some tables failed to create")
    
    print("\n📋 Next steps:")
    print("1. Add SUPABASE_SERVICE_ROLE_KEY to ~/.zshrc")
    print("2. Update .env.local with the service role key")
    print("3. Restart the development server")

if __name__ == "__main__":
    main()
