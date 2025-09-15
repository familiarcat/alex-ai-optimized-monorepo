#!/usr/bin/env python3
"""
Alex AI Crew Self-Referential RAG System
========================================
Implements a comprehensive RAG system that captures crew learning, compares solutions,
and creates a growing knowledge base that informs all future decisions.

Key Features:
- Captures all crew deliberations and decisions
- Stores in Supabase with vector embeddings for similarity search
- Retrieves relevant historical context for new problems
- Compares current solutions against previous approaches
- Builds cumulative knowledge that improves decision-making
- Self-referential learning that gets smarter over time
"""

import os
import json
import requests
import numpy as np
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
import hashlib
import re

@dataclass
class CrewDecision:
    """Represents a crew decision with full context"""
    id: str
    timestamp: str
    problem_statement: str
    crew_deliberations: Dict[str, Any]
    final_decision: str
    implementation_details: Dict[str, Any]
    success_metrics: Optional[Dict[str, Any]]
    lessons_learned: List[str]
    related_decisions: List[str]
    embedding: Optional[List[float]] = None

@dataclass
class KnowledgeRetrieval:
    """Represents retrieved knowledge for context"""
    decision_id: str
    similarity_score: float
    relevance_context: str
    applicable_lessons: List[str]
    previous_solutions: List[str]

