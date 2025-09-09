const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from ~/.zshrc
const SUPABASE_URL = 'https://rpkkkbufdwxmjaerbhbn.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HEREibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU'
const N8N_URL = 'https://n8n.pbradygeorgen.com'
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERMjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw'
const OPENAI_API_KEY = 'your_openai_api_key_here'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Alex AI Crew Memory Integration
class AlexAIMemorySystem {
  constructor() {
    this.memories = new Map()
    this.vectors = new Map()
  }

  // Store memory with vector embedding
  async storeMemory(key, data, type = 'job_analysis') {
    const memory = {
      id: key,
      type,
      data,
      timestamp: new Date().toISOString(),
      vector: await this.generateVector(data)
    }
    
    this.memories.set(key, memory)
    this.vectors.set(key, memory.vector)
    
    // Store in Supabase
    await this.storeInSupabase(memory)
    
    return memory
  }

  // Generate vector embedding for memory
  async generateVector(data) {
    // This would integrate with OpenAI embeddings in production
    const text = typeof data === 'string' ? data : JSON.stringify(data)
    return text.split('').map(char => char.charCodeAt(0) % 100) // Simplified vector
  }

  // Store memory in Supabase
  async storeInSupabase(memory) {
    try {
      const { error } = await supabase
        .from('alex_ai_memories')
        .insert({
          memory_id: memory.id,
          memory_type: memory.type,
          memory_data: memory.data,
          memory_vector: memory.vector,
          created_at: memory.timestamp
        })
      
      if (error) {
        console.log('Memory storage error (table may not exist yet):', error.message)
      }
    } catch (error) {
      console.log('Memory storage skipped:', error.message)
    }
  }

  // Find similar memories using vector similarity
  async findSimilarMemories(query, threshold = 0.7) {
    const queryVector = await this.generateVector(query)
    const similarities = []
    
    for (const [key, vector] of this.vectors) {
      const similarity = this.cosineSimilarity(queryVector, vector)
      if (similarity > threshold) {
        similarities.push({
          key,
          similarity,
          memory: this.memories.get(key)
        })
      }
    }
    
    return similarities.sort((a, b) => b.similarity - a.similarity)
  }

  // Calculate cosine similarity between vectors
  cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }
}

