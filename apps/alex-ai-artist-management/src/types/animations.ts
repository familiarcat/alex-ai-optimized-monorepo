/**
 * Alex AI Animation Types
 * Lottie integration and animation configuration types
 */

export interface AnimationConfig {
  container: HTMLElement;
  renderer: 'svg' | 'canvas' | 'html';
  loop: boolean;
  autoplay: boolean;
  animationData: any;
  rendererSettings?: {
    preserveAspectRatio?: string;
    className?: string;
    [key: string]: any;
  };
  name?: string;
  path?: string;
  renderer?: 'svg' | 'canvas' | 'html';
  [key: string]: any;
}

export interface LottieAnimationData {
  v: string; // Version
  fr: number; // Frame rate
  ip: number; // In point
  op: number; // Out point
  w: number; // Width
  h: number; // Height
  nm: string; // Name
  ddd: number; // 3D
  assets: any[]; // Assets
  layers: any[]; // Layers
  markers?: any[]; // Markers
  fonts?: any; // Fonts
  chars?: any[]; // Characters
  comps?: any[]; // Compositions
  [key: string]: any;
}

export interface AnimationTheme {
  name: string;
  colors: Record<string, string>;
  opacity?: Record<string, number>;
  scale?: Record<string, number>;
  rotation?: Record<string, number>;
}

export interface AnimationPreset {
  name: string;
  description: string;
  category: 'loading' | 'success' | 'error' | 'warning' | 'interactive' | 'experimental';
  intensity: 'low' | 'medium' | 'high';
  duration: number;
  loop: boolean;
  autoplay: boolean;
  playOnHover: boolean;
  playOnClick: boolean;
  colorOverrides: Record<string, string>;
  size: {
    width: number;
    height: number;
  };
  tags: string[];
}

export interface AnimationLibrary {
  presets: AnimationPreset[];
  themes: AnimationTheme[];
  customAnimations: LottieAnimationData[];
}

export interface AnimationControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  goToAndStop: (value: number, isFrame?: boolean) => void;
  goToAndPlay: (value: number, isFrame?: boolean) => void;
  setSpeed: (speed: number) => void;
  setDirection: (direction: 1 | -1) => void;
  playSegments: (segments: number[] | number[][], forceFlag?: boolean) => void;
  setSubframe: (useSubFrames: boolean) => void;
  destroy: () => void;
  resize: () => void;
  getDuration: (inFrames?: boolean) => number;
  getCurrentTime: (inFrames?: boolean) => number;
  getTotalFrames: () => number;
  getFrameRate: () => number;
  getSpeed: () => number;
  getDirection: () => number;
  isPaused: () => boolean;
  isStopped: () => boolean;
  isLoaded: () => boolean;
  isComplete: () => boolean;
}

export interface AnimationEvents {
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: (currentTime: number) => void;
  onSegmentStart?: (segmentName: string) => void;
  onDestroy?: () => void;
  onError?: (error: Error) => void;
  onDataReady?: () => void;
  onDataFailed?: (error: Error) => void;
  onLoaded?: () => void;
  onResize?: () => void;
}

export interface AnimationPerformance {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  frameDrops: number;
  isOptimized: boolean;
}

export interface AnimationAccessibility {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

export interface AnimationOptimization {
  compress: boolean;
  minify: boolean;
  removeUnusedAssets: boolean;
  optimizePaths: boolean;
  reduceKeyframes: boolean;
  targetFileSize?: number;
  quality?: 'low' | 'medium' | 'high';
}

export interface AnimationExport {
  format: 'lottie' | 'gif' | 'mp4' | 'webm';
  quality: 'low' | 'medium' | 'high';
  fps: number;
  width: number;
  height: number;
  backgroundColor?: string;
  transparent: boolean;
  loop: boolean;
  duration?: number;
}

export interface AnimationAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'data';
  url: string;
  size: number;
  format: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  optimized: boolean;
  variants?: AnimationAsset[];
}

