const { unifiedDataService } = require('./src/lib/unified-data-architecture.ts')
const { n8nSyncService } = require('./src/lib/n8n-sync-service.ts')
const { mcpIntegration } = require('./src/lib/mcp-integration.ts')

async function runComprehensiveTests() {
    console.log('🧪 Running Comprehensive Unified System Tests')
    console.log('==============================================')
    console.log('')
    
    let testsPassed = 0
    let testsTotal = 0
    
    // Test 1: Unified Data Service
    console.log('📋 Test 1: Unified Data Service')
    testsTotal++
    try {
        const jobs = await unifiedDataService.getJobOpportunities()
        console.log(`✅ Loaded ${jobs.length} job opportunities`)
        testsPassed++
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`)
    }
    
    // Test 2: n8n Sync Service
    console.log('🔗 Test 2: n8n Sync Service')
    testsTotal++
    try {
        const connected = await n8nSyncService.testN8NConnectivity()
        console.log(`✅ n8n connection: ${connected ? 'Connected' : 'Disconnected'}`)
        testsPassed++
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`)
    }
    
    // Test 3: MCP Integration
    console.log('🤖 Test 3: MCP Integration')
    testsTotal++
    try {
        const connected = await mcpIntegration.testConnectivity()
        console.log(`✅ MCP connection: ${connected ? 'Connected' : 'Disconnected'}`)
        testsPassed++
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`)
    }
    
    // Test 4: Data Synchronization
    console.log('🔄 Test 4: Data Synchronization')
    testsTotal++
    try {
        await n8nSyncService.performFullSync()
        console.log('✅ Full sync completed')
        testsPassed++
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`)
    }
    
    // Test 5: Environment Variables
    console.log('🔧 Test 5: Environment Variables')
    testsTotal++
    const requiredVars = [
        'N8N_URL',
        'N8N_API_KEY',
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'OPENAI_API_KEY'
    ]
    
    let allVarsPresent = true
    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            console.log(`❌ Missing: ${varName}`)
            allVarsPresent = false
        }
    }
    
    if (allVarsPresent) {
        console.log('✅ All environment variables present')
        testsPassed++
    }
    
    // Summary
    console.log('')
    console.log('📊 Test Results Summary')
    console.log('=======================')
    console.log(`Tests Passed: ${testsPassed}/${testsTotal}`)
    console.log(`Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`)
    
    if (testsPassed === testsTotal) {
        console.log('🎉 All tests passed! System is ready for production.')
    } else {
        console.log('⚠️  Some tests failed. Please review the issues above.')
    }
}

runComprehensiveTests().catch(console.error)

