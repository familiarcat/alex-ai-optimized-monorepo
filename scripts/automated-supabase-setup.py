#!/usr/bin/env python3
"""
Automated Supabase table creation using credentials from ~/.zshrc
"""

import os
import requests
import json
import subprocess
import sys

def load_zshrc_credentials():
    """Load Supabase credentials from ~/.zshrc"""
    print("🔍 Loading Supabase credentials from ~/.zshrc...")
    
    try:
        # Source the .zshrc file and get environment variables
        result = subprocess.run(['bash', '-c', 'source ~/.zshrc && env | grep SUPABASE'], 
                              capture_output=True, text=True)
        
        if result.returncode != 0:
            print("❌ Failed to load ~/.zshrc credentials")
            return None, None
        
        env_vars = {}
        for line in result.stdout.strip().split('\n'):
            if '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value
        
        supabase_url = env_vars.get('SUPABASE_URL')
        supabase_anon_key = env_vars.get('SUPABASE_ANON_KEY') or env_vars.get('SUPABASE_KEY')
        
        if not supabase_url or not supabase_anon_key:
            print("❌ Missing Supabase credentials in ~/.zshrc")
            return None, None
        
        print(f"✅ Loaded Supabase URL: {supabase_url}")
        print(f"✅ Loaded Supabase Anon Key: {supabase_anon_key[:20]}...")
        
        return supabase_url, supabase_anon_key
        
    except Exception as e:
        print(f"❌ Error loading credentials: {e}")
        return None, None

def create_table_via_rest_api(supabase_url, supabase_key, table_name, sql_definition):
    """Create table using Supabase REST API"""
    print(f"🔨 Creating {table_name} table via REST API...")
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    # Try to create table using RPC function
    rpc_url = f"{supabase_url}/rest/v1/rpc/exec_sql"
    payload = {"sql": sql_definition}
    
    try:
        response = requests.post(rpc_url, headers=headers, json=payload)
        if response.status_code == 200:
            print(f"✅ {table_name} table created successfully!")
            return True
        else:
            print(f"⚠️  RPC exec_sql failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"⚠️  RPC exec_sql not available: {e}")
    
    # Fallback: Try to create table using direct SQL execution
    # This is a more direct approach using the REST API
    sql_url = f"{supabase_url}/rest/v1/rpc/exec"
    payload = {"query": sql_definition}
    
    try:
        response = requests.post(sql_url, headers=headers, json=payload)
        if response.status_code == 200:
            print(f"✅ {table_name} table created via exec RPC!")
            return True
        else:
            print(f"⚠️  exec RPC failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"⚠️  exec RPC not available: {e}")
    
    # Final fallback: Try to insert test data to see if table exists
    print(f"🔍 Checking if {table_name} table already exists...")
    try:
        test_url = f"{supabase_url}/rest/v1/{table_name}"
        response = requests.get(test_url, headers=headers)
        if response.status_code == 200:
            print(f"✅ {table_name} table already exists and is accessible!")
            return True
        else:
            print(f"❌ {table_name} table does not exist: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error checking {table_name} table: {e}")
    
    return False

def create_alex_ai_tables():
    """Create all Alex AI tables"""
    print("🚀 Starting automated Alex AI Supabase table creation...")
    print("=" * 60)
    
    # Load credentials
    supabase_url, supabase_key = load_zshrc_credentials()
    if not supabase_url or not supabase_key:
        print("❌ Cannot proceed without Supabase credentials")
        return False
    
    # Table definitions
    tables = {
        "job_opportunities": """
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
        """,
        "contacts": """
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
        """,
        "applications": """
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
        """
    }
    
    success_count = 0
    total_tables = len(tables)
    
    for table_name, sql_definition in tables.items():
        print(f"\n{'='*20} {table_name.upper()} {'='*20}")
        if create_table_via_rest_api(supabase_url, supabase_key, table_name, sql_definition):
            success_count += 1
        print(f"{'='*50}")
    
    # Summary
    print(f"\n📊 Table Creation Summary: {success_count}/{total_tables} tables ready")
    
    if success_count == total_tables:
        print("🎉 All Alex AI tables are ready! The platform is now untouchable!")
        return True
    else:
        print("⚠️  Some tables may need manual creation in Supabase dashboard")
        print("   Use the SQL script: scripts/supabase-table-sql.sql")
        return False

def test_table_access():
    """Test access to all tables"""
    print("\n🧪 Testing table access...")
    
    supabase_url, supabase_key = load_zshrc_credentials()
    if not supabase_url or not supabase_key:
        return False
    
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    tables_to_test = ["job_opportunities", "contacts", "applications"]
    
    for table_name in tables_to_test:
        try:
            url = f"{supabase_url}/rest/v1/{table_name}"
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                print(f"✅ {table_name} table is accessible")
            else:
                print(f"❌ {table_name} table error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ {table_name} table error: {e}")

if __name__ == "__main__":
    print("🚀 Alex AI Automated Supabase Setup")
    print("=" * 60)
    
    # Create tables
    success = create_alex_ai_tables()
    
    # Test access
    test_table_access()
    
    if success:
        print("\n🎉 Alex AI platform is now completely untouchable!")
        print("   ✅ All tables created and accessible")
        print("   ✅ Live data flow ready")
        print("   ✅ No more mock data needed")
    else:
        print("\n⚠️  Manual intervention may be required")
        print("   Check Supabase dashboard and run the SQL script if needed")
    
    print("\n🏁 Automated setup complete!")


















