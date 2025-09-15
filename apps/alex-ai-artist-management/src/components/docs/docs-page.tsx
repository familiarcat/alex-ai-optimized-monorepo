"use client";

import { BookOpen, Search, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DocsPage() {
  const documentationSections = [
    {
      title: "Getting Started",
      description: "Learn the basics and set up your account",
      articles: [
        "Quick Start Guide",
        "Account Setup",
        "First Steps",
        "Dashboard Overview"
      ]
    },
    {
      title: "Portfolio Management",
      description: "Create and manage your artistic portfolio",
      articles: [
        "Adding Portfolio Pieces",
        "Organizing Your Work",
        "Portfolio Settings",
        "Sharing Your Portfolio"
      ]
    },
    {
      title: "Booking Management",
      description: "Handle bookings and events efficiently",
      articles: [
        "Creating Bookings",
        "Managing Calendar",
        "Client Communication",
        "Booking Analytics"
      ]
    },
    {
      title: "Integrations",
      description: "Connect with your favorite tools",
      articles: [
        "Social Media Integration",
        "Music Platform Sync",
        "Calendar Integration",
        "Payment Processing"
      ]
    },
    {
      title: "Analytics & Reporting",
      description: "Track your progress and performance",
      articles: [
        "Understanding Analytics",
        "Revenue Tracking",
        "Performance Metrics",
        "Custom Reports"
      ]
    },
    {
      title: "API Reference",
      description: "Build custom integrations",
      articles: [
        "Authentication",
        "Endpoints",
        "Rate Limits",
        "SDKs"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Documentation
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Everything you need to know about Alex AI Artist Management. 
              From getting started to advanced features and integrations.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search documentation..."
                className="pl-12 pr-4 py-4 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documentationSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
                <p className="text-gray-600 text-sm">
                  {section.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {section.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <a
                        href="#"
                        className="flex items-center justify-between text-sm text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <span>{article}</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  size="sm"
                >
                  View All Articles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Start Guide
            </h2>
            <p className="text-gray-600">
              Get up and running with Alex AI in minutes
            </p>
          </div>

          <div className="space-y-6">
            {[
              "Create your account and complete your profile",
              "Upload your first portfolio pieces",
              "Set up your calendar and availability",
              "Connect your social media accounts",
              "Create your first booking"
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-gray-900">{step}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Quick Start Guide
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help. Reach out and we'll get back to you quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Request Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
