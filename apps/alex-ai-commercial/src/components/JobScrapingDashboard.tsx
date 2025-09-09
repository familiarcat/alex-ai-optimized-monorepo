'use client'

import React, { useState, useEffect } from 'react'
import { useUserCentricJobScrapingPolling } from '@/hooks/useUserCentricJobScrapingPolling'
import { useLatestJobStatus } from '@/hooks/useJobScrapingEvents'
import { userAnalytics } from '@/lib/user-analytics-simple'

interface ScrapingJob {
  id: string
  source: string
  search_term: string
  location: string
  status: 'started' | 'scraping' | 'completed' | 'failed'
  status_message?: string
  jobs_found: number
  jobs_stored: number
  started_at: string
  completed_at?: string
  created_at: string
}

interface JobScrapingDashboardProps {
  onJobsUpdated?: () => void
  onDataSourceUpdate?: (jobs: any[]) => void
}

export default function JobScrapingDashboard({ onJobsUpdated, onDataSourceUpdate }: JobScrapingDashboardProps) {
  const [isScraping, setIsScraping] = useState(false)
  const [selectedSource, setSelectedSource] = useState('linkedin')
  const [searchTerm, setSearchTerm] = useState('AI Engineer')
  const [location, setLocation] = useState('St. Louis, MO')
  const [maxResults, setMaxResults] = useState(10)

  // Use user-centric polling with Server-Sent Events fallback
  const { 
    data: pollingJobs, 
    loading: pollingLoading, 
    state: pollingState, 
    forceRefresh 
  } = useUserCentricJobScrapingPolling()
  
  const { jobs: eventJobs, isConnected: eventsConnected, hasData: eventsHasData } = useLatestJobStatus()
  
  // Prefer real-time events, fallback to user-centric polling
  const scrapingJobs = eventsHasData ? eventJobs : pollingJobs
  const loading = eventsHasData ? false : pollingLoading

  const sources = [
    { value: 'linkedin', label: 'LinkedIn Jobs', icon: '💼' },
    { value: 'indeed', label: 'Indeed', icon: '🔍' },
    { value: 'glassdoor', label: 'Glassdoor', icon: '🏢' },
    { value: 'company_careers', label: 'Company Career Pages', icon: '🏭' }
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
    'Software Engineer AI',
    'ML Platform Engineer',
    'AI Consultant',
    'Data Engineer',
    'AI Research Scientist'
  ]

  // Manual refresh function for when user clicks refresh
  const fetchScrapingJobs = async () => {
    await userAnalytics.trackManualRefresh()
    forceRefresh()
  }

  // Track user interactions
  useEffect(() => {
    userAnalytics.trackPageView('job_scraping_dashboard')
  }, [])

  const startScraping = async () => {
    if (isScraping) return

    setIsScraping(true)
    try {
      const response = await fetch('/api/job-scraping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: selectedSource,
          searchTerm,
          location,
          maxResults
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Scraping started:', result.jobId)
        // Track scraping trigger
        await userAnalytics.trackScrapingTrigger(selectedSource)
        // Refresh jobs list using user-centric polling
        forceRefresh()
        // Notify parent component
        if (onJobsUpdated) {
          onJobsUpdated()
        }
        // Notify about data source change (live scraping started)
        if (onDataSourceUpdate) {
          onDataSourceUpdate([]) // Empty array indicates live scraping started
        }
      } else {
        console.error('Failed to start scraping:', result.error)
        alert(`Failed to start scraping: ${result.error}`)
      }
    } catch (error) {
      console.error('Error starting scraping:', error)
      alert('Error starting scraping')
    } finally {
      setIsScraping(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'started': return 'text-blue-600 bg-blue-100'
      case 'scraping': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'started': return '🚀'
      case 'scraping': return '🔍'
      case 'completed': return '✅'
      case 'failed': return '❌'
      default: return '⏳'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          🔍 Job Scraping Dashboard
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {scrapingJobs.length} total scraping jobs
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              eventsConnected ? 'bg-green-500' : 
              pollingState?.isUserActive ? 'bg-blue-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-xs text-gray-500">
              {eventsConnected ? 'Real-time' : 
               pollingState?.isUserActive ? `User-active (${Math.round(pollingState.recommendedFrequency / 60)}h)` :
               `Daily baseline (${Math.round(pollingState?.recommendedFrequency / 60)}h)`}
            </span>
          </div>
        </div>
      </div>

      {/* Scraping Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source
          </label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sources.map(source => (
              <option key={source.value} value={source.value}>
                {source.icon} {source.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Term
          </label>
          <select
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {searchTerms.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Results
          </label>
          <input
            type="number"
            value={maxResults}
            onChange={(e) => setMaxResults(parseInt(e.target.value))}
            min="1"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Start Scraping Button */}
      <div className="mb-6">
        <button
          onClick={startScraping}
          disabled={isScraping}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isScraping
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isScraping ? '🔄 Scraping...' : '🚀 Start Job Scraping'}
        </button>
      </div>

      {/* Scraping Jobs List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Scraping Jobs
        </h3>
        
        {scrapingJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>No scraping jobs yet. Start your first job scraping session!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scrapingJobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {sources.find(s => s.value === job.source)?.icon || '💼'}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {sources.find(s => s.value === job.source)?.label || job.source}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {job.search_term} in {job.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)} {job.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Jobs Found:</span>
                    <span className="ml-1 font-medium">{job.jobs_found}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Jobs Stored:</span>
                    <span className="ml-1 font-medium">{job.jobs_stored}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Started:</span>
                    <span className="ml-1 font-medium">{formatDate(job.started_at)}</span>
                  </div>
                  {job.completed_at && (
                    <div>
                      <span className="text-gray-500">Completed:</span>
                      <span className="ml-1 font-medium">{formatDate(job.completed_at)}</span>
                    </div>
                  )}
                </div>

                {job.status_message && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="text-gray-500">Status:</span> {job.status_message}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
