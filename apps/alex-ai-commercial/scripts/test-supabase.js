const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('job_opportunities')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Connection error:', error)
    } else {
      console.log('✅ Connection successful')
    }
    
    // Test inserting a simple record
    const { data: insertData, error: insertError } = await supabase
      .from('job_opportunities')
      .insert({
        title: 'Test Job',
        company: 'Test Company',
        location: 'Test Location',
        alex_ai_score: 50
      })
      .select()
    
    if (insertError) {
      console.error('Insert error:', insertError)
    } else {
      console.log('✅ Insert successful:', insertData)
    }
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testConnection()
