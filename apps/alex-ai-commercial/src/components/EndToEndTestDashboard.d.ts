import React from 'react';
interface TestResult {
    test_name: string;
    test_key: string;
    status: 'success' | 'failed';
    result?: any;
    error?: string;
    execution_time: number;
}
interface EndToEndTestDashboardProps {
    onTestComplete?: (results: TestResult[]) => void;
}
export default function EndToEndTestDashboard({ onTestComplete }: EndToEndTestDashboardProps): React.JSX.Element;
export {};
//# sourceMappingURL=EndToEndTestDashboard.d.ts.map