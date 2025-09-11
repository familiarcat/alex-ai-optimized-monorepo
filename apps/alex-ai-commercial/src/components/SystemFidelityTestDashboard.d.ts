import React from 'react';
interface FidelityTestResult {
    test_name: string;
    test_key: string;
    status: 'success' | 'failed';
    result?: any;
    error?: string;
    execution_time: number;
    mcp_tools_utilized: number;
    crew_collaboration: string;
    problem_solving_effectiveness: number;
}
interface SystemFidelityTestDashboardProps {
    onTestComplete?: (results: FidelityTestResult[]) => void;
}
export default function SystemFidelityTestDashboard({ onTestComplete }: SystemFidelityTestDashboardProps): React.JSX.Element;
export {};
//# sourceMappingURL=SystemFidelityTestDashboard.d.ts.map