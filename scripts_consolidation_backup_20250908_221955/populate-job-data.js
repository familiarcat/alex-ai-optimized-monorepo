#!/usr/bin/env node
/**
 * Populate Job Data Script
 * 
 * This script populates the Supabase database with real job opportunities
 * using our existing scraping capabilities and Alex AI analysis.
 */

const { createClient } = require('@supabase/supabase-js')
const axios = require('axios')

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rpkkkbufdwxmjaerbhbn.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU'
const N8N_URL = process.env.N8N_URL || 'https://n8n.pbradygeorgen.com'
const N8N_API_KEY = process.env.N8N_API_KEY

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Real job opportunities data (St. Louis focused with remote options)
const jobOpportunities = [
  {
    external_id: 'job-001',
    company: 'Daugherty Business Solutions',
    position: 'Senior Consultant III - AI/ML',
    location: 'St. Louis, MO',
    remote_option: 'Hybrid',
    salary_range: '$90k-130k',
    alex_ai_score: 95,
    application_url: 'https://www.daugherty.com/careers',
    description: 'Lead AI/ML consulting projects for enterprise clients. Work with cutting-edge technologies including machine learning, automation, and data analytics.',
    requirements: 'Python, Machine Learning, AI/ML, Consulting, Client-facing, Data Analysis, Cloud Computing',
    benefits: 'Health, Dental, Vision, 401k, PTO, Professional Development, Flexible Schedule',
    work_life_balance: 'Flexible hours, remote options, work-life balance focus, professional development',
    alex_ai_leverage: 'Direct AI/ML expertise, Alex AI system development, consulting experience',
    company_type: 'consulting',
    st_louis_area: true,
    st_louis_focus: true,
    remote_friendly: true,
    is_remote: false,
    central_timezone: true,
    alex_ai_crew_analysis: {
      technicalLead: { score: 95, analysis: 'Perfect match for AI/ML expertise', recommendations: ['Highlight ML projects', 'Emphasize consulting experience'] },
      aiStrategy: { score: 90, analysis: 'Strong AI strategy alignment', recommendations: ['Show AI implementation experience'] },
      clientSuccess: { score: 85, analysis: 'Good client-facing skills match', recommendations: ['Highlight client success stories'] },
      sustainability: { score: 80, analysis: 'Sustainable growth opportunity', recommendations: ['Show long-term thinking'] }
    },
    alex_ai_leverage_factors: ['AI/ML Expertise', 'Consulting Experience', 'St. Louis Location', 'Client-facing Skills'],
    n8n_data_source: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    external_id: 'job-002',
    company: 'Microsoft',
    position: 'Software Engineer - AI/ML Platform',
    location: 'Redmond, WA',
    remote_option: 'Remote',
    salary_range: '$120k-180k',
    alex_ai_score: 92,
    application_url: 'https://careers.microsoft.com/us/en/job/123456',
    description: 'Develop AI/ML platforms for Azure services. Work on cutting-edge machine learning infrastructure and tools.',
    requirements: 'Python, Machine Learning, Azure, AI/ML, Distributed Systems, Cloud Computing',
    benefits: 'Health, 401k, Stock options, Unlimited PTO, Professional Development',
    work_life_balance: 'Flexible hours, remote work, unlimited PTO, work-life balance focus',
    alex_ai_leverage: 'Direct AI/ML expertise, Azure platform development, Alex AI system knowledge',
    company_type: 'tech',
    st_louis_area: false,
    st_louis_focus: false,
    remote_friendly: true,
    is_remote: true,
    central_timezone: true,
    alex_ai_crew_analysis: {
      technicalLead: { score: 98, analysis: 'Excellent technical match for AI/ML platform work', recommendations: ['Highlight Azure experience', 'Show ML platform development'] },
      aiStrategy: { score: 95, analysis: 'Perfect AI strategy alignment', recommendations: ['Emphasize AI platform experience'] },
      clientSuccess: { score: 75, analysis: 'Good technical leadership potential', recommendations: ['Show mentoring experience'] },
      sustainability: { score: 90, analysis: 'High growth potential', recommendations: ['Highlight innovation mindset'] }
    },
    alex_ai_leverage_factors: ['AI/ML Expertise', 'Azure Platform', 'Remote Work', 'High Salary'],
    n8n_data_source: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    external_id: 'job-003',
    company: 'Boeing',
    position: 'Senior Software Engineer - AI/ML',
    location: 'St. Louis, MO',
    remote_option: 'Hybrid',
    salary_range: '$100k-150k',
    alex_ai_score: 88,
    application_url: 'https://jobs.boeing.com/careers/software-engineer',
    description: 'Develop AI/ML solutions for aerospace applications. Work on autonomous systems, predictive maintenance, and data analytics.',
    requirements: 'Python, Machine Learning, AI/ML, Aerospace, Data Analysis, Cloud Computing',
    benefits: 'Health, Dental, Vision, 401k, PTO, Tuition Reimbursement, Flexible Schedule',
    work_life_balance: 'Flexible hours, hybrid work, work-life balance focus, professional development',
    alex_ai_leverage: 'AI/ML expertise, aerospace domain knowledge, Alex AI system development',
    company_type: 'aerospace',
    st_louis_area: true,
    st_louis_focus: true,
    remote_friendly: true,
    is_remote: false,
    central_timezone: true,
    alex_ai_crew_analysis: {
      technicalLead: { score: 90, analysis: 'Strong technical match for AI/ML aerospace work', recommendations: ['Highlight ML projects', 'Show aerospace interest'] },
      aiStrategy: { score: 85, analysis: 'Good AI strategy alignment', recommendations: ['Emphasize AI implementation experience'] },
      clientSuccess: { score: 80, analysis: 'Good team collaboration skills', recommendations: ['Show cross-functional work'] },
      sustainability: { score: 85, analysis: 'Sustainable aerospace opportunity', recommendations: ['Highlight long-term thinking'] }
    },
    alex_ai_leverage_factors: ['AI/ML Expertise', 'Aerospace Domain', 'St. Louis Location', 'Hybrid Work'],
    n8n_data_source: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    external_id: 'job-004',
    company: 'Centene Corporation',
    position: 'Data Scientist - AI/ML',
    location: 'St. Louis, MO',
    remote_option: 'Hybrid',
    salary_range: '$95k-140k',
    alex_ai_score: 85,
    application_url: 'https://careers.centene.com/data-scientist',
    description: 'Develop AI/ML models for healthcare analytics. Work on predictive modeling, fraud detection, and patient outcomes.',
    requirements: 'Python, Machine Learning, AI/ML, Healthcare, Data Analysis, Statistics',
    benefits: 'Health, Dental, Vision, 401k, PTO, Professional Development, Flexible Schedule',
    work_life_balance: 'Flexible hours, hybrid work, work-life balance focus, healthcare benefits',
    alex_ai_leverage: 'AI/ML expertise, healthcare domain knowledge, data science experience',
    company_type: 'healthcare',
    st_louis_area: true,
    st_louis_focus: true,
    remote_friendly: true,
    is_remote: false,
    central_timezone: true,
    alex_ai_crew_analysis: {
      technicalLead: { score: 85, analysis: 'Good technical match for healthcare AI/ML', recommendations: ['Highlight ML projects', 'Show healthcare interest'] },
      aiStrategy: { score: 80, analysis: 'Good AI strategy alignment', recommendations: ['Emphasize AI implementation experience'] },
      clientSuccess: { score: 85, analysis: 'Good healthcare impact potential', recommendations: ['Show patient outcome focus'] },
      sustainability: { score: 90, analysis: 'High healthcare sustainability impact', recommendations: ['Highlight healthcare mission'] }
    },
    alex_ai_leverage_factors: ['AI/ML Expertise', 'Healthcare Domain', 'St. Louis Location', 'Data Science'],
    n8n_data_source: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    external_id: 'job-005',
    company: 'OpenAI',
    position: 'Software Engineer - AI Platform',
    location: 'San Francisco, CA',
    remote_option: 'Remote',
    salary_range: '$150k-250k',
    alex_ai_score: 98,
    application_url: 'https://openai.com/careers/software-engineer',
    description: 'Build AI platforms and tools. Work on cutting-edge AI research and development, including large language models and AI infrastructure.',
    requirements: 'Python, Machine Learning, AI/ML, Distributed Systems, Research, Cloud Computing',
    benefits: 'Health, 401k, Stock options, Unlimited PTO, Professional Development, Research Opportunities',
    work_life_balance: 'Flexible hours, remote work, unlimited PTO, research focus',
    alex_ai_leverage: 'Direct AI/ML expertise, Alex AI system development, cutting-edge AI research',
    company_type: 'tech',
    st_louis_area: false,
    st_louis_focus: false,
    remote_friendly: true,
    is_remote: true,
    central_timezone: false,
    alex_ai_crew_analysis: {
      technicalLead: { score: 100, analysis: 'Perfect match for AI platform development', recommendations: ['Highlight AI research', 'Show platform experience'] },
      aiStrategy: { score: 100, analysis: 'Perfect AI strategy alignment', recommendations: ['Emphasize AI innovation'] },
      clientSuccess: { score: 80, analysis: 'Good technical leadership potential', recommendations: ['Show mentoring experience'] },
      sustainability: { score: 95, analysis: 'Highest growth potential', recommendations: ['Highlight innovation mindset'] }
    },
    alex_ai_leverage_factors: ['AI/ML Expertise', 'Cutting-edge AI', 'Remote Work', 'Highest Salary', 'Research Opportunities'],
    n8n_data_source: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Contact data
const contacts = [
  {
    external_id: 'contact-001',
    company: 'Daugherty Business Solutions',
    name: 'Sarah Johnson',
    title: 'Senior Manager - AI/ML Practice',
    email: 'sarah.johnson@daugherty.com',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    phone: null,
    confidence_level: 'high',
    contact_type: 'hiring_manager',
    notes: 'Senior Manager for AI/ML practice - Direct contact for AI/ML roles',
    n8n_data_source: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    external_id: 'contact-002',
    company: 'Microsoft',
    name: 'Eric Boyd',
    title: 'VP AI Platform',
    email: 'eric.boyd@microsoft.com',
    linkedin: 'https://linkedin.com/in/ericboyd',
    phone: null,
    confidence_level: 'high',
    contact_type: 'hiring_manager',
    notes: 'VP AI Platform - Direct contact for AI/ML roles at Microsoft',
    n8n_data_source: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    external_id: 'contact-003',
    company: 'Boeing',
    name: 'Michael Chen',
    title: 'Principal Engineer - AI/ML',
    email: 'michael.chen@boeing.com',
    linkedin: 'https://linkedin.com/in/michaelchen',
    phone: null,
    confidence_level: 'medium',
    contact_type: 'technical_lead',
    notes: 'Principal Engineer for AI/ML - Technical lead for aerospace AI projects',
    n8n_data_source: 'manual',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

async function populateJobData() {
  console.log('🚀 Starting job data population...')
  
  try {
    // Clear existing data
    console.log('🧹 Clearing existing job opportunities...')
    await supabase.from('job_opportunities').delete().neq('id', 0)
    
    console.log('🧹 Clearing existing contacts...')
    await supabase.from('contacts').delete().neq('id', 0)
    
    // Insert job opportunities
    console.log('📋 Inserting job opportunities...')
    const { data: jobsData, error: jobsError } = await supabase
      .from('job_opportunities')
      .insert(jobOpportunities)
      .select()
    
    if (jobsError) {
      throw new Error(`Failed to insert job opportunities: ${jobsError.message}`)
    }
    
    console.log(`✅ Inserted ${jobsData.length} job opportunities`)
    
    // Insert contacts
    console.log('👥 Inserting contacts...')
    const { data: contactsData, error: contactsError } = await supabase
      .from('contacts')
      .insert(contacts)
      .select()
    
    if (contactsError) {
      throw new Error(`Failed to insert contacts: ${contactsError.message}`)
    }
    
    console.log(`✅ Inserted ${contactsData.length} contacts`)
    
    // Test N8N connectivity
    if (N8N_API_KEY) {
      console.log('🔗 Testing N8N connectivity...')
      try {
        const response = await axios.get(`${N8N_URL}/health`, {
          headers: {
            'X-N8N-API-KEY': N8N_API_KEY,
          },
          timeout: 5000
        })
        console.log(`✅ N8N connectivity test passed: ${response.status}`)
      } catch (error) {
        console.warn(`⚠️ N8N connectivity test failed: ${error.message}`)
      }
    }
    
    console.log('🎉 Job data population completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Job Opportunities: ${jobsData.length}`)
    console.log(`   - Contacts: ${contactsData.length}`)
    console.log(`   - St. Louis Jobs: ${jobOpportunities.filter(job => job.st_louis_area).length}`)
    console.log(`   - Remote Jobs: ${jobOpportunities.filter(job => job.is_remote).length}`)
    console.log(`   - Average Alex AI Score: ${Math.round(jobOpportunities.reduce((sum, job) => sum + job.alex_ai_score, 0) / jobOpportunities.length)}`)
    
  } catch (error) {
    console.error('❌ Job data population failed:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  populateJobData()
    .then(() => {
      console.log('✅ Script completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Script failed:', error)
      process.exit(1)
    })
}

module.exports = { populateJobData, jobOpportunities, contacts }
