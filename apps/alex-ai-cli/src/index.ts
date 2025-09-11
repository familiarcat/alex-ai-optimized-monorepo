#!/usr/bin/env node
/**
 * Alex AI CLI - Main Entry Point
 * 
 * A powerful CLI tool for creating and managing projects with Alex AI integration.
 */

import { Command, Flags } from '@oclif/core';
import Create from './commands/create.js';
import Evolve from './commands/evolve.js';

export default class AlexCLI extends Command {
  static description = 'Alex AI CLI - Create and manage projects with AI integration';

  static version = '1.0.0';

  static flags = {
    version: Flags.version({ char: 'v' }),
    help: Flags.help({ char: 'h' }),
  };

  static commands = [Create, Evolve];

  async run(): Promise<void> {
    this.log('🚀 Alex AI CLI');
    this.log('Create and manage projects with AI integration');
    this.log('');
    this.log('Available commands:');
    this.log('  create    Create a new project');
    this.log('  evolve    Evolve an existing project');
    this.log('');
    this.log('Use --help with any command to see more information.');
  }
}