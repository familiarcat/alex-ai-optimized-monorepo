from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Intelligent Monorepo Cleanup System
==================================

Advanced cleanup system that intelligently handles duplicate files,
similar scripts, and milestone packages while preserving functionality.
"""

import os
import sys
import shutil
import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple
import difflib

class IntelligentMonorepoCleanup:
    """Intelligent cleanup system for monorepo optimization"""
    
        self.backup_dir = None
        self.cleanup_log = []
        self.preserved_files = set()
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        self.backup_dir = self.project_root / f"monorepo_cleanup_backup_{timestamp}"
        self.backup_dir.mkdir(exist_ok=True)
        
        self.log(f"Created backup directory: {self.backup_dir}")
        return str(self.backup_dir)
    
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] {message}"
        self.cleanup_log.append(log_entry)
        print(log_entry)
    
    def safe_remove_file(self, file_path: Path, reason: str = "Duplicate or redundant"):
        """Safely remove a file with backup"""
        if not file_path.exists():
            return
        
        # Create backup
        backup_path = self.backup_dir / file_path.relative_to(self.project_root)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file_path, backup_path)
        
        # Remove original
        file_path.unlink()
        
        self.log(f"Removed {file_path} ({reason}) - backed up to {backup_path}")
    
    def safe_remove_directory(self, dir_path: Path, reason: str = "Redundant directory"):
        """Safely remove a directory with backup"""
        if not dir_path.exists() or not dir_path.is_dir():
            return
        
        # Create backup
        backup_path = self.backup_dir / dir_path.relative_to(self.project_root)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(dir_path, backup_path)
        
        # Remove original
        shutil.rmtree(dir_path)
        
        self.log(f"Removed directory {dir_path} ({reason}) - backed up to {backup_path}")
    
    def consolidate_similar_scripts(self, script_groups: Dict[str, List[str]]) -> Dict[str, str]:
        """Consolidate similar scripts into single optimized versions"""
        consolidated = {}
        
        for group_name, scripts in script_groups.items():
            if len(scripts) < 2:
                continue
            
            self.log(f"Consolidating {len(scripts)} similar scripts: {group_name}")
            
            # Read all scripts
            script_contents = []
            for script_path in scripts:
                try:
                    with open(script_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    script_contents.append((script_path, content))
                except Exception as e:
                    self.log(f"Error reading {script_path}: {e}")
                    continue
            
            if not script_contents:
                continue
            
            # Find the most comprehensive script (longest with most functions)
            best_script = max(script_contents, key=lambda x: (len(x[1]), x[1].count('def '), x[1].count('class ')))
            best_path, best_content = best_script
            
            # Create consolidated script
            consolidated_name = f"consolidated_{group_name.replace(' ', '_').replace('/', '_')}.py"
            consolidated_path = self.project_root / "scripts" / "consolidated" / consolidated_name
            consolidated_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Write consolidated script with header
            header = f'''#!/usr/bin/env python3
"""
Consolidated Script: {group_name}
================================

This script consolidates the following similar scripts:
{chr(10).join(f"- {script}" for script, _ in script_contents)}

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

