#!/usr/bin/env python3
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
