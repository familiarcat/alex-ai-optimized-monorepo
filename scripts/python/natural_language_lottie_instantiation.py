#!/usr/bin/env python3
"""
Natural Language Lottie Instantiation System
Provides natural language commands for Lottie animation integration
Works across Cursor AI and VS Code implementations
"""

import json
import os
import sys
import re
from typing import Dict, Any, List, Optional, Tuple
from pathlib import Path
from dataclasses import dataclass

# Project root
project_root = Path(__file__).parent.parent.parent

@dataclass
class LottieInstantiationRequest:
    """Natural language request for Lottie instantiation"""
    intent: str  # 'add', 'replace', 'enhance', 'create'
    element_type: str  # 'button', 'card', 'navigation', etc.
    design_theory: str  # 'carson', 'brockmann', 'hybrid'
    visual_style: str  # 'experimental', 'minimalist', 'bold', etc.
    interaction_type: str  # 'hover', 'click', 'scroll', etc.
    context: str  # Additional context
    priority: str  # 'high', 'medium', 'low'

class NaturalLanguageLottieInstantiator:
    """Natural language processor for Lottie animation instantiation"""
    
    def __init__(self):
        self.project_root = project_root
        self.design_theory_patterns = self._load_design_theory_patterns()
        self.element_type_patterns = self._load_element_type_patterns()
        self.interaction_patterns = self._load_interaction_patterns()
        self.visual_style_patterns = self._load_visual_style_patterns()
        
    def _load_design_theory_patterns(self) -> Dict[str, List[str]]:
        """Load natural language patterns for design theories"""
        return {
            'carson': [
                'experimental', 'chaotic', 'bold', 'unconventional', 'edgy',
                'rebellious', 'artistic', 'creative', 'wild', 'chaos',
                'deconstructive', 'fragmented', 'glitch', 'distortion'
            ],
            'brockmann': [
                'systematic', 'minimal', 'clean', 'precise', 'functional',
                'grid', 'organized', 'structured', 'methodical', 'swiss',
                'geometric', 'mathematical', 'orderly', 'professional'
            ],
            'hybrid': [
                'modern', 'balanced', 'accessible', 'innovative', 'contemporary',
                'smooth', 'polished', 'refined', 'elegant', 'sophisticated',
                'user-friendly', 'intuitive', 'welcoming'
            ]
        }
    
    def _load_element_type_patterns(self) -> Dict[str, List[str]]:
        """Load natural language patterns for element types"""
        return {
            'button': ['button', 'btn', 'cta', 'call-to-action', 'action', 'clickable'],
            'card': ['card', 'panel', 'container', 'box', 'tile', 'module'],
            'navigation': ['nav', 'menu', 'navigation', 'links', 'tabs', 'breadcrumb'],
            'form': ['form', 'input', 'field', 'textbox', 'textarea', 'select'],
            'hero': ['hero', 'banner', 'header', 'landing', 'main', 'top'],
            'footer': ['footer', 'bottom', 'end', 'close'],
            'sidebar': ['sidebar', 'side', 'panel', 'drawer', 'aside'],
            'modal': ['modal', 'popup', 'dialog', 'overlay', 'window'],
            'tooltip': ['tooltip', 'hint', 'tip', 'help', 'info'],
            'badge': ['badge', 'tag', 'label', 'chip', 'indicator'],
            'progress': ['progress', 'loading', 'spinner', 'bar', 'indicator'],
            'notification': ['notification', 'alert', 'message', 'toast', 'banner']
        }
    
    def _load_interaction_patterns(self) -> Dict[str, List[str]]:
        """Load natural language patterns for interaction types"""
        return {
            'hover': ['hover', 'mouseover', 'over', 'on hover', 'when hovering'],
            'click': ['click', 'tap', 'press', 'on click', 'when clicked'],
            'scroll': ['scroll', 'scrolling', 'on scroll', 'when scrolling'],
            'focus': ['focus', 'focused', 'on focus', 'when focused'],
            'load': ['load', 'loading', 'on load', 'when loaded'],
            'transition': ['transition', 'change', 'transform', 'morph'],
            'micro-interaction': ['micro', 'gesture', 'feedback', 'response', 'micro-interaction']
        }
    
    def _load_visual_style_patterns(self) -> Dict[str, List[str]]:
        """Load natural language patterns for visual styles"""
        return {
            'experimental': ['experimental', 'avant-garde', 'cutting-edge', 'innovative'],
            'minimalist': ['minimal', 'minimalist', 'clean', 'simple', 'sparse'],
            'bold': ['bold', 'strong', 'dramatic', 'impactful', 'striking'],
            'subtle': ['subtle', 'gentle', 'soft', 'delicate', 'understated'],
            'dynamic': ['dynamic', 'energetic', 'lively', 'animated', 'vibrant'],
            'static': ['static', 'stable', 'calm', 'still', 'peaceful']
        }
    
    def parse_natural_language(self, text: str) -> LottieInstantiationRequest:
        """Parse natural language text into Lottie instantiation request"""
        text_lower = text.lower()
        
        # Extract intent
        intent = self._extract_intent(text_lower)
        
        # Extract element type
        element_type = self._extract_element_type(text_lower)
        
        # Extract design theory
        design_theory = self._extract_design_theory(text_lower)
        
        # Extract visual style
        visual_style = self._extract_visual_style(text_lower)
        
        # Extract interaction type
        interaction_type = self._extract_interaction_type(text_lower)
        
        # Extract priority
        priority = self._extract_priority(text_lower)
        
        return LottieInstantiationRequest(
            intent=intent,
            element_type=element_type,
            design_theory=design_theory,
            visual_style=visual_style,
            interaction_type=interaction_type,
            context=text,
            priority=priority
        )
    
    def _extract_intent(self, text: str) -> str:
        """Extract intent from natural language"""
        if any(word in text for word in ['add', 'create', 'new', 'insert']):
            return 'add'
        elif any(word in text for word in ['replace', 'update', 'change', 'modify']):
            return 'replace'
        elif any(word in text for word in ['enhance', 'improve', 'upgrade', 'better']):
            return 'enhance'
        else:
            return 'add'  # Default
    
    def _extract_element_type(self, text: str) -> str:
        """Extract element type from natural language"""
        for element_type, patterns in self.element_type_patterns.items():
            if any(pattern in text for pattern in patterns):
                return element_type
        return 'button'  # Default
    
    def _extract_design_theory(self, text: str) -> str:
        """Extract design theory from natural language"""
        for theory, patterns in self.design_theory_patterns.items():
            if any(pattern in text for pattern in patterns):
                return theory
        return 'hybrid'  # Default
    
    def _extract_visual_style(self, text: str) -> str:
        """Extract visual style from natural language"""
        for style, patterns in self.visual_style_patterns.items():
            if any(pattern in text for pattern in patterns):
                return style
        return 'dynamic'  # Default
    
    def _extract_interaction_type(self, text: str) -> str:
        """Extract interaction type from natural language"""
        for interaction, patterns in self.interaction_patterns.items():
            if any(pattern in text for pattern in patterns):
                return interaction
        return 'hover'  # Default
    
    def _extract_priority(self, text: str) -> str:
        """Extract priority from natural language"""
        if any(word in text for word in ['urgent', 'critical', 'important', 'high']):
            return 'high'
        elif any(word in text for word in ['low', 'minor', 'optional']):
            return 'low'
        else:
            return 'medium'  # Default
    
    def generate_lottie_instantiation(self, request: LottieInstantiationRequest) -> Dict[str, Any]:
        """Generate Lottie instantiation based on natural language request"""
        return {
            'intent': request.intent,
            'element_type': request.element_type,
            'design_theory': request.design_theory,
            'visual_style': request.visual_style,
            'interaction_type': request.interaction_type,
            'priority': request.priority,
            'context': request.context,
            'data_attributes': self._generate_data_attributes(request),
            'react_component': self._generate_react_component(request),
            'css_classes': self._generate_css_classes(request),
            'animation_config': self._generate_animation_config(request)
        }
    
    def _generate_data_attributes(self, request: LottieInstantiationRequest) -> Dict[str, str]:
        """Generate data attributes for automatic animation detection"""
        return {
            'data-animation-element': 'true',
            'data-animation-type': request.element_type,
            'data-visual-style': request.visual_style,
            'data-interaction-type': request.interaction_type,
            'data-priority': request.priority,
            'data-design-theory': request.design_theory
        }
    
    def _generate_react_component(self, request: LottieInstantiationRequest) -> str:
        """Generate React component code"""
        component_name = f"Animated{request.element_type.title()}"
        
        return f"""
// Generated Lottie Animation Component
import {{ LottieAnimation }} from '@/components/animations/LottieAnimation';
import {{ withDesignTheoryAnimation }} from '@/components/animations/DesignTheoryAnimationProvider';

const {component_name} = withDesignTheoryAnimation('{request.element_type}', {{
  designTheory: '{request.design_theory}',
  visualStyle: '{request.visual_style}',
  interactionType: '{request.interaction_type}',
  priority: '{request.priority}'
}});

export default {component_name};
"""
    
    def _generate_css_classes(self, request: LottieInstantiationRequest) -> List[str]:
        """Generate CSS classes for styling"""
        classes = [
            f"lottie-{request.element_type}",
            f"design-theory-{request.design_theory}",
            f"visual-style-{request.visual_style}",
            f"interaction-{request.interaction_type}"
        ]
        
        if request.priority == 'high':
            classes.append('priority-high')
        elif request.priority == 'low':
            classes.append('priority-low')
        
        return classes
    
    def _generate_animation_config(self, request: LottieInstantiationRequest) -> Dict[str, Any]:
        """Generate animation configuration"""
        return {
            'autoplay': request.interaction_type in ['load', 'scroll'],
            'loop': request.interaction_type in ['load', 'scroll'],
            'speed': self._get_speed_for_design_theory(request.design_theory),
            'intensity': self._get_intensity_for_design_theory(request.design_theory),
            'colors': self._get_colors_for_design_theory(request.design_theory),
            'timing': self._get_timing_for_interaction(request.interaction_type)
        }
    
    def _get_speed_for_design_theory(self, design_theory: str) -> float:
        """Get animation speed based on design theory"""
        speeds = {
            'carson': 0.8,  # Slower for chaotic effect
            'brockmann': 1.2,  # Faster for precision
            'hybrid': 1.0  # Balanced
        }
        return speeds.get(design_theory, 1.0)
    
    def _get_intensity_for_design_theory(self, design_theory: str) -> str:
        """Get animation intensity based on design theory"""
        intensities = {
            'carson': 'high',
            'brockmann': 'low',
            'hybrid': 'medium'
        }
        return intensities.get(design_theory, 'medium')
    
    def _get_colors_for_design_theory(self, design_theory: str) -> Dict[str, str]:
        """Get color scheme based on design theory"""
        color_schemes = {
            'carson': {
                'primary': '#FF6633',
                'secondary': '#33FFCC',
                'accent': '#FF33CC'
            },
            'brockmann': {
                'primary': '#0080FF',
                'secondary': '#333333',
                'accent': '#FFFFFF'
            },
            'hybrid': {
                'primary': '#33CCFF',
                'secondary': '#CC33FF',
                'accent': '#FF9900'
            }
        }
        return color_schemes.get(design_theory, color_schemes['hybrid'])
    
    def _get_timing_for_interaction(self, interaction_type: str) -> float:
        """Get timing based on interaction type"""
        timings = {
            'hover': 0.3,
            'click': 0.2,
            'scroll': 1.0,
            'focus': 0.4,
            'load': 2.0,
            'transition': 0.6,
            'micro-interaction': 0.1
        }
        return timings.get(interaction_type, 0.5)
    
    def generate_cursor_ai_prompt(self, request: LottieInstantiationRequest) -> str:
        """Generate Cursor AI prompt for implementation"""
        instantiation = self.generate_lottie_instantiation(request)
        
        return f"""
# Lottie Animation Implementation Request

## Context
{request.context}

## Requirements
- Element Type: {request.element_type}
- Design Theory: {request.design_theory}
- Visual Style: {request.visual_style}
- Interaction Type: {request.interaction_type}
- Priority: {request.priority}

## Implementation
1. Add data attributes: {json.dumps(instantiation['data_attributes'], indent=2)}
2. Apply CSS classes: {', '.join(instantiation['css_classes'])}
3. Configure animation: {json.dumps(instantiation['animation_config'], indent=2)}

## React Component
```typescript
{instantiation['react_component']}
```

## Usage
Wrap your {request.element_type} element with the generated component or add the data attributes directly.
"""
    
    def generate_vscode_snippet(self, request: LottieInstantiationRequest) -> str:
        """Generate VS Code snippet for implementation"""
        instantiation = self.generate_lottie_instantiation(request)
        
        return f"""
<!-- Lottie Animation Snippet -->
<div 
  data-animation-element="true"
  data-animation-type="{request.element_type}"
  data-visual-style="{request.visual_style}"
  data-interaction-type="{request.interaction_type}"
  data-priority="{request.priority}"
  data-design-theory="{request.design_theory}"
  class="{' '.join(instantiation['css_classes'])}"
>
  <!-- Your {request.element_type} content here -->
</div>

<!-- CSS Classes -->
<style>
{self._generate_css_for_snippet(instantiation['css_classes'], request.design_theory)}
</style>
"""
    
    def _generate_css_for_snippet(self, classes: List[str], design_theory: str) -> str:
        """Generate CSS for VS Code snippet"""
        colors = self._get_colors_for_design_theory(design_theory)
        
        css = ""
        for class_name in classes:
            if 'design-theory-carson' in class_name:
                css += f"""
.{class_name} {{
  animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation-duration: 0.8s;
  color: {colors['primary']};
}}"""
            elif 'design-theory-brockmann' in class_name:
                css += f"""
.{class_name} {{
  animation-timing-function: ease-in-out;
  animation-duration: 0.3s;
  color: {colors['primary']};
}}"""
            elif 'design-theory-hybrid' in class_name:
                css += f"""
.{class_name} {{
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-duration: 0.5s;
  color: {colors['primary']};
}}"""
        
        return css

