'use client'

import React, { useState, useEffect } from 'react'
import { useUserCentricScheduledScrapingPolling } from '@/hooks/useUserCentricJobScrapingPolling'
import { userAnalytics } from '@/lib/user-analytics-simple'

interface ScheduledConfig {
  id: string
  name: string
  source: string
  search_term: string
  location: string
  max_results: number
  schedule: 'hourly' | 'daily' | 'weekly' | 'manual'
  enabled: boolean
  last_run?: string
  next_run?: string
  created_at: string
  updated_at: string
}

interface ScrapingJob {
  id: string
  config_id?: string
  source: string
  search_term: string
  location: string
  status: 'started' | 'scraping' | 'completed' | 'failed'
  status_message?: string
  jobs_found: number
  jobs_stored: number
  scheduled: boolean
  triggered_by: 'manual' | 'scheduled' | 'api' | 'webhook'
  started_at: string
  completed_at?: string
  created_at: string
}

interface ScheduledScrapingDashboardProps {
  onJobsUpdated?: () => void
}

export default function ScheduledScrapingDashboard({ onJobsUpdated }: ScheduledScrapingDashboardProps) {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isRunningAll, setIsRunningAll] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newConfig, setNewConfig] = useState({
    name: '',
    source: 'linkedin',
    search_term: 'AI Engineer',
    location: 'St. Louis, MO',
    max_results: 10,
    schedule: 'hourly' as const
  })

  // Use user-centric polling for scheduled scraping data
  const { 
    data: scheduledData, 
    loading, 
    error, 
    state: pollingState,
    forceRefresh 
  } = useUserCentricScheduledScrapingPolling()
  
  const configs = scheduledData?.configs || []
  const status = scheduledData?.status || null

  const sources = [
    { value: 'linkedin', label: 'LinkedIn Jobs', icon: '💼' },
    { value: 'indeed', label: 'Indeed', icon: '🔍' },
    { value: 'glassdoor', label: 'Glassdoor', icon: '🏢' },
    { value: 'company_careers', label: 'Company Career Pages', icon: '🏭' }
  ]

  const schedules = [
    { value: 'hourly', label: 'Every Hour', icon: '⏰' },
    { value: 'daily', label: 'Daily', icon: '📅' },
    { value: 'weekly', label: 'Weekly', icon: '🗓️' },
    { value: 'manual', label: 'Manual Only', icon: '👤' }
  ]

  const locations = [
    'St. Louis, MO',
    'Remote',
    'Hybrid',
    'Missouri',
    'Illinois',
    'United States'
  ]

  // Manual refresh function
  const fetchData = async () => {
    await userAnalytics.trackManualRefresh()
    forceRefresh()
  }

  // Track user interactions
  useEffect(() => {
    userAnalytics.trackPageView('scheduled_scraping_dashboard')
  }, [])

  const initializeDefaultConfigs = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch('/api/scheduled-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize' })
      })
      
      const result = await response.json()
      if (result.success) {
        await fetchData()
        alert('Default configurations initialized successfully!')
      } else {
        alert(`Failed to initialize: ${result.error}`)
      }
    } catch (error) {
      console.error('Error initializing configs:', error)
      alert('Error initializing configurations')
    } finally {
      setIsInitializing(false)
    }
  }

  const toggleConfig = async (configId: string) => {
    try {
      const response = await fetch('/api/scheduled-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', configId })
      })
      
      const result = await response.json()
      if (result.success) {
        await fetchData()
      } else {
        alert(`Failed to toggle config: ${result.error}`)
      }
    } catch (error) {
      console.error('Error toggling config:', error)
      alert('Error toggling configuration')
    }
  }

  const runConfigNow = async (configId: string) => {
    try {
      const response = await fetch('/api/scheduled-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run-now', configId })
      })
      
      const result = await response.json()
      if (result.success) {
        await fetchData()
        if (onJobsUpdated) onJobsUpdated()
        alert('Scheduled scraping triggered successfully!')
      } else {
        alert(`Failed to run config: ${result.error}`)
      }
    } catch (error) {
      console.error('Error running config:', error)
      alert('Error running configuration')
    }
  }

  const runAllConfigs = async () => {
    setIsRunningAll(true)
    try {
      const response = await fetch('/api/scheduled-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run-all' })
      })
      
      const result = await response.json()
      if (result.success) {
        await fetchData()
        if (onJobsUpdated) onJobsUpdated()
        alert(`Triggered ${result.results.length} scheduled scraping jobs!`)
      } else {
        alert(`Failed to run all configs: ${result.error}`)
      }
    } catch (error) {
      console.error('Error running all configs:', error)
      alert('Error running all configurations')
    } finally {
      setIsRunningAll(false)
    }
  }

  const createConfig = async () => {
    try {
      const response = await fetch('/api/scheduled-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', config: newConfig })
      })
      
      const result = await response.json()
      if (result.success) {
        await fetchData()
        setShowCreateForm(false)
        setNewConfig({
          name: '',
          source: 'linkedin',
          search_term: 'AI Engineer',
          location: 'St. Louis, MO',
          max_results: 10,
          schedule: 'hourly'
        })
        alert('Configuration created successfully!')
      } else {
        alert(`Failed to create config: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating config:', error)
      alert('Error creating configuration')
    }
  }

  const deleteConfig = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return
    
    try {
      const response = await fetch(`/api/scheduled-scraping?configId=${configId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      if (result.success) {
        await fetchData()
        alert('Configuration deleted successfully!')
      } else {
        alert(`Failed to delete config: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting config:', error)
      alert('Error deleting configuration')
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeUntilNext = (nextRun: string) => {
    const now = new Date()
    const next = new Date(nextRun)
    const diff = next.getTime() - now.getTime()
    
    if (diff <= 0) return 'Due now'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">🕐 Scheduled Job Scraping</h2>
          <div className="flex space-x-2">
            {configs.length === 0 && (
              <button
                onClick={initializeDefaultConfigs}
                disabled={isInitializing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isInitializing ? 'Initializing...' : 'Initialize Defaults'}
              </button>
            )}
            <button
              onClick={runAllConfigs}
              disabled={isRunningAll || configs.filter(c => c.enabled).length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isRunningAll ? 'Running...' : 'Run All Now'}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {showCreateForm ? 'Cancel' : 'Add Configuration'}
            </button>
          </div>
        </div>

        {/* Status Overview */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{status.configs.total}</div>
              <div className="text-sm text-blue-600">Total Configs</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{status.configs.enabled}</div>
              <div className="text-sm text-green-600">Enabled</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{status.configs.due}</div>
              <div className="text-sm text-yellow-600">Due Now</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{status.jobs.successRate}%</div>
              <div className="text-sm text-purple-600">Success Rate</div>
            </div>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Scheduled Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Configuration name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={newConfig.source}
                  onChange={(e) => setNewConfig({ ...newConfig, source: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Term</label>
                <input
                  type="text"
                  value={newConfig.search_term}
                  onChange={(e) => setNewConfig({ ...newConfig, search_term: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Job search term"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={newConfig.location}
                  onChange={(e) => setNewConfig({ ...newConfig, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Results</label>
                <input
                  type="number"
                  value={newConfig.max_results}
                  onChange={(e) => setNewConfig({ ...newConfig, max_results: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <select
                  value={newConfig.schedule}
                  onChange={(e) => setNewConfig({ ...newConfig, schedule: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {schedules.map(schedule => (
                    <option key={schedule.value} value={schedule.value}>
                      {schedule.icon} {schedule.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createConfig}
                disabled={!newConfig.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Create Configuration
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Configurations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Scheduled Configurations</h3>
        {configs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">⏰</div>
            <p>No scheduled configurations found.</p>
            <p className="text-sm">Click "Initialize Defaults" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {configs.map(config => (
              <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{config.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {config.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Source:</span> {sources.find(s => s.value === config.source)?.icon} {sources.find(s => s.value === config.source)?.label}
                      </div>
                      <div>
                        <span className="font-medium">Search:</span> {config.search_term}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {config.location}
                      </div>
                      <div>
                        <span className="font-medium">Schedule:</span> {schedules.find(s => s.value === config.schedule)?.icon} {schedules.find(s => s.value === config.schedule)?.label}
                      </div>
                      <div>
                        <span className="font-medium">Max Results:</span> {config.max_results}
                      </div>
                      <div>
                        <span className="font-medium">Last Run:</span> {config.last_run ? formatDateTime(config.last_run) : 'Never'}
                      </div>
                    </div>
                    {config.next_run && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-600">Next Run:</span> {formatDateTime(config.next_run)} 
                        <span className="ml-2 text-blue-600">({getTimeUntilNext(config.next_run)})</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => toggleConfig(config.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        config.enabled 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {config.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => runConfigNow(config.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                    >
                      Run Now
                    </button>
                    <button
                      onClick={() => deleteConfig(config.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Scheduled Jobs</h3>
        {recentJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>No recent scheduled jobs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triggered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentJobs.slice(0, 10).map(job => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.search_term}</div>
                      <div className="text-sm text-gray-500">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {sources.find(s => s.value === job.source)?.icon} {sources.find(s => s.value === job.source)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)} {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.jobs_found} found, {job.jobs_stored} stored
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.triggered_by === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.triggered_by}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(job.started_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
