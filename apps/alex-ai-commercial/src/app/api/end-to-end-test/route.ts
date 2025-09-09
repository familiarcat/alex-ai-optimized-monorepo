import { NextResponse } from 'next/server'

// End-to-End Testing Suite for Alex AI + N8N Federation Crew Integration
const TEST_SCENARIOS = {
  unified_crew_analysis: {
    name: 'Unified Crew Analysis Test',
    description: 'Test cross-crew collaboration between Alex AI and Federation crews',
    webhook: 'https://n8n.pbradygeorgen.com/webhook/alex-ai-unified-crew',
    payload: {
      analysis_type: 'job_opportunity',
      data: {
        company: 'Microsoft',
        position: 'Senior Software Engineer - AI/ML Platform',
        location: 'St. Louis, MO',
        salary_range: '$120k-180k',
        requirements: 'TypeScript, Node.js, AI/ML, MCP Integration, System Architecture',
        benefits: 'Health, 401k, Stock options, Unlimited PTO, Professional Development',
        remote_option: 'Hybrid'
      },
      crew_members: ['technical_lead', 'ai_strategy', 'client_success', 'sustainability'],
      federation_integration: true,
      test_mode: true
    }
  },
  mcp_knowledge_integration: {
    name: 'MCP Knowledge Integration Test',
    description: 'Test MCP knowledge scraping and crew analysis integration',
    webhook: 'https://n8n.pbradygeorgen.com/webhook/alex-ai-mcp-enhanced',
    payload: {
      request_type: 'mcp_knowledge_scraping',
      sources: ['github', 'documentation', 'open_source'],
      max_results: 25,
      crew_analysis: true,
      federation_integration: true,
      test_mode: true
    }
  },
  federation_mission_coordination: {
    name: 'Federation Mission Coordination Test',
    description: 'Test Federation crew mission coordination with Alex AI integration',
    webhook: 'https://n8n.pbradygeorgen.com/webhook/federation-mission',
    payload: {
      mission_type: 'alex_ai_integration',
      mission_priority: 'high',
      data: {
        company: 'Boeing',
        position: 'Senior Software Engineer - AI/ML',
        location: 'St. Louis, MO',
        requirements: 'Python, Machine Learning, AI/ML, Aerospace, Data Analysis',
        alex_ai_score: 88,
        st_louis_area: true,
        remote_friendly: true
      },
      crew_coordination: true,
      alex_ai_sync: true,
      cross_crew_analysis: true,
      test_mode: true
    }
  },
  individual_crew_member_test: {
    name: 'Individual Crew Member Test',
    description: 'Test individual Federation crew member with Alex AI integration',
    webhook: 'https://n8n.pbradygeorgen.com/webhook/crew-lieutenant-commander-geordi-la-forge',
    payload: {
      directive_type: 'technical_analysis',
      alex_ai_crew_member: 'technical_lead',
      data: {
        company: 'Daugherty Business Solutions',
        position: 'Senior Consultant III - AI/ML',
        location: 'St. Louis, MO',
        requirements: 'Python, Machine Learning, AI/ML, Consulting, Client-facing',
        technical_complexity: 'high',
        mcp_integration_required: true
      },
      federation_integration: true,
      test_mode: true
    }
  },
  observation_lounge_coordination: {
    name: 'Observation Lounge Coordination Test',
    description: 'Test Observation Lounge crew coordination and decision making',
    webhook: 'https://n8n.pbradygeorgen.com/webhook/observation-lounge-webhook',
    payload: {
      coordination_type: 'cross_crew_decision',
      alex_ai_input: {
        job_opportunities: [
          {
            company: 'Microsoft',
            position: 'Software Engineer - AI Platform',
            alex_ai_score: 92,
            crew_analysis: {
              technical_lead: { score: 98, analysis: 'Excellent technical match' },
              ai_strategy: { score: 95, analysis: 'Perfect AI strategy alignment' }
            }
          }
        ]
      },
      federation_crew_input: {
        mission_analysis: 'High priority mission',
        crew_readiness: 'All systems operational',
        strategic_value: 'Critical for Federation objectives'
      },
      decision_required: true,
      test_mode: true
    }
  }
}

