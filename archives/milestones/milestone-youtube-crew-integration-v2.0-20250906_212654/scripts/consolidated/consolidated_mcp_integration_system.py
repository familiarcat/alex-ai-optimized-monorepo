#!/usr/bin/env python3
"""
Consolidated Script: mcp_integration_system
================================

This script consolidates the following similar scripts:
- ./mcp_integration_system.py
- ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_integration_system.py

Generated: 2025-09-06 20:27:37
"""

#!/usr/bin/env python3
"""
MCP Integration System
=====================

A comprehensive Model Context Protocol (MCP) integration system that connects
Alex AI superagent memories with N8N workflows and Supabase vector operations
for intelligent memory management and optimization.

Features:
- MCP server implementation for memory operations
- N8N workflow integration and management
- Supabase vector similarity search
- Automated memory consolidation
- Cross-project memory correlation
- Real-time memory optimization
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
import aiohttp
import numpy as np
from mcp_memory_optimization_system import MCPMemoryOptimizationSystem, MemoryVector

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class MCPRequest:
    """Represents an MCP request"""
    method: str
    params: Dict[str, Any]
    id: str
    timestamp: datetime

@dataclass
class MCPResponse:
    """Represents an MCP response"""
    result: Any
    error: Optional[Dict[str, Any]] = None
    id: str = None

class MCPIntegrationSystem:
    """Main MCP integration system for memory management"""
    
    def __init__(self, supabase_client=None, openai_client=None, n8n_base_url=None):
        self.supabase = supabase_client
        self.openai = openai_client
        self.n8n_base_url = n8n_base_url or "http://localhost:5678"
        self.memory_optimizer = MCPMemoryOptimizationSystem(supabase_client, openai_client)
        self.active_workflows = {}
        self.memory_cache = {}
        self.cache_ttl = 300  # 5 minutes
        
    async def handle_mcp_request(self, request: MCPRequest) -> MCPResponse:
        """Handle incoming MCP requests"""
        try:
            method = request.method
            params = request.params
            
            if method == "memory.search":
                result = await self.search_memories(params)
            elif method == "memory.store":
                result = await self.store_memory(params)
            elif method == "memory.consolidate":
                result = await self.consolidate_memories(params)
            elif method == "memory.optimize":
                result = await self.optimize_memories(params)
            elif method == "memory.correlate":
                result = await self.correlate_memories(params)
            elif method == "workflow.trigger":
                result = await self.trigger_workflow(params)
            elif method == "workflow.status":
                result = await self.get_workflow_status(params)
            elif method == "memory.stats":
                result = await self.get_memory_statistics(params)
            elif method == "memory.export":
                result = await self.export_memories(params)
            elif method == "memory.import":
                result = await self.import_memories(params)
            else:
                return MCPResponse(
                    result=None,
                    error={"code": -32601, "message": f"Method not found: {method}"},
                    id=request.id
                )
            
            return MCPResponse(result=result, id=request.id)
            
        except Exception as e:
            logger.error(f"Error handling MCP request {request.method}: {e}")
            return MCPResponse(
                result=None,
                error={"code": -32603, "message": f"Internal error: {str(e)}"},
                id=request.id
            )
    
    async def search_memories(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Search memories using vector similarity and text search"""
        query = params.get("query", "")
        project_id = params.get("project_id")
        crew_member = params.get("crew_member")
        memory_type = params.get("memory_type")
        similarity_threshold = params.get("similarity_threshold", 0.7)
        limit = params.get("limit", 50)
        
        # Generate embedding for query
        query_embedding = self.memory_optimizer.generate_embedding(query)
        
        # Search in Supabase using vector similarity
        search_results = []
        
        if self.supabase:
            try:
                # Vector similarity search
                response = self.supabase.rpc(
                    'find_similar_memories',
                    {
                        'p_memory_id': 'query_search',
                        'p_similarity_threshold': similarity_threshold,
                        'p_limit': limit
                    }
                ).execute()
                
                # Filter by additional criteria
                for result in response.data:
                    memory = await self.get_memory_by_id(result['similar_memory_id'])
                    if memory and self._matches_criteria(memory, project_id, crew_member, memory_type):
                        search_results.append({
                            'memory': asdict(memory),
                            'similarity_score': result['similarity_score'],
                            'content_preview': result['content_preview']
                        })
                        
            except Exception as e:
                logger.error(f"Error in vector search: {e}")
        
        # Fallback to text search if vector search fails
        if not search_results and query:
            search_results = await self._text_search_memories(
                query, project_id, crew_member, memory_type, limit
            )
        
        return {
            'query': query,
            'results': search_results,
            'total_found': len(search_results),
            'search_timestamp': datetime.now().isoformat()
        }
    
    async def store_memory(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Store a new memory with automatic embedding generation"""
        content = params.get("content", "")
        project_id = params.get("project_id", "unknown")
        crew_member = params.get("crew_member", "system")
        memory_type = params.get("memory_type", "general")
        tags = params.get("tags", [])
        
        if not content:
            return {"error": "Content is required"}
        
        # Generate embedding
        embedding = self.memory_optimizer.generate_embedding(content)
        
        # Create memory object
        memory_id = f"mem_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{hash(content) % 10000}"
        memory = MemoryVector(
            id=memory_id,
            content=content,
            embedding=embedding,
            project_id=project_id,
            crew_member=crew_member,
            memory_type=memory_type,
            importance_score=0.5,  # Will be calculated later
            created_at=datetime.now(),
            last_accessed=datetime.now(),
            access_count=1,
            tags=tags,
            related_memories=[]
        )
        
        # Store in Supabase
        if self.supabase:
            try:
                memory_data = {
                    'id': memory.id,
                    'content': memory.content,
                    'embedding': memory.embedding,
                    'project_id': memory.project_id,
                    'crew_member': memory.crew_member,
                    'memory_type': memory.memory_type,
                    'importance_score': memory.importance_score,
                    'created_at': memory.created_at.isoformat(),
                    'last_accessed': memory.last_accessed.isoformat(),
                    'access_count': memory.access_count,
                    'tags': memory.tags,
                    'related_memories': memory.related_memories
                }
                
                self.supabase.table('crew_memories').insert(memory_data).execute()
                
            except Exception as e:
                logger.error(f"Error storing memory in Supabase: {e}")
                return {"error": f"Failed to store memory: {str(e)}"}
        
        # Update local cache
        self.memory_cache[memory_id] = memory
        
        return {
            'memory_id': memory_id,
            'status': 'stored',
            'embedding_dimension': len(embedding),
            'stored_at': datetime.now().isoformat()
        }
    
    async def consolidate_memories(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Consolidate similar memories to reduce redundancy"""
        project_id = params.get("project_id")
        similarity_threshold = params.get("similarity_threshold", 0.85)
        max_consolidation_size = params.get("max_consolidation_size", 5)
        
        # Load memories for the project
        memories = await self._load_project_memories(project_id)
        
        if not memories:
            return {"error": "No memories found for project"}
        
        # Find similar memory groups
        consolidation_groups = []
        processed_memories = set()
        
        for memory in memories:
            if memory.id in processed_memories:
                continue
            
            similar_memories = self.memory_optimizer.find_similar_memories(
                memory, similarity_threshold
            )
            
            if len(similar_memories) > 1:
                group_memories = [memory]
                for similar_id, similarity in similar_memories[:max_consolidation_size-1]:
                    if similar_id in self.memory_optimizer.memories:
                        group_memories.append(self.memory_optimizer.memories[similar_id])
                        processed_memories.add(similar_id)
                
                if len(group_memories) > 1:
                    consolidation_groups.append(group_memories)
                    processed_memories.add(memory.id)
        
        # Consolidate each group
        consolidation_results = []
        for group in consolidation_groups:
            consolidated = self.memory_optimizer.consolidate_similar_memories(group)
            if consolidated:
                consolidation_results.append({
                    'consolidated_memory_id': consolidated.id,
                    'original_memory_ids': [m.id for m in group],
                    'consolidation_count': len(group),
                    'content_preview': consolidated.content[:200] + "..."
                })
        
        return {
            'consolidation_groups': len(consolidation_groups),
            'memories_consolidated': sum(len(group) for group in consolidation_groups),
            'consolidation_results': consolidation_results,
            'consolidation_timestamp': datetime.now().isoformat()
        }
    
    async def optimize_memories(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Run full memory optimization process"""
        # Load all memories
        await self.memory_optimizer.load_memories_from_supabase()
        
        # Run optimization
        results = self.memory_optimizer.optimize_memory_storage()
        
        # Save optimized memories back to Supabase
        await self.memory_optimizer.save_optimized_memories_to_supabase()
        
        # Generate report
        report = self.memory_optimizer.generate_optimization_report(results)
        
        return {
            'optimization_results': results,
            'optimization_report': report,
            'optimization_timestamp': datetime.now().isoformat()
        }
    
    async def correlate_memories(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Find correlations between memories across projects"""
        project_ids = params.get("project_ids", [])
        correlation_threshold = params.get("correlation_threshold", 0.7)
        
        correlations = []
        
        # Load memories from specified projects
        all_memories = []
        for project_id in project_ids:
            project_memories = await self._load_project_memories(project_id)
            all_memories.extend(project_memories)
        
        # Find cross-project correlations
        for i, memory1 in enumerate(all_memories):
            for memory2 in all_memories[i+1:]:
                if memory1.project_id != memory2.project_id:
                    similarity = self.memory_optimizer.cosine_similarity(
                        memory1.embedding, memory2.embedding
                    )
                    
                    if similarity >= correlation_threshold:
                        correlations.append({
                            'memory1': {
                                'id': memory1.id,
                                'project_id': memory1.project_id,
                                'crew_member': memory1.crew_member,
                                'content_preview': memory1.content[:100] + "..."
                            },
                            'memory2': {
                                'id': memory2.id,
                                'project_id': memory2.project_id,
                                'crew_member': memory2.crew_member,
                                'content_preview': memory2.content[:100] + "..."
                            },
                            'similarity_score': similarity,
                            'correlation_type': self._determine_correlation_type(memory1, memory2)
                        })
        
        # Sort by similarity score
        correlations.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        return {
            'correlations_found': len(correlations),
            'correlations': correlations[:50],  # Limit to top 50
            'correlation_timestamp': datetime.now().isoformat()
        }
    
    async def trigger_workflow(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger an N8N workflow"""
        workflow_id = params.get("workflow_id")
        trigger_data = params.get("trigger_data", {})
        
        if not workflow_id:
            return {"error": "Workflow ID is required"}
        
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}/execute"
                payload = {
                    "triggerData": trigger_data,
                    "executionMode": "trigger"
                }
                
                async with session.post(url, json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        self.active_workflows[workflow_id] = {
                            'execution_id': result.get('executionId'),
                            'status': 'running',
                            'started_at': datetime.now()
                        }
                        
                        return {
                            'workflow_id': workflow_id,
                            'execution_id': result.get('executionId'),
                            'status': 'triggered',
                            'triggered_at': datetime.now().isoformat()
                        }
                    else:
                        return {"error": f"Failed to trigger workflow: {response.status}"}
                        
        except Exception as e:
            logger.error(f"Error triggering workflow {workflow_id}: {e}")
            return {"error": f"Failed to trigger workflow: {str(e)}"}
    
    async def get_workflow_status(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get status of an N8N workflow execution"""
        workflow_id = params.get("workflow_id")
        execution_id = params.get("execution_id")
        
        if not workflow_id:
            return {"error": "Workflow ID is required"}
        
        try:
            async with aiohttp.ClientSession() as session:
                if execution_id:
                    url = f"{self.n8n_base_url}/api/v1/executions/{execution_id}"
                else:
                    url = f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}/executions"
                
                async with session.get(url) as response:
                    if response.status == 200:
                        result = await response.json()
                        return {
                            'workflow_id': workflow_id,
                            'execution_id': execution_id,
                            'status': result.get('status', 'unknown'),
                            'execution_data': result
                        }
                    else:
                        return {"error": f"Failed to get workflow status: {response.status}"}
                        
        except Exception as e:
            logger.error(f"Error getting workflow status: {e}")
            return {"error": f"Failed to get workflow status: {str(e)}"}
    
    async def get_memory_statistics(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get comprehensive memory statistics"""
        project_id = params.get("project_id")
        
        stats = {
            'total_memories': 0,
            'memories_by_project': {},
            'memories_by_crew': {},
            'memories_by_type': {},
            'avg_importance_score': 0.0,
            'oldest_memory': None,
            'newest_memory': None,
            'consolidated_memories': 0,
            'standalone_memories': 0
        }
        
        if self.supabase:
            try:
                # Get statistics from Supabase
                response = self.supabase.rpc('get_memory_statistics').execute()
                if response.data:
                    stats.update(response.data[0])
                    
            except Exception as e:
                logger.error(f"Error getting memory statistics: {e}")
        
        return stats
    
    async def export_memories(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Export memories in various formats"""
        project_id = params.get("project_id")
        format_type = params.get("format", "json")
        include_embeddings = params.get("include_embeddings", False)
        
        memories = await self._load_project_memories(project_id)
        
        export_data = []
        for memory in memories:
            memory_data = asdict(memory)
            if not include_embeddings:
                memory_data.pop('embedding', None)
            export_data.append(memory_data)
        
        if format_type == "json":
            return {
                'format': 'json',
                'memories': export_data,
                'export_timestamp': datetime.now().isoformat(),
                'total_memories': len(export_data)
            }
        elif format_type == "csv":
            # Convert to CSV format
            csv_data = self._convert_to_csv(export_data)
            return {
                'format': 'csv',
                'data': csv_data,
                'export_timestamp': datetime.now().isoformat(),
                'total_memories': len(export_data)
            }
        else:
            return {"error": f"Unsupported format: {format_type}"}
    
    async def import_memories(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Import memories from external sources"""
        memories_data = params.get("memories", [])
        project_id = params.get("project_id", "imported")
        
        imported_count = 0
        errors = []
        
        for memory_data in memories_data:
            try:
                # Generate embedding if not present
                if 'embedding' not in memory_data or not memory_data['embedding']:
                    memory_data['embedding'] = self.memory_optimizer.generate_embedding(
                        memory_data.get('content', '')
                    )
                
                # Store memory
                result = await self.store_memory({
                    'content': memory_data.get('content', ''),
                    'project_id': memory_data.get('project_id', project_id),
                    'crew_member': memory_data.get('crew_member', 'imported'),
                    'memory_type': memory_data.get('memory_type', 'general'),
                    'tags': memory_data.get('tags', [])
                })
                
                if 'error' not in result:
                    imported_count += 1
                else:
                    errors.append(f"Failed to import memory: {result['error']}")
                    
            except Exception as e:
                errors.append(f"Error importing memory: {str(e)}")
        
        return {
            'imported_count': imported_count,
            'total_attempted': len(memories_data),
            'errors': errors,
            'import_timestamp': datetime.now().isoformat()
        }
    
    # Helper methods
    
    async def get_memory_by_id(self, memory_id: str) -> Optional[MemoryVector]:
        """Get memory by ID from cache or Supabase"""
        if memory_id in self.memory_cache:
            return self.memory_cache[memory_id]
        
        if self.supabase:
            try:
                response = self.supabase.table('crew_memories').select('*').eq('id', memory_id).execute()
                if response.data:
                    memory_data = response.data[0]
                    memory = MemoryVector(
                        id=memory_data['id'],
                        content=memory_data['content'],
                        embedding=memory_data.get('embedding', []),
                        project_id=memory_data['project_id'],
                        crew_member=memory_data['crew_member'],
                        memory_type=memory_data['memory_type'],
                        importance_score=memory_data.get('importance_score', 0.5),
                        created_at=datetime.fromisoformat(memory_data['created_at']),
                        last_accessed=datetime.fromisoformat(memory_data['last_accessed']),
                        access_count=memory_data.get('access_count', 1),
                        tags=memory_data.get('tags', []),
                        related_memories=memory_data.get('related_memories', [])
                    )
                    self.memory_cache[memory_id] = memory
                    return memory
            except Exception as e:
                logger.error(f"Error getting memory {memory_id}: {e}")
        
        return None
    
    async def _load_project_memories(self, project_id: str) -> List[MemoryVector]:
        """Load all memories for a specific project"""
        memories = []
        
        if self.supabase:
            try:
                response = self.supabase.table('crew_memories').select('*').eq('project_id', project_id).execute()
                for memory_data in response.data:
                    memory = MemoryVector(
                        id=memory_data['id'],
                        content=memory_data['content'],
                        embedding=memory_data.get('embedding', []),
                        project_id=memory_data['project_id'],
                        crew_member=memory_data['crew_member'],
                        memory_type=memory_data['memory_type'],
                        importance_score=memory_data.get('importance_score', 0.5),
                        created_at=datetime.fromisoformat(memory_data['created_at']),
                        last_accessed=datetime.fromisoformat(memory_data['last_accessed']),
                        access_count=memory_data.get('access_count', 1),
                        tags=memory_data.get('tags', []),
                        related_memories=memory_data.get('related_memories', [])
                    )
                    memories.append(memory)
            except Exception as e:
                logger.error(f"Error loading project memories: {e}")
        
        return memories
    
    async def _text_search_memories(self, query: str, project_id: str = None, 
                                  crew_member: str = None, memory_type: str = None, 
                                  limit: int = 50) -> List[Dict[str, Any]]:
        """Fallback text search for memories"""
        results = []
        
        if self.supabase:
            try:
                # Use PostgreSQL full-text search
                search_query = self.supabase.table('crew_memories').select('*')
                
                if project_id:
                    search_query = search_query.eq('project_id', project_id)
                if crew_member:
                    search_query = search_query.eq('crew_member', crew_member)
                if memory_type:
                    search_query = search_query.eq('memory_type', memory_type)
                
                # Full-text search
                search_query = search_query.text_search('content', query)
                search_query = search_query.limit(limit)
                
                response = search_query.execute()
                
                for memory_data in response.data:
                    memory = MemoryVector(
                        id=memory_data['id'],
                        content=memory_data['content'],
                        embedding=memory_data.get('embedding', []),
                        project_id=memory_data['project_id'],
                        crew_member=memory_data['crew_member'],
                        memory_type=memory_data['memory_type'],
                        importance_score=memory_data.get('importance_score', 0.5),
                        created_at=datetime.fromisoformat(memory_data['created_at']),
                        last_accessed=datetime.fromisoformat(memory_data['last_accessed']),
                        access_count=memory_data.get('access_count', 1),
                        tags=memory_data.get('tags', []),
                        related_memories=memory_data.get('related_memories', [])
                    )
                    
                    results.append({
                        'memory': asdict(memory),
                        'similarity_score': 0.5,  # Default for text search
                        'content_preview': memory.content[:100] + "..."
                    })
                    
            except Exception as e:
                logger.error(f"Error in text search: {e}")
        
        return results
    
    def _matches_criteria(self, memory: MemoryVector, project_id: str = None, 
                         crew_member: str = None, memory_type: str = None) -> bool:
        """Check if memory matches search criteria"""
        if project_id and memory.project_id != project_id:
            return False
        if crew_member and memory.crew_member != crew_member:
            return False
        if memory_type and memory.memory_type != memory_type:
            return False
        return True
    
    def _determine_correlation_type(self, memory1: MemoryVector, memory2: MemoryVector) -> str:
        """Determine the type of correlation between two memories"""
        if memory1.memory_type == memory2.memory_type:
            return f"same_type_{memory1.memory_type}"
        elif memory1.crew_member == memory2.crew_member:
            return f"same_crew_{memory1.crew_member}"
        else:
            return "cross_project"
    
    def _convert_to_csv(self, memories_data: List[Dict[str, Any]]) -> str:
        """Convert memories data to CSV format"""
        if not memories_data:
            return ""
        
        # Get all possible fields
        all_fields = set()
        for memory in memories_data:
            all_fields.update(memory.keys())
        
        # Create CSV header
        csv_lines = [','.join(sorted(all_fields))]
        
        # Add data rows
        for memory in memories_data:
            row = []
            for field in sorted(all_fields):
                value = memory.get(field, '')
                # Escape CSV values
                if isinstance(value, (list, dict)):
                    value = json.dumps(value)
                value = str(value).replace('"', '""')
                if ',' in str(value) or '"' in str(value):
                    value = f'"{value}"'
                row.append(value)
            csv_lines.append(','.join(row))
        
        return '\n'.join(csv_lines)

async def main():
    """Main function to demonstrate MCP integration"""
    print("🔗 MCP Integration System")
    print("=" * 50)
    
    # Initialize system
    mcp_system = MCPIntegrationSystem()
    
    # Example MCP requests
    requests = [
        MCPRequest(
            method="memory.store",
            params={
                "content": "MCP integration enables seamless memory management across projects",
                "project_id": "mcp-integration",
                "crew_member": "Commander Data",
                "memory_type": "technical",
                "tags": ["mcp", "integration", "memory-management"]
            },
            id="req_001"
        ),
        MCPRequest(
            method="memory.search",
            params={
                "query": "memory management",
                "similarity_threshold": 0.7,
                "limit": 10
            },
            id="req_002"
        ),
        MCPRequest(
            method="memory.stats",
            params={},
            id="req_003"
        )
    ]
    
    # Process requests
    for request in requests:
        print(f"\n📨 Processing request: {request.method}")
        response = await mcp_system.handle_mcp_request(request)
        
        if response.error:
            print(f"❌ Error: {response.error['message']}")
        else:
            print(f"✅ Success: {json.dumps(response.result, indent=2, default=str)}")
    
    print("\n🎉 MCP Integration demonstration complete!")

if __name__ == "__main__":
    asyncio.run(main())
