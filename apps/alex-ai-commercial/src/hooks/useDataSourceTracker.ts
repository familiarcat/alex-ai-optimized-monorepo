import { useState, useEffect, useCallback } from 'react'

export type DataSource = 'mock' | 'database' | 'n8n' | 'scraping' | 'unknown'

interface DataSourceInfo {
  source: DataSource
  lastUpdate: Date | null
  recordCount: number
  isLive: boolean
  metadata?: Record<string, any>
}

interface UseDataSourceTrackerReturn {
  dataSource: DataSourceInfo
  updateDataSource: (jobs: any[]) => void
  fetchScrapingJobs: () => Promise<any[]>
  getDataSourceStatus: () => string
  isDataSourceActive: (source: DataSource) => boolean
}

export function useDataSourceTracker(): UseDataSourceTrackerReturn {
  const [dataSource, setDataSource] = useState<DataSourceInfo>({
    source: 'unknown',
    lastUpdate: null,
    recordCount: 0,
    isLive: false
  })

  // Determine data source based on job data
  const determineDataSource = useCallback((jobs: any[]): DataSource => {
    if (!jobs || jobs.length === 0) {
      return 'unknown'
    }

    // Check if jobs have mock IDs
    const hasMockJobs = jobs.some(job => job.id && typeof job.id === 'string' && job.id.startsWith('mock-'))
    if (hasMockJobs) {
      return 'mock'
    }

    // Check if jobs are from scraping
    const hasScrapingJobs = jobs.some(job => 
      job.source && 
      (job.source === 'linkedin' || job.source === 'indeed' || job.source === 'scraping')
    )
    if (hasScrapingJobs) {
      return 'scraping'
    }

    // Check if jobs have database-like structure
    const hasDatabaseJobs = jobs.some(job => 
      job.id && 
      typeof job.id === 'string' &&
      !job.id.startsWith('mock-') && 
      job.created_at && 
      job.updated_at
    )
    if (hasDatabaseJobs) {
      return 'database'
    }

    return 'unknown'
  }, [])

  // Update data source information
  const updateDataSource = useCallback((jobs: any[]) => {
    const source = determineDataSource(jobs)
    const now = new Date()
    
    // Check if data is live (recent updates)
    const isLive = jobs.some(job => {
      if (job.updated_at) {
        const updatedAt = new Date(job.updated_at)
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
        return updatedAt > fiveMinutesAgo
      }
      return false
    })

    setDataSource({
      source,
      lastUpdate: now,
      recordCount: jobs.length,
      isLive,
      metadata: {
        sampleJob: jobs[0] || null,
        sources: [...new Set(jobs.map(job => job.source).filter(Boolean))]
      }
    })

    console.log(`📊 Data source updated: ${source} (${jobs.length} records, live: ${isLive})`)
  }, [determineDataSource])

  // Fetch scraping jobs
  const fetchScrapingJobs = useCallback(async (): Promise<any[]> => {
    try {
      console.log('📡 Fetching scraping jobs...')
      
      const response = await fetch('/api/job-scraping')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const jobs = await response.json()
      console.log(`✅ Fetched ${jobs.length} scraping jobs`)
      
      return jobs
    } catch (error) {
      console.error('❌ Error fetching scraping jobs:', error)
      return []
    }
  }, [])

  // Get human-readable data source status
  const getDataSourceStatus = useCallback((): string => {
    const { source, recordCount, isLive, lastUpdate } = dataSource
    
    const statusMap: Record<DataSource, string> = {
      mock: 'Mock Data',
      database: 'Database',
      n8n: 'N8N Federation Crew',
      scraping: 'Live Scraping',
      unknown: 'Unknown Source'
    }

    const baseStatus = statusMap[source] || 'Unknown'
    const liveIndicator = isLive ? ' (Live)' : ''
    const countIndicator = recordCount > 0 ? ` (${recordCount} records)` : ''
    const timeIndicator = lastUpdate ? ` - Updated ${lastUpdate.toLocaleTimeString()}` : ''

    return `${baseStatus}${liveIndicator}${countIndicator}${timeIndicator}`
  }, [dataSource])

  // Check if a specific data source is active
  const isDataSourceActive = useCallback((source: DataSource): boolean => {
    return dataSource.source === source && dataSource.recordCount > 0
  }, [dataSource])

  // Auto-detect data source on mount
  useEffect(() => {
    const detectDataSource = async () => {
      try {
        // Only try N8N-compatible sources (no direct Supabase access)
        const responses = await Promise.allSettled([
          fetch('/api/mock-data?type=jobs'),
          fetch('/api/job-scraping'),
          fetch('/api/live-jobs')
        ])

        // Check which source has data
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i]
          if (response.status === 'fulfilled' && response.value.ok) {
            const jobs = await response.value.json()
            if (Array.isArray(jobs) && jobs.length > 0) {
              updateDataSource(jobs)
              break
            }
          }
        }
      } catch (error) {
        console.error('❌ Error detecting data source:', error)
      }
    }

    detectDataSource()
  }, [updateDataSource])

  return {
    dataSource,
    updateDataSource,
    fetchScrapingJobs,
    getDataSourceStatus,
    isDataSourceActive
  }
}

// Hook for tracking data source changes
export function useDataSourceHistory() {
  const [history, setHistory] = useState<DataSourceInfo[]>([])

  const addToHistory = useCallback((dataSource: DataSourceInfo) => {
    setHistory(prev => {
      const newHistory = [...prev, dataSource]
      // Keep only last 10 entries
      return newHistory.slice(-10)
    })
  }, [])

  const getHistory = useCallback(() => {
    return history
  }, [history])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return {
    history,
    addToHistory,
    getHistory,
    clearHistory
  }
}

// Hook for data source analytics
export function useDataSourceAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRequests: 0,
    sourceDistribution: {} as Record<DataSource, number>,
    averageResponseTime: 0,
    errorRate: 0
  })

  const trackRequest = useCallback((source: DataSource, responseTime: number, success: boolean) => {
    setAnalytics(prev => ({
      totalRequests: prev.totalRequests + 1,
      sourceDistribution: {
        ...prev.sourceDistribution,
        [source]: (prev.sourceDistribution[source] || 0) + 1
      },
      averageResponseTime: (prev.averageResponseTime + responseTime) / 2,
      errorRate: success ? prev.errorRate : prev.errorRate + 1
    }))
  }, [])

  const getAnalytics = useCallback(() => {
    return analytics
  }, [analytics])

  const resetAnalytics = useCallback(() => {
    setAnalytics({
      totalRequests: 0,
      sourceDistribution: {},
      averageResponseTime: 0,
      errorRate: 0
    })
  }, [])

  return {
    analytics,
    trackRequest,
    getAnalytics,
    resetAnalytics
  }
}