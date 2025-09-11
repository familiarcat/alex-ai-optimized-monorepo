"use strict";
/**
 * Alex AI Master Project - Core Coordination System
 *
 * This is the central coordination system that manages all Alex AI projects,
 * enables bidirectional learning, and coordinates cross-project evolution.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlexAIMasterProject = void 0;
class AlexAIMasterProject {
    constructor(config) {
        this.projects = new Map();
        this.insights = [];
        this.isRunning = false;
        this.syncInterval = null;
        this.config = config;
    }
    async initialize() {
        console.log('🧠 Initializing Alex AI Master Project core...');
        // Discover all Alex AI projects in the monorepo
        await this.discoverProjects();
        // Initialize cross-project learning
        await this.initializeCrossProjectLearning();
        console.log(`✅ Master Project initialized with ${this.projects.size} projects`);
    }
    async start() {
        console.log('🚀 Starting Alex AI Master Project services...');
        this.isRunning = true;
        // Start bidirectional sync
        this.startBidirectionalSync();
        // Start cross-project learning
        this.startCrossProjectLearning();
        // Start analytics generation
        this.startAnalyticsGeneration();
        console.log('✅ Master Project services started');
    }
    async stop() {
        console.log('🛑 Stopping Alex AI Master Project...');
        this.isRunning = false;
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        console.log('✅ Master Project stopped');
    }
    async discoverProjects() {
        console.log('🔍 Discovering Alex AI projects...');
        // Define project discovery patterns
        const projectPatterns = [
            { type: 'nextjs', pattern: /apps\/.*-nextjs/, name: 'Next.js Project' },
            { type: 'react', pattern: /apps\/.*-react/, name: 'React Project' },
            { type: 'react-native', pattern: /apps\/.*-react-native/, name: 'React Native Project' },
            { type: 'vscode-extension', pattern: /apps\/.*-vscode-extension/, name: 'VSCode Extension' },
            { type: 'other', pattern: /apps\/alex-ai-/, name: 'Alex AI Project' }
        ];
        // Simulate project discovery (in real implementation, this would scan the filesystem)
        const discoveredProjects = [
            {
                id: 'alex-ai-job-search',
                name: 'Alex AI Job Search',
                type: 'nextjs',
                path: 'apps/alex-ai-job-search',
                lastSync: new Date(),
                memoryCount: 150,
                learningScore: 0.85
            },
            {
                id: 'alex-ai-commercial',
                name: 'Alex AI Commercial',
                type: 'nextjs',
                path: 'apps/alex-ai-commercial',
                lastSync: new Date(),
                memoryCount: 200,
                learningScore: 0.92
            },
            {
                id: 'alex-ai-vscode-extension',
                name: 'Alex AI VSCode Extension',
                type: 'vscode-extension',
                path: 'apps/alex-ai-vscode-extension',
                lastSync: new Date(),
                memoryCount: 75,
                learningScore: 0.78
            }
        ];
        // Add discovered projects
        for (const project of discoveredProjects) {
            this.projects.set(project.id, project);
            console.log(`  ✅ Discovered: ${project.name} (${project.type})`);
        }
    }
    async initializeCrossProjectLearning() {
        console.log('🧠 Initializing cross-project learning...');
        // Initialize memory consolidation across projects
        await this.config.memoryHub.initializeCrossProjectLearning(this.projects);
        // Initialize N8N sync for all projects
        await this.config.n8nSyncHub.initializeProjectSync(Array.from(this.projects.values()));
        // Initialize analytics for cross-project insights
        await this.config.analyticsHub.initializeCrossProjectAnalytics(Array.from(this.projects.values()));
        console.log('✅ Cross-project learning initialized');
    }
    startBidirectionalSync() {
        console.log('🔄 Starting bidirectional sync...');
        // Sync every 30 seconds
        this.syncInterval = setInterval(async () => {
            if (this.isRunning) {
                await this.performBidirectionalSync();
            }
        }, 30000);
        console.log('✅ Bidirectional sync started');
    }
    async performBidirectionalSync() {
        try {
            console.log('🔄 Performing bidirectional sync...');
            // Sync memories from all projects to master
            await this.config.memoryHub.syncFromProjects(this.projects);
            // Sync insights from master to all projects
            await this.config.memoryHub.syncToProjects(this.projects);
            // Sync N8N workflows
            await this.config.n8nSyncHub.syncWorkflows(Array.from(this.projects.values()));
            // Generate cross-project insights
            const newInsights = await this.config.analyticsHub.generateCrossProjectInsights(Array.from(this.projects.values()));
            this.insights.push(...newInsights);
            console.log(`✅ Sync completed - ${newInsights.length} new insights generated`);
        }
        catch (error) {
            console.error('❌ Sync failed:', error);
        }
    }
    startCrossProjectLearning() {
        console.log('🧠 Starting cross-project learning...');
        // This would run AI learning algorithms to identify patterns across projects
        // and generate insights that can be applied to all projects
    }
    startAnalyticsGeneration() {
        console.log('📊 Starting analytics generation...');
        // This would generate analytics and insights about cross-project performance
        // and learning effectiveness
    }
    // Public API methods
    getProjects() {
        return Array.from(this.projects.values());
    }
    getInsights() {
        return this.insights;
    }
    async addProject(project) {
        this.projects.set(project.id, project);
        await this.config.memoryHub.addProject(project);
        await this.config.n8nSyncHub.addProject(project);
        console.log(`✅ Added project: ${project.name}`);
    }
    async removeProject(projectId) {
        this.projects.delete(projectId);
        await this.config.memoryHub.removeProject(projectId);
        await this.config.n8nSyncHub.removeProject(projectId);
        console.log(`✅ Removed project: ${projectId}`);
    }
    getProjectLearningScore(projectId) {
        const project = this.projects.get(projectId);
        return project?.learningScore || 0;
    }
    getCrossProjectInsights(projectId) {
        return this.insights.filter(insight => insight.sourceProjects.includes(projectId) ||
            insight.appliedToProjects.includes(projectId));
    }
}
exports.AlexAIMasterProject = AlexAIMasterProject;
//# sourceMappingURL=master-project.js.map