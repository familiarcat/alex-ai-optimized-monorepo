/**
 * Alex AI Design System Provider
 * Synthesis of David Carson (experimental) and Josef Muller-Brockmann (Swiss precision)
 * Dark, edgy aesthetic with maintained legibility
 */

"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Design System Types
export interface ColorPalette {
  // Dark Base Colors
  bg: {
    primary: string;      // #0a0a0a - Near black
    secondary: string;    // #1a1a1a - Dark gray
    tertiary: string;     // #2a2a2a - Medium dark
    elevated: string;     // #3a3a3a - Elevated surfaces
    overlay: string;      // rgba(0, 0, 0, 0.8) - Overlays
  };
  
  // Accent Colors - Carson Inspired
  accent: {
    primary: string;      // #ff6b35 - Orange energy
    secondary: string;    // #00d4ff - Cyan creativity
    tertiary: string;     // #ff1744 - Red passion
    success: string;      // #00ff88 - Green success
    warning: string;      // #ffaa00 - Yellow warning
    error: string;        // #ff4444 - Red error
  };
  
  // Text Colors - Muller-Brockmann Clarity
  text: {
    primary: string;      // #ffffff - Pure white headers
    secondary: string;    // #e0e0e0 - Light gray body
    muted: string;        // #a0a0a0 - Muted gray captions
    inverse: string;      // #000000 - Black on light
    accent: string;       // #ff6b35 - Accent text
  };
  
  // Border Colors
  border: {
    primary: string;      // #333333 - Primary borders
    secondary: string;    // #444444 - Secondary borders
    accent: string;       // #ff6b35 - Accent borders
    subtle: string;       // #222222 - Subtle borders
  };
}

export interface TypographyScale {
  // Font Families
  fonts: {
    heading: string;      // Experimental, Carson-inspired
    body: string;         // Swiss precision, readable
    mono: string;         // Monospace for code/data
    accent: string;       // Artistic flourishes
  };
  
  // Font Sizes - Mathematical progression
  sizes: {
    xs: string;           // 0.75rem - 12px
    sm: string;           // 0.875rem - 14px
    base: string;         // 1rem - 16px
    lg: string;           // 1.125rem - 18px
    xl: string;           // 1.25rem - 20px
    '2xl': string;        // 1.5rem - 24px
    '3xl': string;        // 1.875rem - 30px
    '4xl': string;        // 2.25rem - 36px
    '5xl': string;        // 3rem - 48px
    '6xl': string;        // 3.75rem - 60px
  };
  
  // Font Weights
  weights: {
    light: number;        // 300
    normal: number;       // 400
    medium: number;       // 500
    semibold: number;     // 600
    bold: number;         // 700
    extrabold: number;    // 800
    black: number;        // 900
  };
  
  // Line Heights
  lineHeights: {
    tight: number;        // 1.25
    normal: number;       // 1.5
    relaxed: number;      // 1.75
    loose: number;        // 2
  };
}

export interface SpacingScale {
  // Spacing Scale - 8px base unit
  space: {
    0: string;            // 0px
    1: string;            // 0.25rem - 4px
    2: string;            // 0.5rem - 8px
    3: string;            // 0.75rem - 12px
    4: string;            // 1rem - 16px
    5: string;            // 1.25rem - 20px
    6: string;            // 1.5rem - 24px
    8: string;            // 2rem - 32px
    10: string;           // 2.5rem - 40px
    12: string;           // 3rem - 48px
    16: string;           // 4rem - 64px
    20: string;           // 5rem - 80px
    24: string;           // 6rem - 96px
    32: string;           // 8rem - 128px
  };
  
  // Border Radius
  radius: {
    none: string;         // 0px
    sm: string;           // 0.125rem - 2px
    base: string;         // 0.25rem - 4px
    md: string;           // 0.375rem - 6px
    lg: string;           // 0.5rem - 8px
    xl: string;           // 0.75rem - 12px
    '2xl': string;        // 1rem - 16px
    '3xl': string;        // 1.5rem - 24px
    full: string;         // 9999px
  };
}

export interface BreakpointScale {
  sm: string;             // 640px
  md: string;             // 768px
  lg: string;             // 1024px
  xl: string;             // 1280px
  '2xl': string;          // 1536px
}

export interface AnimationPresets {
  // Transitions
  transitions: {
    fast: string;         // 150ms
    normal: string;       // 300ms
    slow: string;         // 500ms
  };
  
  // Easing Functions
  easing: {
    linear: string;       // linear
    ease: string;         // ease
    easeIn: string;       // ease-in
    easeOut: string;      // ease-out
    easeInOut: string;    // ease-in-out
    bounce: string;       // cubic-bezier(0.68, -0.55, 0.265, 1.55)
  };
  
  // Keyframe Animations
  keyframes: {
    fadeIn: string;
    slideUp: string;
    slideDown: string;
    scaleIn: string;
    rotate: string;
    pulse: string;
    glow: string;
  };
}

export interface DesignSystem {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  breakpoints: BreakpointScale;
  animations: AnimationPresets;
  theme: 'dark' | 'light';
}

