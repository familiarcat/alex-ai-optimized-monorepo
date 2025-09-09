#!/usr/bin/env node

/**
 * Check Actual Webhook URLs from n8n Workflows
 */

const axios = require('axios')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function checkWebhookUrls() {
    console.log('🔍 Checking Actual Webhook URLs from n8n Workflows')
    console.log('==================================================')
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
            console.log(`\n📋 ${workflow.name} (ID: ${workflow.id})`)
            console.log(`   Status: ${workflow.active ? 'ACTIVE' : 'INACTIVE'}`)
            
            // Find webhook nodes
            const webhookNodes = workflow.nodes.filter(node => 
                node.type === 'n8n-nodes-base.webhook'
            )
            
            webhookNodes.forEach(node => {
                const path = node.parameters?.path || 'unknown'
                const method = node.parameters?.httpMethod || 'POST'
                console.log(`   Webhook: ${method} /webhook/${path}`)
                console.log(`   Full URL: ${N8N_URL}/webhook/${path}`)
            })
        })
        
        console.log('')
        console.log('🧪 Testing Actual Webhook URLs...')
        
        // Test each webhook
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
                            source: 'test'
                        }, {
                            headers: {
                                'X-N8N-API-KEY': N8N_API_KEY,
                                'Content-Type': 'application/json'
                            },
                            timeout: 10000
                        })
                        
                        console.log(`✅ ${path}: Working (${response.status})`)
                        if (response.data) {
                            console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`)
                        }
                    } catch (error) {
                        if (error.response) {
                            console.log(`❌ ${path}: ${error.response.status} - ${error.response.data?.message || error.message}`)
                        } else {
                            console.log(`❌ ${path}: ${error.message}`)
                        }
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message)
        if (error.response) {
            console.error('Response:', error.response.data)
        }
    }
}

checkWebhookUrls()

