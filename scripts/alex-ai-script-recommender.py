#!/usr/bin/env python3
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
