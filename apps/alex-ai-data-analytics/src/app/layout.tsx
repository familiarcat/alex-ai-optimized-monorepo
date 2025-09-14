import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alex AI Data Analytics Platform',
  description: 'Advanced analytics and data processing platform led by Commander Data',
  keywords: ['analytics', 'data', 'machine learning', 'AI', 'Alex AI', 'Commander Data'],
  authors: [{ name: 'Alex AI Crew' }],
  creator: 'Commander Data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-data-primary to-data-secondary">
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-data-accent rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Alex AI Data Analytics
                    </h1>
                    <p className="text-data-accent">
                      Led by Commander Data • Advanced Analytics Platform
                    </p>
                  </div>
                </div>
                <div className="text-right text-white">
                  <p className="text-sm opacity-75">Crew Status: Online</p>
                  <p className="text-xs opacity-50">Supabase Memory: Active</p>
                </div>
              </div>
            </header>
            <main className="space-y-8">
              {children}
            </main>
            <footer className="mt-16 text-center text-white opacity-75">
              <p>Built with logical precision by Commander Data and the Alex AI Crew</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}