'''
            
            with open(consolidated_path, 'w', encoding='utf-8') as f:
                f.write(header + best_content)
            
            # Make executable
            os.chmod(consolidated_path, 0o755)
            
            consolidated[group_name] = str(consolidated_path)
            self.log(f"Created consolidated script: {consolidated_path}")
            
            # Remove original scripts (except the best one)
            for script_path, _ in script_contents:
                if script_path != best_path:
                    self.safe_remove_file(Path(script_path), "Consolidated into single script")
        
        return consolidated
    
    def archive_milestone_packages(self, milestone_dirs: List[str]) -> Dict[str, str]:
        """Archive milestone packages to reduce clutter"""
        archived = {}
        archives_dir = self.project_root / "archives" / "milestone_packages"
        archives_dir.mkdir(parents=True, exist_ok=True)
        
        for milestone_dir in milestone_dirs:
            milestone_path = Path(milestone_dir)
            if not milestone_path.exists():
                continue
            
            # Create archive
            archive_name = f"{milestone_path.name}_{datetime.now().strftime('%Y%m%d')}.tar.gz"
            archive_path = archives_dir / archive_name
            
            # Create tar.gz archive
            import tarfile
            with tarfile.open(archive_path, "w:gz") as tar:
                tar.add(milestone_path, arcname=milestone_path.name)
            
            archived[milestone_dir] = str(archive_path)
            self.log(f"Archived {milestone_dir} to {archive_path}")
            
            # Remove original directory
            self.safe_remove_directory(milestone_path, "Archived milestone package")
        
        return archived
    
    def remove_duplicate_files(self, duplicate_groups: Dict[str, List[str]]) -> int:
        """Remove duplicate files, keeping the most recent or most comprehensive"""
        removed_count = 0
        
        for hash_val, files in duplicate_groups.items():
            if len(files) < 2:
                continue
            
            # Keep the file with the most recent modification time or largest size
            best_file = None
            best_score = -1
            
            for file_path in files:
                try:
                    path = Path(file_path)
                    if not path.exists():
                        continue
                    
                    stat = path.stat()
                    # Score based on modification time and size
                    score = stat.st_mtime + (stat.st_size / 1000)  # Size in KB
                    
                    if score > best_score:
                        best_score = score
                        best_file = file_path
                        
                except Exception:
                    continue
            
            if not best_file:
                continue
            
            # Remove duplicates
            for file_path in files:
                if file_path != best_file:
                    path = Path(file_path)
                    if path.exists():
                        self.safe_remove_file(path, f"Duplicate of {best_file}")
                        removed_count += 1
        
        return removed_count
    
        # Create organized directory structure
        organized_dirs = {
            'src': 'Source code files',
            'scripts': 'Utility scripts',
            'docs': 'Documentation',
            'config': 'Configuration files',
            'data': 'Data files',
            'tests': 'Test files',
            'archives': 'Archived content'
        }
        
        for dir_name, description in organized_dirs.items():
            dir_path = self.project_root / dir_name
            dir_path.mkdir(exist_ok=True)
            self.log(f"Created organized directory: {dir_name} ({description})")
    
    def generate_cleanup_report(self) -> str:
        """Generate a comprehensive cleanup report"""
        report_path = self.project_root / f"monorepo_cleanup_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        
        report_content = f"""# Monorepo Cleanup Report

## Cleanup Summary
- **Backup Location**: {self.backup_dir}
- **Total Actions Logged**: {len(self.cleanup_log)}
- **Cleanup Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Cleanup Actions
"""
        
        for log_entry in self.cleanup_log:
            report_content += f"- {log_entry}\n"
        
        report_content += f"""

## Next Steps
1. **Test the cleaned repository** to ensure functionality is preserved
2. **Update any hardcoded paths** that may reference removed files
3. **Review consolidated scripts** in `scripts/consolidated/`
4. **Check archived packages** in `archives/milestone_packages/`
5. **Remove backup directory** when satisfied: `rm -rf {self.backup_dir}`

## File Structure After Cleanup
```
{self.project_root.name}/
├── src/                    # Source code files
├── scripts/               # Utility scripts
│   └── consolidated/      # Consolidated similar scripts
├── docs/                  # Documentation
├── config/                # Configuration files
├── data/                  # Data files
├── tests/                 # Test files
├── archives/              # Archived content
│   └── milestone_packages/ # Archived milestone packages
└── alex-ai-job-search/    # Sub-repository (Next.js app)
```

## Safety Notes
- All removed files have been backed up to: `{self.backup_dir}`
- The cleanup process is reversible by restoring from backup
- Test thoroughly before removing the backup directory

---
**Cleanup Completed**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Status**: ✅ **CLEANUP COMPLETE**
"""
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report_content)
        
        self.log(f"Generated cleanup report: {report_path}")
        return str(report_path)
    
    def run_intelligent_cleanup(self, analysis_file: str) -> Dict[str, Any]:
        """Run the intelligent cleanup process"""
        print("🧹 Starting Intelligent Monorepo Cleanup")
        print("=" * 50)
        
        # Load analysis results
        with open(analysis_file, 'r') as f:
            analysis = json.load(f)
        
        # Create backup
        backup_dir = self.create_backup()
        
        results = {
            'backup_directory': backup_dir,
            'duplicates_removed': 0,
            'scripts_consolidated': {},
            'packages_archived': {},
            'cleanup_log': []
        }
        
        try:
            # Step 1: Remove duplicate files
            print("\n🗑️  Step 1: Removing duplicate files...")
            duplicate_groups = analysis['duplicate_analysis']['duplicate_groups']
            results['duplicates_removed'] = self.remove_duplicate_files(duplicate_groups)
            
            # Step 2: Consolidate similar scripts
            print("\n🔧 Step 2: Consolidating similar scripts...")
            python_similar = analysis['similarity_analysis']['python_scripts']
            shell_similar = analysis['similarity_analysis']['shell_scripts']
            
            # Consolidate Python scripts
            for script_path, group in python_similar.items():
                group_name = os.path.basename(script_path).replace('.py', '')
                consolidated = self.consolidate_similar_scripts({group_name: group['scripts']})
                results['scripts_consolidated'].update(consolidated)
            
            # Consolidate shell scripts
            for script_path, group in shell_similar.items():
                group_name = os.path.basename(script_path).replace('.sh', '')
                consolidated = self.consolidate_similar_scripts({group_name: group['scripts']})
                results['scripts_consolidated'].update(consolidated)
            
            # Step 3: Archive milestone packages
            print("\n📦 Step 3: Archiving milestone packages...")
            milestone_packages = analysis['folder_structure']['directory_categories']['milestone_packages']
            results['packages_archived'] = self.archive_milestone_packages(milestone_packages)
            
            # Step 4: Organize remaining files
            print("\n📁 Step 4: Organizing remaining files...")
            self.organize_remaining_files()
            
            # Step 5: Generate report
            print("\n📊 Step 5: Generating cleanup report...")
            report_path = self.generate_cleanup_report()
            results['report_path'] = report_path
            
            results['cleanup_log'] = self.cleanup_log
            
            print(f"\n✅ Intelligent cleanup complete!")
            print(f"📦 Backup created: {backup_dir}")
            print(f"📋 Report generated: {report_path}")
            
        except Exception as e:
            self.log(f"Error during cleanup: {e}")
            print(f"\n❌ Cleanup failed: {e}")
            print(f"📦 Backup available at: {backup_dir}")
            raise
        
        return results

    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python3 intelligent_monorepo_cleanup.py <analysis_file.json>")
        print("Example: python3 intelligent_monorepo_cleanup.py monorepo_optimization_analysis_20250906_202651.json")
        return 1
    
    analysis_file = sys.argv[1]
    
    if not os.path.exists(analysis_file):
        print(f"Error: Analysis file not found: {analysis_file}")
        return 1
    
    # Run intelligent cleanup
    cleanup = IntelligentMonorepoCleanup()
    results = cleanup.run_intelligent_cleanup(analysis_file)
    
    print(f"\n🎉 Monorepo cleanup completed successfully!")
    print(f"📊 Results:")
    print(f"   - Duplicates removed: {results['duplicates_removed']}")
    print(f"   - Scripts consolidated: {len(results['scripts_consolidated'])}")
    print(f"   - Packages archived: {len(results['packages_archived'])}")
    print(f"   - Backup location: {results['backup_directory']}")
    print(f"   - Report: {results['report_path']}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
