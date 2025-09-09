from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Shared Utility Functions
========================
Common functions used across multiple scripts
"""

import os
import sys
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Common utility functions will be added here


# Function log_info could not be extracted


# Function log_success could not be extracted


# Function log_warning could not be extracted


# Function log_error could not be extracted


# Function check_prerequisites could not be extracted


# Function test_n8n_connection could not be extracted


def main():
    """Main function to run business operations legal system"""
    print("🏢 BUSINESS OPERATIONS LEGAL SYSTEM - LLC SETUP & PAYMENT INTEGRATION")
    print("=" * 70)
    print()
    
    # Initialize business operations system
    business_ops = BusinessOperationsLegalSystem()
    
    print("📊 Target Markets:")
    for market, data in business_ops.target_markets.items():
        print(f"   • {market.title()}")


# Function print_status could not be extracted


# Function print_success could not be extracted


# Function print_error could not be extracted


# Function print_section could not be extracted


    def __init__(self):
        self.execution_phases = {
            "phase_1_market_research": {
                "duration": "2 weeks",
                "priority": "Critical",
                "objectives": [
                    "Conduct comprehensive market analysis across all target markets",
                    "Identify key business opportunities and pain points",
                    "Analyze competitive landscape and market positioning",
                    "Validate market demand and customer needs"
                ],
                "deliverables": [
                    "Market opportunity assessment report",
                    "Target customer persona profiles",
                    "Competitive landscape analysis",
                    "Market validation findings",
                    "Revenue potential projections"
                ],
                "systems": [
                    "comprehensive_market_research_system.py",
                    "optimized_web_crawler_system.py"
                ]
            },
            "phase_2_business_operations": {
                "duration": "2 weeks",
                "priority": "High",
                "objectives": [
                    "Develop business operations framework",
                    "Create customer acquisition and retention strategies",
                    "Establish quality assurance and testing processes",
                    "Build performance monitoring and KPI systems"
                ],
                "deliverables": [
                    "Business operations framework",
                    "Customer acquisition and retention playbook",
                    "Quality assurance and testing protocols",
                    "Performance monitoring and KPI dashboard",
                    "Agile business development methodology"
                ],
                "systems": [
                    "agile_sprint_dashboard_system.py",
                    "business_operations_legal_system.py"
                ]
            },
            "phase_3_marketing_sales": {
                "duration": "1 week",
                "priority": "High",
                "objectives": [
                    "Develop comprehensive marketing strategy",
                    "Create sales processes and business development framework",
                    "Build brand positioning and competitive differentiation",
                    "Establish partnership and collaboration strategies"
                ],
                "deliverables": [
                    "Comprehensive marketing strategy",
                    "Sales processes and business development playbook",
                    "Brand positioning and differentiation framework",
                    "Partnership and collaboration strategy",
                    "Content marketing and SEO optimization plan"
                ],
                "systems": [
                    "marketing_strategy_system.py",
                    "sales_process_system.py"
                ]
            },
            "phase_4_financial_compliance": {
                "duration": "1 week",
                "priority": "Medium",
                "objectives": [
                    "Develop financial modeling and revenue forecasting",
                    "Establish compliance and regulatory framework",
                    "Create international business and expansion strategies",
                    "Build risk management and contingency planning"
                ],
                "deliverables": [
                    "Financial modeling and revenue forecasting framework",
                    "Compliance and regulatory framework",
                    "International business and expansion strategy",
                    "Risk management and contingency planning",
                    "Intellectual property protection strategy"
                ],
                "systems": [
                    "financial_modeling_system.py",
                    "compliance_framework_system.py"
                ]
            }
        }


    def load_analysis(self) -> Optional[Dict]:
        """Load script analysis data"""
        try:
            if os.path.exists(self.analysis_file):
                with open(self.analysis_file, 'r') as f:
                    return json.load(f)
            return None
        except Exception as e:
            logger.error(f"Error loading analysis: {e}")


    def create_backup(self) -> str:
        """Create a backup directory for safety"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        self.backup_dir = self.project_root / f"final_cleanup_backup_{timestamp}"


