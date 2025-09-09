'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface ResumeUploadProps {
  onResumeUpload: (file: File) => void
  currentResume?: string | null
  isAnalyzing?: boolean
}

export default function ResumeUpload({ onResumeUpload, currentResume, isAnalyzing = false }: ResumeUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const resumeFile = files.find(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    )
    
    if (resumeFile) {
      handleFileUpload(resumeFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploadProgress(0)
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    try {
      // Call the parent component's upload handler
      await onResumeUpload(file)
      
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 1000)
    } catch (error) {
      console.error('Resume upload failed:', error)
      setUploadProgress(0)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        📄 Resume Analysis
      </h3>
      
      {currentResume ? (
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            currentResume.startsWith('ERROR:') 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                currentResume.startsWith('ERROR:') ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <span className={`text-sm ${
                  currentResume.startsWith('ERROR:') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {currentResume.startsWith('ERROR:') ? '✗' : '✓'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${
                  currentResume.startsWith('ERROR:') ? 'text-red-800' : 'text-green-800'
                }`}>
                  {currentResume}
                </p>
                <p className={`text-xs ${
                  currentResume.startsWith('ERROR:') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {currentResume.startsWith('ERROR:') ? 'Loading Failed' : 'Analysis Complete'}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="text-xs text-gray-500">
                {currentResume.startsWith('ERROR:') ? 'Error' : '15.48 KB'}
              </p>
            </div>
          </div>
          
          <div className={`border rounded-lg p-3 ${
            currentResume.startsWith('ERROR:') 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <p className={`text-sm ${
              currentResume.startsWith('ERROR:') ? 'text-red-800' : 'text-green-800'
            }`}>
              {currentResume.startsWith('ERROR:') 
                ? '❌ Resume loading failed. Please check the console for details or try uploading manually.'
                : '✅ Resume analyzed successfully. Job matches updated based on your profile.'
              }
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={triggerFileInput}
              disabled={isAnalyzing}
              className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? 'Analyzing...' : 'Upload Different Resume'}
            </button>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 Tip: Upload your most recent resume for best results</p>
              <p>🔒 Your resume is analyzed securely and stored permanently</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-indigo-400 bg-indigo-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your resume here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse files
              </p>
            </div>
            
            <button
              onClick={triggerFileInput}
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Choose File
            </button>
            
            <p className="text-xs text-gray-400">
              Supports PDF, DOC, DOCX files
            </p>
          </div>
        </div>
      )}
      
      {uploadProgress > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}