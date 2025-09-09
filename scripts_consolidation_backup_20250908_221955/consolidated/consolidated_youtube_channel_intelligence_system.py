#!/usr/bin/env python3
"""
Consolidated Script: youtube_channel_intelligence_system
================================

This script consolidates the following similar scripts:
- ./youtube_channel_intelligence_system.py
- ./youtube-channel-intelligence-milestone-package/youtube_channel_intelligence_system.py
- ./alexai-base-package/youtube_channel_intelligence_system.py

Generated: 2025-09-06 20:27:37
"""

#!/usr/bin/env python3
"""
YouTube Channel Intelligence System
Analyzes entire YouTube channels with crew-specialized insights and vector-optimized storage
"""

import json
import sys
import os
import requests
import hashlib
import re
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timedelta
import numpy as np
from dataclasses import dataclass
from collections import defaultdict

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from youtube_scraper_crew_integration import YouTubeScraperCrewIntegration

@dataclass
class ChannelInsight:
    """Structured insight for a specific crew member"""
    crew_member: str
    insight_type: str
    content: str
    relevance_score: float
    vector_embedding: Optional[List[float]] = None
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class ChannelAnalysis:
    """Complete channel analysis with crew-specialized insights"""
    channel_id: str
    channel_name: str
    total_videos: int
    analysis_timestamp: datetime
    crew_insights: Dict[str, List[ChannelInsight]]
    channel_summary: str
    key_themes: List[str]
    content_vectors: Dict[str, List[float]]

