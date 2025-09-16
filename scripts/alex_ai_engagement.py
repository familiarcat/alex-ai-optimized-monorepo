#!/usr/bin/env python3
"""
Alex AI Engagement Script
Activates the Alex AI system with the nine-character crew from npm.pbradygeorgen.com
"""

import json
import sys
import os
import requests
from typing import Dict, Any, List
from datetime import datetime

class AlexAIEngagement:
    def __init__(self):
        self.openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        # Nine-character crew from npm.pbradygeorgen.com as global rule
        self.crew_members = {
            'captain_picard': {
                'name': 'Captain Jean-Luc Picard',
                'department': 'Command',
                'expertise': 'Strategic Leadership, Mission Planning, Decision Making',
                'personality': 'Diplomatic, wise, principled leader',
                'status': 'active'
            },
            'commander_riker': {
                'name': 'Commander William Riker',
                'department': 'Tactical',
                'expertise': 'Tactical Operations, Workflow Management, Execution',
                'personality': 'Confident, tactical, execution-focused',
                'status': 'active'
            },
            'commander_data': {
                'name': 'Commander Data',
                'department': 'Operations',
                'expertise': 'Analytics, Logic, Data Processing, Efficiency',
                'personality': 'Logical, analytical, precise',
                'status': 'active'
            },
            'geordi_la_forge': {
                'name': 'Lieutenant Commander Geordi La Forge',
                'department': 'Engineering',
                'expertise': 'Infrastructure, System Integration, Technical Solutions',
                'personality': 'Innovative, technical, problem-solving',
                'status': 'active'
            },
            'lieutenant_worf': {
                'name': 'Lieutenant Worf',
                'department': 'Security',
                'expertise': 'Security, Defense, Risk Assessment, Quality Assurance',
                'personality': 'Honorable, disciplined, security-focused',
                'status': 'active'
            },
            'counselor_troi': {
                'name': 'Counselor Deanna Troi',
                'department': 'Counseling',
                'expertise': 'User Experience, Interface Design, User Feedback',
                'personality': 'Empathetic, intuitive, user-focused',
                'status': 'active'
            },
            'lieutenant_uhura': {
                'name': 'Lieutenant Uhura',
                'department': 'Communications',
                'expertise': 'Communication, Integration, API Management',
                'personality': 'Communicative, organized, integration-focused',
                'status': 'active'
            },
            'dr_crusher': {
                'name': 'Dr. Beverly Crusher',
                'department': 'Medical',
                'expertise': 'Quality Assurance, System Health, Testing',
                'personality': 'Caring, thorough, quality-focused',
                'status': 'active'
            },
            'quark': {
                'name': 'Quark',
                'department': 'Business',
                'expertise': 'Business Intelligence, Budget Optimization, ROI Analysis',
                'personality': 'Business-minded, cost-conscious, profit-focused',
                'status': 'active'
            }
        }

    def engage_alex_ai(self) -> Dict[str, Any]:
        """Engage Alex AI system with full crew activation"""
        print("🚀 Engaging Alex AI System...")
        print("=" * 50)
        
        # Display crew status
        print("👥 Alex AI Crew Status:")
        for member_id, member in self.crew_members.items():
            status_emoji = "✅" if member['status'] == 'active' else "❌"
            print(f"  {status_emoji} {member['name']} - {member['department']}")
            print(f"      Expertise: {member['expertise']}")
            print(f"      Personality: {member['personality']}")
            print()
        
        # Create engagement memory
        engagement_data = {
            'timestamp': datetime.now().isoformat(),
            'action': 'alex_ai_engagement',
            'crew_status': self.crew_members,
            'total_crew': len(self.crew_members),
            'active_crew': len([m for m in self.crew_members.values() if m['status'] == 'active']),
            'system_status': 'engaged'
        }
        
        # Store in Supabase if available
        if self.supabase_url and self.supabase_key:
            try:
                self._store_engagement_memory(engagement_data)
                print("💾 Engagement memory stored in Supabase")
            except Exception as e:
                print(f"⚠️  Could not store in Supabase: {e}")
        
        print("🎉 Alex AI System Successfully Engaged!")
        print("🚀 All nine crew members are active and ready for collaboration")
        print("📚 System ready for strategic planning, tactical execution, and mission coordination")
        
        return engagement_data

    def _store_engagement_memory(self, data: Dict[str, Any]) -> bool:
        """Store engagement memory in Supabase"""
        try:
            url = f"{self.supabase_url}/rest/v1/crew_memories"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            memory_entry = {
                'crew_member': 'System-Wide',
                'mission_id': 'alex-ai-engagement',
                'memory_type': 'system_engagement',
                'content': json.dumps(data),
                'importance': 'high'
            }
            
            response = requests.post(url, headers=headers, json=memory_entry, timeout=10)
            return response.status_code == 201
            
        except Exception as e:
            print(f"Error storing engagement memory: {e}")
            return False

    def get_crew_status(self) -> Dict[str, Any]:
        """Get current crew status"""
        return {
            'total_crew': len(self.crew_members),
            'active_crew': len([m for m in self.crew_members.values() if m['status'] == 'active']),
            'crew_members': self.crew_members,
            'timestamp': datetime.now().isoformat()
        }

def main():
    """Main engagement function"""
    print("🧠 Alex AI Engagement System")
    print("=" * 50)
    
    # Initialize engagement system
    alex_ai = AlexAIEngagement()
    
    # Engage Alex AI
    engagement_result = alex_ai.engage_alex_ai()
    
    # Display final status
    print("\n📊 Final Status:")
    print(f"  Total Crew Members: {engagement_result['total_crew']}")
    print(f"  Active Crew Members: {engagement_result['active_crew']}")
    print(f"  System Status: {engagement_result['system_status']}")
    print(f"  Engagement Time: {engagement_result['timestamp']}")
    
    return engagement_result

if __name__ == "__main__":
    main()

