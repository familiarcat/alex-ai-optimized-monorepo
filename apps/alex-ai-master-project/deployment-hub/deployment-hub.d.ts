export declare class DeploymentHub {
    private initialized;
    initialize(): Promise<void>;
    deploy(environment: string): Promise<void>;
    getStatus(): {
        initialized: boolean;
        status: string;
    };
}
//# sourceMappingURL=deployment-hub.d.ts.map