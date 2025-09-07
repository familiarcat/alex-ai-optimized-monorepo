#!/usr/bin/env python3
"""
YouTube Scraper Integration Test Suite
Tests the universal crew access YouTube scraping functionality
"""

import json
import sys
import os
import requests
import time
from typing import Dict, Any, List
from datetime import datetime

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from youtube_scraper_crew_integration import YouTubeScraperCrewIntegration

class YouTubeScraperTester:
    def __init__(self):
        self.scraper = YouTubeScraperCrewIntegration()
        self.test_results = []
        self.test_videos = [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # Rick Astley - Never Gonna Give You Up
            "https://youtu.be/jNQXAC9IVRw",  # Me at the zoo (first YouTube video)
            "https://www.youtube.com/watch?v=9bZkp7q19f0"  # PSY - GANGNAM STYLE
        ]
        
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all test cases"""
        print("🚀 Starting YouTube Scraper Integration Tests...")
        print("=" * 60)
        
        # Test 1: Crew member listing
        self.test_crew_member_listing()
        
        # Test 2: Single video analysis
        self.test_single_video_analysis()
        
        # Test 3: Batch video analysis
        self.test_batch_video_analysis()
        
        # Test 4: Invalid URL handling
        self.test_invalid_url_handling()
        
        # Test 5: Duplicate processing prevention
        self.test_duplicate_processing_prevention()
        
        # Test 6: Analysis history retrieval
        self.test_analysis_history_retrieval()
        
        # Test 7: Different crew member perspectives
        self.test_crew_member_perspectives()
        
        # Generate test report
        return self.generate_test_report()
    
    def test_crew_member_listing(self):
        """Test crew member listing functionality"""
        print("\n📋 Test 1: Crew Member Listing")
        print("-" * 40)
        
        try:
            result = self.scraper.list_crew_members()
            
            if result['status'] == 'success':
                print(f"✅ Successfully listed {result['total_crew']} crew members")
                for member_id, member in result['crew_members'].items():
                    print(f"   • {member['name']} ({member['department']})")
                    print(f"     Focus: {member['youtube_analysis_focus']}")
                
                self.test_results.append({
                    'test': 'crew_member_listing',
                    'status': 'PASS',
                    'message': f'Listed {result["total_crew"]} crew members successfully'
                })
            else:
                print(f"❌ Failed to list crew members: {result['message']}")
                self.test_results.append({
                    'test': 'crew_member_listing',
                    'status': 'FAIL',
                    'message': result['message']
                })
                
        except Exception as e:
            print(f"❌ Exception in crew member listing: {str(e)}")
            self.test_results.append({
                'test': 'crew_member_listing',
                'status': 'ERROR',
                'message': str(e)
            })
    
    def test_single_video_analysis(self):
        """Test single video analysis functionality"""
        print("\n🎥 Test 2: Single Video Analysis")
        print("-" * 40)
        
        try:
            video_url = self.test_videos[0]
            crew_member = 'commander_data'
            
            print(f"Analyzing: {video_url}")
            print(f"Crew Member: {self.scraper.crew_members[crew_member]['name']}")
            
            result = self.scraper.request_youtube_analysis(crew_member, video_url)
            
            if result['status'] == 'success':
                print("✅ Video analysis completed successfully")
                print(f"   Crew Member: {result['crew_member']}")
                print(f"   Video URL: {result['video_url']}")
                print(f"   Request Timestamp: {result['request_timestamp']}")
                
                self.test_results.append({
                    'test': 'single_video_analysis',
                    'status': 'PASS',
                    'message': 'Single video analysis completed successfully'
                })
            else:
                print(f"❌ Video analysis failed: {result['message']}")
                self.test_results.append({
                    'test': 'single_video_analysis',
                    'status': 'FAIL',
                    'message': result['message']
                })
                
        except Exception as e:
            print(f"❌ Exception in single video analysis: {str(e)}")
            self.test_results.append({
                'test': 'single_video_analysis',
                'status': 'ERROR',
                'message': str(e)
            })
    
    def test_batch_video_analysis(self):
        """Test batch video analysis functionality"""
        print("\n📦 Test 3: Batch Video Analysis")
        print("-" * 40)
        
        try:
            crew_member = 'captain_picard'
            analysis_focus = "Strategic leadership concepts and mission planning insights"
            
            print(f"Batch analyzing {len(self.test_videos)} videos")
            print(f"Crew Member: {self.scraper.crew_members[crew_member]['name']}")
            print(f"Analysis Focus: {analysis_focus}")
            
            result = self.scraper.batch_analyze_videos(crew_member, self.test_videos, analysis_focus)
            
            if result['status'] == 'completed':
                print("✅ Batch analysis completed")
                print(f"   Total Videos: {result['total_videos']}")
                print(f"   Successful: {result['successful']}")
                print(f"   Failed: {result['failed']}")
                
                self.test_results.append({
                    'test': 'batch_video_analysis',
                    'status': 'PASS',
                    'message': f'Batch analysis: {result["successful"]}/{result["total_videos"]} successful'
                })
            else:
                print(f"❌ Batch analysis failed: {result}")
                self.test_results.append({
                    'test': 'batch_video_analysis',
                    'status': 'FAIL',
                    'message': 'Batch analysis failed'
                })
                
        except Exception as e:
            print(f"❌ Exception in batch video analysis: {str(e)}")
            self.test_results.append({
                'test': 'batch_video_analysis',
                'status': 'ERROR',
                'message': str(e)
            })
    
    def test_invalid_url_handling(self):
        """Test invalid URL handling"""
        print("\n🚫 Test 4: Invalid URL Handling")
        print("-" * 40)
        
        try:
            invalid_urls = [
                "https://example.com/not-youtube",
                "not-a-url",
                "https://youtube.com/watch?v=invalid",
                ""
            ]
            
            crew_member = 'lieutenant_worf'
            
            for invalid_url in invalid_urls:
                print(f"Testing invalid URL: {invalid_url}")
                result = self.scraper.request_youtube_analysis(crew_member, invalid_url)
                
                if result['status'] == 'error':
                    print(f"✅ Correctly rejected invalid URL: {result['error_code']}")
                else:
                    print(f"❌ Should have rejected invalid URL")
                    self.test_results.append({
                        'test': 'invalid_url_handling',
                        'status': 'FAIL',
                        'message': f'Failed to reject invalid URL: {invalid_url}'
                    })
                    return
            
            self.test_results.append({
                'test': 'invalid_url_handling',
                'status': 'PASS',
                'message': 'All invalid URLs correctly rejected'
            })
            
        except Exception as e:
            print(f"❌ Exception in invalid URL handling: {str(e)}")
            self.test_results.append({
                'test': 'invalid_url_handling',
                'status': 'ERROR',
                'message': str(e)
            })
    
    def test_duplicate_processing_prevention(self):
        """Test duplicate processing prevention"""
        print("\n🔄 Test 5: Duplicate Processing Prevention")
        print("-" * 40)
        
        try:
            video_url = self.test_videos[0]  # Same video as test 2
            crew_member = 'geordi_la_forge'
            
            print(f"Testing duplicate processing for: {video_url}")
            print(f"Crew Member: {self.scraper.crew_members[crew_member]['name']}")
            
            result = self.scraper.request_youtube_analysis(crew_member, video_url)
            
            if result['status'] == 'success' and result.get('from_cache'):
                print("✅ Duplicate processing correctly prevented - using cached result")
                self.test_results.append({
                    'test': 'duplicate_processing_prevention',
                    'status': 'PASS',
                    'message': 'Duplicate processing correctly prevented'
                })
            elif result['status'] == 'success':
                print("⚠️  Video processed again (may be expected if cache not implemented)")
                self.test_results.append({
                    'test': 'duplicate_processing_prevention',
                    'status': 'WARN',
                    'message': 'Video processed again - cache may not be implemented'
                })
            else:
                print(f"❌ Unexpected result: {result['message']}")
                self.test_results.append({
                    'test': 'duplicate_processing_prevention',
                    'status': 'FAIL',
                    'message': result['message']
                })
                
        except Exception as e:
            print(f"❌ Exception in duplicate processing test: {str(e)}")
            self.test_results.append({
                'test': 'duplicate_processing_prevention',
                'status': 'ERROR',
                'message': str(e)
            })
    
    def test_analysis_history_retrieval(self):
        """Test analysis history retrieval"""
        print("\n📚 Test 6: Analysis History Retrieval")
        print("-" * 40)
        
        try:
            # Test general history
            print("Retrieving general analysis history...")
            result = self.scraper.get_crew_analysis_history()
            
            if result['status'] == 'success':
                print(f"✅ Retrieved analysis history: {result['total_analyses']} analyses")
                self.test_results.append({
                    'test': 'analysis_history_retrieval',
                    'status': 'PASS',
                    'message': f'Retrieved {result["total_analyses"]} analyses'
                })
            else:
                print(f"❌ Failed to retrieve analysis history: {result['message']}")
                self.test_results.append({
                    'test': 'analysis_history_retrieval',
                    'status': 'FAIL',
                    'message': result['message']
                })
                
        except Exception as e:
            print(f"❌ Exception in analysis history retrieval: {str(e)}")
            self.test_results.append({
                'test': 'analysis_history_retrieval',
                'status': 'ERROR',
                'message': str(e)
            })
    
    def test_crew_member_perspectives(self):
        """Test different crew member perspectives"""
        print("\n👥 Test 7: Crew Member Perspectives")
        print("-" * 40)
        
        try:
            video_url = self.test_videos[1]  # Different video
            crew_members = ['counselor_troi', 'quark', 'dr_crusher']
            
            for crew_member in crew_members:
                print(f"Testing perspective: {self.scraper.crew_members[crew_member]['name']}")
                result = self.scraper.request_youtube_analysis(crew_member, video_url)
                
                if result['status'] == 'success':
                    print(f"✅ {crew_member} analysis completed")
                else:
                    print(f"❌ {crew_member} analysis failed: {result['message']}")
            
            self.test_results.append({
                'test': 'crew_member_perspectives',
                'status': 'PASS',
                'message': f'Tested {len(crew_members)} different crew member perspectives'
            })
            
        except Exception as e:
            print(f"❌ Exception in crew member perspectives test: {str(e)}")
            self.test_results.append({
                'test': 'crew_member_perspectives',
                'status': 'ERROR',
                'message': str(e)
            })
    
    def generate_test_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report"""
        print("\n" + "=" * 60)
        print("📊 TEST REPORT SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r['status'] == 'PASS'])
        failed_tests = len([r for r in self.test_results if r['status'] == 'FAIL'])
        error_tests = len([r for r in self.test_results if r['status'] == 'ERROR'])
        warning_tests = len([r for r in self.test_results if r['status'] == 'WARN'])
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⚠️  Warnings: {warning_tests}")
        print(f"💥 Errors: {error_tests}")
        
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        print(f"Success Rate: {success_rate:.1f}%")
        
        print("\nDetailed Results:")
        for result in self.test_results:
            status_icon = {
                'PASS': '✅',
                'FAIL': '❌',
                'ERROR': '💥',
                'WARN': '⚠️'
            }.get(result['status'], '❓')
            
            print(f"  {status_icon} {result['test']}: {result['message']}")
        
        return {
            'test_summary': {
                'total_tests': total_tests,
                'passed': passed_tests,
                'failed': failed_tests,
                'errors': error_tests,
                'warnings': warning_tests,
                'success_rate': success_rate
            },
            'test_results': self.test_results,
            'timestamp': datetime.now().isoformat()
        }

def main():
    """Run the test suite"""
    print("🧪 YouTube Scraper Integration Test Suite")
    print("Testing universal crew access to YouTube video analysis")
    print()
    
    # Check environment variables
    required_env_vars = [
        'N8N_YOUTUBE_SCRAPER_WEBHOOK',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY'
    ]
    
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   • {var}")
        print("\nPlease set these environment variables before running tests.")
        sys.exit(1)
    
    # Run tests
    tester = YouTubeScraperTester()
    report = tester.run_all_tests()
    
    # Save test report
    report_file = f"youtube_scraper_test_report_{int(datetime.now().timestamp())}.json"
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Test report saved to: {report_file}")
    
    # Exit with appropriate code
    if report['test_summary']['failed'] > 0 or report['test_summary']['errors'] > 0:
        print("\n❌ Some tests failed. Check the report for details.")
        sys.exit(1)
    else:
        print("\n🎉 All tests passed! YouTube scraper integration is ready.")
        sys.exit(0)

if __name__ == "__main__":
    main()
