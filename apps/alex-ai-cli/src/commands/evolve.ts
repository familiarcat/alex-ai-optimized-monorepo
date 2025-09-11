import { Command, Flags, Args } from '@oclif/core';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectGenerator, ProjectOptions } from '../core/project-generator.js';
import { FrameworkTranslator } from '../core/framework-translator.js';
import { DesignSync } from '../core/design-sync.js';
import { AIIntegration } from '../ai-services/ai-integration.js';

export default class Evolve extends Command {
  static description = 'Evolve an existing project to a different framework';

  static args = {
    projectName: Args.string({
      description: 'Name of the project to evolve',
      required: true,
    }),
  };

  static flags = {
    to: Flags.string({
      char: 't',
      description: 'Target framework to evolve to',
      required: true,
      options: ['react', 'nextjs', 'react-native', 'universal'],
    }),
    reason: Flags.string({
      char: 'r',
      description: 'Reason for evolution',
      default: 'Framework migration',
    }),
    'sync-design': Flags.boolean({
      char: 'd',
      description: 'Sync design system during evolution',
      default: false,
    }),
    'ai-optimize': Flags.boolean({
      char: 'a',
      description: 'Use AI to optimize the evolution',
      default: false,
    }),
    'preserve-code': Flags.boolean({
      char: 'p',
      description: 'Preserve existing code structure',
      default: true,
    }),
    interactive: Flags.boolean({
      char: 'i',
      description: 'Run in interactive mode',
      default: false,
    }),
    help: Flags.help({ char: 'h' }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Evolve);
    const { projectName } = args;

    this.log(`Evolving project: ${projectName}`);
    this.log(`Target framework: ${flags.to}`);
    this.log(`Reason: ${flags.reason}`);
    this.log(`Sync design: ${flags['sync-design']}`);
    this.log(`AI optimize: ${flags['ai-optimize']}`);
    this.log(`Preserve code: ${flags['preserve-code']}`);

    try {
      // Validate project exists
      const projectPath = path.join(process.cwd(), 'apps', projectName);
      if (!(await fs.pathExists(projectPath))) {
        this.error(`Project ${projectName} does not exist at ${projectPath}`);
      }

      // Initialize services
      const frameworkTranslator = new FrameworkTranslator();
      const designSync = new DesignSync();
      let aiIntegration: AIIntegration | null = null;

      if (flags['ai-optimize']) {
        aiIntegration = new AIIntegration();
        await aiIntegration.initialize();
        this.log('AI Integration initialized for optimization');
      }

      // Get current framework (simplified detection)
      const currentFramework = await this.detectCurrentFramework(projectPath);
      this.log(`Current framework detected: ${currentFramework}`);

      // Translate framework configuration
      const targetConfig = frameworkTranslator.translate(currentFramework, flags.to);
      if (!targetConfig) {
        this.error(`Cannot translate from ${currentFramework} to ${flags.to}`);
      }

      this.log(`Framework translation completed`);

      // Sync design system if requested
      if (flags['sync-design']) {
        await designSync.syncDesign(projectPath, 'alex-ai');
        this.log('Design system synced');
      }

      // AI optimization if requested
      if (flags['ai-optimize'] && aiIntegration) {
        const optimizationResult = await aiIntegration.processRequest(
          `Optimize project evolution from ${currentFramework} to ${flags.to}`
        );
        this.log(`AI optimization: ${optimizationResult.response}`);
      }

      // Create backup
      const backupPath = `${projectPath}.backup.${Date.now()}`;
      await fs.copy(projectPath, backupPath);
      this.log(`Backup created at: ${backupPath}`);

      // Update package.json with new framework configuration
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = await fs.readJSON(packageJsonPath);
      
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...targetConfig.dependencies
      };
      
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        ...targetConfig.devDependencies
      };
      
      packageJson.scripts = {
        ...packageJson.scripts,
        ...targetConfig.scripts
      };

      await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
      this.log('Package.json updated with new framework configuration');

      this.log(`✅ Project ${projectName} evolved to ${flags.to} successfully!`);
      this.log(`📁 Location: ${projectPath}`);
      this.log(`🔄 Next steps:`);
      this.log(`   cd apps/${projectName}`);
      this.log(`   pnpm install`);
      this.log(`   pnpm dev`);

    } catch (error) {
      this.error(`Failed to evolve project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async detectCurrentFramework(projectPath: string): Promise<string> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJSON(packageJsonPath);
      
      if (packageJson.dependencies?.next) {
        return 'nextjs';
      } else if (packageJson.dependencies?.['react-native']) {
        return 'react-native';
      } else if (packageJson.dependencies?.react) {
        return 'react';
      }
    }
    
    return 'universal';
  }
}