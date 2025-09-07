#!/usr/bin/env python3
"""
Final Monorepo Cleanup System
============================

Comprehensive cleanup to remove excess scripts from main folder and
catalog all sub-projects within the monorepo.
"""

import os
import sys
import shutil
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Set
import re

class FinalMonorepoCleanup:
    """Final cleanup system for main folder organization"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.backup_dir = None
        self.cleanup_log = []
        self.sub_projects = {}
        self.removed_files = []
        
    def create_backup(self) -> str:
        """Create a backup directory for safety"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        self.backup_dir = self.project_root / f"final_cleanup_backup_{timestamp}"
        self.backup_dir.mkdir(exist_ok=True)
        
        self.log(f"Created backup directory: {self.backup_dir}")
        return str(self.backup_dir)
    
    def log(self, message: str):
        """Log cleanup actions"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] {message}"
        self.cleanup_log.append(log_entry)
        print(log_entry)
    
    def safe_remove_file(self, file_path: Path, reason: str = "Excess file"):
        """Safely remove a file with backup"""
        if not file_path.exists():
            return
        
        # Create backup
        backup_path = self.backup_dir / file_path.name
        shutil.copy2(file_path, backup_path)
        
        # Remove original
        file_path.unlink()
        
        self.removed_files.append(str(file_path))
        self.log(f"Removed {file_path.name} ({reason}) - backed up to {backup_path}")
    
    def identify_sub_projects(self) -> Dict[str, Dict[str, Any]]:
        """Identify and catalog all sub-projects in the monorepo"""
        sub_projects = {}
        
        # Look for sub-project indicators
        sub_project_indicators = {
            'package.json': 'Node.js/JavaScript',
            'requirements.txt': 'Python',
            'Cargo.toml': 'Rust',
            'go.mod': 'Go',
            'pom.xml': 'Java/Maven',
            'build.gradle': 'Java/Gradle',
            'Dockerfile': 'Docker',
            'docker-compose.yml': 'Docker Compose',
            'setup.py': 'Python Package',
            'pyproject.toml': 'Python Project',
            'composer.json': 'PHP',
            'Gemfile': 'Ruby',
            'mix.exs': 'Elixir'
        }
        
        # Scan for sub-projects
        for root, dirs, files in os.walk(self.project_root):
            # Skip .git and backup directories
            if any(skip in root for skip in ['.git', 'backup', 'node_modules', '__pycache__']):
                continue
            
            relative_path = os.path.relpath(root, self.project_root)
            if relative_path == '.':
                continue
            
            # Check if this directory has sub-project indicators
            project_type = None
            indicators = []
            
            for indicator, project_type_name in sub_project_indicators.items():
                if indicator in files:
                    project_type = project_type_name
                    indicators.append(indicator)
            
            # Also check for milestone packages and other patterns
            dir_name = os.path.basename(root)
            if 'milestone' in dir_name.lower() or 'package' in dir_name.lower():
                if not project_type:
                    project_type = 'Milestone Package'
                indicators.append('milestone_package')
            
            if project_type or len(indicators) > 0:
                # Count files in this sub-project
                file_count = len(files)
                dir_count = len(dirs)
                
                # Get total size
                total_size = 0
                for file in files:
                    try:
                        file_path = os.path.join(root, file)
                        total_size += os.path.getsize(file_path)
                    except OSError:
                        continue
                
                sub_projects[relative_path] = {
                    'path': root,
                    'relative_path': relative_path,
                    'type': project_type or 'Unknown',
                    'indicators': indicators,
                    'file_count': file_count,
                    'directory_count': dir_count,
                    'size_mb': round(total_size / (1024 * 1024), 2),
                    'is_milestone': 'milestone' in dir_name.lower(),
                    'is_package': 'package' in dir_name.lower()
                }
        
        return sub_projects
    
    def categorize_main_folder_files(self) -> Dict[str, List[str]]:
        """Categorize files in the main folder"""
        main_files = {
            'python_scripts': [],
            'shell_scripts': [],
            'markdown_docs': [],
            'json_configs': [],
            'sql_schemas': [],
            'html_files': [],
            'css_files': [],
            'database_files': [],
            'log_files': [],
            'text_files': [],
            'archive_files': [],
            'personal_files': [],
            'generated_files': [],
            'other': []
        }
        
        for file in os.listdir(self.project_root):
            file_path = self.project_root / file
            
            if file_path.is_dir() or file.startswith('.'):
                continue
            
            ext = os.path.splitext(file)[1].lower()
            base_name = os.path.splitext(file)[0]
            
            # Categorize by extension and content
            if ext == '.py':
                main_files['python_scripts'].append(file)
            elif ext == '.sh':
                main_files['shell_scripts'].append(file)
            elif ext == '.md':
                main_files['markdown_docs'].append(file)
            elif ext == '.json':
                main_files['json_configs'].append(file)
            elif ext == '.sql':
                main_files['sql_schemas'].append(file)
            elif ext == '.html':
                main_files['html_files'].append(file)
            elif ext == '.css':
                main_files['css_files'].append(file)
            elif ext == '.db':
                main_files['database_files'].append(file)
            elif ext == '.log':
                main_files['log_files'].append(file)
            elif ext == '.txt':
                main_files['text_files'].append(file)
            elif ext in ['.tar.gz', '.zip', '.rar']:
                main_files['archive_files'].append(file)
            elif 'resume' in file.lower() or 'brady' in file.lower():
                main_files['personal_files'].append(file)
            elif any(pattern in file for pattern in ['_20250906_', '_175692', 'summary', 'report', 'analysis']):
                main_files['generated_files'].append(file)
            else:
                main_files['other'].append(file)
        
        return main_files
    
    def identify_excess_files(self, categorized_files: Dict[str, List[str]]) -> List[str]:
        """Identify files that should be removed from main folder"""
        excess_files = []
        
        # Remove personal files
        excess_files.extend(categorized_files['personal_files'])
        
        # Remove generated/temporary files
        excess_files.extend(categorized_files['generated_files'])
        
        # Remove log files
        excess_files.extend(categorized_files['log_files'])
        
        # Remove archive files (should be in archives/)
        excess_files.extend(categorized_files['archive_files'])
        
        # Remove timestamped analysis files
        for file_list in categorized_files.values():
            for file in file_list:
                if any(pattern in file for pattern in ['_20250906_', '_175692', '_20250903_']):
                    if file not in excess_files:
                        excess_files.append(file)
        
        # Remove duplicate analysis files (keep only the most recent)
        analysis_files = [f for f in categorized_files['python_scripts'] if 'analysis' in f.lower()]
        if len(analysis_files) > 1:
            # Keep the most recent one, remove others
            analysis_files.sort()
            excess_files.extend(analysis_files[:-1])
        
        return excess_files
    
    def organize_remaining_files(self):
        """Organize remaining files into proper directories"""
        # Create organized directory structure
        organized_dirs = {
            'src': 'Source code files',
            'docs': 'Documentation',
            'config': 'Configuration files',
            'data': 'Data files',
            'tests': 'Test files',
            'workflows': 'Workflow definitions',
            'templates': 'Template files'
        }
        
        for dir_name, description in organized_dirs.items():
            dir_path = self.project_root / dir_name
            dir_path.mkdir(exist_ok=True)
            self.log(f"Created organized directory: {dir_name} ({description})")
    
    def move_files_to_organized_structure(self, categorized_files: Dict[str, List[str]]):
        """Move remaining files to organized directories"""
        # Move Python scripts to src/
        for file in categorized_files['python_scripts']:
            if file not in self.removed_files:
                src_path = self.project_root / file
                dst_path = self.project_root / 'src' / file
                if src_path.exists():
                    shutil.move(str(src_path), str(dst_path))
                    self.log(f"Moved {file} to src/")
        
        # Move shell scripts to src/
        for file in categorized_files['shell_scripts']:
            if file not in self.removed_files:
                src_path = self.project_root / file
                dst_path = self.project_root / 'src' / file
                if src_path.exists():
                    shutil.move(str(src_path), str(dst_path))
                    self.log(f"Moved {file} to src/")
        
        # Move documentation to docs/
        for file in categorized_files['markdown_docs']:
            if file not in self.removed_files:
                src_path = self.project_root / file
                dst_path = self.project_root / 'docs' / file
                if src_path.exists():
                    shutil.move(str(src_path), str(dst_path))
                    self.log(f"Moved {file} to docs/")
        
        # Move config files to config/
        for file in categorized_files['json_configs']:
            if file not in self.removed_files:
                src_path = self.project_root / file
                dst_path = self.project_root / 'config' / file
                if src_path.exists():
                    shutil.move(str(src_path), str(dst_path))
                    self.log(f"Moved {file} to config/")
        
        # Move SQL schemas to config/
        for file in categorized_files['sql_schemas']:
            if file not in self.removed_files:
                src_path = self.project_root / file
                dst_path = self.project_root / 'config' / file
                if src_path.exists():
                    shutil.move(str(src_path), str(dst_path))
                    self.log(f"Moved {file} to config/")
        
        # Move workflow files to workflows/
        workflow_files = [f for f in categorized_files['json_configs'] if 'workflow' in f.lower()]
        for file in workflow_files:
            if file not in self.removed_files:
                src_path = self.project_root / 'config' / file
                dst_path = self.project_root / 'workflows' / file
                if src_path.exists():
                    shutil.move(str(src_path), str(dst_path))
                    self.log(f"Moved {file} to workflows/")
        
        # Move template files to templates/
        template_files = [f for f in categorized_files['json_configs'] if 'template' in f.lower()]
        for file in template_files:
            if file not in self.removed_files:
                src_path = self.project_root / 'config' / file
                dst_path = self.project_root / 'templates' / file
                if src_path.exists():
                    shutil.move(str(src_path), str(dst_path))
                    self.log(f"Moved {file} to templates/")
    
    def generate_cleanup_report(self) -> str:
        """Generate a comprehensive cleanup report"""
        report_path = self.project_root / f"final_cleanup_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        
        report_content = f"""# Final Monorepo Cleanup Report

