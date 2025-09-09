#!/usr/bin/env python3
"""
YouTube Scraper System Demo
Demonstrates the complete universal crew access YouTube scraping system
"""

import json
import sys
import os
from datetime import datetime
from typing import Dict, Any

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from youtube_scraper_crew_integration import YouTubeScraperCrewIntegration
from crew_coordinator import ObservationLoungeCoordinator

class YouTubeScraperSystemDemo:
    def __init__(self):
        self.scraper = YouTubeScraperCrewIntegration()
        self.crew_coordinator = ObservationLoungeCoordinator()
        
        # Demo videos for testing
        self.demo_videos = [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # Rick Astley - Never Gonna Give You Up
            "https://youtu.be/jNQXAC9IVRw",  # Me at the zoo (first YouTube video)
            "https://www.youtube.com/watch?v=9bZkp7q19f0"  # PSY - GANGNAM STYLE
        ]
    
    def run_complete_demo(self):
        """Run a complete demonstration of the YouTube scraper system"""
        print("🎥 YouTube Scraper Universal Crew Access - Complete System Demo")
        print("=" * 70)
        print()
        
        # Demo 1: List available crew members
        self.demo_crew_member_listing()
        
        # Demo 2: Individual crew member analysis
        self.demo_individual_crew_analysis()
        
        # Demo 3: Crew coordination through Observation Lounge
        self.demo_crew_coordination_analysis()
        
        # Demo 4: Batch analysis with different perspectives
        self.demo_batch_analysis_perspectives()
        
        # Demo 5: Analysis history and insights
        self.demo_analysis_history()
        
        print("\n🎉 Demo completed! The YouTube scraper system is fully operational.")
    
    def demo_crew_member_listing(self):
        """Demonstrate crew member listing with YouTube analysis capabilities"""
        print("👥 Demo 1: Crew Member Listing with YouTube Analysis Capabilities")
        print("-" * 60)
        
        result = self.scraper.list_crew_members()
        
        if result['status'] == 'success':
            print(f"✅ Successfully listed {result['total_crew']} crew members:")
            print()
            
            for member_id, member in result['crew_members'].items():
                print(f"🔹 {member['name']}")
                print(f"   Department: {member['department']}")
                print(f"   Expertise: {member['expertise']}")
                print(f"   YouTube Analysis Focus: {member['youtube_analysis_focus']}")
                print()
        else:
            print(f"❌ Failed to list crew members: {result['message']}")
        
        print()
    
    def demo_individual_crew_analysis(self):
        """Demonstrate individual crew member YouTube analysis"""
        print("🎯 Demo 2: Individual Crew Member YouTube Analysis")
        print("-" * 60)
        
        # Test with Commander Data
        video_url = self.demo_videos[0]
        crew_member = 'commander_data'
        
        print(f"📹 Analyzing: {video_url}")
        print(f"👨‍💼 Crew Member: {self.scraper.crew_members[crew_member]['name']}")
        print(f"🎯 Analysis Focus: {self.scraper.crew_members[crew_member]['youtube_analysis_focus']}")
        print()
        
        result = self.scraper.request_youtube_analysis(crew_member, video_url)
        
        if result['status'] == 'success':
            print("✅ Analysis completed successfully!")
            print(f"   Crew Member: {result['crew_member']}")
            print(f"   Video URL: {result['video_url']}")
            print(f"   Request Timestamp: {result['request_timestamp']}")
            
            if 'analysis_result' in result:
                analysis = result['analysis_result']
                if 'concepts_extracted' in analysis:
                    print(f"   Concepts Extracted: {analysis['concepts_extracted']}")
        else:
            print(f"❌ Analysis failed: {result['message']}")
        
        print()
    
    def demo_crew_coordination_analysis(self):
        """Demonstrate YouTube analysis through crew coordination system"""
        print("🏛️ Demo 3: YouTube Analysis Through Crew Coordination")
        print("-" * 60)
        
        # Request analysis through Observation Lounge
        session_data = {
            'session_id': f'demo_yt_{int(datetime.now().timestamp())}',
            'topic': 'YouTube Video Analysis Request',
            'youtube_analysis': {
                'crew_member_id': 'captain_picard',
                'video_url': self.demo_videos[1],
                'analysis_focus': 'Strategic leadership concepts and mission planning insights'
            }
        }
        
        print(f"📹 Requesting analysis through Observation Lounge...")
        print(f"👨‍💼 Crew Member: Captain Jean-Luc Picard")
        print(f"🎯 Custom Focus: Strategic leadership concepts and mission planning insights")
        print()
        
        result = self.crew_coordinator.coordinate_observation_lounge(session_data)
        
        if 'youtube_analysis_result' in result:
            analysis_result = result['youtube_analysis_result']
            if analysis_result['status'] == 'success':
                print("✅ Crew coordination analysis completed!")
                print(f"   Session ID: {result['observation_lounge_session']['session_id']}")
                print(f"   Crew Member: {result['crew_member']}")
                print(f"   Video URL: {result['video_url']}")
            else:
                print(f"❌ Crew coordination analysis failed: {analysis_result['message']}")
        else:
            print(f"❌ Crew coordination failed: {result.get('error', 'Unknown error')}")
        
        print()
    
    def demo_batch_analysis_perspectives(self):
        """Demonstrate batch analysis with different crew member perspectives"""
        print("📦 Demo 4: Batch Analysis with Different Crew Perspectives")
        print("-" * 60)
        
        # Analyze the same video with different crew members
        video_url = self.demo_videos[2]
        crew_members = ['counselor_troi', 'quark', 'dr_crusher']
        
        print(f"📹 Analyzing: {video_url}")
        print(f"👥 Crew Members: {len(crew_members)} different perspectives")
        print()
        
        results = []
        for crew_member in crew_members:
            print(f"🔹 {self.scraper.crew_members[crew_member]['name']} analyzing...")
            result = self.scraper.request_youtube_analysis(crew_member, video_url)
            results.append({
                'crew_member': crew_member,
                'result': result
            })
            
            if result['status'] == 'success':
                print(f"   ✅ Analysis completed")
            else:
                print(f"   ❌ Analysis failed: {result['message']}")
        
        print()
        print("📊 Batch Analysis Summary:")
        successful = len([r for r in results if r['result']['status'] == 'success'])
        print(f"   Successful Analyses: {successful}/{len(crew_members)}")
        print(f"   Different Perspectives: {len(set([r['crew_member'] for r in results]))}")
        
        print()
    
    def demo_analysis_history(self):
        """Demonstrate analysis history retrieval"""
        print("📚 Demo 5: Analysis History and Insights")
        print("-" * 60)
        
        # Get general analysis history
        print("📖 Retrieving analysis history...")
        history_result = self.scraper.get_crew_analysis_history()
        
        if history_result['status'] == 'success':
            print(f"✅ Retrieved analysis history: {history_result['total_analyses']} analyses")
            
            if history_result['total_analyses'] > 0:
                print("\n📋 Recent Analyses:")
                # Show first few analyses
                for i, analysis in enumerate(history_result['analysis_history'][:3]):
                    print(f"   {i+1}. {analysis.get('title', 'Unknown Title')}")
                    print(f"      Channel: {analysis.get('channel', 'Unknown')}")
                    print(f"      Crew Member: {analysis.get('crew_member', 'Unknown')}")
                    print(f"      Timestamp: {analysis.get('analysis_timestamp', 'Unknown')}")
                    print()
        else:
            print(f"❌ Failed to retrieve analysis history: {history_result['message']}")
        
        print()
    
    def interactive_demo(self):
        """Run an interactive demo allowing user to test the system"""
        print("🎮 Interactive YouTube Scraper Demo")
        print("=" * 40)
        print()
        
        while True:
            print("Available commands:")
            print("1. List crew members")
            print("2. Analyze video with specific crew member")
            print("3. Batch analyze multiple videos")
            print("4. View analysis history")
            print("5. Exit")
            print()
            
            choice = input("Enter your choice (1-5): ").strip()
            
            if choice == '1':
                self.demo_crew_member_listing()
            elif choice == '2':
                self.interactive_single_analysis()
            elif choice == '3':
                self.interactive_batch_analysis()
            elif choice == '4':
                self.demo_analysis_history()
            elif choice == '5':
                print("👋 Goodbye!")
                break
            else:
                print("❌ Invalid choice. Please try again.")
            
            print()
    
    def interactive_single_analysis(self):
        """Interactive single video analysis"""
        print("\n🎯 Single Video Analysis")
        print("-" * 30)
        
        # List crew members
        crew_list = self.scraper.list_crew_members()
        if crew_list['status'] != 'success':
            print("❌ Failed to list crew members")
            return
        
        print("Available crew members:")
        for i, (member_id, member) in enumerate(crew_list['crew_members'].items(), 1):
            print(f"{i}. {member['name']} ({member['department']})")
        
        try:
            crew_choice = int(input("\nSelect crew member (number): ")) - 1
            crew_member_id = list(crew_list['crew_members'].keys())[crew_choice]
        except (ValueError, IndexError):
            print("❌ Invalid crew member selection")
            return
        
        video_url = input("Enter YouTube video URL: ").strip()
        if not video_url:
            print("❌ Video URL is required")
            return
        
        print(f"\n🔍 Analyzing with {crew_list['crew_members'][crew_member_id]['name']}...")
        result = self.scraper.request_youtube_analysis(crew_member_id, video_url)
        
        if result['status'] == 'success':
            print("✅ Analysis completed successfully!")
            print(f"   Crew Member: {result['crew_member']}")
            print(f"   Video URL: {result['video_url']}")
        else:
            print(f"❌ Analysis failed: {result['message']}")
    
    def interactive_batch_analysis(self):
        """Interactive batch video analysis"""
        print("\n📦 Batch Video Analysis")
        print("-" * 30)
        
        video_urls = []
        print("Enter YouTube video URLs (one per line, empty line to finish):")
        
        while True:
            url = input("Video URL: ").strip()
            if not url:
                break
            video_urls.append(url)
        
        if not video_urls:
            print("❌ No video URLs provided")
            return
        
        # Select crew member
        crew_list = self.scraper.list_crew_members()
        if crew_list['status'] != 'success':
            print("❌ Failed to list crew members")
            return
        
        print("\nAvailable crew members:")
        for i, (member_id, member) in enumerate(crew_list['crew_members'].items(), 1):
            print(f"{i}. {member['name']} ({member['department']})")
        
        try:
            crew_choice = int(input("\nSelect crew member (number): ")) - 1
            crew_member_id = list(crew_list['crew_members'].keys())[crew_choice]
        except (ValueError, IndexError):
            print("❌ Invalid crew member selection")
            return
        
        print(f"\n🔍 Batch analyzing {len(video_urls)} videos with {crew_list['crew_members'][crew_member_id]['name']}...")
        result = self.scraper.batch_analyze_videos(crew_member_id, video_urls)
        
        if result['status'] == 'completed':
            print("✅ Batch analysis completed!")
            print(f"   Total Videos: {result['total_videos']}")
            print(f"   Successful: {result['successful']}")
            print(f"   Failed: {result['failed']}")
        else:
            print(f"❌ Batch analysis failed")

def main():
    """Main demo function"""
    print("🎥 YouTube Scraper Universal Crew Access System")
    print("=" * 50)
    print()
    
    # Check environment variables
    required_env_vars = [
        'N8N_YOUTUBE_SCRAPER_WEBHOOK',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY'
    ]
    
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    if missing_vars:
        print("⚠️  Warning: Missing environment variables:")
        for var in missing_vars:
            print(f"   • {var}")
        print("\nSome features may not work without proper configuration.")
        print("See YOUTUBE_SCRAPER_DEPLOYMENT_GUIDE.md for setup instructions.")
        print()
    
    demo = YouTubeScraperSystemDemo()
    
    # Ask user for demo type
    print("Choose demo type:")
    print("1. Complete automated demo")
    print("2. Interactive demo")
    print()
    
    choice = input("Enter your choice (1-2): ").strip()
    
    if choice == '1':
        demo.run_complete_demo()
    elif choice == '2':
        demo.interactive_demo()
    else:
        print("❌ Invalid choice. Running complete demo...")
        demo.run_complete_demo()

if __name__ == "__main__":
    main()
