"use client";

import { Calendar, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PressPage() {
  const pressReleases = [
    {
      title: "Alex AI Launches Revolutionary Artist Management Platform",
      date: "January 14, 2025",
      summary: "The new platform combines AI-powered insights with comprehensive booking management to help artists grow their careers.",
      category: "Product Launch"
    },
    {
      title: "Alex AI Raises $10M Series A to Accelerate Artist Platform Development",
      date: "December 15, 2024",
      summary: "Funding round led by prominent investors will enable expansion of AI capabilities and global reach.",
      category: "Funding"
    },
    {
      title: "Alex AI Partners with Major Music Venues for Booking Integration",
      date: "November 20, 2024",
      summary: "Strategic partnerships with 500+ venues nationwide to streamline the booking process for artists.",
      category: "Partnership"
    }
  ];

  const mediaCoverage = [
    {
      title: "How AI is Revolutionizing Artist Management",
      publication: "Music Industry News",
      date: "January 10, 2025",
      excerpt: "Alex AI is leading the charge in transforming how artists manage their careers..."
    },
    {
      title: "The Future of Independent Artist Success",
      publication: "Artist Weekly",
      date: "January 8, 2025",
      excerpt: "With their comprehensive platform, Alex AI is empowering artists to take control of their careers..."
    },
    {
      title: "Tech Startup Helps Artists Book More Shows",
      publication: "TechCrunch",
      date: "January 5, 2025",
      excerpt: "Alex AI's innovative approach to artist management is showing impressive results..."
    }
  ];

  const contactInfo = {
    name: "Sarah Johnson",
    title: "Head of Communications",
    email: "press@alex-ai.com",
    phone: "+1 (555) 123-4567"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Press & Media
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Latest news, press releases, and media coverage about Alex AI Artist Management. 
              Stay updated on our mission to empower artists worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Download Press Kit
              </Button>
              <Button size="lg" variant="outline">
                Contact Press Team
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Press Releases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Press Releases
          </h2>
          <p className="text-gray-600">
            Official announcements and company updates
          </p>
        </div>

        <div className="space-y-6">
          {pressReleases.map((release, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="outline">{release.category}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{release.date}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {release.summary}
                    </p>
                  </div>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Media Coverage */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Media Coverage
            </h2>
            <p className="text-gray-600">
              What the press is saying about Alex AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaCoverage.map((article, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {article.title}
                  </CardTitle>
                  <p className="text-blue-600 font-medium text-sm">
                    {article.publication}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    {article.excerpt}
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Press Kit */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Press Kit
          </h2>
          <p className="text-gray-600">
            Download our press kit for logos, images, and company information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Download className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Company Logos
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                High-resolution logos in various formats
              </p>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Download className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Product Screenshots
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Screenshots of the Alex AI platform
              </p>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Download className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Company Fact Sheet
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Key facts and statistics about Alex AI
              </p>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Press Contact
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            For media inquiries, please contact our press team
          </p>
          <div className="bg-white bg-opacity-10 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-white mb-2">
              {contactInfo.name}
            </h3>
            <p className="text-blue-100 mb-4">{contactInfo.title}</p>
            <div className="space-y-2 text-blue-100">
              <p>{contactInfo.email}</p>
              <p>{contactInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
