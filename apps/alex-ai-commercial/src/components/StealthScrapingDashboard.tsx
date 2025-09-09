'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface StealthScrapingJob {
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

export default function StealthScrapingDashboard() {
  const [scrapingJobs, setScrapingJobs] = useState<StealthScrapingJob[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    source: 'linkedin',
    searchTerm: 'AI Engineer',
    location: 'St. Louis, MO',
    maxResults: 10
  })

  // Fetch scraping jobs
  const fetchScrapingJobs = async () => {
    try {
      const response = await axios.get('/api/stealth-job-scraping')
      setScrapingJobs(response.data)
    } catch (error) {
      console.error('Error fetching scraping jobs:', error)
    }
  }

  // Start stealth scraping
  const startStealthScraping = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/stealth-job-scraping', formData)
      console.log('Stealth scraping started:', response.data)
      
      // Refresh jobs list
      setTimeout(fetchScrapingJobs, 1000)
    } catch (error) {
      console.error('Error starting stealth scraping:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load jobs on component mount with smart polling
  useEffect(() => {
    fetchScrapingJobs()
    // Use longer interval for stealth scraping (less frequent updates needed)
    const interval = setInterval(fetchScrapingJobs, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'scraping': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🥷 Stealth Job Scraping</h2>
          <p className="text-gray-600">IP-protected scraping with Puppeteer stealth techniques</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">IP Protection Active</span>
        </div>
      </div>

      {/* Scraping Form */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Start Stealth Scraping</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="linkedin">LinkedIn</option>
              <option value="indeed">Indeed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Term</label>
            <input
              type="text"
              value={formData.searchTerm}
              onChange={(e) => setFormData({ ...formData, searchTerm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AI Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="St. Louis, MO"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={startStealthScraping}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Starting...' : 'Start Stealth Scraping'}
            </button>
          </div>
        </div>
      </div>

      {/* Protection Features */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">🛡️ IP Protection Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>User Agent Rotation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Human-like Behavior</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Resource Blocking</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>WebDriver Detection Evasion</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Random Delays</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Viewport Randomization</span>
          </div>
        </div>
      </div>

      {/* Scraping Jobs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Stealth Scraping Jobs</h3>
        {scrapingJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No stealth scraping jobs yet. Start one above to see results.
          </div>
        ) : (
          <div className="space-y-3">
            {scrapingJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{job.source.toUpperCase()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(job.startedAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Search:</strong> {job.searchTerm} in {job.location}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span>Jobs Found: <strong>{job.jobsFound}</strong></span>
                  <span>Jobs Stored: <strong>{job.jobsStored}</strong></span>
                  {job.error && (
                    <span className="text-red-600">Error: {job.error}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
