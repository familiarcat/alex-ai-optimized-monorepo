#!/usr/bin/env node
/**
 * Test N8N Bidirectional Sync
 * This script tests if the N8N bidirectional sync is actually working
 */

const axios = require('axios');

const N8N_BASE_URL = 'https://n8n.pbradygeorgen.com';
const ALEX_AI_BASE_URL = 'http://localhost:3000';

async function testN8NSync() {
  console.log('🔍 Testing N8N Bidirectional Sync...');
  
  try {
    // Test 1: Check if N8N is accessible
    console.log('\n1. Testing N8N connectivity...');
    try {
      const n8nResponse = await axios.get(`${N8N_BASE_URL}/api/v1/workflows`, {
        timeout: 5000
      });
      console.log('✅ N8N is accessible');
    } catch (error) {
      console.log('❌ N8N is not accessible:', error.message);
      return false;
    }

    // Test 2: Check if Alex AI server is running
    console.log('\n2. Testing Alex AI server...');
    try {
      const alexResponse = await axios.get(`${ALEX_AI_BASE_URL}/api/n8n-unification`, {
        timeout: 5000
      });
      console.log('✅ Alex AI server is running');
    } catch (error) {
      console.log('❌ Alex AI server is not running:', error.message);
      console.log('   This is the core problem - the server needs to be started');
      return false;
    }

    // Test 3: Test bidirectional sync
    console.log('\n3. Testing bidirectional sync...');
    try {
      const syncResponse = await axios.post(`${ALEX_AI_BASE_URL}/api/n8n-unification`, {
        action: 'alex_ai_to_federation',
        crew_member: 'commander_data',
        data: {
          test: 'bidirectional_sync_test',
          message: 'Testing if N8N bidirectional sync is actually working',
          timestamp: new Date().toISOString()
        }
      }, {
        timeout: 10000
      });
      
      console.log('✅ Bidirectional sync test successful');
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

async function startAlexAIServer() {
  console.log('\n🚀 Starting Alex AI server...');
  
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const server = spawn('pnpm', ['run', 'dev', '--filter=alex-ai-job-search'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    let serverReady = false;
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Server output:', output);
      
      if (output.includes('Ready') || output.includes('started') || output.includes('localhost:3000')) {
        if (!serverReady) {
          serverReady = true;
          console.log('✅ Alex AI server started successfully');
          resolve(server);
        }
      }
    });

    server.stderr.on('data', (data) => {
      console.log('Server error:', data.toString());
    });

    server.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverReady) {
        console.log('❌ Server start timeout');
        reject(new Error('Server start timeout'));
      }
    }, 30000);
  });
}

async function main() {
  console.log('🔍 Alex AI N8N Bidirectional Sync Test');
  console.log('=====================================');
  
  // First, try to test without starting server
  const testResult = await testN8NSync();
  
  if (!testResult) {
    console.log('\n🔧 Attempting to start Alex AI server...');
    try {
      const server = await startAlexAIServer();
      
      // Wait a bit for server to fully start
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Test again
      console.log('\n🔄 Testing again after server start...');
      const retestResult = await testN8NSync();
      
      if (retestResult) {
        console.log('\n🎉 SUCCESS: N8N bidirectional sync is working!');
      } else {
        console.log('\n❌ FAILURE: N8N bidirectional sync is still not working');
      }
      
      // Clean up
      server.kill();
      
    } catch (error) {
      console.log('\n❌ Failed to start server:', error.message);
      console.log('\n🚨 CRITICAL ISSUE: Alex AI platform is not functional');
    }
  } else {
    console.log('\n🎉 SUCCESS: N8N bidirectional sync is working!');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testN8NSync, startAlexAIServer };

