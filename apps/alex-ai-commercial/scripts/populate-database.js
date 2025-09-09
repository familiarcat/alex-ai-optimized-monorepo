const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...')

    // Load job opportunities data
    const jobsDataRaw = JSON.parse(fs.readFileSync('../Job_Opportunities_30_Plus_Database.json', 'utf8'))
    const jobsData = jobsDataRaw.job_opportunities_database.opportunities
    console.log(`📊 Loaded ${jobsData.length} job opportunities`)

    // Load contacts data
    const contactsDataRaw = JSON.parse(fs.readFileSync('../HR_Email_Database_Comprehensive.json', 'utf8'))
    const contactsData = []
    
    // Flatten the nested contacts structure
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

    // Load org structures data
    const orgStructuresData = fs.readFileSync('../Comprehensive_Org_Structures_30_Companies.md', 'utf8')
    console.log(`🏢 Loaded organizational structures`)

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await supabase.from('applications').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('contacts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('job_opportunities').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert job opportunities
    console.log('💼 Inserting job opportunities...')
    const { data: jobs, error: jobsError } = await supabase
      .from('job_opportunities')
      .insert(jobsData.map(job => ({
        title: job.position || job.title,
        company: job.company,
        location: job.location,
        is_remote: job.remote_option === 'Remote' || job.is_remote || false,
        remote_friendly: job.remote_option === 'Hybrid' || job.remote_option === 'Remote' || job.remote_friendly || false,
        st_louis_area: job.location?.includes('St. Louis') || job.location?.includes('63110') || job.st_louis_area || false,
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
        org_structure_mermaid: job.org_structure_mermaid || '',
        alex_ai_leverage_factors: job.alex_ai_leverage_factors || job.leverage_factors || []
      })))
      .select()

    if (jobsError) {
      console.error('Error inserting jobs:', jobsError)
      console.error('First job data sample:', JSON.stringify(jobsData[0], null, 2))
      return
    }

    console.log(`✅ Inserted ${jobs.length} job opportunities`)

    // Create a mapping of company names to job IDs
    const companyToJobId = {}
    jobs.forEach(job => {
      if (!companyToJobId[job.company]) {
        companyToJobId[job.company] = job.id
      }
    })

    // Insert contacts
    console.log('👥 Inserting contacts...')
    const contactsToInsert = contactsData.map(contact => ({
      job_opportunity_id: companyToJobId[contact.company] || null,
      company: contact.company,
      name: contact.name,
      title: contact.title,
      email: contact.email,
      linkedin_url: contact.linkedin_url,
      contact_type: contact.contact_type,
      confidence_level: contact.confidence_level
    }))

    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .insert(contactsToInsert)
      .select()

    if (contactsError) {
      console.error('Error inserting contacts:', contactsError)
      return
    }

    console.log(`✅ Inserted ${contacts.length} contacts`)

    // Update jobs with org structures
    console.log('🏢 Updating jobs with organizational structures...')
    const orgStructures = parseOrgStructures(orgStructuresData)
    
    for (const [company, structure] of Object.entries(orgStructures)) {
      const jobId = companyToJobId[company]
      if (jobId) {
        await supabase
          .from('job_opportunities')
          .update({ org_structure_mermaid: structure })
          .eq('id', jobId)
      }
    }

    console.log('✅ Updated jobs with organizational structures')

    // Set up default filters for St. Louis focus
    console.log('🎯 Setting up St. Louis focus...')
    const stLouisJobs = jobs.filter(job => job.st_louis_area)
    const remoteJobs = jobs.filter(job => job.is_remote || job.remote_friendly)
    
    console.log(`📍 Found ${stLouisJobs.length} St. Louis area jobs`)
    console.log(`🌐 Found ${remoteJobs.length} remote-friendly jobs`)

    console.log('🎉 Database population completed successfully!')
    console.log(`📊 Total jobs: ${jobs.length}`)
    console.log(`👥 Total contacts: ${contacts.length}`)
    console.log(`🏢 Companies with org structures: ${Object.keys(orgStructures).length}`)

  } catch (error) {
    console.error('Error populating database:', error)
  }
}

function parseOrgStructures(markdownContent) {
  const structures = {}
  const lines = markdownContent.split('\n')
  let currentCompany = ''
  let currentStructure = []
  let inMermaidBlock = false

  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Save previous company structure
      if (currentCompany && currentStructure.length > 0) {
        structures[currentCompany] = currentStructure.join('\n')
      }
      
      // Start new company
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

  // Save last company structure
  if (currentCompany && currentStructure.length > 0) {
    structures[currentCompany] = currentStructure.join('\n')
  }

  return structures
}

// Run the population
populateDatabase()
