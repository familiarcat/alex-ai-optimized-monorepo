import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    jobId: string;
    message: string;
    estimatedTime: string;
}>>;
export declare function GET(request: Request): Promise<NextResponse<{
    id: string;
    status: string;
    status_message: string;
    items_found: number;
    items_stored: number;
    started_at: string;
    completed_at: string;
}> | NextResponse<{
    id: string;
    title: string;
    category: string;
    crew_member: string;
    relevance_score: number;
    content: string;
    url: string;
    tags: string[];
    last_updated: string;
}[]> | NextResponse<({
    id: string;
    source: string;
    category: string;
    status: string;
    items_found: number;
    items_stored: number;
    started_at: string;
    completed_at: string;
} | {
    id: string;
    source: string;
    category: string;
    status: string;
    items_found: number;
    items_stored: number;
    started_at: string;
    completed_at?: undefined;
})[]> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map