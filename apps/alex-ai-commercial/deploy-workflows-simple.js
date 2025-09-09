#!/usr/bin/env node

/**
 * Simple n8n Workflow Deployment Script
 * Automatically deploys workflows and resolves conflicts
 */

const axios = require('axios')
const fs = require('fs')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function deployWorkflows() {
    console.log('🚀 Deploying n8n workflows automatically...')
    console.log('')
    
    try {
        // Step 1: Get existing workflows
        console.log('📋 Fetching existing workflows...')
        const workflowsResponse = await axios.get(`${N8N_URL}/api/v1/workflows`, {
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY,
                'Content-Type': 'application/json'
            }
        })
        
        const workflows = workflowsResponse.data.data
        console.log(`✅ Found ${workflows.length} existing workflows`)
        console.log('')
        
        // Step 2: Find and deactivate conflicting workflows
        console.log('🔍 Looking for conflicting workflows...')
        const conflictingWorkflows = workflows.filter(w => 
            w.name.includes('LLM_Democratic_Collaboration') || 
            w.name.includes('llm-collaboration') ||
            w.name.includes('LLM_Democratic_Collaboration')
        )
        
        if (conflictingWorkflows.length > 0) {
            console.log(`⚠️  Found ${conflictingWorkflows.length} conflicting workflows:`)
            conflictingWorkflows.forEach(w => console.log(`   - ${w.name} (ID: ${w.id})`))
            console.log('')
            
            console.log('🔧 Deactivating conflicting workflows...')
            for (const workflow of conflictingWorkflows) {
                try {
                    await axios.patch(`${N8N_URL}/api/v1/workflows/${workflow.id}`, {
                        active: false
                    }, {
                        headers: {
                            'X-N8N-API-KEY': N8N_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    })
                    console.log(`✅ Deactivated: ${workflow.name}`)
                } catch (error) {
                    console.log(`❌ Failed to deactivate ${workflow.name}: ${error.message}`)
                }
            }
            console.log('')
        } else {
            console.log('✅ No conflicting workflows found')
            console.log('')
        }
        
        // Step 3: Deploy new workflows
        console.log('📤 Deploying new workflows...')
        const workflowFiles = [
            'n8n-workflow-job-opportunities-optimized.json',
            'n8n-workflow-contacts-optimized.json',
            'n8n-workflow-resume-analysis-optimized.json',
            'n8n-workflow-mcp-request-optimized.json'
        ]
        
        let deployedCount = 0
        for (const file of workflowFiles) {
            if (fs.existsSync(file)) {
                try {
                    console.log(`📤 Deploying: ${file}`)
                    const workflowData = JSON.parse(fs.readFileSync(file, 'utf8'))
                    
                    const response = await axios.post(`${N8N_URL}/api/v1/workflows`, workflowData, {
                        headers: {
                            'X-N8N-API-KEY': N8N_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    })
                    
                    console.log(`✅ Deployed: ${workflowData.name}`)
                    deployedCount++
                } catch (error) {
                    console.log(`❌ Failed to deploy ${file}: ${error.message}`)
                }
            } else {
                console.log(`⚠️  File not found: ${file}`)
            }
        }
        
        console.log('')
        console.log(`🎉 Successfully deployed ${deployedCount} workflows!`)
        console.log('')
        
        // Step 4: Test endpoints
        console.log('🧪 Testing deployed endpoints...')
        const endpoints = [
            { name: 'Job Opportunities', url: '/webhook/alex-ai-job-opportunities' },
            { name: 'Contacts', url: '/webhook/alex-ai-contacts' },
            { name: 'Resume Analysis', url: '/webhook/alex-ai-resume-analysis' },
            { name: 'MCP Request', url: '/webhook/alex-ai-mcp-request' }
        ]
        
        for (const endpoint of endpoints) {
            try {
                const response = await axios.post(`${N8N_URL}${endpoint.url}`, {
                    action: 'get_all',
                    timestamp: new Date().toISOString(),
                    source: 'deployment-test'
                }, {
                    headers: {
                        'X-N8N-API-KEY': N8N_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                })
                
                if (response.status === 200) {
                    console.log(`✅ ${endpoint.name}: Working`)
                } else {
                    console.log(`⚠️  ${endpoint.name}: Status ${response.status}`)
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log(`❌ ${endpoint.name}: Not active`)
                } else {
                    console.log(`❌ ${endpoint.name}: ${error.message}`)
                }
            }
        }
        
        console.log('')
        console.log('🎉 Deployment complete!')
        console.log('')
        console.log('📋 Next steps:')
        console.log('  1. Check n8n dashboard: https://n8n.pbradygeorgen.com')
        console.log('  2. Verify all workflows are active')
        console.log('  3. Run: node test-system-simple.js')
        console.log('')
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message)
        if (error.response) {
            console.error('Response:', error.response.data)
        }
        process.exit(1)
    }
}

// Run deployment
deployWorkflows()

