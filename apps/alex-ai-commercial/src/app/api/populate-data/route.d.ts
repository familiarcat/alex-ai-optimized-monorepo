import { NextResponse } from 'next/server';
export declare function POST(): Promise<NextResponse<{
    success: boolean;
    message: string;
    summary: {
        jobOpportunities: any;
        contacts: any;
        stLouisJobs: number;
        remoteJobs: number;
        averageAlexAIScore: number;
    };
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map