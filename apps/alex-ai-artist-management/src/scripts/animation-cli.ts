#!/usr/bin/env node

/**
 * Alex AI Animation CLI
 * Command-line tool for automated animation management
 */

import { Command } from 'commander';
import { createAutomatedAnimationManager, ComponentAnimationRequest } from '../lib/automated-animation-manager';
import { lottieFilesScraper } from '../lib/lottie-scraper';
import { lottieGenerator } from '../lib/lottie-generator';
import fs from 'fs/promises';
import path from 'path';

// Mock design system colors for CLI usage
const defaultDesignSystemColors = {
  accent: {
    primary: '#33CCFF',
    secondary: '#CC33FF',
    tertiary: '#FF9900',
    success: '#00FF88',
    warning: '#FFCC00',
    error: '#FF4444'
  },
  bg: {
    primary: '#0D0D0D',
    secondary: '#262626'
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#E0E0E0',
    muted: '#A0A0A0'
  }
};

const program = new Command();

program
  .name('alex-animation-cli')
  .description('Alex AI Animation Management CLI')
  .version('1.0.0');

// Search command
program
  .command('search')
  .description('Search for animations on LottieFiles')
  .option('-q, --query <query>', 'Search query')
  .option('-c, --category <category>', 'Animation category', 'animations')
  .option('-l, --limit <number>', 'Number of results', '10')
  .option('-f, --free-only', 'Only free animations', true)
  .action(async (options) => {
    console.log('🔍 Searching LottieFiles...');
    
    try {
      const results = await lottieFilesScraper.searchAnimations({
        query: options.query,
        category: options.category as any,
        isFree: options.freeOnly,
        limit: parseInt(options.limit),
        sortBy: 'popular'
      });

      console.log(`\n📊 Found ${results.length} animations:\n`);
      
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.title}`);
        console.log(`   Author: ${result.author}`);
        console.log(`   Downloads: ${result.downloads} | Likes: ${result.likes}`);
        console.log(`   Size: ${result.dimensions.width}x${result.dimensions.height}`);
        console.log(`   Duration: ${result.duration}s | FPS: ${result.frameRate}`);
        console.log(`   Tags: ${result.tags.join(', ')}`);
        console.log(`   URL: ${result.url}\n`);
      });
    } catch (error) {
      console.error('❌ Error searching animations:', error);
      process.exit(1);
    }
  });

// Auto-discover command
program
  .command('discover')
  .description('Auto-discover and integrate common animations')
  .option('-o, --output <path>', 'Output directory for animations', './public/lottie')
  .action(async (options) => {
    console.log('🚀 Starting auto-discovery...');
    
    try {
      const manager = createAutomatedAnimationManager(defaultDesignSystemColors);
      const results = await manager.autoDiscoverAnimations();
      
      console.log(`\n📊 Discovery Results:`);
      console.log(`✅ Successful: ${results.filter(r => r.success).length}`);
      console.log(`❌ Failed: ${results.filter(r => !r.success).length}\n`);
      
      results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        const source = result.source === 'lottiefiles' ? 'LottieFiles' : 'Generated';
        console.log(`${status} ${result.componentName} (${source})`);
        
        if (!result.success && result.error) {
          console.log(`   Error: ${result.error}`);
        }
      });

      // Export animations to file
      if (options.output) {
        await fs.mkdir(options.output, { recursive: true });
        const animations = manager.exportAnimations();
        
        for (const [name, data] of Object.entries(animations)) {
          const filePath = path.join(options.output, `${name}.json`);
          await fs.writeFile(filePath, JSON.stringify(data, null, 2));
          console.log(`💾 Saved: ${filePath}`);
        }
      }

      // Show stats
      const stats = manager.getIntegrationStats();
      console.log(`\n📈 Integration Stats:`);
      console.log(`Total Animations: ${stats.totalAnimations}`);
      console.log(`From LottieFiles: ${stats.lottieFilesCount}`);
      console.log(`Generated: ${stats.generatedCount}`);
      console.log(`Categories: ${Object.keys(stats.categories).join(', ')}`);

    } catch (error) {
      console.error('❌ Error during auto-discovery:', error);
      process.exit(1);
    }
  });

// Generate command
program
  .command('generate')
  .description('Generate default animations for components')
  .option('-t, --type <type>', 'Animation type (cta, loading, success, error, background)')
  .option('-n, --name <name>', 'Animation name')
  .option('-w, --width <number>', 'Width', '300')
  .option('-h, --height <number>', 'Height', '200')
  .option('-d, --duration <number>', 'Duration in seconds', '2.0')
  .option('-o, --output <path>', 'Output file path')
  .action(async (options) => {
    console.log('🎨 Generating animation...');
    
    try {
      let animationData;
      
      switch (options.type) {
        case 'cta':
          animationData = lottieGenerator.generateCTAButton({
            name: options.name,
            width: parseInt(options.width),
            height: parseInt(options.height),
            duration: parseFloat(options.duration)
          });
          break;
        case 'loading':
          animationData = lottieGenerator.generateLoadingSpinner({
            name: options.name,
            width: parseInt(options.width),
            height: parseInt(options.height),
            duration: parseFloat(options.duration)
          });
          break;
        case 'success':
          animationData = lottieGenerator.generateSuccessCheckmark({
            name: options.name,
            width: parseInt(options.width),
            height: parseInt(options.height),
            duration: parseFloat(options.duration)
          });
          break;
        case 'error':
          animationData = lottieGenerator.generateSuccessCheckmark({
            name: options.name,
            width: parseInt(options.width),
            height: parseInt(options.height),
            duration: parseFloat(options.duration)
          });
          break;
        case 'background':
          animationData = lottieGenerator.generateBackgroundAnimation({
            name: options.name,
            width: parseInt(options.width),
            height: parseInt(options.height),
            duration: parseFloat(options.duration)
          });
          break;
        default:
          console.error('❌ Invalid animation type. Use: cta, loading, success, error, background');
          process.exit(1);
      }

      if (options.output) {
        await fs.writeFile(options.output, JSON.stringify(animationData, null, 2));
        console.log(`💾 Saved: ${options.output}`);
      } else {
        console.log(JSON.stringify(animationData, null, 2));
      }

    } catch (error) {
      console.error('❌ Error generating animation:', error);
      process.exit(1);
    }
  });

// Integrate command
program
  .command('integrate')
  .description('Integrate specific animations for components')
  .option('-c, --components <file>', 'JSON file with component definitions')
  .option('-o, --output <path>', 'Output directory for animations', './public/lottie')
  .action(async (options) => {
    console.log('🔗 Integrating animations...');
    
    try {
      let components: ComponentAnimationRequest[];
      
      if (options.components) {
        const fileContent = await fs.readFile(options.components, 'utf-8');
        components = JSON.parse(fileContent);
      } else {
        // Default components
        components = [
          { componentName: 'PrimaryCTA', componentType: 'cta', preferredSource: 'auto' },
          { componentName: 'LoadingSpinner', componentType: 'loading', preferredSource: 'auto' },
          { componentName: 'SuccessFeedback', componentType: 'success', preferredSource: 'auto' },
          { componentName: 'ErrorFeedback', componentType: 'error', preferredSource: 'auto' }
        ];
      }

      const manager = createAutomatedAnimationManager(defaultDesignSystemColors);
      const results = await manager.integrateAnimationsForComponents(components);
      
      console.log(`\n📊 Integration Results:`);
      results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        const source = result.source === 'lottiefiles' ? 'LottieFiles' : 'Generated';
        console.log(`${status} ${result.componentName} (${source})`);
      });

      // Export to files
      if (options.output) {
        await fs.mkdir(options.output, { recursive: true });
        const animations = manager.exportAnimations();
        
        for (const [name, data] of Object.entries(animations)) {
          const filePath = path.join(options.output, `${name}.json`);
          await fs.writeFile(filePath, JSON.stringify(data, null, 2));
          console.log(`💾 Saved: ${filePath}`);
        }
      }

    } catch (error) {
      console.error('❌ Error integrating animations:', error);
      process.exit(1);
    }
  });

// Stats command
program
  .command('stats')
  .description('Show animation integration statistics')
  .action(async () => {
    console.log('📊 Animation Statistics...');
    
    try {
      const manager = createAutomatedAnimationManager(defaultDesignSystemColors);
      const stats = manager.getIntegrationStats();
      
      console.log(`\n📈 Integration Stats:`);
      console.log(`Total Animations: ${stats.totalAnimations}`);
      console.log(`From LottieFiles: ${stats.lottieFilesCount}`);
      console.log(`Generated: ${stats.generatedCount}`);
      
      if (Object.keys(stats.categories).length > 0) {
        console.log(`\n📂 Categories:`);
        Object.entries(stats.categories).forEach(([category, count]) => {
          console.log(`  ${category}: ${count}`);
        });
      }

    } catch (error) {
      console.error('❌ Error getting stats:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
