#!/usr/bin/env python3
"""
Observation Lounge Crew Coordinator for Alex AI
Handles crew coordination and decision-making sessions
"""

import json
import sys
import os
import requests
from typing import Dict, Any, List
from datetime import datetime

class ObservationLoungeCoordinator:
    def __init__(self):
        self.claude_api_key = os.getenv('CLAUDE_API_KEY') or os.getenv('ANTHROPIC_API_KEY')
        self.openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        # Crew member definitions
        self.crew_members = {
            'captain_picard': {
                'name': 'Captain Jean-Luc Picard',
                'department': 'Command',
                'expertise': 'Strategic Leadership, Mission Planning, Decision Making',
                'personality': 'Diplomatic, wise, principled leader'
            },
            'commander_riker': {
                'name': 'Commander William Riker',
                'department': 'Tactical',
                'expertise': 'Tactical Operations, Workflow Management, Execution',
                'personality': 'Confident, tactical, execution-focused'
            },
            'commander_data': {
                'name': 'Commander Data',
                'department': 'Operations',
                'expertise': 'Analytics, Logic, Data Processing, Efficiency',
                'personality': 'Logical, analytical, precise'
            },
            'geordi_la_forge': {
                'name': 'Lieutenant Commander Geordi La Forge',
                'department': 'Engineering',
                'expertise': 'Infrastructure, System Integration, Technical Solutions',
                'personality': 'Innovative, technical, problem-solving'
            },
            'lieutenant_worf': {
                'name': 'Lieutenant Worf',
                'department': 'Security',
                'expertise': 'Security, Compliance, Risk Assessment',
                'personality': 'Honorable, security-focused, disciplined'
            },
            'counselor_troi': {
                'name': 'Counselor Deanna Troi',
                'department': 'Counseling',
                'expertise': 'User Experience, Empathy Analysis, Human Factors',
                'personality': 'Empathetic, intuitive, user-focused'
            },
            'lieutenant_uhura': {
                'name': 'Lieutenant Uhura',
                'department': 'Communications',
                'expertise': 'Communications, I/O Operations, Information Flow',
                'personality': 'Communicative, organized, information-focused'
            },
            'dr_crusher': {
                'name': 'Dr. Beverly Crusher',
                'department': 'Medical',
                'expertise': 'Health, Diagnostics, System Optimization',
                'personality': 'Caring, diagnostic, health-focused'
            },
            'quark': {
                'name': 'Quark',
                'department': 'Business',
                'expertise': 'Business Intelligence, Budget Optimization, ROI Analysis',
                'personality': 'Business-minded, cost-conscious, profit-focused'
            }
        }

    def coordinate_observation_lounge(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Coordinate an Observation Lounge session with the crew"""
        try:
            topic = session_data.get('topic', 'General Discussion')
            discussion_type = session_data.get('discussion_type', 'collaborative')
            crew_selection = session_data.get('crew_selection', 'all')
            coordination_method = session_data.get('coordination_method', 'observation_lounge')
            
            # Check if this is a YouTube analysis request
            if 'youtube_analysis' in session_data:
                return self._handle_youtube_analysis_request(session_data)
            
            # Select crew members for the session
            selected_crew = self._select_crew_members(crew_selection, discussion_type)
            
            # Conduct the observation lounge session
            crew_insights = self._conduct_crew_session(topic, selected_crew, coordination_method)
            
            # Synthesize the results
            synthesis = self._synthesize_crew_insights(crew_insights, topic)
            
            # Generate recommendations and next actions
            recommendations = self._generate_recommendations(synthesis, crew_insights)
            next_actions = self._generate_next_actions(synthesis, crew_insights)
            
            return {
                'observation_lounge_session': {
                    'session_id': session_data.get('session_id', f'ol_{int(datetime.now().timestamp())}'),
                    'topic': topic,
                    'status': 'completed',
                    'participants': len(selected_crew),
                    'total_crew': len(self.crew_members),
                    'timestamp': datetime.now().isoformat(),
                    'coordination_method': coordination_method
                },
                'crew_insights': crew_insights,
                'synthesis': synthesis,
                'recommendations': recommendations,
                'next_actions': next_actions
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'session_id': session_data.get('session_id', 'unknown'),
                'timestamp': datetime.now().isoformat()
            }

    def _handle_youtube_analysis_request(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle YouTube analysis requests through crew coordination"""
        try:
            from youtube_scraper_crew_integration import YouTubeScraperCrewIntegration
            
            youtube_data = session_data['youtube_analysis']
            crew_member_id = youtube_data.get('crew_member_id', 'commander_data')
            video_url = youtube_data.get('video_url')
            analysis_focus = youtube_data.get('analysis_focus')
            
            if not video_url:
                return {
                    'status': 'error',
                    'message': 'Video URL is required for YouTube analysis',
                    'error_code': 'MISSING_VIDEO_URL'
                }
            
            # Initialize YouTube scraper
            scraper = YouTubeScraperCrewIntegration()
            
            # Request analysis
            result = scraper.request_youtube_analysis(crew_member_id, video_url, analysis_focus)
            
            # Format response for crew coordination
            return {
                'observation_lounge_session': {
                    'session_id': session_data.get('session_id', f'yt_{int(datetime.now().timestamp())}'),
                    'topic': f'YouTube Analysis: {video_url}',
                    'status': 'completed',
                    'participants': 1,
                    'total_crew': len(self.crew_members),
                    'timestamp': datetime.now().isoformat(),
                    'coordination_method': 'youtube_analysis'
                },
                'youtube_analysis_result': result,
                'crew_member': self.crew_members.get(crew_member_id, {}).get('name', 'Unknown'),
                'video_url': video_url
            }
            
        except ImportError:
            return {
                'status': 'error',
                'message': 'YouTube scraper integration not available',
                'error_code': 'INTEGRATION_NOT_AVAILABLE'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'YouTube analysis failed: {str(e)}',
                'error_code': 'ANALYSIS_FAILED'
            }

    def _select_crew_members(self, crew_selection: Any, discussion_type: str) -> List[str]:
        """Select appropriate crew members for the session"""
        if crew_selection == 'all':
            return list(self.crew_members.keys())
        elif isinstance(crew_selection, list):
            return [member for member in crew_selection if member in self.crew_members]
        else:
            # Default selection based on discussion type
            if discussion_type == 'executive':
                return ['captain_picard', 'commander_riker', 'commander_data']
            elif discussion_type == 'technical':
                return ['geordi_la_forge', 'commander_data', 'lieutenant_worf']
            elif discussion_type == 'strategic':
                return ['captain_picard', 'commander_data', 'counselor_troi', 'quark']
            else:
                return ['captain_picard', 'commander_riker', 'commander_data', 'geordi_la_forge']

    def _conduct_crew_session(self, topic: str, selected_crew: List[str], method: str) -> Dict[str, Any]:
        """Conduct the actual crew session"""
        crew_insights = {}
        
        for crew_member_id in selected_crew:
            crew_member = self.crew_members[crew_member_id]
            
            try:
                # Generate crew member perspective
                insight = self._get_crew_member_insight(topic, crew_member, method)
                crew_insights[crew_member_id] = {
                    'crew_member': crew_member['name'],
                    'department': crew_member['department'],
                    'expertise': crew_member['expertise'],
                    'insight': insight,
                    'status': 'success',
                    'confidence': 0.9
                }
            except Exception as e:
                crew_insights[crew_member_id] = {
                    'crew_member': crew_member['name'],
                    'department': crew_member['department'],
                    'status': 'error',
                    'error': str(e),
                    'confidence': 0.0
                }
        
        return crew_insights

    def _get_crew_member_insight(self, topic: str, crew_member: Dict, method: str) -> str:
        """Get insight from a specific crew member"""
        # For now, generate a structured response based on crew member expertise
        # In a full implementation, this would call the appropriate AI model
        
        prompt = f"""As {crew_member['name']}, {crew_member['department']} Officer, provide your expert perspective on:

Topic: {topic}

Your expertise: {crew_member['expertise']}
Your personality: {crew_member['personality']}

Please provide:
1. Your department's perspective on this topic
2. Key considerations from your area of expertise
3. Potential challenges or opportunities
4. Your recommendation for next steps

Respond in character with your unique perspective and expertise."""

        # Simulate crew member response (in real implementation, call AI)
        if crew_member['name'] == 'Captain Jean-Luc Picard':
            return f"From a strategic command perspective, {topic} requires careful consideration of our mission objectives and the Prime Directive. I recommend a measured approach that balances our goals with ethical considerations."
        elif crew_member['name'] == 'Commander Data':
            return f"Analysis of {topic} indicates several logical pathways. Based on available data and efficiency metrics, the optimal approach would be to implement a systematic solution with measurable outcomes."
        elif crew_member['name'] == 'Lieutenant Commander Geordi La Forge':
            return f"From an engineering standpoint, {topic} presents interesting technical challenges. I can design a robust solution that integrates seamlessly with our existing systems."
        else:
            return f"As {crew_member['name']}, I bring my expertise in {crew_member['expertise']} to this discussion about {topic}. My recommendation is to proceed with careful analysis and implementation."

    def _synthesize_crew_insights(self, crew_insights: Dict, topic: str) -> Dict[str, Any]:
        """Synthesize insights from all crew members"""
        successful_insights = [insight for insight in crew_insights.values() if insight['status'] == 'success']
        
        if not successful_insights:
            return {
                'status': 'failed',
                'message': 'No successful crew insights to synthesize'
            }
        
        # Create synthesis based on crew perspectives
        synthesis = {
            'status': 'success',
            'topic': topic,
            'participating_departments': list(set([insight['department'] for insight in successful_insights])),
            'key_themes': self._extract_key_themes(successful_insights),
            'consensus_points': self._identify_consensus(successful_insights),
            'divergent_perspectives': self._identify_divergence(successful_insights),
            'overall_assessment': f"Based on input from {len(successful_insights)} crew members across {len(set([insight['department'] for insight in successful_insights]))} departments, we have a comprehensive view of {topic}."
        }
        
        return synthesis

    def _extract_key_themes(self, insights: List[Dict]) -> List[str]:
        """Extract key themes from crew insights"""
        themes = []
        for insight in insights:
            if 'strategic' in insight['insight'].lower():
                themes.append('Strategic Planning')
            if 'technical' in insight['insight'].lower():
                themes.append('Technical Implementation')
            if 'security' in insight['insight'].lower():
                themes.append('Security Considerations')
            if 'efficiency' in insight['insight'].lower():
                themes.append('Efficiency Optimization')
        
        return list(set(themes)) if themes else ['General Discussion']

    def _identify_consensus(self, insights: List[Dict]) -> List[str]:
        """Identify areas of consensus among crew members"""
        return [
            "Need for careful analysis and planning",
            "Importance of system integration",
            "Requirement for ongoing monitoring"
        ]

    def _identify_divergence(self, insights: List[Dict]) -> List[str]:
        """Identify areas where crew members have different perspectives"""
        return [
            "Priority of implementation timeline",
            "Resource allocation preferences"
        ]

    def _generate_recommendations(self, synthesis: Dict, crew_insights: Dict) -> List[Dict]:
        """Generate actionable recommendations"""
        return [
            {
                'priority': 'High',
                'category': 'Strategic',
                'recommendation': 'Develop comprehensive implementation plan',
                'responsible_department': 'Command',
                'timeline': '1-2 weeks'
            },
            {
                'priority': 'Medium',
                'category': 'Technical',
                'recommendation': 'Conduct technical feasibility assessment',
                'responsible_department': 'Engineering',
                'timeline': '2-3 weeks'
            },
            {
                'priority': 'High',
                'category': 'Security',
                'recommendation': 'Review security protocols and compliance',
                'responsible_department': 'Security',
                'timeline': '1 week'
            }
        ]

    def _generate_next_actions(self, synthesis: Dict, crew_insights: Dict) -> List[Dict]:
        """Generate specific next actions"""
        return [
            {
                'action': 'Schedule follow-up meeting with department heads',
                'owner': 'Captain Picard',
                'due_date': 'Within 48 hours',
                'status': 'pending'
            },
            {
                'action': 'Prepare detailed technical specifications',
                'owner': 'Lieutenant Commander Geordi La Forge',
                'due_date': 'Within 1 week',
                'status': 'pending'
            },
            {
                'action': 'Conduct security risk assessment',
                'owner': 'Lieutenant Worf',
                'due_date': 'Within 3 days',
                'status': 'pending'
            }
        ]

def main():
    """Main execution function for N8N integration"""
    try:
        # Read input from stdin (N8N will pipe data here)
        input_data = json.loads(sys.stdin.read())
        
        # Initialize coordinator
        coordinator = ObservationLoungeCoordinator()
        
        # Process observation lounge session
        result = coordinator.coordinate_observation_lounge(input_data)
        
        # Output result to stdout (N8N will capture this)
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_result = {
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
