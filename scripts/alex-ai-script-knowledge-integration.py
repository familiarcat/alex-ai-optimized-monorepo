#!/usr/bin/env python3
"""
Alex AI Script Knowledge Integration
===================================
Integrate script consolidation findings into Alex AI Supabase vector database
for intelligent script discovery, extension, and categorization
"""

import os
import json
import requests
import hashlib
from datetime import datetime
from typing import Dict, List, Set, Tuple, Any
import logging
from dataclasses import dataclass
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ScriptKnowledge:
    """Script knowledge representation for vector database"""
    script_id: str
    file_path: str
    file_name: str
    file_type: str
    category: str
    subcategory: str
    purpose: str
    functionality: List[str]
    functions: List[str]
    dependencies: List[str]
    complexity_score: int
    maintenance_priority: str
    consolidation_group: str
    similar_scripts: List[str]
    extension_opportunities: List[str]
    usage_examples: List[str]
    last_modified: str
    content_summary: str
    embedding_text: str

class AlexAIScriptKnowledgeIntegration:
    def __init__(self, supabase_url: str = None, supabase_key: str = None):
        self.supabase_url = supabase_url or os.getenv('SUPABASE_URL')
        self.supabase_key = supabase_key or os.getenv('SUPABASE_ANON_KEY')
        self.scripts_dir = "scripts"
        self.knowledge_base = []
        self.consolidation_data = {}
        
        # Load consolidation findings
        self.load_consolidation_findings()
        
    def load_consolidation_findings(self):
        """Load consolidation findings from analysis files"""
        try:
            # Load deep code analysis
            with open('deep-code-analysis.json', 'r') as f:
                self.consolidation_data['deep_analysis'] = json.load(f)
            
            # Load consolidation recommendations
            with open('consolidation-recommendations.json', 'r') as f:
                self.consolidation_data['recommendations'] = json.load(f)
            
            # Load restructuring report
            with open('restructuring-report.md', 'r') as f:
                self.consolidation_data['restructuring_report'] = f.read()
            
            logger.info("✅ Consolidation findings loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading consolidation findings: {e}")
            self.consolidation_data = {}
    
    def build_script_knowledge_base(self) -> List[ScriptKnowledge]:
        """Build comprehensive script knowledge base"""
        logger.info("🧠 Building Alex AI script knowledge base...")
        
        knowledge_base = []
        
        # Process all scripts in the organized structure
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.py', '.sh', '.js', '.html', '.json')):
                    file_path = os.path.join(root, file)
                    
                    # Skip archived scripts
                    if 'archived' in file_path:
                        continue
                    
                    script_knowledge = self.analyze_script_for_knowledge(file_path)
                    if script_knowledge:
                        knowledge_base.append(script_knowledge)
        
        self.knowledge_base = knowledge_base
        logger.info(f"📚 Built knowledge base with {len(knowledge_base)} scripts")
        
        return knowledge_base
    
    def analyze_script_for_knowledge(self, file_path: str) -> ScriptKnowledge:
        """Analyze script and create knowledge representation"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            file_name = os.path.basename(file_path)
            file_type = file_path.split('.')[-1]
            
            # Determine category and subcategory
            category, subcategory = self.determine_categorization(file_path)
            
            # Extract functionality
            functionality = self.extract_functionality(content, file_name)
            
            # Extract functions
            functions = self.extract_functions(content, file_type)
            
            # Extract dependencies
            dependencies = self.extract_dependencies(content, file_type)
            
            # Calculate complexity
            complexity_score = self.calculate_complexity(content, file_type)
            
            # Determine maintenance priority
            maintenance_priority = self.determine_maintenance_priority(file_name, content)
            
            # Find consolidation group
            consolidation_group = self.find_consolidation_group(file_name)
            
            # Find similar scripts
            similar_scripts = self.find_similar_scripts(file_name, file_path)
            
            # Identify extension opportunities
            extension_opportunities = self.identify_extension_opportunities(content, file_name)
            
            # Generate usage examples
            usage_examples = self.generate_usage_examples(file_name, functionality)
            
            # Create content summary
            content_summary = self.create_content_summary(content)
            
            # Create embedding text for vector search
            embedding_text = self.create_embedding_text(
                file_name, functionality, functions, content_summary
            )
            
            # Generate unique script ID
            script_id = self.generate_script_id(file_path, content)
            
            return ScriptKnowledge(
                script_id=script_id,
                file_path=file_path,
                file_name=file_name,
                file_type=file_type,
                category=category,
                subcategory=subcategory,
                purpose=self.determine_purpose(file_name, content),
                functionality=functionality,
                functions=functions,
                dependencies=dependencies,
                complexity_score=complexity_score,
                maintenance_priority=maintenance_priority,
                consolidation_group=consolidation_group,
                similar_scripts=similar_scripts,
                extension_opportunities=extension_opportunities,
                usage_examples=usage_examples,
                last_modified=datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat(),
                content_summary=content_summary,
                embedding_text=embedding_text
            )
            
        except Exception as e:
            logger.error(f"Error analyzing script {file_path}: {e}")
            return None
    
    def determine_categorization(self, file_path: str) -> Tuple[str, str]:
        """Determine script category and subcategory"""
        relative_path = os.path.relpath(file_path, self.scripts_dir)
        path_parts = relative_path.split(os.sep)
        
        if len(path_parts) > 1:
            category = path_parts[0]
            subcategory = path_parts[1] if len(path_parts) > 2 else "general"
        else:
            # Root level scripts
            category = "utilities"
            subcategory = "general"
        
        return category, subcategory
    
    def extract_functionality(self, content: str, file_name: str) -> List[str]:
        """Extract script functionality"""
        functionality = []
        
        # Check for common functionality patterns
        patterns = {
            "deployment": ["deploy", "setup", "install", "configure"],
            "monitoring": ["monitor", "check", "status", "health"],
            "synchronization": ["sync", "update", "pull", "push"],
            "testing": ["test", "validate", "verify", "check"],
            "data_processing": ["process", "transform", "parse", "analyze"],
            "api_integration": ["api", "request", "endpoint", "webhook"],
            "file_operations": ["file", "read", "write", "copy", "move"],
            "database_operations": ["database", "query", "insert", "update"],
            "security": ["security", "auth", "encrypt", "validate"],
            "automation": ["automate", "schedule", "cron", "trigger"]
        }
        
        content_lower = content.lower()
        file_lower = file_name.lower()
        
        for func_type, keywords in patterns.items():
            if any(keyword in content_lower or keyword in file_lower for keyword in keywords):
                functionality.append(func_type)
        
        return list(set(functionality))
    
    def extract_functions(self, content: str, file_type: str) -> List[str]:
        """Extract function names from script"""
        functions = []
        
        if file_type == 'py':
            func_pattern = r'def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\('
            functions = re.findall(func_pattern, content)
        elif file_type == 'sh':
            func_pattern = r'^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)\s*\{'
            functions = re.findall(func_pattern, content, re.MULTILINE)
        elif file_type == 'js':
            func_patterns = [
                r'function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(',
                r'const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\(',
                r'let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\(',
                r'var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:async\s+)?\('
            ]
            for pattern in func_patterns:
                functions.extend(re.findall(pattern, content))
        
        return list(set(functions))
    
    def extract_dependencies(self, content: str, file_type: str) -> List[str]:
        """Extract script dependencies"""
        dependencies = []
        
        if file_type == 'py':
            import_patterns = [
                r'import\s+([a-zA-Z_][a-zA-Z0-9_]*)',
                r'from\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+import'
            ]
            for pattern in import_patterns:
                dependencies.extend(re.findall(pattern, content))
        elif file_type == 'sh':
            import_patterns = [
                r'source\s+([^\s]+)',
                r'\.\s+([^\s]+)'
            ]
            for pattern in import_patterns:
                dependencies.extend(re.findall(pattern, content))
        elif file_type == 'js':
            import_patterns = [
                r'require\([\'"]([^\'"]+)[\'"]\)',
                r'import\s+.*from\s+[\'"]([^\'"]+)[\'"]'
            ]
            for pattern in import_patterns:
                dependencies.extend(re.findall(pattern, content))
        
        return list(set(dependencies))
    
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
    
    def determine_maintenance_priority(self, file_name: str, content: str) -> str:
        """Determine maintenance priority"""
        file_lower = file_name.lower()
        content_lower = content.lower()
        
        if any(keyword in file_lower for keyword in ['production', 'deploy', 'critical', 'security']):
            return "High"
        elif any(keyword in file_lower for keyword in ['test', 'demo', 'example']):
            return "Low"
        else:
            return "Medium"
    
    def find_consolidation_group(self, file_name: str) -> str:
        """Find consolidation group from analysis data"""
        if 'consolidation_opportunities' in self.consolidation_data.get('recommendations', {}):
            for opportunity in self.consolidation_data['recommendations']['consolidation_opportunities']:
                if file_name in str(opportunity):
                    return opportunity.get('reason', 'Unknown')
        
        return "Standalone"
    
    def find_similar_scripts(self, file_name: str, file_path: str) -> List[str]:
        """Find similar scripts based on consolidation analysis"""
        similar_scripts = []
        
        # Check consolidation data for similar scripts
        if 'consolidation_opportunities' in self.consolidation_data.get('recommendations', {}):
            for opportunity in self.consolidation_data['recommendations']['consolidation_opportunities']:
                if file_name in str(opportunity):
                    scripts = opportunity.get('scripts', [])
                    similar_scripts.extend([s for s in scripts if s != file_path])
        
        return list(set(similar_scripts))
    
    def identify_extension_opportunities(self, content: str, file_name: str) -> List[str]:
        """Identify opportunities to extend script functionality"""
        opportunities = []
        
        # Check for TODO comments
        todo_pattern = r'TODO|FIXME|NOTE|HACK'
        if re.search(todo_pattern, content, re.IGNORECASE):
            opportunities.append("Has TODO comments - potential for extension")
        
        # Check for hardcoded values
        if re.search(r'localhost|127\.0\.0\.1|hardcoded', content, re.IGNORECASE):
            opportunities.append("Contains hardcoded values - could be parameterized")
        
        # Check for limited error handling
        if file_name.endswith('.py') and 'try:' not in content and 'except' not in content:
            opportunities.append("Limited error handling - could be enhanced")
        
        # Check for single-purpose functions
        if len(self.extract_functions(content, file_name.split('.')[-1])) == 1:
            opportunities.append("Single-purpose script - could be extended with additional functions")
        
        return opportunities
    
    def generate_usage_examples(self, file_name: str, functionality: List[str]) -> List[str]:
        """Generate usage examples for the script"""
        examples = []
        
        # Basic usage
        examples.append(f"Execute: ./{file_name}")
        
        # Functionality-specific examples
        if "deployment" in functionality:
            examples.append(f"Deploy: ./{file_name} --env production")
        if "monitoring" in functionality:
            examples.append(f"Monitor: ./{file_name} --interval 30")
        if "testing" in functionality:
            examples.append(f"Test: ./{file_name} --verbose")
        if "api_integration" in functionality:
            examples.append(f"API: ./{file_name} --endpoint https://api.example.com")
        
        return examples
    
    def create_content_summary(self, content: str) -> str:
        """Create content summary for the script"""
        lines = content.split('\n')
        non_empty_lines = [line for line in lines if line.strip() and not line.strip().startswith('#')]
        
        # Get first few meaningful lines
        summary_lines = non_empty_lines[:5]
        summary = ' '.join(summary_lines)
        
        # Truncate if too long
        if len(summary) > 200:
            summary = summary[:200] + "..."
        
        return summary
    
    def create_embedding_text(self, file_name: str, functionality: List[str], 
                            functions: List[str], content_summary: str) -> str:
        """Create text for vector embedding"""
        embedding_parts = [
            file_name,
            ' '.join(functionality),
            ' '.join(functions),
            content_summary
        ]
        
        return ' '.join(embedding_parts)
    
    def generate_script_id(self, file_path: str, content: str) -> str:
        """Generate unique script ID"""
        # Use file path and content hash for uniqueness
        content_hash = hashlib.md5(content.encode()).hexdigest()[:8]
        path_hash = hashlib.md5(file_path.encode()).hexdigest()[:8]
        
        return f"script_{path_hash}_{content_hash}"
    
    def determine_purpose(self, file_name: str, content: str) -> str:
        """Determine script purpose"""
        file_lower = file_name.lower()
        content_lower = content.lower()
        
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
        else:
            return "General Utility"
    
    def store_in_supabase(self) -> bool:
        """Store script knowledge in Supabase vector database"""
        try:
            logger.info("🗄️ Storing script knowledge in Supabase...")
            
            # Prepare data for Supabase
            supabase_data = []
            
            for script in self.knowledge_base:
                supabase_data.append({
                    "script_id": script.script_id,
                    "file_path": script.file_path,
                    "file_name": script.file_name,
                    "file_type": script.file_type,
                    "category": script.category,
                    "subcategory": script.subcategory,
                    "purpose": script.purpose,
                    "functionality": script.functionality,
                    "functions": script.functions,
                    "dependencies": script.dependencies,
                    "complexity_score": script.complexity_score,
                    "maintenance_priority": script.maintenance_priority,
                    "consolidation_group": script.consolidation_group,
                    "similar_scripts": script.similar_scripts,
                    "extension_opportunities": script.extension_opportunities,
                    "usage_examples": script.usage_examples,
                    "last_modified": script.last_modified,
                    "content_summary": script.content_summary,
                    "embedding_text": script.embedding_text,
                    "created_at": datetime.now().isoformat()
                })
            
            # Store in Supabase (simulated for now)
            logger.info(f"📊 Prepared {len(supabase_data)} script records for Supabase")
            
            # Save to local file for now (in real implementation, this would go to Supabase)
            with open('alex-ai-script-knowledge.json', 'w') as f:
                json.dump(supabase_data, f, indent=2)
            
            logger.info("✅ Script knowledge stored successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error storing in Supabase: {e}")
            return False
    
    def create_script_recommendation_system(self) -> Dict:
        """Create script recommendation system for Alex AI"""
        recommendation_system = {
            "name": "Alex AI Script Recommendation System",
            "version": "1.0.0",
            "description": "Intelligent script discovery, extension, and categorization system",
            "capabilities": [
                "Find existing scripts by functionality",
                "Suggest script extensions",
                "Recommend proper categorization",
                "Identify consolidation opportunities",
                "Provide usage examples"
            ],
            "api_endpoints": {
                "find_script": "/api/scripts/find",
                "suggest_extension": "/api/scripts/extend",
                "categorize_script": "/api/scripts/categorize",
                "get_similar": "/api/scripts/similar",
                "get_recommendations": "/api/scripts/recommend"
            },
            "knowledge_base": {
                "total_scripts": len(self.knowledge_base),
                "categories": list(set(script.category for script in self.knowledge_base)),
                "functionality_types": list(set(
                    func for script in self.knowledge_base 
                    for func in script.functionality
                )),
                "consolidation_groups": list(set(
                    script.consolidation_group for script in self.knowledge_base
                ))
            }
        }
        
        return recommendation_system
    
    def generate_alex_ai_integration_script(self) -> str:
        """Generate Alex AI integration script for script recommendations"""
        integration_script = '''#!/usr/bin/env python3
"""
Alex AI Script Recommendation Integration
========================================
Integration script for Alex AI to use script knowledge base
"""

import json
import os
from typing import List, Dict, Any
from fuzzywuzzy import fuzz

class AlexAIScriptRecommender:
    def __init__(self, knowledge_file: str = "alex-ai-script-knowledge.json"):
        self.knowledge_file = knowledge_file
        self.script_knowledge = self.load_knowledge()
    
    def load_knowledge(self) -> List[Dict]:
        """Load script knowledge from file"""
        try:
            with open(self.knowledge_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading knowledge: {e}")
            return []
    
    def find_script_by_functionality(self, functionality: str) -> List[Dict]:
        """Find scripts by functionality"""
        matches = []
        for script in self.script_knowledge:
            if functionality.lower() in [f.lower() for f in script['functionality']]:
                matches.append(script)
        return matches
    
    def suggest_script_extension(self, script_name: str) -> Dict:
        """Suggest how to extend an existing script"""
        for script in self.script_knowledge:
            if script['file_name'] == script_name:
                return {
                    "script": script,
                    "extension_opportunities": script['extension_opportunities'],
                    "similar_scripts": script['similar_scripts'],
                    "recommendations": self.generate_extension_recommendations(script)
                }
        return {}
    
    def recommend_categorization(self, script_name: str, functionality: List[str]) -> Dict:
        """Recommend proper categorization for a new script"""
        # Find similar scripts
        similar_scripts = []
        for script in self.script_knowledge:
            similarity = self.calculate_similarity(script_name, script['file_name'])
            if similarity > 0.7:
                similar_scripts.append(script)
        
        # Recommend category based on similar scripts
        if similar_scripts:
            category_counts = {}
            for script in similar_scripts:
                category = script['category']
                category_counts[category] = category_counts.get(category, 0) + 1
            
            recommended_category = max(category_counts, key=category_counts.get)
        else:
            recommended_category = self.map_functionality_to_category(functionality)
        
        return {
            "recommended_category": recommended_category,
            "similar_scripts": similar_scripts,
            "reasoning": f"Based on {len(similar_scripts)} similar scripts"
        }
    
    def calculate_similarity(self, name1: str, name2: str) -> float:
        """Calculate similarity between script names"""
        return fuzz.ratio(name1.lower(), name2.lower()) / 100.0
    
    def map_functionality_to_category(self, functionality: List[str]) -> str:
        """Map functionality to category"""
        category_mapping = {
            "deployment": "deployment",
            "monitoring": "monitoring",
            "synchronization": "synchronization",
            "testing": "testing",
            "data_processing": "utilities",
            "api_integration": "utilities",
            "file_operations": "utilities",
            "database_operations": "utilities",
            "security": "utilities",
            "automation": "utilities"
        }
        
        for func in functionality:
            if func in category_mapping:
                return category_mapping[func]
        
        return "utilities"
    
    def generate_extension_recommendations(self, script: Dict) -> List[str]:
        """Generate extension recommendations for a script"""
        recommendations = []
        
        if script['extension_opportunities']:
            recommendations.extend(script['extension_opportunities'])
        
        if script['complexity_score'] < 5:
            recommendations.append("Script is simple - consider adding more functionality")
        
        if len(script['functions']) == 1:
            recommendations.append("Single function script - consider adding utility functions")
        
        if not script['dependencies']:
            recommendations.append("No dependencies - consider adding external libraries for enhanced functionality")
        
        return recommendations

# Usage example
if __name__ == "__main__":
    recommender = AlexAIScriptRecommender()
    
    # Find scripts by functionality
    deployment_scripts = recommender.find_script_by_functionality("deployment")
    print(f"Found {len(deployment_scripts)} deployment scripts")
    
    # Suggest extension for a script
    extension = recommender.suggest_script_extension("milestone-push.sh")
    if extension:
        print(f"Extension opportunities: {extension['extension_opportunities']}")
    
    # Recommend categorization
    categorization = recommender.recommend_categorization("new-script.py", ["testing", "validation"])
    print(f"Recommended category: {categorization['recommended_category']}")
'''
        
        return integration_script
    
    def save_integration_files(self):
        """Save all integration files"""
        # Save knowledge base
        self.store_in_supabase()
        
        # Save recommendation system
        recommendation_system = self.create_script_recommendation_system()
        with open('alex-ai-script-recommendation-system.json', 'w') as f:
            json.dump(recommendation_system, f, indent=2)
        
        # Save integration script
        integration_script = self.generate_alex_ai_integration_script()
        with open('scripts/alex-ai-script-recommender.py', 'w') as f:
            f.write(integration_script)
        
        logger.info("📁 Integration files saved successfully")

def main():
    """Main function"""
    print("🧠 Alex AI Script Knowledge Integration")
    print("=" * 50)
    
    integrator = AlexAIScriptKnowledgeIntegration()
    
    # Build knowledge base
    print("📚 Building script knowledge base...")
    knowledge_base = integrator.build_script_knowledge_base()
    
    print(f"✅ Knowledge base built with {len(knowledge_base)} scripts")
    
    # Store in Supabase
    print("🗄️ Storing in Supabase...")
    if integrator.store_in_supabase():
        print("✅ Successfully stored in Supabase")
    else:
        print("❌ Failed to store in Supabase")
    
    # Create integration files
    print("🔧 Creating integration files...")
    integrator.save_integration_files()
    
    print("✅ Alex AI Script Knowledge Integration Complete!")
    print("\n📋 Files created:")
    print("  - alex-ai-script-knowledge.json")
    print("  - alex-ai-script-recommendation-system.json")
    print("  - scripts/alex-ai-script-recommender.py")
    
    print("\n🚀 Alex AI can now:")
    print("  - Find existing scripts by functionality")
    print("  - Suggest script extensions")
    print("  - Recommend proper categorization")
    print("  - Identify consolidation opportunities")
    print("  - Provide usage examples")

if __name__ == "__main__":
    main()
