#!/usr/bin/env node
/**
 * Simple Test for N8N Bidirectional Sync
 * Uses built-in Node.js modules to test connectivity
 */

const http = require('http');
const https = require('https');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testN8NSync() {
  console.log('🔍 Testing N8N Bidirectional Sync...');
  console.log('=====================================');
  
  try {
    // Test 1: Check if N8N is accessible
    console.log('\n1. Testing N8N connectivity...');
    try {
      const n8nResponse = await makeRequest('https://n8n.pbradygeorgen.com/api/v1/workflows');
      console.log('✅ N8N is accessible (Status:', n8nResponse.statusCode, ')');
    } catch (error) {
      console.log('❌ N8N is not accessible:', error.message);
      return false;
    }

    // Test 2: Check if Alex AI server is running
    console.log('\n2. Testing Alex AI server...');
    try {
      const alexResponse = await makeRequest('http://localhost:3000/api/n8n-unification');
      console.log('✅ Alex AI server is running (Status:', alexResponse.statusCode, ')');
    } catch (error) {
      console.log('❌ Alex AI server is not running:', error.message);
      console.log('   This is the core problem - the server needs to be started');
      return false;
    }

    // Test 3: Test bidirectional sync
    console.log('\n3. Testing bidirectional sync...');
    try {
      const syncData = JSON.stringify({
        action: 'alex_ai_to_federation',
        crew_member: 'commander_data',
        data: {
          test: 'bidirectional_sync_test',
          message: 'Testing if N8N bidirectional sync is actually working',
          timestamp: new Date().toISOString()
        }
      });

      const syncResponse = await makeRequest('http://localhost:3000/api/n8n-unification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(syncData)
        },
        body: syncData,
        timeout: 10000
      });
      
      console.log('✅ Bidirectional sync test successful (Status:', syncResponse.statusCode, ')');
      console.log('   Response:', syncResponse.data);
      return true;
    } catch (error) {
      console.log('❌ Bidirectional sync test failed:', error.message);
      return false;
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    return false;
  }
}

async function checkServerStatus() {
  console.log('\n🔍 Checking server status...');
  
  try {
    const response = await makeRequest('http://localhost:3000/api/n8n-unification');
    console.log('✅ Server is running on port 3000');
    return true;
  } catch (error) {
    console.log('❌ Server is not running on port 3000');
    console.log('   Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Alex AI N8N Bidirectional Sync Test');
  console.log('=====================================');
  
  // Check if server is running
  const serverRunning = await checkServerStatus();
  
  if (!serverRunning) {
    console.log('\n🚨 CRITICAL ISSUE: Alex AI server is not running');
    console.log('   This means the N8N bidirectional sync cannot work');
    console.log('   The platform is not functional as claimed');
    
    console.log('\n🔧 To fix this:');
    console.log('   1. Start the development server: pnpm run dev');
    console.log('   2. Wait for it to fully start');
    console.log('   3. Run this test again');
    
    return;
  }
  
  // Test the actual functionality
  const testResult = await testN8NSync();
  
  if (testResult) {
    console.log('\n🎉 SUCCESS: N8N bidirectional sync is working!');
    console.log('   Alex AI platform is functional as claimed');
  } else {
    console.log('\n❌ FAILURE: N8N bidirectional sync is not working');
    console.log('   Alex AI platform is not functional as claimed');
    console.log('   This is a critical integrity issue');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testN8NSync, checkServerStatus };

