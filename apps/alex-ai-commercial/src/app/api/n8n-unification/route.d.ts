import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    message: string;
    sync_results: ({
        alex_ai_crew_id: string;
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
        federation_status: string;
        last_sync: string;
        unified_capabilities: {
            alex_ai_capabilities: string[];
            federation_capabilities: string[];
            unified_capabilities: string[];
        };
    } | {
        alex_ai_crew_id: string;
        federation_member: string;
        status: string;
        error: string;
    })[];
    total_synced: number;
    total_errors: number;
}> | NextResponse<{
    success: boolean;
    message: string;
    unified_workflows: ({
        name: string;
        description: string;
        deployment_id: string;
        status: string;
        endpoints: {
            webhook: string;
            api: string;
        };
        error?: undefined;
    } | {
        name: string;
        status: string;
        error: string;
        description?: undefined;
        deployment_id?: undefined;
        endpoints?: undefined;
    })[];
    total_deployed: number;
}> | NextResponse<{
    success: boolean;
    message: string;
    alex_ai_crew_member: string;
    federation_member: string;
    consultation_response: {
        success: boolean;
        federation_response: {
            status: string;
            processing_time: number;
            insights: string[];
            recommendations: string[];
        };
    };
    unified_insights: {
        alex_ai_insights: any;
        federation_insights: any;
        unified_insights: string[];
    };
}> | NextResponse<{
    success: boolean;
    message: string;
    alex_ai_crew_member: string;
    federation_member: string;
    federation_response: {
        success: boolean;
        federation_response: {
            status: string;
            processing_time: number;
            insights: string[];
            recommendations: string[];
        };
    };
}> | NextResponse<{
    success: boolean;
    message: string;
    alex_ai_crew_member: string;
    federation_member: string;
    processed_data: {
        processed_data: any;
        alex_ai_format: boolean;
        crew_member: string;
        processing_timestamp: string;
    };
    alex_ai_insights: {
        crew_member: string;
        insights: string[];
        recommendations: string[];
    };
}> | NextResponse<{
    success: boolean;
    message: string;
    analysis_results: ({
        alex_ai_crew_member: string;
        federation_member: string;
        alex_ai_analysis: {
            crew_member: string;
            analysis_type: string;
            insights: string[];
            confidence_score: number;
        };
        federation_analysis: {
            federation_member: string;
            analysis_type: string;
            insights: string[];
            confidence_score: number;
        };
        unified_analysis: {
            combined_confidence: number;
            unified_insights: any[];
            cross_crew_synergy: string;
            recommendation_quality: string;
        };
        cross_crew_insights: string[];
    } | {
        alex_ai_crew_member: string;
        federation_member: string;
        status: string;
        error: string;
    })[];
    total_analyses: number;
    successful_analyses: number;
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
export declare function GET(request: Request): Promise<NextResponse<{
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
} | {
    federation_member: string;
    workflow_id: string;
    webhook_path: string;
    specialization: string;
    expertise_areas: string[];
}> | NextResponse<{
    status: string;
    total_crew_members: number;
    active_workflows: number;
    last_sync: string;
    federation_crew_status: string;
    alex_ai_crew_status: string;
}> | NextResponse<{
    captain_picard: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    picard: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    commander_riker: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    commander_data: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    geordi_la_forge: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    geordi: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    lieutenant_worf: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    counselor_troi: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    lieutenant_uhura: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    dr_crusher: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
    quark: {
        federation_member: string;
        workflow_id: string;
        webhook_path: string;
        specialization: string;
        expertise_areas: string[];
    };
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map