export interface AnimationLayer {
  id: string;
  name: string;
  type: 'shape' | 'text' | 'image' | 'video' | 'audio' | 'camera' | 'light' | 'null';
  visible: boolean;
  locked: boolean;
  parent?: string;
  children?: string[];
  properties: {
    position?: { x: number; y: number };
    scale?: { x: number; y: number };
    rotation?: number;
    opacity?: number;
    anchor?: { x: number; y: number };
    [key: string]: any;
  };
  effects?: any[];
  masks?: any[];
  mattes?: any[];
  blendMode?: string;
  trackMatte?: string;
  timeStretch?: number;
  startTime?: number;
  endTime?: number;
}

export interface AnimationComposition {
  id: string;
  name: string;
  width: number;
  height: number;
  frameRate: number;
  duration: number;
  layers: AnimationLayer[];
  assets: AnimationAsset[];
  markers: any[];
  workArea: {
    start: number;
    end: number;
  };
  renderSettings: {
    quality: 'low' | 'medium' | 'high';
    antialiasing: boolean;
    motionBlur: boolean;
    frameBlending: boolean;
  };
}

export interface AnimationProject {
  id: string;
  name: string;
  description: string;
  version: string;
  created: Date;
  modified: Date;
  author: string;
  compositions: AnimationComposition[];
  assets: AnimationAsset[];
  settings: {
    defaultFrameRate: number;
    defaultDuration: number;
    defaultQuality: 'low' | 'medium' | 'high';
    autoSave: boolean;
    backup: boolean;
  };
  metadata: {
    tags: string[];
    category: string;
    license: string;
    attribution: string;
    [key: string]: any;
  };
}

export interface AnimationWorkflow {
  id: string;
  name: string;
  description: string;
  steps: AnimationWorkflowStep[];
  triggers: AnimationWorkflowTrigger[];
  outputs: AnimationWorkflowOutput[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  created: Date;
  modified: Date;
  lastRun?: Date;
  nextRun?: Date;
}

export interface AnimationWorkflowStep {
  id: string;
  name: string;
  type: 'import' | 'process' | 'export' | 'transform' | 'optimize' | 'validate';
  config: Record<string, any>;
  inputs: string[];
  outputs: string[];
  dependencies: string[];
  timeout?: number;
  retries?: number;
  onError?: 'stop' | 'continue' | 'retry';
}

export interface AnimationWorkflowTrigger {
  id: string;
  name: string;
  type: 'manual' | 'schedule' | 'file' | 'api' | 'webhook';
  config: Record<string, any>;
  enabled: boolean;
  lastTriggered?: Date;
}

export interface AnimationWorkflowOutput {
  id: string;
  name: string;
  type: 'file' | 'url' | 'data' | 'notification';
  config: Record<string, any>;
  format: string;
  destination: string;
  enabled: boolean;
  lastGenerated?: Date;
}

export interface AnimationAnalytics {
  id: string;
  animationId: string;
  timestamp: Date;
  event: 'load' | 'play' | 'pause' | 'stop' | 'complete' | 'error' | 'interaction';
  data: {
    duration?: number;
    frameRate?: number;
    memoryUsage?: number;
    userAgent?: string;
    viewport?: { width: number; height: number };
    [key: string]: any;
  };
}

export interface AnimationMetrics {
  totalPlays: number;
  totalDuration: number;
  averagePlayTime: number;
  completionRate: number;
  errorRate: number;
  performanceScore: number;
  userEngagement: number;
  accessibilityScore: number;
  lastUpdated: Date;
}

export interface AnimationValidation {
  isValid: boolean;
  errors: AnimationValidationError[];
  warnings: AnimationValidationWarning[];
  suggestions: AnimationValidationSuggestion[];
  performance: AnimationPerformance;
  accessibility: AnimationAccessibility;
  compatibility: {
    browsers: string[];
    devices: string[];
    platforms: string[];
  };
}

export interface AnimationValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  layer?: string;
  property?: string;
  value?: any;
  suggestion?: string;
}

export interface AnimationValidationWarning {
  code: string;
  message: string;
  layer?: string;
  property?: string;
  value?: any;
  suggestion?: string;
}

export interface AnimationValidationSuggestion {
  code: string;
  message: string;
  layer?: string;
  property?: string;
  currentValue?: any;
  suggestedValue?: any;
  reason?: string;
}
