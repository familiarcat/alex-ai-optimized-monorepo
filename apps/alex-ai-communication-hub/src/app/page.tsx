'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon, 
  DevicePhoneMobileIcon, 
  BellIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface CommunicationData {
  totalMessages: number
  activeChannels: number
  deliveryRate: number
  responseRate: number
  contacts: number
  templates: number
}

export default function CommunicationHubPage() {
  const [commData, setCommData] = useState<CommunicationData>({
    totalMessages: 0,
    activeChannels: 0,
    deliveryRate: 0,
    responseRate: 0,
    contacts: 0,
    templates: 0
  })
  
  const [isLoading, setIsLoading] = useState(true)

  // Simulate data loading
  useEffect(() => {
    const loadCommunicationData = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setCommData({
        totalMessages: 12456,
        activeChannels: 4,
        deliveryRate: 98.7,
        responseRate: 87.3,
        contacts: 2847,
        templates: 23
      })
      
      setIsLoading(false)
    }
    
    loadCommunicationData()
  }, [])

  const features = [
    {
      icon: EnvelopeIcon,
      title: 'Email Integration',
      description: 'SendGrid and SMTP support for professional communications',
      color: 'text-comm-primary'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'SMS Messaging',
      description: 'Twilio integration for instant mobile messaging',
      color: 'text-comm-secondary'
    },
    {
      icon: BellIcon,
      title: 'Push Notifications',
      description: 'Real-time browser and mobile notifications',
      color: 'text-comm-accent'
    },
    {
      icon: GlobeAltIcon,
      title: 'WebSocket Support',
      description: 'Live communication and real-time updates',
      color: 'text-comm-success'
    },
    {
      icon: UserGroupIcon,
      title: 'Contact Management',
      description: 'Unified contact database and synchronization',
      color: 'text-comm-warning'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Template Engine',
      description: 'Dynamic message personalization and customization',
      color: 'text-comm-error'
    }
  ]

  const metrics = [
    { label: 'Total Messages', value: commData.totalMessages.toLocaleString(), suffix: '' },
    { label: 'Active Channels', value: commData.activeChannels, suffix: '' },
    { label: 'Delivery Rate', value: commData.deliveryRate, suffix: '%' },
    { label: 'Response Rate', value: commData.responseRate, suffix: '%' },
    { label: 'Contacts', value: commData.contacts.toLocaleString(), suffix: '' },
    { label: 'Templates', value: commData.templates, suffix: '' }
  ]

  return (
    <div className="space-y-8">
      {/* Lieutenant Uhura Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="comm-card"
      >
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-comm-primary rounded-full flex items-center justify-center">
            <span className="text-2xl">📡</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-comm-primary mb-2">
              Lieutenant Uhura's Communication Command Center
            </h2>
            <p className="text-gray-600 mb-4">
              "I am Lieutenant Uhura, and I have designed this communication hub to provide 
              unified messaging across all Alex AI projects. Through multi-channel communication 
              and real-time coordination, we can ensure seamless information flow throughout the system."
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="comm-status-online">Channels Online</span>
              <span>Email: Active</span>
              <span>SMS: Active</span>
              <span>Push: Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {metrics.map((metric, index) => (
          <div key={metric.label} className="comm-card text-center">
            <div className="comm-metric">
              {isLoading ? (
                <div className="animate-pulse bg-gray-300 h-8 w-16 mx-auto rounded"></div>
              ) : (
                `${metric.value}${metric.suffix}`
              )}
            </div>
            <div className="comm-label">{metric.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            className="comm-card hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Communication Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="comm-card"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Multi-Channel Communication Dashboard
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="comm-message">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Message Channels</h4>
              <span className="comm-status-online">All Active</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-4 h-4 text-comm-primary" />
                  <span className="text-sm text-gray-600">Email</span>
                </div>
                <span className="text-sm font-medium">98.7% delivery</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DevicePhoneMobileIcon className="w-4 h-4 text-comm-secondary" />
                  <span className="text-sm text-gray-600">SMS</span>
                </div>
                <span className="text-sm font-medium">96.2% delivery</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BellIcon className="w-4 h-4 text-comm-accent" />
                  <span className="text-sm text-gray-600">Push Notifications</span>
                </div>
                <span className="text-sm font-medium">94.8% delivery</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="w-4 h-4 text-comm-success" />
                  <span className="text-sm text-gray-600">WebSocket</span>
                </div>
                <span className="text-sm font-medium">99.1% uptime</span>
              </div>
            </div>
          </div>
          
          <div className="comm-message">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Contact Management</h4>
              <span className="comm-status-online">Synchronized</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Job Search Contacts</span>
                <span className="text-sm font-medium">1,247 contacts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Commercial Platform</span>
                <span className="text-sm font-medium">892 contacts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">HR & Hiring Managers</span>
                <span className="text-sm font-medium">708 contacts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cross-project Sync</span>
                <span className="text-sm font-medium">100% synced</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="comm-card text-center"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Ready to Coordinate Communications?
        </h3>
        <p className="text-gray-600 mb-6">
          Access unified messaging, multi-channel communication, and real-time 
          coordination across all Alex AI projects with Lieutenant Uhura's expertise.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="comm-button-primary">
            Launch Communication Hub
          </button>
          <button className="comm-button-secondary">
            Manage Templates
          </button>
        </div>
      </motion.div>
    </div>
  )
}



