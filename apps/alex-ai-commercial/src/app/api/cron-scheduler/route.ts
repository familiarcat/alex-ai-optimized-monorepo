import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Cron scheduler for automatic job scraping
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const secret = searchParams.get('secret')
    
    // Verify secret for security (in production, use a proper secret)
    const expectedSecret = process.env.CRON_SECRET || 'alex-ai-cron-secret'
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    if (action === 'run-scheduled') {
      // Run all due scheduled scraping jobs
      const result = await runScheduledJobs()
      return NextResponse.json({ 
        success: true, 
        result,
        message: `Processed ${result.processed} scheduled jobs`
      })
    }
    
    if (action === 'check-due') {
      // Check which jobs are due to run
      const dueJobs = await getDueJobs()
      return NextResponse.json({ 
        success: true, 
        dueJobs,
        count: dueJobs.length
      })
    }
    
    if (action === 'status') {
      // Get scheduler status
      const status = await getSchedulerStatus()
      return NextResponse.json({ 
        success: true, 
        status
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ Cron scheduler error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// POST - Manual trigger for testing
export async function POST(request: Request) {
  try {
    const { action, configId } = await request.json()
    
    if (action === 'trigger-job') {
      if (!configId) {
        return NextResponse.json(
          { success: false, error: 'Configuration ID required' },
          { status: 400 }
        )
      }
      
      const result = await triggerScheduledJob(configId)
      return NextResponse.json({ 
        success: true, 
        result,
        message: 'Scheduled job triggered successfully'
      })
    }
    
    if (action === 'run-all-due') {
      const result = await runScheduledJobs()
      return NextResponse.json({ 
        success: true, 
        result,
        message: `Processed ${result.processed} scheduled jobs`
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ Cron scheduler POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// Helper functions
async function getDueJobs() {
  try {
    const now = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('scheduled_scraping_configs')
      .select('*')
      .eq('enabled', true)
      .lte('next_run', now)
      .order('next_run', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching due jobs:', error)
    return []
  }
}

async function runScheduledJobs() {
  const dueJobs = await getDueJobs()
  const results = []
  
  console.log(`🕐 Running ${dueJobs.length} scheduled scraping jobs...`)
  
  for (const config of dueJobs) {
    try {
      console.log(`🚀 Triggering scheduled job: ${config.name}`)
      
      // Trigger the scraping job
      const result = await triggerScheduledJob(config.id)
      results.push({
        configId: config.id,
        configName: config.name,
        success: true,
        result
      })
      
      // Log the execution
      await logScheduleExecution(config.id, result.jobId, 'triggered', {
        source: config.source,
        searchTerm: config.search_term,
        location: config.location,
        maxResults: config.max_results
      })
      
    } catch (error) {
      console.error(`❌ Failed to run scheduled job ${config.name}:`, error)
      results.push({
        configId: config.id,
        configName: config.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      // Log the failure
      await logScheduleExecution(config.id, null, 'failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return {
    processed: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  }
}

async function triggerScheduledJob(configId: string) {
  // Get the configuration
  const { data: config, error: configError } = await supabase
    .from('scheduled_scraping_configs')
    .select('*')
    .eq('id', configId)
    .single()
  
  if (configError || !config) {
    throw new Error('Configuration not found')
  }
  
  // Trigger the scraping job via the job-scraping API
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/job-scraping`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: config.source,
      searchTerm: config.search_term,
      location: config.location,
      maxResults: config.max_results,
      scheduled: true,
      configId: config.id
    })
  })
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to trigger scraping job')
  }
  
  // Update the configuration with new run times
  const nextRun = calculateNextRun(config.schedule)
  await supabase
    .from('scheduled_scraping_configs')
    .update({
      last_run: new Date().toISOString(),
      next_run: nextRun,
      updated_at: new Date().toISOString()
    })
    .eq('id', configId)
  
  return {
    jobId: result.jobId,
    configId: config.id,
    nextRun,
    message: result.message
  }
}

async function getSchedulerStatus() {
  try {
    // Get configuration counts
    const { data: configs, error: configsError } = await supabase
      .from('scheduled_scraping_configs')
      .select('id, enabled, schedule, last_run, next_run')
    
    if (configsError) throw configsError
    
    // Get recent job counts
    const { data: recentJobs, error: jobsError } = await supabase
      .from('scraping_jobs')
      .select('id, status, scheduled, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    
    if (jobsError) throw jobsError
    
    // Calculate statistics
    const totalConfigs = configs.length
    const enabledConfigs = configs.filter(c => c.enabled).length
    const dueJobs = configs.filter(c => c.enabled && c.next_run && new Date(c.next_run) <= new Date()).length
    
    const totalJobs = recentJobs.length
    const scheduledJobs = recentJobs.filter(j => j.scheduled).length
    const completedJobs = recentJobs.filter(j => j.status === 'completed').length
    const failedJobs = recentJobs.filter(j => j.status === 'failed').length
    
    return {
      configs: {
        total: totalConfigs,
        enabled: enabledConfigs,
        disabled: totalConfigs - enabledConfigs,
        due: dueJobs
      },
      jobs: {
        total: totalJobs,
        scheduled: scheduledJobs,
        manual: totalJobs - scheduledJobs,
        completed: completedJobs,
        failed: failedJobs,
        successRate: totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0
      },
      nextRun: configs
        .filter(c => c.enabled && c.next_run)
        .sort((a, b) => new Date(a.next_run!).getTime() - new Date(b.next_run!).getTime())[0]?.next_run,
      lastRun: configs
        .filter(c => c.last_run)
        .sort((a, b) => new Date(b.last_run!).getTime() - new Date(a.last_run!).getTime())[0]?.last_run
    }
  } catch (error) {
    console.error('Error getting scheduler status:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function logScheduleExecution(configId: string, jobId: string | null, action: string, details: any) {
  try {
    await supabase
      .from('scraping_schedule_logs')
      .insert([{
        config_id: configId,
        job_id: jobId,
        action,
        details,
        triggered_by: 'system'
      }])
  } catch (error) {
    console.error('Error logging schedule execution:', error)
  }
}

function calculateNextRun(schedule: string): string {
  const now = new Date()
  
  switch (schedule) {
    case 'hourly':
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString()
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    default:
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString() // Default to hourly
  }
}
