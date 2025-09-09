#!/usr/bin/env python3
"""
Enhanced Unified Router for Alex AI Crew
Handles routing between local Claude agents and OpenRouter
"""

import json
import sys
import os
import requests
from typing import Dict, Any, Optional

class EnhancedUnifiedRouter:
    def __init__(self):
        self.claude_api_key = os.getenv('CLAUDE_API_KEY') or os.getenv('ANTHROPIC_API_KEY')
        self.openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
        self.claude_model = os.getenv('CLAUDE_MODEL', 'claude-3-haiku-20240307')
        
        # Crew member configurations
        self.crew_members = {
            'captain_picard': {
                'name': 'Captain Jean-Luc Picard',
                'role': 'Strategic Leadership & Mission Command',
                'specialization': 'strategic_planning',
                'model_preference': 'claude-sonnet'
            },
            'commander_riker': {
                'name': 'Commander William Riker',
                'role': 'Tactical Execution & Workflow Management',
                'specialization': 'tactical_execution',
                'model_preference': 'claude-sonnet'
            },
            'commander_data': {
                'name': 'Commander Data',
                'role': 'Analytics & Logic Operations',
                'specialization': 'analytics',
                'model_preference': 'claude-sonnet'
            },
            'geordi_la_forge': {
                'name': 'Lieutenant Commander Geordi La Forge',
                'role': 'Infrastructure & System Integration',
                'specialization': 'infrastructure',
                'model_preference': 'claude-sonnet'
            }
        }

    def route_request(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Route request to appropriate system based on task analysis"""
        try:
            task_description = input_data.get('task_description', '')
            task_type = input_data.get('task_type', 'general')
            task_complexity = input_data.get('task_complexity', 'medium')
            routing_strategy = input_data.get('routing_strategy', {})
            
            # Determine routing decision
            routing_decision = self._make_routing_decision(
                task_type, task_complexity, routing_strategy
            )
            
            # Execute the request
            if routing_decision['target_system'] == 'local_claude':
                result = self._execute_claude_request(input_data, routing_decision)
            else:
                result = self._execute_openrouter_request(input_data, routing_decision)
            
            return {
                'success': True,
                'execution_result': result,
                'routing_summary': {
                    'task_type': task_type,
                    'complexity': task_complexity,
                    'selected_model': routing_decision['selected_model'],
                    'system_used': routing_decision['target_system'],
                    'reasoning': routing_decision['reasoning'],
                    'total_cost': result.get('cost', 0.0),
                    'crew_member': routing_decision.get('crew_member'),
                    'crew_consistency': 'high',
                    'confidence': 0.95
                },
                'request_id': input_data.get('request_id', 'unknown')
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'request_id': input_data.get('request_id', 'unknown')
            }

    def _make_routing_decision(self, task_type: str, complexity: str, strategy: Dict) -> Dict[str, Any]:
        """Make intelligent routing decision"""
        
        # Strategic tasks go to local Claude crew
        if task_type in ['strategic_planning', 'complex_analysis', 'system_architecture']:
            crew_member = self._select_crew_member(task_type)
            return {
                'target_system': 'local_claude',
                'selected_model': 'claude-3-haiku-20240307',
                'crew_member': crew_member,
                'reasoning': f'Strategic task routed to {crew_member} for optimal analysis'
            }
        
        # Code generation and quick tasks go to OpenRouter
        if task_type in ['code_generation', 'quick_analysis', 'multimodal']:
            return {
                'target_system': 'openrouter',
                'selected_model': 'openai/gpt-4o',
                'reasoning': f'Task type {task_type} optimized for OpenRouter'
            }
        
        # Default to OpenRouter for cost efficiency
        return {
            'target_system': 'openrouter',
            'selected_model': 'anthropic/claude-3-haiku-20240307',
            'reasoning': 'Default routing to OpenRouter for cost efficiency'
        }

    def _select_crew_member(self, task_type: str) -> str:
        """Select appropriate crew member based on task type"""
        if 'strategic' in task_type:
            return 'captain_picard'
        elif 'tactical' in task_type or 'execution' in task_type:
            return 'commander_riker'
        elif 'analytics' in task_type or 'data' in task_type:
            return 'commander_data'
        elif 'infrastructure' in task_type or 'system' in task_type:
            return 'geordi_la_forge'
        else:
            return 'captain_picard'  # Default to Picard

    def _execute_claude_request(self, input_data: Dict, routing: Dict) -> Dict[str, Any]:
        """Execute request using local Claude API"""
        try:
            headers = {
                'x-api-key': self.claude_api_key,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            }
            
            payload = {
                'model': self.claude_model,
                'max_tokens': 4000,
                'messages': [
                    {
                        'role': 'user',
                        'content': self._format_crew_prompt(input_data, routing)
                    }
                ]
            }
            
            response = requests.post(
                'https://api.anthropic.com/v1/messages',
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'response': result['content'][0]['text'],
                    'model_used': result['model'],
                    'cost': 0.0,  # Local Claude is free
                    'response_time': 'fast',
                    'token_usage': result.get('usage', {}),
                    'cost_breakdown': {'claude_local': 0.0}
                }
            else:
                raise Exception(f"Claude API error: {response.status_code} - {response.text}")
                
        except Exception as e:
            raise Exception(f"Claude execution failed: {str(e)}")

    def _execute_openrouter_request(self, input_data: Dict, routing: Dict) -> Dict[str, Any]:
        """Execute request using OpenRouter API"""
        try:
            headers = {
                'Authorization': f'Bearer {self.openrouter_api_key}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://n8n.pbradygeorgen.com',
                'X-Title': 'Alex AI Enhanced Unified Router'
            }
            
            payload = {
                'model': routing['selected_model'],
                'max_tokens': 4000,
                'messages': [
                    {
                        'role': 'user',
                        'content': input_data['task_description']
                    }
                ],
                'temperature': 0.7
            }
            
            response = requests.post(
                'https://openrouter.ai/api/v1/chat/completions',
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'response': result['choices'][0]['message']['content'],
                    'model_used': result['model'],
                    'cost': 0.05,  # Estimated cost
                    'response_time': 'medium',
                    'token_usage': result.get('usage', {}),
                    'cost_breakdown': {'openrouter': 0.05}
                }
            else:
                raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")
                
        except Exception as e:
            raise Exception(f"OpenRouter execution failed: {str(e)}")

    def _format_crew_prompt(self, input_data: Dict, routing: Dict) -> str:
        """Format prompt with crew member context"""
        crew_member = self.crew_members.get(routing.get('crew_member', 'captain_picard'), {})
        
        prompt = f"""As {crew_member.get('name', 'Captain Jean-Luc Picard')}, {crew_member.get('role', 'Strategic Leadership')}, please provide your expert analysis and recommendations for the following task:

Task: {input_data['task_description']}
Type: {input_data.get('task_type', 'general')}
Complexity: {input_data.get('task_complexity', 'medium')}

Please provide a comprehensive response that includes:
1. Strategic analysis
2. Recommended approach
3. Potential challenges
4. Next steps

Respond in character as your assigned crew member with appropriate expertise and perspective."""

        return prompt

def main():
    """Main execution function for N8N integration"""
    try:
        # Read input from stdin (N8N will pipe data here)
        input_data = json.loads(sys.stdin.read())
        
        # Initialize router
        router = EnhancedUnifiedRouter()
        
        # Process request
        result = router.route_request(input_data)
        
        # Output result to stdout (N8N will capture this)
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e),
            'timestamp': '2024-01-01T00:00:00Z'
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
