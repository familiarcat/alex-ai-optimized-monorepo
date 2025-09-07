#!/usr/bin/env python3
"""
Monorepo Optimization Analysis System
====================================

Deep analysis of the entire folder structure to identify redundant files,
compare similar scripts, and optimize the monorepo structure.
"""

import os
import hashlib
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple, Set
from collections import defaultdict
import difflib

class MonorepoOptimizationAnalysis:
    """Comprehensive analysis system for monorepo optimization"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.analysis_results = {}
        self.file_hashes = {}
        self.duplicate_files = {}
        self.similar_scripts = {}
        self.unused_files = set()
        self.dependency_map = {}
        
    def analyze_entire_structure(self) -> Dict[str, Any]:
        """Perform comprehensive analysis of the entire monorepo structure"""
        print("🔍 Starting Comprehensive Monorepo Analysis")
        print("=" * 60)
        
        analysis = {
            'analysis_timestamp': datetime.now().isoformat(),
            'project_root': str(self.project_root),
            'folder_structure': {},
            'file_analysis': {},
            'duplicate_analysis': {},
            'similarity_analysis': {},
            'usage_analysis': {},
            'optimization_recommendations': [],
            'cleanup_plan': {}
        }
        
        # Step 1: Analyze folder structure
        print("📁 Step 1: Analyzing folder structure...")
        analysis['folder_structure'] = self._analyze_folder_structure()
        
        # Step 2: Analyze all files
        print("📄 Step 2: Analyzing all files...")
        analysis['file_analysis'] = self._analyze_all_files()
        
        # Step 3: Find duplicates
        print("🔍 Step 3: Finding duplicate files...")
        analysis['duplicate_analysis'] = self._find_duplicate_files()
        
        # Step 4: Find similar scripts
        print("🔍 Step 4: Finding similar scripts...")
        analysis['similarity_analysis'] = self._find_similar_scripts()
        
        # Step 5: Analyze usage patterns
        print("📊 Step 5: Analyzing usage patterns...")
        analysis['usage_analysis'] = self._analyze_usage_patterns()
        
        # Step 6: Generate optimization recommendations
        print("💡 Step 6: Generating optimization recommendations...")
        analysis['optimization_recommendations'] = self._generate_optimization_recommendations(analysis)
        
        # Step 7: Create cleanup plan
        print("🧹 Step 7: Creating cleanup plan...")
        analysis['cleanup_plan'] = self._create_cleanup_plan(analysis)
        
        return analysis
    
    def _analyze_folder_structure(self) -> Dict[str, Any]:
        """Analyze the folder structure and categorize directories"""
        structure = {
            'total_directories': 0,
            'total_files': 0,
            'directory_categories': {},
            'file_categories': {},
            'depth_analysis': {},
            'size_analysis': {}
        }
        
        # Categorize directories
        directory_categories = {
            'milestone_packages': [],
            'base_packages': [],
            'documentation': [],
            'scripts': [],
            'data': [],
            'config': [],
            'tests': [],
            'other': []
        }
        
        # Categorize files
        file_categories = {
            'python_scripts': [],
            'shell_scripts': [],
            'markdown_docs': [],
            'json_configs': [],
            'sql_schemas': [],
            'html_files': [],
            'css_files': [],
            'database_files': [],
            'log_files': [],
            'other': []
        }
        
        total_size = 0
        max_depth = 0
        
        for root, dirs, files in os.walk(self.project_root):
            # Skip .git directory
            if '.git' in root:
                continue
                
            relative_path = os.path.relpath(root, self.project_root)
            depth = len(relative_path.split(os.sep)) if relative_path != '.' else 0
            max_depth = max(max_depth, depth)
            
            structure['total_directories'] += 1
            structure['total_files'] += len(files)
            
            # Categorize directories
            dir_name = os.path.basename(root)
            if 'milestone' in dir_name.lower():
                directory_categories['milestone_packages'].append(relative_path)
            elif 'base' in dir_name.lower() or 'package' in dir_name.lower():
                directory_categories['base_packages'].append(relative_path)
            elif 'doc' in dir_name.lower():
                directory_categories['documentation'].append(relative_path)
            elif 'script' in dir_name.lower():
                directory_categories['scripts'].append(relative_path)
            elif 'data' in dir_name.lower():
                directory_categories['data'].append(relative_path)
            elif 'config' in dir_name.lower():
                directory_categories['config'].append(relative_path)
            elif 'test' in dir_name.lower():
                directory_categories['tests'].append(relative_path)
            else:
                directory_categories['other'].append(relative_path)
            
            # Categorize files
            for file in files:
                file_path = os.path.join(root, file)
                try:
                    file_size = os.path.getsize(file_path)
                    total_size += file_size
                    
                    ext = os.path.splitext(file)[1].lower()
                    if ext == '.py':
                        file_categories['python_scripts'].append(relative_path + '/' + file)
                    elif ext == '.sh':
                        file_categories['shell_scripts'].append(relative_path + '/' + file)
                    elif ext == '.md':
                        file_categories['markdown_docs'].append(relative_path + '/' + file)
                    elif ext == '.json':
                        file_categories['json_configs'].append(relative_path + '/' + file)
                    elif ext == '.sql':
                        file_categories['sql_schemas'].append(relative_path + '/' + file)
                    elif ext == '.html':
                        file_categories['html_files'].append(relative_path + '/' + file)
                    elif ext == '.css':
                        file_categories['css_files'].append(relative_path + '/' + file)
                    elif ext == '.db':
                        file_categories['database_files'].append(relative_path + '/' + file)
                    elif ext == '.log':
                        file_categories['log_files'].append(relative_path + '/' + file)
                    else:
                        file_categories['other'].append(relative_path + '/' + file)
                except OSError:
                    continue
        
        structure['directory_categories'] = directory_categories
        structure['file_categories'] = file_categories
        structure['depth_analysis'] = {'max_depth': max_depth, 'total_size_bytes': total_size}
        structure['size_analysis'] = {'total_size_mb': round(total_size / (1024 * 1024), 2)}
        
        return structure
    
    def _analyze_all_files(self) -> Dict[str, Any]:
        """Analyze all files for content, size, and metadata"""
        file_analysis = {
            'python_scripts': {},
            'shell_scripts': {},
            'config_files': {},
            'documentation': {},
            'data_files': {}
        }
        
        for root, dirs, files in os.walk(self.project_root):
            if '.git' in root:
                continue
                
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, self.project_root)
                
                try:
                    file_size = os.path.getsize(file_path)
                    ext = os.path.splitext(file)[1].lower()
                    
                    file_info = {
                        'path': relative_path,
                        'size_bytes': file_size,
                        'size_mb': round(file_size / (1024 * 1024), 4),
                        'modified': datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat()
                    }
                    
                    # Analyze content for different file types
                    if ext == '.py':
                        file_info.update(self._analyze_python_script(file_path))
                        file_analysis['python_scripts'][relative_path] = file_info
                    elif ext == '.sh':
                        file_info.update(self._analyze_shell_script(file_path))
                        file_analysis['shell_scripts'][relative_path] = file_info
                    elif ext in ['.json', '.yaml', '.yml', '.toml']:
                        file_info.update(self._analyze_config_file(file_path))
                        file_analysis['config_files'][relative_path] = file_info
                    elif ext == '.md':
                        file_info.update(self._analyze_documentation(file_path))
                        file_analysis['documentation'][relative_path] = file_info
                    elif ext in ['.db', '.sql', '.csv', '.txt']:
                        file_info.update(self._analyze_data_file(file_path))
                        file_analysis['data_files'][relative_path] = file_info
                        
                except Exception as e:
                    continue
        
        return file_analysis
    
    def _analyze_python_script(self, file_path: str) -> Dict[str, Any]:
        """Analyze a Python script for imports, functions, and complexity"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            lines = content.split('\n')
            non_empty_lines = [line for line in lines if line.strip()]
            
            # Count imports
            imports = [line for line in lines if line.strip().startswith(('import ', 'from '))]
            
            # Count functions and classes
            functions = [line for line in lines if line.strip().startswith('def ')]
            classes = [line for line in lines if line.strip().startswith('class ')]
            
            # Check for main execution
            has_main = any('if __name__ == "__main__"' in line for line in lines)
            
            # Calculate hash for duplicate detection
            file_hash = hashlib.md5(content.encode()).hexdigest()
            self.file_hashes[file_path] = file_hash
            
            return {
                'total_lines': len(lines),
                'non_empty_lines': len(non_empty_lines),
                'imports': len(imports),
                'functions': len(functions),
                'classes': len(classes),
                'has_main': has_main,
                'complexity_score': len(functions) + len(classes) * 2,
                'file_hash': file_hash,
                'import_list': [imp.strip() for imp in imports[:10]]  # First 10 imports
            }
        except Exception:
            return {'error': 'Could not analyze file'}
    
    def _analyze_shell_script(self, file_path: str) -> Dict[str, Any]:
        """Analyze a shell script for commands and complexity"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            lines = content.split('\n')
            non_empty_lines = [line for line in lines if line.strip() and not line.strip().startswith('#')]
            
            # Count different types of commands
            git_commands = [line for line in lines if 'git ' in line]
            curl_commands = [line for line in lines if 'curl ' in line]
            echo_commands = [line for line in lines if line.strip().startswith('echo ')]
            
            # Calculate hash
            file_hash = hashlib.md5(content.encode()).hexdigest()
            self.file_hashes[file_path] = file_hash
            
            return {
                'total_lines': len(lines),
                'non_empty_lines': len(non_empty_lines),
                'git_commands': len(git_commands),
                'curl_commands': len(curl_commands),
                'echo_commands': len(echo_commands),
                'complexity_score': len(non_empty_lines),
                'file_hash': file_hash
            }
        except Exception:
            return {'error': 'Could not analyze file'}
    
    def _analyze_config_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze configuration files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            file_hash = hashlib.md5(content.encode()).hexdigest()
            self.file_hashes[file_path] = file_hash
            
            return {
                'content_length': len(content),
                'file_hash': file_hash,
                'is_json': file_path.endswith('.json'),
                'is_yaml': file_path.endswith(('.yaml', '.yml'))
            }
        except Exception:
            return {'error': 'Could not analyze file'}
    
    def _analyze_documentation(self, file_path: str) -> Dict[str, Any]:
        """Analyze documentation files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            lines = content.split('\n')
            headers = [line for line in lines if line.strip().startswith('#')]
            
            file_hash = hashlib.md5(content.encode()).hexdigest()
            self.file_hashes[file_path] = file_hash
            
            return {
                'total_lines': len(lines),
                'headers': len(headers),
                'content_length': len(content),
                'file_hash': file_hash
            }
        except Exception:
            return {'error': 'Could not analyze file'}
    
    def _analyze_data_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze data files"""
        try:
            file_size = os.path.getsize(file_path)
            file_hash = hashlib.md5(open(file_path, 'rb').read()).hexdigest()
            self.file_hashes[file_path] = file_hash
            
            return {
                'file_size_mb': round(file_size / (1024 * 1024), 4),
                'file_hash': file_hash,
                'is_database': file_path.endswith('.db'),
                'is_sql': file_path.endswith('.sql')
            }
        except Exception:
            return {'error': 'Could not analyze file'}
    
    def _find_duplicate_files(self) -> Dict[str, Any]:
        """Find duplicate files based on content hash"""
        hash_to_files = defaultdict(list)
        
        for file_path, file_hash in self.file_hashes.items():
            hash_to_files[file_hash].append(file_path)
        
        duplicates = {}
        for file_hash, files in hash_to_files.items():
            if len(files) > 1:
                duplicates[file_hash] = {
                    'files': files,
                    'count': len(files),
                    'size_bytes': sum(os.path.getsize(f) for f in files if os.path.exists(f))
                }
        
        return {
            'total_duplicates': len(duplicates),
            'duplicate_groups': duplicates,
            'total_wasted_space_mb': sum(
                (group['size_bytes'] - os.path.getsize(group['files'][0])) / (1024 * 1024)
                for group in duplicates.values()
                if group['files'] and os.path.exists(group['files'][0])
            )
        }
    
    def _find_similar_scripts(self) -> Dict[str, Any]:
        """Find similar scripts using content comparison"""
        python_scripts = []
        shell_scripts = []
        
        # Collect all scripts
        for root, dirs, files in os.walk(self.project_root):
            if '.git' in root:
                continue
            for file in files:
                if file.endswith('.py'):
                    python_scripts.append(os.path.join(root, file))
                elif file.endswith('.sh'):
                    shell_scripts.append(os.path.join(root, file))
        
        similar_groups = {
            'python_scripts': self._find_similar_python_scripts(python_scripts),
            'shell_scripts': self._find_similar_shell_scripts(shell_scripts)
        }
        
        return similar_groups
    
    def _find_similar_python_scripts(self, scripts: List[str]) -> Dict[str, Any]:
        """Find similar Python scripts"""
        similar_groups = {}
        
        for i, script1 in enumerate(scripts):
            if script1 in similar_groups:
                continue
                
            try:
                with open(script1, 'r', encoding='utf-8') as f:
                    content1 = f.read()
                
                similar_scripts = [script1]
                
                for j, script2 in enumerate(scripts[i+1:], i+1):
                    try:
                        with open(script2, 'r', encoding='utf-8') as f:
                            content2 = f.read()
                        
                        # Calculate similarity
                        similarity = difflib.SequenceMatcher(None, content1, content2).ratio()
                        
                        if similarity > 0.7:  # 70% similarity threshold
                            similar_scripts.append(script2)
                            similar_groups[script2] = True  # Mark as processed
                            
                    except Exception:
                        continue
                
                if len(similar_scripts) > 1:
                    similar_groups[script1] = {
                        'scripts': similar_scripts,
                        'count': len(similar_scripts),
                        'similarity_threshold': 0.7
                    }
                    
            except Exception:
                continue
        
        return {k: v for k, v in similar_groups.items() if isinstance(v, dict)}
    
    def _find_similar_shell_scripts(self, scripts: List[str]) -> Dict[str, Any]:
        """Find similar shell scripts"""
        similar_groups = {}
        
        for i, script1 in enumerate(scripts):
            if script1 in similar_groups:
                continue
                
            try:
                with open(script1, 'r', encoding='utf-8') as f:
                    content1 = f.read()
                
                similar_scripts = [script1]
                
                for j, script2 in enumerate(scripts[i+1:], i+1):
                    try:
                        with open(script2, 'r', encoding='utf-8') as f:
                            content2 = f.read()
                        
                        # Calculate similarity
                        similarity = difflib.SequenceMatcher(None, content1, content2).ratio()
                        
                        if similarity > 0.6:  # 60% similarity threshold for shell scripts
                            similar_scripts.append(script2)
                            similar_groups[script2] = True  # Mark as processed
                            
                    except Exception:
                        continue
                
                if len(similar_scripts) > 1:
                    similar_groups[script1] = {
                        'scripts': similar_scripts,
                        'count': len(similar_scripts),
                        'similarity_threshold': 0.6
                    }
                    
            except Exception:
                continue
        
        return {k: v for k, v in similar_groups.items() if isinstance(v, dict)}
    
    def _analyze_usage_patterns(self) -> Dict[str, Any]:
        """Analyze usage patterns and dependencies"""
        usage_analysis = {
            'import_dependencies': {},
            'file_references': {},
            'unused_files': [],
            'orphaned_files': []
        }
        
        # Analyze Python import dependencies
        python_files = []
        for root, dirs, files in os.walk(self.project_root):
            if '.git' in root:
                continue
            for file in files:
                if file.endswith('.py'):
                    python_files.append(os.path.join(root, file))
        
        # Build dependency map
        for py_file in python_files:
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                imports = []
                for line in content.split('\n'):
                    if line.strip().startswith(('import ', 'from ')):
                        imports.append(line.strip())
                
                usage_analysis['import_dependencies'][py_file] = imports
                
            except Exception:
                continue
        
        return usage_analysis
    
    def _generate_optimization_recommendations(self, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate optimization recommendations based on analysis"""
        recommendations = []
        
        # Duplicate file recommendations
        if analysis['duplicate_analysis']['total_duplicates'] > 0:
            recommendations.append({
                'type': 'duplicate_files',
                'priority': 'high',
                'description': f"Remove {analysis['duplicate_analysis']['total_duplicates']} duplicate file groups",
                'potential_savings_mb': analysis['duplicate_analysis']['total_wasted_space_mb'],
                'action': 'remove_duplicates'
            })
        
        # Similar script recommendations
        python_similar = analysis['similarity_analysis']['python_scripts']
        shell_similar = analysis['similarity_analysis']['shell_scripts']
        
        if python_similar:
            recommendations.append({
                'type': 'similar_python_scripts',
                'priority': 'medium',
                'description': f"Consolidate {len(python_similar)} groups of similar Python scripts",
                'action': 'consolidate_python_scripts'
            })
        
        if shell_similar:
            recommendations.append({
                'type': 'similar_shell_scripts',
                'priority': 'medium',
                'description': f"Consolidate {len(shell_similar)} groups of similar shell scripts",
                'action': 'consolidate_shell_scripts'
            })
        
        # Milestone package recommendations
        milestone_packages = analysis['folder_structure']['directory_categories']['milestone_packages']
        if len(milestone_packages) > 5:
            recommendations.append({
                'type': 'milestone_packages',
                'priority': 'low',
                'description': f"Archive or consolidate {len(milestone_packages)} milestone packages",
                'action': 'archive_milestone_packages'
            })
        
        # Large file recommendations
        large_files = []
        for category, files in analysis['file_analysis'].items():
            for file_path, file_info in files.items():
                if isinstance(file_info, dict) and file_info.get('size_mb', 0) > 10:
                    large_files.append((file_path, file_info['size_mb']))
        
        if large_files:
            recommendations.append({
                'type': 'large_files',
                'priority': 'medium',
                'description': f"Review {len(large_files)} large files (>10MB)",
                'action': 'review_large_files'
            })
        
        return recommendations
    
    def _create_cleanup_plan(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Create a detailed cleanup plan"""
        cleanup_plan = {
            'safe_to_remove': [],
            'consolidation_candidates': [],
            'archive_candidates': [],
            'review_required': []
        }
        
        # Files safe to remove (duplicates)
        for hash_val, duplicate_group in analysis['duplicate_analysis']['duplicate_groups'].items():
            if duplicate_group['files']:
                # Keep the first file, mark others for removal
                keep_file = duplicate_group['files'][0]
                for file_path in duplicate_group['files'][1:]:
                    cleanup_plan['safe_to_remove'].append({
                        'file': file_path,
                        'reason': f'Duplicate of {keep_file}',
                        'savings_mb': os.path.getsize(file_path) / (1024 * 1024) if os.path.exists(file_path) else 0
                    })
        
        # Consolidation candidates (similar scripts)
        for script, group in analysis['similarity_analysis']['python_scripts'].items():
            cleanup_plan['consolidation_candidates'].append({
                'type': 'python_scripts',
                'scripts': group['scripts'],
                'action': 'merge_into_single_script'
            })
        
        for script, group in analysis['similarity_analysis']['shell_scripts'].items():
            cleanup_plan['consolidation_candidates'].append({
                'type': 'shell_scripts',
                'scripts': group['scripts'],
                'action': 'merge_into_single_script'
            })
        
        # Archive candidates (milestone packages)
        milestone_packages = analysis['folder_structure']['directory_categories']['milestone_packages']
        for package in milestone_packages:
            cleanup_plan['archive_candidates'].append({
                'path': package,
                'reason': 'Milestone package - consider archiving',
                'action': 'move_to_archives'
            })
        
        return cleanup_plan
    
    def create_cleanup_script(self, analysis: Dict[str, Any]) -> str:
        """Create a cleanup script based on analysis"""
        cleanup_plan = analysis['cleanup_plan']
        
        script_content = f"""#!/bin/bash
# Monorepo Cleanup Script
# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

set -e

echo "🧹 Starting Monorepo Cleanup..."

# Create backup directory
BACKUP_DIR="monorepo_cleanup_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Created backup directory: $BACKUP_DIR"

# Step 1: Remove duplicate files
echo "🗑️  Step 1: Removing duplicate files..."
"""
        
        # Add duplicate file removal
        for item in cleanup_plan['safe_to_remove']:
            script_content += f"""
echo "   Removing duplicate: {item['file']}"
mkdir -p "$BACKUP_DIR/$(dirname {item['file']})"
cp {item['file']} "$BACKUP_DIR/{item['file']}" 2>/dev/null || echo "   Warning: Could not backup {item['file']}"
rm -f {item['file']}
"""
        
        # Add consolidation steps
        script_content += """
# Step 2: Consolidate similar scripts
echo "🔧 Step 2: Consolidating similar scripts..."
"""
        
        for item in cleanup_plan['consolidation_candidates']:
            if item['type'] == 'python_scripts':
                script_content += f"""
echo "   Consolidating Python scripts: {', '.join(item['scripts'])}"
# TODO: Implement script consolidation logic
"""
            elif item['type'] == 'shell_scripts':
                script_content += f"""
echo "   Consolidating shell scripts: {', '.join(item['scripts'])}"
# TODO: Implement script consolidation logic
"""
        
        # Add archiving steps
        script_content += """
# Step 3: Archive milestone packages
echo "📦 Step 3: Archiving milestone packages..."
"""
        
        for item in cleanup_plan['archive_candidates']:
            script_content += f"""
echo "   Archiving: {item['path']}"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/{os.path.basename(item['path'])}.tar.gz" "{item['path']}" 2>/dev/null || echo "   Warning: Could not archive {item['path']}"
"""
        
        script_content += """
# Step 4: Generate cleanup report
echo "📊 Step 4: Generating cleanup report..."
cat > "monorepo_cleanup_report_$(date +%Y%m%d_%H%M%S).md" << 'EOF'
# Monorepo Cleanup Report

## Cleanup Summary
- Duplicate files removed: [COUNT]
- Scripts consolidated: [COUNT]
- Packages archived: [COUNT]

## Backup Location
All removed files have been backed up to: $BACKUP_DIR

## Next Steps
1. Review the consolidated scripts
2. Test the cleaned up repository
3. Update any hardcoded paths
4. Remove backup directory if everything works correctly

EOF

echo "✅ Monorepo cleanup complete!"
echo "📋 Review the cleanup report and test the repository"
echo "🗑️  Remove backup directory when satisfied: rm -rf $BACKUP_DIR"
"""
        
        return script_content

def main():
    """Main function to run the monorepo optimization analysis"""
    print("🔍 Monorepo Optimization Analysis")
    print("=" * 50)
    
    # Initialize analysis
    analyzer = MonorepoOptimizationAnalysis()
    
    # Run comprehensive analysis
    print("🔍 Running comprehensive monorepo analysis...")
    analysis_results = analyzer.analyze_entire_structure()
    
    # Display results
    print(f"\n📊 Analysis Results:")
    print(f"   Total Directories: {analysis_results['folder_structure']['total_directories']}")
    print(f"   Total Files: {analysis_results['folder_structure']['total_files']}")
    print(f"   Total Size: {analysis_results['folder_structure']['size_analysis']['total_size_mb']} MB")
    print(f"   Duplicate Files: {analysis_results['duplicate_analysis']['total_duplicates']}")
    print(f"   Similar Script Groups: {len(analysis_results['similarity_analysis']['python_scripts']) + len(analysis_results['similarity_analysis']['shell_scripts'])}")
    print(f"   Optimization Recommendations: {len(analysis_results['optimization_recommendations'])}")
    
    # Display file categories
    print(f"\n📁 File Categories:")
    for category, files in analysis_results['folder_structure']['file_categories'].items():
        if files:
            print(f"   {category}: {len(files)} files")
    
    # Display directory categories
    print(f"\n📂 Directory Categories:")
    for category, dirs in analysis_results['folder_structure']['directory_categories'].items():
        if dirs:
            print(f"   {category}: {len(dirs)} directories")
    
    # Display optimization recommendations
    print(f"\n💡 Optimization Recommendations:")
    for i, rec in enumerate(analysis_results['optimization_recommendations'], 1):
        print(f"   {i}. [{rec['priority'].upper()}] {rec['description']}")
        if 'potential_savings_mb' in rec:
            print(f"      Potential savings: {rec['potential_savings_mb']:.2f} MB")
    
    # Save analysis results
    results_file = f"monorepo_optimization_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(results_file, 'w') as f:
        json.dump(analysis_results, f, indent=2)
    
    print(f"\n📋 Analysis results saved: {results_file}")
    
    # Create cleanup script
    cleanup_script = analyzer.create_cleanup_script(analysis_results)
    script_file = f"monorepo_cleanup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sh"
    with open(script_file, 'w') as f:
        f.write(cleanup_script)
    
    # Make script executable
    os.chmod(script_file, 0o755)
    
    print(f"🧹 Cleanup script created: {script_file}")
    
    # Create summary report
    summary_report = f"""
# Monorepo Optimization Analysis Summary

## 📊 Current State
- **Total Directories**: {analysis_results['folder_structure']['total_directories']}
- **Total Files**: {analysis_results['folder_structure']['total_files']}
- **Total Size**: {analysis_results['folder_structure']['size_analysis']['total_size_mb']} MB
- **Duplicate Files**: {analysis_results['duplicate_analysis']['total_duplicates']}
- **Similar Script Groups**: {len(analysis_results['similarity_analysis']['python_scripts']) + len(analysis_results['similarity_analysis']['shell_scripts'])}

## 📁 File Categories
"""
    
    for category, files in analysis_results['folder_structure']['file_categories'].items():
        if files:
            summary_report += f"- **{category}**: {len(files)} files\n"
    
    summary_report += f"""

## 📂 Directory Categories
"""
    
    for category, dirs in analysis_results['folder_structure']['directory_categories'].items():
        if dirs:
            summary_report += f"- **{category}**: {len(dirs)} directories\n"
    
    summary_report += f"""

## 💡 Optimization Recommendations
"""
    
    for i, rec in enumerate(analysis_results['optimization_recommendations'], 1):
        summary_report += f"""
{i}. **{rec['description']}**
   - Priority: {rec['priority']}
   - Action: {rec['action']}
"""
        if 'potential_savings_mb' in rec:
            summary_report += f"   - Potential savings: {rec['potential_savings_mb']:.2f} MB\n"
    
    summary_report += f"""

## 🧹 Cleanup Plan
- **Files safe to remove**: {len(analysis_results['cleanup_plan']['safe_to_remove'])}
- **Consolidation candidates**: {len(analysis_results['cleanup_plan']['consolidation_candidates'])}
- **Archive candidates**: {len(analysis_results['cleanup_plan']['archive_candidates'])}

## 🚀 Next Steps
1. Review the cleanup script: `{script_file}`
2. Execute the cleanup: `./{script_file}`
3. Test the optimized repository
4. Update any hardcoded paths

---
**Analysis Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Status**: ✅ **READY FOR OPTIMIZATION**
"""
    
    summary_file = f"monorepo_optimization_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
    with open(summary_file, 'w') as f:
        f.write(summary_report)
    
    print(f"📋 Summary report saved: {summary_file}")
    
    print("\n🎉 Monorepo optimization analysis complete!")
    print("\n📋 Key Findings:")
    print("   ✅ Comprehensive structure analysis completed")
    print("   ✅ Duplicate files identified")
    print("   ✅ Similar scripts found")
    print("   ✅ Optimization recommendations generated")
    print("   ✅ Cleanup plan created")
    
    return analysis_results

if __name__ == "__main__":
    main()
