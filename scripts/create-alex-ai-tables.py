#!/usr/bin/env python3
"""
Create missing Supabase tables for Alex AI Job Search
"""

import os
import requests
import json

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def exec_sql(sql_query):
    """Execute SQL query using Supabase RPC function"""
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        print("❌ Supabase URL or Service Role Key not set.")
        return False

    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Supabase RPC endpoint for executing SQL
    # This assumes a custom RPC function 'exec_sql' exists on Supabase
    # If not, direct table creation via REST API is not standard for DDL
    # and typically requires a client library or dashboard.
    # For now, we'll try to use a generic RPC endpoint if available or simulate.
    
    # A more robust solution would be to use the Supabase Python client library
    # or direct psql connection.
    
    # For this script, we'll simulate a direct SQL execution if possible
    # or provide a clear error if the RPC function is not found.
    
    # Let's try to use the /rest/v1/rpc/exec_sql endpoint as a placeholder
    # This will likely fail if 'exec_sql' RPC is not explicitly created in Supabase
    rpc_url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    payload = {"query": sql_query}
    
    print(f"Attempting to execute SQL via RPC: {sql_query[:100]}...")
    try:
        response = requests.post(rpc_url, headers=headers, json=payload)
        response.raise_for_status() # Raise an exception for HTTP errors
        print(f"✅ SQL execution request sent successfully. Response: {response.text}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to execute SQL via RPC: {e}")
        if response is not None:
            print(f"Status Code: {response.status_code}")
            print(f"Response Text: {response.text}")
        return False

def create_job_opportunities_table():
    """Create the job_opportunities table"""
    print("🔨 Creating job_opportunities table...")
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
        alex_ai_score INTEGER,
        st_louis_area BOOLEAN DEFAULT FALSE,
        st_louis_focus BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    return exec_sql(sql)

def create_contacts_table():
    """Create the contacts table"""
    print("🔨 Creating contacts table...")
    sql = """
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
    """
    return exec_sql(sql)

def create_applications_table():
    """Create the applications table"""
    print("🔨 Creating applications table...")
    sql = """
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
    return exec_sql(sql)

if __name__ == "__main__":
    print("Starting Supabase table creation for Alex AI...")
    
    # Ensure environment variables are loaded
    from dotenv import load_dotenv
    load_dotenv()

    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        print("Environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.")
        print("Please ensure they are in your .env file or shell environment.")
        exit(1)

    success = True
    if not create_job_opportunities_table():
        success = False
    if not create_contacts_table():
        success = False
    if not create_applications_table():
        success = False

    if success:
        print("🎉 All Alex AI Supabase tables creation requests sent. Please check your Supabase dashboard for actual creation status.")
    else:
        print("❌ Some Alex AI Supabase tables failed to be created.")


















