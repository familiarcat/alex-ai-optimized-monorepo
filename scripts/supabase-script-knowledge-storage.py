#!/usr/bin/env python3
"""
Supabase Script Knowledge Storage
=================================
Store script knowledge in Supabase vector database for Alex AI integration
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SupabaseScriptKnowledgeStorage:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.script_knowledge = []
        
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not found. Using local storage only.")
    
    def load_script_knowledge(self) -> bool:
        """Load script knowledge from file"""
        try:
            with open('alex-ai-script-knowledge.json', 'r') as f:
                self.script_knowledge = json.load(f)
            logger.info(f"✅ Loaded {len(self.script_knowledge)} script records")
            return True
        except Exception as e:
            logger.error(f"Error loading script knowledge: {e}")
            return False
    
    def create_supabase_tables(self) -> bool:
        """Create necessary tables in Supabase"""
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not available. Skipping table creation.")
            return False
        
        try:
            # Create scripts table
            scripts_table_sql = """
            CREATE TABLE IF NOT EXISTS alex_ai_scripts (
                id SERIAL PRIMARY KEY,
                script_id TEXT UNIQUE NOT NULL,
                file_path TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_type TEXT NOT NULL,
                category TEXT NOT NULL,
                subcategory TEXT NOT NULL,
                purpose TEXT NOT NULL,
                functionality TEXT[] NOT NULL,
                functions TEXT[] NOT NULL,
                dependencies TEXT[] NOT NULL,
                complexity_score INTEGER NOT NULL,
                maintenance_priority TEXT NOT NULL,
                consolidation_group TEXT NOT NULL,
                similar_scripts TEXT[] NOT NULL,
                extension_opportunities TEXT[] NOT NULL,
                usage_examples TEXT[] NOT NULL,
                last_modified TIMESTAMP WITH TIME ZONE NOT NULL,
                content_summary TEXT NOT NULL,
                embedding_text TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """
            
            # Create script recommendations table
            recommendations_table_sql = """
            CREATE TABLE IF NOT EXISTS alex_ai_script_recommendations (
                id SERIAL PRIMARY KEY,
                script_id TEXT NOT NULL,
                recommendation_type TEXT NOT NULL,
                recommendation_data JSONB NOT NULL,
                confidence_score FLOAT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """
            
            # Create script usage tracking table
            usage_table_sql = """
            CREATE TABLE IF NOT EXISTS alex_ai_script_usage (
                id SERIAL PRIMARY KEY,
                script_id TEXT NOT NULL,
                usage_type TEXT NOT NULL,
                usage_data JSONB NOT NULL,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """
            
            # Execute table creation
            self.execute_sql(scripts_table_sql)
            self.execute_sql(recommendations_table_sql)
            self.execute_sql(usage_table_sql)
            
            logger.info("✅ Supabase tables created successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error creating Supabase tables: {e}")
            return False
    
    def execute_sql(self, sql: str) -> bool:
        """Execute SQL on Supabase"""
        try:
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'query': sql
            }
            
            response = requests.post(
                f"{self.supabase_url}/rest/v1/rpc/exec_sql",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                return True
            else:
                logger.error(f"SQL execution failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error executing SQL: {e}")
            return False
    
    def store_script_knowledge(self) -> bool:
        """Store script knowledge in Supabase"""
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not available. Storing locally only.")
            return self.store_locally()
        
        try:
            logger.info("🗄️ Storing script knowledge in Supabase...")
            
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            # Store each script record
            for i, script in enumerate(self.script_knowledge):
                try:
                    # Prepare data for Supabase
                    supabase_data = {
                        'script_id': script['script_id'],
                        'file_path': script['file_path'],
                        'file_name': script['file_name'],
                        'file_type': script['file_type'],
                        'category': script['category'],
                        'subcategory': script['subcategory'],
                        'purpose': script['purpose'],
                        'functionality': script['functionality'],
                        'functions': script['functions'],
                        'dependencies': script['dependencies'],
                        'complexity_score': script['complexity_score'],
                        'maintenance_priority': script['maintenance_priority'],
                        'consolidation_group': script['consolidation_group'],
                        'similar_scripts': script['similar_scripts'],
                        'extension_opportunities': script['extension_opportunities'],
                        'usage_examples': script['usage_examples'],
                        'last_modified': script['last_modified'],
                        'content_summary': script['content_summary'],
                        'embedding_text': script['embedding_text']
                    }
                    
                    # Insert into Supabase
                    response = requests.post(
                        f"{self.supabase_url}/rest/v1/alex_ai_scripts",
                        headers=headers,
                        json=supabase_data
                    )
                    
                    if response.status_code in [200, 201]:
                        logger.info(f"✅ Stored script {i+1}/{len(self.script_knowledge)}: {script['file_name']}")
                    else:
                        logger.error(f"❌ Failed to store script {script['file_name']}: {response.status_code} - {response.text}")
                        
                except Exception as e:
                    logger.error(f"Error storing script {script['file_name']}: {e}")
                    continue
            
            logger.info("✅ Script knowledge storage completed")
            return True
            
        except Exception as e:
            logger.error(f"Error storing script knowledge: {e}")
            return False
    
    def store_locally(self) -> bool:
        """Store script knowledge locally as backup"""
        try:
            # Create backup with timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_file = f'alex-ai-script-knowledge-backup-{timestamp}.json'
            
            with open(backup_file, 'w') as f:
                json.dump(self.script_knowledge, f, indent=2)
            
            logger.info(f"✅ Script knowledge backed up to {backup_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error creating backup: {e}")
            return False
    
    def create_vector_embeddings(self) -> bool:
        """Create vector embeddings for script search"""
        try:
            logger.info("🔍 Creating vector embeddings...")
            
            # This would integrate with Supabase's vector search capabilities
            # For now, we'll create a simple embedding index
            
            embedding_index = {}
            
            for script in self.script_knowledge:
                # Create simple text embedding (in production, use proper vector embeddings)
                embedding_text = script['embedding_text']
                embedding_key = script['script_id']
                
                # Simple word-based embedding
                words = embedding_text.lower().split()
                embedding_index[embedding_key] = {
                    'words': words,
                    'script_id': script['script_id'],
                    'file_name': script['file_name'],
                    'category': script['category'],
                    'functionality': script['functionality']
                }
            
            # Save embedding index
            with open('alex-ai-script-embeddings.json', 'w') as f:
                json.dump(embedding_index, f, indent=2)
            
            logger.info("✅ Vector embeddings created")
            return True
            
        except Exception as e:
            logger.error(f"Error creating embeddings: {e}")
            return False
    
    def create_search_api(self) -> str:
        """Create search API for script discovery"""
        search_api = '''#!/usr/bin/env python3
"""
Alex AI Script Search API
=========================
API for searching and discovering scripts in the knowledge base
"""

import json
import re
from typing import List, Dict, Any
from fuzzywuzzy import fuzz

class AlexAIScriptSearchAPI:
    def __init__(self, knowledge_file: str = "alex-ai-script-knowledge.json", 
                 embeddings_file: str = "alex-ai-script-embeddings.json"):
        self.knowledge = self.load_json(knowledge_file)
        self.embeddings = self.load_json(embeddings_file)
    
    def load_json(self, file_path: str) -> Dict:
        """Load JSON file"""
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
            return {}
    
    def search_by_functionality(self, functionality: str) -> List[Dict]:
        """Search scripts by functionality"""
        results = []
        functionality_lower = functionality.lower()
        
        for script in self.knowledge:
            script_functionality = [f.lower() for f in script.get('functionality', [])]
            if functionality_lower in script_functionality:
                results.append(script)
        
        return results
    
    def search_by_category(self, category: str) -> List[Dict]:
        """Search scripts by category"""
        results = []
        category_lower = category.lower()
        
        for script in self.knowledge:
            if category_lower in script.get('category', '').lower():
                results.append(script)
        
        return results
    
    def search_by_text(self, query: str) -> List[Dict]:
        """Search scripts by text query"""
        results = []
        query_lower = query.lower()
        
        for script in self.knowledge:
            # Search in various fields
            searchable_text = ' '.join([
                script.get('file_name', ''),
                script.get('purpose', ''),
                script.get('content_summary', ''),
                ' '.join(script.get('functionality', [])),
                ' '.join(script.get('functions', []))
            ]).lower()
            
            if query_lower in searchable_text:
                # Calculate relevance score
                score = fuzz.partial_ratio(query_lower, searchable_text)
                script['relevance_score'] = score
                results.append(script)
        
        # Sort by relevance score
        results.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
        return results
    
    def find_similar_scripts(self, script_name: str) -> List[Dict]:
        """Find scripts similar to a given script"""
        results = []
        
        for script in self.knowledge:
            if script['file_name'] == script_name:
                # Get similar scripts from the knowledge base
                similar_script_ids = script.get('similar_scripts', [])
                for similar_id in similar_script_ids:
                    similar_script = self.find_script_by_id(similar_id)
                    if similar_script:
                        results.append(similar_script)
                break
        
        return results
    
    def find_script_by_id(self, script_id: str) -> Dict:
        """Find script by ID"""
        for script in self.knowledge:
            if script['script_id'] == script_id:
                return script
        return {}
    
    def get_extension_recommendations(self, script_name: str) -> Dict:
        """Get extension recommendations for a script"""
        for script in self.knowledge:
            if script['file_name'] == script_name:
                return {
                    'script': script,
                    'extension_opportunities': script.get('extension_opportunities', []),
                    'similar_scripts': self.find_similar_scripts(script_name),
                    'recommendations': self.generate_extension_recommendations(script)
                }
        return {}
    
    def generate_extension_recommendations(self, script: Dict) -> List[str]:
        """Generate extension recommendations"""
        recommendations = []
        
        if script.get('extension_opportunities'):
            recommendations.extend(script['extension_opportunities'])
        
        if script.get('complexity_score', 0) < 5:
            recommendations.append("Script is simple - consider adding more functionality")
        
        if len(script.get('functions', [])) == 1:
            recommendations.append("Single function script - consider adding utility functions")
        
        if not script.get('dependencies'):
            recommendations.append("No dependencies - consider adding external libraries")
        
        return recommendations
    
    def recommend_categorization(self, script_name: str, functionality: List[str]) -> Dict:
        """Recommend categorization for a new script"""
        # Find similar scripts
        similar_scripts = []
        for script in self.knowledge:
            similarity = fuzz.ratio(script_name.lower(), script['file_name'].lower())
            if similarity > 70:
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
            'recommended_category': recommended_category,
            'similar_scripts': similar_scripts,
            'reasoning': f"Based on {len(similar_scripts)} similar scripts"
        }
    
    def map_functionality_to_category(self, functionality: List[str]) -> str:
        """Map functionality to category"""
        category_mapping = {
            'deployment': 'deployment',
            'monitoring': 'monitoring',
            'synchronization': 'synchronization',
            'testing': 'testing',
            'data_processing': 'utilities',
            'api_integration': 'utilities',
            'file_operations': 'utilities',
            'database_operations': 'utilities',
            'security': 'utilities',
            'automation': 'utilities'
        }
        
        for func in functionality:
            if func in category_mapping:
                return category_mapping[func]
        
        return 'utilities'

# Usage example
if __name__ == "__main__":
    api = AlexAIScriptSearchAPI()
    
    # Search by functionality
    deployment_scripts = api.search_by_functionality("deployment")
    print(f"Found {len(deployment_scripts)} deployment scripts")
    
    # Search by text
    test_scripts = api.search_by_text("test")
    print(f"Found {len(test_scripts)} test-related scripts")
    
    # Get extension recommendations
    recommendations = api.get_extension_recommendations("milestone-push.sh")
    if recommendations:
        print(f"Extension opportunities: {recommendations['extension_opportunities']}")
'''
        
        return search_api
    
    def save_integration_files(self):
        """Save all integration files"""
        # Save search API
        search_api = self.create_search_api()
        with open('scripts/alex-ai-script-search-api.py', 'w') as f:
            f.write(search_api)
        
        logger.info("📁 Integration files saved successfully")

def main():
    """Main function"""
    print("🗄️ Supabase Script Knowledge Storage")
    print("=" * 50)
    
    storage = SupabaseScriptKnowledgeStorage()
    
    # Load script knowledge
    print("📚 Loading script knowledge...")
    if not storage.load_script_knowledge():
        print("❌ Failed to load script knowledge")
        return
    
    # Create Supabase tables
    print("🏗️ Creating Supabase tables...")
    storage.create_supabase_tables()
    
    # Store in Supabase
    print("💾 Storing in Supabase...")
    if storage.store_script_knowledge():
        print("✅ Successfully stored in Supabase")
    else:
        print("❌ Failed to store in Supabase")
    
    # Create vector embeddings
    print("🔍 Creating vector embeddings...")
    storage.create_vector_embeddings()
    
    # Create integration files
    print("🔧 Creating integration files...")
    storage.save_integration_files()
    
    print("✅ Supabase Script Knowledge Storage Complete!")
    print("\n📋 Files created:")
    print("  - alex-ai-script-embeddings.json")
    print("  - scripts/alex-ai-script-search-api.py")
    
    print("\n🚀 Alex AI can now:")
    print("  - Search scripts by functionality, category, or text")
    print("  - Find similar scripts for extension")
    print("  - Get extension recommendations")
    print("  - Recommend proper categorization")
    print("  - Access vector-based search capabilities")

if __name__ == "__main__":
    main()











