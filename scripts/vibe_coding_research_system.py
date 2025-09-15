#!/usr/bin/env python3
"""
Alex AI Vibe Coding Research System
===================================
Comprehensive research system for gathering insights from The Boring Marketer
and Greg Isenberg to enhance our Alex AI development process.

This system integrates:
- YouTube content scraping for Greg Isenberg videos
- Web scraping for The Boring Marketer content
- Content analysis and insight extraction
- RAG system integration for knowledge storage
"""

import os
import json
import requests
import hashlib
from datetime import datetime
from typing import Dict, List, Any, Optional
import time
import random
from urllib.parse import urljoin, urlparse
import re

# Import our existing systems
from scripts.python.youtube_scraper_crew_integration import YouTubeScraperCrewIntegration
from scripts.python.optimized_web_crawler_system import OptimizedWebCrawler

class VibeCodingResearchSystem:
    def __init__(self):
        self.research_config = {
            "greg_isenberg": {
                "youtube_channel": "https://www.youtube.com/@GregIsenberg",
                "focus_areas": [
                    "community building",
                    "product-market fit", 
                    "startup strategy",
                    "user acquisition",
                    "retention strategies",
                    "monetization",
                    "vibe coding",
                    "product development"
                ],
                "max_videos": 50,
                "analysis_depth": "comprehensive"
            },
            "boring_marketer": {
                "website": "https://www.thevibemarketer.com",
                "focus_areas": [
                    "product development",
                    "user research",
                    "market validation",
                    "vibe coding",
                    "product-market fit",
                    "startup methodology",
                    "user experience",
                    "business strategy"
                ],
                "max_pages": 20,
                "scraping_delay": 2.0
            }
        }
        
        # Initialize subsystems
        self.youtube_scraper = YouTubeScraperCrewIntegration()
        self.web_crawler = OptimizedWebCrawler()
        
        # Research results storage
        self.research_results = {
            "greg_isenberg": {
                "videos_analyzed": [],
                "insights": [],
                "key_themes": [],
                "actionable_recommendations": []
            },
            "boring_marketer": {
                "pages_scraped": [],
                "insights": [],
                "key_themes": [],
                "actionable_recommendations": []
            },
            "combined_insights": {
                "vibe_coding_methodologies": [],
                "product_development_principles": [],
                "community_building_strategies": [],
                "user_research_methods": [],
                "business_model_insights": []
            }
        }
        
        # Crew member specializations for analysis
        self.crew_analysis_roles = {
            "Captain Jean-Luc Picard": "Strategic Leadership & Vision",
            "Commander William Riker": "Tactical Execution & Operations",
            "Commander Data": "Analytics & Data Processing",
            "Lieutenant Commander Geordi La Forge": "Technical Infrastructure",
            "Lieutenant Worf": "Security & Compliance",
            "Counselor Deanna Troi": "User Experience & Human-Centered Design",
            "Lieutenant Uhura": "Communications & Integration",
            "Dr. Beverly Crusher": "System Health & Performance",
            "Quark": "Business Intelligence & ROI"
        }

    def run_comprehensive_research(self) -> Dict[str, Any]:
        """Run comprehensive research on vibe coding methodologies"""
        print("🚀 Starting Alex AI Vibe Coding Research Mission")
        print("=" * 60)
        
        # Phase 1: Greg Isenberg YouTube Analysis
        print("\n📺 Phase 1: Greg Isenberg YouTube Content Analysis")
        greg_results = self.analyze_greg_isenberg_content()
        
        # Phase 2: The Boring Marketer Web Scraping
        print("\n🌐 Phase 2: The Boring Marketer Content Analysis")
        boring_marketer_results = self.analyze_boring_marketer_content()
        
        # Phase 3: Combined Analysis and Insight Extraction
        print("\n🧠 Phase 3: Combined Analysis and Insight Extraction")
        combined_insights = self.extract_combined_insights(greg_results, boring_marketer_results)
        
        # Phase 4: Crew Analysis and Recommendations
        print("\n👥 Phase 4: Crew Analysis and Recommendations")
        crew_recommendations = self.generate_crew_recommendations(combined_insights)
        
        # Phase 5: RAG System Integration
        print("\n💾 Phase 5: RAG System Integration")
        rag_integration = self.integrate_with_rag_system(combined_insights, crew_recommendations)
        
        # Compile final results
        final_results = {
            "timestamp": datetime.now().isoformat(),
            "research_summary": {
                "greg_isenberg_videos_analyzed": len(greg_results.get("videos", [])),
                "boring_marketer_pages_scraped": len(boring_marketer_results.get("pages", [])),
                "total_insights_extracted": len(combined_insights.get("insights", [])),
                "crew_recommendations_generated": len(crew_recommendations)
            },
            "greg_isenberg_analysis": greg_results,
            "boring_marketer_analysis": boring_marketer_results,
            "combined_insights": combined_insights,
            "crew_recommendations": crew_recommendations,
            "rag_integration": rag_integration
        }
        
        # Save results
        self.save_research_results(final_results)
        
        print("\n🎉 Vibe Coding Research Mission Complete!")
        print(f"📊 Total insights extracted: {len(combined_insights.get('insights', []))}")
        print(f"👥 Crew recommendations generated: {len(crew_recommendations)}")
        print(f"💾 RAG system integration: {'✅ Success' if rag_integration.get('success') else '❌ Failed'}")
        
        return final_results

    def analyze_greg_isenberg_content(self) -> Dict[str, Any]:
        """Analyze Greg Isenberg's YouTube content for vibe coding insights"""
        print("  📺 Analyzing Greg Isenberg YouTube channel...")
        
        try:
            # Use our YouTube scraper to analyze the channel
            channel_analysis = self.youtube_scraper.analyze_youtube_channel(
                channel_url=self.research_config["greg_isenberg"]["youtube_channel"],
                max_videos=self.research_config["greg_isenberg"]["max_videos"],
                analysis_depth=self.research_config["greg_isenberg"]["analysis_depth"]
            )
            
            # Extract vibe coding specific insights
            vibe_coding_insights = self.extract_vibe_coding_insights(channel_analysis)
            
            results = {
                "channel_analysis": channel_analysis,
                "vibe_coding_insights": vibe_coding_insights,
                "key_themes": self.identify_key_themes(channel_analysis),
                "actionable_recommendations": self.generate_actionable_recommendations(vibe_coding_insights)
            }
            
            print(f"  ✅ Analyzed {len(channel_analysis.get('videos', []))} videos")
            print(f"  📝 Extracted {len(vibe_coding_insights)} vibe coding insights")
            
            return results
            
        except Exception as e:
            print(f"  ❌ Error analyzing Greg Isenberg content: {e}")
            return {"error": str(e), "videos": [], "insights": []}

    def analyze_boring_marketer_content(self) -> Dict[str, Any]:
        """Analyze The Boring Marketer website content"""
        print("  🌐 Analyzing The Boring Marketer website...")
        
        try:
            # Scrape the main website
            main_page_content = self.scrape_boring_marketer_website()
            
            # Extract vibe coding insights
            vibe_coding_insights = self.extract_boring_marketer_insights(main_page_content)
            
            results = {
                "website_content": main_page_content,
                "vibe_coding_insights": vibe_coding_insights,
                "key_themes": self.identify_boring_marketer_themes(main_page_content),
                "actionable_recommendations": self.generate_boring_marketer_recommendations(vibe_coding_insights)
            }
            
            print(f"  ✅ Scraped {len(main_page_content.get('pages', []))} pages")
            print(f"  📝 Extracted {len(vibe_coding_insights)} insights")
            
            return results
            
        except Exception as e:
            print(f"  ❌ Error analyzing The Boring Marketer content: {e}")
            return {"error": str(e), "pages": [], "insights": []}

    def scrape_boring_marketer_website(self) -> Dict[str, Any]:
        """Scrape The Boring Marketer website for content"""
        website_url = self.research_config["boring_marketer"]["website"]
        
        try:
            # Use our web crawler to scrape the website
            crawled_data = self.web_crawler.crawl_website(
                base_url=website_url,
                max_pages=self.research_config["boring_marketer"]["max_pages"],
                delay=self.research_config["boring_marketer"]["scraping_delay"]
            )
            
            # Extract relevant content
            extracted_content = self.extract_website_content(crawled_data)
            
            return extracted_content
            
        except Exception as e:
            print(f"  ❌ Error scraping website: {e}")
            return {"error": str(e), "pages": []}

    def extract_website_content(self, crawled_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract relevant content from crawled website data"""
        content = {
            "pages": [],
            "articles": [],
            "insights": [],
            "methodologies": []
        }
        
        # Process crawled data to extract relevant content
        for page_data in crawled_data.get("pages", []):
            page_content = {
                "url": page_data.get("url"),
                "title": page_data.get("title"),
                "content": page_data.get("content"),
                "insights": self.extract_page_insights(page_data.get("content", "")),
                "methodologies": self.extract_methodologies(page_data.get("content", ""))
            }
            content["pages"].append(page_content)
            content["insights"].extend(page_content["insights"])
            content["methodologies"].extend(page_content["methodologies"])
        
        return content

    def extract_page_insights(self, content: str) -> List[str]:
        """Extract insights from page content"""
        insights = []
        
        # Look for specific patterns that indicate insights
        insight_patterns = [
            r"key insight[s]?:?\s*([^.!?]+)",
            r"important[s]?:?\s*([^.!?]+)",
            r"critical[s]?:?\s*([^.!?]+)",
            r"essential[s]?:?\s*([^.!?]+)",
            r"vibe coding[s]?:?\s*([^.!?]+)",
            r"product development[s]?:?\s*([^.!?]+)",
            r"user research[s]?:?\s*([^.!?]+)"
        ]
        
        for pattern in insight_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            insights.extend([match.strip() for match in matches if len(match.strip()) > 10])
        
        return insights

    def extract_methodologies(self, content: str) -> List[str]:
        """Extract methodologies from page content"""
        methodologies = []
        
        # Look for methodology patterns
        methodology_patterns = [
            r"methodology[s]?:?\s*([^.!?]+)",
            r"approach[s]?:?\s*([^.!?]+)",
            r"framework[s]?:?\s*([^.!?]+)",
            r"process[s]?:?\s*([^.!?]+)",
            r"strategy[s]?:?\s*([^.!?]+)"
        ]
        
        for pattern in methodology_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            methodologies.extend([match.strip() for match in matches if len(match.strip()) > 10])
        
        return methodologies

    def extract_vibe_coding_insights(self, channel_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract vibe coding specific insights from YouTube analysis"""
        insights = []
        
        # Process video analysis for vibe coding insights
        for video in channel_analysis.get("videos", []):
            video_insights = self.analyze_video_for_vibe_coding(video)
            insights.extend(video_insights)
        
        return insights

    def analyze_video_for_vibe_coding(self, video: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Analyze individual video for vibe coding insights"""
        insights = []
        
        # Extract insights from video title, description, and comments
        video_data = {
            "title": video.get("title", ""),
            "description": video.get("description", ""),
            "comments": video.get("comments", []),
            "transcript": video.get("transcript", "")
        }
        
        # Look for vibe coding related content
        vibe_coding_keywords = [
            "vibe coding", "product development", "user research", "market validation",
            "community building", "product-market fit", "startup strategy", "user acquisition",
            "retention", "monetization", "user experience", "business strategy"
        ]
        
        for keyword in vibe_coding_keywords:
            if keyword.lower() in video_data["title"].lower() or keyword.lower() in video_data["description"].lower():
                insight = {
                    "source": "Greg Isenberg YouTube",
                    "video_title": video_data["title"],
                    "keyword": keyword,
                    "insight": f"Found {keyword} content in video: {video_data['title']}",
                    "relevance_score": self.calculate_relevance_score(video_data, keyword),
                    "timestamp": datetime.now().isoformat()
                }
                insights.append(insight)
        
        return insights

    def calculate_relevance_score(self, video_data: Dict[str, Any], keyword: str) -> float:
        """Calculate relevance score for a video insight"""
        score = 0.0
        
        # Title relevance (higher weight)
        if keyword.lower() in video_data["title"].lower():
            score += 0.4
        
        # Description relevance
        if keyword.lower() in video_data["description"].lower():
            score += 0.3
        
        # Comments relevance
        comment_mentions = sum(1 for comment in video_data["comments"] if keyword.lower() in comment.lower())
        if comment_mentions > 0:
            score += min(0.3, comment_mentions * 0.1)
        
        return min(1.0, score)

    def extract_boring_marketer_insights(self, website_content: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract insights from The Boring Marketer content"""
        insights = []
        
        # Process each page for insights
        for page in website_content.get("pages", []):
            page_insights = self.extract_page_insights(page.get("content", ""))
            
            for insight_text in page_insights:
                insight = {
                    "source": "The Boring Marketer",
                    "page_title": page.get("title", ""),
                    "page_url": page.get("url", ""),
                    "insight": insight_text,
                    "relevance_score": self.calculate_insight_relevance(insight_text),
                    "timestamp": datetime.now().isoformat()
                }
                insights.append(insight)
        
        return insights

    def calculate_insight_relevance(self, insight_text: str) -> float:
        """Calculate relevance score for an insight"""
        score = 0.0
        
        # Check for high-value keywords
        high_value_keywords = [
            "vibe coding", "product development", "user research", "market validation",
            "product-market fit", "startup", "business model", "user experience"
        ]
        
        for keyword in high_value_keywords:
            if keyword.lower() in insight_text.lower():
                score += 0.2
        
        # Length bonus (longer insights are often more valuable)
        if len(insight_text) > 50:
            score += 0.1
        
        return min(1.0, score)

    def extract_combined_insights(self, greg_results: Dict[str, Any], boring_marketer_results: Dict[str, Any]) -> Dict[str, Any]:
        """Extract combined insights from both sources"""
        combined_insights = {
            "vibe_coding_methodologies": [],
            "product_development_principles": [],
            "community_building_strategies": [],
            "user_research_methods": [],
            "business_model_insights": [],
            "all_insights": []
        }
        
        # Combine insights from both sources
        all_insights = []
        all_insights.extend(greg_results.get("vibe_coding_insights", []))
        all_insights.extend(boring_marketer_results.get("vibe_coding_insights", []))
        
        # Categorize insights
        for insight in all_insights:
            insight_text = insight.get("insight", "").lower()
            
            if "vibe coding" in insight_text or "methodology" in insight_text:
                combined_insights["vibe_coding_methodologies"].append(insight)
            elif "product development" in insight_text or "development" in insight_text:
                combined_insights["product_development_principles"].append(insight)
            elif "community" in insight_text or "building" in insight_text:
                combined_insights["community_building_strategies"].append(insight)
            elif "user research" in insight_text or "research" in insight_text:
                combined_insights["user_research_methods"].append(insight)
            elif "business" in insight_text or "monetization" in insight_text or "revenue" in insight_text:
                combined_insights["business_model_insights"].append(insight)
            
            combined_insights["all_insights"].append(insight)
        
        return combined_insights

    def generate_crew_recommendations(self, combined_insights: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate crew-specific recommendations based on insights"""
        recommendations = []
        
        for crew_member, specialization in self.crew_analysis_roles.items():
            crew_recommendations = self.generate_crew_member_recommendations(
                crew_member, specialization, combined_insights
            )
            recommendations.extend(crew_recommendations)
        
        return recommendations

    def generate_crew_member_recommendations(self, crew_member: str, specialization: str, insights: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate recommendations for a specific crew member"""
        recommendations = []
        
        # Map specializations to relevant insight categories
        specialization_mapping = {
            "Strategic Leadership & Vision": ["vibe_coding_methodologies", "business_model_insights"],
            "Tactical Execution & Operations": ["product_development_principles", "user_research_methods"],
            "Analytics & Data Processing": ["user_research_methods", "business_model_insights"],
            "Technical Infrastructure": ["product_development_principles", "vibe_coding_methodologies"],
            "Security & Compliance": ["vibe_coding_methodologies", "business_model_insights"],
            "User Experience & Human-Centered Design": ["user_research_methods", "community_building_strategies"],
            "Communications & Integration": ["community_building_strategies", "product_development_principles"],
            "System Health & Performance": ["product_development_principles", "vibe_coding_methodologies"],
            "Business Intelligence & ROI": ["business_model_insights", "community_building_strategies"]
        }
        
        relevant_categories = specialization_mapping.get(specialization, ["all_insights"])
        
        for category in relevant_categories:
            category_insights = insights.get(category, [])
            
            for insight in category_insights[:3]:  # Top 3 insights per category
                recommendation = {
                    "crew_member": crew_member,
                    "specialization": specialization,
                    "category": category,
                    "insight": insight,
                    "recommendation": self.generate_specific_recommendation(crew_member, specialization, insight),
                    "priority": self.calculate_priority(insight),
                    "timestamp": datetime.now().isoformat()
                }
                recommendations.append(recommendation)
        
        return recommendations

    def generate_specific_recommendation(self, crew_member: str, specialization: str, insight: Dict[str, Any]) -> str:
        """Generate a specific recommendation for a crew member based on an insight"""
        insight_text = insight.get("insight", "")
        
        # Generate crew-specific recommendations
        if "Captain Jean-Luc Picard" in crew_member:
            return f"Strategic Recommendation: Integrate '{insight_text}' into our Alex AI strategic planning process to enhance our mission success and crew welfare."
        elif "Commander William Riker" in crew_member:
            return f"Tactical Recommendation: Implement '{insight_text}' in our operational procedures to improve mission execution and resource allocation."
        elif "Commander Data" in crew_member:
            return f"Analytical Recommendation: Analyze '{insight_text}' data patterns to enhance our logical reasoning and decision-making capabilities."
        elif "Lieutenant Commander Geordi La Forge" in crew_member:
            return f"Engineering Recommendation: Apply '{insight_text}' principles to our technical infrastructure for improved system optimization and innovation."
        elif "Lieutenant Worf" in crew_member:
            return f"Security Recommendation: Implement '{insight_text}' security protocols to protect our systems and ensure data integrity."
        elif "Counselor Deanna Troi" in crew_member:
            return f"User Experience Recommendation: Apply '{insight_text}' insights to enhance crew welfare and user experience design."
        elif "Lieutenant Uhura" in crew_member:
            return f"Communication Recommendation: Integrate '{insight_text}' into our communication protocols for improved system integration and data transmission."
        elif "Dr. Beverly Crusher" in crew_member:
            return f"Health Recommendation: Apply '{insight_text}' principles to our system health monitoring and performance optimization."
        elif "Quark" in crew_member:
            return f"Business Recommendation: Implement '{insight_text}' strategies to optimize our ROI and create sustainable business value."
        else:
            return f"General Recommendation: Consider '{insight_text}' for potential integration into our Alex AI development process."

    def calculate_priority(self, insight: Dict[str, Any]) -> str:
        """Calculate priority level for an insight"""
        relevance_score = insight.get("relevance_score", 0.0)
        
        if relevance_score >= 0.8:
            return "High"
        elif relevance_score >= 0.6:
            return "Medium"
        else:
            return "Low"

    def integrate_with_rag_system(self, combined_insights: Dict[str, Any], crew_recommendations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Integrate research results with our RAG system"""
        try:
            # Create a conference document for our RAG system
            conference_data = {
                "conference": "Vibe Coding Research Integration",
                "date": datetime.now().isoformat(),
                "location": "Alex AI Research Lab",
                "agenda": "Integrate vibe coding research insights into Alex AI development process",
                "participants": list(self.crew_analysis_roles.keys()),
                "research_summary": {
                    "total_insights": len(combined_insights.get("all_insights", [])),
                    "crew_recommendations": len(crew_recommendations),
                    "categories_analyzed": len([k for k, v in combined_insights.items() if isinstance(v, list) and len(v) > 0])
                },
                "combined_insights": combined_insights,
                "crew_recommendations": crew_recommendations,
                "integration_plan": self.create_integration_plan(combined_insights, crew_recommendations)
            }
            
            # Save to our RAG system
            conference_filename = f"Vibe_Coding_Research_Conference_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            conference_path = f"Observation_Lounge_{conference_filename}"
            
            with open(conference_path, 'w') as f:
                json.dump(conference_data, f, indent=2)
            
            return {
                "success": True,
                "conference_file": conference_path,
                "insights_integrated": len(combined_insights.get("all_insights", [])),
                "recommendations_integrated": len(crew_recommendations)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def create_integration_plan(self, combined_insights: Dict[str, Any], crew_recommendations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create an integration plan for the research insights"""
        return {
            "phase_1_immediate": [
                "Integrate high-priority insights into artist management platform development",
                "Apply user research methods to improve user experience",
                "Implement community building strategies"
            ],
            "phase_2_short_term": [
                "Develop vibe coding methodologies into our development process",
                "Create product development principles based on research",
                "Establish business model insights for sustainable growth"
            ],
            "phase_3_long_term": [
                "Build comprehensive vibe coding framework for Alex AI",
                "Create community-driven development processes",
                "Establish sustainable business models based on research"
            ],
            "success_metrics": [
                "Improved user engagement and retention",
                "Enhanced product-market fit",
                "Increased community growth",
                "Sustainable revenue generation"
            ]
        }

    def identify_key_themes(self, channel_analysis: Dict[str, Any]) -> List[str]:
        """Identify key themes from YouTube channel analysis"""
        themes = []
        
        # Extract themes from video titles and descriptions
        all_text = ""
        for video in channel_analysis.get("videos", []):
            all_text += f" {video.get('title', '')} {video.get('description', '')}"
        
        # Look for common themes
        theme_keywords = [
            "community", "startup", "product", "user", "market", "business",
            "strategy", "growth", "monetization", "acquisition", "retention"
        ]
        
        for keyword in theme_keywords:
            count = all_text.lower().count(keyword.lower())
            if count > 2:  # If keyword appears more than twice
                themes.append(f"{keyword} (mentioned {count} times)")
        
        return themes

    def identify_boring_marketer_themes(self, website_content: Dict[str, Any]) -> List[str]:
        """Identify key themes from The Boring Marketer content"""
        themes = []
        
        # Extract themes from all page content
        all_text = ""
        for page in website_content.get("pages", []):
            all_text += f" {page.get('content', '')}"
        
        # Look for common themes
        theme_keywords = [
            "product development", "user research", "market validation", "vibe coding",
            "product-market fit", "startup", "business model", "user experience"
        ]
        
        for keyword in theme_keywords:
            count = all_text.lower().count(keyword.lower())
            if count > 1:  # If keyword appears more than once
                themes.append(f"{keyword} (mentioned {count} times)")
        
        return themes

    def generate_actionable_recommendations(self, insights: List[Dict[str, Any]]) -> List[str]:
        """Generate actionable recommendations from insights"""
        recommendations = []
        
        for insight in insights:
            insight_text = insight.get("insight", "")
            
            # Generate actionable recommendations based on insight type
            if "vibe coding" in insight_text.lower():
                recommendations.append("Implement vibe coding principles in our development process")
            elif "user research" in insight_text.lower():
                recommendations.append("Conduct comprehensive user research before building features")
            elif "community" in insight_text.lower():
                recommendations.append("Build community features into our platform")
            elif "product-market fit" in insight_text.lower():
                recommendations.append("Validate product-market fit before scaling")
            elif "monetization" in insight_text.lower():
                recommendations.append("Develop sustainable monetization strategies")
        
        return list(set(recommendations))  # Remove duplicates

    def generate_boring_marketer_recommendations(self, insights: List[Dict[str, Any]]) -> List[str]:
        """Generate recommendations from The Boring Marketer insights"""
        recommendations = []
        
        for insight in insights:
            insight_text = insight.get("insight", "")
            
            # Generate recommendations based on insight content
            if "product development" in insight_text.lower():
                recommendations.append("Apply product development best practices from The Boring Marketer")
            elif "user research" in insight_text.lower():
                recommendations.append("Implement user research methodologies")
            elif "market validation" in insight_text.lower():
                recommendations.append("Validate market assumptions before building")
            elif "vibe coding" in insight_text.lower():
                recommendations.append("Integrate vibe coding methodologies")
        
        return list(set(recommendations))  # Remove duplicates

    def save_research_results(self, results: Dict[str, Any]) -> None:
        """Save research results to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"vibe_coding_research_results_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"📁 Research results saved to: {filename}")

def main():
    """Main function to run the vibe coding research system"""
    print("🚀 Alex AI Vibe Coding Research System")
    print("=" * 50)
    
    # Initialize the research system
    research_system = VibeCodingResearchSystem()
    
    # Run comprehensive research
    results = research_system.run_comprehensive_research()
    
    # Print summary
    print("\n📊 Research Summary:")
    print(f"  📺 Greg Isenberg videos analyzed: {results['research_summary']['greg_isenberg_videos_analyzed']}")
    print(f"  🌐 Boring Marketer pages scraped: {results['research_summary']['boring_marketer_pages_scraped']}")
    print(f"  📝 Total insights extracted: {results['research_summary']['total_insights_extracted']}")
    print(f"  👥 Crew recommendations generated: {results['research_summary']['crew_recommendations_generated']}")
    
    return results

if __name__ == "__main__":
    main()
