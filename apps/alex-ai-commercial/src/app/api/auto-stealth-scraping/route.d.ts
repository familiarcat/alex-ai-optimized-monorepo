import { NextRequest, NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    success: boolean;
    error: string;
    status: {
        enabled: boolean;
        isRunning: boolean;
        totalJobs: number;
        recentJobs: number;
        successRate: number;
    };
    config: null;
    recentJobs: never[];
}> | NextResponse<{
    success: boolean;
    status: any;
    config: any;
    recentJobs: any;
    message: string;
}> | NextResponse<{
    success: boolean;
    error: string;
    details: string;
}>>;
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    message: string;
    status: any;
}> | NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    message: string;
    config: any;
}>>;
//# sourceMappingURL=route.d.ts.map