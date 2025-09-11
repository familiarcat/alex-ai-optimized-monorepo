#!/usr/bin/env python3
"""
N8N Integration Verification Script
==================================
Verify N8N integration with n8n.pbradygeorgen.com and validate credentials
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional

class N8NIntegrationVerification:
    def __init__(self):
        self.n8n_base_url = "n8n.pbradygeorgen.com"
        self.verification_results = {
            "timestamp": datetime.now().isoformat(),
            "base_url": self.n8n_base_url,
            "tests": {},
            "overall_status": "unknown",
            "recommendations": []
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
    
    def test_credentials(self) -> Dict[str, Any]:
        """Test N8N API credentials"""
        api_key = os.getenv('N8N_API_KEY')
        
        if not api_key:
            return {
                "status": "error",
                "message": "N8N_API_KEY environment variable not set",
                "recommendation": "Set N8N_API_KEY environment variable"
            }
        
        return {
            "status": "success",
            "message": "N8N_API_KEY is set",
            "key_length": len(api_key),
            "key_prefix": api_key[:8] + "..." if len(api_key) > 8 else api_key
        }
    
    def test_n8n_connectivity(self) -> Dict[str, Any]:
        """Test basic connectivity to N8N instance"""
        try:
            # Test basic connectivity
            test_url = f"https://{self.n8n_base_url}"
            response = requests.get(test_url, timeout=10)
            
            return {
                "status": "success" if response.status_code == 200 else "error",
                "status_code": response.status_code,
                "response_time": response.elapsed.total_seconds(),
                "message": f"Connection successful" if response.status_code == 200 else f"Connection failed with status {response.status_code}"
            }
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"Connection failed: {str(e)}",
                "error_type": type(e).__name__
            }
    
    def test_n8n_api_access(self) -> Dict[str, Any]:
        """Test N8N API access with credentials"""
        api_key = os.getenv('N8N_API_KEY')
        
        if not api_key:
            return {
                "status": "error",
                "message": "Cannot test API access without N8N_API_KEY"
            }
        
        try:
            # Test API access
            api_url = f"https://{self.n8n_base_url}/api/v1/workflows"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(api_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                workflows = response.json().get('data', [])
                return {
                    "status": "success",
                    "message": "API access successful",
                    "workflows_count": len(workflows),
                    "response_time": response.elapsed.total_seconds(),
                    "workflows": [{"id": w.get('id'), "name": w.get('name')} for w in workflows[:5]]  # First 5 workflows
                }
            else:
                return {
                    "status": "error",
                    "message": f"API access failed with status {response.status_code}",
                    "status_code": response.status_code,
                    "response_text": response.text[:200]  # First 200 chars
                }
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"API access failed: {str(e)}",
                "error_type": type(e).__name__
            }
    
    def test_crew_workflows(self) -> Dict[str, Any]:
        """Test specific crew workflow access"""
        api_key = os.getenv('N8N_API_KEY')
        
        if not api_key:
            return {
                "status": "error",
                "message": "Cannot test crew workflows without N8N_API_KEY"
            }
        
        workflow_tests = {}
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        for crew_member, workflow_id in self.crew_workflows.items():
            try:
                # Test individual workflow access
                workflow_url = f"https://{self.n8n_base_url}/api/v1/workflows/{workflow_id}"
                response = requests.get(workflow_url, headers=headers, timeout=10)
                
                workflow_tests[crew_member] = {
                    "workflow_id": workflow_id,
                    "status": "success" if response.status_code == 200 else "error",
                    "status_code": response.status_code,
                    "response_time": response.elapsed.total_seconds(),
                    "message": f"Workflow accessible" if response.status_code == 200 else f"Workflow not accessible"
                }
            except requests.exceptions.RequestException as e:
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
            webhook_url = f"https://{self.n8n_base_url}/webhook/crew-{crew_member.replace('_', '-')}"
            
            try:
                # Test webhook endpoint availability (HEAD request)
                response = requests.head(webhook_url, timeout=5)
                webhook_tests[crew_member] = {
                    "webhook_url": webhook_url,
                    "status": "success" if response.status_code in [200, 405] else "error",  # 405 is OK for HEAD on POST endpoint
                    "status_code": response.status_code,
                    "message": f"Webhook endpoint accessible" if response.status_code in [200, 405] else f"Webhook endpoint not accessible"
                }
            except requests.exceptions.RequestException as e:
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
    
    def run_comprehensive_verification(self) -> Dict[str, Any]:
        """Run comprehensive N8N integration verification"""
        print("🔍 Running N8N Integration Verification...")
        print(f"🌐 Target: {self.n8n_base_url}")
        print()
        
        # Test 1: Credentials
        print("1️⃣ Testing N8N API Credentials...")
        credentials_test = self.test_credentials()
        self.verification_results["tests"]["credentials"] = credentials_test
        print(f"   Status: {credentials_test['status']}")
        print(f"   Message: {credentials_test['message']}")
        print()
        
        # Test 2: Basic Connectivity
        print("2️⃣ Testing Basic Connectivity...")
        connectivity_test = self.test_n8n_connectivity()
        self.verification_results["tests"]["connectivity"] = connectivity_test
        print(f"   Status: {connectivity_test['status']}")
        print(f"   Message: {connectivity_test['message']}")
        if connectivity_test.get('response_time'):
            print(f"   Response Time: {connectivity_test['response_time']:.2f}s")
        print()
        
        # Test 3: API Access
        print("3️⃣ Testing N8N API Access...")
        api_test = self.test_n8n_api_access()
        self.verification_results["tests"]["api_access"] = api_test
        print(f"   Status: {api_test['status']}")
        print(f"   Message: {api_test['message']}")
        if api_test.get('workflows_count'):
            print(f"   Workflows Available: {api_test['workflows_count']}")
        print()
        
        # Test 4: Crew Workflows
        print("4️⃣ Testing Crew Workflows...")
        workflows_test = self.test_crew_workflows()
        self.verification_results["tests"]["crew_workflows"] = workflows_test
        print(f"   Status: {workflows_test['status']}")
        print(f"   Successful Workflows: {workflows_test['successful_workflows']}/{workflows_test['total_workflows']}")
        print()
        
        # Test 5: Webhook Endpoints
        print("5️⃣ Testing Webhook Endpoints...")
        webhooks_test = self.test_webhook_endpoints()
        self.verification_results["tests"]["webhook_endpoints"] = webhooks_test
        print(f"   Status: {webhooks_test['status']}")
        print(f"   Successful Webhooks: {webhooks_test['successful_webhooks']}/{webhooks_test['total_webhooks']}")
        print()
        
        # Overall Assessment
        self.assess_overall_status()
        
        return self.verification_results
    
    def assess_overall_status(self):
        """Assess overall integration status"""
        tests = self.verification_results["tests"]
        
        # Count successful tests
        successful_tests = sum(1 for test in tests.values() if test.get("status") == "success")
        total_tests = len(tests)
        
        if successful_tests == total_tests:
            self.verification_results["overall_status"] = "excellent"
            self.verification_results["recommendations"].append("N8N integration is fully operational")
        elif successful_tests >= total_tests * 0.8:
            self.verification_results["overall_status"] = "good"
            self.verification_results["recommendations"].append("N8N integration is mostly operational with minor issues")
        elif successful_tests >= total_tests * 0.5:
            self.verification_results["overall_status"] = "fair"
            self.verification_results["recommendations"].append("N8N integration has significant issues that need attention")
        else:
            self.verification_results["overall_status"] = "poor"
            self.verification_results["recommendations"].append("N8N integration requires immediate attention")
        
        # Add specific recommendations based on test results
        if tests.get("credentials", {}).get("status") != "success":
            self.verification_results["recommendations"].append("Set N8N_API_KEY environment variable")
        
        if tests.get("connectivity", {}).get("status") != "success":
            self.verification_results["recommendations"].append("Check N8N instance availability and network connectivity")
        
        if tests.get("api_access", {}).get("status") != "success":
            self.verification_results["recommendations"].append("Verify N8N API credentials and permissions")
        
        if tests.get("crew_workflows", {}).get("status") != "success":
            self.verification_results["recommendations"].append("Check crew workflow configurations and permissions")
        
        if tests.get("webhook_endpoints", {}).get("status") != "success":
            self.verification_results["recommendations"].append("Verify webhook endpoint configurations")
    
    def save_verification_report(self):
        """Save verification report to file"""
        with open('n8n-integration-verification-report.json', 'w') as f:
            json.dump(self.verification_results, f, indent=2)
        
        # Create summary report
        summary = {
            "verification_date": self.verification_results["timestamp"],
            "base_url": self.verification_results["base_url"],
            "overall_status": self.verification_results["overall_status"],
            "test_summary": {
                "total_tests": len(self.verification_results["tests"]),
                "successful_tests": sum(1 for test in self.verification_results["tests"].values() if test.get("status") == "success"),
                "failed_tests": sum(1 for test in self.verification_results["tests"].values() if test.get("status") == "error")
            },
            "recommendations": self.verification_results["recommendations"]
        }
        
        with open('n8n-integration-verification-summary.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        return summary

def main():
    """Main function to run N8N integration verification"""
    print("🚀 N8N Integration Verification")
    print("=" * 50)
    print("Verifying N8N integration with n8n.pbradygeorgen.com...")
    print()
    
    verifier = N8NIntegrationVerification()
    results = verifier.run_comprehensive_verification()
    summary = verifier.save_verification_report()
    
    print("📊 VERIFICATION SUMMARY:")
    print(f"   Overall Status: {summary['overall_status'].upper()}")
    print(f"   Successful Tests: {summary['test_summary']['successful_tests']}/{summary['test_summary']['total_tests']}")
    print(f"   Failed Tests: {summary['test_summary']['failed_tests']}")
    print()
    
    print("🔥 RECOMMENDATIONS:")
    for rec in summary['recommendations']:
        print(f"   • {rec}")
    print()
    
    print("📁 Files Created:")
    print("   - n8n-integration-verification-report.json")
    print("   - n8n-integration-verification-summary.json")
    print()
    
    if summary['overall_status'] in ['excellent', 'good']:
        print("✅ N8N Integration is ready for frontend development!")
    else:
        print("⚠️ N8N Integration needs attention before frontend development!")

if __name__ == "__main__":
    main()







