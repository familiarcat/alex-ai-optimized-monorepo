/**
 * Centralized Styling Hook
 * Provides component-specific styles based on the Design System
 */

"use client";

import { useMemo } from 'react';
import { useDesignSystem } from '@/providers/DesignSystemProvider';

export interface ComponentStyles {
  [key: string]: string;
}

export const useStyles = (componentName: string): ComponentStyles => {
  const { designSystem } = useDesignSystem();
  
  return useMemo(() => {
    // Component style definitions using actual Tailwind classes
    const componentStyles = {
      // Page-level styles
      page: {
        container: `min-h-screen bg-gray-900 text-white`,
        section: `py-16 px-4`,
        content: `max-w-7xl mx-auto`,
      },
      
      // Hero component styles
      hero: {
        container: `relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50`,
        background: `absolute inset-0 opacity-30`,
        content: `relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16`,
        grid: `grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-center`,
        textContainer: `text-center lg:text-left order-2 lg:order-1`,
        visualContainer: `relative order-1 lg:order-2`,
        heading: `text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-gray-900`,
        subheading: `block mb-2 text-gray-900`,
        gradientText: `block mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`,
        description: `text-xl text-gray-600 mb-8 leading-relaxed`,
        buttonContainer: `flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mb-8 sm:mb-10`,
        primaryButton: `bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 font-bold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`,
        secondaryButton: `border-2 border-gray-800 text-gray-800 hover:bg-gray-100 text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 font-bold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`,
        trustContainer: `text-center lg:text-left`,
        trustIndicator: `inline-flex items-center space-x-4 px-6 py-3 rounded-full bg-gray-100 border border-gray-200`,
        avatar: `w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-white text-sm font-bold transform hover:scale-110 transition-transform duration-200 bg-gradient-to-br from-blue-400 to-purple-500`,
        avatarText: `text-left`,
        avatarLabel: `text-sm font-semibold text-gray-900`,
        avatarSubtext: `text-xs text-gray-600`,
        dashboardCard: `bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 transform hover:scale-105 transition-all duration-500`,
        dashboardHeader: `flex items-center justify-between pb-4 border-b border-gray-200`,
        dashboardTitle: `text-lg sm:text-xl font-semibold text-gray-900`,
        statusDots: `flex space-x-2`,
        statusDot: `w-3 h-3 rounded-full animate-pulse`,
        statsGrid: `grid grid-cols-2 gap-3 sm:gap-4`,
        statCard: `bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4 transform hover:scale-105 transition-all duration-300`,
        statIcon: `p-2 rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-400 to-purple-500`,
        statValue: `text-lg sm:text-xl font-bold text-gray-900`,
        statLabel: `text-xs sm:text-sm text-gray-600`,
        activityContainer: `space-y-3`,
        activityTitle: `font-medium text-gray-900`,
        activityList: `space-y-2`,
        activityItem: `flex items-center space-x-3 p-2 sm:p-3 rounded-lg transform hover:scale-105 transition-all duration-200 bg-gray-50 border border-gray-200`,
        activityDot: `w-2 h-2 rounded-full flex-shrink-0 animate-pulse bg-green-400`,
        activityText: `text-xs sm:text-sm font-medium text-gray-700`,
        floatingElement: `absolute rounded-full opacity-20 animate-pulse`,
        floatingPrimary: `-top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-yellow-400 to-orange-500`,
        floatingSecondary: `-bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-green-400 to-blue-500`,
      },
      
      // Features component styles
      features: {
        container: `py-12 sm:py-16 lg:py-20 bg-white`,
        content: `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,
        header: `text-center mb-12 sm:mb-16 lg:mb-20`,
        heading: `text-4xl sm:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-gray-900`,
        subheading: `block mb-2 text-gray-900`,
        gradientHeading: `block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`,
        description: `text-xl sm:text-2xl max-w-4xl mx-auto font-medium text-gray-600`,
        grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6`,
        featureCard: `bg-white rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all duration-300 border border-gray-200`,
        featureIcon: `p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 bg-gray-100`,
        featureTitle: `text-sm sm:text-base leading-tight font-semibold text-gray-900`,
        featureDescription: `text-xs sm:text-sm leading-relaxed text-gray-600`,
        footer: `text-center mt-8 sm:mt-10 lg:mt-12`,
        footerBadge: `inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gray-100 text-blue-600`,
        footerText: `text-sm sm:text-base font-medium`,
      },
      
      // Artist Types component styles
      artistTypes: {
        container: `py-12 sm:py-16 lg:py-20 bg-gray-50`,
        content: `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,
        header: `text-center mb-12 sm:mb-16 lg:mb-20`,
        heading: `text-4xl sm:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-gray-900`,
        subheading: `block mb-2 text-gray-900`,
        gradientHeading: `block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`,
        description: `text-xl sm:text-2xl max-w-4xl mx-auto font-medium text-gray-600`,
        grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6`,
        typeCard: `bg-white rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all duration-300 border border-gray-200`,
        typeIcon: `p-1.5 rounded-lg flex-shrink-0 bg-gray-100`,
        typeTitle: `text-sm sm:text-base leading-tight font-semibold text-gray-900`,
        typeDescription: `text-xs text-gray-600 mb-2`,
        typeFeatures: `space-y-1`,
        typeFeature: `flex items-center space-x-1.5 text-xs text-gray-600`,
        typeFeatureDot: `w-1 h-1 rounded-full flex-shrink-0 bg-purple-400`,
        footer: `text-center mt-8 sm:mt-10 lg:mt-12`,
        footerCard: `bg-white rounded-lg p-6 sm:p-8 max-w-2xl mx-auto shadow-lg`,
        footerTitle: `text-lg sm:text-xl mb-3 sm:mb-4 font-semibold text-gray-900`,
        footerDescription: `text-sm sm:text-base mb-4 sm:mb-6 text-gray-600`,
        footerButton: `bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-medium transition-colors`,
      },
      
      // Testimonials component styles
      testimonials: {
        container: `py-12 sm:py-16 lg:py-20 bg-white`,
        content: `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,
        header: `text-center mb-12 sm:mb-16 lg:mb-20`,
        heading: `text-4xl sm:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-gray-900`,
        subheading: `block mb-2 text-gray-900`,
        gradientHeading: `block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`,
        description: `text-xl sm:text-2xl max-w-4xl mx-auto font-medium text-gray-600`,
        grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6`,
        testimonialCard: `bg-white rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all duration-300 border border-gray-200`,
        rating: `flex items-center space-x-1 mb-2`,
        star: `w-3 h-3 sm:w-4 sm:h-4 text-yellow-400`,
        quote: `w-4 h-4 sm:w-5 sm:h-5 mb-2 text-blue-600 opacity-30`,
        content: `mb-3 leading-relaxed text-xs sm:text-sm text-gray-600`,
        author: `flex items-start space-x-2`,
        avatar: `w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 bg-gradient-to-br from-blue-400 to-purple-500`,
        authorInfo: `min-w-0 flex-1`,
        authorName: `font-semibold text-xs sm:text-sm text-gray-900`,
        authorRole: `text-xs text-gray-600`,
        authorLocation: `text-xs text-gray-600 opacity-70`,
        footer: `text-center mt-8 sm:mt-10 lg:mt-12`,
        footerCard: `bg-white rounded-lg p-6 sm:p-8 shadow-lg`,
        footerTitle: `text-lg sm:text-xl mb-3 sm:mb-4 font-semibold text-gray-900`,
        footerDescription: `text-sm sm:text-base mb-4 sm:mb-6 text-gray-600`,
        footerButtons: `flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center`,
        footerButtonPrimary: `bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-medium transition-colors`,
        footerButtonSecondary: `border-2 border-gray-800 text-gray-800 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-medium transition-colors`,
      },
      
      // Pricing component styles
      pricing: {
        container: `py-12 sm:py-16 lg:py-20 bg-gray-50`,
        content: `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,
        header: `text-center mb-12 sm:mb-16 lg:mb-20`,
        heading: `text-4xl sm:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 text-gray-900`,
        subheading: `block mb-2 text-gray-900`,
        gradientHeading: `block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`,
        description: `text-xl sm:text-2xl max-w-4xl mx-auto font-medium text-gray-600`,
        grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto`,
        planCard: `relative rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border-2 transition-all duration-300`,
        planCardPopular: `bg-white shadow-xl scale-105 border-purple-500`,
        planCardDefault: `bg-white hover:shadow-lg border-gray-200`,
        popularBadge: `absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 bg-purple-600 text-white`,
        planHeader: `text-center mb-4 sm:mb-6`,
        planName: `text-base sm:text-lg mb-1 font-semibold text-gray-900`,
        planPrice: `flex items-baseline justify-center mb-2`,
        planPriceValue: `text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900`,
        planPricePeriod: `ml-1 text-sm text-gray-600`,
        planDescription: `text-xs sm:text-sm text-gray-600`,
        planFeatures: `space-y-1.5 sm:space-y-2 mb-4 sm:mb-6`,
        planFeature: `flex items-start space-x-2`,
        planFeatureIcon: `w-3 h-3 mt-0.5 flex-shrink-0 text-green-500`,
        planFeatureText: `text-xs text-gray-600`,
        planButton: `w-full px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm`,
        planButtonPopular: `bg-purple-600 hover:bg-purple-700 text-white`,
        planButtonDefault: `border-2 border-gray-800 text-gray-800 hover:bg-gray-100`,
        footer: `text-center mt-8 sm:mt-10 lg:mt-12`,
        footerCard: `bg-white rounded-lg p-6 sm:p-8 max-w-2xl mx-auto shadow-lg`,
        footerTitle: `text-lg sm:text-xl mb-3 sm:mb-4 font-semibold text-gray-900`,
        footerDescription: `text-sm sm:text-base mb-4 sm:mb-6 text-gray-600`,
        footerButton: `border-2 border-gray-800 text-gray-800 hover:bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-medium transition-colors`,
        disclaimer: `mt-8 sm:mt-10 lg:mt-12 text-center`,
        disclaimerText: `text-xs sm:text-sm text-gray-600 opacity-70`,
      },
      
      // CTA component styles
      cta: {
        container: `py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-600 to-purple-600`,
        content: `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,
        header: `text-center text-white`,
        heading: `text-4xl sm:text-5xl lg:text-6xl font-black mb-6 sm:mb-8`,
        subheading: `block mb-2 text-white`,
        description: `text-lg sm:text-xl mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto opacity-90`,
        buttonContainer: `flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 lg:mb-12`,
        primaryButton: `bg-white text-blue-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold border-2 border-white hover:bg-gray-100 transition-colors`,
        secondaryButton: `bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition-colors`,
        statsGrid: `grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto`,
        statItem: `text-center`,
        statIcon: `inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 sm:mb-3 bg-white bg-opacity-20`,
        statValue: `text-2xl sm:text-3xl font-bold text-white mb-1`,
        statLabel: `text-sm sm:text-base opacity-80`,
        footer: `mt-8 sm:mt-10 lg:mt-12 opacity-80`,
        footerText: `text-xs sm:text-sm`,
      },
      
      // Header component styles
      header: {
        container: `sticky top-0 z-50 shadow-sm border-b bg-white border-gray-200`,
        content: `w-full px-4 sm:px-6 lg:px-8`,
        nav: `flex justify-between items-center h-14 sm:h-16 min-h-[3.5rem]`,
        logo: `flex items-center flex-shrink-0`,
        logoLink: `flex items-center space-x-2`,
        logoIcon: `w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-400 to-purple-500`,
        logoText: `text-lg sm:text-xl font-bold text-gray-900`,
        desktopNav: `hidden md:flex space-x-2 lg:space-x-3 xl:space-x-4`,
        navLink: `px-2 py-1 text-xs lg:text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap rounded-md text-gray-700 hover:bg-gray-100`,
        desktopActions: `hidden md:flex items-center space-x-2 lg:space-x-3`,
        actionButton: `px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 hover:scale-105 bg-gray-100 text-gray-700 border border-gray-200`,
        primaryButton: `px-4 py-2 text-xs font-bold rounded-md transition-all duration-200 hover:scale-105 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white`,
        secondaryButton: `px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 hover:scale-105 bg-transparent text-gray-700 border-2 border-gray-200`,
        mobileButton: `md:hidden p-2 rounded-md transition-colors text-gray-700`,
        mobileNav: `md:hidden`,
        mobileContent: `px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 bg-white`,
        mobileLink: `block px-3 py-2 text-sm font-medium transition-colors hover:opacity-80 text-gray-600`,
        mobileActions: `pt-4 space-y-2`,
        mobileActionButton: `w-full justify-start text-sm`,
      },
      
      // Footer component styles
      footer: {
        container: `bg-gray-900 border-t border-gray-800`,
        content: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12`,
        grid: `grid grid-cols-1 md:grid-cols-4 gap-8`,
        section: `space-y-4`,
        title: `text-sm font-semibold text-white uppercase tracking-wider`,
        link: `text-sm text-gray-400 hover:text-white transition-colors`,
        description: `text-sm text-gray-400 leading-relaxed`,
        socialLinks: `flex space-x-4`,
        socialLink: `text-gray-400 hover:text-blue-400 transition-colors`,
        bottom: `mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center`,
        copyright: `text-sm text-gray-400`,
        legal: `flex space-x-6 mt-4 md:mt-0`,
        legalLink: `text-sm text-gray-400 hover:text-white transition-colors`,
      },
    };
    
    return componentStyles[componentName] || {};
  }, [designSystem, componentName]);
};

// Utility function to get individual design tokens
export const getDesignToken = (path: string, designSystem: any): string => {
  const keys = path.split('.');
  let value = designSystem;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return '';
    }
  }
  
  return typeof value === 'string' ? value : '';
};

// Utility function to create custom styles
export const createCustomStyles = (styles: Record<string, string>): string => {
  return Object.entries(styles)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
};