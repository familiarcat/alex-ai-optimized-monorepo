import { NextResponse } from 'next/server'
import { getSupabaseClientSync } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🏗️ Attempting to create database tables...')
    
    const supabase = getSupabaseClientSync()
    
    // Try to create tables using direct SQL
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS job_opportunities (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        company TEXT NOT NULL,
        position TEXT NOT NULL,
        location TEXT,
        remote_option TEXT,
        salary_range TEXT,
        description TEXT,
        requirements TEXT,
        benefits TEXT,
        application_url TEXT,
        source TEXT DEFAULT 'manual',
        scraped_at TIMESTAMP WITH TIME ZONE,
        alex_ai_score INTEGER DEFAULT 0,
        st_louis_area BOOLEAN DEFAULT false,
        st_louis_focus BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        position TEXT,
        linkedin_url TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS applications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        job_id UUID REFERENCES job_opportunities(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'applied',
        application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    // Try to execute the SQL
    const { data, error } = await supabase.rpc('exec', { sql: createTablesSQL })
    
    if (error) {
      console.error('❌ Error creating tables:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to create tables',
        details: error.message,
        instructions: {
          step1: 'Go to Supabase Dashboard',
          step2: 'Navigate to SQL Editor',
          step3: 'Run the SQL schema creation script',
          step4: 'Tables will be created automatically'
        }
      }, { status: 500 })
    }
    
    console.log('✅ Database tables created successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully',
      data
    })
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Database setup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      instructions: {
        step1: 'Go to Supabase Dashboard',
        step2: 'Navigate to SQL Editor', 
        step3: 'Run the SQL schema creation script',
        step4: 'Tables will be created automatically'
      }
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log('🔍 Checking database table status...')
    
    const supabase = getSupabaseClientSync()
    
    // Check which tables exist
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (error) {
      console.error('❌ Error checking tables:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to check tables',
        details: error.message
      }, { status: 500 })
    }
    
    const existingTables = tables?.map(t => t.table_name) || []
    const requiredTables = [
      'job_opportunities',
      'contacts', 
      'applications',
      'user_analytics_events',
      'user_sessions'
    ]
    
    const missingTables = requiredTables.filter(table => !existingTables.includes(table))
    const presentTables = requiredTables.filter(table => existingTables.includes(table))
    
    return NextResponse.json({
      success: true,
      existingTables,
      presentTables,
      missingTables,
      status: missingTables.length === 0 ? 'complete' : 'incomplete'
    })
    
  } catch (error) {
    console.error('❌ Error checking database status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check database status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
