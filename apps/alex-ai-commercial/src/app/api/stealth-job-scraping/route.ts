/**
 * Stealth Job Scraping API
 * 
 * This API endpoint provides IP-protected job scraping using Puppeteer stealth techniques
 * to avoid detection and protect the user's IP address from being logged.
 */

import { NextRequest, NextResponse } from 'next/server'

// Import stealth scraping service only on server-side
let stealthScrapingService: any = null

try {
  if (typeof window === 'undefined') {
    const { stealthScrapingService: service } = require('@/lib/stealth-scraping')
    stealthScrapingService = service
  }
} catch (error) {
  console.warn('Stealth scraping service not available:', error)
}

// Scraping job status
interface ScrapingJob {
  id: string
  source: string
  searchTerm: string
  location: string
  status: 'pending' | 'scraping' | 'completed' | 'failed'
  jobsFound: number
  jobsStored: number
  startedAt: string
  completedAt?: string
  error?: string
}

// In-memory storage for demo (replace with database in production)
const scrapingJobs: Map<string, ScrapingJob> = new Map()

export async function GET() {
  try {
    if (!stealthScrapingService) {
      return NextResponse.json([])
    }

    const jobs = Array.from(scrapingJobs.values())
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching scraping jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scraping jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!stealthScrapingService) {
      return NextResponse.json(
        { error: 'Stealth scraping service not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { source, searchTerm, location, maxResults = 10 } = body

    if (!source || !searchTerm || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: source, searchTerm, location' },
        { status: 400 }
      )
    }

    // Generate unique job ID
    const jobId = `stealth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create scraping job
    const scrapingJob: ScrapingJob = {
      id: jobId,
      source,
      searchTerm,
      location,
      status: 'pending',
      jobsFound: 0,
      jobsStored: 0,
      startedAt: new Date().toISOString()
    }

    scrapingJobs.set(jobId, scrapingJob)

    // Start scraping in background
    startStealthScraping(scrapingJob, maxResults)

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Stealth scraping job started successfully',
      estimatedTime: '2-5 minutes',
      protection: 'IP address protected with stealth techniques'
    })

  } catch (error) {
    console.error('Error starting stealth scraping job:', error)
    return NextResponse.json(
      { error: 'Failed to start scraping job' },
      { status: 500 }
    )
  }
}

/**
 * Start stealth scraping in background
 */
async function startStealthScraping(job: ScrapingJob, maxResults: number) {
  try {
    // Update status to scraping
    job.status = 'scraping'
    scrapingJobs.set(job.id, job)

    console.log(`🔍 Starting stealth scraping for job ${job.id}...`)

    let result
    if (job.source === 'linkedin') {
      result = await stealthScrapingService.scrapeLinkedInJobs(
        job.searchTerm,
        job.location,
        maxResults
      )
    } else if (job.source === 'indeed') {
      result = await stealthScrapingService.scrapeIndeedJobs(
        job.searchTerm,
        job.location,
        maxResults
      )
    } else {
      throw new Error(`Unsupported source: ${job.source}`)
    }

    if (result.success) {
      // Update job with results
      job.status = 'completed'
      job.jobsFound = result.jobs.length
      job.jobsStored = result.jobs.length
      job.completedAt = new Date().toISOString()
      
      console.log(`✅ Stealth scraping completed for job ${job.id}: ${result.jobs.length} jobs found`)
    } else {
      // Update job with error
      job.status = 'failed'
      job.error = result.error
      job.completedAt = new Date().toISOString()
      
      console.error(`❌ Stealth scraping failed for job ${job.id}:`, result.error)
    }

    scrapingJobs.set(job.id, job)

  } catch (error) {
    // Update job with error
    job.status = 'failed'
    job.error = error instanceof Error ? error.message : 'Unknown error'
    job.completedAt = new Date().toISOString()
    
    scrapingJobs.set(job.id, job)
    console.error(`❌ Stealth scraping error for job ${job.id}:`, error)
  }
}

/**
 * Get specific scraping job
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId } = body

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId' },
        { status: 400 }
      )
    }

    const job = scrapingJobs.get(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(job)

  } catch (error) {
    console.error('Error fetching scraping job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scraping job' },
      { status: 500 }
    )
  }
}
