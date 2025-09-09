from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Deep Code Analyzer
=================
Deep analysis of script code to identify true redundancy and consolidation opportunities
"""

import os
import json
import ast
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
class FunctionInfo:
    """Information about a function"""
    name: str
    parameters: List[str]
    return_type: str
    lines: int
    complexity: int
    calls: List[str]
    variables: List[str]
    docstring: str
    file_path: str
    start_line: int
    end_line: int

@dataclass
class ScriptAnalysis:
    """Complete analysis of a script"""
    file_path: str
    file_name: str
    file_type: str
    functions: List[FunctionInfo]
    variables: List[str]
    imports: List[str]
    classes: List[str]
    total_lines: int
    code_lines: int
    comment_lines: int
    complexity_score: int
    purpose: str
    dependencies: List[str]

class DeepCodeAnalyzer:
        self.script_analyses = {}
        self.function_registry = defaultdict(list)  # function_name -> list of FunctionInfo
        self.similarity_matrix = {}
        self.consolidation_groups = []
        
    def analyze_all_scripts(self) -> Dict[str, ScriptAnalysis]:
        """Perform deep analysis of all scripts"""
        logger.info("Starting deep code analysis...")
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.py', '.sh', '.js')) and not file.startswith('consolidated_'):
                    file_path = os.path.join(root, file)
                    analysis = self.analyze_script(file_path)
                    if analysis:
                        self.script_analyses[file_path] = analysis
                        self.register_functions(analysis)
        
        logger.info(f"Analyzed {len(self.script_analyses)} scripts")
        return self.script_analyses
    
    def analyze_script(self, file_path: str) -> ScriptAnalysis:
        """Analyze a single script file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            file_name = os.path.basename(file_path)
            file_type = file_path.split('.')[-1].lower()
            
            # Basic file info
            lines = content.split('\n')
            total_lines = len(lines)
            code_lines = len([line for line in lines if line.strip() and not line.strip().startswith('#')])
            comment_lines = len([line for line in lines if line.strip().startswith('#')])
            
            # Analyze based on file type
            if file_type == 'py':
                return self.analyze_python_script(file_path, content, file_name, total_lines, code_lines, comment_lines)
            elif file_type == 'sh':
                return self.analyze_bash_script(file_path, content, file_name, total_lines, code_lines, comment_lines)
            elif file_type == 'js':
                return self.analyze_javascript_script(file_path, content, file_name, total_lines, code_lines, comment_lines)
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error analyzing {file_path}: {e}")
            return None
    
    def analyze_python_script(self, file_path: str, content: str, file_name: str, 
                            total_lines: int, code_lines: int, comment_lines: int) -> ScriptAnalysis:
        """Analyze Python script"""
        try:
            tree = ast.parse(content)
            
            functions = []
            variables = []
            imports = []
            classes = []
            
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    func_info = self.extract_python_function(node, file_path, content)
                    functions.append(func_info)
                elif isinstance(node, ast.Import):
                    for alias in node.names:
                        imports.append(alias.name)
                elif isinstance(node, ast.ImportFrom):
                    for alias in node.names:
                        imports.append(f"{node.module}.{alias.name}" if node.module else alias.name)
                elif isinstance(node, ast.ClassDef):
                    classes.append(node.name)
                elif isinstance(node, ast.Assign):
                    for target in node.targets:
                        if isinstance(target, ast.Name):
                            variables.append(target.id)
            
            # Calculate complexity
            complexity = self.calculate_python_complexity(tree)
            
            # Determine purpose
            purpose = self.determine_script_purpose(content, file_name)
            
            return ScriptAnalysis(
                file_path=file_path,
                file_name=file_name,
                file_type='py',
                functions=functions,
                variables=variables,
                imports=imports,
                classes=classes,
                total_lines=total_lines,
                code_lines=code_lines,
                comment_lines=comment_lines,
                complexity_score=complexity,
                purpose=purpose,
                dependencies=imports
            )
            
        except Exception as e:
            logger.error(f"Error analyzing Python script {file_path}: {e}")
            return None
    
    def analyze_bash_script(self, file_path: str, content: str, file_name: str,
                          total_lines: int, code_lines: int, comment_lines: int) -> ScriptAnalysis:
        """Analyze Bash script"""
        functions = []
        variables = []
        imports = []
        classes = []
        
        # Extract functions
        func_pattern = r'^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)\s*\{'
        for match in re.finditer(func_pattern, content, re.MULTILINE):
            func_name = match.group(1)
            func_info = self.extract_bash_function(func_name, file_path, content)
            functions.append(func_info)
        
        # Extract variables
        var_pattern = r'([a-zA-Z_][a-zA-Z0-9_]*)\s*='
        for match in re.finditer(var_pattern, content):
            variables.append(match.group(1))
        
        # Extract source/import statements
        import_pattern = r'source\s+([^\s]+)|\.\s+([^\s]+)'
        for match in re.finditer(import_pattern, content):
            import_file = match.group(1) or match.group(2)
            imports.append(import_file)
        
        # Calculate complexity
        complexity = self.calculate_bash_complexity(content)
        
        # Determine purpose
        purpose = self.determine_script_purpose(content, file_name)
        
        return ScriptAnalysis(
            file_path=file_path,
            file_name=file_name,
            file_type='sh',
            functions=functions,
            variables=variables,
            imports=imports,
            classes=classes,
            total_lines=total_lines,
            code_lines=code_lines,
            comment_lines=comment_lines,
            complexity_score=complexity,
            purpose=purpose,
            dependencies=imports
        )
    
    def analyze_javascript_script(self, file_path: str, content: str, file_name: str,
                                total_lines: int, code_lines: int, comment_lines: int) -> ScriptAnalysis:
        """Analyze JavaScript script"""
        functions = []
        variables = []
        imports = []
        classes = []
        
        # Extract functions
        func_patterns = [
            r'function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(',
            r'const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\(',
            r'let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\(',
            r'var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\('
        ]
        
        for pattern in func_patterns:
            for match in re.finditer(pattern, content):
                func_name = match.group(1)
                func_info = self.extract_javascript_function(func_name, file_path, content)
                functions.append(func_info)
        
        # Extract variables
        var_patterns = [
            r'const\s+([a-zA-Z_][a-zA-Z0-9_]*)',
            r'let\s+([a-zA-Z_][a-zA-Z0-9_]*)',
            r'var\s+([a-zA-Z_][a-zA-Z0-9_]*)'
        ]
        
        for pattern in var_patterns:
            for match in re.finditer(pattern, content):
                variables.append(match.group(1))
        
        # Extract imports
        import_patterns = [
            r'require\([\'"]([^\'"]+)[\'"]\)',
            r'import\s+.*from\s+[\'"]([^\'"]+)[\'"]'
        ]
        
        for pattern in import_patterns:
            for match in re.finditer(pattern, content):
                imports.append(match.group(1))
        
        # Extract classes
        class_pattern = r'class\s+([a-zA-Z_][a-zA-Z0-9_]*)'
        for match in re.finditer(class_pattern, content):
            classes.append(match.group(1))
        
        # Calculate complexity
        complexity = self.calculate_javascript_complexity(content)
        
        # Determine purpose
        purpose = self.determine_script_purpose(content, file_name)
        
        return ScriptAnalysis(
            file_path=file_path,
            file_name=file_name,
            file_type='js',
            functions=functions,
            variables=variables,
            imports=imports,
            classes=classes,
            total_lines=total_lines,
            code_lines=code_lines,
            comment_lines=comment_lines,
            complexity_score=complexity,
            purpose=purpose,
            dependencies=imports
        )
    
    def extract_python_function(self, node: ast.FunctionDef, file_path: str, content: str) -> FunctionInfo:
        """Extract information from Python function"""
        lines = content.split('\n')
        start_line = node.lineno - 1
        end_line = node.end_lineno - 1 if hasattr(node, 'end_lineno') else start_line + 10
        
        # Extract parameters
        parameters = [arg.arg for arg in node.args.args]
        
        # Extract docstring
        docstring = ast.get_docstring(node) or ""
        
        # Extract function calls
        calls = []
        for child in ast.walk(node):
            if isinstance(child, ast.Call):
                if isinstance(child.func, ast.Name):
                    calls.append(child.func.id)
                elif isinstance(child.func, ast.Attribute):
                    calls.append(child.func.attr)
        
        # Extract variables
        variables = []
        for child in ast.walk(node):
            if isinstance(child, ast.Assign):
                for target in child.targets:
                    if isinstance(target, ast.Name):
                        variables.append(target.id)
        
        # Calculate complexity
        complexity = self.calculate_function_complexity(node)
        
        return FunctionInfo(
            name=node.name,
            parameters=parameters,
            return_type="",  # Python doesn't have explicit return types in this context
            lines=end_line - start_line + 1,
            complexity=complexity,
            calls=calls,
            variables=variables,
            docstring=docstring,
            file_path=file_path,
            start_line=start_line,
            end_line=end_line
        )
    
    def extract_bash_function(self, func_name: str, file_path: str, content: str) -> FunctionInfo:
        """Extract information from Bash function"""
        # Find function definition
        func_pattern = rf'^{func_name}\s*\(\s*\)\s*\{{(.*?)^\}}'
        match = re.search(func_pattern, content, re.MULTILINE | re.DOTALL)
        
        if not match:
            return FunctionInfo(
                name=func_name,
                parameters=[],
                return_type="",
                lines=0,
                complexity=0,
                calls=[],
                variables=[],
                docstring="",
                file_path=file_path,
                start_line=0,
                end_line=0
            )
        
        func_body = match.group(1)
        lines = func_body.split('\n')
        
        # Extract function calls
        calls = re.findall(r'(\w+)\s*\(', func_body)
        
        # Extract variables
        variables = re.findall(r'([a-zA-Z_][a-zA-Z0-9_]*)\s*=', func_body)
        
        # Calculate complexity
        complexity = self.calculate_bash_function_complexity(func_body)
        
        return FunctionInfo(
            name=func_name,
            parameters=[],
            return_type="",
            lines=len(lines),
            complexity=complexity,
            calls=calls,
            variables=variables,
            docstring="",
            file_path=file_path,
            start_line=0,
            end_line=0
        )
    
    def extract_javascript_function(self, func_name: str, file_path: str, content: str) -> FunctionInfo:
        """Extract information from JavaScript function"""
        # Find function definition
        func_patterns = [
            rf'function\s+{func_name}\s*\([^)]*\)\s*\{{(.*?)^\}}',
            rf'const\s+{func_name}\s*=\s*(?:async\s+)?\([^)]*\)\s*=>\s*\{{(.*?)^\}}',
            rf'let\s+{func_name}\s*=\s*(?:async\s+)?\([^)]*\)\s*=>\s*\{{(.*?)^\}}',
            rf'var\s+{func_name}\s*=\s*(?:async\s+)?\([^)]*\)\s*=>\s*\{{(.*?)^\}}'
        ]
        
        func_body = ""
        for pattern in func_patterns:
            match = re.search(pattern, content, re.MULTILINE | re.DOTALL)
            if match:
                func_body = match.group(1)
                break
        
        if not func_body:
            return FunctionInfo(
                name=func_name,
                parameters=[],
                return_type="",
                lines=0,
                complexity=0,
                calls=[],
                variables=[],
                docstring="",
                file_path=file_path,
                start_line=0,
                end_line=0
            )
        
        lines = func_body.split('\n')
        
        # Extract function calls
        calls = re.findall(r'(\w+)\s*\(', func_body)
        
        # Extract variables
        variables = re.findall(r'(?:const|let|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)', func_body)
        
        # Calculate complexity
        complexity = self.calculate_javascript_function_complexity(func_body)
        
        return FunctionInfo(
            name=func_name,
            parameters=[],
            return_type="",
            lines=len(lines),
            complexity=complexity,
            calls=calls,
            variables=variables,
            docstring="",
            file_path=file_path,
            start_line=0,
            end_line=0
        )
    
    def calculate_python_complexity(self, tree: ast.AST) -> int:
        """Calculate complexity for Python script"""
        complexity = 0
        
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.While, ast.For, ast.AsyncFor, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(node, ast.BoolOp):
                complexity += len(node.values) - 1
            elif isinstance(node, ast.ListComp):
                complexity += 1
        
        return complexity
    
    def calculate_bash_complexity(self, content: str) -> int:
        """Calculate complexity for Bash script"""
        complexity = 0
        
        # Count control structures
        patterns = [
            r'\bif\s+', r'\bwhile\s+', r'\bfor\s+', r'\bcase\s+',
            r'\b&&\b', r'\b\|\|\b', r'\b;\s*then\b'
        ]
        
        for pattern in patterns:
            complexity += len(re.findall(pattern, content))
        
        return complexity
    
    def calculate_javascript_complexity(self, content: str) -> int:
        """Calculate complexity for JavaScript script"""
        complexity = 0
        
        # Count control structures
        patterns = [
            r'\bif\s*\(', r'\bwhile\s*\(', r'\bfor\s*\(', r'\bswitch\s*\(',
            r'\b&&\b', r'\b\|\|\b', r'\?\s*.*\s*:', r'\bcatch\s*\('
        ]
        
        for pattern in patterns:
            complexity += len(re.findall(pattern, content))
        
        return complexity
    
    def calculate_function_complexity(self, node: ast.FunctionDef) -> int:
        """Calculate complexity for a single function"""
        complexity = 1  # Base complexity
        
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.AsyncFor, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(child, ast.BoolOp):
                complexity += len(child.values) - 1
        
        return complexity
    
    def calculate_bash_function_complexity(self, func_body: str) -> int:
        """Calculate complexity for Bash function"""
        complexity = 1
        
        patterns = [r'\bif\s+', r'\bwhile\s+', r'\bfor\s+', r'\bcase\s+']
        for pattern in patterns:
            complexity += len(re.findall(pattern, func_body))
        
        return complexity
    
    def calculate_javascript_function_complexity(self, func_body: str) -> int:
        """Calculate complexity for JavaScript function"""
        complexity = 1
        
        patterns = [r'\bif\s*\(', r'\bwhile\s*\(', r'\bfor\s*\(', r'\bswitch\s*\(']
        for pattern in patterns:
            complexity += len(re.findall(pattern, func_body))
        
        return complexity
    
    def determine_script_purpose(self, content: str, file_name: str) -> str:
        """Determine the purpose of a script"""
        # Look for purpose indicators in comments
        purpose_patterns = [
            r'# Purpose:\s*(.+)',
            r'# Description:\s*(.+)',
            r'// Purpose:\s*(.+)',
            r'// Description:\s*(.+)',
            r'/\*\s*Purpose:\s*(.+?)\s*\*/',
            r'/\*\s*Description:\s*(.+?)\s*\*/'
        ]
        
        for pattern in purpose_patterns:
            match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1).strip()
        
        # Fallback to filename analysis
        if 'test' in file_name.lower():
            return "Testing and validation"
        elif 'deploy' in file_name.lower():
            return "Deployment and setup"
        elif 'sync' in file_name.lower():
            return "Synchronization and data management"
        elif 'monitor' in file_name.lower():
            return "Monitoring and health checking"
        else:
            return "General utility script"
    
    def register_functions(self, analysis: ScriptAnalysis):
        """Register functions in the global registry"""
        for func in analysis.functions:
            self.function_registry[func.name].append(func)
    
    def find_duplicate_functions(self) -> Dict[str, List[FunctionInfo]]:
        """Find functions that appear in multiple scripts"""
        duplicates = {}
        
        for func_name, func_list in self.function_registry.items():
            if len(func_list) > 1:
                # Check if functions are similar
                similar_functions = []
                for i, func1 in enumerate(func_list):
                    for func2 in func_list[i+1:]:
                        if self.are_functions_similar(func1, func2):
                            if func_name not in similar_functions:
                                similar_functions.append(func_name)
                
                if similar_functions:
                    duplicates[func_name] = func_list
        
        return duplicates
    
    def are_functions_similar(self, func1: FunctionInfo, func2: FunctionInfo) -> bool:
        """Check if two functions are similar"""
        # Check parameter similarity
        if set(func1.parameters) != set(func2.parameters):
            return False
        
        # Check complexity similarity
        if abs(func1.complexity - func2.complexity) > 2:
            return False
        
        # Check line count similarity
        if abs(func1.lines - func2.lines) > 10:
            return False
        
        # Check call similarity
        calls1 = set(func1.calls)
        calls2 = set(func2.calls)
        call_similarity = len(calls1 & calls2) / len(calls1 | calls2) if (calls1 | calls2) else 1
        
        return call_similarity > 0.7
    
    def find_redundant_scripts(self) -> List[List[str]]:
        """Find scripts that have significant overlap"""
        redundant_groups = []
        processed_scripts = set()
        
        for script1_path, analysis1 in self.script_analyses.items():
            if script1_path in processed_scripts:
                continue
            
            redundant_group = [script1_path]
            processed_scripts.add(script1_path)
            
            for script2_path, analysis2 in self.script_analyses.items():
                if script2_path in processed_scripts:
                    continue
                
                if self.are_scripts_redundant(analysis1, analysis2):
                    redundant_group.append(script2_path)
                    processed_scripts.add(script2_path)
            
            if len(redundant_group) > 1:
                redundant_groups.append(redundant_group)
        
        return redundant_groups
    
    def are_scripts_redundant(self, analysis1: ScriptAnalysis, analysis2: ScriptAnalysis) -> bool:
        """Check if two scripts are redundant"""
        # Check function overlap
        funcs1 = {func.name for func in analysis1.functions}
        funcs2 = {func.name for func in analysis2.functions}
        
        if not funcs1 or not funcs2:
            return False
        
        func_overlap = len(funcs1 & funcs2) / len(funcs1 | funcs2)
        
        # Check variable overlap
        vars1 = set(analysis1.variables)
        vars2 = set(analysis2.variables)
        
        if vars1 and vars2:
            var_overlap = len(vars1 & vars2) / len(vars1 | vars2)
        else:
            var_overlap = 0
        
        # Check import overlap
        imports1 = set(analysis1.imports)
        imports2 = set(analysis2.imports)
        
        if imports1 and imports2:
            import_overlap = len(imports1 & imports2) / len(imports1 | imports2)
        else:
            import_overlap = 0
        
        # Check purpose similarity
        purpose1_words = set(analysis1.purpose.lower().split())
        purpose2_words = set(analysis2.purpose.lower().split())
        
        if purpose1_words and purpose2_words:
            purpose_overlap = len(purpose1_words & purpose2_words) / len(purpose1_words | purpose2_words)
        else:
            purpose_overlap = 0
        
        # Calculate overall similarity
        similarity = (func_overlap * 0.4 + var_overlap * 0.2 + import_overlap * 0.2 + purpose_overlap * 0.2)
        
        return similarity > 0.6
    
    def generate_consolidation_recommendations(self) -> Dict:
        """Generate consolidation recommendations based on deep analysis"""
        logger.info("Generating consolidation recommendations...")
        
        # Find duplicate functions
        duplicate_functions = self.find_duplicate_functions()
        
        # Find redundant scripts
        redundant_scripts = self.find_redundant_scripts()
        
        # Generate recommendations
        recommendations = {
            "duplicate_functions": duplicate_functions,
            "redundant_scripts": redundant_scripts,
            "consolidation_plan": self.create_consolidation_plan(duplicate_functions, redundant_scripts),
            "estimated_savings": self.calculate_estimated_savings(duplicate_functions, redundant_scripts)
        }
        
        return recommendations
    
    def create_consolidation_plan(self, duplicate_functions: Dict, redundant_scripts: List) -> Dict:
        """Create detailed consolidation plan"""
        plan = {
            "function_consolidations": [],
            "script_consolidations": [],
            "merge_candidates": []
        }
        
        # Function consolidations
        for func_name, func_list in duplicate_functions.items():
            if len(func_list) > 1:
                # Find the best implementation to keep
                best_func = max(func_list, key=lambda f: f.complexity + f.lines)
                other_funcs = [f for f in func_list if f != best_func]
                
                plan["function_consolidations"].append({
                    "function_name": func_name,
                    "keep_implementation": best_func.file_path,
                    "remove_from": [f.file_path for f in other_funcs],
                    "reason": f"Duplicate function found in {len(func_list)} scripts"
                })
        
        # Script consolidations
        for script_group in redundant_scripts:
            if len(script_group) > 1:
                # Find the most comprehensive script to keep
                analyses = [self.script_analyses[path] for path in script_group]
                best_script = max(analyses, key=lambda a: a.complexity_score + a.code_lines)
                other_scripts = [a for a in analyses if a != best_script]
                
                plan["script_consolidations"].append({
                    "keep_script": best_script.file_path,
                    "merge_from": [a.file_path for a in other_scripts],
                    "reason": f"Redundant scripts with {len(script_group)} similar implementations"
                })
        
        return plan
    
    def calculate_estimated_savings(self, duplicate_functions: Dict, redundant_scripts: List) -> Dict:
        """Calculate estimated savings from consolidation"""
        function_savings = 0
        script_savings = 0
        
        # Calculate function savings
        for func_name, func_list in duplicate_functions.items():
            if len(func_list) > 1:
                # Keep the best one, remove others
                function_savings += sum(func.lines for func in func_list[1:])
        
        # Calculate script savings
        for script_group in redundant_scripts:
            if len(script_group) > 1:
                analyses = [self.script_analyses[path] for path in script_group]
                # Keep the best one, remove others
                script_savings += sum(a.code_lines for a in analyses[1:])
        
        return {
            "function_savings_lines": function_savings,
            "script_savings_lines": script_savings,
            "total_savings_lines": function_savings + script_savings,
            "duplicate_functions_count": len(duplicate_functions),
            "redundant_scripts_count": len(redundant_scripts)
        }
    
    def save_analysis(self, output_file: str = "deep-code-analysis.json"):
        """Save analysis results to file"""
        analysis_data = {
            "timestamp": datetime.now().isoformat(),
            "total_scripts": len(self.script_analyses),
            "script_analyses": {
                path: {
                    "file_name": analysis.file_name,
                    "file_type": analysis.file_type,
                    "functions": [
                        {
                            "name": func.name,
                            "parameters": func.parameters,
                            "lines": func.lines,
                            "complexity": func.complexity,
                            "calls": func.calls,
                            "variables": func.variables
                        } for func in analysis.functions
                    ],
                    "variables": analysis.variables,
                    "imports": analysis.imports,
                    "classes": analysis.classes,
                    "total_lines": analysis.total_lines,
                    "code_lines": analysis.code_lines,
                    "complexity_score": analysis.complexity_score,
                    "purpose": analysis.purpose
                } for path, analysis in self.script_analyses.items()
            },
            "function_registry": {
                func_name: [
                    {
                        "file_path": func.file_path,
                        "parameters": func.parameters,
                        "lines": func.lines,
                        "complexity": func.complexity
                    } for func in func_list
                ] for func_name, func_list in self.function_registry.items()
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(analysis_data, f, indent=2)
        
        logger.info(f"Analysis saved to {output_file}")
    
    def save_recommendations(self, recommendations: Dict, output_file: str = "consolidation-recommendations.json"):
        """Save recommendations to file with proper serialization"""
        # Convert FunctionInfo objects to dictionaries
        serializable_recommendations = {
            "duplicate_functions": {
                func_name: [
                    {
                        "name": func.name,
                        "file_path": func.file_path,
                        "parameters": func.parameters,
                        "lines": func.lines,
                        "complexity": func.complexity,
                        "calls": func.calls,
                        "variables": func.variables
                    } for func in func_list
                ] for func_name, func_list in recommendations["duplicate_functions"].items()
            },
            "redundant_scripts": recommendations["redundant_scripts"],
            "consolidation_plan": recommendations["consolidation_plan"],
            "estimated_savings": recommendations["estimated_savings"]
        }
        
        with open(output_file, 'w') as f:
            json.dump(serializable_recommendations, f, indent=2)
        
        logger.info(f"Recommendations saved to {output_file}")

    print("🔍 Deep Code Analyzer")
    print("=" * 30)
    
    analyzer = DeepCodeAnalyzer()
    
    # Analyze all scripts
    print("📊 Analyzing scripts...")
    analyses = analyzer.analyze_all_scripts()
    
    print(f"✅ Analyzed {len(analyses)} scripts")
    
    # Find duplicates and redundancies
    print("🔍 Finding duplicates and redundancies...")
    duplicate_functions = analyzer.find_duplicate_functions()
    redundant_scripts = analyzer.find_redundant_scripts()
    
    print(f"📋 Found {len(duplicate_functions)} duplicate functions")
    print(f"📋 Found {len(redundant_scripts)} redundant script groups")
    
    # Generate recommendations
    recommendations = analyzer.generate_consolidation_recommendations()
    
    # Print summary
    print(f"\n📊 Analysis Summary:")
    print(f"  Total Scripts: {len(analyses)}")
    print(f"  Duplicate Functions: {len(duplicate_functions)}")
    print(f"  Redundant Script Groups: {len(redundant_scripts)}")
    print(f"  Estimated Savings: {recommendations['estimated_savings']['total_savings_lines']} lines")
    
    # Save analysis
    analyzer.save_analysis()
    
    # Save recommendations
    analyzer.save_recommendations(recommendations)
    
    print(f"\n✅ Analysis complete!")
    print(f"📁 Results saved to:")
    print(f"  - deep-code-analysis.json")
    print(f"  - consolidation-recommendations.json")

if __name__ == "__main__":
    main()
