import { NextResponse } from 'next/server'
import { liveDataStore } from '@/lib/live-data-store'

export async function GET() {
  try {
    console.log('📊 Fetching live job data...')
    
    const jobs = liveDataStore.getJobs()
    const status = liveDataStore.getStatus()
    
    console.log(`✅ Retrieved ${jobs.length} live jobs`)
    
    return NextResponse.json({
      success: true,
      data: jobs,
      status,
      message: `Found ${jobs.length} live jobs`
    })
    
  } catch (error) {
    console.error('❌ Error fetching live jobs:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch live jobs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log('📝 Adding jobs to live data store...')
    
    const body = await request.json()
    const { jobs } = body
    
    if (!Array.isArray(jobs)) {
      return NextResponse.json({
        success: false,
        error: 'Jobs must be an array'
      }, { status: 400 })
    }
    
    liveDataStore.addJobs(jobs)
    const status = liveDataStore.getStatus()
    
    console.log(`✅ Added ${jobs.length} jobs to live data store`)
    
    return NextResponse.json({
      success: true,
      message: `Added ${jobs.length} jobs to live data store`,
      status
    })
    
  } catch (error) {
    console.error('❌ Error adding jobs to live data store:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add jobs to live data store',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    console.log('🗑️ Clearing live data store...')
    
    liveDataStore.clear()
    
    return NextResponse.json({
      success: true,
      message: 'Live data store cleared'
    })
    
  } catch (error) {
    console.error('❌ Error clearing live data store:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to clear live data store',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

