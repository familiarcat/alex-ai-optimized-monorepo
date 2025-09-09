'use client'

import { useState, useEffect } from 'react'
import { n8nSyncService } from '@/lib/n8n-sync-service'
import { unifiedDataService } from '@/lib/unified-data-architecture'
import { motion } from 'framer-motion'
import {
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ServerIcon
} from '@heroicons/react/24/outline'

interface SyncStatus {
  table_name: string
  last_sync: string | null
  total_records: number
  sync_success_rate: number
}

export default function DataSyncDashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [n8nConnected, setN8nConnected] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  useEffect(() => {
    loadSyncStatus()
    
    // Update sync status every 30 seconds
    const interval = setInterval(loadSyncStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadSyncStatus = async () => {
    try {
      setIsLoading(true)
      
      // Get sync status from Supabase
      const status = await n8nSyncService.getSyncStatus()
      if (status) {
        setSyncStatus(status)
      }
      
      // Test n8n connectivity
      const connected = await n8nSyncService.testN8NConnectivity()
      setN8nConnected(connected)
      
      // Get unified data service status
      const unifiedStatus = unifiedDataService.getSyncStatus()
      setLastSyncTime(unifiedStatus.lastSync)
      
    } catch (error) {
      console.error('Error loading sync status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSync = async () => {
    try {
      setIsLoading(true)
      await n8nSyncService.performFullSync()
      await loadSyncStatus()
    } catch (error) {
      console.error('Manual sync failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (successRate: number) => {
    if (successRate >= 90) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    } else if (successRate >= 70) {
      return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
    } else {
      return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (successRate: number) => {
    if (successRate >= 90) return 'text-green-600'
    if (successRate >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ServerIcon className="h-5 w-5 mr-2" />
          Data Sync Status
        </h3>
        <button
          onClick={handleManualSync}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {/* n8n Connection Status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CloudArrowUpIcon className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">n8n Connection</span>
          </div>
          <div className="flex items-center">
            {n8nConnected ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            )}
            <span className={`ml-2 text-sm ${n8nConnected ? 'text-green-600' : 'text-red-600'}`}>
              {n8nConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Data Source Status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CloudArrowDownIcon className="h-5 w-5 mr-2 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Data Source</span>
          </div>
          <span className="text-sm text-gray-600">
            {lastSyncTime ? `Last sync: ${lastSyncTime.toLocaleTimeString()}` : 'No recent sync'}
          </span>
        </div>
      </div>

      {/* Sync Status Table */}
      {syncStatus.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Table Sync Status</h4>
          <div className="space-y-2">
            {syncStatus.map((status) => (
              <motion.div
                key={status.table_name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  {getStatusIcon(status.sync_success_rate)}
                  <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                    {status.table_name.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(status.sync_success_rate)}`}>
                    {status.sync_success_rate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {status.total_records} records
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sync Information */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Unified Data Architecture</p>
          <p className="text-xs">
            Data flows from n8n.pbradygeorgen.com → Supabase → Application
          </p>
          <p className="text-xs mt-1">
            Both localhost and production use the same live data source
          </p>
        </div>
      </div>
    </div>
  )
}

