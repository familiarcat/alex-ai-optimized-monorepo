#!/usr/bin/env python3
"""
N8N Authentication Fix Script
============================
Address the 401 Unauthorized errors and restore N8N integration
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional

class N8NAuthenticationFix:
    def __init__(self):
        self.n8n_base_url = "n8n.pbradygeorgen.com"
        self.api_key = os.getenv('N8N_API_KEY')
        self.fix_results = {
            "timestamp": datetime.now().isoformat(),
            "base_url": self.n8n_base_url,
            "issues_identified": [],
            "solutions_attempted": [],
            "final_status": "unknown"
        }
    
    def diagnose_authentication_issue(self) -> Dict[str, Any]:
        """Diagnose the specific authentication issue"""
        print("🔍 Diagnosing N8N Authentication Issue...")
        
        # Test basic connectivity
        try:
            health_url = f"https://{self.n8n_base_url}/healthz"
            health_response = requests.get(health_url, timeout=10)
            print(f"   ✅ Health check: {health_response.status_code}")
        except Exception as e:
            print(f"   ❌ Health check failed: {e}")
            return {"status": "error", "message": "Basic connectivity failed"}
        
        # Test API endpoints without authentication
        try:
            version_url = f"https://{self.n8n_base_url}/api/v1/version"
            version_response = requests.get(version_url, timeout=10)
            print(f"   📊 Version endpoint: {version_response.status_code}")
            
            if version_response.status_code == 404:
                print("   ⚠️  API version endpoint not found - checking alternative paths")
                # Try alternative API paths
                alt_paths = ["/api/version", "/version", "/api/v1", "/api"]
                for path in alt_paths:
                    try:
                        alt_url = f"https://{self.n8n_base_url}{path}"
                        alt_response = requests.get(alt_url, timeout=5)
                        print(f"   📊 {path}: {alt_response.status_code}")
                        if alt_response.status_code == 200:
                            print(f"   ✅ Found working API path: {path}")
                            break
                    except:
                        continue
        except Exception as e:
            print(f"   ❌ Version check failed: {e}")
        
        # Test webhook endpoints
        try:
            webhook_url = f"https://{self.n8n_base_url}/webhook"
            webhook_response = requests.get(webhook_url, timeout=10)
            print(f"   ✅ Webhook endpoint: {webhook_response.status_code}")
        except Exception as e:
            print(f"   ❌ Webhook check failed: {e}")
        
        return {
            "status": "success",
            "message": "Basic connectivity confirmed, API authentication issue identified"
        }
    
    def test_alternative_authentication_methods(self) -> Dict[str, Any]:
        """Test alternative authentication methods"""
        print("\n🔐 Testing Alternative Authentication Methods...")
        
        if not self.api_key:
            print("   ❌ N8N_API_KEY not set")
            return {"status": "error", "message": "No API key available"}
        
        print(f"   🔑 API Key: {self.api_key[:8]}...")
        
        # Test different authentication approaches
        auth_methods = {
            "bearer_token": {
                "headers": {"Authorization": f"Bearer {self.api_key}"},
                "description": "Bearer token in Authorization header"
            },
            "api_key_header": {
                "headers": {"X-API-Key": self.api_key},
                "description": "API key in X-API-Key header"
            },
            "n8n_api_key_header": {
                "headers": {"X-N8N-API-Key": self.api_key},
                "description": "API key in X-N8N-API-Key header"
            },
            "basic_auth": {
                "auth": (self.api_key, ""),
                "description": "Basic authentication with API key"
            },
            "basic_auth_username": {
                "auth": ("admin", self.api_key),
                "description": "Basic authentication with admin/API key"
            },
            "query_param": {
                "params": {"api_key": self.api_key},
                "description": "API key as query parameter"
            },
            "token_param": {
                "params": {"token": self.api_key},
                "description": "API key as token parameter"
            }
        }
        
        results = {}
        test_url = f"https://{self.n8n_base_url}/api/v1/workflows"
        
        for method_name, config in auth_methods.items():
            try:
                response = requests.get(
                    test_url,
                    headers=config.get('headers', {}),
                    auth=config.get('auth'),
                    params=config.get('params', {}),
                    timeout=10
                )
                
                status = "✅" if response.status_code == 200 else "❌"
                print(f"   {status} {method_name}: {config['description']} - Status: {response.status_code}")
                
                results[method_name] = {
                    "status_code": response.status_code,
                    "success": response.status_code == 200,
                    "response_time": response.elapsed.total_seconds(),
                    "description": config['description'],
                    "error": response.text[:200] if response.status_code != 200 else None
                }
                
                if response.status_code == 200:
                    print(f"   🎉 SUCCESS! Found working authentication method: {method_name}")
                    return {
                        "status": "success",
                        "working_method": method_name,
                        "method_config": config,
                        "all_results": results
                    }
                    
            except Exception as e:
                status = "❌"
                print(f"   {status} {method_name}: {config['description']} - Error: {str(e)}")
                results[method_name] = {
                    "status_code": None,
                    "success": False,
                    "response_time": None,
                    "description": config['description'],
                    "error": str(e)
                }
        
        return {
            "status": "error",
            "message": "No working authentication method found",
            "all_results": results
        }
    
    def test_alternative_api_paths(self) -> Dict[str, Any]:
        """Test alternative API paths"""
        print("\n🛤️  Testing Alternative API Paths...")
        
        api_paths = [
            "/api/v1/workflows",
            "/api/workflows",
            "/workflows",
            "/api/v1",
            "/api",
            "/rest/workflows",
            "/api/rest/workflows"
        ]
        
        headers = {"Authorization": f"Bearer {self.api_key}"}
        results = {}
        
        for path in api_paths:
            try:
                url = f"https://{self.n8n_base_url}{path}"
                response = requests.get(url, headers=headers, timeout=10)
                
                status = "✅" if response.status_code == 200 else "❌"
                print(f"   {status} {path}: Status {response.status_code}")
                
                results[path] = {
                    "status_code": response.status_code,
                    "success": response.status_code == 200,
                    "response_time": response.elapsed.total_seconds(),
                    "error": response.text[:200] if response.status_code != 200 else None
                }
                
                if response.status_code == 200:
                    print(f"   🎉 SUCCESS! Found working API path: {path}")
                    return {
                        "status": "success",
                        "working_path": path,
                        "all_results": results
                    }
                    
            except Exception as e:
                status = "❌"
                print(f"   {status} {path}: Error - {str(e)}")
                results[path] = {
                    "status_code": None,
                    "success": False,
                    "response_time": None,
                    "error": str(e)
                }
        
        return {
            "status": "error",
            "message": "No working API path found",
            "all_results": results
        }
    
    def check_n8n_instance_configuration(self) -> Dict[str, Any]:
        """Check N8N instance configuration"""
        print("\n⚙️  Checking N8N Instance Configuration...")
        
        # Check if this is a self-hosted vs cloud instance
        try:
            root_url = f"https://{self.n8n_base_url}/"
            response = requests.get(root_url, timeout=10)
            
            if response.status_code == 200:
                content = response.text.lower()
                
                # Look for N8N indicators
                n8n_indicators = [
                    "n8n",
                    "workflow",
                    "automation",
                    "node-red",
                    "zapier"
                ]
                
                found_indicators = [indicator for indicator in n8n_indicators if indicator in content]
                print(f"   📊 Found indicators: {found_indicators}")
                
                # Check for API documentation
                if "api" in content or "swagger" in content or "openapi" in content:
                    print("   📚 API documentation detected")
                
                # Check for authentication requirements
                if "login" in content or "auth" in content or "signin" in content:
                    print("   🔐 Authentication required")
                
                return {
                    "status": "success",
                    "indicators": found_indicators,
                    "has_api_docs": "api" in content or "swagger" in content,
                    "requires_auth": "login" in content or "auth" in content
                }
                
        except Exception as e:
            print(f"   ❌ Configuration check failed: {e}")
            return {"status": "error", "message": str(e)}
    
    def generate_solution_recommendations(self) -> List[Dict[str, Any]]:
        """Generate solution recommendations based on findings"""
        recommendations = []
        
        # Check if API key format is correct
        if self.api_key:
            if len(self.api_key) < 20:
                recommendations.append({
                    "priority": "HIGH",
                    "issue": "API key appears too short",
                    "solution": "Verify API key format - N8N API keys are typically longer",
                    "action": "Check N8N instance for correct API key format"
                })
            
            if not self.api_key.isalnum():
                recommendations.append({
                    "priority": "MEDIUM",
                    "issue": "API key contains special characters",
                    "solution": "Ensure API key contains only alphanumeric characters",
                    "action": "Regenerate API key if necessary"
                })
        
        # Check if this might be a self-hosted instance
        recommendations.append({
            "priority": "HIGH",
            "issue": "N8N instance may require different authentication",
            "solution": "Self-hosted N8N instances may use different API endpoints",
            "action": "Check N8N instance documentation for correct API paths"
        })
        
        # Check if authentication is required
        recommendations.append({
            "priority": "HIGH",
            "issue": "N8N instance may require user authentication",
            "solution": "Some N8N instances require user login before API access",
            "action": "Check if user authentication is required"
        })
        
        # Check if API is enabled
        recommendations.append({
            "priority": "MEDIUM",
            "issue": "N8N API may not be enabled",
            "solution": "Ensure N8N API is enabled in instance configuration",
            "action": "Check N8N instance settings for API enablement"
        })
        
        return recommendations
    
    def run_comprehensive_fix(self) -> Dict[str, Any]:
        """Run comprehensive N8N authentication fix"""
        print("🚀 N8N Authentication Fix - Comprehensive Analysis")
        print("=" * 60)
        print(f"🌐 Target: {self.n8n_base_url}")
        print(f"🔑 API Key: {'Set' if self.api_key else 'Not Set'}")
        print()
        
        # Step 1: Diagnose the issue
        diagnosis = self.diagnose_authentication_issue()
        self.fix_results["issues_identified"].append(diagnosis)
        
        # Step 2: Test alternative authentication methods
        auth_test = self.test_alternative_authentication_methods()
        self.fix_results["solutions_attempted"].append(auth_test)
        
        # Step 3: Test alternative API paths
        path_test = self.test_alternative_api_paths()
        self.fix_results["solutions_attempted"].append(path_test)
        
        # Step 4: Check N8N instance configuration
        config_check = self.check_n8n_instance_configuration()
        self.fix_results["solutions_attempted"].append(config_check)
        
        # Step 5: Generate recommendations
        recommendations = self.generate_solution_recommendations()
        self.fix_results["recommendations"] = recommendations
        
        # Determine final status
        if auth_test.get("status") == "success":
            self.fix_results["final_status"] = "success"
        elif path_test.get("status") == "success":
            self.fix_results["final_status"] = "partial_success"
        else:
            self.fix_results["final_status"] = "needs_manual_intervention"
        
        return self.fix_results
    
    def save_fix_report(self):
        """Save fix report to file"""
        with open('n8n-authentication-fix-report.json', 'w') as f:
            json.dump(self.fix_results, f, indent=2)
        
        # Create summary report
        summary = {
            "fix_date": self.fix_results["timestamp"],
            "base_url": self.fix_results["base_url"],
            "final_status": self.fix_results["final_status"],
            "issues_identified": len(self.fix_results["issues_identified"]),
            "solutions_attempted": len(self.fix_results["solutions_attempted"]),
            "recommendations": self.fix_results["recommendations"],
            "next_steps": [
                "Review N8N instance configuration",
                "Verify API key format and permissions",
                "Check N8N instance documentation",
                "Test with correct authentication method",
                "Validate webhook endpoint configurations"
            ]
        }
        
        with open('n8n-authentication-fix-summary.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        return summary

def main():
    """Main function to run N8N authentication fix"""
    print("🔧 N8N Authentication Fix")
    print("=" * 40)
    print("Addressing 401 Unauthorized errors...")
    print()
    
    fixer = N8NAuthenticationFix()
    results = fixer.run_comprehensive_fix()
    summary = fixer.save_fix_report()
    
    print("\n📊 FIX SUMMARY:")
    print(f"   Final Status: {summary['final_status'].upper()}")
    print(f"   Issues Identified: {summary['issues_identified']}")
    print(f"   Solutions Attempted: {summary['solutions_attempted']}")
    print()
    
    print("🔥 RECOMMENDATIONS:")
    for rec in summary['recommendations']:
        priority = "🔴" if rec['priority'] == "HIGH" else "🟡" if rec['priority'] == "MEDIUM" else "🟢"
        print(f"   {priority} {rec['issue']}: {rec['solution']}")
    print()
    
    print("📋 NEXT STEPS:")
    for step in summary['next_steps']:
        print(f"   • {step}")
    print()
    
    print("📁 Files Created:")
    print("   - n8n-authentication-fix-report.json")
    print("   - n8n-authentication-fix-summary.json")
    print()
    
    if summary['final_status'] == 'success':
        print("✅ N8N Authentication fixed successfully!")
    elif summary['final_status'] == 'partial_success':
        print("⚠️ N8N Authentication partially fixed - manual intervention needed!")
    else:
        print("❌ N8N Authentication needs manual intervention!")

if __name__ == "__main__":
    main()














