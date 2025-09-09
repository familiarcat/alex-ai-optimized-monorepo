#!/usr/bin/env python3
"""
Script Analyzer & Memory System
===============================
Deep analysis of scripts folder with categorization, memory storage, and intelligent script discovery
"""

import os
import sys
import json
import hashlib
import re
from datetime import datetime
from typing import Dict, List, Set, Tuple, Optional
import logging
from dataclasses import dataclass, asdict
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ScriptMetadata:
    """Metadata for a script file"""
    file_path: str
    file_name: str
    file_type: str
    size_bytes: int
    line_count: int
    created_date: str
    modified_date: str
    hash: str
    purpose: str
    category: str
    subcategory: str
    dependencies: List[str]
    functions: List[str]
    variables: List[str]
    comments: List[str]
    complexity_score: int
    tags: List[str]
    related_scripts: List[str]

@dataclass
class ScriptCategory:
    """Category definition for scripts"""
    name: str
    description: str
    patterns: List[str]
    subcategories: Dict[str, str]
    examples: List[str]

class ScriptAnalyzer:
    def __init__(self, scripts_dir: str = "scripts"):
        self.scripts_dir = scripts_dir
        self.scripts_metadata: List[ScriptMetadata] = []
        self.categories = self.define_categories()
        self.memory_file = "script-memory.json"
        self.analysis_file = "script-analysis.json"
        
    def define_categories(self) -> Dict[str, ScriptCategory]:
        """Define script categories and their patterns"""
        return {
            "deployment": ScriptCategory(
                name="Deployment & Infrastructure",
                description="Scripts for deploying applications, setting up infrastructure, and managing environments",
                patterns=[
                    r"deploy", r"setup", r"install", r"configure", r"infrastructure",
                    r"production", r"staging", r"environment", r"server", r"hosting"
                ],
                subcategories={
                    "n8n_deployment": "N8N workflow deployment and management",
                    "supabase_setup": "Supabase database setup and configuration",
                    "environment_setup": "Development and production environment setup",
                    "ci_cd": "Continuous integration and deployment",
                    "docker": "Docker containerization and orchestration"
                },
                examples=["deploy.sh", "setup-environment.sh", "configure-n8n.sh"]
            ),
            
            "testing": ScriptCategory(
                name="Testing & Quality Assurance",
                description="Scripts for testing, validation, and quality assurance",
                patterns=[
                    r"test", r"validate", r"check", r"verify", r"e2e", r"unit",
                    r"integration", r"puppeteer", r"cypress", r"jest", r"quality"
                ],
                subcategories={
                    "e2e_testing": "End-to-end testing scripts",
                    "unit_testing": "Unit testing and validation",
                    "performance_testing": "Performance and load testing",
                    "security_testing": "Security validation and auditing",
                    "api_testing": "API endpoint testing"
                },
                examples=["e2e-test.sh", "validate-api.sh", "performance-test.js"]
            ),
            
            "data_management": ScriptCategory(
                name="Data Management & Processing",
                description="Scripts for data processing, migration, and management",
                patterns=[
                    r"data", r"migrate", r"import", r"export", r"transform",
                    r"populate", r"seed", r"backup", r"restore", r"sync"
                ],
                subcategories={
                    "database_ops": "Database operations and migrations",
                    "data_sync": "Data synchronization between systems",
                    "data_processing": "Data transformation and processing",
                    "backup_restore": "Data backup and restore operations",
                    "api_integration": "API data integration and processing"
                },
                examples=["migrate-data.sh", "sync-database.py", "backup-data.sh"]
            ),
            
            "ai_ml": ScriptCategory(
                name="AI & Machine Learning",
                description="Scripts for AI, ML, and intelligent automation",
                patterns=[
                    r"ai", r"ml", r"claude", r"openai", r"llm", r"prompt",
                    r"intelligence", r"automation", r"crew", r"agent", r"memory"
                ],
                subcategories={
                    "llm_integration": "Large Language Model integration",
                    "prompt_engineering": "Prompt engineering and optimization",
                    "ai_automation": "AI-powered automation scripts",
                    "memory_management": "AI memory and knowledge management",
                    "crew_coordination": "AI crew coordination and management"
                },
                examples=["claude-integration.py", "prompt-optimizer.sh", "ai-memory.py"]
            ),
            
            "security": ScriptCategory(
                name="Security & Authentication",
                description="Scripts for security, authentication, and credential management",
                patterns=[
                    r"security", r"auth", r"credential", r"key", r"token",
                    r"encrypt", r"decrypt", r"hash", r"password", r"api-key"
                ],
                subcategories={
                    "credential_management": "API key and credential management",
                    "authentication": "Authentication and authorization",
                    "encryption": "Data encryption and security",
                    "audit": "Security auditing and compliance",
                    "access_control": "Access control and permissions"
                },
                examples=["manage-credentials.sh", "security-audit.py", "encrypt-data.sh"]
            ),
            
            "monitoring": ScriptCategory(
                name="Monitoring & Analytics",
                description="Scripts for monitoring, logging, and analytics",
                patterns=[
                    r"monitor", r"log", r"analytics", r"metrics", r"dashboard",
                    r"health", r"status", r"alert", r"notification", r"report"
                ],
                subcategories={
                    "system_monitoring": "System health and performance monitoring",
                    "log_analysis": "Log processing and analysis",
                    "metrics_collection": "Metrics collection and reporting",
                    "alerting": "Alert and notification systems",
                    "dashboard": "Dashboard and visualization"
                },
                examples=["monitor-system.sh", "analyze-logs.py", "health-check.sh"]
            ),
            
            "utilities": ScriptCategory(
                name="Utilities & Tools",
                description="General utility scripts and tools",
                patterns=[
                    r"util", r"tool", r"helper", r"common", r"shared",
                    r"cleanup", r"optimize", r"format", r"convert", r"generate"
                ],
                subcategories={
                    "file_operations": "File and directory operations",
                    "text_processing": "Text processing and manipulation",
                    "system_utilities": "System-level utilities",
                    "code_generation": "Code generation and templating",
                    "cleanup": "Cleanup and maintenance operations"
                },
                examples=["cleanup-temp.sh", "format-code.py", "generate-config.js"]
            ),
            
            "workflow": ScriptCategory(
                name="Workflow & Automation",
                description="Scripts for workflow automation and process management",
                patterns=[
                    r"workflow", r"automation", r"process", r"pipeline",
                    r"milestone", r"sync", r"bidirectional", r"n8n", r"orchestration"
                ],
                subcategories={
                    "n8n_workflows": "N8N workflow management and automation",
                    "milestone_management": "Project milestone and version management",
                    "sync_operations": "Data and system synchronization",
                    "pipeline_automation": "CI/CD pipeline automation",
                    "orchestration": "Process orchestration and coordination"
                },
                examples=["sync-workflows.sh", "milestone-push.py", "orchestrate-tasks.sh"]
            )
        }
    
    def analyze_script(self, file_path: str) -> ScriptMetadata:
        """Analyze a single script file"""
        try:
            file_stat = os.stat(file_path)
            file_name = os.path.basename(file_path)
            file_type = file_path.split('.')[-1].lower()
            
            # Read file content
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Calculate hash
            file_hash = hashlib.sha256(content.encode()).hexdigest()[:16]
            
            # Analyze content
            lines = content.split('\n')
            line_count = len(lines)
            
            # Extract functions, variables, and comments
            functions = self.extract_functions(content, file_type)
            variables = self.extract_variables(content, file_type)
            comments = self.extract_comments(content, file_type)
            
            # Determine purpose and category
            purpose = self.determine_purpose(content, file_name)
            category, subcategory = self.categorize_script(content, file_name)
            
            # Calculate complexity score
            complexity_score = self.calculate_complexity(content, file_type)
            
            # Extract tags
            tags = self.extract_tags(content, file_name)
            
            # Find related scripts
            related_scripts = self.find_related_scripts(content, file_name)
            
            return ScriptMetadata(
                file_path=file_path,
                file_name=file_name,
                file_type=file_type,
                size_bytes=file_stat.st_size,
                line_count=line_count,
                created_date=datetime.fromtimestamp(file_stat.st_ctime).isoformat(),
                modified_date=datetime.fromtimestamp(file_stat.st_mtime).isoformat(),
                hash=file_hash,
                purpose=purpose,
                category=category,
                subcategory=subcategory,
                dependencies=self.extract_dependencies(content, file_type),
                functions=functions,
                variables=variables,
                comments=comments,
                complexity_score=complexity_score,
                tags=tags,
                related_scripts=related_scripts
            )
            
        except Exception as e:
            logger.error(f"Error analyzing {file_path}: {e}")
            return None
    
    def extract_functions(self, content: str, file_type: str) -> List[str]:
        """Extract function definitions from script content"""
        functions = []
        
        if file_type == 'py':
            # Python functions
            pattern = r'def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\('
            functions = re.findall(pattern, content)
        elif file_type == 'sh':
            # Bash functions
            pattern = r'^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)\s*\{'
            functions = re.findall(pattern, content, re.MULTILINE)
        elif file_type == 'js':
            # JavaScript functions
            pattern = r'(?:function\s+([a-zA-Z_][a-zA-Z0-9_]*)|const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\()'
            matches = re.findall(pattern, content)
            functions = [match[0] or match[1] for match in matches if match[0] or match[1]]
        
        return functions
    
    def extract_variables(self, content: str, file_type: str) -> List[str]:
        """Extract variable definitions from script content"""
        variables = []
        
        if file_type == 'py':
            # Python variables (simplified)
            pattern = r'^([a-zA-Z_][a-zA-Z0-9_]*)\s*='
            variables = re.findall(pattern, content, re.MULTILINE)
        elif file_type == 'sh':
            # Bash variables
            pattern = r'([a-zA-Z_][a-zA-Z0-9_]*)\s*='
            variables = re.findall(pattern, content)
        elif file_type == 'js':
            # JavaScript variables
            pattern = r'(?:const|let|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)'
            variables = re.findall(pattern, content)
        
        return list(set(variables))  # Remove duplicates
    
    def extract_comments(self, content: str, file_type: str) -> List[str]:
        """Extract comments from script content"""
        comments = []
        
        if file_type == 'py':
            # Python comments
            pattern = r'#\s*(.+)'
            comments = re.findall(pattern, content)
        elif file_type == 'sh':
            # Bash comments
            pattern = r'#\s*(.+)'
            comments = re.findall(pattern, content)
        elif file_type == 'js':
            # JavaScript comments
            pattern = r'//\s*(.+)|/\*\s*(.+?)\s*\*/'
            matches = re.findall(pattern, content, re.DOTALL)
            comments = [match[0] or match[1] for match in matches if match[0] or match[1]]
        
        return [c.strip() for c in comments if c.strip()]
    
    def determine_purpose(self, content: str, file_name: str) -> str:
        """Determine the purpose of the script"""
        # Look for purpose indicators in comments and content
        purpose_indicators = [
            r'# Purpose:\s*(.+)',
            r'# Description:\s*(.+)',
            r'# This script\s*(.+)',
            r'# TODO:\s*(.+)',
            r'# NOTE:\s*(.+)'
        ]
        
        for pattern in purpose_indicators:
            match = re.search(pattern, content, re.IGNORECASE)
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
    
    def categorize_script(self, content: str, file_name: str) -> Tuple[str, str]:
        """Categorize script based on content and filename"""
        content_lower = content.lower()
        file_name_lower = file_name.lower()
        
        # Check each category
        for category_name, category in self.categories.items():
            for pattern in category.patterns:
                if re.search(pattern, content_lower) or re.search(pattern, file_name_lower):
                    # Find best subcategory
                    best_subcategory = None
                    best_score = 0
                    
                    for subcat_name, subcat_desc in category.subcategories.items():
                        score = 0
                        if subcat_name in content_lower or subcat_name in file_name_lower:
                            score += 2
                        if any(word in content_lower for word in subcat_desc.lower().split()):
                            score += 1
                        
                        if score > best_score:
                            best_score = score
                            best_subcategory = subcat_name
                    
                    return category_name, best_subcategory or list(category.subcategories.keys())[0]
        
        return "utilities", "general"
    
    def calculate_complexity(self, content: str, file_type: str) -> int:
        """Calculate complexity score for the script"""
        score = 0
        
        # Base score from line count
        lines = content.split('\n')
        score += min(len(lines) // 10, 10)  # Max 10 points for length
        
        # Add points for complexity indicators
        complexity_patterns = [
            (r'if\s+', 1),  # Conditionals
            (r'for\s+', 1),  # Loops
            (r'while\s+', 1),  # While loops
            (r'function\s+', 2),  # Functions
            (r'def\s+', 2),  # Python functions
            (r'class\s+', 3),  # Classes
            (r'try\s*\{', 2),  # Error handling
            (r'catch\s*\(', 2),  # Error handling
            (r'except\s+', 2),  # Python error handling
            (r'curl\s+', 1),  # API calls
            (r'requests\.', 1),  # Python requests
            (r'axios\.', 1),  # JavaScript axios
        ]
        
        for pattern, points in complexity_patterns:
            matches = len(re.findall(pattern, content, re.IGNORECASE))
            score += matches * points
        
        return min(score, 100)  # Cap at 100
    
    def extract_tags(self, content: str, file_name: str) -> List[str]:
        """Extract relevant tags from script content"""
        tags = []
        
        # Common tags based on content
        tag_patterns = {
            'api': r'api|endpoint|http|curl|requests',
            'database': r'database|sql|supabase|postgres|mysql',
            'ai': r'ai|claude|openai|llm|prompt|intelligence',
            'n8n': r'n8n|workflow|automation',
            'security': r'security|auth|credential|key|token',
            'testing': r'test|validate|check|verify',
            'deployment': r'deploy|setup|install|configure',
            'monitoring': r'monitor|log|health|status|alert',
            'data': r'data|sync|migrate|import|export',
            'utility': r'util|helper|tool|cleanup|optimize'
        }
        
        content_lower = content.lower()
        for tag, pattern in tag_patterns.items():
            if re.search(pattern, content_lower) or tag in file_name.lower():
                tags.append(tag)
        
        return list(set(tags))
    
    def find_related_scripts(self, content: str, file_name: str) -> List[str]:
        """Find scripts that might be related to this one"""
        related = []
        
        # Look for script references in content
        script_refs = re.findall(r'\./([a-zA-Z0-9_-]+\.(?:sh|py|js))', content)
        related.extend(script_refs)
        
        # Look for common patterns that might indicate relationships
        if 'n8n' in content.lower():
            related.extend([f for f in os.listdir(self.scripts_dir) if 'n8n' in f.lower()])
        if 'test' in file_name.lower():
            related.extend([f for f in os.listdir(self.scripts_dir) if 'test' in f.lower()])
        if 'deploy' in file_name.lower():
            related.extend([f for f in os.listdir(self.scripts_dir) if 'deploy' in f.lower()])
        
        return list(set(related))
    
    def extract_dependencies(self, content: str, file_type: str) -> List[str]:
        """Extract dependencies from script content"""
        dependencies = []
        
        if file_type == 'py':
            # Python imports
            pattern = r'import\s+([a-zA-Z_][a-zA-Z0-9_]*)'
            dependencies.extend(re.findall(pattern, content))
        elif file_type == 'sh':
            # Bash dependencies (commands)
            pattern = r'^([a-zA-Z_][a-zA-Z0-9_-]*)\s*$'
            dependencies.extend(re.findall(pattern, content, re.MULTILINE))
        elif file_type == 'js':
            # JavaScript requires/imports
            pattern = r'require\([\'"]([^\'"]+)[\'"]\)|import\s+.*from\s+[\'"]([^\'"]+)[\'"]'
            matches = re.findall(pattern, content)
            dependencies.extend([match[0] or match[1] for match in matches])
        
        return list(set(dependencies))
    
    def analyze_all_scripts(self) -> List[ScriptMetadata]:
        """Analyze all scripts in the directory"""
        logger.info(f"Analyzing scripts in {self.scripts_dir}...")
        
        script_files = []
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')):
                    script_files.append(os.path.join(root, file))
        
        logger.info(f"Found {len(script_files)} script files")
        
        self.scripts_metadata = []
        for script_file in script_files:
            metadata = self.analyze_script(script_file)
            if metadata:
                self.scripts_metadata.append(metadata)
                logger.info(f"Analyzed: {metadata.file_name}")
        
        return self.scripts_metadata
    
    def generate_analysis_report(self) -> Dict:
        """Generate comprehensive analysis report"""
        if not self.scripts_metadata:
            self.analyze_all_scripts()
        
        # Categorize scripts
        category_stats = {}
        for script in self.scripts_metadata:
            category = script.category
            if category not in category_stats:
                category_stats[category] = {
                    'count': 0,
                    'total_lines': 0,
                    'total_size': 0,
                    'scripts': []
                }
            
            category_stats[category]['count'] += 1
            category_stats[category]['total_lines'] += script.line_count
            category_stats[category]['total_size'] += script.size_bytes
            category_stats[category]['scripts'].append({
                'name': script.file_name,
                'path': script.file_path,
                'lines': script.line_count,
                'purpose': script.purpose
            })
        
        # Find potential duplicates
        duplicates = self.find_potential_duplicates()
        
        # Find redundant scripts
        redundant = self.find_redundant_scripts()
        
        # Generate recommendations
        recommendations = self.generate_recommendations()
        
        return {
            'analysis_timestamp': datetime.now().isoformat(),
            'total_scripts': len(self.scripts_metadata),
            'total_lines': sum(s.line_count for s in self.scripts_metadata),
            'total_size': sum(s.size_bytes for s in self.scripts_metadata),
            'categories': category_stats,
            'potential_duplicates': duplicates,
            'redundant_scripts': redundant,
            'recommendations': recommendations,
            'scripts': [asdict(script) for script in self.scripts_metadata]
        }
    
    def find_potential_duplicates(self) -> List[Dict]:
        """Find potentially duplicate scripts"""
        duplicates = []
        
        # Group by hash
        hash_groups = {}
        for script in self.scripts_metadata:
            if script.hash not in hash_groups:
                hash_groups[script.hash] = []
            hash_groups[script.hash].append(script)
        
        # Find groups with multiple scripts
        for hash_val, scripts in hash_groups.items():
            if len(scripts) > 1:
                duplicates.append({
                    'hash': hash_val,
                    'scripts': [s.file_name for s in scripts],
                    'similarity': 'exact'
                })
        
        # Find scripts with similar names and purposes
        for i, script1 in enumerate(self.scripts_metadata):
            for script2 in self.scripts_metadata[i+1:]:
                if self.are_scripts_similar(script1, script2):
                    duplicates.append({
                        'scripts': [script1.file_name, script2.file_name],
                        'similarity': 'name_and_purpose',
                        'reason': f"Similar names and purposes: {script1.purpose} vs {script2.purpose}"
                    })
        
        return duplicates
    
    def are_scripts_similar(self, script1: ScriptMetadata, script2: ScriptMetadata) -> bool:
        """Check if two scripts are similar"""
        # Check name similarity
        name1_words = set(script1.file_name.lower().replace('.', ' ').split())
        name2_words = set(script2.file_name.lower().replace('.', ' ').split())
        name_similarity = len(name1_words.intersection(name2_words)) / len(name1_words.union(name2_words))
        
        # Check purpose similarity
        purpose1_words = set(script1.purpose.lower().split())
        purpose2_words = set(script2.purpose.lower().split())
        purpose_similarity = len(purpose1_words.intersection(purpose2_words)) / len(purpose1_words.union(purpose2_words))
        
        return name_similarity > 0.5 or purpose_similarity > 0.7
    
    def find_redundant_scripts(self) -> List[Dict]:
        """Find potentially redundant scripts"""
        redundant = []
        
        # Group by category and subcategory
        category_groups = {}
        for script in self.scripts_metadata:
            key = f"{script.category}_{script.subcategory}"
            if key not in category_groups:
                category_groups[key] = []
            category_groups[key].append(script)
        
        # Find categories with many similar scripts
        for key, scripts in category_groups.items():
            if len(scripts) > 3:  # More than 3 scripts in same category
                redundant.append({
                    'category': key,
                    'count': len(scripts),
                    'scripts': [s.file_name for s in scripts],
                    'recommendation': f"Consider consolidating {len(scripts)} scripts in {key}"
                })
        
        return redundant
    
    def generate_recommendations(self) -> List[Dict]:
        """Generate recommendations for script management"""
        recommendations = []
        
        # Analyze categories
        category_counts = {}
        for script in self.scripts_metadata:
            category_counts[script.category] = category_counts.get(script.category, 0) + 1
        
        # Find over-represented categories
        for category, count in category_counts.items():
            if count > 10:  # More than 10 scripts in one category
                recommendations.append({
                    'type': 'consolidation',
                    'category': category,
                    'count': count,
                    'message': f"Consider consolidating {count} scripts in {category} category"
                })
        
        # Find scripts with high complexity
        complex_scripts = [s for s in self.scripts_metadata if s.complexity_score > 50]
        if complex_scripts:
            recommendations.append({
                'type': 'refactoring',
                'scripts': [s.file_name for s in complex_scripts],
                'message': f"Consider refactoring {len(complex_scripts)} high-complexity scripts"
            })
        
        # Find scripts with many dependencies
        dependency_heavy = [s for s in self.scripts_metadata if len(s.dependencies) > 5]
        if dependency_heavy:
            recommendations.append({
                'type': 'dependency_management',
                'scripts': [s.file_name for s in dependency_heavy],
                'message': f"Consider reducing dependencies in {len(dependency_heavy)} scripts"
            })
        
        return recommendations
    
    def save_analysis(self, analysis: Dict):
        """Save analysis to file"""
        with open(self.analysis_file, 'w') as f:
            json.dump(analysis, f, indent=2)
        logger.info(f"Analysis saved to {self.analysis_file}")
    
    def save_memory(self, analysis: Dict):
        """Save analysis to memory system for future reference"""
        memory_data = {
            'timestamp': datetime.now().isoformat(),
            'total_scripts': analysis['total_scripts'],
            'categories': analysis['categories'],
            'duplicates': analysis['potential_duplicates'],
            'redundant': analysis['redundant_scripts'],
            'recommendations': analysis['recommendations']
        }
        
        with open(self.memory_file, 'w') as f:
            json.dump(memory_data, f, indent=2)
        logger.info(f"Memory saved to {self.memory_file}")
    
    def search_scripts(self, query: str) -> List[ScriptMetadata]:
        """Search for scripts based on query"""
        query_lower = query.lower()
        results = []
        
        for script in self.scripts_metadata:
            score = 0
            
            # Check filename
            if query_lower in script.file_name.lower():
                score += 3
            
            # Check purpose
            if query_lower in script.purpose.lower():
                score += 2
            
            # Check tags
            if any(query_lower in tag.lower() for tag in script.tags):
                score += 2
            
            # Check functions
            if any(query_lower in func.lower() for func in script.functions):
                score += 1
            
            if score > 0:
                results.append((script, score))
        
        # Sort by score
        results.sort(key=lambda x: x[1], reverse=True)
        return [script for script, score in results]

def main():
    """Main function"""
    print("🔍 Script Analyzer & Memory System")
    print("=" * 50)
    
    analyzer = ScriptAnalyzer()
    
    # Analyze all scripts
    print("📊 Analyzing scripts...")
    analysis = analyzer.generate_analysis_report()
    
    # Save analysis
    analyzer.save_analysis(analysis)
    analyzer.save_memory(analysis)
    
    # Print summary
    print(f"\n📈 Analysis Summary:")
    print(f"  Total Scripts: {analysis['total_scripts']}")
    print(f"  Total Lines: {analysis['total_lines']:,}")
    print(f"  Total Size: {analysis['total_size']:,} bytes")
    print(f"  Categories: {len(analysis['categories'])}")
    print(f"  Potential Duplicates: {len(analysis['potential_duplicates'])}")
    print(f"  Redundant Scripts: {len(analysis['redundant_scripts'])}")
    
    print(f"\n📁 Categories:")
    for category, stats in analysis['categories'].items():
        print(f"  {category}: {stats['count']} scripts")
    
    if analysis['potential_duplicates']:
        print(f"\n⚠️  Potential Duplicates:")
        for dup in analysis['potential_duplicates'][:5]:  # Show first 5
            print(f"  {dup['scripts']}")
    
    if analysis['recommendations']:
        print(f"\n💡 Recommendations:")
        for rec in analysis['recommendations'][:5]:  # Show first 5
            print(f"  {rec['message']}")
    
    print(f"\n✅ Analysis complete! Check {analyzer.analysis_file} for details.")

if __name__ == "__main__":
    main()
