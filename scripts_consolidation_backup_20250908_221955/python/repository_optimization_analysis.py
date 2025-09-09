#!/usr/bin/env python3
"""
Repository Optimization Analysis System
Convenes the Observation Lounge crew to analyze and optimize repository structure
"""

import os
import json
import subprocess
from datetime import datetime
from typing import Dict, List, Tuple
import sys

# Add the alexai-base-package to the path
sys.path.append('API_KEY_PLACEHOLDERmusician-show-tour-app/alexai-base-package')

try:
    from enhanced_unified_router import EnhancedUnifiedRouter
    from crew_coordinator import ObservationLoungeCoordinator
except ImportError as e:
    print(f"Warning: Could not import Alex AI components: {e}")

class RepositoryOptimizationAnalyzer:
    def __init__(self):
        self.analysis_results = {}
        self.crew_insights = {}
        self.optimization_plan = {}
        
    def analyze_large_files(self) -> Dict:
        """Analyze files by size and type"""
        print("🔍 Analyzing large files and unnecessary directories...")
        
        # Find large files (>10MB)
        large_files = []
        try:
            result = subprocess.run(['find', '.', '-type', 'f', '-size', '+10M', '-exec', 'ls', '-lh', '{}', ';'], 
                                  capture_output=True, text=True)
            for line in result.stdout.split('\n'):
                if line.strip():
                    parts = line.split()
                    if len(parts) >= 5:
                        size = parts[4]
                        filepath = parts[-1]
                        large_files.append({
                            'file': filepath,
                            'size': size,
                            'type': self._categorize_file(filepath)
                        })
        except Exception as e:
            print(f"Error finding large files: {e}")
        
        # Find unnecessary directories
        unnecessary_dirs = []
        patterns = ['node_modules', '__pycache__', '.git', 'venv', 'env', 'alexai_env', '*.tar.gz', '*.zip']
        
        for pattern in patterns:
            try:
                if pattern.startswith('*'):
                    # Handle file patterns
                    result = subprocess.run(['find', '.', '-name', pattern], capture_output=True, text=True)
                    for filepath in result.stdout.strip().split('\n'):
                        if filepath:
                            unnecessary_dirs.append({
                                'path': filepath,
                                'type': 'archive_file',
                                'reason': 'Compressed archive - can be regenerated'
                            })
                else:
                    # Handle directory patterns
                    result = subprocess.run(['find', '.', '-name', pattern, '-type', 'd'], capture_output=True, text=True)
                    for dirpath in result.stdout.strip().split('\n'):
                        if dirpath:
                            unnecessary_dirs.append({
                                'path': dirpath,
                                'type': 'directory',
                                'reason': self._get_directory_reason(pattern)
                            })
            except Exception as e:
                print(f"Error finding {pattern}: {e}")
        
        return {
            'large_files': large_files,
            'unnecessary_dirs': unnecessary_dirs,
            'total_large_files': len(large_files),
            'total_unnecessary_dirs': len(unnecessary_dirs)
        }
    
    def _categorize_file(self, filepath: str) -> str:
        """Categorize file by type and importance"""
        if filepath.endswith('.tar.gz') or filepath.endswith('.zip'):
            return 'archive'
        elif 'node_modules' in filepath:
            return 'node_dependencies'
        elif '__pycache__' in filepath or filepath.endswith('.pyc'):
            return 'python_cache'
        elif '.git' in filepath:
            return 'git_internal'
        elif filepath.endswith('.db'):
            return 'database'
        elif filepath.endswith('.log'):
            return 'log_file'
        else:
            return 'source_code'
    
    def _get_directory_reason(self, pattern: str) -> str:
        """Get reason for removing directory type"""
        reasons = {
            'node_modules': 'Node.js dependencies - can be reinstalled with npm install',
            '__pycache__': 'Python bytecode cache - regenerated automatically',
            '.git': 'Git repository data - essential for version control',
            'venv': 'Python virtual environment - can be recreated',
            'env': 'Environment directory - can be recreated',
            'alexai_env': 'Alex AI virtual environment - can be recreated'
        }
        return reasons.get(pattern, 'Unnecessary directory')
    
    def convene_observation_lounge(self, analysis_data: Dict) -> Dict:
        """Convene the crew for strategic analysis"""
        print("\n🚀 CONVENING OBSERVATION LOUNGE")
        print("=" * 50)
        
        # Simulate crew member analysis
        crew_analysis = {
            'captain_picard': {
                'role': 'Strategic Command',
                'analysis': self._captain_picard_analysis(analysis_data),
                'recommendation': 'Proceed with systematic cleanup while preserving core functionality'
            },
            'commander_data': {
                'role': 'Technical Analysis',
                'analysis': self._commander_data_analysis(analysis_data),
                'recommendation': 'Remove all non-essential files, maintain data integrity'
            },
            'lt_la_forge': {
                'role': 'Engineering Optimization',
                'analysis': self._lt_la_forge_analysis(analysis_data),
                'recommendation': 'Focus on build artifacts and temporary files'
            },
            'dr_crusher': {
                'role': 'System Health',
                'analysis': self._dr_crusher_analysis(analysis_data),
                'recommendation': 'Ensure no critical data loss during cleanup'
            },
            'counselor_troi': {
                'role': 'Risk Assessment',
                'analysis': self._counselor_troi_analysis(analysis_data),
                'recommendation': 'Proceed with caution, maintain backups'
            }
        }
        
        return crew_analysis
    
    def _captain_picard_analysis(self, data: Dict) -> str:
        """Captain Picard's strategic analysis"""
        large_files = data['total_large_files']
        unnecessary_dirs = data['total_unnecessary_dirs']
        
        if large_files > 10:
            return f"Critical situation: {large_files} large files detected. Repository bloat threatens mission efficiency. Immediate action required."
        elif large_files > 5:
            return f"Moderate concern: {large_files} large files identified. Recommend cleanup to maintain optimal performance."
        else:
            return f"Good condition: Only {large_files} large files. Minor optimization recommended."
    
    def _commander_data_analysis(self, data: Dict) -> str:
        """Commander Data's technical analysis"""
        categories = {}
        for file_info in data['large_files']:
            file_type = file_info['type']
            categories[file_type] = categories.get(file_type, 0) + 1
        
        analysis = "Technical analysis complete:\n"
        for category, count in categories.items():
            analysis += f"- {category}: {count} files\n"
        
        return analysis
    
    def _lt_la_forge_analysis(self, data: Dict) -> str:
        """Lt. La Forge's engineering analysis"""
        archive_files = [f for f in data['large_files'] if f['type'] == 'archive']
        cache_files = [f for f in data['unnecessary_dirs'] if 'cache' in f['type']]
        
        return f"Engineering assessment: {len(archive_files)} archive files and {len(cache_files)} cache directories can be safely removed. These are build artifacts and temporary files."
    
    def _dr_crusher_analysis(self, data: Dict) -> str:
        """Dr. Crusher's system health analysis"""
        critical_files = [f for f in data['large_files'] if f['type'] in ['source_code', 'database']]
        safe_to_remove = [f for f in data['large_files'] if f['type'] in ['archive', 'node_dependencies', 'python_cache']]
        
        return f"System health check: {len(critical_files)} critical files must be preserved. {len(safe_to_remove)} files safe for removal."
    
    def _counselor_troi_analysis(self, data: Dict) -> str:
        """Counselor Troi's risk assessment"""
        total_files = len(data['large_files']) + len(data['unnecessary_dirs'])
        
        if total_files > 20:
            risk_level = "HIGH"
            recommendation = "Proceed with extreme caution. Create full backup before cleanup."
        elif total_files > 10:
            risk_level = "MEDIUM"
            recommendation = "Moderate risk. Create selective backup of critical files."
        else:
            risk_level = "LOW"
            recommendation = "Low risk. Standard cleanup procedures sufficient."
        
        return f"Risk assessment: {risk_level} risk level. {recommendation}"
    
    def create_optimization_plan(self, analysis_data: Dict, crew_insights: Dict) -> Dict:
        """Create detailed optimization plan based on crew analysis"""
        print("\n📋 CREATING OPTIMIZATION PLAN")
        print("=" * 50)
        
        plan = {
            'phase_1_immediate_cleanup': [],
            'phase_2_archive_removal': [],
            'phase_3_dependency_cleanup': [],
            'phase_4_final_optimization': [],
            'preserve_files': [],
            'estimated_size_reduction': 0
        }
        
        # Phase 1: Remove obvious unnecessary files
        for item in analysis_data['unnecessary_dirs']:
            if item['type'] in ['archive_file', 'python_cache']:
                plan['phase_1_immediate_cleanup'].append({
                    'action': 'remove',
                    'path': item['path'],
                    'reason': item['reason'],
                    'safe': True
                })
        
        # Phase 2: Remove large archive files
        for file_info in analysis_data['large_files']:
            if file_info['type'] == 'archive':
                plan['phase_2_archive_removal'].append({
                    'action': 'remove',
                    'path': file_info['file'],
                    'size': file_info['size'],
                    'reason': 'Large archive file - can be regenerated if needed'
                })
        
        # Phase 3: Clean up dependencies
        for item in analysis_data['unnecessary_dirs']:
            if item['type'] == 'directory' and 'node_modules' in item['path']:
                plan['phase_3_dependency_cleanup'].append({
                    'action': 'remove',
                    'path': item['path'],
                    'reason': 'Node.js dependencies - can be reinstalled'
                })
        
        # Identify files to preserve
        for file_info in analysis_data['large_files']:
            if file_info['type'] in ['source_code', 'database']:
                plan['preserve_files'].append({
                    'path': file_info['file'],
                    'reason': 'Critical functionality file'
                })
        
        return plan
    
    def execute_optimization_plan(self, plan: Dict) -> Dict:
        """Execute the optimization plan"""
        print("\n⚡ EXECUTING OPTIMIZATION PLAN")
        print("=" * 50)
        
        results = {
            'files_removed': 0,
            'space_saved': 0,
            'errors': [],
            'success': True
        }
        
        # Execute each phase
        for phase_name, phase_items in plan.items():
            if phase_name.startswith('phase_') and phase_items:
                print(f"\n🔄 Executing {phase_name.replace('_', ' ').title()}...")
                
                for item in phase_items:
                    if item['action'] == 'remove':
                        try:
                            if os.path.exists(item['path']):
                                # Get file size before removal
                                if os.path.isfile(item['path']):
                                    size = os.path.getsize(item['path'])
                                    results['space_saved'] += size
                                
                                # Remove the file/directory
                                if os.path.isdir(item['path']):
                                    subprocess.run(['rm', '-rf', item['path']], check=True)
                                else:
                                    os.remove(item['path'])
                                
                                results['files_removed'] += 1
                                print(f"  ✅ Removed: {item['path']}")
                            else:
                                print(f"  ⚠️  Not found: {item['path']}")
                        except Exception as e:
                            error_msg = f"Error removing {item['path']}: {e}"
                            results['errors'].append(error_msg)
                            print(f"  ❌ {error_msg}")
        
        return results
    
    def generate_optimization_report(self, analysis_data: Dict, crew_insights: Dict, 
                                   optimization_plan: Dict, execution_results: Dict) -> str:
        """Generate comprehensive optimization report"""
        report = f"""
# Repository Optimization Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Executive Summary
The Observation Lounge crew has completed a comprehensive analysis of the repository structure and executed optimization procedures.

## Analysis Results
- **Large Files Found**: {analysis_data['total_large_files']}
- **Unnecessary Directories**: {analysis_data['total_unnecessary_dirs']}
- **Files Removed**: {execution_results['files_removed']}
- **Space Saved**: {execution_results['space_saved'] / (1024*1024):.2f} MB

## Crew Analysis
"""
        
        for crew_member, insights in crew_insights.items():
            report += f"\n### {crew_member.replace('_', ' ').title()}\n"
            report += f"**Role**: {insights['role']}\n"
            report += f"**Analysis**: {insights['analysis']}\n"
            report += f"**Recommendation**: {insights['recommendation']}\n"
        
        report += f"""

## Optimization Plan Execution
- **Phase 1 (Immediate Cleanup)**: {len(optimization_plan['phase_1_immediate_cleanup'])} items
- **Phase 2 (Archive Removal)**: {len(optimization_plan['phase_2_archive_removal'])} items  
- **Phase 3 (Dependency Cleanup)**: {len(optimization_plan['phase_3_dependency_cleanup'])} items
- **Files Preserved**: {len(optimization_plan['preserve_files'])} critical files

## Results
- **Success**: {'✅ Yes' if execution_results['success'] else '❌ No'}
- **Errors**: {len(execution_results['errors'])}
- **Space Recovered**: {execution_results['space_saved'] / (1024*1024):.2f} MB

## Next Steps
1. Verify all critical functionality remains intact
2. Test core Alex AI systems
3. Push optimized repository to GitHub
4. Update documentation with new structure

## Files Preserved
"""
        
        for file_info in optimization_plan['preserve_files']:
            report += f"- {file_info['path']}: {file_info['reason']}\n"
        
        if execution_results['errors']:
            report += "\n## Errors Encountered\n"
            for error in execution_results['errors']:
                report += f"- {error}\n"
        
        return report
    
    def run_complete_optimization(self):
        """Run the complete optimization process"""
        print("🚀 ALEX AI REPOSITORY OPTIMIZATION SYSTEM")
        print("=" * 60)
        print("Convening Observation Lounge crew for strategic analysis...\n")
        
        # Step 1: Analyze current state
        analysis_data = self.analyze_large_files()
        
        # Step 2: Convene crew
        crew_insights = self.convene_observation_lounge(analysis_data)
        
        # Step 3: Create optimization plan
        optimization_plan = self.create_optimization_plan(analysis_data, crew_insights)
        
        # Step 4: Execute optimization
        execution_results = self.execute_optimization_plan(optimization_plan)
        
        # Step 5: Generate report
        report = self.generate_optimization_report(analysis_data, crew_insights, 
                                                 optimization_plan, execution_results)
        
        # Save report
        with open('repository_optimization_report.md', 'w') as f:
            f.write(report)
        
        print("\n" + "=" * 60)
        print("🎯 OPTIMIZATION COMPLETE")
        print("=" * 60)
        print(f"Files removed: {execution_results['files_removed']}")
        print(f"Space saved: {execution_results['space_saved'] / (1024*1024):.2f} MB")
        print(f"Report saved: repository_optimization_report.md")
        
        return {
            'analysis_data': analysis_data,
            'crew_insights': crew_insights,
            'optimization_plan': optimization_plan,
            'execution_results': execution_results,
            'report': report
        }

if __name__ == "__main__":
    analyzer = RepositoryOptimizationAnalyzer()
    results = analyzer.run_complete_optimization()
