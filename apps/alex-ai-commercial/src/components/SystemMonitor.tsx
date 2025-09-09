'use client'

import { useState, useEffect } from 'react'
import { unifiedDataService } from '@/lib/unified-data-architecture'
import { n8nSyncService } from '@/lib/n8n-sync-service'
import { mcpIntegration } from '@/lib/mcp-integration'

export default function SystemMonitor() {
  const [systemStatus, setSystemStatus] = useState({
    unifiedData: false,
    n8nSync: false,
    mcpIntegration: false,
    lastUpdate: null
  })

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const [unifiedData, n8nSync, mcpIntegration] = await Promise.all([
          unifiedDataService.getJobOpportunities().then(() => true).catch(() => false),
          n8nSyncService.testN8NConnectivity(),
          mcpIntegration.testConnectivity()
        ])

        setSystemStatus({
          unifiedData,
          n8nSync,
          mcpIntegration,
          lastUpdate: new Date()
        })
      } catch (error) {
        console.error('Error checking system status:', error)
      }
    }

    checkSystemStatus()
    const interval = setInterval(checkSystemStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔧 System Monitor
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Unified Data Service</span>
          <span className={`text-sm ${systemStatus.unifiedData ? 'text-green-600' : 'text-red-600'}`}>
            {systemStatus.unifiedData ? '✅ Online' : '❌ Offline'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">n8n Sync Service</span>
          <span className={`text-sm ${systemStatus.n8nSync ? 'text-green-600' : 'text-red-600'}`}>
            {systemStatus.n8nSync ? '✅ Connected' : '❌ Disconnected'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">MCP Integration</span>
          <span className={`text-sm ${systemStatus.mcpIntegration ? 'text-green-600' : 'text-red-600'}`}>
            {systemStatus.mcpIntegration ? '✅ Active' : '❌ Inactive'}
          </span>
        </div>
        
        {systemStatus.lastUpdate && (
          <div className="text-xs text-gray-500 mt-2">
            Last updated: {systemStatus.lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}
