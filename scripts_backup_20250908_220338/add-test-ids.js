// Script to add data-testid attributes to dashboard buttons
// This should be injected into the page or added to the component

const addTestIds = () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    const text = button.textContent;
    if (text.includes('Job Scraping Dashboard')) {
      button.setAttribute('data-testid', 'job-scraping-dashboard-btn');
    } else if (text.includes('Stealth Scraping Dashboard')) {
      button.setAttribute('data-testid', 'stealth-scraping-dashboard-btn');
    } else if (text.includes('Scheduled Scraping Dashboard')) {
      button.setAttribute('data-testid', 'scheduled-scraping-dashboard-btn');
    } else if (text.includes('Alex AI Crew Dashboard')) {
      button.setAttribute('data-testid', 'alex-ai-crew-dashboard-btn');
    } else if (text.includes('N8N Unification Dashboard')) {
      button.setAttribute('data-testid', 'n8n-unification-dashboard-btn');
    } else if (text.includes('End-to-End Tests')) {
      button.setAttribute('data-testid', 'end-to-end-tests-btn');
    } else if (text.includes('System Fidelity Tests')) {
      button.setAttribute('data-testid', 'system-fidelity-tests-btn');
    } else if (text.includes('Data Source Test')) {
      button.setAttribute('data-testid', 'data-source-test-btn');
    } else if (text.includes('Auto Stealth Scraping')) {
      button.setAttribute('data-testid', 'auto-stealth-scraping-btn');
    }
  });
};

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addTestIds);
} else {
  addTestIds();
}
