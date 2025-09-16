#!/usr/bin/env python3
"""
Alex AI Live Security Test
Tests actual Alex AI system components in real-time
"""

import json
import time
import subprocess
import os
import sys
from datetime import datetime
from typing import Dict, List, Any

class AlexAILiveSecurityTest:
    def __init__(self):
        self.test_results = []
        self.project_root = "/Users/bradygeorgen/Documents/workspace/alex-ai-optimized-monorepo-clean"
        
    def log_test_result(self, test_name: str, status: str, details: str = "", passed: bool = True):
        """Log test result"""
        result = {
            "test_name": test_name,
            "status": status,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status_emoji = "✅" if passed else "❌"
        print(f"{status_emoji} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")

    def test_alex_ai_system_startup(self):
        """Test Alex AI system startup and initialization"""
        print("\n🚀 Testing Alex AI System Startup")
        print("=" * 50)
        
        try:
            # Test 1: Check if Alex AI Manager can be imported
            result = subprocess.run([
                'node', '-e', 
                'try { const { AlexAIManager } = require("./packages/@alex-ai/core/dist/alex-ai-manager.js"); console.log("SUCCESS: Alex AI Manager imported"); } catch(e) { console.log("ERROR:", e.message); process.exit(1); }'
            ], capture_output=True, text=True, cwd=self.project_root, timeout=30)
            
            if "SUCCESS" in result.stdout:
                self.log_test_result(
                    "Alex AI Manager Import",
                    "PASS",
                    "Alex AI Manager successfully imported and ready",
                    True
                )
            else:
                self.log_test_result(
                    "Alex AI Manager Import",
                    "FAIL",
                    f"Import failed: {result.stderr}",
                    False
                )
                return False
                
        except subprocess.TimeoutExpired:
            self.log_test_result(
                "Alex AI Manager Import",
                "FAIL",
                "Import timed out after 30 seconds",
                False
            )
            return False
        except Exception as e:
            self.log_test_result(
                "Alex AI Manager Import",
                "FAIL",
                f"Exception: {str(e)}",
                False
            )
            return False
        
        return True

    def test_crew_system_initialization(self):
        """Test Alex AI crew system initialization"""
        print("\n👥 Testing Alex AI Crew System")
        print("=" * 50)
        
        try:
            # Test 1: Check crew coordinator script
            crew_script = f"{self.project_root}/scripts/python/crew_coordinator.py"
            if os.path.exists(crew_script):
                result = subprocess.run([
                    'python3', crew_script
                ], capture_output=True, text=True, cwd=self.project_root, timeout=30)
                
                if result.returncode == 0:
                    self.log_test_result(
                        "Crew Coordinator Script",
                        "PASS",
                        "Crew coordinator script executed successfully",
                        True
                    )
                else:
                    self.log_test_result(
                        "Crew Coordinator Script",
                        "FAIL",
                        f"Script failed: {result.stderr}",
                        False
                    )
            else:
                self.log_test_result(
                    "Crew Coordinator Script",
                    "FAIL",
                    "Crew coordinator script not found",
                    False
                )
                
        except subprocess.TimeoutExpired:
            self.log_test_result(
                "Crew Coordinator Script",
                "FAIL",
                "Script execution timed out",
                False
            )
        except Exception as e:
            self.log_test_result(
                "Crew Coordinator Script",
                "FAIL",
                f"Exception: {str(e)}",
                False
            )

    def test_optimized_engagement_system(self):
        """Test optimized Alex AI engagement system"""
        print("\n⚡ Testing Optimized Engagement System")
        print("=" * 50)
        
        try:
            # Test 1: Run optimized engagement script
            engagement_script = f"{self.project_root}/scripts/optimized_alex_ai_engagement.py"
            if os.path.exists(engagement_script):
                result = subprocess.run([
                    'python3', engagement_script
                ], capture_output=True, text=True, cwd=self.project_root, timeout=30)
                
                if result.returncode == 0 and "Optimized Alex AI System Successfully Engaged" in result.stdout:
                    self.log_test_result(
                        "Optimized Engagement System",
                        "PASS",
                        "Optimized engagement system working correctly",
                        True
                    )
                else:
                    self.log_test_result(
                        "Optimized Engagement System",
                        "FAIL",
                        f"Engagement failed: {result.stderr}",
                        False
                    )
            else:
                self.log_test_result(
                    "Optimized Engagement System",
                    "FAIL",
                    "Optimized engagement script not found",
                    False
                )
                
        except subprocess.TimeoutExpired:
            self.log_test_result(
                "Optimized Engagement System",
                "FAIL",
                "Engagement system timed out",
                False
            )
        except Exception as e:
            self.log_test_result(
                "Optimized Engagement System",
                "FAIL",
                f"Exception: {str(e)}",
                False
            )

    def test_security_script_execution(self):
        """Test security test script execution"""
        print("\n🛡️ Testing Security Test Scripts")
        print("=" * 50)
        
        try:
            # Test 1: Run security test suite
            security_script = f"{self.project_root}/scripts/security_test_suite.py"
            if os.path.exists(security_script):
                result = subprocess.run([
                    'python3', security_script
                ], capture_output=True, text=True, cwd=self.project_root, timeout=60)
                
                if result.returncode == 0 and "Security Grade: A+ (Excellent)" in result.stdout:
                    self.log_test_result(
                        "Security Test Suite",
                        "PASS",
                        "Security test suite executed successfully",
                        True
                    )
                else:
                    self.log_test_result(
                        "Security Test Suite",
                        "FAIL",
                        f"Security tests failed: {result.stderr}",
                        False
                    )
            else:
                self.log_test_result(
                    "Security Test Suite",
                    "FAIL",
                    "Security test script not found",
                    False
                )
                
        except subprocess.TimeoutExpired:
            self.log_test_result(
                "Security Test Suite",
                "FAIL",
                "Security tests timed out",
                False
            )
        except Exception as e:
            self.log_test_result(
                "Security Test Suite",
                "FAIL",
                f"Exception: {str(e)}",
                False
            )

    def test_package_management_security(self):
        """Test package management and dependency security"""
        print("\n📦 Testing Package Management Security")
        print("=" * 50)
        
        try:
            # Test 1: Check package.json for security scripts
            package_json_path = f"{self.project_root}/package.json"
            if os.path.exists(package_json_path):
                with open(package_json_path, 'r') as f:
                    package_data = json.load(f)
                
                security_scripts = [
                    'alex-ai:status',
                    'alex-ai:optimized',
                    'alex-ai:optimized-init',
                    'alex-ai:optimized-status'
                ]
                
                found_scripts = []
                for script in security_scripts:
                    if script in package_data.get('scripts', {}):
                        found_scripts.append(script)
                
                if len(found_scripts) >= 3:
                    self.log_test_result(
                        "Security Scripts in Package.json",
                        "PASS",
                        f"Found {len(found_scripts)} security scripts: {', '.join(found_scripts)}",
                        True
                    )
                else:
                    self.log_test_result(
                        "Security Scripts in Package.json",
                        "WARN",
                        f"Only found {len(found_scripts)} security scripts",
                        False
                    )
            else:
                self.log_test_result(
                    "Security Scripts in Package.json",
                    "FAIL",
                    "package.json not found",
                    False
                )
                
        except Exception as e:
            self.log_test_result(
                "Security Scripts in Package.json",
                "FAIL",
                f"Exception: {str(e)}",
                False
            )

    def test_file_permissions_security(self):
        """Test file permissions and security"""
        print("\n🔒 Testing File Permissions Security")
        print("=" * 50)
        
        try:
            # Test 1: Check critical file permissions
            critical_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/alex-ai-manager.ts",
                f"{self.project_root}/packages/@alex-ai/core/src/n8n-credentials-manager.ts",
                f"{self.project_root}/scripts/python/crew_coordinator.py",
                f"{self.project_root}/scripts/python/alex_ai_credential_manager.py"
            ]
            
            secure_files = 0
            for file_path in critical_files:
                if os.path.exists(file_path):
                    stat_info = os.stat(file_path)
                    permissions = oct(stat_info.st_mode)[-3:]
                    
                    # Check if file is not world-writable
                    if permissions[-1] in ['0', '4', '5', '6']:  # Not world-writable
                        secure_files += 1
            
            if secure_files == len(critical_files):
                self.log_test_result(
                    "File Permissions Security",
                    "PASS",
                    f"All {secure_files} critical files have secure permissions",
                    True
                )
            else:
                self.log_test_result(
                    "File Permissions Security",
                    "WARN",
                    f"Only {secure_files}/{len(critical_files)} files have secure permissions",
                    False
                )
                
        except Exception as e:
            self.log_test_result(
                "File Permissions Security",
                "FAIL",
                f"Exception: {str(e)}",
                False
            )

    def test_environment_security(self):
        """Test environment and configuration security"""
        print("\n🌍 Testing Environment Security")
        print("=" * 50)
        
        try:
            # Test 1: Check for environment files
            env_files = [
                f"{self.project_root}/.env",
                f"{self.project_root}/.env.local",
                f"{self.project_root}/.env.production"
            ]
            
            env_found = False
            for env_file in env_files:
                if os.path.exists(env_file):
                    env_found = True
                    break
            
            if env_found:
                self.log_test_result(
                    "Environment Configuration",
                    "PASS",
                    "Environment configuration files found",
                    True
                )
            else:
                self.log_test_result(
                    "Environment Configuration",
                    "WARN",
                    "No environment configuration files found",
                    False
                )
            
            # Test 2: Check for .gitignore security
            gitignore_path = f"{self.project_root}/.gitignore"
            if os.path.exists(gitignore_path):
                with open(gitignore_path, 'r') as f:
                    gitignore_content = f.read()
                
                security_patterns = ['.env', 'node_modules', '*.log', '*.key', '*.pem']
                found_patterns = [pattern for pattern in security_patterns if pattern in gitignore_content]
                
                if len(found_patterns) >= 3:
                    self.log_test_result(
                        ".gitignore Security",
                        "PASS",
                        f"Found {len(found_patterns)} security patterns in .gitignore",
                        True
                    )
                else:
                    self.log_test_result(
                        ".gitignore Security",
                        "WARN",
                        f"Only found {len(found_patterns)} security patterns in .gitignore",
                        False
                    )
            else:
                self.log_test_result(
                    ".gitignore Security",
                    "FAIL",
                    ".gitignore file not found",
                    False
                )
                
        except Exception as e:
            self.log_test_result(
                "Environment Security",
                "FAIL",
                f"Exception: {str(e)}",
                False
            )

    def run_live_security_tests(self):
        """Run all live security tests"""
        print("🛡️ Alex AI Live Security Test Suite")
        print("=" * 60)
        print(f"Test Started: {datetime.now().isoformat()}")
        print("=" * 60)
        
        # Run all test categories
        test_functions = [
            self.test_alex_ai_system_startup,
            self.test_crew_system_initialization,
            self.test_optimized_engagement_system,
            self.test_security_script_execution,
            self.test_package_management_security,
            self.test_file_permissions_security,
            self.test_environment_security
        ]
        
        for test_function in test_functions:
            try:
                test_function()
            except Exception as e:
                print(f"❌ Error in {test_function.__name__}: {str(e)}")
        
        # Generate test summary
        return self.generate_live_test_summary()

    def generate_live_test_summary(self):
        """Generate live test summary"""
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["passed"]])
        failed_tests = total_tests - passed_tests
        
        # Calculate pass rate
        pass_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        # Calculate security score
        security_score = self.calculate_live_security_score()
        
        summary = {
            "test_summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": failed_tests,
                "pass_rate": round(pass_rate, 2),
                "security_score": security_score,
                "test_timestamp": datetime.now().isoformat()
            },
            "detailed_results": self.test_results,
            "security_assessment": {
                "overall_status": "PASS" if security_score >= 80 else "FAIL",
                "security_grade": self.calculate_security_grade(security_score),
                "recommendations": self.generate_live_recommendations()
            }
        }
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 LIVE SECURITY TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Pass Rate: {pass_rate:.2f}%")
        print(f"Security Score: {security_score}/100")
        print(f"Security Grade: {summary['security_assessment']['security_grade']}")
        print(f"Overall Status: {summary['security_assessment']['overall_status']}")
        print("=" * 60)
        
        return summary

    def calculate_live_security_score(self):
        """Calculate live security score"""
        if not self.test_results:
            return 0
        
        # Weight different test categories
        weights = {
            "Alex AI Manager": 25,
            "Crew System": 20,
            "Engagement System": 15,
            "Security Scripts": 15,
            "Package Management": 10,
            "File Permissions": 10,
            "Environment": 5
        }
        
        total_weighted_score = 0
        total_weight = 0
        
        for result in self.test_results:
            # Determine category from test name
            category = "Other"
            for cat in weights.keys():
                if cat.lower() in result["test_name"].lower():
                    category = cat
                    break
            
            weight = weights.get(category, 5)
            total_weight += weight
            
            if result["passed"]:
                total_weighted_score += weight * 100
            else:
                # Partial credit for some failures
                total_weighted_score += weight * 30
        
        return int(total_weighted_score / total_weight) if total_weight > 0 else 0

    def calculate_security_grade(self, score):
        """Calculate security grade based on score"""
        if score >= 95:
            return "A+ (Excellent)"
        elif score >= 90:
            return "A (Very Good)"
        elif score >= 85:
            return "B+ (Good)"
        elif score >= 80:
            return "B (Satisfactory)"
        elif score >= 75:
            return "C+ (Needs Improvement)"
        else:
            return "C (Poor)"

    def generate_live_recommendations(self):
        """Generate live security recommendations"""
        recommendations = []
        
        failed_tests = [r for r in self.test_results if not r["passed"]]
        
        if not failed_tests:
            recommendations.append("Excellent! All live security tests passed")
            recommendations.append("Continue regular security monitoring")
            recommendations.append("Maintain current security posture")
        else:
            for test in failed_tests:
                recommendations.append(f"Fix {test['test_name']}: {test['details']}")
        
        return recommendations

def main():
    """Main test execution"""
    test_suite = AlexAILiveSecurityTest()
    results = test_suite.run_live_security_tests()
    
    # Save results to file
    with open('alex_ai_live_security_test_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n📁 Live test results saved to: alex_ai_live_security_test_results.json")
    return results

if __name__ == "__main__":
    main()
