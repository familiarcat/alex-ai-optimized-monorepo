#!/usr/bin/env node

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
    app.post(`/webhook/${proxyPath}`, async (req, res) => {
        try {
            console.log(`🔄 Proxying ${proxyPath} -> ${n8nPath}`)
            
            // Forward request to working n8n webhook
            const response = await axios.post(`${N8N_URL}/webhook/llm-collaboration`, {
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
            
            console.log(`✅ ${proxyPath}: ${response.status}`)
            res.status(response.status).json(response.data)
            
        } catch (error) {
            console.log(`❌ ${proxyPath}: ${error.message}`)
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
    console.log(`🚀 n8n Webhook Proxy Server running on port ${PORT}`)
    console.log(`📡 Proxying endpoints:`)
    Object.entries(proxyEndpoints).forEach(([proxy, n8n]) => {
        console.log(`   /webhook/${proxy} -> n8n/${n8n}`)
    })
    console.log(`\n🔗 Health check: http://localhost:${PORT}/health`)
})

module.exports = app
