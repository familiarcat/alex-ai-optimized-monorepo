/**
 * Alex AI Automated Animation Demo
 * Demonstrates the automated animation discovery and integration system
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LottieAnimation } from './LottieAnimation';
import { createAutomatedAnimationManager, ComponentAnimationRequest } from '@/lib/automated-animation-manager';
import { useDesignSystem } from '@/providers/DesignSystemProvider';
import { Search, Download, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function AutomatedAnimationDemo() {
  const { designSystem } = useDesignSystem();
  const [animationManager] = useState(() => createAutomatedAnimationManager(designSystem.colors));
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [integratedAnimations, setIntegratedAnimations] = useState<Record<string, any>>({});
  const [integrationStats, setIntegrationStats] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  // Load existing animations on mount
  useEffect(() => {
    loadExistingAnimations();
    updateStats();
  }, []);

  const loadExistingAnimations = async () => {
    try {
      const animations = animationManager.exportAnimations();
      setIntegratedAnimations(animations);
    } catch (error) {
      console.error('Error loading existing animations:', error);
    }
  };

  const updateStats = () => {
    const stats = animationManager.getIntegrationStats();
    setIntegrationStats(stats);
  };

  const handleAutoDiscover = async () => {
    setIsLoading(true);
    setProgress(0);

    try {
      const results = await animationManager.autoDiscoverAnimations();
      
      // Simulate progress updates
      for (let i = 0; i <= results.length; i++) {
        setProgress((i / results.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Reload animations and stats
      await loadExistingAnimations();
      updateStats();

      console.log('Auto-discovery results:', results);
    } catch (error) {
      console.error('Error during auto-discovery:', error);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await animationManager.searchAndPreview(searchQuery, 'all', 10);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching animations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegrateCustom = async (componentName: string, componentType: string) => {
    setIsLoading(true);
    try {
      const request: ComponentAnimationRequest = {
        componentName,
        componentType: componentType as any,
        preferredSource: 'auto',
        fallbackToGenerated: true
      };

      const results = await animationManager.integrateAnimationsForComponents([request]);
      
      if (results[0]?.success) {
        await loadExistingAnimations();
        updateStats();
      }
    } catch (error) {
      console.error('Error integrating custom animation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateColors = async () => {
    setIsLoading(true);
    try {
      // Generate new random colors for demo
      const newColors = {
        ...designSystem.colors,
        accent: {
          ...designSystem.colors.accent,
          primary: `#${Math.floor(Math.random()*16777215).toString(16)}`,
          secondary: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        }
      };

      await animationManager.updateDesignSystemColors(newColors);
      await loadExistingAnimations();
      updateStats();
    } catch (error) {
      console.error('Error updating colors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Alex AI Automated Animation System
          </h1>
          <p className="text-xl text-gray-600">
            Discover, integrate, and customize Lottie animations automatically
          </p>
        </div>

        {/* Stats Overview */}
        {integrationStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {integrationStats.totalAnimations}
                    </p>
                    <p className="text-sm text-gray-600">Total Animations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Download className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {integrationStats.lottieFilesCount}
                    </p>
                    <p className="text-sm text-gray-600">From LottieFiles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <RefreshCw className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {integrationStats.generatedCount}
                    </p>
                    <p className="text-sm text-gray-600">Generated</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Search className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {Object.keys(integrationStats.categories).length}
                    </p>
                    <p className="text-sm text-gray-600">Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search and Discovery */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Animation Discovery</CardTitle>
                <CardDescription>
                  Search LottieFiles or auto-discover animations for common components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search animations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={handleSearch} disabled={isLoading}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Auto Discovery */}
                <div className="space-y-2">
                  <Button 
                    onClick={handleAutoDiscover} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Auto-Discover Common Animations
                  </Button>
                  
                  {isLoading && (
                    <div className="space-y-2">
                      <Progress value={progress} className="w-full" />
                      <p className="text-sm text-gray-600 text-center">
                        Discovering and integrating animations...
                      </p>
                    </div>
                  )}
                </div>

                {/* Custom Integration */}
                <div className="space-y-2">
                  <h4 className="font-medium">Quick Integration</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIntegrateCustom('CustomCTA', 'cta')}
                      disabled={isLoading}
                    >
                      CTA Button
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIntegrateCustom('CustomLoading', 'loading')}
                      disabled={isLoading}
                    >
                      Loading
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIntegrateCustom('CustomSuccess', 'success')}
                      disabled={isLoading}
                    >
                      Success
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIntegrateCustom('CustomError', 'error')}
                      disabled={isLoading}
                    >
                      Error
                    </Button>
                  </div>
                </div>

                {/* Color Update */}
                <div className="space-y-2">
                  <Button
                    onClick={handleUpdateColors}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    Update All Colors
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>
                    Found {searchResults.length} animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {searchResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{result.title}</p>
                          <p className="text-sm text-gray-600">{result.author}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{result.downloads} downloads</Badge>
                          <Button size="sm" variant="outline">
                            Preview
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Integrated Animations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrated Animations</CardTitle>
                <CardDescription>
                  Animations that have been integrated into your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(integratedAnimations).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No animations integrated yet</p>
                    <p className="text-sm">Use auto-discovery or search to find animations</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(integratedAnimations).map(([name, animationData]) => (
                      <div key={name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{name}</h4>
                          <Badge variant="outline">
                            {animationData.w}x{animationData.h}
                          </Badge>
                        </div>
                        <div className="flex justify-center">
                          <LottieAnimation
                            animationData={animationData}
                            width={200}
                            height={100}
                            autoplay={true}
                            loop={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            {integrationStats && Object.keys(integrationStats.categories).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Animation Categories</CardTitle>
                  <CardDescription>
                    Breakdown of integrated animations by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(integrationStats.categories).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="capitalize">{category}</span>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutomatedAnimationDemo;
