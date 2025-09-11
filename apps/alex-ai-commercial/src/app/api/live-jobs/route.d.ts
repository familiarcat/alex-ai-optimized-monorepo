import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    success: boolean;
    data: any;
    status: any;
    message: string;
}> | NextResponse<{
    success: boolean;
    error: string;
    details: string;
}>>;
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    message: string;
    status: any;
}>>;
export declare function DELETE(): Promise<NextResponse<{
    success: boolean;
    message: string;
}> | NextResponse<{
    success: boolean;
    error: string;
    details: string;
}>>;
//# sourceMappingURL=route.d.ts.map