export async function POST(request: Request) {
  try {
    const { test_type, run_all = false } = await request.json()
    
    console.log('🧪 Starting End-to-End Integration Tests:', { test_type, run_all })
    
    if (run_all) {
      return await runAllTests()
    }
    
    if (test_type && TEST_SCENARIOS[test_type as keyof typeof TEST_SCENARIOS]) {
      return await runSingleTest(test_type)
    }
    
    return NextResponse.json({
      success: false,
      error: `Invalid test type: ${test_type}`,
      available_tests: Object.keys(TEST_SCENARIOS)
    }, { status: 400 })

  } catch (error) {
    console.error('❌ End-to-end test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      available_tests: Object.keys(TEST_SCENARIOS),
      test_scenarios: TEST_SCENARIOS,
      instructions: [
        '1. Activate new workflows in N8N UI',
        '2. Run POST request with test_type or run_all=true',
        '3. Monitor execution logs in N8N dashboard',
        '4. Review test results and integration status'
      ]
    })
  } catch (error) {
    console.error('❌ Failed to get test scenarios:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

async function runAllTests() {
  console.log('🚀 Running all end-to-end integration tests...')
  
  const testResults = []
  const startTime = Date.now()
  
  for (const [testKey, testScenario] of Object.entries(TEST_SCENARIOS)) {
    try {
      console.log(`🧪 Running test: ${testScenario.name}`)
      const result = await executeTest(testKey, testScenario)
      testResults.push({
        test_name: testScenario.name,
        test_key: testKey,
        status: 'success',
        result: result,
        execution_time: result.execution_time
      })
    } catch (error) {
      console.error(`❌ Test failed: ${testScenario.name}`, error)
      testResults.push({
        test_name: testScenario.name,
        test_key: testKey,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        execution_time: 0
      })
    }
    
    // Add delay between tests to avoid overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  const totalTime = Date.now() - startTime
  const successfulTests = testResults.filter(r => r.status === 'success').length
  const failedTests = testResults.filter(r => r.status === 'failed').length
  
  return NextResponse.json({
    success: true,
    message: 'All end-to-end tests completed',
    summary: {
      total_tests: testResults.length,
      successful_tests: successfulTests,
      failed_tests: failedTests,
      success_rate: `${Math.round((successfulTests / testResults.length) * 100)}%`,
      total_execution_time: `${totalTime}ms`
    },
    test_results: testResults,
    recommendations: generateRecommendations(testResults)
  })
}

async function runSingleTest(testType: string) {
  const testScenario = TEST_SCENARIOS[testType as keyof typeof TEST_SCENARIOS]
  
  console.log(`🧪 Running single test: ${testScenario.name}`)
  
  try {
    const result = await executeTest(testType, testScenario)
    
    return NextResponse.json({
      success: true,
      message: `Test '${testScenario.name}' completed successfully`,
      test_name: testScenario.name,
      test_type: testType,
      result: result,
      recommendations: generateSingleTestRecommendations(result)
    })
    
  } catch (error) {
    console.error(`❌ Single test failed: ${testScenario.name}`, error)
    
    return NextResponse.json({
      success: false,
      message: `Test '${testScenario.name}' failed`,
      test_name: testScenario.name,
      test_type: testType,
      error: error instanceof Error ? error.message : 'Unknown error',
      recommendations: generateFailureRecommendations(testType, error)
    })
  }
}

async function executeTest(testKey: string, testScenario: any) {
  const startTime = Date.now()
  
  try {
    // Execute the webhook call
    const response = await fetch(testScenario.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testScenario.payload)
    })
    
    const executionTime = Date.now() - startTime
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const responseData = await response.json()
    
    return {
      webhook_url: testScenario.webhook,
      http_status: response.status,
      response_data: responseData,
      execution_time: executionTime,
      test_payload: testScenario.payload,
      success: true
    }
    
  } catch (error) {
    const executionTime = Date.now() - startTime
    
    return {
      webhook_url: testScenario.webhook,
      http_status: 0,
      response_data: null,
      execution_time: executionTime,
      test_payload: testScenario.payload,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

function generateRecommendations(testResults: any[]) {
  const recommendations = []
  
  const successfulTests = testResults.filter(r => r.status === 'success')
  const failedTests = testResults.filter(r => r.status === 'failed')
  
  if (successfulTests.length === testResults.length) {
    recommendations.push('🎉 All tests passed! Your Alex AI + N8N Federation Crew integration is fully operational.')
    recommendations.push('✅ You can now use the unified system for job analysis and crew collaboration.')
    recommendations.push('🚀 Consider running production workloads through the integrated system.')
  } else if (successfulTests.length > 0) {
    recommendations.push(`⚠️ ${successfulTests.length}/${testResults.length} tests passed. Partial integration success.`)
    recommendations.push('🔧 Review failed tests and check N8N workflow configurations.')
    recommendations.push('📊 Monitor N8N execution logs for detailed error information.')
  } else {
    recommendations.push('❌ All tests failed. Check N8N workflow activation and configuration.')
    recommendations.push('🔧 Ensure all workflows are active in the N8N UI.')
    recommendations.push('🔑 Verify authentication credentials for Supabase and OpenRouter.')
  }
  
  // Specific recommendations based on test results
  const unifiedCrewTest = testResults.find(r => r.test_key === 'unified_crew_analysis')
  if (unifiedCrewTest && unifiedCrewTest.status === 'failed') {
    recommendations.push('🔗 Check "Alex AI - Unified Crew Integration System" workflow activation.')
  }
  
  const mcpTest = testResults.find(r => r.test_key === 'mcp_knowledge_integration')
  if (mcpTest && mcpTest.status === 'failed') {
    recommendations.push('🧠 Check "Alex AI - Enhanced MCP Knowledge Integration" workflow activation.')
  }
  
  const federationTest = testResults.find(r => r.test_key === 'federation_mission_coordination')
  if (federationTest && federationTest.status === 'failed') {
    recommendations.push('⭐ Check Federation Crew workflow configurations and Supabase connections.')
  }
  
  return recommendations
}

function generateSingleTestRecommendations(result: any) {
  const recommendations = []
  
  if (result.success) {
    recommendations.push('✅ Test completed successfully!')
    recommendations.push(`⏱️ Execution time: ${result.execution_time}ms`)
    
    if (result.execution_time > 10000) {
      recommendations.push('⚠️ Execution time is high. Consider optimizing workflow performance.')
    }
    
    if (result.response_data) {
      recommendations.push('📊 Check N8N execution logs for detailed analysis results.')
    }
  } else {
    recommendations.push('❌ Test failed. Check the following:')
    recommendations.push('🔧 Ensure the workflow is active in N8N UI')
    recommendations.push('🔑 Verify authentication credentials')
    recommendations.push('📡 Check webhook endpoint configuration')
  }
  
  return recommendations
}

function generateFailureRecommendations(testType: string, error: any) {
  const recommendations = []
  
  recommendations.push('❌ Test failed. Troubleshooting steps:')
  
  switch (testType) {
    case 'unified_crew_analysis':
      recommendations.push('🔗 Activate "Alex AI - Unified Crew Integration System" workflow')
      recommendations.push('🔑 Configure OpenRouter API credentials')
      recommendations.push('📊 Check Supabase connection for memory storage')
      break
      
    case 'mcp_knowledge_integration':
      recommendations.push('🧠 Activate "Alex AI - Enhanced MCP Knowledge Integration" workflow')
      recommendations.push('🔑 Configure GitHub API access if needed')
      recommendations.push('📚 Verify MCP documentation endpoints')
      break
      
    case 'federation_mission_coordination':
      recommendations.push('⭐ Check "System - Enhanced Federation Crew - Complete Mission Control" workflow')
      recommendations.push('🔑 Verify Supabase crew_memories table exists')
      recommendations.push('🤖 Check OpenRouter API configuration')
      break
      
    default:
      recommendations.push('🔧 Check workflow activation status')
      recommendations.push('🔑 Verify all authentication credentials')
      recommendations.push('📡 Test webhook endpoints manually')
  }
  
  return recommendations
}
