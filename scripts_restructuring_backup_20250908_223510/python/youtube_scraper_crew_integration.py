from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
YouTube Scraper Crew Integration
Enables universal crew access to YouTube video analysis capabilities
"""

import json
import sys
import os
import requests
from typing import Dict, Any, List, Optional
from datetime import datetime
import hashlib

class YouTubeScraperCrewIntegration:
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        # Crew member definitions with YouTube scraping capabilities
        self.crew_members = {
            'captain_picard': {
                'name': 'Captain Jean-Luc Picard',
                'department': 'Command',
                'expertise': 'Strategic Leadership, Mission Planning, Decision Making',
                'youtube_analysis_focus': 'Strategic concepts, leadership insights, mission planning'
            },
            'commander_riker': {
                'name': 'Commander William Riker',
                'department': 'Tactical',
                'expertise': 'Tactical Operations, Workflow Management, Execution',
                'youtube_analysis_focus': 'Tactical concepts, execution strategies, operational insights'
            },
            'commander_data': {
                'name': 'Commander Data',
                'department': 'Operations',
                'expertise': 'Analytics, Logic, Data Processing, Efficiency',
                'youtube_analysis_focus': 'Data patterns, analytical concepts, logical frameworks'
            },
            'geordi_la_forge': {
                'name': 'Lieutenant Commander Geordi La Forge',
                'department': 'Engineering',
                'expertise': 'Infrastructure, System Integration, Technical Solutions',
                'youtube_analysis_focus': 'Technical concepts, engineering insights, innovation patterns'
            },
            'lieutenant_worf': {
                'name': 'Lieutenant Worf',
                'department': 'Security',
                'expertise': 'Security, Compliance, Risk Management',
                'youtube_analysis_focus': 'Security concepts, compliance frameworks, risk assessment'
            },
            'counselor_troi': {
                'name': 'Counselor Deanna Troi',
                'department': 'Counseling',
                'expertise': 'User Experience, Psychology, Empathy',
                'youtube_analysis_focus': 'User experience concepts, psychological insights, emotional patterns'
            },
            'lieutenant_uhura': {
                'name': 'Lieutenant Uhura',
                'department': 'Communications',
                'expertise': 'Communications, I/O Operations, Information Flow',
                'youtube_analysis_focus': 'Communication concepts, information patterns, media insights'
            },
            'dr_crusher': {
                'name': 'Dr. Beverly Crusher',
                'department': 'Medical',
                'expertise': 'Health, Diagnostics, Wellness',
                'youtube_analysis_focus': 'Health concepts, wellness insights, medical patterns'
            },
            'quark': {
                'name': 'Quark',
                'department': 'Business',
                'expertise': 'Business Intelligence, Commerce, Negotiation',
                'youtube_analysis_focus': 'Business concepts, market insights, commercial patterns'
            }
        }

    def request_youtube_analysis(self, crew_member_id: str, video_url: str, 
                                analysis_focus: Optional[str] = None) -> Dict[str, Any]:
        """
        Request YouTube video analysis from any crew member
        
        Args:
            crew_member_id: ID of the crew member making the request
            video_url: YouTube video URL to analyze
            analysis_focus: Optional specific focus for analysis
            
        Returns:
            Dict containing analysis results or error information
        """
        try:
            # Validate crew member
            if crew_member_id not in self.crew_members:
                return {
                    'status': 'error',
                    'message': f'Unknown crew member: {crew_member_id}',
                    'error_code': 'INVALID_CREW_MEMBER'
                }
            
            # Validate video URL
            if not self._is_valid_youtube_url(video_url):
                return {
                    'status': 'error',
                    'message': 'Invalid YouTube URL format',
                    'error_code': 'INVALID_VIDEO_URL'
                }
            
            # Check for duplicate processing
            video_id = self._extract_video_id(video_url)
            if self._is_already_processed(video_id):
                return self._get_existing_analysis(video_id)
            
            # Prepare request for N8N workflow
            request_data = {
                'video_url': video_url,
                'crew_member': self.crew_members[crew_member_id]['name'],
                'crew_member_id': crew_member_id,
                'analysis_focus': analysis_focus or self.crew_members[crew_member_id]['youtube_analysis_focus'],
                'request_id': self._generate_request_id(crew_member_id, video_url),
                'timestamp': datetime.now().isoformat()
            }
            
            # Send request to N8N workflow
            response = requests.post(
                self.n8n_webhook_url,
                json=request_data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'status': 'success',
                    'crew_member': self.crew_members[crew_member_id]['name'],
                    'video_url': video_url,
                    'analysis_result': result,
                    'request_timestamp': request_data['timestamp']
                }
            else:
                return {
                    'status': 'error',
                    'message': f'N8N workflow error: {response.status_code}',
                    'error_code': 'WORKFLOW_ERROR',
                    'response': response.text
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Analysis request failed: {str(e)}',
                'error_code': 'REQUEST_FAILED'
            }

    def batch_analyze_videos(self, crew_member_id: str, video_urls: List[str], 
                           analysis_focus: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze multiple YouTube videos in batch
        
        Args:
            crew_member_id: ID of the crew member making the request
            video_urls: List of YouTube video URLs to analyze
            analysis_focus: Optional specific focus for analysis
            
        Returns:
            Dict containing batch analysis results
        """
        results = []
        successful = 0
        failed = 0
        
        for video_url in video_urls:
            result = self.request_youtube_analysis(crew_member_id, video_url, analysis_focus)
            results.append({
                'video_url': video_url,
                'result': result
            })
            
            if result['status'] == 'success':
                successful += 1
            else:
                failed += 1
        
        return {
            'status': 'completed',
            'crew_member': self.crew_members[crew_member_id]['name'],
            'total_videos': len(video_urls),
            'successful': successful,
            'failed': failed,
            'results': results,
            'batch_timestamp': datetime.now().isoformat()
        }

    def get_crew_analysis_history(self, crew_member_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Retrieve analysis history for crew member(s)
        
        Args:
            crew_member_id: Optional specific crew member ID
            
        Returns:
            Dict containing analysis history
        """
        try:
            # Query Supabase for analysis history
            url = f"{self.supabase_url}/rest/v1/youtube_analysis"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            params = {}
            if crew_member_id:
                params['crew_member'] = f'eq.{self.crew_members[crew_member_id]["name"]}'
            
            response = requests.get(url, headers=headers, params=params)
            
            if response.status_code == 200:
                return {
                    'status': 'success',
                    'analysis_history': response.json(),
                    'total_analyses': len(response.json())
                }
            else:
                return {
                    'status': 'error',
                    'message': f'Failed to retrieve analysis history: {response.status_code}',
                    'error_code': 'HISTORY_RETRIEVAL_FAILED'
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': f'History retrieval failed: {str(e)}',
                'error_code': 'HISTORY_REQUEST_FAILED'
            }

    def _is_valid_youtube_url(self, url: str) -> bool:
        """Validate YouTube URL format"""
        youtube_patterns = [
            r'(?:youtube\.com/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})',
            r'youtube\.com/watch\?v=([^"&?\/\s]{11})',
            r'youtu\.be\/([^"&?\/\s]{11})'
        ]
        
        import re
        for pattern in youtube_patterns:
            if re.search(pattern, url):
                return True
        return False

    def _extract_video_id(self, url: str) -> str:
        """Extract video ID from YouTube URL"""
        import re
        match = re.search(r'(?:youtube\.com/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})', url)
        return match.group(1) if match else None

    def _is_already_processed(self, video_id: str) -> bool:
        """Check if video has already been processed"""
        try:
            url = f"{self.supabase_url}/rest/v1/youtube_analysis"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}'
            }
            params = {'video_id': f'eq.{video_id}'}
            
            response = requests.get(url, headers=headers, params=params)
            return response.status_code == 200 and len(response.json()) > 0
            
        except:
            return False

    def _get_existing_analysis(self, video_id: str) -> Dict[str, Any]:
        """Retrieve existing analysis for video"""
        try:
            url = f"{self.supabase_url}/rest/v1/youtube_analysis"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}'
            }
            params = {'video_id': f'eq.{video_id}'}
            
            response = requests.get(url, headers=headers, params=params)
            
            if response.status_code == 200 and response.json():
                return {
                    'status': 'success',
                    'message': 'Using existing analysis',
                    'analysis_result': response.json()[0],
                    'from_cache': True
                }
            else:
                return {
                    'status': 'error',
                    'message': 'Failed to retrieve existing analysis',
                    'error_code': 'CACHE_RETRIEVAL_FAILED'
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Cache retrieval failed: {str(e)}',
                'error_code': 'CACHE_REQUEST_FAILED'
            }

    def _generate_request_id(self, crew_member_id: str, video_url: str) -> str:
        """Generate unique request ID"""
        content = f"{crew_member_id}_{video_url}_{datetime.now().isoformat()}"
        return hashlib.md5(content.encode()).hexdigest()

    def list_crew_members(self) -> Dict[str, Any]:
        """List all available crew members with their YouTube analysis capabilities"""
        return {
            'status': 'success',
            'crew_members': {
                member_id: {
                    'name': member['name'],
                    'department': member['department'],
                    'expertise': member['expertise'],
                    'youtube_analysis_focus': member['youtube_analysis_focus']
                }
                for member_id, member in self.crew_members.items()
            },
            'total_crew': len(self.crew_members)
        }

    if len(sys.argv) < 3:
        print("Usage: python3 youtube_scraper_crew_integration.py <crew_member_id> <video_url> [analysis_focus]")
        print("\nAvailable crew members:")
        scraper = YouTubeScraperCrewIntegration()
        crew_list = scraper.list_crew_members()
        for member_id, member in crew_list['crew_members'].items():
            print(f"  {member_id}: {member['name']} - {member['youtube_analysis_focus']}")
        sys.exit(1)
    
    crew_member_id = sys.argv[1]
    video_url = sys.argv[2]
    analysis_focus = sys.argv[3] if len(sys.argv) > 3 else None
    
    scraper = YouTubeScraperCrewIntegration()
    result = scraper.request_youtube_analysis(crew_member_id, video_url, analysis_focus)
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
