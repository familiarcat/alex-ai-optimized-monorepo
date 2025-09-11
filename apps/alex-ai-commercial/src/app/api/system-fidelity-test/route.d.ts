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
        total_mcp_tools_utilized: number;
        average_problem_solving_effectiveness: string;
        system_fidelity_score: number;
    };
    test_results: ({
        test_name: string;
        test_key: string;
        status: string;
        result: {
            webhook_url: string;
            http_status: number;
            response_data: any;
            execution_time: number;
            test_payload: {
                test_type: string;
                test_scenario: string;
                problem: any;
                crew_collaboration: any;
                mcp_tools_required: any;
                expected_workflow: any;
                system_integration: {
                    nextjs_to_n8n: boolean;
                    n8n_to_mcp: boolean;
                    mcp_to_crew: boolean;
                    crew_collaboration: boolean;
                    problem_solving: boolean;
                };
                timestamp: string;
            };
            mcp_tools_utilized: number;
            crew_collaboration: string;
            problem_solving_effectiveness: number;
            system_integration_success: boolean;
            success: boolean;
            error?: undefined;
        } | {
            webhook_url: string;
            http_status: number;
            response_data: null;
            execution_time: number;
            test_payload: {
                test_type: string;
                test_scenario: string;
                problem: any;
                crew_collaboration: any;
                mcp_tools_required: any;
                expected_workflow: any;
                system_integration: {
                    nextjs_to_n8n: boolean;
                    n8n_to_mcp: boolean;
                    mcp_to_crew: boolean;
                    crew_collaboration: boolean;
                    problem_solving: boolean;
                };
                timestamp: string;
            };
            mcp_tools_utilized: number;
            crew_collaboration: string;
            problem_solving_effectiveness: number;
            system_integration_success: boolean;
            success: boolean;
            error: string;
        };
        execution_time: number;
        mcp_tools_utilized: number;
        crew_collaboration: string;
        problem_solving_effectiveness: number;
        error?: undefined;
    } | {
        test_name: string;
        test_key: string;
        status: string;
        error: string;
        execution_time: number;
        mcp_tools_utilized: number;
        crew_collaboration: string;
        problem_solving_effectiveness: number;
        result?: undefined;
    })[];
    system_analysis: {
        integration_flow_health: {
            nextjs_to_n8n: number;
            n8n_to_mcp: number;
            mcp_to_crew: number;
            crew_collaboration: number;
            problem_solving: number;
        };
        mcp_tool_effectiveness: {
            total_tools_required: any;
            total_tools_utilized: any;
            utilization_rate: number;
        };
        crew_collaboration_analysis: {
            excellent_collaboration: number;
            good_collaboration: number;
            partial_collaboration: number;
            failed_collaboration: number;
        };
    };
    recommendations: string[];
}> | NextResponse<{
    success: boolean;
    message: string;
    test_name: string;
    test_type: string;
    result: {
        webhook_url: string;
        http_status: number;
        response_data: any;
        execution_time: number;
        test_payload: {
            test_type: string;
            test_scenario: string;
            problem: any;
            crew_collaboration: any;
            mcp_tools_required: any;
            expected_workflow: any;
            system_integration: {
                nextjs_to_n8n: boolean;
                n8n_to_mcp: boolean;
                mcp_to_crew: boolean;
                crew_collaboration: boolean;
                problem_solving: boolean;
            };
            timestamp: string;
        };
        mcp_tools_utilized: number;
        crew_collaboration: string;
        problem_solving_effectiveness: number;
        system_integration_success: boolean;
        success: boolean;
        error?: undefined;
    } | {
        webhook_url: string;
        http_status: number;
        response_data: null;
        execution_time: number;
        test_payload: {
            test_type: string;
            test_scenario: string;
            problem: any;
            crew_collaboration: any;
            mcp_tools_required: any;
            expected_workflow: any;
            system_integration: {
                nextjs_to_n8n: boolean;
                n8n_to_mcp: boolean;
                mcp_to_crew: boolean;
                crew_collaboration: boolean;
                problem_solving: boolean;
            };
            timestamp: string;
        };
        mcp_tools_utilized: number;
        crew_collaboration: string;
        problem_solving_effectiveness: number;
        system_integration_success: boolean;
        success: boolean;
        error: string;
    };
    system_fidelity_analysis: {
        integration_flow_success: any;
        mcp_tool_utilization: string;
        crew_collaboration_quality: any;
        problem_solving_effectiveness: string;
        execution_performance: string;
        system_fidelity_score: number;
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
        technical_lead_geordi_integration: {
            name: string;
            description: string;
            problem: {
                type: string;
                title: string;
                description: string;
                technical_requirements: string[];
                success_criteria: string[];
            };
            crew_collaboration: {
                alex_ai_crew: string;
                federation_crew: string;
                collaboration_type: string;
            };
            mcp_tools_required: {
                name: string;
                purpose: string;
                endpoint: string;
                specific_use: string;
            }[];
            expected_workflow: string[];
        };
        ai_strategy_data_integration: {
            name: string;
            description: string;
            problem: {
                type: string;
                title: string;
                description: string;
                technical_requirements: string[];
                success_criteria: string[];
            };
            crew_collaboration: {
                alex_ai_crew: string;
                federation_crew: string;
                collaboration_type: string;
            };
            mcp_tools_required: {
                name: string;
                purpose: string;
                endpoint: string;
                specific_use: string;
            }[];
            expected_workflow: string[];
        };
        client_success_troi_integration: {
            name: string;
            description: string;
            problem: {
                type: string;
                title: string;
                description: string;
                technical_requirements: string[];
                success_criteria: string[];
            };
            crew_collaboration: {
                alex_ai_crew: string;
                federation_crew: string;
                collaboration_type: string;
            };
            mcp_tools_required: {
                name: string;
                purpose: string;
                endpoint: string;
                specific_use: string;
            }[];
            expected_workflow: string[];
        };
        sustainability_crusher_integration: {
            name: string;
            description: string;
            problem: {
                type: string;
                title: string;
                description: string;
                technical_requirements: string[];
                success_criteria: string[];
            };
            crew_collaboration: {
                alex_ai_crew: string;
                federation_crew: string;
                collaboration_type: string;
            };
            mcp_tools_required: {
                name: string;
                purpose: string;
                endpoint: string;
                specific_use: string;
            }[];
            expected_workflow: string[];
        };
        cross_crew_mission_coordination: {
            name: string;
            description: string;
            problem: {
                type: string;
                title: string;
                description: string;
                technical_requirements: string[];
                success_criteria: string[];
            };
            crew_collaboration: {
                alex_ai_crew: string;
                federation_crew: string;
                collaboration_type: string;
            };
            mcp_tools_required: {
                name: string;
                purpose: string;
                endpoint: string;
                specific_use: string;
            }[];
            expected_workflow: string[];
        };
    };
    system_architecture: {
        flow: string;
        components: string[];
        integration_points: string[];
    };
    instructions: string[];
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
//# sourceMappingURL=route.d.ts.map