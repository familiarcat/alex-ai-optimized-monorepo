import { NextResponse } from 'next/server';
export declare function POST(): Promise<NextResponse<{
    success: boolean;
    message: string;
    tables: ({
        table: string;
        status: string;
        error: any;
    } | {
        table: string;
        status: string;
        error?: undefined;
    })[];
}> | NextResponse<{
    success: boolean;
    message: string;
    missing_tables: ({
        table: string;
        status: string;
        error: any;
    } | {
        table: string;
        status: string;
        error?: undefined;
    })[];
    instructions: {
        step1: string;
        step2: string;
        step3: string;
        step4: string;
    };
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map