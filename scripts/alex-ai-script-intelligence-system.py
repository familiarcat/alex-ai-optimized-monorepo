#!/usr/bin/env python3
"""
Alex AI Script Intelligence System
==================================
Complete integration system for Alex AI to intelligently manage scripts
"""

import json
import os
import re
from typing import List, Dict, Any, Tuple
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
            
            logger.info(f"✅ Loaded {len(self.script_knowledge)} scripts and {len(self.embeddings)} embeddings")
            
        except Exception as e:
            logger.error(f"Error loading knowledge: {e}")
            self.script_knowledge = []
            self.embeddings = {}
    
    def find_script_by_functionality(self, functionality: str) -> List[Dict]:
        """Find scripts by functionality"""
        results = []
        functionality_lower = functionality.lower()
        
        for script in self.script_knowledge:
            script_functionality = [f.lower() for f in script.get('functionality', [])]
            if functionality_lower in script_functionality:
                results.append(script)
        
        return results
    
    def find_script_by_category(self, category: str) -> List[Dict]:
        """Find scripts by category"""
        results = []
        category_lower = category.lower()
        
        for script in self.script_knowledge:
            if category_lower in script.get('category', '').lower():
                results.append(script)
        
        return results
    
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
    
    def find_similar_scripts(self, script_name: str) -> List[Dict]:
        """Find scripts similar to a given script"""
        results = []
        
        for script in self.script_knowledge:
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
        for script in self.script_knowledge:
            if script['script_id'] == script_id:
                return script
        return {}
    
    def get_extension_recommendations(self, script_name: str) -> Dict:
        """Get extension recommendations for a script"""
        for script in self.script_knowledge:
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
        for script in self.script_knowledge:
            similarity = self.calculate_similarity(script_name.lower(), script['file_name'].lower())
            if similarity > 0.7:  # 70% similarity threshold
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
    
    def get_script_usage_examples(self, script_name: str) -> List[str]:
        """Get usage examples for a script"""
        for script in self.script_knowledge:
            if script['file_name'] == script_name:
                return script.get('usage_examples', [])
        return []
    
    def analyze_script_dependencies(self, script_name: str) -> Dict:
        """Analyze script dependencies and suggest improvements"""
        for script in self.script_knowledge:
            if script['file_name'] == script_name:
                dependencies = script.get('dependencies', [])
                return {
                    'dependencies': dependencies,
                    'dependency_count': len(dependencies),
                    'suggestions': self.generate_dependency_suggestions(dependencies, script)
                }
        return {}
    
    def generate_dependency_suggestions(self, dependencies: List[str], script: Dict) -> List[str]:
        """Generate suggestions for script dependencies"""
        suggestions = []
        
        if not dependencies:
            suggestions.append("Consider adding error handling libraries")
            suggestions.append("Consider adding logging libraries")
        
        if script.get('file_type') == 'py':
            if 'requests' not in dependencies and 'api' in script.get('purpose', '').lower():
                suggestions.append("Consider adding 'requests' library for API calls")
            if 'json' not in dependencies and 'data' in script.get('purpose', '').lower():
                suggestions.append("Consider adding 'json' library for data processing")
        
        return suggestions
    
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
    
    def generate_script_report(self, script_name: str) -> Dict:
        """Generate comprehensive report for a script"""
        for script in self.script_knowledge:
            if script['file_name'] == script_name:
                return {
                    'script_info': script,
                    'similar_scripts': self.find_similar_scripts(script_name),
                    'extension_recommendations': self.get_extension_recommendations(script_name),
                    'usage_examples': self.get_script_usage_examples(script_name),
                    'dependency_analysis': self.analyze_script_dependencies(script_name),
                    'consolidation_opportunities': self.find_consolidation_opportunities(script)
                }
        return {}
    
    def find_consolidation_opportunities(self, script: Dict) -> List[Dict]:
        """Find consolidation opportunities for a script"""
        opportunities = []
        
        # Find scripts with similar functionality
        for other_script in self.script_knowledge:
            if other_script['script_id'] != script['script_id']:
                common_functionality = set(script.get('functionality', [])) & set(other_script.get('functionality', []))
                
                if len(common_functionality) > 0:
                    opportunities.append({
                        'script': other_script,
                        'common_functionality': list(common_functionality),
                        'consolidation_potential': len(common_functionality) / len(set(script.get('functionality', [])) | set(other_script.get('functionality', [])))
                    })
        
        # Sort by consolidation potential
        opportunities.sort(key=lambda x: x['consolidation_potential'], reverse=True)
        return opportunities[:5]  # Top 5 opportunities
    
    def create_alex_ai_integration_guide(self) -> str:
        """Create integration guide for Alex AI"""
        guide = '''# Alex AI Script Intelligence Integration Guide

## Overview
The Alex AI Script Intelligence System provides intelligent script discovery, extension, and categorization capabilities.

## Key Features

### 1. Script Discovery
- Find scripts by functionality
- Search by category
- Text-based search with relevance scoring

### 2. Script Extension
- Get extension recommendations
- Find similar scripts for reference
- Generate extension suggestions

### 3. Script Categorization
- Recommend proper categorization
- Map functionality to categories
- Suggest folder structure

### 4. Script Creation
- Suggest whether to create new or extend existing
- Generate script templates
- Provide usage examples

## Usage Examples

### Find Scripts by Functionality
```python
system = AlexAIScriptIntelligenceSystem()
deployment_scripts = system.find_script_by_functionality("deployment")
```

### Search Scripts by Text
```python
test_scripts = system.search_scripts_by_text("test")
```

### Get Extension Recommendations
```python
recommendations = system.get_extension_recommendations("milestone-push.sh")
```

### Suggest Script Creation
```python
suggestion = system.suggest_script_creation("deploy application", ["deployment", "automation"])
```

### Generate Script Template
```python
template = system.create_script_template("deployment", ["deployment", "automation"])
```

## Integration with Alex AI

1. **Before creating a new script**: Use `suggest_script_creation()` to check if similar scripts exist
2. **When extending scripts**: Use `get_extension_recommendations()` to get suggestions
3. **For categorization**: Use `recommend_categorization()` to determine proper folder structure
4. **For templates**: Use `create_script_template()` to generate boilerplate code

## Best Practices

1. Always check for existing scripts before creating new ones
2. Use the consolidation opportunities to identify redundant scripts
3. Follow the recommended categorization for better organization
4. Use extension recommendations to enhance existing scripts
5. Leverage the script templates for consistent structure
'''
        
        return guide

