#!/usr/bin/env python3
"""
Consolidated Script: n8n_integration_test_system
================================

This script consolidates the following similar scripts:
- ./n8n_integration_test_system.py
- ./credential-security-milestone-v1.0-20250906_041507/n8n_integration_test_system.py

Generated: 2025-09-06 20:27:37
"""

#!/usr/bin/env python3
"""
N8N Integration Test System
Tests new features and scripts deployed to N8N workflows outside of CI/CD
"""

import json
import requests
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional
import time

class N8NIntegrationTester:
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.test_results = []
        self.workflow_tests = []
        
    def load_workflow_tests(self) -> List[Dict]:
        """Load test configurations for N8N workflows"""
        return [
            {
                "workflow_name": "Enhanced Unified AI Controller",
                "workflow_id": "enhanced-unified-ai-controller",
                "test_input": {
                    "task": "Generate a comprehensive analysis of the musician tour app market",
                    "complexity": "high",
                    "context": "Market research and competitive analysis for tour management"
                },
                "expected_output_fields": ["routing", "crew_selection", "cost_optimization"],
                "timeout": 30
            },
            {
                "workflow_name": "Observation Lounge",
                "workflow_id": "observation-lounge",
                "test_input": {
                    "mission": "Test N8N integration for Alex AI system",
                    "crew_members": ["all"],
                    "priority": "high",
                    "context": "Testing crew coordination through N8N workflows"
                },
                "expected_output_fields": ["crew_insights", "strategic_themes", "recommendations"],
                "timeout": 45
            },
            {
                "workflow_name": "Crew Coordinator",
                "workflow_id": "crew-coordinator",
                "test_input": {
                    "mission": "Validate Alex AI superagent memory synchronization",
                    "crew_members": ["Captain Picard", "Commander Data", "Quark"],
                    "priority": "critical",
                    "context": "Testing memory sharing across all Alex AI instances"
                },
                "expected_output_fields": ["crew_insights", "memory_validation", "synchronization_status"],
                "timeout": 30
            },
            {
                "workflow_name": "Job Search Automation",
                "workflow_id": "job-search-automation",
                "test_input": {
                    "job_criteria": {
                        "location": "Remote",
                        "salary_range": "100k-150k",
                        "skills": ["AI/ML", "Python", "React"]
                    },
                    "action": "search_and_analyze"
                },
                "expected_output_fields": ["job_opportunities", "alex_ai_scores", "tailored_resumes"],
                "timeout": 60
            }
        ]
    
    def test_workflow(self, workflow_test: Dict) -> Dict:
        """Test a specific N8N workflow"""
        print(f"🧪 Testing {workflow_test['workflow_name']}...")
        
        try:
            # Trigger workflow via N8N API
            url = f"{self.n8n_base_url}/api/v1/workflows/{workflow_test['workflow_id']}/execute"
            headers = {
                "X-N8N-API-KEY": self.n8n_api_key,
                "Content-Type": "application/json"
            }
            
            start_time = time.time()
            response = requests.post(
                url,
                headers=headers,
                json=workflow_test['test_input'],
                timeout=workflow_test['timeout']
            )
            end_time = time.time()
            
            response_time = end_time - start_time
            
            if response.status_code == 200:
                result = response.json()
                
                # Validate expected output fields
                missing_fields = []
                for field in workflow_test['expected_output_fields']:
                    if field not in str(result):
                        missing_fields.append(field)
                
                test_result = {
                    "workflow_name": workflow_test['workflow_name'],
                    "status": "PASS" if not missing_fields else "PARTIAL",
                    "response_time": round(response_time, 2),
                    "status_code": response.status_code,
                    "missing_fields": missing_fields,
                    "response_size": len(str(result)),
                    "timestamp": datetime.now().isoformat()
                }
                
                if missing_fields:
                    print(f"   ⚠️  Missing fields: {missing_fields}")
                else:
                    print(f"   ✅ PASS ({response_time:.2f}s)")
                
            else:
                test_result = {
                    "workflow_name": workflow_test['workflow_name'],
                    "status": "FAIL",
                    "response_time": round(response_time, 2),
                    "status_code": response.status_code,
                    "error": response.text,
                    "timestamp": datetime.now().isoformat()
                }
                print(f"   ❌ FAIL ({response.status_code}): {response.text[:100]}")
            
            return test_result
            
        except requests.exceptions.Timeout:
            test_result = {
                "workflow_name": workflow_test['workflow_name'],
                "status": "TIMEOUT",
                "response_time": workflow_test['timeout'],
                "error": f"Workflow timed out after {workflow_test['timeout']} seconds",
                "timestamp": datetime.now().isoformat()
            }
            print(f"   ⏰ TIMEOUT ({workflow_test['timeout']}s)")
            return test_result
            
        except Exception as e:
            test_result = {
                "workflow_name": workflow_test['workflow_name'],
                "status": "ERROR",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
            print(f"   💥 ERROR: {str(e)}")
            return test_result
    
    def test_crew_memory_synchronization(self) -> Dict:
        """Test crew memory synchronization across all Alex AI instances"""
        print("🧠 Testing Crew Memory Synchronization...")
        
        try:
            # Test memory retrieval from Supabase
            supabase_url = os.getenv('SUPABASE_URL')
            supabase_key = os.getenv('SUPABASE_ANON_KEY')
            
            if not supabase_url or not supabase_key:
                return {
                    "status": "SKIP",
                    "reason": "Supabase credentials not available",
                    "timestamp": datetime.now().isoformat()
                }
            
            # Query crew memories
            url = f"{supabase_url}/rest/v1/crew_memories"
            headers = {
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                memories = response.json()
                
                # Analyze memory distribution
                crew_members = {}
                memory_types = {}
                
                for memory in memories:
                    crew = memory.get('crew_member', 'Unknown')
                    mem_type = memory.get('memory_type', 'Unknown')
                    
                    crew_members[crew] = crew_members.get(crew, 0) + 1
                    memory_types[mem_type] = memory_types.get(mem_type, 0) + 1
                
                result = {
                    "status": "PASS",
                    "total_memories": len(memories),
                    "crew_members": crew_members,
                    "memory_types": memory_types,
                    "timestamp": datetime.now().isoformat()
                }
                
                print(f"   ✅ Found {len(memories)} memories across {len(crew_members)} crew members")
                return result
                
            else:
                return {
                    "status": "FAIL",
                    "error": f"Supabase query failed: {response.status_code}",
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            return {
                "status": "ERROR",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def run_comprehensive_test(self) -> Dict:
        """Run comprehensive N8N integration test"""
        print("🚀 Starting N8N Integration Test Suite...")
        print("=" * 60)
        
        # Load workflow tests
        self.workflow_tests = self.load_workflow_tests()
        
        # Test each workflow
        workflow_results = []
        for workflow_test in self.workflow_tests:
            result = self.test_workflow(workflow_test)
            workflow_results.append(result)
            time.sleep(2)  # Rate limiting
        
        # Test crew memory synchronization
        memory_result = self.test_crew_memory_synchronization()
        
        # Compile results
        total_tests = len(workflow_results) + 1
        passed_tests = sum(1 for r in workflow_results if r['status'] == 'PASS')
        if memory_result['status'] == 'PASS':
            passed_tests += 1
        
        comprehensive_result = {
            "test_suite": "N8N Integration Test",
            "timestamp": datetime.now().isoformat(),
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "success_rate": f"{(passed_tests/total_tests)*100:.1f}%",
            "workflow_results": workflow_results,
            "memory_synchronization": memory_result,
            "summary": {
                "operational_workflows": passed_tests - (1 if memory_result['status'] == 'PASS' else 0),
                "total_workflows": len(workflow_results),
                "memory_sync_status": memory_result['status']
            }
        }
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 N8N INTEGRATION TEST SUMMARY")
        print("=" * 60)
        
        for result in workflow_results:
            status_icon = "✅" if result['status'] == 'PASS' else "⚠️" if result['status'] == 'PARTIAL' else "❌"
            print(f"{status_icon} {result['workflow_name']}: {result['status']}")
        
        memory_icon = "✅" if memory_result['status'] == 'PASS' else "❌"
        print(f"{memory_icon} Crew Memory Sync: {memory_result['status']}")
        
        print(f"\n🎯 Overall Success Rate: {comprehensive_result['success_rate']}")
        
        # Save results
        self.save_test_results(comprehensive_result)
        
        return comprehensive_result
    
    def save_test_results(self, results: Dict):
        """Save test results to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"n8n_integration_test_results_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"💾 Test results saved to: {filename}")

def main():
    """Main function to run N8N integration tests"""
    tester = N8NIntegrationTester()
    results = tester.run_comprehensive_test()
    
    if results['passed_tests'] == results['total_tests']:
        print("\n🎉 All N8N integration tests PASSED!")
        print("🚀 N8N workflows are fully operational!")
    else:
        print(f"\n⚠️  {results['total_tests'] - results['passed_tests']} tests need attention")
    
    return results

if __name__ == "__main__":
    main()
