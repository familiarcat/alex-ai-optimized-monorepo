#!/usr/bin/env python3
"""
Folder Restructuring Executor
============================
Execute folder restructuring based on analysis findings
"""

import os
import json
import shutil
from datetime import datetime
from typing import Dict, List, Set, Tuple
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FolderRestructuringExecutor:
    def __init__(self, scripts_dir: str = "scripts"):
        self.scripts_dir = scripts_dir
        self.deprecated_scripts = []
        self.consolidation_opportunities = []
        self.optimization_recommendations = {}
        self.restructuring_log = []
        
    def discover_issues(self) -> Dict:
        """Discover restructuring opportunities"""
        logger.info("🔍 Discovering restructuring opportunities...")
        
        # Find deprecated scripts
        self.find_deprecated_scripts()
        
        # Find consolidation opportunities
        self.find_consolidation_opportunities()
        
        # Find optimization opportunities
        self.find_optimization_opportunities()
        
        return {
            "deprecated_scripts": len(self.deprecated_scripts),
            "consolidation_opportunities": len(self.consolidation_opportunities),
            "optimization_recommendations": len(self.optimization_recommendations)
        }
    
    def find_deprecated_scripts(self):
        """Find deprecated scripts"""
        deprecation_indicators = [
            'old', 'deprecated', 'legacy', 'backup', 'temp',
            'test_', 'debug', 'experimental', 'unused', 'broken'
        ]
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.py', '.sh', '.js', '.html', '.json')):
                    file_path = os.path.join(root, file)
                    file_lower = file.lower()
                    
                    for indicator in deprecation_indicators:
                        if indicator in file_lower:
                            self.deprecated_scripts.append({
                                "file_path": file_path,
                                "file_name": file,
                                "folder": os.path.relpath(root, self.scripts_dir),
                                "deprecation_reason": f"Contains '{indicator}' indicator",
                                "recommended_action": "Remove or archive"
                            })
                            break
    
    def find_consolidation_opportunities(self):
        """Find consolidation opportunities"""
        # Group scripts by similarity
        script_groups = self.group_similar_scripts()
        
        for group in script_groups:
            if len(group) > 1:
                self.consolidation_opportunities.append({
                    "scripts": group,
                    "reason": "Similar functionality detected",
                    "recommended_action": "Consolidate into single script"
                })
    
    def group_similar_scripts(self) -> List[List[str]]:
        """Group similar scripts together"""
        all_scripts = []
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.py', '.sh', '.js')):
                    all_scripts.append(os.path.join(root, file))
        
        groups = []
        processed = set()
        
        for script1 in all_scripts:
            if script1 in processed:
                continue
            
            group = [script1]
            processed.add(script1)
            
            for script2 in all_scripts:
                if script2 in processed:
                    continue
                
                if self.are_scripts_similar(script1, script2):
                    group.append(script2)
                    processed.add(script2)
            
            if len(group) > 1:
                groups.append(group)
        
        return groups
    
    def are_scripts_similar(self, script1: str, script2: str) -> bool:
        """Check if two scripts are similar"""
        try:
            name1 = os.path.basename(script1).lower()
            name2 = os.path.basename(script2).lower()
            
            # Check filename similarity
            similarity = self.calculate_name_similarity(name1, name2)
            
            # Check if they're in the same folder
            folder1 = os.path.dirname(script1)
            folder2 = os.path.dirname(script2)
            same_folder = folder1 == folder2
            
            # High similarity threshold for same folder, lower for different folders
            threshold = 0.8 if same_folder else 0.9
            
            return similarity > threshold
            
        except Exception as e:
            logger.error(f"Error comparing scripts {script1} and {script2}: {e}")
            return False
    
    def calculate_name_similarity(self, name1: str, name2: str) -> float:
        """Calculate filename similarity"""
        words1 = set(name1.replace('_', ' ').replace('-', ' ').split())
        words2 = set(name2.replace('_', ' ').replace('-', ' ').split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        return intersection / union if union > 0 else 0.0
    
    def find_optimization_opportunities(self):
        """Find optimization opportunities"""
        folder_stats = {}
        
        for root, dirs, files in os.walk(self.scripts_dir):
            folder_path = os.path.relpath(root, self.scripts_dir)
            script_files = [f for f in files if f.endswith(('.py', '.sh', '.js', '.html', '.json'))]
            
            if script_files:
                folder_stats[folder_path] = {
                    "script_count": len(script_files),
                    "folder_name": os.path.basename(root)
                }
        
        # Find oversized folders
        for folder_path, stats in folder_stats.items():
            if stats["script_count"] > 15:
                self.optimization_recommendations[folder_path] = {
                    "issue": "Oversized folder",
                    "script_count": stats["script_count"],
                    "recommendation": "Split into subfolders"
                }
        
        # Find underutilized folders
        for folder_path, stats in folder_stats.items():
            if stats["script_count"] < 3 and folder_path != '.':
                self.optimization_recommendations[folder_path] = {
                    "issue": "Underutilized folder",
                    "script_count": stats["script_count"],
                    "recommendation": "Consider merging with parent folder"
                }
    
    def execute_restructuring(self) -> bool:
        """Execute the restructuring plan"""
        try:
            logger.info("🚀 Executing folder restructuring...")
            
            # Create backup
            self.create_backup()
            
            # Phase 1: Remove deprecated scripts
            self.remove_deprecated_scripts()
            
            # Phase 2: Consolidate similar scripts
            self.consolidate_similar_scripts()
            
            # Phase 3: Optimize folder structure
            self.optimize_folder_structure()
            
            logger.info("✅ Restructuring completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error executing restructuring: {e}")
            return False
    
    def create_backup(self):
        """Create backup before restructuring"""
        backup_dir = f"scripts_restructuring_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        shutil.copytree(self.scripts_dir, backup_dir)
        logger.info(f"📁 Created backup: {backup_dir}")
    
    def remove_deprecated_scripts(self):
        """Remove deprecated scripts"""
        logger.info("🗑️ Removing deprecated scripts...")
        
        for script_info in self.deprecated_scripts:
            script_path = script_info["file_path"]
            
            if os.path.exists(script_path):
                # Move to archive instead of deleting
                archive_dir = os.path.join(self.scripts_dir, "archived", "deprecated")
                os.makedirs(archive_dir, exist_ok=True)
                
                archive_path = os.path.join(archive_dir, script_info["file_name"])
                shutil.move(script_path, archive_path)
                
                self.restructuring_log.append({
                    "action": "archived_deprecated",
                    "script": script_path,
                    "archive_path": archive_path,
                    "reason": script_info["deprecation_reason"]
                })
                
                logger.info(f"📦 Archived deprecated script: {script_info['file_name']}")
    
    def consolidate_similar_scripts(self):
        """Consolidate similar scripts"""
        logger.info("🔗 Consolidating similar scripts...")
        
        for opportunity in self.consolidation_opportunities:
            scripts = opportunity["scripts"]
            
            if len(scripts) > 1:
                # Find the best script to keep (largest file)
                best_script = max(scripts, key=lambda s: os.path.getsize(s))
                other_scripts = [s for s in scripts if s != best_script]
                
                # Merge content from other scripts
                self.merge_scripts(best_script, other_scripts)
                
                # Archive other scripts
                for script in other_scripts:
                    if os.path.exists(script):
                        archive_dir = os.path.join(self.scripts_dir, "archived", "consolidated")
                        os.makedirs(archive_dir, exist_ok=True)
                        
                        archive_path = os.path.join(archive_dir, os.path.basename(script))
                        shutil.move(script, archive_path)
                        
                        self.restructuring_log.append({
                            "action": "consolidated",
                            "kept_script": best_script,
                            "archived_script": script,
                            "archive_path": archive_path
                        })
                        
                        logger.info(f"🔗 Consolidated: {os.path.basename(script)} into {os.path.basename(best_script)}")
    
    def merge_scripts(self, target_script: str, source_scripts: List[str]):
        """Merge content from source scripts into target script"""
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
            
            logger.info(f"📝 Merged {len(source_scripts)} scripts into {os.path.basename(target_script)}")
            
        except Exception as e:
            logger.error(f"Error merging scripts: {e}")
    
    def optimize_folder_structure(self):
        """Optimize folder structure"""
        logger.info("📁 Optimizing folder structure...")
        
        # Create new organized structure
        new_structure = {
            "ai_systems": "AI and Alex AI integration scripts",
            "deployment": "Deployment and setup automation",
            "synchronization": "Data sync and N8N integration",
            "monitoring": "Health checks and monitoring",
            "testing": "Test scripts and validation",
            "utilities": "General utility scripts",
            "archived": "Archived and deprecated scripts"
        }
        
        # Create new folder structure
        for folder_name, description in new_structure.items():
            folder_path = os.path.join(self.scripts_dir, folder_name)
            os.makedirs(folder_path, exist_ok=True)
            
            # Create README for each folder
            readme_path = os.path.join(folder_path, "README.md")
            with open(readme_path, 'w') as f:
                f.write(f"# {folder_name.replace('_', ' ').title()}\n\n{description}\n")
            
            logger.info(f"📁 Created folder: {folder_name}")
    
    def generate_restructuring_report(self) -> str:
        """Generate restructuring report"""
        report = []
        report.append("# Folder Restructuring Report")
        report.append("=" * 40)
        report.append("")
        
        # Summary
        report.append("## Summary")
        report.append(f"- Deprecated Scripts: {len(self.deprecated_scripts)}")
        report.append(f"- Consolidation Opportunities: {len(self.consolidation_opportunities)}")
        report.append(f"- Optimization Recommendations: {len(self.optimization_recommendations)}")
        report.append("")
        
        # Deprecated scripts
        if self.deprecated_scripts:
            report.append("## Deprecated Scripts")
            for script in self.deprecated_scripts:
                report.append(f"- {script['file_name']}: {script['deprecation_reason']}")
            report.append("")
        
        # Consolidation opportunities
        if self.consolidation_opportunities:
            report.append("## Consolidation Opportunities")
            for opportunity in self.consolidation_opportunities:
                script_names = [os.path.basename(s) for s in opportunity['scripts']]
                report.append(f"- {', '.join(script_names)}: {opportunity['reason']}")
            report.append("")
        
        # Optimization recommendations
        if self.optimization_recommendations:
            report.append("## Optimization Recommendations")
            for folder, rec in self.optimization_recommendations.items():
                report.append(f"- {folder}: {rec['recommendation']} ({rec['script_count']} scripts)")
            report.append("")
        
        return "\n".join(report)
    
    def save_restructuring_log(self):
        """Save restructuring log"""
        with open('restructuring-log.json', 'w') as f:
            json.dump(self.restructuring_log, f, indent=2)
        
        logger.info("📝 Restructuring log saved to restructuring-log.json")

def main():
    """Main function"""
    print("🔧 Folder Restructuring Executor")
    print("=" * 40)
    
    executor = FolderRestructuringExecutor()
    
    # Discover issues
    print("🔍 Discovering restructuring opportunities...")
    issues = executor.discover_issues()
    
    print(f"\n📊 Issues Found:")
    print(f"  Deprecated Scripts: {issues['deprecated_scripts']}")
    print(f"  Consolidation Opportunities: {issues['consolidation_opportunities']}")
    print(f"  Optimization Recommendations: {issues['optimization_recommendations']}")
    
    if issues['deprecated_scripts'] > 0 or issues['consolidation_opportunities'] > 0:
        # Ask for confirmation
        response = input(f"\n🤔 Execute restructuring? (y/N): ")
        if response.lower() == 'y':
            if executor.execute_restructuring():
                print("🎉 Restructuring completed successfully!")
                
                # Generate and save report
                report = executor.generate_restructuring_report()
                with open('restructuring-report.md', 'w') as f:
                    f.write(report)
                
                executor.save_restructuring_log()
                
                print(f"\n📋 Report saved to restructuring-report.md")
                print(f"📋 Log saved to restructuring-log.json")
            else:
                print("❌ Restructuring failed")
        else:
            print("❌ Restructuring cancelled")
    else:
        print("\n✅ No restructuring needed - folder structure is already optimal!")

if __name__ == "__main__":
    main()