def main():
    """Main function for testing the system"""
    print("🧠 Alex AI Script Intelligence System")
    print("=" * 50)
    
    system = AlexAIScriptIntelligenceSystem()
    
    # Test functionality
    print("\n🔍 Testing Script Discovery:")
    
    # Find deployment scripts
    deployment_scripts = system.find_script_by_functionality("deployment")
    print(f"Found {len(deployment_scripts)} deployment scripts")
    
    # Search by text
    test_scripts = system.search_scripts_by_text("test")
    print(f"Found {len(test_scripts)} test-related scripts")
    
    # Get extension recommendations
    recommendations = system.get_extension_recommendations("milestone-push.sh")
    if recommendations:
        print(f"Extension opportunities: {recommendations['extension_opportunities']}")
    
    # Suggest script creation
    suggestion = system.suggest_script_creation("deploy application", ["deployment", "automation"])
    print(f"Script creation suggestion: {suggestion['action']}")
    
    # Generate template
    template = system.create_script_template("deployment", ["deployment", "automation"])
    print(f"Generated template length: {len(template)} characters")
    
    # Save integration guide
    guide = system.create_alex_ai_integration_guide()
    with open('ALEX_AI_SCRIPT_INTELLIGENCE_GUIDE.md', 'w') as f:
        f.write(guide)
    
    print("\n✅ Alex AI Script Intelligence System Ready!")
    print("📋 Files created:")
    print("  - ALEX_AI_SCRIPT_INTELLIGENCE_GUIDE.md")
    
    print("\n🚀 Alex AI can now:")
    print("  - Intelligently discover existing scripts")
    print("  - Suggest script extensions and improvements")
    print("  - Recommend proper categorization")
    print("  - Generate script templates")
    print("  - Prevent redundant script creation")

if __name__ == "__main__":
    main()
