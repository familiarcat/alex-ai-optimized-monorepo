#!/usr/bin/env python3
"""
Comprehensive Folder Analyzer
============================
Deep analysis of existing folder structure to identify redundancy and optimization opportunities
"""

import os
import json
import re
from datetime import datetime
from typing import Dict, List, Set, Tuple, Any
import logging
from dataclasses import dataclass
from collections import defaultdict

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ScriptInfo:
    """Script information"""
    file_path: str
    file_name: str
    file_type: str
    folder_path: str
    folder_name: str
    size_bytes: int
    lines: int
    content_preview: str
    functions: List[str]
    imports: List[str]
    purpose: str
    complexity: int
    last_modified: str

@dataclass
class FolderAnalysis:
    """Folder analysis result"""
    folder_path: str
    folder_name: str
    script_count: int
    total_size: int
    total_lines: int
    scripts: List[ScriptInfo]
    redundancy_score: float
    consolidation_opportunities: List[str]
    recommended_actions: List[str]
    subfolders: List[str]

class ComprehensiveFolderAnalyzer:
    def __init__(self, scripts_dir: str = "scripts"):
        self.scripts_dir = scripts_dir
        self.folder_analyses = {}
        self.all_scripts = []
        self.redundancy_map = defaultdict(list)
        self.consolidation_opportunities = []
        self.deprecated_scripts = []
        self.optimization_recommendations = {}
        
    def analyze_all_folders(self) -> Dict:
        """Perform comprehensive analysis of all folders"""
        logger.info("🔍 Starting Comprehensive Folder Analysis...")
        
        try:
            # Step 1: Discover all scripts and folders
            self.discover_all_scripts_and_folders()
            logger.info(f"📁 Discovered {len(self.all_scripts)} scripts in {len(self.folder_analyses)} folders")
            
            # Step 2: Analyze each folder
            self.analyze_each_folder()
            
            # Step 3: Find cross-folder redundancy
            self.find_cross_folder_redundancy()
            
            # Step 4: Identify consolidation opportunities
            self.identify_consolidation_opportunities()
            
            # Step 5: Find deprecated scripts
            self.find_deprecated_scripts()
            
            # Step 6: Generate optimization recommendations
            self.generate_optimization_recommendations()
            
            # Step 7: Create restructuring plan
            restructuring_plan = self.create_restructuring_plan()
            
            return {
                "status": "success",
                "total_scripts": len(self.all_scripts),
                "total_folders": len(self.folder_analyses),
                "redundancy_opportunities": len(self.consolidation_opportunities),
                "deprecated_scripts": len(self.deprecated_scripts),
                "optimization_recommendations": len(self.optimization_recommendations),
                "restructuring_plan": restructuring_plan
            }
            
        except Exception as e:
            logger.error(f"Error in comprehensive analysis: {e}")
            return {"status": "error", "message": str(e)}
    
    def discover_all_scripts_and_folders(self):
        """Discover all scripts and folders"""
        for root, dirs, files in os.walk(self.scripts_dir):
            folder_path = os.path.relpath(root, self.scripts_dir)
            folder_name = os.path.basename(root)
            
            # Initialize folder analysis
            self.folder_analyses[folder_path] = FolderAnalysis(
                folder_path=folder_path,
                folder_name=folder_name,
                script_count=0,
                total_size=0,
                total_lines=0,
                scripts=[],
                redundancy_score=0.0,
                consolidation_opportunities=[],
                recommended_actions=[],
                subfolders=dirs
            )
            
            # Process scripts in this folder
            for file in files:
                if file.endswith(('.py', '.sh', '.js', '.html', '.json')):
                    file_path = os.path.join(root, file)
                    script_info = self.analyze_script(file_path, folder_path, folder_name)
                    
                    if script_info:
                        self.all_scripts.append(script_info)
                        self.folder_analyses[folder_path].scripts.append(script_info)
                        self.folder_analyses[folder_path].script_count += 1
                        self.folder_analyses[folder_path].total_size += script_info.size_bytes
                        self.folder_analyses[folder_path].total_lines += script_info.lines
    
    def analyze_script(self, file_path: str, folder_path: str, folder_name: str) -> ScriptInfo:
        """Analyze a single script"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            file_name = os.path.basename(file_path)
            file_type = file_path.split('.')[-1]
            
            # Get file stats
            stat = os.stat(file_path)
            size_bytes = stat.st_size
            lines = len(content.split('\n'))
            last_modified = datetime.fromtimestamp(stat.st_mtime).isoformat()
            
            # Extract functions
            functions = self.extract_functions(content, file_type)
            
            # Extract imports
            imports = self.extract_imports(content, file_type)
            
            # Determine purpose
            purpose = self.determine_purpose(file_name, content)
            
            # Calculate complexity
            complexity = self.calculate_complexity(content, file_type)
            
            return ScriptInfo(
                file_path=file_path,
                file_name=file_name,
                file_type=file_type,
                folder_path=folder_path,
                folder_name=folder_name,
                size_bytes=size_bytes,
                lines=lines,
                content_preview=content[:500],
                functions=functions,
                imports=imports,
                purpose=purpose,
                complexity=complexity,
                last_modified=last_modified
            )
            
        except Exception as e:
            logger.error(f"Error analyzing script {file_path}: {e}")
            return None
    
    def extract_functions(self, content: str, file_type: str) -> List[str]:
        """Extract function names from script content"""
        functions = []
        
        if file_type == 'py':
            # Python functions
            func_pattern = r'def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\('
            functions = re.findall(func_pattern, content)
        elif file_type == 'sh':
            # Bash functions
            func_pattern = r'^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)\s*\{'
            functions = re.findall(func_pattern, content, re.MULTILINE)
        elif file_type == 'js':
            # JavaScript functions
            func_patterns = [
                r'function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(',
                r'const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\(',
                r'let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\(',
                r'var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\('
            ]
            for pattern in func_patterns:
                functions.extend(re.findall(pattern, content))
        
        return list(set(functions))  # Remove duplicates
    
    def extract_imports(self, content: str, file_type: str) -> List[str]:
        """Extract import statements from script content"""
        imports = []
        
        if file_type == 'py':
            # Python imports
            import_patterns = [
                r'import\s+([a-zA-Z_][a-zA-Z0-9_]*)',
                r'from\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+import'
            ]
            for pattern in import_patterns:
                imports.extend(re.findall(pattern, content))
        elif file_type == 'sh':
            # Bash source/import
            import_patterns = [
                r'source\s+([^\s]+)',
                r'\.\s+([^\s]+)'
            ]
            for pattern in import_patterns:
                imports.extend(re.findall(pattern, content))
        elif file_type == 'js':
            # JavaScript imports
            import_patterns = [
                r'require\([\'"]([^\'"]+)[\'"]\)',
                r'import\s+.*from\s+[\'"]([^\'"]+)[\'"]'
            ]
            for pattern in import_patterns:
                imports.extend(re.findall(pattern, content))
        
        return list(set(imports))  # Remove duplicates
    
    def determine_purpose(self, file_name: str, content: str) -> str:
        """Determine script purpose"""
        file_lower = file_name.lower()
        content_lower = content.lower()
        
        # Check filename patterns
        if 'test' in file_lower:
            return "Testing and Validation"
        elif 'deploy' in file_lower:
            return "Deployment and Setup"
        elif 'sync' in file_lower:
            return "Synchronization"
        elif 'monitor' in file_lower:
            return "Monitoring"
        elif 'milestone' in file_lower:
            return "Version Control"
        elif 'setup' in file_lower:
            return "Environment Setup"
        elif 'analyze' in file_lower:
            return "Analysis"
        elif 'clean' in file_lower or 'cleanup' in file_lower:
            return "Maintenance"
        elif 'security' in file_lower:
            return "Security"
        elif 'production' in file_lower:
            return "Production Operations"
        elif 'n8n' in file_lower:
            return "N8N Integration"
        elif 'ai' in file_lower or 'alex' in file_lower:
            return "AI Systems"
        elif 'crew' in file_lower:
            return "Crew Management"
        elif 'memory' in file_lower:
            return "Memory Management"
        elif 'yolo' in file_lower:
            return "YOLO Mode"
        else:
            return "General Utility"
    
    def calculate_complexity(self, content: str, file_type: str) -> int:
        """Calculate script complexity (1-10)"""
        complexity = 1
        
        # Count control structures
        if file_type == 'py':
            complexity += content.count('if ') + content.count('for ') + content.count('while ')
            complexity += content.count('try:') + content.count('except')
            complexity += content.count('class ') * 2
            complexity += content.count('def ') * 0.5
            complexity += content.count('async') * 2
        elif file_type == 'sh':
            complexity += content.count('if ') + content.count('for ') + content.count('while ')
            complexity += content.count('case ') + content.count('&&') + content.count('||')
        elif file_type == 'js':
            complexity += content.count('if ') + content.count('for ') + content.count('while ')
            complexity += content.count('switch') + content.count('&&') + content.count('||')
            complexity += content.count('function') * 0.5
            complexity += content.count('class ') * 2
        
        return min(int(complexity), 10)
    
    def analyze_each_folder(self):
        """Analyze each folder for redundancy and optimization opportunities"""
        for folder_path, folder_analysis in self.folder_analyses.items():
            if folder_analysis.script_count > 0:
                # Calculate redundancy score
                folder_analysis.redundancy_score = self.calculate_folder_redundancy(folder_analysis)
                
                # Find consolidation opportunities within folder
                folder_analysis.consolidation_opportunities = self.find_within_folder_consolidation(folder_analysis)
                
                # Generate recommended actions
                folder_analysis.recommended_actions = self.generate_folder_recommendations(folder_analysis)
    
    def calculate_folder_redundancy(self, folder_analysis: FolderAnalysis) -> float:
        """Calculate redundancy score for a folder (0-1)"""
        if folder_analysis.script_count < 2:
            return 0.0
        
        scripts = folder_analysis.scripts
        total_similarity = 0.0
        comparisons = 0
        
        for i, script1 in enumerate(scripts):
            for script2 in scripts[i+1:]:
                similarity = self.calculate_script_similarity(script1, script2)
                total_similarity += similarity
                comparisons += 1
        
        return total_similarity / comparisons if comparisons > 0 else 0.0
    
    def calculate_script_similarity(self, script1: ScriptInfo, script2: ScriptInfo) -> float:
        """Calculate similarity between two scripts (0-1)"""
        similarity = 0.0
        
        # Check purpose similarity
        if script1.purpose == script2.purpose:
            similarity += 0.3
        
        # Check function overlap
        func1_set = set(script1.functions)
        func2_set = set(script2.functions)
        if func1_set or func2_set:
            func_overlap = len(func1_set & func2_set) / len(func1_set | func2_set)
            similarity += func_overlap * 0.3
        
        # Check import overlap
        import1_set = set(script1.imports)
        import2_set = set(script2.imports)
        if import1_set or import2_set:
            import_overlap = len(import1_set & import2_set) / len(import1_set | import2_set)
            similarity += import_overlap * 0.2
        
        # Check filename similarity
        name1 = script1.file_name.lower()
        name2 = script2.file_name.lower()
        name_similarity = self.calculate_name_similarity(name1, name2)
        similarity += name_similarity * 0.2
        
        return min(similarity, 1.0)
    
    def calculate_name_similarity(self, name1: str, name2: str) -> float:
        """Calculate filename similarity"""
        words1 = set(name1.replace('_', ' ').replace('-', ' ').split())
        words2 = set(name2.replace('_', ' ').replace('-', ' ').split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        return intersection / union if union > 0 else 0.0
    
    def find_within_folder_consolidation(self, folder_analysis: FolderAnalysis) -> List[str]:
        """Find consolidation opportunities within a folder"""
        opportunities = []
        scripts = folder_analysis.scripts
        
        for i, script1 in enumerate(scripts):
            for script2 in scripts[i+1:]:
                similarity = self.calculate_script_similarity(script1, script2)
                if similarity > 0.7:  # High similarity threshold
                    opportunities.append(f"{script1.file_name} + {script2.file_name} (similarity: {similarity:.2f})")
        
        return opportunities
    
    def generate_folder_recommendations(self, folder_analysis: FolderAnalysis) -> List[str]:
        """Generate recommendations for a folder"""
        recommendations = []
        
        if folder_analysis.redundancy_score > 0.7:
            recommendations.append("High redundancy detected - consider consolidating similar scripts")
        
        if folder_analysis.script_count > 20:
            recommendations.append("Large number of scripts - consider creating subfolders")
        
        if folder_analysis.consolidation_opportunities:
            recommendations.append(f"Found {len(folder_analysis.consolidation_opportunities)} consolidation opportunities")
        
        # Check for mixed purposes
        purposes = [script.purpose for script in folder_analysis.scripts]
        if len(set(purposes)) > 3:
            recommendations.append("Mixed purposes detected - consider reorganizing by purpose")
        
        return recommendations
    
    def find_cross_folder_redundancy(self):
        """Find redundancy across different folders"""
        for i, script1 in enumerate(self.all_scripts):
            for script2 in self.all_scripts[i+1:]:
                if script1.folder_path != script2.folder_path:
                    similarity = self.calculate_script_similarity(script1, script2)
                    if similarity > 0.8:  # Very high similarity threshold for cross-folder
                        self.redundancy_map[script1.file_name].append({
                            "script": script2,
                            "similarity": similarity,
                            "reason": f"Similar {script1.purpose} functionality"
                        })
    
    def identify_consolidation_opportunities(self):
        """Identify consolidation opportunities"""
        for script_name, similar_scripts in self.redundancy_map.items():
            if len(similar_scripts) > 0:
                self.consolidation_opportunities.append({
                    "primary_script": script_name,
                    "similar_scripts": similar_scripts,
                    "recommended_action": "Consider consolidating into single script"
                })
    
    def find_deprecated_scripts(self):
        """Find deprecated scripts"""
        deprecation_indicators = [
            'old', 'deprecated', 'legacy', 'backup', 'temp',
            'test_', 'debug', 'experimental', 'unused', 'broken'
        ]
        
        for script in self.all_scripts:
            file_lower = script.file_name.lower()
            
            for indicator in deprecation_indicators:
                if indicator in file_lower:
                    self.deprecated_scripts.append({
                        "script_path": script.file_path,
                        "script_name": script.file_name,
                        "folder": script.folder_path,
                        "deprecation_reason": f"Contains '{indicator}' indicator",
                        "recommended_action": "Remove or archive"
                    })
                    break
    
    def generate_optimization_recommendations(self):
        """Generate optimization recommendations"""
        # Analyze folder structure
        for folder_path, folder_analysis in self.folder_analyses.items():
            if folder_analysis.script_count > 0:
                recommendations = []
                
                # Check for oversized folders
                if folder_analysis.script_count > 15:
                    recommendations.append("Consider splitting into subfolders")
                
                # Check for underutilized folders
                if folder_analysis.script_count < 3 and folder_path != '.':
                    recommendations.append("Consider merging with parent folder")
                
                # Check for mixed file types
                file_types = set(script.file_type for script in folder_analysis.scripts)
                if len(file_types) > 3:
                    recommendations.append("Consider organizing by file type")
                
                if recommendations:
                    self.optimization_recommendations[folder_path] = {
                        "folder_name": folder_analysis.folder_name,
                        "script_count": folder_analysis.script_count,
                        "recommendations": recommendations
                    }
    
    def create_restructuring_plan(self) -> Dict:
        """Create restructuring plan"""
        plan = {
            "phase_1": {
                "name": "Remove Deprecated Scripts",
                "actions": [
                    f"Remove {len(self.deprecated_scripts)} deprecated scripts",
                    "Archive important deprecated scripts",
                    "Update references to removed scripts"
                ]
            },
            "phase_2": {
                "name": "Consolidate Redundant Scripts",
                "actions": [
                    f"Consolidate {len(self.consolidation_opportunities)} redundant script groups",
                    "Merge similar functionality",
                    "Update imports and references"
                ]
            },
            "phase_3": {
                "name": "Reorganize Folder Structure",
                "actions": [
                    "Split oversized folders into subfolders",
                    "Merge underutilized folders",
                    "Organize by purpose and file type"
                ]
            },
            "phase_4": {
                "name": "Optimize and Validate",
                "actions": [
                    "Update all script references",
                    "Test consolidated scripts",
                    "Update documentation"
                ]
            }
        }
        
        return plan
    
    def save_analysis_results(self):
        """Save analysis results"""
        # Save comprehensive analysis
        analysis_data = {
            "timestamp": datetime.now().isoformat(),
            "total_scripts": len(self.all_scripts),
            "total_folders": len(self.folder_analyses),
            "folder_analyses": {
                path: {
                    "folder_name": analysis.folder_name,
                    "script_count": analysis.script_count,
                    "total_size": analysis.total_size,
                    "total_lines": analysis.total_lines,
                    "redundancy_score": analysis.redundancy_score,
                    "consolidation_opportunities": analysis.consolidation_opportunities,
                    "recommended_actions": analysis.recommended_actions,
                    "scripts": [
                        {
                            "file_name": script.file_name,
                            "file_type": script.file_type,
                            "size_bytes": script.size_bytes,
                            "lines": script.lines,
                            "purpose": script.purpose,
                            "complexity": script.complexity,
                            "functions": script.functions,
                            "imports": script.imports
                        } for script in analysis.scripts
                    ]
                } for path, analysis in self.folder_analyses.items()
            },
            "consolidation_opportunities": self.consolidation_opportunities,
            "deprecated_scripts": self.deprecated_scripts,
            "optimization_recommendations": self.optimization_recommendations
        }
        
        with open('comprehensive-folder-analysis.json', 'w') as f:
            json.dump(analysis_data, f, indent=2)
        
        # Save restructuring plan
        with open('folder-restructuring-plan.json', 'w') as f:
            json.dump(self.create_restructuring_plan(), f, indent=2)
        
        logger.info("📁 Analysis results saved to files")

def main():
    """Main function"""
    print("🔍 Comprehensive Folder Analyzer")
    print("=" * 40)
    
    analyzer = ComprehensiveFolderAnalyzer()
    
    # Perform comprehensive analysis
    results = analyzer.analyze_all_folders()
    
    if results["status"] == "success":
        print(f"\n✅ Comprehensive Analysis Complete!")
        print(f"📊 Results Summary:")
        print(f"  Total Scripts: {results['total_scripts']}")
        print(f"  Total Folders: {results['total_folders']}")
        print(f"  Consolidation Opportunities: {results['redundancy_opportunities']}")
        print(f"  Deprecated Scripts: {results['deprecated_scripts']}")
        print(f"  Optimization Recommendations: {results['optimization_recommendations']}")
        
        # Save results
        analyzer.save_analysis_results()
        
        print(f"\n📁 Results saved to:")
        print(f"  - comprehensive-folder-analysis.json")
        print(f"  - folder-restructuring-plan.json")
        
    else:
        print(f"❌ Analysis failed: {results['message']}")

if __name__ == "__main__":
    main()










