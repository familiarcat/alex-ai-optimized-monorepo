import { NextResponse } from 'next/server';
export declare function POST(): Promise<NextResponse<{
    success: boolean;
    message: string;
    table_results: ({
        table: string;
        status: string;
        error: any;
    } | {
        table: string;
        status: string;
        error?: undefined;
    })[];
    sample_data_results: ({
        job: string;
        status: string;
        error: any;
    } | {
        job: string;
        status: string;
        error?: undefined;
    })[];
    instructions: {
        note: string;
        next_steps: string[];
    };
}> | NextResponse<{
    success: boolean;
    error: string;
    details: string;
    instructions: {
        manual_setup: string[];
    };
}>>;
//# sourceMappingURL=route.d.ts.map