async function setupAlexAIDatabase() {
  try {
    console.log('🚀 Setting up Alex AI integrated database...')
    
    const alexAI = new AlexAIMemorySystem()
    
    // Load comprehensive job data
    const jobsDataRaw = JSON.parse(fs.readFileSync('../Job_Opportunities_30_Plus_Database.json', 'utf8'))
    const jobsData = jobsDataRaw.job_opportunities_database.opportunities
    console.log(`📊 Loaded ${jobsData.length} job opportunities`)

    // Load contacts data
    const contactsDataRaw = JSON.parse(fs.readFileSync('../HR_Email_Database_Comprehensive.json', 'utf8'))
    const contactsData = []
    
    // Flatten contacts structure
    Object.values(contactsDataRaw.hr_email_database.companies).forEach(company => {
      if (company.primary_hr_contacts) {
        company.primary_hr_contacts.forEach(contact => {
          contactsData.push({
            company: company.company_name,
            name: contact.name || 'HR Contact',
            title: contact.title || 'HR Representative',
            email: contact.email,
            linkedin_url: contact.linkedin_url || '',
            contact_type: 'HR',
            confidence_level: contact.confidence_level || 'medium'
          })
        })
      }
      if (company.hiring_managers) {
        company.hiring_managers.forEach(contact => {
          contactsData.push({
            company: company.company_name,
            name: contact.name || 'Hiring Manager',
            title: contact.title || 'Hiring Manager',
            email: contact.email,
            linkedin_url: contact.linkedin_url || '',
            contact_type: 'Hiring Manager',
            confidence_level: contact.confidence_level || 'medium'
          })
        })
      }
    })
    
    console.log(`👥 Loaded ${contactsData.length} contacts`)

    // Load org structures
    const orgStructuresData = fs.readFileSync('../Comprehensive_Org_Structures_30_Companies.md', 'utf8')
    const orgStructures = parseOrgStructures(orgStructuresData)
    console.log(`🏢 Loaded ${Object.keys(orgStructures).length} organizational structures`)

    // Create Alex AI crew analysis for each job
    console.log('🤖 Running Alex AI crew analysis...')
    const alexAIAnalyzedJobs = []
    
    for (const job of jobsData) {
      // Alex AI crew analysis
      const crewAnalysis = {
        technicalLead: {
          score: Math.min(95, job.alex_ai_score + Math.random() * 10),
          analysis: `Technical fit: ${job.requirements?.includes('AI') ? 'High' : 'Medium'} AI/ML expertise match`,
          recommendations: ['Leverage Alex AI system development experience', 'Highlight automation expertise']
        },
        aiStrategy: {
          score: Math.min(90, job.alex_ai_score + Math.random() * 5),
          analysis: `AI strategy alignment: ${job.company_type === 'tech' ? 'Excellent' : 'Good'} match for AI-driven solutions`,
          recommendations: ['Emphasize n8n workflow automation', 'Showcase AI integration capabilities']
        },
        clientSuccess: {
          score: Math.min(88, job.alex_ai_score + Math.random() * 7),
          analysis: `Client success potential: ${job.work_life_balance_score > 7 ? 'High' : 'Medium'} work-life balance alignment`,
          recommendations: ['Focus on sustainable technology solutions', 'Highlight client satisfaction track record']
        },
        sustainability: {
          score: job.company === 'Breakthrough Fuel' ? 95 : Math.min(85, job.alex_ai_score + Math.random() * 5),
          analysis: `Sustainability alignment: ${job.company === 'Breakthrough Fuel' ? 'Perfect' : 'Good'} match for green tech`,
          recommendations: ['Emphasize efficiency optimization experience', 'Highlight sustainable architecture knowledge']
        }
      }

      // Store in Alex AI memory system
      await alexAI.storeMemory(`job_${job.id}`, {
        job: job,
        analysis: crewAnalysis,
        recommendations: generateRecommendations(job, crewAnalysis)
      }, 'job_analysis')

      // Enhanced job with Alex AI analysis
      const enhancedJob = {
        ...job,
        alex_ai_crew_analysis: crewAnalysis,
        alex_ai_memory_id: `job_${job.id}`,
        st_louis_focus: job.location?.includes('St. Louis') || job.location?.includes('63110'),
        remote_friendly: job.remote_option === 'Hybrid' || job.remote_option === 'Remote',
        org_structure_mermaid: orgStructures[job.company] || '',
        alex_ai_leverage_factors: generateLeverageFactors(job, crewAnalysis)
      }

      alexAIAnalyzedJobs.push(enhancedJob)
    }

    console.log(`✅ Alex AI crew analysis completed for ${alexAIAnalyzedJobs.length} jobs`)

    // Store in Supabase (with fallback to mock data if tables don't exist)
    try {
      // Try to insert jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('job_opportunities')
        .insert(alexAIAnalyzedJobs.map(job => ({
          title: job.position || job.title,
          company: job.company,
          location: job.location,
          is_remote: job.remote_option === 'Remote',
          remote_friendly: job.remote_friendly,
          st_louis_area: job.st_louis_focus,
          description: job.description || job.job_description,
          requirements: job.requirements || job.qualifications,
          responsibilities: job.responsibilities || job.job_duties,
          application_link: job.application_url || job.application_link,
          alex_ai_score: job.alex_ai_score || 0,
          salary_range: job.salary_range,
          benefits: job.benefits || job.company_benefits,
          work_life_balance_score: job.work_life_balance_score || 5,
          company_type: job.company_type || job.industry,
          posted_date: new Date().toISOString(),
          org_structure_mermaid: job.org_structure_mermaid,
          alex_ai_leverage_factors: job.alex_ai_leverage_factors,
          alex_ai_crew_analysis: job.alex_ai_crew_analysis,
          alex_ai_memory_id: job.alex_ai_memory_id
        })))
        .select()

      if (jobsError) {
        console.log('⚠️  Supabase tables not available, using mock data approach')
        // Create mock data file for frontend
        fs.writeFileSync('src/lib/mock-alex-ai-data.ts', generateMockDataFile(alexAIAnalyzedJobs, contactsData))
        console.log('✅ Created mock data file with Alex AI integration')
      } else {
        console.log(`✅ Inserted ${jobs.length} jobs with Alex AI analysis`)
      }
    } catch (error) {
      console.log('⚠️  Using mock data approach:', error.message)
      fs.writeFileSync('src/lib/mock-alex-ai-data.ts', generateMockDataFile(alexAIAnalyzedJobs, contactsData))
      console.log('✅ Created mock data file with Alex AI integration')
    }

    // Test Alex AI memory retrieval
    console.log('🧠 Testing Alex AI memory system...')
    const similarMemories = await alexAI.findSimilarMemories('software engineer AI machine learning')
    console.log(`✅ Found ${similarMemories.length} similar memories`)

    console.log('🎉 Alex AI database setup completed!')
    console.log(`📊 Jobs analyzed: ${alexAIAnalyzedJobs.length}`)
    console.log(`👥 Contacts processed: ${contactsData.length}`)
    console.log(`🧠 Memories stored: ${alexAI.memories.size}`)
    console.log(`🏢 Org structures: ${Object.keys(orgStructures).length}`)

  } catch (error) {
    console.error('Error setting up Alex AI database:', error)
  }
}

