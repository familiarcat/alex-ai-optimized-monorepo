export interface ProjectOptions {
    framework: 'react' | 'nextjs' | 'react-native' | 'universal';
    typescript: boolean;
    testing: boolean;
    linting: boolean;
    aiIntegration: boolean;
}
export declare class ProjectGenerator {
    generateProject(projectName: string, options: ProjectOptions): Promise<void>;
    private generateReactFiles;
    private generateNextJSFiles;
    private generateReactNativeFiles;
    private generateUniversalFiles;
    private generateReactSourceFiles;
    private generateNextJSSourceFiles;
    private generateReactNativeSourceFiles;
    private generateUniversalSourceFiles;
    private generateSharedFiles;
    private generateAIIntegrationFiles;
    installDependencies(projectName: string): Promise<void>;
    generateInitialComponents(projectName: string, options: ProjectOptions): Promise<void>;
}
//# sourceMappingURL=project-generator.d.ts.map