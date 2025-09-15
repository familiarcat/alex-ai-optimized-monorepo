import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alex AI Artist Management Platform",
  description: "Comprehensive career management and booking platform for artists across all disciplines",
  keywords: [
    "artist management",
    "music booking",
    "art gallery",
    "poetry readings",
    "performance booking",
    "artist portfolio",
    "career management",
    "creative professionals"
  ],
  authors: [{ name: "Alex AI Crew" }],
  creator: "Alex AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alex-ai-artist-management.com",
    title: "Alex AI Artist Management Platform",
    description: "Comprehensive career management and booking platform for artists across all disciplines",
    siteName: "Alex AI Artist Management",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex AI Artist Management Platform",
    description: "Comprehensive career management and booking platform for artists across all disciplines",
    creator: "@alex_ai_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}