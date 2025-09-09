from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Alex AI Memory Sharing Assessment System
Tests Supabase memory sharing between all crew members
"""

import os
import requests
import json
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import time

class AlexAIMemorySharingAssessment:
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.crew_members = [
            'Captain Jean-Luc Picard',
            'Commander William Riker', 
            'Commander Data',
            'Lieutenant Commander Geordi La Forge',
            'Lieutenant Worf',
            'Counselor Deanna Troi',
            'Lieutenant Uhura',
            'Dr. Beverly Crusher',
            'Quark',
            'System-Wide',
            'Cursor-AI-Integration'
        ]
        
    def test_supabase_connection(self) -> bool:
        """Test basic Supabase connection"""
        print("🔍 Testing Supabase connection...")
        try:
            url = f"{self.supabase_url}/rest/v1/crew_memories"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}'
            }
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                print("✅ Supabase connection successful")
                return True
            else:
                print(f"❌ Supabase connection failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Supabase connection error: {e}")
            return False
    
    def get_all_crew_memories(self) -> List[Dict]:
        """Retrieve all crew memories from Supabase"""
        print("📚 Retrieving all crew memories...")
        try:
            url = f"{self.supabase_url}/rest/v1/crew_memories"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}'
            }
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                memories = response.json()
                print(f"✅ Retrieved {len(memories)} memories")
                return memories
            else:
                print(f"❌ Failed to retrieve memories: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error retrieving memories: {e}")
            return []
    
    def analyze_crew_memory_distribution(self, memories: List[Dict]) -> Dict:
        """Analyze memory distribution across crew members"""
        print("📊 Analyzing crew memory distribution...")
        
        analysis = {
            'total_memories': len(memories),
            'crew_member_counts': {},
            'memory_types': {},
            'recent_memories': [],
            'shared_knowledge': {},
            'memory_gaps': []
        }
        
        # Count memories by crew member
        for memory in memories:
            crew = memory.get('crew_member', 'Unknown')
            mem_type = memory.get('memory_type', 'Unknown')
            
            analysis['crew_member_counts'][crew] = analysis['crew_member_counts'].get(crew, 0) + 1
            analysis['memory_types'][mem_type] = analysis['memory_types'].get(mem_type, 0) + 1
        
        # Get recent memories (last 10)
        sorted_memories = sorted(memories, key=lambda x: x.get('created_at', ''), reverse=True)
        analysis['recent_memories'] = sorted_memories[:10]
        
        # Identify shared knowledge patterns
        for memory in memories:
            content = memory.get('content', '')
            if 'Alex AI' in content or 'credential' in content.lower():
                crew = memory.get('crew_member', 'Unknown')
                if crew not in analysis['shared_knowledge']:
                    analysis['shared_knowledge'][crew] = []
                analysis['shared_knowledge'][crew].append({
                    'type': memory.get('memory_type'),
                    'content': content[:100] + '...' if len(content) > 100 else content
                })
        
        # Identify memory gaps
        for crew in self.crew_members:
            if crew not in analysis['crew_member_counts']:
                analysis['memory_gaps'].append(f"No memories found for {crew}")
        
        return analysis
    
    def test_memory_consistency(self, memories: List[Dict]) -> Dict:
        """Test memory consistency across crew members"""
        print("🔄 Testing memory consistency...")
        
        consistency_test = {
            'system_wide_memories': [],
            'crew_specific_memories': {},
            'conflicting_memories': [],
            'consistency_score': 0
        }
        
        # Separate system-wide vs crew-specific memories
        for memory in memories:
            crew = memory.get('crew_member', 'Unknown')
            if crew == 'System-Wide':
                consistency_test['system_wide_memories'].append(memory)
            else:
                if crew not in consistency_test['crew_specific_memories']:
                    consistency_test['crew_specific_memories'][crew] = []
                consistency_test['crew_specific_memories'][crew].append(memory)
        
        # Check for conflicting information
        system_memories = consistency_test['system_wide_memories']
        for memory in system_memories:
            content = memory.get('content', '').lower()
            if 'resolved' in content or 'completed' in content:
                # Look for contradictory memories
                for other_memory in system_memories:
                    other_content = other_memory.get('content', '').lower()
                    if memory['id'] != other_memory['id'] and 'failed' in other_content:
                        consistency_test['conflicting_memories'].append({
                            'memory1': memory,
                            'memory2': other_memory,
                            'conflict': 'resolved vs failed status'
                        })
        
        # Calculate consistency score
        total_memories = len(memories)
        conflicts = len(consistency_test['conflicting_memories'])
        consistency_test['consistency_score'] = max(0, (total_memories - conflicts) / total_memories * 100)
        
        return consistency_test
    
    def create_test_memory_for_crew(self, crew_member: str) -> bool:
        """Create a test memory for a specific crew member"""
        print(f"📝 Creating test memory for {crew_member}...")
        
        test_memory = {
            'crew_member': crew_member,
            'mission_id': f'memory-sharing-test-{int(time.time())}',
            'memory_type': 'system_test',
            'content': f'Memory sharing test for {crew_member} at {datetime.now().isoformat()}. This memory tests the sharing capabilities of the Alex AI superagent system.',
            'importance': 'medium'
        }
        
        try:
            url = f"{self.supabase_url}/rest/v1/crew_memories"
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, headers=headers, json=test_memory)
            
            if response.status_code == 201:
                print(f"✅ Test memory created for {crew_member}")
                return True
            else:
                print(f"❌ Failed to create test memory for {crew_member}: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Error creating test memory for {crew_member}: {e}")
            return False
    
    def verify_memory_sharing(self, test_crew: str) -> bool:
        """Verify that test memory is accessible to all crew members"""
        print(f"🔍 Verifying memory sharing for {test_crew}...")
        
        try:
            # Query for the test memory
            url = f"{self.supabase_url}/rest/v1/crew_memories"
            params = {'crew_member': 'eq.' + test_crew}
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}'
            }
            
            response = requests.get(url, headers=headers, params=params, timeout=10)
            
            if response.status_code == 200:
                memories = response.json()
                test_memories = [m for m in memories if 'memory-sharing-test' in m.get('mission_id', '')]
                
                if test_memories:
                    print(f"✅ Test memory found for {test_crew}")
                    return True
                else:
                    print(f"❌ Test memory not found for {test_crew}")
                    return False
            else:
                print(f"❌ Failed to query memories for {test_crew}: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Error verifying memory sharing for {test_crew}: {e}")
            return False
    
    def run_comprehensive_assessment(self) -> Dict:
        """Run comprehensive memory sharing assessment"""
        print("🧠 ALEX AI MEMORY SHARING ASSESSMENT")
        print("=" * 50)
        print("Testing Supabase memory sharing between all crew members")
        print()
        
        # Test 1: Basic connection
        if not self.test_supabase_connection():
            return {'status': 'FAILED', 'error': 'Supabase connection failed'}
        
        # Test 2: Retrieve all memories
        memories = self.get_all_crew_memories()
        if not memories:
            return {'status': 'FAILED', 'error': 'No memories retrieved'}
        
        # Test 3: Analyze distribution
        distribution = self.analyze_crew_memory_distribution(memories)
        
        # Test 4: Test consistency
        consistency = self.test_memory_consistency(memories)
        
        # Test 5: Create and verify test memory
        test_crew = 'Commander Data'  # Use Data for testing
        test_created = self.create_test_memory_for_crew(test_crew)
        test_verified = self.verify_memory_sharing(test_crew) if test_created else False
        
        # Compile results
        assessment = {
            'timestamp': datetime.now().isoformat(),
            'status': 'COMPLETED',
            'supabase_connection': True,
            'total_memories': len(memories),
            'crew_member_distribution': distribution['crew_member_counts'],
            'memory_types': distribution['memory_types'],
            'consistency_score': consistency['consistency_score'],
            'memory_gaps': distribution['memory_gaps'],
            'test_memory_created': test_created,
            'test_memory_verified': test_verified,
            'shared_knowledge_analysis': distribution['shared_knowledge'],
            'recent_memories': distribution['recent_memories'][:5],  # Top 5 recent
            'overall_assessment': self._generate_overall_assessment(distribution, consistency, test_created, test_verified)
        }
        
        return assessment
    
    def _generate_overall_assessment(self, distribution: Dict, consistency: Dict, test_created: bool, test_verified: bool) -> str:
        """Generate overall assessment of memory sharing"""
        total_memories = distribution['total_memories']
        crew_count = len(distribution['crew_member_counts'])
        consistency_score = consistency['consistency_score']
        gaps = len(distribution['memory_gaps'])
        
        if total_memories > 20 and crew_count >= 8 and consistency_score > 80 and test_created and test_verified:
            return "EXCELLENT - Memory sharing is working optimally across all crew members"
        elif total_memories > 10 and crew_count >= 6 and consistency_score > 60 and test_created:
            return "GOOD - Memory sharing is working well with minor gaps"
        elif total_memories > 5 and crew_count >= 4 and consistency_score > 40:
            return "FAIR - Memory sharing is partially working, needs improvement"
        else:
            return "POOR - Memory sharing has significant issues, requires immediate attention"
    
    def print_assessment_report(self, assessment: Dict):
        """Print comprehensive assessment report"""
        print("\n" + "=" * 60)
        print("📊 ALEX AI MEMORY SHARING ASSESSMENT REPORT")
        print("=" * 60)
        
        print(f"📅 Assessment Date: {assessment['timestamp']}")
        print(f"📊 Total Memories: {assessment['total_memories']}")
        print(f"👥 Active Crew Members: {len(assessment['crew_member_distribution'])}")
        print(f"🔄 Consistency Score: {assessment['consistency_score']:.1f}%")
        print(f"🧪 Test Memory: {'✅ PASS' if assessment['test_memory_created'] and assessment['test_memory_verified'] else '❌ FAIL'}")
        
        print(f"\n👥 CREW MEMORY DISTRIBUTION:")
        for crew, count in sorted(assessment['crew_member_distribution'].items(), key=lambda x: x[1], reverse=True):
            print(f"   {crew}: {count} memories")
        
        print(f"\n📋 MEMORY TYPES:")
        for mem_type, count in sorted(assessment['memory_types'].items(), key=lambda x: x[1], reverse=True):
            print(f"   {mem_type}: {count}")
        
        if assessment['memory_gaps']:
            print(f"\n⚠️  MEMORY GAPS:")
            for gap in assessment['memory_gaps']:
                print(f"   - {gap}")
        
        print(f"\n🎯 OVERALL ASSESSMENT:")
        print(f"   {assessment['overall_assessment']}")
        
        print(f"\n📝 RECENT MEMORIES:")
        for i, memory in enumerate(assessment['recent_memories'], 1):
            crew = memory.get('crew_member', 'Unknown')
            mem_type = memory.get('memory_type', 'Unknown')
            content = memory.get('content', '')[:80] + '...' if len(memory.get('content', '')) > 80 else memory.get('content', '')
            print(f"   {i}. [{crew}] {mem_type}: {content}")

    assessor = AlexAIMemorySharingAssessment()
    assessment = assessor.run_comprehensive_assessment()
    
    if assessment['status'] == 'COMPLETED':
        assessor.print_assessment_report(assessment)
        
        # Save assessment to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"alex_ai_memory_assessment_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(assessment, f, indent=2)
        
        print(f"\n💾 Assessment saved to: {filename}")
        
        return assessment
    else:
        print(f"\n❌ Assessment failed: {assessment.get('error', 'Unknown error')}")
        return assessment

if __name__ == "__main__":
    main()