class YouTubeChannelIntelligenceSystem:
    def __init__(self):
        self.scraper = YouTubeScraperCrewIntegration()
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.youtube_api_key = os.getenv('YOUTUBE_API_KEY')
        
        # Crew member cost optimization tiers
        self.crew_cost_tiers = {
            'captain_picard': {'tier': 'premium', 'max_cost': 0.10, 'priority': 1},
            'commander_riker': {'tier': 'premium', 'max_cost': 0.10, 'priority': 1},
            'commander_data': {'tier': 'standard', 'max_cost': 0.05, 'priority': 2},
            'geordi_la_forge': {'tier': 'standard', 'max_cost': 0.05, 'priority': 2},
            'lieutenant_worf': {'tier': 'standard', 'max_cost': 0.05, 'priority': 2},
            'counselor_troi': {'tier': 'economy', 'max_cost': 0.02, 'priority': 3},
            'lieutenant_uhura': {'tier': 'economy', 'max_cost': 0.02, 'priority': 3},
            'dr_crusher': {'tier': 'economy', 'max_cost': 0.02, 'priority': 3},
            'quark': {'tier': 'economy', 'max_cost': 0.02, 'priority': 3}
        }
        
        # Crew member analysis focus areas
        self.crew_analysis_focus = {
            'captain_picard': {
                'keywords': ['strategy', 'leadership', 'vision', 'mission', 'decision', 'planning'],
                'insight_types': ['strategic_insights', 'leadership_patterns', 'decision_frameworks'],
                'vector_dimensions': 128
            },
            'commander_riker': {
                'keywords': ['execution', 'tactical', 'operations', 'implementation', 'workflow'],
                'insight_types': ['tactical_insights', 'execution_patterns', 'operational_frameworks'],
                'vector_dimensions': 128
            },
            'commander_data': {
                'keywords': ['data', 'analytics', 'logic', 'patterns', 'metrics', 'analysis'],
                'insight_types': ['data_insights', 'analytical_patterns', 'logical_frameworks'],
                'vector_dimensions': 256
            },
            'geordi_la_forge': {
                'keywords': ['technical', 'engineering', 'infrastructure', 'systems', 'technology'],
                'insight_types': ['technical_insights', 'engineering_patterns', 'system_frameworks'],
                'vector_dimensions': 128
            },
            'lieutenant_worf': {
                'keywords': ['security', 'compliance', 'risk', 'protection', 'safety'],
                'insight_types': ['security_insights', 'compliance_patterns', 'risk_frameworks'],
                'vector_dimensions': 64
            },
            'counselor_troi': {
                'keywords': ['user', 'experience', 'psychology', 'emotion', 'behavior', 'empathy'],
                'insight_types': ['ux_insights', 'psychological_patterns', 'behavioral_frameworks'],
                'vector_dimensions': 128
            },
            'lieutenant_uhura': {
                'keywords': ['communication', 'information', 'media', 'messaging', 'outreach'],
                'insight_types': ['communication_insights', 'media_patterns', 'messaging_frameworks'],
                'vector_dimensions': 64
            },
            'dr_crusher': {
                'keywords': ['health', 'wellness', 'medical', 'care', 'healing', 'diagnosis'],
                'insight_types': ['health_insights', 'wellness_patterns', 'medical_frameworks'],
                'vector_dimensions': 64
            },
            'quark': {
                'keywords': ['business', 'commerce', 'profit', 'market', 'revenue', 'negotiation'],
                'insight_types': ['business_insights', 'commercial_patterns', 'market_frameworks'],
                'vector_dimensions': 64
            }
        }

    def analyze_youtube_channel(self, channel_url: str, max_videos: int = 50, 
                              analysis_depth: str = 'comprehensive') -> ChannelAnalysis:
        """
        Analyze an entire YouTube channel with crew-specialized insights
        
        Args:
            channel_url: YouTube channel URL
            max_videos: Maximum number of videos to analyze
            analysis_depth: 'quick', 'standard', or 'comprehensive'
            
        Returns:
            ChannelAnalysis object with crew-specialized insights
        """
        try:
            # Extract channel ID from URL
            channel_id = self._extract_channel_id(channel_url)
            if not channel_id:
                raise ValueError("Invalid YouTube channel URL")
            
            # Get channel information
            channel_info = self._get_channel_info(channel_id)
            
            # Get channel videos
            videos = self._get_channel_videos(channel_id, max_videos)
            
            # Analyze videos with crew-specialized focus
            crew_insights = self._analyze_videos_with_crew_specialization(videos, analysis_depth)
            
            # Generate channel summary and key themes
            channel_summary = self._generate_channel_summary(crew_insights, channel_info)
            key_themes = self._extract_key_themes(crew_insights)
            
            # Create content vectors for rapid retrieval
            content_vectors = self._create_content_vectors(crew_insights)
            
            # Create analysis object
            analysis = ChannelAnalysis(
                channel_id=channel_id,
                channel_name=channel_info.get('title', 'Unknown'),
                total_videos=len(videos),
                analysis_timestamp=datetime.now(),
                crew_insights=crew_insights,
                channel_summary=channel_summary,
                key_themes=key_themes,
                content_vectors=content_vectors
            )
            
            # Store in Supabase with vector optimization
            self._store_channel_analysis(analysis)
            
            return analysis
            
        except Exception as e:
            raise Exception(f"Channel analysis failed: {str(e)}")

    def _extract_channel_id(self, channel_url: str) -> Optional[str]:
        """Extract channel ID from various YouTube channel URL formats"""
        patterns = [
            r'youtube\.com/channel/([a-zA-Z0-9_-]+)',
            r'youtube\.com/c/([a-zA-Z0-9_-]+)',
            r'youtube\.com/user/([a-zA-Z0-9_-]+)',
            r'youtube\.com/@([a-zA-Z0-9_-]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, channel_url)
            if match:
                return match.group(1)
        
        return None

    def _get_channel_info(self, channel_id: str) -> Dict[str, Any]:
        """Get channel information from YouTube API"""
        url = "https://www.googleapis.com/youtube/v3/channels"
        params = {
            'part': 'snippet,statistics',
            'id': channel_id,
            'key': self.youtube_api_key
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data['items']:
                channel = data['items'][0]
                return {
                    'title': channel['snippet']['title'],
                    'description': channel['snippet']['description'],
                    'subscriber_count': channel['statistics'].get('subscriberCount', 0),
                    'video_count': channel['statistics'].get('videoCount', 0),
                    'view_count': channel['statistics'].get('viewCount', 0)
                }
        
        return {}

    def _get_channel_videos(self, channel_id: str, max_videos: int) -> List[Dict[str, Any]]:
        """Get channel videos from YouTube API"""
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            'part': 'snippet',
            'channelId': channel_id,
            'type': 'video',
            'order': 'relevance',
            'maxResults': min(max_videos, 50),  # YouTube API limit
            'key': self.youtube_api_key
        }
        
        videos = []
        page_token = None
        
        while len(videos) < max_videos:
            if page_token:
                params['pageToken'] = page_token
            
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                videos.extend(data['items'])
                page_token = data.get('nextPageToken')
                if not page_token:
                    break
            else:
                break
        
        return videos[:max_videos]

    def _analyze_videos_with_crew_specialization(self, videos: List[Dict[str, Any]], 
                                               analysis_depth: str) -> Dict[str, List[ChannelInsight]]:
        """Analyze videos with crew-specialized focus and cost optimization"""
        crew_insights = defaultdict(list)
        
        # Determine analysis parameters based on depth
        analysis_params = {
            'quick': {'max_videos_per_crew': 5, 'insight_limit': 3},
            'standard': {'max_videos_per_crew': 10, 'insight_limit': 5},
            'comprehensive': {'max_videos_per_crew': 20, 'insight_limit': 10}
        }
        
        params = analysis_params.get(analysis_depth, analysis_params['standard'])
        
        for crew_member, focus_config in self.crew_analysis_focus.items():
            # Cost optimization: limit videos based on crew tier
            cost_tier = self.crew_cost_tiers[crew_member]
            max_videos = min(params['max_videos_per_crew'], 
                           int(cost_tier['max_cost'] * 100))  # Convert cost to video limit
            
            # Select most relevant videos for this crew member
            relevant_videos = self._select_relevant_videos(videos, focus_config['keywords'], max_videos)
            
            # Analyze videos for this crew member
            for video in relevant_videos:
                insights = self._analyze_video_for_crew_member(video, crew_member, focus_config)
                crew_insights[crew_member].extend(insights[:params['insight_limit']])
        
        return dict(crew_insights)

    def _select_relevant_videos(self, videos: List[Dict[str, Any]], 
                              keywords: List[str], max_videos: int) -> List[Dict[str, Any]]:
        """Select most relevant videos for a crew member based on keywords"""
        scored_videos = []
        
        for video in videos:
            title = video['snippet']['title'].lower()
            description = video['snippet']['description'].lower()
            content = f"{title} {description}"
            
            # Calculate relevance score
            score = sum(1 for keyword in keywords if keyword in content)
            if score > 0:
                scored_videos.append((video, score))
        
        # Sort by relevance and return top videos
        scored_videos.sort(key=lambda x: x[1], reverse=True)
        return [video for video, score in scored_videos[:max_videos]]

    def _analyze_video_for_crew_member(self, video: Dict[str, Any], 
                                     crew_member: str, focus_config: Dict[str, Any]) -> List[ChannelInsight]:
        """Analyze a single video for a specific crew member"""
        insights = []
        
        # Extract video content
        title = video['snippet']['title']
        description = video['snippet']['description']
        published = video['snippet']['publishedAt']
        
        # Create insights based on crew member's focus areas
        for insight_type in focus_config['insight_types']:
            insight_content = self._generate_crew_specific_insight(
                title, description, crew_member, insight_type
            )
            
            if insight_content:
                # Calculate relevance score
                relevance_score = self._calculate_relevance_score(
                    insight_content, focus_config['keywords']
                )
                
                # Create vector embedding
                vector_embedding = self._create_vector_embedding(
                    insight_content, focus_config['vector_dimensions']
                )
                
                insight = ChannelInsight(
                    crew_member=crew_member,
                    insight_type=insight_type,
                    content=insight_content,
                    relevance_score=relevance_score,
                    vector_embedding=vector_embedding,
                    metadata={
                        'video_title': title,
                        'video_id': video['id']['videoId'],
                        'published_date': published,
                        'insight_length': len(insight_content)
                    }
                )
                
                insights.append(insight)
        
        return insights

    def _generate_crew_specific_insight(self, title: str, description: str, 
                                      crew_member: str, insight_type: str) -> Optional[str]:
        """Generate crew-specific insight using cost-optimized AI analysis"""
        # This would integrate with your existing crew coordination system
        # For now, we'll create structured insights based on content analysis
        
        content = f"{title} {description}"
        
        # Crew-specific insight generation
        insight_templates = {
            'captain_picard': {
                'strategic_insights': f"Strategic Analysis: {title} presents key strategic concepts including {self._extract_key_concepts(content, 3)}",
                'leadership_patterns': f"Leadership Pattern: {title} demonstrates leadership principles such as {self._extract_leadership_concepts(content, 2)}",
                'decision_frameworks': f"Decision Framework: {title} outlines decision-making approaches including {self._extract_decision_concepts(content, 2)}"
            },
            'commander_data': {
                'data_insights': f"Data Analysis: {title} contains analytical patterns including {self._extract_data_concepts(content, 3)}",
                'analytical_patterns': f"Analytical Pattern: {title} demonstrates logical frameworks such as {self._extract_analytical_concepts(content, 2)}",
                'logical_frameworks': f"Logical Framework: {title} presents systematic approaches including {self._extract_logical_concepts(content, 2)}"
            }
            # Add more crew members as needed
        }
        
        crew_insights = insight_templates.get(crew_member, {})
        return crew_insights.get(insight_type)

    def _extract_key_concepts(self, content: str, limit: int) -> str:
        """Extract key concepts from content"""
        # Simple keyword extraction - in production, use more sophisticated NLP
        words = re.findall(r'\b\w+\b', content.lower())
        word_freq = defaultdict(int)
        for word in words:
            if len(word) > 4:  # Filter short words
                word_freq[word] += 1
        
        top_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:limit]
        return ', '.join([word for word, freq in top_words])

    def _extract_leadership_concepts(self, content: str, limit: int) -> str:
        """Extract leadership-related concepts"""
        leadership_keywords = ['leadership', 'vision', 'strategy', 'team', 'management', 'decision']
        found_concepts = [kw for kw in leadership_keywords if kw in content.lower()]
        return ', '.join(found_concepts[:limit]) or 'general leadership principles'

    def _extract_decision_concepts(self, content: str, limit: int) -> str:
        """Extract decision-making concepts"""
        decision_keywords = ['decision', 'choice', 'option', 'evaluate', 'assess', 'consider']
        found_concepts = [kw for kw in decision_keywords if kw in content.lower()]
        return ', '.join(found_concepts[:limit]) or 'decision-making frameworks'

    def _extract_data_concepts(self, content: str, limit: int) -> str:
        """Extract data-related concepts"""
        data_keywords = ['data', 'analysis', 'metrics', 'statistics', 'pattern', 'trend']
        found_concepts = [kw for kw in data_keywords if kw in content.lower()]
        return ', '.join(found_concepts[:limit]) or 'data analysis patterns'

    def _extract_analytical_concepts(self, content: str, limit: int) -> str:
        """Extract analytical concepts"""
        analytical_keywords = ['analyze', 'logic', 'reasoning', 'systematic', 'methodical']
        found_concepts = [kw for kw in analytical_keywords if kw in content.lower()]
        return ', '.join(found_concepts[:limit]) or 'analytical approaches'

    def _extract_logical_concepts(self, content: str, limit: int) -> str:
        """Extract logical concepts"""
        logical_keywords = ['logic', 'reasoning', 'framework', 'system', 'structure']
        found_concepts = [kw for kw in logical_keywords if kw in content.lower()]
        return ', '.join(found_concepts[:limit]) or 'logical frameworks'

    def _calculate_relevance_score(self, content: str, keywords: List[str]) -> float:
        """Calculate relevance score for content"""
        content_lower = content.lower()
        matches = sum(1 for keyword in keywords if keyword in content_lower)
        return min(matches / len(keywords), 1.0)

    def _create_vector_embedding(self, content: str, dimensions: int) -> List[float]:
        """Create vector embedding for content (simplified version)"""
        # In production, use proper embedding models like OpenAI embeddings or sentence-transformers
        # For now, create a simple hash-based vector
        content_hash = hashlib.md5(content.encode()).hexdigest()
        vector = []
        for i in range(dimensions):
            # Create pseudo-random but deterministic vector based on hash
            seed = int(content_hash[i % len(content_hash)], 16) + i
            np.random.seed(seed)
            vector.append(np.random.random() * 2 - 1)  # Values between -1 and 1
        
        return vector

    def _generate_channel_summary(self, crew_insights: Dict[str, List[ChannelInsight]], 
                                channel_info: Dict[str, Any]) -> str:
        """Generate comprehensive channel summary"""
        total_insights = sum(len(insights) for insights in crew_insights.values())
        crew_count = len(crew_insights)
        
        summary = f"Channel Analysis Summary:\n"
        summary += f"- Total insights generated: {total_insights}\n"
        summary += f"- Crew members involved: {crew_count}\n"
        summary += f"- Channel: {channel_info.get('title', 'Unknown')}\n"
        summary += f"- Subscribers: {channel_info.get('subscriber_count', 'Unknown')}\n"
        summary += f"- Videos analyzed: {channel_info.get('video_count', 'Unknown')}\n"
        
        return summary

    def _extract_key_themes(self, crew_insights: Dict[str, List[ChannelInsight]]) -> List[str]:
        """Extract key themes across all crew insights"""
        all_content = []
        for insights in crew_insights.values():
            for insight in insights:
                all_content.append(insight.content)
        
        # Simple theme extraction - in production, use more sophisticated NLP
        combined_content = ' '.join(all_content)
        themes = self._extract_key_concepts(combined_content, 10)
        return themes.split(', ')

    def _create_content_vectors(self, crew_insights: Dict[str, List[ChannelInsight]]) -> Dict[str, List[float]]:
        """Create optimized content vectors for rapid retrieval"""
        vectors = {}
        
        for crew_member, insights in crew_insights.items():
            # Create aggregated vector for this crew member's insights
            if insights:
                # Average all insight vectors for this crew member
                avg_vector = np.mean([insight.vector_embedding for insight in insights], axis=0)
                vectors[crew_member] = avg_vector.tolist()
        
        return vectors

    def _store_channel_analysis(self, analysis: ChannelAnalysis):
        """Store channel analysis in Supabase with vector optimization"""
        try:
            # Store main analysis record
            analysis_data = {
                'channel_id': analysis.channel_id,
                'channel_name': analysis.channel_name,
                'total_videos': analysis.total_videos,
                'analysis_timestamp': analysis.analysis_timestamp.isoformat(),
                'channel_summary': analysis.channel_summary,
                'key_themes': analysis.key_themes,
                'content_vectors': analysis.content_vectors
            }
            
            # Store in Supabase
            url = f"{self.supabase_url}/rest/v1/channel_analysis"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, headers=headers, json=analysis_data)
            
            if response.status_code == 201:
                # Store individual insights
                self._store_crew_insights(analysis.crew_insights, analysis.channel_id)
            else:
                print(f"Failed to store channel analysis: {response.status_code}")
                
        except Exception as e:
            print(f"Error storing channel analysis: {str(e)}")

    def _store_crew_insights(self, crew_insights: Dict[str, List[ChannelInsight]], channel_id: str):
        """Store individual crew insights in Supabase"""
        for crew_member, insights in crew_insights.items():
            for insight in insights:
                insight_data = {
                    'channel_id': channel_id,
                    'crew_member': insight.crew_member,
                    'insight_type': insight.insight_type,
                    'content': insight.content,
                    'relevance_score': insight.relevance_score,
                    'vector_embedding': insight.vector_embedding,
                    'metadata': insight.metadata
                }
                
                url = f"{self.supabase_url}/rest/v1/crew_insights"
                headers = {
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}',
                    'Content-Type': 'application/json'
                }
                
                response = requests.post(url, headers=headers, json=insight_data)
                if response.status_code != 201:
                    print(f"Failed to store insight for {crew_member}: {response.status_code}")

    def get_channel_insights_for_crew(self, channel_id: str, crew_member: str) -> List[ChannelInsight]:
        """Retrieve insights for a specific crew member from a channel analysis"""
        try:
            url = f"{self.supabase_url}/rest/v1/crew_insights"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}'
            }
            params = {
                'channel_id': f'eq.{channel_id}',
                'crew_member': f'eq.{crew_member}'
            }
            
            response = requests.get(url, headers=headers, params=params)
            
            if response.status_code == 200:
                insights_data = response.json()
                insights = []
                for data in insights_data:
                    insight = ChannelInsight(
                        crew_member=data['crew_member'],
                        insight_type=data['insight_type'],
                        content=data['content'],
                        relevance_score=data['relevance_score'],
                        vector_embedding=data['vector_embedding'],
                        metadata=data['metadata']
                    )
                    insights.append(insight)
                return insights
            else:
                return []
                
        except Exception as e:
            print(f"Error retrieving insights: {str(e)}")
            return []

    def search_insights_by_vector_similarity(self, query_vector: List[float], 
                                           crew_member: Optional[str] = None,
                                           limit: int = 10) -> List[ChannelInsight]:
        """Search insights using vector similarity"""
        # This would implement vector similarity search in Supabase
        # For now, return empty list - implement with pgvector or similar
        return []

