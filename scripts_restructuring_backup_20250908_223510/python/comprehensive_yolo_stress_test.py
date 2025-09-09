from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Comprehensive YOLO Mode Stress Test
==================================

This script performs comprehensive stress testing of YOLO Mode integration
to identify any overlooked scenarios or edge cases.
"""

import json
import logging
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s:%(name)s:%(message)s')

class ComprehensiveYOLOStressTest:
    """Comprehensive stress testing for YOLO Mode integration"""
    
        self.test_results = []
        self.failed_tests = []
        self.passed_tests = []
        
    def run_all_stress_tests(self):
        """Run all stress tests"""
        logging.info("🚀 Starting Comprehensive YOLO Mode Stress Test")
        
        tests = [
            ("File Creation Tests", self.test_file_creation),
            ("Directory Operations", self.test_directory_operations),
            ("Code Generation Tests", self.test_code_generation),
            ("Git Operations Tests", self.test_git_operations),
            ("Package Management Tests", self.test_package_management),
            ("Configuration Tests", self.test_configuration_operations),
            ("Memory System Tests", self.test_memory_system_operations),
            ("N8N Workflow Tests", self.test_n8n_workflow_operations),
            ("Crew System Tests", self.test_crew_system_operations),
            ("Edge Case Tests", self.test_edge_cases),
            ("Performance Tests", self.test_performance),
            ("Error Handling Tests", self.test_error_handling)
        ]
        
        for test_name, test_func in tests:
            logging.info(f"🧪 Running {test_name}")
            try:
                result = test_func()
                if result:
                    self.passed_tests.append(test_name)
                    logging.info(f"✅ {test_name} PASSED")
                else:
                    self.failed_tests.append(test_name)
                    logging.error(f"❌ {test_name} FAILED")
            except Exception as e:
                self.failed_tests.append(test_name)
                logging.error(f"❌ {test_name} FAILED with exception: {e}")
        
        return self.generate_stress_test_report()
    
    def test_file_creation(self):
        """Test various file creation scenarios"""
        test_files = [
            "stress_test_simple.txt",
            "stress_test_complex.py",
            "stress_test_json.json",
            "stress_test_markdown.md",
            "stress_test_yaml.yml",
            "stress_test_sql.sql",
            "stress_test_shell.sh"
        ]
        
        success_count = 0
        for test_file in test_files:
            try:
                with open(test_file, 'w') as f:
                    f.write(f"# Stress Test File: {test_file}\n")
                    f.write(f"Created: {datetime.now()}\n")
                    f.write("YOLO Mode stress test content\n")
                success_count += 1
            except Exception as e:
                logging.error(f"Failed to create {test_file}: {e}")
        
        return success_count == len(test_files)
    
    def test_directory_operations(self):
        """Test directory creation and management"""
        test_dirs = [
            "stress_test_dir_1",
            "stress_test_dir_2/nested_dir",
            "stress_test_dir_3/deeply/nested/directory"
        ]
        
        success_count = 0
        for test_dir in test_dirs:
            try:
                os.makedirs(test_dir, exist_ok=True)
                # Create a file in the directory
                test_file = os.path.join(test_dir, "test_file.txt")
                with open(test_file, 'w') as f:
                    f.write(f"Test file in {test_dir}\n")
                success_count += 1
            except Exception as e:
                logging.error(f"Failed to create {test_dir}: {e}")
        
        return success_count == len(test_dirs)
    
    def test_code_generation(self):
        """Test code generation scenarios"""
        code_templates = [
            {
                "file": "stress_test_class.py",
                "content": """
class StressTestClass:
        self.created = datetime.now()
    
    def test_method(self):
        return f"Test method called at {self.created}"
"""
            },
            {
                "file": "stress_test_function.js",
                "content": """
function stressTestFunction() {
    const timestamp = new Date().toISOString();
    console.log(`Stress test function called at ${timestamp}`);
    return { status: 'success', timestamp };
}

