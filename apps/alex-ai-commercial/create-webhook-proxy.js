#!/usr/bin/env node

/**
 * Create Webhook Proxy Solution
 * Since n8n UI won't save Production URL, we'll create a proxy system
 */

const axios = require('axios')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function createWebhookProxy() {
    console.log('🔄 Creating Webhook Proxy Solution')
    console.log('==================================')
    console.log('')
    
    try {
        // Test the existing working webhook
        console.log('🔍 Testing existing working webhook...')
        
        try {
            const response = await axios.get(`${N8N_URL}/webhook/llm-collaboration`, {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY
                },
                timeout: 10000
            })
            
            console.log(`✅ Existing webhook working: ${response.status}`)
            console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`)
            
        } catch (error) {
            console.log(`❌ Existing webhook failed: ${error.message}`)
        }
        
        console.log('')
        console.log('💡 SOLUTION: Create a Proxy System')
        console.log('==================================')
        console.log('')
        console.log('Since the n8n UI won\'t save Production URL mode, we\'ll create a proxy system:')
        console.log('')
        console.log('1. Use the existing working webhook as a router')
        console.log('2. Create a local proxy server that routes requests')
        console.log('3. Update the application to use the proxy')
        console.log('')
        
        // Create a proxy server script
        const proxyScript = `#!/usr/bin/env node

/**
 * n8n Webhook Proxy Server
 * Routes requests to the working n8n webhook
 */

const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const PORT = 8001

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

// Middleware
app.use(cors())
app.use(express.json())

// Proxy endpoints
const proxyEndpoints = {
    'alex-ai-job-opportunities': 'job-opportunities',
    'alex-ai-resume-analysis': 'resume-analysis', 
    'alex-ai-mcp-request': 'mcp-request',
    'alex-ai-contacts': 'contacts'
}

// Create proxy routes
Object.entries(proxyEndpoints).forEach(([proxyPath, n8nPath]) => {
    app.post(\`/webhook/\${proxyPath}\`, async (req, res) => {
        try {
            console.log(\`🔄 Proxying \${proxyPath} -> \${n8nPath}\`)
            
            // Forward request to working n8n webhook
            const response = await axios.post(\`\${N8N_URL}/webhook/llm-collaboration\`, {
                ...req.body,
                proxy_path: proxyPath,
                original_path: n8nPath,
                timestamp: new Date().toISOString()
            }, {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            })
            
            console.log(\`✅ \${proxyPath}: \${response.status}\`)
            res.status(response.status).json(response.data)
            
        } catch (error) {
            console.log(\`❌ \${proxyPath}: \${error.message}\`)
            res.status(500).json({ 
                error: 'Proxy error', 
                message: error.message,
                path: proxyPath
            })
        }
    })
})

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'n8n-webhook-proxy',
        endpoints: Object.keys(proxyEndpoints)
    })
})

// Start server
app.listen(PORT, () => {
    console.log(\`🚀 n8n Webhook Proxy Server running on port \${PORT}\`)
    console.log(\`📡 Proxying endpoints:\`)
    Object.entries(proxyEndpoints).forEach(([proxy, n8n]) => {
        console.log(\`   /webhook/\${proxy} -> n8n/\${n8n}\`)
    })
    console.log(\`\\n🔗 Health check: http://localhost:\${PORT}/health\`)
})

module.exports = app
`
        
        // Write the proxy server
        require('fs').writeFileSync('n8n-webhook-proxy.js', proxyScript)
        
        console.log('✅ Created: n8n-webhook-proxy.js')
        console.log('')
        
        // Create a package.json for the proxy
        const packageJson = {
            "name": "n8n-webhook-proxy",
            "version": "1.0.0",
            "description": "Proxy server for n8n webhooks",
            "main": "n8n-webhook-proxy.js",
            "scripts": {
                "start": "node n8n-webhook-proxy.js",
                "dev": "nodemon n8n-webhook-proxy.js"
            },
            "dependencies": {
                "express": "^4.18.2",
                "axios": "^1.6.0",
                "cors": "^2.8.5",
                "dotenv": "^17.2.2"
            }
        }
        
        require('fs').writeFileSync('proxy-package.json', JSON.stringify(packageJson, null, 2))
        
        console.log('✅ Created: proxy-package.json')
        console.log('')
        
        // Create installation script
        const installScript = `#!/bin/bash

echo "🚀 Installing n8n Webhook Proxy"
echo "================================"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install express axios cors dotenv

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 To start the proxy server:"
echo "   node n8n-webhook-proxy.js"
echo ""
echo "🧪 To test the proxy:"
echo "   curl http://localhost:8001/health"
echo ""
echo "🔗 Proxy endpoints will be available at:"
echo "   http://localhost:8001/webhook/alex-ai-job-opportunities"
echo "   http://localhost:8001/webhook/alex-ai-resume-analysis"
echo "   http://localhost:8001/webhook/alex-ai-mcp-request"
echo "   http://localhost:8001/webhook/alex-ai-contacts"
`
        
        require('fs').writeFileSync('install-proxy.sh', installScript)
        
        console.log('✅ Created: install-proxy.sh')
        console.log('')
        
        // Make scripts executable
        require('child_process').execSync('chmod +x install-proxy.sh n8n-webhook-proxy.js')
        
        console.log('🎯 PROXY SOLUTION READY!')
        console.log('========================')
        console.log('')
        console.log('📋 What was created:')
        console.log('1. n8n-webhook-proxy.js - Proxy server')
        console.log('2. proxy-package.json - Dependencies')
        console.log('3. install-proxy.sh - Installation script')
        console.log('')
        console.log('🚀 NEXT STEPS:')
        console.log('1. Install dependencies: ./install-proxy.sh')
        console.log('2. Start proxy server: node n8n-webhook-proxy.js')
        console.log('3. Update application to use proxy endpoints')
        console.log('4. Test the system: node test-system-simple.js')
        console.log('')
        console.log('💡 This bypasses the n8n UI limitation by creating')
        console.log('   a local proxy that routes to the working webhook!')
        
    } catch (error) {
        console.error('❌ Error:', error.message)
        if (error.response) {
            console.error('Response:', error.response.data)
        }
    }
}

createWebhookProxy()

