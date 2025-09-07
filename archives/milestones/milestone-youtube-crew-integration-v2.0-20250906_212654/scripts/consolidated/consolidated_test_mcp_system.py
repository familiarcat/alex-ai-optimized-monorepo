#!/usr/bin/env python3
"""
Consolidated Script: test_mcp_system
================================

This script consolidates the following similar scripts:
- ./test_mcp_system.py
- ./mcp-memory-optimization-milestone-v1.0-20250906_054431/test_mcp_system.py

Generated: 2025-09-06 20:27:37
"""

#!/usr/bin/env python3
"""
Test MCP Memory Optimization System
===================================

Simple test version without external dependencies to demonstrate
the MCP memory optimization concepts and functionality.
"""

import os
import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, asdict

@dataclass
class MemoryVector:
    """Represents a memory with vector embedding and metadata"""
    id: str
    content: str
    embedding: List[float]
    project_id: str
    crew_member: str
    memory_type: str
    importance_score: float
    created_at: datetime
    last_accessed: datetime
    access_count: int
    tags: List[str]
    related_memories: List[str]

class SimpleMCPMemoryOptimizer:
    """Simplified MCP memory optimization system for testing"""
    
    def __init__(self):
        self.memories: Dict[str, MemoryVector] = {}
        self.similarity_threshold = 0.85
        self.importance_threshold = 0.3
        self.max_memories_per_project = 1000
        
    def generate_embedding(self, text: str) -> List[float]:
        """Generate simple hash-based embedding for testing"""
        hash_obj = hashlib.sha256(text.encode())
        hash_bytes = hash_obj.digest()
        
        # Convert to 1536-dimensional vector (OpenAI embedding size)
        embedding = []
        for i in range(0, len(hash_bytes), 2):
            if i + 1 < len(hash_bytes):
                val = int.from_bytes(hash_bytes[i:i+2], 'big')
                embedding.append(val / 65535.0)  # Normalize to [0,1]
        
        # Pad or truncate to 1536 dimensions
        while len(embedding) < 1536:
            embedding.append(0.0)
        return embedding[:1536]
    
    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        if len(vec1) != len(vec2):
            return 0.0
        
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = sum(a * a for a in vec1) ** 0.5
        norm2 = sum(b * b for b in vec2) ** 0.5
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    def calculate_importance_score(self, memory: MemoryVector) -> float:
        """Calculate importance score based on multiple factors"""
        score = 0.0
        
        # Base score from access count and recency
        recency_days = (datetime.now() - memory.last_accessed).days
        recency_factor = max(0, 1 - (recency_days / 365))  # Decay over year
        access_factor = min(1.0, memory.access_count / 10)  # Cap at 10 accesses
        
        score += (recency_factor * 0.4) + (access_factor * 0.3)
        
        # Content quality factors
        content_length = len(memory.content)
        length_factor = min(1.0, content_length / 500)  # Optimal around 500 chars
        score += length_factor * 0.1
        
        # Tag diversity factor
        tag_factor = min(1.0, len(memory.tags) / 5)  # Optimal around 5 tags
        score += tag_factor * 0.1
        
        # Memory type importance
        type_weights = {
            'insight': 1.0,
            'learning': 0.9,
            'solution': 0.8,
            'observation': 0.7,
            'process': 0.6,
            'technical': 0.8,
            'strategic': 0.9,
            'collaborative': 0.7
        }
        type_factor = type_weights.get(memory.memory_type, 0.5)
        score += type_factor * 0.1
        
        return min(1.0, score)
    
    def find_similar_memories(self, memory: MemoryVector, threshold: float = None) -> List[Tuple[str, float]]:
        """Find memories similar to the given memory"""
        if threshold is None:
            threshold = self.similarity_threshold
        
        similar_memories = []
        
        for mem_id, existing_memory in self.memories.items():
            if mem_id == memory.id:
                continue
                
            similarity = self.cosine_similarity(memory.embedding, existing_memory.embedding)
            if similarity >= threshold:
                similar_memories.append((mem_id, similarity))
        
        # Sort by similarity (highest first)
        similar_memories.sort(key=lambda x: x[1], reverse=True)
        return similar_memories
    
    def consolidate_similar_memories(self, memory_group: List[MemoryVector]) -> MemoryVector:
        """Consolidate a group of similar memories into one optimized memory"""
        if not memory_group:
            return None
        
        if len(memory_group) == 1:
            return memory_group[0]
        
        # Find the most important memory as the base
        base_memory = max(memory_group, key=lambda m: m.importance_score)
        
        # Consolidate content
        consolidated_content = self._consolidate_content(memory_group)
        
        # Calculate weighted average embedding
        weights = [m.importance_score for m in memory_group]
        total_weight = sum(weights)
        
        if total_weight > 0:
            weighted_embedding = []
            for i in range(len(base_memory.embedding)):
                weighted_sum = sum(m.embedding[i] * weights[j] for j, m in enumerate(memory_group))
                weighted_embedding.append(weighted_sum / total_weight)
        else:
            weighted_embedding = base_memory.embedding
        
        # Create consolidated memory
        consolidated_memory = MemoryVector(
            id=f"consolidated_{base_memory.id}",
            content=consolidated_content,
            embedding=weighted_embedding,
            project_id=base_memory.project_id,
            crew_member="system_consolidated",
            memory_type=base_memory.memory_type,
            importance_score=max(m.importance_score for m in memory_group),
            created_at=min(m.created_at for m in memory_group),
            last_accessed=max(m.last_accessed for m in memory_group),
            access_count=sum(m.access_count for m in memory_group),
            tags=list(set(tag for m in memory_group for tag in m.tags)),
            related_memories=[m.id for m in memory_group]
        )
        
        return consolidated_memory
    
    def _consolidate_content(self, memories: List[MemoryVector]) -> str:
        """Consolidate content from multiple memories"""
        # Group by memory type for better consolidation
        type_groups = {}
        for memory in memories:
            if memory.memory_type not in type_groups:
                type_groups[memory.memory_type] = []
            type_groups[memory.memory_type].append(memory)
        
        consolidated_parts = []
        
        for mem_type, type_memories in type_groups.items():
            if len(type_memories) == 1:
                consolidated_parts.append(type_memories[0].content)
            else:
                # For multiple memories of same type, create summary
                contents = [m.content for m in type_memories]
                summary = self._create_content_summary(contents, mem_type)
                consolidated_parts.append(summary)
        
        return "\n\n".join(consolidated_parts)
    
    def _create_content_summary(self, contents: List[str], mem_type: str) -> str:
        """Create a summary of multiple memory contents"""
        if len(contents) == 1:
            return contents[0]
        
        # Simple consolidation logic
        if mem_type in ['insight', 'learning', 'solution']:
            # For insights, combine key points
            key_points = []
            for content in contents:
                if 'Key insight:' in content:
                    key_points.append(content)
                elif 'Learning:' in content:
                    key_points.append(content)
                else:
                    key_points.append(f"• {content}")
            
            return f"Consolidated {mem_type.title()}s:\n" + "\n".join(key_points)
        
        elif mem_type in ['technical', 'process']:
            # For technical content, list implementations
            implementations = []
            for i, content in enumerate(contents, 1):
                implementations.append(f"Implementation {i}: {content}")
            
            return f"Multiple {mem_type} approaches:\n" + "\n".join(implementations)
        
        else:
            # Default: numbered list
            numbered_contents = [f"{i+1}. {content}" for i, content in enumerate(contents)]
            return f"Consolidated {mem_type}s:\n" + "\n".join(numbered_contents)
    
    def optimize_memory_storage(self) -> Dict[str, Any]:
        """Main optimization function that consolidates and cleans memories"""
        optimization_results = {
            'initial_count': len(self.memories),
            'clusters_created': 0,
            'memories_consolidated': 0,
            'memories_archived': 0,
            'memories_deleted': 0,
            'space_saved_percent': 0,
            'optimization_timestamp': datetime.now().isoformat()
        }
        
        # Step 1: Calculate importance scores for all memories
        for memory in self.memories.values():
            memory.importance_score = self.calculate_importance_score(memory)
        
        # Step 2: Find and consolidate similar memories
        consolidated_memories = {}
        memories_to_remove = set()
        processed_memories = set()
        
        for mem_id, memory in self.memories.items():
            if mem_id in processed_memories:
                continue
            
            similar_memories = self.find_similar_memories(memory)
            similar_mem_ids = [mem_id for mem_id, _ in similar_memories]
            
            if len(similar_mem_ids) > 1:  # Only consolidate if there are similar memories
                group_memories = [self.memories[mid] for mid in similar_mem_ids if mid in self.memories]
                group_memories.append(memory)  # Include the current memory
                
                if len(group_memories) > 1:
                    consolidated = self.consolidate_similar_memories(group_memories)
                    if consolidated:
                        consolidated_memories[consolidated.id] = consolidated
                        memories_to_remove.update(mem_id for mem_id in similar_mem_ids)
                        memories_to_remove.add(mem_id)
                        processed_memories.update(similar_mem_ids)
                        processed_memories.add(mem_id)
                        optimization_results['memories_consolidated'] += len(group_memories) - 1
                        optimization_results['clusters_created'] += 1
        
        # Step 3: Archive low-importance memories
        for mem_id, memory in self.memories.items():
            if mem_id not in processed_memories and memory.importance_score < self.importance_threshold:
                memories_to_remove.add(mem_id)
                optimization_results['memories_archived'] += 1
        
        # Step 4: Apply project-based limits
        project_counts = {}
        for memory in self.memories.values():
            if memory.project_id not in project_counts:
                project_counts[memory.project_id] = []
            project_counts[memory.project_id].append(memory)
        
        for project_id, project_memories in project_counts.items():
            if len(project_memories) > self.max_memories_per_project:
                # Keep most important memories
                sorted_memories = sorted(project_memories, key=lambda m: m.importance_score, reverse=True)
                excess_memories = sorted_memories[self.max_memories_per_project:]
                for memory in excess_memories:
                    if memory.id not in processed_memories:
                        memories_to_remove.add(memory.id)
                        optimization_results['memories_deleted'] += 1
        
        # Step 5: Update memory store
        for mem_id in memories_to_remove:
            if mem_id in self.memories:
                del self.memories[mem_id]
        
        # Add consolidated memories
        self.memories.update(consolidated_memories)
        
        # Calculate space saved
        final_count = len(self.memories)
        optimization_results['space_saved_percent'] = (
            (optimization_results['initial_count'] - final_count) / 
            optimization_results['initial_count'] * 100
        )
        
        return optimization_results
    
    def generate_optimization_report(self, results: Dict[str, Any]) -> str:
        """Generate a detailed optimization report"""
        report = f"""
# MCP Memory Optimization Report
Generated: {results['optimization_timestamp']}

## Optimization Summary
- **Initial Memory Count**: {results['initial_count']}
- **Final Memory Count**: {len(self.memories)}
- **Space Saved**: {results['space_saved_percent']:.1f}%
- **Clusters Created**: {results['clusters_created']}
- **Memories Consolidated**: {results['memories_consolidated']}
- **Memories Archived**: {results['memories_archived']}
- **Memories Deleted**: {results['memories_deleted']}

## Memory Distribution by Project
"""
        
        # Calculate project distribution
        project_distribution = {}
        for memory in self.memories.values():
            project_distribution[memory.project_id] = project_distribution.get(memory.project_id, 0) + 1
        
        for project_id, count in project_distribution.items():
            report += f"- **{project_id}**: {count} memories\n"
        
        report += "\n## Memory Distribution by Crew Member\n"
        
        # Calculate crew distribution
        crew_distribution = {}
        for memory in self.memories.values():
            crew_distribution[memory.crew_member] = crew_distribution.get(memory.crew_member, 0) + 1
        
        for crew_member, count in crew_distribution.items():
            report += f"- **{crew_member}**: {count} memories\n"
        
        report += "\n## Memory Distribution by Type\n"
        
        # Calculate type distribution
        type_distribution = {}
        for memory in self.memories.values():
            type_distribution[memory.memory_type] = type_distribution.get(memory.memory_type, 0) + 1
        
        for memory_type, count in type_distribution.items():
            report += f"- **{memory_type}**: {count} memories\n"
        
        return report

