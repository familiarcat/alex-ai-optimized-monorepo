'use client'

import React, { useState, useEffect } from 'react'
import { n8nDataService } from '@/lib/n8n-data-service'

interface CrewMember {
  id: string
  name: string
  role: string
  specialization: string
  expertise_areas: string[]
  current_focus: string
  is_active: boolean
  total_memories: number
  knowledge_base_size: number
  last_activity: string
}

interface MCPKnowledge {
  id: string
  source: string
  title: string
  description: string
  type: string
  tags: string[]
  crew_relevance: Record<string, any>
  scraped_at: string
}

interface N8NWorkflow {
  id: string
  name: string
  description: string
  enabled: boolean
  triggers: string[]
  nodes_count: number
  last_updated: string
}

interface AlexAICrewDashboardProps {
  onDataUpdated?: () => void
}

export default function AlexAICrewDashboard({ onDataUpdated }: AlexAICrewDashboardProps) {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([])
  const [mcpKnowledge, setMcpKnowledge] = useState<MCPKnowledge[]>([])
  const [n8nWorkflows, setN8nWorkflows] = useState<N8NWorkflow[]>([])
  const [activeTab, setActiveTab] = useState<'crew' | 'knowledge' | 'workflows' | 'memories'>('crew')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCrewMember, setSelectedCrewMember] = useState<string>('')

  useEffect(() => {
    loadCrewData()
    loadMCPKnowledge()
    loadN8NWorkflows()
  }, [])

  const loadCrewData = async () => {
    try {
      setIsLoading(true)
      // Load crew data from N8N Federation Crew - NO MOCK DATA
      const response = await n8nDataService.getCrewMembers()
      if (response.success && response.data) {
        setCrewMembers(response.data)
      } else {
        console.error('Failed to load crew data from N8N:', response.error)
        setCrewMembers([]) // Empty array instead of mock data
      }
    } catch (error) {
      console.error('Failed to load crew data:', error)
      setCrewMembers([]) // Empty array instead of mock data
    } finally {
      setIsLoading(false)
    }
  }

  const loadMCPKnowledge = async () => {
    try {
      const response = await n8nDataService.getMCPKnowledge()
      if (response.success && response.data) {
        setMcpKnowledge(response.data.slice(0, 10)) // Show first 10 items
      }
    } catch (error) {
      console.error('Failed to load MCP knowledge:', error)
    }
  }

  const loadN8NWorkflows = async () => {
    try {
      const response = await fetch('/api/n8n-workflows')
      if (response.ok) {
        const data = await response.json()
        setN8nWorkflows(data.workflows || [])
      }
    } catch (error) {
      console.error('Failed to load N8N workflows:', error)
    }
  }

  const startMCPScraping = async () => {
    try {
      const response = await n8nDataService.scrapeMCPKnowledge({
        source: undefined, // All sources
        category: undefined, // All categories
        maxResults: 50
      })
      
      if (response.success) {
        console.log('MCP scraping started:', response.data?.jobId)
        // Refresh knowledge after a delay
        setTimeout(() => {
          loadMCPKnowledge()
          if (onDataUpdated) onDataUpdated()
        }, 10000)
      } else {
        console.error('Failed to start MCP scraping:', response.error)
        alert(`Failed to start MCP scraping: ${response.error}`)
      }
    } catch (error) {
      console.error('Error starting MCP scraping:', error)
      alert('Error starting MCP scraping')
    }
  }

  const deployN8NWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch('/api/n8n-workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deploy',
          workflow: workflowId,
          config: {}
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('N8N workflow deployed:', result.deployment)
        loadN8NWorkflows()
        if (onDataUpdated) onDataUpdated()
      } else {
        console.error('Failed to deploy N8N workflow:', result.error)
        alert(`Failed to deploy N8N workflow: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deploying N8N workflow:', error)
      alert('Error deploying N8N workflow')
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

  const getCrewMemberColor = (crewId: string) => {
    switch (crewId) {
      case 'technical_lead': return 'bg-blue-100 text-blue-800'
      case 'ai_strategy': return 'bg-purple-100 text-purple-800'
      case 'client_success': return 'bg-green-100 text-green-800'
      case 'sustainability': return 'bg-emerald-100 text-emerald-800'
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
          🚀 Alex AI Crew Command Center
        </h2>
        <div className="text-sm text-gray-500">
          {crewMembers.length} crew members • {mcpKnowledge.length} knowledge items • {n8nWorkflows.length} workflows
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'crew', label: 'Crew Members', icon: '👥' },
          { id: 'knowledge', label: 'MCP Knowledge', icon: '🧠' },
          { id: 'workflows', label: 'N8N Workflows', icon: '⚡' },
          { id: 'memories', label: 'Crew Memories', icon: '💭' }
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

      {/* Crew Members Tab */}
      {activeTab === 'crew' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Alex AI Crew Members</h3>
            <button
              onClick={loadCrewData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              🔄 Refresh Crew Data
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crewMembers.map(member => (
              <div
                key={member.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCrewMemberIcon(member.id)}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCrewMemberColor(member.id)}`}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Specialization:</span>
                    <p className="text-sm text-gray-600">{member.specialization}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Current Focus:</span>
                    <p className="text-sm text-gray-600">{member.current_focus}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Expertise Areas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.expertise_areas.map(area => (
                        <span key={area} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Memories:</span>
                      <span className="ml-1 font-medium">{member.total_memories}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Knowledge:</span>
                      <span className="ml-1 font-medium">{member.knowledge_base_size}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MCP Knowledge Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">MCP Knowledge Base</h3>
            <button
              onClick={startMCPScraping}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              🔍 Start MCP Scraping
            </button>
          </div>
          
          <div className="space-y-3">
            {mcpKnowledge.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🧠</div>
                <p>No MCP knowledge available yet. Start scraping to build the knowledge base!</p>
              </div>
            ) : (
              mcpKnowledge.map(knowledge => (
                <div
                  key={knowledge.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">
                        {knowledge.source === 'github' ? '📁' : '📚'}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-800">{knowledge.title}</h4>
                        <p className="text-sm text-gray-600">{knowledge.description}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {knowledge.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {knowledge.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-gray-500">
                    Scraped: {formatDate(knowledge.scraped_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* N8N Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">N8N Workflows</h3>
            <button
              onClick={loadN8NWorkflows}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              🔄 Refresh Workflows
            </button>
          </div>
          
          <div className="space-y-3">
            {n8nWorkflows.map(workflow => (
              <div
                key={workflow.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{workflow.name}</h4>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workflow.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => deployN8NWorkflow(workflow.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Deploy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Triggers:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {workflow.triggers.map(trigger => (
                        <span key={trigger} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Nodes:</span>
                    <span className="ml-1 font-medium">{workflow.nodes_count}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Updated:</span>
                    <span className="ml-1 font-medium">{formatDate(workflow.last_updated)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew Memories Tab */}
      {activeTab === 'memories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Crew Memories & Insights</h3>
            <select
              value={selectedCrewMember}
              onChange={(e) => setSelectedCrewMember(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Crew Members</option>
              {crewMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {getCrewMemberIcon(member.id)} {member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💭</div>
            <p>Crew memories and insights will be displayed here.</p>
            <p className="text-sm text-gray-400 mt-2">
              Select a crew member to view their specific memories and knowledge.
            </p>
          </div>
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
