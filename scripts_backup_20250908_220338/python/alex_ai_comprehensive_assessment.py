#!/usr/bin/env python3
"""
Alex AI Comprehensive Assessment
Combines memory sharing and crew personal history analysis
"""

import json
import os
from datetime import datetime
from typing import Dict, List
from alex_ai_memory_sharing_assessment import AlexAIMemorySharingAssessment
from crew_personal_history_analysis import CrewPersonalHistoryAnalysis

class AlexAIComprehensiveAssessment:
    def __init__(self):
        self.memory_assessor = AlexAIMemorySharingAssessment()
        self.crew_analyzer = CrewPersonalHistoryAnalysis()
    
    def run_comprehensive_assessment(self) -> Dict:
        """Run comprehensive assessment combining all analyses"""
        print("🧠 ALEX AI COMPREHENSIVE ASSESSMENT")
        print("=" * 60)
        print("Testing Supabase memory sharing and crew personal histories")
        print()
        
        # Run memory sharing assessment
        print("📊 Phase 1: Memory Sharing Assessment")
        print("-" * 40)
        memory_assessment = self.memory_assessor.run_comprehensive_assessment()
        
        # Run crew personal history analysis
        print("\n👥 Phase 2: Crew Personal History Analysis")
        print("-" * 40)
        crew_analysis = self.crew_analyzer.run_comprehensive_crew_analysis()
        
        # Combine assessments
        comprehensive = {
            'timestamp': datetime.now().isoformat(),
            'memory_sharing': memory_assessment,
            'crew_analysis': crew_analysis,
            'overall_health': self._assess_overall_health(memory_assessment, crew_analysis),
            'recommendations': self._generate_recommendations(memory_assessment, crew_analysis),
            'next_steps': self._generate_next_steps(memory_assessment, crew_analysis)
        }
        
        return comprehensive
    
    def _assess_overall_health(self, memory_assessment: Dict, crew_analysis: Dict) -> Dict:
        """Assess overall system health"""
        memory_score = memory_assessment.get('consistency_score', 0)
        crew_activity = crew_analysis['overall_stats']['active_crew_members'] / crew_analysis['overall_stats']['total_crew_members'] * 100
        total_memories = memory_assessment.get('total_memories', 0)
        
        # Calculate health score
        health_score = (memory_score + crew_activity + min(total_memories * 2, 100)) / 3
        
        if health_score >= 85:
            status = "EXCELLENT"
            description = "Alex AI system is operating at peak efficiency with optimal memory sharing and crew engagement"
        elif health_score >= 70:
            status = "GOOD"
            description = "Alex AI system is functioning well with good memory sharing and crew participation"
        elif health_score >= 50:
            status = "FAIR"
            description = "Alex AI system is operational but has room for improvement in memory sharing and crew engagement"
        else:
            status = "NEEDS ATTENTION"
            description = "Alex AI system requires immediate attention to improve memory sharing and crew participation"
        
        return {
            'overall_score': health_score,
            'status': status,
            'description': description,
            'memory_sharing_score': memory_score,
            'crew_engagement_score': crew_activity,
            'memory_volume_score': min(total_memories * 2, 100)
        }
    
    def _generate_recommendations(self, memory_assessment: Dict, crew_analysis: Dict) -> List[Dict]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Memory sharing recommendations
        if memory_assessment.get('consistency_score', 0) < 80:
            recommendations.append({
                'priority': 'HIGH',
                'category': 'Memory Sharing',
                'issue': 'Low memory consistency score',
                'recommendation': 'Implement memory validation and conflict resolution system',
                'impact': 'Improve crew coordination and decision making'
            })
        
        # Crew engagement recommendations
        crew_stats = crew_analysis['overall_stats']
        if crew_stats['active_crew_members'] < crew_stats['total_crew_members']:
            recommendations.append({
                'priority': 'MEDIUM',
                'category': 'Crew Engagement',
                'issue': 'Some crew members inactive',
                'recommendation': 'Increase crew member participation through targeted missions',
                'impact': 'Better utilization of all crew expertise'
            })
        
        # Knowledge gap recommendations
        if crew_stats['knowledge_gaps_identified'] > 0:
            recommendations.append({
                'priority': 'MEDIUM',
                'category': 'Knowledge Management',
                'issue': 'Knowledge gaps identified',
                'recommendation': 'Address specific knowledge gaps through targeted training',
                'impact': 'Improve crew member expertise alignment'
            })
        
        # Memory volume recommendations
        if memory_assessment.get('total_memories', 0) < 20:
            recommendations.append({
                'priority': 'LOW',
                'category': 'Memory Volume',
                'issue': 'Low memory volume',
                'recommendation': 'Increase memory creation through more active operations',
                'impact': 'Better historical context and learning'
            })
        
        return recommendations
    
    def _generate_next_steps(self, memory_assessment: Dict, crew_analysis: Dict) -> List[Dict]:
        """Generate specific next steps"""
        next_steps = []
        
        # Immediate actions
        next_steps.append({
            'timeline': 'Immediate',
            'action': 'Monitor memory sharing consistency',
            'owner': 'System-Wide',
            'priority': 'HIGH'
        })
        
        # Short-term actions
        next_steps.append({
            'timeline': '1-2 weeks',
            'action': 'Increase crew member engagement',
            'owner': 'Captain Picard',
            'priority': 'MEDIUM'
        })
        
        # Medium-term actions
        next_steps.append({
            'timeline': '1 month',
            'action': 'Implement advanced memory management features',
            'owner': 'Commander Data',
            'priority': 'MEDIUM'
        })
        
        # Long-term actions
        next_steps.append({
            'timeline': '3 months',
            'action': 'Develop crew member specialization programs',
            'owner': 'Lieutenant Commander Geordi La Forge',
            'priority': 'LOW'
        })
        
        return next_steps
    
    def print_comprehensive_report(self, assessment: Dict):
        """Print comprehensive assessment report"""
        print("\n" + "=" * 80)
        print("🎯 ALEX AI COMPREHENSIVE ASSESSMENT REPORT")
        print("=" * 80)
        
        health = assessment['overall_health']
        print(f"📅 Assessment Date: {assessment['timestamp']}")
        print(f"🏆 Overall Health Score: {health['overall_score']:.1f}/100")
        print(f"📊 Status: {health['status']}")
        print(f"📝 Description: {health['description']}")
        
        print(f"\n📈 DETAILED SCORES:")
        print(f"   Memory Sharing: {health['memory_sharing_score']:.1f}/100")
        print(f"   Crew Engagement: {health['crew_engagement_score']:.1f}/100")
        print(f"   Memory Volume: {health['memory_volume_score']:.1f}/100")
        
        print(f"\n🔧 RECOMMENDATIONS:")
        for i, rec in enumerate(assessment['recommendations'], 1):
            priority_icon = "🔴" if rec['priority'] == 'HIGH' else "🟡" if rec['priority'] == 'MEDIUM' else "🟢"
            print(f"   {i}. {priority_icon} [{rec['priority']}] {rec['category']}")
            print(f"      Issue: {rec['issue']}")
            print(f"      Recommendation: {rec['recommendation']}")
            print(f"      Impact: {rec['impact']}")
            print()
        
        print(f"📋 NEXT STEPS:")
        for i, step in enumerate(assessment['next_steps'], 1):
            timeline_icon = "⚡" if step['timeline'] == 'Immediate' else "📅" if 'week' in step['timeline'] else "🗓️"
            print(f"   {i}. {timeline_icon} {step['timeline']}: {step['action']}")
            print(f"      Owner: {step['owner']} | Priority: {step['priority']}")
            print()
        
        # Memory sharing summary
        memory = assessment['memory_sharing']
        print(f"🧠 MEMORY SHARING SUMMARY:")
        print(f"   Total Memories: {memory['total_memories']}")
        print(f"   Active Crew Members: {len(memory['crew_member_distribution'])}")
        print(f"   Consistency Score: {memory['consistency_score']:.1f}%")
        print(f"   Test Memory: {'✅ PASS' if memory['test_memory_created'] and memory['test_memory_verified'] else '❌ FAIL'}")
        
        # Crew analysis summary
        crew = assessment['crew_analysis']
        print(f"\n👥 CREW ANALYSIS SUMMARY:")
        print(f"   Total Crew Members: {crew['overall_stats']['total_crew_members']}")
        print(f"   Active Crew Members: {crew['overall_stats']['active_crew_members']}")
        print(f"   Personal Memories: {crew['overall_stats']['total_personal_memories']}")
        print(f"   Knowledge Gaps: {crew['overall_stats']['knowledge_gaps_identified']}")

def main():
    """Main function to run comprehensive assessment"""
    assessor = AlexAIComprehensiveAssessment()
    assessment = assessor.run_comprehensive_assessment()
    
    assessor.print_comprehensive_report(assessment)
    
    # Save comprehensive assessment
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"alex_ai_comprehensive_assessment_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(assessment, f, indent=2)
    
    print(f"\n💾 Comprehensive assessment saved to: {filename}")
    
    return assessment

if __name__ == "__main__":
    main()