function generateRecommendations(job, analysis) {
  const recommendations = []
  
  if (analysis.technicalLead.score > 90) {
    recommendations.push('Lead with technical expertise and Alex AI system development')
  }
  if (analysis.aiStrategy.score > 85) {
    recommendations.push('Emphasize AI strategy and automation capabilities')
  }
  if (analysis.sustainability.score > 90) {
    recommendations.push('Highlight sustainability and efficiency optimization experience')
  }
  if (job.st_louis_focus) {
    recommendations.push('Emphasize local St. Louis market knowledge and connections')
  }
  
  return recommendations
}

function generateLeverageFactors(job, analysis) {
  const factors = []
  
  if (job.requirements?.includes('AI') || job.requirements?.includes('Machine Learning')) {
    factors.push('Direct AI/ML expertise match')
  }
  if (job.company_type === 'tech') {
    factors.push('Technology company alignment')
  }
  if (analysis.technicalLead.score > 90) {
    factors.push('High technical leadership potential')
  }
  if (job.work_life_balance_score > 8) {
    factors.push('Excellent work-life balance match')
  }
  
  return factors
}

function parseOrgStructures(markdownContent) {
  const structures = {}
  const lines = markdownContent.split('\n')
  let currentCompany = ''
  let currentStructure = []
  let inMermaidBlock = false

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentCompany && currentStructure.length > 0) {
        structures[currentCompany] = currentStructure.join('\n')
      }
      currentCompany = line.replace('## ', '').trim()
      currentStructure = []
      inMermaidBlock = false
    } else if (line.startsWith('```mermaid')) {
      inMermaidBlock = true
    } else if (line.startsWith('```') && inMermaidBlock) {
      inMermaidBlock = false
    } else if (inMermaidBlock && currentCompany) {
      currentStructure.push(line)
    }
  }

  if (currentCompany && currentStructure.length > 0) {
    structures[currentCompany] = currentStructure.join('\n')
  }

  return structures
}

function generateMockDataFile(jobs, contacts) {
  return `// Alex AI Integrated Mock Data
export const alexAIJobOpportunities = ${JSON.stringify(jobs, null, 2)};

export const alexAIContacts = ${JSON.stringify(contacts, null, 2)};

export const alexAIMemorySystem = {
  findSimilarMemories: (query) => {
    // Mock similarity search
    return jobs.filter(job => 
      job.position?.toLowerCase().includes(query.toLowerCase()) ||
      job.company?.toLowerCase().includes(query.toLowerCase()) ||
      job.description?.toLowerCase().includes(query.toLowerCase())
    ).map(job => ({
      key: \`job_\${job.id}\`,
      similarity: Math.random() * 0.5 + 0.5,
      memory: { job, type: 'job_analysis' }
    }))
  }
};
`
}

// Run the setup
setupAlexAIDatabase()
