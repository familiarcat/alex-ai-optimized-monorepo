#!/usr/bin/env node

/**
 * Force Production Activation of n8n Workflows
 * Alternative approach using direct webhook testing and activation
 */

const axios = require('axios')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function forceProductionActivation() {
    console.log('🚀 Force Production Activation of n8n Workflows')
    console.log('===============================================')
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
        
        console.log('🎯 Alex AI Production Workflows:')
        alexWorkflows.forEach(workflow => {
            console.log(`   - ${workflow.name} (ID: ${workflow.id}) - ${workflow.active ? 'ACTIVE' : 'INACTIVE'}`)
        })
        console.log('')
        
        // Try to trigger each workflow to force activation
        console.log('🔄 Attempting to trigger workflows to force activation...')
        
        for (const workflow of alexWorkflows) {
            try {
                console.log(`\n🔧 Triggering: ${workflow.name}`)
                
                // Find webhook nodes
                const webhookNodes = workflow.nodes.filter(node => 
                    node.type === 'n8n-nodes-base.webhook'
                )
                
                for (const node of webhookNodes) {
                    const path = node.parameters?.path
                    const method = node.parameters?.httpMethod || 'POST'
                    
                    if (path) {
                        console.log(`   📡 Testing webhook: ${method} /webhook/${path}`)
                        
                        try {
                            // Try to trigger the webhook
                            const response = await axios.post(`${N8N_URL}/webhook/${path}`, {
                                action: 'activate',
                                timestamp: new Date().toISOString(),
                                source: 'force_activation',
                                workflow_id: workflow.id,
                                workflow_name: workflow.name
                            }, {
                                headers: {
                                    'X-N8N-API-KEY': N8N_API_KEY,
                                    'Content-Type': 'application/json'
                                },
                                timeout: 10000
                            })
                            
                            console.log(`   ✅ ${path}: Triggered successfully (${response.status})`)
                            
                        } catch (error) {
                            if (error.response) {
                                console.log(`   ❌ ${path}: ${error.response.status} - ${error.response.data?.message || error.message}`)
                                
                                // If it's a 404, try to activate the workflow first
                                if (error.response.status === 404) {
                                    console.log(`   🔄 Attempting to activate workflow...`)
                                    
                                    try {
                                        // Try to activate the workflow
                                        const activateResponse = await axios.post(`${N8N_URL}/api/v1/workflows/${workflow.id}/activate`, {}, {
                                            headers: {
                                                'X-N8N-API-KEY': N8N_API_KEY,
                                                'Content-Type': 'application/json'
                                            }
                                        })
                                        
                                        if (activateResponse.status === 200) {
                                            console.log(`   ✅ Workflow activated successfully`)
                                            
                                            // Wait a moment and try the webhook again
                                            await new Promise(resolve => setTimeout(resolve, 2000))
                                            
                                            const retryResponse = await axios.post(`${N8N_URL}/webhook/${path}`, {
                                                action: 'test',
                                                timestamp: new Date().toISOString(),
                                                source: 'retry_after_activation'
                                            }, {
                                                headers: {
                                                    'X-N8N-API-KEY': N8N_API_KEY,
                                                    'Content-Type': 'application/json'
                                                },
                                                timeout: 10000
                                            })
                                            
                                            console.log(`   ✅ ${path}: Now working after activation (${retryResponse.status})`)
                                        }
                                    } catch (activateError) {
                                        console.log(`   ❌ Failed to activate workflow: ${activateError.message}`)
                                    }
                                }
                            } else {
                                console.log(`   ❌ ${path}: ${error.message}`)
                            }
                        }
                    }
                }
                
            } catch (error) {
                console.log(`   ❌ Error processing ${workflow.name}: ${error.message}`)
            }
        }
        
        console.log('')
        console.log('⏳ Waiting 5 seconds for webhook registration...')
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        console.log('')
        console.log('🧪 Final Test of All Webhook Endpoints...')
        
        // Final comprehensive test
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
                    source: 'final_test'
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
                
            } catch (error) {
                if (error.response) {
                    console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.data?.message || error.message}`)
                } else {
                    console.log(`❌ ${endpoint.name}: ${error.message}`)
                }
            }
        }
        
        console.log('')
        console.log('📊 Final Results')
        console.log('================')
        console.log(`✅ Working: ${successCount}/${testEndpoints.length}`)
        console.log(`❌ Failed: ${testEndpoints.length - successCount}/${testEndpoints.length}`)
        
        if (successCount === testEndpoints.length) {
            console.log('')
            console.log('🎉 SUCCESS! All webhooks are now working!')
            console.log('🚀 Your Alex AI Job Search application can now use live n8n data!')
            console.log('')
            console.log('Next steps:')
            console.log('1. Test your application: node test-system-simple.js')
            console.log('2. Start your Next.js app: npm run dev')
            console.log('3. Visit: http://localhost:3000 (or 3001/3002)')
        } else {
            console.log('')
            console.log('⚠️  Some webhooks still need manual configuration.')
            console.log('💡 Please check the n8n dashboard and ensure all workflows are:')
            console.log('   - Active (toggle switch ON)')
            console.log('   - Set to Production URL mode (not Test URL)')
            console.log('   - Saved after any changes')
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message)
        if (error.response) {
            console.error('Response:', error.response.data)
        }
    }
}

forceProductionActivation()

