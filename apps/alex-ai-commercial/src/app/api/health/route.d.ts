import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    timestamp: string;
    status: string;
    services: {
        api: string;
        supabase: string;
        n8n: string;
    };
    uptime: number;
    memory: NodeJS.MemoryUsage;
    version: string;
}> | NextResponse<{
    timestamp: string;
    status: string;
    error: string;
    services: {
        api: string;
        supabase: string;
        n8n: string;
    };
}>>;
//# sourceMappingURL=route.d.ts.map