from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Intelligent Script Discovery & Extension System
==============================================
AI-powered script discovery, extension, and redundancy prevention
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import logging
from dataclasses import dataclass
import argparse

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ScriptRecommendation:
    """Script recommendation result"""
    action: str  # 'extend', 'create_new', 'use_template'
    existing_script: Optional[str]
    confidence: float
    reasoning: str
    suggestions: List[str]
    template_content: Optional[str]

class IntelligentScriptDiscovery:
        self.analysis_file = "script-analysis.json"
        self.memory_file = "script-memory.json"
        
    def discover_script(self, purpose: str, category: str = None, requirements: str = "") -> ScriptRecommendation:
        """Discover if a script already exists or can be extended"""
        try:
            # Load existing analysis
            analysis = self.load_analysis()
            if not analysis:
                return self.create_new_script_recommendation(purpose, category, requirements)
            
            # Search for similar scripts
            similar_scripts = self.find_similar_scripts(purpose, category, analysis)
            
            if not similar_scripts:
                return self.create_new_script_recommendation(purpose, category, requirements)
            
            # Analyze the most similar script
            most_similar = similar_scripts[0]
            similarity_score = most_similar.get('similarity_score', 0)
            
            if similarity_score > 0.8:
                return self.extend_existing_script_recommendation(most_similar, purpose, requirements)
            elif similarity_score > 0.6:
                return self.use_as_template_recommendation(most_similar, purpose, requirements)
            else:
                return self.create_new_script_recommendation(purpose, category, requirements)
                
        except Exception as e:
            logger.error(f"Error discovering script: {e}")
            return self.create_new_script_recommendation(purpose, category, requirements)
    
    def find_similar_scripts(self, purpose: str, category: str, analysis: Dict) -> List[Dict]:
        """Find scripts similar to the given purpose"""
        similar_scripts = []
        
        for script in analysis.get('scripts', []):
            similarity_score = self.calculate_similarity(purpose, script)
            
            if similarity_score > 0.3:  # Lower threshold for similarity
                script['similarity_score'] = similarity_score
                similar_scripts.append(script)
        
        # Sort by similarity score
        similar_scripts.sort(key=lambda x: x['similarity_score'], reverse=True)
        return similar_scripts
    
    def calculate_similarity(self, purpose: str, script: Dict) -> float:
        """Calculate similarity between purpose and script"""
        score = 0.0
        purpose_lower = purpose.lower()
        script_name = script.get('file_name', '').lower()
        script_purpose = script.get('purpose', '').lower()
        
        # Check filename similarity (most important)
        if any(word in script_name for word in purpose_lower.split()):
            score += 0.5
        
        # Check if purpose keywords are in filename
        purpose_keywords = ['n8n', 'sync', 'deploy', 'workflow', 'test', 'api', 'data']
        for keyword in purpose_keywords:
            if keyword in purpose_lower and keyword in script_name:
                score += 0.3
        
        # Check purpose similarity
        purpose_words = set(purpose_lower.split())
        script_purpose_words = set(script_purpose.split())
        
        if purpose_words and script_purpose_words:
            purpose_similarity = len(purpose_words.intersection(script_purpose_words)) / len(purpose_words.union(script_purpose_words))
            score += purpose_similarity * 0.3
        
        # Check tag similarity
        script_tags = set(script.get('tags', []))
        purpose_tags = set(purpose_lower.split())
        
        if script_tags and purpose_tags:
            tag_similarity = len(script_tags.intersection(purpose_tags)) / len(script_tags.union(purpose_tags))
            score += tag_similarity * 0.2
        
        # Check function similarity
        script_functions = set(script.get('functions', []))
        if script_functions and any(word in purpose_lower for word in script_functions):
            score += 0.1
        
        return min(score, 1.0)
    
    def extend_existing_script_recommendation(self, existing_script: Dict, purpose: str, requirements: str) -> ScriptRecommendation:
        """Recommend extending an existing script"""
        return ScriptRecommendation(
            action='extend',
            existing_script=existing_script['file_name'],
            confidence=0.9,
            reasoning=f"Found highly similar script: {existing_script['file_name']}",
            suggestions=[
                f"Extend {existing_script['file_name']} to include: {purpose}",
                "Add new functions to existing script",
                "Update script documentation and comments",
                "Consider refactoring if script becomes too complex"
            ],
            template_content=None
        )
    
    def use_as_template_recommendation(self, template_script: Dict, purpose: str, requirements: str) -> ScriptRecommendation:
        """Recommend using an existing script as template"""
        template_content = self.generate_template_content(template_script, purpose, requirements)
        
        return ScriptRecommendation(
            action='use_template',
            existing_script=template_script['file_name'],
            confidence=0.7,
            reasoning=f"Found similar script that can be used as template: {template_script['file_name']}",
            suggestions=[
                f"Use {template_script['file_name']} as a starting point",
                "Copy relevant functions and modify for new purpose",
                "Maintain consistent coding patterns",
                "Update all references and documentation"
            ],
            template_content=template_content
        )
    
    def create_new_script_recommendation(self, purpose: str, category: str, requirements: str) -> ScriptRecommendation:
        """Recommend creating a new script"""
        template_content = self.generate_new_script_template(purpose, category, requirements)
        
        return ScriptRecommendation(
            action='create_new',
            existing_script=None,
            confidence=1.0,
            reasoning="No similar scripts found, creating new script",
            suggestions=[
                "Create new script from scratch",
                "Follow existing code patterns in the project",
                "Include proper documentation and comments",
                "Consider future extensibility"
            ],
            template_content=template_content
        )
    
    def generate_template_content(self, template_script: Dict, purpose: str, requirements: str) -> str:
        """Generate script content based on template"""
        template_path = template_script['file_path']
        
        try:
            with open(template_path, 'r') as f:
                template_content = f.read()
            
            # Modify template for new purpose
            modified_content = self.modify_template_for_purpose(template_content, purpose, requirements)
            return modified_content
            
        except Exception as e:
            logger.error(f"Error reading template script: {e}")
            return self.generate_new_script_template(purpose, template_script.get('category', 'utilities'), requirements)
    
    def modify_template_for_purpose(self, template_content: str, purpose: str, requirements: str) -> str:
        """Modify template content for new purpose"""
        # Replace purpose in comments
        modified_content = template_content.replace(
            "Purpose:",
            f"Purpose: {purpose}"
        )
        
        # Add requirements comment
        if requirements:
            modified_content = modified_content.replace(
                "Generated by Alex AI Script Memory System",
                f"Generated by Alex AI Script Memory System\n# Requirements: {requirements}"
            )
        
        # Update function names if needed
        purpose_snake = purpose.lower().replace(' ', '_').replace('-', '_')
        modified_content = modified_content.replace(
        )
        
        return modified_content
    
    def generate_new_script_template(self, purpose: str, category: str, requirements: str) -> str:
        """Generate new script template"""
        purpose_snake = purpose.lower().replace(' ', '_').replace('-', '_')
        file_extension = self.get_file_extension_for_category(category)
        
        if file_extension == 'py':
            return self.generate_python_template(purpose, requirements, purpose_snake)
        elif file_extension == 'sh':
            return self.generate_bash_template(purpose, requirements, purpose_snake)
        elif file_extension == 'js':
            return self.generate_javascript_template(purpose, requirements, purpose_snake)
        else:
            return self.generate_python_template(purpose, requirements, purpose_snake)
    
    def get_file_extension_for_category(self, category: str) -> str:
        """Get appropriate file extension for category"""
        category_extensions = {
            'deployment': 'sh',
            'testing': 'py',
            'data_management': 'py',
            'ai_ml': 'py',
            'security': 'sh',
            'monitoring': 'py',
            'utilities': 'py',
            'workflow': 'sh'
        }
        return category_extensions.get(category, 'py')
    
    def generate_python_template(self, purpose: str, requirements: str, purpose_snake: str) -> str:
        """Generate Python script template"""
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

