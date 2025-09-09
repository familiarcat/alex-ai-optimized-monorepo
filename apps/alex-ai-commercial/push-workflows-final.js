#!/usr/bin/env node

/**
 * Final n8n Workflow Push Script
 * Pushes workflows with correct n8n API format (no active field)
 */

const axios = require('axios')
const fs = require('fs')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

// Create workflow format that n8n API accepts
function createWorkflow(name, webhookPath) {
    return {
        name: name,
        nodes: [
            {
                parameters: {
                    httpMethod: "POST",
                    path: webhookPath,
                    responseMode: "responseNode",
                    options: {}
                },
                id: "webhook-trigger",
                name: "Webhook Trigger",
                type: "n8n-nodes-base.webhook",
                typeVersion: 1,
                position: [240, 300]
            },
            {
                parameters: {
                    respondWith: "json",
                    responseBody: `={{ { "data": [], "total": 0, "message": "${name} endpoint working", "timestamp": new Date().toISOString() } }}`
                },
                id: "respond-success",
                name: "Respond Success",
                type: "n8n-nodes-base.respondToWebhook",
                typeVersion: 1,
                position: [460, 300]
            }
        ],
        connections: {
            "Webhook Trigger": {
                "main": [
                    [
                        {
                            "node": "Respond Success",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        settings: {
            executionOrder: "v1"
        }
    }
}

async function pushWorkflowsToN8N() {
    console.log('🚀 Pushing Workflows to n8n.pbradygeorgen.com (Final Version)')
    console.log('=============================================================')
    console.log('')
    
    try {
        // Step 1: Verify n8n connectivity
        console.log('🔗 Testing n8n connectivity...')
        const healthResponse = await axios.get(`${N8N_URL}/health`, {
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        })
        
        if (healthResponse.status === 200) {
            console.log('✅ n8n connection successful')
        } else {
            throw new Error(`n8n health check failed: ${healthResponse.status}`)
        }
        console.log('')
        
        // Step 2: Create workflows
        console.log('📋 Creating workflows...')
        const workflows = [
            {
                name: "Alex AI Job Opportunities - Production",
                webhookPath: "alex-ai-job-opportunities"
            },
            {
                name: "Alex AI Contacts - Production", 
                webhookPath: "alex-ai-contacts"
            },
            {
                name: "Alex AI Resume Analysis - Production",
                webhookPath: "alex-ai-resume-analysis"
            },
            {
                name: "Alex AI MCP Request Handler - Production",
                webhookPath: "alex-ai-mcp-request"
            }
        ]
        
        console.log('✅ Created 4 workflows')
        console.log('')
        
        // Step 3: Push workflows
        console.log('📤 Pushing workflows to n8n...')
        const pushedWorkflows = []
        let successCount = 0
        
        for (const workflowConfig of workflows) {
            try {
                console.log(`📤 Pushing: ${workflowConfig.name}`)
                const workflowData = createWorkflow(workflowConfig.name, workflowConfig.webhookPath)
                
                const response = await axios.post(`${N8N_URL}/api/v1/workflows`, workflowData, {
                    headers: {
                        'X-N8N-API-KEY': N8N_API_KEY,
                        'Content-Type': 'application/json'
                    }
                })
                
                if (response.data && response.data.id) {
                    console.log(`✅ Pushed: ${workflowConfig.name} (ID: ${response.data.id})`)
                    pushedWorkflows.push({
                        name: workflowConfig.name,
                        id: response.data.id,
                        webhookPath: workflowConfig.webhookPath,
                        status: 'pushed',
                        url: `https://n8n.pbradygeorgen.com/workflow/${response.data.id}`
                    })
                    successCount++
                } else {
                    console.log(`⚠️  ${workflowConfig.name}: Pushed but no ID returned`)
                    pushedWorkflows.push({
                        name: workflowConfig.name,
                        id: 'unknown',
                        webhookPath: workflowConfig.webhookPath,
                        status: 'pushed-no-id'
                    })
                }
            } catch (error) {
                console.log(`❌ Failed to push ${workflowConfig.name}: ${error.message}`)
                if (error.response && error.response.data) {
                    console.log(`   Error details: ${JSON.stringify(error.response.data)}`)
                }
                pushedWorkflows.push({
                    name: workflowConfig.name,
                    id: 'failed',
                    webhookPath: workflowConfig.webhookPath,
                    status: 'failed',
                    error: error.message
                })
            }
            console.log('')
        }
        
        // Step 4: Create activation summary
        console.log('📊 Push Results Summary')
        console.log('=======================')
        console.log(`Successfully pushed: ${successCount}/${workflows.length} workflows`)
        console.log('')
        
        console.log('📋 Workflow Status:')
        pushedWorkflows.forEach(workflow => {
            const statusIcon = workflow.status === 'pushed' ? '✅' : 
                              workflow.status === 'pushed-no-id' ? '⚠️' : '❌'
            console.log(`${statusIcon} ${workflow.name}: ${workflow.status}`)
            if (workflow.id && workflow.id !== 'failed') {
                console.log(`   ID: ${workflow.id}`)
                console.log(`   Webhook: /webhook/${workflow.webhookPath}`)
                if (workflow.url) {
                    console.log(`   URL: ${workflow.url}`)
                }
            }
            if (workflow.error) {
                console.log(`   Error: ${workflow.error}`)
            }
        })
        console.log('')
        
        // Step 5: Create activation instructions
        console.log('🎯 Next Steps for Manual Activation')
        console.log('===================================')
        console.log('')
        console.log('1. Go to n8n dashboard: https://n8n.pbradygeorgen.com')
        console.log('')
        console.log('2. Find the newly pushed workflows:')
        pushedWorkflows.filter(w => w.status === 'pushed').forEach(workflow => {
            console.log(`   - ${workflow.name} (ID: ${workflow.id})`)
            console.log(`     Webhook: https://n8n.pbradygeorgen.com/webhook/${workflow.webhookPath}`)
            console.log(`     Direct link: ${workflow.url}`)
        })
        console.log('')
        console.log('3. If there are conflicting workflows, deactivate them first:')
        console.log('   - Look for any workflows using conflicting webhook paths')
        console.log('   - Deactivate them by toggling their switches OFF')
        console.log('')
        console.log('4. Activate the new workflows:')
        console.log('   - Toggle each new workflow switch to ON')
        console.log('   - Verify they show "Active" status')
        console.log('')
        console.log('5. Test the endpoints:')
        console.log('   node test-workflows.js')
        console.log('')
        
        // Step 6: Save push results
        const pushResults = {
            timestamp: new Date().toISOString(),
            n8nUrl: N8N_URL,
            totalWorkflows: workflows.length,
            successfulPushes: successCount,
            workflows: pushedWorkflows
        }
        
        fs.writeFileSync('n8n-push-results.json', JSON.stringify(pushResults, null, 2))
        console.log('💾 Push results saved to: n8n-push-results.json')
        console.log('')
        
        if (successCount > 0) {
            console.log('🎉 Workflows successfully pushed to n8n!')
            console.log('✅ Ready for manual activation in the dashboard')
            console.log('')
            console.log('🔗 Direct links to workflows:')
            pushedWorkflows.filter(w => w.status === 'pushed').forEach(workflow => {
                console.log(`   ${workflow.url}`)
            })
        } else {
            console.log('⚠️  No workflows were successfully pushed')
            console.log('📋 Check the error messages above for details')
        }
        
    } catch (error) {
        console.error('❌ Push failed:', error.message)
        if (error.response) {
            console.error('Response status:', error.response.status)
            console.error('Response data:', error.response.data)
        }
        process.exit(1)
    }
}

// Run the push
pushWorkflowsToN8N()

