import { useState, useEffect, useRef, useCallback } from 'react'

interface ScrapingJob {
  id: string
  source: string
  search_term: string
  location: string
  status: string
  jobs_found: number
  jobs_stored: number
  started_at: string
  completed_at?: string
  error_message?: string
}

interface UseJobScrapingEventsReturn {
  jobs: ScrapingJob[]
  isConnected: boolean
  error: string | null
  reconnect: () => void
  lastUpdate: Date | null
}

export function useJobScrapingEvents(): UseJobScrapingEventsReturn {
  const [jobs, setJobs] = useState<ScrapingJob[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    try {
      // Close existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      // Clear any existing reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      console.log('🔌 Connecting to job scraping events...')
      
      // Create new EventSource connection
      const eventSource = new EventSource('/api/job-scraping/events')
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log('✅ Connected to job scraping events')
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📨 Received job scraping event:', data)
          
          if (data.type === 'job_update') {
            setJobs(prevJobs => {
              const existingIndex = prevJobs.findIndex(job => job.id === data.job.id)
              if (existingIndex >= 0) {
                // Update existing job
                const updatedJobs = [...prevJobs]
                updatedJobs[existingIndex] = data.job
                return updatedJobs
              } else {
                // Add new job
                return [...prevJobs, data.job]
              }
            })
            setLastUpdate(new Date())
          } else if (data.type === 'jobs_list') {
            setJobs(data.jobs || [])
            setLastUpdate(new Date())
          }
        } catch (err) {
          console.error('❌ Error parsing job scraping event:', err)
          setError('Failed to parse event data')
        }
      }

      eventSource.onerror = (event) => {
        console.error('❌ Job scraping events connection error:', event)
        setIsConnected(false)
        setError('Connection lost')
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000) // Exponential backoff, max 30s
          
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        } else {
          console.error('❌ Max reconnection attempts reached')
          setError('Failed to reconnect after multiple attempts')
        }
      }

    } catch (err) {
      console.error('❌ Error creating EventSource:', err)
      setError('Failed to create connection')
      setIsConnected(false)
    }
  }, [])

  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnect requested')
    reconnectAttempts.current = 0
    connect()
  }, [connect])

  // Initial connection
  useEffect(() => {
    connect()

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  // Fetch initial data when connected
  useEffect(() => {
    if (isConnected) {
      // Fetch current jobs to populate initial state
      fetch('/api/job-scraping')
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setJobs(data)
            setLastUpdate(new Date())
          }
        })
        .catch(err => {
          console.error('❌ Error fetching initial jobs:', err)
        })
    }
  }, [isConnected])

  return {
    jobs,
    isConnected,
    error,
    reconnect,
    lastUpdate
  }
}

// Hook for getting the latest job status
export function useLatestJobStatus() {
  const [latestJob, setLatestJob] = useState<ScrapingJob | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchLatestJob = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/job-scraping')
      const jobs = await response.json()
      
      if (Array.isArray(jobs) && jobs.length > 0) {
        // Get the most recent job
        const latest = jobs.sort((a, b) => 
          new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
        )[0]
        setLatestJob(latest)
      } else {
        setLatestJob(null)
      }
    } catch (error) {
      console.error('❌ Error fetching latest job:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLatestJob()
  }, [fetchLatestJob])

  return {
    latestJob,
    isLoading,
    refetch: fetchLatestJob
  }
}