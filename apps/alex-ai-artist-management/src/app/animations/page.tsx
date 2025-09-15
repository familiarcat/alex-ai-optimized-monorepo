/**
 * Alex AI Design Theory Animation Implementation
 * Complete UI integration with Carson/Brockmann animation system
 */

"use client";

import React, { useState, useEffect } from 'react';
import { DesignTheoryAnimationProvider, withDesignTheoryAnimation } from '@/components/animations/DesignTheoryAnimationProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDesignTheoryAnimations } from '@/components/animations/DesignTheoryAnimationProvider';
import { Play, Pause, RefreshCw, Settings, Palette, Zap } from 'lucide-react';

// Enhanced Button component with design theory animations
const AnimatedButton = withDesignTheoryAnimation(Button, {
  type: 'button',
  interactionType: 'click',
  priority: 'high'
});

// Enhanced Card component with design theory animations
const AnimatedCard = withDesignTheoryAnimation(Card, {
  type: 'card',
  interactionType: 'hover',
  priority: 'medium'
});

// Enhanced Badge component with design theory animations
const AnimatedBadge = withDesignTheoryAnimation(Badge, {
  type: 'badge',
  interactionType: 'hover',
  priority: 'low'
});

function AnimationDemo() {
  const { isAnalyzing, analysisProgress, totalElements, analyzedElements } = useDesignTheoryAnimations();
  const [designTheory, setDesignTheory] = useState<'carson' | 'brockmann' | 'hybrid'>('hybrid');
  const [visualStyle, setVisualStyle] = useState<'experimental' | 'minimalist' | 'bold' | 'subtle' | 'dynamic' | 'static'>('dynamic');
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Alex AI Design Theory Animation System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered animations based on Carson/Brockmann design theory
          </p>
          
          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Design Theory:</label>
              <select 
                value={designTheory} 
                onChange={(e) => setDesignTheory(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md"
              >
                <option value="carson">Carson (Experimental)</option>
                <option value="brockmann">Brockmann (Systematic)</option>
                <option value="hybrid">Hybrid (Modern)</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Visual Style:</label>
              <select 
                value={visualStyle} 
                onChange={(e) => setVisualStyle(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md"
              >
                <option value="experimental">Experimental</option>
                <option value="minimalist">Minimalist</option>
                <option value="bold">Bold</option>
                <option value="subtle">Subtle</option>
                <option value="dynamic">Dynamic</option>
                <option value="static">Static</option>
              </select>
            </div>
            
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              size="sm"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'} Animations
            </Button>
          </div>

          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    AI is analyzing UI elements for optimal animations...
                  </p>
                  <p className="text-xs text-blue-700">
                    {analyzedElements} of {totalElements} elements analyzed
                  </p>
                  <div className="w-64 bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="showcase" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="showcase">Showcase</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Showcase Tab */}
          <TabsContent value="showcase" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Carson Style Demo */}
              <AnimatedCard 
                data-animation-type="card"
                data-visual-style="experimental"
                data-priority="high"
                className="border-2 border-orange-500"
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <span>Carson Experimental</span>
                  </CardTitle>
                  <CardDescription>
                    Chaotic, bold, unconventional animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AnimatedButton 
                      data-animation-type="button"
                      data-visual-style="experimental"
                      data-interaction-type="click"
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Rebel Now
                    </AnimatedButton>
                    
                    <div className="flex space-x-2">
                      <AnimatedBadge variant="secondary" data-animation-type="badge">
                        Chaotic
                      </AnimatedBadge>
                      <AnimatedBadge variant="secondary" data-animation-type="badge">
                        Bold
                      </AnimatedBadge>
                      <AnimatedBadge variant="secondary" data-animation-type="badge">
                        Experimental
                      </AnimatedBadge>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Brockmann Style Demo */}
              <AnimatedCard 
                data-animation-type="card"
                data-visual-style="minimalist"
                data-priority="medium"
                className="border-2 border-blue-500"
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    <span>Brockmann Systematic</span>
                  </CardTitle>
                  <CardDescription>
                    Precise, minimal, functional animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AnimatedButton 
                      data-animation-type="button"
                      data-visual-style="minimalist"
                      data-interaction-type="click"
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      Systematic
                    </AnimatedButton>
                    
                    <div className="flex space-x-2">
                      <AnimatedBadge variant="secondary" data-animation-type="badge">
                        Precise
                      </AnimatedBadge>
                      <AnimatedBadge variant="secondary" data-animation-type="badge">
                        Minimal
                      </AnimatedBadge>
                      <AnimatedBadge variant="secondary" data-animation-type="badge">
                        Functional
                      </AnimatedBadge>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Hybrid Style Demo */}
              <AnimatedCard 
                data-animation-type="card"
                data-visual-style="dynamic"
                data-priority="high"
                className="border-2 border-purple-500"
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    <span>Hybrid Modern</span>
                  </CardTitle>
                  <CardDescription>
                    Balanced, accessible, innovative animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AnimatedButton 
                      data-animation-type="button"
                      data-visual-style="dynamic"
                      data-interaction-type="click"
                      className="w-full bg-purple-500 hover:bg-purple-600"
                    >
                      Modern
                    </AnimatedButton>
                    
                    <div className="flex space-x-2">
                      <AnimatedBadge variant="secondary" data-animation-type="badge">
                        Balanced
                      </AnimatedBadge>
                      <AnimatedBadge variant="secondary" data-animation-type="badge">
                        Accessible
                      </AnimatedBadge>
                      <AnimatedBadge variant="secondary" data-animation-type="badge">
                        Innovative
                      </AnimatedBadge>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Button Variations */}
              <Card>
                <CardHeader>
                  <CardTitle>Button Animations</CardTitle>
                  <CardDescription>
                    Different button styles with design theory animations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatedButton 
                    data-animation-type="button"
                    data-interaction-type="click"
                    data-priority="high"
                    className="w-full"
                  >
                    Primary Button
                  </AnimatedButton>
                  
                  <AnimatedButton 
                    data-animation-type="button"
                    data-interaction-type="hover"
                    data-priority="medium"
                    variant="outline"
                    className="w-full"
                  >
                    Secondary Button
                  </AnimatedButton>
                  
                  <AnimatedButton 
                    data-animation-type="button"
                    data-interaction-type="click"
                    data-priority="low"
                    variant="ghost"
                    className="w-full"
                  >
                    Ghost Button
                  </AnimatedButton>
                </CardContent>
              </Card>

              {/* Card Variations */}
              <Card>
                <CardHeader>
                  <CardTitle>Card Animations</CardTitle>
                  <CardDescription>
                    Interactive cards with hover and focus animations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatedCard 
                    data-animation-type="card"
                    data-interaction-type="hover"
                    data-priority="medium"
                    className="p-4"
                  >
                    <h4 className="font-medium">Hover Card</h4>
                    <p className="text-sm text-gray-600">Hover for animation</p>
                  </AnimatedCard>
                  
                  <AnimatedCard 
                    data-animation-type="card"
                    data-interaction-type="focus"
                    data-priority="high"
                    className="p-4"
                  >
                    <h4 className="font-medium">Focus Card</h4>
                    <p className="text-sm text-gray-600">Click to focus</p>
                  </AnimatedCard>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interactions Tab */}
          <TabsContent value="interactions" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Hover Interactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hover Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div 
                      data-animation-element
                      data-animation-type="button"
                      data-interaction-type="hover"
                      className="p-4 bg-blue-100 rounded-lg cursor-pointer"
                    >
                      Hover me
                    </div>
                    <div 
                      data-animation-element
                      data-animation-type="card"
                      data-interaction-type="hover"
                      className="p-4 bg-green-100 rounded-lg cursor-pointer"
                    >
                      Hover card
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Click Interactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Click Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div 
                      data-animation-element
                      data-animation-type="button"
                      data-interaction-type="click"
                      className="p-4 bg-red-100 rounded-lg cursor-pointer"
                    >
                      Click me
                    </div>
                    <div 
                      data-animation-element
                      data-animation-type="badge"
                      data-interaction-type="click"
                      className="p-4 bg-yellow-100 rounded-lg cursor-pointer"
                    >
                      Click badge
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Micro Interactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Micro Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div 
                      data-animation-element
                      data-animation-type="button"
                      data-interaction-type="micro-interaction"
                      className="p-4 bg-purple-100 rounded-lg cursor-pointer"
                    >
                      Micro interaction
                    </div>
                    <div 
                      data-animation-element
                      data-animation-type="badge"
                      data-interaction-type="micro-interaction"
                      className="p-4 bg-pink-100 rounded-lg cursor-pointer"
                    >
                      Micro badge
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Animation Settings</CardTitle>
                <CardDescription>
                  Configure the AI animation system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Design Theory
                    </label>
                    <select 
                      value={designTheory} 
                      onChange={(e) => setDesignTheory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="carson">Carson (Experimental)</option>
                      <option value="brockmann">Brockmann (Systematic)</option>
                      <option value="hybrid">Hybrid (Modern)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Visual Style
                    </label>
                    <select 
                      value={visualStyle} 
                      onChange={(e) => setVisualStyle(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="experimental">Experimental</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="bold">Bold</option>
                      <option value="subtle">Subtle</option>
                      <option value="dynamic">Dynamic</option>
                      <option value="static">Static</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Analysis Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Elements Analyzed:</span>
                      <span>{analyzedElements} / {totalElements}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={isAnalyzing ? 'text-blue-600' : 'text-green-600'}>
                        {isAnalyzing ? 'Analyzing...' : 'Complete'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AnimationsPage() {
  return (
    <DesignTheoryAnimationProvider autoAnalyze={true}>
      <AnimationDemo />
    </DesignTheoryAnimationProvider>
  );
}
