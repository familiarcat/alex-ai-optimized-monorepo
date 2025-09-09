from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Store Crew Memories in Supabase
Upload learned insights to shared memory system
"""

import json
import os
import requests
from datetime import datetime
from typing import Dict, List, Any

class SupabaseMemoryStorage:
        self.supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERMDgyMn0.API_KEY_PLACEHOLDER"
        self.headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json"
        }
    
    def store_crew_memories(self, memories_file: str):
        """Store crew memories in Supabase"""
        print("🧠 STORING CREW MEMORIES IN SUPABASE")
        print("=" * 50)
        
        # Load memories from file
        with open(memories_file, 'r') as f:
            memories = json.load(f)
        
        print(f"📚 Loaded {len(memories)} memories to store")
        
        # Store each memory
        stored_count = 0
        failed_count = 0
        
        for memory in memories:
            try:
                # Prepare memory data for Supabase
                memory_data = {
                    "crew_member": memory['crew_member'],
                    "memory_type": memory['memory_type'],
                    "content": memory['content'],
                    "category": memory['category'],
                    "phase": memory['phase'],
                    "timestamp": memory['timestamp'],
                    "confidence": memory['confidence'],
                    "tags": memory['tags'],
                    "created_at": datetime.now().isoformat()
                }
                
                # Insert into Supabase
                response = requests.post(
                    f"{self.supabase_url}/rest/v1/crew_memories",
                    headers=self.headers,
                    json=memory_data
                )
                
                if response.status_code in [200, 201]:
                    stored_count += 1
                    print(f"   ✅ Stored memory: {memory['content'][:50]}...")
                else:
                    failed_count += 1
                    print(f"   ❌ Failed to store memory: {response.status_code}")
                
            except Exception as e:
                failed_count += 1
                print(f"   ❌ Error storing memory: {e}")
        
        print(f"\n📊 Memory Storage Summary:")
        print(f"   ✅ Successfully stored: {stored_count}")
        print(f"   ❌ Failed to store: {failed_count}")
        print(f"   📈 Success rate: {stored_count/(stored_count+failed_count)*100:.1f}%")
        
        return {
            'stored_count': stored_count,
            'failed_count': failed_count,
            'success_rate': stored_count/(stored_count+failed_count)*100
        }
    
    def create_memory_summary(self, memories_file: str):
        """Create a summary of stored memories"""
        with open(memories_file, 'r') as f:
            memories = json.load(f)
        
        # Analyze memory distribution
        crew_member_counts = {}
        memory_type_counts = {}
        category_counts = {}
        
        for memory in memories:
            crew = memory['crew_member']
            mem_type = memory['memory_type']
            category = memory['category']
            
            crew_member_counts[crew] = crew_member_counts.get(crew, 0) + 1
            memory_type_counts[mem_type] = memory_type_counts.get(mem_type, 0) + 1
            category_counts[category] = category_counts.get(category, 0) + 1
        
        summary = {
            'total_memories': len(memories),
            'crew_member_distribution': crew_member_counts,
            'memory_type_distribution': memory_type_counts,
            'category_distribution': category_counts,
            'timestamp': datetime.now().isoformat()
        }
        
        # Save summary
        with open(f'memory_summary_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n📋 Memory Summary Created:")
        print(f"   Total Memories: {summary['total_memories']}")
        print(f"   Crew Members: {len(summary['crew_member_distribution'])}")
        print(f"   Memory Types: {len(summary['memory_type_distribution'])}")
        print(f"   Categories: {len(summary['category_distribution'])}")
        
        return summary

    # Find the most recent memories file
    memories_files = [f for f in os.listdir('.') if f.startswith('crew_memories_') and f.endswith('.json')]
    
    if not memories_files:
        print("❌ No memories file found")
        return
    
    # Use the most recent file
    latest_file = max(memories_files)
    print(f"📁 Using memories file: {latest_file}")
    
    # Initialize storage system
    storage = SupabaseMemoryStorage()
    
    # Store memories
    result = storage.store_crew_memories(latest_file)
    
    # Create summary
    summary = storage.create_memory_summary(latest_file)
    
    print(f"\n🎯 Crew memories storage complete!")
    print(f"📊 Success rate: {result['success_rate']:.1f}%")
    
    return result

if __name__ == "__main__":
    main()