def {purpose_snake}():
    """{purpose}"""
    logger.info(f"Starting {{purpose}}")
    
    # TODO: Implement {purpose.lower()}
    # Requirements: {requirements}
    
    try:
        # Implementation goes here
        pass
        
    except Exception as e:
        logger.error(f"Error in {purpose_snake}: {{e}}")
        return False
    
    logger.info(f"Completed {{purpose}}")
    return True

    print(f"{purpose}")
    print("=" * 50)
    
    success = {purpose_snake}()
    
    if success:
        print("✅ Operation completed successfully")
    else:
        print("❌ Operation failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
'''
    
    def generate_bash_template(self, purpose: str, requirements: str, purpose_snake: str) -> str:
        """Generate Bash script template"""
        return f'''#!/bin/bash

# {purpose}
# ==========
# {requirements}
#
# Generated by Alex AI Script Memory System

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${{BASH_SOURCE[0]}}")" && pwd)"
LOG_FILE="logs/{purpose_snake}.log"

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Helper functions
log_info() {{
    echo -e "${{BLUE}}ℹ️  $1${{NC}}"
}}

log_success() {{
    echo -e "${{GREEN}}✅ $1${{NC}}"
}}

log_warning() {{
    echo -e "${{YELLOW}}⚠️  $1${{NC}}"
}}

log_error() {{
    echo -e "${{RED}}❌ $1${{NC}}"
}}

{purpose_snake}() {{
    """{purpose}"""
    log_info "Starting {purpose}"
    
    # TODO: Implement {purpose.lower()}
    # Requirements: {requirements}
    
    # Implementation goes here
    
    log_success "Completed {purpose}"
}}

    echo "=================================================="
    
    {purpose_snake}
    
    log_success "Operation completed successfully"
}}

# Run main function
main "$@"
'''
    
    def generate_javascript_template(self, purpose: str, requirements: str, purpose_snake: str) -> str:
        """Generate JavaScript script template"""
        return f'''#!/usr/bin/env node

