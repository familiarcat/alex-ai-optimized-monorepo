/**
 * Alex AI Design Theory Animation Provider
 * Automatically applies Carson/Brockmann appropriate animations to UI elements
 */

"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { LottieAnimation } from './LottieAnimation';
import { createAIAnimationSelector, UIElement, AnimationRecommendation } from '@/lib/ai-animation-selector';
import { useDesignSystem } from '@/providers/DesignSystemProvider';

interface DesignTheoryAnimationContextType {
  getAnimationForElement: (elementId: string, element: UIElement) => AnimationRecommendation | null;
  isAnalyzing: boolean;
  analysisProgress: number;
  totalElements: number;
  analyzedElements: number;
}

const DesignTheoryAnimationContext = createContext<DesignTheoryAnimationContextType | null>(null);

export function useDesignTheoryAnimations() {
  const context = useContext(DesignTheoryAnimationContext);
  if (!context) {
    throw new Error('useDesignTheoryAnimations must be used within DesignTheoryAnimationProvider');
  }
  return context;
}

interface DesignTheoryAnimationProviderProps {
  children: React.ReactNode;
  autoAnalyze?: boolean;
  designTheory?: 'carson' | 'brockmann' | 'hybrid';
  globalVisualStyle?: 'experimental' | 'minimalist' | 'bold' | 'subtle' | 'dynamic' | 'static';
}

export function DesignTheoryAnimationProvider({
  children,
  autoAnalyze = true,
  designTheory = 'hybrid',
  globalVisualStyle = 'dynamic'
}: DesignTheoryAnimationProviderProps) {
  const { designSystem } = useDesignSystem();
  const [animationSelector] = useState(() => createAIAnimationSelector(designSystem.colors));
  const [animations, setAnimations] = useState<Map<string, AnimationRecommendation>>(new Map());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [analyzedElements, setAnalyzedElements] = useState(0);
  const observerRef = useRef<MutationObserver | null>(null);

  // Auto-analyze elements when they're added to the DOM
  useEffect(() => {
    if (!autoAnalyze) return;

    const analyzeElements = async () => {
      const elements = document.querySelectorAll('[data-animation-element]');
      const elementData: Array<{ element: HTMLElement; uiElement: UIElement }> = [];

      elements.forEach((el) => {
        const element = el as HTMLElement;
        const uiElement = extractUIElementFromDOM(element, designTheory, globalVisualStyle);
        if (uiElement) {
          elementData.push({ element, uiElement });
        }
      });

      if (elementData.length === 0) return;

      setIsAnalyzing(true);
      setTotalElements(elementData.length);
      setAnalyzedElements(0);

      for (let i = 0; i < elementData.length; i++) {
        const { element, uiElement } = elementData[i];
        
        try {
          const recommendation = await animationSelector.analyzeAndRecommend(uiElement);
          setAnimations(prev => new Map(prev.set(uiElement.id, recommendation)));
          
          // Apply animation to element
          applyAnimationToElement(element, recommendation);
          
        } catch (error) {
          console.error(`Error analyzing element ${uiElement.id}:`, error);
        }

        setAnalyzedElements(i + 1);
        setAnalysisProgress(((i + 1) / elementData.length) * 100);
      }

      setIsAnalyzing(false);
    };

    // Initial analysis
    analyzeElements();

    // Set up mutation observer to watch for new elements
    observerRef.current = new MutationObserver((mutations) => {
      let shouldReanalyze = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              if (element.hasAttribute('data-animation-element') || 
                  element.querySelector('[data-animation-element]')) {
                shouldReanalyze = true;
              }
            }
          });
        }
      });

      if (shouldReanalyze) {
        setTimeout(analyzeElements, 100); // Debounce
      }
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [autoAnalyze, designTheory, globalVisualStyle, animationSelector]);

  const getAnimationForElement = (elementId: string, element: UIElement): AnimationRecommendation | null => {
    return animations.get(elementId) || null;
  };

  const contextValue: DesignTheoryAnimationContextType = {
    getAnimationForElement,
    isAnalyzing,
    analysisProgress,
    totalElements,
    analyzedElements
  };

  return (
    <DesignTheoryAnimationContext.Provider value={contextValue}>
      {children}
      {isAnalyzing && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-sm font-medium">Analyzing animations...</p>
              <p className="text-xs text-gray-500">
                {analyzedElements} of {totalElements} elements
              </p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </DesignTheoryAnimationContext.Provider>
  );
}

/**
 * Extract UI element data from DOM element
 */
function extractUIElementFromDOM(
  element: HTMLElement, 
  designTheory: string, 
  globalVisualStyle: string
): UIElement | null {
  const id = element.id || element.getAttribute('data-animation-element') || generateId();
  const type = element.getAttribute('data-animation-type') as UIElement['type'] || inferElementType(element);
  const visualStyle = element.getAttribute('data-visual-style') as UIElement['visualStyle'] || globalVisualStyle;
  const interactionType = element.getAttribute('data-interaction-type') as UIElement['interactionType'] || inferInteractionType(element);
  const context = element.getAttribute('data-context') || element.className;
  const priority = element.getAttribute('data-priority') as UIElement['priority'] || 'medium';
  const size = element.getAttribute('data-size') as UIElement['size'] || inferElementSize(element);
  const colorScheme = element.getAttribute('data-color-scheme') as UIElement['colorScheme'] || 'primary';

  return {
    id,
    type,
    designTheory: designTheory as UIElement['designTheory'],
    visualStyle,
    interactionType,
    context,
    priority,
    size,
    colorScheme
  };
}

