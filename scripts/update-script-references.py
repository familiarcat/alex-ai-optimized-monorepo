from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Update Script References
========================
Update script references and dependencies after consolidation
"""

import os
import re
import json
from typing import Dict, List, Set
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ScriptReferenceUpdater:
        self.consolidation_mapping = self.load_consolidation_mapping()
        self.updated_files = []
        
    def load_consolidation_mapping(self) -> Dict:
        """Load consolidation mapping from plan"""
        try:
            with open('script-consolidation-plan.json', 'r') as f:
                plan = json.load(f)
                return plan.get('consolidation_plan', {})
        except Exception as e:
            logger.error(f"Error loading consolidation mapping: {e}")
            return {}
    
    def update_all_references(self) -> bool:
        """Update all script references in the codebase"""
        try:
            logger.info("Updating script references...")
            
            # Update script files
            self.update_script_files()
            
            # Update package.json scripts
            self.update_package_json()
            
            # Update documentation files
            self.update_documentation()
            
            # Update configuration files
            self.update_config_files()
            
            logger.info(f"Updated references in {len(self.updated_files)} files")
            return True
            
        except Exception as e:
            logger.error(f"Error updating references: {e}")
            return False
    
    def update_script_files(self):
        """Update references in script files"""
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.sh', '.py', '.js')):
                    file_path = os.path.join(root, file)
                    self.update_file_references(file_path)
    
    def update_file_references(self, file_path: str):
        """Update references in a single file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            original_content = content
            
            # Update script references
            content = self.update_script_calls(content)
            
            # Update import statements
            content = self.update_imports(content)
            
            # Update relative paths
            content = self.update_relative_paths(content)
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                self.updated_files.append(file_path)
                logger.info(f"Updated references in: {file_path}")
                
        except Exception as e:
            logger.error(f"Error updating file {file_path}: {e}")
    
    def update_script_calls(self, content: str) -> str:
        """Update script calls to use new paths"""
        # Pattern for script calls
        patterns = [
            r'\./scripts/([a-zA-Z0-9_-]+\.(?:sh|py|js))',
            r'scripts/([a-zA-Z0-9_-]+\.(?:sh|py|js))',
            r'python3 scripts/([a-zA-Z0-9_-]+\.py)',
            r'bash scripts/([a-zA-Z0-9_-]+\.sh)',
            r'node scripts/([a-zA-Z0-9_-]+\.js)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                old_path = f"scripts/{match}"
                new_path = self.get_new_script_path(match)
                if new_path and new_path != old_path:
                    content = content.replace(old_path, new_path)
        
        return content
    
    def update_imports(self, content: str) -> str:
        """Update import statements"""
        # Python imports
        python_patterns = [
            r'from scripts\.([a-zA-Z0-9_-]+) import',
            r'import scripts\.([a-zA-Z0-9_-]+)',
            r'from \.\.scripts\.([a-zA-Z0-9_-]+) import'
        ]
        
        for pattern in python_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                old_import = f"scripts.{match}"
                new_import = self.get_new_import_path(match)
                if new_import:
                    content = content.replace(old_import, new_import)
        
        return content
    
    def update_relative_paths(self, content: str) -> str:
        """Update relative paths to scripts"""
        # Update relative paths
        path_patterns = [
            r'\.\./scripts/([a-zA-Z0-9_-]+\.(?:sh|py|js))',
            r'\./scripts/([a-zA-Z0-9_-]+\.(?:sh|py|js))'
        ]
        
        for pattern in path_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                old_path = f"scripts/{match}"
                new_path = self.get_new_script_path(match)
                if new_path and new_path != old_path:
                    content = content.replace(old_path, new_path)
        
        return content
    
    def get_new_script_path(self, script_name: str) -> str:
        """Get new path for a script after consolidation"""
        # Check if script was consolidated
        for category, data in self.consolidation_mapping.items():
            subcategory_groups = data.get('subcategory_groups', {})
            for subcategory, scripts in subcategory_groups.items():
                for script in scripts:
                    if script.get('name') == script_name:
                        return f"scripts/{category}/{subcategory}/consolidated_{subcategory}.py"
        
        # If not consolidated, return original path
        return f"scripts/{script_name}"
    
    def get_new_import_path(self, module_name: str) -> str:
        """Get new import path for a module"""
        # Check if module was consolidated
        for category, data in self.consolidation_mapping.items():
            subcategory_groups = data.get('subcategory_groups', {})
            for subcategory, scripts in subcategory_groups.items():
                for script in scripts:
                    if script.get('name') == f"{module_name}.py":
                        return f"scripts.{category}.{subcategory}.consolidated_{subcategory}"
        
        # If not consolidated, return original path
        return f"scripts.{module_name}"
    
    def update_package_json(self):
        """Update package.json script references"""
        package_json_path = "package.json"
        if os.path.exists(package_json_path):
            try:
                with open(package_json_path, 'r') as f:
                    package_data = json.load(f)
                
                scripts = package_data.get('scripts', {})
                updated = False
                
                for script_name, script_command in scripts.items():
                    if isinstance(script_command, str):
                        new_command = self.update_script_calls(script_command)
                        if new_command != script_command:
                            scripts[script_name] = new_command
                            updated = True
                
                if updated:
                    package_data['scripts'] = scripts
                    with open(package_json_path, 'w') as f:
                        json.dump(package_data, f, indent=2)
                    self.updated_files.append(package_json_path)
                    logger.info("Updated package.json scripts")
                    
            except Exception as e:
                logger.error(f"Error updating package.json: {e}")
    
    def update_documentation(self):
        """Update documentation files"""
        doc_files = [
            "README.md",
            "ALEX_AI_ENABLED_SUMMARY.md",
            "SCRIPT_MEMORY_SYSTEM_SUMMARY.md"
        ]
        
        for doc_file in doc_files:
            if os.path.exists(doc_file):
                self.update_file_references(doc_file)
    
    def update_config_files(self):
        """Update configuration files"""
        config_files = [
            "turbo.json",
            "vercel.json",
            "pnpm-workspace.yaml"
        ]
        
        for config_file in config_files:
            if os.path.exists(config_file):
                self.update_file_references(config_file)
    
    def create_script_index(self) -> bool:
        """Create an index of all scripts for easy reference"""
        try:
            script_index = {
                "consolidated_scripts": {},
                "remaining_scripts": {},
                "categories": {}
            }
            
            # Index consolidated scripts
            for category, data in self.consolidation_mapping.items():
                subcategory_groups = data.get('subcategory_groups', {})
                for subcategory, scripts in subcategory_groups.items():
                    if len(scripts) > 3:  # Only consolidated if more than 3 scripts
                        script_index["consolidated_scripts"][f"{category}/{subcategory}"] = {
                            "path": f"scripts/{category}/{subcategory}/consolidated_{subcategory}.py",
                            "original_scripts": [s.get('name') for s in scripts],
                            "count": len(scripts)
                        }
            
            # Index remaining scripts
            for root, dirs, files in os.walk(self.scripts_dir):
                for file in files:
                    if file.endswith(('.sh', '.py', '.js')) and not file.startswith('consolidated_'):
                        file_path = os.path.join(root, file)
                        relative_path = os.path.relpath(file_path, self.scripts_dir)
                        script_index["remaining_scripts"][file] = {
                            "path": relative_path,
                            "category": self.determine_script_category(file)
                        }
            
            # Save index
            with open('scripts/script-index.json', 'w') as f:
                json.dump(script_index, f, indent=2)
            
            logger.info("Created script index")
            return True
            
        except Exception as e:
            logger.error(f"Error creating script index: {e}")
            return False
    
    def determine_script_category(self, script_name: str) -> str:
        """Determine script category based on name"""
        name_lower = script_name.lower()
        
        if 'n8n' in name_lower or 'deploy' in name_lower:
            return 'deployment'
        elif 'test' in name_lower:
            return 'testing'
        elif 'ai' in name_lower or 'claude' in name_lower:
            return 'ai_ml'
        elif 'data' in name_lower or 'supabase' in name_lower:
            return 'data_management'
        elif 'sync' in name_lower or 'workflow' in name_lower:
            return 'workflow'
        else:
            return 'utilities'

    print("🔄 Updating Script References")
    print("=" * 40)
    
    updater = ScriptReferenceUpdater()
    
    # Update all references
    if updater.update_all_references():
        print("✅ Script references updated successfully")
    else:
        print("❌ Error updating script references")
        return
    
    # Create script index
    if updater.create_script_index():
        print("✅ Script index created")
    else:
        print("❌ Error creating script index")
    
    print(f"\n📊 Summary:")
    print(f"  Files Updated: {len(updater.updated_files)}")
    print(f"  Script Index: scripts/script-index.json")
    
    print(f"\n📁 Updated Files:")
    for file in updater.updated_files[:10]:  # Show first 10
        print(f"  - {file}")
    
    if len(updater.updated_files) > 10:
        print(f"  ... and {len(updater.updated_files) - 10} more")

if __name__ == "__main__":
    main()