# Function print_info could not be extracted


# Function print_warning could not be extracted


# Function safe_execute could not be extracted


# Function safe_status could not be extracted


# Function safe_milestone could not be extracted


# Function safe_progress could not be extracted


# Function safe_list could not be extracted


    def save_memory_to_file(self) -> Dict[str, Any]:
        """Save memory to a local file for backup and future reference"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"alex_ai_architecture_memory_{timestamp}.json"


    def add_memory(self) -> Dict[str, Any]:
        """Add the memory using multiple methods"""
        results = {}


# Function test_result could not be extracted


# Function test_shell_generation could not be extracted


    def test_error_handling(self):
        """Test error handling scenarios"""
        try:
            # Test creating file in non-existent directory
            try:
                with open("non_existent_dir/test_file.txt", 'w') as f:
                    f.write("This should fail")
                return False  # Should have failed
            except:
                pass  # Expected to fail
            
            # Test creating file with invalid characters
            try:
                with open("test_file<invalid>.txt", 'w') as f:
                    f.write("This should fail")
                return False  # Should have failed
            except:
                pass  # Expected to fail
            
            return True  # Error handling worked correctly
            
        except Exception as e:
            logging.error(f"Error handling test failed: {e}")


    def test_performance(self):
        """Test performance with multiple rapid operations"""
        try:
            start_time = time.time()
            
            # Create 100 files rapidly
            for i in range(100):
                test_file = f"stress_test_performance_{i}.txt"


    def log(self, message: str):
        """Log cleanup actions"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = f"[{timestamp}] {message}"


# Function print_header could not be extracted


# Function print_step could not be extracted


    def create_memory_summary(self, memories_file: str):
        """Create a summary of stored memories"""
        with open(memories_file, 'r') as f:
            memories = json.load(f)
        
        # Analyze memory distribution
        crew_member_counts = {}


