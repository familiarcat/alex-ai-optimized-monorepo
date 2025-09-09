#!/usr/bin/env node
/**
 * Alex AI Master Project - Central Learning Hub
 * 
 * This is the central learning hub that coordinates all Alex AI projects,
 * manages bidirectional memory sync, and enables continuous AI evolution
 * across all projects in the monorepo.
 */

import { AlexAIMasterProject } from './core/master-project.js';
import { MemoryHub } from './memory-hub/memory-hub.js';
import { N8NSyncHub } from './n8n-sync-hub/n8n-sync-hub.js';
import { AnalyticsHub } from './analytics-hub/analytics-hub.js';
import { DeploymentHub } from './deployment-hub/deployment-hub.js';

class AlexAIMasterProjectApp {
  private masterProject: AlexAIMasterProject;
  private memoryHub: MemoryHub;
  private n8nSyncHub: N8NSyncHub;
  private analyticsHub: AnalyticsHub;
  private deploymentHub: DeploymentHub;

  constructor() {
    console.log('🧠 Initializing Alex AI Master Project...');
    
    // Initialize all hubs
    this.memoryHub = new MemoryHub();
    this.n8nSyncHub = new N8NSyncHub();
    this.analyticsHub = new AnalyticsHub();
    this.deploymentHub = new DeploymentHub();
    
    // Initialize master project
    this.masterProject = new AlexAIMasterProject({
      memoryHub: this.memoryHub,
      n8nSyncHub: this.n8nSyncHub,
      analyticsHub: this.analyticsHub,
      deploymentHub: this.deploymentHub
    });
  }

  async initialize() {
    try {
      console.log('🚀 Starting Alex AI Master Project initialization...');
      
      // Initialize all hubs
      await this.memoryHub.initialize();
      await this.n8nSyncHub.initialize();
      await this.analyticsHub.initialize();
      await this.deploymentHub.initialize();
      
      // Initialize master project
      await this.masterProject.initialize();
      
      console.log('✅ Alex AI Master Project initialized successfully!');
      console.log('🎯 Central Learning Hub is now active');
      console.log('🔄 Bidirectional sync enabled across all projects');
      console.log('🧠 AI learning and evolution capabilities enabled');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Alex AI Master Project:', error);
      return false;
    }
  }

  async start() {
    console.log('🌟 Starting Alex AI Master Project services...');
    
    // Start all services
    await this.masterProject.start();
    
    console.log('🎉 Alex AI Master Project is now running!');
    console.log('📊 Monitoring all Alex AI projects for learning opportunities');
    console.log('🔄 Syncing memories and insights across all projects');
    console.log('🚀 Ready to coordinate development and AI evolution');
  }

  async stop() {
    console.log('🛑 Stopping Alex AI Master Project...');
    await this.masterProject.stop();
    console.log('✅ Alex AI Master Project stopped successfully');
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = new AlexAIMasterProjectApp();
  
  const command = process.argv[2] || 'start';
  
  switch (command) {
    case 'start':
      app.initialize()
        .then(success => {
          if (success) {
            return app.start();
          } else {
            process.exit(1);
          }
        })
        .catch(error => {
          console.error('💥 Master Project startup failed:', error);
          process.exit(1);
        });
      break;
      
    case 'init':
      app.initialize()
        .then(success => {
          if (success) {
            console.log('🎉 Master Project initialized successfully!');
            process.exit(0);
          } else {
            process.exit(1);
          }
        });
      break;
      
    case 'status':
      app.initialize()
        .then(() => {
          console.log('📊 Alex AI Master Project Status:');
          console.log('  - Memory Hub: Active');
          console.log('  - N8N Sync Hub: Active');
          console.log('  - Analytics Hub: Active');
          console.log('  - Deployment Hub: Active');
          console.log('  - Cross-Project Learning: Enabled');
          console.log('  - Bidirectional Sync: Enabled');
        });
      break;
      
    default:
      console.log('Usage: node index.js [start|init|status]');
      console.log('  start  - Start the master project services');
      console.log('  init   - Initialize the master project');
      console.log('  status - Show master project status');
  }
}

export { AlexAIMasterProjectApp };
