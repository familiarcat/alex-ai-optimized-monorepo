from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Intelligent Script Purge System
===============================
Intelligent purging of unnecessary and bloated scripts while preserving functionality
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

class IntelligentScriptPurge:
        self.purge_plan = {
            "scripts_to_purge": [],
            "scripts_to_keep": [],
            "scripts_to_consolidate": [],
            "bloated_scripts": [],
            "duplicate_scripts": [],
            "obsolete_scripts": [],
            "minimal_scripts": []
        }
        self.safety_checks = {
            "essential_functions": set(),
            "referenced_scripts": set(),
            "api_endpoints": set(),
            "database_operations": set(),
            "critical_workflows": set()
        }
        
    def analyze_scripts_for_purging(self) -> Dict:
        """Analyze all scripts to identify candidates for purging"""
        logger.info("Analyzing scripts for purging...")
        
        # Load existing analysis
        analysis_data = self.load_analysis_data()
        
        # Identify different types of scripts to purge
        self.identify_bloated_scripts()
        self.identify_duplicate_scripts()
        self.identify_obsolete_scripts()
        self.identify_minimal_scripts()
        self.identify_consolidation_candidates()
        
        # Perform safety checks
        self.perform_safety_checks()
        
        # Generate purging recommendations
        self.generate_purging_recommendations()
        
        return self.purge_plan
    
    def load_analysis_data(self) -> Dict:
        """Load existing script analysis data"""
        try:
            with open('script-analysis.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading analysis data: {e}")
            return {}
    
    def identify_bloated_scripts(self):
        """Identify bloated scripts with excessive code"""
        logger.info("Identifying bloated scripts...")
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')):
                    file_path = os.path.join(root, file)
                    
                    # Skip consolidated scripts
                    if file.startswith('consolidated_'):
                        continue
                    
                    # Analyze script for bloat
                    bloat_score = self.calculate_bloat_score(file_path)
                    
                    if bloat_score > 0.7:  # High bloat score
                        self.purge_plan["bloated_scripts"].append({
                            "file": file,
                            "path": file_path,
                            "bloat_score": bloat_score,
                            "reason": "High bloat score - excessive code"
                        })
    
    def calculate_bloat_score(self, file_path: str) -> float:
        """Calculate bloat score for a script"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            lines = content.split('\n')
            total_lines = len(lines)
            
            if total_lines < 50:  # Small scripts are not bloated
                return 0.0
            
            # Calculate bloat indicators
            bloat_indicators = 0
            
            # Empty lines
            empty_lines = sum(1 for line in lines if not line.strip())
            if empty_lines / total_lines > 0.3:  # More than 30% empty lines
                bloat_indicators += 0.3
            
            # Comment lines
            comment_lines = sum(1 for line in lines if line.strip().startswith('#') or line.strip().startswith('//'))
            if comment_lines / total_lines > 0.5:  # More than 50% comments
                bloat_indicators += 0.2
            
            # Repeated code patterns
            repeated_patterns = self.find_repeated_patterns(content)
            if repeated_patterns > 5:  # More than 5 repeated patterns
                bloat_indicators += 0.3
            
            # Long functions
            long_functions = self.find_long_functions(content)
            if long_functions > 3:  # More than 3 long functions
                bloat_indicators += 0.2
            
            # Unused variables/functions
            unused_items = self.find_unused_items(content)
            if unused_items > 10:  # More than 10 unused items
                bloat_indicators += 0.2
            
            return min(bloat_indicators, 1.0)
            
        except Exception as e:
            logger.error(f"Error calculating bloat score for {file_path}: {e}")
            return 0.0
    
    def find_repeated_patterns(self, content: str) -> int:
        """Find repeated code patterns"""
        patterns = []
        
        # Look for repeated function calls
        function_calls = re.findall(r'(\w+\([^)]*\))', content)
        pattern_counts = {}
        for call in function_calls:
            pattern_counts[call] = pattern_counts.get(call, 0) + 1
        
        # Count patterns that appear more than 3 times
        repeated = sum(1 for count in pattern_counts.values() if count > 3)
        return repeated
    
    def find_long_functions(self, content: str) -> int:
        """Find functions with excessive lines"""
        long_functions = 0
        
        # Python functions
        python_functions = re.findall(r'def\s+\w+\([^)]*\):.*?(?=def|\Z)', content, re.DOTALL)
        for func in python_functions:
            lines = func.count('\n')
            if lines > 50:  # More than 50 lines
                long_functions += 1
        
        # Bash functions
        bash_functions = re.findall(r'\w+\s*\(\s*\)\s*\{.*?\}', content, re.DOTALL)
        for func in bash_functions:
            lines = func.count('\n')
            if lines > 30:  # More than 30 lines
                long_functions += 1
        
        return long_functions
    
    def find_unused_items(self, content: str) -> int:
        """Find unused variables and functions"""
        unused_count = 0
        
        # Find variable declarations
        variables = re.findall(r'(\w+)\s*=', content)
        functions = re.findall(r'def\s+(\w+)', content)
        
        # Check if variables are used
        for var in set(variables):
            if var not in ['i', 'j', 'k', 'x', 'y', 'z']:  # Common loop variables
                var_usage = content.count(var) - content.count(f'{var} =')
                if var_usage < 2:  # Used less than 2 times
                    unused_count += 1
        
        # Check if functions are called
        for func in set(functions):
            if func not in ['main', 'init', 'setup']:  # Common function names
                func_usage = content.count(f'{func}(')
                if func_usage < 2:  # Called less than 2 times
                    unused_count += 1
        
        return unused_count
    
    def identify_duplicate_scripts(self):
        """Identify duplicate scripts"""
        logger.info("Identifying duplicate scripts...")
        
        script_hashes = {}
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')) and not file.startswith('consolidated_'):
                    file_path = os.path.join(root, file)
                    
                    # Calculate file hash
                    file_hash = self.calculate_file_hash(file_path)
                    
                    if file_hash in script_hashes:
                        # Duplicate found
                        self.purge_plan["duplicate_scripts"].append({
                            "file": file,
                            "path": file_path,
                            "duplicate_of": script_hashes[file_hash],
                            "reason": "Exact duplicate"
                        })
                    else:
                        script_hashes[file_hash] = file_path
    
    def calculate_file_hash(self, file_path: str) -> str:
        """Calculate hash for file content"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Normalize content (remove whitespace differences)
            normalized = re.sub(r'\s+', ' ', content.strip())
            return str(hash(normalized))
            
        except Exception as e:
            logger.error(f"Error calculating hash for {file_path}: {e}")
            return ""
    
    def identify_obsolete_scripts(self):
        """Identify obsolete scripts"""
        logger.info("Identifying obsolete scripts...")
        
        obsolete_indicators = [
            'old', 'deprecated', 'legacy', 'backup', 'temp', 'test_',
            'debug', 'experimental', 'unused', 'broken', 'fix_'
        ]
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')) and not file.startswith('consolidated_'):
                    file_path = os.path.join(root, file)
                    file_lower = file.lower()
                    
                    # Check for obsolete indicators
                    for indicator in obsolete_indicators:
                        if indicator in file_lower:
                            self.purge_plan["obsolete_scripts"].append({
                                "file": file,
                                "path": file_path,
                                "reason": f"Contains obsolete indicator: {indicator}"
                            })
                            break
    
    def identify_minimal_scripts(self):
        """Identify scripts with minimal functionality"""
        logger.info("Identifying minimal scripts...")
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')) and not file.startswith('consolidated_'):
                    file_path = os.path.join(root, file)
                    
                    # Check if script is minimal
                    if self.is_minimal_script(file_path):
                        self.purge_plan["minimal_scripts"].append({
                            "file": file,
                            "path": file_path,
                            "reason": "Minimal functionality - can be consolidated"
                        })
    
    def is_minimal_script(self, file_path: str) -> bool:
        """Check if script has minimal functionality"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            lines = content.split('\n')
            non_empty_lines = [line for line in lines if line.strip() and not line.strip().startswith('#')]
            
            # Less than 10 non-empty lines
            if len(non_empty_lines) < 10:
                return True
            
            # Only contains echo statements
            if all(line.strip().startswith('echo') for line in non_empty_lines):
                return True
            
            # Only contains print statements
            if all(line.strip().startswith('print') for line in non_empty_lines):
                return True
            
            # Only contains comments
            if all(line.strip().startswith('#') or line.strip().startswith('//') for line in lines if line.strip()):
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking minimal script {file_path}: {e}")
            return False
    
    def identify_consolidation_candidates(self):
        """Identify scripts that can be consolidated"""
        logger.info("Identifying consolidation candidates...")
        
        # Group scripts by similarity
        script_groups = self.group_similar_scripts()
        
        for group in script_groups:
            if len(group) > 2:  # More than 2 similar scripts
                # Keep the most comprehensive one, mark others for consolidation
                group.sort(key=lambda x: os.path.getsize(x), reverse=True)
                keep_script = group[0]
                consolidate_scripts = group[1:]
                
                self.purge_plan["scripts_to_keep"].append(keep_script)
                self.purge_plan["scripts_to_consolidate"].extend(consolidate_scripts)
    
    def group_similar_scripts(self) -> List[List[str]]:
        """Group similar scripts together"""
        script_groups = []
        processed_scripts = set()
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')) and not file.startswith('consolidated_'):
                    file_path = os.path.join(root, file)
                    
                    if file_path in processed_scripts:
                        continue
                    
                    # Find similar scripts
                    similar_scripts = [file_path]
                    processed_scripts.add(file_path)
                    
                    for other_root, other_dirs, other_files in os.walk(self.scripts_dir):
                        for other_file in other_files:
                            if other_file.endswith(('.sh', '.py', '.js')) and not other_file.startswith('consolidated_'):
                                other_path = os.path.join(other_root, other_file)
                                
                                if other_path in processed_scripts:
                                    continue
                                
                                if self.are_scripts_similar(file_path, other_path):
                                    similar_scripts.append(other_path)
                                    processed_scripts.add(other_path)
                    
                    if len(similar_scripts) > 1:
                        script_groups.append(similar_scripts)
        
        return script_groups
    
    def are_scripts_similar(self, script1: str, script2: str) -> bool:
        """Check if two scripts are similar"""
        try:
            with open(script1, 'r', encoding='utf-8', errors='ignore') as f:
                content1 = f.read()
            
            with open(script2, 'r', encoding='utf-8', errors='ignore') as f:
                content2 = f.read()
            
            # Normalize content
            content1_norm = re.sub(r'\s+', ' ', content1.strip().lower())
            content2_norm = re.sub(r'\s+', ' ', content2.strip().lower())
            
            # Calculate similarity
            if len(content1_norm) == 0 or len(content2_norm) == 0:
                return False
            
            # Simple similarity check
            common_words = set(content1_norm.split()) & set(content2_norm.split())
            total_words = set(content1_norm.split()) | set(content2_norm.split())
            
            similarity = len(common_words) / len(total_words) if total_words else 0
            
            return similarity > 0.7  # 70% similarity threshold
            
        except Exception as e:
            logger.error(f"Error checking similarity between {script1} and {script2}: {e}")
            return False
    
    def perform_safety_checks(self):
        """Perform safety checks to ensure essential functionality is preserved"""
        logger.info("Performing safety checks...")
        
        # Find essential functions
        self.find_essential_functions()
        
        # Find referenced scripts
        self.find_referenced_scripts()
        
        # Find API endpoints
        self.find_api_endpoints()
        
        # Find database operations
        self.find_database_operations()
        
        # Find critical workflows
        self.find_critical_workflows()
    
    def find_essential_functions(self):
        """Find essential functions that must be preserved"""
        essential_patterns = [
            r'main\s*\(', r'init\s*\(', r'setup\s*\(',
            r'deploy\w*', r'install\w*', r'configure\w*',
            r'start\w*', r'stop\w*', r'restart\w*'
        ]
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')):
                    file_path = os.path.join(root, file)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        for pattern in essential_patterns:
                            if re.search(pattern, content, re.IGNORECASE):
                                self.safety_checks["essential_functions"].add(file_path)
                                break
                    except Exception as e:
                        logger.error(f"Error checking essential functions in {file_path}: {e}")
    
    def find_referenced_scripts(self):
        """Find scripts that are referenced by other scripts"""
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')):
                    file_path = os.path.join(root, file)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        # Look for script references
                        script_refs = re.findall(r'\./([a-zA-Z0-9_-]+\.(?:sh|py|js))', content)
                        for ref in script_refs:
                            ref_path = os.path.join(self.scripts_dir, ref)
                            if os.path.exists(ref_path):
                                self.safety_checks["referenced_scripts"].add(ref_path)
                    except Exception as e:
                        logger.error(f"Error checking references in {file_path}: {e}")
    
    def find_api_endpoints(self):
        """Find scripts that contain API endpoints"""
        api_patterns = [
            r'curl\s+', r'http[s]?://', r'api/v1/', r'endpoint',
            r'requests\.', r'fetch\s*\(', r'axios\.'
        ]
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')):
                    file_path = os.path.join(root, file)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        for pattern in api_patterns:
                            if re.search(pattern, content, re.IGNORECASE):
                                self.safety_checks["api_endpoints"].add(file_path)
                                break
                    except Exception as e:
                        logger.error(f"Error checking API endpoints in {file_path}: {e}")
    
    def find_database_operations(self):
        """Find scripts that contain database operations"""
        db_patterns = [
            r'supabase', r'postgres', r'mysql', r'sqlite',
            r'CREATE\s+TABLE', r'INSERT\s+INTO', r'SELECT\s+',
            r'UPDATE\s+', r'DELETE\s+FROM'
        ]
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')):
                    file_path = os.path.join(root, file)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        for pattern in db_patterns:
                            if re.search(pattern, content, re.IGNORECASE):
                                self.safety_checks["database_operations"].add(file_path)
                                break
                    except Exception as e:
                        logger.error(f"Error checking database operations in {file_path}: {e}")
    
    def find_critical_workflows(self):
        """Find scripts that are part of critical workflows"""
        critical_patterns = [
            r'n8n', r'workflow', r'pipeline', r'ci/cd',
            r'deployment', r'production', r'milestone'
        ]
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')):
                    file_path = os.path.join(root, file)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        for pattern in critical_patterns:
                            if re.search(pattern, content, re.IGNORECASE):
                                self.safety_checks["critical_workflows"].add(file_path)
                                break
                    except Exception as e:
                        logger.error(f"Error checking critical workflows in {file_path}: {e}")
    
    def generate_purging_recommendations(self):
        """Generate final purging recommendations"""
        logger.info("Generating purging recommendations...")
        
        # Combine all scripts to purge
        all_purge_candidates = []
        
        # Add bloated scripts
        all_purge_candidates.extend(self.purge_plan["bloated_scripts"])
        
        # Add duplicate scripts
        all_purge_candidates.extend(self.purge_plan["duplicate_scripts"])
        
        # Add obsolete scripts
        all_purge_candidates.extend(self.purge_plan["obsolete_scripts"])
        
        # Add minimal scripts
        all_purge_candidates.extend(self.purge_plan["minimal_scripts"])
        
        # Filter out scripts that are essential
        safe_to_purge = []
        for script in all_purge_candidates:
            script_path = script["path"]
            
            # Check if script is essential
            if script_path in self.safety_checks["essential_functions"]:
                continue
            if script_path in self.safety_checks["referenced_scripts"]:
                continue
            if script_path in self.safety_checks["api_endpoints"]:
                continue
            if script_path in self.safety_checks["database_operations"]:
                continue
            if script_path in self.safety_checks["critical_workflows"]:
                continue
            
            safe_to_purge.append(script)
        
        self.purge_plan["scripts_to_purge"] = safe_to_purge
    
    def execute_purge(self) -> bool:
        """Execute the purging plan"""
        try:
            logger.info("Executing script purge...")
            
            # Create backup
            self.create_backup()
            
            # Purge scripts
            purged_count = 0
            for script in self.purge_plan["scripts_to_purge"]:
                script_path = script["path"]
                
                if os.path.exists(script_path):
                    os.remove(script_path)
                    purged_count += 1
                    logger.info(f"Purged: {script_path}")
            
            logger.info(f"Purged {purged_count} scripts")
            return True
            
        except Exception as e:
            logger.error(f"Error executing purge: {e}")
            return False
    
        backup_dir = f"scripts_purge_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        shutil.copytree(self.scripts_dir, backup_dir)
        logger.info(f"Created backup: {backup_dir}")
    
    def generate_purge_report(self) -> str:
        """Generate purging report"""
        report = []
        report.append("# Script Purge Report")
        report.append("=" * 30)
        report.append("")
        
        # Summary
        total_purge = len(self.purge_plan["scripts_to_purge"])
        total_keep = len(self.purge_plan["scripts_to_keep"])
        total_consolidate = len(self.purge_plan["scripts_to_consolidate"])
        
        report.append(f"## Summary")
        report.append(f"- Scripts to Purge: {total_purge}")
        report.append(f"- Scripts to Keep: {total_keep}")
        report.append(f"- Scripts to Consolidate: {total_consolidate}")
        report.append("")
        
        # Scripts to purge
        if total_purge > 0:
            report.append("## Scripts to Purge")
            for script in self.purge_plan["scripts_to_purge"]:
                report.append(f"- {script['file']}: {script['reason']}")
            report.append("")
        
        # Safety checks
        report.append("## Safety Checks")
        report.append(f"- Essential Functions: {len(self.safety_checks['essential_functions'])}")
        report.append(f"- Referenced Scripts: {len(self.safety_checks['referenced_scripts'])}")
        report.append(f"- API Endpoints: {len(self.safety_checks['api_endpoints'])}")
        report.append(f"- Database Operations: {len(self.safety_checks['database_operations'])}")
        report.append(f"- Critical Workflows: {len(self.safety_checks['critical_workflows'])}")
        report.append("")
        
        return "\n".join(report)

    print("🧹 Intelligent Script Purge System")
    print("=" * 40)
    
    purger = IntelligentScriptPurge()
    
    # Analyze scripts
    purge_plan = purger.analyze_scripts_for_purging()
    
    # Print summary
    total_purge = len(purge_plan["scripts_to_purge"])
    total_keep = len(purge_plan["scripts_to_keep"])
    total_consolidate = len(purge_plan["scripts_to_consolidate"])
    
    print(f"\n📊 Purge Analysis Summary:")
    print(f"  Scripts to Purge: {total_purge}")
    print(f"  Scripts to Keep: {total_keep}")
    print(f"  Scripts to Consolidate: {total_consolidate}")
    
    print(f"\n🔍 Safety Checks:")
    print(f"  Essential Functions: {len(purger.safety_checks['essential_functions'])}")
    print(f"  Referenced Scripts: {len(purger.safety_checks['referenced_scripts'])}")
    print(f"  API Endpoints: {len(purger.safety_checks['api_endpoints'])}")
    print(f"  Database Operations: {len(purger.safety_checks['database_operations'])}")
    print(f"  Critical Workflows: {len(purger.safety_checks['critical_workflows'])}")
    
    if total_purge > 0:
        print(f"\n🗑️  Scripts to Purge:")
        for script in purge_plan["scripts_to_purge"][:10]:  # Show first 10
            print(f"  - {script['file']}: {script['reason']}")
        
        if total_purge > 10:
            print(f"  ... and {total_purge - 10} more")
    
    # Save purge plan
    with open('script-purge-plan.json', 'w') as f:
        json.dump(purge_plan, f, indent=2)
    
    print(f"\n✅ Purge plan saved to script-purge-plan.json")
    
    # Ask for confirmation
    if total_purge > 0:
        response = input(f"\n🤔 Purge {total_purge} scripts? (y/N): ")
        if response.lower() == 'y':
            if purger.execute_purge():
                print("🎉 Script purge completed successfully!")
            else:
                print("❌ Script purge failed")
        else:
            print("❌ Script purge cancelled")
    else:
        print("\n✅ No scripts need purging - all scripts are essential!")

if __name__ == "__main__":
    main()








