"use client";

import { Cookie, Settings, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function CookiesPage() {
  const cookieTypes = [
    {
      icon: Cookie,
      title: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be switched off in our systems.",
      examples: ["Authentication", "Security", "Basic functionality"]
    },
    {
      icon: BarChart3,
      title: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      examples: ["Page views", "User behavior", "Performance metrics"]
    },
    {
      icon: Settings,
      title: "Preference Cookies",
      description: "These cookies enable the website to remember choices you make and provide enhanced, more personal features.",
      examples: ["Language settings", "Theme preferences", "Customization options"]
    },
    {
      icon: Shield,
      title: "Marketing Cookies",
      description: "These cookies are used to track visitors across websites to display relevant and engaging advertisements.",
      examples: ["Ad targeting", "Campaign tracking", "Social media integration"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Last updated: January 14, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Types of Cookies We Use
          </h2>
          <p className="text-gray-600">
            We use different types of cookies to provide and improve our services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cookieTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <type.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {type.description}
                </p>
                <div className="space-y-1">
                  {type.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="text-sm text-gray-500">
                      • {example}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cookie Policy Content */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Are Cookies?</h2>
            <p className="text-gray-600 mb-8">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to website owners.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Cookies</h2>
            <p className="text-gray-600 mb-6">
              We use cookies to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Improve our services and user experience</li>
              <li>Provide personalized content and advertisements</li>
              <li>Ensure website security and prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Managing Your Cookie Preferences</h2>
            <p className="text-gray-600 mb-6">
              You can control and manage cookies in various ways:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li>Use our cookie preference center (available in the footer)</li>
              <li>Configure your browser settings to block or delete cookies</li>
              <li>Use browser extensions to manage cookies</li>
              <li>Opt out of specific tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Cookies</h2>
            <p className="text-gray-600 mb-8">
              We may also use third-party services that set cookies on our website, including analytics providers, 
              advertising networks, and social media platforms. These third parties have their own privacy policies and cookie policies.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Updates to This Policy</h2>
            <p className="text-gray-600 mb-8">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, 
              legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-900 font-medium">Alex AI Artist Management</p>
              <p className="text-gray-600">Email: privacy@alex-ai.com</p>
              <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Manage Your Cookie Preferences
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Take control of your privacy by managing your cookie settings
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Cookie Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
