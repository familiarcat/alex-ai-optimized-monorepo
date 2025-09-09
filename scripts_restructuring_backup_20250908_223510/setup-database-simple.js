#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../apps/alex-ai-job-search/.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rpkkkbufdwxmjaerbhbn.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwa2trYnVmZHd4bWphZXJiYm4iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjI0NzQ0MCwiZXhwIjoyMDUxODIzNDQwfQ.placeholder'

console.log('🗄️ Setting up Alex AI database schema...')
console.log(`📡 Connecting to Supabase: ${SUPABASE_URL}`)

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function setupDatabase() {
  try {
    console.log('📋 Testing database connection and creating sample data...')
    
    // Test connection by trying to insert sample data
    console.log('📝 Creating sample job opportunities...')
    
    const sampleJobs = [
      {
        company: 'TechCorp',
        position: 'Senior AI Engineer',
        location: 'St. Louis, MO',
        remote_option: 'Hybrid',
        salary_range: '$120,000 - $150,000',
        description: 'Leading AI development team',
        alex_ai_score: 95,
        st_louis_area: true,
        st_louis_focus: true,
        source: 'manual'
      },
      {
        company: 'DataFlow Inc',
        position: 'Machine Learning Engineer',
        location: 'Remote',
        remote_option: 'Remote',
        salary_range: '$100,000 - $130,000',
        description: 'Building ML pipelines',
        alex_ai_score: 88,
        st_louis_area: false,
        st_louis_focus: false,
        source: 'manual'
      },
      {
        company: 'InnovateLab',
        position: 'AI Research Scientist',
        location: 'St. Louis, MO',
        remote_option: 'On-site',
        salary_range: '$140,000 - $180,000',
        description: 'Cutting-edge AI research',
        alex_ai_score: 92,
        st_louis_area: true,
        st_louis_focus: true,
        source: 'manual'
      }
    ]

    // Try to insert sample data (this will create tables if they don't exist in some cases)
    for (const job of sampleJobs) {
      try {
        const { data, error } = await supabase
          .from('job_opportunities')
          .insert([job])
          .select()

        if (error) {
          console.log(`⚠️ Job insertion failed: ${error.message}`)
        } else {
          console.log(`✅ Created job: ${job.company} - ${job.position}`)
        }
      } catch (err) {
        console.log(`⚠️ Job insertion error: ${err.message}`)
      }
    }

    // Test reading data
    console.log('\n📖 Testing data retrieval...')
    
    try {
      const { data: jobs, error } = await supabase
        .from('job_opportunities')
        .select('*')
        .limit(5)

      if (error) {
        console.log(`❌ Failed to read jobs: ${error.message}`)
      } else {
        console.log(`✅ Successfully retrieved ${jobs?.length || 0} job opportunities`)
        if (jobs && jobs.length > 0) {
          console.log('📋 Sample jobs:')
          jobs.forEach(job => {
            console.log(`  - ${job.company}: ${job.position} (Score: ${job.alex_ai_score})`)
          })
        }
      }
    } catch (err) {
      console.log(`❌ Data retrieval error: ${err.message}`)
    }

    // Test other tables
    const tables = ['contacts', 'applications', 'user_analytics_events', 'user_sessions']
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`)
        } else {
          console.log(`✅ Table ${table}: Ready`)
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`)
      }
    }

    console.log('\n🎉 Database setup process completed!')
    console.log('📋 Next steps:')
    console.log('1. Go to Supabase Dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Run the supabase_schema.sql script')
    console.log('4. Test the API endpoints')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    console.log('\n📋 Manual setup required:')
    console.log('1. Go to Supabase Dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the contents of supabase_schema.sql')
    console.log('4. Execute the script')
    process.exit(1)
  }
}

// Run the setup
setupDatabase()


# Merged functionality:

# From setup-database.js:
#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../apps/alex-ai-job-search/.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rpkkkbufdwxmjaerbhbn.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwa2trYnVmZHd4bWphZXJiYm4iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjI0NzQ0MCwiZXhwIjoyMDUxODIzNDQwfQ.placeholder'

console.log('🗄️ Setting up Alex AI database schema...')
console.log(`📡 Connecting to Supabase: ${SUPABASE_URL}`)

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Read the SQL schema file
const schemaPath = path.join(__dirname, '../supabase_schema.sql')
const schemaSQL = fs.readFileSync(schemaPath, 'utf8')

async function setupDatabase() {
  try {
    console.log('📋 Executing database schema...')
    
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
          
          const { data, error } = await supabase.rpc('exec_sql', {
            sql: statement
          })

          if (error) {
            // Some errors are expected (like "already exists")
            if (error.message.includes('already exists') || 
                error.message.includes('does not exist') ||
                error.message.includes('duplicate key')) {
              console.log(`⚠️ Statement ${i + 1}: ${error.message}`)
            } else {
              console.error(`❌ Statement ${i + 1} failed:`, error.message)
              errorCount++
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`)
            successCount++
          }
        } catch (err) {
          console.error(`❌ Statement ${i + 1} error:`, err.message)
          errorCount++
        }
      }
    }

    console.log(`\n📊 Database setup completed:`)
    console.log(`✅ Successful statements: ${successCount}`)
    console.log(`❌ Failed statements: ${errorCount}`)

    // Test the tables by trying to query them
    console.log('\n🧪 Testing database tables...')
    
    const tables = [
      'job_opportunities',
      'contacts', 
      'applications',
      'user_analytics_events',
      'user_sessions',
      'scraping_jobs',
      'scheduled_scraping_configs',
      'scheduled_scraping_status',
      'user_polling_preferences'
    ]

    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`)
        } else {
          console.log(`✅ Table ${table}: Ready`)
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`)
      }
    }

    console.log('\n🎉 Database setup process completed!')
    console.log('🚀 You can now test the API endpoints')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()

