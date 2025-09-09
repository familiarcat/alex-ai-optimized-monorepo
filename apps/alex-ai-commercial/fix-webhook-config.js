#!/usr/bin/env node

/**
 * Fix n8n Webhook Configuration - Bypass UI Issues
 * This script directly configures webhooks to work in production mode
 */

const axios = require('axios')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function fixWebhookConfig() {
    console.log('🔧 Fixing n8n Webhook Configuration')
    console.log('===================================')
    console.log('')
    
    try {
        // Get all workflows
        const workflowsResponse = await axios.get(`${N8N_URL}/api/v1/workflows`, {
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY,
                'Content-Type': 'application/json'
            }
        })
        
        const workflows = workflowsResponse.data.data
        
        // Find our Alex AI workflows
        const alexWorkflows = workflows.filter(w => 
            w.name.includes('Alex AI') && w.name.includes('Production')
        )
        
        console.log('🎯 Alex AI Production Workflows Found:')
        alexWorkflows.forEach((workflow, index) => {
            console.log(`   ${index + 1}. ${workflow.name} (ID: ${workflow.id})`)
        })
        console.log('')
        
        // Process each workflow
        for (const workflow of alexWorkflows) {
            try {
                console.log(`🔧 Processing: ${workflow.name}`)
                
                // Get the current workflow details
                const workflowResponse = await axios.get(`${N8N_URL}/api/v1/workflows/${workflow.id}`, {
                    headers: {
                        'X-N8N-API-KEY': N8N_API_KEY,
                        'Content-Type': 'application/json'
                    }
                })
                
                const workflowData = workflowResponse.data
                
                // Find webhook nodes and update them
                let updated = false
                const updatedNodes = workflowData.nodes.map(node => {
                    if (node.type === 'n8n-nodes-base.webhook') {
                        console.log(`   📡 Found webhook node: ${node.name}`)
                        
                        const currentPath = node.parameters?.path
                        console.log(`   🔍 Current path: ${currentPath}`)
                        
                        // Create a minimal webhook configuration that should work
                        const updatedNode = {
                            ...node,
                            parameters: {
                                httpMethod: 'POST',
                                path: currentPath,
                                authentication: 'none',
                                respondWith: 'respondToWebhook',
                                options: {}
                            }
                        }
                        
                        console.log(`   🔄 Updated webhook configuration`)
                        updated = true
                        return updatedNode
                    }
                    return node
                })
                
                if (updated) {
                    // Create a minimal update payload
                    const updatePayload = {
                        name: workflowData.name,
                        nodes: updatedNodes,
                        connections: workflowData.connections,
                        active: true,
                        settings: workflowData.settings || {}
                    }
                    
                    console.log(`   💾 Updating workflow...`)
                    
                    const updateResponse = await axios.put(`${N8N_URL}/api/v1/workflows/${workflow.id}`, updatePayload, {
                        headers: {
                            'X-N8N-API-KEY': N8N_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    })
                    
                    if (updateResponse.status === 200) {
                        console.log(`   ✅ Workflow updated successfully`)
                    } else {
                        console.log(`   ⚠️  Update response: ${updateResponse.status}`)
                    }
                } else {
                    console.log(`   ℹ️  No webhook nodes found`)
                }
                
            } catch (error) {
                console.log(`   ❌ Error processing ${workflow.name}: ${error.message}`)
                if (error.response && error.response.data) {
                    console.log(`   Error details: ${JSON.stringify(error.response.data)}`)
                }
            }
        }
        
        console.log('')
        console.log('⏳ Waiting 10 seconds for webhook registration...')
        await new Promise(resolve => setTimeout(resolve, 10000))
        
        console.log('')
        console.log('🧪 Testing Webhook Endpoints...')
        
        // Test each webhook endpoint
        const testEndpoints = [
            { name: 'Job Opportunities', path: 'alex-ai-job-opportunities' },
            { name: 'Resume Analysis', path: 'alex-ai-resume-analysis' },
            { name: 'MCP Request', path: 'alex-ai-mcp-request' },
            { name: 'Contacts', path: 'alex-ai-contacts' }
        ]
        
        let successCount = 0
        
        for (const endpoint of testEndpoints) {
            try {
                console.log(`\n🔍 Testing: ${endpoint.name} (${endpoint.path})`)
                
                const response = await axios.post(`${N8N_URL}/webhook/${endpoint.path}`, {
                    action: 'get_all',
                    timestamp: new Date().toISOString(),
                    source: 'fix_test'
                }, {
                    headers: {
                        'X-N8N-API-KEY': N8N_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                })
                
                console.log(`✅ ${endpoint.name}: Working (${response.status})`)
                if (response.data) {
                    console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`)
                }
                successCount++
                
            } catch (error) {
                if (error.response) {
                    console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.data?.message || error.message}`)
                } else {
                    console.log(`❌ ${endpoint.name}: ${error.message}`)
                }
            }
        }
        
        console.log('')
        console.log('📊 Test Results Summary')
        console.log('======================')
        console.log(`✅ Working: ${successCount}/${testEndpoints.length}`)
        console.log(`❌ Failed: ${testEndpoints.length - successCount}/${testEndpoints.length}`)
        
        if (successCount === testEndpoints.length) {
            console.log('')
            console.log('🎉 SUCCESS! All webhooks are now working!')
            console.log('🚀 Your Alex AI Job Search application can now use live n8n data!')
        } else {
            console.log('')
            console.log('⚠️  Some webhooks still need attention.')
            console.log('💡 The UI limitation might require a different approach.')
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message)
        if (error.response) {
            console.error('Response:', error.response.data)
        }
    }
}

fixWebhookConfig()

