from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
MCP Library Computer System
Star Trek-inspired knowledge distribution system using MCP n8n workflows
Acts as the ship's library computer to update crew member specializations
"""

import os
import requests
import json
from datetime import datetime
from typing import Dict, List, Optional

class MCPLibraryComputerSystem:
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        self.crew_specializations = {
            'Captain Jean-Luc Picard': {
                'department': 'Command',
                'current_knowledge': ['Strategic Leadership', 'Mission Planning', 'Decision Making'],
                'knowledge_gaps': ['Advanced AI Ethics', 'Inter-species Diplomacy', 'Crisis Management'],
                'mcp_queries': [
                    'AI ethics in autonomous systems',
                    'Diplomatic protocols for first contact',
                    'Crisis leadership methodologies',
                    'Strategic planning frameworks'
                ]
            },
            'Commander William Riker': {
                'department': 'Tactical',
                'current_knowledge': ['Tactical Operations', 'Workflow Management', 'Execution'],
                'knowledge_gaps': ['Advanced Combat Strategies', 'Resource Optimization', 'Team Leadership'],
                'mcp_queries': [
                    'Advanced tactical planning methodologies',
                    'Resource allocation optimization',
                    'Team leadership best practices',
                    'Operational efficiency frameworks'
                ]
            },
            'Commander Data': {
                'department': 'Operations',
                'current_knowledge': ['Analytics', 'Logic', 'Data Processing', 'Efficiency'],
                'knowledge_gaps': ['Advanced Machine Learning', 'Quantum Computing', 'Predictive Analytics'],
                'mcp_queries': [
                    'Machine learning algorithms and applications',
                    'Quantum computing principles',
                    'Predictive analytics methodologies',
                    'Data science best practices'
                ]
            },
            'Lieutenant Commander Geordi La Forge': {
                'department': 'Engineering',
                'current_knowledge': ['Infrastructure', 'System Integration', 'Technical Solutions'],
                'knowledge_gaps': ['Advanced AI Architecture', 'Cloud Computing', 'DevOps Practices'],
                'mcp_queries': [
                    'AI system architecture patterns',
                    'Cloud computing infrastructure',
                    'DevOps methodologies and tools',
                    'System integration best practices'
                ]
            },
            'Lieutenant Worf': {
                'department': 'Security',
                'current_knowledge': ['Security', 'Compliance', 'Risk Assessment'],
                'knowledge_gaps': ['Cybersecurity Frameworks', 'Threat Intelligence', 'Incident Response'],
                'mcp_queries': [
                    'Cybersecurity frameworks and standards',
                    'Threat intelligence methodologies',
                    'Incident response procedures',
                    'Security compliance requirements'
                ]
            },
            'Counselor Deanna Troi': {
                'department': 'Counseling',
                'current_knowledge': ['User Experience', 'Empathy Analysis', 'Human Factors'],
                'knowledge_gaps': ['Advanced UX Research', 'Accessibility Design', 'User Psychology'],
                'mcp_queries': [
                    'User experience research methodologies',
                    'Accessibility design principles',
                    'Human psychology in technology',
                    'Empathy-driven design practices'
                ]
            },
            'Lieutenant Uhura': {
                'department': 'Communications',
                'current_knowledge': ['Communications', 'I/O Operations', 'Information Flow'],
                'knowledge_gaps': ['Advanced Communication Protocols', 'Data Visualization', 'API Design'],
                'mcp_queries': [
                    'Communication protocol standards',
                    'Data visualization techniques',
                    'API design best practices',
                    'Information architecture principles'
                ]
            },
            'Dr. Beverly Crusher': {
                'department': 'Medical',
                'current_knowledge': ['Health', 'Diagnostics', 'System Optimization'],
                'knowledge_gaps': ['System Health Monitoring', 'Performance Optimization', 'Diagnostic Tools'],
                'mcp_queries': [
                    'System health monitoring techniques',
                    'Performance optimization strategies',
                    'Diagnostic tool development',
                    'Medical technology applications'
                ]
            },
            'Quark': {
                'department': 'Business',
                'current_knowledge': ['Business Intelligence', 'Budget Optimization', 'ROI Analysis'],
                'knowledge_gaps': ['Advanced Analytics', 'Market Research', 'Financial Modeling'],
                'mcp_queries': [
                    'Business intelligence methodologies',
                    'Market research techniques',
                    'Financial modeling approaches',
                    'ROI optimization strategies'
                ]
            }
        }
    
    def query_mcp_library(self, crew_member: str, query: str) -> Dict:
        """Query MCP n8n workflow for knowledge documentation"""
        print(f"📚 Querying MCP Library Computer for {crew_member}: {query}")
        
        try:
            # Prepare MCP query payload
            mcp_payload = {
                'crew_member': crew_member,
                'query': query,
                'context': 'knowledge_gap_filling',
                'priority': 'high',
                'source': 'mcp_library_computer'
            }
            
            # Send to MCP n8n workflow
            url = f"{self.n8n_base_url}/api/v1/workflows/mcp-knowledge-query/execute"
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, headers=headers, json=mcp_payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ MCP query successful for {crew_member}")
                return {
                    'success': True,
                    'crew_member': crew_member,
                    'query': query,
                    'documentation': result.get('documentation', ''),
                    'sources': result.get('sources', []),
                    'confidence': result.get('confidence', 0.8)
                }
            else:
                print(f"❌ MCP query failed for {crew_member}: {response.status_code}")
                return {
                    'success': False,
                    'crew_member': crew_member,
                    'query': query,
                    'error': f"HTTP {response.status_code}"
                }
                
        except Exception as e:
            print(f"❌ MCP query error for {crew_member}: {e}")
            return {
                'success': False,
                'crew_member': crew_member,
                'query': query,
                'error': str(e)
            }
    
    def create_crew_knowledge_memory(self, crew_member: str, knowledge_data: Dict) -> bool:
        """Create memory entry for crew member's new knowledge"""
        print(f"📝 Creating knowledge memory for {crew_member}...")
        
        try:
            memory_data = {
                'crew_member': crew_member,
                'mission_id': f'mcp-knowledge-update-{int(datetime.now().timestamp())}',
                'memory_type': 'knowledge_acquisition',
                'content': f"MCP Library Computer Knowledge Update: {knowledge_data['query']} - {knowledge_data.get('documentation', 'Knowledge acquired from MCP system')}",
                'importance': 'high',
                'sources': knowledge_data.get('sources', []),
                'confidence': knowledge_data.get('confidence', 0.8)
            }
            
            url = f"{self.supabase_url}/rest/v1/crew_memories"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, headers=headers, json=memory_data)
            
            if response.status_code == 201:
                print(f"✅ Knowledge memory created for {crew_member}")
                return True
            else:
                print(f"❌ Failed to create knowledge memory for {crew_member}: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating knowledge memory for {crew_member}: {e}")
            return False
    
    def update_crew_specialization(self, crew_member: str, new_knowledge: List[str]) -> bool:
        """Update crew member's specialization knowledge"""
        print(f"🔄 Updating specialization for {crew_member}...")
        
        try:
            # Create specialization update memory
            memory_data = {
                'crew_member': crew_member,
                'mission_id': f'specialization-update-{int(datetime.now().timestamp())}',
                'memory_type': 'specialization_update',
                'content': f"Specialization Updated: Added new knowledge areas - {', '.join(new_knowledge)}. Crew member expertise expanded through MCP Library Computer system.",
                'importance': 'high'
            }
            
            url = f"{self.supabase_url}/rest/v1/crew_memories"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, headers=headers, json=memory_data)
            
            if response.status_code == 201:
                print(f"✅ Specialization updated for {crew_member}")
                return True
            else:
                print(f"❌ Failed to update specialization for {crew_member}: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error updating specialization for {crew_member}: {e}")
            return False
    
    def run_knowledge_distribution_cycle(self) -> Dict:
        """Run complete knowledge distribution cycle for all crew members"""
        print("🚀 MCP LIBRARY COMPUTER - KNOWLEDGE DISTRIBUTION CYCLE")
        print("=" * 70)
        print("Updating all crew member specializations using MCP workflows")
        print()
        
        distribution_results = {
            'timestamp': datetime.now().isoformat(),
            'crew_updates': {},
            'total_queries': 0,
            'successful_queries': 0,
            'knowledge_memories_created': 0,
            'specializations_updated': 0
        }
        
        for crew_member, crew_data in self.crew_specializations.items():
            print(f"\n👤 Processing {crew_member} ({crew_data['department']})")
            print("-" * 50)
            
            crew_results = {
                'queries_processed': 0,
                'successful_queries': 0,
                'knowledge_acquired': [],
                'memories_created': 0,
                'specialization_updated': False
            }
            
            # Process each MCP query for this crew member
            for query in crew_data['mcp_queries']:
                crew_results['queries_processed'] += 1
                distribution_results['total_queries'] += 1
                
                # Query MCP Library Computer
                mcp_result = self.query_mcp_library(crew_member, query)
                
                if mcp_result['success']:
                    crew_results['successful_queries'] += 1
                    distribution_results['successful_queries'] += 1
                    
                    # Create knowledge memory
                    if self.create_crew_knowledge_memory(crew_member, mcp_result):
                        crew_results['memories_created'] += 1
                        distribution_results['knowledge_memories_created'] += 1
                    
                    # Track acquired knowledge
                    crew_results['knowledge_acquired'].append({
                        'query': query,
                        'documentation': mcp_result.get('documentation', '')[:100] + '...',
                        'confidence': mcp_result.get('confidence', 0.8)
                    })
            
            # Update specialization if knowledge was acquired
            if crew_results['knowledge_acquired']:
                new_knowledge = [item['query'] for item in crew_results['knowledge_acquired']]
                if self.update_crew_specialization(crew_member, new_knowledge):
                    crew_results['specialization_updated'] = True
                    distribution_results['specializations_updated'] += 1
            
            distribution_results['crew_updates'][crew_member] = crew_results
            
            print(f"   📊 Queries: {crew_results['queries_processed']}")
            print(f"   ✅ Successful: {crew_results['successful_queries']}")
            print(f"   📝 Memories: {crew_results['memories_created']}")
            print(f"   🔄 Specialization: {'Updated' if crew_results['specialization_updated'] else 'No update'}")
        
        return distribution_results
    
    def print_distribution_report(self, results: Dict):
        """Print knowledge distribution report"""
        print("\n" + "=" * 80)
        print("📚 MCP LIBRARY COMPUTER - KNOWLEDGE DISTRIBUTION REPORT")
        print("=" * 80)
        
        print(f"📅 Distribution Date: {results['timestamp']}")
        print(f"📊 Total Queries: {results['total_queries']}")
        print(f"✅ Successful Queries: {results['successful_queries']}")
        print(f"📝 Knowledge Memories Created: {results['knowledge_memories_created']}")
        print(f"🔄 Specializations Updated: {results['specializations_updated']}")
        
        success_rate = (results['successful_queries'] / results['total_queries'] * 100) if results['total_queries'] > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        print(f"\n👥 CREW MEMBER UPDATES:")
        print("-" * 40)
        
        for crew, data in results['crew_updates'].items():
            status = "✅" if data['specialization_updated'] else "⚠️"
            print(f"   {status} {crew}")
            print(f"      Queries: {data['queries_processed']} | Success: {data['successful_queries']} | Memories: {data['memories_created']}")
            
            if data['knowledge_acquired']:
                print(f"      Knowledge Acquired:")
                for knowledge in data['knowledge_acquired'][:3]:  # Show first 3
                    print(f"         • {knowledge['query']} (Confidence: {knowledge['confidence']:.2f})")
            print()
        
        print(f"🎯 RECOMMENDATIONS:")
        if success_rate >= 80:
            print("   ✅ Excellent knowledge distribution success rate")
            print("   💡 Continue regular MCP Library Computer updates")
        elif success_rate >= 60:
            print("   ⚠️  Good success rate, some queries may need refinement")
            print("   💡 Review failed queries and improve MCP workflow")
        else:
            print("   ❌ Low success rate, MCP workflow needs attention")
            print("   💡 Debug MCP n8n workflows and query formats")

    library = MCPLibraryComputerSystem()
    results = library.run_knowledge_distribution_cycle()
    
    library.print_distribution_report(results)
    
    # Save distribution results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"mcp_library_computer_distribution_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Distribution results saved to: {filename}")
    
    return results

if __name__ == "__main__":
    main()
