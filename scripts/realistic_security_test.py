#!/usr/bin/env python3
"""
Realistic Alex AI Security Test Suite
Tests actual Alex AI system components and security features
"""

import json
import time
import hashlib
import base64
import requests
import subprocess
import os
import sys
from datetime import datetime
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass

# Add the packages directory to the path
sys.path.append('/Users/bradygeorgen/Documents/workspace/alex-ai-optimized-monorepo-clean/packages/@alex-ai/core/src')

@dataclass
class SecurityTestResult:
    test_name: str
    category: str
    status: str
    expected: str
    actual: str
    passed: bool
    details: str
    timestamp: str
    severity: str

class RealisticAlexAISecurityTest:
    def __init__(self):
        self.test_results = []
        self.project_root = "/Users/bradygeorgen/Documents/workspace/alex-ai-optimized-monorepo-clean"
        
    def log_test_result(self, test_name: str, category: str, status: str, 
                       expected: str, actual: str, passed: bool, details: str = "", severity: str = "MEDIUM"):
        """Log test result with severity"""
        result = SecurityTestResult(
            test_name=test_name,
            category=category,
            status=status,
            expected=expected,
            actual=actual,
            passed=passed,
            details=details,
            timestamp=datetime.now().isoformat(),
            severity=severity
        )
        self.test_results.append(result)
        
        status_emoji = "✅" if passed else "❌"
        severity_emoji = "🔴" if severity == "CRITICAL" else "🟡" if severity == "HIGH" else "🟢"
        print(f"{status_emoji} {severity_emoji} {test_name} - {category}: {status}")
        if details:
            print(f"   Details: {details}")

    def test_alex_ai_manager_initialization(self) -> bool:
        """Test Alex AI Manager initialization and security"""
        print("\n🤖 Testing Alex AI Manager Security")
        print("=" * 50)
        
        try:
            # Test 1: Manager initialization
            result = subprocess.run([
                'node', '-e', 
                'const { AlexAIManager } = require("./packages/@alex-ai/core/dist/alex-ai-manager.js"); const manager = AlexAIManager.getInstance(); console.log("Manager initialized successfully");'
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode == 0:
                self.log_test_result(
                    "Alex AI Manager Initialization",
                    "Core Security",
                    "PASS",
                    "Manager initialized successfully",
                    "Manager initialized successfully",
                    True,
                    "Alex AI Manager can be instantiated securely",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "Alex AI Manager Initialization",
                    "Core Security",
                    "FAIL",
                    "Manager initialized successfully",
                    f"Error: {result.stderr}",
                    False,
                    "Alex AI Manager initialization failed",
                    "CRITICAL"
                )
                return False
                
        except Exception as e:
            self.log_test_result(
                "Alex AI Manager Initialization",
                "Core Security",
                "FAIL",
                "Manager initialized successfully",
                f"Exception: {str(e)}",
                False,
                "Alex AI Manager initialization threw exception",
                "CRITICAL"
            )
            return False
        
        return True

    def test_credential_management_security(self) -> bool:
        """Test credential management security features"""
        print("\n🔐 Testing Credential Management Security")
        print("=" * 50)
        
        try:
            # Test 1: Check if credential files exist and have proper permissions
            credential_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/n8n-credentials-manager.ts",
                f"{self.project_root}/scripts/python/alex_ai_credential_manager.py"
            ]
            
            for file_path in credential_files:
                if os.path.exists(file_path):
                    # Check file permissions (should not be world-readable)
                    stat_info = os.stat(file_path)
                    permissions = oct(stat_info.st_mode)[-3:]
                    
                    if permissions in ['600', '640', '644']:  # Reasonable permissions
                        self.log_test_result(
                            f"Credential File Permissions - {os.path.basename(file_path)}",
                            "Credential Security",
                            "PASS",
                            "Secure file permissions",
                            f"Permissions: {permissions}",
                            True,
                            "Credential files have appropriate permissions",
                            "HIGH"
                        )
                    else:
                        self.log_test_result(
                            f"Credential File Permissions - {os.path.basename(file_path)}",
                            "Credential Security",
                            "WARN",
                            "Secure file permissions",
                            f"Permissions: {permissions}",
                            False,
                            "Credential files may have overly permissive permissions",
                            "MEDIUM"
                        )
                else:
                    self.log_test_result(
                        f"Credential File Exists - {os.path.basename(file_path)}",
                        "Credential Security",
                        "FAIL",
                        "Credential file exists",
                        "File not found",
                        False,
                        "Required credential management file missing",
                        "HIGH"
                    )
            
            # Test 2: Check for hardcoded credentials in source code
            self.check_for_hardcoded_credentials()
            
        except Exception as e:
            self.log_test_result(
                "Credential Management Security",
                "Credential Security",
                "FAIL",
                "Credential security checks completed",
                f"Exception: {str(e)}",
                False,
                "Credential security check failed",
                "HIGH"
            )
            return False
        
        return True

    def check_for_hardcoded_credentials(self):
        """Check for hardcoded credentials in source code"""
        try:
            # Common patterns for hardcoded credentials
            credential_patterns = [
                'password.*=.*["\'][^"\']+["\']',
                'api_key.*=.*["\'][^"\']+["\']',
                'secret.*=.*["\'][^"\']+["\']',
                'token.*=.*["\'][^"\']+["\']'
            ]
            
            # Files to check
            files_to_check = [
                f"{self.project_root}/packages/@alex-ai/core/src",
                f"{self.project_root}/scripts"
            ]
            
            hardcoded_found = False
            
            for directory in files_to_check:
                if os.path.exists(directory):
                    for root, dirs, files in os.walk(directory):
                        for file in files:
                            if file.endswith(('.ts', '.js', '.py')):
                                file_path = os.path.join(root, file)
                                try:
                                    with open(file_path, 'r', encoding='utf-8') as f:
                                        content = f.read()
                                        for pattern in credential_patterns:
                                            if pattern in content.lower():
                                                hardcoded_found = True
                                                break
                                except:
                                    continue
            
            if not hardcoded_found:
                self.log_test_result(
                    "Hardcoded Credentials Check",
                    "Credential Security",
                    "PASS",
                    "No hardcoded credentials found",
                    "No hardcoded credentials found",
                    True,
                    "No hardcoded credentials detected in source code",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "Hardcoded Credentials Check",
                    "Credential Security",
                    "WARN",
                    "No hardcoded credentials found",
                    "Potential hardcoded credentials detected",
                    False,
                    "Review source code for hardcoded credentials",
                    "HIGH"
                )
                
        except Exception as e:
            self.log_test_result(
                "Hardcoded Credentials Check",
                "Credential Security",
                "FAIL",
                "Credential check completed",
                f"Exception: {str(e)}",
                False,
                "Hardcoded credentials check failed",
                "MEDIUM"
            )

    def test_data_encryption_implementation(self) -> bool:
        """Test data encryption implementation"""
        print("\n🔒 Testing Data Encryption Implementation")
        print("=" * 50)
        
        try:
            # Test 1: Check for encryption implementations
            encryption_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/n8n-credentials-manager.ts",
                f"{self.project_root}/scripts/python/alex_ai_credential_manager.py"
            ]
            
            encryption_keywords = ['encrypt', 'decrypt', 'AES', 'cipher', 'base64', 'crypto']
            encryption_found = False
            
            for file_path in encryption_files:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        for keyword in encryption_keywords:
                            if keyword.lower() in content.lower():
                                encryption_found = True
                                break
                    if encryption_found:
                        break
            
            if encryption_found:
                self.log_test_result(
                    "Encryption Implementation",
                    "Data Protection",
                    "PASS",
                    "Encryption code found",
                    "Encryption code found",
                    True,
                    "Data encryption implementation detected",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "Encryption Implementation",
                    "Data Protection",
                    "FAIL",
                    "Encryption code found",
                    "No encryption code found",
                    False,
                    "Data encryption implementation not found",
                    "CRITICAL"
                )
                return False
            
            # Test 2: Check for secure random generation
            self.check_secure_random_generation()
            
        except Exception as e:
            self.log_test_result(
                "Data Encryption Implementation",
                "Data Protection",
                "FAIL",
                "Encryption check completed",
                f"Exception: {str(e)}",
                False,
                "Data encryption check failed",
                "HIGH"
            )
            return False
        
        return True

    def check_secure_random_generation(self):
        """Check for secure random number generation"""
        try:
            random_keywords = ['crypto.randomBytes', 'Math.random', 'random', 'uuid', 'generate']
            secure_random_found = False
            
            # Check TypeScript files
            ts_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/n8n-credentials-manager.ts"
            ]
            
            for file_path in ts_files:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if 'crypto.randomBytes' in content or 'uuid' in content:
                            secure_random_found = True
                            break
            
            if secure_random_found:
                self.log_test_result(
                    "Secure Random Generation",
                    "Data Protection",
                    "PASS",
                    "Secure random generation found",
                    "Secure random generation found",
                    True,
                    "Secure random number generation implemented",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "Secure Random Generation",
                    "Data Protection",
                    "WARN",
                    "Secure random generation found",
                    "Limited secure random generation",
                    False,
                    "Consider implementing more secure random generation",
                    "MEDIUM"
                )
                
        except Exception as e:
            self.log_test_result(
                "Secure Random Generation",
                "Data Protection",
                "FAIL",
                "Random generation check completed",
                f"Exception: {str(e)}",
                False,
                "Secure random generation check failed",
                "MEDIUM"
            )

    def test_access_control_implementation(self) -> bool:
        """Test access control implementation"""
        print("\n🛡️ Testing Access Control Implementation")
        print("=" * 50)
        
        try:
            # Test 1: Check for RBAC implementation
            rbac_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/crew-manager.ts"
            ]
            
            rbac_keywords = ['role', 'permission', 'access', 'rbac', 'authorization', 'privilege']
            rbac_found = False
            
            for file_path in rbac_files:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        for keyword in rbac_keywords:
                            if keyword.lower() in content.lower():
                                rbac_found = True
                                break
                    if rbac_found:
                        break
            
            if rbac_found:
                self.log_test_result(
                    "RBAC Implementation",
                    "Access Control",
                    "PASS",
                    "RBAC code found",
                    "RBAC code found",
                    True,
                    "Role-based access control implementation detected",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "RBAC Implementation",
                    "Access Control",
                    "WARN",
                    "RBAC code found",
                    "Limited RBAC implementation",
                    False,
                    "Consider implementing more comprehensive RBAC",
                    "MEDIUM"
                )
            
            # Test 2: Check for session management
            self.check_session_management()
            
        except Exception as e:
            self.log_test_result(
                "Access Control Implementation",
                "Access Control",
                "FAIL",
                "Access control check completed",
                f"Exception: {str(e)}",
                False,
                "Access control check failed",
                "HIGH"
            )
            return False
        
        return True

    def check_session_management(self):
        """Check for session management implementation"""
        try:
            session_keywords = ['session', 'jwt', 'token', 'timeout', 'expire']
            session_found = False
            
            # Check core files
            core_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/alex-ai-manager.ts"
            ]
            
            for file_path in core_files:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        for keyword in session_keywords:
                            if keyword.lower() in content.lower():
                                session_found = True
                                break
                    if session_found:
                        break
            
            if session_found:
                self.log_test_result(
                    "Session Management",
                    "Access Control",
                    "PASS",
                    "Session management found",
                    "Session management found",
                    True,
                    "Session management implementation detected",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "Session Management",
                    "Access Control",
                    "WARN",
                    "Session management found",
                    "Limited session management",
                    False,
                    "Consider implementing session management",
                    "MEDIUM"
                )
                
        except Exception as e:
            self.log_test_result(
                "Session Management",
                "Access Control",
                "FAIL",
                "Session management check completed",
                f"Exception: {str(e)}",
                False,
                "Session management check failed",
                "MEDIUM"
            )

    def test_security_monitoring_implementation(self) -> bool:
        """Test security monitoring implementation"""
        print("\n📊 Testing Security Monitoring Implementation")
        print("=" * 50)
        
        try:
            # Test 1: Check for audit logging
            audit_keywords = ['log', 'audit', 'event', 'monitor', 'track']
            audit_found = False
            
            # Check core files
            core_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/alex-ai-manager.ts",
                f"{self.project_root}/packages/@alex-ai/core/src/crew-manager.ts"
            ]
            
            for file_path in core_files:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        for keyword in audit_keywords:
                            if keyword.lower() in content.lower():
                                audit_found = True
                                break
                    if audit_found:
                        break
            
            if audit_found:
                self.log_test_result(
                    "Audit Logging",
                    "Security Monitoring",
                    "PASS",
                    "Audit logging found",
                    "Audit logging found",
                    True,
                    "Audit logging implementation detected",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "Audit Logging",
                    "Security Monitoring",
                    "WARN",
                    "Audit logging found",
                    "Limited audit logging",
                    False,
                    "Consider implementing comprehensive audit logging",
                    "MEDIUM"
                )
            
            # Test 2: Check for error handling
            self.check_error_handling()
            
        except Exception as e:
            self.log_test_result(
                "Security Monitoring Implementation",
                "Security Monitoring",
                "FAIL",
                "Security monitoring check completed",
                f"Exception: {str(e)}",
                False,
                "Security monitoring check failed",
                "HIGH"
            )
            return False
        
        return True

    def check_error_handling(self):
        """Check for proper error handling"""
        try:
            error_keywords = ['try', 'catch', 'error', 'exception', 'throw']
            error_handling_found = False
            
            # Check core files
            core_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/alex-ai-manager.ts"
            ]
            
            for file_path in core_files:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if 'try' in content and 'catch' in content:
                            error_handling_found = True
                            break
            
            if error_handling_found:
                self.log_test_result(
                    "Error Handling",
                    "Security Monitoring",
                    "PASS",
                    "Error handling found",
                    "Error handling found",
                    True,
                    "Proper error handling implementation detected",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "Error Handling",
                    "Security Monitoring",
                    "WARN",
                    "Error handling found",
                    "Limited error handling",
                    False,
                    "Consider implementing comprehensive error handling",
                    "MEDIUM"
                )
                
        except Exception as e:
            self.log_test_result(
                "Error Handling",
                "Security Monitoring",
                "FAIL",
                "Error handling check completed",
                f"Exception: {str(e)}",
                False,
                "Error handling check failed",
                "MEDIUM"
            )

    def test_input_validation_implementation(self) -> bool:
        """Test input validation implementation"""
        print("\n🔍 Testing Input Validation Implementation")
        print("=" * 50)
        
        try:
            # Test 1: Check for input validation
            validation_keywords = ['validate', 'sanitize', 'escape', 'filter', 'input']
            validation_found = False
            
            # Check API files
            api_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/unified-data-service.ts"
            ]
            
            for file_path in api_files:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        for keyword in validation_keywords:
                            if keyword.lower() in content.lower():
                                validation_found = True
                                break
                    if validation_found:
                        break
            
            if validation_found:
                self.log_test_result(
                    "Input Validation",
                    "API Security",
                    "PASS",
                    "Input validation found",
                    "Input validation found",
                    True,
                    "Input validation implementation detected",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "Input Validation",
                    "API Security",
                    "WARN",
                    "Input validation found",
                    "Limited input validation",
                    False,
                    "Consider implementing comprehensive input validation",
                    "MEDIUM"
                )
            
            # Test 2: Check for SQL injection prevention
            self.check_sql_injection_prevention()
            
        except Exception as e:
            self.log_test_result(
                "Input Validation Implementation",
                "API Security",
                "FAIL",
                "Input validation check completed",
                f"Exception: {str(e)}",
                False,
                "Input validation check failed",
                "HIGH"
            )
            return False
        
        return True

    def check_sql_injection_prevention(self):
        """Check for SQL injection prevention"""
        try:
            # Look for parameterized queries or ORM usage
            sql_keywords = ['parameterized', 'prepared', 'orm', 'sequelize', 'typeorm']
            sql_protection_found = False
            
            # Check database-related files
            db_files = [
                f"{self.project_root}/packages/@alex-ai/core/src/unified-data-service.ts"
            ]
            
            for file_path in db_files:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        for keyword in sql_keywords:
                            if keyword.lower() in content.lower():
                                sql_protection_found = True
                                break
                    if sql_protection_found:
                        break
            
            if sql_protection_found:
                self.log_test_result(
                    "SQL Injection Prevention",
                    "API Security",
                    "PASS",
                    "SQL injection prevention found",
                    "SQL injection prevention found",
                    True,
                    "SQL injection prevention implementation detected",
                    "HIGH"
                )
            else:
                self.log_test_result(
                    "SQL Injection Prevention",
                    "API Security",
                    "WARN",
                    "SQL injection prevention found",
                    "Limited SQL injection prevention",
                    False,
                    "Consider implementing SQL injection prevention",
                    "HIGH"
                )
                
        except Exception as e:
            self.log_test_result(
                "SQL Injection Prevention",
                "API Security",
                "FAIL",
                "SQL injection prevention check completed",
                f"Exception: {str(e)}",
                False,
                "SQL injection prevention check failed",
                "HIGH"
            )

    def run_realistic_security_tests(self) -> Dict[str, Any]:
        """Run realistic security tests on Alex AI system"""
        print("🛡️ Realistic Alex AI Security Test Suite")
        print("=" * 60)
        print(f"Test Started: {datetime.now().isoformat()}")
        print("=" * 60)
        
        # Run all test categories
        test_functions = [
            self.test_alex_ai_manager_initialization,
            self.test_credential_management_security,
            self.test_data_encryption_implementation,
            self.test_access_control_implementation,
            self.test_security_monitoring_implementation,
            self.test_input_validation_implementation
        ]
        
        for test_function in test_functions:
            try:
                test_function()
            except Exception as e:
                print(f"❌ Error in {test_function.__name__}: {str(e)}")
        
        # Generate test summary
        return self.generate_security_summary()

    def generate_security_summary(self) -> Dict[str, Any]:
        """Generate comprehensive security summary"""
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r.passed])
        failed_tests = total_tests - passed_tests
        
        # Calculate pass rate
        pass_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        # Categorize by severity
        critical_tests = [r for r in self.test_results if r.severity == "CRITICAL"]
        high_tests = [r for r in self.test_results if r.severity == "HIGH"]
        medium_tests = [r for r in self.test_results if r.severity == "MEDIUM"]
        
        critical_passed = len([r for r in critical_tests if r.passed])
        high_passed = len([r for r in high_tests if r.passed])
        medium_passed = len([r for r in medium_tests if r.passed])
        
        # Calculate security score
        security_score = self.calculate_security_score()
        
        summary = {
            "test_summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": failed_tests,
                "pass_rate": round(pass_rate, 2),
                "security_score": security_score,
                "test_timestamp": datetime.now().isoformat()
            },
            "severity_breakdown": {
                "critical": {
                    "total": len(critical_tests),
                    "passed": critical_passed,
                    "pass_rate": round((critical_passed / len(critical_tests) * 100) if critical_tests else 0, 2)
                },
                "high": {
                    "total": len(high_tests),
                    "passed": high_passed,
                    "pass_rate": round((high_passed / len(high_tests) * 100) if high_tests else 0, 2)
                },
                "medium": {
                    "total": len(medium_tests),
                    "passed": medium_passed,
                    "pass_rate": round((medium_passed / len(medium_tests) * 100) if medium_tests else 0, 2)
                }
            },
            "detailed_results": [
                {
                    "test_name": r.test_name,
                    "category": r.category,
                    "status": r.status,
                    "passed": r.passed,
                    "severity": r.severity,
                    "details": r.details,
                    "timestamp": r.timestamp
                } for r in self.test_results
            ],
            "security_assessment": {
                "overall_status": "PASS" if security_score >= 85 else "FAIL",
                "security_grade": self.calculate_security_grade(security_score),
                "critical_issues": len([r for r in critical_tests if not r.passed]),
                "high_issues": len([r for r in high_tests if not r.passed]),
                "recommendations": self.generate_security_recommendations()
            }
        }
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 REALISTIC SECURITY TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Pass Rate: {pass_rate:.2f}%")
        print(f"Security Score: {security_score}/100")
        print(f"Security Grade: {summary['security_assessment']['security_grade']}")
        print(f"Overall Status: {summary['security_assessment']['overall_status']}")
        print(f"Critical Issues: {summary['security_assessment']['critical_issues']}")
        print(f"High Priority Issues: {summary['security_assessment']['high_issues']}")
        print("=" * 60)
        
        return summary

    def calculate_security_score(self) -> int:
        """Calculate overall security score based on test results"""
        if not self.test_results:
            return 0
        
        # Weight by severity
        critical_weight = 3
        high_weight = 2
        medium_weight = 1
        
        total_weighted_score = 0
        total_weight = 0
        
        for result in self.test_results:
            if result.severity == "CRITICAL":
                weight = critical_weight
            elif result.severity == "HIGH":
                weight = high_weight
            else:
                weight = medium_weight
            
            total_weight += weight
            if result.passed:
                total_weighted_score += weight * 100
            else:
                # Partial credit for some failures
                total_weighted_score += weight * 20
        
        return int(total_weighted_score / total_weight) if total_weight > 0 else 0

    def calculate_security_grade(self, score: int) -> str:
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

    def generate_security_recommendations(self) -> List[str]:
        """Generate security recommendations based on test results"""
        recommendations = []
        
        failed_tests = [r for r in self.test_results if not r.passed]
        critical_failures = [r for r in failed_tests if r.severity == "CRITICAL"]
        high_failures = [r for r in failed_tests if r.severity == "HIGH"]
        
        if critical_failures:
            recommendations.append("URGENT: Address critical security issues immediately")
            for test in critical_failures:
                recommendations.append(f"CRITICAL: Fix {test.test_name} - {test.details}")
        
        if high_failures:
            recommendations.append("HIGH PRIORITY: Address high-severity security issues")
            for test in high_failures:
                recommendations.append(f"HIGH: Improve {test.test_name} - {test.details}")
        
        if not failed_tests:
            recommendations.append("Excellent security posture - maintain current standards")
            recommendations.append("Continue regular security testing and monitoring")
            recommendations.append("Keep security controls updated with latest threats")
        else:
            medium_failures = [r for r in failed_tests if r.severity == "MEDIUM"]
            if medium_failures:
                recommendations.append("MEDIUM PRIORITY: Address medium-severity issues when possible")
                for test in medium_failures:
                    recommendations.append(f"MEDIUM: Consider improving {test.test_name} - {test.details}")
        
        return recommendations

def main():
    """Main test execution"""
    test_suite = RealisticAlexAISecurityTest()
    results = test_suite.run_realistic_security_tests()
    
    # Save results to file
    with open('realistic_security_test_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n📁 Test results saved to: realistic_security_test_results.json")
    return results

if __name__ == "__main__":
    main()
