import { useState, useEffect, useRef, useCallback } from 'react'
import { userAnalytics, UserAnalytics } from '@/lib/user-analytics-simple'

interface UserCentricPollingConfig {
  baseInterval?: number // Default interval in minutes
  enabled?: boolean
  maxRetries?: number
  backoffMultiplier?: number
}

interface UserCentricPollingState {
  isActive: boolean
  lastUpdate: Date | null
  nextUpdate: Date | null
  userAnalytics: UserAnalytics | null
  isUserActive: boolean
  recommendedFrequency: number
  errorCount: number
  retryCount: number
}

export function useUserCentricPolling<T>(
  fetchFunction: () => Promise<T>,
  config: UserCentricPollingConfig = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [state, setState] = useState<UserCentricPollingState>({
    isActive: false,
    lastUpdate: null,
    nextUpdate: null,
    userAnalytics: null,
    isUserActive: false,
    recommendedFrequency: 1440, // 24 hours default
    errorCount: 0,
    retryCount: 0
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  const lastUserActivityRef = useRef<Date>(new Date())

  const {
    baseInterval = 1440, // 24 hours default
    enabled = true,
    maxRetries = 3,
    backoffMultiplier = 2
  } = config

  // Load user analytics and determine polling frequency
  const loadUserAnalytics = useCallback(async () => {
    try {
      const analytics = await userAnalytics.getUserAnalytics()
      if (analytics) {
        setState(prev => ({
          ...prev,
          userAnalytics: analytics,
          isUserActive: analytics.isActiveUser,
          recommendedFrequency: analytics.recommendedFrequency
        }))
        
        // Track page view
        await userAnalytics.trackPageView('polling_dashboard')
        
        return analytics
      }
    } catch (error) {
      console.error('Error loading user analytics:', error)
    }
    return null
  }, [])

  // Calculate next update time based on user behavior
  const calculateNextUpdate = useCallback((analytics: UserAnalytics | null): Date => {
    if (!analytics) {
      // Default to 24 hours if no analytics
      return new Date(Date.now() + baseInterval * 60 * 1000)
    }

    const now = new Date()
    const lastRefresh = new Date(analytics.session.last_automatic_refresh)
    const timeSinceLastRefresh = now.getTime() - lastRefresh.getTime()
    const recommendedInterval = analytics.recommendedFrequency * 60 * 1000

    // If user is active and hasn't refreshed recently, refresh sooner
    if (analytics.isActiveUser && timeSinceLastRefresh > recommendedInterval * 0.5) {
      return new Date(now.getTime() + recommendedInterval * 0.3) // 30% of recommended interval
    }

    // If user manually refreshed recently, respect their preference
    const lastManualRefresh = new Date(analytics.session.last_manual_refresh)
    const timeSinceManualRefresh = now.getTime() - lastManualRefresh.getTime()
    
    if (timeSinceManualRefresh < 60 * 60 * 1000) { // Within 1 hour
      return new Date(now.getTime() + recommendedInterval * 0.5) // 50% of recommended interval
    }

    // Default to recommended frequency
    return new Date(now.getTime() + recommendedInterval)
  }, [baseInterval])

  const fetchData = useCallback(async (isRetry = false, isManual = false) => {
    if (!isMountedRef.current) return

    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchFunction()
      
      if (isMountedRef.current) {
        setData(result)
        setState(prev => ({
          ...prev,
          isActive: true,
          lastUpdate: new Date(),
          errorCount: 0,
          retryCount: 0
        }))

        // Track the refresh
        if (isManual) {
          await userAnalytics.trackManualRefresh()
        } else {
          await userAnalytics.trackInteraction('automatic_refresh')
        }

        // Update next update time
        const analytics = await loadUserAnalytics()
        const nextUpdate = calculateNextUpdate(analytics)
        setState(prev => ({ ...prev, nextUpdate }))
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        
        setState(prev => {
          const newErrorCount = prev.errorCount + 1
          const newRetryCount = prev.retryCount + 1
          
          // If we've exceeded max retries, stop polling
          if (newRetryCount >= maxRetries) {
            return {
              ...prev,
              isActive: false,
              errorCount: newErrorCount,
              retryCount: newRetryCount
            }
          }
          
          return {
            ...prev,
            errorCount: newErrorCount,
            retryCount: newRetryCount
          }
        })
        
        // Schedule retry with exponential backoff
        if (state.retryCount < maxRetries) {
          const retryDelay = 60000 * Math.pow(backoffMultiplier, state.retryCount) // Start with 1 minute
          timeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              fetchData(true)
            }
          }, retryDelay)
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [fetchFunction, maxRetries, backoffMultiplier, state.retryCount, loadUserAnalytics, calculateNextUpdate])

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    if (enabled && state.isActive) {
      // Use a shorter interval for checking (every minute)
      // but only actually fetch when it's time based on user analytics
      intervalRef.current = setInterval(async () => {
        if (isMountedRef.current) {
          const shouldRefresh = await userAnalytics.shouldRefresh()
          if (shouldRefresh) {
            fetchData()
          }
        }
      }, 60000) // Check every minute
    }
  }, [enabled, state.isActive, fetchData])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const pausePolling = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false }))
    stopPolling()
  }, [stopPolling])

  const resumePolling = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true }))
  }, [])

  const forceRefresh = useCallback(async () => {
    stopPolling()
    await fetchData(false, true) // Mark as manual refresh
  }, [fetchData, stopPolling])

  // Check for user activity and adjust polling accordingly
  const checkUserActivity = useCallback(async () => {
    const now = new Date()
    const timeSinceLastActivity = now.getTime() - lastUserActivityRef.current.getTime()
    
    // If user has been inactive for more than 30 minutes, reduce polling frequency
    if (timeSinceLastActivity > 30 * 60 * 1000) {
      setState(prev => ({ ...prev, isUserActive: false }))
    } else {
      setState(prev => ({ ...prev, isUserActive: true }))
    }
  }, [])

  // Track user activity
  const trackUserActivity = useCallback(() => {
    lastUserActivityRef.current = new Date()
    setState(prev => ({ ...prev, isUserActive: true }))
  }, [])

  // Initial setup
  useEffect(() => {
    const initialize = async () => {
      if (enabled) {
        // Load user analytics
        const analytics = await loadUserAnalytics()
        
        // Calculate next update time
        const nextUpdate = calculateNextUpdate(analytics)
        setState(prev => ({ ...prev, nextUpdate }))
        
        // Initial fetch
        await fetchData()
      }
    }
    
    initialize()
  }, [enabled, loadUserAnalytics, calculateNextUpdate, fetchData])

  // Start/stop polling based on state
  useEffect(() => {
    if (enabled && state.isActive && state.retryCount < maxRetries) {
      startPolling()
    } else {
      stopPolling()
    }
    
    return () => stopPolling()
  }, [enabled, state.isActive, state.retryCount, startPolling, stopPolling])

  // Check user activity periodically
  useEffect(() => {
    const activityInterval = setInterval(checkUserActivity, 60000) // Check every minute
    return () => clearInterval(activityInterval)
  }, [checkUserActivity])

  // Track user activity on various events
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleUserActivity = () => {
      trackUserActivity()
    }
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true)
    })
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true)
      })
    }
  }, [trackUserActivity])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      stopPolling()
    }
  }, [stopPolling])

  return {
    data,
    loading,
    error,
    state,
    forceRefresh,
    pausePolling,
    resumePolling,
    stopPolling,
    trackUserActivity
  }
}

