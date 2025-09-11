import { Command, Flags, Args } from '@oclif/core';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectGenerator, ProjectOptions } from '../core/project-generator.js';
import { AIIntegration } from '../ai-services/ai-integration.js';

export default class Create extends Command {
  static description = 'Create a new project with Alex AI CLI';

  static args = {
    projectName: Args.string({
      description: 'Name of the project to create',
      required: true,
    }),
  };

  static flags = {
    framework: Flags.string({
      char: 'f',
      description: 'Framework to use (react, nextjs, react-native, universal)',
      default: 'react',
      options: ['react', 'nextjs', 'react-native', 'universal'],
    }),
    template: Flags.string({
      char: 't',
      description: 'Template to use',
      default: 'basic',
    }),
    interactive: Flags.boolean({
      char: 'i',
      description: 'Run in interactive mode',
      default: false,
    }),
    ai: Flags.boolean({
      char: 'a',
      description: 'Enable AI integration',
      default: false,
    }),
    help: Flags.help({ char: 'h' }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Create);
    const { projectName } = args;

    this.log(`Creating project: ${projectName}`);
    this.log(`Framework: ${flags.framework}`);
    this.log(`Template: ${flags.template}`);
    this.log(`Interactive: ${flags.interactive}`);
    this.log(`AI Integration: ${flags.ai}`);

    try {
      // Validate project name
      if (!projectName || projectName.trim() === '') {
        this.error('Project name is required');
      }

      // Check if project already exists
      const projectPath = path.join(process.cwd(), 'apps', projectName);
      if (await fs.pathExists(projectPath)) {
        this.error(`Project ${projectName} already exists at ${projectPath}`);
      }

      // Create project options
      const options: ProjectOptions = {
        framework: flags.framework as 'react' | 'nextjs' | 'react-native' | 'universal',
        typescript: true,
        testing: true,
        linting: true,
        aiIntegration: flags.ai,
      };

      // Initialize AI integration if requested
      let aiIntegration: AIIntegration | null = null;
      if (flags.ai) {
        aiIntegration = new AIIntegration();
        await aiIntegration.initialize();
        this.log('AI Integration initialized');
      }

      // Generate project
      const generator = new ProjectGenerator();
      await generator.generateProject(projectName, options);

      this.log(`✅ Project ${projectName} created successfully!`);
      this.log(`📁 Location: ${projectPath}`);
      this.log(`🚀 Next steps:`);
      this.log(`   cd apps/${projectName}`);
      this.log(`   pnpm install`);
      this.log(`   pnpm dev`);

      if (flags.ai) {
        this.log(`🤖 AI Integration enabled`);
        this.log(`   Check src/ai/ directory for AI integration files`);
      }

    } catch (error) {
      this.error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}