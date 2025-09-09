#!/usr/bin/env node

/**
 * Automated Manual Guide for n8n Webhook Configuration
 * This script provides step-by-step automation guidance
 */

const axios = require('axios')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function automatedManualGuide() {
    console.log('🤖 Automated Manual Guide for n8n Webhook Configuration')
    console.log('=======================================================')
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
        
        // Generate direct links to each workflow
        console.log('🔗 Direct Links to Workflow Editors:')
        alexWorkflows.forEach((workflow, index) => {
            const webhookNodes = workflow.nodes.filter(node => 
                node.type === 'n8n-nodes-base.webhook'
            )
            
            webhookNodes.forEach(node => {
                const path = node.parameters?.path
                if (path) {
                    const workflowUrl = `${N8N_URL}/workflow/${workflow.id}/webhook`
                    console.log(`   ${index + 1}. ${workflow.name} - ${path}`)
                    console.log(`      URL: ${workflowUrl}`)
                }
            })
        })
        console.log('')
        
        // Create automated browser opening script
        console.log('🚀 Creating Automated Browser Opening Script...')
        
        const browserScript = `#!/bin/bash

echo "🌐 Opening n8n Workflow Editors in Browser..."
echo "============================================="
echo ""

# Open each workflow editor
${alexWorkflows.map((workflow, index) => {
            const webhookNodes = workflow.nodes.filter(node => 
                node.type === 'n8n-nodes-base.webhook'
            )
            
            return webhookNodes.map(node => {
                const path = node.parameters?.path
                if (path) {
                    return `echo "Opening ${workflow.name} - ${path}..."\nopen "${N8N_URL}/workflow/${workflow.id}/webhook"`
                }
                return ''
            }).filter(Boolean).join('\n')
        }).join('\n')}

echo ""
echo "✅ All workflow editors opened!"
echo ""
echo "📋 Manual Steps Required:"
echo "1. For each opened workflow:"
echo "   - Click 'Production URL' button (instead of 'Test URL')"
echo "   - Save the workflow (Ctrl+S or click Save)"
echo "   - Verify the URL shows: https://n8n.pbradygeorgen.com/webhook/[path]"
echo ""
echo "2. After completing all 4 workflows, run:"
echo "   node test-workflows.js"
echo ""
echo "3. If successful, run:"
echo "   node test-system-simple.js"
`
        
        // Write the browser script
        require('fs').writeFileSync('open-workflow-editors.sh', browserScript)
        
        console.log('✅ Created: open-workflow-editors.sh')
        console.log('')
        
        // Create a comprehensive test script
        const testScript = `#!/usr/bin/env node

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
            console.log(\`🔍 Testing: \${endpoint.name} (\${endpoint.path})\`)
            
            const response = await axios.post(\`\${N8N_URL}/webhook/\${endpoint.path}\`, {
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
            
            console.log(\`✅ \${endpoint.name}: Working (\${response.status})\`)
            if (response.data) {
                console.log(\`   Response: \${JSON.stringify(response.data).substring(0, 100)}...\`)
            }
            successCount++
            results.push({ endpoint: endpoint.name, status: 'success', response: response.status })
            
        } catch (error) {
            if (error.response) {
                console.log(\`❌ \${endpoint.name}: \${error.response.status} - \${error.response.data?.message || error.message}\`)
                results.push({ endpoint: endpoint.name, status: 'error', error: error.response.data?.message || error.message })
            } else {
                console.log(\`❌ \${endpoint.name}: \${error.message}\`)
                results.push({ endpoint: endpoint.name, status: 'error', error: error.message })
            }
        }
    }
    
    console.log('')
    console.log('📊 Test Results Summary')
    console.log('======================')
    console.log(\`✅ Successful: \${successCount}/\${endpoints.length}\`)
    console.log(\`❌ Failed: \${endpoints.length - successCount}/\${endpoints.length}\`)
    
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
`
        
        // Write the test script
        require('fs').writeFileSync('test-workflows.js', testScript)
        
        console.log('✅ Created: test-workflows.js')
        console.log('')
        
        // Make scripts executable
        require('child_process').execSync('chmod +x open-workflow-editors.sh test-workflows.js')
        
        console.log('🎯 AUTOMATION COMPLETE!')
        console.log('=======================')
        console.log('')
        console.log('📋 What was created:')
        console.log('1. open-workflow-editors.sh - Opens all workflow editors in browser')
        console.log('2. test-workflows.js - Tests all webhook endpoints')
        console.log('')
        console.log('🚀 NEXT STEPS:')
        console.log('1. Run: ./open-workflow-editors.sh')
        console.log('2. Follow the manual steps in each opened workflow')
        console.log('3. Run: node test-workflows.js')
        console.log('4. If successful, run: node test-system-simple.js')
        console.log('')
        console.log('💡 This hybrid approach automates what we can and provides')
        console.log('   clear manual steps for the n8n-specific configuration.')
        
    } catch (error) {
        console.error('❌ Error:', error.message)
        if (error.response) {
            console.error('Response:', error.response.data)
        }
    }
}

automatedManualGuide()

