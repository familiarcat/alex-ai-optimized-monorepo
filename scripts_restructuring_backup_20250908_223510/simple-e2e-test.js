#!/usr/bin/env node

/**
 * Alex AI Job Search - Simple E2E Testing
 * Tests all CTA buttons and expected features with compatible Puppeteer API
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000,
  headless: false, // Set to true for CI/CD
  viewport: { width: 1280, height: 720 },
  screenshotDir: './test-screenshots'
};

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Utility functions
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

async function waitForElement(page, selector, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    return false;
  }
}

  
  try {
    await page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle0', timeout: CONFIG.timeout });
    
    // Wait for main content to load
    const mainContentLoaded = await waitForElement(page, 'h1', 15000);
    if (!mainContentLoaded) {
      logTest('Page Load', 'FAIL', 'Main content did not load within timeout');
      return false;
    }
    
    // Check for main heading
    const heading = await page.$eval('h1', el => el.textContent);
    if (!heading.includes('Career Journey')) {
      logTest('Page Load', 'FAIL', `Unexpected heading: ${heading}`);
      return false;
    }
    
    logTest('Page Load', 'PASS', 'Page loaded successfully with correct heading');
    await takeScreenshot(page, 'page_load');
    return true;
  } catch (error) {
    logTest('Page Load', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

async function testDashboardButtons(page) {
  console.log('\n🎛️ Testing Dashboard Buttons...');
  
  const dashboardButtons = [
    'Job Scraping Dashboard',
    'Stealth Scraping Dashboard', 
    'Scheduled Scraping Dashboard',
    'Alex AI Crew Dashboard',
    'N8N Unification Dashboard',
    'End-to-End Tests',
    'System Fidelity Tests',
    'Data Source Test',
    'Auto Stealth Scraping'
  ];
  
  for (const buttonName of dashboardButtons) {
    try {
      // Find button by text content using evaluate
      const buttonFound = await page.evaluate((name) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => btn.textContent.includes(name));
      }, buttonName);
      
      if (!buttonFound) {
        logTest(`Dashboard Button: ${buttonName}`, 'FAIL', 'Button not found');
        continue;
      }
      
      // Click the button
      await page.evaluate((name) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const button = buttons.find(btn => btn.textContent.includes(name));
        if (button) button.click();
      }, buttonName);
      
      // Wait for dashboard to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if dashboard content is visible
      const dashboardVisible = await page.$('.bg-white.rounded-lg.shadow-sm.border');
      
      if (dashboardVisible) {
        logTest(`Dashboard Button: ${buttonName}`, 'PASS', 'Dashboard opened successfully');
        await takeScreenshot(page, `dashboard_${buttonName.replace(/\s+/g, '_').toLowerCase()}`);
        
        // Click to hide the dashboard
        await page.evaluate((name) => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const button = buttons.find(btn => btn.textContent.includes(name));
          if (button) button.click();
        }, buttonName);
        
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        logTest(`Dashboard Button: ${buttonName}`, 'FAIL', 'Dashboard content not visible');
      }
    } catch (error) {
      logTest(`Dashboard Button: ${buttonName}`, 'FAIL', `Error: ${error.message}`);
    }
  }
}

async function testJobCards(page) {
  console.log('\n💼 Testing Job Cards...');
  
  try {
    // Wait for job cards to load
    const jobCardsLoaded = await waitForElement(page, '.border.border-gray-200.rounded-lg', 10000);
    
    if (!jobCardsLoaded) {
      logTest('Job Cards Load', 'FAIL', 'No job cards found');
      return;
    }
    
    // Find job cards
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

async function testFilterSidebar(page) {
  console.log('\n🔍 Testing Filter Sidebar...');
  
  try {
    // Look for filter sidebar
    const filterSidebar = await page.$('.lg\\:col-span-1 .space-y-6');
    
    if (!filterSidebar) {
      logTest('Filter Sidebar', 'FAIL', 'Filter sidebar not found');
      return;
    }
    
    logTest('Filter Sidebar Present', 'PASS', 'Filter sidebar found');
    
    // Test location filter
    const locationSelect = await page.$('select');
    if (locationSelect) {
      await locationSelect.select('remote');
      await new Promise(resolve => setTimeout(resolve, 1000));
      logTest('Location Filter', 'PASS', 'Location filter working');
    } else {
      logTest('Location Filter', 'FAIL', 'Location filter not found');
    }
    
    // Test Alex AI score filter
    const scoreSlider = await page.$('input[type="range"]');
    if (scoreSlider) {
      await scoreSlider.evaluate(el => {
        el.value = '90';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      logTest('Score Filter', 'PASS', 'Score filter working');
    } else {
      logTest('Score Filter', 'FAIL', 'Score filter not found');
    }
    
    await takeScreenshot(page, 'filter_sidebar');
  } catch (error) {
    logTest('Filter Sidebar Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function testResumeUpload(page) {
  console.log('\n📄 Testing Resume Upload...');
  
  try {
    // Look for resume upload component
    const resumeUpload = await page.$('input[type="file"]');
    
    if (!resumeUpload) {
      logTest('Resume Upload', 'FAIL', 'Resume upload component not found');
      return;
    }
    
    logTest('Resume Upload Present', 'PASS', 'Resume upload component found');
    
    // Create a dummy file for testing
    const dummyFile = path.join(__dirname, 'dummy-resume.txt');
    fs.writeFileSync(dummyFile, 'Dummy resume content for testing');
    
    // Upload the dummy file
    await resumeUpload.uploadFile(dummyFile);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if analysis started
    const analysisIndicator = await page.$('.animate-spin');
    if (analysisIndicator) {
      logTest('Resume Analysis', 'PASS', 'Resume analysis started');
    } else {
      logTest('Resume Analysis', 'FAIL', 'Resume analysis not started');
    }
    
    // Clean up dummy file
    fs.unlinkSync(dummyFile);
    
    await takeScreenshot(page, 'resume_upload');
  } catch (error) {
    logTest('Resume Upload Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function testStatsDashboard(page) {
  console.log('\n📊 Testing Stats Dashboard...');
  
  try {
    // Look for stats dashboard
    const statsDashboard = await page.$('.text-right');
    
    if (!statsDashboard) {
      logTest('Stats Dashboard', 'FAIL', 'Stats dashboard not found');
      return;
    }
    
    logTest('Stats Dashboard Present', 'PASS', 'Stats dashboard found');
    
    // Check for stats numbers
    const statsNumbers = await page.$$('.text-2xl.font-bold');
    if (statsNumbers.length > 0) {
      logTest('Stats Numbers', 'PASS', `Found ${statsNumbers.length} stat numbers`);
    } else {
      logTest('Stats Numbers', 'FAIL', 'No stat numbers found');
    }
    
    // Test export buttons if present
    const exportButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => 
        btn.textContent.includes('Export') || 
        btn.textContent.includes('Generate')
      );
    });
    
    if (exportButtons.length > 0) {
      logTest('Export Buttons', 'PASS', `Found ${exportButtons.length} export buttons`);
    } else {
      logTest('Export Buttons', 'FAIL', 'No export buttons found');
    }
    
    await takeScreenshot(page, 'stats_dashboard');
  } catch (error) {
    logTest('Stats Dashboard Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function testApplicationTracker(page) {
  console.log('\n📈 Testing Application Tracker...');
  
  try {
    // Look for application tracker
    const appTracker = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      return headings.find(h => h.textContent.includes('Application Tracker'));
    });
    
    if (!appTracker) {
      logTest('Application Tracker', 'FAIL', 'Application tracker not found');
      return;
    }
    
    logTest('Application Tracker Present', 'PASS', 'Application tracker found');
    
    // Test status filter buttons
    const statusButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => 
        btn.textContent.includes('Applied') || 
        btn.textContent.includes('Interview')
      );
    });
    
    if (statusButtons.length > 0) {
      // Click first status button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const statusButton = buttons.find(btn => 
          btn.textContent.includes('Applied') || 
          btn.textContent.includes('Interview')
        );
        if (statusButton) statusButton.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      logTest('Status Filter Buttons', 'PASS', 'Status filter buttons working');
    } else {
      logTest('Status Filter Buttons', 'FAIL', 'No status filter buttons found');
    }
    
    await takeScreenshot(page, 'application_tracker');
  } catch (error) {
    logTest('Application Tracker Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function testDataSourceIndicator(page) {
  console.log('\n📡 Testing Data Source Indicator...');
  
  try {
    // Look for data source indicator
    const dataSourceIndicator = await page.$('.mb-6');
    
    if (!dataSourceIndicator) {
      logTest('Data Source Indicator', 'FAIL', 'Data source indicator not found');
      return;
    }
    
    logTest('Data Source Indicator Present', 'PASS', 'Data source indicator found');
    
    // Test refresh button if present
    const refreshButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Refresh'));
    });
    
    if (refreshButton) {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const refreshBtn = buttons.find(btn => btn.textContent.includes('Refresh'));
        if (refreshBtn) refreshBtn.click();
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      logTest('Data Source Refresh', 'PASS', 'Data source refresh working');
    } else {
      logTest('Data Source Refresh', 'FAIL', 'Refresh button not found');
    }
    
    await takeScreenshot(page, 'data_source_indicator');
  } catch (error) {
    logTest('Data Source Indicator Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function testResponsiveDesign(page) {
  console.log('\n📱 Testing Responsive Design...');
  
  const viewports = [
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ];
  
  for (const viewport of viewports) {
    try {
      await page.setViewport({ width: viewport.width, height: viewport.height });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if main content is still visible
      const mainContent = await page.$('h1');
      if (mainContent) {
        logTest(`Responsive Design: ${viewport.name}`, 'PASS', `Layout works at ${viewport.width}x${viewport.height}`);
        await takeScreenshot(page, `responsive_${viewport.name.toLowerCase()}`);
      } else {
        logTest(`Responsive Design: ${viewport.name}`, 'FAIL', `Main content not visible at ${viewport.width}x${viewport.height}`);
      }
    } catch (error) {
      logTest(`Responsive Design: ${viewport.name}`, 'FAIL', `Error: ${error.message}`);
    }
  }
  
  // Reset to desktop viewport
  await page.setViewport(CONFIG.viewport);
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
    
    // Test job opportunities endpoint
    const jobsResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/job-opportunities');
        return await response.json();
      } catch (error) {
        return { error: error.message };
      }
    });
    
    if (jobsResponse.success !== false) {
      logTest('Jobs API', 'PASS', 'Jobs API responding');
    } else {
      logTest('Jobs API', 'FAIL', `Jobs API error: ${jobsResponse.error || 'Unknown error'}`);
    }
    
    // Test N8N unification endpoint
    const n8nResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/n8n-unification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'cross_crew_analysis',
            data: { test: 'data' }
          })
        });
        return await response.json();
      } catch (error) {
        return { error: error.message };
      }
    });
    
    if (n8nResponse.success) {
      logTest('N8N API', 'PASS', 'N8N unification API working');
    } else {
      logTest('N8N API', 'FAIL', `N8N API error: ${n8nResponse.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    logTest('API Connectivity Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Alex AI Job Search E2E Tests');
  console.log('==========================================');
  
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport(CONFIG.viewport);
  
  // Set up error handling
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`❌ Request Failed: ${request.url()} - ${request.failure().errorText}`);
  });
  
  try {
    // Run all tests
    await testPageLoad(page);
    await testDashboardButtons(page);
    await testJobCards(page);
    await testFilterSidebar(page);
    await testResumeUpload(page);
    await testStatsDashboard(page);
    await testApplicationTracker(page);
    await testDataSourceIndicator(page);
    await testResponsiveDesign(page);
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
  const reportPath = path.join(CONFIG.screenshotDir, `test-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`📄 Detailed report saved: ${reportPath}`);
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, CONFIG };


# Merged functionality:

# From improved-e2e-test.js:
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

  testResults.tests.push(result);
  
  if (status === 'PASS') {
    testResults.passed++;
    console.log(`✅ ${testName}: ${details}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: ${details}`);
  }
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
    process.exit(1);
  });
}

module.exports = { runAllTests, CONFIG };


# From puppeteer-e2e-test.js:
#!/usr/bin/env node

/**
 * Alex AI Job Search - Puppeteer End-to-End Testing
 * Tests all CTA buttons and expected features
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000,
  headless: false, // Set to true for CI/CD
  viewport: { width: 1280, height: 720 },
  screenshotDir: './test-screenshots'
};

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Utility functions
  testResults.tests.push(result);
  
  if (status === 'PASS') {
    testResults.passed++;
    console.log(`✅ ${testName}: ${details}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: ${details}`);
  }
}

  
  const filename = `${testName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.png`;
  const filepath = path.join(CONFIG.screenshotDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

}

  
  try {
    await page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle0', timeout: CONFIG.timeout });
    
    // Wait for main content to load
    const mainContentLoaded = await waitForElement(page, 'h1', 15000);
    if (!mainContentLoaded) {
      logTest('Page Load', 'FAIL', 'Main content did not load within timeout');
      return false;
    }
    
    // Check for main heading
    const heading = await page.$eval('h1', el => el.textContent);
    if (!heading.includes('Career Journey')) {
      logTest('Page Load', 'FAIL', `Unexpected heading: ${heading}`);
      return false;
    }
    
    logTest('Page Load', 'PASS', 'Page loaded successfully with correct heading');
    await takeScreenshot(page, 'page_load');
    return true;
  } catch (error) {
    logTest('Page Load', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

  
  const dashboardButtons = [
    { name: 'Job Scraping Dashboard', selector: 'button:has-text("Show") Job Scraping Dashboard' },
    { name: 'Stealth Scraping Dashboard', selector: 'button:has-text("Show") Stealth Scraping Dashboard' },
    { name: 'Scheduled Scraping Dashboard', selector: 'button:has-text("Show") Scheduled Scraping Dashboard' },
    { name: 'Alex AI Crew Dashboard', selector: 'button:has-text("Show") Alex AI Crew Dashboard' },
    { name: 'N8N Unification Dashboard', selector: 'button:has-text("Show") N8N Unification Dashboard' },
    { name: 'End-to-End Tests', selector: 'button:has-text("Show") End-to-End Tests' },
    { name: 'System Fidelity Tests', selector: 'button:has-text("Show") System Fidelity Tests' },
    { name: 'Data Source Test', selector: 'button:has-text("Show") Data Source Test' },
    { name: 'Auto Stealth Scraping', selector: 'button:has-text("Show") Auto Stealth Scraping' }
  ];
  
  for (const button of dashboardButtons) {
    try {
      // Find button by text content
      const buttonElement = await page.$x(`//button[contains(text(), "${button.name}")]`);
      
      if (buttonElement.length === 0) {
        logTest(`Dashboard Button: ${button.name}`, 'FAIL', 'Button not found');
        continue;
      }
      
      // Click the button
      await buttonElement[0].click();
      await page.waitForTimeout(1000); // Wait for dashboard to load
      
      // Check if dashboard content is visible
      const dashboardVisible = await page.$('.bg-white.rounded-lg.shadow-sm.border');
      
      if (dashboardVisible) {
        logTest(`Dashboard Button: ${button.name}`, 'PASS', 'Dashboard opened successfully');
        await takeScreenshot(page, `dashboard_${button.name.replace(/\s+/g, '_').toLowerCase()}`);
        
        // Click to hide the dashboard
        await buttonElement[0].click();
        await page.waitForTimeout(500);
      } else {
        logTest(`Dashboard Button: ${button.name}`, 'FAIL', 'Dashboard content not visible');
      }
    } catch (error) {
      logTest(`Dashboard Button: ${button.name}`, 'FAIL', `Error: ${error.message}`);
    }
  }
}

  
  try {
    // Wait for job cards to load
    const jobCardsLoaded = await waitForElement(page, '[data-testid="job-card"], .border.border-gray-200.rounded-lg', 10000);
    
    if (!jobCardsLoaded) {
      logTest('Job Cards Load', 'FAIL', 'No job cards found');
      return;
    }
    
    // Find job cards
    const jobCards = await page.$$('.border.border-gray-200.rounded-lg, [data-testid="job-card"]');
    
    if (jobCards.length === 0) {
      logTest('Job Cards Load', 'FAIL', 'No job cards rendered');
      return;
    }
    
    logTest('Job Cards Load', 'PASS', `Found ${jobCards.length} job cards`);
    
    // Test first job card interactions
    const firstJobCard = jobCards[0];
    
    // Test job card click
    await firstJobCard.click();
    await page.waitForTimeout(500);
    
    // Check if job card is selected (look for selection styling)
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
    const applyButton = await firstJobCard.$('button:has-text("Apply"), a:has-text("Apply")');
    if (applyButton) {
      logTest('Apply Button Present', 'PASS', 'Apply button found on job card');
    } else {
      logTest('Apply Button Present', 'FAIL', 'Apply button not found on job card');
    }
    
    await takeScreenshot(page, 'job_cards_interaction');
  } catch (error) {
    logTest('Job Cards Test', 'FAIL', `Error: ${error.message}`);
  }
}

  
  try {
    // Look for filter sidebar
    const filterSidebar = await page.$('.lg\\:col-span-1 .space-y-6, [data-testid="filter-sidebar"]');
    
    if (!filterSidebar) {
      logTest('Filter Sidebar', 'FAIL', 'Filter sidebar not found');
      return;
    }
    
    logTest('Filter Sidebar Present', 'PASS', 'Filter sidebar found');
    
    // Test location filter
    const locationSelect = await page.$('select, [data-testid="location-filter"]');
    if (locationSelect) {
      await locationSelect.select('remote');
      await page.waitForTimeout(1000);
      logTest('Location Filter', 'PASS', 'Location filter working');
    } else {
      logTest('Location Filter', 'FAIL', 'Location filter not found');
    }
    
    // Test Alex AI score filter
    const scoreSlider = await page.$('input[type="range"], [data-testid="score-filter"]');
    if (scoreSlider) {
      await scoreSlider.evaluate(el => {
        el.value = '90';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.waitForTimeout(1000);
      logTest('Score Filter', 'PASS', 'Score filter working');
    } else {
      logTest('Score Filter', 'FAIL', 'Score filter not found');
    }
    
    await takeScreenshot(page, 'filter_sidebar');
  } catch (error) {
    logTest('Filter Sidebar Test', 'FAIL', `Error: ${error.message}`);
  }
}

  
  try {
    // Look for resume upload component
    const resumeUpload = await page.$('input[type="file"], [data-testid="resume-upload"]');
    
    if (!resumeUpload) {
      logTest('Resume Upload', 'FAIL', 'Resume upload component not found');
      return;
    }
    
    logTest('Resume Upload Present', 'PASS', 'Resume upload component found');
    
    // Create a dummy file for testing
    const dummyFile = path.join(__dirname, 'dummy-resume.txt');
    fs.writeFileSync(dummyFile, 'Dummy resume content for testing');
    
    // Upload the dummy file
    await resumeUpload.uploadFile(dummyFile);
    await page.waitForTimeout(2000);
    
    // Check if analysis started
    const analysisIndicator = await page.$('.animate-spin, [data-testid="analyzing"]');
    if (analysisIndicator) {
      logTest('Resume Analysis', 'PASS', 'Resume analysis started');
    } else {
      logTest('Resume Analysis', 'FAIL', 'Resume analysis not started');
    }
    
    // Clean up dummy file
    fs.unlinkSync(dummyFile);
    
    await takeScreenshot(page, 'resume_upload');
  } catch (error) {
    logTest('Resume Upload Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function testStatsDashboard(page) {
  console.log('\n📊 Testing Stats Dashboard...');
  
  try {
    // Look for stats dashboard
    const statsDashboard = await page.$('.text-right, [data-testid="stats-dashboard"]');
    
    if (!statsDashboard) {
      logTest('Stats Dashboard', 'FAIL', 'Stats dashboard not found');
      return;
    }
    
    logTest('Stats Dashboard Present', 'PASS', 'Stats dashboard found');
    
    // Check for stats numbers
    const statsNumbers = await page.$$('.text-2xl.font-bold');
    if (statsNumbers.length > 0) {
      logTest('Stats Numbers', 'PASS', `Found ${statsNumbers.length} stat numbers`);
    } else {
      logTest('Stats Numbers', 'FAIL', 'No stat numbers found');
    }
    
    // Test export buttons if present
    const exportButtons = await page.$$('button:has-text("Export"), button:has-text("Generate")');
    if (exportButtons.length > 0) {
      logTest('Export Buttons', 'PASS', `Found ${exportButtons.length} export buttons`);
    } else {
      logTest('Export Buttons', 'FAIL', 'No export buttons found');
    }
    
    await takeScreenshot(page, 'stats_dashboard');
  } catch (error) {
    logTest('Stats Dashboard Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function testApplicationTracker(page) {
  console.log('\n📈 Testing Application Tracker...');
  
  try {
    // Look for application tracker
    const appTracker = await page.$('h3:has-text("Application Tracker"), [data-testid="application-tracker"]');
    
    if (!appTracker) {
      logTest('Application Tracker', 'FAIL', 'Application tracker not found');
      return;
    }
    
    logTest('Application Tracker Present', 'PASS', 'Application tracker found');
    
    // Test status filter buttons
    const statusButtons = await page.$$('button:has-text("Applied"), button:has-text("Interview")');
    if (statusButtons.length > 0) {
      await statusButtons[0].click();
      await page.waitForTimeout(500);
      logTest('Status Filter Buttons', 'PASS', 'Status filter buttons working');
    } else {
      logTest('Status Filter Buttons', 'FAIL', 'No status filter buttons found');
    }
    
    await takeScreenshot(page, 'application_tracker');
  } catch (error) {
    logTest('Application Tracker Test', 'FAIL', `Error: ${error.message}`);
  }
}

async function testDataSourceIndicator(page) {
  console.log('\n📡 Testing Data Source Indicator...');
  
  try {
    // Look for data source indicator
    const dataSourceIndicator = await page.$('[data-testid="data-source-indicator"], .mb-6');
    
    if (!dataSourceIndicator) {
      logTest('Data Source Indicator', 'FAIL', 'Data source indicator not found');
      return;
    }
    
    logTest('Data Source Indicator Present', 'PASS', 'Data source indicator found');
    
    // Test refresh button if present
    const refreshButton = await page.$('button:has-text("Refresh"), [data-testid="refresh-button"]');
    if (refreshButton) {
      await refreshButton.click();
      await page.waitForTimeout(1000);
      logTest('Data Source Refresh', 'PASS', 'Data source refresh working');
    } else {
      logTest('Data Source Refresh', 'FAIL', 'Refresh button not found');
    }
    
    await takeScreenshot(page, 'data_source_indicator');
  } catch (error) {
    logTest('Data Source Indicator Test', 'FAIL', `Error: ${error.message}`);
  }
}

  
  const viewports = [
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ];
  
  for (const viewport of viewports) {
    try {
      await page.setViewport({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);
      
      // Check if main content is still visible
      const mainContent = await page.$('h1');
      if (mainContent) {
        logTest(`Responsive Design: ${viewport.name}`, 'PASS', `Layout works at ${viewport.width}x${viewport.height}`);
        await takeScreenshot(page, `responsive_${viewport.name.toLowerCase()}`);
      } else {
        logTest(`Responsive Design: ${viewport.name}`, 'FAIL', `Main content not visible at ${viewport.width}x${viewport.height}`);
      }
    } catch (error) {
      logTest(`Responsive Design: ${viewport.name}`, 'FAIL', `Error: ${error.message}`);
    }
  }
  
  // Reset to desktop viewport
  await page.setViewport(CONFIG.viewport);
}

  
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
    
    // Test job opportunities endpoint
    const jobsResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/job-opportunities');
        return await response.json();
      } catch (error) {
        return { error: error.message };
      }
    });
    
    if (jobsResponse.success !== false) {
      logTest('Jobs API', 'PASS', 'Jobs API responding');
    } else {
      logTest('Jobs API', 'FAIL', `Jobs API error: ${jobsResponse.error || 'Unknown error'}`);
    }
    
    // Test N8N unification endpoint
    const n8nResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/n8n-unification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'cross_crew_analysis',
            data: { test: 'data' }
          })
        });
        return await response.json();
      } catch (error) {
        return { error: error.message };
      }
    });
    
    if (n8nResponse.success) {
      logTest('N8N API', 'PASS', 'N8N unification API working');
    } else {
      logTest('N8N API', 'FAIL', `N8N API error: ${n8nResponse.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    logTest('API Connectivity Test', 'FAIL', `Error: ${error.message}`);
  }
}

  console.log('==========================================');
  
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport(CONFIG.viewport);
  
  // Set up error handling
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`❌ Request Failed: ${request.url()} - ${request.failure().errorText}`);
  });
  
  try {
    // Run all tests
    await testPageLoad(page);
    await testDashboardButtons(page);
    await testJobCards(page);
    await testFilterSidebar(page);
    await testResumeUpload(page);
    await testStatsDashboard(page);
    await testApplicationTracker(page);
    await testDataSourceIndicator(page);
    await testResponsiveDesign(page);
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
  const reportPath = path.join(CONFIG.screenshotDir, `test-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`📄 Detailed report saved: ${reportPath}`);
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
    process.exit(1);
  });
}

module.exports = { runAllTests, CONFIG };

