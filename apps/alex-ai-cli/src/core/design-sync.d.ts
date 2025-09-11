export interface DesignSystem {
    name: string;
    version: string;
    components: string[];
    tokens: Record<string, any>;
}
export declare class DesignSync {
    private designSystems;
    constructor();
    private initializeDesignSystems;
    syncDesign(projectPath: string, designSystem: string): Promise<void>;
    getAvailableDesignSystems(): string[];
    getDesignSystem(name: string): DesignSystem | undefined;
}
//# sourceMappingURL=design-sync.d.ts.map