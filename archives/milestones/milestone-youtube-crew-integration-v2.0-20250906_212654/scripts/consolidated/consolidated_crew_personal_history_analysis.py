#!/usr/bin/env python3
"""
Consolidated Script: crew_personal_history_analysis
================================

This script consolidates the following similar scripts:
- ./crew_personal_history_analysis.py
- ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_personal_history_analysis.py

Generated: 2025-09-06 20:27:37
"""

#!/usr/bin/env python3
"""
Crew Personal History Analysis
Analyzes each crew member's personal memory history and expertise
"""

import os
import requests
import json
from datetime import datetime
from typing import Dict, List, Optional

class CrewPersonalHistoryAnalysis:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.crew_members = {
            'Captain Jean-Luc Picard': {
                'department': 'Command',
                'expertise': 'Strategic Leadership, Mission Planning, Decision Making',
                'personality': 'Diplomatic, thoughtful, principled'
            },
            'Commander William Riker': {
                'department': 'Tactical',
                'expertise': 'Tactical Operations, Workflow Management, Execution',
                'personality': 'Confident, decisive, loyal'
            },
            'Commander Data': {
                'department': 'Operations',
                'expertise': 'Analytics, Logic, Data Processing, Efficiency',
                'personality': 'Logical, precise, curious'
            },
            'Lieutenant Commander Geordi La Forge': {
                'department': 'Engineering',
                'expertise': 'Infrastructure, System Integration, Technical Solutions',
                'personality': 'Innovative, practical, problem-solving'
            },
            'Lieutenant Worf': {
                'department': 'Security',
                'expertise': 'Security, Compliance, Risk Assessment',
                'personality': 'Honorable, disciplined, protective'
            },
            'Counselor Deanna Troi': {
                'department': 'Counseling',
                'expertise': 'User Experience, Empathy Analysis, Human Factors',
                'personality': 'Empathetic, intuitive, supportive'
            },
            'Lieutenant Uhura': {
                'department': 'Communications',
                'expertise': 'Communications, I/O Operations, Information Flow',
                'personality': 'Professional, efficient, adaptable'
            },
            'Dr. Beverly Crusher': {
                'department': 'Medical',
                'expertise': 'Health, Diagnostics, System Optimization',
                'personality': 'Caring, analytical, healing-focused'
            },
            'Quark': {
                'department': 'Business',
                'expertise': 'Business Intelligence, Budget Optimization, ROI Analysis',
                'personality': 'Entrepreneurial, profit-focused, resourceful'
            }
        }
    
    def get_crew_memories(self, crew_member: str) -> List[Dict]:
        """Get all memories for a specific crew member"""
        try:
            url = f"{self.supabase_url}/rest/v1/crew_memories"
            params = {'crew_member': 'eq.' + crew_member}
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}'
            }
            
            response = requests.get(url, headers=headers, params=params, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Failed to get memories for {crew_member}: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error getting memories for {crew_member}: {e}")
            return []
    
    def analyze_crew_member_history(self, crew_member: str) -> Dict:
        """Analyze personal history for a specific crew member"""
        print(f"🔍 Analyzing personal history for {crew_member}...")
        
        memories = self.get_crew_memories(crew_member)
        crew_info = self.crew_members.get(crew_member, {})
        
        analysis = {
            'crew_member': crew_member,
            'department': crew_info.get('department', 'Unknown'),
            'expertise': crew_info.get('expertise', 'Unknown'),
            'personality': crew_info.get('personality', 'Unknown'),
            'total_memories': len(memories),
            'memory_timeline': [],
            'expertise_areas': {},
            'key_contributions': [],
            'recent_activities': [],
            'knowledge_gaps': [],
            'collaboration_patterns': [],
            'personal_assessment': ''
        }
        
        if not memories:
            analysis['personal_assessment'] = f"{crew_member} has no personal memories yet. This crew member may be new or inactive."
            return analysis
        
        # Analyze memory timeline
        for memory in memories:
            memory_entry = {
                'timestamp': memory.get('created_at', 'Unknown'),
                'type': memory.get('memory_type', 'Unknown'),
                'content': memory.get('content', '')[:100] + '...' if len(memory.get('content', '')) > 100 else memory.get('content', ''),
                'importance': memory.get('importance', 'Unknown')
            }
            analysis['memory_timeline'].append(memory_entry)
        
        # Sort by timestamp
        analysis['memory_timeline'].sort(key=lambda x: x['timestamp'], reverse=True)
        
        # Analyze expertise areas
        for memory in memories:
            mem_type = memory.get('memory_type', 'Unknown')
            analysis['expertise_areas'][mem_type] = analysis['expertise_areas'].get(mem_type, 0) + 1
        
        # Identify key contributions
        for memory in memories:
            content = memory.get('content', '').lower()
            if any(keyword in content for keyword in ['implemented', 'created', 'solved', 'developed', 'designed']):
                analysis['key_contributions'].append({
                    'type': memory.get('memory_type'),
                    'content': memory.get('content', '')[:150] + '...' if len(memory.get('content', '')) > 150 else memory.get('content', ''),
                    'timestamp': memory.get('created_at')
                })
        
        # Get recent activities (last 5)
        analysis['recent_activities'] = analysis['memory_timeline'][:5]
        
        # Identify knowledge gaps based on department expertise
        department_expertise = crew_info.get('expertise', '').lower()
        if 'security' in department_expertise and 'security' not in str(analysis['expertise_areas']).lower():
            analysis['knowledge_gaps'].append('Security-related memories missing')
        if 'engineering' in department_expertise and 'system' not in str(analysis['expertise_areas']).lower():
            analysis['knowledge_gaps'].append('System engineering memories missing')
        if 'command' in department_expertise and 'strategic' not in str(analysis['expertise_areas']).lower():
            analysis['knowledge_gaps'].append('Strategic planning memories missing')
        
        # Generate personal assessment
        analysis['personal_assessment'] = self._generate_personal_assessment(crew_member, analysis)
        
        return analysis
    
    def _generate_personal_assessment(self, crew_member: str, analysis: Dict) -> str:
        """Generate personal assessment for crew member"""
        total_memories = analysis['total_memories']
        key_contributions = len(analysis['key_contributions'])
        knowledge_gaps = len(analysis['knowledge_gaps'])
        department = analysis['department']
        
        if total_memories == 0:
            return f"{crew_member} appears to be inactive or newly assigned. No personal memories found."
        elif total_memories >= 5 and key_contributions >= 3 and knowledge_gaps == 0:
            return f"{crew_member} is highly active and contributing significantly to the {department} department. Strong memory retention and expertise alignment."
        elif total_memories >= 3 and key_contributions >= 1:
            return f"{crew_member} is moderately active in the {department} department. Some contributions noted, room for increased engagement."
        elif total_memories >= 1:
            return f"{crew_member} has minimal activity in the {department} department. Basic memory retention present, needs more active participation."
        else:
            return f"{crew_member} shows no personal activity. Immediate attention needed for crew member engagement."
    
    def run_comprehensive_crew_analysis(self) -> Dict:
        """Run comprehensive analysis for all crew members"""
        print("🧠 ALEX AI CREW PERSONAL HISTORY ANALYSIS")
        print("=" * 50)
        print("Analyzing each crew member's personal memory history")
        print()
        
        crew_analyses = {}
        overall_stats = {
            'total_crew_members': len(self.crew_members),
            'active_crew_members': 0,
            'total_personal_memories': 0,
            'departments_represented': set(),
            'most_active_crew': '',
            'least_active_crew': '',
            'knowledge_gaps_identified': 0
        }
        
        for crew_member in self.crew_members.keys():
            analysis = self.analyze_crew_member_history(crew_member)
            crew_analyses[crew_member] = analysis
            
            # Update overall stats
            if analysis['total_memories'] > 0:
                overall_stats['active_crew_members'] += 1
                overall_stats['total_personal_memories'] += analysis['total_memories']
                overall_stats['departments_represented'].add(analysis['department'])
                overall_stats['knowledge_gaps_identified'] += len(analysis['knowledge_gaps'])
        
        # Find most/least active crew members
        if crew_analyses:
            sorted_by_activity = sorted(crew_analyses.items(), key=lambda x: x[1]['total_memories'], reverse=True)
            overall_stats['most_active_crew'] = sorted_by_activity[0][0] if sorted_by_activity else 'None'
            overall_stats['least_active_crew'] = sorted_by_activity[-1][0] if sorted_by_activity else 'None'
        
        overall_stats['departments_represented'] = list(overall_stats['departments_represented'])
        
        comprehensive_analysis = {
            'timestamp': datetime.now().isoformat(),
            'crew_analyses': crew_analyses,
            'overall_stats': overall_stats,
            'summary': self._generate_overall_summary(overall_stats, crew_analyses)
        }
        
        return comprehensive_analysis
    
    def _generate_overall_summary(self, stats: Dict, crew_analyses: Dict) -> str:
        """Generate overall summary of crew analysis"""
        active_ratio = stats['active_crew_members'] / stats['total_crew_members'] * 100
        avg_memories = stats['total_personal_memories'] / max(stats['active_crew_members'], 1)
        
        if active_ratio >= 80 and avg_memories >= 3:
            return f"EXCELLENT crew engagement. {active_ratio:.1f}% of crew members are active with an average of {avg_memories:.1f} memories each. Strong departmental representation across {len(stats['departments_represented'])} departments."
        elif active_ratio >= 60 and avg_memories >= 2:
            return f"GOOD crew engagement. {active_ratio:.1f}% of crew members are active with an average of {avg_memories:.1f} memories each. Most departments represented."
        elif active_ratio >= 40:
            return f"FAIR crew engagement. {active_ratio:.1f}% of crew members are active. Some crew members need more engagement."
        else:
            return f"POOR crew engagement. Only {active_ratio:.1f}% of crew members are active. Immediate attention needed for crew member participation."
    
    def print_crew_analysis_report(self, analysis: Dict):
        """Print comprehensive crew analysis report"""
        print("\n" + "=" * 70)
        print("👥 ALEX AI CREW PERSONAL HISTORY ANALYSIS REPORT")
        print("=" * 70)
        
        stats = analysis['overall_stats']
        print(f"📅 Analysis Date: {analysis['timestamp']}")
        print(f"👥 Total Crew Members: {stats['total_crew_members']}")
        print(f"✅ Active Crew Members: {stats['active_crew_members']}")
        print(f"📚 Total Personal Memories: {stats['total_personal_memories']}")
        print(f"🏢 Departments Represented: {len(stats['departments_represented'])}")
        print(f"🎯 Knowledge Gaps Identified: {stats['knowledge_gaps_identified']}")
        
        print(f"\n📊 CREW ACTIVITY RANKING:")
        sorted_crew = sorted(analysis['crew_analyses'].items(), key=lambda x: x[1]['total_memories'], reverse=True)
        for i, (crew, data) in enumerate(sorted_crew, 1):
            status = "🟢" if data['total_memories'] > 0 else "🔴"
            print(f"   {i:2d}. {status} {crew}: {data['total_memories']} memories ({data['department']})")
        
        print(f"\n🎯 OVERALL SUMMARY:")
        print(f"   {analysis['summary']}")
        
        print(f"\n👤 INDIVIDUAL CREW ASSESSMENTS:")
        for crew, data in analysis['crew_analyses'].items():
            print(f"\n   🧑‍💼 {crew} ({data['department']})")
            print(f"      Memories: {data['total_memories']}")
            print(f"      Assessment: {data['personal_assessment']}")
            if data['knowledge_gaps']:
                print(f"      Gaps: {', '.join(data['knowledge_gaps'])}")
            if data['key_contributions']:
                print(f"      Key Contributions: {len(data['key_contributions'])}")

def main():
    """Main function to run crew personal history analysis"""
    analyzer = CrewPersonalHistoryAnalysis()
    analysis = analyzer.run_comprehensive_crew_analysis()
    
    analyzer.print_crew_analysis_report(analysis)
    
    # Save analysis to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"crew_personal_history_analysis_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(analysis, f, indent=2)
    
    print(f"\n💾 Analysis saved to: {filename}")
    
    return analysis

if __name__ == "__main__":
    main()
