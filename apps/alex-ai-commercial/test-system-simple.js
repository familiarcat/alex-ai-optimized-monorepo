#!/usr/bin/env node

/**
 * Alex AI Job Search - Simple System Test
 * 
 * This script provides basic testing of the unified data architecture
 * without TypeScript dependencies.
 */

const axios = require('axios')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Configuration
const N8N_URL = process.env.N8N_URL || 'https://n8n.pbradygeorgen.com'
const N8N_API_KEY = process.env.N8N_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
}

// Utility functions
function logTest(testName, status, message = '') {
  testResults.total++
  if (status === 'PASS') {
    testResults.passed++
    console.log(`✅ ${testName}: ${message}`)
  } else {
    testResults.failed++
    console.log(`❌ ${testName}: ${message}`)
  }
  testResults.details.push({ testName, status, message })
}

function logSection(title) {
  console.log('')
  console.log(`🧪 ${title}`)
  console.log('='.repeat(title.length + 3))
}

// Test 1: Environment Variables
async function testEnvironmentVariables() {
  logSection('Environment Variables Test')
  
  const requiredVars = [
    'N8N_URL',
    'N8N_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'OPENAI_API_KEY'
  ]
  
  let allPresent = true
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      logTest(`${varName}`, 'PASS', 'Present')
    } else {
      logTest(`${varName}`, 'FAIL', 'Missing')
      allPresent = false
    }
  }
  
  if (allPresent) {
    logTest('All Environment Variables', 'PASS', 'All required variables present')
  } else {
    logTest('All Environment Variables', 'FAIL', 'Some variables missing')
  }
}

// Test 2: n8n Connectivity
async function testN8NConnectivity() {
  logSection('n8n Connectivity Test')
  
  try {
    // Test basic connectivity
    const response = await axios.get(`${N8N_URL}/health`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })
    
    if (response.status === 200) {
      logTest('n8n Health Check', 'PASS', 'Server responding')
    } else {
      logTest('n8n Health Check', 'FAIL', `Unexpected status: ${response.status}`)
    }
  } catch (error) {
    logTest('n8n Health Check', 'FAIL', error.message)
  }
  
  // Test webhook endpoints
  const endpoints = [
    'job-opportunities',
    'contacts',
    'resume-analysis',
    'mcp-request'
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.post(
        `${N8N_URL}/webhook/${endpoint}`,
        {
          action: 'get_all',
          timestamp: new Date().toISOString(),
          source: 'test-suite'
        },
        {
          headers: {
            'X-N8N-API-KEY': N8N_API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      )
      
      if (response.status === 200) {
        logTest(`n8n ${endpoint}`, 'PASS', 'Endpoint responding')
      } else {
        logTest(`n8n ${endpoint}`, 'FAIL', `Unexpected status: ${response.status}`)
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        logTest(`n8n ${endpoint}`, 'FAIL', 'Workflow not active')
      } else {
        logTest(`n8n ${endpoint}`, 'FAIL', error.message)
      }
    }
  }
}

// Test 3: Application Build
async function testApplicationBuild() {
  logSection('Application Build Test')
  
  try {
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execAsync = promisify(exec)
    
    // Test if build directory exists
    const fs = require('fs')
    if (fs.existsSync('.next')) {
      logTest('Build Directory', 'PASS', '.next directory exists')
    } else {
      logTest('Build Directory', 'FAIL', '.next directory not found')
    }
    
    // Test if package.json exists
    if (fs.existsSync('package.json')) {
      logTest('Package.json', 'PASS', 'package.json exists')
    } else {
      logTest('Package.json', 'FAIL', 'package.json not found')
    }
    
    // Test if .env.local exists
    if (fs.existsSync('.env.local')) {
      logTest('Environment File', 'PASS', '.env.local exists')
    } else {
      logTest('Environment File', 'FAIL', '.env.local not found')
    }
    
  } catch (error) {
    logTest('Application Build', 'FAIL', error.message)
  }
}

// Test 4: File Structure
async function testFileStructure() {
  logSection('File Structure Test')
  
  const fs = require('fs')
  const requiredFiles = [
    'src/lib/unified-data-architecture.ts',
    'src/lib/n8n-sync-service.ts',
    'src/lib/mcp-integration.ts',
    'src/components/DataSyncDashboard.tsx',
    'src/components/SystemMonitor.tsx',
    'supabase-unified-schema.sql',
    'n8n-workflow-job-opportunities.json',
    'n8n-workflow-contacts.json',
    'n8n-workflow-resume-analysis.json',
    'n8n-workflow-mcp-request.json'
  ]
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      logTest(`File: ${file}`, 'PASS', 'Exists')
    } else {
      logTest(`File: ${file}`, 'FAIL', 'Missing')
    }
  }
}

// Test 5: Basic HTTP Test
async function testBasicHTTP() {
  logSection('Basic HTTP Test')
  
  try {
    // Test if we can make HTTP requests
    const response = await axios.get('https://httpbin.org/get', {
      timeout: 5000
    })
    
    if (response.status === 200) {
      logTest('HTTP Requests', 'PASS', 'Can make HTTP requests')
    } else {
      logTest('HTTP Requests', 'FAIL', `Unexpected status: ${response.status}`)
    }
  } catch (error) {
    logTest('HTTP Requests', 'FAIL', error.message)
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Alex AI Job Search - Simple System Test')
  console.log('==========================================')
  console.log('')
  
  const startTime = Date.now()
  
  try {
    await testEnvironmentVariables()
    await testN8NConnectivity()
    await testApplicationBuild()
    await testFileStructure()
    await testBasicHTTP()
    
  } catch (error) {
    console.error('❌ Test suite failed:', error)
  }
  
  const endTime = Date.now()
  const totalDuration = endTime - startTime
  
  // Print summary
  console.log('')
  console.log('📊 Test Results Summary')
  console.log('=======================')
  console.log(`Total Tests: ${testResults.total}`)
  console.log(`Passed: ${testResults.passed}`)
  console.log(`Failed: ${testResults.failed}`)
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`)
  console.log(`Total Duration: ${totalDuration}ms`)
  console.log('')
  
  if (testResults.failed === 0) {
    console.log('🎉 All tests passed! System is ready.')
    process.exit(0)
  } else {
    console.log('⚠️  Some tests failed. Please review the issues above.')
    process.exit(1)
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = {
  runAllTests,
  testResults
}