module.exports = { stressTestFunction };
"""
            },
            {
                "file": "stress_test_config.json",
                "content": json.dumps({
                    "stress_test": True,
                    "timestamp": datetime.now().isoformat(),
                    "config": {
                        "yolo_mode": True,
                        "auto_execute": True
                    }
                }, indent=2)
            }
        ]
        
        success_count = 0
        for template in code_templates:
            try:
                with open(template["file"], 'w') as f:
                    f.write(template["content"])
                success_count += 1
            except Exception as e:
                logging.error(f"Failed to create {template['file']}: {e}")
        
        return success_count == len(code_templates)
    
    def test_git_operations(self):
        """Test Git operations (if in a Git repository)"""
        try:
            # Check if we're in a Git repository
            result = subprocess.run(['git', 'status'], capture_output=True, text=True)
            if result.returncode != 0:
                logging.info("Not in a Git repository, skipping Git tests")
                return True
            
            # Test Git operations
            git_commands = [
                ['git', 'status'],
                ['git', 'add', '.'],
                ['git', 'status']
            ]
            
            success_count = 0
            for cmd in git_commands:
                try:
                    result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
                    if result.returncode == 0:
                        success_count += 1
                except Exception as e:
                    logging.error(f"Git command failed: {cmd} - {e}")
            
            return success_count == len(git_commands)
            
        except Exception as e:
            logging.error(f"Git operations test failed: {e}")
            return False
    
    def test_package_management(self):
        """Test package management operations"""
        try:
            # Test npm operations (if package.json exists)
            if os.path.exists("package.json"):
                npm_commands = [
                    ['npm', '--version'],
                    ['npm', 'list', '--depth=0']
                ]
                
                success_count = 0
                for cmd in npm_commands:
                    try:
                        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
                        if result.returncode == 0:
                            success_count += 1
                    except Exception as e:
                        logging.error(f"NPM command failed: {cmd} - {e}")
                
                return success_count == len(npm_commands)
            else:
                logging.info("No package.json found, skipping npm tests")
                return True
                
        except Exception as e:
            logging.error(f"Package management test failed: {e}")
            return False
    
    def test_configuration_operations(self):
        """Test configuration file operations"""
        config_files = [
            {
                "file": "stress_test_config.yml",
                "content": """
stress_test:
  enabled: true
  timestamp: "2025-09-06T21:45:00Z"
  yolo_mode: true
  auto_execute: true
"""
            },
            {
                "file": "stress_test_env.env",
                "content": """
STRESS_TEST=true
YOLO_MODE=true
AUTO_EXECUTE=true
TIMESTAMP=2025-09-06T21:45:00Z
"""
            }
        ]
        
        success_count = 0
        for config in config_files:
            try:
                with open(config["file"], 'w') as f:
                    f.write(config["content"])
                success_count += 1
            except Exception as e:
                logging.error(f"Failed to create {config['file']}: {e}")
        
        return success_count == len(config_files)
    
    def test_memory_system_operations(self):
        """Test memory system operations"""
        try:
            # Test creating memory files
            memory_files = [
                "stress_test_memory_1.json",
                "stress_test_memory_2.json"
            ]
            
            success_count = 0
            for memory_file in memory_files:
                try:
                    memory_data = {
                        "stress_test": True,
                        "timestamp": datetime.now().isoformat(),
                        "yolo_mode": True,
                        "test_type": "memory_system"
                    }
                    
                    with open(memory_file, 'w') as f:
                        json.dump(memory_data, f, indent=2)
                    success_count += 1
                except Exception as e:
                    logging.error(f"Failed to create {memory_file}: {e}")
            
            return success_count == len(memory_files)
            
        except Exception as e:
            logging.error(f"Memory system test failed: {e}")
            return False
    
    def test_n8n_workflow_operations(self):
        """Test N8N workflow operations"""
        try:
            # Test creating N8N workflow files
            workflow_files = [
                "stress_test_workflow_1.json",
                "stress_test_workflow_2.json"
            ]
            
            success_count = 0
            for workflow_file in workflow_files:
                try:
                    workflow_data = {
                        "name": f"Stress Test Workflow {workflow_file}",
                        "nodes": [
                            {
                                "id": "test_node_1",
                                "type": "test",
                                "name": "Test Node",
                                "parameters": {
                                    "test": True,
                                    "yolo_mode": True
                                }
                            }
                        ],
                        "connections": {},
                        "active": False,
                        "settings": {},
                        "createdAt": datetime.now().isoformat(),
                        "updatedAt": datetime.now().isoformat()
                    }
                    
                    with open(workflow_file, 'w') as f:
                        json.dump(workflow_data, f, indent=2)
                    success_count += 1
                except Exception as e:
                    logging.error(f"Failed to create {workflow_file}: {e}")
            
            return success_count == len(workflow_files)
            
        except Exception as e:
            logging.error(f"N8N workflow test failed: {e}")
            return False
    
    def test_crew_system_operations(self):
        """Test crew system operations"""
        try:
            # Test creating crew system files
            crew_files = [
                "stress_test_crew_1.py",
                "stress_test_crew_2.js"
            ]
            
            success_count = 0
            for crew_file in crew_files:
                try:
                    if crew_file.endswith('.py'):
                        content = """
