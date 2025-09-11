import { NextResponse } from 'next/server';
export declare function GET(request: Request): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    result: {
        processed: number;
        successful: number;
        failed: number;
        results: ({
            configId: any;
            configName: any;
            success: boolean;
            result: {
                jobId: any;
                configId: any;
                nextRun: string;
                message: any;
            };
            error?: undefined;
        } | {
            configId: any;
            configName: any;
            success: boolean;
            error: string;
            result?: undefined;
        })[];
    };
    message: string;
}> | NextResponse<{
    success: boolean;
    dueJobs: any;
    count: any;
}> | NextResponse<{
    success: boolean;
    status: {
        configs: {
            total: any;
            enabled: any;
            disabled: number;
            due: any;
        };
        jobs: {
            total: any;
            scheduled: any;
            manual: number;
            completed: any;
            failed: any;
            successRate: number;
        };
        nextRun: any;
        lastRun: any;
        error?: undefined;
    } | {
        error: string;
        configs?: undefined;
        jobs?: undefined;
        nextRun?: undefined;
        lastRun?: undefined;
    };
}>>;
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    result: {
        jobId: any;
        configId: any;
        nextRun: string;
        message: any;
    };
    message: string;
}> | NextResponse<{
    success: boolean;
    result: {
        processed: number;
        successful: number;
        failed: number;
        results: ({
            configId: any;
            configName: any;
            success: boolean;
            result: {
                jobId: any;
                configId: any;
                nextRun: string;
                message: any;
            };
            error?: undefined;
        } | {
            configId: any;
            configName: any;
            success: boolean;
            error: string;
            result?: undefined;
        })[];
    };
    message: string;
}>>;
//# sourceMappingURL=route.d.ts.map