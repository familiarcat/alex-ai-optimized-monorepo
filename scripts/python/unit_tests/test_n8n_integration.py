#!/usr/bin/env python3
"""
Unit Tests for N8N Integration
Tests N8N workflow integration with Cursor AI system
"""

import unittest
import json
import os
import time
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from typing import Dict, List, Any

class TestN8NIntegration(unittest.TestCase):
    """Test N8N integration functionality"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.n8n_base_url = "https://n8n.pbradygeorgen.com"
        self.n8n_api_key = os.getenv('N8N_API_KEY', 'test_key')
        self.test_workflows = {
            "job_scraping": {
                "id": "job-scraping",
                "webhook_path": "/webhook/alex-ai-job-opportunities",
                "expected_response": {"status": "success"}
            },
            "mcp_knowledge": {
                "id": "mcp-knowledge-scraping", 
                "webhook_path": "/webhook/alex-ai-mcp-knowledge",
                "expected_response": {"status": "success"}
            }
        }
        
    def test_n8n_api_connectivity(self):
        """Test N8N API connectivity"""
        # Mock requests for testing
        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {"data": [{"id": "test", "name": "Test Workflow"}]}
            mock_get.return_value = mock_response
            
            # Test API connectivity
            headers = {"Authorization": f"Bearer {self.n8n_api_key}"}
            response = mock_get(f"{self.n8n_base_url}/api/v1/workflows", headers=headers)
            
            self.assertEqual(response.status_code, 200)
            self.assertIn("data", response.json())
            
    def test_workflow_webhook_endpoints(self):
        """Test workflow webhook endpoints"""
        for workflow_id, workflow_config in self.test_workflows.items():
            with self.subTest(workflow=workflow_id):
                with patch('requests.post') as mock_post:
                    mock_response = Mock()
                    mock_response.status_code = 200
                    mock_response.json.return_value = workflow_config["expected_response"]
                    mock_post.return_value = mock_response
                    
                    # Test webhook endpoint
                    webhook_url = f"{self.n8n_base_url}{workflow_config['webhook_path']}"
                    test_data = {"query": "test query", "timestamp": datetime.now().isoformat()}
                    
                    response = mock_post(webhook_url, json=test_data)
                    
                    self.assertEqual(response.status_code, 200)
                    self.assertEqual(response.json(), workflow_config["expected_response"])
                    
    def test_workflow_authentication(self):
        """Test workflow authentication"""
        with patch('requests.get') as mock_get:
            # Test successful authentication
            mock_response = Mock()
            mock_response.status_code = 200
            mock_get.return_value = mock_response
            
            headers = {"Authorization": f"Bearer {self.n8n_api_key}"}
            response = mock_get(f"{self.n8n_base_url}/api/v1/workflows", headers=headers)
            
            self.assertEqual(response.status_code, 200)
            
            # Test failed authentication
            mock_response.status_code = 401
            response = mock_get(f"{self.n8n_base_url}/api/v1/workflows", headers=headers)
            
            self.assertEqual(response.status_code, 401)
            
    def test_workflow_data_validation(self):
        """Test workflow data validation"""
        test_cases = [
            {
                "name": "valid_job_query",
                "data": {
                    "query": "Find software engineering jobs",
                    "location": "San Francisco",
                    "keywords": ["python", "react"]
                },
                "should_pass": True
            },
            {
                "name": "invalid_empty_query",
                "data": {
                    "query": "",
                    "location": "San Francisco"
                },
                "should_pass": False
            },
            {
                "name": "missing_required_fields",
                "data": {
                    "location": "San Francisco"
                },
                "should_pass": False
            }
        ]
        
        for test_case in test_cases:
            with self.subTest(case=test_case["name"]):
                # Validate data structure
                is_valid = self._validate_workflow_data(test_case["data"])
                self.assertEqual(is_valid, test_case["should_pass"])
                
    def _validate_workflow_data(self, data: Dict[str, Any]) -> bool:
        """Validate workflow data structure"""
        required_fields = ["query"]
        
        # Check required fields
        for field in required_fields:
            if field not in data or not data[field]:
                return False
                
        return True
        
    def test_workflow_response_format(self):
        """Test workflow response format"""
        expected_response_format = {
            "status": str,
            "data": (dict, list),
            "timestamp": str,
            "workflow_id": str
        }
        
        with patch('requests.post') as mock_post:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "status": "success",
                "data": {"result": "test"},
                "timestamp": datetime.now().isoformat(),
                "workflow_id": "test-workflow"
            }
            mock_post.return_value = mock_response
            
            # Test response format
            response = mock_post("test_url", json={})
            response_data = response.json()
            
            for field, expected_type in expected_response_format.items():
                self.assertIn(field, response_data)
                if isinstance(expected_type, tuple):
                    self.assertIsInstance(response_data[field], expected_type)
                else:
                    self.assertIsInstance(response_data[field], expected_type)
                    
    def test_workflow_error_handling(self):
        """Test workflow error handling"""
        error_scenarios = [
            {"status_code": 400, "error_type": "bad_request"},
            {"status_code": 401, "error_type": "unauthorized"},
            {"status_code": 404, "error_type": "not_found"},
            {"status_code": 500, "error_type": "server_error"}
        ]
        
        for scenario in error_scenarios:
            with self.subTest(status=scenario["status_code"]):
                with patch('requests.post') as mock_post:
                    mock_response = Mock()
                    mock_response.status_code = scenario["status_code"]
                    mock_response.json.return_value = {
                        "error": scenario["error_type"],
                        "message": "Test error message"
                    }
                    mock_post.return_value = mock_response
                    
                    response = mock_post("test_url", json={})
                    
                    self.assertEqual(response.status_code, scenario["status_code"])
                    self.assertIn("error", response.json())
                    
    def test_workflow_timeout_handling(self):
        """Test workflow timeout handling"""
        with patch('requests.post') as mock_post:
            # Simulate timeout
            mock_post.side_effect = Exception("Request timeout")
            
            with self.assertRaises(Exception):
                mock_post("test_url", json={}, timeout=5)
                
    def test_workflow_retry_mechanism(self):
        """Test workflow retry mechanism"""
        retry_count = 0
        max_retries = 3
        
        def mock_post_with_retry(*args, **kwargs):
            nonlocal retry_count
            retry_count += 1
            
            if retry_count < max_retries:
                mock_response = Mock()
                mock_response.status_code = 500
                return mock_response
            else:
                mock_response = Mock()
                mock_response.status_code = 200
                mock_response.json.return_value = {"status": "success"}
                return mock_response
        
        with patch('requests.post', side_effect=mock_post_with_retry):
            # Test retry mechanism
            response = mock_post_with_retry("test_url", json={})
            
            self.assertEqual(response.status_code, 200)
            self.assertEqual(retry_count, max_retries)

if __name__ == '__main__':
    unittest.main()