def main():
    """Main function for testing"""
    instantiator = NaturalLanguageLottieInstantiator()
    
    # Test cases
    test_cases = [
        "Add a bold experimental button with hover animation",
        "Create a minimal clean card with click interaction",
        "Enhance the navigation with smooth modern transitions",
        "Add chaotic loading spinner for the hero section",
        "Create systematic form validation with precise feedback"
    ]
    
    print("🎨 Natural Language Lottie Instantiation System")
    print("=" * 50)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{i}. Testing: '{test_case}'")
        
        # Parse natural language
        request = instantiator.parse_natural_language(test_case)
        print(f"   Parsed: {request.element_type} {request.design_theory} {request.visual_style} {request.interaction_type}")
        
        # Generate instantiation
        instantiation = instantiator.generate_lottie_instantiation(request)
        print(f"   Generated: {len(instantiation['css_classes'])} CSS classes, {len(instantiation['data_attributes'])} data attributes")
        
        # Generate Cursor AI prompt
        cursor_prompt = instantiator.generate_cursor_ai_prompt(request)
        print(f"   Cursor AI prompt: {len(cursor_prompt)} characters")
        
        # Generate VS Code snippet
        vscode_snippet = instantiator.generate_vscode_snippet(request)
        print(f"   VS Code snippet: {len(vscode_snippet)} characters")

if __name__ == "__main__":
    main()
