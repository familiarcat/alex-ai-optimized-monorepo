/**
 * Alex AI Core Package - Central Integration Hub
 * 
 * This package provides the core Alex AI functionality that all sub-projects
 * in the monorepo can use to integrate with the Alex AI system.
 */

// Main Alex AI Manager
export { 
  AlexAIManager, 
  initializeAlexAI, 
  getAlexAI, 
  getAlexAIStatus,
  type AlexAIConfig,
  type AlexAIStatus
} from './alex-ai-manager'

// Core Services
export { N8NCredentialsManager } from './n8n-credentials-manager'
export { UnifiedDataService, type DataSource, type UnifiedDataConfig } from './unified-data-service'
export { StealthScrapingService, type StealthConfig, type ScrapingJob } from './stealth-scraping-service'
export { AlexAICrewManager, type CrewMember, type CrewInteraction, type CrewStatus } from './crew-manager'

// Default export
export { default } from './alex-ai-manager'
