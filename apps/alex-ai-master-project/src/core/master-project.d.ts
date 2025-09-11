/**
 * Alex AI Master Project - Core Coordination System
 *
 * This is the central coordination system that manages all Alex AI projects,
 * enables bidirectional learning, and coordinates cross-project evolution.
 */
import { MemoryHub } from '../memory-hub/memory-hub.js';
import { N8NSyncHub } from '../../n8n-sync-hub/n8n-sync-hub.js';
import { AnalyticsHub } from '../../analytics-hub/analytics-hub.js';
import { DeploymentHub } from '../../deployment-hub/deployment-hub.js';
export interface MasterProjectConfig {
    memoryHub: MemoryHub;
    n8nSyncHub: N8NSyncHub;
    analyticsHub: AnalyticsHub;
    deploymentHub: DeploymentHub;
}
export interface ProjectInfo {
    id: string;
    name: string;
    type: 'react-native' | 'nextjs' | 'react' | 'vscode-extension' | 'other';
    path: string;
    lastSync: Date;
    memoryCount: number;
    learningScore: number;
}
export interface CrossProjectInsight {
    id: string;
    type: 'pattern' | 'optimization' | 'component' | 'workflow';
    sourceProjects: string[];
    insight: string;
    confidence: number;
    timestamp: Date;
    appliedToProjects: string[];
}
export declare class AlexAIMasterProject {
    private config;
    private projects;
    private insights;
    private isRunning;
    private syncInterval;
    constructor(config: MasterProjectConfig);
    initialize(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    private discoverProjects;
    private initializeCrossProjectLearning;
    private startBidirectionalSync;
    private performBidirectionalSync;
    private startCrossProjectLearning;
    private startAnalyticsGeneration;
    getProjects(): ProjectInfo[];
    getInsights(): CrossProjectInsight[];
    addProject(project: ProjectInfo): Promise<void>;
    removeProject(projectId: string): Promise<void>;
    getProjectLearningScore(projectId: string): number;
    getCrossProjectInsights(projectId: string): CrossProjectInsight[];
}
//# sourceMappingURL=master-project.d.ts.map