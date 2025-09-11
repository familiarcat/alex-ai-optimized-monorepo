import { NextResponse } from 'next/server';
export declare function GET(request: Request): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    analytics: {
        session: any;
        interactions: any;
        recommendedFrequency: any;
        isActiveUser: boolean;
        lastSeen: any;
        averageSessionDuration: any;
    };
}> | NextResponse<{
    success: boolean;
    nextRefresh: Date;
}> | NextResponse<{
    success: boolean;
    shouldRefresh: boolean;
}> | NextResponse<{
    success: boolean;
    metrics: {
        totalSessions: any;
        totalVisits: any;
        totalManualRefreshes: any;
        totalAutomaticRefreshes: any;
        averageFrequency: number;
        recentActivity: any;
        manualRefreshRate: number;
    };
}>>;
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    message: string;
}>>;
//# sourceMappingURL=route.d.ts.map