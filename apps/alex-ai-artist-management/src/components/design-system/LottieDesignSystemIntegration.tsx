/**
 * Lottie Design System Integration
 * Ensures Lottie animations are used appropriately throughout the UI/UX design system
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LottieAnimation } from '@/components/animations/LottieAnimation';
import { useDesignSystem } from '@/providers/DesignSystemProvider';

interface LottieDesignSystemContextType {
  // Animation guidelines
  getAnimationGuidelines: (elementType: string, context: string) => AnimationGuidelines;
  shouldUseAnimation: (elementType: string, context: string) => boolean;
  getRecommendedAnimation: (elementType: string, context: string) => AnimationRecommendation;
  
  // Design theory integration
  getDesignTheoryForContext: (context: string) => 'carson' | 'brockmann' | 'hybrid';
  getVisualStyleForElement: (elementType: string) => string;
  
  // Performance optimization
  getPerformanceLevel: () => 'high' | 'medium' | 'low';
  shouldReduceMotion: () => boolean;
  
  // Accessibility
  getAccessibilitySettings: () => AccessibilitySettings;
}

interface AnimationGuidelines {
  shouldAnimate: boolean;
  animationType: string;
  duration: number;
  easing: string;
  intensity: 'low' | 'medium' | 'high';
  priority: 'high' | 'medium' | 'low';
  accessibility: {
    respectReducedMotion: boolean;
    provideStaticAlternative: boolean;
    maxDuration: number;
  };
}

interface AnimationRecommendation {
  name: string;
  source: 'lottiefiles' | 'generated' | 'after-effects';
  config: {
    autoplay: boolean;
    loop: boolean;
    speed: number;
    colors: Record<string, string>;
  };
  dataAttributes: Record<string, string>;
  cssClasses: string[];
}

interface AccessibilitySettings {
  respectReducedMotion: boolean;
  maxAnimationDuration: number;
  allowPausePlay: boolean;
  provideAlternatives: boolean;
}

const LottieDesignSystemContext = createContext<LottieDesignSystemContextType | null>(null);

export function useLottieDesignSystem() {
  const context = useContext(LottieDesignSystemContext);
  if (!context) {
    throw new Error('useLottieDesignSystem must be used within LottieDesignSystemProvider');
  }
  return context;
}

interface LottieDesignSystemProviderProps {
  children: React.ReactNode;
  performanceLevel?: 'high' | 'medium' | 'low';
  accessibilityMode?: 'full' | 'reduced' | 'minimal';
  designTheory?: 'carson' | 'brockmann' | 'hybrid';
}

export function LottieDesignSystemProvider({
  children,
  performanceLevel = 'high',
  accessibilityMode = 'full',
  designTheory = 'hybrid'
}: LottieDesignSystemProviderProps) {
  const { designSystem } = useDesignSystem();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState(performanceLevel);
  const [accessibilityMode, setAccessibilityMode] = useState(accessibilityMode);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Animation guidelines based on element type and context
  const getAnimationGuidelines = (elementType: string, context: string): AnimationGuidelines => {
    const baseGuidelines = {
      shouldAnimate: !reducedMotion && performanceLevel !== 'low',
      animationType: 'lottie',
      duration: 0.5,
      easing: 'ease-in-out',
      intensity: 'medium' as const,
      priority: 'medium' as const,
      accessibility: {
        respectReducedMotion: true,
        provideStaticAlternative: true,
        maxDuration: 3.0
      }
    };

    // Element-specific guidelines
    const elementGuidelines = {
      button: {
        shouldAnimate: true,
        duration: 0.3,
        intensity: 'high' as const,
        priority: 'high' as const
      },
      card: {
        shouldAnimate: true,
        duration: 0.4,
        intensity: 'medium' as const,
        priority: 'medium' as const
      },
      navigation: {
        shouldAnimate: true,
        duration: 0.2,
        intensity: 'low' as const,
        priority: 'high' as const
      },
      form: {
        shouldAnimate: true,
        duration: 0.3,
        intensity: 'low' as const,
        priority: 'medium' as const
      },
      hero: {
        shouldAnimate: true,
        duration: 2.0,
        intensity: 'high' as const,
        priority: 'high' as const
      },
      footer: {
        shouldAnimate: false,
        duration: 0.0,
        intensity: 'low' as const,
        priority: 'low' as const
      },
      sidebar: {
        shouldAnimate: true,
        duration: 0.5,
        intensity: 'medium' as const,
        priority: 'medium' as const
      },
      modal: {
        shouldAnimate: true,
        duration: 0.4,
        intensity: 'medium' as const,
        priority: 'high' as const
      },
      tooltip: {
        shouldAnimate: true,
        duration: 0.2,
        intensity: 'low' as const,
        priority: 'low' as const
      },
      badge: {
        shouldAnimate: true,
        duration: 0.3,
        intensity: 'medium' as const,
        priority: 'low' as const
      },
      progress: {
        shouldAnimate: true,
        duration: 1.0,
        intensity: 'low' as const,
        priority: 'medium' as const
      },
      notification: {
        shouldAnimate: true,
        duration: 0.5,
        intensity: 'high' as const,
        priority: 'high' as const
      }
    };

    const elementConfig = elementGuidelines[elementType as keyof typeof elementGuidelines] || baseGuidelines;
    
    // Context-specific adjustments
    const contextAdjustments = {
      'loading': { duration: 2.0, intensity: 'low' as const },
      'error': { duration: 0.5, intensity: 'high' as const },
      'success': { duration: 0.3, intensity: 'medium' as const },
      'warning': { duration: 0.4, intensity: 'medium' as const },
      'interactive': { duration: 0.2, intensity: 'high' as const },
      'background': { duration: 3.0, intensity: 'low' as const }
    };

    const contextConfig = contextAdjustments[context as keyof typeof contextAdjustments] || {};

    return {
      ...baseGuidelines,
      ...elementConfig,
      ...contextConfig,
      shouldAnimate: baseGuidelines.shouldAnimate && elementConfig.shouldAnimate
    };
  };

  const shouldUseAnimation = (elementType: string, context: string): boolean => {
    const guidelines = getAnimationGuidelines(elementType, context);
    return guidelines.shouldAnimate;
  };

  const getRecommendedAnimation = (elementType: string, context: string): AnimationRecommendation => {
    const guidelines = getAnimationGuidelines(elementType, context);
    const designTheory = getDesignTheoryForContext(context);
    const visualStyle = getVisualStyleForElement(elementType);

    return {
      name: `${elementType}_${context}_${designTheory}`,
      source: 'generated',
      config: {
        autoplay: context === 'loading' || context === 'background',
        loop: context === 'loading' || context === 'background',
        speed: getSpeedForDesignTheory(designTheory),
        colors: getColorsForDesignTheory(designTheory)
      },
      dataAttributes: {
        'data-animation-element': 'true',
        'data-animation-type': elementType,
        'data-visual-style': visualStyle,
        'data-interaction-type': getInteractionTypeForElement(elementType),
        'data-priority': guidelines.priority,
        'data-design-theory': designTheory
      },
      cssClasses: [
        `lottie-${elementType}`,
        `design-theory-${designTheory}`,
        `visual-style-${visualStyle}`,
        `intensity-${guidelines.intensity}`,
        `priority-${guidelines.priority}`
      ]
    };
  };

  const getDesignTheoryForContext = (context: string): 'carson' | 'brockmann' | 'hybrid' => {
    const contextMapping = {
      'loading': 'hybrid',
      'error': 'carson',
      'success': 'brockmann',
      'warning': 'carson',
      'interactive': 'hybrid',
      'background': 'hybrid',
      'navigation': 'brockmann',
      'form': 'brockmann',
      'hero': 'carson',
      'card': 'hybrid',
      'button': 'hybrid',
      'modal': 'hybrid',
      'tooltip': 'brockmann',
      'badge': 'hybrid',
      'progress': 'brockmann',
      'notification': 'carson'
    };

    return contextMapping[context as keyof typeof contextMapping] || designTheory;
  };

  const getVisualStyleForElement = (elementType: string): string => {
    const styleMapping = {
      'button': 'dynamic',
      'card': 'subtle',
      'navigation': 'minimalist',
      'form': 'minimalist',
      'hero': 'bold',
      'footer': 'static',
      'sidebar': 'subtle',
      'modal': 'dynamic',
      'tooltip': 'subtle',
      'badge': 'dynamic',
      'progress': 'minimalist',
      'notification': 'bold'
    };

    return styleMapping[elementType as keyof typeof styleMapping] || 'dynamic';
  };

  const getPerformanceLevel = (): 'high' | 'medium' | 'low' => {
    return performanceLevel;
  };

  const shouldReduceMotion = (): boolean => {
    return reducedMotion || accessibilityMode === 'minimal';
  };

  const getAccessibilitySettings = (): AccessibilitySettings => {
    return {
      respectReducedMotion: true,
      maxAnimationDuration: reducedMotion ? 0.0 : 3.0,
      allowPausePlay: accessibilityMode === 'full',
      provideAlternatives: accessibilityMode !== 'minimal'
    };
  };

  // Helper functions
  const getSpeedForDesignTheory = (theory: string): number => {
    const speeds = {
      'carson': 0.8,
      'brockmann': 1.2,
      'hybrid': 1.0
    };
    return speeds[theory as keyof typeof speeds] || 1.0;
  };

  const getColorsForDesignTheory = (theory: string): Record<string, string> => {
    const colorSchemes = {
      'carson': {
        primary: '#FF6633',
        secondary: '#33FFCC',
        accent: '#FF33CC'
      },
      'brockmann': {
        primary: '#0080FF',
        secondary: '#333333',
        accent: '#FFFFFF'
      },
      'hybrid': {
        primary: '#33CCFF',
        secondary: '#CC33FF',
        accent: '#FF9900'
      }
    };
    return colorSchemes[theory as keyof typeof colorSchemes] || colorSchemes.hybrid;
  };

  const getInteractionTypeForElement = (elementType: string): string => {
    const interactionMapping = {
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
    };
    return interactionMapping[elementType as keyof typeof interactionMapping] || 'hover';
  };

  const contextValue: LottieDesignSystemContextType = {
    getAnimationGuidelines,
    shouldUseAnimation,
    getRecommendedAnimation,
    getDesignTheoryForContext,
    getVisualStyleForElement,
    getPerformanceLevel,
    shouldReduceMotion,
    getAccessibilitySettings
  };

  return (
    <LottieDesignSystemContext.Provider value={contextValue}>
      {children}
    </LottieDesignSystemContext.Provider>
  );
}

// Higher-order component for automatic Lottie integration
export function withLottieDesignSystem<P extends object>(
  Component: React.ComponentType<P>,
  elementType: string,
  context: string = 'interactive'
) {
  return function WrappedComponent(props: P) {
    const { shouldUseAnimation, getRecommendedAnimation } = useLottieDesignSystem();
    
    if (!shouldUseAnimation(elementType, context)) {
      return <Component {...props} />;
    }

    const recommendation = getRecommendedAnimation(elementType, context);
    
    return (
      <div {...recommendation.dataAttributes} className={recommendation.cssClasses.join(' ')}>
        <Component {...props} />
        <LottieAnimation
          animationData={null} // Will be loaded by the animation system
          autoplay={recommendation.config.autoplay}
          loop={recommendation.config.loop}
          speed={recommendation.config.speed}
          colorOverrides={recommendation.config.colors}
          className="lottie-overlay"
        />
      </div>
    );
  };
}

export default LottieDesignSystemProvider;
