'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface FilterSidebarProps {
  filters: {
    location: string
    workLifeBalance: number
    alexAIScore: number
    salaryRange: string
    companyTypes: string[]
  }
  onFiltersChange: (filters: {
    location: string
    workLifeBalance: number
    alexAIScore: number
    salaryRange: string
    companyTypes: string[]
  }) => void
  skillPriorities: Record<string, number>
  onSkillPrioritiesChange: (priorities: Record<string, number>) => void
}

export default function FilterSidebar({ filters, onFiltersChange, skillPriorities, onSkillPrioritiesChange }: FilterSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [skillsExpanded, setSkillsExpanded] = useState(false)

  const companyTypeOptions = [
    { value: 'tech', label: 'Tech Companies', color: 'bg-blue-100 text-blue-800' },
    { value: 'advertising', label: 'Advertising', color: 'bg-purple-100 text-purple-800' },
    { value: 'marketing', label: 'Marketing', color: 'bg-green-100 text-green-800' },
    { value: 'remote_first', label: 'Remote-First', color: 'bg-orange-100 text-orange-800' },
    { value: 'established', label: 'Established', color: 'bg-gray-100 text-gray-800' },
    { value: 'fine_arts', label: 'Fine Arts', color: 'bg-pink-100 text-pink-800' }
  ]

  const skillCategories = {
    'Programming Languages': ['Python', 'JavaScript', 'TypeScript', 'Node.js'],
    'Frameworks & Libraries': ['React', 'Next.js', 'Vue.js', 'Angular'],
    'AI & Machine Learning': ['Machine Learning', 'AI/ML', 'OpenAI', 'Data Analysis'],
    'Backend & Database': ['Supabase', 'Database Design', 'API Development', 'n8n'],
    'Cloud & DevOps': ['AWS', 'Azure', 'Docker', 'DevOps', 'Cloud Computing'],
    'Tools & Version Control': ['Git', 'Agile', 'Project Management'],
    'Soft Skills': ['Leadership', 'Communication', 'Problem Solving']
  }

  const handleSkillPriorityChange = (skill: string, priority: number) => {
    onSkillPrioritiesChange({
      ...skillPriorities,
      [skill]: priority
    })
  }

  const getSkillPriority = (skill: string) => {
    return skillPriorities[skill] || 3
  }

  const getPriorityLabel = (priority: number) => {
    const labels = ['Low', 'Below Average', 'Average', 'High', 'Very High']
    return labels[priority - 1] || 'Average'
  }

  const getPriorityColor = (priority: number) => {
    const colors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-green-600', 'text-blue-600']
    return colors[priority - 1] || 'text-yellow-600'
  }

  const handleCompanyTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.companyTypes, type]
      : filters.companyTypes.filter(t => t !== type)
    
    onFiltersChange({
      ...filters,
      companyTypes: newTypes
    })
  }

  const getWorkLifeBalanceLabel = (value: number) => {
    const labels = ['Low', 'Below Average', 'Average', 'High', 'Very High']
    return labels[value - 1]
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🎯 Search Filters
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Preference
            </label>
            <select
              value={filters.location}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Locations</option>
              <option value="st-louis">St. Louis, MO (63110)</option>
              <option value="remote">Remote (Central Time Zone)</option>
              <option value="hybrid">Hybrid (St. Louis + Remote)</option>
            </select>
          </div>

          {/* Work-Life Balance Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work-Life Balance Priority: {getWorkLifeBalanceLabel(filters.workLifeBalance)}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={filters.workLifeBalance}
              onChange={(e) => onFiltersChange({ ...filters, workLifeBalance: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Match Quality Score Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Quality Score: {filters.alexAIScore}+
            </label>
            <input
              type="range"
              min="50"
              max="95"
              value={filters.alexAIScore}
              onChange={(e) => onFiltersChange({ ...filters, alexAIScore: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50</span>
              <span>95</span>
            </div>
          </div>

          {/* Salary Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <select
              value={filters.salaryRange}
              onChange={(e) => onFiltersChange({ ...filters, salaryRange: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Ranges</option>
              <option value="80k+">$80k+</option>
              <option value="100k+">$100k+</option>
              <option value="120k+">$120k+</option>
              <option value="150k+">$150k+</option>
            </select>
          </div>

          {/* Company Types Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Company Types
            </label>
            <div className="space-y-2">
              {companyTypeOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.companyTypes.includes(option.value)}
                    onChange={(e) => handleCompanyTypeChange(option.value, e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Filters
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onFiltersChange({
                  location: 'st-louis',
                  workLifeBalance: 5,
                  alexAIScore: 80,
                  salaryRange: '100k+',
                  companyTypes: ['tech', 'advertising', 'marketing']
                })}
                className="w-full text-left px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
              >
                🎯 High Priority (St. Louis + High Score)
              </button>
              <button
                onClick={() => onFiltersChange({
                  location: 'remote',
                  workLifeBalance: 5,
                  alexAIScore: 75,
                  salaryRange: 'all',
                  companyTypes: ['tech', 'remote_first']
                })}
                className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                🌐 Remote Central Time Zone
              </button>
              <button
                onClick={() => onFiltersChange({
                  location: 'all',
                  workLifeBalance: 5,
                  alexAIScore: 90,
                  salaryRange: 'all',
                  companyTypes: ['tech', 'advertising', 'marketing', 'remote_first', 'established', 'fine_arts']
                })}
                className="w-full text-left px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors"
              >
                🚀 Top Match Quality
              </button>
            </div>
          </div>

          {/* Skills Priority Ranking */}
          <div>
            <button
              onClick={() => setSkillsExpanded(!skillsExpanded)}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-2 hover:text-gray-900"
            >
              <span>🎯 Skills Priority Ranking</span>
              <span className={`transform transition-transform ${skillsExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {skillsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {Object.entries(skillCategories).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {skills.map(skill => (
                        <div key={skill} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{skill}</span>
                            <span className={`text-xs font-medium ${getPriorityColor(getSkillPriority(skill))}`}>
                              {getPriorityLabel(getSkillPriority(skill))}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={getSkillPriority(skill)}
                            onChange={(e) => handleSkillPriorityChange(skill, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Priority Summary */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Priority Summary</h4>
                  <div className="space-y-1">
                    {Object.entries(skillPriorities)
                      .filter(([_, priority]) => priority >= 4)
                      .sort(([_, a], [__, b]) => b - a)
                      .slice(0, 5)
                      .map(([skill, priority]) => (
                        <div key={skill} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{skill}</span>
                          <span className={`font-medium ${getPriorityColor(priority)}`}>
                            {getPriorityLabel(priority)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => onFiltersChange({
              location: 'all',
              workLifeBalance: 5,
              alexAIScore: 70,
              salaryRange: 'all',
              companyTypes: ['tech', 'advertising', 'marketing', 'remote_first', 'established', 'fine_arts']
            })}
            className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset All Filters
          </button>
        </motion.div>
      )}
    </div>
  )
}
