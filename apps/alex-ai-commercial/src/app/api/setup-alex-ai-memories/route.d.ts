import { NextResponse } from 'next/server';
export declare function POST(): Promise<NextResponse<{
    success: boolean;
    message: string;
    instructions: string[];
    sql_commands: string[];
}> | NextResponse<{
    success: boolean;
    message: string;
    tables: string[];
    indexes: string;
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map