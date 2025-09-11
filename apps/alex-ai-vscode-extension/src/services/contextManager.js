"use strict";
/**
 * Context Manager
 *
 * Provides context awareness for Alex AI by analyzing the current VS Code state
 * including active files, selections, project structure, and dependencies.
 */
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
exports.ContextManager = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ContextManager {
    constructor() {
        this.maxContextLength = vscode.workspace.getConfiguration('alex-ai').get('maxContextLength', 4000);
    }
    /**
     * Get current file context
     */
    getCurrentFileContext() {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return null;
        const document = editor.document;
        const selection = editor.selection;
        return {
            filePath: document.fileName,
            language: document.languageId,
            content: this.truncateContent(document.getText()),
            selection: {
                start: {
                    line: selection.start.line,
                    character: selection.start.character
                },
                end: {
                    line: selection.end.line,
                    character: selection.end.character
                }
            },
            projectType: this.detectProjectType(document.fileName),
            dependencies: this.getDependencies(document.fileName)
        };
    }
    /**
     * Get project context
     */
    getProjectContext() {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace)
            return null;
        const workspacePath = workspace.uri.fsPath;
        const projectType = this.detectProjectType(workspacePath);
        const dependencies = this.getDependencies(workspacePath);
        const files = this.getRelevantFiles(workspacePath);
        return {
            workspacePath,
            projectType,
            dependencies,
            files,
            gitInfo: this.getGitInfo(workspacePath)
        };
    }
    /**
     * Get selected code context
     */
    getSelectedCodeContext() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty)
            return null;
        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection);
        return {
            filePath: document.fileName,
            language: document.languageId,
            content: this.truncateContent(selectedText),
            selection: {
                start: {
                    line: selection.start.line,
                    character: selection.start.character
                },
                end: {
                    line: selection.end.line,
                    character: selection.end.character
                }
            },
            projectType: this.detectProjectType(document.fileName),
            dependencies: this.getDependencies(document.fileName)
        };
    }
    /**
     * Detect project type based on file structure
     */
    detectProjectType(filePath) {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace)
            return 'unknown';
        const workspacePath = workspace.uri.fsPath;
        // Check for common project files
        if (fs.existsSync(path.join(workspacePath, 'package.json'))) {
            return 'nodejs';
        }
        if (fs.existsSync(path.join(workspacePath, 'requirements.txt'))) {
            return 'python';
        }
        if (fs.existsSync(path.join(workspacePath, 'Cargo.toml'))) {
            return 'rust';
        }
        if (fs.existsSync(path.join(workspacePath, 'go.mod'))) {
            return 'go';
        }
        if (fs.existsSync(path.join(workspacePath, 'pom.xml'))) {
            return 'java';
        }
        if (fs.existsSync(path.join(workspacePath, 'composer.json'))) {
            return 'php';
        }
        if (fs.existsSync(path.join(workspacePath, 'Gemfile'))) {
            return 'ruby';
        }
        if (fs.existsSync(path.join(workspacePath, 'Dockerfile'))) {
            return 'docker';
        }
        return 'unknown';
    }
    /**
     * Get project dependencies
     */
    getDependencies(filePath) {
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace)
            return [];
        const workspacePath = workspace.uri.fsPath;
        const dependencies = [];
        try {
            // Node.js dependencies
            const packageJsonPath = path.join(workspacePath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                if (packageJson.dependencies) {
                    dependencies.push(...Object.keys(packageJson.dependencies));
                }
                if (packageJson.devDependencies) {
                    dependencies.push(...Object.keys(packageJson.devDependencies));
                }
            }
            // Python dependencies
            const requirementsPath = path.join(workspacePath, 'requirements.txt');
            if (fs.existsSync(requirementsPath)) {
                const requirements = fs.readFileSync(requirementsPath, 'utf8');
                dependencies.push(...requirements.split('\n').filter(line => line.trim()));
            }
            // Rust dependencies
            const cargoPath = path.join(workspacePath, 'Cargo.toml');
            if (fs.existsSync(cargoPath)) {
                const cargoContent = fs.readFileSync(cargoPath, 'utf8');
                const depMatches = cargoContent.match(/\[dependencies\]\s*\n(.*?)(?=\[|$)/s);
                if (depMatches) {
                    const deps = depMatches[1].split('\n')
                        .filter(line => line.trim() && !line.startsWith('['))
                        .map(line => line.split('=')[0].trim());
                    dependencies.push(...deps);
                }
            }
        }
        catch (error) {
            console.error('Error reading dependencies:', error);
        }
        return dependencies.slice(0, 20); // Limit to 20 dependencies
    }
    /**
     * Get relevant files in the project
     */
    getRelevantFiles(workspacePath) {
        const files = [];
        try {
            const entries = fs.readdirSync(workspacePath, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory() && !this.shouldIgnoreDirectory(entry.name)) {
                    const subFiles = this.getRelevantFiles(path.join(workspacePath, entry.name));
                    files.push(...subFiles);
                }
                else if (entry.isFile() && this.isRelevantFile(entry.name)) {
                    files.push(entry.name);
                }
            }
        }
        catch (error) {
            console.error('Error reading files:', error);
        }
        return files.slice(0, 50); // Limit to 50 files
    }
    /**
     * Check if directory should be ignored
     */
    shouldIgnoreDirectory(dirName) {
        const ignoreDirs = [
            'node_modules', '.git', '.vscode', 'dist', 'build',
            'target', '__pycache__', '.pytest_cache', 'venv', 'env'
        ];
        return ignoreDirs.includes(dirName);
    }
    /**
     * Check if file is relevant for context
     */
    isRelevantFile(fileName) {
        const relevantExtensions = [
            '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rs',
            '.php', '.rb', '.cpp', '.c', '.h', '.cs', '.swift', '.kt',
            '.json', '.yaml', '.yml', '.xml', '.md', '.txt'
        ];
        const ext = path.extname(fileName).toLowerCase();
        return relevantExtensions.includes(ext);
    }
    /**
     * Get git information
     */
    getGitInfo(workspacePath) {
        try {
            const gitPath = path.join(workspacePath, '.git');
            if (!fs.existsSync(gitPath))
                return undefined;
            // This is a simplified implementation
            // In a real implementation, you'd use a git library
            return {
                branch: 'main', // Would read from .git/HEAD
                hasChanges: false // Would check git status
            };
        }
        catch (error) {
            return undefined;
        }
    }
    /**
     * Truncate content to fit within context limits
     */
    truncateContent(content) {
        if (content.length <= this.maxContextLength) {
            return content;
        }
        // Truncate from the middle to preserve both beginning and end
        const halfLength = Math.floor(this.maxContextLength / 2);
        const start = content.substring(0, halfLength);
        const end = content.substring(content.length - halfLength);
        return `${start}\n\n... [content truncated] ...\n\n${end}`;
    }
}
exports.ContextManager = ContextManager;
//# sourceMappingURL=contextManager.js.map