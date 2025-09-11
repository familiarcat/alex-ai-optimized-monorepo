import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    jobId: string;
    message: string;
    estimatedTime: string;
    scheduled: any;
    configId: any;
}>>;
export declare function GET(request: Request): Promise<NextResponse<{
    id: string;
    status: string;
    status_message: string;
    jobs_found: number;
    jobs_stored: number;
    started_at: string;
    completed_at: string;
}> | NextResponse<({
    id: string;
    source: string;
    search_term: string;
    location: string;
    status: string;
    jobs_found: number;
    jobs_stored: number;
    started_at: string;
    completed_at: string;
} | {
    id: string;
    source: string;
    search_term: string;
    location: string;
    status: string;
    jobs_found: number;
    jobs_stored: number;
    started_at: string;
    completed_at?: undefined;
})[]> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map