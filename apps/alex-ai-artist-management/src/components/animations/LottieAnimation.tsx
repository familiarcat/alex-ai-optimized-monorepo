/**
 * Alex AI Lottie Animation Component
 * Carson-inspired experimental animations with Swiss precision timing
 * Dynamic theming integration with design system
 */

"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useDesignSystem } from '@/providers/DesignSystemProvider';
import lottie, { AnimationItem } from 'lottie-web';
import { AnimationConfig } from '@/types/animations';

interface LottieAnimationProps {
  animationData: any;
  className?: string;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  direction?: 1 | -1;
  playOnHover?: boolean;
  playOnClick?: boolean;
  playOnScroll?: boolean;
  playOnMouseMove?: boolean;
  scrollThreshold?: number;
  mouseSensitivity?: number;
  theme?: 'light' | 'dark' | 'auto';
  colorOverrides?: Record<string, string>;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: (currentTime: number) => void;
  onScroll?: (scrollProgress: number) => void;
  onMouseMove?: (mousePosition: { x: number; y: number }) => void;
}

export function LottieAnimation({
  animationData,
  className = '',
  width = '100%',
  height = '100%',
  loop = true,
  autoplay = true,
  speed = 1,
  direction = 1,
  playOnHover = false,
  playOnClick = false,
  playOnScroll = false,
  playOnMouseMove = false,
  scrollThreshold = 0.5,
  mouseSensitivity = 1,
  theme = 'auto',
  colorOverrides = {},
  onComplete,
  onLoopComplete,
  onEnterFrame,
  onScroll,
  onMouseMove,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { designSystem } = useDesignSystem();

  // Apply color overrides based on design system
  const applyColorOverrides = (animationData: any): any => {
    if (!animationData || !colorOverrides) return animationData;

    const applyColors = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;

      if (Array.isArray(obj)) {
        return obj.map(applyColors);
      }

      const result = { ...obj };

      // Apply color overrides to shape layers
      if (result.ty === 'sh' && result.c && result.c.k) {
        if (Array.isArray(result.c.k)) {
          result.c.k = result.c.k.map((keyframe: any) => {
            if (keyframe.s && keyframe.s.length >= 4) {
              const colorName = keyframe.s[3]; // Color name from After Effects
              if (colorOverrides[colorName]) {
                const color = hexToRgb(colorOverrides[colorName]);
                if (color) {
                  keyframe.s[0] = color.r / 255;
                  keyframe.s[1] = color.g / 255;
                  keyframe.s[2] = color.b / 255;
                }
              }
            }
            return keyframe;
          });
        }
      }

      // Recursively apply to nested objects
      Object.keys(result).forEach(key => {
        result[key] = applyColors(result[key]);
      });

      return result;
    };

    return applyColors(animationData);
  };

  // Convert hex color to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Get theme-based color overrides
  const getThemeColors = (): Record<string, string> => {
    const { colors } = designSystem;
    const baseColors = {
      'Primary': colors.accent.primary,
      'Secondary': colors.accent.secondary,
      'Tertiary': colors.accent.tertiary,
      'Success': colors.accent.success,
      'Warning': colors.accent.warning,
      'Error': colors.accent.error,
      'Background': colors.bg.primary,
      'Surface': colors.bg.secondary,
      'Text': colors.text.primary,
      'TextSecondary': colors.text.secondary,
      'TextMuted': colors.text.muted,
    };

    return { ...baseColors, ...colorOverrides };
  };

  // Initialize animation
  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    const processedAnimationData = applyColorOverrides(animationData);
    const themeColors = getThemeColors();

    const config: AnimationConfig = {
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay: isPlaying,
      animationData: processedAnimationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        className: 'lottie-animation',
      },
    };

    animationRef.current = lottie.loadAnimation(config);

    // Set up event listeners
    if (onComplete) {
      animationRef.current.addEventListener('complete', onComplete);
    }
    if (onLoopComplete) {
      animationRef.current.addEventListener('loopComplete', onLoopComplete);
    }
    if (onEnterFrame) {
      animationRef.current.addEventListener('enterFrame', (e) => {
        onEnterFrame(e.currentTime);
      });
    }

    // Set speed and direction
    animationRef.current.setSpeed(speed);
    animationRef.current.setDirection(direction);

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [animationData, isPlaying, loop, speed, direction, designSystem]);

  // Scroll interaction effect
  useEffect(() => {
    if (!playOnScroll || !animationRef.current) return;

    const handleScroll = () => {
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Calculate scroll progress (0 to 1)
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - elementTop) / (windowHeight + elementHeight)
      ));
      
      setScrollProgress(progress);
      
      // Control animation based on scroll progress
      if (progress >= scrollThreshold) {
        animationRef.current?.play();
      } else {
        animationRef.current?.pause();
      }
      
      // Set animation progress based on scroll
      const totalFrames = animationRef.current?.totalFrames || 0;
      const targetFrame = progress * totalFrames;
      animationRef.current?.goToAndStop(targetFrame, true);
      
      onScroll?.(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [playOnScroll, scrollThreshold, onScroll]);

  // Mouse interaction effect
  useEffect(() => {
    if (!playOnMouseMove || !animationRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      const position = { x, y };
      setMousePosition(position);
      
      // Control animation based on mouse position
      const totalFrames = animationRef.current?.totalFrames || 0;
      const targetFrame = (x * mouseSensitivity) * totalFrames;
      animationRef.current?.goToAndStop(targetFrame, true);
      
      onMouseMove?.(position);
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [playOnMouseMove, mouseSensitivity, onMouseMove]);

  // Handle play/pause
  const togglePlay = () => {
    if (!animationRef.current) return;
    
    if (isPlaying) {
      animationRef.current.pause();
    } else {
      animationRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (playOnHover && animationRef.current) {
      animationRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (playOnHover && animationRef.current) {
      animationRef.current.pause();
    }
  };

  // Handle click
  const handleClick = () => {
    if (playOnClick) {
      togglePlay();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`lottie-container ${className}`}
      style={{
        width,
        height,
        cursor: playOnClick ? 'pointer' : 'default',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  );
}

// Pre-configured animation components for common use cases
export function LoadingAnimation({ size = 64, className = '' }: { size?: number; className?: string }) {
  // This would be replaced with actual loading animation data
  const loadingAnimationData = {
    // Placeholder - would be actual Lottie JSON data
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 64,
    h: 64,
    nm: "Loading",
    ddd: 0,
    assets: [],
    layers: []
  };

  return (
    <LottieAnimation
      animationData={loadingAnimationData}
      width={size}
      height={size}
      loop={true}
      autoplay={true}
      className={`loading-animation ${className}`}
      colorOverrides={{
        'Primary': '#ff6b35',
        'Secondary': '#00d4ff',
      }}
    />
  );
}

export function SuccessAnimation({ size = 48, className = '' }: { size?: number; className?: string }) {
  // This would be replaced with actual success animation data
  const successAnimationData = {
    // Placeholder - would be actual Lottie JSON data
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 90,
    w: 48,
    h: 48,
    nm: "Success",
    ddd: 0,
    assets: [],
    layers: []
  };

  return (
    <LottieAnimation
      animationData={successAnimationData}
      width={size}
      height={size}
      loop={false}
      autoplay={true}
      className={`success-animation ${className}`}
      colorOverrides={{
        'Primary': '#00ff88',
        'Secondary': '#ffffff',
      }}
    />
  );
}

export function ErrorAnimation({ size = 48, className = '' }: { size?: number; className?: string }) {
  // This would be replaced with actual error animation data
  const errorAnimationData = {
    // Placeholder - would be actual Lottie JSON data
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 90,
    w: 48,
    h: 48,
    nm: "Error",
    ddd: 0,
    assets: [],
    layers: []
  };

  return (
    <LottieAnimation
      animationData={errorAnimationData}
      width={size}
      height={size}
      loop={false}
      autoplay={true}
      className={`error-animation ${className}`}
      colorOverrides={{
        'Primary': '#ff4444',
        'Secondary': '#ffffff',
      }}
    />
  );
}

// Experimental Carson-inspired animations
export function ExperimentalAnimation({ 
  animationData, 
  className = '',
  intensity = 'medium' 
}: { 
  animationData: any; 
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}) {
  const intensitySettings = {
    low: { speed: 0.8, loop: true },
    medium: { speed: 1.2, loop: true },
    high: { speed: 1.8, loop: true },
  };

  const settings = intensitySettings[intensity];

  return (
    <LottieAnimation
      animationData={animationData}
      className={`experimental-animation intensity-${intensity} ${className}`}
      speed={settings.speed}
      loop={settings.loop}
      playOnHover={true}
      colorOverrides={{
        'Primary': '#ff6b35',
        'Secondary': '#00d4ff',
        'Tertiary': '#ff1744',
      }}
    />
  );
}

export default LottieAnimation;
