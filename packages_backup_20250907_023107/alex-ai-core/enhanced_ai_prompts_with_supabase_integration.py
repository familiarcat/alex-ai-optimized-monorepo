#!/usr/bin/env python3
"""
Enhanced AI Prompts with Supabase Integration - Learn from Live System
Incorporates proven practices from live Supabase client and n8n integration
"""

import json
import datetime
import os
from typing import Dict, List, Any, Optional

class EnhancedAIPromptsWithSupabase:
    def __init__(self):
        # Extract configuration from live system
        self.live_supabase_config = {
            "url": "https://rpkkkbufdwxmjaerbhbn.supabase.co",
            "anon_key": "sb_publishable_ibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU",
            "project_name": "strange-new-world",
            "cli_path": "$HOME/.supabase/bin"
        }
        
        self.live_n8n_config = {
            "url": "https://n8n.pbradygeorgen.com",
            "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERMjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw",
            "base_url": "https://n8n.pbradygeorgen.com"
        }
        
        self.live_api_keys = {
            "openai": "sk-proj-API_KEY_PLACEHOLDER",
            "openrouter": "sk-or-v1-API_KEY_PLACEHOLDER31439f13fc40e77ecc1ff2a2",
            "claude_model": "claude-3-5-sonnet-20241022",
            "claude_max_tokens": 4000
        }
        
        # Enhanced AI prompt templates incorporating live practices
        self.enhanced_prompts = {
            "supabase_integration": {
                "environment_setup": """
# Supabase Integration Best Practices (from live system)
# Based on proven configuration at ~/.zshrc

# 1. Environment Variables (Secure Management)
export SUPABASE_URL="https://rpkkkbufdwxmjaerbhbn.supabase.co"
export SUPABASE_ANON_KEY="sb_publishable_ibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU"
export SUPABASE_PROJECT_NAME="strange-new-world"
export PATH="$HOME/.supabase/bin:$PATH"

# 2. Supabase Client Initialization (Python)
import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

# 3. Secure API Key Management Pattern
def load_supabase_config():
    return {
        "url": os.environ.get("SUPABASE_URL"),
        "anon_key": os.environ.get("SUPABASE_ANON_KEY"),
        "project_name": os.environ.get("SUPABASE_PROJECT_NAME")
    }

# 4. Error Handling Pattern
def safe_supabase_query(query_func, *args, **kwargs):
    try:
        result = query_func(*args, **kwargs)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}
""",
                "database_operations": """
# Supabase Database Operations (Proven Patterns)

# 1. Insert with Error Handling
def insert_market_research(data):
    try:
        result = supabase.table("market_research").insert(data).execute()
        return {"success": True, "data": result.data}
    except Exception as e:
        return {"success": False, "error": str(e)}

# 2. Query with Filters
def get_market_research_by_market(market):
    try:
        result = supabase.table("market_research")\
            .select("*")\
            .eq("market", market)\
            .execute()
        return {"success": True, "data": result.data}
    except Exception as e:
        return {"success": False, "error": str(e)}

# 3. Real-time Subscriptions
def subscribe_to_market_updates(market, callback):
    try:
        subscription = supabase.table("market_research")\
            .on("INSERT", callback)\
            .eq("market", market)\
            .subscribe()
        return {"success": True, "subscription": subscription}
    except Exception as e:
        return {"success": False, "error": str(e)}

# 4. Batch Operations
def batch_insert_research_data(data_list):
    try:
        result = supabase.table("market_research").insert(data_list).execute()
        return {"success": True, "data": result.data}
    except Exception as e:
        return {"success": False, "error": str(e)}
""",
                "n8n_integration": """
# N8N Integration Patterns (from live system)

# 1. N8N Webhook Configuration
N8N_CONFIG = {
    "url": "https://n8n.pbradygeorgen.com",
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERMjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"
}

# 2. Webhook Trigger Pattern
def trigger_n8n_workflow(workflow_id, data):
    import requests
    
    url = f"{N8N_CONFIG['url']}/webhook/{workflow_id}"
    headers = {
        "Authorization": f"Bearer {N8N_CONFIG['api_key']}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        return {"success": True, "response": response.json()}
    except Exception as e:
        return {"success": False, "error": str(e)}

# 3. N8N + Supabase Integration
def sync_data_to_n8n(table_name, data):
    # Insert to Supabase
    supabase_result = insert_market_research(data)
    
    if supabase_result["success"]:
        # Trigger N8N workflow
        n8n_result = trigger_n8n_workflow("market-research-sync", data)
        return {"supabase": supabase_result, "n8n": n8n_result}
    
    return {"supabase": supabase_result, "n8n": None}
""",
                "claude_integration": """
# Claude AI Integration (from live system)

# 1. Claude Configuration
CLAUDE_CONFIG = {
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 4000,
    "temperature": 0.7,
    "api_key": "sk-or-v1-API_KEY_PLACEHOLDER31439f13fc40e77ecc1ff2a2"
}

# 2. Claude Sub-Agent System
def create_claude_agent(agent_type, specialization):
    return {
        "agent_type": agent_type,
        "specialization": specialization,
        "model": CLAUDE_CONFIG["model"],
        "max_tokens": CLAUDE_CONFIG["max_tokens"],
        "temperature": CLAUDE_CONFIG["temperature"]
    }

# 3. Sub-Agent Orchestrator Pattern
def orchestrate_claude_agents(task, agents):
    results = []
    for agent in agents:
        result = process_with_agent(task, agent)
        results.append(result)
    return results

# 4. Claude + Supabase Integration
def analyze_with_claude_and_store(data, analysis_type):
    # Analyze with Claude
    claude_result = analyze_with_claude(data, analysis_type)
    
    if claude_result["success"]:
        # Store in Supabase
        supabase_result = insert_analysis_result(claude_result["data"])
        return {"claude": claude_result, "supabase": supabase_result}
    
    return {"claude": claude_result, "supabase": None}
"""
            }
        },
        "ai_prompt_enhancements": {
                "context_aware_prompts": """
# Context-Aware AI Prompts (Enhanced with Live System Knowledge)

# 1. Supabase-Aware Code Generation
def generate_supabase_code_prompt(requirements):
    return f"""
Generate Python code that integrates with our live Supabase instance:
- URL: https://rpkkkbufdwxmjaerbhbn.supabase.co
- Project: strange-new-world
- Use environment variables for configuration
- Include error handling patterns
- Follow our established database schema
- Integrate with N8N workflows at https://n8n.pbradygeorgen.com

Requirements: {requirements}
"""

# 2. N8N-Aware Workflow Generation
def generate_n8n_workflow_prompt(workflow_type):
    return f"""
Create an N8N workflow that integrates with our live system:
- Base URL: https://n8n.pbradygeorgen.com
- API Key: [configured in environment]
- Integrate with Supabase database
- Use Claude AI for analysis
- Follow our established automation patterns

Workflow Type: {workflow_type}
"""

# 3. Multi-System Integration Prompts
def generate_integration_prompt(systems):
    return f"""
Create an integration that connects these systems:
- Supabase: {self.live_supabase_config['url']}
- N8N: {self.live_n8n_config['url']}
- Claude AI: {self.live_api_keys['claude_model']}
- Use our established patterns and configurations
- Include proper error handling and logging
- Follow our security best practices

Systems to integrate: {systems}
"""
""",
                "automated_prompt_generation": """
# Automated Prompt Generation (Learning from Live System)

# 1. Dynamic Prompt Builder
def build_dynamic_prompt(context, requirements, system_config):
    prompt = f"""
# AI Assistant Prompt (Generated from Live System)
# Context: {context}
# Requirements: {requirements}
# System Configuration: {system_config}

# Available Systems:
- Supabase: {self.live_supabase_config['url']}
- N8N: {self.live_n8n_config['url']}
- Claude AI: {self.live_api_keys['claude_model']}

# Best Practices (from live system):
1. Use environment variables for configuration
2. Implement proper error handling
3. Follow established database schema
4. Integrate with existing workflows
5. Maintain security standards

# Task: {requirements}
"""
    return prompt

# 2. Context-Aware System Integration
def generate_system_integration_prompt(integration_type):
    return f"""
Create a {integration_type} integration using our live system configuration:

# Supabase Integration:
- URL: {self.live_supabase_config['url']}
- Project: {self.live_supabase_config['project_name']}
- Use environment variables for keys

# N8N Integration:
- Base URL: {self.live_n8n_config['url']}
- API Key: [from environment]
- Follow established webhook patterns

# Claude AI Integration:
- Model: {self.live_api_keys['claude_model']}
- Max Tokens: {self.live_api_keys['claude_max_tokens']}
- Use OpenRouter API

# Requirements:
- Implement proper error handling
- Use established patterns
- Maintain security standards
- Include logging and monitoring
"""
""",
                "learning_from_live_system": """
# Learning from Live System Patterns

# 1. Extract Configuration Patterns
def extract_live_config_patterns():
    return {
        "environment_management": {
            "pattern": "export VARIABLE_NAME=\"value\"",
            "security": "Use environment variables for sensitive data",
            "organization": "Group related variables together"
        },
        "api_integration": {
            "pattern": "Use environment variables for API keys",
            "error_handling": "Implement try-catch blocks",
            "logging": "Include success/error logging"
        },
        "database_operations": {
            "pattern": "Use Supabase client with error handling",
            "real_time": "Implement subscriptions for live updates",
            "batch_operations": "Use batch inserts for efficiency"
        }
    }

# 2. Generate Best Practice Prompts
def generate_best_practice_prompt(practice_type):
    practices = extract_live_config_patterns()
    
    if practice_type in practices:
        practice = practices[practice_type]
        return f"""
Implement {practice_type} following our live system patterns:

Pattern: {practice['pattern']}
Security: {practice.get('security', 'N/A')}
Organization: {practice.get('organization', 'N/A')}
Error Handling: {practice.get('error_handling', 'N/A')}
Logging: {practice.get('logging', 'N/A')}

Use our established configuration:
- Supabase: {self.live_supabase_config['url']}
- N8N: {self.live_n8n_config['url']}
- Claude: {self.live_api_keys['claude_model']}
"""
    
    return f"Unknown practice type: {practice_type}"

# 3. System-Aware Code Generation
def generate_system_aware_code(requirements):
    return f"""
Generate code that integrates with our live system:

# System Configuration:
- Supabase URL: {self.live_supabase_config['url']}
- N8N URL: {self.live_n8n_config['url']}
- Claude Model: {self.live_api_keys['claude_model']}

# Requirements: {requirements}

# Implementation Guidelines:
1. Use environment variables for configuration
2. Implement proper error handling
3. Follow established database schema
4. Integrate with existing workflows
5. Maintain security standards
6. Include logging and monitoring
7. Use real-time subscriptions where appropriate
8. Implement batch operations for efficiency
"""
"""
            }
        }
        
        # Enhanced prompt templates for specific use cases
        self.use_case_prompts = {
            "market_research_automation": """
# Market Research Automation (Enhanced with Live System)

# 1. Automated Data Collection
def create_market_research_workflow():
    return {
        "trigger": "webhook",
        "steps": [
            {
                "name": "collect_market_data",
                "type": "http_request",
                "config": {
                    "url": "https://api.market-data.com/research",
                    "method": "GET"
                }
            },
            {
                "name": "analyze_with_claude",
                "type": "claude_ai",
                "config": {
                    "model": "claude-3-5-sonnet-20241022",
                    "prompt": "Analyze this market data and extract key insights"
                }
            },
            {
                "name": "store_in_supabase",
                "type": "supabase",
                "config": {
                    "url": "https://rpkkkbufdwxmjaerbhbn.supabase.co",
                    "table": "market_research",
                    "operation": "insert"
                }
            }
        ]
    }

# 2. Real-time Market Monitoring
def setup_market_monitoring():
    return {
        "supabase_subscription": {
            "table": "market_research",
            "event": "INSERT",
            "callback": "process_new_market_data"
        },
        "n8n_webhook": {
            "url": "https://n8n.pbradygeorgen.com/webhook/market-update",
            "method": "POST"
        }
    }
""",
            "business_model_validation": """
# Business Model Validation (Enhanced with Live System)

# 1. Automated Validation Workflow
def create_validation_workflow():
    return {
        "trigger": "schedule",
        "frequency": "daily",
        "steps": [
            {
                "name": "fetch_business_models",
                "type": "supabase_query",
                "config": {
                    "table": "business_models",
                    "query": "SELECT * FROM business_models WHERE status = 'pending'"
                }
            },
            {
                "name": "validate_with_claude",
                "type": "claude_ai",
                "config": {
                    "model": "claude-3-5-sonnet-20241022",
                    "prompt": "Validate this business model and provide recommendations"
                }
            },
            {
                "name": "update_validation_status",
                "type": "supabase_update",
                "config": {
                    "table": "business_models",
                    "operation": "update",
                    "set": {"validation_status": "validated"}
                }
            }
        ]
    }

# 2. Revenue Projection Analysis
def analyze_revenue_projections():
    return {
        "data_source": "supabase",
        "table": "business_models",
        "analysis": "claude_ai",
        "output": "n8n_webhook"
    }
""",
            "agile_project_management": """
# Agile Project Management (Enhanced with Live System)

# 1. Sprint Management Workflow
def create_sprint_workflow():
    return {
        "trigger": "webhook",
        "steps": [
            {
                "name": "create_sprint",
                "type": "supabase_insert",
                "config": {
                    "table": "agile_projects",
                    "data": "sprint_data"
                }
            },
            {
                "name": "notify_team",
                "type": "n8n_webhook",
                "config": {
                    "url": "https://n8n.pbradygeorgen.com/webhook/sprint-notification"
                }
            },
            {
                "name": "update_metrics",
                "type": "supabase_update",
                "config": {
                    "table": "agile_projects",
                    "operation": "update_metrics"
                }
            }
        ]
    }

# 2. Real-time Progress Tracking
def setup_progress_tracking():
    return {
        "supabase_subscription": {
            "table": "agile_projects",
            "event": "UPDATE",
            "callback": "update_progress_dashboard"
        },
        "n8n_integration": {
            "webhook": "https://n8n.pbradygeorgen.com/webhook/progress-update",
            "method": "POST"
        }
    }
"""
        }

    def generate_enhanced_prompt(self, prompt_type: str, context: Dict[str, Any]) -> str:
        """Generate enhanced AI prompt incorporating live system practices"""
        
        if prompt_type == "supabase_integration":
            return self.enhanced_prompts["supabase_integration"]["environment_setup"]
        
        elif prompt_type == "n8n_workflow":
            return self.enhanced_prompts["supabase_integration"]["n8n_integration"]
        
        elif prompt_type == "claude_analysis":
            return self.enhanced_prompts["supabase_integration"]["claude_integration"]
        
        elif prompt_type == "market_research":
            return self.use_case_prompts["market_research_automation"]
        
        elif prompt_type == "business_validation":
            return self.use_case_prompts["business_model_validation"]
        
        elif prompt_type == "agile_management":
            return self.use_case_prompts["agile_project_management"]
        
        else:
            return f"""
# Enhanced AI Prompt (Generated from Live System)
# Type: {prompt_type}
# Context: {context}

# Available Systems:
- Supabase: {self.live_supabase_config['url']}
- N8N: {self.live_n8n_config['url']}
- Claude AI: {self.live_api_keys['claude_model']}

# Best Practices (from live system):
1. Use environment variables for configuration
2. Implement proper error handling
3. Follow established database schema
4. Integrate with existing workflows
5. Maintain security standards
"""

    def create_system_integration_guide(self) -> Dict[str, Any]:
        """Create comprehensive system integration guide"""
        return {
            "guide_id": f"system_integration_{int(datetime.datetime.now().timestamp())}",
            "timestamp": datetime.datetime.now().isoformat(),
            "live_system_config": {
                "supabase": self.live_supabase_config,
                "n8n": self.live_n8n_config,
                "claude": self.live_api_keys
            },
            "enhanced_prompts": self.enhanced_prompts,
            "use_case_prompts": self.use_case_prompts,
            "best_practices": {
                "environment_management": "Use environment variables for all configuration",
                "error_handling": "Implement try-catch blocks with proper logging",
                "security": "Never expose API keys in code, use environment variables",
                "integration": "Follow established patterns for system integration",
                "monitoring": "Include logging and monitoring in all operations"
            },
            "integration_patterns": {
                "supabase_n8n": "Use N8N webhooks to trigger Supabase operations",
                "claude_supabase": "Use Claude for analysis, store results in Supabase",
                "n8n_claude": "Use N8N to orchestrate Claude AI workflows",
                "real_time": "Use Supabase subscriptions for real-time updates"
            },
            "prompt_templates": {
                "code_generation": "Include system configuration in all code generation prompts",
                "workflow_creation": "Reference live system URLs and configurations",
                "integration_development": "Use established patterns and best practices",
                "error_handling": "Include proper error handling in all generated code"
            }
        }

