import { useState, useEffect, useRef, useCallback } from 'react'
import { userAnalytics, UserAnalytics } from '@/lib/user-analytics-simple'
import { useSmartPolling } from './useSmartPolling'
import { useJobScrapingEvents } from './useJobScrapingEvents'

interface UserCentricJobScrapingPollingConfig {
  baseInterval?: number // Default interval in minutes
  enabled?: boolean
  maxRetries?: number
  onDataUpdate?: (data: any) => void
  useSmartPolling?: boolean
  useEvents?: boolean
}

interface UserCentricJobScrapingPollingState {
  isActive: boolean
  currentInterval: number
  lastPoll: Date | null
  nextPoll: Date | null
  pollCount: number
  isUserActive: boolean
  recommendedFrequency: number
  errorCount: number
  eventsConnected: boolean
  pollingMode: 'smart' | 'user-centric' | 'events'
}

export function useUserCentricJobScrapingPolling(config: UserCentricJobScrapingPollingConfig = {}) {
  const {
    baseInterval = 1440, // 24 hours default (in minutes)
    enabled = true,
    maxRetries = 3,
    onDataUpdate,
    useSmartPolling: enableSmartPolling = true,
    useEvents: enableEvents = true
  } = config

  const [state, setState] = useState<UserCentricJobScrapingPollingState>({
    isActive: false,
    currentInterval: baseInterval * 60 * 1000, // Convert to milliseconds
    lastPoll: null,
    nextPoll: null,
    pollCount: 0,
    isUserActive: false,
    recommendedFrequency: baseInterval,
    errorCount: 0,
    eventsConnected: false,
    pollingMode: 'user-centric'
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Use smart polling for job scraping
  const smartPolling = useSmartPolling({
    baseInterval: 30000, // 30 seconds
    activeInterval: 10000, // 10 seconds when active
    idleInterval: 60000, // 60 seconds when idle
    enabled: enabled && enableSmartPolling,
    onPoll: async () => {
      if (onDataUpdate) {
        await onDataUpdate(null)
      }
    }
  })

  // Use events for real-time updates
  const { isConnected: eventsConnected, jobs: eventJobs } = useJobScrapingEvents()

  // Get user analytics
  const getUserAnalytics = useCallback(async (): Promise<UserAnalytics | null> => {
    try {
      return await userAnalytics.getUserAnalytics()
    } catch (error) {
      console.error('❌ Error getting user analytics:', error)
      return null
    }
  }, [])

  // Calculate recommended polling frequency based on user behavior
  const calculateRecommendedFrequency = useCallback(async (): Promise<number> => {
    const analytics = await getUserAnalytics()
    if (!analytics) {
      return baseInterval
    }

    // Base frequency from user preferences
    let frequency = analytics.recommendedFrequency

    // Adjust based on user activity
    if (analytics.isActiveUser) {
      // Active users get more frequent updates
      frequency = Math.max(30, frequency * 0.3) // At least 30 minutes
    } else {
      // Inactive users get less frequent updates
      frequency = Math.min(2880, frequency * 1.5) // At most 48 hours
    }

    return Math.round(frequency)
  }, [baseInterval, getUserAnalytics])

  // Update polling state
  const updateState = useCallback((updates: Partial<UserCentricJobScrapingPollingState>) => {
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, ...updates }))
    }
  }, [])

  // Determine polling mode based on available features
  const determinePollingMode = useCallback((): 'smart' | 'user-centric' | 'events' => {
    if (enableEvents && eventsConnected) {
      return 'events'
    } else if (enableSmartPolling && smartPolling.isActive) {
      return 'smart'
    } else {
      return 'user-centric'
    }
  }, [enableEvents, eventsConnected, enableSmartPolling, smartPolling.isActive])

  // Perform a poll
  const poll = useCallback(async () => {
    if (!enabled || !isMountedRef.current) return

    try {
      // Get user analytics
      const analytics = await getUserAnalytics()
      if (analytics) {
        updateState({
          isUserActive: analytics.isActiveUser,
          recommendedFrequency: analytics.recommendedFrequency
        })
      }

      // Calculate new interval
      const newFrequency = await calculateRecommendedFrequency()
      const newInterval = newFrequency * 60 * 1000 // Convert to milliseconds

      updateState({
        currentInterval: newInterval,
        lastPoll: new Date(),
        nextPoll: new Date(Date.now() + newInterval),
        pollCount: state.pollCount + 1,
        errorCount: 0,
        pollingMode: determinePollingMode()
      })

      // Call data update callback
      if (onDataUpdate) {
        await onDataUpdate(null)
      }

    } catch (error) {
      console.error('❌ Error during user-centric poll:', error)
      updateState({
        errorCount: state.errorCount + 1
      })
    }
  }, [enabled, getUserAnalytics, calculateRecommendedFrequency, updateState, state.pollCount, state.errorCount, onDataUpdate, determinePollingMode])

  // Start polling
  const startPolling = useCallback(() => {
    if (!enabled || !isMountedRef.current) return

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Initial poll
    poll()

    // Set up interval for subsequent polls
    intervalRef.current = setInterval(poll, state.currentInterval)
  }, [enabled, poll, state.currentInterval])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Force a poll
  const forcePoll = useCallback(() => {
    if (enabled && isMountedRef.current) {
      poll()
    }
  }, [enabled, poll])

  // Reset polling
  const resetPolling = useCallback(() => {
    stopPolling()
    updateState({
      pollCount: 0,
      lastPoll: null,
      nextPoll: null,
      currentInterval: baseInterval * 60 * 1000,
      errorCount: 0
    })
    startPolling()
  }, [stopPolling, updateState, baseInterval, startPolling])

  // Update polling mode when events connection changes
  useEffect(() => {
    updateState({
      eventsConnected,
      pollingMode: determinePollingMode()
    })
  }, [eventsConnected, determinePollingMode, updateState])

  // Start/stop polling based on enabled state and polling mode
  useEffect(() => {
    const pollingMode = determinePollingMode()
    
    if (enabled && pollingMode === 'user-centric') {
      startPolling()
    } else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [enabled, determinePollingMode, startPolling, stopPolling])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      stopPolling()
    }
  }, [stopPolling])

  return {
    ...state,
    startPolling,
    stopPolling,
    forcePoll,
    resetPolling,
    // Smart polling integration
    smartPolling: {
      isActive: smartPolling.isActive,
      currentInterval: smartPolling.currentInterval,
      forcePoll: smartPolling.forcePoll
    },
    // Events integration
    events: {
      isConnected: eventsConnected,
      jobs: eventJobs
    }
  }
}

