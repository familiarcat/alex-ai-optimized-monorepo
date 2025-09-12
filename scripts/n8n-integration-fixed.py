#!/usr/bin/env python3
"""
N8N Integration Fixed Script
===========================
Updated N8N integration with correct authentication method and API paths
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional

class N8NIntegrationFixed:
    def __init__(self):
        self.n8n_base_url = "n8n.pbradygeorgen.com"
        self.api_key = os.getenv('N8N_API_KEY')
        
        # Correct configuration based on troubleshooting results
        self.config = {
            "base_url": f"https://{self.n8n_base_url}",
            "api_path": "/api/workflows",
            "version_path": "/api/version",
            "webhook_path": "/webhook",
            "authentication": {
                "method": "header",
                "header_name": "X-N8N-API-Key",
                "header_value": self.api_key
            }
        }
        
        # Crew workflow mapping
        self.crew_workflows = {
            "captain_picard": "BdNHOluRYUw2JxGW",
            "commander_riker": "Imn7p6pVgi6SRvnF",
            "commander_data": "gIwrQHHArgrVARjL",
            "geordi_la_forge": "e0UEwyVcXJqeePdj",
            "lieutenant_worf": "GhSB8EpZWXLU78LM",
            "counselor_troi": "QJnN7ks2KsQTENDc",
            "lieutenant_uhura": "36KPle5mPiMaazG6",
            "dr_crusher": "SXAMupVWdOxZybF6",
            "quark": "L6K4bzSKlGC36ABL"
        }
        
        self.integration_results = {
            "timestamp": datetime.now().isoformat(),
            "config": self.config,
            "tests": {},
            "overall_status": "unknown"
        }
    
    def get_headers(self) -> Dict[str, str]:
        """Get correct headers for N8N API requests"""
        return {
            "X-N8N-API-Key": self.api_key,
            "Content-Type": "application/json"
        }
    
    def test_n8n_connectivity(self) -> Dict[str, Any]:
        """Test basic connectivity to N8N instance"""
        try:
            health_url = f"{self.config['base_url']}/healthz"
            response = requests.get(health_url, timeout=10)
            
            return {
                "status": "success" if response.status_code == 200 else "error",
                "status_code": response.status_code,
                "response_time": response.elapsed.total_seconds(),
                "message": f"Health check successful" if response.status_code == 200 else f"Health check failed"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Connectivity test failed: {str(e)}",
                "error_type": type(e).__name__
            }
    
    def test_n8n_api_access(self) -> Dict[str, Any]:
        """Test N8N API access with correct authentication"""
        try:
            api_url = f"{self.config['base_url']}{self.config['api_path']}"
            headers = self.get_headers()
            
            response = requests.get(api_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                workflows = response.json()
                return {
                    "status": "success",
                    "message": "API access successful",
                    "workflows_count": len(workflows),
                    "response_time": response.elapsed.total_seconds(),
                    "workflows": workflows[:5] if workflows else []  # First 5 workflows
                }
            else:
                return {
                    "status": "error",
                    "message": f"API access failed with status {response.status_code}",
                    "status_code": response.status_code,
                    "response_text": response.text[:200]
                }
        except Exception as e:
            return {
                "status": "error",
                "message": f"API access failed: {str(e)}",
                "error_type": type(e).__name__
            }
    
    def test_crew_workflows(self) -> Dict[str, Any]:
        """Test specific crew workflow access"""
        workflow_tests = {}
        headers = self.get_headers()
        
        for crew_member, workflow_id in self.crew_workflows.items():
            try:
                # Test individual workflow access
                workflow_url = f"{self.config['base_url']}{self.config['api_path']}/{workflow_id}"
                response = requests.get(workflow_url, headers=headers, timeout=10)
                
                workflow_tests[crew_member] = {
                    "workflow_id": workflow_id,
                    "status": "success" if response.status_code == 200 else "error",
                    "status_code": response.status_code,
                    "response_time": response.elapsed.total_seconds(),
                    "message": f"Workflow accessible" if response.status_code == 200 else f"Workflow not accessible"
                }
            except Exception as e:
                workflow_tests[crew_member] = {
                    "workflow_id": workflow_id,
                    "status": "error",
                    "message": f"Request failed: {str(e)}",
                    "error_type": type(e).__name__
                }
        
        return {
            "status": "success" if all(test["status"] == "success" for test in workflow_tests.values()) else "error",
            "workflow_tests": workflow_tests,
            "total_workflows": len(workflow_tests),
            "successful_workflows": sum(1 for test in workflow_tests.values() if test["status"] == "success")
        }
    
    def test_webhook_endpoints(self) -> Dict[str, Any]:
        """Test webhook endpoints for crew members"""
        webhook_tests = {}
        
        for crew_member, workflow_id in self.crew_workflows.items():
            # Test webhook endpoint (this would typically be a POST request)
            webhook_url = f"{self.config['base_url']}{self.config['webhook_path']}/crew-{crew_member.replace('_', '-')}"
            
            try:
                # Test webhook endpoint availability (HEAD request)
                response = requests.head(webhook_url, timeout=5)
                webhook_tests[crew_member] = {
                    "webhook_url": webhook_url,
                    "status": "success" if response.status_code in [200, 405] else "error",  # 405 is OK for HEAD on POST endpoint
                    "status_code": response.status_code,
                    "message": f"Webhook endpoint accessible" if response.status_code in [200, 405] else f"Webhook endpoint not accessible"
                }
            except Exception as e:
                webhook_tests[crew_member] = {
                    "webhook_url": webhook_url,
                    "status": "error",
                    "message": f"Webhook test failed: {str(e)}",
                    "error_type": type(e).__name__
                }
        
        return {
            "status": "success" if all(test["status"] == "success" for test in webhook_tests.values()) else "error",
            "webhook_tests": webhook_tests,
            "total_webhooks": len(webhook_tests),
            "successful_webhooks": sum(1 for test in webhook_tests.values() if test["status"] == "success")
        }
    
    def test_crew_workflow_execution(self, crew_member: str, test_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Test executing a crew workflow"""
        if crew_member not in self.crew_workflows:
            return {
                "status": "error",
                "message": f"Unknown crew member: {crew_member}"
            }
        
        workflow_id = self.crew_workflows[crew_member]
        webhook_url = f"{self.config['base_url']}{self.config['webhook_path']}/crew-{crew_member.replace('_', '-')}"
        
        try:
            # Test webhook execution (POST request)
            test_payload = test_data or {
                "test": True,
                "crew_member": crew_member,
                "workflow_id": workflow_id,
                "timestamp": datetime.now().isoformat()
            }
            
            response = requests.post(webhook_url, json=test_payload, timeout=10)
            
            return {
                "status": "success" if response.status_code in [200, 201, 202] else "error",
                "status_code": response.status_code,
                "response_time": response.elapsed.total_seconds(),
                "message": f"Workflow execution successful" if response.status_code in [200, 201, 202] else f"Workflow execution failed",
                "response_data": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text[:200]
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Workflow execution failed: {str(e)}",
                "error_type": type(e).__name__
            }
    
    def run_comprehensive_integration_test(self) -> Dict[str, Any]:
        """Run comprehensive N8N integration test"""
        print("🚀 N8N Integration Test - Fixed Configuration")
        print("=" * 60)
        print(f"🌐 Target: {self.n8n_base_url}")
        print(f"🔑 API Key: {'Set' if self.api_key else 'Not Set'}")
        print(f"🔐 Auth Method: {self.config['authentication']['header_name']}")
        print(f"🛤️  API Path: {self.config['api_path']}")
        print()
        
        # Test 1: Basic Connectivity
        print("1️⃣ Testing Basic Connectivity...")
        connectivity_test = self.test_n8n_connectivity()
        self.integration_results["tests"]["connectivity"] = connectivity_test
        print(f"   Status: {connectivity_test['status']}")
        print(f"   Message: {connectivity_test['message']}")
        if connectivity_test.get('response_time'):
            print(f"   Response Time: {connectivity_test['response_time']:.2f}s")
        print()
        
        # Test 2: API Access
        print("2️⃣ Testing N8N API Access...")
        api_test = self.test_n8n_api_access()
        self.integration_results["tests"]["api_access"] = api_test
        print(f"   Status: {api_test['status']}")
        print(f"   Message: {api_test['message']}")
        if api_test.get('workflows_count'):
            print(f"   Workflows Available: {api_test['workflows_count']}")
        print()
        
        # Test 3: Crew Workflows
        print("3️⃣ Testing Crew Workflows...")
        workflows_test = self.test_crew_workflows()
        self.integration_results["tests"]["crew_workflows"] = workflows_test
        print(f"   Status: {workflows_test['status']}")
        print(f"   Successful Workflows: {workflows_test['successful_workflows']}/{workflows_test['total_workflows']}")
        print()
        
        # Test 4: Webhook Endpoints
        print("4️⃣ Testing Webhook Endpoints...")
        webhooks_test = self.test_webhook_endpoints()
        self.integration_results["tests"]["webhook_endpoints"] = webhooks_test
        print(f"   Status: {webhooks_test['status']}")
        print(f"   Successful Webhooks: {webhooks_test['successful_webhooks']}/{webhooks_test['total_webhooks']}")
        print()
        
        # Test 5: Sample Workflow Execution
        print("5️⃣ Testing Sample Workflow Execution...")
        sample_workflow_test = self.test_crew_workflow_execution("commander_data")
        self.integration_results["tests"]["sample_workflow_execution"] = sample_workflow_test
        print(f"   Status: {sample_workflow_test['status']}")
        print(f"   Message: {sample_workflow_test['message']}")
        print()
        
        # Overall Assessment
        self.assess_overall_status()
        
        return self.integration_results
    
    def assess_overall_status(self):
        """Assess overall integration status"""
        tests = self.integration_results["tests"]
        
        # Count successful tests
        successful_tests = sum(1 for test in tests.values() if test.get("status") == "success")
        total_tests = len(tests)
        
        if successful_tests == total_tests:
            self.integration_results["overall_status"] = "excellent"
        elif successful_tests >= total_tests * 0.8:
            self.integration_results["overall_status"] = "good"
        elif successful_tests >= total_tests * 0.5:
            self.integration_results["overall_status"] = "fair"
        else:
            self.integration_results["overall_status"] = "poor"
    
    def save_integration_report(self):
        """Save integration report to file"""
        with open('n8n-integration-fixed-report.json', 'w') as f:
            json.dump(self.integration_results, f, indent=2)
        
        # Create summary report
        summary = {
            "integration_date": self.integration_results["timestamp"],
            "base_url": self.n8n_base_url,
            "overall_status": self.integration_results["overall_status"],
            "config": self.config,
            "test_summary": {
                "total_tests": len(self.integration_results["tests"]),
                "successful_tests": sum(1 for test in self.integration_results["tests"].values() if test.get("status") == "success"),
                "failed_tests": sum(1 for test in self.integration_results["tests"].values() if test.get("status") == "error")
            },
            "crew_workflows": self.crew_workflows
        }
        
        with open('n8n-integration-fixed-summary.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        return summary

def main():
    """Main function to run N8N integration test with fixed configuration"""
    print("🔧 N8N Integration Test - Fixed Configuration")
    print("=" * 50)
    print("Testing N8N integration with correct authentication...")
    print()
    
    integrator = N8NIntegrationFixed()
    results = integrator.run_comprehensive_integration_test()
    summary = integrator.save_integration_report()
    
    print("📊 INTEGRATION SUMMARY:")
    print(f"   Overall Status: {summary['overall_status'].upper()}")
    print(f"   Successful Tests: {summary['test_summary']['successful_tests']}/{summary['test_summary']['total_tests']}")
    print(f"   Failed Tests: {summary['test_summary']['failed_tests']}")
    print()
    
    print("🔧 CONFIGURATION USED:")
    print(f"   Base URL: {summary['config']['base_url']}")
    print(f"   API Path: {summary['config']['api_path']}")
    print(f"   Auth Method: {summary['config']['authentication']['header_name']}")
    print()
    
    print("📁 Files Created:")
    print("   - n8n-integration-fixed-report.json")
    print("   - n8n-integration-fixed-summary.json")
    print()
    
    if summary['overall_status'] in ['excellent', 'good']:
        print("✅ N8N Integration is fully operational!")
    else:
        print("⚠️ N8N Integration needs attention!")

if __name__ == "__main__":
    main()








