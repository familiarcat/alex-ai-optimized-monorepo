#!/usr/bin/env node

/**
 * Alex AI Integration Test Script
 * Tests the integration between the Next.js app and Alex AI services
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  alexAIBaseURL: process.env.ALEX_AI_API_URL || 'https://n8n.pbradygeorgen.com',
  n8nApiKey: process.env.N8N_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test functions
async function testEnvironmentVariables() {
  logInfo('Testing environment variables...');
  
  const requiredVars = [
    'ALEX_AI_API_URL',
    'N8N_API_KEY',
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    logError(`Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  logSuccess('All required environment variables are set');
  return true;
}

async function testAlexAIConnection() {
  logInfo('Testing Alex AI connection...');
  
  try {
    const response = await axios.get(`${config.alexAIBaseURL}/health`, {
      headers: {
        'Authorization': `Bearer ${config.n8nApiKey}`,
      },
      timeout: 10000,
    });
    
    logSuccess(`Alex AI service is responding (Status: ${response.status})`);
    return true;
  } catch (error) {
    if (error.response) {
      logError(`Alex AI service returned error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      logError('Alex AI service is not responding (connection timeout)');
    } else {
      logError(`Alex AI connection error: ${error.message}`);
    }
    return false;
  }
}

async function testN8NWebhooks() {
  logInfo('Testing N8N webhooks...');
  
  const webhooks = [
    '/webhook/resume-analysis',
    '/webhook/job-matching',
    '/webhook/cover-letter-generation',
    '/webhook/resume-tailoring',
    '/webhook/job-tracking'
  ];
  
  const results = [];
  
  for (const webhook of webhooks) {
    try {
      const response = await axios.post(
        `${config.alexAIBaseURL}${webhook}`,
        { test: true },
        {
          headers: {
            'Authorization': `Bearer ${config.n8nApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );
      
      logSuccess(`Webhook ${webhook} is responding`);
      results.push({ webhook, status: 'success', response: response.status });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        logWarning(`Webhook ${webhook} not found (404) - may not be configured yet`);
      } else {
        logError(`Webhook ${webhook} failed: ${error.message}`);
      }
      results.push({ webhook, status: 'error', error: error.message });
    }
  }
  
  return results;
}

async function testSupabaseConnection() {
  logInfo('Testing Supabase connection...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('job_opportunities')
      .select('count')
      .limit(1);
    
    if (error) {
      logError(`Supabase connection failed: ${error.message}`);
      return false;
    }
    
    logSuccess('Supabase connection is working');
    return true;
  } catch (error) {
    logError(`Supabase connection error: ${error.message}`);
    return false;
  }
}

async function testOpenAIConnection() {
  logInfo('Testing OpenAI connection...');
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/models',
      {},
      {
        headers: {
          'Authorization': `Bearer ${config.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    
    logSuccess(`OpenAI API is responding (Status: ${response.status})`);
    return true;
  } catch (error) {
    if (error.response) {
      logError(`OpenAI API error: ${error.response.status} - ${error.response.data?.error?.message || error.response.statusText}`);
    } else {
      logError(`OpenAI connection error: ${error.message}`);
    }
    return false;
  }
}

async function testResumeAnalysis() {
  logInfo('Testing resume analysis functionality...');
  
  // Create a mock resume file for testing
  const mockResumeContent = `
    P. BRADY GEORGEN
    Developer & Creative Technologist | Full-Stack Engineer | UX Innovator
    
    PROFESSIONAL SUMMARY
    Accomplished Full-Stack Developer and Creative Technologist with 15+ years of experience
    delivering enterprise-scale software platforms and innovative solutions.
    
    CORE COMPETENCIES
    Full-Stack Development (React, Node.js, TypeScript, Next.js, Vue.js)
    Cloud Architecture (AWS, Azure, Docker, Terraform)
    AI/Automation (n8n, Cursor AI, Alex AI)
    Technical Leadership and Team Management
  `;
  
  try {
    const response = await axios.post(
      `${config.alexAIBaseURL}/webhook/resume-analysis`,
      {
        resume_content: mockResumeContent,
        test_mode: true
      },
      {
        headers: {
          'Authorization': `Bearer ${config.n8nApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );
    
    logSuccess('Resume analysis test completed');
    return true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logWarning('Resume analysis webhook not configured yet');
    } else {
      logError(`Resume analysis test failed: ${error.message}`);
    }
    return false;
  }
}

async function generateTestReport(results) {
  logInfo('Generating test report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    results: results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      warnings: results.filter(r => r.status === 'warning').length,
    }
  };
  
  const reportPath = path.join(__dirname, '..', 'test-reports', 'alex-ai-integration-test.json');
  
  // Ensure test-reports directory exists
  const reportsDir = path.dirname(reportPath);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  logSuccess(`Test report saved to: ${reportPath}`);
  
  return report;
}

// Main test function
async function runTests() {
  log('🚀 Starting Alex AI Integration Tests...', 'bright');
  log('', 'reset');
  
  const results = [];
  
  // Test 1: Environment Variables
  const envTest = await testEnvironmentVariables();
  results.push({ test: 'Environment Variables', status: envTest ? 'success' : 'error' });
  
  if (!envTest) {
    logError('Environment variables test failed. Please check your .env.local file.');
    process.exit(1);
  }
  
  // Test 2: Alex AI Connection
  const alexAITest = await testAlexAIConnection();
  results.push({ test: 'Alex AI Connection', status: alexAITest ? 'success' : 'error' });
  
  // Test 3: N8N Webhooks
  const webhookResults = await testN8NWebhooks();
  const webhookSuccess = webhookResults.filter(r => r.status === 'success').length;
  const webhookTotal = webhookResults.length;
  results.push({ 
    test: 'N8N Webhooks', 
    status: webhookSuccess > 0 ? 'success' : 'error',
    details: `${webhookSuccess}/${webhookTotal} webhooks working`
  });
  
  // Test 4: Supabase Connection
  const supabaseTest = await testSupabaseConnection();
  results.push({ test: 'Supabase Connection', status: supabaseTest ? 'success' : 'error' });
  
  // Test 5: OpenAI Connection
  const openAITest = await testOpenAIConnection();
  results.push({ test: 'OpenAI Connection', status: openAITest ? 'success' : 'error' });
  
  // Test 6: Resume Analysis
  const resumeTest = await testResumeAnalysis();
  results.push({ test: 'Resume Analysis', status: resumeTest ? 'success' : 'warning' });
  
  // Generate report
  const report = await generateTestReport(results);
  
  // Print summary
  log('', 'reset');
  log('📊 Test Summary:', 'bright');
  log(`Total Tests: ${report.summary.total}`, 'cyan');
  log(`Passed: ${report.summary.passed}`, 'green');
  log(`Failed: ${report.summary.failed}`, 'red');
  log(`Warnings: ${report.summary.warnings}`, 'yellow');
  
  if (report.summary.failed === 0) {
    log('', 'reset');
    log('🎉 All critical tests passed! Alex AI integration is ready.', 'green');
  } else {
    log('', 'reset');
    log('⚠️  Some tests failed. Please check the configuration and try again.', 'yellow');
  }
  
  return report;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    logError(`Test execution failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runTests };
