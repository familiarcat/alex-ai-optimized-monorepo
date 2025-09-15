import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alex AI Master Dashboard - Command Center',
  description: 'Unified entry point and command center for all Alex AI specialized applications',
  keywords: ['dashboard', 'command center', 'Alex AI', 'Captain Picard', 'crew coordination'],
  authors: [{ name: 'Alex AI Crew' }],
  creator: 'Captain Picard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-master-primary via-master-secondary to-master-accent">
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-master-accent rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🖖</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      Alex AI Command Center
                    </h1>
                    <p className="text-master-accent text-lg">
                      Led by Captain Picard • Master Dashboard
                    </p>
                    <p className="text-white/75 text-sm">
                      Unified entry point to all specialized applications
                    </p>
                  </div>
                </div>
                <div className="text-right text-white">
                  <p className="text-sm opacity-75">Crew Status: All Systems Operational</p>
                  <p className="text-xs opacity-50">Supabase Memory: Active</p>
                  <p className="text-xs opacity-50">N8N Integration: Online</p>
                </div>
              </div>
            </header>
            <main className="space-y-8">
              {children}
            </main>
            <footer className="mt-16 text-center text-white opacity-75">
              <p>Built with strategic leadership by Captain Picard and the Alex AI Crew</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}









