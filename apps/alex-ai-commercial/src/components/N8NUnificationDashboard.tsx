'use client'

import React, { useState, useEffect } from 'react'

interface CrewMapping {
  alex_ai_crew_id: string
  federation_member: string
  workflow_id: string
  webhook_path: string
  specialization: string
  expertise_areas: string[]
  federation_status: string
  last_sync: string
  unified_capabilities: {
    alex_ai_capabilities: string[]
    federation_capabilities: string[]
    unified_capabilities: string[]
  }
}

interface UnificationStatus {
  status: string
  total_crew_members: number
  active_workflows: number
  last_sync: string
  federation_crew_status: string
  alex_ai_crew_status: string
}

interface N8NUnificationDashboardProps {
  onUnificationComplete?: () => void
}

export default function N8NUnificationDashboard({ onUnificationComplete }: N8NUnificationDashboardProps) {
  const [crewMappings, setCrewMappings] = useState<CrewMapping[]>([])
  const [unificationStatus, setUnificationStatus] = useState<UnificationStatus | null>(null)
  const [activeTab, setActiveTab] = useState<'mappings' | 'status' | 'workflows' | 'analysis'>('mappings')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCrewMember, setSelectedCrewMember] = useState<string>('')
  const [analysisResults, setAnalysisResults] = useState<any[]>([])

  useEffect(() => {
    loadUnificationData()
  }, [])

  const loadUnificationData = async () => {
    try {
      setIsLoading(true)
      
      // Load crew mappings
      const mappingsResponse = await fetch('/api/n8n-unification')
      if (mappingsResponse.ok) {
        const mappings = await mappingsResponse.json()
        setCrewMappings(Object.values(mappings))
      }
      
      // Load unification status
      const statusResponse = await fetch('/api/n8n-unification?status=true')
      if (statusResponse.ok) {
        const status = await statusResponse.json()
        setUnificationStatus(status)
      }
      
    } catch (error) {
      console.error('Failed to load unification data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const syncCrewMembers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/n8n-unification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync_crew_members'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Crew members synced:', result.sync_results)
        setCrewMappings(result.sync_results)
        if (onUnificationComplete) onUnificationComplete()
      } else {
        console.error('Failed to sync crew members:', result.error)
        alert(`Failed to sync crew members: ${result.error}`)
      }
    } catch (error) {
      console.error('Error syncing crew members:', error)
      alert('Error syncing crew members')
    } finally {
      setIsLoading(false)
    }
  }

  const unifyWorkflows = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/n8n-unification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'unify_workflows'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Workflows unified:', result.unified_workflows)
        if (onUnificationComplete) onUnificationComplete()
      } else {
        console.error('Failed to unify workflows:', result.error)
        alert(`Failed to unify workflows: ${result.error}`)
      }
    } catch (error) {
      console.error('Error unifying workflows:', error)
      alert('Error unifying workflows')
    } finally {
      setIsLoading(false)
    }
  }

  const performCrossCrewAnalysis = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/n8n-unification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cross_crew_analysis',
          data: {
            analysis_type: 'job_opportunity',
            sample_data: {
              company: 'Microsoft',
              position: 'Senior Software Engineer',
              location: 'St. Louis, MO',
              requirements: 'TypeScript, Node.js, AI/ML'
            }
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Cross-crew analysis completed:', result.analysis_results)
        setAnalysisResults(result.analysis_results)
      } else {
        console.error('Failed to perform cross-crew analysis:', result.error)
        alert(`Failed to perform cross-crew analysis: ${result.error}`)
      }
    } catch (error) {
      console.error('Error performing cross-crew analysis:', error)
      alert('Error performing cross-crew analysis')
    } finally {
      setIsLoading(false)
    }
  }

  const getCrewMemberIcon = (crewId: string) => {
    switch (crewId) {
      case 'technical_lead': return '🔧'
      case 'ai_strategy': return '🤖'
      case 'client_success': return '👥'
      case 'sustainability': return '🌱'
      default: return '👤'
    }
  }

  const getFederationIcon = (federationMember: string) => {
    if (federationMember.includes('Geordi')) return '🔧'
    if (federationMember.includes('Data')) return '🤖'
    if (federationMember.includes('Troi')) return '👥'
    if (federationMember.includes('Crusher')) return '🌱'
    return '⭐'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          🚀 N8N Federation Crew Unification
        </h2>
        <div className="text-sm text-gray-500">
          {crewMappings.length} crew mappings • {unificationStatus?.active_workflows || 0} active workflows
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'mappings', label: 'Crew Mappings', icon: '🔗' },
          { id: 'status', label: 'Unification Status', icon: '📊' },
          { id: 'workflows', label: 'Unified Workflows', icon: '⚡' },
          { id: 'analysis', label: 'Cross-Crew Analysis', icon: '🔍' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Crew Mappings Tab */}
      {activeTab === 'mappings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Alex AI ↔ Federation Crew Mappings</h3>
            <button
              onClick={syncCrewMembers}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              🔄 Sync Crew Members
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {crewMappings.map(mapping => (
              <div
                key={mapping.alex_ai_crew_id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getCrewMemberIcon(mapping.alex_ai_crew_id)}</span>
                      <span className="text-lg font-medium text-gray-800">
                        {mapping.alex_ai_crew_id.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-400">↔</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getFederationIcon(mapping.federation_member)}</span>
                      <span className="text-lg font-medium text-gray-800">
                        {mapping.federation_member}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mapping.federation_status)}`}>
                    {mapping.federation_status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Specialization:</span>
                    <p className="text-sm text-gray-600">{mapping.specialization}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Workflow ID:</span>
                    <p className="text-sm text-gray-600 font-mono">{mapping.workflow_id}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Webhook Path:</span>
                    <p className="text-sm text-gray-600 font-mono">{mapping.webhook_path}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Last Sync:</span>
                    <p className="text-sm text-gray-600">{formatDate(mapping.last_sync)}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-700">Expertise Areas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mapping.expertise_areas.map(area => (
                      <span key={area} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-700">Unified Capabilities:</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                    <div>
                      <span className="text-xs text-blue-600 font-medium">Alex AI:</span>
                      <div className="flex flex-wrap gap-1">
                        {mapping.unified_capabilities.alex_ai_capabilities.map(cap => (
                          <span key={cap} className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-green-600 font-medium">Federation:</span>
                      <div className="flex flex-wrap gap-1">
                        {mapping.unified_capabilities.federation_capabilities.map(cap => (
                          <span key={cap} className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-purple-600 font-medium">Unified:</span>
                      <div className="flex flex-wrap gap-1">
                        {mapping.unified_capabilities.unified_capabilities.map(cap => (
                          <span key={cap} className="px-1 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unification Status Tab */}
      {activeTab === 'status' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Unification Status</h3>
            <button
              onClick={loadUnificationData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              🔄 Refresh Status
            </button>
          </div>
          
          {unificationStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">👥</span>
                  <span className="font-medium text-gray-800">Crew Members</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{unificationStatus.total_crew_members}</p>
                <p className="text-sm text-gray-600">Total mapped crew members</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <span className="font-medium text-gray-800">Active Workflows</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{unificationStatus.active_workflows}</p>
                <p className="text-sm text-gray-600">Unified workflows running</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">🔄</span>
                  <span className="font-medium text-gray-800">Last Sync</span>
                </div>
                <p className="text-sm font-bold text-purple-600">{formatDate(unificationStatus.last_sync)}</p>
                <p className="text-sm text-gray-600">Most recent synchronization</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">🚀</span>
                  <span className="font-medium text-gray-800">Alex AI Crew</span>
                </div>
                <p className="text-lg font-bold text-orange-600 capitalize">{unificationStatus.alex_ai_crew_status}</p>
                <p className="text-sm text-gray-600">Alex AI crew status</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">⭐</span>
                  <span className="font-medium text-gray-800">Federation Crew</span>
                </div>
                <p className="text-lg font-bold text-indigo-600 capitalize">{unificationStatus.federation_crew_status}</p>
                <p className="text-sm text-gray-600">Federation crew status</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">📊</span>
                  <span className="font-medium text-gray-800">Overall Status</span>
                </div>
                <p className="text-lg font-bold text-gray-600 capitalize">{unificationStatus.status}</p>
                <p className="text-sm text-gray-600">Unification system status</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No unification status available. Click "Refresh Status" to load data.</p>
            </div>
          )}
        </div>
      )}

      {/* Unified Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Unified Workflows</h3>
            <button
              onClick={unifyWorkflows}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              ⚡ Unify Workflows
            </button>
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">⚡</div>
            <p>Unified workflows will be displayed here after unification.</p>
            <p className="text-sm text-gray-400 mt-2">
              Click "Unify Workflows" to create integrated Alex AI and Federation workflows.
            </p>
          </div>
        </div>
      )}

      {/* Cross-Crew Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Cross-Crew Analysis</h3>
            <button
              onClick={performCrossCrewAnalysis}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              🔍 Perform Analysis
            </button>
          </div>
          
          {analysisResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>No cross-crew analysis results available yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Click "Perform Analysis" to run cross-crew analysis between Alex AI and Federation crews.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysisResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCrewMemberIcon(result.alex_ai_crew_member)}</span>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {result.alex_ai_crew_member.replace('_', ' ').toUpperCase()}
                        </h4>
                        <p className="text-sm text-gray-600">{result.federation_member}</p>
                      </div>
                    </div>
                    {result.status === 'error' ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        Error
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Success
                      </span>
                    )}
                  </div>

                  {result.status !== 'error' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Alex AI Analysis:</span>
                        <div className="mt-1">
                          {result.alex_ai_analysis.insights.map((insight: string, i: number) => (
                            <p key={i} className="text-sm text-gray-600">• {insight}</p>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Federation Analysis:</span>
                        <div className="mt-1">
                          {result.federation_analysis.insights.map((insight: string, i: number) => (
                            <p key={i} className="text-sm text-gray-600">• {insight}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {result.status === 'error' && (
                    <div className="text-red-600 text-sm">
                      Error: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}
    </div>
  )
}
