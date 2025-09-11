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
const framework_translator_js_1 = require("../core/framework-translator.js");
const design_sync_js_1 = require("../core/design-sync.js");
const ai_integration_js_1 = require("../ai-services/ai-integration.js");
class Evolve extends core_1.Command {
    async run() {
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
            const frameworkTranslator = new framework_translator_js_1.FrameworkTranslator();
            const designSync = new design_sync_js_1.DesignSync();
            let aiIntegration = null;
            if (flags['ai-optimize']) {
                aiIntegration = new ai_integration_js_1.AIIntegration();
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
                const optimizationResult = await aiIntegration.processRequest(`Optimize project evolution from ${currentFramework} to ${flags.to}`);
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
        }
        catch (error) {
            this.error(`Failed to evolve project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async detectCurrentFramework(projectPath) {
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJSON(packageJsonPath);
            if (packageJson.dependencies?.next) {
                return 'nextjs';
            }
            else if (packageJson.dependencies?.['react-native']) {
                return 'react-native';
            }
            else if (packageJson.dependencies?.react) {
                return 'react';
            }
        }
        return 'universal';
    }
}
Evolve.description = 'Evolve an existing project to a different framework';
Evolve.args = {
    projectName: core_1.Args.string({
        description: 'Name of the project to evolve',
        required: true,
    }),
};
Evolve.flags = {
    to: core_1.Flags.string({
        char: 't',
        description: 'Target framework to evolve to',
        required: true,
        options: ['react', 'nextjs', 'react-native', 'universal'],
    }),
    reason: core_1.Flags.string({
        char: 'r',
        description: 'Reason for evolution',
        default: 'Framework migration',
    }),
    'sync-design': core_1.Flags.boolean({
        char: 'd',
        description: 'Sync design system during evolution',
        default: false,
    }),
    'ai-optimize': core_1.Flags.boolean({
        char: 'a',
        description: 'Use AI to optimize the evolution',
        default: false,
    }),
    'preserve-code': core_1.Flags.boolean({
        char: 'p',
        description: 'Preserve existing code structure',
        default: true,
    }),
    interactive: core_1.Flags.boolean({
        char: 'i',
        description: 'Run in interactive mode',
        default: false,
    }),
    help: core_1.Flags.help({ char: 'h' }),
};
exports.default = Evolve;
//# sourceMappingURL=evolve.js.map