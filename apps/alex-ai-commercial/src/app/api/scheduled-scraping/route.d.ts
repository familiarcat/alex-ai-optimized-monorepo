import { NextResponse } from 'next/server';
interface ScheduledScrapingConfig {
    id: string;
    name: string;
    source: string;
    searchTerm: string;
    location: string;
    maxResults: number;
    schedule: 'hourly' | 'daily' | 'weekly' | 'manual';
    enabled: boolean;
    lastRun?: string;
    nextRun?: string;
    created_at: string;
    updated_at: string;
}
export declare function GET(request: Request): Promise<NextResponse<{
    success: boolean;
    status: {
        totalConfigs: number;
        enabledConfigs: number;
        lastRun: string | null;
        nextRun: string | null;
        configs: {
            id: string;
            name: string;
            source: string;
            schedule: "manual" | "hourly" | "daily" | "weekly";
            enabled: boolean;
            lastRun: string | undefined;
            nextRun: string | undefined;
        }[];
    };
}> | NextResponse<{
    success: boolean;
    configs: ScheduledScrapingConfig[];
}> | NextResponse<{
    success: boolean;
    jobs: any;
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    config: any;
    message: string;
}> | NextResponse<{
    success: boolean;
    result: any;
    message: string;
}> | NextResponse<{
    success: boolean;
    results: ({
        configId: string;
        success: boolean;
        result: any;
        error?: undefined;
    } | {
        configId: string;
        success: boolean;
        error: string;
        result?: undefined;
    })[];
    message: string;
}> | NextResponse<{
    success: boolean;
    initialized: {
        message: string;
        count: number;
        configs?: undefined;
    } | {
        message: string;
        count: number;
        configs: any[];
    };
    message: string;
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
export declare function DELETE(request: Request): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    deleted: any;
    message: string;
}>>;
export {};
//# sourceMappingURL=route.d.ts.map