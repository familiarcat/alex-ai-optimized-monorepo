import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alex AI Communication Hub',
  description: 'Unified communication and notification system led by Lieutenant Uhura',
  keywords: ['communication', 'messaging', 'notifications', 'AI', 'Alex AI', 'Lieutenant Uhura'],
  authors: [{ name: 'Alex AI Crew' }],
  creator: 'Lieutenant Uhura',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-comm-primary to-comm-secondary">
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-comm-accent rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📡</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Alex AI Communication Hub
                    </h1>
                    <p className="text-comm-accent">
                      Led by Lieutenant Uhura • Multi-channel Communication System
                    </p>
                  </div>
                </div>
                <div className="text-right text-white">
                  <p className="text-sm opacity-75">Communication Status: Online</p>
                  <p className="text-xs opacity-50">Channels: Email, SMS, Push</p>
                </div>
              </div>
            </header>
            <main className="space-y-8">
              {children}
            </main>
            <footer className="mt-16 text-center text-white opacity-75">
              <p>Built with communication excellence by Lieutenant Uhura and the Alex AI Crew</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}










