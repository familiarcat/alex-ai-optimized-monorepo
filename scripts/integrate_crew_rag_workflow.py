#!/usr/bin/env python3
"""
Alex AI Crew RAG Workflow Integration
====================================
Integrates the self-referential RAG system into the existing crew workflow
to ensure all decisions are captured, compared, and learned from.
"""

import os
import json
import sys
from datetime import datetime
from pathlib import Path

# Add the current directory to the path so we can import our RAG system
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from crew_self_referential_rag_system import CrewSelfReferentialRAGSystem

class CrewRAGWorkflowIntegrator:
    """Integrates RAG system into crew workflow"""
    
    def __init__(self):
        self.rag_system = CrewSelfReferentialRAGSystem()
        self.conference_files = []
        self.setup_conference_tracking()
    
    def setup_conference_tracking(self):
        """Set up tracking for crew conference files"""
        self.conference_patterns = [
            "Observation_Lounge_*_Conference_*.json",
            "alex_ai_*_conference_*.json",
            "*_crew_conference_*.json"
        ]
        
        # Find existing conference files
        self.find_conference_files()
    
    def find_conference_files(self):
        """Find all crew conference files in the project"""
        project_root = Path(__file__).parent.parent
        conference_files = []
        
        for pattern in self.conference_patterns:
            # Search in root directory
            conference_files.extend(project_root.glob(pattern))
            
            # Search in subdirectories
            conference_files.extend(project_root.rglob(pattern))
        
        self.conference_files = [str(f) for f in conference_files if f.is_file()]
        print(f"📁 Found {len(self.conference_files)} conference files")
    
    def process_all_conferences(self):
        """Process all found conference files through the RAG system"""
        print("🔄 Processing all crew conferences through RAG system...")
        
        results = []
        for conference_file in self.conference_files:
            try:
                print(f"\n📋 Processing: {Path(conference_file).name}")
                result = self.rag_system.process_new_conference(conference_file)
                results.append({
                    'file': conference_file,
                    'result': result
                })
                
                if 'error' not in result:
                    print(f"✅ Successfully processed decision: {result['decision_id'][:8]}...")
                else:
                    print(f"❌ Error processing: {result['error']}")
                    
            except Exception as e:
                print(f"❌ Exception processing {conference_file}: {e}")
                results.append({
                    'file': conference_file,
                    'result': {'error': str(e)}
                })
        
        return results
    
    def generate_knowledge_summary(self, results):
        """Generate a summary of the knowledge base"""
        successful_results = [r for r in results if 'error' not in r['result']]
        
        if not successful_results:
            return {"error": "No successful processing results"}
        
        summary = {
            'total_conferences_processed': len(successful_results),
            'total_lessons_learned': sum(len(r['result'].get('lessons_learned', [])) for r in successful_results),
            'total_historical_connections': sum(r['result'].get('relevant_knowledge_count', 0) for r in successful_results),
            'decision_ids': [r['result']['decision_id'] for r in successful_results],
            'knowledge_domains': self._extract_knowledge_domains(successful_results),
            'evolution_insights': self._extract_evolution_insights(successful_results)
        }
        
        return summary
    
    def _extract_knowledge_domains(self, results):
        """Extract knowledge domains from processed results"""
        domains = set()
        for result in results:
            problem = result['result'].get('problem_statement', '')
            if 'artist' in problem.lower():
                domains.add('artist_management')
            if 'rag' in problem.lower():
                domains.add('rag_integration')
            if 'development' in problem.lower():
                domains.add('development_workflow')
            if 'architecture' in problem.lower():
                domains.add('system_architecture')
        
        return list(domains)
    
    def _extract_evolution_insights(self, results):
        """Extract evolution insights from results"""
        insights = []
        for result in results:
            evolution = result['result'].get('evolution_analysis', {})
            if evolution.get('evolution_analysis'):
                insights.append(evolution['evolution_analysis'])
        
        return insights
    
    def create_rag_workflow_hook(self):
        """Create a hook to automatically process new conferences"""
        hook_script = """#!/usr/bin/env python3
'''
Auto RAG Processing Hook
=======================
Automatically processes new crew conferences through the RAG system
'''

import os
import sys
import json
from pathlib import Path

# Add the scripts directory to the path
scripts_dir = Path(__file__).parent
sys.path.append(str(scripts_dir))

from crew_self_referential_rag_system import CrewSelfReferentialRAGSystem

def process_new_conference(conference_file_path):
    \"\"\"Process a new conference file through RAG\"\"\"
    try:
        rag_system = CrewSelfReferentialRAGSystem()
        result = rag_system.process_new_conference(conference_file_path)
        
        if 'error' not in result:
            print(f"✅ Auto-processed conference: {result['decision_id'][:8]}...")
            print(f"   Historical context: {result['relevant_knowledge_count']} relevant decisions")
            print(f"   Lessons learned: {len(result['lessons_learned'])} insights")
        else:
            print(f"❌ Auto-processing failed: {result['error']}")
            
        return result
    except Exception as e:
        print(f"❌ Auto-processing exception: {e}")
        return {'error': str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        conference_file = sys.argv[1]
        process_new_conference(conference_file)
    else:
        print("Usage: python auto_rag_processing.py <conference_file_path>")
"""
        
        hook_path = Path(__file__).parent / "auto_rag_processing.py"
        with open(hook_path, 'w') as f:
            f.write(hook_script)
        
        # Make it executable
        os.chmod(hook_path, 0o755)
        
        print(f"✅ Created auto-processing hook: {hook_path}")
    
    def create_rag_integration_guide(self):
        """Create a guide for integrating RAG into crew workflows"""
        guide_content = """# Alex AI Crew RAG Integration Guide

## Overview
The Alex AI Crew Self-Referential RAG System captures all crew decisions, compares them against historical context, and builds a growing knowledge base that informs future decisions.

## Key Features

### 1. Automatic Decision Capture
- All crew conferences are automatically processed and stored
- Vector embeddings enable similarity search
- Historical context is retrieved for new problems

### 2. Solution Evolution Tracking
- Compares current solutions against previous approaches
- Identifies patterns and innovations
- Tracks learning progression over time

### 3. Knowledge Accumulation
- Lessons learned are captured and stored
- Crew expertise evolves based on experience
- Solution patterns are recognized and reused

## Integration Points

### Before Crew Conferences
1. **Retrieve Historical Context**: Use `retrieve_relevant_knowledge()` to get relevant previous decisions
2. **Prepare Context**: Include historical lessons in crew briefing
3. **Set Learning Objectives**: Define what new insights to capture

### During Crew Conferences
1. **Capture Deliberations**: Record all crew member contributions
2. **Document Decision Process**: Note how consensus was reached
3. **Identify Innovations**: Highlight new approaches or improvements

### After Crew Conferences
1. **Process Through RAG**: Run conference through `process_new_conference()`
2. **Store Decision**: Decision is automatically stored with embeddings
3. **Update Knowledge Base**: Related decisions are linked automatically
4. **Generate Insights**: Evolution analysis and learning progression

## Usage Examples

### Processing a New Conference
```python
from crew_self_referential_rag_system import CrewSelfReferentialRAGSystem

rag_system = CrewSelfReferentialRAGSystem()
result = rag_system.process_new_conference("conference_file.json")
```

### Retrieving Historical Context
```python
relevant_knowledge = rag_system.retrieve_relevant_knowledge(
    "How should we implement user authentication?",
    limit=5
)
```

### Generating Learning Report
```python
report = rag_system.generate_learning_report(decision_id)
```

## Benefits

1. **Continuous Learning**: Each decision builds on previous knowledge
2. **Pattern Recognition**: Successful approaches are identified and reused
3. **Knowledge Preservation**: All crew wisdom is captured and accessible
4. **Improved Decision Quality**: Historical context informs better decisions
5. **Self-Improvement**: System gets smarter with each decision

## Best Practices

1. **Always Process Conferences**: Ensure all crew deliberations are captured
2. **Review Historical Context**: Check relevant previous decisions before major choices
3. **Document Lessons Learned**: Explicitly capture insights and improvements
4. **Track Evolution**: Monitor how solutions evolve over time
5. **Validate Patterns**: Confirm that recurring patterns are still effective

## Monitoring and Maintenance

- Review knowledge base regularly for accuracy
- Update embeddings when new insights emerge
- Clean up outdated or incorrect information
- Monitor learning progression metrics
- Validate solution pattern effectiveness

The RAG system ensures that Alex AI's crew wisdom accumulates and improves over time, making each decision smarter than the last.
"""
        
        guide_path = Path(__file__).parent.parent / "docs" / "ALEX_AI_CREW_RAG_INTEGRATION_GUIDE.md"
        guide_path.parent.mkdir(exist_ok=True)
        
        with open(guide_path, 'w') as f:
            f.write(guide_content)
        
        print(f"✅ Created RAG integration guide: {guide_path}")

