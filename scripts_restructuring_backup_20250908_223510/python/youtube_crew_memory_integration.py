from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
YouTube Crew Memory Integration System
====================================

This system integrates YouTube scraping capabilities with our crew memory system
to generate and store memories from YouTube content analysis.
"""

import json
import logging
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s:%(name)s:%(message)s')

class YouTubeCrewMemoryIntegration:
    """Integrates YouTube scraping with crew memory system"""
    
        self.youtube_scripts = self._locate_youtube_scripts()
        self.crew_memories = []
        
    def _locate_youtube_scripts(self):
        """Locate available YouTube scraping scripts"""
        scripts = {
            "channel_intelligence": None,
            "scraper_crew_integration": None,
            "demo_scraper": None,
            "test_integration": None
        }
        
        # Check consolidated scripts directory
        consolidated_dir = self.project_root / "scripts" / "consolidated"
        if consolidated_dir.exists():
            scripts["channel_intelligence"] = consolidated_dir / "consolidated_youtube_channel_intelligence_system.py"
            scripts["scraper_crew_integration"] = consolidated_dir / "consolidated_youtube_scraper_crew_integration.py"
            scripts["demo_scraper"] = consolidated_dir / "consolidated_demo_youtube_scraper_system.py"
            scripts["test_integration"] = consolidated_dir / "consolidated_test_youtube_scraper_integration.py"
        
        return scripts
    
    def run_youtube_analysis(self, channel_url: str, analysis_type: str = "full") -> Dict[str, Any]:
        """Run YouTube analysis and generate crew memories"""
        logging.info(f"🔍 Starting YouTube analysis for: {channel_url}")
        
        if not self.youtube_scripts["channel_intelligence"]:
            logging.error("❌ YouTube channel intelligence script not found")
            return {"error": "YouTube scripts not available"}
        
        try:
            # Run the YouTube channel intelligence analysis
            cmd = [
                "python3", 
                str(self.youtube_scripts["channel_intelligence"]),
                "--channel-url", channel_url,
                "--analysis-type", analysis_type,
                "--generate-memories"
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode == 0:
                logging.info("✅ YouTube analysis completed successfully")
                return self._parse_analysis_output(result.stdout)
            else:
                logging.error(f"❌ YouTube analysis failed: {result.stderr}")
                return {"error": result.stderr}
                
        except subprocess.TimeoutExpired:
            logging.error("❌ YouTube analysis timed out")
            return {"error": "Analysis timed out"}
        except Exception as e:
            logging.error(f"❌ YouTube analysis error: {e}")
            return {"error": str(e)}
    
    def _parse_analysis_output(self, output: str) -> Dict[str, Any]:
        """Parse YouTube analysis output and extract crew memories"""
        try:
            # Try to parse JSON output
            if "{" in output and "}" in output:
                # Extract JSON from output
                start = output.find("{")
                end = output.rfind("}") + 1
                json_str = output[start:end]
                analysis_data = json.loads(json_str)
                
                # Extract crew memories
                crew_memories = self._extract_crew_memories(analysis_data)
                return {
                    "status": "success",
                    "analysis_data": analysis_data,
                    "crew_memories": crew_memories,
                    "total_memories": len(crew_memories)
                }
            else:
                # Parse text output for crew insights
                crew_memories = self._parse_text_insights(output)
                return {
                    "status": "success",
                    "crew_memories": crew_memories,
                    "total_memories": len(crew_memories)
                }
                
        except json.JSONDecodeError:
            logging.warning("⚠️ Could not parse JSON output, extracting text insights")
            crew_memories = self._parse_text_insights(output)
            return {
                "status": "success",
                "crew_memories": crew_memories,
                "total_memories": len(crew_memories)
            }
    
    def _extract_crew_memories(self, analysis_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract crew memories from analysis data"""
        memories = []
        
        # Extract insights for each crew member
        if "crew_insights" in analysis_data:
            for insight in analysis_data["crew_insights"]:
                memory = {
                    "timestamp": datetime.now().isoformat(),
                    "source": "youtube_analysis",
                    "crew_member": insight.get("crew_member", "Unknown"),
                    "content": insight.get("content", ""),
                    "relevance_score": insight.get("relevance_score", 0.0),
                    "insight_type": insight.get("insight_type", "general"),
                    "metadata": {
                        "channel_id": analysis_data.get("channel_id", ""),
                        "analysis_type": "youtube_channel",
                        "vector_embedding": insight.get("vector_embedding")
                    }
                }
                memories.append(memory)
        
        return memories
    
    def _parse_text_insights(self, output: str) -> List[Dict[str, Any]]:
        """Parse text output for crew insights"""
        memories = []
        lines = output.split('\n')
        
        current_crew = None
        current_insight = ""
        
        for line in lines:
            line = line.strip()
            
            # Look for crew member mentions
            if "Captain Picard" in line or "captain_picard" in line.lower():
                if current_crew and current_insight:
                    memories.append(self._create_memory(current_crew, current_insight))
                current_crew = "Captain Picard"
                current_insight = line
            elif "Commander Data" in line or "commander_data" in line.lower():
                if current_crew and current_insight:
                    memories.append(self._create_memory(current_crew, current_insight))
                current_crew = "Commander Data"
                current_insight = line
            elif "Lt. La Forge" in line or "lt_la_forge" in line.lower():
                if current_crew and current_insight:
                    memories.append(self._create_memory(current_crew, current_insight))
                current_crew = "Lt. La Forge"
                current_insight = line
            elif "Dr. Crusher" in line or "dr_crusher" in line.lower():
                if current_crew and current_insight:
                    memories.append(self._create_memory(current_crew, current_insight))
                current_crew = "Dr. Crusher"
                current_insight = line
            elif "Counselor Troi" in line or "counselor_troi" in line.lower():
                if current_crew and current_insight:
                    memories.append(self._create_memory(current_crew, current_insight))
                current_crew = "Counselor Troi"
                current_insight = line
            elif "Lt. Worf" in line or "lt_worf" in line.lower():
                if current_crew and current_insight:
                    memories.append(self._create_memory(current_crew, current_insight))
                current_crew = "Lt. Worf"
                current_insight = line
            elif "Ensign Wesley" in line or "ensign_wesley" in line.lower():
                if current_crew and current_insight:
                    memories.append(self._create_memory(current_crew, current_insight))
                current_crew = "Ensign Wesley"
                current_insight = line
            elif "Q" in line and len(line) < 50:  # Avoid false positives
                if current_crew and current_insight:
                    memories.append(self._create_memory(current_crew, current_insight))
                current_crew = "Q"
                current_insight = line
            elif "Guinan" in line or "guinan" in line.lower():
                if current_crew and current_insight:
                    memories.append(self._create_memory(current_crew, current_insight))
                current_crew = "Guinan"
                current_insight = line
            elif current_crew and line:
                current_insight += " " + line
        
        # Add the last memory
        if current_crew and current_insight:
            memories.append(self._create_memory(current_crew, current_insight))
        
        return memories
    
    def _create_memory(self, crew_member: str, content: str) -> Dict[str, Any]:
        """Create a memory entry for a crew member"""
        return {
            "timestamp": datetime.now().isoformat(),
            "source": "youtube_analysis",
            "crew_member": crew_member,
            "content": content.strip(),
            "relevance_score": 0.8,  # Default relevance score
            "insight_type": "youtube_insight",
            "metadata": {
                "analysis_type": "youtube_channel",
                "extraction_method": "text_parsing"
            }
        }
    
        logging.info(f"💾 Storing {len(memories)} crew memories")
        
        try:
            # Store in local memory system
            self.crew_memories.extend(memories)
            
            # Save to JSON file
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            memory_file = self.project_root / f"youtube_crew_memories_{timestamp}.json"
            
            with open(memory_file, 'w') as f:
                json.dump(memories, f, indent=2)
            
            logging.info(f"✅ Memories saved to: {memory_file}")
            
            # Also save to our MCP memory system
            self._store_in_mcp_system(memories)
            
            return True
            
        except Exception as e:
            logging.error(f"❌ Failed to store memories: {e}")
            return False
    
        try:
            # Use our MCP query system to store memories
            mcp_script = self.project_root / "packages" / "alex-ai-mcp" / "src" / "mcp-query.js"
            
            if mcp_script.exists():
                for memory in memories:
                    # Create a query to store the memory
                    query = f"Store memory: {memory['content']} from {memory['crew_member']}"
                    
                    result = subprocess.run(
                        ["node", str(mcp_script), query],
                        capture_output=True,
                        text=True,
                        timeout=30
                    )
                    
                    if result.returncode == 0:
                        logging.info(f"✅ Memory stored in MCP system: {memory['crew_member']}")
                    else:
                        logging.warning(f"⚠️ Failed to store memory in MCP: {result.stderr}")
                        
        except Exception as e:
            logging.warning(f"⚠️ MCP memory storage failed: {e}")
    
    def generate_memory_report(self, memories: List[Dict[str, Any]]) -> str:
        """Generate a report of crew memories from YouTube analysis"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_file = f"youtube_crew_memory_report_{timestamp}.md"
        
        with open(report_file, 'w') as f:
            f.write("# 🎥 YouTube Crew Memory Analysis Report\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**Total Memories**: {len(memories)}\n\n")
            
            # Group memories by crew member
            crew_memories = {}
            for memory in memories:
                crew = memory.get('crew_member', 'Unknown')
                if crew not in crew_memories:
                    crew_memories[crew] = []
                crew_memories[crew].append(memory)
            
            f.write("## 👥 Crew Memories by Member\n\n")
            
            for crew_member, member_memories in crew_memories.items():
                f.write(f"### {crew_member}\n")
                f.write(f"**Total Insights**: {len(member_memories)}\n\n")
                
                for i, memory in enumerate(member_memories, 1):
                    f.write(f"**Insight {i}**:\n")
                    f.write(f"- Content: {memory.get('content', 'N/A')}\n")
                    f.write(f"- Relevance Score: {memory.get('relevance_score', 0.0)}\n")
                    f.write(f"- Type: {memory.get('insight_type', 'N/A')}\n")
                    f.write(f"- Timestamp: {memory.get('timestamp', 'N/A')}\n\n")
            
            f.write("## 📊 Memory Statistics\n\n")
            f.write(f"- **Total Memories**: {len(memories)}\n")
            f.write(f"- **Unique Crew Members**: {len(crew_memories)}\n")
            f.write(f"- **Average Relevance Score**: {sum(m.get('relevance_score', 0) for m in memories) / len(memories):.2f}\n\n")
            
            f.write("---\n")
            f.write("*Report generated by YouTube Crew Memory Integration System*\n")
        
        logging.info(f"📄 Memory report saved to: {report_file}")
        return report_file
    
    def run_demo_analysis(self) -> Dict[str, Any]:
        """Run a demo YouTube analysis to test the system"""
        logging.info("🎬 Running demo YouTube analysis")
        
        # Use a popular tech channel for demo
        demo_channel = "https://www.youtube.com/@ThePrimeagen"
        
        # Run analysis
        result = self.run_youtube_analysis(demo_channel, "demo")
        
        if result.get("status") == "success":
            memories = result.get("crew_memories", [])
            
            # Store memories
            if memories:
                self.store_crew_memories(memories)
                
                # Generate report
                report_file = self.generate_memory_report(memories)
                result["report_file"] = report_file
            
            logging.info(f"✅ Demo analysis complete: {len(memories)} memories generated")
        else:
            logging.error(f"❌ Demo analysis failed: {result.get('error', 'Unknown error')}")
        
        return result

    print("🎥 YouTube Crew Memory Integration System")
    print("=" * 50)
    
    integration = YouTubeCrewMemoryIntegration()
    
    print("📋 Available YouTube Scripts:")
    for script_type, script_path in integration.youtube_scripts.items():
        status = "✅" if script_path and script_path.exists() else "❌"
        print(f"  {status} {script_type}: {script_path}")
    
    print("\n🎬 Running demo analysis...")
    result = integration.run_demo_analysis()
    
    if result.get("status") == "success":
        print(f"✅ Demo analysis successful!")
        print(f"📊 Generated {result.get('total_memories', 0)} crew memories")
        if "report_file" in result:
            print(f"📄 Report: {result['report_file']}")
    else:
        print(f"❌ Demo analysis failed: {result.get('error', 'Unknown error')}")
    
    print("\n💡 To analyze a specific channel, use:")
    print("python3 src/youtube_crew_memory_integration.py --channel-url <URL>")

if __name__ == "__main__":
    if len(sys.argv) > 1 and "--channel-url" in sys.argv:
        # Run analysis for specific channel
        channel_url = sys.argv[sys.argv.index("--channel-url") + 1]
        integration = YouTubeCrewMemoryIntegration()
        result = integration.run_youtube_analysis(channel_url)
        
        if result.get("status") == "success":
            memories = result.get("crew_memories", [])
            integration.store_crew_memories(memories)
            report_file = integration.generate_memory_report(memories)
            print(f"✅ Analysis complete: {len(memories)} memories generated")
            print(f"📄 Report: {report_file}")
        else:
            print(f"❌ Analysis failed: {result.get('error', 'Unknown error')}")
    else:
        main()