/**
 * {purpose}
 * ==========
 * {requirements}
 * 
 * Generated by Alex AI Script Memory System
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SCRIPT_DIR = __dirname;
const LOG_FILE = path.join(SCRIPT_DIR, 'logs', '{purpose_snake}.log');

// Helper functions
const logInfo = (message) => console.log(`ℹ️  ${{message}}`);
const logSuccess = (message) => console.log(`✅ ${{message}}`);
const logWarning = (message) => console.log(`⚠️  ${{message}}`);
const logError = (message) => console.log(`❌ ${{message}}`);

async function {purpose_snake}() {{
    """{purpose}"""
    logInfo(`Starting {purpose}`);
    
    try {{
        // TODO: Implement {purpose.lower()}
        // Requirements: {requirements}
        
        // Implementation goes here
        
        logSuccess(`Completed {purpose}`);
        return true;
        
    }} catch (error) {{
        logError(`Error in {purpose_snake}: ${{error.message}}`);
        return false;
    }}
}}

    console.log('==================================================');
    
    const success = await {purpose_snake}();
    
    if (success) {{
        logSuccess('Operation completed successfully');
        process.exit(0);
    }} else {{
        logError('Operation failed');
        process.exit(1);
    }}
}}

// Run main function
if (require.main === module) {{
    main().catch(console.error);
}}

module.exports = {{ {purpose_snake} }};
'''
    
    def load_analysis(self) -> Optional[Dict]:
        """Load script analysis data"""
        try:
            if os.path.exists(self.analysis_file):
                with open(self.analysis_file, 'r') as f:
                    return json.load(f)
            return None
        except Exception as e:
            logger.error(f"Error loading analysis: {e}")
            return None
    
    def save_recommendation(self, recommendation: ScriptRecommendation, purpose: str):
        """Save recommendation for future reference"""
        try:
            recommendation_data = {
                'timestamp': datetime.now().isoformat(),
                'purpose': purpose,
                'action': recommendation.action,
                'existing_script': recommendation.existing_script,
                'confidence': recommendation.confidence,
                'reasoning': recommendation.reasoning,
                'suggestions': recommendation.suggestions
            }
            
            # Save to recommendations file
            recommendations_file = "script-recommendations.json"
            recommendations = []
            
            if os.path.exists(recommendations_file):
                with open(recommendations_file, 'r') as f:
                    recommendations = json.load(f)
            
            recommendations.append(recommendation_data)
            
            with open(recommendations_file, 'w') as f:
                json.dump(recommendations, f, indent=2)
                
            logger.info(f"Recommendation saved for: {purpose}")
            
        except Exception as e:
            logger.error(f"Error saving recommendation: {e}")
    
    def create_script_from_recommendation(self, recommendation: ScriptRecommendation, output_path: str):
        """Create script file from recommendation"""
        try:
            if recommendation.template_content:
                # Create output directory if it doesn't exist
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                
                # Write template content to file
                with open(output_path, 'w') as f:
                    f.write(recommendation.template_content)
                
                # Make executable if it's a shell script
                if output_path.endswith('.sh'):
                    os.chmod(output_path, 0o755)
                
                logger.info(f"Script created: {output_path}")
                return True
            else:
                logger.warning("No template content available for script creation")
                return False
                
        except Exception as e:
            logger.error(f"Error creating script: {e}")
            return False

    parser = argparse.ArgumentParser(description='Intelligent Script Discovery System')
    parser.add_argument('purpose', help='Purpose of the script')
    parser.add_argument('--category', help='Script category')
    parser.add_argument('--requirements', help='Additional requirements')
    parser.add_argument('--output', help='Output file path')
    parser.add_argument('--create', action='store_true', help='Create the script file')
    
    args = parser.parse_args()
    
    # Initialize discovery system
    discovery = IntelligentScriptDiscovery()
    
    # Discover script
    print(f"🔍 Discovering script for: {args.purpose}")
    recommendation = discovery.discover_script(
        purpose=args.purpose,
        category=args.category,
        requirements=args.requirements or ""
    )
    
    # Print recommendation
    print(f"\n📋 Recommendation:")
    print(f"  Action: {recommendation.action}")
    print(f"  Confidence: {recommendation.confidence:.2f}")
    print(f"  Reasoning: {recommendation.reasoning}")
    
    if recommendation.existing_script:
        print(f"  Existing Script: {recommendation.existing_script}")
    
    print(f"\n💡 Suggestions:")
    for suggestion in recommendation.suggestions:
        print(f"  - {suggestion}")
    
    # Save recommendation
    discovery.save_recommendation(recommendation, args.purpose)
    
    # Create script if requested
    if args.create and args.output:
        if discovery.create_script_from_recommendation(recommendation, args.output):
            print(f"\n✅ Script created: {args.output}")
        else:
            print(f"\n❌ Failed to create script: {args.output}")

if __name__ == "__main__":
    main()
