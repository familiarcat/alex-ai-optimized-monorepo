#!/usr/bin/env python3
"""
Alex AI Script Advisor - Standalone Version
===========================================
Main interface for Alex AI to access script intelligence capabilities
"""

import sys
import json
import argparse
import os
import re
from typing import List, Dict, Any
from datetime import datetime

class AlexAIScriptIntelligenceSystem:
    def __init__(self):
        self.knowledge_file = "alex-ai-script-knowledge.json"
        self.embeddings_file = "alex-ai-script-embeddings.json"
        self.script_knowledge = []
        self.embeddings = {}
        self.load_knowledge()
    
    def load_knowledge(self):
        """Load script knowledge and embeddings"""
        try:
            with open(self.knowledge_file, 'r') as f:
                self.script_knowledge = json.load(f)
            
            with open(self.embeddings_file, 'r') as f:
                self.embeddings = json.load(f)
            
            print(f"✅ Loaded {len(self.script_knowledge)} scripts and {len(self.embeddings)} embeddings")
            
        except Exception as e:
            print(f"Error loading knowledge: {e}")
            self.script_knowledge = []
            self.embeddings = {}
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts using simple string matching"""
        if not text1 or not text2:
            return 0.0
        
        # Simple Jaccard similarity
        words1 = set(text1.split())
        words2 = set(text2.split())
        
        if not words1 and not words2:
            return 1.0
        if not words1 or not words2:
            return 0.0
        
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        return intersection / union if union > 0 else 0.0
    
    def search_scripts_by_text(self, query: str) -> List[Dict]:
        """Search scripts by text query with relevance scoring"""
        results = []
        query_lower = query.lower()
        
        for script in self.script_knowledge:
            # Search in various fields
            searchable_text = ' '.join([
                script.get('file_name', ''),
                script.get('purpose', ''),
                script.get('content_summary', ''),
                ' '.join(script.get('functionality', [])),
                ' '.join(script.get('functions', []))
            ]).lower()
            
            if query_lower in searchable_text:
                # Calculate relevance score using simple string matching
                score = self.calculate_similarity(query_lower, searchable_text)
                script['relevance_score'] = score
                results.append(script)
        
        # Sort by relevance score
        results.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
        return results
    
    def suggest_script_creation(self, purpose: str, functionality: List[str]) -> Dict:
        """Suggest whether to create a new script or extend existing one"""
        # Search for existing scripts with similar functionality
        similar_scripts = []
        
        for script in self.script_knowledge:
            script_functionality = [f.lower() for f in script.get('functionality', [])]
            common_functionality = set(functionality) & set(script_functionality)
            
            if common_functionality:
                similarity_score = len(common_functionality) / len(set(functionality) | set(script_functionality))
                if similarity_score > 0.3:  # 30% similarity threshold
                    similar_scripts.append({
                        'script': script,
                        'similarity_score': similarity_score,
                        'common_functionality': list(common_functionality)
                    })
        
        # Sort by similarity score
        similar_scripts.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        if similar_scripts:
            best_match = similar_scripts[0]
            if best_match['similarity_score'] > 0.7:  # 70% similarity threshold
                return {
                    'action': 'extend',
                    'recommended_script': best_match['script'],
                    'similarity_score': best_match['similarity_score'],
                    'common_functionality': best_match['common_functionality'],
                    'extension_suggestions': self.generate_extension_suggestions(best_match['script'], functionality)
                }
            else:
                return {
                    'action': 'create_new',
                    'reasoning': 'Similar scripts exist but with low similarity',
                    'similar_scripts': similar_scripts[:3],  # Top 3 similar
                    'recommended_category': self.map_functionality_to_category(functionality)
                }
        else:
            return {
                'action': 'create_new',
                'reasoning': 'No similar scripts found',
                'recommended_category': self.map_functionality_to_category(functionality)
            }
    
    def generate_extension_suggestions(self, existing_script: Dict, new_functionality: List[str]) -> List[str]:
        """Generate suggestions for extending an existing script"""
        suggestions = []
        
        existing_functionality = [f.lower() for f in existing_script.get('functionality', [])]
        new_functionality_lower = [f.lower() for f in new_functionality]
        
        # Find functionality that's not already in the script
        missing_functionality = set(new_functionality_lower) - set(existing_functionality)
        
        if missing_functionality:
            suggestions.append(f"Add functionality: {', '.join(missing_functionality)}")
        
        # Check if script is simple and could be enhanced
        if existing_script.get('complexity_score', 0) < 5:
            suggestions.append("Script is simple - consider adding more robust error handling")
        
        # Check for extension opportunities
        if existing_script.get('extension_opportunities'):
            suggestions.extend(existing_script['extension_opportunities'])
        
        return suggestions
    
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
    
    def create_script_template(self, category: str, functionality: List[str]) -> str:
        """Create a script template based on category and functionality"""
        templates = {
            'deployment': self.create_deployment_template,
            'monitoring': self.create_monitoring_template,
            'testing': self.create_testing_template,
            'utilities': self.create_utility_template,
            'synchronization': self.create_sync_template
        }
        
        template_func = templates.get(category, self.create_utility_template)
        return template_func(functionality)
    
    def create_deployment_template(self, functionality: List[str]) -> str:
        """Create deployment script template"""
        return '''#!/bin/bash
# Deployment Script
# Generated by Alex AI Script Intelligence System

set -e

# Configuration
ENVIRONMENT=${1:-development}
VERBOSE=${2:-false}

# Functions
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

deploy() {
    log "Starting deployment to $ENVIRONMENT"
    
    # Add your deployment logic here
    
    log "Deployment completed successfully"
}

# Main execution
main() {
    deploy
}

# Run main function
main "$@"
'''
    
    def create_monitoring_template(self, functionality: List[str]) -> str:
        """Create monitoring script template"""
        return '''#!/bin/bash
# Monitoring Script
# Generated by Alex AI Script Intelligence System

set -e

# Configuration
INTERVAL=${1:-30}
ALERT_EMAIL=${2:-admin@example.com}

# Functions
check_status() {
    # Add your monitoring logic here
    echo "Checking system status..."
}

send_alert() {
    # Add alert logic here
    echo "Alert: $1"
}

# Main monitoring loop
monitor() {
    while true; do
        if ! check_status; then
            send_alert "System check failed"
        fi
        sleep $INTERVAL
    done
}

# Run monitoring
monitor
'''
    
    def create_testing_template(self, functionality: List[str]) -> str:
        """Create testing script template"""
        return '''#!/bin/bash
# Testing Script
# Generated by Alex AI Script Intelligence System

set -e

# Configuration
TEST_DIR=${1:-tests}
VERBOSE=${2:-false}

# Test functions
run_tests() {
    echo "Running tests in $TEST_DIR"
    
    # Add your test logic here
    
    echo "All tests passed"
}

# Main execution
main() {
    run_tests
}

# Run main function
main "$@"
'''
    
    def create_utility_template(self, functionality: List[str]) -> str:
        """Create utility script template"""
        return '''#!/bin/bash
# Utility Script
# Generated by Alex AI Script Intelligence System

set -e

# Configuration
INPUT_FILE=${1:-}
OUTPUT_FILE=${2:-}

# Functions
process_data() {
    # Add your utility logic here
    echo "Processing data..."
}

# Main execution
main() {
    process_data
}

# Run main function
main "$@"
'''
    
    def create_sync_template(self, functionality: List[str]) -> str:
        """Create synchronization script template"""
        return '''#!/bin/bash
# Synchronization Script
# Generated by Alex AI Script Intelligence System

set -e

# Configuration
SOURCE=${1:-}
DESTINATION=${2:-}
DRY_RUN=${3:-false}

# Functions
sync_data() {
    echo "Synchronizing $SOURCE to $DESTINATION"
    
    if [ "$DRY_RUN" = "true" ]; then
        echo "DRY RUN: Would sync files"
    else
        # Add your sync logic here
        echo "Sync completed"
    fi
}

# Main execution
main() {
    sync_data
}

# Run main function
main "$@"
'''

class AlexAIScriptAdvisor:
    def __init__(self):
        self.system = AlexAIScriptIntelligenceSystem()
    
    def advise_on_script_creation(self, purpose: str, functionality: list) -> dict:
        """Main advisor function for script creation decisions"""
        print(f"🤔 Alex AI is analyzing: '{purpose}' with functionality: {functionality}")
        
        # Get suggestion
        suggestion = self.system.suggest_script_creation(purpose, functionality)
        
        # Format response
        response = {
            "action": suggestion["action"],
            "reasoning": suggestion["reasoning"],
            "recommendations": []
        }
        
        if suggestion["action"] == "extend":
            response["recommendations"].append(f"Extend existing script: {suggestion['recommended_script']['file_name']}")
            response["recommendations"].append(f"Similarity: {suggestion['similarity_score']:.2%}")
            response["recommendations"].extend(suggestion["extension_suggestions"])
            response["target_script"] = suggestion["recommended_script"]
        
        elif suggestion["action"] == "create_new":
            response["recommendations"].append(f"Create new script in category: {suggestion['recommended_category']}")
            if "similar_scripts" in suggestion:
                response["recommendations"].append(f"Found {len(suggestion['similar_scripts'])} similar scripts for reference")
                response["similar_scripts"] = suggestion["similar_scripts"][:3]  # Top 3
        
        return response
    
    def get_script_template(self, category: str, functionality: list) -> str:
        """Get script template for new script creation"""
        return self.system.create_script_template(category, functionality)
    
    def find_existing_scripts(self, query: str) -> list:
        """Find existing scripts by query"""
        return self.system.search_scripts_by_text(query)

def main():
    """Command line interface for Alex AI Script Advisor"""
    parser = argparse.ArgumentParser(description="Alex AI Script Advisor")
    parser.add_argument("--purpose", help="Script purpose")
    parser.add_argument("--functionality", nargs="+", help="Script functionality list")
    parser.add_argument("--query", help="Search query for existing scripts")
    parser.add_argument("--action", choices=["advise", "search", "template"], 
                       default="advise", help="Action to perform")
    parser.add_argument("--category", help="Category for template generation")
    
    args = parser.parse_args()
    
    advisor = AlexAIScriptAdvisor()
    
    if args.action == "advise":
        if not args.purpose or not args.functionality:
            print("❌ Error: --purpose and --functionality are required for advice")
            sys.exit(1)
        
        advice = advisor.advise_on_script_creation(args.purpose, args.functionality)
        print("\n🎯 Alex AI Script Creation Advice:")
        print(f"Action: {advice['action']}")
        print(f"Reasoning: {advice['reasoning']}")
        print("\n📋 Recommendations:")
        for rec in advice["recommendations"]:
            print(f"  • {rec}")
        
        if "target_script" in advice:
            print(f"\n🎯 Target Script: {advice['target_script']['file_name']}")
            print(f"   Path: {advice['target_script']['file_path']}")
            print(f"   Category: {advice['target_script']['category']}")
    
    elif args.action == "search":
        if not args.query:
            print("❌ Error: --query is required for search")
            sys.exit(1)
        
        results = advisor.find_existing_scripts(args.query)
        print(f"\n🔍 Found {len(results)} scripts matching '{args.query}':")
        for i, script in enumerate(results[:10], 1):  # Show top 10
            print(f"  {i}. {script['file_name']} (Score: {script.get('relevance_score', 0):.2f})")
            print(f"     Path: {script['file_path']}")
            print(f"     Purpose: {script['purpose']}")
            print()
    
    elif args.action == "template":
        if not args.category or not args.functionality:
            print("❌ Error: --category and --functionality are required for template generation")
            sys.exit(1)
        
        template = advisor.get_script_template(args.category, args.functionality)
        print(f"\n📝 Generated {args.category} script template:")
        print("=" * 50)
        print(template)

if __name__ == "__main__":
    main()

















