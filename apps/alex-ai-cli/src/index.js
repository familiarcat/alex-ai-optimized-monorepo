#!/usr/bin/env node
"use strict";
/**
 * Alex AI CLI - Main Entry Point
 *
 * A powerful CLI tool for creating and managing projects with Alex AI integration.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const create_js_1 = __importDefault(require("./commands/create.js"));
const evolve_js_1 = __importDefault(require("./commands/evolve.js"));
class AlexCLI extends core_1.Command {
    async run() {
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
AlexCLI.description = 'Alex AI CLI - Create and manage projects with AI integration';
AlexCLI.version = '1.0.0';
AlexCLI.flags = {
    version: core_1.Flags.version({ char: 'v' }),
    help: core_1.Flags.help({ char: 'h' }),
};
AlexCLI.commands = [create_js_1.default, evolve_js_1.default];
exports.default = AlexCLI;
//# sourceMappingURL=index.js.map