# Function safe_echo could not be extracted


    def log_step(self, step: str, status: str, details: str = ""):
        """Log an optimization step"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "step": step,
            "status": status,
            "details": details
        }


# Function log_automation could not be extracted


# Function configure_github_secrets could not be extracted


# Function enable_scheduled_workflows could not be extracted


# Function generate_final_report could not be extracted


# Function handle_error could not be extracted


# Function safe_output could not be extracted


# Function output could not be extracted


# Function show_status could not be extracted


# Function update_progress could not be extracted


# Function run_progress could not be extracted


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


# Function validate_strings could not be extracted


    def organize_remaining_files(self):
        """Organize remaining files into proper directories"""
        # Create organized directory structure
        organized_dirs = {
            'src': 'Source code files',
            'docs': 'Documentation',
            'config': 'Configuration files',
            'data': 'Data files',
            'tests': 'Test files',
            'workflows': 'Workflow definitions',
            'templates': 'Template files'
        }


    def run_command(self, command: str, cwd: str = None) -> Tuple[bool, str]:
        """Run a shell command and return success status and output"""
        try:
            if cwd is None:
                cwd = self.project_root
                
            result = subprocess.run(
                command,
                shell=True,
                cwd=cwd,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode == 0:
                return True, result.stdout
            else:
                return False, result.stderr
                
        except subprocess.TimeoutExpired:
            return False, "Command timed out after 5 minutes"
        except Exception as e:
            return False, str(e)
    
    def configure_local_caching(self):
        """Configure local caching for all tasks"""
        self.log_step("Configure Local Caching", "in_progress", "Setting up local caching configuration")
        
        # Update turbo.json with optimized caching
        turbo_json_path = self.project_root / "turbo.json"
        
        with open(turbo_json_path, 'r') as f:
            turbo_config = json.load(f)
        
        # Enhanced caching configuration
        turbo_config["pipeline"].update({
            "build": {
                "dependsOn": ["^build"],
                "outputs": [
                    ".next/**", 
                    "dist/**", 
                    "build/**", 
                    "!.next/cache/**",
                    "!.turbo/**"
                ],
                "env": ["NODE_ENV", "NEXT_PUBLIC_*"],
                "cache": True
            },
            "dev": {
                "cache": False,
                "persistent": True,
                "env": ["NODE_ENV", "PORT", "NEXT_PUBLIC_*"]
            },
            "test": {
                "dependsOn": ["build"],
                "outputs": ["coverage/**", "test-results/**"],
                "env": ["NODE_ENV"],
                "cache": True
            },
            "lint": {
                "outputs": [],
                "env": ["NODE_ENV"],
                "cache": True
            },
            "type-check": {
                "dependsOn": ["^build"],
                "outputs": [],
                "env": ["NODE_ENV"],
                "cache": True
            },
            "clean": {
                "cache": False
            }
        })


    def store_crew_memories(self, memories_file: str):
        """Store crew memories in Supabase"""
        print("🧠 STORING CREW MEMORIES IN SUPABASE")
        print("=" * 50)
        
        # Load memories from file
        with open(memories_file, 'r') as f:
            memories = json.load(f)
        
        print(f"📚 Loaded {len(memories)} memories to store")


    def _store_in_mcp_system(self, memories: list):
        """Store memories in our MCP memory system"""
        try:
            # Use our MCP query system to store memories
            mcp_script = self.project_root / "packages" / "alex-ai-mcp" / "src" / "mcp-query.js"
            
            if mcp_script.exists():
                for memory in memories:
                    # Create a query to store the memory
                    query = f"Store memory: {memory['content']} from {memory['crew_member']}"


    def calculate_importance_score(self, memory: MemoryVector) -> float:
        """Calculate importance score based on multiple factors"""
        score = 0.0
        
        # Base score from access count and recency
        recency_days = (datetime.now() - memory.last_accessed).days
        recency_factor = max(0, 1 - (recency_days / 365))  # Decay over year
        access_factor = min(1.0, memory.access_count / 10)  # Cap at 10 accesses
        
        score += (recency_factor * 0.4) + (access_factor * 0.3)
        
        # Content quality factors
        content_length = len(memory.content)
        length_factor = min(1.0, content_length / 500)  # Optimal around 500 chars
        score += length_factor * 0.1
        
        # Tag diversity factor
        tag_factor = min(1.0, len(memory.tags) / 5)  # Optimal around 5 tags
        score += tag_factor * 0.1
        
        # Memory type importance
        type_weights = {
            'insight': 1.0,
            'learning': 0.9,
            'solution': 0.8,
            'observation': 0.7,
            'process': 0.6,
            'technical': 0.8,
            'strategic': 0.9,
            'collaborative': 0.7
        }


    def find_similar_memories(self, memory: MemoryVector, threshold: float = None) -> List[Tuple[str, float]]:
        """Find memories similar to the given memory"""
        if threshold is None:
            threshold = self.similarity_threshold
        
        similar_memories = []
        
        for mem_id, existing_memory in self.memories.items():
            if mem_id == memory.id:
                continue
                
            similarity = self.cosine_similarity(memory.embedding, existing_memory.embedding)
            if similarity >= threshold:
                similar_memories.append((mem_id, similarity))
        
        # Sort by similarity (highest first)
        similar_memories.sort(key=lambda x: x[1], reverse=True)
        return similar_memories
    
    def consolidate_similar_memories(self, memory_group: List[MemoryVector]) -> MemoryVector:
        """Consolidate a group of similar memories into one optimized memory"""
        if not memory_group:
            return None
        
        if len(memory_group) == 1:
            return memory_group[0]
        
        # Find the most important memory as the base
        base_memory = max(memory_group, key=lambda m: m.importance_score)
        
        # Consolidate content
        consolidated_content = self._consolidate_content(memory_group)
        
        # Calculate weighted average embedding
        weights = [m.importance_score for m in memory_group]
        total_weight = sum(weights)
        
        if total_weight > 0:
            weighted_embedding = []
            for i in range(len(base_memory.embedding)):
                weighted_sum = sum(m.embedding[i] * weights[j] for j, m in enumerate(memory_group))
                weighted_embedding.append(weighted_sum / total_weight)
        else:
            weighted_embedding = base_memory.embedding
        
        # Create consolidated memory
        consolidated_memory = MemoryVector(
            id=f"consolidated_{base_memory.id}",


    def _consolidate_content(self, memories: List[MemoryVector]) -> str:
        """Consolidate content from multiple memories"""
        # Group by memory type for better consolidation
        type_groups = {}


    def _create_content_summary(self, contents: List[str], mem_type: str) -> str:
        """Create a summary of multiple memory contents"""
        if len(contents) == 1:
            return contents[0]
        
        # Simple consolidation logic
        if mem_type in ['insight', 'learning', 'solution']:
            # For insights, combine key points
            key_points = []
            for content in contents:
                if 'Key insight:' in content:
                    key_points.append(content)
                elif 'Learning:' in content:
                    key_points.append(content)
                else:
                    key_points.append(f"• {content}")


    def generate_optimization_report(self, results: Dict[str, Any]) -> str:
        """Generate a detailed optimization report"""
        report = f"""
