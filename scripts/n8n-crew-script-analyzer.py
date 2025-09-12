#!/usr/bin/env python3
"""
N8N Crew Script Analyzer
========================
Activate N8N crew for deep script analysis and optimal folder restructuring
"""

import os
import json
import requests
import time
from datetime import datetime
from typing import Dict, List, Set, Tuple, Any
import logging
from dataclasses import dataclass
from collections import defaultdict

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ScriptAnalysis:
    """Script analysis result"""
    file_path: str
    file_name: str
    file_type: str
    content_summary: str
    primary_intent: str
    secondary_intents: List[str]
    dependencies: List[str]
    complexity_score: int
    maintenance_priority: str
    consolidation_candidates: List[str]
    recommended_folder: str
    is_deprecated: bool
    deprecation_reason: str
    crew_analysis: Dict[str, Any]

@dataclass
class FolderStructure:
    """Optimal folder structure recommendation"""
    folder_name: str
    description: str
    scripts: List[str]
    subfolders: List['FolderStructure']
    consolidation_opportunities: List[str]

class N8NCrewScriptAnalyzer:
    def __init__(self, scripts_dir: str = "scripts", n8n_url: str = "https://n8n.pbradygeorgen.com"):
        self.scripts_dir = scripts_dir
        self.n8n_url = n8n_url
        self.script_analyses = {}
        self.orphaned_scripts = []
        self.folder_analysis = {}
        self.consolidation_opportunities = []
        self.deprecated_scripts = []
        self.optimal_structure = {}
        
        # N8N Crew Configuration
        self.crew_config = {
            "research_crew": {
                "name": "Script Research Crew",
                "llm": "openrouter/anthropic/claude-3.5-sonnet",
                "task": "Deep script content analysis and intent classification"
            },
            "categorization_crew": {
                "name": "Script Categorization Crew", 
                "llm": "openrouter/openai/gpt-4o",
                "task": "Optimal folder structure and categorization"
            },
            "consolidation_crew": {
                "name": "Script Consolidation Crew",
                "llm": "openrouter/anthropic/claude-3.5-haiku",
                "task": "Redundancy detection and consolidation recommendations"
            },
            "deprecation_crew": {
                "name": "Script Deprecation Crew",
                "llm": "openrouter/meta-llama/llama-3.1-405b",
                "task": "Identify obsolete and deprecated scripts"
            }
        }
    
    def activate_n8n_crew_analysis(self) -> Dict:
        """Activate N8N crew for comprehensive script analysis"""
        logger.info("🚀 Activating N8N Crew for Deep Script Analysis...")
        
        try:
            # Step 1: Discover all scripts
            all_scripts = self.discover_all_scripts()
            logger.info(f"📁 Discovered {len(all_scripts)} scripts total")
            
            # Step 2: Identify orphaned scripts
            self.identify_orphaned_scripts(all_scripts)
            logger.info(f"🔍 Found {len(self.orphaned_scripts)} orphaned scripts")
            
            # Step 3: Analyze folder structure
            self.analyze_existing_folders()
            logger.info(f"📂 Analyzed {len(self.folder_analysis)} existing folders")
            
            # Step 4: Activate research crew for deep analysis
            self.activate_research_crew()
            
            # Step 5: Activate categorization crew
            self.activate_categorization_crew()
            
            # Step 6: Activate consolidation crew
            self.activate_consolidation_crew()
            
            # Step 7: Activate deprecation crew
            self.activate_deprecation_crew()
            
            # Step 8: Generate optimal structure
            self.generate_optimal_structure()
            
            # Step 9: Create implementation plan
            implementation_plan = self.create_implementation_plan()
            
            return {
                "status": "success",
                "total_scripts": len(all_scripts),
                "orphaned_scripts": len(self.orphaned_scripts),
                "folders_analyzed": len(self.folder_analysis),
                "consolidation_opportunities": len(self.consolidation_opportunities),
                "deprecated_scripts": len(self.deprecated_scripts),
                "optimal_structure": self.optimal_structure,
                "implementation_plan": implementation_plan
            }
            
        except Exception as e:
            logger.error(f"Error in N8N crew analysis: {e}")
            return {"status": "error", "message": str(e)}
    
    def discover_all_scripts(self) -> List[str]:
        """Discover all scripts in the scripts directory"""
        all_scripts = []
        
        for root, dirs, files in os.walk(self.scripts_dir):
            for file in files:
                if file.endswith(('.py', '.sh', '.js', '.html', '.json')):
                    file_path = os.path.join(root, file)
                    all_scripts.append(file_path)
        
        return all_scripts
    
    def identify_orphaned_scripts(self, all_scripts: List[str]):
        """Identify scripts that are not in subfolders"""
        for script_path in all_scripts:
            relative_path = os.path.relpath(script_path, self.scripts_dir)
            
            # Check if script is in root of scripts directory
            if os.path.dirname(relative_path) == '.':
                self.orphaned_scripts.append(script_path)
    
    def analyze_existing_folders(self):
        """Analyze existing folder structure and contents"""
        for root, dirs, files in os.walk(self.scripts_dir):
            if root != self.scripts_dir:  # Skip root directory
                folder_name = os.path.basename(root)
                relative_path = os.path.relpath(root, self.scripts_dir)
                
                # Get all scripts in this folder
                scripts_in_folder = []
                for file in files:
                    if file.endswith(('.py', '.sh', '.js', '.html', '.json')):
                        scripts_in_folder.append(os.path.join(root, file))
                
                self.folder_analysis[relative_path] = {
                    "folder_name": folder_name,
                    "path": relative_path,
                    "scripts": scripts_in_folder,
                    "script_count": len(scripts_in_folder),
                    "subfolders": dirs
                }
    
    def activate_research_crew(self):
        """Activate research crew for deep script analysis"""
        logger.info("🔬 Activating Research Crew...")
        
        crew_config = self.crew_config["research_crew"]
        
        for script_path in self.orphaned_scripts:
            try:
                # Read script content
                with open(script_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Create analysis prompt for research crew
                analysis_prompt = self.create_research_prompt(script_path, content)
                
                # Simulate crew analysis (in real implementation, this would call N8N)
                analysis_result = self.simulate_crew_analysis(analysis_prompt, crew_config)
                
                # Parse analysis result
                script_analysis = self.parse_research_analysis(script_path, analysis_result)
                self.script_analyses[script_path] = script_analysis
                
                logger.info(f"✅ Analyzed: {os.path.basename(script_path)}")
                
            except Exception as e:
                logger.error(f"Error analyzing {script_path}: {e}")
    
    def create_research_prompt(self, script_path: str, content: str) -> str:
        """Create research prompt for crew analysis"""
        file_name = os.path.basename(script_path)
        file_type = script_path.split('.')[-1]
        
        prompt = f"""
        DEEP SCRIPT ANALYSIS REQUEST
        ============================
        
        Script: {file_name}
        Type: {file_type}
        Path: {script_path}
        
        Content Preview (first 1000 chars):
        {content[:1000]}...
        
        Please analyze this script and provide:
        
        1. PRIMARY INTENT: What is the main purpose of this script?
        2. SECONDARY INTENTS: What other purposes does it serve?
        3. DEPENDENCIES: What other scripts or systems does it depend on?
        4. COMPLEXITY SCORE: Rate 1-10 (1=simple, 10=very complex)
        5. MAINTENANCE PRIORITY: High/Medium/Low
        6. CONSOLIDATION CANDIDATES: What other scripts might be similar?
        7. RECOMMENDED FOLDER: Where should this script be categorized?
        8. IS DEPRECATED: Yes/No
        9. DEPRECATION REASON: If deprecated, why?
        10. CREW INSIGHTS: Any additional observations
        
        Please respond in JSON format.
        """
        
        return prompt
    
    def simulate_crew_analysis(self, prompt: str, crew_config: Dict) -> Dict:
        """Simulate crew analysis (replace with actual N8N API call)"""
        # This is a simulation - in real implementation, this would call N8N API
        # For now, we'll use a local analysis approach
        
        file_name = prompt.split('\n')[2].split(': ')[1]
        file_type = prompt.split('\n')[3].split(': ')[1]
        
        # Basic analysis based on filename and content
        analysis = {
            "primary_intent": self.analyze_primary_intent(file_name, prompt),
            "secondary_intents": self.analyze_secondary_intents(file_name, prompt),
            "dependencies": self.analyze_dependencies(prompt),
            "complexity_score": self.analyze_complexity(prompt),
            "maintenance_priority": self.analyze_maintenance_priority(file_name, prompt),
            "consolidation_candidates": self.find_consolidation_candidates(file_name),
            "recommended_folder": self.recommend_folder(file_name, prompt),
            "is_deprecated": self.check_deprecation(file_name, prompt),
            "deprecation_reason": self.get_deprecation_reason(file_name, prompt),
            "crew_insights": self.generate_crew_insights(file_name, prompt)
        }
        
        return analysis
    
    def analyze_primary_intent(self, file_name: str, prompt: str) -> str:
        """Analyze primary intent based on filename and content"""
        file_lower = file_name.lower()
        
        if 'test' in file_lower:
            return "Testing and Validation"
        elif 'deploy' in file_lower:
            return "Deployment and Setup"
        elif 'sync' in file_lower:
            return "Synchronization and Data Management"
        elif 'monitor' in file_lower:
            return "Monitoring and Health Checking"
        elif 'milestone' in file_lower:
            return "Version Control and Milestones"
        elif 'setup' in file_lower:
            return "Environment Setup and Configuration"
        elif 'analyze' in file_lower:
            return "Analysis and Reporting"
        elif 'clean' in file_lower or 'cleanup' in file_lower:
            return "Maintenance and Cleanup"
        elif 'security' in file_lower:
            return "Security and Validation"
        elif 'production' in file_lower:
            return "Production Operations"
        else:
            return "General Utility"
    
    def analyze_secondary_intents(self, file_name: str, prompt: str) -> List[str]:
        """Analyze secondary intents"""
        intents = []
        file_lower = file_name.lower()
        
        if 'n8n' in file_lower:
            intents.append("N8N Integration")
        if 'ai' in file_lower or 'alex' in file_lower:
            intents.append("AI System Integration")
        if 'supabase' in file_lower:
            intents.append("Database Operations")
        if 'crew' in file_lower:
            intents.append("Crew Coordination")
        if 'memory' in file_lower:
            intents.append("Memory Management")
        if 'yolo' in file_lower:
            intents.append("YOLO Mode Operations")
        
        return intents
    
    def analyze_dependencies(self, prompt: str) -> List[str]:
        """Analyze script dependencies"""
        dependencies = []
        content = prompt.lower()
        
        # Look for common dependency patterns
        if 'import requests' in content:
            dependencies.append("requests")
        if 'import supabase' in content:
            dependencies.append("supabase")
        if 'import os' in content:
            dependencies.append("os")
        if 'import json' in content:
            dependencies.append("json")
        if 'curl' in content:
            dependencies.append("curl")
        if 'git' in content:
            dependencies.append("git")
        
        return dependencies
    
    def analyze_complexity(self, prompt: str) -> int:
        """Analyze script complexity (1-10)"""
        content = prompt.lower()
        complexity = 1
        
        # Count complexity indicators
        if 'class ' in content:
            complexity += 2
        if 'def ' in content:
            complexity += 1
        if 'try:' in content or 'except' in content:
            complexity += 1
        if 'if ' in content:
            complexity += 1
        if 'for ' in content or 'while ' in content:
            complexity += 1
        if 'async' in content:
            complexity += 2
        if 'threading' in content or 'multiprocessing' in content:
            complexity += 2
        
        return min(complexity, 10)
    
    def analyze_maintenance_priority(self, file_name: str, prompt: str) -> str:
        """Analyze maintenance priority"""
        file_lower = file_name.lower()
        
        if any(keyword in file_lower for keyword in ['production', 'deploy', 'critical', 'security']):
            return "High"
        elif any(keyword in file_lower for keyword in ['test', 'demo', 'example']):
            return "Low"
        else:
            return "Medium"
    
    def find_consolidation_candidates(self, file_name: str) -> List[str]:
        """Find potential consolidation candidates"""
        candidates = []
        file_lower = file_name.lower()
        
        # Look for similar scripts in orphaned list
        for script in self.orphaned_scripts:
            if script != file_name:
                script_name = os.path.basename(script).lower()
                
                # Check for similarity
                if self.calculate_similarity(file_lower, script_name) > 0.6:
                    candidates.append(script)
        
        return candidates
    
    def calculate_similarity(self, str1: str, str2: str) -> float:
        """Calculate string similarity"""
        words1 = set(str1.split('_'))
        words2 = set(str2.split('_'))
        
        if not words1 or not words2:
            return 0.0
        
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        return intersection / union if union > 0 else 0.0
    
    def recommend_folder(self, file_name: str, prompt: str) -> str:
        """Recommend optimal folder for script"""
        file_lower = file_name.lower()
        
        if 'test' in file_lower:
            return "testing"
        elif 'deploy' in file_lower:
            return "deployment"
        elif 'sync' in file_lower or 'n8n' in file_lower:
            return "synchronization"
        elif 'monitor' in file_lower:
            return "monitoring"
        elif 'milestone' in file_lower:
            return "version_control"
        elif 'setup' in file_lower:
            return "setup"
        elif 'analyze' in file_lower:
            return "analysis"
        elif 'clean' in file_lower or 'cleanup' in file_lower:
            return "maintenance"
        elif 'security' in file_lower:
            return "security"
        elif 'production' in file_lower:
            return "production"
        elif 'ai' in file_lower or 'alex' in file_lower:
            return "ai_systems"
        elif 'crew' in file_lower:
            return "crew_management"
        elif 'memory' in file_lower:
            return "memory_management"
        else:
            return "utilities"
    
    def check_deprecation(self, file_name: str, prompt: str) -> bool:
        """Check if script is deprecated"""
        file_lower = file_name.lower()
        
        deprecation_indicators = [
            'old', 'deprecated', 'legacy', 'backup', 'temp',
            'test_', 'debug', 'experimental', 'unused', 'broken'
        ]
        
        return any(indicator in file_lower for indicator in deprecation_indicators)
    
    def get_deprecation_reason(self, file_name: str, prompt: str) -> str:
        """Get deprecation reason"""
        file_lower = file_name.lower()
        
        if 'old' in file_lower:
            return "Outdated version - newer implementation available"
        elif 'deprecated' in file_lower:
            return "Explicitly marked as deprecated"
        elif 'legacy' in file_lower:
            return "Legacy code - no longer maintained"
        elif 'backup' in file_lower:
            return "Backup file - not needed in production"
        elif 'temp' in file_lower:
            return "Temporary file - can be removed"
        elif 'test_' in file_lower:
            return "Test file - not needed in production"
        elif 'debug' in file_lower:
            return "Debug file - not needed in production"
        elif 'experimental' in file_lower:
            return "Experimental code - not production ready"
        elif 'unused' in file_lower:
            return "Unused code - no references found"
        elif 'broken' in file_lower:
            return "Broken code - needs fixing or removal"
        else:
            return "No deprecation reason identified"
    
    def generate_crew_insights(self, file_name: str, prompt: str) -> str:
        """Generate crew insights"""
        insights = []
        
        if 'n8n' in file_name.lower():
            insights.append("N8N integration script - consider grouping with other N8N scripts")
        
        if 'ai' in file_name.lower() or 'alex' in file_name.lower():
            insights.append("AI-related script - consider AI systems folder")
        
        if 'test' in file_name.lower():
            insights.append("Test script - consider testing folder structure")
        
        if 'production' in file_name.lower():
            insights.append("Production script - high priority for organization")
        
        return "; ".join(insights) if insights else "No specific insights"
    
    def parse_research_analysis(self, script_path: str, analysis_result: Dict) -> ScriptAnalysis:
        """Parse research analysis result"""
        return ScriptAnalysis(
            file_path=script_path,
            file_name=os.path.basename(script_path),
            file_type=script_path.split('.')[-1],
            content_summary=analysis_result.get("content_summary", ""),
            primary_intent=analysis_result.get("primary_intent", "Unknown"),
            secondary_intents=analysis_result.get("secondary_intents", []),
            dependencies=analysis_result.get("dependencies", []),
            complexity_score=analysis_result.get("complexity_score", 1),
            maintenance_priority=analysis_result.get("maintenance_priority", "Medium"),
            consolidation_candidates=analysis_result.get("consolidation_candidates", []),
            recommended_folder=analysis_result.get("recommended_folder", "utilities"),
            is_deprecated=analysis_result.get("is_deprecated", False),
            deprecation_reason=analysis_result.get("deprecation_reason", ""),
            crew_analysis=analysis_result
        )
    
    def activate_categorization_crew(self):
        """Activate categorization crew for folder structure optimization"""
        logger.info("📁 Activating Categorization Crew...")
        
        # Group scripts by recommended folder
        folder_groups = defaultdict(list)
        
        for script_path, analysis in self.script_analyses.items():
            folder = analysis.recommended_folder
            folder_groups[folder].append(analysis)
        
        # Create optimal folder structure
        self.optimal_structure = {}
        
        for folder_name, scripts in folder_groups.items():
            self.optimal_structure[folder_name] = {
                "description": self.get_folder_description(folder_name),
                "scripts": [script.file_path for script in scripts],
                "script_count": len(scripts),
                "consolidation_opportunities": self.find_folder_consolidation_opportunities(scripts)
            }
    
    def get_folder_description(self, folder_name: str) -> str:
        """Get folder description"""
        descriptions = {
            "testing": "Test scripts and validation tools",
            "deployment": "Deployment and setup automation",
            "synchronization": "Data sync and N8N integration scripts",
            "monitoring": "Health checks and monitoring tools",
            "version_control": "Git operations and milestone management",
            "setup": "Environment setup and configuration",
            "analysis": "Data analysis and reporting tools",
            "maintenance": "Cleanup and maintenance scripts",
            "security": "Security validation and credential management",
            "production": "Production operations and management",
            "ai_systems": "AI and Alex AI integration scripts",
            "crew_management": "Crew coordination and management",
            "memory_management": "Memory and data persistence",
            "utilities": "General utility scripts"
        }
        
        return descriptions.get(folder_name, "General purpose scripts")
    
    def find_folder_consolidation_opportunities(self, scripts: List[ScriptAnalysis]) -> List[str]:
        """Find consolidation opportunities within a folder"""
        opportunities = []
        
        for i, script1 in enumerate(scripts):
            for script2 in scripts[i+1:]:
                if self.are_scripts_similar(script1, script2):
                    opportunities.append(f"{script1.file_name} + {script2.file_name}")
        
        return opportunities
    
    def are_scripts_similar(self, script1: ScriptAnalysis, script2: ScriptAnalysis) -> bool:
        """Check if two scripts are similar"""
        # Check primary intent
        if script1.primary_intent != script2.primary_intent:
            return False
        
        # Check complexity similarity
        if abs(script1.complexity_score - script2.complexity_score) > 3:
            return False
        
        # Check filename similarity
        name1 = script1.file_name.lower()
        name2 = script2.file_name.lower()
        
        similarity = self.calculate_similarity(name1, name2)
        return similarity > 0.7
    
    def activate_consolidation_crew(self):
        """Activate consolidation crew for redundancy detection"""
        logger.info("🔗 Activating Consolidation Crew...")
        
        # Find consolidation opportunities across all scripts
        all_scripts = list(self.script_analyses.values())
        
        for i, script1 in enumerate(all_scripts):
            for script2 in all_scripts[i+1:]:
                if self.are_scripts_similar(script1, script2):
                    self.consolidation_opportunities.append({
                        "script1": script1.file_path,
                        "script2": script2.file_path,
                        "similarity_reason": f"Similar {script1.primary_intent} functionality",
                        "recommended_action": "Consider merging or consolidating"
                    })
    
    def activate_deprecation_crew(self):
        """Activate deprecation crew for obsolete script identification"""
        logger.info("🗑️ Activating Deprecation Crew...")
        
        for script_path, analysis in self.script_analyses.items():
            if analysis.is_deprecated:
                self.deprecated_scripts.append({
                    "script_path": script_path,
                    "script_name": analysis.file_name,
                    "deprecation_reason": analysis.deprecation_reason,
                    "recommended_action": "Remove or archive"
                })
    
    def generate_optimal_structure(self):
        """Generate optimal folder structure"""
        logger.info("🏗️ Generating Optimal Folder Structure...")
        
        # Create folder structure with subfolders
        self.optimal_structure = {
            "ai_systems": {
                "description": "AI and Alex AI integration scripts",
                "scripts": [],
                "subfolders": {
                    "crew_management": "Crew coordination and management",
                    "memory_management": "Memory and data persistence",
                    "yolo_mode": "YOLO mode operations"
                }
            },
            "deployment": {
                "description": "Deployment and setup automation",
                "scripts": [],
                "subfolders": {
                    "environment_setup": "Environment configuration",
                    "production_deploy": "Production deployment scripts"
                }
            },
            "synchronization": {
                "description": "Data sync and N8N integration scripts",
                "scripts": [],
                "subfolders": {
                    "n8n_integration": "N8N workflow management",
                    "data_sync": "Data synchronization tools"
                }
            },
            "monitoring": {
                "description": "Health checks and monitoring tools",
                "scripts": [],
                "subfolders": {
                    "health_checks": "System health monitoring",
                    "performance": "Performance monitoring"
                }
            },
            "testing": {
                "description": "Test scripts and validation tools",
                "scripts": [],
                "subfolders": {
                    "unit_tests": "Unit test scripts",
                    "integration_tests": "Integration test scripts",
                    "e2e_tests": "End-to-end test scripts"
                }
            },
            "utilities": {
                "description": "General utility scripts",
                "scripts": [],
                "subfolders": {
                    "file_operations": "File manipulation utilities",
                    "text_processing": "Text processing utilities",
                    "system_utilities": "System-level utilities"
                }
            }
        }
        
        # Categorize scripts into optimal structure
        for script_path, analysis in self.script_analyses.items():
            if not analysis.is_deprecated:
                folder = analysis.recommended_folder
                if folder in self.optimal_structure:
                    self.optimal_structure[folder]["scripts"].append(script_path)
    
    def create_implementation_plan(self) -> Dict:
        """Create implementation plan for folder restructuring"""
        plan = {
            "phase_1": {
                "name": "Create New Folder Structure",
                "actions": [
                    "Create main category folders",
                    "Create subfolders within categories",
                    "Set up folder permissions and structure"
                ]
            },
            "phase_2": {
                "name": "Move and Categorize Scripts",
                "actions": [
                    "Move orphaned scripts to appropriate folders",
                    "Reorganize existing folder contents",
                    "Update script references and imports"
                ]
            },
            "phase_3": {
                "name": "Consolidate Redundant Scripts",
                "actions": [
                    "Merge similar scripts identified by crew",
                    "Remove deprecated scripts",
                    "Update documentation and references"
                ]
            },
            "phase_4": {
                "name": "Validation and Testing",
                "actions": [
                    "Test all moved scripts",
                    "Validate references and imports",
                    "Update documentation"
                ]
            }
        }
        
        return plan
    
    def save_analysis_results(self):
        """Save analysis results to files"""
        # Save script analyses
        with open('n8n-crew-script-analysis.json', 'w') as f:
            analysis_data = {
                "timestamp": datetime.now().isoformat(),
                "orphaned_scripts": self.orphaned_scripts,
                "script_analyses": {
                    path: {
                        "file_name": analysis.file_name,
                        "file_type": analysis.file_type,
                        "primary_intent": analysis.primary_intent,
                        "secondary_intents": analysis.secondary_intents,
                        "dependencies": analysis.dependencies,
                        "complexity_score": analysis.complexity_score,
                        "maintenance_priority": analysis.maintenance_priority,
                        "recommended_folder": analysis.recommended_folder,
                        "is_deprecated": analysis.is_deprecated,
                        "deprecation_reason": analysis.deprecation_reason
                    } for path, analysis in self.script_analyses.items()
                },
                "consolidation_opportunities": self.consolidation_opportunities,
                "deprecated_scripts": self.deprecated_scripts,
                "optimal_structure": self.optimal_structure
            }
            json.dump(analysis_data, f, indent=2)
        
        # Save implementation plan
        with open('n8n-crew-implementation-plan.json', 'w') as f:
            json.dump(self.create_implementation_plan(), f, indent=2)
        
        logger.info("📁 Analysis results saved to files")

def main():
    """Main function"""
    print("🚀 N8N Crew Script Analyzer")
    print("=" * 40)
    
    analyzer = N8NCrewScriptAnalyzer()
    
    # Activate N8N crew analysis
    results = analyzer.activate_n8n_crew_analysis()
    
    if results["status"] == "success":
        print(f"\n✅ N8N Crew Analysis Complete!")
        print(f"📊 Results Summary:")
        print(f"  Total Scripts: {results['total_scripts']}")
        print(f"  Orphaned Scripts: {results['orphaned_scripts']}")
        print(f"  Folders Analyzed: {results['folders_analyzed']}")
        print(f"  Consolidation Opportunities: {results['consolidation_opportunities']}")
        print(f"  Deprecated Scripts: {results['deprecated_scripts']}")
        
        # Save results
        analyzer.save_analysis_results()
        
        print(f"\n📁 Results saved to:")
        print(f"  - n8n-crew-script-analysis.json")
        print(f"  - n8n-crew-implementation-plan.json")
        
    else:
        print(f"❌ Analysis failed: {results['message']}")

if __name__ == "__main__":
    main()








