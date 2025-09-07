#!/usr/bin/env python3
"""
Enhanced AI Prompts System - Learn from Live Supabase & N8N Integration
Incorporates proven practices from live system configuration
"""

import json
import datetime
from typing import Dict, List, Any, Optional

class EnhancedAIPromptsSystem:
    def __init__(self):
        # Live system configuration from ~/.zshrc
        self.live_config = {
            "supabase": {
                "url": "https://rpkkkbufdwxmjaerbhbn.supabase.co",
                "anon_key": "sb_publishable_ibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU",
                "project_name": "strange-new-world"
            },
            "n8n": {
                "url": "https://n8n.pbradygeorgen.com",
                "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERMjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"
            },
            "claude": {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 4000,
                "openrouter_key": "sk-or-v1-API_KEY_PLACEHOLDER31439f13fc40e77ecc1ff2a2"
            }
        }
        
        # Enhanced prompt templates
        self.prompt_templates = {
            "supabase_integration": self._get_supabase_integration_prompt(),
            "n8n_workflow": self._get_n8n_workflow_prompt(),
            "claude_analysis": self._get_claude_analysis_prompt(),
            "system_integration": self._get_system_integration_prompt(),
            "market_research": self._get_market_research_prompt(),
            "business_validation": self._get_business_validation_prompt()
        }

    def _get_supabase_integration_prompt(self) -> str:
        """Generate Supabase integration prompt with live system config"""
        return f"""
# Supabase Integration (Live System Configuration)

# Environment Setup
export SUPABASE_URL="{self.live_config['supabase']['url']}"
export SUPABASE_ANON_KEY="{self.live_config['supabase']['anon_key']}"
export SUPABASE_PROJECT_NAME="{self.live_config['supabase']['project_name']}"

# Python Client Setup
import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

# Best Practices:
# 1. Use environment variables for configuration
# 2. Implement proper error handling
# 3. Use real-time subscriptions for live updates
# 4. Implement batch operations for efficiency
# 5. Follow established database schema
"""

    def _get_n8n_workflow_prompt(self) -> str:
        """Generate N8N workflow prompt with live system config"""
        return f"""
# N8N Workflow Integration (Live System Configuration)

# N8N Configuration
N8N_CONFIG = {{
    "url": "{self.live_config['n8n']['url']}",
    "api_key": "{self.live_config['n8n']['api_key']}"
}}

# Webhook Integration Pattern
def trigger_n8n_workflow(workflow_id, data):
    import requests
    
    url = f"{{N8N_CONFIG['url']}}/webhook/{{workflow_id}}"
    headers = {{
        "Authorization": f"Bearer {{N8N_CONFIG['api_key']}}",
        "Content-Type": "application/json"
    }}
    
    try:
        response = requests.post(url, json=data, headers=headers)
        return {{"success": True, "response": response.json()}}
    except Exception as e:
        return {{"success": False, "error": str(e)}}

# Best Practices:
# 1. Use webhooks for real-time integration
# 2. Implement proper error handling
# 3. Use established workflow patterns
# 4. Include data validation
# 5. Monitor workflow execution
"""

    def _get_claude_analysis_prompt(self) -> str:
        """Generate Claude AI analysis prompt with live system config"""
        return f"""
# Claude AI Integration (Live System Configuration)

# Claude Configuration
CLAUDE_CONFIG = {{
    "model": "{self.live_config['claude']['model']}",
    "max_tokens": {self.live_config['claude']['max_tokens']},
    "api_key": "{self.live_config['claude']['openrouter_key']}"
}}

# Analysis Pattern
def analyze_with_claude(data, analysis_type):
    import requests
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {{
        "Authorization": f"Bearer {{CLAUDE_CONFIG['api_key']}}",
        "Content-Type": "application/json"
    }}
    
    payload = {{
        "model": CLAUDE_CONFIG["model"],
        "messages": [
            {{"role": "system", "content": f"Analyze this data for {{analysis_type}}"}},
            {{"role": "user", "content": str(data)}}
        ],
        "max_tokens": CLAUDE_CONFIG["max_tokens"]
    }}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        return {{"success": True, "analysis": response.json()}}
    except Exception as e:
        return {{"success": False, "error": str(e)}}

# Best Practices:
# 1. Use OpenRouter for Claude access
# 2. Implement proper error handling
# 3. Use structured prompts
# 4. Include context in analysis
# 5. Store results in Supabase
"""

    def _get_system_integration_prompt(self) -> str:
        """Generate system integration prompt combining all systems"""
        return f"""
# Multi-System Integration (Live System Configuration)

# System Configuration
SYSTEMS = {{
    "supabase": {{
        "url": "{self.live_config['supabase']['url']}",
        "anon_key": "{self.live_config['supabase']['anon_key']}"
    }},
    "n8n": {{
        "url": "{self.live_config['n8n']['url']}",
        "api_key": "{self.live_config['n8n']['api_key']}"
    }},
    "claude": {{
        "model": "{self.live_config['claude']['model']}",
        "api_key": "{self.live_config['claude']['openrouter_key']}"
    }}
}}

# Integration Pattern
def integrated_workflow(data):
    # 1. Analyze with Claude
    claude_result = analyze_with_claude(data, "market_analysis")
    
    if claude_result["success"]:
        # 2. Store in Supabase
        supabase_result = supabase.table("market_research").insert({{
            "data": data,
            "analysis": claude_result["analysis"]
        }}).execute()
        
        # 3. Trigger N8N workflow
        n8n_result = trigger_n8n_workflow("market-analysis-complete", {{
            "data": data,
            "analysis": claude_result["analysis"]
        }})
        
        return {{
            "claude": claude_result,
            "supabase": supabase_result,
            "n8n": n8n_result
        }}
    
    return {{"error": "Claude analysis failed"}}

# Best Practices:
# 1. Chain operations for data flow
# 2. Implement error handling at each step
# 3. Use established patterns
# 4. Monitor integration health
# 5. Include logging and metrics
"""

    def _get_market_research_prompt(self) -> str:
        """Generate market research automation prompt"""
        return f"""
# Market Research Automation (Live System Integration)

# Automated Research Workflow
def market_research_workflow(market, research_type):
    # 1. Collect market data
    market_data = collect_market_data(market)
    
    # 2. Analyze with Claude
    analysis = analyze_with_claude(market_data, research_type)
    
    # 3. Store in Supabase
    supabase.table("market_research").insert({{
        "market": market,
        "research_type": research_type,
        "data": market_data,
        "analysis": analysis,
        "timestamp": datetime.now().isoformat()
    }}).execute()
    
    # 4. Trigger N8N notification
    trigger_n8n_workflow("research-complete", {{
        "market": market,
        "research_type": research_type,
        "analysis": analysis
    }})
    
    return analysis

# Real-time Monitoring
def setup_market_monitoring():
    # Supabase subscription for new research
    supabase.table("market_research").on("INSERT", handle_new_research).subscribe()
    
    # N8N webhook for notifications
    n8n_webhook = "{self.live_config['n8n']['url']}/webhook/market-update"

# Best Practices:
# 1. Automate data collection
# 2. Use AI for analysis
# 3. Store results systematically
# 4. Enable real-time monitoring
# 5. Integrate with notification systems
"""

    def _get_business_validation_prompt(self) -> str:
        """Generate business validation prompt"""
        return f"""
# Business Model Validation (Live System Integration)

# Validation Workflow
def validate_business_model(model_data):
    # 1. Analyze with Claude
    validation = analyze_with_claude(model_data, "business_validation")
    
    # 2. Store validation results
    supabase.table("business_models").insert({{
        "model_data": model_data,
        "validation": validation,
        "status": "validated",
        "timestamp": datetime.now().isoformat()
    }}).execute()
    
    # 3. Trigger N8N workflow
    trigger_n8n_workflow("validation-complete", {{
        "model": model_data,
        "validation": validation
    }})
    
    return validation

# Automated Validation Schedule
def setup_validation_schedule():
    # Daily validation of pending models
    pending_models = supabase.table("business_models")\
        .select("*")\
        .eq("status", "pending")\
        .execute()
    
    for model in pending_models.data:
        validate_business_model(model)

# Best Practices:
# 1. Automate validation processes
# 2. Use AI for analysis
# 3. Track validation status
# 4. Schedule regular validations
# 5. Integrate with notification systems
"""

    def generate_enhanced_prompt(self, prompt_type: str, context: Dict[str, Any] = None) -> str:
        """Generate enhanced AI prompt incorporating live system practices"""
        if context is None:
            context = {}
        
        base_prompt = self.prompt_templates.get(prompt_type, "")
        
        # Add context-specific enhancements
        if context:
            context_section = f"""
# Context-Specific Configuration
# Context: {context.get('description', 'General integration')}
# Requirements: {context.get('requirements', 'Standard integration')}
# Target System: {context.get('target_system', 'Multi-system')}
"""
            base_prompt = context_section + base_prompt
        
        return base_prompt

    def create_integration_guide(self) -> Dict[str, Any]:
        """Create comprehensive integration guide"""
        return {
            "guide_id": f"integration_guide_{int(datetime.datetime.now().timestamp())}",
            "timestamp": datetime.datetime.now().isoformat(),
            "live_system_config": self.live_config,
            "prompt_templates": self.prompt_templates,
            "best_practices": {
                "environment_management": "Use environment variables for all configuration",
                "error_handling": "Implement try-catch blocks with proper logging",
                "security": "Never expose API keys in code, use environment variables",
                "integration": "Follow established patterns for system integration",
                "monitoring": "Include logging and monitoring in all operations",
                "real_time": "Use Supabase subscriptions for real-time updates",
                "automation": "Use N8N for workflow automation",
                "ai_analysis": "Use Claude for intelligent analysis and insights"
            },
            "integration_patterns": {
                "supabase_n8n": "Use N8N webhooks to trigger Supabase operations",
                "claude_supabase": "Use Claude for analysis, store results in Supabase",
                "n8n_claude": "Use N8N to orchestrate Claude AI workflows",
                "real_time": "Use Supabase subscriptions for real-time updates",
                "automated_workflows": "Chain operations for automated data processing"
            },
            "usage_examples": {
                "market_research": "Automated market data collection and analysis",
                "business_validation": "AI-powered business model validation",
                "real_time_monitoring": "Live updates and notifications",
                "data_processing": "Automated data processing pipelines"
            }
        }

