import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    error: any;
}> | NextResponse<{
    success: boolean;
    event: any;
}>>;
export declare function GET(request: Request): Promise<NextResponse<{
    success: boolean;
    error: any;
}> | NextResponse<{
    success: boolean;
    events: any;
}>>;
//# sourceMappingURL=route.d.ts.map