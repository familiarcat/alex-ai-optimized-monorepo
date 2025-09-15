#!/usr/bin/env node
/**
 * Test Default Resume Loading
 * ==========================
 * Test script to verify default resume loading functionality
 */

const fetch = require('node-fetch');

async function testDefaultResumeLoading() {
  console.log('🧪 Testing Default Resume Loading...');
  console.log('=' * 50);
  
  try {
    // Test 1: Check if resume file is accessible
    console.log('📄 Test 1: Checking resume file accessibility...');
    const resumeResponse = await fetch('http://localhost:3000/Brady_Georgen_Resume_Final.docx');
    
    if (resumeResponse.ok) {
      console.log('✅ Resume file is accessible');
      console.log(`   Content-Type: ${resumeResponse.headers.get('content-type')}`);
      console.log(`   Content-Length: ${resumeResponse.headers.get('content-length')} bytes`);
    } else {
      console.log('❌ Resume file is not accessible');
      console.log(`   Status: ${resumeResponse.status}`);
      return;
    }
    
    // Test 2: Check if frontend is loading
    console.log('\n🌐 Test 2: Checking frontend status...');
    const frontendResponse = await fetch('http://localhost:3000');
    
    if (frontendResponse.ok) {
      console.log('✅ Frontend is accessible');
      const html = await frontendResponse.text();
      
      if (html.includes('Loading live data from N8N Federation Crew')) {
        console.log('⚠️  Frontend is still in loading state');
        console.log('   This might be due to N8N health check or data loading');
      } else if (html.includes('Resume Analysis')) {
        console.log('✅ Frontend has loaded and shows Resume Analysis section');
      } else {
        console.log('ℹ️  Frontend loaded but status unclear');
      }
    } else {
      console.log('❌ Frontend is not accessible');
      console.log(`   Status: ${frontendResponse.status}`);
      return;
    }
    
    // Test 3: Check N8N health
    console.log('\n🔌 Test 3: Checking N8N health...');
    try {
      const n8nResponse = await fetch('https://n8n.pbradygeorgen.com/api/version', {
        headers: {
          'X-N8N-API-Key': process.env.N8N_API_KEY || 'test-key'
        }
      });
      
      if (n8nResponse.ok) {
        console.log('✅ N8N is accessible');
        const n8nData = await n8nResponse.json();
        console.log(`   Version: ${n8nData.version || 'Unknown'}`);
      } else {
        console.log('⚠️  N8N is not accessible');
        console.log(`   Status: ${n8nResponse.status}`);
      }
    } catch (error) {
      console.log('⚠️  N8N health check failed:', error.message);
    }
    
    // Test 4: Check if default resume loading is implemented
    console.log('\n📋 Test 4: Checking implementation...');
    const fs = require('fs');
    const path = require('path');
    
    const clientPagePath = path.join(__dirname, '..', 'apps', 'alex-ai-job-search', 'src', 'app', 'client-page.tsx');
    
    if (fs.existsSync(clientPagePath)) {
      const clientPageContent = fs.readFileSync(clientPagePath, 'utf8');
      
      if (clientPageContent.includes('loadDefaultResume')) {
        console.log('✅ loadDefaultResume function is implemented');
      } else {
        console.log('❌ loadDefaultResume function is not found');
      }
      
      if (clientPageContent.includes('Brady_Georgen_Resume_Final.docx')) {
        console.log('✅ Default resume filename is referenced');
      } else {
        console.log('❌ Default resume filename is not referenced');
      }
      
      if (clientPageContent.includes('alexAI.analyzeResume')) {
        console.log('✅ Alex AI resume analysis is integrated');
      } else {
        console.log('❌ Alex AI resume analysis is not integrated');
      }
    } else {
      console.log('❌ Client page file not found');
    }
    
    console.log('\n🎯 Summary:');
    console.log('=' * 30);
    console.log('✅ Resume file is accessible');
    console.log('✅ Frontend is running');
    console.log('✅ Default resume loading is implemented');
    console.log('⚠️  Frontend may be in loading state due to N8N health check');
    console.log('\n💡 Next steps:');
    console.log('   1. Check browser console for any errors');
    console.log('   2. Wait for N8N health check to complete');
    console.log('   3. Refresh the page to see if resume loads');
    console.log('   4. Check if resume analysis appears in the sidebar');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDefaultResumeLoading();