def main():
    """Main function to demonstrate enhanced AI prompts system"""
    print("🤖 ENHANCED AI PROMPTS SYSTEM - LIVE SYSTEM INTEGRATION")
    print("=" * 60)
    print()
    
    # Initialize enhanced AI prompts system
    prompts_system = EnhancedAIPromptsSystem()
    
    print("🔧 Live System Configuration:")
    print(f"   Supabase URL: {prompts_system.live_config['supabase']['url']}")
    print(f"   N8N URL: {prompts_system.live_config['n8n']['url']}")
    print(f"   Claude Model: {prompts_system.live_config['claude']['model']}")
    print()
    
    print("📊 Available Prompt Types:")
    for prompt_type in prompts_system.prompt_templates.keys():
        print(f"   • {prompt_type}")
    print()
    
    # Generate integration guide
    print("📋 Generating integration guide...")
    integration_guide = prompts_system.create_integration_guide()
    
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
    
    # Display usage examples
    print("🎯 Usage Examples:")
    for example, description in integration_guide["usage_examples"].items():
        print(f"   • {example}: {description}")
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
    print("• Real-time monitoring")
    print("• Automated workflows")
    print()
    print("🚀 Ready to generate AI prompts that leverage your live system!")

if __name__ == "__main__":
    main()
