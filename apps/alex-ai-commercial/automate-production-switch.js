#!/usr/bin/env node

/**
 * Automate Switching n8n Workflows from Test URL to Production URL
 */

const axios = require('axios')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function switchToProductionUrls() {
    console.log('🚀 Automating n8n Workflow Production URL Switch')
    console.log('================================================')
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
        console.log(`📋 Found ${workflows.length} workflows`)
        console.log('')
        
        // Find our Alex AI workflows
        const alexWorkflows = workflows.filter(w => 
            w.name.includes('Alex AI') && w.name.includes('Production')
        )
        
        console.log('🎯 Alex AI Production Workflows Found:')
        alexWorkflows.forEach(workflow => {
            console.log(`   - ${workflow.name} (ID: ${workflow.id})`)
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
                
                // Find webhook nodes and update them to production mode
                let updated = false
                const updatedNodes = workflowData.nodes.map(node => {
                    if (node.type === 'n8n-nodes-base.webhook') {
                        console.log(`   📡 Found webhook node: ${node.name}`)
                        
                        // Check if it's currently in test mode
                        const currentPath = node.parameters?.path
                        const isTestMode = node.parameters?.testMode || false
                        
                        if (isTestMode || !node.parameters?.productionUrl) {
                            console.log(`   🔄 Switching from test to production mode`)
                            
                            // Update webhook parameters for production
                            const updatedNode = {
                                ...node,
                                parameters: {
                                    ...node.parameters,
                                    testMode: false,
                                    productionUrl: `${N8N_URL}/webhook/${currentPath}`,
                                    // Ensure the webhook is properly configured for production
                                    httpMethod: node.parameters?.httpMethod || 'POST',
                                    path: currentPath,
                                    authentication: node.parameters?.authentication || 'none',
                                    respondWith: node.parameters?.respondWith || 'respondToWebhook'
                                }
                            }
                            
                            updated = true
                            return updatedNode
                        } else {
                            console.log(`   ✅ Already in production mode`)
                            return node
                        }
                    }
                    return node
                })
                
                if (updated) {
                    // Update the workflow with the modified nodes
                    const updatePayload = {
                        ...workflowData,
                        nodes: updatedNodes,
                        active: true // Ensure it's active
                    }
                    
                    const updateResponse = await axios.put(`${N8N_URL}/api/v1/workflows/${workflow.id}`, updatePayload, {
                        headers: {
                            'X-N8N-API-KEY': N8N_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    })
                    
                    if (updateResponse.status === 200) {
                        console.log(`   ✅ Successfully updated to production mode`)
                    } else {
                        console.log(`   ⚠️  Update response: ${updateResponse.status}`)
                    }
                } else {
                    console.log(`   ℹ️  No changes needed`)
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
        console.log('🧪 Testing Production Webhook Endpoints...')
        
        // Test each webhook endpoint
        const testResults = []
        for (const workflow of alexWorkflows) {
            const webhookNodes = workflow.nodes.filter(node => 
                node.type === 'n8n-nodes-base.webhook'
            )
            
            for (const node of webhookNodes) {
                const path = node.parameters?.path
                const method = node.parameters?.httpMethod || 'POST'
                
                if (path) {
                    console.log(`\n🔍 Testing: ${method} /webhook/${path}`)
                    
                    try {
                        const response = await axios.post(`${N8N_URL}/webhook/${path}`, {
                            action: 'get_all',
                            timestamp: new Date().toISOString(),
                            source: 'automated_test'
                        }, {
                            headers: {
                                'X-N8N-API-KEY': N8N_API_KEY,
                                'Content-Type': 'application/json'
                            },
                            timeout: 15000
                        })
                        
                        console.log(`✅ ${path}: Working (${response.status})`)
                        if (response.data) {
                            console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`)
                        }
                        testResults.push({ path, status: 'success', response: response.status })
                    } catch (error) {
                        if (error.response) {
                            console.log(`❌ ${path}: ${error.response.status} - ${error.response.data?.message || error.message}`)
                            testResults.push({ path, status: 'error', error: error.response.data?.message || error.message })
                        } else {
                            console.log(`❌ ${path}: ${error.message}`)
                            testResults.push({ path, status: 'error', error: error.message })
                        }
                    }
                }
            }
        }
        
        console.log('')
        console.log('📊 Test Results Summary')
        console.log('======================')
        const successCount = testResults.filter(r => r.status === 'success').length
        const totalCount = testResults.length
        console.log(`✅ Successful: ${successCount}/${totalCount}`)
        console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`)
        
        if (successCount === totalCount) {
            console.log('')
            console.log('🎉 All webhooks are now working in production mode!')
            console.log('🚀 Your Alex AI Job Search application can now use live n8n data!')
        } else {
            console.log('')
            console.log('⚠️  Some webhooks still need attention.')
            console.log('💡 You may need to manually check the webhook configurations in the n8n dashboard.')
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message)
        if (error.response) {
            console.error('Response:', error.response.data)
        }
    }
}

switchToProductionUrls()

