#!/usr/bin/env python3
"""
Test Supabase table access and create sample data
"""

import os
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = "https://rpkkkbufdwxmjaerbhbn.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_ibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU"

def test_supabase_connection():
    """Test Supabase connection and table access"""
    print("🧪 Testing Supabase connection and table access...")
    
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        print("✅ Supabase client created successfully")
    except Exception as e:
        print(f"❌ Failed to create Supabase client: {e}")
        return False
    
    # Test each table
    tables_to_test = [
        {
            "name": "job_opportunities",
            "test_data": {
                "company": "Alex AI Test Company",
                "position": "AI Engineer",
                "location": "St. Louis, MO",
                "description": "Test job for Alex AI platform",
                "source": "alex_ai_test"
            }
        },
        {
            "name": "contacts",
            "test_data": {
                "name": "Alex AI Test Contact",
                "email": "test@alexai.com",
                "company": "Alex AI Technologies"
            }
        },
        {
            "name": "applications",
            "test_data": {
                "status": "test"
            }
        }
    ]
    
    results = {}
    
    for table_info in tables_to_test:
        table_name = table_info["name"]
        test_data = table_info["test_data"]
        
        print(f"\n🔍 Testing {table_name} table...")
        
        try:
            # Try to read from table
            result = supabase.table(table_name).select("*").limit(1).execute()
            print(f"✅ {table_name} table is accessible (read)")
            results[table_name] = {"read": True, "write": False}
            
            # Try to insert test data
            try:
                insert_result = supabase.table(table_name).insert(test_data).execute()
                print(f"✅ {table_name} table is writable (insert)")
                results[table_name]["write"] = True
            except Exception as e:
                print(f"⚠️  {table_name} table is read-only: {e}")
                
        except Exception as e:
            print(f"❌ {table_name} table is not accessible: {e}")
            results[table_name] = {"read": False, "write": False}
    
    # Summary
    print("\n" + "="*50)
    print("📊 Supabase Table Access Summary:")
    print("="*50)
    
    for table_name, status in results.items():
        read_status = "✅" if status["read"] else "❌"
        write_status = "✅" if status["write"] else "❌"
        print(f"{table_name}: Read {read_status} | Write {write_status}")
    
    # Overall status
    all_readable = all(status["read"] for status in results.values())
    any_writable = any(status["write"] for status in results.values())
    
    if all_readable:
        print("\n🎉 All tables are accessible! Alex AI platform is ready for live data.")
        if any_writable:
            print("✅ Some tables are writable - full functionality available.")
        else:
            print("⚠️  Tables are read-only - may need to adjust permissions.")
    else:
        print("\n❌ Some tables are not accessible. Please run the SQL script in Supabase dashboard.")
        print("   File: scripts/supabase-table-sql.sql")
    
    return all_readable

if __name__ == "__main__":
    print("🚀 Testing Alex AI Supabase tables...")
    print("="*50)
    
    test_supabase_connection()
    
    print("\n🏁 Test complete!")

















