"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SystemFidelityTestDashboard;
const react_1 = __importStar(require("react"));
function SystemFidelityTestDashboard({ onTestComplete }) {
    const [testResults, setTestResults] = (0, react_1.useState)([]);
    const [testSummary, setTestSummary] = (0, react_1.useState)(null);
    const [systemAnalysis, setSystemAnalysis] = (0, react_1.useState)(null);
    const [isRunning, setIsRunning] = (0, react_1.useState)(false);
    const [currentTest, setCurrentTest] = (0, react_1.useState)('');
    const [availableTests, setAvailableTests] = (0, react_1.useState)([]);
    const [recommendations, setRecommendations] = (0, react_1.useState)([]);
    const [activeTab, setActiveTab] = (0, react_1.useState)('overview');
    (0, react_1.useEffect)(() => {
        loadAvailableTests();
    }, []);
    const loadAvailableTests = async () => {
        try {
            const response = await fetch('/api/system-fidelity-test');
            if (response.ok) {
                const data = await response.json();
                setAvailableTests(data.available_tests || []);
            }
        }
        catch (error) {
            console.error('Failed to load available tests:', error);
        }
    };
    const runAllFidelityTests = async () => {
        try {
            setIsRunning(true);
            setTestResults([]);
            setTestSummary(null);
            setSystemAnalysis(null);
            setRecommendations([]);
            const response = await fetch('/api/system-fidelity-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    run_all: true
                })
            });
            const result = await response.json();
            if (result.success) {
                setTestResults(result.test_results || []);
                setTestSummary(result.summary);
                setSystemAnalysis(result.system_analysis);
                setRecommendations(result.recommendations || []);
                if (onTestComplete) {
                    onTestComplete(result.test_results || []);
                }
            }
            else {
                console.error('Failed to run fidelity tests:', result.error);
                alert(`Failed to run fidelity tests: ${result.error}`);
            }
        }
        catch (error) {
            console.error('Error running fidelity tests:', error);
            alert('Error running fidelity tests');
        }
        finally {
            setIsRunning(false);
            setCurrentTest('');
        }
    };
    const runSingleFidelityTest = async (testType) => {
        try {
            setIsRunning(true);
            setCurrentTest(testType);
            const response = await fetch('/api/system-fidelity-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    test_type: testType
                })
            });
            const result = await response.json();
            if (result.success) {
                // Add single test result to existing results
                const newResult = {
                    test_name: result.test_name,
                    test_key: result.test_type,
                    status: 'success',
                    result: result.result,
                    execution_time: result.result?.execution_time || 0,
                    mcp_tools_utilized: result.result?.mcp_tools_utilized || 0,
                    crew_collaboration: result.result?.crew_collaboration || 'failed',
                    problem_solving_effectiveness: result.result?.problem_solving_effectiveness || 0
                };
                setTestResults(prev => {
                    const filtered = prev.filter(r => r.test_key !== testType);
                    return [...filtered, newResult];
                });
                setRecommendations(result.recommendations || []);
            }
            else {
                // Add failed test result
                const newResult = {
                    test_name: result.test_name,
                    test_key: result.test_type,
                    status: 'failed',
                    error: result.error,
                    execution_time: 0,
                    mcp_tools_utilized: 0,
                    crew_collaboration: 'failed',
                    problem_solving_effectiveness: 0
                };
                setTestResults(prev => {
                    const filtered = prev.filter(r => r.test_key !== testType);
                    return [...filtered, newResult];
                });
                setRecommendations(result.recommendations || []);
            }
        }
        catch (error) {
            console.error('Error running single fidelity test:', error);
            alert('Error running single fidelity test');
        }
        finally {
            setIsRunning(false);
            setCurrentTest('');
        }
    };
    const getTestIcon = (testKey) => {
        switch (testKey) {
            case 'technical_lead_geordi_integration': return '🔧';
            case 'ai_strategy_data_integration': return '🤖';
            case 'client_success_troi_integration': return '👥';
            case 'sustainability_crusher_integration': return '🌱';
            case 'cross_crew_mission_coordination': return '⭐';
            default: return '🔬';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return '✅';
            case 'failed': return '❌';
            default: return '⏳';
        }
    };
    const getCollaborationColor = (collaboration) => {
        switch (collaboration) {
            case 'excellent': return 'bg-green-100 text-green-800';
            case 'good': return 'bg-blue-100 text-blue-800';
            case 'partial': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const formatExecutionTime = (time) => {
        if (time < 1000)
            return `${time}ms`;
        return `${(time / 1000).toFixed(2)}s`;
    };
    const getFidelityScoreColor = (score) => {
        if (score >= 90)
            return 'text-green-600';
        if (score >= 80)
            return 'text-blue-600';
        if (score >= 70)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    return (<div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          🔬 System Fidelity Test Suite
        </h2>
        <div className="text-sm text-gray-500">
          {testResults.length} tests run • {testSummary?.system_fidelity_score || 0}% fidelity score
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'results', label: 'Test Results', icon: '🧪' },
            { id: 'analysis', label: 'System Analysis', icon: '🔍' },
            { id: 'recommendations', label: 'Recommendations', icon: '💡' }
        ].map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'}`}>
            {tab.icon} {tab.label}
          </button>))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (<div className="space-y-6">
          {/* System Fidelity Score */}
          {testSummary && (<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getFidelityScoreColor(testSummary.system_fidelity_score)}`}>
                  {testSummary.system_fidelity_score}%
                </div>
                <div className="text-lg font-medium text-gray-800 mb-2">System Fidelity Score</div>
                <div className="text-sm text-gray-600">
                  {testSummary.system_fidelity_score >= 90 ? 'Excellent system integration and fidelity' :
                    testSummary.system_fidelity_score >= 80 ? 'Good system integration with minor optimizations needed' :
                        testSummary.system_fidelity_score >= 70 ? 'Fair system integration, several areas need improvement' :
                            'Poor system integration, significant improvements required'}
                </div>
              </div>
            </div>)}

          {/* Test Summary */}
          {testSummary && (<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{testSummary.total_tests}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{testSummary.successful_tests}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{testSummary.total_mcp_tools_utilized}</div>
                <div className="text-sm text-gray-600">MCP Tools Used</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{testSummary.average_problem_solving_effectiveness}</div>
                <div className="text-sm text-gray-600">Problem Solving</div>
              </div>
            </div>)}

          {/* Test Controls */}
          <div className="flex flex-wrap gap-3">
            <button onClick={runAllFidelityTests} disabled={isRunning} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
              <span>🚀</span>
              <span>{isRunning ? 'Running All Tests...' : 'Run All Fidelity Tests'}</span>
            </button>
            
            {availableTests.map(testType => (<button key={testType} onClick={() => runSingleFidelityTest(testType)} disabled={isRunning} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                <span>{getTestIcon(testType)}</span>
                <span>{isRunning && currentTest === testType ? 'Running...' : 'Run Test'}</span>
              </button>))}
          </div>

          {/* System Architecture Flow */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Integration Flow</h3>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">Next.js</div>
              <div className="text-gray-400">→</div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">N8N</div>
              <div className="text-gray-400">→</div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">MCP</div>
              <div className="text-gray-400">→</div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">Crew</div>
              <div className="text-gray-400">→</div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">Problem Solving</div>
            </div>
          </div>
        </div>)}

      {/* Test Results Tab */}
      {activeTab === 'results' && (<div className="space-y-4">
          {testResults.length === 0 ? (<div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🧪</div>
              <p>No fidelity test results available yet.</p>
              <p className="text-sm text-gray-400 mt-2">Run tests to see detailed results and system fidelity analysis.</p>
            </div>) : (testResults.map((result, index) => (<div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTestIcon(result.test_key)}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{result.test_name}</h4>
                      <p className="text-sm text-gray-600">{result.test_key.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)} {result.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatExecutionTime(result.execution_time)}
                    </span>
                  </div>
                </div>

                {result.status === 'success' && (<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">MCP Tools Utilized:</span>
                      <span className="ml-2 text-blue-600">{result.mcp_tools_utilized}%</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Crew Collaboration:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getCollaborationColor(result.crew_collaboration)}`}>
                        {result.crew_collaboration}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Problem Solving:</span>
                      <span className="ml-2 text-green-600">{result.problem_solving_effectiveness}%</span>
                    </div>
                  </div>)}

                {result.status === 'failed' && result.error && (<div className="text-red-600 text-sm">
                    <span className="font-medium">Error:</span> {result.error}
                  </div>)}
              </div>)))}
        </div>)}

      {/* System Analysis Tab */}
      {activeTab === 'analysis' && (<div className="space-y-6">
          {systemAnalysis ? (<>
              {/* Integration Flow Health */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Integration Flow Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(systemAnalysis.integration_flow_health.nextjs_to_n8n)}%</div>
                    <div className="text-sm text-gray-600">Next.js → N8N</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{Math.round(systemAnalysis.integration_flow_health.n8n_to_mcp)}%</div>
                    <div className="text-sm text-gray-600">N8N → MCP</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(systemAnalysis.integration_flow_health.mcp_to_crew)}%</div>
                    <div className="text-sm text-gray-600">MCP → Crew</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{Math.round(systemAnalysis.integration_flow_health.crew_collaboration)}%</div>
                    <div className="text-sm text-gray-600">Crew Collaboration</div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600">{Math.round(systemAnalysis.integration_flow_health.problem_solving)}%</div>
                    <div className="text-sm text-gray-600">Problem Solving</div>
                  </div>
                </div>
              </div>

              {/* MCP Tool Effectiveness */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">MCP Tool Effectiveness</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-600">{systemAnalysis.mcp_tool_effectiveness.total_tools_required}</div>
                    <div className="text-sm text-gray-600">Tools Required</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{systemAnalysis.mcp_tool_effectiveness.total_tools_utilized}</div>
                    <div className="text-sm text-gray-600">Tools Utilized</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{Math.round(systemAnalysis.mcp_tool_effectiveness.utilization_rate)}%</div>
                    <div className="text-sm text-gray-600">Utilization Rate</div>
                  </div>
                </div>
              </div>

              {/* Crew Collaboration Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Crew Collaboration Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{systemAnalysis.crew_collaboration_analysis.excellent_collaboration}</div>
                    <div className="text-sm text-gray-600">Excellent</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{systemAnalysis.crew_collaboration_analysis.good_collaboration}</div>
                    <div className="text-sm text-gray-600">Good</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{systemAnalysis.crew_collaboration_analysis.partial_collaboration}</div>
                    <div className="text-sm text-gray-600">Partial</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{systemAnalysis.crew_collaboration_analysis.failed_collaboration}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                </div>
              </div>
            </>) : (<div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>No system analysis available yet.</p>
              <p className="text-sm text-gray-400 mt-2">Run fidelity tests to see detailed system analysis.</p>
            </div>)}
        </div>)}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (<div className="space-y-4">
          {recommendations.length === 0 ? (<div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💡</div>
              <p>No recommendations available yet.</p>
              <p className="text-sm text-gray-400 mt-2">Run fidelity tests to get system optimization recommendations.</p>
            </div>) : (recommendations.map((recommendation, index) => (<div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-lg flex-shrink-0">
                  {recommendation.startsWith('🎉') ? '🎉' :
                    recommendation.startsWith('✅') ? '✅' :
                        recommendation.startsWith('⚠️') ? '⚠️' :
                            recommendation.startsWith('❌') ? '❌' :
                                recommendation.startsWith('🔧') ? '🔧' :
                                    recommendation.startsWith('🔑') ? '🔑' :
                                        recommendation.startsWith('📊') ? '📊' :
                                            recommendation.startsWith('🔗') ? '🔗' :
                                                recommendation.startsWith('🧠') ? '🧠' :
                                                    recommendation.startsWith('⭐') ? '⭐' :
                                                        recommendation.startsWith('🚀') ? '🚀' :
                                                            recommendation.startsWith('👥') ? '👥' :
                                                                recommendation.startsWith('🛠️') ? '🛠️' :
                                                                    recommendation.startsWith('🎯') ? '🎯' : '💡'}
                </span>
                <span className="text-sm text-gray-700">{recommendation}</span>
              </div>)))}
        </div>)}

      {/* Current Test Status */}
      {isRunning && currentTest && (<div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <div>
              <div className="font-medium">Running Fidelity Test</div>
              <div className="text-sm opacity-90">{getTestIcon(currentTest)} {currentTest.replace(/_/g, ' ').toUpperCase()}</div>
            </div>
          </div>
        </div>)}
    </div>);
}
//# sourceMappingURL=SystemFidelityTestDashboard.js.map