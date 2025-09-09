'use client'

import React, { useState, useEffect } from 'react'

interface TestResult {
  test_name: string
  test_key: string
  status: 'success' | 'failed'
  result?: any
  error?: string
  execution_time: number
}

interface TestSummary {
  total_tests: number
  successful_tests: number
  failed_tests: number
  success_rate: string
  total_execution_time: string
}

interface EndToEndTestDashboardProps {
  onTestComplete?: (results: TestResult[]) => void
}

export default function EndToEndTestDashboard({ onTestComplete }: EndToEndTestDashboardProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [testSummary, setTestSummary] = useState<TestSummary | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>('')
  const [availableTests, setAvailableTests] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    loadAvailableTests()
  }, [])

  const loadAvailableTests = async () => {
    try {
      const response = await fetch('/api/end-to-end-test')
      if (response.ok) {
        const data = await response.json()
        setAvailableTests(data.available_tests || [])
      }
    } catch (error) {
      console.error('Failed to load available tests:', error)
    }
  }

  const runAllTests = async () => {
    try {
      setIsRunning(true)
      setTestResults([])
      setTestSummary(null)
      setRecommendations([])
      
      const response = await fetch('/api/end-to-end-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          run_all: true
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setTestResults(result.test_results || [])
        setTestSummary(result.summary)
        setRecommendations(result.recommendations || [])
        
        if (onTestComplete) {
          onTestComplete(result.test_results || [])
        }
      } else {
        console.error('Failed to run tests:', result.error)
        alert(`Failed to run tests: ${result.error}`)
      }
    } catch (error) {
      console.error('Error running tests:', error)
      alert('Error running tests')
    } finally {
      setIsRunning(false)
      setCurrentTest('')
    }
  }

  const runSingleTest = async (testType: string) => {
    try {
      setIsRunning(true)
      setCurrentTest(testType)
      
      const response = await fetch('/api/end-to-end-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_type: testType
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Add single test result to existing results
        const newResult: TestResult = {
          test_name: result.test_name,
          test_key: result.test_type,
          status: 'success',
          result: result.result,
          execution_time: result.result?.execution_time || 0
        }
        
        setTestResults(prev => {
          const filtered = prev.filter(r => r.test_key !== testType)
          return [...filtered, newResult]
        })
        
        setRecommendations(result.recommendations || [])
      } else {
        // Add failed test result
        const newResult: TestResult = {
          test_name: result.test_name,
          test_key: result.test_type,
          status: 'failed',
          error: result.error,
          execution_time: 0
        }
        
        setTestResults(prev => {
          const filtered = prev.filter(r => r.test_key !== testType)
          return [...filtered, newResult]
        })
        
        setRecommendations(result.recommendations || [])
      }
    } catch (error) {
      console.error('Error running single test:', error)
      alert('Error running single test')
    } finally {
      setIsRunning(false)
      setCurrentTest('')
    }
  }

  const getTestIcon = (testKey: string) => {
    switch (testKey) {
      case 'unified_crew_analysis': return '🔗'
      case 'mcp_knowledge_integration': return '🧠'
      case 'federation_mission_coordination': return '⭐'
      case 'individual_crew_member_test': return '👤'
      case 'observation_lounge_coordination': return '🏛️'
      default: return '🧪'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'failed': return '❌'
      default: return '⏳'
    }
  }

  const formatExecutionTime = (time: number) => {
    if (time < 1000) return `${time}ms`
    return `${(time / 1000).toFixed(2)}s`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          🧪 End-to-End Integration Tests
        </h2>
        <div className="text-sm text-gray-500">
          {testResults.length} tests run • {testSummary?.success_rate || '0%'} success rate
        </div>
      </div>

      {/* Test Summary */}
      {testSummary && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{testSummary.total_tests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{testSummary.successful_tests}</div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{testSummary.failed_tests}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{testSummary.success_rate}</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
          <div className="mt-3 text-center text-sm text-gray-600">
            Total Execution Time: {testSummary.total_execution_time}
          </div>
        </div>
      )}

      {/* Test Controls */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span>🚀</span>
          <span>{isRunning ? 'Running All Tests...' : 'Run All Tests'}</span>
        </button>
        
        {availableTests.map(testType => (
          <button
            key={testType}
            onClick={() => runSingleTest(testType)}
            disabled={isRunning}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>{getTestIcon(testType)}</span>
            <span>{isRunning && currentTest === testType ? 'Running...' : 'Run Test'}</span>
          </button>
        ))}
      </div>

      {/* Current Test Status */}
      {isRunning && currentTest && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div>
              <div className="font-medium text-blue-800">Running Test</div>
              <div className="text-sm text-blue-600">{getTestIcon(currentTest)} {currentTest.replace(/_/g, ' ').toUpperCase()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Results</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
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

                {result.status === 'success' && result.result && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">HTTP Status:</span>
                      <span className="ml-2 text-green-600">{result.result.http_status}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Execution Time:</span>
                      <span className="ml-2 text-gray-600">{formatExecutionTime(result.result.execution_time)}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">Webhook URL:</span>
                      <p className="text-gray-600 font-mono text-xs break-all">{result.result.webhook_url}</p>
                    </div>
                  </div>
                )}

                {result.status === 'failed' && result.error && (
                  <div className="text-red-600 text-sm">
                    <span className="font-medium">Error:</span> {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h3>
          <div className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">{recommendation.startsWith('🎉') ? '🎉' : 
                  recommendation.startsWith('✅') ? '✅' : 
                  recommendation.startsWith('⚠️') ? '⚠️' : 
                  recommendation.startsWith('❌') ? '❌' : 
                  recommendation.startsWith('🔧') ? '🔧' : 
                  recommendation.startsWith('🔑') ? '🔑' : 
                  recommendation.startsWith('📊') ? '📊' : 
                  recommendation.startsWith('🔗') ? '🔗' : 
                  recommendation.startsWith('🧠') ? '🧠' : 
                  recommendation.startsWith('⭐') ? '⭐' : 
                  recommendation.startsWith('🚀') ? '🚀' : '💡'}</span>
                <span className="text-sm text-gray-700">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Instructions */}
      {testResults.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🧪</div>
          <p className="text-lg font-medium mb-2">Ready to Test Integration</p>
          <p className="text-sm mb-4">
            Run end-to-end tests to verify Alex AI + N8N Federation Crew integration.
          </p>
          <div className="text-sm text-gray-400 space-y-1">
            <p>• Ensure new workflows are activated in N8N UI</p>
            <p>• Verify authentication credentials are configured</p>
            <p>• Check webhook endpoints are accessible</p>
          </div>
        </div>
      )}

      {isRunning && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Running tests...</span>
        </div>
      )}
    </div>
  )
}
