import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    deployment: {
        id: string;
        workflow_name: string;
        workflow_id: string;
        status: string;
        deployed_at: string;
        config: any;
        endpoints: {
            webhook: string;
            api: string;
        };
    };
    message: string;
}> | NextResponse<{
    success: boolean;
    execution: {
        id: string;
        workflow_name: string;
        status: string;
        started_at: string;
        input_data: any;
        progress: number;
    };
    message: string;
}> | {
    workflow_name: string;
    status: string;
    enabled: boolean;
    last_execution: string;
    next_execution: string;
    execution_count: number;
    success_rate: number;
    average_duration: number;
    nodes: number;
    triggers: string[];
} | {
    workflows: {
        id: string;
        name: string;
        description: string;
        enabled: boolean;
        triggers: string[];
        nodes_count: number;
        last_updated: string;
    }[];
    total: number;
    active: number;
} | NextResponse<{
    success: boolean;
    error: string;
}>>;
export declare function GET(request: Request): Promise<NextResponse<{
    workflow_name: string;
    status: string;
    enabled: boolean;
    last_execution: string;
    next_execution: string;
    execution_count: number;
    success_rate: number;
    average_duration: number;
    nodes: number;
    triggers: string[];
}> | NextResponse<{
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    triggers: string[];
    nodes_count: number;
    last_updated: string;
}[]> | NextResponse<{
    workflows: {
        id: string;
        name: string;
        description: string;
        enabled: boolean;
        triggers: string[];
        nodes_count: number;
        last_updated: string;
    }[];
    total: number;
    active: number;
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map