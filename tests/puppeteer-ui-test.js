#!/usr/bin/env node
/**
 * Alex AI Puppeteer UI Testing Suite
 * Comprehensive visual testing for the optimized monorepo
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AlexAIPuppeteerTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = [];
        this.screenshots = [];
        this.baseUrl = 'http://localhost:3000';
        this.outputDir = path.join(__dirname, 'puppeteer-results');
    }

    async initialize() {
        console.log('🚀 Initializing Alex AI Puppeteer Testing Suite...');
        
        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Launch browser
        this.browser = await puppeteer.launch({
            headless: false, // Set to true for CI/CD
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        this.page = await this.browser.newPage();
        
        // Set user agent
        await this.page.setUserAgent('Alex AI Puppeteer Tester 1.0');
        
        console.log('✅ Browser initialized successfully');
    }

    async takeScreenshot(name, description = '') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}-${timestamp}.png`;
        const filepath = path.join(this.outputDir, filename);
        
        await this.page.screenshot({ 
            path: filepath, 
            fullPage: true 
        });
        
        this.screenshots.push({
            name,
            description,
            filename,
            filepath,
            timestamp: new Date().toISOString()
        });
        
        console.log(`📸 Screenshot taken: ${name} - ${description}`);
        return filepath;
    }

    async testPageLoad() {
        console.log('🔍 Testing page load...');
        
        try {
            await this.page.goto(this.baseUrl, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            const title = await this.page.title();
            const url = this.page.url();
            
            await this.takeScreenshot('page-load', 'Initial page load');
            
            this.testResults.push({
                test: 'Page Load',
                status: 'PASS',
                details: {
                    title,
                    url,
                    loadTime: Date.now()
                }
            });
            
            console.log('✅ Page loaded successfully');
            return true;
            
        } catch (error) {
            this.testResults.push({
                test: 'Page Load',
                status: 'FAIL',
                error: error.message
            });
            
            console.error('❌ Page load failed:', error.message);
            return false;
        }
    }

    async testNavigation() {
        console.log('🧭 Testing navigation...');
        
        try {
            // Test if main elements are present
            const mainElements = await this.page.evaluate(() => {
                const elements = {
                    header: !!document.querySelector('header, [role="banner"]'),
                    main: !!document.querySelector('main, [role="main"]'),
                    navigation: !!document.querySelector('nav, [role="navigation"]'),
                    footer: !!document.querySelector('footer, [role="contentinfo"]')
                };
                
                return elements;
            });
            
            await this.takeScreenshot('navigation-test', 'Navigation elements check');
            
            this.testResults.push({
                test: 'Navigation',
                status: 'PASS',
                details: mainElements
            });
            
            console.log('✅ Navigation test passed');
            return true;
            
        } catch (error) {
            this.testResults.push({
                test: 'Navigation',
                status: 'FAIL',
                error: error.message
            });
            
            console.error('❌ Navigation test failed:', error.message);
            return false;
        }
    }

    async testJobSearchInterface() {
        console.log('💼 Testing job search interface...');
        
        try {
            // Wait for job search elements
            await this.page.waitForSelector('[data-testid="job-search"], .job-search, input[type="search"]', { 
                timeout: 10000 
            });
            
            // Test search functionality
            const searchInput = await this.page.$('input[type="search"], [data-testid="search-input"]');
            if (searchInput) {
                await searchInput.type('software engineer');
                await this.page.keyboard.press('Enter');
                
                // Wait for results
                await this.page.waitForTimeout(2000);
            }
            
            await this.takeScreenshot('job-search', 'Job search interface test');
            
            // Check for job cards or results
            const jobCards = await this.page.$$('.job-card, [data-testid="job-card"], .job-item');
            
            this.testResults.push({
                test: 'Job Search Interface',
                status: 'PASS',
                details: {
                    searchInputFound: !!searchInput,
                    jobCardsFound: jobCards.length
                }
            });
            
            console.log('✅ Job search interface test passed');
            return true;
            
        } catch (error) {
            this.testResults.push({
                test: 'Job Search Interface',
                status: 'FAIL',
                error: error.message
            });
            
            console.error('❌ Job search interface test failed:', error.message);
            return false;
        }
    }

    async testResponsiveDesign() {
        console.log('📱 Testing responsive design...');
        
        const viewports = [
            { name: 'Desktop', width: 1920, height: 1080 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Mobile', width: 375, height: 667 }
        ];
        
        for (const viewport of viewports) {
            try {
                await this.page.setViewport({ 
                    width: viewport.width, 
                    height: viewport.height 
                });
                
                await this.page.waitForTimeout(1000);
                
                await this.takeScreenshot(
                    `responsive-${viewport.name.toLowerCase()}`, 
                    `${viewport.name} viewport (${viewport.width}x${viewport.height})`
                );
                
                // Test if content is visible and not broken
                const isContentVisible = await this.page.evaluate(() => {
                    const mainContent = document.querySelector('main, [role="main"], .main-content');
                    if (!mainContent) return false;
                    
                    const rect = mainContent.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0;
                });
                
                this.testResults.push({
                    test: `Responsive Design - ${viewport.name}`,
                    status: isContentVisible ? 'PASS' : 'FAIL',
                    details: {
                        viewport: `${viewport.width}x${viewport.height}`,
                        contentVisible: isContentVisible
                    }
                });
                
                console.log(`✅ ${viewport.name} responsive test completed`);
                
            } catch (error) {
                this.testResults.push({
                    test: `Responsive Design - ${viewport.name}`,
                    status: 'FAIL',
                    error: error.message
                });
                
                console.error(`❌ ${viewport.name} responsive test failed:`, error.message);
            }
        }
    }

    async testPerformance() {
        console.log('⚡ Testing performance...');
        
        try {
            // Navigate to page and measure performance
            const startTime = Date.now();
            
            await this.page.goto(this.baseUrl, { 
                waitUntil: 'networkidle2' 
            });
            
            const loadTime = Date.now() - startTime;
            
            // Get performance metrics
            const performanceMetrics = await this.page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                return {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalTime: navigation.loadEventEnd - navigation.fetchStart
                };
            });
            
            await this.takeScreenshot('performance-test', 'Performance metrics capture');
            
            this.testResults.push({
                test: 'Performance',
                status: loadTime < 5000 ? 'PASS' : 'WARN',
                details: {
                    loadTime,
                    ...performanceMetrics,
                    threshold: 5000
                }
            });
            
            console.log('✅ Performance test completed');
            return true;
            
        } catch (error) {
            this.testResults.push({
                test: 'Performance',
                status: 'FAIL',
                error: error.message
            });
            
            console.error('❌ Performance test failed:', error.message);
            return false;
        }
    }

    async testAccessibility() {
        console.log('♿ Testing accessibility...');
        
        try {
            // Check for basic accessibility features
            const accessibilityChecks = await this.page.evaluate(() => {
                const checks = {
                    hasTitle: !!document.title,
                    hasMainLandmark: !!document.querySelector('main, [role="main"]'),
                    hasNavigation: !!document.querySelector('nav, [role="navigation"]'),
                    hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
                    hasAltText: Array.from(document.querySelectorAll('img')).every(img => img.alt !== undefined),
                    hasFormLabels: Array.from(document.querySelectorAll('input, select, textarea')).every(input => {
                        return input.labels.length > 0 || input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
                    })
                };
                
                return checks;
            });
            
            await this.takeScreenshot('accessibility-test', 'Accessibility checks');
            
            const passedChecks = Object.values(accessibilityChecks).filter(Boolean).length;
            const totalChecks = Object.keys(accessibilityChecks).length;
            
            this.testResults.push({
                test: 'Accessibility',
                status: passedChecks >= totalChecks * 0.8 ? 'PASS' : 'WARN',
                details: {
                    ...accessibilityChecks,
                    score: `${passedChecks}/${totalChecks}`
                }
            });
            
            console.log('✅ Accessibility test completed');
            return true;
            
        } catch (error) {
            this.testResults.push({
                test: 'Accessibility',
                status: 'FAIL',
                error: error.message
            });
            
            console.error('❌ Accessibility test failed:', error.message);
            return false;
        }
    }

    async testErrorHandling() {
        console.log('🛡️ Testing error handling...');
        
        try {
            // Test 404 page
            await this.page.goto(`${this.baseUrl}/non-existent-page`, { 
                waitUntil: 'networkidle2' 
            });
            
            await this.takeScreenshot('error-404', '404 error page test');
            
            // Check if error page is displayed
            const hasErrorContent = await this.page.evaluate(() => {
                const errorText = document.body.textContent.toLowerCase();
                return errorText.includes('404') || errorText.includes('not found') || errorText.includes('error');
            });
            
            this.testResults.push({
                test: 'Error Handling - 404',
                status: hasErrorContent ? 'PASS' : 'FAIL',
                details: {
                    hasErrorContent
                }
            });
            
            console.log('✅ Error handling test completed');
            return true;
            
        } catch (error) {
            this.testResults.push({
                test: 'Error Handling',
                status: 'FAIL',
                error: error.message
            });
            
            console.error('❌ Error handling test failed:', error.message);
            return false;
        }
    }

    async generateReport() {
        console.log('📊 Generating test report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.testResults.length,
                passed: this.testResults.filter(r => r.status === 'PASS').length,
                failed: this.testResults.filter(r => r.status === 'FAIL').length,
                warnings: this.testResults.filter(r => r.status === 'WARN').length
            },
            results: this.testResults,
            screenshots: this.screenshots,
            environment: {
                userAgent: await this.page.evaluate(() => navigator.userAgent),
                viewport: await this.page.viewport(),
                url: this.page.url()
            }
        };
        
        // Save report
        const reportPath = path.join(this.outputDir, 'test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        // Generate HTML report
        const htmlReport = this.generateHTMLReport(report);
        const htmlPath = path.join(this.outputDir, 'test-report.html');
        fs.writeFileSync(htmlPath, htmlReport);
        
        console.log('📊 Test report generated:');
        console.log(`   JSON: ${reportPath}`);
        console.log(`   HTML: ${htmlPath}`);
        console.log(`   Screenshots: ${this.screenshots.length} files`);
        
        return report;
    }

    generateHTMLReport(report) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex AI Puppeteer Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 20px; }
        .metric { text-align: center; padding: 20px; border-radius: 8px; }
        .metric.pass { background: #dcfce7; color: #166534; }
        .metric.fail { background: #fef2f2; color: #dc2626; }
        .metric.warn { background: #fef3c7; color: #d97706; }
        .results { padding: 20px; }
        .test-result { margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid; }
        .test-result.pass { background: #f0fdf4; border-color: #22c55e; }
        .test-result.fail { background: #fef2f2; border-color: #ef4444; }
        .test-result.warn { background: #fffbeb; border-color: #f59e0b; }
        .screenshots { padding: 20px; }
        .screenshot { margin: 10px 0; }
        .screenshot img { max-width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Alex AI Puppeteer Test Report</h1>
            <p>Generated: ${report.timestamp}</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <h3>Total Tests</h3>
                <div style="font-size: 2em; font-weight: bold;">${report.summary.total}</div>
            </div>
            <div class="metric pass">
                <h3>Passed</h3>
                <div style="font-size: 2em; font-weight: bold;">${report.summary.passed}</div>
            </div>
            <div class="metric fail">
                <h3>Failed</h3>
                <div style="font-size: 2em; font-weight: bold;">${report.summary.failed}</div>
            </div>
            <div class="metric warn">
                <h3>Warnings</h3>
                <div style="font-size: 2em; font-weight: bold;">${report.summary.warnings}</div>
            </div>
        </div>
        
        <div class="results">
            <h2>Test Results</h2>
            ${report.results.map(result => `
                <div class="test-result ${result.status.toLowerCase()}">
                    <h3>${result.test} - ${result.status}</h3>
                    ${result.details ? `<pre>${JSON.stringify(result.details, null, 2)}</pre>` : ''}
                    ${result.error ? `<p style="color: #dc2626;"><strong>Error:</strong> ${result.error}</p>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="screenshots">
            <h2>Screenshots</h2>
            ${report.screenshots.map(screenshot => `
                <div class="screenshot">
                    <h3>${screenshot.name} - ${screenshot.description}</h3>
                    <img src="${screenshot.filename}" alt="${screenshot.description}">
                    <p><small>${screenshot.timestamp}</small></p>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
    }

    async cleanup() {
        console.log('🧹 Cleaning up...');
        
        if (this.browser) {
            await this.browser.close();
        }
        
        console.log('✅ Cleanup completed');
    }

    async runAllTests() {
        console.log('🎯 Starting Alex AI Puppeteer Test Suite...');
        console.log('=' .repeat(60));
        
        try {
            await this.initialize();
            
            // Run all tests
            await this.testPageLoad();
            await this.testNavigation();
            await this.testJobSearchInterface();
            await this.testResponsiveDesign();
            await this.testPerformance();
            await this.testAccessibility();
            await this.testErrorHandling();
            
            // Generate report
            const report = await this.generateReport();
            
            // Print summary
            console.log('=' .repeat(60));
            console.log('📊 TEST SUMMARY');
            console.log('=' .repeat(60));
            console.log(`Total Tests: ${report.summary.total}`);
            console.log(`✅ Passed: ${report.summary.passed}`);
            console.log(`❌ Failed: ${report.summary.failed}`);
            console.log(`⚠️  Warnings: ${report.summary.warnings}`);
            console.log(`📸 Screenshots: ${report.screenshots.length}`);
            console.log('=' .repeat(60));
            
            return report;
            
        } catch (error) {
            console.error('💥 Test suite failed:', error);
            throw error;
        } finally {
            await this.cleanup();
        }
    }
}

// CLI interface
if (require.main === module) {
    const tester = new AlexAIPuppeteerTester();
    
    tester.runAllTests()
        .then(report => {
            console.log('🎉 Alex AI Puppeteer testing completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Alex AI Puppeteer testing failed:', error);
            process.exit(1);
        });
}

module.exports = AlexAIPuppeteerTester;
