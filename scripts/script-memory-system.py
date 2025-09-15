from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Script Memory System with Supabase Vector Database
=================================================
Intelligent script discovery and extension using vector embeddings
"""

import os
import sys
import json
import hashlib
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import logging
from dataclasses import dataclass, asdict
import requests
from sentence_transformers import SentenceTransformer

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ScriptMemory:
    """Script memory entry for vector database"""
    id: str
    file_name: str
    file_path: str
    purpose: str
    category: str
    subcategory: str
    functions: List[str]
    variables: List[str]
    tags: List[str]
    content_summary: str
    embedding: List[float]
    created_at: str
    updated_at: str

class ScriptMemorySystem:
        self.supabase_key = supabase_key or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        
        # Initialize embedding model
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Memory cache
        self.memory_cache = {}
        self.embeddings_cache = {}
        
    def create_script_embedding(self, script_content: str, metadata: Dict) -> List[float]:
        """Create embedding for script content and metadata"""
        try:
            # Combine content and metadata for embedding
            combined_text = f"""
            Purpose: {metadata.get('purpose', '')}
            Category: {metadata.get('category', '')}
            Functions: {', '.join(metadata.get('functions', []))}
            Tags: {', '.join(metadata.get('tags', []))}
            Content: {script_content[:1000]}  # Limit content length
            """
            
            # Generate embedding
            embedding = self.embedding_model.encode(combined_text)
            return embedding.tolist()
            
        except Exception as e:
            logger.error(f"Error creating embedding: {e}")
            return [0.0] * 384  # Default embedding size
    
    def store_script_memory(self, script_metadata: Dict, script_content: str) -> bool:
        """Store script in Supabase vector database"""
        try:
            # Create embedding
            embedding = self.create_script_embedding(script_content, script_metadata)
            
            # Create memory entry
            memory_entry = ScriptMemory(
                id=script_metadata['hash'],
                file_name=script_metadata['file_name'],
                file_path=script_metadata['file_path'],
                purpose=script_metadata['purpose'],
                category=script_metadata['category'],
                subcategory=script_metadata['subcategory'],
                functions=script_metadata['functions'],
                variables=script_metadata['variables'],
                tags=script_metadata['tags'],
                content_summary=script_content[:500],  # First 500 chars
                embedding=embedding,
                created_at=datetime.now().isoformat(),
                updated_at=datetime.now().isoformat()
            )
            
            # Store in Supabase
            response = requests.post(
                f"{self.supabase_url}/rest/v1/script_memories",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}',
                    'Content-Type': 'application/json'
                },
                json=asdict(memory_entry)
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"Stored script memory: {script_metadata['file_name']}")
                return True
            else:
                logger.error(f"Failed to store script memory: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error storing script memory: {e}")
            return False
    
    def search_similar_scripts(self, query: str, limit: int = 5) -> List[Dict]:
        """Search for similar scripts using vector similarity"""
        try:
            # Create query embedding
            query_embedding = self.embedding_model.encode(query)
            
            # Search in Supabase using vector similarity
            response = requests.post(
                f"{self.supabase_url}/rest/v1/rpc/search_similar_scripts",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'query_embedding': query_embedding.tolist(),
                    'match_threshold': 0.7,
                    'match_count': limit
                }
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Search failed: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error searching similar scripts: {e}")
            return []
    
    def find_existing_script(self, purpose: str, category: str = None) -> Optional[Dict]:
        """Find existing script that might serve the same purpose"""
        try:
            # Create search query
            search_query = f"purpose: {purpose}"
            if category:
                search_query += f" category: {category}"
            
            # Search for similar scripts
            similar_scripts = self.search_similar_scripts(search_query, limit=3)
            
            if similar_scripts:
                # Return the most similar script
                return similar_scripts[0]
            
            return None
            
        except Exception as e:
            logger.error(f"Error finding existing script: {e}")
            return None
    
    def suggest_script_extension(self, existing_script: Dict, new_requirements: str) -> Dict:
        """Suggest how to extend an existing script"""
        try:
            # Analyze existing script
            existing_purpose = existing_script.get('purpose', '')
            existing_functions = existing_script.get('functions', [])
            existing_tags = existing_script.get('tags', [])
            
            # Create extension suggestions
            suggestions = {
                'existing_script': existing_script['file_name'],
                'existing_purpose': existing_purpose,
                'new_requirements': new_requirements,
                'extension_suggestions': [],
                'new_functions_needed': [],
                'new_dependencies': [],
                'modification_points': []
            }
            
            # Analyze what's missing
            new_requirements_lower = new_requirements.lower()
            
            # Check if new functions are needed
            if 'api' in new_requirements_lower and 'api' not in existing_tags:
                suggestions['extension_suggestions'].append("Add API integration functionality")
                suggestions['new_functions_needed'].append("api_call", "handle_response")
            
            if 'database' in new_requirements_lower and 'database' not in existing_tags:
                suggestions['extension_suggestions'].append("Add database operations")
                suggestions['new_functions_needed'].append("db_connect", "db_query")
            
            if 'error' in new_requirements_lower and 'error' not in existing_tags:
                suggestions['extension_suggestions'].append("Add error handling")
                suggestions['new_functions_needed'].append("handle_error", "log_error")
            
            if 'test' in new_requirements_lower and 'test' not in existing_tags:
                suggestions['extension_suggestions'].append("Add testing functionality")
                suggestions['new_functions_needed'].append("run_tests", "validate_output")
            
            # Suggest modification points
            if existing_functions:
                suggestions['modification_points'].append(f"Extend existing functions: {', '.join(existing_functions[:3])}")
            
            suggestions['modification_points'].append("Add new functions at the end of the script")
            suggestions['modification_points'].append("Update script description and comments")
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Error suggesting script extension: {e}")
            return {'error': str(e)}
    
    def create_script_template(self, purpose: str, category: str, requirements: str) -> Dict:
        """Create a script template based on similar existing scripts"""
        try:
            # Find similar scripts
            similar_scripts = self.search_similar_scripts(f"purpose: {purpose} category: {category}", limit=3)
            
            if not similar_scripts:
                return self.create_basic_template(purpose, category, requirements)
            
            # Use the most similar script as a template
            template_script = similar_scripts[0]
            
            # Create template based on existing script
            template = {
                'file_name': f"new_{purpose.replace(' ', '_').lower()}.py",
                'purpose': purpose,
                'category': category,
                'requirements': requirements,
                'template_based_on': template_script['file_name'],
                'header': self.create_script_header(purpose, requirements),
                'functions': self.extract_relevant_functions(template_script, requirements),
                'dependencies': self.extract_relevant_dependencies(template_script, requirements),
                'structure': self.create_script_structure(template_script, requirements)
            }
            
            return template
            
        except Exception as e:
            logger.error(f"Error creating script template: {e}")
            return {'error': str(e)}
    
    def create_basic_template(self, purpose: str, category: str, requirements: str) -> Dict:
        """Create a basic script template when no similar scripts exist"""
        template = {
            'file_name': f"new_{purpose.replace(' ', '_').lower()}.py",
            'purpose': purpose,
            'category': category,
            'requirements': requirements,
            'template_based_on': None,
            'header': f'''#!/usr/bin/env python3
"""
{purpose}
==========
{requirements}
"""

import os
import sys
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

    print(f"{purpose}")
    print("=" * 50)
    
    # TODO: Implement {purpose.lower()}
    pass

if __name__ == "__main__":
    main()
''',
            'functions': ['main()'],
            'dependencies': ['os', 'sys', 'json', 'datetime', 'logging'],
            'structure': 'basic'
        }
        
        return template
    
    def create_script_header(self, purpose: str, requirements: str) -> str:
        """Create script header"""
        return f'''#!/usr/bin/env python3
"""
{purpose}
==========
{requirements}

