#!/usr/bin/env python3
"""
Add Architecture Memory to Alex AI System
=========================================
This script adds the critical architecture insight to prevent Supabase
from being incorrectly placed in the Next.js UI layer.
"""

import os
import sys
import json
from datetime import datetime
from typing import Dict, Any

class AlexAIArchitectureMemoryAdder:
    def __init__(self):
        self.memory_data = {
            "crew_member": "system",
            "memory_type": "critical_architecture_insight",
            "title": "N8N Gatekeeper Architecture - Supabase Must Stay Behind N8N",
            "content": """
CRITICAL ARCHITECTURE INSIGHT: N8N Gatekeeper Pattern

PROBLEM IDENTIFIED:
- Repeated attempts to put Supabase directly into the Next.js UI layer
- Violation of the N8N gatekeeper architecture pattern
- Direct client-to-database coupling instead of client-to-N8N-to-database

ROOT CAUSE:
- Hallucination pattern where Supabase is incorrectly placed in frontend
- Forgetting that N8N is the single source of truth and gatekeeper
- Attempting to bypass N8N for direct database access

CORRECT ARCHITECTURE:
Client → N8N → Supabase → N8N → Client

INCORRECT ARCHITECTURE (HALLUCINATION):
Client → Supabase (BYPASSING N8N)

EVIDENCE FROM TERMINAL LOGS:
```
❌ Unexpected error in job opportunities API: TypeError: Cannot read properties of undefined (reading 'get')
    at RateLimiter.check (src/lib/rate-limiter.ts:42:54)
    at rateLimitMiddleware (src/lib/rate-limiter.ts:113:59)
    at GET (src/app/api/job-opportunities/route.ts:9:61)

⚠️ Supabase health check failed: Invalid API key
⚠️ N8N health check failed: 404
🏥 Health check completed: unhealthy
```

SOLUTION IMPLEMENTED:
1. N8N must be the ONLY interface between client and Supabase
2. All data operations must go through N8N webhooks
3. Client should NEVER directly import or use Supabase
4. Fallback systems should use live data store, not direct Supabase

PREVENTION MEASURES:
- NEVER import Supabase client in Next.js API routes
- NEVER create direct Supabase connections in frontend
- ALWAYS route data through N8N webhooks
- ALWAYS use N8N as the single source of truth
- ALWAYS maintain the gatekeeper pattern

ARCHITECTURE RULES:
1. Client components: NO Supabase imports
2. API routes: NO Supabase imports (use N8N data service)
3. Data flow: Client → N8N → Supabase → N8N → Client
4. Fallbacks: Live data store → Live scraping → Mock data
5. NEVER: Client → Supabase (direct)

CRITICAL: This architecture pattern must be remembered to prevent future hallucinations that break the N8N gatekeeper system.
            """,
            "source": "system_analysis",
            "source_url": "https://github.com/familiarcat/alex-ai-optimized-monorepo",
            "relevance_score": 10,
            "tags": ["architecture", "n8n", "supabase", "gatekeeper", "hallucination-prevention", "critical", "data-flow"],
            "metadata": {
                "error_type": "architecture_violation",
                "severity": "critical",
                "impact": "system_architecture_breakage",
                "solution_type": "architectural_pattern",
                "affected_components": ["client", "api-routes", "data-flow"],
                "prevention_method": "N8N gatekeeper pattern enforcement"
            },
            "alex_ai_analysis": {
                "insight_type": "architectural_critical",
                "prevention_priority": "highest",
                "recurrence_risk": "very_high",
                "impact_assessment": "system_breaking",
                "solution_effectiveness": "complete"
            },
            "crew_relevance": {
                "data": "Highest - Data manages all data operations and flow",
                "geordi_la_forge": "Highest - Geordi manages technical infrastructure",
                "picard": "High - Picard oversees overall system architecture",
                "riker": "High - Riker coordinates system integration",
                "troi": "Medium - Troi focuses on user experience flow",
                "worf": "High - Worf handles system security and integrity",
                "beverly_crusher": "Low - Beverly focuses on health monitoring",
                "wesley_crusher": "High - Wesley handles automation and data flow",
                "q": "Highest - Q manages system anomalies and architectural violations"
            },
            "importance_level": 10,
            "access_count": 0,
            "last_accessed": datetime.now().isoformat(),
            "expires_at": None
        }

    def save_memory_to_file(self) -> Dict[str, Any]:
        """Save memory to a local file for backup and future reference"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"alex_ai_architecture_memory_{timestamp}.json"
            
            memory_file = {
                "timestamp": datetime.now().isoformat(),
                "memory_type": "critical_architecture_insight",
                "title": "N8N Gatekeeper Architecture",
                "data": self.memory_data,
                "instructions": {
                    "purpose": "Prevent Supabase from being incorrectly placed in Next.js UI layer",
                    "usage": "Reference this memory when designing data flow and API architecture",
                    "priority": "CRITICAL - Must be remembered to prevent system architecture violations"
                }
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

    def create_memory_summary(self) -> str:
        """Create a human-readable summary of the memory"""
        return f"""