// Specialized hook for job scraping with user-centric polling
export function useUserCentricJobScrapingPolling() {
  const fetchScrapingJobs = useCallback(async () => {
    const response = await fetch('/api/job-scraping')
    if (!response.ok) throw new Error('Failed to fetch scraping jobs')
    return response.json()
  }, [])

  return useUserCentricPolling(fetchScrapingJobs, {
    baseInterval: 1440, // 24 hours default
    enabled: true,
    maxRetries: 3,
    backoffMultiplier: 2
  })
}

// Specialized hook for scheduled scraping with user-centric polling
export function useUserCentricScheduledScrapingPolling() {
  const fetchScheduledData = useCallback(async () => {
    const [configsResponse, statusResponse] = await Promise.all([
      fetch('/api/scheduled-scraping?action=configs'),
      fetch('/api/scheduled-scraping?action=status')
    ])
    
    if (!configsResponse.ok || !statusResponse.ok) {
      throw new Error('Failed to fetch scheduled scraping data')
    }
    
    const [configs, status] = await Promise.all([
      configsResponse.json(),
      statusResponse.json()
    ])
    
    return { configs: configs.configs, status: status.status }
  }, [])

  return useUserCentricPolling(fetchScheduledData, {
    baseInterval: 1440, // 24 hours default
    enabled: true,
    maxRetries: 2,
    backoffMultiplier: 1.5
  })
}
