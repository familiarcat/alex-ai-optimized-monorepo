export interface FrameworkConfig {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
}
export declare class FrameworkTranslator {
    private frameworks;
    constructor();
    private initializeFrameworks;
    translate(from: string, to: string): FrameworkConfig | null;
    getSupportedFrameworks(): string[];
}
//# sourceMappingURL=framework-translator.d.ts.map