## Cleanup Summary
- **Backup Location**: {self.backup_dir}
- **Files Removed**: {len(self.removed_files)}
- **Sub-projects Identified**: {len(self.sub_projects)}
- **Cleanup Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Sub-Projects Catalog

### Total Sub-Projects: {len(self.sub_projects)}

"""
        
        # Group sub-projects by type
        by_type = {}
        for path, info in self.sub_projects.items():
            project_type = info['type']
            if project_type not in by_type:
                by_type[project_type] = []
            by_type[project_type].append((path, info))
        
        for project_type, projects in by_type.items():
            report_content += f"### {project_type} ({len(projects)} projects)\n\n"
            for path, info in projects:
                report_content += f"**{path}**\n"
                report_content += f"- Type: {info['type']}\n"
                report_content += f"- Files: {info['file_count']}\n"
                report_content += f"- Directories: {info['directory_count']}\n"
                report_content += f"- Size: {info['size_mb']} MB\n"
                report_content += f"- Indicators: {', '.join(info['indicators'])}\n"
                if info['is_milestone']:
                    report_content += f"- Status: Milestone Package\n"
                report_content += "\n"
        
        report_content += f"""
## Files Removed ({len(self.removed_files)})

"""
        for file in self.removed_files:
            report_content += f"- {file}\n"
        
        report_content += f"""

