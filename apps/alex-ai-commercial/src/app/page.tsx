import { Suspense } from 'react'
import { n8nHealthManager } from '@/lib/n8n-health-manager'
import ClientPage from './client-page'

// Server-side component that waits for N8N health before rendering
export default async function HomePage() {
  console.log('🚀 Server-side page loading - checking N8N health...')
  
  try {
    // Wait for N8N to be fully healthy before rendering the client
    const healthStatus = await n8nHealthManager.waitForN8NHealth(30000) // 30 second timeout
    
    console.log('✅ N8N health confirmed, rendering client page:', {
      webhooks: healthStatus.webhooks,
      federation: healthStatus.federation,
      supabase: healthStatus.supabase
    })
    
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Ensuring N8N Federation Crew is ready...</p>
            <p className="mt-2 text-sm text-gray-500">This ensures optimal data flow and reliability</p>
          </div>
        </div>
      }>
        <ClientPage initialHealthStatus={healthStatus} />
      </Suspense>
    )
    
  } catch (error) {
    console.error('❌ N8N health check failed:', error)
    
    // If N8N is not healthy, show an error page instead of loading mock data
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            N8N Federation Crew Unavailable
          </h1>
          <p className="text-gray-600 mb-6">
            The N8N Federation Crew is not responding. This system requires N8N to be fully operational 
            to ensure proper data flow and security.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">What this means:</h3>
            <ul className="text-sm text-yellow-700 text-left space-y-1">
              <li>• N8N webhooks are not accessible</li>
              <li>• Data operations cannot be performed securely</li>
              <li>• The system cannot connect to Supabase through N8N</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Next steps:</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• Check N8N server status at n8n.pbradygeorgen.com</li>
              <li>• Verify N8N workflows are active</li>
              <li>• Ensure N8N can connect to Supabase</li>
              <li>• Refresh the page once N8N is operational</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }
}


