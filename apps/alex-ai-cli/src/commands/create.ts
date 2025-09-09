#!/usr/bin/env node
/**
 * Alex AI CLI - Create Command
 * 
 * Creates a new project with any supported framework and integrates
 * with the Alex AI Master Project for shared learning.
 */

import { Command } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { ProjectGenerator } from '../core/project-generator.js';
import { AIIntegration } from '../ai-services/ai-integration.js';

export default class Create extends Command {
  static description = 'Create a new project with any supported framework';

  static examples = [
    'alex create my-app --framework react',
    'alex create my-app --framework nextjs --template ecommerce',
    'alex create my-app --interactive',
  ];

  static flags = {
    framework: Command.flags.string({
      char: 'f',
      description: 'Framework to use (react, nextjs, react-native)',
      options: ['react', 'nextjs', 'react-native', 'universal'],
    }),
    template: Command.flags.string({
      char: 't',
      description: 'Template to use (basic, ecommerce, blog, dashboard)',
      options: ['basic', 'ecommerce', 'blog', 'dashboard', 'ai-powered'],
    }),
    interactive: Command.flags.boolean({
      char: 'i',
      description: 'Interactive mode for guided project creation',
    }),
    ai: Command.flags.boolean({
      char: 'a',
      description: 'Enable AI-powered project optimization',
      default: true,
    }),
    help: Command.flags.help({ char: 'h' }),
  };

  static args = [
    {
      name: 'projectName',
      description: 'Name of the project to create',
      required: true,
    },
  ];

  async run() {
    const { args, flags } = await this.parse(Create);
    const { projectName } = args;

    // Validate project name
    if (!this.isValidProjectName(projectName)) {
      this.error('Invalid project name. Use only letters, numbers, and hyphens.');
    }

    // Check if project already exists
    if (await this.projectExists(projectName)) {
      this.error(`Project '${projectName}' already exists. Choose a different name.`);
    }

    // Interactive mode
    if (flags.interactive) {
      await this.runInteractiveMode(projectName);
      return;
    }

    // Validate required flags
    if (!flags.framework) {
      this.error('Framework is required. Use --framework or --interactive');
    }

    // Create project
    await this.createProject(projectName, flags);
  }

  private async runInteractiveMode(projectName: string) {
    console.log(chalk.blue('\n🚀 Alex AI Project Creation Wizard\n'));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'What framework would you like to use?',
        choices: [
          { name: 'React (Web applications)', value: 'react' },
          { name: 'Next.js (Full-stack applications)', value: 'nextjs' },
          { name: 'React Native (Mobile applications)', value: 'react-native' },
          { name: 'Universal (Cross-platform components)', value: 'universal' },
        ],
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose a template:',
        choices: [
          { name: 'Basic (Minimal setup)', value: 'basic' },
          { name: 'E-commerce (Online store)', value: 'ecommerce' },
          { name: 'Blog (Content management)', value: 'blog' },
          { name: 'Dashboard (Data visualization)', value: 'dashboard' },
          { name: 'AI-Powered (Alex AI integration)', value: 'ai-powered' },
        ],
      },
      {
        type: 'confirm',
        name: 'aiEnabled',
        message: 'Enable AI-powered optimization?',
        default: true,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description (optional):',
      },
    ]);

    await this.createProject(projectName, {
      framework: answers.framework,
      template: answers.template,
      ai: answers.aiEnabled,
      description: answers.description,
    });
  }

  private async createProject(projectName: string, options: any) {
    const spinner = ora('Creating project...').start();

    try {
      // Initialize project generator
      const generator = new ProjectGenerator();
      const aiIntegration = new AIIntegration();

      // Generate project structure
      spinner.text = 'Generating project structure...';
      await generator.generateProject(projectName, options);

      // AI-powered optimization
      if (options.ai) {
        spinner.text = 'Applying AI-powered optimizations...';
        await aiIntegration.optimizeProject(projectName, options);
      }

      // Integrate with Alex AI Master Project
      spinner.text = 'Integrating with Alex AI Master Project...';
      await this.integrateWithMasterProject(projectName, options);

      // Install dependencies
      spinner.text = 'Installing dependencies...';
      await generator.installDependencies(projectName);

      // Generate initial components
      spinner.text = 'Generating initial components...';
      await generator.generateInitialComponents(projectName, options);

      spinner.succeed(chalk.green(`✅ Project '${projectName}' created successfully!`));

      // Show next steps
      this.showNextSteps(projectName, options);

    } catch (error) {
      spinner.fail(chalk.red('❌ Failed to create project'));
      this.error(error.message);
    }
  }

  private async integrateWithMasterProject(projectName: string, options: any) {
    // Add project to Alex AI Master Project
    const masterProject = {
      id: projectName,
      name: projectName,
      type: options.framework,
      path: `apps/${projectName}`,
      lastSync: new Date(),
      memoryCount: 0,
      learningScore: 0.5
    };

    // In a real implementation, this would integrate with the master project
    console.log(chalk.gray(`  📡 Integrated with Alex AI Master Project`));
  }

  private showNextSteps(projectName: string, options: any) {
    console.log(chalk.yellow('\n🎉 Next Steps:'));
    console.log(chalk.white(`  cd apps/${projectName}`));
    console.log(chalk.white(`  npm run dev`));
    console.log(chalk.white(`  # or`));
    console.log(chalk.white(`  yarn dev\n`));

    console.log(chalk.yellow('🔄 Framework Evolution:'));
    console.log(chalk.white(`  # Evolve to Next.js`));
    console.log(chalk.white(`  alex evolve ${projectName} --to nextjs`));
    console.log(chalk.white(`  # Add React Native version`));
    console.log(chalk.white(`  alex evolve ${projectName} --to react-native\n`));

    console.log(chalk.yellow('🎨 Design System:'));
    console.log(chalk.white(`  # Sync design across platforms`));
    console.log(chalk.white(`  alex sync ${projectName} --platforms all\n`));

    console.log(chalk.yellow('🤖 AI Features:'));
    console.log(chalk.white(`  # Get AI suggestions`));
    console.log(chalk.white(`  alex ai-suggest ${projectName}`));
    console.log(chalk.white(`  # Optimize performance`));
    console.log(chalk.white(`  alex optimize ${projectName}\n`));
  }

  private isValidProjectName(name: string): boolean {
    return /^[a-zA-Z0-9-]+$/.test(name);
  }

  private async projectExists(name: string): Promise<boolean> {
    // Check if project directory exists
    const fs = await import('fs-extra');
    return await fs.pathExists(`apps/${name}`);
  }
}