class CrewSelfReferentialRAGSystem:
    """Self-referential RAG system for crew knowledge accumulation"""
    
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        
        # Knowledge base tables
        self.crew_decisions_table = 'alex_ai_crew_decisions'
        self.knowledge_retrievals_table = 'alex_ai_knowledge_retrievals'
        self.learning_cycles_table = 'alex_ai_learning_cycles'
        
    def generate_embedding(self, text: str) -> List[float]:
        """Generate OpenAI embedding for text"""
        try:
            response = requests.post(
                'https://api.openai.com/v1/embeddings',
                headers={
                    'Authorization': f'Bearer {self.openai_api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'text-embedding-3-small',
                    'input': text
                }
            )
            
            if response.status_code == 200:
                return response.json()['data'][0]['embedding']
            else:
                print(f"Embedding generation failed: {response.status_code}")
                return []
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return []
    
    def store_crew_decision(self, decision: CrewDecision) -> bool:
        """Store crew decision in Supabase with embedding"""
        try:
            # Generate embedding for the decision
            decision_text = f"{decision.problem_statement} {decision.final_decision} {' '.join(decision.lessons_learned)}"
            embedding = self.generate_embedding(decision_text)
            
            decision.embedding = embedding
            
            # Prepare data for Supabase
            decision_data = {
                'id': decision.id,
                'timestamp': decision.timestamp,
                'problem_statement': decision.problem_statement,
                'crew_deliberations': json.dumps(decision.crew_deliberations),
                'final_decision': decision.final_decision,
                'implementation_details': json.dumps(decision.implementation_details),
                'success_metrics': json.dumps(decision.success_metrics) if decision.success_metrics else None,
                'lessons_learned': json.dumps(decision.lessons_learned),
                'related_decisions': json.dumps(decision.related_decisions),
                'embedding': embedding,
                'created_at': datetime.now(timezone.utc).isoformat()
            }
            
            # Store in Supabase
            response = requests.post(
                f"{self.supabase_url}/rest/v1/{self.crew_decisions_table}",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}',
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                json=decision_data
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Stored crew decision: {decision.id}")
                return True
            else:
                print(f"❌ Failed to store decision: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"Error storing crew decision: {e}")
            return False
    
    def retrieve_relevant_knowledge(self, problem_statement: str, limit: int = 5) -> List[KnowledgeRetrieval]:
        """Retrieve relevant historical decisions using vector similarity"""
        try:
            # Generate embedding for current problem
            problem_embedding = self.generate_embedding(problem_statement)
            
            if not problem_embedding:
                return []
            
            # Perform vector similarity search in Supabase
            response = requests.post(
                f"{self.supabase_url}/rest/v1/rpc/match_crew_decisions",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'query_embedding': problem_embedding,
                    'match_threshold': 0.7,
                    'match_count': limit
                }
            )
            
            if response.status_code == 200:
                results = response.json()
                retrievals = []
                
                for result in results:
                    retrieval = KnowledgeRetrieval(
                        decision_id=result['id'],
                        similarity_score=result['similarity'],
                        relevance_context=result['problem_statement'],
                        applicable_lessons=json.loads(result['lessons_learned']),
                        previous_solutions=[result['final_decision']]
                    )
                    retrievals.append(retrieval)
                
                return retrievals
            else:
                print(f"Knowledge retrieval failed: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"Error retrieving knowledge: {e}")
            return []
    
    def analyze_solution_evolution(self, current_solution: str, historical_solutions: List[KnowledgeRetrieval]) -> Dict[str, Any]:
        """Analyze how current solution evolves from historical approaches"""
        analysis = {
            'evolution_analysis': '',
            'improvements_made': [],
            'new_innovations': [],
            'consistent_patterns': [],
            'learning_progression': []
        }
        
        if not historical_solutions:
            analysis['evolution_analysis'] = "No historical context available - this is a novel approach."
            return analysis
        
        # Analyze similarities and differences
        for historical in historical_solutions:
            if historical.similarity_score > 0.8:
                analysis['consistent_patterns'].append({
                    'pattern': historical.previous_solutions[0],
                    'similarity': historical.similarity_score,
                    'context': historical.relevance_context
                })
            
            if historical.similarity_score < 0.6:
                analysis['new_innovations'].append({
                    'innovation': current_solution,
                    'departure_from': historical.previous_solutions[0],
                    'context': historical.relevance_context
                })
        
        # Generate evolution narrative
        analysis['evolution_analysis'] = self._generate_evolution_narrative(analysis)
        
        return analysis
    
    def _generate_evolution_narrative(self, analysis: Dict[str, Any]) -> str:
        """Generate narrative explaining solution evolution"""
        narrative_parts = []
        
        if analysis['consistent_patterns']:
            narrative_parts.append("Building on proven approaches from previous solutions:")
            for pattern in analysis['consistent_patterns']:
                narrative_parts.append(f"- {pattern['pattern']} (similarity: {pattern['similarity']:.2f})")
        
        if analysis['new_innovations']:
            narrative_parts.append("Introducing new innovations:")
            for innovation in analysis['new_innovations']:
                narrative_parts.append(f"- {innovation['innovation']}")
        
        return "\n".join(narrative_parts)
    
    def capture_crew_conference(self, conference_data: Dict[str, Any]) -> CrewDecision:
        """Capture crew conference as a structured decision"""
        # Generate unique ID for this decision
        decision_id = hashlib.md5(
            f"{conference_data.get('conference', '')}{datetime.now().isoformat()}".encode()
        ).hexdigest()
        
        # Extract key information
        problem_statement = conference_data.get('agenda', 'Unknown problem')
        
        # Process crew deliberations
        crew_deliberations = {}
        for crew_member, deliberation in conference_data.get('deliberations', {}).items():
            crew_deliberations[crew_member] = {
                'role': deliberation.get('role', 'Unknown'),
                'contribution': deliberation.get('contribution', ''),
                'perspective': deliberation.get('perspective', ''),
                'recommendations': deliberation.get('recommendations', [])
            }
        
        # Extract final decision and implementation details
        conclusion = conference_data.get('conclusion', '')
        final_decision = conclusion if conclusion else "Consensus reached through crew deliberation"
        
        # Extract lessons learned
        lessons_learned = []
        for deliberation in crew_deliberations.values():
            if 'lessons' in deliberation.get('contribution', '').lower():
                lessons_learned.append(deliberation['contribution'])
        
        # Create CrewDecision object
        decision = CrewDecision(
            id=decision_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            problem_statement=problem_statement,
            crew_deliberations=crew_deliberations,
            final_decision=final_decision,
            implementation_details={
                'conference_type': conference_data.get('conference', ''),
                'participants': list(crew_deliberations.keys()),
                'date': conference_data.get('date', ''),
                'location': conference_data.get('location', 'Observation Lounge')
            },
            success_metrics=None,  # To be updated after implementation
            lessons_learned=lessons_learned,
            related_decisions=[]  # To be populated by similarity search
        )
        
        return decision
    
    def process_new_conference(self, conference_file_path: str) -> Dict[str, Any]:
        """Process a new crew conference through the RAG system"""
        try:
            # Load conference data
            with open(conference_file_path, 'r') as f:
                conference_data = json.load(f)
            
            print(f"🔄 Processing conference: {conference_data.get('conference', 'Unknown')}")
            
            # Capture as structured decision
            decision = self.capture_crew_conference(conference_data)
            
            # Retrieve relevant historical knowledge
            print("🔍 Retrieving relevant historical knowledge...")
            relevant_knowledge = self.retrieve_relevant_knowledge(decision.problem_statement)
            
            # Analyze solution evolution
            print("📊 Analyzing solution evolution...")
            evolution_analysis = self.analyze_solution_evolution(
                decision.final_decision, 
                relevant_knowledge
            )
            
            # Update related decisions
            decision.related_decisions = [k.decision_id for k in relevant_knowledge]
            
            # Store the decision
            print("💾 Storing decision in knowledge base...")
            storage_success = self.store_crew_decision(decision)
            
            # Store retrieval context
            if relevant_knowledge:
                self._store_retrieval_context(decision.id, relevant_knowledge)
            
            return {
                'decision_id': decision.id,
                'problem_statement': decision.problem_statement,
                'relevant_knowledge_count': len(relevant_knowledge),
                'evolution_analysis': evolution_analysis,
                'storage_success': storage_success,
                'lessons_learned': decision.lessons_learned,
                'related_decisions': decision.related_decisions
            }
            
        except Exception as e:
            print(f"Error processing conference: {e}")
            return {'error': str(e)}
    
    def _store_retrieval_context(self, decision_id: str, retrievals: List[KnowledgeRetrieval]):
        """Store the retrieval context for this decision"""
        try:
            for retrieval in retrievals:
                retrieval_data = {
                    'decision_id': decision_id,
                    'retrieved_decision_id': retrieval.decision_id,
                    'similarity_score': retrieval.similarity_score,
                    'relevance_context': retrieval.relevance_context,
                    'applicable_lessons': json.dumps(retrieval.applicable_lessons),
                    'retrieved_at': datetime.now(timezone.utc).isoformat()
                }
                
                requests.post(
                    f"{self.supabase_url}/rest/v1/{self.knowledge_retrievals_table}",
                    headers={
                        'apikey': self.supabase_key,
                        'Authorization': f'Bearer {self.supabase_key}',
                        'Content-Type': 'application/json'
                    },
                    json=retrieval_data
                )
                
        except Exception as e:
            print(f"Error storing retrieval context: {e}")
    
    def generate_learning_report(self, decision_id: str) -> Dict[str, Any]:
        """Generate a comprehensive learning report for a decision"""
        try:
            # Get the decision
            response = requests.get(
                f"{self.supabase_url}/rest/v1/{self.crew_decisions_table}?id=eq.{decision_id}",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                }
            )
            
            if response.status_code != 200 or not response.json():
                return {'error': 'Decision not found'}
            
            decision_data = response.json()[0]
            
            # Get retrieval context
            retrieval_response = requests.get(
                f"{self.supabase_url}/rest/v1/{self.knowledge_retrievals_table}?decision_id=eq.{decision_id}",
                headers={
                    'apikey': self.supabase_key,
                    'Authorization': f'Bearer {self.supabase_key}'
                }
            )
            
            retrievals = retrieval_response.json() if retrieval_response.status_code == 200 else []
            
            return {
                'decision_summary': {
                    'id': decision_data['id'],
                    'problem': decision_data['problem_statement'],
                    'solution': decision_data['final_decision'],
                    'timestamp': decision_data['timestamp']
                },
                'historical_context': {
                    'relevant_decisions_count': len(retrievals),
                    'highest_similarity': max([r['similarity_score'] for r in retrievals]) if retrievals else 0,
                    'lessons_applied': [r['applicable_lessons'] for r in retrievals]
                },
                'learning_progression': {
                    'new_insights': json.loads(decision_data['lessons_learned']),
                    'knowledge_connections': decision_data['related_decisions']
                }
            }
            
        except Exception as e:
            return {'error': str(e)}

