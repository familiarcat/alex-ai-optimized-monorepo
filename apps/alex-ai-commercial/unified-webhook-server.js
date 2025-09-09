#!/usr/bin/env node

/**
 * Unified Webhook Server
 * Combines local Flask server + n8n proxy for complete functionality
 */

const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
const PORT = 8002

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const N8N_URL = process.env.N8N_URL
const N8N_API_KEY = process.env.N8N_API_KEY

// Middleware
app.use(cors())
app.use(express.json())

// Mock data (fallback)
const mockJobOpportunities = [
    {
        id: 1,
        company: "TechCorp AI",
        position: "Senior AI Engineer",
        location: "San Francisco, CA",
        salary: "$120,000 - $180,000",
        description: "Lead AI development projects",
        requirements: "Python, Machine Learning, AI/ML",
        work_life_balance: "Flexible hours, remote options, work-life balance focus",
        alex_ai_score: 95,
        company_type: "AI/ML",
        company_size: "Startup"
    },
    {
        id: 2,
        company: "DataFlow Systems",
        position: "Machine Learning Engineer",
        location: "New York, NY",
        salary: "$110,000 - $160,000",
        description: "Build ML pipelines and models",
        requirements: "Python, TensorFlow, Data Science",
        work_life_balance: "Remote work, flexible schedule",
        alex_ai_score: 92,
        company_type: "Data Science",
        company_size: "Mid-size"
    }
]

const mockContacts = [
    {
        id: 1,
        name: "Sarah Johnson",
        title: "VP of Engineering",
        company: "TechCorp AI",
        email: "sarah.johnson@techcorp.ai",
        phone: "+1-555-0123",
        linkedin: "https://linkedin.com/in/sarahjohnson"
    },
    {
        id: 2,
        name: "Mike Chen",
        title: "Head of Data Science",
        company: "DataFlow Systems",
        email: "mike.chen@dataflow.com",
        phone: "+1-555-0456",
        linkedin: "https://linkedin.com/in/mikechen"
    }
]

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'unified-webhook-server',
        timestamp: new Date().toISOString()
    })
})

// Job Opportunities endpoint
app.post('/webhook/alex-ai-job-opportunities', async (req, res) => {
    try {
        console.log('🔄 Job Opportunities request received')
        
        // Try n8n first
        try {
            const n8nResponse = await axios.post(`${N8N_URL}/webhook/llm-collaboration`, {
                ...req.body,
                endpoint: 'job-opportunities',
                timestamp: new Date().toISOString()
            }, {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            })
            
            console.log('✅ n8n response received')
            return res.json(n8nResponse.data)
        } catch (n8nError) {
            console.log('⚠️  n8n failed, using mock data')
            console.log(`   Error: ${n8nError.message}`)
        }
        
        // Fallback to mock data
        res.json({
            success: true,
            data: mockJobOpportunities,
            source: 'mock_data',
            timestamp: new Date().toISOString()
        })
        
    } catch (error) {
        console.log(`❌ Job Opportunities error: ${error.message}`)
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        })
    }
})

// Resume Analysis endpoint
app.post('/webhook/alex-ai-resume-analysis', async (req, res) => {
    try {
        console.log('🔄 Resume Analysis request received')
        
        // Try n8n first
        try {
            const n8nResponse = await axios.post(`${N8N_URL}/webhook/llm-collaboration`, {
                ...req.body,
                endpoint: 'resume-analysis',
                timestamp: new Date().toISOString()
            }, {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            })
            
            console.log('✅ n8n response received')
            return res.json(n8nResponse.data)
        } catch (n8nError) {
            console.log('⚠️  n8n failed, using mock data')
        }
        
        // Fallback to mock analysis
        res.json({
            success: true,
            data: {
                skills: ["Python", "Machine Learning", "AI/ML", "Data Science"],
                experience: "5+ years in AI/ML",
                education: "MS Computer Science",
                analysis: "Strong technical background with AI/ML expertise"
            },
            source: 'mock_data',
            timestamp: new Date().toISOString()
        })
        
    } catch (error) {
        console.log(`❌ Resume Analysis error: ${error.message}`)
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        })
    }
})

// MCP Request endpoint
app.post('/webhook/alex-ai-mcp-request', async (req, res) => {
    try {
        console.log('🔄 MCP Request received')
        
        // Try n8n first
        try {
            const n8nResponse = await axios.post(`${N8N_URL}/webhook/llm-collaboration`, {
                ...req.body,
                endpoint: 'mcp-request',
                timestamp: new Date().toISOString()
            }, {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            })
            
            console.log('✅ n8n response received')
            return res.json(n8nResponse.data)
        } catch (n8nError) {
            console.log('⚠️  n8n failed, using mock data')
        }
        
        // Fallback to mock MCP response
        res.json({
            success: true,
            data: {
                mcp_response: "MCP request processed successfully",
                context: "AI-powered job matching context",
                recommendations: "Based on your profile, we recommend focusing on AI/ML roles"
            },
            source: 'mock_data',
            timestamp: new Date().toISOString()
        })
        
    } catch (error) {
        console.log(`❌ MCP Request error: ${error.message}`)
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        })
    }
})

// Contacts endpoint
app.post('/webhook/alex-ai-contacts', async (req, res) => {
    try {
        console.log('🔄 Contacts request received')
        
        // Try n8n first
        try {
            const n8nResponse = await axios.post(`${N8N_URL}/webhook/llm-collaboration`, {
                ...req.body,
                endpoint: 'contacts',
                timestamp: new Date().toISOString()
            }, {
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            })
            
            console.log('✅ n8n response received')
            return res.json(n8nResponse.data)
        } catch (n8nError) {
            console.log('⚠️  n8n failed, using mock data')
        }
        
        // Fallback to mock contacts
        res.json({
            success: true,
            data: mockContacts,
            source: 'mock_data',
            timestamp: new Date().toISOString()
        })
        
    } catch (error) {
        console.log(`❌ Contacts error: ${error.message}`)
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        })
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Unified Webhook Server running on port ${PORT}`)
    console.log(`📡 Available endpoints:`)
    console.log(`   POST /webhook/alex-ai-job-opportunities`)
    console.log(`   POST /webhook/alex-ai-resume-analysis`)
    console.log(`   POST /webhook/alex-ai-mcp-request`)
    console.log(`   POST /webhook/alex-ai-contacts`)
    console.log(`   GET  /health`)
    console.log(`\n🔗 Health check: http://localhost:${PORT}/health`)
    console.log(`\n💡 This server tries n8n first, falls back to mock data`)
})

module.exports = app
