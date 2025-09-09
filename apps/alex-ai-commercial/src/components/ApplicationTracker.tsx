'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Application, JobOpportunity } from '@/lib/n8n-data-service'
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface ApplicationTrackerProps {
  applications: Application[]
  jobOpportunities: JobOpportunity[]
}

export default function ApplicationTracker({ applications, jobOpportunities }: ApplicationTrackerProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800'
      case 'interview_scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'interviewed': return 'bg-purple-100 text-purple-800'
      case 'offer_received': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return ClockIcon
      case 'interview_scheduled': return CalendarIcon
      case 'interviewed': return EyeIcon
      case 'offer_received': return CheckCircleIcon
      case 'rejected': return XCircleIcon
      case 'withdrawn': return ExclamationTriangleIcon
      default: return ClockIcon
    }
  }

  const getJobDetails = (jobId: string) => {
    return jobOpportunities.find(job => job.id === jobId)
  }

  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus)

  const statusCounts = {
    all: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    interview_scheduled: applications.filter(app => app.status === 'interview_scheduled').length,
    interviewed: applications.filter(app => app.status === 'interviewed').length,
    offer_received: applications.filter(app => app.status === 'offer_received').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    withdrawn: applications.filter(app => app.status === 'withdrawn').length
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysSinceApplication = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          📈 Application Tracker
        </h3>
        <div className="text-sm text-gray-500">
          {applications.length} total applications
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedStatus === status
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
            <span className="ml-1 text-xs">({count})</span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No applications found for the selected status.</p>
          </div>
        ) : (
          filteredApplications.map((application, index) => {
            const job = getJobDetails(application.job_id)
            const StatusIcon = getStatusIcon(application.status)
            const daysSince = getDaysSinceApplication(application.application_date)

            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <StatusIcon className="h-5 w-5 text-gray-400" />
                      <h4 className="font-medium text-gray-900">
                        {job?.position} at {job?.company}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Applied:</span> {formatDate(application.application_date)}
                        <span className="ml-2 text-xs text-gray-500">({daysSince} days ago)</span>
                      </div>
                      
                      {application.response_date && (
                        <div>
                          <span className="font-medium">Response:</span> {formatDate(application.response_date)}
                        </div>
                      )}
                      
                      {application.interview_date && (
                        <div>
                          <span className="font-medium">Interview:</span> {formatDate(application.interview_date)}
                        </div>
                      )}
                    </div>

                    {application.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{application.notes}</p>
                      </div>
                    )}

                    {job && (
                      <div className="mt-3 flex items-center space-x-4 text-sm">
                        <span className="text-gray-500">Alex AI Score: <span className="font-medium text-indigo-600">{job.alex_ai_score}</span></span>
                        <span className="text-gray-500">Salary: <span className="font-medium">{job.salary_range}</span></span>
                        <span className="text-gray-500">Location: <span className="font-medium">{job.location}</span></span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {job?.application_url && (
                      <a
                        href={job.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Job →
                      </a>
                    )}
                    
                    {application.status === 'applied' && daysSince > 7 && (
                      <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                        Follow Up
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Summary Stats */}
      {applications.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.applied}</p>
              <p className="text-xs text-gray-500">Applied</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.interview_scheduled}</p>
              <p className="text-xs text-gray-500">Interviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{statusCounts.offer_received}</p>
              <p className="text-xs text-gray-500">Offers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {Math.round((statusCounts.offer_received / applications.length) * 100)}%
              </p>
              <p className="text-xs text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
