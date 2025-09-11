#!/usr/bin/env node
/**
 * Alex AI Master Project - Central Learning Hub
 *
 * This is the central learning hub that coordinates all Alex AI projects,
 * manages bidirectional memory sync, and enables continuous AI evolution
 * across all projects in the monorepo.
 */
declare class AlexAIMasterProjectApp {
    private masterProject;
    private memoryHub;
    private n8nSyncHub;
    private analyticsHub;
    private deploymentHub;
    constructor();
    initialize(): Promise<boolean>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export { AlexAIMasterProjectApp };
//# sourceMappingURL=index.d.ts.map