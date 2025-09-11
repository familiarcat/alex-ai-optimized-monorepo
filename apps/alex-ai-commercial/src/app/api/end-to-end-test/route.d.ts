import { NextResponse } from 'next/server';
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
    message: string;
    summary: {
        total_tests: number;
        successful_tests: number;
        failed_tests: number;
        success_rate: string;
        total_execution_time: string;
    };
    test_results: ({
        test_name: string;
        test_key: string;
        status: string;
        result: {
            webhook_url: any;
            http_status: number;
            response_data: any;
            execution_time: number;
            test_payload: any;
            success: boolean;
            error?: undefined;
        } | {
            webhook_url: any;
            http_status: number;
            response_data: null;
            execution_time: number;
            test_payload: any;
            success: boolean;
            error: string;
        };
        execution_time: number;
        error?: undefined;
    } | {
        test_name: string;
        test_key: string;
        status: string;
        error: string;
        execution_time: number;
        result?: undefined;
    })[];
    recommendations: string[];
}> | NextResponse<{
    success: boolean;
    message: string;
    test_name: string;
    test_type: string;
    result: {
        webhook_url: any;
        http_status: number;
        response_data: any;
        execution_time: number;
        test_payload: any;
        success: boolean;
        error?: undefined;
    } | {
        webhook_url: any;
        http_status: number;
        response_data: null;
        execution_time: number;
        test_payload: any;
        success: boolean;
        error: string;
    };
    recommendations: string[];
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
export declare function GET(): Promise<NextResponse<{
    success: boolean;
    available_tests: string[];
    test_scenarios: {
        unified_crew_analysis: {
            name: string;
            description: string;
            webhook: string;
            payload: {
                analysis_type: string;
                data: {
                    company: string;
                    position: string;
                    location: string;
                    salary_range: string;
                    requirements: string;
                    benefits: string;
                    remote_option: string;
                };
                crew_members: string[];
                federation_integration: boolean;
                test_mode: boolean;
            };
        };
        mcp_knowledge_integration: {
            name: string;
            description: string;
            webhook: string;
            payload: {
                request_type: string;
                sources: string[];
                max_results: number;
                crew_analysis: boolean;
                federation_integration: boolean;
                test_mode: boolean;
            };
        };
        federation_mission_coordination: {
            name: string;
            description: string;
            webhook: string;
            payload: {
                mission_type: string;
                mission_priority: string;
                data: {
                    company: string;
                    position: string;
                    location: string;
                    requirements: string;
                    alex_ai_score: number;
                    st_louis_area: boolean;
                    remote_friendly: boolean;
                };
                crew_coordination: boolean;
                alex_ai_sync: boolean;
                cross_crew_analysis: boolean;
                test_mode: boolean;
            };
        };
        individual_crew_member_test: {
            name: string;
            description: string;
            webhook: string;
            payload: {
                directive_type: string;
                alex_ai_crew_member: string;
                data: {
                    company: string;
                    position: string;
                    location: string;
                    requirements: string;
                    technical_complexity: string;
                    mcp_integration_required: boolean;
                };
                federation_integration: boolean;
                test_mode: boolean;
            };
        };
        observation_lounge_coordination: {
            name: string;
            description: string;
            webhook: string;
            payload: {
                coordination_type: string;
                alex_ai_input: {
                    job_opportunities: {
                        company: string;
                        position: string;
                        alex_ai_score: number;
                        crew_analysis: {
                            technical_lead: {
                                score: number;
                                analysis: string;
                            };
                            ai_strategy: {
                                score: number;
                                analysis: string;
                            };
                        };
                    }[];
                };
                federation_crew_input: {
                    mission_analysis: string;
                    crew_readiness: string;
                    strategic_value: string;
                };
                decision_required: boolean;
                test_mode: boolean;
            };
        };
    };
    instructions: string[];
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map