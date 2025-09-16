#!/usr/bin/env python3
"""
Create Supabase tables directly using the Supabase client library
"""

import os
import sys
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = "https://rpkkkbufdwxmjaerbhbn.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_ibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU"

def create_supabase_client():
    """Create Supabase client"""
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        return supabase
    except Exception as e:
        print(f"❌ Failed to create Supabase client: {e}")
        return None

def create_tables_via_sql():
    """Create tables using raw SQL execution"""
    print("🔨 Creating Alex AI tables using direct SQL...")
    
    # SQL statements for table creation
    tables_sql = {
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
    
    supabase = create_supabase_client()
    if not supabase:
        return False
    
    success_count = 0
    total_tables = len(tables_sql)
    
    for table_name, sql in tables_sql.items():
        try:
            print(f"🔨 Creating {table_name} table...")
            # Try to execute SQL using RPC function
            result = supabase.rpc('exec_sql', {'sql': sql}).execute()
            print(f"✅ {table_name} table created successfully!")
            success_count += 1
        except Exception as e:
            print(f"❌ Failed to create {table_name} table: {e}")
            # Try alternative approach - insert a test record to see if table exists
            try:
                if table_name == "job_opportunities":
                    test_data = {
                        "company": "Test Company",
                        "position": "Test Position",
                        "location": "Test Location"
                    }
                    result = supabase.table(table_name).insert(test_data).execute()
                    print(f"✅ {table_name} table already exists and is accessible!")
                    success_count += 1
                elif table_name == "contacts":
                    test_data = {
                        "name": "Test Contact",
                        "email": "test@example.com"
                    }
                    result = supabase.table(table_name).insert(test_data).execute()
                    print(f"✅ {table_name} table already exists and is accessible!")
                    success_count += 1
                elif table_name == "applications":
                    test_data = {
                        "status": "test"
                    }
                    result = supabase.table(table_name).insert(test_data).execute()
                    print(f"✅ {table_name} table already exists and is accessible!")
                    success_count += 1
            except Exception as e2:
                print(f"❌ {table_name} table does not exist and cannot be created: {e2}")
    
    print(f"\n📊 Table creation summary: {success_count}/{total_tables} tables ready")
    return success_count == total_tables

def test_table_access():
    """Test if we can access the tables"""
    print("\n🧪 Testing table access...")
    
    supabase = create_supabase_client()
    if not supabase:
        return False
    
    tables_to_test = ["job_opportunities", "contacts", "applications"]
    
    for table_name in tables_to_test:
        try:
            result = supabase.table(table_name).select("*").limit(1).execute()
            print(f"✅ {table_name} table is accessible")
        except Exception as e:
            print(f"❌ {table_name} table is not accessible: {e}")
    
    return True

if __name__ == "__main__":
    print("🚀 Creating Alex AI Supabase tables...")
    print("=" * 50)
    
    # Try to create tables
    if create_tables_via_sql():
        print("\n🎉 All Alex AI tables created successfully!")
    else:
        print("\n⚠️  Some tables may not have been created. This could be due to:")
        print("   - Missing exec_sql RPC function in Supabase")
        print("   - Insufficient permissions with anon key")
        print("   - Tables already exist")
    
    # Test table access
    test_table_access()
    
    print("\n" + "=" * 50)
    print("🏁 Alex AI table setup complete!")


