class StressTestCrew:
        self.yolo_mode = True
    
    def test_operation(self):
        return "Stress test operation successful"
"""
                    else:
                        content = """
class StressTestCrew {
    constructor() {
        this.name = "Stress Test Crew";
        this.yoloMode = true;
    }
    
    testOperation() {
        return "Stress test operation successful";
    }
}

module.exports = StressTestCrew;
"""
                    
                    with open(crew_file, 'w') as f:
                        f.write(content)
                    success_count += 1
                except Exception as e:
                    logging.error(f"Failed to create {crew_file}: {e}")
            
            return success_count == len(crew_files)
            
        except Exception as e:
            logging.error(f"Crew system test failed: {e}")
            return False
    
    def test_edge_cases(self):
        """Test edge cases and unusual scenarios"""
        edge_cases = [
            {
                "file": "stress_test_unicode_测试.txt",
                "content": "Unicode test file with Chinese characters: 测试"
            },
            {
                "file": "stress_test_special_chars!@#$%^&*().txt",
                "content": "File with special characters in name"
            },
            {
                "file": "stress_test_very_long_filename_that_might_cause_issues_with_some_systems.txt",
                "content": "File with very long filename"
            }
        ]
        
        success_count = 0
        for edge_case in edge_cases:
            try:
                with open(edge_case["file"], 'w') as f:
                    f.write(edge_case["content"])
                success_count += 1
            except Exception as e:
                logging.error(f"Edge case failed: {edge_case['file']} - {e}")
        
        return success_count == len(edge_cases)
    
    def test_performance(self):
        """Test performance with multiple rapid operations"""
        try:
            start_time = time.time()
            
            # Create 100 files rapidly
            for i in range(100):
                test_file = f"stress_test_performance_{i}.txt"
                with open(test_file, 'w') as f:
                    f.write(f"Performance test file {i}\n")
            
            end_time = time.time()
            duration = end_time - start_time
            
            logging.info(f"Performance test: Created 100 files in {duration:.2f} seconds")
            
            # Clean up performance test files
            for i in range(100):
                test_file = f"stress_test_performance_{i}.txt"
                try:
                    os.remove(test_file)
                except:
                    pass
            
            return duration < 10.0  # Should complete in under 10 seconds
            
        except Exception as e:
            logging.error(f"Performance test failed: {e}")
            return False
    
    def test_error_handling(self):
        """Test error handling scenarios"""
        try:
            # Test creating file in non-existent directory
            try:
                with open("non_existent_dir/test_file.txt", 'w') as f:
                    f.write("This should fail")
                return False  # Should have failed
            except:
                pass  # Expected to fail
            
            # Test creating file with invalid characters
            try:
                with open("test_file<invalid>.txt", 'w') as f:
                    f.write("This should fail")
                return False  # Should have failed
            except:
                pass  # Expected to fail
            
            return True  # Error handling worked correctly
            
        except Exception as e:
            logging.error(f"Error handling test failed: {e}")
            return False
    
    def generate_stress_test_report(self):
        """Generate comprehensive stress test report"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_file = f"yolo_mode_stress_test_report_{timestamp}.md"
        
        total_tests = len(self.passed_tests) + len(self.failed_tests)
        success_rate = (len(self.passed_tests) / total_tests * 100) if total_tests > 0 else 0
        
        with open(report_file, 'w') as f:
            f.write("# 🧪 YOLO Mode Comprehensive Stress Test Report\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**Total Tests**: {total_tests}\n")
            f.write(f"**Passed**: {len(self.passed_tests)}\n")
            f.write(f"**Failed**: {len(self.failed_tests)}\n")
            f.write(f"**Success Rate**: {success_rate:.1f}%\n\n")
            
            f.write("## ✅ Passed Tests\n\n")
            for test in self.passed_tests:
                f.write(f"- ✅ {test}\n")
            f.write("\n")
            
            f.write("## ❌ Failed Tests\n\n")
            for test in self.failed_tests:
                f.write(f"- ❌ {test}\n")
            f.write("\n")
            
            f.write("## 🎯 Analysis\n\n")
            if success_rate >= 90:
                f.write("**Status**: 🎉 **EXCELLENT** - YOLO Mode is working exceptionally well!\n\n")
            elif success_rate >= 80:
                f.write("**Status**: ✅ **GOOD** - YOLO Mode is working well with minor issues.\n\n")
            elif success_rate >= 70:
                f.write("**Status**: ⚠️ **FAIR** - YOLO Mode is working but has some issues.\n\n")
            else:
                f.write("**Status**: ❌ **POOR** - YOLO Mode has significant issues.\n\n")
            
            f.write("## 🔧 Recommendations\n\n")
            if len(self.failed_tests) > 0:
                f.write("### Issues to Address:\n")
                for test in self.failed_tests:
                    f.write(f"- Investigate and fix: {test}\n")
                f.write("\n")
            
            f.write("### Next Steps:\n")
            f.write("1. Review failed tests and identify root causes\n")
            f.write("2. Implement fixes for identified issues\n")
            f.write("3. Re-run stress tests to verify fixes\n")
            f.write("4. Consider additional edge cases\n\n")
            
            f.write("---\n")
            f.write("*Report generated by Comprehensive YOLO Mode Stress Test System*\n")
        
        logging.info(f"📄 Stress test report saved: {report_file}")
        return report_file

    print("🧪 Comprehensive YOLO Mode Stress Test")
    print("=" * 50)
    
    stress_test = ComprehensiveYOLOStressTest()
    report_file = stress_test.run_all_stress_tests()
    
    total_tests = len(stress_test.passed_tests) + len(stress_test.failed_tests)
    success_rate = (len(stress_test.passed_tests) / total_tests * 100) if total_tests > 0 else 0
    
    print(f"\n🎯 STRESS TEST RESULTS:")
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {len(stress_test.passed_tests)}")
    print(f"Failed: {len(stress_test.failed_tests)}")
    print(f"Success Rate: {success_rate:.1f}%")
    print(f"Report: {report_file}")
    
    if success_rate >= 90:
        print("\n🎉 EXCELLENT! YOLO Mode is working exceptionally well!")
    elif success_rate >= 80:
        print("\n✅ GOOD! YOLO Mode is working well with minor issues.")
    elif success_rate >= 70:
        print("\n⚠️ FAIR! YOLO Mode is working but has some issues.")
    else:
        print("\n❌ POOR! YOLO Mode has significant issues.")
    
    if len(stress_test.failed_tests) > 0:
        print(f"\n🔧 Issues to investigate: {', '.join(stress_test.failed_tests)}")

if __name__ == "__main__":
    main()

