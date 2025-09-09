#!/usr/bin/env node

/**
 * Automated n8n Workflow Push Script
 * Pushes workflows to n8n.pbradygeorgen.com and prepares them for activation
 */

const axios = require('axios')
const fs = require('fs')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function pushWorkflowsToN8N() {
    console.log('🚀 Pushing Workflows to n8n.pbradygeorgen.com')
    console.log('==============================================')
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
        
        // Step 2: Get existing workflows to check for conflicts
        console.log('📋 Fetching existing workflows...')
        const workflowsResponse = await axios.get(`${N8N_URL}/api/v1/workflows`, {
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY,
                'Content-Type': 'application/json'
            }
        })
        
        const existingWorkflows = workflowsResponse.data.data
        console.log(`✅ Found ${existingWorkflows.length} existing workflows`)
        console.log('')
        
        // Step 3: Check for conflicting workflows
        console.log('🔍 Checking for webhook path conflicts...')
        const conflictingWorkflows = existingWorkflows.filter(w => 
            w.name.includes('LLM_Democratic_Collaboration') && w.active
        )
        
        if (conflictingWorkflows.length > 0) {
            console.log(`⚠️  Found ${conflictingWorkflows.length} active conflicting workflows:`)
            conflictingWorkflows.forEach(w => console.log(`   - ${w.name} (ID: ${w.id})`))
            console.log('')
            console.log('🔄 These will need to be deactivated manually before activating new workflows')
            console.log('')
        } else {
            console.log('✅ No active conflicting workflows found')
            console.log('')
        }
        
        // Step 4: Push new workflows
        console.log('📤 Pushing new workflows to n8n...')
        const workflowFiles = [
            'n8n-workflow-job-opportunities-optimized.json',
            'n8n-workflow-contacts-optimized.json',
            'n8n-workflow-resume-analysis-optimized.json',
            'n8n-workflow-mcp-request-optimized.json'
        ]
        
        const pushedWorkflows = []
        let successCount = 0
        
        for (const file of workflowFiles) {
            if (fs.existsSync(file)) {
                try {
                    console.log(`📤 Pushing: ${file}`)
                    const workflowData = JSON.parse(fs.readFileSync(file, 'utf8'))
                    
                    // Add metadata to identify our workflows
                    workflowData.meta = {
                        ...workflowData.meta,
                        createdBy: 'Alex AI Job Search Automation',
                        createdAt: new Date().toISOString(),
                        version: '1.0.0',
                        source: 'automated-deployment'
                    }
                    
                    const response = await axios.post(`${N8N_URL}/api/v1/workflows`, workflowData, {
                        headers: {
                            'X-N8N-API-KEY': N8N_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    })
                    
                    if (response.data && response.data.id) {
                        console.log(`✅ Pushed: ${workflowData.name} (ID: ${response.data.id})`)
                        pushedWorkflows.push({
                            name: workflowData.name,
                            id: response.data.id,
                            file: file,
                            status: 'pushed'
                        })
                        successCount++
                    } else {
                        console.log(`⚠️  ${workflowData.name}: Pushed but no ID returned`)
                        pushedWorkflows.push({
                            name: workflowData.name,
                            id: 'unknown',
                            file: file,
                            status: 'pushed-no-id'
                        })
                    }
                } catch (error) {
                    console.log(`❌ Failed to push ${file}: ${error.message}`)
                    if (error.response && error.response.data) {
                        console.log(`   Error details: ${JSON.stringify(error.response.data)}`)
                    }
                    pushedWorkflows.push({
                        name: file,
                        id: 'failed',
                        file: file,
                        status: 'failed',
                        error: error.message
                    })
                }
            } else {
                console.log(`⚠️  File not found: ${file}`)
                pushedWorkflows.push({
                    name: file,
                    id: 'not-found',
                    file: file,
                    status: 'file-not-found'
                })
            }
            console.log('')
        }
        
        // Step 5: Create activation summary
        console.log('📊 Push Results Summary')
        console.log('=======================')
        console.log(`Successfully pushed: ${successCount}/${workflowFiles.length} workflows`)
        console.log('')
        
        console.log('📋 Workflow Status:')
        pushedWorkflows.forEach(workflow => {
            const statusIcon = workflow.status === 'pushed' ? '✅' : 
                              workflow.status === 'pushed-no-id' ? '⚠️' : '❌'
            console.log(`${statusIcon} ${workflow.name}: ${workflow.status}`)
            if (workflow.id && workflow.id !== 'failed' && workflow.id !== 'not-found') {
                console.log(`   ID: ${workflow.id}`)
            }
            if (workflow.error) {
                console.log(`   Error: ${workflow.error}`)
            }
        })
        console.log('')
        
        // Step 6: Create activation instructions
        console.log('🎯 Next Steps for Manual Activation')
        console.log('===================================')
        console.log('')
        console.log('1. Go to n8n dashboard: https://n8n.pbradygeorgen.com')
        console.log('2. Find the newly pushed workflows:')
        pushedWorkflows.filter(w => w.status === 'pushed').forEach(workflow => {
            console.log(`   - ${workflow.name} (ID: ${workflow.id})`)
        })
        console.log('')
        console.log('3. If there are conflicting workflows, deactivate them first:')
        if (conflictingWorkflows.length > 0) {
            conflictingWorkflows.forEach(w => {
                console.log(`   - ${w.name} (ID: ${w.id})`)
            })
        } else {
            console.log('   - No conflicting workflows found')
        }
        console.log('')
        console.log('4. Activate the new workflows by toggling their switches')
        console.log('5. Test the endpoints using: node test-workflows.js')
        console.log('')
        
        // Step 7: Save push results
        const pushResults = {
            timestamp: new Date().toISOString(),
            n8nUrl: N8N_URL,
            totalWorkflows: workflowFiles.length,
            successfulPushes: successCount,
            conflictingWorkflows: conflictingWorkflows.length,
            workflows: pushedWorkflows
        }
        
        fs.writeFileSync('n8n-push-results.json', JSON.stringify(pushResults, null, 2))
        console.log('💾 Push results saved to: n8n-push-results.json')
        console.log('')
        
        if (successCount > 0) {
            console.log('🎉 Workflows successfully pushed to n8n!')
            console.log('✅ Ready for manual activation in the dashboard')
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

