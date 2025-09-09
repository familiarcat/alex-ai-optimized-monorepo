const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function populateSimple() {
  try {
    console.log('🚀 Starting simple database population...')

    // Load job opportunities data
    const jobsDataRaw = JSON.parse(fs.readFileSync('../Job_Opportunities_30_Plus_Database.json', 'utf8'))
    const jobsData = jobsDataRaw.job_opportunities_database.opportunities
    console.log(`📊 Loaded ${jobsData.length} job opportunities`)

    // Insert jobs one by one to avoid any bulk insert issues
    const insertedJobs = []
    
    for (let i = 0; i < Math.min(5, jobsData.length); i++) {
      const job = jobsData[i]
      console.log(`Inserting job ${i + 1}: ${job.position} at ${job.company}`)
      
      const { data, error } = await supabase
        .from('job_opportunities')
        .insert({
          title: job.position || job.title,
          company: job.company,
          location: job.location,
          is_remote: job.remote_option === 'Remote',
          remote_friendly: job.remote_option === 'Hybrid' || job.remote_option === 'Remote',
          st_louis_area: job.location?.includes('St. Louis') || job.location?.includes('63110'),
          description: job.description || job.job_description,
          requirements: job.requirements || job.qualifications,
          responsibilities: job.responsibilities || job.job_duties,
          application_link: job.application_url || job.application_link,
          alex_ai_score: job.alex_ai_score || 0,
          salary_range: job.salary_range,
          benefits: job.benefits || job.company_benefits,
          work_life_balance_score: job.work_life_balance_score || 5,
          company_type: job.company_type || job.industry,
          alex_ai_leverage_factors: job.alex_ai_leverage_factors || job.leverage_factors || []
        })
        .select()

      if (error) {
        console.error(`Error inserting job ${i + 1}:`, error)
      } else {
        console.log(`✅ Inserted job ${i + 1}`)
        insertedJobs.push(data[0])
      }
    }

    console.log(`✅ Successfully inserted ${insertedJobs.length} jobs`)

    // Test query
    const { data: testData, error: testError } = await supabase
      .from('job_opportunities')
      .select('*')
      .limit(3)

    if (testError) {
      console.error('Test query error:', testError)
    } else {
      console.log('✅ Test query successful:', testData.length, 'jobs found')
    }

  } catch (error) {
    console.error('Error in simple populate:', error)
  }
}

populateSimple()
