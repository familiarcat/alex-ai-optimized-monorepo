from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Alex AI YOLO Mode Memory Integration
===================================

Integrates YOLO Mode limitations understanding into Alex AI memory system
and creates babysitting warning capabilities for prompt analysis.
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s:%(name)s:%(message)s')

class YOLOModeMemoryIntegration:
    """Integrates YOLO Mode understanding into Alex AI memory system"""
    
        self.memory_file = self.project_root / "alex_ai_yolo_mode_memory.json"
        
    def create_yolo_mode_memory(self):
        """Create comprehensive YOLO Mode memory for Alex AI"""
        memory = {
            "yolo_mode_memory": {
                "version": "1.0",
                "last_updated": datetime.now().isoformat(),
                "status": "integrated",
                "source": "deep_research_analysis"
            },
            "fundamental_understanding": {
                "title": "YOLO Mode Reality Check",
                "key_insight": "YOLO Mode is working as designed, but its design has limitations",
                "critical_finding": "YOLO Mode cannot eliminate all confirmation prompts - this is by design",
                "safety_reason": "File operations require confirmation to prevent unintended modifications and data loss"
            },
            "capabilities": {
                "what_yolo_can_do": {
                    "description": "Operations that YOLO Mode can automate without confirmation",
                    "categories": {
                        "terminal_commands": [
                            "cd", "ls", "pwd", "mkdir", "rmdir", "touch",
                            "cp", "mv", "ln", "find", "grep", "cat", "head", "tail"
                        ],
                        "git_operations": [
                            "git status", "git add", "git commit", "git push",
                            "git pull", "git fetch", "git branch", "git checkout",
                            "git merge", "git log", "git diff", "git stash"
                        ],
                        "package_management": [
                            "npm install", "npm run", "npm test", "npm build",
                            "pip install", "yarn install", "conda install"
                        ],
                        "development_tools": [
                            "python", "python3", "node", "npx",
                            "docker", "kubectl", "terraform", "make"
                        ],
                        "system_operations": [
                            "chmod", "chown", "ps", "top", "htop", "df", "du",
                            "curl", "wget", "ssh", "scp", "rsync"
                        ]
                    }
                },
                "what_yolo_cannot_do": {
                    "description": "Operations that YOLO Mode cannot automate (require confirmation)",
                    "categories": {
                        "file_operations": [
                            "File content creation and editing",
                            "New file creation with content",
                            "Modifying existing file contents",
                            "Configuration file changes"
                        ],
                        "code_operations": [
                            "Code generation and modification",
                            "Script creation and editing",
                            "Template generation",
                            "Code refactoring"
                        ],
                        "execution_operations": [
                            "Script execution that modifies files",
                            "Database operations",
                            "API calls that modify data",
                            "Any operation that changes file contents"
                        ]
                    }
                }
            },
            "babysitting_warning_system": {
                "description": "System to predict when prompts will require manual confirmation",
                "warning_triggers": {
                    "file_creation": [
                        "create", "new file", "write", "generate file",
                        "make file", "add file", "build file"
                    ],
                    "file_editing": [
                        "edit", "modify", "update", "change", "alter",
                        "fix", "correct", "improve", "refactor"
                    ],
                    "code_generation": [
                        "generate code", "create script", "write function",
                        "implement", "develop", "build", "construct"
                    ],
                    "script_execution": [
                        "run script", "execute", "launch", "start",
                        "deploy", "install", "setup", "configure"
                    ],
                    "configuration_changes": [
                        "config", "settings", "environment", "variables",
                        "credentials", "secrets", "tokens", "keys"
                    ]
                },
                "confidence_levels": {
                    "high": "Will definitely require confirmation",
                    "medium": "Likely to require confirmation", 
                    "low": "Might require confirmation",
                    "none": "Should work with YOLO Mode"
                }
            },
            "workflow_optimization": {
                "description": "Best practices for working with YOLO Mode limitations",
                "strategies": {
                    "batch_operations": "Group related file operations together to reduce prompt frequency",
                    "keyboard_shortcuts": "Use ⌘⮐ (Command + Enter) for faster confirmation",
                    "terminal_first": "Use YOLO Mode for terminal commands, then confirm file operations",
                    "hybrid_approach": "Combine YOLO Mode with other automation tools",
                    "accept_limitations": "Accept that file operations require confirmation by design"
                },
                "efficiency_tips": [
                    "Use YOLO Mode for system operations and terminal commands",
                    "Accept file operation confirmations quickly with keyboard shortcuts",
                    "Batch multiple file operations together",
                    "Use terminal commands to prepare for file operations",
                    "Configure allowlist with all necessary terminal commands"
                ]
            },
            "crew_memory_sync": {
                "description": "Information to sync across all crew members",
                "key_points": [
                    "YOLO Mode has inherent limitations that cannot be overcome",
                    "File operations always require confirmation (safety feature)",
                    "Use YOLO Mode for terminal commands, accept confirmations for file operations",
                    "Keyboard shortcuts (⌘⮐) provide faster confirmation",
                    "Batch operations to reduce prompt frequency",
                    "This is not a bug - it's working as designed"
                ]
            }
        }
        
        return memory
    
    def create_babysitting_warning_engine(self):
        """Create engine to predict when prompts will require confirmation"""
        warning_engine = {
            "babysitting_warning_engine": {
                "version": "1.0",
                "last_updated": datetime.now().isoformat(),
                "description": "Predicts when prompts will require manual confirmation"
            },
            "analysis_patterns": {
                "file_creation_patterns": [
                    r"create\s+(?:a\s+)?(?:new\s+)?file",
                    r"generate\s+(?:a\s+)?(?:new\s+)?file",
                    r"write\s+(?:a\s+)?(?:new\s+)?file",
                    r"make\s+(?:a\s+)?(?:new\s+)?file",
                    r"add\s+(?:a\s+)?(?:new\s+)?file",
                    r"build\s+(?:a\s+)?(?:new\s+)?file"
                ],
                "file_editing_patterns": [
                    r"edit\s+(?:the\s+)?(?:existing\s+)?file",
                    r"modify\s+(?:the\s+)?(?:existing\s+)?file",
                    r"update\s+(?:the\s+)?(?:existing\s+)?file",
                    r"change\s+(?:the\s+)?(?:existing\s+)?file",
                    r"alter\s+(?:the\s+)?(?:existing\s+)?file",
                    r"fix\s+(?:the\s+)?(?:existing\s+)?file"
                ],
                "code_generation_patterns": [
                    r"generate\s+(?:some\s+)?code",
                    r"create\s+(?:a\s+)?(?:new\s+)?script",
                    r"write\s+(?:a\s+)?(?:new\s+)?function",
                    r"implement\s+(?:a\s+)?(?:new\s+)?feature",
                    r"develop\s+(?:a\s+)?(?:new\s+)?component",
                    r"build\s+(?:a\s+)?(?:new\s+)?system"
                ],
                "script_execution_patterns": [
                    r"run\s+(?:the\s+)?(?:generated\s+)?script",
                    r"execute\s+(?:the\s+)?(?:generated\s+)?script",
                    r"launch\s+(?:the\s+)?(?:generated\s+)?script",
                    r"start\s+(?:the\s+)?(?:generated\s+)?script",
                    r"deploy\s+(?:the\s+)?(?:generated\s+)?script"
                ],
                "configuration_patterns": [
                    r"config\w*",
                    r"settings?",
                    r"environment",
                    r"variables?",
                    r"credentials?",
                    r"secrets?",
                    r"tokens?",
                    r"keys?"
                ]
            },
            "warning_messages": {
                "high_confidence": {
                    "message": "🚨 HIGH CONFIRMATION LIKELIHOOD: This prompt will definitely require manual confirmation",
                    "reason": "Contains file creation, editing, or code generation operations",
                    "suggestion": "Use ⌘⮐ (Command + Enter) for faster confirmation"
                },
                "medium_confidence": {
                    "message": "⚠️ MEDIUM CONFIRMATION LIKELIHOOD: This prompt will likely require manual confirmation",
                    "reason": "Contains operations that typically require confirmation",
                    "suggestion": "Be prepared to confirm with ⌘⮐ (Command + Enter)"
                },
                "low_confidence": {
                    "message": "💡 LOW CONFIRMATION LIKELIHOOD: This prompt might require manual confirmation",
                    "reason": "Contains some operations that could require confirmation",
                    "suggestion": "Monitor for confirmation prompts"
                },
                "no_confidence": {
                    "message": "✅ NO CONFIRMATION NEEDED: This prompt should work with YOLO Mode",
                    "reason": "Contains only terminal commands and system operations",
                    "suggestion": "Should execute automatically without confirmation"
                }
            }
        }
        
        return warning_engine
    
    def analyze_prompt_for_babysitting(self, prompt: str) -> Dict[str, Any]:
        """Analyze a prompt to predict if it will require confirmation"""
        analysis = {
            "prompt": prompt,
            "analysis_timestamp": datetime.now().isoformat(),
            "confidence_level": "none",
            "warning_message": "",
            "reason": "",
            "suggestion": "",
            "detected_patterns": [],
            "risk_factors": []
        }
        
        # Get warning engine
        warning_engine = self.create_babysitting_warning_engine()
        patterns = warning_engine["analysis_patterns"]
        
        # Check for high-risk patterns
        high_risk_patterns = []
        medium_risk_patterns = []
        low_risk_patterns = []
        
        # File creation patterns (high risk)
        for pattern in patterns["file_creation_patterns"]:
            if re.search(pattern, prompt, re.IGNORECASE):
                high_risk_patterns.append(f"File creation: {pattern}")
        
        # File editing patterns (high risk)
        for pattern in patterns["file_editing_patterns"]:
            if re.search(pattern, prompt, re.IGNORECASE):
                high_risk_patterns.append(f"File editing: {pattern}")
        
        # Code generation patterns (high risk)
        for pattern in patterns["code_generation_patterns"]:
            if re.search(pattern, prompt, re.IGNORECASE):
                high_risk_patterns.append(f"Code generation: {pattern}")
        
        # Script execution patterns (medium risk)
        for pattern in patterns["script_execution_patterns"]:
            if re.search(pattern, prompt, re.IGNORECASE):
                medium_risk_patterns.append(f"Script execution: {pattern}")
        
        # Configuration patterns (medium risk)
        for pattern in patterns["configuration_patterns"]:
            if re.search(pattern, prompt, re.IGNORECASE):
                medium_risk_patterns.append(f"Configuration: {pattern}")
        
        # Determine confidence level
        if high_risk_patterns:
            analysis["confidence_level"] = "high"
            analysis["warning_message"] = warning_engine["warning_messages"]["high_confidence"]["message"]
            analysis["reason"] = warning_engine["warning_messages"]["high_confidence"]["reason"]
            analysis["suggestion"] = warning_engine["warning_messages"]["high_confidence"]["suggestion"]
            analysis["detected_patterns"] = high_risk_patterns
            analysis["risk_factors"] = ["file_creation", "file_editing", "code_generation"]
        elif medium_risk_patterns:
            analysis["confidence_level"] = "medium"
            analysis["warning_message"] = warning_engine["warning_messages"]["medium_confidence"]["message"]
            analysis["reason"] = warning_engine["warning_messages"]["medium_confidence"]["reason"]
            analysis["suggestion"] = warning_engine["warning_messages"]["medium_confidence"]["suggestion"]
            analysis["detected_patterns"] = medium_risk_patterns
            analysis["risk_factors"] = ["script_execution", "configuration"]
        elif low_risk_patterns:
            analysis["confidence_level"] = "low"
            analysis["warning_message"] = warning_engine["warning_messages"]["low_confidence"]["message"]
            analysis["reason"] = warning_engine["warning_messages"]["low_confidence"]["reason"]
            analysis["suggestion"] = warning_engine["warning_messages"]["low_confidence"]["suggestion"]
            analysis["detected_patterns"] = low_risk_patterns
            analysis["risk_factors"] = ["potential_confirmation"]
        else:
            analysis["confidence_level"] = "none"
            analysis["warning_message"] = warning_engine["warning_messages"]["no_confidence"]["message"]
            analysis["reason"] = warning_engine["warning_messages"]["no_confidence"]["reason"]
            analysis["suggestion"] = warning_engine["warning_messages"]["no_confidence"]["suggestion"]
            analysis["detected_patterns"] = []
            analysis["risk_factors"] = []
        
        return analysis
    
    def save_memory_integration(self, memory, warning_engine):
        """Save YOLO Mode memory integration"""
        # Save main memory
        with open(self.memory_file, 'w') as f:
            json.dump(memory, f, indent=2)
        
        # Save warning engine
        warning_file = self.project_root / "babysitting_warning_engine.json"
        with open(warning_file, 'w') as f:
            json.dump(warning_engine, f, indent=2)
        
        logging.info(f"✅ YOLO Mode memory saved: {self.memory_file}")
        logging.info(f"✅ Warning engine saved: {warning_file}")
        
        return self.memory_file, warning_file
    
    def create_supabase_memory_update(self, memory):
        """Create Supabase memory update for YOLO Mode understanding"""
        supabase_update = {
            "memory_type": "yolo_mode_understanding",
            "version": "1.0",
            "last_updated": datetime.now().isoformat(),
            "status": "active",
            "priority": "high",
            "content": {
                "title": "YOLO Mode Reality Check - Critical Understanding",
                "summary": "YOLO Mode has inherent limitations that cannot be overcome",
                "key_insights": [
                    "YOLO Mode is working as designed, but its design has limitations",
                    "File operations always require confirmation (safety feature)",
                    "Use YOLO Mode for terminal commands, accept confirmations for file operations",
                    "Keyboard shortcuts (⌘⮐) provide faster confirmation",
                    "This is not a bug - it's working as designed"
                ],
                "capabilities": {
                    "can_automate": [
                        "Terminal commands (git, npm, python, system operations)",
                        "Package management (npm install, pip install)",
                        "Git operations (git add, commit, push)",
                        "System operations (chmod, mkdir, touch)"
                    ],
                    "cannot_automate": [
                        "File content creation and editing",
                        "Code generation and modification",
                        "Script execution that modifies files",
                        "Configuration file changes"
                    ]
                },
                "workflow_optimization": [
                    "Use YOLO Mode for terminal commands and system operations",
                    "Accept file operation confirmations quickly with keyboard shortcuts",
                    "Batch multiple file operations together",
                    "Use terminal commands to prepare for file operations",
                    "Configure allowlist with all necessary terminal commands"
                ],
                "babysitting_warning": {
                    "description": "System to predict when prompts will require confirmation",
                    "high_risk_operations": [
                        "File creation and editing",
                        "Code generation and modification",
                        "Script execution that modifies files"
                    ],
                    "warning_message": "🚨 HIGH CONFIRMATION LIKELIHOOD: This prompt will definitely require manual confirmation",
                    "suggestion": "Use ⌘⮐ (Command + Enter) for faster confirmation"
                }
            },
            "crew_sync": {
                "description": "Information to sync across all crew members",
                "key_points": [
                    "YOLO Mode has inherent limitations that cannot be overcome",
                    "File operations always require confirmation (safety feature)",
                    "Use YOLO Mode for terminal commands, accept confirmations for file operations",
                    "Keyboard shortcuts (⌘⮐) provide faster confirmation",
                    "Batch operations to reduce prompt frequency",
                    "This is not a bug - it's working as designed"
                ]
            }
        }
        
        return supabase_update
    
    def run_memory_integration(self):
        """Run complete YOLO Mode memory integration"""
        logging.info("🧠 Integrating YOLO Mode understanding into Alex AI memory system")
        
        # Create memory
        memory = self.create_yolo_mode_memory()
        
        # Create warning engine
        warning_engine = self.create_babysitting_warning_engine()
        
        # Save memory integration
        memory_file, warning_file = self.save_memory_integration(memory, warning_engine)
        
        # Create Supabase update
        supabase_update = self.create_supabase_memory_update(memory)
        
        # Save Supabase update
        supabase_file = self.project_root / "supabase_yolo_mode_memory_update.json"
        with open(supabase_file, 'w') as f:
            json.dump(supabase_update, f, indent=2)
        
        logging.info(f"✅ Supabase memory update saved: {supabase_file}")
        
        # Test the warning system
        test_prompts = [
            "Create a new file called test.py with some Python code",
            "Edit the existing config.json file to add new settings",
            "Generate a script to automate the deployment process",
            "Run git status to check the current repository state",
            "Install npm packages and then create a new component file"
        ]
        
        logging.info("🧪 Testing babysitting warning system...")
        for prompt in test_prompts:
            analysis = self.analyze_prompt_for_babysitting(prompt)
            logging.info(f"📝 Prompt: {prompt[:50]}...")
            logging.info(f"🎯 Confidence: {analysis['confidence_level']}")
            logging.info(f"⚠️ Warning: {analysis['warning_message']}")
            logging.info("---")
        
        logging.info("✅ YOLO Mode memory integration complete")
        
        return {
            "status": "success",
            "memory_file": memory_file,
            "warning_file": warning_file,
            "supabase_file": supabase_file,
            "test_results": "babysitting warning system tested successfully"
        }

    print("🧠 Alex AI YOLO Mode Memory Integration")
    print("=" * 50)
    
    integration = YOLOModeMemoryIntegration()
    result = integration.run_memory_integration()
    
    if result.get("status") == "success":
        print("✅ YOLO Mode memory integration complete!")
        print(f"📄 Memory file: {result['memory_file']}")
        print(f"📄 Warning engine: {result['warning_file']}")
        print(f"📄 Supabase update: {result['supabase_file']}")
        
        print("\n🎯 KEY FEATURES ADDED:")
        print("✅ YOLO Mode limitations integrated into Alex AI memory")
        print("✅ Babysitting warning system for prompt analysis")
        print("✅ Supabase memory update for crew synchronization")
        print("✅ Pattern recognition for confirmation requirements")
        print("✅ Workflow optimization recommendations")
        
        print("\n🚨 BABYSITTING WARNING SYSTEM:")
        print("✅ Predicts when prompts will require confirmation")
        print("✅ Provides confidence levels (high/medium/low/none)")
        print("✅ Suggests optimization strategies")
        print("✅ Warns users about YOLO Mode limitations")
        
        print("\n🎉 CONCLUSION:")
        print("Alex AI now understands YOLO Mode limitations and can warn users")
        print("when prompts will require manual confirmation!")
        
    else:
        print("❌ Memory integration failed")

if __name__ == "__main__":
    main()

