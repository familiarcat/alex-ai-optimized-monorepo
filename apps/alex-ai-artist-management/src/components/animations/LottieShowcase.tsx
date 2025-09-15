/**
 * Alex AI Lottie Animation Showcase
 * Demonstrates all animation features and interactions
 */

"use client";

import React, { useState, useEffect } from 'react';
import { LottieAnimation, LoadingAnimation, SuccessAnimation, ErrorAnimation, ExperimentalAnimation } from './LottieAnimation';
import { lottieAssetManager } from '@/lib/lottie-asset-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LottieShowcase() {
  const [animations, setAnimations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedAnimation, setSelectedAnimation] = useState<string>('CTA_Button');
  const [playMode, setPlayMode] = useState<'autoplay' | 'hover' | 'click' | 'scroll' | 'mouse'>('autoplay');

  // Load all available animations
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const animationNames = [
          'CTA_Button',
          'Loading_Spinner', 
          'Success_Checkmark',
          'Error_X',
          'Hover_Effect',
          'Scroll_Indicator'
        ];

        const loadedAnimations: Record<string, any> = {};
        
        for (const name of animationNames) {
          try {
            const animation = await lottieAssetManager.loadAnimation(name);
            if (animation) {
              loadedAnimations[name] = animation;
            }
          } catch (error) {
            console.warn(`Failed to load animation ${name}:`, error);
          }
        }

        setAnimations(loadedAnimations);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load animations:', error);
        setLoading(false);
      }
    };

    loadAnimations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingAnimation size={64} />
        <span className="ml-4 text-lg">Loading animations...</span>
      </div>
    );
  }

  const animationNames = Object.keys(animations);
  const currentAnimation = animations[selectedAnimation];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Alex AI Lottie Animation Showcase
          </h1>
          <p className="text-xl text-gray-600">
            Interactive demonstrations of our After Effects + Lottie integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Animation Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Animation Library</CardTitle>
                <CardDescription>
                  Select an animation to preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {animationNames.map((name) => (
                  <Button
                    key={name}
                    variant={selectedAnimation === name ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedAnimation(name)}
                  >
                    {name.replace(/_/g, ' ')}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Play Modes</CardTitle>
                <CardDescription>
                  Choose how the animation plays
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { value: 'autoplay', label: 'Auto Play' },
                  { value: 'hover', label: 'On Hover' },
                  { value: 'click', label: 'On Click' },
                  { value: 'scroll', label: 'On Scroll' },
                  { value: 'mouse', label: 'Mouse Follow' }
                ].map((mode) => (
                  <Button
                    key={mode.value}
                    variant={playMode === mode.value ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setPlayMode(mode.value as any)}
                  >
                    {mode.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Animation Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedAnimation.replace(/_/g, ' ')}
                  <Badge variant="secondary">
                    {playMode}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Interactive preview with different play modes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center min-h-[400px] bg-gray-100 rounded-lg p-8">
                  {currentAnimation ? (
                    <LottieAnimation
                      animationData={currentAnimation}
                      width={300}
                      height={200}
                      autoplay={playMode === 'autoplay'}
                      playOnHover={playMode === 'hover'}
                      playOnClick={playMode === 'click'}
                      playOnScroll={playMode === 'scroll'}
                      playOnMouseMove={playMode === 'mouse'}
                      mouseSensitivity={playMode === 'mouse' ? 2 : 1}
                      scrollThreshold={0.3}
                      onComplete={() => console.log('Animation completed')}
                      onScroll={(progress) => console.log('Scroll progress:', progress)}
                      onMouseMove={(position) => console.log('Mouse position:', position)}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <p>Animation not found</p>
                      <p className="text-sm">Check if the animation file exists</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pre-configured Components */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Pre-configured Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Loading Animation</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <LoadingAnimation size={48} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Success Animation</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <SuccessAnimation size={48} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Error Animation</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ErrorAnimation size={48} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Interactive Examples */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Interactive Examples</h3>
              <div className="space-y-4">
                {/* Hover Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Hover to Play</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      {currentAnimation && (
                        <LottieAnimation
                          animationData={currentAnimation}
                          width={200}
                          height={100}
                          playOnHover={true}
                          autoplay={false}
                          loop={false}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Click Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Click to Play</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      {currentAnimation && (
                        <LottieAnimation
                          animationData={currentAnimation}
                          width={200}
                          height={100}
                          playOnClick={true}
                          autoplay={false}
                          loop={false}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Mouse Follow Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Mouse Follow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      {currentAnimation && (
                        <LottieAnimation
                          animationData={currentAnimation}
                          width={200}
                          height={100}
                          playOnMouseMove={true}
                          autoplay={false}
                          loop={false}
                          mouseSensitivity={2}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
              <CardDescription>
                How to use Lottie animations in your components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Usage</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { LottieAnimation } from '@/components/animations/LottieAnimation';

<LottieAnimation
  animationData={animationData}
  width={300}
  height={200}
  autoplay={true}
  loop={true}
/>`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Interactive Features</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<LottieAnimation
  animationData={animationData}
  playOnHover={true}
  playOnClick={true}
  playOnScroll={true}
  playOnMouseMove={true}
  onComplete={() => console.log('Done!')}
/>`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Pre-configured Components</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { 
  LoadingAnimation, 
  SuccessAnimation, 
  ErrorAnimation 
} from '@/components/animations/LottieAnimation';

<LoadingAnimation size={64} />
<SuccessAnimation size={48} />
<ErrorAnimation size={48} />`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LottieShowcase;
