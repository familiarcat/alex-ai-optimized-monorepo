#!/usr/bin/env node

/**
 * Alex AI Job Search - Improved E2E Testing
 * Uses better selectors and error handling
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 60000, // Increased timeout
  headless: false,
  viewport: { width: 1280, height: 720 },
  screenshotDir: './test-screenshots'
};

const testResults = { passed: 0, failed: 0, tests: [] };

function logTest(testName, status, details = '') {
  const result = { testName, status, details, timestamp: new Date().toISOString() };
  testResults.tests.push(result);
  
  if (status === 'PASS') {
    testResults.passed++;
    console.log(`✅ ${testName}: ${details}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: ${details}`);
  }
}

async function takeScreenshot(page, testName) {
  if (!fs.existsSync(CONFIG.screenshotDir)) {
    fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
  }
  
  const filename = `${testName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.png`;
  const filepath = path.join(CONFIG.screenshotDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

async function testPageLoad(page) {
  console.log('\n🏠 Testing Page Load...');
  
  try {
    // Set up request interception to handle N8N failures gracefully
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('n8n.pbradygeorgen.com')) {
        request.abort();
      } else {
        request.continue();
      }
    });
    
    await page.goto(CONFIG.baseUrl, { waitUntil: 'domcontentloaded', timeout: CONFIG.timeout });
    
    // Wait for main content with more lenient timeout
    await page.waitForSelector('h1', { timeout: 15000 });
    
    const heading = await page.$eval('h1', el => el.textContent);
    if (heading.includes('Career Journey')) {
      logTest('Page Load', 'PASS', 'Page loaded successfully with correct heading');
      await takeScreenshot(page, 'page_load');
      return true;
    } else {
      logTest('Page Load', 'FAIL', `Unexpected heading: ${heading}`);
      return false;
    }
  } catch (error) {
    logTest('Page Load', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

async function testDashboardButtons(page) {
  console.log('\n🎛️ Testing Dashboard Buttons...');
  
  const dashboardButtons = [
    { name: 'Job Scraping Dashboard', testId: 'job-scraping-dashboard-btn' },
    { name: 'Stealth Scraping Dashboard', testId: 'stealth-scraping-dashboard-btn' },
    { name: 'Scheduled Scraping Dashboard', testId: 'scheduled-scraping-dashboard-btn' },
    { name: 'Alex AI Crew Dashboard', testId: 'alex-ai-crew-dashboard-btn' },
    { name: 'N8N Unification Dashboard', testId: 'n8n-unification-dashboard-btn' },
    { name: 'End-to-End Tests', testId: 'end-to-end-tests-btn' },
    { name: 'System Fidelity Tests', testId: 'system-fidelity-tests-btn' },
    { name: 'Data Source Test', testId: 'data-source-test-btn' },
    { name: 'Auto Stealth Scraping', testId: 'auto-stealth-scraping-btn' }
  ];
  
  for (const button of dashboardButtons) {
    try {
      // Try data-testid first, then fallback to text content
      let buttonElement = await page.$(`[data-testid="${button.testId}"]`);
      
      if (!buttonElement) {
        buttonElement = await page.evaluateHandle((name) => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => btn.textContent.includes(name));
        }, button.name);
      }
      
      if (!buttonElement || (await buttonElement.evaluate(el => !el))) {
        logTest(`Dashboard Button: ${button.name}`, 'FAIL', 'Button not found');
        continue;
      }
      
      // Click the button
      await buttonElement.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if dashboard content is visible
      const dashboardVisible = await page.$('.bg-white.rounded-lg.shadow-sm.border');
      
      if (dashboardVisible) {
        logTest(`Dashboard Button: ${button.name}`, 'PASS', 'Dashboard opened successfully');
        await takeScreenshot(page, `dashboard_${button.name.replace(/\s+/g, '_').toLowerCase()}`);
        
        // Click to hide the dashboard
        await buttonElement.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        logTest(`Dashboard Button: ${button.name}`, 'FAIL', 'Dashboard content not visible');
      }
    } catch (error) {
      logTest(`Dashboard Button: ${button.name}`, 'FAIL', `Error: ${error.message}`);
    }
  }
}

async function testJobCards(page) {
  console.log('\n💼 Testing Job Cards...');
  
  try {
    // Wait for job cards to load
    await page.waitForSelector('.border.border-gray-200.rounded-lg', { timeout: 10000 });
    
    const jobCards = await page.$$('.border.border-gray-200.rounded-lg');
    
    if (jobCards.length === 0) {
      logTest('Job Cards Load', 'FAIL', 'No job cards rendered');
      return;
    }
    
    logTest('Job Cards Load', 'PASS', `Found ${jobCards.length} job cards`);
    
    // Test first job card interactions
    const firstJobCard = jobCards[0];
    
    // Test job card click
    await firstJobCard.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if job card is selected
    const isSelected = await firstJobCard.evaluate(el => 
      el.classList.contains('ring-2') || 
      el.classList.contains('ring-indigo-500') || 
      el.style.borderColor !== ''
    );
    
    if (isSelected) {
      logTest('Job Card Selection', 'PASS', 'Job card selected successfully');
    } else {
      logTest('Job Card Selection', 'FAIL', 'Job card selection not working');
    }
    
    // Test Apply button if present
    const applyButton = await firstJobCard.$('button');
    if (applyButton) {
      const buttonText = await applyButton.evaluate(el => el.textContent);
      if (buttonText.includes('Apply') || buttonText.includes('View')) {
        logTest('Apply Button Present', 'PASS', 'Apply/View button found on job card');
      } else {
        logTest('Apply Button Present', 'FAIL', 'No Apply button found on job card');
      }
    } else {
      logTest('Apply Button Present', 'FAIL', 'No buttons found on job card');
    }
    
    await takeScreenshot(page, 'job_cards_interaction');
  } catch (error) {
    logTest('Job Cards Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function testAPIConnectivity(page) {
  console.log('\n🔌 Testing API Connectivity...');
  
  try {
    // Test health endpoint
    const healthResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/health');
        return await response.json();
      } catch (error) {
        return { error: error.message };
      }
    });
    
    if (healthResponse.status) {
      logTest('Health API', 'PASS', `API responding: ${healthResponse.status}`);
    } else {
      logTest('Health API', 'FAIL', `API error: ${healthResponse.error || 'Unknown error'}`);
    }
    
    // Test mock data endpoint
    const mockDataResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/mock-data');
        return await response.json();
      } catch (error) {
        return { error: error.message };
      }
    });
    
    if (Array.isArray(mockDataResponse) && mockDataResponse.length > 0) {
      logTest('Mock Data API', 'PASS', `Mock data API working: ${mockDataResponse.length} items`);
    } else {
      logTest('Mock Data API', 'FAIL', `Mock data API error: ${mockDataResponse.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    logTest('API Connectivity Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Improved Alex AI Job Search E2E Tests');
  console.log('==================================================');
  
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport(CONFIG.viewport);
  
  try {
    await testPageLoad(page);
    await testDashboardButtons(page);
    await testJobCards(page);
    await testAPIConnectivity(page);
    
  } catch (error) {
    console.log(`❌ Test Suite Error: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // Generate test report
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total: ${testResults.passed + testResults.failed}`);
  console.log(`📊 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  // Save detailed report
  const reportPath = path.join(CONFIG.screenshotDir, `improved-test-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`📄 Detailed report saved: ${reportPath}`);
  
  process.exit(testResults.failed > 0 ? 1 : 0);
}

if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, CONFIG };
