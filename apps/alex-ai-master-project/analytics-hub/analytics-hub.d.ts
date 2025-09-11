export declare class AnalyticsHub {
    private initialized;
    initialize(): Promise<void>;
    track(event: string, data: any): Promise<void>;
    initializeCrossProjectAnalytics(projects: any[]): Promise<void>;
    generateCrossProjectInsights(projects: any[]): Promise<any>;
    getStatus(): {
        initialized: boolean;
        status: string;
    };
}
//# sourceMappingURL=analytics-hub.d.ts.map