from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Validate Consolidated Structure
==============================
Validate the consolidated script structure and test functionality
"""

import os
import json
import subprocess
from typing import Dict, List, Tuple
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class StructureValidator:
        self.validation_results = {
            "structure_valid": True,
            "consolidated_scripts": [],
            "remaining_scripts": [],
            "broken_references": [],
            "test_results": {},
            "recommendations": []
        }
    
    def validate_structure(self) -> Dict:
        """Validate the consolidated script structure"""
        logger.info("Validating consolidated structure...")
        
        # Validate directory structure
        self.validate_directory_structure()
        
        # Validate consolidated scripts
        self.validate_consolidated_scripts()
        
        # Validate remaining scripts
        self.validate_remaining_scripts()
        
        # Check for broken references
        self.check_broken_references()
        
        # Test functionality
        self.test_functionality()
        
        # Generate recommendations
        self.generate_recommendations()
        
        return self.validation_results
    
    def validate_directory_structure(self):
        """Validate the new directory structure"""
        expected_categories = [
            "deployment", "testing", "ai_ml", "data_management", 
            "workflow", "utilities"
        ]
        
        for category in expected_categories:
            category_path = os.path.join(self.scripts_dir, category)
            if not os.path.exists(category_path):
                logger.error(f"Missing category directory: {category}")
                self.validation_results["structure_valid"] = False
            else:
                logger.info(f"✅ Category directory exists: {category}")
    
    def validate_consolidated_scripts(self):
        """Validate consolidated scripts"""
        consolidated_scripts = []
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.startswith('consolidated_'):
                    script_path = os.path.join(root, file)
                    consolidated_scripts.append(script_path)
                    
                    # Check if script is executable
                    if file.endswith('.sh') and not os.access(script_path, os.X_OK):
                        logger.warning(f"Consolidated script not executable: {script_path}")
                    
                    # Check if script has proper structure
                    if not self.check_script_structure(script_path):
                        logger.warning(f"Consolidated script has issues: {script_path}")
        
        self.validation_results["consolidated_scripts"] = consolidated_scripts
        logger.info(f"Found {len(consolidated_scripts)} consolidated scripts")
    
    def validate_remaining_scripts(self):
        """Validate remaining scripts"""
        remaining_scripts = []
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if (file.endswith(('.sh', '.py', '.js')) and 
                    not file.startswith('consolidated_') and
                    not file.startswith('.')):
                    script_path = os.path.join(root, file)
                    remaining_scripts.append(script_path)
        
        self.validation_results["remaining_scripts"] = remaining_scripts
        logger.info(f"Found {len(remaining_scripts)} remaining scripts")
    
    def check_script_structure(self, script_path: str) -> bool:
        """Check if script has proper structure"""
        try:
            with open(script_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Check for basic structure elements
            if script_path.endswith('.py'):
                return ('#!/bin/bash' in content or 'main()' in content)
            elif script_path.endswith('.js'):
            return True
            
        except Exception as e:
            logger.error(f"Error checking script structure {script_path}: {e}")
            return False
    
    def check_broken_references(self):
        """Check for broken script references"""
        broken_references = []
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')):
                    file_path = os.path.join(root, file)
                    broken_refs = self.find_broken_references(file_path)
                    if broken_refs:
                        broken_references.extend(broken_refs)
        
        self.validation_results["broken_references"] = broken_references
        if broken_references:
            logger.warning(f"Found {len(broken_references)} broken references")
        else:
            logger.info("✅ No broken references found")
    
    def find_broken_references(self, file_path: str) -> List[str]:
        """Find broken references in a file"""
        broken_refs = []
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Look for script references
            import re
            patterns = [
                r'\./scripts/([a-zA-Z0-9_-]+\.(?:sh|py|js))',
                r'scripts/([a-zA-Z0-9_-]+\.(?:sh|py|js))',
                r'python3 scripts/([a-zA-Z0-9_-]+\.py)',
                r'bash scripts/([a-zA-Z0-9_-]+\.sh)',
                r'node scripts/([a-zA-Z0-9_-]+\.js)'
            ]
            
            for pattern in patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    ref_path = f"scripts/{match}"
                    if not os.path.exists(ref_path):
                        broken_refs.append(f"{file_path}: {ref_path}")
            
        except Exception as e:
            logger.error(f"Error checking references in {file_path}: {e}")
        
        return broken_refs
    
    def test_functionality(self):
        """Test functionality of key scripts"""
        test_results = {}
        
        # Test script analyzer
        test_results["script_analyzer"] = self.test_script_analyzer()
        
        # Test intelligent discovery
        test_results["intelligent_discovery"] = self.test_intelligent_discovery()
        
        # Test consolidated scripts
        test_results["consolidated_scripts"] = self.test_consolidated_scripts()
        
        self.validation_results["test_results"] = test_results
    
    def test_script_analyzer(self) -> bool:
        """Test script analyzer functionality"""
        try:
            result = subprocess.run(
                ["python3", "scripts/script-analyzer.py"],
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.returncode == 0
        except Exception as e:
            logger.error(f"Error testing script analyzer: {e}")
            return False
    
    def test_intelligent_discovery(self) -> bool:
        """Test intelligent discovery functionality"""
        try:
            result = subprocess.run([
                "python3", "scripts/intelligent-script-discovery.py",
                "test discovery", "--category", "testing"
            ], capture_output=True, text=True, timeout=10)
            return result.returncode == 0
        except Exception as e:
            logger.error(f"Error testing intelligent discovery: {e}")
            return False
    
    def test_consolidated_scripts(self) -> Dict:
        """Test consolidated scripts"""
        test_results = {}
        
        for script_path in self.validation_results["consolidated_scripts"][:5]:  # Test first 5
            try:
                if script_path.endswith('.py'):
                    result = subprocess.run(
                        ["python3", script_path, "--help"],
                        capture_output=True,
                        text=True,
                        timeout=5
                    )
                elif script_path.endswith('.sh'):
                    result = subprocess.run(
                        ["bash", script_path, "--help"],
                        capture_output=True,
                        text=True,
                        timeout=5
                    )
                else:
                    continue
                
                test_results[script_path] = result.returncode == 0
                
            except Exception as e:
                logger.error(f"Error testing {script_path}: {e}")
                test_results[script_path] = False
        
        return test_results
    
    def generate_recommendations(self):
        """Generate recommendations for improvement"""
        recommendations = []
        
        # Check for too many remaining scripts
        remaining_count = len(self.validation_results["remaining_scripts"])
        if remaining_count > 100:
            recommendations.append(
                f"Consider further consolidation: {remaining_count} remaining scripts"
            )
        
        # Check for broken references
        broken_count = len(self.validation_results["broken_references"])
        if broken_count > 0:
            recommendations.append(
                f"Fix {broken_count} broken references"
            )
        
        # Check for non-executable scripts
        non_executable = 0
        for script_path in self.validation_results["remaining_scripts"]:
            if script_path.endswith('.sh') and not os.access(script_path, os.X_OK):
                non_executable += 1
        
        if non_executable > 0:
            recommendations.append(
                f"Make {non_executable} shell scripts executable"
            )
        
        # Check for test failures
        test_failures = sum(1 for result in self.validation_results["test_results"].values() 
                          if isinstance(result, bool) and not result)
        if test_failures > 0:
            recommendations.append(
                f"Fix {test_failures} test failures"
            )
        
        self.validation_results["recommendations"] = recommendations
    
    def generate_validation_report(self) -> str:
        """Generate validation report"""
        report = []
        report.append("# Script Consolidation Validation Report")
        report.append("=" * 50)
        report.append("")
        
        # Structure validation
        report.append("## Structure Validation")
        report.append(f"✅ Structure Valid: {self.validation_results['structure_valid']}")
        report.append(f"📁 Consolidated Scripts: {len(self.validation_results['consolidated_scripts'])}")
        report.append(f"📁 Remaining Scripts: {len(self.validation_results['remaining_scripts'])}")
        report.append("")
        
        # Test results
        report.append("## Test Results")
        for test_name, result in self.validation_results["test_results"].items():
            status = "✅ PASS" if result else "❌ FAIL"
            report.append(f"- {test_name}: {status}")
        report.append("")
        
        # Broken references
        if self.validation_results["broken_references"]:
            report.append("## Broken References")
            for ref in self.validation_results["broken_references"][:10]:
                report.append(f"- {ref}")
            report.append("")
        
        # Recommendations
        if self.validation_results["recommendations"]:
            report.append("## Recommendations")
            for rec in self.validation_results["recommendations"]:
                report.append(f"- {rec}")
            report.append("")
        
        return "\n".join(report)

    print("🔍 Validating Consolidated Structure")
    print("=" * 45)
    
    validator = StructureValidator()
    results = validator.validate_structure()
    
    # Print summary
    print(f"\n📊 Validation Summary:")
    print(f"  Structure Valid: {results['structure_valid']}")
    print(f"  Consolidated Scripts: {len(results['consolidated_scripts'])}")
    print(f"  Remaining Scripts: {len(results['remaining_scripts'])}")
    print(f"  Broken References: {len(results['broken_references'])}")
    
    # Print test results
    print(f"\n🧪 Test Results:")
    for test_name, result in results["test_results"].items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name}: {status}")
    
    # Print recommendations
    if results["recommendations"]:
        print(f"\n💡 Recommendations:")
        for rec in results["recommendations"]:
            print(f"  - {rec}")
    
    # Generate and save report
    report = validator.generate_validation_report()
    with open('script-consolidation-validation-report.md', 'w') as f:
        f.write(report)
    
    print(f"\n📋 Validation report saved to: script-consolidation-validation-report.md")
    
    if results["structure_valid"] and len(results["broken_references"]) == 0:
        print("\n🎉 Consolidation validation successful!")
    else:
        print("\n⚠️  Consolidation validation completed with issues")

if __name__ == "__main__":
    main()