/**
 * Infer element type from DOM element
 */
function inferElementType(element: HTMLElement): UIElement['type'] {
  const tagName = element.tagName.toLowerCase();
  const className = element.className.toLowerCase();
  
  if (tagName === 'button' || className.includes('btn') || className.includes('button')) {
    return 'button';
  } else if (className.includes('card')) {
    return 'card';
  } else if (tagName === 'nav' || className.includes('nav')) {
    return 'navigation';
  } else if (tagName === 'form' || className.includes('form')) {
    return 'form';
  } else if (className.includes('hero')) {
    return 'hero';
  } else if (tagName === 'footer' || className.includes('footer')) {
    return 'footer';
  } else if (className.includes('sidebar')) {
    return 'sidebar';
  } else if (className.includes('modal')) {
    return 'modal';
  } else if (className.includes('tooltip')) {
    return 'tooltip';
  } else if (className.includes('badge')) {
    return 'badge';
  } else if (className.includes('progress')) {
    return 'progress';
  } else if (className.includes('notification') || className.includes('alert')) {
    return 'notification';
  }
  
  return 'button'; // Default fallback
}

/**
 * Infer interaction type from element
 */
function inferInteractionType(element: HTMLElement): UIElement['interactionType'] {
  const className = element.className.toLowerCase();
  
  if (className.includes('hover')) {
    return 'hover';
  } else if (className.includes('click') || element.tagName.toLowerCase() === 'button') {
    return 'click';
  } else if (className.includes('scroll')) {
    return 'scroll';
  } else if (className.includes('focus') || element.tagName.toLowerCase() === 'input') {
    return 'focus';
  } else if (className.includes('loading') || className.includes('spinner')) {
    return 'load';
  } else if (className.includes('transition')) {
    return 'transition';
  } else if (className.includes('micro')) {
    return 'micro-interaction';
  }
  
  return 'hover'; // Default fallback
}

/**
 * Infer element size from DOM element
 */
function inferElementSize(element: HTMLElement): UIElement['size'] {
  const rect = element.getBoundingClientRect();
  const area = rect.width * rect.height;
  
  if (area < 10000) return 'small';
  if (area < 100000) return 'medium';
  if (area < 500000) return 'large';
  return 'full';
}

/**
 * Apply animation to DOM element
 */
function applyAnimationToElement(element: HTMLElement, recommendation: AnimationRecommendation) {
  // Create animation container
  const animationContainer = document.createElement('div');
  animationContainer.className = 'design-theory-animation';
  animationContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  `;

  // Add animation data as data attribute for React to pick up
  animationContainer.setAttribute('data-lottie-animation', JSON.stringify({
    animationData: recommendation.animationData,
    width: '100%',
    height: '100%',
    autoplay: recommendation.customization.intensity !== 'low',
    loop: recommendation.customization.loop,
    playOnHover: recommendation.interactionType === 'hover',
    playOnClick: recommendation.interactionType === 'click',
    playOnScroll: recommendation.interactionType === 'scroll',
    playOnMouseMove: recommendation.interactionType === 'micro-interaction'
  }));

  // Insert animation container
  element.style.position = 'relative';
  element.appendChild(animationContainer);

  // Add reasoning as tooltip
  element.title = `Animation: ${recommendation.reasoning}`;
  
  // Add design theory class
  element.classList.add(`design-theory-${recommendation.designTheoryAlignment}`);
  element.classList.add(`visual-style-${recommendation.visualStyle}`);
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `element_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Higher-order component to wrap elements with animation analysis
 */
export function withDesignTheoryAnimation<P extends object>(
  Component: React.ComponentType<P>,
  elementConfig: Partial<UIElement> = {}
) {
  return function WrappedComponent(props: P) {
    const { getAnimationForElement } = useDesignTheoryAnimations();
    const [animation, setAnimation] = useState<AnimationRecommendation | null>(null);
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (elementRef.current) {
        const element = elementRef.current;
        const uiElement = extractUIElementFromDOM(element, 'hybrid', 'dynamic');
        const mergedElement = { ...uiElement, ...elementConfig };
        const recommendation = getAnimationForElement(mergedElement.id, mergedElement);
        setAnimation(recommendation);
      }
    }, [getAnimationForElement]);

    return (
      <div ref={elementRef} data-animation-element {...elementConfig}>
        <Component {...props} />
        {animation && (
          <LottieAnimation
            animationData={animation.animationData}
            width="100%"
            height="100%"
            autoplay={animation.customization.intensity !== 'low'}
            loop={animation.customization.loop}
            playOnHover={animation.interactionType === 'hover'}
            playOnClick={animation.interactionType === 'click'}
            playOnScroll={animation.interactionType === 'scroll'}
            playOnMouseMove={animation.interactionType === 'micro-interaction'}
            className="design-theory-animation-overlay"
          />
        )}
      </div>
    );
  };
}

export default DesignTheoryAnimationProvider;