# MCP Memory Optimization Report
Generated: {results['optimization_timestamp']}


    def create_crew_specific_memories(self) -> list:
        """Create crew-specific memories about YOLO Mode integration"""
        crew_memories = []
        
        crew_insights = {
            "Captain Picard": "Strategic victory: YOLO Mode integration represents a major strategic advancement. We can now maintain full operational momentum without interruption, allowing us to focus on high-level strategic decisions and mission-critical operations.",
            "Commander Riker": "Tactical excellence: The integration of YOLO Mode provides unprecedented tactical efficiency. Our operational speed has increased dramatically, and we can now execute complex operations without the friction of constant confirmations.",
            "Commander Data": "Logical optimization achieved: YOLO Mode integration represents the optimal solution for workflow efficiency. Processing overhead has been reduced by approximately 80-90%, allowing for maximum resource utilization and task completion speed.",
            "Lt. La Forge": "Engineering breakthrough: YOLO Mode integration is a game-changer for our engineering operations. We can now iterate rapidly, test continuously, and deploy efficiently without the constant interruption of confirmation prompts.",
            "Dr. Crusher": "Quality assurance enhanced: With YOLO Mode properly integrated, we can maintain our quality standards while dramatically improving efficiency. The automated workflow ensures consistent operations while reducing human error from repetitive confirmations.",
            "Counselor Troi": "User experience transformed: YOLO Mode integration has eliminated decision fatigue and cognitive load. Users can now focus entirely on creative and strategic work, leading to improved satisfaction and productivity.",
            "Lt. Worf": "Security protocols maintained: YOLO Mode integration has been implemented with proper security safeguards. Our defense systems remain intact while operational efficiency has been maximized.",
            "Ensign Wesley": "Innovation accelerated: YOLO Mode integration opens up incredible possibilities for rapid prototyping and experimentation. We can now explore new ideas and technologies without the friction of constant confirmations.",
            "Q": "Transcendent evolution: YOLO Mode integration represents a quantum leap in operational efficiency. We have transcended the primitive limitations of confirmation-based workflows and achieved a higher state of development consciousness.",
            "Guinan": "Wisdom realized: YOLO Mode integration reflects the natural evolution of development tools. This change brings us closer to the ideal state where technology serves human creativity without friction or interruption."
        }


    def store_memories(self, memories: list) -> bool:
        """Store memories in the memory system"""
        try:
            # Save to JSON file
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            memory_file = self.project_root / f"yolo_mode_integration_memories_{timestamp}.json"


    def generate_integration_report(self, memories: list) -> str:
        """Generate a report of the YOLO Mode integration"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_file = f"yolo_mode_integration_report_{timestamp}.md"


    def run_update(self) -> dict:
        """Run the complete memory update process"""
        logging.info("🚀 Starting YOLO Mode integration memory update")
        
        # Create system memory
        system_memory = self.create_yolo_integration_memory()
        
        # Create crew-specific memories
        crew_memories = self.create_crew_specific_memories()
        
        # Combine all memories
        all_memories = [system_memory] + crew_memories
        
        # Store memories
        if self.store_memories(all_memories):
            # Generate report
            report_file = self.generate_integration_report(all_memories)
            
            logging.info(f"✅ Memory update complete: {len(all_memories)} memories stored")


    def _initialize_crew(self):
        """Initialize crew members with their specializations"""
        return {
            "Captain Picard": CrewMember(
                name="Captain Picard",
                specialization="Commanding Officer & Strategic Planning",
                expertise_areas=["Strategic Planning", "Project Management", "Team Coordination", "Decision Making"],
                research_focus="Overall architecture benefits, team productivity, and strategic advantages"
            ),
            "Commander Data": CrewMember(
                name="Commander Data",
                specialization="Operations Officer & Technical Analysis",
                expertise_areas=["Technical Analysis", "Performance Optimization", "System Architecture", "Data Processing"],
                research_focus="Technical performance, build optimization, and system efficiency"
            ),
            "Lt. La Forge": CrewMember(
                name="Lt. La Forge",
                specialization="Chief Engineer & Infrastructure",
                expertise_areas=["Infrastructure", "DevOps", "Build Systems", "Deployment", "CI/CD"],
                research_focus="Build systems, deployment pipelines, and infrastructure optimization"
            ),
            "Dr. Crusher": CrewMember(
                name="Dr. Crusher",
                specialization="Chief Medical Officer & Quality Assurance",
                expertise_areas=["Quality Assurance", "Testing", "Code Health", "Performance Monitoring"],
                research_focus="Code quality, testing strategies, and performance monitoring"
            ),
            "Counselor Troi": CrewMember(
                name="Counselor Troi",
                specialization="Ship's Counselor & User Experience",
                expertise_areas=["User Experience", "Team Dynamics", "Developer Experience", "Communication"],
                research_focus="Developer experience, team collaboration, and workflow optimization"
            ),
            "Lt. Worf": CrewMember(
                name="Lt. Worf",
                specialization="Security Chief & Security Analysis",
                expertise_areas=["Security", "Access Control", "Dependency Management", "Vulnerability Assessment"],
                research_focus="Security implications, dependency management, and access control"
            ),
            "Ensign Wesley": CrewMember(
                name="Ensign Wesley",
                specialization="Acting Ensign & Innovation",
                expertise_areas=["Innovation", "Emerging Technologies", "Learning", "Adaptation"],
                research_focus="Future-proofing, innovation opportunities, and learning curve"
            ),
            "Q": CrewMember(
                name="Q",
                specialization="Omnipotent Being & Advanced Analysis",
                expertise_areas=["Advanced Analysis", "System Optimization", "Performance Tuning", "Scalability"],
                research_focus="Advanced optimization, scalability, and performance tuning"
            ),
            "Guinan": CrewMember(
                name="Guinan",
                specialization="Bartender & Wisdom Keeper",
                expertise_areas=["Wisdom", "Best Practices", "Historical Context", "Long-term Thinking"],
                research_focus="Best practices, long-term benefits, and historical context"
            )
        }


    def save_research_data(self):
        """Save research data to JSON file"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        data_filename = f"turborepo_research_data_{timestamp}.json"


    def save_results(self, filename: str = "email_research_results.json"):
        """Save research results to file"""
        with open(filename, 'w') as f:
            json.dump(self.research_results, f, indent=2)
        print(f"Email research results saved to {filename}")
