import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Security headers for all responses
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()')
  
  // Rate limiting headers (basic implementation)
  const rateLimitKey = request.ip || 'unknown'
  const rateLimit = request.headers.get('x-rate-limit') || '0'
  
  if (parseInt(rateLimit) > 100) {
    return new NextResponse('Rate limit exceeded', { status: 429 })
  }
  
  // API route protection
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Add CORS headers for API routes
    response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    // Basic API key validation for sensitive endpoints
    const sensitiveEndpoints = ['/api/setup-supabase-tables', '/api/deploy-n8n']
    if (sensitiveEndpoints.some(endpoint => request.nextUrl.pathname.startsWith(endpoint))) {
      const apiKey = request.headers.get('x-api-key')
      if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return new NextResponse('Unauthorized', { status: 401 })
      }
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

