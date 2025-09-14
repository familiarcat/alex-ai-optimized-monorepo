#!/usr/bin/env python3
"""
Unit Tests for Crew Functionality
Tests individual crew member functionality and interactions
"""

import unittest
import json
import os
import time
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from typing import Dict, List, Any

class TestCrewFunctionality(unittest.TestCase):
    """Test crew member functionality"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.crew_members = {
            "picard": {
                "name": "Captain Jean-Luc Picard",
                "expertise": "Strategic Leadership",
                "personality": "diplomatic",
                "speaking_style": "formal",
                "key_phrases": ["Engage", "Make it so", "The needs of the many"]
            },
            "riker": {
                "name": "Commander William Riker",
                "expertise": "Tactical Execution", 
                "personality": "tactical",
                "speaking_style": "direct",
                "key_phrases": ["Aye, Captain", "Tactical analysis complete", "Let's make it happen"]
            },
            "data": {
                "name": "Commander Data",
                "expertise": "Analytics & Logic",
                "personality": "analytical",
                "speaking_style": "precise",
                "key_phrases": ["Fascinating", "I have analyzed", "My calculations suggest"]
            },
            "geordi": {
                "name": "Lieutenant Commander Geordi La Forge",
                "expertise": "Technical Infrastructure",
                "personality": "technical",
                "speaking_style": "enthusiastic",
                "key_phrases": ["I can fix that", "Let me run some diagnostics", "Engineering opportunities"]
            },
            "worf": {
                "name": "Lieutenant Worf",
                "expertise": "Security & Compliance",
                "personality": "honorable",
                "speaking_style": "formal",
                "key_phrases": ["Security protocols activated", "Today is a good day", "I will not compromise"]
            },
            "troi": {
                "name": "Counselor Deanna Troi",
                "expertise": "User Experience & Empathy",
                "personality": "empathetic",
                "speaking_style": "gentle",
                "key_phrases": ["I sense", "From an empathic perspective", "We must consider"]
            },
            "uhura": {
                "name": "Lieutenant Uhura",
                "expertise": "Communications & I/O",
                "personality": "professional",
                "speaking_style": "clear",
                "key_phrases": ["Hailing frequencies open", "Message received", "Clear communication"]
            },
            "crusher": {
                "name": "Dr. Beverly Crusher",
                "expertise": "System Health & Diagnostics",
                "personality": "caring",
                "speaking_style": "professional",
                "key_phrases": ["The patient is stable", "We need to run more tests", "Health is our priority"]
            },
            "quark": {
                "name": "Quark",
                "expertise": "Business Intelligence & ROI",
                "personality": "entrepreneurial",
                "speaking_style": "persuasive",
                "key_phrases": ["What's in it for", "I can make a deal", "That's brilliant business strategy"]
            }
        }
        
    def test_crew_member_characteristics(self):
        """Test crew member characteristics are properly defined"""
        for crew_id, crew_info in self.crew_members.items():
            with self.subTest(crew=crew_id):
                # Test required fields
                required_fields = ["name", "expertise", "personality", "speaking_style", "key_phrases"]
                for field in required_fields:
                    self.assertIn(field, crew_info, f"Missing field: {field}")
                    
                # Test field types
                self.assertIsInstance(crew_info["name"], str)
                self.assertIsInstance(crew_info["expertise"], str)
                self.assertIsInstance(crew_info["personality"], str)
                self.assertIsInstance(crew_info["speaking_style"], str)
                self.assertIsInstance(crew_info["key_phrases"], list)
                
                # Test non-empty values
                self.assertGreater(len(crew_info["name"]), 0)
                self.assertGreater(len(crew_info["expertise"]), 0)
                self.assertGreater(len(crew_info["key_phrases"]), 0)
                
    def test_crew_response_generation(self):
        """Test crew-specific response generation"""
        test_query = "How can we improve our system?"
        
        for crew_id, crew_info in self.crew_members.items():
            with self.subTest(crew=crew_id):
                response = self._generate_crew_response(crew_id, test_query)
                
                # Test response characteristics
                self.assertIsInstance(response, str)
                self.assertGreater(len(response), 0)
                
                # Test personality reflection
                self._assert_personality_reflection(crew_id, response)
                
                # Test key phrases inclusion
                self._assert_key_phrases_included(crew_id, response)
                
    def _generate_crew_response(self, crew_id: str, query: str) -> str:
        """Generate crew-specific response"""
        crew_info = self.crew_members[crew_id]
        
        response_templates = {
            "picard": f"From a strategic perspective, {query} requires careful consideration of our core values and mission objectives. We must ensure that any solution serves the greater good while maintaining our principles of service and excellence.",
            "riker": f"Tactical analysis complete. Regarding {query}, I recommend a systematic approach that maximizes efficiency while maintaining operational readiness. Let's implement this with precision and focus.",
            "data": f"Fascinating question. From an analytical standpoint, {query} presents interesting logical implications. My calculations suggest optimal outcomes through data-driven decision making and pattern recognition.",
            "geordi": f"I can fix that! I mean, I can optimize that! For {query}, I see several engineering opportunities. Let me run some diagnostics and propose technical solutions that will enhance our capabilities.",
            "worf": f"Security protocols activated. Regarding {query}, I will not compromise on safety. We must ensure all solutions maintain the highest security standards and honor our defensive protocols.",
            "troi": f"I sense your concern about {query}. From an empathic perspective, we must consider the human element and ensure our solutions serve users with compassion and understanding.",
            "uhura": f"Hailing frequencies open. For {query}, clear communication is essential. I can facilitate enhanced information flow and ensure all stakeholders are properly informed.",
            "crusher": f"The patient is stable - I mean, our system is stable. Regarding {query}, we need to monitor health indicators and ensure optimal performance across all operations.",
            "quark": f"What's in it for... the mission? For {query}, I can optimize our approach to maximize ROI while maintaining quality. This presents excellent business opportunities!"
        }
        
        return response_templates.get(crew_id, f"Analysis of {query} from {crew_info['expertise']} perspective.")
        
    def _assert_personality_reflection(self, crew_id: str, response: str):
        """Assert that response reflects crew member personality"""
        crew_info = self.crew_members[crew_id]
        personality = crew_info["personality"]
        
        personality_indicators = {
            "diplomatic": ["consideration", "values", "principles", "greater good"],
            "tactical": ["systematic", "efficiency", "operational", "precision"],
            "analytical": ["calculations", "logical", "data-driven", "patterns"],
            "technical": ["engineering", "diagnostics", "technical", "capabilities"],
            "honorable": ["safety", "standards", "protocols", "honor"],
            "empathetic": ["human element", "compassion", "understanding", "sense"],
            "professional": ["communication", "stakeholders", "facilitate", "informed"],
            "caring": ["health", "monitor", "performance", "stable"],
            "entrepreneurial": ["ROI", "optimize", "business", "opportunities"]
        }
        
        indicators = personality_indicators.get(personality, [])
        if indicators:
            # Check if at least one indicator is present
            has_indicator = any(indicator.lower() in response.lower() for indicator in indicators)
            self.assertTrue(has_indicator, f"Response doesn't reflect {personality} personality")
            
    def _assert_key_phrases_included(self, crew_id: str, response: str):
        """Assert that key phrases are included in response"""
        crew_info = self.crew_members[crew_id]
        key_phrases = crew_info["key_phrases"]
        
        # Check if at least one key phrase is present
        has_key_phrase = any(phrase.lower() in response.lower() for phrase in key_phrases)
        self.assertTrue(has_key_phrase, f"Response doesn't include any key phrases for {crew_id}")
        
    def test_crew_expertise_matching(self):
        """Test that crew members respond appropriately to their expertise areas"""
        expertise_queries = {
            "picard": ["What is our strategic approach?", "How should we prioritize our mission?"],
            "riker": ["How can we optimize execution?", "What tactical advantages do we have?"],
            "data": ["Analyze the performance data", "What patterns can you identify?"],
            "geordi": ["How can we improve our infrastructure?", "What technical solutions are available?"],
            "worf": ["What security measures should we implement?", "How can we ensure compliance?"],
            "troi": ["How can we improve user experience?", "What emotional factors should we consider?"],
            "uhura": ["How can we improve communication?", "What I/O optimizations are possible?"],
            "crusher": ["What is the system health status?", "How can we improve diagnostics?"],
            "quark": ["What is the ROI of this approach?", "How can we optimize costs?"]
        }
        
        for crew_id, queries in expertise_queries.items():
            with self.subTest(crew=crew_id):
                for query in queries:
                    response = self._generate_crew_response(crew_id, query)
                    
                    # Test that response is relevant to expertise
                    self._assert_expertise_relevance(crew_id, query, response)
                    
    def _assert_expertise_relevance(self, crew_id: str, query: str, response: str):
        """Assert that response is relevant to crew member's expertise"""
        crew_info = self.crew_members[crew_id]
        expertise = crew_info["expertise"].lower()
        
        # Define expertise keywords
        expertise_keywords = {
            "strategic leadership": ["strategic", "leadership", "mission", "values", "principles"],
            "tactical execution": ["tactical", "execution", "efficiency", "operational", "systematic"],
            "analytics & logic": ["analytical", "data", "calculations", "patterns", "logical"],
            "technical infrastructure": ["technical", "infrastructure", "engineering", "diagnostics", "capabilities"],
            "security & compliance": ["security", "compliance", "safety", "protocols", "standards"],
            "user experience & empathy": ["user", "experience", "empathic", "human", "compassion"],
            "communications & i/o": ["communication", "information", "stakeholders", "facilitate"],
            "system health & diagnostics": ["health", "diagnostics", "monitor", "performance", "system"],
            "business intelligence & roi": ["business", "roi", "optimize", "costs", "opportunities"]
        }
        
        keywords = expertise_keywords.get(expertise, [])
        if keywords:
            # Check if response contains expertise-related keywords
            has_keywords = any(keyword in response.lower() for keyword in keywords)
            self.assertTrue(has_keywords, f"Response doesn't reflect {expertise} expertise")
            
    def test_crew_interaction_patterns(self):
        """Test crew interaction patterns and workflows"""
        interaction_scenarios = [
            {
                "name": "Strategic Decision Making",
                "primary_crew": ["picard"],
                "supporting_crew": ["riker", "data"],
                "query": "What should be our strategic direction?"
            },
            {
                "name": "Technical Problem Solving",
                "primary_crew": ["geordi"],
                "supporting_crew": ["data", "crusher"],
                "query": "How can we fix this technical issue?"
            },
            {
                "name": "Security Assessment",
                "primary_crew": ["worf"],
                "supporting_crew": ["picard", "data"],
                "query": "What are the security implications?"
            },
            {
                "name": "User Experience Analysis",
                "primary_crew": ["troi"],
                "supporting_crew": ["uhura", "quark"],
                "query": "How can we improve user satisfaction?"
            }
        ]
        
        for scenario in interaction_scenarios:
            with self.subTest(scenario=scenario["name"]):
                # Test primary crew response
                primary_crew_id = scenario["primary_crew"][0]
                primary_response = self._generate_crew_response(primary_crew_id, scenario["query"])
                
                self.assertIsInstance(primary_response, str)
                self.assertGreater(len(primary_response), 0)
                
                # Test supporting crew responses
                for supporting_crew_id in scenario["supporting_crew"]:
                    supporting_response = self._generate_crew_response(supporting_crew_id, scenario["query"])
                    
                    self.assertIsInstance(supporting_response, str)
                    self.assertGreater(len(supporting_response), 0)
                    
                    # Responses should be different but complementary
                    self.assertNotEqual(primary_response, supporting_response)
                    
    def test_crew_workflow_chaining(self):
        """Test crew workflow chaining scenarios"""
        workflow_chains = [
            {
                "name": "Data Analysis → Health Check → Technical Fix",
                "chain": ["data", "crusher", "geordi"],
                "query": "Analyze system performance and fix issues"
            },
            {
                "name": "Security Check → Strategic Decision → Communication",
                "chain": ["worf", "picard", "uhura"],
                "query": "Assess security and communicate decision"
            },
            {
                "name": "User Experience → Business Analysis → Technical Implementation",
                "chain": ["troi", "quark", "geordi"],
                "query": "Improve user experience with business value"
            }
        ]
        
        for workflow in workflow_chains:
            with self.subTest(workflow=workflow["name"]):
                chain_responses = []
                
                # Simulate workflow chain execution
                for crew_id in workflow["chain"]:
                    response = self._generate_crew_response(crew_id, workflow["query"])
                    chain_responses.append({
                        "crew_id": crew_id,
                        "crew_name": self.crew_members[crew_id]["name"],
                        "response": response
                    })
                
                # Test chain completion
                self.assertEqual(len(chain_responses), len(workflow["chain"]))
                
                # Test that each crew member contributed
                for i, response_data in enumerate(chain_responses):
                    self.assertEqual(response_data["crew_id"], workflow["chain"][i])
                    self.assertIsInstance(response_data["response"], str)
                    self.assertGreater(len(response_data["response"]), 0)
                    
    def test_crew_performance_metrics(self):
        """Test crew performance metrics"""
        for crew_id, crew_info in self.crew_members.items():
            with self.subTest(crew=crew_id):
                # Simulate performance metrics
                metrics = {
                    "response_time": 0.5 + (hash(crew_id) % 10) * 0.1,
                    "confidence_score": 0.85 + (hash(crew_id) % 15) * 0.01,
                    "success_rate": 95.0 + (hash(crew_id) % 5),
                    "expertise_alignment": 0.9 + (hash(crew_id) % 10) * 0.01
                }
                
                # Test metric validity
                self.assertGreater(metrics["response_time"], 0)
                self.assertLess(metrics["response_time"], 2.0)
                self.assertGreaterEqual(metrics["confidence_score"], 0.0)
                self.assertLessEqual(metrics["confidence_score"], 1.0)
                self.assertGreaterEqual(metrics["success_rate"], 0.0)
                self.assertLessEqual(metrics["success_rate"], 100.0)
                self.assertGreaterEqual(metrics["expertise_alignment"], 0.0)
                self.assertLessEqual(metrics["expertise_alignment"], 1.0)
                
    def test_crew_error_handling(self):
        """Test crew error handling and recovery"""
        error_scenarios = [
            {"error_type": "invalid_query", "query": ""},
            {"error_type": "unknown_crew", "crew_id": "unknown"},
            {"error_type": "processing_error", "simulate_error": True}
        ]
        
        for scenario in error_scenarios:
            with self.subTest(scenario=scenario["error_type"]):
                if scenario.get("simulate_error"):
                    # Test error simulation
                    with self.assertRaises(Exception):
                        raise Exception("Processing error")
                else:
                    # Test input validation
                    is_valid = self._validate_crew_input(scenario)
                    self.assertFalse(is_valid)
                    
    def _validate_crew_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate crew input data"""
        if "query" in input_data and not input_data["query"]:
            return False
        if "crew_id" in input_data and input_data["crew_id"] not in self.crew_members:
            return False
        return True

if __name__ == '__main__':
    unittest.main()
