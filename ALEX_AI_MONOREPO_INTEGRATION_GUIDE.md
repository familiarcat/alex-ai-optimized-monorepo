# Alex AI Monorepo Integration Guide
## Universal Integration for All Sub-Projects

This guide explains how to integrate Alex AI into any sub-project within the monorepo, providing universal access to the Alex AI system, N8N Federation Crew, and all advanced capabilities.

---

## 🚀 **Quick Start**

### **1. Install Alex AI Core Package**
```bash
# In your sub-project directory
pnpm add @alex-ai/core
```

### **2. Basic Integration**
```typescript
import { initializeAlexAI, getAlexAI } from '@alex-ai/core'

// Initialize Alex AI
const alexAI = await initializeAlexAI({
  environment: 'development',
  enableN8NIntegration: true,
  enableStealthScraping: true,
  enableCrewManagement: true
})

// Use Alex AI services
const status = await alexAI.getStatus()
console.log('Alex AI Status:', status)
```

### **3. Access All Services**
```typescript
// Get individual services
const credentialsManager = alexAI.getCredentialsManager()
const dataService = alexAI.getDataService()
const stealthService = alexAI.getStealthService()
const crewManager = alexAI.getCrewManager()
```

---

## 🔧 **Service Integration**

### **N8N Federation Crew Integration**
```typescript
import { getAlexAI } from '@alex-ai/core'

const alexAI = getAlexAI()
const credentialsManager = alexAI.getCredentialsManager()

// Get all credentials from N8N Federation Crew
const credentials = await credentialsManager.getCredentials()

// Get specific credentials
const supabaseCreds = await credentialsManager.getSupabaseCredentials()
const n8nCreds = await credentialsManager.getN8NCredentials()
const openaiCreds = await credentialsManager.getOpenAICredentials()

// Test connection
const isConnected = await credentialsManager.testConnection()
```

### **Unified Data Service**
```typescript
import { getAlexAI } from '@alex-ai/core'

const alexAI = getAlexAI()
const dataService = alexAI.getDataService()

// Get job opportunities (tries N8N → Supabase → Local fallback)
const jobs = await dataService.getJobOpportunities()

// Get contacts
const contacts = await dataService.getContacts()

// Check data sources
const sources = dataService.getDataSources()
console.log('Available data sources:', sources)
```

### **Stealth Scraping Service**
```typescript
import { getAlexAI } from '@alex-ai/core'

const alexAI = getAlexAI()
const stealthService = alexAI.getStealthService()

// Start stealth scraping job
const job = await stealthService.startScrapingJob({
  source: 'linkedin',
  searchTerm: 'AI Engineer',
  location: 'St. Louis, MO',
  maxResults: 10
})

// Check job status
const status = stealthService.getJobStatus(job.id)
console.log('Scraping job status:', status)

// Get all jobs
const allJobs = stealthService.getAllJobs()
```

### **Crew Management**
```typescript
import { getAlexAI } from '@alex-ai/core'

const alexAI = getAlexAI()
const crewManager = alexAI.getCrewManager()

// Get all crew members
const members = crewManager.getCrewMembers()
console.log('Alex AI Crew:', members)

// Assign task to crew member
const interaction = await crewManager.assignTask('technical_lead', {
  type: 'code_review',
  data: { file: 'src/app.ts', priority: 'high' }
})

// Complete task
await crewManager.completeTask(interaction.id, {
  result: 'Code review completed',
  recommendations: ['Add error handling', 'Optimize performance']
})

// Get crew analytics
const analytics = crewManager.getCrewAnalytics()
```

---

## 🎯 **Project-Specific Integration Examples**

### **Next.js Application**
```typescript
// pages/api/alex-ai/status.ts
import { getAlexAI } from '@alex-ai/core'

export default async function handler(req, res) {
  const alexAI = getAlexAI()
  const status = await alexAI.getStatus()
  
  res.status(200).json(status)
}

// pages/api/alex-ai/scrape.ts
import { getAlexAI } from '@alex-ai/core'

export default async function handler(req, res) {
  const alexAI = getAlexAI()
  const stealthService = alexAI.getStealthService()
  
  const job = await stealthService.startScrapingJob(req.body)
  
  res.status(200).json({ jobId: job.id, status: job.status })
}
```

### **React Component**
```typescript
// components/AlexAIIntegration.tsx
import React, { useEffect, useState } from 'react'
import { getAlexAI, type AlexAIStatus } from '@alex-ai/core'

export function AlexAIIntegration() {
  const [status, setStatus] = useState<AlexAIStatus | null>(null)
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const alexAI = getAlexAI()
      const status = await alexAI.getStatus()
      const dataService = alexAI.getDataService()
      const jobs = await dataService.getJobOpportunities()
      
      setStatus(status)
      setJobs(jobs)
    }

    loadData()
  }, [])

  return (
    <div>
      <h2>Alex AI Status</h2>
      <p>Initialized: {status?.isInitialized ? 'Yes' : 'No'}</p>
      <p>N8N Connection: {status?.n8nConnection ? 'Connected' : 'Disconnected'}</p>
      
      <h3>Job Opportunities ({jobs.length})</h3>
      {jobs.map(job => (
        <div key={job.id}>
          <h4>{job.position} at {job.company}</h4>
          <p>Location: {job.location}</p>
          <p>Alex AI Score: {job.alex_ai_score}</p>
        </div>
      ))}
    </div>
  )
}
```

