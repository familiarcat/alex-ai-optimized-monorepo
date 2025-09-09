#!/usr/bin/env node

/**
 * Comprehensive Test Script for n8n Webhooks
 */

const axios = require('axios')
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function testAllWebhooks() {
    console.log('🧪 Comprehensive n8n Webhook Test')
    console.log('=================================')
    console.log('')
    
    const endpoints = [
        { name: 'Job Opportunities', path: 'alex-ai-job-opportunities' },
        { name: 'Resume Analysis', path: 'alex-ai-resume-analysis' },
        { name: 'MCP Request', path: 'alex-ai-mcp-request' },
        { name: 'Contacts', path: 'alex-ai-contacts' }
    ]
    
    let successCount = 0
    const results = []
    
    for (const endpoint of endpoints) {
        try {
            console.log(`🔍 Testing: ${endpoint.name} (${endpoint.path})`)
            
            const response = await axios.post(`${N8N_URL}/webhook/${endpoint.path}`, {
                action: 'get_all',
                timestamp: new Date().toISOString(),
                source: 'comprehensive_test'
            }, {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            })
            
            console.log(`✅ ${endpoint.name}: Working (${response.status})`)
            if (response.data) {
                console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`)
            }
            successCount++
            results.push({ endpoint: endpoint.name, status: 'success', response: response.status })
            
        } catch (error) {
            if (error.response) {
                console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.data?.message || error.message}`)
                results.push({ endpoint: endpoint.name, status: 'error', error: error.response.data?.message || error.message })
            } else {
                console.log(`❌ ${endpoint.name}: ${error.message}`)
                results.push({ endpoint: endpoint.name, status: 'error', error: error.message })
            }
        }
    }
    
    console.log('')
    console.log('📊 Test Results Summary')
    console.log('======================')
    console.log(`✅ Successful: ${successCount}/${endpoints.length}`)
    console.log(`❌ Failed: ${endpoints.length - successCount}/${endpoints.length}`)
    
    if (successCount === endpoints.length) {
        console.log('')
        console.log('🎉 SUCCESS! All webhooks are working!')
        console.log('🚀 Your Alex AI Job Search application can now use live n8n data!')
        console.log('')
        console.log('Next steps:')
        console.log('1. Start your Next.js app: npm run dev')
        console.log('2. Visit: http://localhost:3000 (or 3001/3002)')
        console.log('3. Test the full system: node test-system-simple.js')
    } else {
        console.log('')
        console.log('⚠️  Some webhooks still need attention.')
        console.log('💡 Please check the n8n dashboard and ensure all workflows are:')
        console.log('   - Active (toggle switch ON)')
        console.log('   - Set to Production URL mode (not Test URL)')
        console.log('   - Saved after any changes')
        console.log('')
        console.log('Then run this test again: node test-workflows.js')
    }
    
    return results
}

testAllWebhooks()

