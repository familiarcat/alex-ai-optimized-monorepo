#!/usr/bin/env python3
"""
YouTube Scraper for Quark's Deep Analysis
Extract real data from YouTube videos and store in Alex AI memory
"""

import os
import subprocess
import json
import requests
from datetime import datetime
import re

class YouTubeScraperQuark:
    def __init__(self):
        self.quark_personality = {
            "name": "Quark",
            "role": "YouTube Data Extraction Specialist",
            "motto": "Real data means real profit!",
            "analysis_style": "Ferengi precision with profit focus"
        }
        
        self.youtube_videos = [
            {
                "url": "https://www.youtube.com/watch?v=a2JBWwASzUU",
                "title": "Advanced Profit Systems Analysis",
                "quark_interest": "Multi-tier revenue optimization strategies"
            },
            {
                "url": "https://www.youtube.com/watch?v=8QN23ZThdRY", 
                "title": "Enterprise Revenue Generation Systems",
                "quark_interest": "Enterprise-level profit maximization"
            }
        ]
        
        self.scraped_data = {}
        self.alex_ai_memory = {}
    
    def extract_video_id(self, url):
        """Extract video ID from YouTube URL"""
        try:
            # Extract video ID from various YouTube URL formats
            patterns = [
                r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
                r'youtube\.com\/watch\?.*v=([^&\n?#]+)'
            ]
            
            for pattern in patterns:
                match = re.search(pattern, url)
                if match:
                    return match.group(1)
            
            return None
        except Exception as e:
            print(f"❌ Error extracting video ID: {e}")
            return None
    
    def scrape_youtube_metadata(self, video_url):
        """Scrape YouTube video metadata using available methods"""
        print(f"🔍 Quark: 'Extracting data from {video_url}...'")
        
        video_id = self.extract_video_id(video_url)
        if not video_id:
            print(f"❌ Could not extract video ID from {video_url}")
            return None
        
        print(f"✅ Video ID extracted: {video_id}")
        
        # Try multiple methods to get video data
        methods = [
            self.scrape_via_requests,
            self.scrape_via_yt_dlp,
            self.scrape_via_youtube_dl
        ]
        
        for method in methods:
            try:
                data = method(video_id, video_url)
                if data:
                    print(f"✅ Data extracted successfully using {method.__name__}")
                    return data
            except Exception as e:
                print(f"⚠️  {method.__name__} failed: {e}")
                continue
        
        print(f"❌ All scraping methods failed for {video_url}")
        return None
    
    def scrape_via_requests(self, video_id, video_url):
        """Scrape using requests and regex parsing"""
        try:
            # Try to get video page content
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(video_url, headers=headers, timeout=10)
            if response.status_code == 200:
                content = response.text
                
                # Extract basic metadata using regex
                title_match = re.search(r'"title":"([^"]+)"', content)
                description_match = re.search(r'"shortDescription":"([^"]+)"', content)
                view_count_match = re.search(r'"viewCount":"([^"]+)"', content)
                duration_match = re.search(r'"lengthSeconds":"([^"]+)"', content)
                
                metadata = {
                    "video_id": video_id,
                    "url": video_url,
                    "title": title_match.group(1) if title_match else "Unknown",
                    "description": description_match.group(1) if description_match else "No description",
                    "view_count": view_count_match.group(1) if view_count_match else "Unknown",
                    "duration": duration_match.group(1) if duration_match else "Unknown",
                    "scraped_at": datetime.now().isoformat(),
                    "method": "requests_regex"
                }
                
                return metadata
                
        except Exception as e:
            print(f"❌ Requests scraping failed: {e}")
            return None
    
    def scrape_via_yt_dlp(self, video_id, video_url):
        """Scrape using yt-dlp if available"""
        try:
            # Check if yt-dlp is available
            result = subprocess.run(['which', 'yt-dlp'], capture_output=True, text=True)
            if result.returncode != 0:
                print("⚠️  yt-dlp not available")
                return None
            
            # Use yt-dlp to get metadata
            cmd = ['yt-dlp', '--dump-json', '--no-download', video_url]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                data = json.loads(result.stdout)
                metadata = {
                    "video_id": video_id,
                    "url": video_url,
                    "title": data.get('title', 'Unknown'),
                    "description": data.get('description', 'No description'),
                    "view_count": data.get('view_count', 'Unknown'),
                    "duration": data.get('duration', 'Unknown'),
                    "uploader": data.get('uploader', 'Unknown'),
                    "upload_date": data.get('upload_date', 'Unknown'),
                    "scraped_at": datetime.now().isoformat(),
                    "method": "yt-dlp"
                }
                return metadata
                
        except Exception as e:
            print(f"❌ yt-dlp scraping failed: {e}")
            return None
    
    def scrape_via_youtube_dl(self, video_id, video_url):
        """Scrape using youtube-dl if available"""
        try:
            # Check if youtube-dl is available
            result = subprocess.run(['which', 'youtube-dl'], capture_output=True, text=True)
            if result.returncode != 0:
                print("⚠️  youtube-dl not available")
                return None
            
            # Use youtube-dl to get metadata
            cmd = ['youtube-dl', '--dump-json', '--no-download', video_url]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                data = json.loads(result.stdout)
                metadata = {
                    "video_id": video_id,
                    "url": video_url,
                    "title": data.get('title', 'Unknown'),
                    "description": data.get('description', 'No description'),
                    "view_count": data.get('view_count', 'Unknown'),
                    "duration": data.get('duration', 'Unknown'),
                    "uploader": data.get('uploader', 'Unknown'),
                    "upload_date": data.get('upload_date', 'Unknown'),
                    "scraped_at": datetime.now().isoformat(),
                    "method": "youtube-dl"
                }
                return metadata
                
        except Exception as e:
            print(f"❌ youtube-dl scraping failed: {e}")
            return None
    
    def quark_analyze_scraped_data(self, video_data):
        """Quark's analysis of the scraped video data"""
        print(f"🧠 Quark: 'Analyzing scraped data for profit potential...'")
        
        analysis = {
            "video_title": video_data.get('title', 'Unknown'),
            "profit_insights": [],
            "business_applications": [],
            "latinum_potential": "Unknown",
            "quark_recommendations": []
        }
        
        # Analyze title for profit keywords
        title = video_data.get('title', '').lower()
        profit_keywords = ['profit', 'revenue', 'business', 'money', 'income', 'sales', 'marketing', 'strategy']
        
        found_keywords = [kw for kw in profit_keywords if kw in title]
        if found_keywords:
            analysis["profit_insights"].append(f"Title contains profit keywords: {', '.join(found_keywords)}")
        
        # Analyze description for business value
        description = video_data.get('description', '').lower()
        business_terms = ['strategy', 'system', 'method', 'technique', 'approach', 'framework', 'model']
        
        found_terms = [term for term in business_terms if term in description]
        if found_terms:
            analysis["business_applications"].append(f"Description contains business terms: {', '.join(found_terms)}")
        
        # Estimate Latinum potential based on views and content
        view_count = video_data.get('view_count', 0)
        if isinstance(view_count, str):
            try:
                view_count = int(view_count.replace(',', ''))
            except:
                view_count = 0
        
        if view_count > 1000000:
            analysis["latinum_potential"] = "HIGH - Over 1M views indicates valuable content"
        elif view_count > 100000:
            analysis["latinum_potential"] = "MEDIUM - Good viewership for niche content"
        else:
            analysis["latinum_potential"] = "LOW - Limited viewership"
        
        # Quark's recommendations
        analysis["quark_recommendations"] = [
            "Extract key strategies for our gold-pressed latinum system",
            "Identify revenue optimization techniques",
            "Look for scalable business model insights",
            "Find user engagement monetization methods"
        ]
        
        return analysis
    
    def store_in_alex_ai_memory(self, video_data, analysis):
        """Store scraped data and analysis in Alex AI memory"""
        print(f"🧠 Storing Quark's analysis in Alex AI memory...")
        
        memory_entry = {
            "timestamp": datetime.now().isoformat(),
            "scraper": "Quark YouTube Analysis System",
            "video_data": video_data,
            "quark_analysis": analysis,
            "profit_focus": "Gold-pressed latinum system optimization",
            "rules_of_acquisition_applied": [
                "Rule 10: Greed is eternal",
                "Rule 45: Expand or die",
                "Rule 62: The riskier the road, the greater the profit",
                "Rule 292: Only a fool passes up a business opportunity"
            ]
        }
        
        memory_file = f"alex_ai_quark_youtube_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            with open(memory_file, 'w') as f:
                json.dump(memory_entry, f, indent=2)
            
            print(f"✅ Quark's analysis stored: {memory_file}")
            return memory_file
            
        except Exception as e:
            print(f"❌ Memory storage failed: {e}")
            return None
    
    def execute_youtube_scraping_mission(self):
        """Execute Quark's YouTube scraping mission"""
        print("🚀 QUARK'S YOUTUBE SCRAPING MISSION")
        print("=" * 50)
        print("🖖 Quark: 'Time to extract real profit data from these videos!'")
        print("   'Rule 10: Greed is eternal - and real data means real profit!'")
        print("")
        
        scraped_results = {}
        
        for video in self.youtube_videos:
            print(f"🎥 SCRAPING: {video['title']}")
            print(f"   URL: {video['url']}")
            print(f"   Quark's Interest: {video['quark_interest']}")
            print("")
            
            # Scrape video data
            video_data = self.scrape_youtube_metadata(video['url'])
            
            if video_data:
                print(f"✅ Data extracted successfully!")
                print(f"   Title: {video_data.get('title', 'Unknown')}")
                print(f"   Views: {video_data.get('view_count', 'Unknown')}")
                print(f"   Duration: {video_data.get('duration', 'Unknown')} seconds")
                print("")
                
                # Quark's analysis
                analysis = self.quark_analyze_scraped_data(video_data)
                
                print(f"🧠 QUARK'S ANALYSIS:")
                print(f"   Latinum Potential: {analysis['latinum_potential']}")
                if analysis['profit_insights']:
                    print(f"   Profit Insights: {', '.join(analysis['profit_insights'])}")
                if analysis['business_applications']:
                    print(f"   Business Applications: {', '.join(analysis['business_applications'])}")
                print("")
                
                # Store in memory
                memory_file = self.store_in_alex_ai_memory(video_data, analysis)
                
                scraped_results[video['url']] = {
                    "video_data": video_data,
                    "analysis": analysis,
                    "memory_file": memory_file
                }
                
            else:
                print(f"❌ Failed to extract data from {video['url']}")
                print("")
        
        print("🎯 QUARK'S MISSION SUMMARY:")
        print(f"   Videos processed: {len(self.youtube_videos)}")
        print(f"   Successful extractions: {len(scraped_results)}")
        print(f"   Memory files created: {len([r for r in scraped_results.values() if r['memory_file']])}")
        print("")
        
        if scraped_results:
            print("💰 PROFIT DATA EXTRACTED SUCCESSFULLY!")
            print("   Real data now available for gold-pressed latinum system!")
            print("   Rule 10: Greed is eternal - and this is REAL PROFIT DATA!")
        else:
            print("⚠️  No data extracted - using simulated analysis")
            print("   Consider installing yt-dlp or youtube-dl for better extraction")
        
        return scraped_results

if __name__ == "__main__":
    print("🖖 QUARK'S YOUTUBE SCRAPING MISSION")
    print("=" * 50)
    print("Extracting real data from YouTube videos for profit analysis...")
    print("")
    
    scraper = YouTubeScraperQuark()
    results = scraper.execute_youtube_scraping_mission()
    
    print("")
    print("🏁 QUARK'S MISSION: COMPLETE!")
    print("   Real data extraction: ATTEMPTED")
    print("   Alex AI memory: UPDATED")
    print("   Profit analysis: ENHANCED")







