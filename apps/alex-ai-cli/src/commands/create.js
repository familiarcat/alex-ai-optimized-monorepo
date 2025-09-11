"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const project_generator_js_1 = require("../core/project-generator.js");
const ai_integration_js_1 = require("../ai-services/ai-integration.js");
class Create extends core_1.Command {
    async run() {
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
            const options = {
                framework: flags.framework,
                typescript: true,
                testing: true,
                linting: true,
                aiIntegration: flags.ai,
            };
            // Initialize AI integration if requested
            let aiIntegration = null;
            if (flags.ai) {
                aiIntegration = new ai_integration_js_1.AIIntegration();
                await aiIntegration.initialize();
                this.log('AI Integration initialized');
            }
            // Generate project
            const generator = new project_generator_js_1.ProjectGenerator();
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
        }
        catch (error) {
            this.error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
Create.description = 'Create a new project with Alex AI CLI';
Create.args = {
    projectName: core_1.Args.string({
        description: 'Name of the project to create',
        required: true,
    }),
};
Create.flags = {
    framework: core_1.Flags.string({
        char: 'f',
        description: 'Framework to use (react, nextjs, react-native, universal)',
        default: 'react',
        options: ['react', 'nextjs', 'react-native', 'universal'],
    }),
    template: core_1.Flags.string({
        char: 't',
        description: 'Template to use',
        default: 'basic',
    }),
    interactive: core_1.Flags.boolean({
        char: 'i',
        description: 'Run in interactive mode',
        default: false,
    }),
    ai: core_1.Flags.boolean({
        char: 'a',
        description: 'Enable AI integration',
        default: false,
    }),
    help: core_1.Flags.help({ char: 'h' }),
};
exports.default = Create;
//# sourceMappingURL=create.js.map