def main():
    """Main function to demonstrate MCP memory optimization"""
    print("🧠 MCP Memory Optimization System - Test Version")
    print("=" * 60)
    
    # Initialize system
    optimizer = SimpleMCPMemoryOptimizer()
    
    # Load sample memories for demonstration
    sample_memories = [
        {
            'id': 'mem_001',
            'content': 'Key insight: Docker containerization improves deployment consistency',
            'project_id': 'alex-ai-phase1',
            'crew_member': 'Captain Picard',
            'memory_type': 'insight',
            'tags': ['docker', 'deployment', 'infrastructure']
        },
        {
            'id': 'mem_002',
            'content': 'Learning: Docker containers ensure consistent environments across development and production',
            'project_id': 'alex-ai-phase1',
            'crew_member': 'Commander Data',
            'memory_type': 'learning',
            'tags': ['docker', 'deployment', 'consistency']
        },
        {
            'id': 'mem_003',
            'content': 'Solution: Implemented CI/CD pipeline with automated testing and deployment',
            'project_id': 'alex-ai-phase1',
            'crew_member': 'Lt. La Forge',
            'memory_type': 'solution',
            'tags': ['cicd', 'automation', 'testing']
        },
        {
            'id': 'mem_004',
            'content': 'Key insight: Vector embeddings improve memory search accuracy significantly',
            'project_id': 'alex-ai-optimization',
            'crew_member': 'Commander Data',
            'memory_type': 'insight',
            'tags': ['vector', 'embeddings', 'search']
        },
        {
            'id': 'mem_005',
            'content': 'Learning: Vector similarity search enables finding related memories across projects',
            'project_id': 'alex-ai-optimization',
            'crew_member': 'Commander Data',
            'memory_type': 'learning',
            'tags': ['vector', 'similarity', 'cross-project']
        }
    ]
    
    # Convert to MemoryVector objects
    for mem_data in sample_memories:
        memory = MemoryVector(
            id=mem_data['id'],
            content=mem_data['content'],
            embedding=optimizer.generate_embedding(mem_data['content']),
            project_id=mem_data['project_id'],
            crew_member=mem_data['crew_member'],
            memory_type=mem_data['memory_type'],
            importance_score=0.8,
            created_at=datetime.now(),
            last_accessed=datetime.now(),
            access_count=1,
            tags=mem_data['tags'],
            related_memories=[]
        )
        optimizer.memories[memory.id] = memory
    
    print(f"📊 Loaded {len(optimizer.memories)} sample memories")
    
    # Display initial memory analysis
    print("\n🔍 Initial Memory Analysis:")
    for mem_id, memory in optimizer.memories.items():
        print(f"  {mem_id}: {memory.content[:50]}... (Type: {memory.memory_type}, Project: {memory.project_id})")
    
    # Run optimization
    print("\n🔄 Running memory optimization...")
    results = optimizer.optimize_memory_storage()
    
    # Display optimization results
    print(f"\n✅ Optimization Complete!")
    print(f"   Initial memories: {results['initial_count']}")
    print(f"   Final memories: {len(optimizer.memories)}")
    print(f"   Space saved: {results['space_saved_percent']:.1f}%")
    print(f"   Memories consolidated: {results['memories_consolidated']}")
    print(f"   Clusters created: {results['clusters_created']}")
    
    # Display final memory analysis
    print("\n🔍 Final Memory Analysis:")
    for mem_id, memory in optimizer.memories.items():
        print(f"  {mem_id}: {memory.content[:50]}... (Type: {memory.memory_type}, Project: {memory.project_id})")
        if memory.related_memories:
            print(f"    └─ Consolidated from: {', '.join(memory.related_memories)}")
    
    # Generate and save report
    report = optimizer.generate_optimization_report(results)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = f"mcp_memory_optimization_test_report_{timestamp}.md"
    
    with open(report_file, 'w') as f:
        f.write(report)
    
    print(f"\n💾 Optimization report saved to: {report_file}")
    print("\n🎉 MCP Memory Optimization test complete!")
    
    # Demonstrate vector similarity search
    print("\n🔍 Vector Similarity Search Demo:")
    if optimizer.memories:
        sample_memory = list(optimizer.memories.values())[0]
        similar_memories = optimizer.find_similar_memories(sample_memory, threshold=0.5)
        
        print(f"Searching for memories similar to: '{sample_memory.content[:50]}...'")
        print(f"Found {len(similar_memories)} similar memories:")
        
        for similar_id, similarity in similar_memories:
            if similar_id in optimizer.memories:
                similar_memory = optimizer.memories[similar_id]
                print(f"  - {similar_id}: {similar_memory.content[:50]}... (Similarity: {similarity:.3f})")

if __name__ == "__main__":
    main()