// Default Dark Theme
const defaultDesignSystem: DesignSystem = {
  colors: {
    bg: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      tertiary: '#2a2a2a',
      elevated: '#3a3a3a',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    accent: {
      primary: '#ff6b35',
      secondary: '#00d4ff',
      tertiary: '#ff1744',
      success: '#00ff88',
      warning: '#ffaa00',
      error: '#ff4444',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      muted: '#a0a0a0',
      inverse: '#000000',
      accent: '#ff6b35',
    },
    border: {
      primary: '#333333',
      secondary: '#444444',
      accent: '#ff6b35',
      subtle: '#222222',
    },
  },
  typography: {
    fonts: {
      heading: '"Inter", "Helvetica Neue", Arial, sans-serif',
      body: '"Inter", "Helvetica Neue", Arial, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
      accent: '"Inter", "Helvetica Neue", Arial, sans-serif',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },
  spacing: {
    space: {
      0: '0px',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
    },
    radius: {
      none: '0px',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  animations: {
    transitions: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    keyframes: {
      fadeIn: 'fadeIn 0.3s ease-in-out',
      slideUp: 'slideUp 0.3s ease-out',
      slideDown: 'slideDown 0.3s ease-out',
      scaleIn: 'scaleIn 0.2s ease-out',
      rotate: 'rotate 0.5s ease-in-out',
      pulse: 'pulse 2s ease-in-out infinite',
      glow: 'glow 1.5s ease-in-out infinite alternate',
    },
  },
  theme: 'dark',
};

// Context
const DesignSystemContext = createContext<{
  designSystem: DesignSystem;
  setTheme: (theme: 'dark' | 'light') => void;
  updateDesignSystem: (updates: Partial<DesignSystem>) => void;
} | null>(null);

// Provider Component
export function DesignSystemProvider({ children }: { children: ReactNode }) {
  const [designSystem, setDesignSystem] = useState<DesignSystem>(defaultDesignSystem);

  const setTheme = (theme: 'dark' | 'light') => {
    setDesignSystem(prev => ({ ...prev, theme }));
  };

  const updateDesignSystem = (updates: Partial<DesignSystem>) => {
    setDesignSystem(prev => ({ ...prev, ...updates }));
  };

  return (
    <DesignSystemContext.Provider value={{ designSystem, setTheme, updateDesignSystem }}>
      {children}
    </DesignSystemContext.Provider>
  );
}

// Hook
export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
}

// CSS Variables Generator
export function generateCSSVariables(designSystem: DesignSystem): string {
  const { colors, typography, spacing, animations } = designSystem;
  
  return `
    :root {
      /* Colors */
      --bg-primary: ${colors.bg.primary};
      --bg-secondary: ${colors.bg.secondary};
      --bg-tertiary: ${colors.bg.tertiary};
      --bg-elevated: ${colors.bg.elevated};
      --bg-overlay: ${colors.bg.overlay};
      
      --accent-primary: ${colors.accent.primary};
      --accent-secondary: ${colors.accent.secondary};
      --accent-tertiary: ${colors.accent.tertiary};
      --accent-success: ${colors.accent.success};
      --accent-warning: ${colors.accent.warning};
      --accent-error: ${colors.accent.error};
      
      --text-primary: ${colors.text.primary};
      --text-secondary: ${colors.text.secondary};
      --text-muted: ${colors.text.muted};
      --text-inverse: ${colors.text.inverse};
      --text-accent: ${colors.text.accent};
      
      --border-primary: ${colors.border.primary};
      --border-secondary: ${colors.border.secondary};
      --border-accent: ${colors.border.accent};
      --border-subtle: ${colors.border.subtle};
      
      /* Typography */
      --font-heading: ${typography.fonts.heading};
      --font-body: ${typography.fonts.body};
      --font-mono: ${typography.fonts.mono};
      --font-accent: ${typography.fonts.accent};
      
      /* Spacing */
      --space-0: ${spacing.space[0]};
      --space-1: ${spacing.space[1]};
      --space-2: ${spacing.space[2]};
      --space-3: ${spacing.space[3]};
      --space-4: ${spacing.space[4]};
      --space-5: ${spacing.space[5]};
      --space-6: ${spacing.space[6]};
      --space-8: ${spacing.space[8]};
      --space-10: ${spacing.space[10]};
      --space-12: ${spacing.space[12]};
      --space-16: ${spacing.space[16]};
      --space-20: ${spacing.space[20]};
      --space-24: ${spacing.space[24]};
      --space-32: ${spacing.space[32]};
      
      /* Animations */
      --transition-fast: ${animations.transitions.fast};
      --transition-normal: ${animations.transitions.normal};
      --transition-slow: ${animations.transitions.slow};
      
      --easing-linear: ${animations.easing.linear};
      --easing-ease: ${animations.easing.ease};
      --easing-ease-in: ${animations.easing.easeIn};
      --easing-ease-out: ${animations.easing.easeOut};
      --easing-ease-in-out: ${animations.easing.easeInOut};
      --easing-bounce: ${animations.easing.bounce};
    }
  `;
}