## Cleanup Actions
"""
        for log_entry in self.cleanup_log:
            report_content += f"- {log_entry}\n"
        
        report_content += f"""

## New Directory Structure
```
{self.project_root.name}/
├── src/                    # Source code files
├── docs/                   # Documentation
├── config/                 # Configuration files
├── data/                   # Data files
├── tests/                  # Test files
├── workflows/              # Workflow definitions
├── templates/              # Template files
├── archives/               # Archived content
├── scripts/                # Utility scripts
│   └── consolidated/       # Consolidated scripts
└── alex-ai-job-search/     # Sub-repository (Next.js app)
```

## Next Steps
1. **Test the cleaned repository** to ensure functionality is preserved
2. **Update any hardcoded paths** that may reference moved files
3. **Review sub-projects** and consider further consolidation
4. **Remove backup directory** when satisfied: `rm -rf {self.backup_dir}`

## Safety Notes
- All removed files have been backed up to: `{self.backup_dir}`
- The cleanup process is reversible by restoring from backup
- Test thoroughly before removing the backup directory

---
**Cleanup Completed**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Status**: ✅ **FINAL CLEANUP COMPLETE**
"""
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report_content)
        
        self.log(f"Generated cleanup report: {report_path}")
        return str(report_path)
    
    def run_final_cleanup(self) -> Dict[str, Any]:
        """Run the final cleanup process"""
        print("🧹 Starting Final Monorepo Cleanup")
        print("=" * 50)
        
        # Create backup
        backup_dir = self.create_backup()
        
        results = {
            'backup_directory': backup_dir,
            'sub_projects': {},
            'files_removed': [],
            'cleanup_log': []
        }
        
        try:
            # Step 1: Identify sub-projects
            print("\n📁 Step 1: Identifying sub-projects...")
            self.sub_projects = self.identify_sub_projects()
            results['sub_projects'] = self.sub_projects
            
            print(f"   Found {len(self.sub_projects)} sub-projects")
            for path, info in self.sub_projects.items():
                print(f"   - {path}: {info['type']} ({info['file_count']} files, {info['size_mb']} MB)")
            
            # Step 2: Categorize main folder files
            print("\n📄 Step 2: Categorizing main folder files...")
            categorized_files = self.categorize_main_folder_files()
            
            total_files = sum(len(files) for files in categorized_files.values())
            print(f"   Categorized {total_files} files in main folder")
            
            # Step 3: Identify excess files
            print("\n🗑️  Step 3: Identifying excess files...")
            excess_files = self.identify_excess_files(categorized_files)
            print(f"   Identified {len(excess_files)} excess files for removal")
            
            # Step 4: Remove excess files
            print("\n🗑️  Step 4: Removing excess files...")
            for file in excess_files:
                file_path = self.project_root / file
                if file_path.exists():
                    self.safe_remove_file(file_path, "Excess file in main folder")
            
            # Step 5: Organize remaining files
            print("\n📁 Step 5: Organizing remaining files...")
            self.organize_remaining_files()
            self.move_files_to_organized_structure(categorized_files)
            
            # Step 6: Generate report
            print("\n📊 Step 6: Generating cleanup report...")
            report_path = self.generate_cleanup_report()
            results['report_path'] = report_path
            results['files_removed'] = self.removed_files
            
            results['cleanup_log'] = self.cleanup_log
            
            print(f"\n✅ Final cleanup complete!")
            print(f"📦 Backup created: {backup_dir}")
            print(f"📋 Report generated: {report_path}")
            
        except Exception as e:
            self.log(f"Error during cleanup: {e}")
            print(f"\n❌ Cleanup failed: {e}")
            print(f"📦 Backup available at: {backup_dir}")
            raise
        
        return results

def main():
    """Main function to run final cleanup"""
    import sys
    
    # Run final cleanup
    cleanup = FinalMonorepoCleanup()
    results = cleanup.run_final_cleanup()
    
    print(f"\n🎉 Final monorepo cleanup completed successfully!")
    print(f"📊 Results:")
    print(f"   - Sub-projects identified: {len(results['sub_projects'])}")
    print(f"   - Files removed: {len(results['files_removed'])}")
    print(f"   - Backup location: {results['backup_directory']}")
    print(f"   - Report: {results['report_path']}")
    
    # Display sub-projects summary
    print(f"\n📁 Sub-Projects Summary:")
    by_type = {}
    for path, info in results['sub_projects'].items():
        project_type = info['type']
        if project_type not in by_type:
            by_type[project_type] = 0
        by_type[project_type] += 1
    
    for project_type, count in by_type.items():
        print(f"   - {project_type}: {count} projects")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