### **Node.js Service**
```typescript
// services/alex-ai-service.ts
import { initializeAlexAI, getAlexAI } from '@alex-ai/core'

export class MyService {
  private alexAI: any

  async initialize() {
    this.alexAI = await initializeAlexAI({
      environment: 'production',
      enableN8NIntegration: true,
      enableStealthScraping: true,
      enableCrewManagement: true,
      logLevel: 'info'
    })
  }

  async processJobSearch(query: string, location: string) {
    const stealthService = this.alexAI.getStealthService()
    const crewManager = this.alexAI.getCrewManager()

    // Start scraping job
    const scrapingJob = await stealthService.startScrapingJob({
      source: 'linkedin',
      searchTerm: query,
      location: location,
      maxResults: 20
    })

    // Assign analysis task to AI Strategy crew member
    const analysisTask = await crewManager.assignTask('ai_strategy', {
      type: 'job_analysis',
      data: {
        query: query,
        location: location,
        scrapingJobId: scrapingJob.id
      }
    })

    return {
      scrapingJob,
      analysisTask
    }
  }
}
```

---

## 🔐 **Credential Management**

### **Automatic Credential Loading**
Alex AI automatically loads credentials from:
1. **N8N Federation Crew** (primary source)
2. **~/.zshrc** (fallback for development)
3. **Environment variables** (fallback)

### **Manual Credential Override**
```typescript
import { getAlexAI } from '@alex-ai/core'

const alexAI = getAlexAI()

// Update configuration
alexAI.updateConfig({
  environment: 'production',
  enableN8NIntegration: false, // Disable N8N, use local credentials
  logLevel: 'debug'
})
```

---

## 🧪 **Testing Integration**

### **Run Alex AI Tests**
```typescript
import { getAlexAI } from '@alex-ai/core'

const alexAI = getAlexAI()

// Run comprehensive tests
const testResults = await alexAI.runTests()
console.log('Test Results:', testResults)
```

### **Test Individual Services**
```typescript
// Test credentials manager
const credentialsTest = await alexAI.getCredentialsManager().testConnection()

// Test data service
const dataTest = await alexAI.getDataService().testConnection()

// Test stealth service
const stealthTest = await alexAI.getStealthService().testConnection()

// Test crew manager
const crewTest = await alexAI.getCrewManager().testConnection()
```

---

## 📊 **Monitoring and Analytics**

### **System Status**
```typescript
import { getAlexAIStatus } from '@alex-ai/core'

const status = await getAlexAIStatus()
console.log('Alex AI System Status:', {
  initialized: status.isInitialized,
  n8nConnection: status.n8nConnection,
  supabaseConnection: status.supabaseConnection,
  crewStatus: status.crewStatus,
  version: status.version
})
```

### **Crew Analytics**
```typescript
const crewManager = alexAI.getCrewManager()
const analytics = crewManager.getCrewAnalytics()

console.log('Crew Analytics:', {
  totalMembers: analytics.totalMembers,
  activeMembers: analytics.activeMembers,
  busyMembers: analytics.busyMembers,
  lastUpdate: analytics.lastUpdate
})
```

---

## 🚀 **Deployment Integration**

### **CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy with Alex AI
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Load Alex AI Credentials
        run: ./scripts/load-credentials.sh
        
      - name: Test Alex AI Integration
        run: |
          node -e "
          const { getAlexAI } = require('@alex-ai/core');
          const alexAI = getAlexAI();
          alexAI.runTests().then(console.log);
          "
          
      - name: Deploy
        run: pnpm run deploy
```

### **Environment Configuration**
```bash
# .env.local
ALEX_AI_ENVIRONMENT=production
ALEX_AI_ENABLE_N8N=true
ALEX_AI_ENABLE_STEALTH_SCRAPING=true
ALEX_AI_ENABLE_CREW_MANAGEMENT=true
ALEX_AI_LOG_LEVEL=info
```

---

## 🎯 **Best Practices**

### **1. Initialize Once**
```typescript
// Initialize Alex AI once in your application
const alexAI = await initializeAlexAI(config)

// Use getAlexAI() everywhere else
const alexAI = getAlexAI()
```

### **2. Error Handling**
```typescript
try {
  const alexAI = getAlexAI()
  const jobs = await alexAI.getDataService().getJobOpportunities()
} catch (error) {
  console.error('Alex AI error:', error)
  // Fallback to local data or show error message
}
```

### **3. Configuration Management**
```typescript
// Use environment-specific configuration
const config = {
  environment: process.env.NODE_ENV || 'development',
  enableN8NIntegration: process.env.ALEX_AI_ENABLE_N8N === 'true',
  enableStealthScraping: process.env.ALEX_AI_ENABLE_STEALTH_SCRAPING === 'true',
  logLevel: process.env.ALEX_AI_LOG_LEVEL || 'info'
}

const alexAI = await initializeAlexAI(config)
```

### **4. Resource Cleanup**
```typescript
// Cleanup on application shutdown
process.on('SIGINT', async () => {
  const alexAI = getAlexAI()
  await alexAI.shutdown()
  process.exit(0)
})
```

---

## 🎉 **Conclusion**

With this integration guide, any sub-project in the monorepo can easily integrate with the Alex AI system and access:

- ✅ **N8N Federation Crew** integration
- ✅ **Universal credential management**
- ✅ **Stealth scraping capabilities**
- ✅ **Crew management and coordination**
- ✅ **Unified data services**
- ✅ **Comprehensive testing**
- ✅ **Production-ready deployment**

**Alex AI is now available throughout your entire monorepo ecosystem!** 🚀
