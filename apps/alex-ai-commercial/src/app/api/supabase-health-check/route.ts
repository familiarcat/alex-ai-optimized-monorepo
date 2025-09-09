import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('🔍 Checking Supabase health...')
    
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        healthy: false,
        error: 'Missing Supabase configuration',
        tables: {
          job_opportunities: false,
          contacts: false,
          applications: false,
          crew_memories: false
        }
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Check if key tables exist by attempting to query them
    const tableChecks = {
      job_opportunities: false,
      contacts: false,
      applications: false,
      crew_memories: false
    }
    
    // Test each table
    for (const tableName of Object.keys(tableChecks)) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('id')
          .limit(1)
        
        if (!error) {
          tableChecks[tableName as keyof typeof tableChecks] = true
        }
      } catch (error) {
        console.log(`Table ${tableName} not accessible:`, error)
      }
    }
    
    const allTablesReady = Object.values(tableChecks).every(Boolean)
    
    console.log('✅ Supabase health check complete:', {
      healthy: allTablesReady,
      tables: tableChecks
    })
    
    return NextResponse.json({
      healthy: allTablesReady,
      tables: tableChecks,
      message: allTablesReady 
        ? 'All Supabase tables are ready' 
        : 'Some Supabase tables are not ready - system will return errors instead of fallback data'
    })
    
  } catch (error) {
    console.error('❌ Supabase health check failed:', error)
    
    return NextResponse.json({
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      tables: {
        job_opportunities: false,
        contacts: false,
        applications: false,
        crew_memories: false
      }
    }, { status: 500 })
  }
}


