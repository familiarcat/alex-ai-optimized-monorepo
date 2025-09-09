#!/usr/bin/env node

/**
 * Activate n8n Workflows Programmatically
 */

const axios = require('axios')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function activateWorkflows() {
    console.log('🔧 Activating n8n Workflows Programmatically')
    console.log('============================================')
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
        
        // Activate each workflow
        console.log('🔧 Activating workflows...')
        for (const workflow of alexWorkflows) {
            try {
                console.log(`🔧 Activating: ${workflow.name}`)
                
                const response = await axios.patch(`${N8N_URL}/api/v1/workflows/${workflow.id}`, {
                    active: true
                }, {
                    headers: {
                        'X-N8N-API-KEY': N8N_API_KEY,
                        'Content-Type': 'application/json'
                    }
                })
                
                if (response.status === 200) {
                    console.log(`✅ Activated: ${workflow.name}`)
                } else {
                    console.log(`⚠️  ${workflow.name}: Status ${response.status}`)
                }
            } catch (error) {
                console.log(`❌ Failed to activate ${workflow.name}: ${error.message}`)
                if (error.response && error.response.data) {
                    console.log(`   Error details: ${JSON.stringify(error.response.data)}`)
                }
            }
        }
        
        console.log('')
        console.log('⏳ Waiting 5 seconds for webhook registration...')
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        console.log('')
        console.log('🧪 Testing webhook endpoints...')
        
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

activateWorkflows()

