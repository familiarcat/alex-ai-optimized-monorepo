import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClientSync } from '@/lib/supabase'
import { withRateLimit, rateLimiters } from '@/lib/rate-limiter'
import { SecurityManager, ValidationSchemas } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = withRateLimit(rateLimiters.api)(request)
    if (rateLimitResponse) return rateLimitResponse

    console.log('📋 Fetching job opportunities from Supabase...')
    
    const supabase = getSupabaseClientSync()
    
    const { data: jobs, error } = await supabase
      .from('job_opportunities')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching job opportunities:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Retrieved ${jobs?.length || 0} job opportunities`)
    return NextResponse.json(jobs || [])
    
  } catch (error) {
    console.error('❌ Unexpected error in job opportunities API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = withRateLimit(rateLimiters.api)(request)
    if (rateLimitResponse) return rateLimitResponse

    console.log('📝 Creating new job opportunity...')
    
    const body = await request.json()
    
    // Validate input data
    if (!ValidationSchemas.jobTitle(body.position)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job title' },
        { status: 400 }
      )
    }
    
    if (!ValidationSchemas.location(body.location)) {
      return NextResponse.json(
        { success: false, error: 'Invalid location' },
        { status: 400 }
      )
    }
    
    // Sanitize input
    const sanitizedBody = {
      ...body,
      company: SecurityManager.sanitizeInput(body.company || ''),
      position: SecurityManager.sanitizeInput(body.position),
      location: SecurityManager.sanitizeInput(body.location),
      description: SecurityManager.sanitizeInput(body.description || ''),
      requirements: SecurityManager.sanitizeInput(body.requirements || ''),
      benefits: SecurityManager.sanitizeInput(body.benefits || '')
    }
    
    const supabase = getSupabaseClientSync()
    
    const { data: job, error } = await supabase
      .from('job_opportunities')
      .insert([{
        company: sanitizedBody.company,
        position: sanitizedBody.position,
        location: sanitizedBody.location,
        remote_option: sanitizedBody.remote_option,
        salary_range: sanitizedBody.salary_range,
        description: sanitizedBody.description,
        requirements: sanitizedBody.requirements,
        benefits: sanitizedBody.benefits,
        application_url: sanitizedBody.application_url,
        source: sanitizedBody.source || 'manual',
        scraped_at: new Date().toISOString(),
        alex_ai_score: sanitizedBody.alex_ai_score || 0,
        st_louis_area: sanitizedBody.st_louis_area || false,
        st_louis_focus: sanitizedBody.st_louis_focus || false
      }])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating job opportunity:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Created job opportunity: ${job.id}`)
    return NextResponse.json(job)
    
  } catch (error) {
    console.error('❌ Unexpected error creating job opportunity:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
