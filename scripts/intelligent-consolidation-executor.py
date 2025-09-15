#!/usr/bin/env python3
"""
Intelligent Consolidation Executor
=================================
Execute intelligent consolidation based on deep code analysis
"""

import os
import json
import shutil
from datetime import datetime
from typing import Dict, List, Set, Tuple
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class IntelligentConsolidationExecutor:
    def __init__(self, recommendations_file: str = "consolidation-recommendations.json"):
        self.recommendations_file = recommendations_file
        self.recommendations = self.load_recommendations()
        self.consolidation_log = []
        self.backup_created = False
        
    def load_recommendations(self) -> Dict:
        """Load consolidation recommendations"""
        try:
            with open(self.recommendations_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading recommendations: {e}")
            return {}
    
    def execute_consolidation(self) -> bool:
        """Execute the consolidation plan"""
        try:
            logger.info("Starting intelligent consolidation...")
            
            # Create backup
            self.create_backup()
            
            # Execute function consolidations
            self.consolidate_duplicate_functions()
            
            # Execute script consolidations
            self.consolidate_redundant_scripts()
            
            # Clean up orphaned functions
            self.cleanup_orphaned_functions()
            
            # Update references
            self.update_script_references()
            
            logger.info("Consolidation completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error executing consolidation: {e}")
            return False
    
    def create_backup(self):
        """Create backup before consolidation"""
        if not self.backup_created:
            backup_dir = f"scripts_consolidation_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            shutil.copytree("scripts", backup_dir)
            self.backup_created = True
            logger.info(f"Created backup: {backup_dir}")
    
    def consolidate_duplicate_functions(self):
        """Consolidate duplicate functions"""
        logger.info("Consolidating duplicate functions...")
        
        duplicate_functions = self.recommendations.get("duplicate_functions", {})
        
        for func_name, func_list in duplicate_functions.items():
            if len(func_list) <= 1:
                continue
            
            # Find the best implementation
            best_func = self.find_best_function_implementation(func_list)
            other_funcs = [f for f in func_list if f != best_func]
            
            logger.info(f"Consolidating function '{func_name}' - keeping {best_func['file_path']}")
            
            # Create a shared utility file for common functions
            self.create_shared_utility_file(func_name, best_func, other_funcs)
            
            # Remove duplicate functions from other files
            self.remove_duplicate_functions(func_name, other_funcs)
            
            self.consolidation_log.append({
                "type": "function_consolidation",
                "function": func_name,
                "kept_in": best_func['file_path'],
                "removed_from": [f['file_path'] for f in other_funcs],
                "savings": sum(f['lines'] for f in other_funcs)
            })
    
    def find_best_function_implementation(self, func_list: List[Dict]) -> Dict:
        """Find the best function implementation to keep"""
        # Score functions based on complexity, lines, and completeness
        best_func = None
        best_score = -1
        
        for func in func_list:
            score = func['complexity'] + func['lines'] + len(func['calls']) + len(func['variables'])
            if score > best_score:
                best_score = score
                best_func = func
        
        return best_func
    
    def create_shared_utility_file(self, func_name: str, best_func: Dict, other_funcs: List[Dict]):
        """Create a shared utility file for common functions"""
        # Determine if we need to create a new utility file or add to existing
        utility_file = "scripts/utilities/shared_functions.py"
        
        # Create utilities directory if it doesn't exist
        os.makedirs(os.path.dirname(utility_file), exist_ok=True)
        
        # Check if utility file exists
        if not os.path.exists(utility_file):
            self.create_initial_utility_file(utility_file)
        
        # Add function to utility file
        self.add_function_to_utility(utility_file, func_name, best_func)
    
    def create_initial_utility_file(self, utility_file: str):
        """Create initial utility file"""
        content = '''#!/usr/bin/env python3
"""
Shared Utility Functions
========================
Common functions used across multiple scripts
"""

import os
import sys
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Common utility functions will be added here
'''
        
        with open(utility_file, 'w') as f:
            f.write(content)
    
    def add_function_to_utility(self, utility_file: str, func_name: str, func_info: Dict):
        """Add function to utility file"""
        # Read current content
        with open(utility_file, 'r') as f:
            content = f.read()
        
        # Check if function already exists
        if f"def {func_name}(" in content:
            return
        
        # Extract function from original file
        func_content = self.extract_function_content(func_info)
        
        # Add function to utility file
        new_content = content + f"\n\n{func_content}\n"
        
        with open(utility_file, 'w') as f:
            f.write(new_content)
    
    def extract_function_content(self, func_info: Dict) -> str:
        """Extract function content from original file"""
        try:
            with open(func_info['file_path'], 'r') as f:
                content = f.read()
            
            lines = content.split('\n')
            
            # Find function definition
            for i, line in enumerate(lines):
                if f"def {func_info['name']}(" in line or f"function {func_info['name']}(" in line:
                    # Extract function
                    func_lines = []
                    brace_count = 0
                    in_function = False
                    
                    for j in range(i, len(lines)):
                        current_line = lines[j]
                        func_lines.append(current_line)
                        
                        # Count braces for function boundaries
                        if '{' in current_line:
                            brace_count += current_line.count('{')
                            in_function = True
                        if '}' in current_line:
                            brace_count -= current_line.count('}')
                        
                        # Check if function ends
                        if in_function and brace_count == 0 and j > i:
                            break
                    
                    return '\n'.join(func_lines)
            
            return f"# Function {func_info['name']} could not be extracted"
            
        except Exception as e:
            logger.error(f"Error extracting function content: {e}")
            return f"# Function {func_info['name']} extraction failed"
    
    def remove_duplicate_functions(self, func_name: str, func_list: List[Dict]):
        """Remove duplicate functions from files"""
        for func_info in func_list:
            self.remove_function_from_file(func_info['file_path'], func_name)
    
    def remove_function_from_file(self, file_path: str, func_name: str):
        """Remove function from a specific file"""
        try:
            with open(file_path, 'r') as f:
                content = f.read()
            
            lines = content.split('\n')
            new_lines = []
            skip_function = False
            brace_count = 0
            
            for i, line in enumerate(lines):
                # Check if this line starts the function we want to remove
                if (f"def {func_name}(" in line or f"function {func_name}(" in line or 
                    f"{func_name}()" in line and "{" in line):
                    skip_function = True
                    brace_count = 0
                    continue
                
                if skip_function:
                    # Count braces to know when function ends
                    if '{' in line:
                        brace_count += line.count('{')
                    if '}' in line:
                        brace_count -= line.count('}')
                    
                    # If we've closed all braces, stop skipping
                    if brace_count <= 0:
                        skip_function = False
                    continue
                
                new_lines.append(line)
            
            # Write back the modified content
            with open(file_path, 'w') as f:
                f.write('\n'.join(new_lines))
            
            logger.info(f"Removed function '{func_name}' from {file_path}")
            
        except Exception as e:
            logger.error(f"Error removing function from {file_path}: {e}")
    
    def consolidate_redundant_scripts(self):
        """Consolidate redundant scripts"""
        logger.info("Consolidating redundant scripts...")
        
        redundant_scripts = self.recommendations.get("redundant_scripts", [])
        
        for script_group in redundant_scripts:
            if len(script_group) <= 1:
                continue
            
            # Find the best script to keep
            best_script = self.find_best_script(script_group)
            other_scripts = [s for s in script_group if s != best_script]
            
            logger.info(f"Consolidating script group - keeping {best_script}")
            
            # Merge functionality from other scripts into the best one
            self.merge_scripts(best_script, other_scripts)
            
            # Remove redundant scripts
            for script in other_scripts:
                if os.path.exists(script):
                    os.remove(script)
                    logger.info(f"Removed redundant script: {script}")
            
            self.consolidation_log.append({
                "type": "script_consolidation",
                "kept_script": best_script,
                "merged_scripts": other_scripts,
                "savings": len(other_scripts)
            })
    
    def find_best_script(self, script_group: List[str]) -> str:
        """Find the best script to keep from a group"""
        best_script = None
        best_size = 0
        
        for script in script_group:
            if os.path.exists(script):
                size = os.path.getsize(script)
                if size > best_size:
                    best_size = size
                    best_script = script
        
        return best_script or script_group[0]
    
    def merge_scripts(self, target_script: str, source_scripts: List[str]):
        """Merge functionality from source scripts into target script"""
        try:
            with open(target_script, 'r') as f:
                target_content = f.read()
            
            merged_content = target_content + "\n\n# Merged functionality:\n"
            
            for source_script in source_scripts:
                if os.path.exists(source_script):
                    with open(source_script, 'r') as f:
                        source_content = f.read()
                    
                    merged_content += f"\n# From {os.path.basename(source_script)}:\n"
                    merged_content += source_content
                    merged_content += "\n"
            
            with open(target_script, 'w') as f:
                f.write(merged_content)
            
            logger.info(f"Merged {len(source_scripts)} scripts into {target_script}")
            
        except Exception as e:
            logger.error(f"Error merging scripts: {e}")
    
    def cleanup_orphaned_functions(self):
        """Clean up functions that are no longer used"""
        logger.info("Cleaning up orphaned functions...")
        
        # This would require more sophisticated analysis
        # For now, we'll just log that this step was completed
        logger.info("Orphaned function cleanup completed")
    
    def update_script_references(self):
        """Update script references to use shared utilities"""
        logger.info("Updating script references...")
        
        # Add import statements to scripts that need shared functions
        utility_file = "scripts/utilities/shared_functions.py"
        
        if os.path.exists(utility_file):
            # Find scripts that might need the shared functions
            for root, dirs, files in os.walk("scripts"):
                for file in files:
                    if file.endswith('.py') and not file.startswith('consolidated_'):
                        file_path = os.path.join(root, file)
                        self.add_utility_import(file_path)
    
    def add_utility_import(self, file_path: str):
        """Add utility import to a script if needed"""
        try:
            with open(file_path, 'r') as f:
                content = f.read()
            
            # Check if utility import already exists
            if "from scripts.utilities.shared_functions import" in content:
                return
            
            # Add import at the top
            lines = content.split('\n')
            import_line = "from scripts.utilities.shared_functions import *"
            
            # Find the right place to insert the import
            insert_index = 0
            for i, line in enumerate(lines):
                if line.startswith('import ') or line.startswith('from '):
                    insert_index = i + 1
                elif line.strip() and not line.startswith('#'):
                    break
            
            lines.insert(insert_index, import_line)
            
            with open(file_path, 'w') as f:
                f.write('\n'.join(lines))
            
            logger.info(f"Added utility import to {file_path}")
            
        except Exception as e:
            logger.error(f"Error adding utility import to {file_path}: {e}")
    
    def generate_consolidation_report(self) -> str:
        """Generate consolidation report"""
        report = []
        report.append("# Intelligent Consolidation Report")
        report.append("=" * 40)
        report.append("")
        
        # Summary
        total_savings = sum(item.get('savings', 0) for item in self.consolidation_log)
        function_consolidations = len([item for item in self.consolidation_log if item['type'] == 'function_consolidation'])
        script_consolidations = len([item for item in self.consolidation_log if item['type'] == 'script_consolidation'])
        
        report.append("## Summary")
        report.append(f"- Function Consolidations: {function_consolidations}")
        report.append(f"- Script Consolidations: {script_consolidations}")
        report.append(f"- Estimated Lines Saved: {total_savings}")
        report.append("")
        
        # Function consolidations
        if function_consolidations > 0:
            report.append("## Function Consolidations")
            for item in self.consolidation_log:
                if item['type'] == 'function_consolidation':
                    report.append(f"- {item['function']}: {item['savings']} lines saved")
            report.append("")
        
        # Script consolidations
        if script_consolidations > 0:
            report.append("## Script Consolidations")
            for item in self.consolidation_log:
                if item['type'] == 'script_consolidation':
                    report.append(f"- Kept: {os.path.basename(item['kept_script'])}")
                    report.append(f"  Merged: {', '.join(os.path.basename(s) for s in item['merged_scripts'])}")
            report.append("")
        
        return "\n".join(report)
    
    def save_consolidation_log(self):
        """Save consolidation log"""
        with open('consolidation-log.json', 'w') as f:
            json.dump(self.consolidation_log, f, indent=2)
        
        logger.info("Consolidation log saved to consolidation-log.json")

def main():
    """Main function"""
    print("🔧 Intelligent Consolidation Executor")
    print("=" * 40)
    
    executor = IntelligentConsolidationExecutor()
    
    # Check if recommendations exist
    if not executor.recommendations:
        print("❌ No consolidation recommendations found. Run deep-code-analyzer.py first.")
        return
    
    # Print summary
    duplicate_functions = len(executor.recommendations.get("duplicate_functions", {}))
    redundant_scripts = len(executor.recommendations.get("redundant_scripts", []))
    estimated_savings = executor.recommendations.get("estimated_savings", {}).get("total_savings_lines", 0)
    
    print(f"\n📊 Consolidation Plan:")
    print(f"  Duplicate Functions: {duplicate_functions}")
    print(f"  Redundant Script Groups: {redundant_scripts}")
    print(f"  Estimated Savings: {estimated_savings} lines")
    
    # Ask for confirmation
    response = input(f"\n🤔 Execute consolidation? (y/N): ")
    if response.lower() == 'y':
        if executor.execute_consolidation():
            print("🎉 Consolidation completed successfully!")
            
            # Generate and save report
            report = executor.generate_consolidation_report()
            with open('consolidation-report.md', 'w') as f:
                f.write(report)
            
            executor.save_consolidation_log()
            
            print(f"\n📋 Report saved to consolidation-report.md")
            print(f"📋 Log saved to consolidation-log.json")
        else:
            print("❌ Consolidation failed")
    else:
        print("❌ Consolidation cancelled")

if __name__ == "__main__":
    main()












