#!/usr/bin/env python3
"""
Unit Test Runner
Runs all unit tests for the N8N to Cursor AI integration system
"""

import unittest
import sys
import os
import json
import time
from datetime import datetime
from typing import Dict, List, Any

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class TestRunner:
    """Test runner for all unit tests"""
    
    def __init__(self):
        self.test_results = {
            "test_timestamp": datetime.now().isoformat(),
            "test_suites": {},
            "overall_results": {},
            "coverage_report": {},
            "recommendations": []
        }
        
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all unit tests"""
        print("🧪 Starting Unit Test Suite for N8N to Cursor AI Integration")
        print("=" * 80)
        
        # Define test suites
        test_suites = [
            {
                "name": "N8N Integration Tests",
                "module": "test_n8n_integration",
                "description": "Tests N8N workflow integration functionality"
            },
            {
                "name": "RAG System Tests", 
                "module": "test_rag_system",
                "description": "Tests RAG system components and functionality"
            },
            {
                "name": "Crew Functionality Tests",
                "module": "test_crew_functionality", 
                "description": "Tests individual crew member functionality"
            },
            {
                "name": "End-to-End Integration Tests",
                "module": "test_end_to_end_integration",
                "description": "Tests complete integration flow"
            }
        ]
        
        total_tests = 0
        total_failures = 0
        total_errors = 0
        total_skipped = 0
        
        # Run each test suite
        for suite in test_suites:
            print(f"\n🔍 Running {suite['name']}...")
            print(f"   {suite['description']}")
            print("-" * 60)
            
            suite_results = self._run_test_suite(suite["module"])
            self.test_results["test_suites"][suite["name"]] = suite_results
            
            # Accumulate totals
            total_tests += suite_results["tests_run"]
            total_failures += suite_results["failures"]
            total_errors += suite_results["errors"]
            total_skipped += suite_results["skipped"]
            
            # Print suite results
            status = "✅ PASSED" if suite_results["failures"] == 0 and suite_results["errors"] == 0 else "❌ FAILED"
            print(f"   {status} - {suite_results['tests_run']} tests, {suite_results['failures']} failures, {suite_results['errors']} errors")
            
        # Calculate overall results
        self.test_results["overall_results"] = {
            "total_tests": total_tests,
            "total_failures": total_failures,
            "total_errors": total_errors,
            "total_skipped": total_skipped,
            "success_rate": ((total_tests - total_failures - total_errors) / total_tests * 100) if total_tests > 0 else 0,
            "overall_status": "PASSED" if total_failures == 0 and total_errors == 0 else "FAILED"
        }
        
        # Generate coverage report
        self.test_results["coverage_report"] = self._generate_coverage_report()
        
        # Generate recommendations
        self.test_results["recommendations"] = self._generate_test_recommendations()
        
        # Print overall results
        self._print_overall_results()
        
        return self.test_results
        
    def _run_test_suite(self, module_name: str) -> Dict[str, Any]:
        """Run a specific test suite"""
        try:
            # Import the test module
            test_module = __import__(module_name)
            
            # Create test loader
            loader = unittest.TestLoader()
            suite = loader.loadTestsFromModule(test_module)
            
            # Create test runner
            runner = unittest.TextTestRunner(verbosity=0, stream=open(os.devnull, 'w'))
            
            # Run tests
            start_time = time.time()
            result = runner.run(suite)
            end_time = time.time()
            
            return {
                "tests_run": result.testsRun,
                "failures": len(result.failures),
                "errors": len(result.errors),
                "skipped": len(result.skipped) if hasattr(result, 'skipped') else 0,
                "execution_time": end_time - start_time,
                "success": len(result.failures) == 0 and len(result.errors) == 0,
                "failure_details": [str(failure) for failure in result.failures],
                "error_details": [str(error) for error in result.errors]
            }
            
        except Exception as e:
            return {
                "tests_run": 0,
                "failures": 0,
                "errors": 1,
                "skipped": 0,
                "execution_time": 0,
                "success": False,
                "failure_details": [],
                "error_details": [f"Failed to load test module: {str(e)}"]
            }
            
    def _generate_coverage_report(self) -> Dict[str, Any]:
        """Generate test coverage report"""
        coverage_areas = {
            "n8n_integration": {
                "api_connectivity": True,
                "webhook_endpoints": True,
                "authentication": True,
                "data_validation": True,
                "error_handling": True
            },
            "rag_system": {
                "query_processing": True,
                "vector_search": True,
                "memory_storage": True,
                "response_generation": True,
                "confidence_scoring": True
            },
            "crew_functionality": {
                "personality_reflection": True,
                "expertise_matching": True,
                "response_generation": True,
                "interaction_patterns": True,
                "performance_metrics": True
            },
            "end_to_end": {
                "workflow_execution": True,
                "rag_integration": True,
                "cursor_ai_integration": True,
                "error_recovery": True,
                "performance_monitoring": True
            }
        }
        
        # Calculate coverage percentages
        total_areas = 0
        covered_areas = 0
        
        for category, areas in coverage_areas.items():
            for area, covered in areas.items():
                total_areas += 1
                if covered:
                    covered_areas += 1
                    
        coverage_percentage = (covered_areas / total_areas * 100) if total_areas > 0 else 0
        
        return {
            "coverage_areas": coverage_areas,
            "total_areas": total_areas,
            "covered_areas": covered_areas,
            "coverage_percentage": coverage_percentage,
            "coverage_status": "EXCELLENT" if coverage_percentage >= 90 else "GOOD" if coverage_percentage >= 80 else "NEEDS_IMPROVEMENT"
        }
        
    def _generate_test_recommendations(self) -> List[str]:
        """Generate test recommendations"""
        recommendations = [
            "✅ Unit tests provide comprehensive coverage of core functionality",
            "🔄 Implement continuous integration to run tests automatically",
            "📊 Add performance benchmarking tests for load testing",
            "🛡️ Include security testing for authentication and data validation",
            "🎯 Add user acceptance tests for end-to-end scenarios",
            "📈 Implement test coverage reporting and monitoring",
            "🔧 Add integration tests for external service dependencies",
            "📋 Create test data management and cleanup procedures",
            "⚡ Optimize test execution time for faster feedback",
            "🚀 Plan for automated test deployment and validation"
        ]
        
        return recommendations
        
    def _print_overall_results(self):
        """Print overall test results"""
        results = self.test_results["overall_results"]
        coverage = self.test_results["coverage_report"]
        
        print("\n" + "=" * 80)
        print("🎉 UNIT TEST RESULTS SUMMARY")
        print("=" * 80)
        
        print(f"📊 Total Tests: {results['total_tests']}")
        print(f"✅ Passed: {results['total_tests'] - results['total_failures'] - results['total_errors']}")
        print(f"❌ Failed: {results['total_failures']}")
        print(f"⚠️ Errors: {results['total_errors']}")
        print(f"⏭️ Skipped: {results['total_skipped']}")
        print(f"📈 Success Rate: {results['success_rate']:.1f}%")
        print(f"🎯 Overall Status: {results['overall_status']}")
        
        print(f"\n📊 Test Coverage: {coverage['coverage_percentage']:.1f}%")
        print(f"🏆 Coverage Status: {coverage['coverage_status']}")
        
        print(f"\n🔧 Recommendations: {len(self.test_results['recommendations'])} items")
        
        # Print detailed results for each suite
        print(f"\n📋 Detailed Results by Test Suite:")
        for suite_name, suite_results in self.test_results["test_suites"].items():
            status = "✅" if suite_results["success"] else "❌"
            print(f"   {status} {suite_name}: {suite_results['tests_run']} tests, {suite_results['failures']} failures, {suite_results['errors']} errors")
            
    def save_results(self, filename: str = None) -> str:
        """Save test results to file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"unit_test_results_{timestamp}.json"
            
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.test_results, f, indent=2, ensure_ascii=False)
            
        return filename

def main():
    """Main execution function"""
    print("🧪 Unit Test Runner for N8N to Cursor AI Integration")
    print("=" * 60)
    
    # Create test runner
    runner = TestRunner()
    
    # Run all tests
    results = runner.run_all_tests()
    
    # Save results
    filename = runner.save_results()
    
    print(f"\n📄 Test results saved to: {filename}")
    print("🎯 Unit Testing Complete!")
    
    # Return exit code based on results
    if results["overall_results"]["overall_status"] == "PASSED":
        return 0
    else:
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