def main():
    """Main function to demonstrate enhanced AI prompts with Supabase integration"""
    print("🤖 ENHANCED AI PROMPTS WITH SUPABASE INTEGRATION")
    print("=" * 55)
    print()
    
    # Initialize enhanced AI prompts system
    enhanced_prompts = EnhancedAIPromptsWithSupabase()
    
    print("🔧 Live System Configuration:")
    print(f"   Supabase URL: {enhanced_prompts.live_supabase_config['url']}")
    print(f"   N8N URL: {enhanced_prompts.live_n8n_config['url']}")
    print(f"   Claude Model: {enhanced_prompts.live_api_keys['claude_model']}")
    print()
    
    print("📊 Enhanced Prompt Types:")
    for prompt_type in enhanced_prompts.enhanced_prompts.keys():
        print(f"   • {prompt_type}")
    print()
    
    print("🎯 Use Case Prompts:")
    for use_case in enhanced_prompts.use_case_prompts.keys():
        print(f"   • {use_case}")
    print()
    
    # Generate system integration guide
    print("📋 Generating system integration guide...")
    integration_guide = enhanced_prompts.create_system_integration_guide()
    
    print(f"✅ Integration guide generated: {integration_guide['guide_id']}")
    print(f"📅 Timestamp: {integration_guide['timestamp']}")
    print()
    
    # Display best practices
    print("💡 Best Practices (from live system):")
    for practice, description in integration_guide["best_practices"].items():
        print(f"   • {practice}: {description}")
    print()
    
    # Display integration patterns
    print("🔗 Integration Patterns:")
    for pattern, description in integration_guide["integration_patterns"].items():
        print(f"   • {pattern}: {description}")
    print()
    
    # Display prompt templates
    print("📝 Prompt Templates:")
    for template, description in integration_guide["prompt_templates"].items():
        print(f"   • {template}: {description}")
    print()
    
    # Save integration guide
    output_file = f"enhanced_ai_prompts_integration_guide_{int(datetime.datetime.now().timestamp())}.json"
    with open(output_file, 'w') as f:
        json.dump(integration_guide, f, indent=2)
    
    print(f"📄 Integration guide saved to: {output_file}")
    print()
    print("🎯 ENHANCED AI PROMPTS READY!")
    print("All AI prompts now incorporate proven practices from your live system:")
    print("• Supabase integration patterns")
    print("• N8N workflow automation")
    print("• Claude AI analysis")
    print("• Security best practices")
    print("• Error handling patterns")
    print()
    print("🚀 Ready to generate AI prompts that leverage your live system!")

if __name__ == "__main__":
    main()
