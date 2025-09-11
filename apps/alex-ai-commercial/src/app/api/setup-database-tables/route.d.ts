import { NextResponse } from 'next/server';
export declare function POST(): Promise<NextResponse<{
    success: boolean;
    error: string;
    details: any;
    instructions: {
        step1: string;
        step2: string;
        step3: string;
        step4: string;
    };
}> | NextResponse<{
    success: boolean;
    message: string;
    data: any;
}>>;
export declare function GET(): Promise<NextResponse<{
    success: boolean;
    error: string;
    details: any;
}> | NextResponse<{
    success: boolean;
    existingTables: any;
    presentTables: string[];
    missingTables: string[];
    status: string;
}>>;
//# sourceMappingURL=route.d.ts.map