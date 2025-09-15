#!/usr/bin/env python3
"""
Alex AI Crew Self-Referential RAG System - Simplified Demo
==========================================================
Demonstrates the concept of capturing crew learning and creating
a self-referential knowledge base that improves over time.
"""

import os
import json
import hashlib
from datetime import datetime
from typing import Dict, List, Any
from pathlib import Path

class SimplifiedCrewRAGSystem:
    """Simplified demonstration of crew self-referential RAG system"""
    
    def __init__(self):
        self.knowledge_base = []
        self.crew_decisions = []
        self.learning_patterns = []
    
    def process_conference_file(self, file_path: str) -> Dict[str, Any]:
        """Process a crew conference file and extract knowledge"""
        try:
            with open(file_path, 'r') as f:
                conference_data = json.load(f)
            
            # Extract key information
            decision = self._extract_decision(conference_data)
            
            # Find relevant historical context
            relevant_history = self._find_relevant_history(decision)
            
            # Analyze solution evolution
            evolution_analysis = self._analyze_evolution(decision, relevant_history)
            
            # Store in knowledge base
            self._store_decision(decision)
            
            # Update learning patterns
            self._update_learning_patterns(decision, evolution_analysis)
            
            return {
                'decision_id': decision['id'],
                'problem': decision['problem_statement'],
                'solution': decision['final_decision'],
                'historical_context': len(relevant_history),
                'evolution_analysis': evolution_analysis,
                'lessons_learned': decision['lessons_learned'],
                'knowledge_connections': len(relevant_history)
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def _extract_decision(self, conference_data: Dict) -> Dict[str, Any]:
        """Extract structured decision from conference data"""
        # Generate unique ID
        decision_id = hashlib.md5(
            f"{conference_data.get('conference', '')}{datetime.now().isoformat()}".encode()
        ).hexdigest()[:12]
        
        # Extract problem statement
        problem_statement = conference_data.get('agenda', 'Unknown problem')
        
        # Extract crew deliberations
        crew_deliberations = {}
        for crew_member, deliberation in conference_data.get('deliberations', {}).items():
            crew_deliberations[crew_member] = {
                'role': deliberation.get('role', 'Unknown'),
                'contribution': deliberation.get('contribution', ''),
                'key_insights': self._extract_key_insights(deliberation.get('contribution', ''))
            }
        
        # Extract final decision
        conclusion = conference_data.get('conclusion', '')
        final_decision = conclusion if conclusion else "Consensus reached through crew deliberation"
        
        # Extract lessons learned
        lessons_learned = self._extract_lessons_learned(crew_deliberations)
        
        return {
            'id': decision_id,
            'timestamp': datetime.now().isoformat(),
            'problem_statement': problem_statement,
            'crew_deliberations': crew_deliberations,
            'final_decision': final_decision,
            'lessons_learned': lessons_learned,
            'conference_type': conference_data.get('conference', ''),
            'participants': list(crew_deliberations.keys())
        }
    
    def _extract_key_insights(self, contribution: str) -> List[str]:
        """Extract key insights from crew member contribution"""
        insights = []
        
        # Simple keyword-based insight extraction
        insight_keywords = ['learned', 'insight', 'realized', 'discovered', 'found', 'concluded']
        
        sentences = contribution.split('.')
        for sentence in sentences:
            sentence = sentence.strip().lower()
            if any(keyword in sentence for keyword in insight_keywords):
                insights.append(sentence.capitalize())
        
        return insights[:3]  # Limit to top 3 insights
    
    def _extract_lessons_learned(self, crew_deliberations: Dict) -> List[str]:
        """Extract lessons learned from all crew deliberations"""
        all_lessons = []
        
        for member, deliberation in crew_deliberations.items():
            contribution = deliberation.get('contribution', '')
            
            # Extract lessons from contribution
            if 'lesson' in contribution.lower():
                all_lessons.append(f"{member}: {contribution}")
            
            # Add key insights as lessons
            all_lessons.extend(deliberation.get('key_insights', []))
        
        return list(set(all_lessons))  # Remove duplicates
    
    def _find_relevant_history(self, current_decision: Dict) -> List[Dict]:
        """Find relevant historical decisions using simple similarity"""
        relevant_decisions = []
        
        current_problem = current_decision['problem_statement'].lower()
        current_solution = current_decision['final_decision'].lower()
        
        for historical_decision in self.crew_decisions:
            similarity_score = self._calculate_similarity(
                current_problem, 
                historical_decision['problem_statement'].lower()
            )
            
            if similarity_score > 0.3:  # Simple threshold
                relevant_decisions.append({
                    'decision_id': historical_decision['id'],
                    'similarity_score': similarity_score,
                    'problem': historical_decision['problem_statement'],
                    'solution': historical_decision['final_decision'],
                    'lessons': historical_decision['lessons_learned']
                })
        
        # Sort by similarity and return top 3
        relevant_decisions.sort(key=lambda x: x['similarity_score'], reverse=True)
        return relevant_decisions[:3]
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Simple text similarity calculation"""
        words1 = set(text1.split())
        words2 = set(text2.split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union)
    
    def _analyze_evolution(self, current_decision: Dict, relevant_history: List[Dict]) -> Dict[str, Any]:
        """Analyze how current solution evolves from historical approaches"""
        if not relevant_history:
            return {
                'evolution_type': 'novel_approach',
                'analysis': 'No relevant historical context - this is a new approach',
                'innovations': [current_decision['final_decision']],
                'consistent_patterns': []
            }
        
        # Find patterns and innovations
        consistent_patterns = []
        innovations = []
        
        for historical in relevant_history:
            if historical['similarity_score'] > 0.6:
                consistent_patterns.append({
                    'pattern': historical['solution'],
                    'similarity': historical['similarity_score'],
                    'context': historical['problem']
                })
            else:
                innovations.append({
                    'current_innovation': current_decision['final_decision'],
                    'departure_from': historical['solution'],
                    'context': historical['problem']
                })
        
        return {
            'evolution_type': 'evolutionary_improvement' if consistent_patterns else 'innovative_departure',
            'analysis': f"Building on {len(consistent_patterns)} patterns, introducing {len(innovations)} innovations",
            'consistent_patterns': consistent_patterns,
            'innovations': innovations,
            'learning_progression': len(relevant_history)
        }
    
    def _store_decision(self, decision: Dict):
        """Store decision in knowledge base"""
        self.crew_decisions.append(decision)
        
        # Extract knowledge points
        knowledge_points = {
            'decision_id': decision['id'],
            'domain': self._identify_domain(decision['problem_statement']),
            'solution_type': self._identify_solution_type(decision['final_decision']),
            'lessons': decision['lessons_learned'],
            'timestamp': decision['timestamp']
        }
        
        self.knowledge_base.append(knowledge_points)
    
    def _identify_domain(self, problem_statement: str) -> str:
        """Identify the domain of the problem"""
        problem_lower = problem_statement.lower()
        
        if 'artist' in problem_lower:
            return 'artist_management'
        elif 'rag' in problem_lower:
            return 'rag_integration'
        elif 'development' in problem_lower:
            return 'development_workflow'
        elif 'architecture' in problem_lower:
            return 'system_architecture'
        elif 'crew' in problem_lower:
            return 'crew_coordination'
        else:
            return 'general'
    
    def _identify_solution_type(self, solution: str) -> str:
        """Identify the type of solution"""
        solution_lower = solution.lower()
        
        if 'implement' in solution_lower:
            return 'implementation'
        elif 'create' in solution_lower:
            return 'creation'
        elif 'integrate' in solution_lower:
            return 'integration'
        elif 'optimize' in solution_lower:
            return 'optimization'
        else:
            return 'general'
    
    def _update_learning_patterns(self, decision: Dict, evolution_analysis: Dict):
        """Update learning patterns based on decision and evolution"""
        pattern = {
            'timestamp': decision['timestamp'],
            'domain': self._identify_domain(decision['problem_statement']),
            'evolution_type': evolution_analysis['evolution_type'],
            'lessons_count': len(decision['lessons_learned']),
            'historical_connections': len(evolution_analysis.get('consistent_patterns', [])),
            'innovations_count': len(evolution_analysis.get('innovations', []))
        }
        
        self.learning_patterns.append(pattern)
    
    def generate_knowledge_report(self) -> Dict[str, Any]:
        """Generate a comprehensive knowledge report"""
        if not self.crew_decisions:
            return {'error': 'No decisions processed yet'}
        
        # Analyze domains
        domains = {}
        for knowledge in self.knowledge_base:
            domain = knowledge['domain']
            if domain not in domains:
                domains[domain] = {'count': 0, 'lessons': []}
            domains[domain]['count'] += 1
            domains[domain]['lessons'].extend(knowledge['lessons'])
        
        # Analyze learning progression
        learning_progression = {
            'total_decisions': len(self.crew_decisions),
            'total_lessons': sum(len(k['lessons']) for k in self.knowledge_base),
            'domains_covered': len(domains),
            'evolution_patterns': len(set(p['evolution_type'] for p in self.learning_patterns)),
            'average_historical_connections': sum(p['historical_connections'] for p in self.learning_patterns) / len(self.learning_patterns) if self.learning_patterns else 0
        }
        
        return {
            'knowledge_summary': learning_progression,
            'domain_breakdown': domains,
            'recent_decisions': self.crew_decisions[-3:],  # Last 3 decisions
            'learning_patterns': self.learning_patterns[-5:],  # Last 5 patterns
            'system_status': 'active' if self.crew_decisions else 'initialized'
        }

def main():
    """Main demonstration function"""
    print("🚀 Alex AI Crew Self-Referential RAG System - Demo")
    print("=" * 60)
    
    # Initialize the system
    rag_system = SimplifiedCrewRAGSystem()
    
    # Find and process conference files
    project_root = Path(__file__).parent.parent
    conference_files = list(project_root.glob("*Conference*.json"))
    
    print(f"📁 Found {len(conference_files)} conference files")
    
    results = []
    for conference_file in conference_files:
        print(f"\n📋 Processing: {conference_file.name}")
        result = rag_system.process_conference_file(str(conference_file))
        
        if 'error' not in result:
            print(f"✅ Decision ID: {result['decision_id']}")
            print(f"   Problem: {result['problem'][:60]}...")
            print(f"   Historical Context: {result['historical_context']} relevant decisions")
            print(f"   Lessons Learned: {len(result['lessons_learned'])} insights")
            print(f"   Evolution: {result['evolution_analysis']['analysis']}")
        else:
            print(f"❌ Error: {result['error']}")
        
        results.append(result)
    
    # Generate knowledge report
    print("\n📊 Generating Knowledge Report...")
    report = rag_system.generate_knowledge_report()
    
    if 'error' not in report:
        summary = report['knowledge_summary']
        print(f"\n🎯 Knowledge Base Summary:")
        print(f"   Total Decisions: {summary['total_decisions']}")
        print(f"   Total Lessons: {summary['total_lessons']}")
        print(f"   Domains Covered: {summary['domains_covered']}")
        print(f"   Evolution Patterns: {summary['evolution_patterns']}")
        print(f"   Avg Historical Connections: {summary['average_historical_connections']:.1f}")
        
        print(f"\n📚 Domain Breakdown:")
        for domain, info in report['domain_breakdown'].items():
            print(f"   {domain}: {info['count']} decisions, {len(info['lessons'])} lessons")
        
        print(f"\n🔄 Recent Learning Patterns:")
        for pattern in report['learning_patterns']:
            print(f"   {pattern['timestamp'][:10]}: {pattern['domain']} - {pattern['evolution_type']}")
            print(f"     Lessons: {pattern['lessons_count']}, Connections: {pattern['historical_connections']}")
    
    print(f"\n🎉 Self-Referential RAG System Demonstration Complete!")
    print(f"   - {len(results)} conferences processed")
    print(f"   - Knowledge base populated with decisions and lessons")
    print(f"   - Historical context linking active")
    print(f"   - Learning progression tracked")
    print(f"   - System ready for production deployment with Supabase")

if __name__ == "__main__":
    main()
