#!/usr/bin/env python3
"""
Test Automation Script
Automated testing for N8N to Cursor AI integration
"""

import os
import sys
import json
import time
import subprocess
from datetime import datetime
from typing import Dict, List, Any

class TestAutomation:
    """Test automation for continuous integration"""
    
    def __init__(self):
        self.test_results = {
            "automation_timestamp": datetime.now().isoformat(),
            "test_runs": [],
            "overall_status": "UNKNOWN",
            "recommendations": []
        }
        
    def run_automated_tests(self) -> Dict[str, Any]:
        """Run all automated tests"""
        print("🤖 Starting Automated Test Suite")
        print("=" * 50)
        
        test_phases = [
            {
                "name": "Unit Tests",
                "command": "python3 run_all_tests.py",
                "description": "Core functionality tests"
            },
            {
                "name": "Integration Tests", 
                "command": "cd .. && python3 test_rag_integration_system.py",
                "description": "RAG system integration tests"
            },
            {
                "name": "N8N Workflow Tests",
                "command": "cd .. && python3 test_n8n_rag_workflows.py", 
                "description": "N8N workflow integration tests"
            },
            {
                "name": "End-to-End Tests",
                "command": "cd .. && python3 generate_rag_test_report.py",
                "description": "Comprehensive system tests"
            }
        ]
        
        successful_tests = 0
        total_tests = len(test_phases)
        
        for phase in test_phases:
            print(f"\n🔍 Running {phase['name']}...")
            print(f"   {phase['description']}")
            print("-" * 40)
            
            phase_result = self._run_test_phase(phase)
            self.test_results["test_runs"].append(phase_result)
            
            if phase_result["success"]:
                successful_tests += 1
                print(f"   ✅ {phase['name']}: PASSED")
            else:
                print(f"   ❌ {phase['name']}: FAILED")
                print(f"   Error: {phase_result.get('error', 'Unknown error')}")
        
        # Calculate overall status
        success_rate = (successful_tests / total_tests) * 100
        self.test_results["overall_status"] = "PASSED" if success_rate >= 80 else "FAILED"
        self.test_results["success_rate"] = success_rate
        self.test_results["successful_tests"] = successful_tests
        self.test_results["total_tests"] = total_tests
        
        # Generate recommendations
        self.test_results["recommendations"] = self._generate_automation_recommendations()
        
        # Print summary
        self._print_automation_summary()
        
        return self.test_results
        
    def _run_test_phase(self, phase: Dict[str, str]) -> Dict[str, Any]:
        """Run a single test phase"""
        start_time = time.time()
        
        try:
            # Run the test command
            result = subprocess.run(
                phase["command"],
                shell=True,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            execution_time = time.time() - start_time
            
            return {
                "phase_name": phase["name"],
                "command": phase["command"],
                "success": result.returncode == 0,
                "execution_time": execution_time,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "return_code": result.returncode,
                "error": None if result.returncode == 0 else f"Command failed with return code {result.returncode}"
            }
            
        except subprocess.TimeoutExpired:
            return {
                "phase_name": phase["name"],
                "command": phase["command"],
                "success": False,
                "execution_time": 300,
                "stdout": "",
                "stderr": "Test timed out after 5 minutes",
                "return_code": -1,
                "error": "Test execution timeout"
            }
            
        except Exception as e:
            return {
                "phase_name": phase["name"],
                "command": phase["command"],
                "success": False,
                "execution_time": time.time() - start_time,
                "stdout": "",
                "stderr": str(e),
                "return_code": -1,
                "error": str(e)
            }
            
    def _generate_automation_recommendations(self) -> List[str]:
        """Generate automation recommendations"""
        recommendations = [
            "✅ Automated test suite provides comprehensive coverage",
            "🔄 Implement scheduled test runs for continuous monitoring",
            "📊 Add test result notifications and alerting",
            "🛡️ Include security scanning in automated pipeline",
            "🎯 Add performance benchmarking to automation",
            "📈 Implement test result trending and analytics",
            "🔧 Add automated test data generation and cleanup",
            "📋 Create test environment provisioning automation",
            "⚡ Optimize test execution for faster feedback loops",
            "🚀 Plan for automated deployment based on test results"
        ]
        
        return recommendations
        
    def _print_automation_summary(self):
        """Print automation summary"""
        print("\n" + "=" * 50)
        print("🤖 AUTOMATED TEST RESULTS SUMMARY")
        print("=" * 50)
        
        print(f"📊 Total Test Phases: {self.test_results['total_tests']}")
        print(f"✅ Successful: {self.test_results['successful_tests']}")
        print(f"❌ Failed: {self.test_results['total_tests'] - self.test_results['successful_tests']}")
        print(f"📈 Success Rate: {self.test_results['success_rate']:.1f}%")
        print(f"🎯 Overall Status: {self.test_results['overall_status']}")
        
        print(f"\n📋 Detailed Results by Phase:")
        for test_run in self.test_results["test_runs"]:
            status = "✅" if test_run["success"] else "❌"
            print(f"   {status} {test_run['phase_name']}: {test_run['execution_time']:.2f}s")
            
    def save_automation_results(self, filename: str = None) -> str:
        """Save automation results to file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"test_automation_results_{timestamp}.json"
            
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.test_results, f, indent=2, ensure_ascii=False)
            
        return filename

def main():
    """Main execution function"""
    print("🤖 Test Automation for N8N to Cursor AI Integration")
    print("=" * 60)
    
    # Create automation instance
    automation = TestAutomation()
    
    # Run automated tests
    results = automation.run_automated_tests()
    
    # Save results
    filename = automation.save_automation_results()
    
    print(f"\n📄 Automation results saved to: {filename}")
    print("🎯 Test Automation Complete!")
    
    # Return exit code based on results
    if results["overall_status"] == "PASSED":
        return 0
    else:
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
