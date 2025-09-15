"use client";

import { useState } from "react";
import { 
  Music, 
  Palette, 
  BookOpen, 
  Camera, 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitter,
  Music2, // Using Music2 instead of Spotify
  Apple,
  Cloud, // Using Cloud instead of Soundcloud
  Disc3, // Using Disc3 instead of Bandcamp
  Mail,
  Calendar,
  CreditCard,
  FileText,
  Zap,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'social' | 'music' | 'finance' | 'productivity'>('all');

  const integrations = [
    // Social Media
    {
      name: "Instagram",
      description: "Automatically sync your portfolio to Instagram posts and stories",
      icon: Instagram,
      category: "social",
      status: "available",
      popular: true
    },
    {
      name: "YouTube",
      description: "Import your YouTube videos as portfolio pieces and track analytics",
      icon: Youtube,
      category: "social",
      status: "available",
      popular: true
    },
    {
      name: "Facebook",
      description: "Cross-post events and portfolio updates to Facebook",
      icon: Facebook,
      category: "social",
      status: "available",
      popular: false
    },
    {
      name: "Twitter",
      description: "Share updates and engage with your audience on Twitter",
      icon: Twitter,
      category: "social",
      status: "available",
      popular: false
    },
    
    // Music Platforms
    {
      name: "Spotify",
      description: "Import your tracks and albums from Spotify",
      icon: Music2,
      category: "music",
      status: "available",
      popular: true
    },
    {
      name: "Apple Music",
      description: "Sync your Apple Music catalog with your portfolio",
      icon: Apple,
      category: "music",
      status: "available",
      popular: true
    },
    {
      name: "SoundCloud",
      description: "Import tracks and playlists from SoundCloud",
      icon: Cloud,
      category: "music",
      status: "available",
      popular: false
    },
    {
      name: "Bandcamp",
      description: "Sync your Bandcamp releases and sales data",
      icon: Disc3,
      category: "music",
      status: "available",
      popular: false
    },
    
    // Productivity
    {
      name: "Google Calendar",
      description: "Sync bookings and events with your Google Calendar",
      icon: Calendar,
      category: "productivity",
      status: "available",
      popular: true
    },
    {
      name: "Outlook Calendar",
      description: "Integrate with Microsoft Outlook for seamless scheduling",
      icon: Calendar,
      category: "productivity",
      status: "available",
      popular: false
    },
    {
      name: "Gmail",
      description: "Send automated emails and track communications",
      icon: Mail,
      category: "productivity",
      status: "available",
      popular: false
    },
    {
      name: "Zapier",
      description: "Connect with 5000+ apps through Zapier automation",
      icon: Zap,
      category: "productivity",
      status: "available",
      popular: true
    },
    
    // Finance
    {
      name: "Stripe",
      description: "Accept payments and manage invoices seamlessly",
      icon: CreditCard,
      category: "finance",
      status: "available",
      popular: true
    },
    {
      name: "PayPal",
      description: "Process payments and manage transactions",
      icon: CreditCard,
      category: "finance",
      status: "available",
      popular: false
    },
    {
      name: "QuickBooks",
      description: "Sync financial data with QuickBooks for accounting",
      icon: FileText,
      category: "finance",
      status: "coming-soon",
      popular: false
    },
    {
      name: "FreshBooks",
      description: "Integrate with FreshBooks for invoicing and time tracking",
      icon: FileText,
      category: "finance",
      status: "coming-soon",
      popular: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Integrations', count: integrations.length },
    { id: 'social', label: 'Social Media', count: integrations.filter(i => i.category === 'social').length },
    { id: 'music', label: 'Music Platforms', count: integrations.filter(i => i.category === 'music').length },
    { id: 'productivity', label: 'Productivity', count: integrations.filter(i => i.category === 'productivity').length },
    { id: 'finance', label: 'Finance', count: integrations.filter(i => i.category === 'finance').length }
  ];

  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      default:
        return <Badge variant="outline">Beta</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Integrations
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect Alex AI with your favorite tools and platforms. Streamline your workflow 
              and automate repetitive tasks with our growing library of integrations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Browse All Integrations
              </Button>
              <Button size="lg" variant="outline">
                Request Integration
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 py-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              {integration.popular && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-blue-600 text-white text-xs">
                    Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <integration.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <div className="mt-1">
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {integration.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Button 
                    size="sm" 
                    variant={integration.status === 'available' ? 'default' : 'outline'}
                    disabled={integration.status !== 'available'}
                  >
                    {integration.status === 'available' ? 'Connect' : 'Coming Soon'}
                  </Button>
                  
                  {integration.status === 'available' && (
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Integrations */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Most Popular Integrations
            </h2>
            <p className="text-gray-600">
              These integrations are used by 90% of our artists
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrations.filter(i => i.popular).map((integration, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <integration.icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {integration.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {integration.description}
                </p>
                <Button size="sm" className="w-full">
                  Connect Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Integrations Work
            </h2>
            <p className="text-gray-600">
              Connect your tools in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Choose Your Integration
              </h3>
              <p className="text-gray-600">
                Browse our library of integrations and select the tools you use most.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Connect Your Account
              </h3>
              <p className="text-gray-600">
                Securely authorize Alex AI to access your data with OAuth 2.0.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Automate Your Workflow
              </h3>
              <p className="text-gray-600">
                Set up automated workflows and watch your productivity soar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't See Your Tool?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We're constantly adding new integrations. Request your favorite tool and we'll build it for you.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Request Integration
          </Button>
        </div>
      </div>
    </div>
  );
}
