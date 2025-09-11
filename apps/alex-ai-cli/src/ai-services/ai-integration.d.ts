export declare class AIIntegration {
    private initialized;
    initialize(): Promise<void>;
    processRequest(request: string): Promise<any>;
    getStatus(): Promise<{
        initialized: boolean;
        status: string;
    }>;
}
//# sourceMappingURL=ai-integration.d.ts.map