def main():
    """Main integration function"""
    print("🚀 Alex AI Crew RAG Workflow Integration")
    print("=" * 50)
    
    # Initialize the integrator
    integrator = CrewRAGWorkflowIntegrator()
    
    # Process all existing conferences
    print("\n📋 Processing existing conferences...")
    results = integrator.process_all_conferences()
    
    # Generate knowledge summary
    print("\n📊 Generating knowledge summary...")
    summary = integrator.generate_knowledge_summary(results)
    
    if 'error' not in summary:
        print(f"\n✅ Knowledge Base Summary:")
        print(f"   Conferences Processed: {summary['total_conferences_processed']}")
        print(f"   Lessons Learned: {summary['total_lessons_learned']}")
        print(f"   Historical Connections: {summary['total_historical_connections']}")
        print(f"   Knowledge Domains: {', '.join(summary['knowledge_domains'])}")
        print(f"   Decision IDs: {len(summary['decision_ids'])}")
    else:
        print(f"❌ Summary generation failed: {summary['error']}")
    
    # Create workflow integration tools
    print("\n🔧 Creating workflow integration tools...")
    integrator.create_rag_workflow_hook()
    integrator.create_rag_integration_guide()
    
    print("\n🎯 RAG Workflow Integration Complete!")
    print("   - All crew conferences processed through RAG system")
    print("   - Historical context captured and linked")
    print("   - Self-referential learning system active")
    print("   - Auto-processing hook created")
    print("   - Integration guide available")
    
    print("\n📚 Next Steps:")
    print("   1. Deploy Supabase schema for vector storage")
    print("   2. Set up automatic conference processing")
    print("   3. Integrate RAG retrieval into crew briefing process")
    print("   4. Monitor learning progression and pattern recognition")
    print("   5. Continuously improve based on accumulated knowledge")

if __name__ == "__main__":
    main()
