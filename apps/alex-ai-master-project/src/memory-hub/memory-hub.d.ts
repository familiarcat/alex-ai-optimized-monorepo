/**
 * Alex AI Master Project - Memory Hub
 *
 * Central memory management system that enables bidirectional learning
 * across all Alex AI projects in the monorepo.
 */
import { ProjectInfo } from '../core/master-project.js';
export interface Memory {
    id: string;
    projectId: string;
    type: 'technical' | 'user-behavior' | 'performance' | 'insight' | 'pattern';
    content: string;
    importance: number;
    tags: string[];
    timestamp: Date;
    crossProjectRelevance: number;
    relatedMemories: string[];
}
export interface CrossProjectPattern {
    id: string;
    pattern: string;
    sourceProjects: string[];
    confidence: number;
    applications: string[];
    timestamp: Date;
}
export declare class MemoryHub {
    private memories;
    private crossProjectPatterns;
    private isInitialized;
    initialize(): Promise<void>;
    initializeCrossProjectLearning(projects: Map<string, ProjectInfo>): Promise<void>;
    syncFromProjects(projects: Map<string, ProjectInfo>): Promise<void>;
    syncToProjects(projects: Map<string, ProjectInfo>): Promise<void>;
    addProject(project: ProjectInfo): Promise<void>;
    removeProject(projectId: string): Promise<void>;
    private initializeMemoryStorage;
    private loadExistingMemories;
    private analyzeCrossProjectPatterns;
    private generateCrossProjectInsights;
    private fetchProjectMemories;
    private storeMemory;
    private updateCrossProjectRelevance;
    private groupMemoriesByType;
    private identifyPatterns;
    private createInsightsFromPatterns;
    private getRelevantInsights;
    private sendInsightsToProject;
    private initializeProjectMemoryTracking;
    getMemories(projectId?: string): Memory[];
    getCrossProjectPatterns(): CrossProjectPattern[];
    getMemoryStats(): {
        totalMemories: number;
        crossProjectMemories: number;
        patterns: number;
    };
}
//# sourceMappingURL=memory-hub.d.ts.map