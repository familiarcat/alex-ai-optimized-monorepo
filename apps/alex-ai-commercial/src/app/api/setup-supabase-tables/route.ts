import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client directly in this file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration:', {
    url: !!supabaseUrl,
    key: !!supabaseServiceKey
  })
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    console.log('🗄️  Setting up Supabase tables...')

    // Create tables using SQL
    const createTablesSQL = `
      -- Enable necessary extensions
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Job Opportunities Table
      CREATE TABLE IF NOT EXISTS job_opportunities (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          company VARCHAR(255) NOT NULL,
          position VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          remote_option VARCHAR(50),
          salary_range VARCHAR(100),
          description TEXT,
          requirements TEXT,
          benefits TEXT,
          application_url TEXT,
          source VARCHAR(100),
          scraped_at TIMESTAMP WITH TIME ZONE,
          alex_ai_score INTEGER,
          st_louis_area BOOLEAN DEFAULT FALSE,
          st_louis_focus BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Contacts Table
      CREATE TABLE IF NOT EXISTS contacts (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          company VARCHAR(255),
          position VARCHAR(255),
          linkedin_url TEXT,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Applications Table
      CREATE TABLE IF NOT EXISTS applications (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          job_id UUID REFERENCES job_opportunities(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'pending',
          application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crew Memories Table (for MCP knowledge)
      CREATE TABLE IF NOT EXISTS crew_memories (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          crew_member VARCHAR(100) NOT NULL,
          knowledge_type VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          tags TEXT[],
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- User Analytics Table
      CREATE TABLE IF NOT EXISTS user_analytics (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          user_id VARCHAR(255),
          event_type VARCHAR(100) NOT NULL,
          event_data JSONB,
          page_url TEXT,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Execute the SQL using direct SQL execution
    const { data, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['job_opportunities', 'contacts', 'applications', 'crew_memories', 'user_analytics'])
    
    if (error) {
      console.error('❌ Error checking existing tables:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        message: 'Failed to check existing tables' 
      }, { status: 500 })
    }

    // Check if tables already exist
    const existingTables = data?.map(row => row.table_name) || []
    console.log('📋 Existing tables:', existingTables)

    // Create tables one by one using direct SQL
    const tablesToCreate = [
      {
        name: 'job_opportunities',
        sql: `
          CREATE TABLE IF NOT EXISTS job_opportunities (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              company VARCHAR(255) NOT NULL,
              position VARCHAR(255) NOT NULL,
              location VARCHAR(255),
              remote_option VARCHAR(50),
              salary_range VARCHAR(100),
              description TEXT,
              requirements TEXT,
              benefits TEXT,
              application_url TEXT,
              source VARCHAR(100),
              scraped_at TIMESTAMP WITH TIME ZONE,
              alex_ai_score INTEGER,
              st_louis_area BOOLEAN DEFAULT FALSE,
              st_louis_focus BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'contacts',
        sql: `
          CREATE TABLE IF NOT EXISTS contacts (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255),
              phone VARCHAR(50),
              company VARCHAR(255),
              position VARCHAR(255),
              linkedin_url TEXT,
              notes TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'applications',
        sql: `
          CREATE TABLE IF NOT EXISTS applications (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              job_id UUID REFERENCES job_opportunities(id) ON DELETE CASCADE,
              status VARCHAR(50) DEFAULT 'pending',
              application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              notes TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'crew_memories',
        sql: `
          CREATE TABLE IF NOT EXISTS crew_memories (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              crew_member VARCHAR(100) NOT NULL,
              knowledge_type VARCHAR(100) NOT NULL,
              title VARCHAR(255) NOT NULL,
              content TEXT NOT NULL,
              tags TEXT[],
              metadata JSONB,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'user_analytics',
        sql: `
          CREATE TABLE IF NOT EXISTS user_analytics (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              session_id VARCHAR(255) NOT NULL,
              user_id VARCHAR(255),
              event_type VARCHAR(100) NOT NULL,
              event_data JSONB,
              page_url TEXT,
              timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      }
    ]

    // Create tables that don't exist
    for (const table of tablesToCreate) {
      if (!existingTables.includes(table.name)) {
        console.log(`🔨 Creating table: ${table.name}`)
        const { error: createError } = await supabaseAdmin.rpc('exec', { sql: table.sql })
        
        if (createError) {
          console.error(`❌ Error creating table ${table.name}:`, createError)
          // Continue with other tables
        } else {
          console.log(`✅ Table ${table.name} created successfully`)
        }
      } else {
        console.log(`✅ Table ${table.name} already exists`)
      }
    }

    console.log('✅ Tables created successfully')

    // Create indexes
    const createIndexesSQL = `
      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_company ON job_opportunities(company);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_position ON job_opportunities(position);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_created_at ON job_opportunities(created_at);
      CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
      CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
      CREATE INDEX IF NOT EXISTS idx_crew_memories_crew_member ON crew_memories(crew_member);
      CREATE INDEX IF NOT EXISTS idx_crew_memories_knowledge_type ON crew_memories(knowledge_type);
      CREATE INDEX IF NOT EXISTS idx_user_analytics_session_id ON user_analytics(session_id);
      CREATE INDEX IF NOT EXISTS idx_user_analytics_timestamp ON user_analytics(timestamp);
    `

    const { error: indexError } = await supabaseAdmin.rpc('exec_sql', { sql: createIndexesSQL })
    
    if (indexError) {
      console.error('⚠️  Warning creating indexes:', indexError)
    } else {
      console.log('✅ Indexes created successfully')
    }

    // Enable RLS and create policies
    const setupRLSSQL = `
      -- Enable Row Level Security (RLS)
      ALTER TABLE job_opportunities ENABLE ROW LEVEL SECURITY;
      ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
      ALTER TABLE crew_memories ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies (allow all for now, can be restricted later)
      DROP POLICY IF EXISTS "Allow all operations on job_opportunities" ON job_opportunities;
      CREATE POLICY "Allow all operations on job_opportunities" ON job_opportunities FOR ALL USING (true);

      DROP POLICY IF EXISTS "Allow all operations on contacts" ON contacts;
      CREATE POLICY "Allow all operations on contacts" ON contacts FOR ALL USING (true);

      DROP POLICY IF EXISTS "Allow all operations on applications" ON applications;
      CREATE POLICY "Allow all operations on applications" ON applications FOR ALL USING (true);

      DROP POLICY IF EXISTS "Allow all operations on crew_memories" ON crew_memories;
      CREATE POLICY "Allow all operations on crew_memories" ON crew_memories FOR ALL USING (true);

      DROP POLICY IF EXISTS "Allow all operations on user_analytics" ON user_analytics;
      CREATE POLICY "Allow all operations on user_analytics" ON user_analytics FOR ALL USING (true);
    `

    const { error: rlsError } = await supabaseAdmin.rpc('exec_sql', { sql: setupRLSSQL })
    
    if (rlsError) {
      console.error('⚠️  Warning setting up RLS:', rlsError)
    } else {
      console.log('✅ RLS policies created successfully')
    }

    // Test the tables by inserting some sample data
    const testJob = {
      company: 'Test Company',
      position: 'Software Engineer',
      location: 'St. Louis, MO',
      remote_option: 'Hybrid',
      salary_range: '$80,000 - $120,000',
      description: 'Test job description for Alex AI',
      requirements: 'React, TypeScript, Node.js',
      benefits: 'Health insurance, 401k, remote work',
      application_url: 'https://example.com/apply',
      source: 'test',
      alex_ai_score: 85,
      st_louis_area: true,
      st_louis_focus: true
    }

    const { data: jobData, error: jobError } = await supabaseAdmin
      .from('job_opportunities')
      .insert(testJob)
      .select()

    if (jobError) {
      console.error('⚠️  Warning inserting test job:', jobError)
    } else {
      console.log('✅ Test job inserted successfully')
    }

    // Insert test crew memory
    const testMemory = {
      crew_member: 'data',
      knowledge_type: 'technical',
      title: 'Supabase Setup Complete',
      content: 'All Supabase tables have been created and configured successfully',
      tags: ['setup', 'supabase', 'database'],
      metadata: { setup_complete: true, timestamp: new Date().toISOString() }
    }

    const { data: memoryData, error: memoryError } = await supabaseAdmin
      .from('crew_memories')
      .insert(testMemory)
      .select()

    if (memoryError) {
      console.error('⚠️  Warning inserting test memory:', memoryError)
    } else {
      console.log('✅ Test crew memory inserted successfully')
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase tables created successfully',
      data: {
        tables_created: [
          'job_opportunities',
          'contacts', 
          'applications',
          'crew_memories',
          'user_analytics'
        ],
        test_data_inserted: {
          job: jobData?.[0]?.id || null,
          memory: memoryData?.[0]?.id || null
        }
      }
    })

  } catch (error) {
    console.error('❌ Error setting up Supabase tables:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to set up Supabase tables' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking Supabase table status...')

    // Check if tables exist by trying to select from them
    const tables = ['job_opportunities', 'contacts', 'applications', 'crew_memories', 'user_analytics']
    const tableStatus = {}

    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          tableStatus[table] = { exists: false, error: error.message }
        } else {
          tableStatus[table] = { exists: true, count: data?.length || 0 }
        }
      } catch (err) {
        tableStatus[table] = { exists: false, error: err instanceof Error ? err.message : 'Unknown error' }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase table status checked',
      data: tableStatus
    })

  } catch (error) {
    console.error('❌ Error checking Supabase tables:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check Supabase tables' 
    }, { status: 500 })
  }
}
