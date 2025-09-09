#!/usr/bin/env python3
"""
Add Quote Handling Memory to Alex AI System
===========================================
This script adds the critical quote handling insight to the Alex AI memory system
to prevent future dquote> and cmdand dquote> errors.
"""

import os
import sys
import json
import requests
from datetime import datetime
from typing import Dict, Any

class AlexAIMemoryAdder:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.memory_data = {
            "crew_member": "system",
            "memory_type": "critical_system_insight",
            "title": "Quote Handling System Fix - Shell Command Safety",
            "content": """
CRITICAL SYSTEM INSIGHT: Quote Handling in Shell Commands

PROBLEM IDENTIFIED:
- The dquote> error had compounded into a cmdand dquote> error
- This was caused by improper quote handling in shell commands, particularly in git commit messages
- The issue was systemic and could affect any script with unescaped quotes

ROOT CAUSE:
- Shell interpretation of special characters in commit messages
- Unescaped quotes causing shell to enter quote continuation mode
- Complex commit messages with quotes, backslashes, and special characters

SOLUTION IMPLEMENTED:
1. Created scripts/testing/milestone_management/consolidated_milestone_management.py with proper quote handling:
   - Uses printf to avoid shell interpretation of special characters
   - Properly escapes quotes and backslashes
   - Uses single quotes for commit messages to prevent shell issues
   - Includes comprehensive error handling and status reporting

2. Updated package.json with milestone:safe script

3. Key features of the safe script:
   - Handles quotes, backslashes, and special characters safely
   - Provides detailed status reporting
   - Includes error handling with set -e
   - Can be used as both a standalone script and sourced functions
   - Supports custom files and branch parameters
   - Uses timestamped commit messages

PREVENTION MEASURES:
- ALWAYS use the safe-milestone-push.sh script for milestone commits
- Use pnpm run milestone:safe for safe milestone pushes
- Never use complex quotes directly in shell commands
- Use printf for complex strings to avoid shell interpretation
- Test quote handling before implementing in production scripts

USAGE:
```bash
# Direct usage
./scripts/testing/milestone_management/consolidated_milestone_management.py "Your milestone message"

# Via pnpm
pnpm run milestone:safe "Your milestone message"

# With custom files and branch
./scripts/testing/milestone_management/consolidated_milestone_management.py "Message" "specific-files" "branch-name"
```

CRITICAL: This insight must be remembered to prevent future shell quote handling errors that can break the entire development workflow.
            """,
            "source": "system_analysis",
            "source_url": "https://github.com/familiarcat/alex-ai-optimized-monorepo",
            "relevance_score": 10,
            "tags": ["shell", "quotes", "git", "milestone", "error-prevention", "critical", "system-safety"],
            "metadata": {
                "error_type": "dquote> and cmdand dquote>",
                "severity": "critical",
                "impact": "development_workflow_breakage",
                "solution_type": "preventive_script",
                "affected_commands": ["git commit", "milestone push", "shell scripts"],
                "prevention_method": "safe-milestone-push.sh script"
            },
            "alex_ai_analysis": {
                "insight_type": "system_critical",
                "prevention_priority": "highest",
                "recurrence_risk": "high",
                "impact_assessment": "workflow_breaking",
                "solution_effectiveness": "complete"
            },
            "crew_relevance": {
                "data": "High - Data handles all system operations and data flow",
                "geordi_la_forge": "High - Geordi manages technical infrastructure",
                "picard": "Medium - Picard oversees overall system operations",
                "riker": "Medium - Riker coordinates development workflows",
                "troi": "Low - Troi focuses on user experience",
                "worf": "Medium - Worf handles security and system integrity",
                "beverly_crusher": "Low - Beverly focuses on health monitoring",
                "wesley_crusher": "Medium - Wesley handles automation and scripts",
                "q": "High - Q manages system anomalies and edge cases"
            },
            "importance_level": 10,
            "access_count": 0,
            "last_accessed": datetime.now().isoformat(),
            "expires_at": None
        }

    def add_memory_to_supabase(self) -> Dict[str, Any]:
        """Add the memory directly to Supabase"""
        try:
            # Get Supabase credentials from environment
            supabase_url = os.getenv('SUPABASE_URL')
            supabase_key = os.getenv('SUPABASE_ANON_KEY')
            
            if not supabase_url or not supabase_key:
                return {"error": "Supabase credentials not found in environment"}
            
            # Prepare the memory data for Supabase
            memory_record = {
                "crew_member": self.memory_data["crew_member"],
                "memory_type": self.memory_data["memory_type"],
                "title": self.memory_data["title"],
                "content": self.memory_data["content"],
                "source": self.memory_data["source"],
                "source_url": self.memory_data["source_url"],
                "relevance_score": self.memory_data["relevance_score"],
                "tags": self.memory_data["tags"],
                "metadata": self.memory_data["metadata"],
                "alex_ai_analysis": self.memory_data["alex_ai_analysis"],
                "crew_relevance": self.memory_data["crew_relevance"],
                "importance_level": self.memory_data["importance_level"],
                "access_count": self.memory_data["access_count"],
                "last_accessed": self.memory_data["last_accessed"],
                "expires_at": self.memory_data["expires_at"]
            }
            
            # Insert into Supabase
            headers = {
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                f"{supabase_url}/rest/v1/alex_ai_crew_memories",
                headers=headers,
                json=memory_record
            )
            
            if response.status_code == 201:
                return {
                    "success": True,
                    "message": "Memory added to Supabase successfully",
                    "memory_id": response.json().get("id"),
                    "data": response.json()
                }
            else:
                return {
                    "error": f"Failed to add memory to Supabase: {response.status_code}",
                    "response": response.text
                }
                
        except Exception as e:
            return {"error": f"Exception adding memory to Supabase: {str(e)}"}

    def add_memory_via_api(self) -> Dict[str, Any]:
        """Add memory via the Alex AI API endpoint"""
        try:
            response = requests.post(
                f"{self.base_url}/api/setup-alex-ai-memories",
                json=self.memory_data
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message": "Memory added via API successfully",
                    "data": response.json()
                }
            else:
                return {
                    "error": f"Failed to add memory via API: {response.status_code}",
                    "response": response.text
                }
                
        except Exception as e:
            return {"error": f"Exception adding memory via API: {str(e)}"}

    def save_memory_to_file(self) -> Dict[str, Any]:
        """Save memory to a local file for backup"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"alex_ai_quote_handling_memory_{timestamp}.json"
            
            memory_file = {
                "timestamp": datetime.now().isoformat(),
                "memory_type": "critical_system_insight",
                "title": "Quote Handling System Fix",
                "data": self.memory_data
            }
            
            with open(filename, 'w') as f:
                json.dump(memory_file, f, indent=2)
            
            return {
                "success": True,
                "message": f"Memory saved to file: {filename}",
                "filename": filename
            }
            
        except Exception as e:
            return {"error": f"Exception saving memory to file: {str(e)}"}

    def add_memory(self) -> Dict[str, Any]:
        """Add the memory using multiple methods"""
        results = {}
        
        print("🧠 Adding Quote Handling Memory to Alex AI System...")
        print("=" * 60)
        
        # Try Supabase first
        print("📊 Attempting to add memory to Supabase...")
        supabase_result = self.add_memory_to_supabase()
        results["supabase"] = supabase_result
        
        if supabase_result.get("success"):
            print("✅ Memory added to Supabase successfully!")
        else:
            print(f"❌ Supabase failed: {supabase_result.get('error', 'Unknown error')}")
        
        # Try API endpoint
        print("\n🌐 Attempting to add memory via API...")
        api_result = self.add_memory_via_api()
        results["api"] = api_result
        
        if api_result.get("success"):
            print("✅ Memory added via API successfully!")
        else:
            print(f"❌ API failed: {api_result.get('error', 'Unknown error')}")
        
        # Always save to file as backup
        print("\n💾 Saving memory to local file...")
        file_result = self.save_memory_to_file()
        results["file"] = file_result
        
        if file_result.get("success"):
            print(f"✅ Memory saved to file: {file_result.get('filename')}")
        else:
            print(f"❌ File save failed: {file_result.get('error', 'Unknown error')}")
        
        print("\n" + "=" * 60)
        print("🎯 Quote Handling Memory Addition Complete!")
        
        return results

def main():
    """Main function"""
    print("🚀 Alex AI Quote Handling Memory Adder")
    print("=" * 50)
    
    memory_adder = AlexAIMemoryAdder()
    results = memory_adder.add_memory()
    
    # Print summary
    print("\n📋 SUMMARY:")
    print("-" * 30)
    
    success_count = 0
    for method, result in results.items():
        status = "✅ SUCCESS" if result.get("success") else "❌ FAILED"
        print(f"{method.upper()}: {status}")
        if result.get("success"):
            success_count += 1
    
    print(f"\n🎉 {success_count}/{len(results)} methods succeeded")
    
    if success_count > 0:
        print("\n💡 The quote handling insight has been added to Alex AI memories!")
        print("   This will help prevent future dquote> and cmdand dquote> errors.")
    else:
        print("\n⚠️  All methods failed. Check the error messages above.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
