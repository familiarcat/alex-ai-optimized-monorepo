'use client'

import { useState } from 'react'
import { JobOpportunity, Contact } from '@/lib/n8n-data-service'
import { motion } from 'framer-motion'
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  WrenchScrewdriverIcon, 
  ScaleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTopRightOnSquareIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

interface JobCardProps {
  job: JobOpportunity
  contacts: Contact[]
  onApply: () => void
  onSelect: () => void
  isSelected: boolean
}

export default function JobCard({ job, contacts, onApply, onSelect, isSelected }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getCompanyTypeColor = (type: string | null) => {
    switch (type) {
      case 'tech': return 'bg-blue-100 text-blue-800'
      case 'advertising': return 'bg-purple-100 text-purple-800'
      case 'marketing': return 'bg-green-100 text-green-800'
      case 'remote_first': return 'bg-orange-100 text-orange-800'
      case 'established': return 'bg-gray-100 text-gray-800'
      case 'fine_arts': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAlexAIScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-800'
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer ${
        isSelected ? 'border-indigo-500 shadow-md' : 'border-gray-200 hover:border-indigo-300'
      }`}
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Badges */}
      <div className="relative p-6">
        <div className="absolute top-4 right-4 flex space-x-2">
          {job.st_louis_area && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              St. Louis
            </span>
          )}
          {job.remote_option === 'Remote' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Remote
            </span>
          )}
          {job.work_life_balance?.includes('work-life balance') && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Work-Life Balance
            </span>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {job.position}
            </h3>
            <p className="text-lg text-indigo-600 font-medium">
              {job.company}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2 min-w-0">
            <div className="flex flex-col items-end space-y-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAlexAIScoreColor(job.alex_ai_score)}`}>
                Match: {job.alex_ai_score}
              </span>
              {job.alex_ai_crew_analysis && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>👥</span>
                  <span>Expert: {Math.round(
                    ((job.alex_ai_crew_analysis.technicalLead?.score || 0) + 
                     (job.alex_ai_crew_analysis.aiStrategy?.score || 0) + 
                     (job.alex_ai_crew_analysis.clientSuccess?.score || 0) + 
                     (job.alex_ai_crew_analysis.sustainability?.score || 0)) / 4
                  )}</span>
                </div>
              )}
            </div>
            {job.company_type && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCompanyTypeColor(job.company_type)}`}>
                {job.company_type.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>{job.location} ({job.remote_option})</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span>{job.salary_range}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span className="truncate">{job.requirements}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <ScaleIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span className="truncate">{job.work_life_balance}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Why This Role Fits You */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-yellow-800 mb-2">🎯 Why This Role Fits You</h4>
          <p className="text-sm text-yellow-700">{job.alex_ai_leverage}</p>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-4"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Alex AI Crew Analysis */}
            {job.alex_ai_crew_analysis && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">🤖</span>
                  Expert Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(job.alex_ai_crew_analysis).map(([crew, analysis]) => (
                    <div key={crew} className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800 capitalize">
                          {crew.replace(/([A-Z])/g, ' $1').trim()}
                        </h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          analysis.score >= 90 ? 'bg-green-100 text-green-800' :
                          analysis.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {analysis.score}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{analysis.analysis}</p>
                      {analysis.recommendations && analysis.recommendations.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Recommendations:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                <p className="text-sm text-gray-600">{job.benefits}</p>
              </div>
            )}

            {/* Contacts */}
            {contacts.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Contacts</h4>
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.title}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          contact.confidence_level === 'high' ? 'bg-green-100 text-green-800' :
                          contact.confidence_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {contact.confidence_level} confidence
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-indigo-600 hover:text-indigo-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EnvelopeIcon className="h-5 w-5" />
                          </a>
                        )}
                        {contact.linkedin && (
                          <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onApply()
            }}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Apply Now
          </button>
          {job.application_url && (
            <a
              href={job.application_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
              View Job
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
