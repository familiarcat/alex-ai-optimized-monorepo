'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface DataSourceInfo {
  source: 'live' | 'cached' | 'mock' | 'fallback'
  lastUpdated?: string
  totalJobs: number
  liveJobs?: number
  cachedJobs?: number
  scrapingStatus?: 'active' | 'idle' | 'error'
  nextScrape?: string
}

interface DataSourceIndicatorProps {
  dataSource: DataSourceInfo
  className?: string
  onRefresh?: () => void
}

export default function DataSourceIndicator({ dataSource, className = '', onRefresh }: DataSourceIndicatorProps) {
  const getSourceConfig = () => {
    switch (dataSource.source) {
      case 'live':
        return {
          icon: '🟢',
          label: 'Live Data',
          description: 'Real-time scraping active',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          pulse: true
        }
      case 'cached':
        return {
          icon: '🟡',
          label: 'Cached Data',
          description: 'Using recent cached results',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          pulse: false
        }
      case 'mock':
        return {
          icon: '🔵',
          label: 'Demo Data',
          description: 'Using sample data for demonstration',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          pulse: false
        }
      case 'fallback':
        return {
          icon: '🟠',
          label: 'Fallback Data',
          description: 'Using backup data source',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          pulse: false
        }
      default:
        return {
          icon: '⚪',
          label: 'Unknown',
          description: 'Data source unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          pulse: false
        }
    }
  }

  const config = getSourceConfig()
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'Unknown'
    return new Date(timestamp).toLocaleString()
  }

  const getTimeAgo = (timestamp?: string) => {
    if (!timestamp) return 'Unknown'
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}
    >
      <motion.div
        animate={config.pulse ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-lg"
      >
        {config.icon}
      </motion.div>
      
      <div className="flex flex-col">
        <div className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </div>
        <div className="text-xs text-gray-600">
          {config.description}
        </div>
      </div>

      {/* Data breakdown */}
      <div className="flex items-center space-x-3 text-xs text-gray-500">
        {dataSource.liveJobs !== undefined && dataSource.cachedJobs !== undefined && (
          <div className="flex items-center space-x-1">
            <span className="text-green-600">●</span>
            <span>{dataSource.liveJobs} live</span>
            <span className="text-yellow-600">●</span>
            <span>{dataSource.cachedJobs} cached</span>
          </div>
        )}
        
        {dataSource.lastUpdated && (
          <div className="flex items-center space-x-1">
            <span>Updated:</span>
            <span className="font-medium">{getTimeAgo(dataSource.lastUpdated)}</span>
          </div>
        )}
      </div>

      {/* Scraping status indicator */}
      {dataSource.scrapingStatus && (
        <div className="flex items-center space-x-1">
          {dataSource.scrapingStatus === 'active' && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
          )}
          {dataSource.scrapingStatus === 'idle' && (
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          )}
          {dataSource.scrapingStatus === 'error' && (
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          )}
          <span className="text-xs capitalize">{dataSource.scrapingStatus}</span>
        </div>
      )}

      {/* Next scrape countdown */}
      {dataSource.nextScrape && (
        <div className="text-xs text-gray-500">
          Next: {getTimeAgo(dataSource.nextScrape)}
        </div>
      )}

      {/* Refresh button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="ml-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Refresh data source"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}

// Helper component for detailed data source info
export function DataSourceDetails({ dataSource }: { dataSource: DataSourceInfo }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Data Source Details</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Total Jobs:</span>
          <span className="ml-2 font-medium">{dataSource.totalJobs}</span>
        </div>
        
        {dataSource.liveJobs !== undefined && (
          <div>
            <span className="text-gray-600">Live Jobs:</span>
            <span className="ml-2 font-medium text-green-600">{dataSource.liveJobs}</span>
          </div>
        )}
        
        {dataSource.cachedJobs !== undefined && (
          <div>
            <span className="text-gray-600">Cached Jobs:</span>
            <span className="ml-2 font-medium text-yellow-600">{dataSource.cachedJobs}</span>
          </div>
        )}
        
        {dataSource.lastUpdated && (
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <span className="ml-2 font-medium">{new Date(dataSource.lastUpdated).toLocaleString()}</span>
          </div>
        )}
        
        {dataSource.scrapingStatus && (
          <div>
            <span className="text-gray-600">Scraping Status:</span>
            <span className={`ml-2 font-medium capitalize ${
              dataSource.scrapingStatus === 'active' ? 'text-green-600' :
              dataSource.scrapingStatus === 'error' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {dataSource.scrapingStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
