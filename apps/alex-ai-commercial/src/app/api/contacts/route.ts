import { NextResponse } from 'next/server'
import { getSupabaseClientSync } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('👥 Fetching contacts from Supabase...')
    
    const supabase = getSupabaseClientSync()
    
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching contacts:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Retrieved ${contacts?.length || 0} contacts`)
    return NextResponse.json(contacts || [])
    
  } catch (error) {
    console.error('❌ Unexpected error in contacts API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('📝 Creating new contact...')
    
    const body = await request.json()
    const supabase = getSupabaseClientSync()
    
    const { data: contact, error } = await supabase
      .from('contacts')
      .insert([{
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        position: body.position,
        linkedin_url: body.linkedin_url,
        notes: body.notes
      }])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating contact:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Created contact: ${contact.id}`)
    return NextResponse.json(contact)
    
  } catch (error) {
    console.error('❌ Unexpected error creating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
