import { NextResponse } from 'next/server'
import { getSupabaseClientSync } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🏥 Performing system health check...')
    
    const healthStatus = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        api: 'healthy',
        supabase: 'unknown',
        n8n: 'unknown'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    }

    // Test Supabase connectivity
    try {
      const supabase = getSupabaseClientSync()
      const { error } = await supabase
        .from('job_opportunities')
        .select('id')
        .limit(1)

      if (error) {
        healthStatus.services.supabase = 'unhealthy'
        healthStatus.status = 'degraded'
        console.warn('⚠️ Supabase health check failed:', error.message)
      } else {
        healthStatus.services.supabase = 'healthy'
        console.log('✅ Supabase health check passed')
      }
    } catch (error) {
      healthStatus.services.supabase = 'unhealthy'
      healthStatus.status = 'degraded'
      console.warn('⚠️ Supabase health check error:', error)
    }

    // Test N8N connectivity
    try {
      const n8nResponse = await fetch('https://n8n.pbradygeorgen.com/webhook/health', {
        method: 'GET',
        timeout: 5000
      })

      if (n8nResponse.ok) {
        healthStatus.services.n8n = 'healthy'
        console.log('✅ N8N health check passed')
      } else {
        healthStatus.services.n8n = 'unhealthy'
        healthStatus.status = 'degraded'
        console.warn('⚠️ N8N health check failed:', n8nResponse.status)
      }
    } catch (error) {
      healthStatus.services.n8n = 'unavailable'
      healthStatus.status = 'degraded'
      console.warn('⚠️ N8N health check error:', error)
    }

    // Determine overall status
    const unhealthyServices = Object.values(healthStatus.services).filter(
      status => status === 'unhealthy'
    )
    
    if (unhealthyServices.length > 0) {
      healthStatus.status = 'unhealthy'
    }

    console.log(`🏥 Health check completed: ${healthStatus.status}`)
    
    return NextResponse.json(healthStatus, {
      status: healthStatus.status === 'healthy' ? 200 : 503
    })
    
  } catch (error) {
    console.error('❌ Health check failed:', error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        error: 'Health check failed',
        services: {
          api: 'unhealthy',
          supabase: 'unknown',
          n8n: 'unknown'
        }
      },
      { status: 503 }
    )
  }
}