import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    error: string;
    message: string;
}> | NextResponse<{
    success: boolean;
    message: string;
    data: {
        tables_created: string[];
        test_data_inserted: {
            job: any;
            memory: any;
        };
    };
}>>;
export declare function GET(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    message: string;
    data: {};
}> | NextResponse<{
    success: boolean;
    error: string;
    message: string;
}>>;
//# sourceMappingURL=route.d.ts.map