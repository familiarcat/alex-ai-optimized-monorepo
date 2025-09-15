#!/usr/bin/env python3
"""
Alex AI Lottie Animation Integration System
Integrates Lottie animation capabilities into the Alex AI CLI and RAG system
"""

import json
import os
import sys
import requests
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

from scripts.utilities.shared_functions import *

@dataclass
class LottieAnimation:
    """Lottie animation data structure"""
    id: str
    name: str
    url: str
    animation_data: Dict[str, Any]
    design_theory: str  # 'carson', 'brockmann', 'hybrid'
    visual_style: str
    interaction_type: str
    element_type: str
    confidence_score: float
    color_scheme: Dict[str, str]
    created_at: str
    tags: List[str]

@dataclass
class LottieSearchResult:
    """Lottie search result from external sources"""
    id: str
    title: str
    description: str
    url: str
    preview_url: str
    downloads: int
    likes: int
    tags: List[str]
    dimensions: Dict[str, int]
    duration: float
    author: str

class AlexAILottieIntegration:
    """Main Lottie integration system for Alex AI"""
    
    def __init__(self, supabase_client=None, openai_client=None):
        self.supabase = supabase_client
        self.openai = openai_client
        self.project_root = project_root
        self.lottie_cache = {}
        self.design_theory_configs = self._load_design_theory_configs()
        
    def _load_design_theory_configs(self) -> Dict[str, Dict[str, Any]]:
        """Load design theory configurations"""
        return {
            'carson': {
                'characteristics': ['experimental', 'chaotic', 'bold', 'unconventional', 'deconstructive'],
                'keywords': ['glitch', 'distortion', 'chaos', 'random', 'experimental', 'bold'],
                'color_schemes': ['orange', 'red', 'yellow', 'pink'],
                'intensity': 'high',
                'randomness': 0.3
            },
            'brockmann': {
                'characteristics': ['systematic', 'minimal', 'functional', 'precise', 'grid-based'],
                'keywords': ['minimal', 'clean', 'systematic', 'precise', 'functional', 'grid'],
                'color_schemes': ['blue', 'gray', 'white', 'black'],
                'intensity': 'low',
                'randomness': 0.0
            },
            'hybrid': {
                'characteristics': ['balanced', 'modern', 'accessible', 'innovative'],
                'keywords': ['modern', 'balanced', 'innovative', 'accessible', 'dynamic'],
                'color_schemes': ['purple', 'teal', 'green', 'indigo'],
                'intensity': 'medium',
                'randomness': 0.1
            }
        }
    
    async def search_lottie_animations(self, query: str, design_theory: str = 'hybrid', limit: int = 10) -> List[LottieSearchResult]:
        """Search for Lottie animations based on query and design theory"""
        try:
            # Get design theory keywords
            theory_config = self.design_theory_configs.get(design_theory, self.design_theory_configs['hybrid'])
            keywords = theory_config['keywords']
            
            # Enhanced search query
            enhanced_query = f"{query} {' '.join(keywords[:3])}"
            
            # Simulate LottieFiles API search (in real implementation, use actual API)
            search_results = await self._simulate_lottie_search(enhanced_query, limit)
            
            # Score results based on design theory alignment
            scored_results = []
            for result in search_results:
                score = self._score_animation_for_design_theory(result, design_theory)
                result.confidence_score = score
                scored_results.append(result)
            
            # Sort by confidence score
            scored_results.sort(key=lambda x: x.confidence_score, reverse=True)
            
            return scored_results[:limit]
            
        except Exception as e:
            logger.error(f"Error searching Lottie animations: {e}")
            return []
    
    async def _simulate_lottie_search(self, query: str, limit: int) -> List[LottieSearchResult]:
        """Simulate LottieFiles search (replace with actual API call)"""
        # Mock data for demonstration
        mock_results = [
            LottieSearchResult(
                id="1",
                title="Abstract Loading Spinner",
                description="Modern loading animation with smooth transitions",
                url="https://lottiefiles.com/animations/abstract-loading",
                preview_url="https://assets.lottiefiles.com/preview.json",
                downloads=1500,
                likes=89,
                tags=["loading", "spinner", "abstract", "modern"],
                dimensions={"width": 200, "height": 200},
                duration=2.0,
                author="LottieCreator"
            ),
            LottieSearchResult(
                id="2",
                title="CTA Button Hover Effect",
                description="Interactive button animation for call-to-action elements",
                url="https://lottiefiles.com/animations/cta-button-hover",
                preview_url="https://assets.lottiefiles.com/preview2.json",
                downloads=2300,
                likes=156,
                tags=["button", "hover", "interactive", "cta"],
                dimensions={"width": 300, "height": 100},
                duration=1.5,
                author="UIAnimator"
            ),
            LottieSearchResult(
                id="3",
                title="Chaotic Glitch Effect",
                description="Experimental glitch animation for bold designs",
                url="https://lottiefiles.com/animations/chaotic-glitch",
                preview_url="https://assets.lottiefiles.com/preview3.json",
                downloads=800,
                likes=45,
                tags=["glitch", "experimental", "chaotic", "bold"],
                dimensions={"width": 400, "height": 300},
                duration=3.0,
                author="ExperimentalDesigner"
            )
        ]
        
        # Filter by query relevance
        filtered_results = []
        query_lower = query.lower()
        for result in mock_results:
            if any(tag in query_lower for tag in result.tags) or query_lower in result.title.lower():
                filtered_results.append(result)
        
        return filtered_results[:limit]
    
    def _score_animation_for_design_theory(self, result: LottieSearchResult, design_theory: str) -> float:
        """Score animation based on design theory alignment"""
        theory_config = self.design_theory_configs.get(design_theory, self.design_theory_configs['hybrid'])
        characteristics = theory_config['characteristics']
        keywords = theory_config['keywords']
        
        score = 0.0
        
        # Score based on title and description
        text_content = f"{result.title} {result.description}".lower()
        for keyword in keywords:
            if keyword in text_content:
                score += 0.2
        
        # Score based on tags
        for tag in result.tags:
            if tag in keywords:
                score += 0.15
        
        # Score based on popularity (normalized)
        popularity_score = min(result.downloads / 10000, 1.0) * 0.1
        score += popularity_score
        
        # Score based on likes (normalized)
        likes_score = min(result.likes / 1000, 1.0) * 0.1
        score += likes_score
        
        return min(score, 1.0)
    
    async def generate_lottie_animation(self, element_type: str, design_theory: str, visual_style: str) -> LottieAnimation:
        """Generate a Lottie animation based on element type and design theory"""
        try:
            theory_config = self.design_theory_configs.get(design_theory, self.design_theory_configs['hybrid'])
            
            # Generate animation data based on element type and design theory
            animation_data = self._generate_animation_data(element_type, design_theory, visual_style)
            
            # Create Lottie animation object
            animation = LottieAnimation(
                id=f"generated_{element_type}_{design_theory}_{int(datetime.now().timestamp())}",
                name=f"{element_type.title()} {design_theory.title()} Animation",
                url="",  # Generated animations don't have external URLs
                animation_data=animation_data,
                design_theory=design_theory,
                visual_style=visual_style,
                interaction_type=self._get_interaction_type(element_type),
                element_type=element_type,
                confidence_score=0.8,  # High confidence for generated animations
                color_scheme=self._get_color_scheme(design_theory),
                created_at=datetime.now().isoformat(),
                tags=theory_config['characteristics'] + [element_type, visual_style]
            )
            
            return animation
            
        except Exception as e:
            logger.error(f"Error generating Lottie animation: {e}")
            return None
    
    def _generate_animation_data(self, element_type: str, design_theory: str, visual_style: str) -> Dict[str, Any]:
        """Generate Lottie animation data based on parameters"""
        theory_config = self.design_theory_configs.get(design_theory, self.design_theory_configs['hybrid'])
        
        # Base animation structure
        animation_data = {
            "v": "5.7.4",
            "fr": 30,
            "ip": 0,
            "op": 90,  # 3 seconds at 30fps
            "w": 400,
            "h": 300,
            "nm": f"{element_type}_{design_theory}_animation",
            "ddd": 0,
            "assets": [],
            "layers": []
        }
        
        # Add design theory specific properties
        if design_theory == 'carson':
            animation_data.update({
                "fr": 24,  # Lower frame rate for chaotic effect
                "op": 120,  # Longer duration
                "w": 600,   # Larger dimensions
                "h": 400
            })
        elif design_theory == 'brockmann':
            animation_data.update({
                "fr": 60,  # Higher frame rate for precision
                "op": 60,  # Shorter duration
                "w": 300,  # Smaller dimensions
                "h": 200
            })
        
        return animation_data
    
    def _get_interaction_type(self, element_type: str) -> str:
        """Get interaction type based on element type"""
        interaction_map = {
            'button': 'click',
            'card': 'hover',
            'navigation': 'hover',
            'form': 'focus',
            'hero': 'scroll',
            'footer': 'hover',
            'sidebar': 'hover',
            'modal': 'click',
            'tooltip': 'hover',
            'badge': 'hover',
            'progress': 'load',
            'notification': 'click'
        }
        return interaction_map.get(element_type, 'hover')
    
    def _get_color_scheme(self, design_theory: str) -> Dict[str, str]:
        """Get color scheme based on design theory"""
        color_schemes = {
            'carson': {
                'primary': '#FF6633',
                'secondary': '#33FFCC',
                'accent': '#FF33CC',
                'background': '#0D0D0D',
                'text': '#FFFFFF'
            },
            'brockmann': {
                'primary': '#0080FF',
                'secondary': '#333333',
                'accent': '#FFFFFF',
                'background': '#F2F2F2',
                'text': '#1A1A1A'
            },
            'hybrid': {
                'primary': '#33CCFF',
                'secondary': '#CC33FF',
                'accent': '#FF9900',
                'background': '#1A1A1A',
                'text': '#E6E6E6'
            }
        }
        return color_schemes.get(design_theory, color_schemes['hybrid'])
    
    async def store_lottie_knowledge(self, animation: LottieAnimation) -> bool:
        """Store Lottie animation knowledge in Supabase RAG system"""
        try:
            if not self.supabase:
                logger.warning("Supabase client not available, storing locally")
                return self._store_locally(animation)
            
            # Create memory content
            memory_content = f"""
            Lottie Animation: {animation.name}
            Design Theory: {animation.design_theory}
            Visual Style: {animation.visual_style}
            Element Type: {animation.element_type}
            Interaction Type: {animation.interaction_type}
            Confidence Score: {animation.confidence_score}
            Tags: {', '.join(animation.tags)}
            Color Scheme: {json.dumps(animation.color_scheme)}
            Created: {animation.created_at}
            
            Animation Data: {json.dumps(animation.animation_data, indent=2)}
            """
            
            # Generate embedding
            embedding = await self._generate_embedding(memory_content)
            
            # Store in Supabase
            result = self.supabase.table('crew_memories').insert({
                'id': f"lottie_{animation.id}",
                'content': memory_content,
                'embedding': embedding,
                'project_id': 'alex-ai-artist-management',
                'crew_member': 'commander_data',  # Data handles technical analysis
                'memory_type': 'lottie_animation',
                'importance_score': animation.confidence_score,
                'tags': animation.tags,
                'created_by': 'alex-ai-lottie-system'
            }).execute()
            
            if result.data:
                logger.info(f"Successfully stored Lottie animation knowledge: {animation.name}")
                return True
            else:
                logger.error("Failed to store Lottie animation knowledge")
                return False
                
        except Exception as e:
            logger.error(f"Error storing Lottie knowledge: {e}")
            return False
    
    def _store_locally(self, animation: LottieAnimation) -> bool:
        """Store animation locally when Supabase is not available"""
        try:
            local_storage_path = self.project_root / "data" / "lottie_animations"
            local_storage_path.mkdir(parents=True, exist_ok=True)
            
            # Store animation data
            animation_file = local_storage_path / f"{animation.id}.json"
            with open(animation_file, 'w') as f:
                json.dump({
                    'id': animation.id,
                    'name': animation.name,
                    'design_theory': animation.design_theory,
                    'visual_style': animation.visual_style,
                    'element_type': animation.element_type,
                    'interaction_type': animation.interaction_type,
                    'confidence_score': animation.confidence_score,
                    'color_scheme': animation.color_scheme,
                    'created_at': animation.created_at,
                    'tags': animation.tags,
                    'animation_data': animation.animation_data
                }, f, indent=2)
            
            logger.info(f"Stored Lottie animation locally: {animation_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error storing locally: {e}")
            return False
    
    async def _generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text"""
        try:
            if self.openai:
                response = self.openai.embeddings.create(
                    input=text,
                    model="text-embedding-3-small"
                )
                return response.data[0].embedding
            else:
                # Fallback: simple hash-based embedding
                return self._hash_based_embedding(text)
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return self._hash_based_embedding(text)
    
    def _hash_based_embedding(self, text: str) -> List[float]:
        """Fallback embedding using text hashing"""
        hash_obj = hashlib.sha256(text.encode())
        hash_bytes = hash_obj.digest()
        embedding = []
        for i in range(0, len(hash_bytes), 2):
            if i + 1 < len(hash_bytes):
                val = int.from_bytes(hash_bytes[i:i+2], 'big')
                embedding.append(val / 65535.0)
        
        while len(embedding) < 1536:
            embedding.append(0.0)
        return embedding[:1536]
    
    async def search_lottie_memories(self, query: str, design_theory: str = None) -> List[Dict[str, Any]]:
        """Search stored Lottie animation memories"""
        try:
            if not self.supabase:
                return self._search_local_memories(query, design_theory)
            
            # Generate query embedding
            query_embedding = await self._generate_embedding(query)
            
            # Search in Supabase
            result = self.supabase.rpc('match_memories', {
                'query_embedding': query_embedding,
                'match_threshold': 0.7,
                'match_count': 10,
                'memory_type': 'lottie_animation'
            }).execute()
            
            if result.data:
                return result.data
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error searching Lottie memories: {e}")
            return []
    
    def _search_local_memories(self, query: str, design_theory: str = None) -> List[Dict[str, Any]]:
        """Search local Lottie memories when Supabase is not available"""
        try:
            local_storage_path = self.project_root / "data" / "lottie_animations"
            if not local_storage_path.exists():
                return []
            
            results = []
            query_lower = query.lower()
            
            for animation_file in local_storage_path.glob("*.json"):
                with open(animation_file, 'r') as f:
                    animation_data = json.load(f)
                
                # Simple text matching
                content = f"{animation_data.get('name', '')} {animation_data.get('tags', [])}".lower()
                if query_lower in content:
                    if design_theory is None or animation_data.get('design_theory') == design_theory:
                        results.append(animation_data)
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching local memories: {e}")
            return []
    
    async def create_n8n_lottie_workflow(self) -> bool:
        """Create N8N workflow for Lottie animation management"""
        try:
            workflow_data = {
                "name": "Alex AI Lottie Animation Manager",
                "nodes": [
                    {
                        "id": "lottie-search",
                        "name": "Search Lottie Animations",
                        "type": "n8n-nodes-base.httpRequest",
                        "parameters": {
                            "url": "https://api.lottiefiles.com/v1/animations/search",
                            "method": "GET",
                            "qs": {
                                "q": "={{ $json.query }}",
                                "limit": "={{ $json.limit || 10 }}"
                            }
                        }
                    },
                    {
                        "id": "design-theory-analysis",
                        "name": "Design Theory Analysis",
                        "type": "n8n-nodes-base.function",
                        "parameters": {
                            "functionCode": """
                            const designTheory = $json.design_theory || 'hybrid';
                            const results = $input.all();
                            
                            return results.map(item => ({
                                ...item.json,
                                design_theory_score: calculateDesignTheoryScore(item.json, designTheory)
                            }));
                            
                            function calculateDesignTheoryScore(animation, theory) {
                                // Implementation for scoring animations based on design theory
                                return Math.random() * 0.5 + 0.5; // Placeholder
                            }
                            """
                        }
                    },
                    {
                        "id": "store-memory",
                        "name": "Store in Supabase RAG",
                        "type": "n8n-nodes-base.supabase",
                        "parameters": {
                            "operation": "insert",
                            "table": "crew_memories",
                            "columns": {
                                "id": "={{ $json.id }}",
                                "content": "={{ $json.content }}",
                                "embedding": "={{ $json.embedding }}",
                                "project_id": "alex-ai-artist-management",
                                "crew_member": "commander_data",
                                "memory_type": "lottie_animation",
                                "importance_score": "={{ $json.confidence_score }}",
                                "tags": "={{ $json.tags }}"
                            }
                        }
                    }
                ],
                "connections": {
                    "lottie-search": {
                        "main": [["design-theory-analysis"]]
                    },
                    "design-theory-analysis": {
                        "main": [["store-memory"]]
                    }
                }
            }
            
            # Store workflow locally
            workflow_file = self.project_root / "workflows" / "lottie-animation-manager.json"
            workflow_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(workflow_file, 'w') as f:
                json.dump(workflow_data, f, indent=2)
            
            logger.info(f"Created N8N Lottie workflow: {workflow_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error creating N8N workflow: {e}")
            return False

async def main():
    """Main function for CLI usage"""
    print("🎨 Alex AI Lottie Animation Integration System")
    print("=" * 50)
    
    # Initialize system
    lottie_system = AlexAILottieIntegration()
    
    # Example usage
    print("\n🔍 Searching for Lottie animations...")
    search_results = await lottie_system.search_lottie_animations(
        query="button hover animation",
        design_theory="carson",
        limit=5
    )
    
    print(f"Found {len(search_results)} animations")
    for result in search_results:
        print(f"  - {result.title} (Score: {result.confidence_score:.2f})")
    
    print("\n🎨 Generating custom animation...")
    custom_animation = await lottie_system.generate_lottie_animation(
        element_type="button",
        design_theory="carson",
        visual_style="experimental"
    )
    
    if custom_animation:
        print(f"Generated: {custom_animation.name}")
        print(f"Design Theory: {custom_animation.design_theory}")
        print(f"Confidence: {custom_animation.confidence_score}")
        
        # Store in RAG system
        print("\n💾 Storing in RAG system...")
        stored = await lottie_system.store_lottie_knowledge(custom_animation)
        if stored:
            print("✅ Successfully stored in RAG system")
        else:
            print("❌ Failed to store in RAG system")
    
    print("\n🔄 Creating N8N workflow...")
    workflow_created = await lottie_system.create_n8n_lottie_workflow()
    if workflow_created:
        print("✅ N8N workflow created successfully")
    else:
        print("❌ Failed to create N8N workflow")
    
    print("\n🎉 Lottie integration complete!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
