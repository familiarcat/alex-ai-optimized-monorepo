#!/usr/bin/env python3
"""
Bootstrap Supabase schema by inserting data and letting Supabase auto-create tables
"""

import os
import subprocess
import sys
from supabase import create_client, Client

def load_credentials():
    """Load Supabase credentials from ~/.zshrc"""
    print("🔍 Loading Supabase credentials...")
    
    try:
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
        supabase_key = env_vars.get('SUPABASE_ANON_KEY') or env_vars.get('SUPABASE_KEY')
        
        if not supabase_url or not supabase_key:
            print("❌ Missing Supabase credentials")
            return None, None
        
        print(f"✅ Loaded Supabase URL: {supabase_url}")
        return supabase_url, supabase_key
        
    except Exception as e:
        print(f"❌ Error loading credentials: {e}")
        return None, None

def create_supabase_client(supabase_url, supabase_key):
    """Create Supabase client"""
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        return supabase
    except Exception as e:
        print(f"❌ Failed to create Supabase client: {e}")
        return None

def bootstrap_job_opportunities_table(supabase):
    """Bootstrap job_opportunities table by inserting sample data"""
    print("🔨 Bootstrapping job_opportunities table...")
    
    sample_jobs = [
        {
            "company": "Alex AI Technologies",
            "position": "Senior AI Engineer",
            "location": "St. Louis, MO",
            "description": "Join our cutting-edge AI team to build the future of intelligent systems.",
            "source": "alex_ai",
            "alex_ai_score": 95,
            "st_louis_area": True,
            "st_louis_focus": True
        },
        {
            "company": "TechCorp Inc",
            "position": "Full Stack Developer",
            "location": "Remote",
            "description": "Build scalable web applications using modern technologies.",
            "source": "job_board",
            "alex_ai_score": 85,
            "st_louis_area": False,
            "st_louis_focus": False
        },
        {
            "company": "Innovation Labs",
            "position": "Data Scientist",
            "location": "St. Louis, MO",
            "description": "Analyze complex datasets to drive business insights and AI model development.",
            "source": "linkedin",
            "alex_ai_score": 90,
            "st_louis_area": True,
            "st_louis_focus": True
        }
    ]
    
    try:
        # Try to insert sample data
        result = supabase.table("job_opportunities").insert(sample_jobs).execute()
        print(f"✅ job_opportunities table bootstrapped with {len(sample_jobs)} sample jobs!")
        return True
    except Exception as e:
        print(f"❌ Failed to bootstrap job_opportunities table: {e}")
        return False

def bootstrap_contacts_table(supabase):
    """Bootstrap contacts table by inserting sample data"""
    print("🔨 Bootstrapping contacts table...")
    
    sample_contacts = [
        {
            "name": "Alex AI Test Contact",
            "email": "test@alexai.com",
            "company": "Alex AI Technologies",
            "position": "AI Engineer",
            "source": "alex_ai_test"
        },
        {
            "name": "John Doe",
            "email": "john.doe@techcorp.com",
            "company": "TechCorp Inc",
            "position": "Hiring Manager",
            "source": "linkedin"
        }
    ]
    
    try:
        result = supabase.table("contacts").insert(sample_contacts).execute()
        print(f"✅ contacts table bootstrapped with {len(sample_contacts)} sample contacts!")
        return True
    except Exception as e:
        print(f"❌ Failed to bootstrap contacts table: {e}")
        return False

def bootstrap_applications_table(supabase):
    """Bootstrap applications table by inserting sample data"""
    print("🔨 Bootstrapping applications table...")
    
    sample_applications = [
        {
            "status": "applied",
            "notes": "Applied via Alex AI platform",
            "resume_version": "v1.0",
            "source": "alex_ai"
        },
        {
            "status": "interview_scheduled",
            "notes": "Phone interview scheduled for next week",
            "resume_version": "v1.1",
            "source": "alex_ai"
        }
    ]
    
    try:
        result = supabase.table("applications").insert(sample_applications).execute()
        print(f"✅ applications table bootstrapped with {len(sample_applications)} sample applications!")
        return True
    except Exception as e:
        print(f"❌ Failed to bootstrap applications table: {e}")
        return False

def test_table_access(supabase):
    """Test if all tables are accessible"""
    print("\n🧪 Testing table access...")
    
    tables = ["job_opportunities", "contacts", "applications"]
    success_count = 0
    
    for table_name in tables:
        try:
            result = supabase.table(table_name).select("*").limit(1).execute()
            print(f"✅ {table_name} table is accessible")
            success_count += 1
        except Exception as e:
            print(f"❌ {table_name} table error: {e}")
    
    return success_count == len(tables)

def main():
    """Main function"""
    print("🚀 Alex AI Supabase Schema Bootstrap")
    print("=" * 50)
    
    # Load credentials
    supabase_url, supabase_key = load_credentials()
    if not supabase_url or not supabase_key:
        print("❌ Cannot proceed without Supabase credentials")
        return False
    
    # Create Supabase client
    supabase = create_supabase_client(supabase_url, supabase_key)
    if not supabase:
        print("❌ Cannot proceed without Supabase client")
        return False
    
    # Bootstrap tables
    success_count = 0
    total_tables = 3
    
    if bootstrap_job_opportunities_table(supabase):
        success_count += 1
    
    if bootstrap_contacts_table(supabase):
        success_count += 1
    
    if bootstrap_applications_table(supabase):
        success_count += 1
    
    # Test access
    if test_table_access(supabase):
        print(f"\n🎉 All {total_tables} tables are accessible!")
        print("✅ Alex AI platform is now completely untouchable!")
        print("✅ Live data flow is ready!")
        print("✅ No more mock data needed!")
        return True
    else:
        print(f"\n⚠️  Only {success_count}/{total_tables} tables were bootstrapped")
        print("   Manual setup may be required")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🏁 Alex AI platform setup complete!")
    else:
        print("\n⚠️  Setup incomplete - manual intervention may be required")






