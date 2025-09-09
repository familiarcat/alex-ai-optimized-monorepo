'use client'

import React, { useState } from 'react'
import DataSourceIndicator, { DataSourceInfo } from './DataSourceIndicator'

export default function DataSourceIndicatorTest() {
  const [currentTest, setCurrentTest] = useState(0)

  const testCases: DataSourceInfo[] = [
    {
      source: 'live',
      totalJobs: 25,
      liveJobs: 15,
      cachedJobs: 10,
      lastUpdated: new Date().toISOString(),
      scrapingStatus: 'active'
    },
    {
      source: 'cached',
      totalJobs: 20,
      liveJobs: 0,
      cachedJobs: 20,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      scrapingStatus: 'idle',
      nextScrape: new Date(Date.now() + 13 * 60 * 1000).toISOString() // 13 minutes from now
    },
    {
      source: 'mock',
      totalJobs: 12,
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      scrapingStatus: 'idle'
    },
    {
      source: 'fallback',
      totalJobs: 8,
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      scrapingStatus: 'error'
    }
  ]

  const testNames = [
    'Live Scraping Active',
    'Cached Data (2h old)',
    'Mock Data (1d old)',
    'Fallback Data (3d old)'
  ]

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Data Source Indicator Test</h3>
      
      <div className="mb-4">
        <div className="flex space-x-2 mb-4">
          {testNames.map((name, index) => (
            <button
              key={index}
              onClick={() => setCurrentTest(index)}
              className={`px-3 py-1 rounded text-sm ${
                currentTest === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        
        <div className="bg-white p-4 rounded border">
          <DataSourceIndicator 
            dataSource={testCases[currentTest]} 
            onRefresh={() => console.log('Refresh clicked')}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p><strong>Current Test:</strong> {testNames[currentTest]}</p>
        <p><strong>Source:</strong> {testCases[currentTest].source}</p>
        <p><strong>Total Jobs:</strong> {testCases[currentTest].totalJobs}</p>
        {testCases[currentTest].liveJobs !== undefined && (
          <p><strong>Live Jobs:</strong> {testCases[currentTest].liveJobs}</p>
        )}
        {testCases[currentTest].cachedJobs !== undefined && (
          <p><strong>Cached Jobs:</strong> {testCases[currentTest].cachedJobs}</p>
        )}
        <p><strong>Status:</strong> {testCases[currentTest].scrapingStatus}</p>
      </div>
    </div>
  )
}
