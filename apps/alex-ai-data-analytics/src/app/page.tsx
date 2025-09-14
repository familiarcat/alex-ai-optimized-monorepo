'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  CpuChipIcon, 
  EyeIcon, 
  BoltIcon,
  CircleStackIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalProjects: number
  activeUsers: number
  dataPoints: number
  mlModels: number
  predictions: number
  accuracy: number
}

export default function DataAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalProjects: 0,
    activeUsers: 0,
    dataPoints: 0,
    mlModels: 0,
    predictions: 0,
    accuracy: 0
  })
  
  const [isLoading, setIsLoading] = useState(true)

  // Simulate data loading
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setAnalyticsData({
        totalProjects: 9,
        activeUsers: 1247,
        dataPoints: 156789,
        mlModels: 12,
        predictions: 8934,
        accuracy: 94.7
      })
      
      setIsLoading(false)
    }
    
    loadAnalyticsData()
  }, [])

  const features = [
    {
      icon: ChartBarIcon,
      title: 'Real-time Analytics',
      description: 'Live data visualization and monitoring across all Alex AI projects',
      color: 'text-data-primary'
    },
    {
      icon: CpuChipIcon,
      title: 'Machine Learning',
      description: 'Custom ML models for pattern recognition and predictive analytics',
      color: 'text-data-secondary'
    },
    {
      icon: EyeIcon,
      title: 'Pattern Recognition',
      description: 'Cross-project pattern analysis using Supabase vector search',
      color: 'text-data-accent'
    },
    {
      icon: BoltIcon,
      title: 'Data Pipeline',
      description: 'Automated data processing and transformation workflows',
      color: 'text-data-success'
    },
    {
      icon: CircleStackIcon,
      title: 'Memory Integration',
      description: 'Access to all crew Supabase memories and cross-project data',
      color: 'text-data-warning'
    },
    {
      icon: LightBulbIcon,
      title: 'Predictive Insights',
      description: 'AI-powered predictions and recommendations for optimization',
      color: 'text-data-error'
    }
  ]

  const metrics = [
    { label: 'Total Projects', value: analyticsData.totalProjects, suffix: '' },
    { label: 'Active Users', value: analyticsData.activeUsers, suffix: '' },
    { label: 'Data Points', value: analyticsData.dataPoints.toLocaleString(), suffix: '' },
    { label: 'ML Models', value: analyticsData.mlModels, suffix: '' },
    { label: 'Predictions', value: analyticsData.predictions.toLocaleString(), suffix: '' },
    { label: 'Accuracy', value: analyticsData.accuracy, suffix: '%' }
  ]

  return (
    <div className="space-y-8">
      {/* Commander Data Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="data-card"
      >
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-data-primary rounded-full flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-data-primary mb-2">
              Commander Data's Analytics Command Center
            </h2>
            <p className="text-gray-600 mb-4">
              "I am Commander Data, and I have designed this analytics platform to provide 
              comprehensive data analysis across all Alex AI projects. Through logical analysis 
              and pattern recognition, we can optimize performance and predict future outcomes."
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="data-status-online">System Online</span>
              <span>Supabase Memory: Active</span>
              <span>ML Models: Training</span>
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
          <div key={metric.label} className="data-card text-center">
            <div className="data-metric">
              {isLoading ? (
                <div className="animate-pulse bg-gray-300 h-8 w-16 mx-auto rounded"></div>
              ) : (
                `${metric.value}${metric.suffix}`
              )}
            </div>
            <div className="data-label">{metric.label}</div>
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
            className="data-card hover:shadow-xl transition-shadow duration-300"
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

      {/* Analytics Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="data-card"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Real-time Analytics Dashboard
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="data-chart">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Data Processing Pipeline</h4>
              <span className="data-status-processing">Processing</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Data Ingestion</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-data-primary h-2 rounded-full w-full"></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pattern Analysis</span>
                <span>87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-data-secondary h-2 rounded-full w-4/5"></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>ML Model Training</span>
                <span>73%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-data-accent h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
          
          <div className="data-chart">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Crew Memory Integration</h4>
              <span className="data-status-online">Active</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Job Search Data</span>
                <span className="text-sm font-medium">2,847 records</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Commercial Platform</span>
                <span className="text-sm font-medium">1,234 records</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Master Project</span>
                <span className="text-sm font-medium">5,678 records</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cross-project Patterns</span>
                <span className="text-sm font-medium">342 patterns</span>
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
        className="data-card text-center"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Ready to Explore Advanced Analytics?
        </h3>
        <p className="text-gray-600 mb-6">
          Access comprehensive analytics, machine learning models, and predictive insights 
          across all Alex AI projects with Commander Data's logical analysis.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="data-button-primary">
            Launch Analytics Dashboard
          </button>
          <button className="data-button-secondary">
            View ML Models
          </button>
        </div>
      </motion.div>
    </div>
  )
}
