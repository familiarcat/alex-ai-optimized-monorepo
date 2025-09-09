import { NextResponse } from 'next/server'
import { getSupabaseClientSync } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('🗄️ Setting up database schema...')
    
    const supabase = getSupabaseClientSync()
    
    // Test if tables exist by trying to query them
    const tables = [
      'job_opportunities',
      'contacts', 
      'applications',
      'user_analytics_events',
      'user_sessions'
    ]

    const results = []
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1)

        if (error) {
          results.push({ table, status: 'missing', error: error.message })
        } else {
          results.push({ table, status: 'exists' })
        }
      } catch (err) {
        results.push({ table, status: 'missing', error: 'Table does not exist' })
      }
    }

    const missingTables = results.filter(r => r.status === 'missing')
    
    if (missingTables.length === 0) {
      console.log('✅ All database tables already exist')
      return NextResponse.json({
        success: true,
        message: 'All database tables already exist',
        tables: results
      })
    }

    console.log(`⚠️ Missing tables: ${missingTables.map(t => t.table).join(', ')}`)
    
    return NextResponse.json({
      success: false,
      message: 'Database tables need to be created manually in Supabase',
      missing_tables: missingTables,
      instructions: {
        step1: 'Go to Supabase Dashboard',
        step2: 'Navigate to SQL Editor',
        step3: 'Run the SQL schema creation script',
        step4: 'Tables will be created automatically'
      }
    })
    
  } catch (error) {
    console.error('❌ Unexpected error checking database:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}