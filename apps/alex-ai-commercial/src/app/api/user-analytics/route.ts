import { NextResponse } from 'next/server'
import { getSupabaseClientSync } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    console.log('📊 Tracking user analytics event...')
    
    const body = await request.json()
    const { type, data, session_id } = body
    
    if (!type || !session_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, session_id' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClientSync()
    
    // Store the analytics event
    const { data: event, error } = await supabase
      .from('user_analytics_events')
      .insert([{
        session_id,
        event_type: type,
        event_data: data,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('❌ Error storing analytics event:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Tracked analytics event: ${type} for session ${session_id}`)
    return NextResponse.json({ success: true, event })
    
  } catch (error) {
    console.error('❌ Unexpected error in user analytics API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('session_id')
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing session_id parameter' },
        { status: 400 }
      )
    }

    console.log(`📊 Fetching analytics for session: ${sessionId}`)
    
    const supabase = getSupabaseClientSync()
    
    const { data: events, error } = await supabase
      .from('user_analytics_events')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('❌ Error fetching analytics events:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Retrieved ${events?.length || 0} analytics events`)
    return NextResponse.json({ success: true, events: events || [] })
    
  } catch (error) {
    console.error('❌ Unexpected error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