def main():
    """Main function to demonstrate the RAG system"""
    print("🚀 Alex AI Crew Self-Referential RAG System")
    print("=" * 50)
    
    # Initialize the system
    rag_system = CrewSelfReferentialRAGSystem()
    
    # Process recent conferences
    conference_files = [
        "Observation_Lounge_Full_Application_Design_Conference_20250114.json",
        "Observation_Lounge_Artist_Management_Conference_20250114.json",
        "Observation_Lounge_RAG_Integration_Conference_20250114.json"
    ]
    
    results = []
    for conference_file in conference_files:
        if os.path.exists(conference_file):
            print(f"\n📋 Processing: {conference_file}")
            result = rag_system.process_new_conference(conference_file)
            results.append(result)
        else:
            print(f"⚠️  File not found: {conference_file}")
    
    # Generate summary report
    print("\n📊 RAG System Processing Summary:")
    print("=" * 40)
    
    for result in results:
        if 'error' not in result:
            print(f"✅ Decision ID: {result['decision_id'][:8]}...")
            print(f"   Problem: {result['problem_statement'][:60]}...")
            print(f"   Historical Context: {result['relevant_knowledge_count']} relevant decisions")
            print(f"   Lessons Learned: {len(result['lessons_learned'])} insights")
            print()
        else:
            print(f"❌ Error: {result['error']}")
    
    print("🎯 Self-Referential Learning System Active!")
    print("   - All crew decisions stored with vector embeddings")
    print("   - Historical context retrieved for new problems")
    print("   - Solution evolution tracked and analyzed")
    print("   - Knowledge base grows with each decision")
    print("   - Future decisions informed by accumulated wisdom")

if __name__ == "__main__":
    main()