// Hook for scheduled scraping polling
export function useUserCentricScheduledScrapingPolling(config: UserCentricJobScrapingPollingConfig = {}) {
  const {
    baseInterval = 60, // 1 hour default for scheduled scraping
    enabled = true,
    onDataUpdate
  } = config

  const [state, setState] = useState({
    isActive: false,
    lastPoll: null as Date | null,
    nextPoll: null as Date | null,
    pollCount: 0
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Get user analytics
  const getUserAnalytics = useCallback(async (): Promise<UserAnalytics | null> => {
    try {
      return await userAnalytics.getUserAnalytics()
    } catch (error) {
      console.error('❌ Error getting user analytics:', error)
      return null
    }
  }, [])

  // Perform a poll
  const poll = useCallback(async () => {
    if (!enabled || !isMountedRef.current) return

    try {
      // Get user analytics
      const analytics = await getUserAnalytics()
      if (analytics) {
        // Adjust polling based on user activity
        const interval = analytics.isActiveUser ? baseInterval * 0.5 : baseInterval * 1.5
        setState(prev => ({
          ...prev,
          lastPoll: new Date(),
          nextPoll: new Date(Date.now() + interval * 60 * 1000),
          pollCount: prev.pollCount + 1
        }))
      }

      // Call data update callback
      if (onDataUpdate) {
        await onDataUpdate(null)
      }

    } catch (error) {
      console.error('❌ Error during scheduled scraping poll:', error)
    }
  }, [enabled, getUserAnalytics, baseInterval, onDataUpdate])

  // Start polling
  const startPolling = useCallback(() => {
    if (!enabled || !isMountedRef.current) return

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Initial poll
    poll()

    // Set up interval for subsequent polls
    intervalRef.current = setInterval(poll, baseInterval * 60 * 1000)
  }, [enabled, poll, baseInterval])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Force a poll
  const forcePoll = useCallback(() => {
    if (enabled && isMountedRef.current) {
      poll()
    }
  }, [enabled, poll])

  // Start/stop polling based on enabled state
  useEffect(() => {
    if (enabled) {
      startPolling()
    } else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [enabled, startPolling, stopPolling])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      stopPolling()
    }
  }, [stopPolling])

  return {
    ...state,
    startPolling,
    stopPolling,
    forcePoll
  }
}