🧠 ALEX AI MEMORY: N8N Gatekeeper Architecture
==============================================

CRITICAL INSIGHT: Supabase Must Stay Behind N8N

PROBLEM: Repeated attempts to put Supabase directly into Next.js UI layer
SOLUTION: Enforce N8N gatekeeper pattern - Client → N8N → Supabase → N8N → Client
PRIORITY: CRITICAL - Prevents system architecture violations

KEY RULES:
- NEVER import Supabase client in Next.js API routes
- NEVER create direct Supabase connections in frontend
- ALWAYS route data through N8N webhooks
- ALWAYS use N8N as the single source of truth
- ALWAYS maintain the gatekeeper pattern

ARCHITECTURE FLOW:
✅ CORRECT: Client → N8N → Supabase → N8N → Client
❌ WRONG: Client → Supabase (bypassing N8N)

PREVENTION: This memory must be referenced when designing any data flow
or API architecture to prevent hallucinations that break the N8N gatekeeper system.

CREW RELEVANCE:
- Data: Highest (data operations)
- Geordi: Highest (technical infrastructure)
- Q: Highest (system anomalies)
- Others: High/Medium (various specializations)

TIMESTAMP: {datetime.now().isoformat()}
STATUS: ACTIVE - Must be remembered
        """

    def add_memory(self) -> Dict[str, Any]:
        """Add the memory using available methods"""
        results = {}
        
        print("🧠 Adding N8N Gatekeeper Architecture Memory to Alex AI System...")
        print("=" * 70)
        
        # Save to file as primary method
        print("💾 Saving memory to local file...")
        file_result = self.save_memory_to_file()
        results["file"] = file_result
        
        if file_result.get("success"):
            print(f"✅ Memory saved to file: {file_result.get('filename')}")
        else:
            print(f"❌ File save failed: {file_result.get('error', 'Unknown error')}")
        
        # Create summary
        print("\n📋 Creating memory summary...")
        summary = self.create_memory_summary()
        print(summary)
        
        # Save summary to separate file
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            summary_filename = f"alex_ai_architecture_summary_{timestamp}.txt"
            with open(summary_filename, 'w') as f:
                f.write(summary)
            print(f"✅ Summary saved to: {summary_filename}")
            results["summary"] = {"success": True, "filename": summary_filename}
        except Exception as e:
            print(f"❌ Summary save failed: {str(e)}")
            results["summary"] = {"error": str(e)}
        
        print("\n" + "=" * 70)
        print("🎯 N8N Gatekeeper Architecture Memory Addition Complete!")
        
        return results

def main():
    """Main function"""
    print("🚀 Alex AI N8N Gatekeeper Architecture Memory Adder")
    print("=" * 60)
    
    memory_adder = AlexAIArchitectureMemoryAdder()
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
        print("\n💡 The N8N gatekeeper architecture insight has been added to Alex AI memories!")
        print("   This will help prevent future hallucinations that break the architecture.")
    else:
        print("\n⚠️  All methods failed. Check the error messages above.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())

