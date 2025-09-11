/**
 * Context Manager
 *
 * Provides context awareness for Alex AI by analyzing the current VS Code state
 * including active files, selections, project structure, and dependencies.
 */
export interface CodeContext {
    filePath?: string;
    language?: string;
    content?: string;
    selection?: {
        start: {
            line: number;
            character: number;
        };
        end: {
            line: number;
            character: number;
        };
    };
    projectType?: string;
    dependencies?: string[];
    workspacePath?: string;
}
export interface ProjectContext {
    workspacePath: string;
    projectType: string;
    dependencies: string[];
    files: string[];
    gitInfo?: {
        branch: string;
        hasChanges: boolean;
    };
}
export declare class ContextManager {
    private maxContextLength;
    constructor();
    /**
     * Get current file context
     */
    getCurrentFileContext(): CodeContext | null;
    /**
     * Get project context
     */
    getProjectContext(): ProjectContext | null;
    /**
     * Get selected code context
     */
    getSelectedCodeContext(): CodeContext | null;
    /**
     * Detect project type based on file structure
     */
    private detectProjectType;
    /**
     * Get project dependencies
     */
    private getDependencies;
    /**
     * Get relevant files in the project
     */
    private getRelevantFiles;
    /**
     * Check if directory should be ignored
     */
    private shouldIgnoreDirectory;
    /**
     * Check if file is relevant for context
     */
    private isRelevantFile;
    /**
     * Get git information
     */
    private getGitInfo;
    /**
     * Truncate content to fit within context limits
     */
    private truncateContent;
}
//# sourceMappingURL=contextManager.d.ts.map