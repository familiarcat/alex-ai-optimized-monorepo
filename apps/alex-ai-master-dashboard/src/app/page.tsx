'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon, 
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  HeartIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  CommandLineIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface AppStatus {
  name: string
  crew_lead: string
  port: number
  url: string
  status: 'online' | 'offline' | 'loading'
  theme: string
  description: string
  icon: any
}

export default function MasterDashboardPage() {
  const [apps, setApps] = useState<AppStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [systemHealth, setSystemHealth] = useState({
    totalApps: 0,
    onlineApps: 0,
    offlineApps: 0,
    crewMembers: 9,
    memoryIntegration: true
  })

  // Define all specialized applications
  const specializedApps = [
    {
      name: 'Data Analytics',
      crew_lead: 'Commander Data',
      port: 3001,
      url: 'http://localhost:3001',
      theme: 'data',
      description: 'Advanced analytics and data processing platform',
      icon: ChartBarIcon
    },
    {
      name: 'Communication Hub',
      crew_lead: 'Lieutenant Uhura',
      port: 3002,
      url: 'http://localhost:3002',
      theme: 'uhura',
      description: 'Multi-channel communication and notification system',
      icon: ChatBubbleLeftRightIcon
    },
    {
      name: 'Engineering Workshop',
      crew_lead: 'Lieutenant Commander La Forge',
      port: 3003,
      url: 'http://localhost:3003',
      theme: 'la-forge',
      description: 'Development tools and project management platform',
      icon: WrenchScrewdriverIcon
    },
    {
      name: 'Business Intelligence',
      crew_lead: 'Quark',
      port: 3004,
      url: 'http://localhost:3004',
      theme: 'quark',
      description: 'Revenue tracking and monetization platform',
      icon: CurrencyDollarIcon
    },
    {
      name: 'User Experience',
      crew_lead: 'Counselor Troi',
      port: 3005,
      url: 'http://localhost:3005',
      theme: 'troi',
      description: 'UX optimization and empathy-driven design',
      icon: HeartIcon
    },
    {
      name: 'Security Command',
      crew_lead: 'Lieutenant Worf',
      port: 3006,
      url: 'http://localhost:3006',
      theme: 'worf',
      description: 'Security monitoring and threat detection',
      icon: ShieldCheckIcon
    },
    {
      name: 'Health Monitoring',
      crew_lead: 'Dr. Crusher',
      port: 3007,
      url: 'http://localhost:3007',
      theme: 'crusher',
      description: 'System health and wellness monitoring',
      icon: CpuChipIcon
    },
    {
      name: 'Strategic Command',
      crew_lead: 'Captain Picard',
      port: 3008,
      url: 'http://localhost:3008',
      theme: 'picard',
      description: 'Strategic oversight and decision support',
      icon: CommandLineIcon
    },
    {
      name: 'Tactical Operations',
      crew_lead: 'Commander Riker',
      port: 3009,
      url: 'http://localhost:3009',
      theme: 'riker',
      description: 'Tactical execution and operation tracking',
      icon: UserGroupIcon
    }
  ]

  // Check app status
  useEffect(() => {
    const checkAppStatus = async () => {
      setIsLoading(true)
      
      const appStatuses = await Promise.all(
        specializedApps.map(async (app) => {
          try {
            const response = await fetch(app.url, { 
              method: 'HEAD',
              mode: 'no-cors',
              cache: 'no-cache'
            })
            return {
              ...app,
              status: 'online' as const
            }
          } catch (error) {
            return {
              ...app,
              status: 'offline' as const
            }
          }
        })
      )
      
      setApps(appStatuses)
      
      const onlineCount = appStatuses.filter(app => app.status === 'online').length
      setSystemHealth({
        totalApps: appStatuses.length,
        onlineApps: onlineCount,
        offlineApps: appStatuses.length - onlineCount,
        crewMembers: 9,
        memoryIntegration: true
      })
      
      setIsLoading(false)
    }
    
    checkAppStatus()
    
    // Check status every 30 seconds
    const interval = setInterval(checkAppStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleAppLaunch = (app: AppStatus) => {
    if (app.status === 'online') {
      window.open(app.url, '_blank')
    }
  }

  return (
    <div className="space-y-8">
      {/* Captain Picard Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="master-card"
      >
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 crew-theme-picard rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-3xl">🖖</span>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-master-primary mb-3">
              Captain Picard's Command Center
            </h2>
            <p className="text-gray-700 mb-4 text-lg">
              "Welcome to the Alex AI Command Center. This master dashboard provides 
              unified access to all our specialized applications, each led by a member 
              of our crew. From here, you can coordinate operations, monitor system health, 
              and access the full capabilities of our integrated AI ecosystem."
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="master-status-online">All Systems Operational</span>
              <span>Supabase Memory: Active</span>
              <span>N8N Integration: Online</span>
              <span>Crew Coordination: Ready</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Health Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="master-card text-center">
          <div className="master-metric">
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 h-8 w-16 mx-auto rounded"></div>
            ) : (
              systemHealth.totalApps
            )}
          </div>
          <div className="master-label">Total Apps</div>
        </div>
        <div className="master-card text-center">
          <div className="master-metric text-green-600">
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 h-8 w-16 mx-auto rounded"></div>
            ) : (
              systemHealth.onlineApps
            )}
          </div>
          <div className="master-label">Online Apps</div>
        </div>
        <div className="master-card text-center">
          <div className="master-metric text-red-600">
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 h-8 w-16 mx-auto rounded"></div>
            ) : (
              systemHealth.offlineApps
            )}
          </div>
          <div className="master-label">Offline Apps</div>
        </div>
        <div className="master-card text-center">
          <div className="master-metric text-master-accent">
            {systemHealth.crewMembers}
          </div>
          <div className="master-label">Crew Members</div>
        </div>
      </motion.div>

      {/* Application Launcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="master-card"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Specialized Applications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, index) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className={`master-app-card ${app.status === 'online' ? 'hover:shadow-2xl' : 'opacity-60'}`}
              onClick={() => handleAppLaunch(app)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${`crew-theme-${app.theme}`}`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {app.name}
                    </h4>
                    <span className={`${
                      app.status === 'online' ? 'master-status-online' :
                      app.status === 'offline' ? 'master-status-offline' :
                      'master-status-loading'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Led by {app.crew_lead}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {app.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Port: {app.port}</span>
                    <span>{app.url}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="master-card text-center"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <p className="text-gray-600 mb-6">
          Access common functions and system management tools
        </p>
        <div className="flex justify-center space-x-4">
          <button className="master-button-primary">
            Launch All Apps
          </button>
          <button className="master-button-secondary">
            System Status
          </button>
          <button className="master-button-secondary">
            Crew Coordination
          </button>
          <button className="master-button-secondary">
            Memory Integration
          </button>
        </div>
      </motion.div>
    </div>
  )
}



