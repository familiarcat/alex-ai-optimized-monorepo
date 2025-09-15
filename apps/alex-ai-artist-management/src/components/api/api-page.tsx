"use client";

import { useState } from "react";
import { Code, Zap, Shield, Globe, Database, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ApiPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'auth' | 'examples'>('overview');

  const apiFeatures = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "RESTful API with sub-100ms response times and 99.9% uptime guarantee"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "OAuth 2.0, JWT tokens, and rate limiting to keep your data safe"
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "API endpoints served from our global content delivery network"
    },
    {
      icon: Database,
      title: "Real-time",
      description: "WebSocket support for real-time updates and notifications"
    }
  ];

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/artists",
      description: "List all artists",
      example: "curl -H 'Authorization: Bearer YOUR_TOKEN' https://api.alex-ai.com/v1/artists"
    },
    {
      method: "POST",
      path: "/api/v1/bookings",
      description: "Create a new booking",
      example: "curl -X POST -H 'Content-Type: application/json' -d '{\"artist_id\": 123, \"venue\": \"Blue Note\"}' https://api.alex-ai.com/v1/bookings"
    },
    {
      method: "GET",
      path: "/api/v1/portfolio/{id}",
      description: "Get artist portfolio",
      example: "curl -H 'Authorization: Bearer YOUR_TOKEN' https://api.alex-ai.com/v1/portfolio/123"
    },
    {
      method: "PUT",
      path: "/api/v1/artists/{id}",
      description: "Update artist profile",
      example: "curl -X PUT -H 'Content-Type: application/json' -d '{\"name\": \"John Doe\"}' https://api.alex-ai.com/v1/artists/123"
    }
  ];

  const codeExamples = [
    {
      language: "JavaScript",
      code: `// Initialize the client
const alexAI = new AlexAI({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Create a new booking
const booking = await alexAI.bookings.create({
  artistId: 123,
  venue: 'Blue Note Jazz Club',
  date: '2025-02-15',
  time: '20:00',
  duration: 120
});

console.log('Booking created:', booking.id);`
    },
    {
      language: "Python",
      code: `import alexai

# Initialize the client
client = alexai.Client(api_key='your-api-key')

# Get artist portfolio
portfolio = client.portfolio.get(artist_id=123)

# Update artist profile
artist = client.artists.update(
    artist_id=123,
    data={
        'bio': 'Jazz musician with 10 years of experience',
        'genres': ['jazz', 'blues', 'soul']
    }
)

print(f'Updated artist: {artist.name}')`
    },
    {
      language: "PHP",
      code: `<?php
use AlexAI\\Client;

// Initialize the client
$client = new Client('your-api-key');

// List all bookings
$bookings = $client->bookings->list([
    'status' => 'confirmed',
    'date_from' => '2025-02-01'
]);

// Create a new portfolio piece
$portfolio = $client->portfolio->create([
    'artist_id' => 123,
    'title' => 'New Jazz Album',
    'type' => 'album',
    'url' => 'https://example.com/album'
]);

echo "Portfolio piece created: " . $portfolio->id;
?>`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Alex AI Artist Management API
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Powerful RESTful API to integrate Alex AI Artist Management into your applications. 
              Build custom tools, automate workflows, and create amazing experiences for artists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get API Key
              </Button>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {apiFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'endpoints', label: 'Endpoints' },
                { id: 'auth', label: 'Authentication' },
                { id: 'examples', label: 'Code Examples' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                API Overview
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Base URL
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    https://api.alex-ai.com/v1
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">
                    Response Format
                  </h3>
                  <p className="text-gray-600 mb-4">
                    All API responses are returned in JSON format with the following structure:
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
{`{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}`}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Rate Limits
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Free Plan</span>
                      <Badge>1,000 requests/hour</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Pro Plan</span>
                      <Badge>10,000 requests/hour</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Enterprise</span>
                      <Badge>Unlimited</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'endpoints' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              API Endpoints
            </h2>
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'default' : 
                                endpoint.method === 'POST' ? 'secondary' : 
                                'outline'}
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-lg font-mono text-gray-900">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-gray-600 mb-4">{endpoint.description}</p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      {endpoint.example}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Authentication
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  API Key Authentication
                </h3>
                <p className="text-gray-600 mb-4">
                  Include your API key in the Authorization header:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                  Authorization: Bearer your-api-key-here
                </div>
                <p className="text-gray-600 mb-4">
                  You can get your API key from the dashboard settings.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  OAuth 2.0 (Coming Soon)
                </h3>
                <p className="text-gray-600 mb-4">
                  For third-party applications, we'll support OAuth 2.0 for secure authentication.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    OAuth 2.0 support is currently in development and will be available in Q2 2025.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Code Examples
            </h2>
            <div className="space-y-8">
              {codeExamples.map((example, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {example.language}
                  </h3>
                  <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{example.code}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build with Our API?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get your API key and start building amazing applications for artists
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}
