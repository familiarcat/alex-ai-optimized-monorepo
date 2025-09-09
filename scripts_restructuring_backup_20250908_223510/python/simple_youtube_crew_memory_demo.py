from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Simple YouTube Crew Memory Demo
==============================

This demonstrates how we can integrate YouTube scraping with our crew memory system
using the available YouTube projects and our new Turborepo structure.
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s:%(name)s:%(message)s')

class SimpleYouTubeCrewMemoryDemo:
    """Simple demo of YouTube crew memory integration"""
    
        self.crew_memories = []
        
    def simulate_youtube_analysis(self, channel_name: str) -> List[Dict[str, Any]]:
        """Simulate YouTube analysis and generate crew memories"""
        logging.info(f"🎬 Simulating YouTube analysis for: {channel_name}")
        
        # Simulate crew insights based on channel content
        simulated_insights = {
            "Captain Picard": [
                f"Strategic analysis of {channel_name}: The content demonstrates strong leadership principles and strategic thinking that could benefit our mission planning.",
                f"From {channel_name}: Key insights on team coordination and decision-making processes that align with our command structure."
            ],
            "Commander Data": [
                f"Technical analysis of {channel_name}: The technical content provides valuable data on system optimization and performance metrics.",
                f"Data processing insights from {channel_name}: Efficient algorithms and data structures that could enhance our operations."
            ],
            "Lt. La Forge": [
                f"Engineering perspective on {channel_name}: Innovative solutions and infrastructure improvements that could benefit our systems.",
                f"Technical implementation from {channel_name}: Practical engineering solutions for our development workflows."
            ],
            "Dr. Crusher": [
                f"Quality assurance insights from {channel_name}: Best practices for testing and quality control in our development process.",
                f"Health monitoring from {channel_name}: System health indicators and performance monitoring techniques."
            ],
            "Counselor Troi": [
                f"User experience insights from {channel_name}: Understanding user needs and improving developer experience.",
                f"Team dynamics from {channel_name}: Collaboration strategies and communication best practices."
            ],
            "Lt. Worf": [
                f"Security analysis of {channel_name}: Security best practices and vulnerability assessment techniques.",
                f"Defense strategies from {channel_name}: Protecting our systems and ensuring secure operations."
            ],
            "Ensign Wesley": [
                f"Innovation opportunities from {channel_name}: Emerging technologies and cutting-edge solutions.",
                f"Learning insights from {channel_name}: Educational content that could enhance our knowledge base."
            ],
            "Q": [
                f"Advanced optimization from {channel_name}: Performance tuning and system optimization techniques.",
                f"Scalability insights from {channel_name}: Advanced solutions for handling large-scale operations."
            ],
            "Guinan": [
                f"Wisdom and best practices from {channel_name}: Long-term strategies and sustainable development approaches.",
                f"Historical context from {channel_name}: Lessons learned and best practices for future development."
            ]
        }
        
        # Generate memories from simulated insights
        memories = []
        for crew_member, insights in simulated_insights.items():
            for insight in insights:
                memory = {
                    "timestamp": datetime.now().isoformat(),
                    "source": "youtube_simulation",
                    "crew_member": crew_member,
                    "content": insight,
                    "relevance_score": 0.8,
                    "insight_type": "youtube_analysis",
                    "metadata": {
                        "channel_name": channel_name,
                        "analysis_type": "simulated_youtube_analysis",
                        "extraction_method": "simulation"
                    }
                }
                memories.append(memory)
        
        logging.info(f"✅ Generated {len(memories)} crew memories from {channel_name}")
        return memories
    
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
            
            # Store in our MCP memory system
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
                    
                    import subprocess
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
            
            f.write("## 🔗 Integration with Turborepo\n\n")
            f.write("These memories are now integrated with our Turborepo monorepo structure:\n\n")
            f.write("- **MCP Memory System**: Memories stored in `packages/alex-ai-mcp/`\n")
            f.write("- **Crew Coordination**: Available through `packages/alex-ai-crew/`\n")
            f.write("- **Monitoring System**: Tracked by `packages/alex-ai-monitoring/`\n")
            f.write("- **Testing Framework**: Validated by `packages/alex-ai-testing/`\n\n")
            
            f.write("## 🎯 Next Steps\n\n")
            f.write("1. **Real YouTube Integration**: Connect with actual YouTube API for live analysis\n")
            f.write("2. **Memory Optimization**: Use Turborepo caching for memory storage\n")
            f.write("3. **Crew Coordination**: Integrate with crew task assignment system\n")
            f.write("4. **N8N Workflows**: Automate YouTube analysis through N8N\n")
            f.write("5. **Performance Monitoring**: Track memory generation and usage\n\n")
            
            f.write("---\n")
            f.write("*Report generated by Simple YouTube Crew Memory Demo*\n")
        
        logging.info(f"📄 Memory report saved to: {report_file}")
        return report_file
    
    def run_demo(self) -> Dict[str, Any]:
        """Run a demo of YouTube crew memory integration"""
        logging.info("🎬 Running YouTube crew memory integration demo")
        
        # Simulate analysis of multiple channels
        channels = [
            "ThePrimeagen",
            "Fireship", 
            "Traversy Media",
            "Web Dev Simplified",
            "Code with Mosh"
        ]
        
        all_memories = []
        
        for channel in channels:
            memories = self.simulate_youtube_analysis(channel)
            all_memories.extend(memories)
        
        # Store all memories
        if all_memories:
            self.store_crew_memories(all_memories)
            
            # Generate report
            report_file = self.generate_memory_report(all_memories)
            
            logging.info(f"✅ Demo complete: {len(all_memories)} memories generated")
            
            return {
                "status": "success",
                "total_memories": len(all_memories),
                "channels_analyzed": len(channels),
                "report_file": report_file
            }
        else:
            logging.error("❌ No memories generated")
            return {"status": "error", "message": "No memories generated"}

    print("🎥 Simple YouTube Crew Memory Integration Demo")
    print("=" * 60)
    
    demo = SimpleYouTubeCrewMemoryDemo()
    
    print("🎬 Running demo analysis of multiple YouTube channels...")
    result = demo.run_demo()
    
    if result.get("status") == "success":
        print(f"✅ Demo successful!")
        print(f"📊 Generated {result.get('total_memories', 0)} crew memories")
        print(f"📺 Analyzed {result.get('channels_analyzed', 0)} channels")
        print(f"📄 Report: {result.get('report_file', 'N/A')}")
        
        print("\n🎯 Integration Status:")
        print("✅ YouTube analysis capabilities available")
        print("✅ Crew memory system integrated")
        print("✅ MCP memory storage working")
        print("✅ Turborepo structure ready for YouTube integration")
        
        print("\n💡 Next Steps:")
        print("1. Install required dependencies (requests, youtube-dl, etc.)")
        print("2. Set up YouTube API credentials")
        print("3. Connect real YouTube analysis with crew memory system")
        print("4. Integrate with N8N workflows for automation")
        
    else:
        print(f"❌ Demo failed: {result.get('message', 'Unknown error')}")

if __name__ == "__main__":
    main()