def main():
    """CLI interface for YouTube channel intelligence system"""
    if len(sys.argv) < 2:
        print("Usage: python3 youtube_channel_intelligence_system.py <channel_url> [max_videos] [analysis_depth]")
        print("\nAnalysis depths:")
        print("  quick: 5 videos per crew, 3 insights each")
        print("  standard: 10 videos per crew, 5 insights each")
        print("  comprehensive: 20 videos per crew, 10 insights each")
        sys.exit(1)
    
    channel_url = sys.argv[1]
    max_videos = int(sys.argv[2]) if len(sys.argv) > 2 else 50
    analysis_depth = sys.argv[3] if len(sys.argv) > 3 else 'standard'
    
    system = YouTubeChannelIntelligenceSystem()
    
    print(f"🎥 Analyzing YouTube channel: {channel_url}")
    print(f"📊 Max videos: {max_videos}")
    print(f"🔍 Analysis depth: {analysis_depth}")
    print()
    
    try:
        analysis = system.analyze_youtube_channel(channel_url, max_videos, analysis_depth)
        
        print("✅ Channel analysis completed!")
        print(f"📺 Channel: {analysis.channel_name}")
        print(f"📹 Videos analyzed: {analysis.total_videos}")
        print(f"🧠 Total insights: {sum(len(insights) for insights in analysis.crew_insights.values())}")
        print(f"👥 Crew members: {len(analysis.crew_insights)}")
        print()
        
        print("📋 Crew Insights Summary:")
        for crew_member, insights in analysis.crew_insights.items():
            print(f"  {crew_member}: {len(insights)} insights")
        
        print()
        print("🎯 Key Themes:")
        for theme in analysis.key_themes[:5]:
            print(f"  • {theme}")
        
    except Exception as e:
        print(f"❌ Analysis failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
