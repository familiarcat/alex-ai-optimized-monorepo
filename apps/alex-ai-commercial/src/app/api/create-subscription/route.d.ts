import { NextRequest, NextResponse } from 'next/server';
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    subscriptionId: string;
    client_secret: any;
}>>;
//# sourceMappingURL=route.d.ts.map