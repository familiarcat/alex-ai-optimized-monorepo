export declare class N8NSyncHub {
    private initialized;
    initialize(): Promise<void>;
    sync(): Promise<void>;
    initializeProjectSync(projects: any[]): Promise<void>;
    syncWorkflows(projects: any[]): Promise<void>;
    addProject(project: any): Promise<void>;
    removeProject(projectId: string): Promise<void>;
    getStatus(): {
        initialized: boolean;
        status: string;
    };
}
//# sourceMappingURL=n8n-sync-hub.d.ts.map