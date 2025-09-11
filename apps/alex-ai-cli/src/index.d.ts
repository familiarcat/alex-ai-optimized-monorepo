#!/usr/bin/env node
/**
 * Alex AI CLI - Main Entry Point
 *
 * A powerful CLI tool for creating and managing projects with Alex AI integration.
 */
import { Command } from '@oclif/core';
import Create from './commands/create.js';
import Evolve from './commands/evolve.js';
export default class AlexCLI extends Command {
    static description: string;
    static version: string;
    static flags: {
        version: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<void>;
        help: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<void>;
    };
    static commands: (typeof Create | typeof Evolve)[];
    run(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map