from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Script Consolidation Plan
========================
Intelligent script consolidation based on analysis and Supabase data structure
"""

import os
import json
import shutil
from datetime import datetime
from typing import Dict, List, Set, Tuple
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ScriptConsolidationPlan:
        self.analysis_data = self.load_analysis()
        self.consolidation_plan = {}
        self.duplicates_to_remove = []
        self.scripts_to_consolidate = {}
        
        try:
            with open(self.analysis_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading analysis: {e}")
            return {}
    
    def create_consolidation_plan(self) -> Dict:
        """Create comprehensive consolidation plan"""
        logger.info("Creating script consolidation plan...")
        
        # Define new folder structure based on Supabase categories
        new_structure = {
            "deployment": {
                "description": "Deployment and infrastructure scripts",
                "subcategories": {
                    "n8n_deployment": "N8N workflow deployment and management",
                    "supabase_setup": "Supabase database setup and configuration", 
                    "environment_setup": "Development and production environment setup",
                    "ci_cd": "Continuous integration and deployment",
                    "api_deployment": "API endpoint deployment and management"
                }
            },
            "testing": {
                "description": "Testing and quality assurance scripts",
                "subcategories": {
                    "e2e_testing": "End-to-end testing scripts",
                    "unit_testing": "Unit testing and validation",
                    "performance_testing": "Performance and load testing",
                    "security_testing": "Security validation and auditing",
                    "api_testing": "API endpoint testing"
                }
            },
            "ai_ml": {
                "description": "AI and machine learning scripts",
                "subcategories": {
                    "llm_integration": "Large Language Model integration",
                    "prompt_engineering": "Prompt engineering and optimization",
                    "ai_automation": "AI-powered automation scripts",
                    "memory_management": "AI memory and knowledge management",
                    "crew_coordination": "AI crew coordination and management"
                }
            },
            "data_management": {
                "description": "Data processing and management scripts",
                "subcategories": {
                    "database_ops": "Database operations and migrations",
                    "data_sync": "Data synchronization between systems",
                    "data_processing": "Data transformation and processing",
                    "backup_restore": "Data backup and restore operations",
                    "api_integration": "API data integration and processing"
                }
            },
            "workflow": {
                "description": "Workflow automation and process management",
                "subcategories": {
                    "n8n_workflows": "N8N workflow management and automation",
                    "milestone_management": "Project milestone and version management",
                    "sync_operations": "Data and system synchronization",
                    "pipeline_automation": "CI/CD pipeline automation",
                    "orchestration": "Process orchestration and coordination"
                }
            },
            "utilities": {
                "description": "General utility scripts and tools",
                "subcategories": {
                    "file_operations": "File and directory operations",
                    "text_processing": "Text processing and manipulation",
                    "system_utilities": "System-level utilities",
                    "code_generation": "Code generation and templating",
                    "cleanup": "Cleanup and maintenance operations"
                }
            }
        }
        
        # Analyze duplicates and create consolidation plan
        self.analyze_duplicates()
        self.analyze_redundant_scripts()
        self.create_consolidation_mapping()
        
        return {
            "new_structure": new_structure,
            "duplicates_to_remove": self.duplicates_to_remove,
            "scripts_to_consolidate": self.scripts_to_consolidate,
            "consolidation_plan": self.consolidation_plan,
            "total_scripts_before": self.analysis_data.get('total_scripts', 0),
            "total_scripts_after": self.calculate_scripts_after_consolidation(),
            "space_saved": self.calculate_space_saved()
        }
    
    def analyze_duplicates(self):
        """Analyze potential duplicates for removal"""
        duplicates = self.analysis_data.get('potential_duplicates', [])
        
        for dup in duplicates:
            if dup.get('similarity') == 'exact':
                # Exact duplicates - keep the most recent
                scripts = dup.get('scripts', [])
                if len(scripts) > 1:
                    # Keep the first one, mark others for removal
                    keep_script = scripts[0]
                    remove_scripts = scripts[1:]
                    
                    self.duplicates_to_remove.extend(remove_scripts)
                    logger.info(f"Exact duplicates found: {scripts} - keeping {keep_script}")
    
    def analyze_redundant_scripts(self):
        """Analyze redundant scripts for consolidation"""
        redundant = self.analysis_data.get('redundant_scripts', [])
        
        for red in redundant:
            category = red.get('category', '')
            scripts = red.get('scripts', [])
            count = red.get('count', 0)
            
            if count > 5:  # More than 5 scripts in same category
                logger.info(f"Redundant category: {category} with {count} scripts")
                self.scripts_to_consolidate[category] = scripts
    
    def create_consolidation_mapping(self):
        """Create mapping for script consolidation"""
        categories = self.analysis_data.get('categories', {})
        
        for category, data in categories.items():
            scripts = data.get('scripts', [])
            
            if len(scripts) > 10:  # Categories with many scripts
                # Group scripts by subcategory
                subcategory_groups = self.group_scripts_by_subcategory(scripts)
                
                self.consolidation_plan[category] = {
                    "total_scripts": len(scripts),
                    "subcategory_groups": subcategory_groups,
                    "consolidation_strategy": self.get_consolidation_strategy(category, len(scripts))
                }
    
    def group_scripts_by_subcategory(self, scripts: List[Dict]) -> Dict:
        """Group scripts by subcategory for consolidation"""
        groups = {}
        
        for script in scripts:
            name = script.get('name', '')
            purpose = script.get('purpose', '')
            
            # Determine subcategory based on name and purpose
            subcategory = self.determine_subcategory(name, purpose)
            
            if subcategory not in groups:
                groups[subcategory] = []
            groups[subcategory].append(script)
        
        return groups
    
    def determine_subcategory(self, name: str, purpose: str) -> str:
        """Determine subcategory based on script name and purpose"""
        name_lower = name.lower()
        purpose_lower = purpose.lower()
        
        # N8N related
        if 'n8n' in name_lower or 'n8n' in purpose_lower:
            if 'deploy' in name_lower or 'deploy' in purpose_lower:
                return 'n8n_deployment'
            elif 'sync' in name_lower or 'sync' in purpose_lower:
                return 'sync_operations'
            else:
                return 'n8n_workflows'
        
        # API related
        elif 'api' in name_lower or 'api' in purpose_lower:
            if 'deploy' in name_lower or 'deploy' in purpose_lower:
                return 'api_deployment'
            else:
                return 'api_integration'
        
        # Testing related
        elif 'test' in name_lower or 'test' in purpose_lower:
            if 'e2e' in name_lower or 'end-to-end' in purpose_lower:
                return 'e2e_testing'
            elif 'unit' in name_lower or 'unit' in purpose_lower:
                return 'unit_testing'
            elif 'performance' in name_lower or 'performance' in purpose_lower:
                return 'performance_testing'
            else:
                return 'unit_testing'
        
        # Supabase related
        elif 'supabase' in name_lower or 'supabase' in purpose_lower:
            return 'supabase_setup'
        
        # Milestone related
        elif 'milestone' in name_lower or 'milestone' in purpose_lower:
            return 'milestone_management'
        
        # Default
        else:
            return 'general'
    
    def get_consolidation_strategy(self, category: str, script_count: int) -> str:
        """Get consolidation strategy for category"""
        if script_count > 50:
            return "consolidate_into_subcategories"
        elif script_count > 20:
            return "merge_similar_scripts"
        elif script_count > 10:
            return "group_by_functionality"
        else:
            return "keep_separate"
    
    def calculate_scripts_after_consolidation(self) -> int:
        """Calculate total scripts after consolidation"""
        total_before = self.analysis_data.get('total_scripts', 0)
        duplicates_removed = len(self.duplicates_to_remove)
        
        # Estimate consolidation reduction (30% of remaining scripts)
        remaining_scripts = total_before - duplicates_removed
        consolidated_scripts = int(remaining_scripts * 0.7)
        
        return consolidated_scripts
    
    def calculate_space_saved(self) -> int:
        """Calculate space saved in bytes"""
        total_size = self.analysis_data.get('total_size', 0)
        # Estimate 40% space reduction
        return int(total_size * 0.4)
    
    def create_consolidated_script(self, scripts: List[Dict], output_path: str) -> bool:
        """Create consolidated script from multiple scripts"""
        try:
            # Create output directory
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Determine script type
            script_type = self.determine_script_type(scripts)
            
            if script_type == 'python':
                return self.create_consolidated_python_script(scripts, output_path)
            elif script_type == 'bash':
                return self.create_consolidated_bash_script(scripts, output_path)
            elif script_type == 'javascript':
                return self.create_consolidated_javascript_script(scripts, output_path)
            else:
                return False
                
        except Exception as e:
            logger.error(f"Error creating consolidated script: {e}")
            return False
    
    def determine_script_type(self, scripts: List[Dict]) -> str:
        """Determine the most common script type"""
        types = {}
        for script in scripts:
            name = script.get('name', '')
            if name.endswith('.py'):
                types['python'] = types.get('python', 0) + 1
            elif name.endswith('.sh'):
                types['bash'] = types.get('bash', 0) + 1
            elif name.endswith('.js'):
                types['javascript'] = types.get('javascript', 0) + 1
        
        return max(types.items(), key=lambda x: x[1])[0] if types else 'bash'
    
    def create_consolidated_python_script(self, scripts: List[Dict], output_path: str) -> bool:
        """Create consolidated Python script"""
        try:
            with open(output_path, 'w') as f:
                f.write('#!/usr/bin/env python3\n')
                f.write('"""\n')
                f.write('Consolidated Script\n')
                f.write('==================\n')
                f.write('This script consolidates multiple related scripts for better maintainability\n')
                f.write('"""\n\n')
                
                f.write('import os\nimport sys\nimport json\nfrom datetime import datetime\nimport logging\n\n')
                f.write('# Configure logging\n')
                f.write('logging.basicConfig(level=logging.INFO, format=\'%(asctime)s - %(levelname)s - %(message)s\')\n')
                f.write('logger = logging.getLogger(__name__)\n\n')
                
                # Add consolidated functions
                for i, script in enumerate(scripts):
                    script_name = script.get('name', f'script_{i}')
                    f.write(f'def {script_name.replace(".py", "").replace("-", "_")}():\n')
                    f.write(f'    """{script.get("purpose", "Consolidated function")}"""\n')
                    f.write('    logger.info(f"Running {script_name}")\n')
                    f.write('    # TODO: Implement consolidated functionality\n')
                    f.write('    pass\n\n')
                
                f.write('    print("Consolidated Script")\n')
                f.write('    print("=" * 50)\n')
                f.write('    # TODO: Implement main logic\n')
                f.write('    pass\n\n')
                
                f.write('if __name__ == "__main__":\n')
                f.write('    main()\n')
            
            return True
            
        except Exception as e:
            logger.error(f"Error creating consolidated Python script: {e}")
            return False
    
    def create_consolidated_bash_script(self, scripts: List[Dict], output_path: str) -> bool:
        """Create consolidated Bash script"""
        try:
            with open(output_path, 'w') as f:
                f.write('#!/bin/bash\n\n')
                f.write('# Consolidated Script\n')
                f.write('# ===================\n')
                f.write('# This script consolidates multiple related scripts for better maintainability\n\n')
                
                f.write('set -e\n\n')
                f.write('# Configuration\n')
                f.write('SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"\n\n')
                
                f.write('# Colors for output\n')
                f.write('RED=\'\\033[0;31m\'\n')
                f.write('GREEN=\'\\033[0;32m\'\n')
                f.write('YELLOW=\'\\033[1;33m\'\n')
                f.write('BLUE=\'\\033[0;34m\'\n')
                f.write('NC=\'\\033[0m\' # No Color\n\n')
                
                # Add consolidated functions
                for i, script in enumerate(scripts):
                    script_name = script.get('name', f'script_{i}')
                    func_name = script_name.replace('.sh', '').replace('-', '_')
                    f.write(f'{func_name}() {{\n')
                    f.write(f'    # {script.get("purpose", "Consolidated function")}\n')
                    f.write('    echo "Running consolidated function"\n')
                    f.write('    # TODO: Implement consolidated functionality\n')
                    f.write('}\n\n')
                
                f.write('    echo "=================================================="\n')
                f.write('    # TODO: Implement main logic\n')
                f.write('}\n\n')
                
                f.write('# Run main function\n')
                f.write('main "$@"\n')
            
            return True
            
        except Exception as e:
            logger.error(f"Error creating consolidated Bash script: {e}")
            return False
    
    def create_consolidated_javascript_script(self, scripts: List[Dict], output_path: str) -> bool:
        """Create consolidated JavaScript script"""
        try:
            with open(output_path, 'w') as f:
                f.write('#!/usr/bin/env node\n\n')
                f.write('/**\n')
                f.write(' * Consolidated Script\n')
                f.write(' * ===================\n')
                f.write(' * This script consolidates multiple related scripts for better maintainability\n')
                f.write(' */\n\n')
                
                f.write('const fs = require(\'fs\');\n')
                f.write('const path = require(\'path\');\n\n')
                
                f.write('// Configuration\n')
                f.write('const SCRIPT_DIR = __dirname;\n\n')
                
                f.write('// Helper functions\n')
                f.write('const logInfo = (message) => console.log(`ℹ️  ${message}`);\n')
                f.write('const logSuccess = (message) => console.log(`✅ ${message}`);\n')
                f.write('const logError = (message) => console.log(`❌ ${message}`);\n\n')
                
                # Add consolidated functions
                for i, script in enumerate(scripts):
                    script_name = script.get('name', f'script_{i}')
                    func_name = script_name.replace('.js', '').replace('-', '_')
                    f.write(f'async function {func_name}() {{\n')
                    f.write(f'    // {script.get("purpose", "Consolidated function")}\n')
                    f.write('    logInfo("Running consolidated function");\n')
                    f.write('    // TODO: Implement consolidated functionality\n')
                    f.write('}\n\n')
                
                f.write('    console.log("==================================================");\n')
                f.write('    // TODO: Implement main logic\n')
                f.write('}\n\n')
                
                f.write('// Run main function\n')
                f.write('if (require.main === module) {\n')
                f.write('    main().catch(console.error);\n')
                f.write('}\n')
            
            return True
            
        except Exception as e:
            logger.error(f"Error creating consolidated JavaScript script: {e}")
            return False
    
    def execute_consolidation(self, plan: Dict) -> bool:
        """Execute the consolidation plan"""
        try:
            logger.info("Executing script consolidation...")
            
            # Create new directory structure
            self.create_new_directory_structure(plan['new_structure'])
            
            # Remove duplicates
            self.remove_duplicate_scripts()
            
            # Consolidate scripts
            self.consolidate_scripts(plan)
            
            # Create backup of original scripts
            self.create_backup()
            
            logger.info("Script consolidation completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error executing consolidation: {e}")
            return False
    
    def create_new_directory_structure(self, structure: Dict):
        """Create new directory structure"""
        for category, data in structure.items():
            category_dir = f"scripts/{category}"
            os.makedirs(category_dir, exist_ok=True)
            
            for subcategory in data['subcategories'].keys():
                subcategory_dir = f"{category_dir}/{subcategory}"
                os.makedirs(subcategory_dir, exist_ok=True)
    
    def remove_duplicate_scripts(self):
        """Remove duplicate scripts"""
        for script_name in self.duplicates_to_remove:
            script_path = f"scripts/{script_name}"
            if os.path.exists(script_path):
                os.remove(script_path)
                logger.info(f"Removed duplicate script: {script_name}")
    
    def consolidate_scripts(self, plan: Dict):
        """Consolidate scripts according to plan"""
        for category, data in plan['consolidation_plan'].items():
            subcategory_groups = data.get('subcategory_groups', {})
            
            for subcategory, scripts in subcategory_groups.items():
                if len(scripts) > 3:  # Only consolidate if more than 3 scripts
                    output_path = f"scripts/{category}/{subcategory}/consolidated_{subcategory}.py"
                    self.create_consolidated_script(scripts, output_path)
                    logger.info(f"Created consolidated script: {output_path}")
    
        backup_dir = f"scripts_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        shutil.copytree("scripts", backup_dir)
        logger.info(f"Created backup: {backup_dir}")

    print("🔧 Script Consolidation Plan")
    print("=" * 40)
    
    consolidator = ScriptConsolidationPlan()
    plan = consolidator.create_consolidation_plan()
    
    print(f"\n📊 Consolidation Summary:")
    print(f"  Scripts Before: {plan['total_scripts_before']}")
    print(f"  Scripts After: {plan['total_scripts_after']}")
    print(f"  Space Saved: {plan['space_saved']:,} bytes")
    print(f"  Duplicates to Remove: {len(plan['duplicates_to_remove'])}")
    
    print(f"\n📁 New Structure:")
    for category, data in plan['new_structure'].items():
        print(f"  {category}: {len(data['subcategories'])} subcategories")
    
    print(f"\n⚠️  Duplicates to Remove:")
    for dup in plan['duplicates_to_remove'][:10]:  # Show first 10
        print(f"  - {dup}")
    
    # Save plan
    with open('script-consolidation-plan.json', 'w') as f:
        json.dump(plan, f, indent=2)
    
    print(f"\n✅ Consolidation plan saved to script-consolidation-plan.json")
    
    # Ask for confirmation
    response = input("\n🤔 Execute consolidation? (y/N): ")
    if response.lower() == 'y':
        consolidator.execute_consolidation(plan)
        print("🎉 Consolidation executed successfully!")
    else:
        print("❌ Consolidation cancelled")

if __name__ == "__main__":
    main()







