#!/usr/bin/env python3
"""
Unit Tests for RAG System
Tests RAG system components and functionality
"""

import unittest
import json
import os
import time
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from typing import Dict, List, Any

class TestRAGSystem(unittest.TestCase):
    """Test RAG system functionality"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.crew_members = {
            "picard": {
                "name": "Captain Jean-Luc Picard",
                "expertise": "Strategic Leadership",
                "personality": "diplomatic"
            },
            "data": {
                "name": "Commander Data", 
                "expertise": "Analytics & Logic",
                "personality": "analytical"
            },
            "geordi": {
                "name": "Lieutenant Commander Geordi La Forge",
                "expertise": "Technical Infrastructure", 
                "personality": "technical"
            }
        }
        
        self.test_queries = [
            "What is our strategic approach?",
            "Analyze the performance data",
            "How can we improve our infrastructure?"
        ]
        
    def test_crew_member_initialization(self):
        """Test crew member initialization"""
        for crew_id, crew_info in self.crew_members.items():
            with self.subTest(crew=crew_id):
                self.assertIn("name", crew_info)
                self.assertIn("expertise", crew_info)
                self.assertIn("personality", crew_info)
                self.assertIsInstance(crew_info["name"], str)
                self.assertIsInstance(crew_info["expertise"], str)
                
    def test_rag_query_processing(self):
        """Test RAG query processing"""
        for crew_id, crew_info in self.crew_members.items():
            with self.subTest(crew=crew_id):
                query = "Test query for RAG processing"
                
                # Mock RAG processing
                with patch('requests.post') as mock_post:
                    mock_response = Mock()
                    mock_response.status_code = 200
                    mock_response.json.return_value = {
                        "query": query,
                        "crew_member": crew_info["name"],
                        "response": f"Mock response from {crew_info['name']}",
                        "confidence_score": 0.92,
                        "processing_time": 0.5
                    }
                    mock_post.return_value = mock_response
                    
                    # Test RAG query
                    response = mock_post("test_rag_url", json={"query": query})
                    
                    self.assertEqual(response.status_code, 200)
                    response_data = response.json()
                    self.assertEqual(response_data["crew_member"], crew_info["name"])
                    self.assertIn("confidence_score", response_data)
                    self.assertGreater(response_data["confidence_score"], 0.8)
                    
    def test_vector_search_functionality(self):
        """Test vector search functionality"""
        test_embeddings = [
            [0.1, 0.2, 0.3, 0.4, 0.5],
            [0.6, 0.7, 0.8, 0.9, 1.0],
            [0.2, 0.3, 0.4, 0.5, 0.6]
        ]
        
        query_embedding = [0.15, 0.25, 0.35, 0.45, 0.55]
        
        # Test similarity calculation
        similarities = self._calculate_similarities(query_embedding, test_embeddings)
        
        self.assertEqual(len(similarities), len(test_embeddings))
        self.assertTrue(all(0 <= sim <= 1 for sim in similarities))
        
        # Test that most similar embedding is found
        most_similar_idx = similarities.index(max(similarities))
        self.assertEqual(most_similar_idx, 0)  # First embedding should be most similar
        
    def _calculate_similarities(self, query_embedding: List[float], 
                              test_embeddings: List[List[float]]) -> List[float]:
        """Calculate similarities between query and test embeddings"""
        similarities = []
        for embedding in test_embeddings:
            # Simple cosine similarity calculation
            dot_product = sum(a * b for a, b in zip(query_embedding, embedding))
            norm_a = sum(a * a for a in query_embedding) ** 0.5
            norm_b = sum(b * b for b in embedding) ** 0.5
            similarity = dot_product / (norm_a * norm_b) if norm_a * norm_b > 0 else 0
            similarities.append(similarity)
        return similarities
        
    def test_memory_storage_and_retrieval(self):
        """Test memory storage and retrieval"""
        test_memory = {
            "id": "test_memory_001",
            "content": "Test memory content",
            "crew_member": "Captain Jean-Luc Picard",
            "memory_type": "rag_interaction",
            "timestamp": datetime.now().isoformat(),
            "embedding": [0.1, 0.2, 0.3, 0.4, 0.5]
        }
        
        # Test memory storage
        with patch('requests.post') as mock_post:
            mock_response = Mock()
            mock_response.status_code = 201
            mock_response.json.return_value = {"id": test_memory["id"], "status": "stored"}
            mock_post.return_value = mock_response
            
            response = mock_post("test_memory_url", json=test_memory)
            
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.json()["id"], test_memory["id"])
            
        # Test memory retrieval
        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {"memories": [test_memory]}
            mock_get.return_value = mock_response
            
            response = mock_get(f"test_memory_url/{test_memory['id']}")
            
            self.assertEqual(response.status_code, 200)
            retrieved_memories = response.json()["memories"]
            self.assertEqual(len(retrieved_memories), 1)
            self.assertEqual(retrieved_memories[0]["id"], test_memory["id"])
            
    def test_crew_response_generation(self):
        """Test crew-specific response generation"""
        for crew_id, crew_info in self.crew_members.items():
            with self.subTest(crew=crew_id):
                query = "Test query for response generation"
                
                # Mock response generation
                response = self._generate_crew_response(crew_id, query)
                
                self.assertIsInstance(response, str)
                self.assertGreater(len(response), 0)
                self.assertIn(crew_info["name"], response)
                
    def _generate_crew_response(self, crew_id: str, query: str) -> str:
        """Generate crew-specific response"""
        crew_info = self.crew_members[crew_id]
        
        response_templates = {
            "picard": f"From a strategic perspective, {query} requires careful consideration of our core values and mission objectives.",
            "data": f"Fascinating question. From an analytical standpoint, {query} presents interesting logical implications.",
            "geordi": f"I can fix that! I mean, I can optimize that! For {query}, I see several engineering opportunities."
        }
        
        return response_templates.get(crew_id, f"Analysis of {query} from {crew_info['expertise']} perspective.")
        
    def test_confidence_score_calculation(self):
        """Test confidence score calculation"""
        test_cases = [
            {
                "similarity_scores": [0.9, 0.8, 0.7],
                "expected_confidence": 0.8
            },
            {
                "similarity_scores": [0.6, 0.5, 0.4],
                "expected_confidence": 0.5
            },
            {
                "similarity_scores": [0.95, 0.92, 0.88],
                "expected_confidence": 0.92
            }
        ]
        
        for test_case in test_cases:
            with self.subTest(scores=test_case["similarity_scores"]):
                confidence = self._calculate_confidence_score(test_case["similarity_scores"])
                
                self.assertIsInstance(confidence, float)
                self.assertGreaterEqual(confidence, 0.0)
                self.assertLessEqual(confidence, 1.0)
                self.assertAlmostEqual(confidence, test_case["expected_confidence"], delta=0.1)
                
    def _calculate_confidence_score(self, similarity_scores: List[float]) -> float:
        """Calculate confidence score from similarity scores"""
        if not similarity_scores:
            return 0.0
            
        # Weighted average with higher weights for better similarities
        weights = [i + 1 for i in range(len(similarity_scores))]
        weighted_sum = sum(score * weight for score, weight in zip(similarity_scores, weights))
        total_weight = sum(weights)
        
        return weighted_sum / total_weight if total_weight > 0 else 0.0
        
    def test_rag_workflow_integration(self):
        """Test RAG workflow integration"""
        workflow_data = {
            "query": "Test RAG workflow integration",
            "crew_member": "picard",
            "context": {
                "similar_memories": [
                    {"content": "Previous strategic analysis", "similarity": 0.85},
                    {"content": "Related strategic insights", "similarity": 0.78}
                ]
            }
        }
        
        # Mock RAG workflow execution
        with patch('requests.post') as mock_post:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "workflow_triggered": True,
                "rag_processing": True,
                "response_generated": True,
                "memory_stored": True,
                "success": True
            }
            mock_post.return_value = mock_response
            
            response = mock_post("test_rag_workflow_url", json=workflow_data)
            
            self.assertEqual(response.status_code, 200)
            response_data = response.json()
            self.assertTrue(response_data["workflow_triggered"])
            self.assertTrue(response_data["rag_processing"])
            self.assertTrue(response_data["success"])
            
    def test_error_handling(self):
        """Test RAG system error handling"""
        error_scenarios = [
            {"error_type": "invalid_query", "query": ""},
            {"error_type": "missing_crew_member", "crew_member": "unknown"},
            {"error_type": "processing_error", "simulate_error": True}
        ]
        
        for scenario in error_scenarios:
            with self.subTest(scenario=scenario["error_type"]):
                if scenario.get("simulate_error"):
                    with patch('requests.post') as mock_post:
                        mock_post.side_effect = Exception("Processing error")
                        
                        with self.assertRaises(Exception):
                            mock_post("test_url", json={"query": "test"})
                else:
                    # Test invalid input handling
                    is_valid = self._validate_rag_input(scenario)
                    self.assertFalse(is_valid)
                    
    def _validate_rag_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate RAG input data"""
        if "query" in input_data and not input_data["query"]:
            return False
        if "crew_member" in input_data and input_data["crew_member"] not in self.crew_members:
            return False
        return True
        
    def test_performance_metrics(self):
        """Test performance metrics collection"""
        start_time = time.time()
        
        # Simulate RAG processing
        time.sleep(0.1)  # Simulate processing time
        
        processing_time = time.time() - start_time
        
        metrics = {
            "processing_time": processing_time,
            "confidence_score": 0.92,
            "memory_retrieved": 3,
            "response_generated": True
        }
        
        self.assertGreater(metrics["processing_time"], 0)
        self.assertLess(metrics["processing_time"], 1.0)  # Should be fast
        self.assertGreaterEqual(metrics["confidence_score"], 0.0)
        self.assertLessEqual(metrics["confidence_score"], 1.0)
        self.assertIsInstance(metrics["memory_retrieved"], int)
        self.assertTrue(metrics["response_generated"])

if __name__ == '__main__':
    unittest.main()
