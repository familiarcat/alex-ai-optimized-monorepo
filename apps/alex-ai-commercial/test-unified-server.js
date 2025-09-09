#!/usr/bin/env node

/**
 * Test Unified Webhook Server
 */

const axios = require('axios')

async function testUnifiedServer() {
    console.log('🧪 Testing Unified Webhook Server')
    console.log('=================================')
    console.log('')
    
    const baseUrl = 'http://localhost:8002'
    const endpoints = [
        { name: 'Job Opportunities', path: 'alex-ai-job-opportunities' },
        { name: 'Resume Analysis', path: 'alex-ai-resume-analysis' },
        { name: 'MCP Request', path: 'alex-ai-mcp-request' },
        { name: 'Contacts', path: 'alex-ai-contacts' }
    ]
    
    let successCount = 0
    
    for (const endpoint of endpoints) {
        try {
            console.log(`🔍 Testing: ${endpoint.name}`)
            
            const response = await axios.post(`${baseUrl}/webhook/${endpoint.path}`, {
                action: 'get_all',
                timestamp: new Date().toISOString(),
                source: 'unified_test'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            })
            
            console.log(`✅ ${endpoint.name}: Working (${response.status})`)
            if (response.data) {
                console.log(`   Source: ${response.data.source || 'unknown'}`)
                console.log(`   Data: ${JSON.stringify(response.data).substring(0, 100)}...`)
            }
            successCount++
            
        } catch (error) {
            console.log(`❌ ${endpoint.name}: ${error.message}`)
        }
    }
    
    console.log('')
    console.log('📊 Test Results Summary')
    console.log('======================')
    console.log(`✅ Working: ${successCount}/${endpoints.length}`)
    console.log(`❌ Failed: ${endpoints.length - successCount}/${endpoints.length}`)
    
    if (successCount === endpoints.length) {
        console.log('')
        console.log('🎉 SUCCESS! Unified server is working!')
        console.log('🚀 Your Alex AI Job Search application can now use this server!')
    } else {
        console.log('')
        console.log('⚠️  Some endpoints need attention.')
    }
}

testUnifiedServer()
