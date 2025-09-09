const axios = require('axios')
const fs = require('fs')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function deployWorkflows() {
    console.log('🚀 Deploying n8n workflows automatically...')
    
    try {
        // Get existing workflows
        const workflowsResponse = await axios.get(`${N8N_URL}/api/v1/workflows`, {
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY,
                'Content-Type': 'application/json'
            }
        })
        
        console.log(`📋 Found ${workflowsResponse.data.data.length} existing workflows`)
        
        // Find and deactivate conflicting workflows
        const conflictingWorkflows = workflowsResponse.data.data.filter(w => 
            w.name.includes('LLM_Democratic_Collaboration') || 
            w.name.includes('llm-collaboration')
        )
        
        for (const workflow of conflictingWorkflows) {
            console.log(`🔧 Deactivating conflicting workflow: ${workflow.name}`)
            
            await axios.patch(`${N8N_URL}/api/v1/workflows/${workflow.id}`, {
                active: false
            }, {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                }
            })
            
            console.log(`✅ Deactivated: ${workflow.name}`)
        }
        
        // Deploy new workflows
        const workflowFiles = [
            'n8n-workflow-job-opportunities-optimized.json',
            'n8n-workflow-contacts-optimized.json',
            'n8n-workflow-resume-analysis-optimized.json',
            'n8n-workflow-mcp-request-optimized.json'
        ]
        
        for (const file of workflowFiles) {
            if (fs.existsSync(file)) {
                console.log(`📤 Deploying workflow: ${file}`)
                
                const workflowData = JSON.parse(fs.readFileSync(file, 'utf8'))
                
                const response = await axios.post(`${N8N_URL}/api/v1/workflows`, workflowData, {
                    headers: {
                        'X-N8N-API-KEY': N8N_API_KEY,
                        'Content-Type': 'application/json'
                    }
                })
                
                console.log(`✅ Deployed: ${workflowData.name}`)
            }
        }
        
        console.log('🎉 All workflows deployed successfully!')
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message)
        process.exit(1)
    }
}

deployWorkflows()
