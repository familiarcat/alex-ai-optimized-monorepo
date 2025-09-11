#!/usr/bin/env node
export function runTests(): Promise<{
    timestamp: string;
    environment: "test" | "development" | "production";
    results: any;
    summary: {
        total: any;
        passed: any;
        failed: any;
        warnings: any;
    };
}>;
//# sourceMappingURL=test-alex-ai-integration.d.ts.map