Generated by Alex AI Script Memory System
"""

import os
import sys
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

    print(f"{purpose}")
    print("=" * 50)
    
    # TODO: Implement {purpose.lower()}
    pass

if __name__ == "__main__":
    main()
'''
    
    def extract_relevant_functions(self, template_script: Dict, requirements: str) -> List[str]:
        """Extract relevant functions from template script"""
        functions = template_script.get('functions', [])
        requirements_lower = requirements.lower()
        
        relevant_functions = []
        for func in functions:
            func_lower = func.lower()
            if any(req in func_lower for req in requirements_lower.split()):
                relevant_functions.append(func)
        
        return relevant_functions[:5]  # Limit to 5 functions
    
    def extract_relevant_dependencies(self, template_script: Dict, requirements: str) -> List[str]:
        """Extract relevant dependencies from template script"""
        # This would need to be implemented based on how dependencies are stored
        return ['os', 'sys', 'json', 'datetime', 'logging']
    
    def create_script_structure(self, template_script: Dict, requirements: str) -> str:
        """Create script structure based on template"""
        return "structured"  # Placeholder
    
    def get_script_recommendations(self, new_script_purpose: str) -> Dict:
        """Get recommendations for creating a new script"""
        try:
            # Find similar existing scripts
            similar_scripts = self.search_similar_scripts(new_script_purpose, limit=5)
            
            if not similar_scripts:
                return {
                    'recommendation': 'create_new',
                    'reason': 'No similar scripts found',
                    'suggestions': ['Create a new script from scratch', 'Consider existing patterns in the codebase']
                }
            
            # Analyze similarity
            most_similar = similar_scripts[0]
            similarity_score = most_similar.get('similarity_score', 0)
            
            if similarity_score > 0.8:
                return {
                    'recommendation': 'extend_existing',
                    'reason': f'Very similar script found: {most_similar["file_name"]}',
                    'existing_script': most_similar,
                    'suggestions': [
                        f'Extend {most_similar["file_name"]} instead of creating new',
                        'Add new functionality to existing script',
                        'Consider refactoring if script becomes too complex'
                    ]
                }
            elif similarity_score > 0.6:
                return {
                    'recommendation': 'use_as_template',
                    'reason': f'Similar script found: {most_similar["file_name"]}',
                    'template_script': most_similar,
                    'suggestions': [
                        f'Use {most_similar["file_name"]} as a template',
                        'Copy relevant functions and modify',
                        'Maintain consistent patterns'
                    ]
                }
            else:
                return {
                    'recommendation': 'create_new',
                    'reason': 'Similar scripts found but not close enough',
                    'similar_scripts': similar_scripts,
                    'suggestions': [
                        'Create new script but reference similar ones',
                        'Consider common patterns from similar scripts',
                        'Ensure consistency with existing codebase'
                    ]
                }
                
        except Exception as e:
            logger.error(f"Error getting script recommendations: {e}")
            return {'error': str(e)}

    print("🧠 Script Memory System")
    print("=" * 30)
    
    # Initialize memory system
    memory_system = ScriptMemorySystem()
    
    # Test search
    query = "deploy n8n workflows"
    print(f"Searching for: {query}")
    
    results = memory_system.search_similar_scripts(query)
    print(f"Found {len(results)} similar scripts")
    
    for result in results[:3]:
        print(f"  - {result.get('file_name', 'Unknown')}: {result.get('purpose', 'No purpose')}")

if __name__ == "__main__":
    main()












