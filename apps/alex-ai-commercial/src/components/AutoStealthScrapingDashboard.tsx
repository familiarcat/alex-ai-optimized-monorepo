'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AutoScrapingConfig {
  enabled: boolean
  intervalHours: number
  sources: string[]
  searchTerms: string[]
  locations: string[]
  maxResults: number
  lastRun?: string
  nextRun?: string
}

interface AutoScrapingJob {
  id: string
  source: string
  searchTerm: string
  location: string
  status: 'scheduled' | 'running' | 'completed' | 'failed'
  scheduledAt: string
  startedAt?: string
  completedAt?: string
  error?: string
}

interface AutoScrapingStatus {
  enabled: boolean
  isRunning: boolean
  lastRun?: string
  nextRun?: string
  totalJobs: number
  recentJobs: number
  successRate: number
}

interface AutoStealthScrapingDashboardProps {
  onJobsUpdated?: () => void
}

export default function AutoStealthScrapingDashboard({ onJobsUpdated }: AutoStealthScrapingDashboardProps) {
  const [status, setStatus] = useState<AutoScrapingStatus | null>(null)
  const [config, setConfig] = useState<AutoScrapingConfig | null>(null)
  const [recentJobs, setRecentJobs] = useState<AutoScrapingJob[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Manual scraping form state
  const [manualScraping, setManualScraping] = useState({
    source: 'linkedin',
    searchTerm: 'AI Engineer',
    location: 'St. Louis, MO',
    maxResults: 10
  })

  const sources = [
    { value: 'linkedin', label: 'LinkedIn Jobs', icon: '💼' },
    { value: 'indeed', label: 'Indeed', icon: '🔍' },
    { value: 'glassdoor', label: 'Glassdoor', icon: '🏢' }
  ]

  const locations = [
    'St. Louis, MO',
    'Remote',
    'Hybrid',
    'Missouri',
    'Illinois',
    'United States'
  ]

  const searchTerms = [
    'AI Engineer',
    'Machine Learning Engineer',
    'Data Scientist',
    'Software Engineer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Product Manager',
    'UX Designer'
  ]

  // Fetch auto scraping status
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/auto-stealth-scraping')
      if (response.ok) {
        const data = await response.json()
        setStatus(data.status)
        setConfig(data.config)
        setRecentJobs(data.recentJobs || [])
      }
    } catch (error) {
      console.error('Error fetching auto scraping status:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle auto scraping actions
  const handleAction = async (action: string, data?: any) => {
    setActionLoading(action)
    try {
      const response = await fetch('/api/auto-stealth-scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...data })
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result.message)
        await fetchStatus()
        if (onJobsUpdated) {
          onJobsUpdated()
        }
      } else {
        const error = await response.json()
        console.error('Action failed:', error.error)
        alert(`Action failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error performing action:', error)
      alert('Error performing action')
    } finally {
      setActionLoading(null)
    }
  }

  // Handle manual scraping
  const handleManualScraping = async () => {
    await handleAction('manual-trigger', { manualScraping })
  }

  // Update configuration
  const updateConfig = async (newConfig: Partial<AutoScrapingConfig>) => {
    await handleAction('update-config', { config: newConfig })
  }

  // Format time
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'Never'
    return new Date(timestamp).toLocaleString()
  }

  // Get time until next run
  const getTimeUntilNextRun = () => {
    if (!status?.nextRun) return 'Unknown'
    const now = new Date()
    const nextRun = new Date(status.nextRun)
    const diffMs = nextRun.getTime() - now.getTime()
    
    if (diffMs <= 0) return 'Running now'
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    } else {
      return `${diffMinutes}m`
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'running': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'scheduled': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  useEffect(() => {
    fetchStatus()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          🤖 Auto Stealth Scraping
          {status?.enabled && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          )}
        </h2>
        <p className="text-gray-600 mt-1">
          Automated job scraping every hour with manual override capability
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Status</div>
            <div className="text-lg font-semibold">
              {status?.enabled ? '🟢 Running' : '🔴 Stopped'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Next Run</div>
            <div className="text-lg font-semibold">
              {getTimeUntilNextRun()}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Recent Jobs</div>
            <div className="text-lg font-semibold">{status?.recentJobs || 0}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-lg font-semibold">{status?.successRate || 0}%</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAction('start')}
            disabled={actionLoading === 'start' || status?.enabled}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {actionLoading === 'start' ? 'Starting...' : '🚀 Start Auto Scraping'}
          </button>
          
          <button
            onClick={() => handleAction('stop')}
            disabled={actionLoading === 'stop' || !status?.enabled}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {actionLoading === 'stop' ? 'Stopping...' : '⏹️ Stop Auto Scraping'}
          </button>
          
          <button
            onClick={() => handleAction('cleanup')}
            disabled={actionLoading === 'cleanup'}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {actionLoading === 'cleanup' ? 'Cleaning...' : '🧹 Cleanup Old Jobs'}
          </button>
        </div>

        {/* Configuration */}
        {config && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Interval:</span>
                <span className="ml-2 font-medium">{config.intervalHours} hour(s)</span>
              </div>
              <div>
                <span className="text-gray-600">Sources:</span>
                <span className="ml-2 font-medium">{config.sources.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-600">Search Terms:</span>
                <span className="ml-2 font-medium">{config.searchTerms.length} terms</span>
              </div>
              <div>
                <span className="text-gray-600">Locations:</span>
                <span className="ml-2 font-medium">{config.locations.length} locations</span>
              </div>
              <div>
                <span className="text-gray-600">Max Results:</span>
                <span className="ml-2 font-medium">{config.maxResults} per job</span>
              </div>
              <div>
                <span className="text-gray-600">Last Run:</span>
                <span className="ml-2 font-medium">{formatTime(config.lastRun)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Manual Scraping */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Manual Scraping Override</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={manualScraping.source}
              onChange={(e) => setManualScraping({...manualScraping, source: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sources.map(source => (
                <option key={source.value} value={source.value}>
                  {source.icon} {source.label}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              value={manualScraping.searchTerm}
              onChange={(e) => setManualScraping({...manualScraping, searchTerm: e.target.value})}
              placeholder="Search term"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <select
              value={manualScraping.location}
              onChange={(e) => setManualScraping({...manualScraping, location: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            <button
              onClick={handleManualScraping}
              disabled={actionLoading === 'manual-trigger'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading === 'manual-trigger' ? 'Scraping...' : '🔧 Run Now'}
            </button>
          </div>
        </div>

        {/* Recent Jobs */}
        {recentJobs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Jobs (Last 24 Hours)</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {job.source} - {job.searchTerm} in {job.location}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(job.scheduledAt)}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

