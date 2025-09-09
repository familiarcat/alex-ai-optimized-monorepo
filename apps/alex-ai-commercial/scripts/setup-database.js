const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🏗️ Setting up database schema...')

    // Create job_opportunities table
    const createJobsTable = `
      CREATE TABLE IF NOT EXISTS job_opportunities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        is_remote BOOLEAN DEFAULT FALSE,
        remote_friendly BOOLEAN DEFAULT FALSE,
        st_louis_area BOOLEAN DEFAULT FALSE,
        description TEXT,
        requirements TEXT,
        responsibilities TEXT,
        application_link TEXT,
        alex_ai_score INTEGER DEFAULT 0,
        salary_range TEXT,
        benefits TEXT,
        work_life_balance_score INTEGER DEFAULT 5,
        company_type TEXT,
        posted_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        org_structure_mermaid TEXT,
        alex_ai_leverage_factors TEXT[]
      );
    `

    // Create contacts table
    const createContactsTable = `
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_opportunity_id UUID REFERENCES job_opportunities(id),
        company TEXT NOT NULL,
        name TEXT NOT NULL,
        title TEXT,
        email TEXT,
        linkedin_url TEXT,
        contact_type TEXT,
        confidence_level TEXT
      );
    `

    // Create applications table
    const createApplicationsTable = `
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_opportunity_id UUID REFERENCES job_opportunities(id),
        user_id UUID,
        application_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'Applied',
        notes TEXT,
        tailored_resume_url TEXT,
        cover_letter_url TEXT,
        follow_up_date TIMESTAMP WITH TIME ZONE
      );
    `

    // Execute table creation
    console.log('Creating job_opportunities table...')
    const { error: jobsError } = await supabase.rpc('exec_sql', { sql: createJobsTable })
    if (jobsError) {
      console.log('Jobs table might already exist, continuing...')
    }

    console.log('Creating contacts table...')
    const { error: contactsError } = await supabase.rpc('exec_sql', { sql: createContactsTable })
    if (contactsError) {
      console.log('Contacts table might already exist, continuing...')
    }

    console.log('Creating applications table...')
    const { error: applicationsError } = await supabase.rpc('exec_sql', { sql: createApplicationsTable })
    if (applicationsError) {
      console.log('Applications table might already exist, continuing...')
    }

    console.log('✅ Database schema setup completed!')

    // Test the connection
    const { data, error } = await supabase
      .from('job_opportunities')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Schema setup failed:', error)
    } else {
      console.log('✅ Database is ready!')
    }

  } catch (error) {
    console.error('Error setting up database:', error)
  }
}

setupDatabase()
