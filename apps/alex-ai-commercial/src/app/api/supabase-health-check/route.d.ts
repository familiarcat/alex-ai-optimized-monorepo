import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    healthy: boolean;
    error: string;
    tables: {
        job_opportunities: boolean;
        contacts: boolean;
        applications: boolean;
        crew_memories: boolean;
    };
}> | NextResponse<{
    healthy: boolean;
    tables: {
        job_opportunities: boolean;
        contacts: boolean;
        applications: boolean;
        crew_memories: boolean;
    };
    message: string;
}>>;
//# sourceMappingURL=route.d.ts.map