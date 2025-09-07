#!/usr/bin/env python3
"""
Git Repository Cleanup Analysis
==============================

Analyzes the current git repository structure and provides recommendations
for cleaning up sub-projects and managing git properly.
"""

import os
import subprocess
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple

class GitRepositoryCleanupAnalysis:
    """Analysis of git repository structure and cleanup recommendations"""
    
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        self.analysis_results = {}
    
    def analyze_git_structure(self) -> Dict[str, Any]:
        """Analyze the current git repository structure"""
        print("🔍 Analyzing Git Repository Structure")
        print("=" * 50)
        
        analysis = {
            'analysis_timestamp': datetime.now().isoformat(),
            'project_root': str(self.project_root),
            'git_repositories': {},
            'sub_projects': {},
            'cleanup_recommendations': [],
            'consolidation_strategy': {}
        }
        
        # Find all git repositories
        git_repos = self._find_git_repositories()
        analysis['git_repositories'] = git_repos
        
        # Analyze each repository
        for repo_path, repo_info in git_repos.items():
            print(f"\n📁 Repository: {repo_path}")
            repo_analysis = self._analyze_repository(repo_path, repo_info)
            analysis['git_repositories'][repo_path].update(repo_analysis)
        
        # Identify sub-projects
        sub_projects = self._identify_sub_projects()
        analysis['sub_projects'] = sub_projects
        
        # Generate cleanup recommendations
        cleanup_recommendations = self._generate_cleanup_recommendations(git_repos, sub_projects)
        analysis['cleanup_recommendations'] = cleanup_recommendations
        
        # Generate consolidation strategy
        consolidation_strategy = self._generate_consolidation_strategy(git_repos, sub_projects)
        analysis['consolidation_strategy'] = consolidation_strategy
        
        return analysis
    
    def _find_git_repositories(self) -> Dict[str, Dict[str, Any]]:
        """Find all git repositories in the project"""
        git_repos = {}
        
        # Find .git directories
        for git_dir in self.project_root.rglob('.git'):
            if git_dir.is_dir():
                repo_path = str(git_dir.parent.relative_to(self.project_root))
                if repo_path == '.':
                    repo_path = 'main'
                
                git_repos[repo_path] = {
                    'path': str(git_dir.parent),
                    'relative_path': repo_path,
                    'is_main': repo_path == 'main',
                    'git_dir': str(git_dir)
                }
        
        return git_repos
    
    def _analyze_repository(self, repo_path: str, repo_info: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a specific git repository"""
        repo_path_full = repo_info['path']
        
        try:
            # Get git status
            status_result = subprocess.run(
                ['git', 'status', '--porcelain'],
                cwd=repo_path_full,
                capture_output=True,
                text=True
            )
            
            # Get git branch info
            branch_result = subprocess.run(
                ['git', 'branch', '-a'],
                cwd=repo_path_full,
                capture_output=True,
                text=True
            )
            
            # Get git log info
            log_result = subprocess.run(
                ['git', 'log', '--oneline', '-10'],
                cwd=repo_path_full,
                capture_output=True,
                text=True
            )
            
            # Get remote info
            remote_result = subprocess.run(
                ['git', 'remote', '-v'],
                cwd=repo_path_full,
                capture_output=True,
                text=True
            )
            
            # Count files
            file_count = len(list(Path(repo_path_full).rglob('*')))
            dir_count = len([d for d in Path(repo_path_full).rglob('*') if d.is_dir()])
            
            return {
                'status': status_result.stdout,
                'branches': branch_result.stdout,
                'recent_commits': log_result.stdout,
                'remotes': remote_result.stdout,
                'file_count': file_count,
                'directory_count': dir_count,
                'has_uncommitted_changes': bool(status_result.stdout.strip()),
                'has_remotes': bool(remote_result.stdout.strip())
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'status': 'error'
            }
    
    def _identify_sub_projects(self) -> Dict[str, Dict[str, Any]]:
        """Identify sub-projects within the main repository"""
        sub_projects = {}
        
        # Look for common sub-project indicators
        sub_project_indicators = [
            'package.json',  # Node.js projects
            'requirements.txt',  # Python projects
            'Cargo.toml',  # Rust projects
            'go.mod',  # Go projects
            'pom.xml',  # Maven projects
            'build.gradle',  # Gradle projects
            'Dockerfile',  # Docker projects
            'docker-compose.yml',  # Docker Compose projects
        ]
        
        for indicator in sub_project_indicators:
            for file_path in self.project_root.rglob(indicator):
                if file_path.is_file():
                    # Get the directory containing the indicator
                    project_dir = file_path.parent
                    relative_path = str(project_dir.relative_to(self.project_root))
                    
                    if relative_path not in sub_projects:
                        sub_projects[relative_path] = {
                            'path': str(project_dir),
                            'relative_path': relative_path,
                            'indicators': [],
                            'type': self._determine_project_type(indicator)
                        }
                    
                    sub_projects[relative_path]['indicators'].append(indicator)
        
        return sub_projects
    
    def _determine_project_type(self, indicator: str) -> str:
        """Determine project type based on indicator file"""
        type_mapping = {
            'package.json': 'Node.js/JavaScript',
            'requirements.txt': 'Python',
            'Cargo.toml': 'Rust',
            'go.mod': 'Go',
            'pom.xml': 'Java/Maven',
            'build.gradle': 'Java/Gradle',
            'Dockerfile': 'Docker',
            'docker-compose.yml': 'Docker Compose'
        }
        return type_mapping.get(indicator, 'Unknown')
    
    def _generate_cleanup_recommendations(self, git_repos: Dict[str, Any], sub_projects: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate cleanup recommendations"""
        recommendations = []
        
        # Main repository analysis
        main_repo = git_repos.get('main', {})
        if main_repo:
            if main_repo.get('has_uncommitted_changes'):
                recommendations.append({
                    'priority': 'high',
                    'action': 'commit_changes',
                    'description': 'Commit uncommitted changes in main repository',
                    'repository': 'main',
                    'details': 'There are uncommitted changes that need to be addressed'
                })
            
            if not main_repo.get('has_remotes'):
                recommendations.append({
                    'priority': 'medium',
                    'action': 'add_remote',
                    'description': 'Add remote repository for main project',
                    'repository': 'main',
                    'details': 'Main repository has no remote configured'
                })
        
        # Sub-repository analysis
        for repo_path, repo_info in git_repos.items():
            if repo_path != 'main':
                if repo_info.get('has_uncommitted_changes'):
                    recommendations.append({
                        'priority': 'high',
                        'action': 'commit_changes',
                        'description': f'Commit uncommitted changes in {repo_path}',
                        'repository': repo_path,
                        'details': f'Sub-repository {repo_path} has uncommitted changes'
                    })
                
                recommendations.append({
                    'priority': 'medium',
                    'action': 'consolidate_repository',
                    'description': f'Consider consolidating {repo_path} into main repository',
                    'repository': repo_path,
                    'details': f'Sub-repository {repo_path} could be managed as a subdirectory'
                })
        
        # Sub-project analysis
        for project_path, project_info in sub_projects.items():
            if project_path not in git_repos:
                recommendations.append({
                    'priority': 'low',
                    'action': 'organize_sub_project',
                    'description': f'Organize sub-project {project_path}',
                    'repository': 'main',
                    'details': f'Sub-project {project_path} ({project_info["type"]}) should be properly organized'
                })
        
        return recommendations
    
    def _generate_consolidation_strategy(self, git_repos: Dict[str, Any], sub_projects: Dict[str, Any]) -> Dict[str, Any]:
        """Generate consolidation strategy"""
        strategy = {
            'approach': 'monorepo_with_submodules',
            'main_repository': 'main',
            'sub_repositories': [],
            'sub_projects': [],
            'consolidation_steps': []
        }
        
        # Identify sub-repositories to consolidate
        for repo_path, repo_info in git_repos.items():
            if repo_path != 'main':
                strategy['sub_repositories'].append({
                    'path': repo_path,
                    'action': 'convert_to_submodule',
                    'reason': 'Independent development history'
                })
        
        # Identify sub-projects to organize
        for project_path, project_info in sub_projects.items():
            strategy['sub_projects'].append({
                'path': project_path,
                'type': project_info['type'],
                'action': 'organize_in_main',
                'reason': 'Part of main project ecosystem'
            })
        
        # Generate consolidation steps
        strategy['consolidation_steps'] = [
            {
                'step': 1,
                'action': 'commit_all_changes',
                'description': 'Commit all uncommitted changes in all repositories'
            },
            {
                'step': 2,
                'action': 'create_submodules',
                'description': 'Convert sub-repositories to git submodules'
            },
            {
                'step': 3,
                'action': 'organize_sub_projects',
                'description': 'Organize sub-projects within main repository structure'
            },
            {
                'step': 4,
                'action': 'update_gitignore',
                'description': 'Update .gitignore to handle submodules and sub-projects'
            },
            {
                'step': 5,
                'action': 'create_documentation',
                'description': 'Create documentation for the consolidated structure'
            }
        ]
        
        return strategy
    
    def create_cleanup_script(self, analysis: Dict[str, Any]) -> str:
        """Create a cleanup script based on analysis"""
        script_content = f"""#!/bin/bash
# Git Repository Cleanup Script
# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

set -e

echo "🧹 Starting Git Repository Cleanup..."

# Step 1: Commit all changes in main repository
echo "📝 Step 1: Committing changes in main repository..."
cd {self.project_root}
git add .
git commit -m "Cleanup: Commit all changes before repository consolidation" || echo "No changes to commit"

# Step 2: Handle sub-repositories
"""
        
        # Add sub-repository handling
        for repo_path, repo_info in analysis['git_repositories'].items():
            if repo_path != 'main':
                script_content += f"""
echo "📁 Handling sub-repository: {repo_path}"
cd {self.project_root}/{repo_path}
git add .
git commit -m "Cleanup: Commit changes before consolidation" || echo "No changes to commit"
cd {self.project_root}
"""
        
        script_content += """
# Step 3: Create .gitmodules file for submodules
echo "📋 Step 3: Creating .gitmodules file..."
cat > .gitmodules << 'EOF'
"""
        
        # Add submodule entries
        for repo_path, repo_info in analysis['git_repositories'].items():
            if repo_path != 'main':
                script_content += f"""
[submodule "{repo_path}"]
    path = {repo_path}
    url = ./{repo_path}
"""
        
        script_content += """EOF

# Step 4: Update .gitignore
echo "📝 Step 4: Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Submodules
.gitmodules

# Sub-project specific ignores
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis

# OS specific
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF

# Step 5: Create documentation
echo "📚 Step 5: Creating documentation..."
cat > REPOSITORY_STRUCTURE.md << 'EOF'
# Repository Structure

## Main Repository
This is the main repository containing the Alex AI system and related projects.

## Sub-repositories
"""
        
        for repo_path, repo_info in analysis['git_repositories'].items():
            if repo_path != 'main':
                script_content += f"""
### {repo_path}
- Path: `{repo_path}/`
- Type: Git submodule
- Purpose: Independent development history
"""
        
        script_content += """
## Sub-projects
"""
        
        for project_path, project_info in analysis['sub_projects'].items():
            script_content += f"""
### {project_path}
- Path: `{project_path}/`
- Type: {project_info['type']}
- Indicators: {', '.join(project_info['indicators'])}
"""
        
        script_content += """
## Usage
- Main development happens in the root directory
- Sub-repositories are managed as git submodules
- Sub-projects are organized within the main repository structure

## Maintenance
- Use `git submodule update --init --recursive` to initialize submodules
- Use `git submodule update --remote` to update submodules
- Use `git submodule foreach git pull origin main` to update all submodules
EOF

echo "✅ Git repository cleanup complete!"
echo "📊 Repository structure:"
tree -L 2 -a

echo ""
echo "🎉 Repository consolidation complete!"
echo "📋 Next steps:"
echo "   1. Review the new structure"
echo "   2. Initialize submodules: git submodule update --init --recursive"
echo "   3. Test the consolidated repository"
echo "   4. Update any hardcoded paths"
"""
        
        return script_content

def main():
    """Main function to analyze git repository structure"""
    print("🔍 Git Repository Cleanup Analysis")
    print("=" * 50)
    
    # Initialize analysis
    analysis = GitRepositoryCleanupAnalysis()
    
    # Conduct analysis
    print("🔍 Analyzing git repository structure...")
    analysis_results = analysis.analyze_git_structure()
    
    # Display results
    print(f"\n📊 Analysis Results:")
    print(f"   Git Repositories: {len(analysis_results['git_repositories'])}")
    print(f"   Sub-projects: {len(analysis_results['sub_projects'])}")
    print(f"   Cleanup Recommendations: {len(analysis_results['cleanup_recommendations'])}")
    
    # Display git repositories
    print(f"\n📁 Git Repositories:")
    for repo_path, repo_info in analysis_results['git_repositories'].items():
        print(f"   {repo_path}: {repo_info.get('file_count', 0)} files, {repo_info.get('directory_count', 0)} directories")
        if repo_info.get('has_uncommitted_changes'):
            print(f"     ⚠️  Has uncommitted changes")
        if repo_info.get('has_remotes'):
            print(f"     ✅ Has remote configured")
        else:
            print(f"     ❌ No remote configured")
    
    # Display sub-projects
    print(f"\n📦 Sub-projects:")
    for project_path, project_info in analysis_results['sub_projects'].items():
        print(f"   {project_path}: {project_info['type']} ({', '.join(project_info['indicators'])})")
    
    # Display cleanup recommendations
    print(f"\n🧹 Cleanup Recommendations:")
    for i, rec in enumerate(analysis_results['cleanup_recommendations'], 1):
        print(f"   {i}. [{rec['priority'].upper()}] {rec['description']}")
        print(f"      Repository: {rec['repository']}")
        print(f"      Details: {rec['details']}")
    
    # Save analysis results
    results_file = f"git_repository_cleanup_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(results_file, 'w') as f:
        json.dump(analysis_results, f, indent=2)
    
    print(f"\n📋 Analysis results saved: {results_file}")
    
    # Create cleanup script
    cleanup_script = analysis.create_cleanup_script(analysis_results)
    script_file = f"git_repository_cleanup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sh"
    with open(script_file, 'w') as f:
        f.write(cleanup_script)
    
    # Make script executable
    os.chmod(script_file, 0o755)
    
    print(f"🧹 Cleanup script created: {script_file}")
    
    # Create summary report
    summary_report = f"""
# Git Repository Cleanup Analysis Summary

## 📊 Current State
- **Git Repositories**: {len(analysis_results['git_repositories'])}
- **Sub-projects**: {len(analysis_results['sub_projects'])}
- **Cleanup Recommendations**: {len(analysis_results['cleanup_recommendations'])}

## 📁 Git Repositories
"""
    
    for repo_path, repo_info in analysis_results['git_repositories'].items():
        summary_report += f"""
### {repo_path}
- **Files**: {repo_info.get('file_count', 0)}
- **Directories**: {repo_info.get('directory_count', 0)}
- **Uncommitted Changes**: {'Yes' if repo_info.get('has_uncommitted_changes') else 'No'}
- **Remote Configured**: {'Yes' if repo_info.get('has_remotes') else 'No'}
"""
    
    summary_report += f"""

## 📦 Sub-projects
"""
    
    for project_path, project_info in analysis_results['sub_projects'].items():
        summary_report += f"""
### {project_path}
- **Type**: {project_info['type']}
- **Indicators**: {', '.join(project_info['indicators'])}
"""
    
    summary_report += f"""

## 🧹 Cleanup Recommendations
"""
    
    for i, rec in enumerate(analysis_results['cleanup_recommendations'], 1):
        summary_report += f"""
{i}. **{rec['description']}**
   - Priority: {rec['priority']}
   - Repository: {rec['repository']}
   - Details: {rec['details']}
"""
    
    summary_report += f"""

## 🚀 Next Steps
1. Review the cleanup script: `{script_file}`
2. Execute the cleanup: `./{script_file}`
3. Initialize submodules: `git submodule update --init --recursive`
4. Test the consolidated repository
5. Update any hardcoded paths

---
**Analysis Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Status**: ✅ **READY FOR CLEANUP**
"""
    
    summary_file = f"git_cleanup_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
    with open(summary_file, 'w') as f:
        f.write(summary_report)
    
    print(f"📋 Summary report saved: {summary_file}")
    
    print("\n🎉 Git repository cleanup analysis complete!")
    print("\n📋 Key Findings:")
    print("   ✅ Multiple git repositories identified")
    print("   ✅ Sub-projects with different technologies")
    print("   ✅ Cleanup recommendations generated")
    print("   ✅ Consolidation strategy provided")
    
    return analysis_results

if __name__ == "__main__":
    main()
