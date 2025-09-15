"use client";

import { useState } from "react";
import { 
  Search, 
  MessageCircle, 
  BookOpen, 
  Video, 
  Mail, 
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create my first booking?",
      answer: "To create your first booking, go to the Bookings section in your dashboard and click 'New Booking'. Fill in the venue details, date, time, and any special requirements. You can also import bookings from your calendar or CSV files."
    },
    {
      question: "How do I upload my portfolio pieces?",
      answer: "Navigate to the Portfolio section and click 'Add New Piece'. You can upload images, audio files, videos, or documents. Make sure to add titles, descriptions, and tags to help with organization and discoverability."
    },
    {
      question: "Can I integrate with my social media accounts?",
      answer: "Yes! Alex AI supports integrations with Instagram, YouTube, Facebook, Twitter, and more. Go to Settings > Integrations to connect your accounts and automatically sync your content."
    },
    {
      question: "How do I track my earnings and expenses?",
      answer: "Use the Analytics section to track your income, expenses, and overall financial performance. You can also connect your bank account or payment processors for automatic transaction tracking."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security including SSL encryption, secure data centers, and regular security audits. Your data is never shared with third parties without your explicit consent."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your account settings. Go to Settings > Billing and click 'Cancel Subscription'. Your data will be preserved for 30 days after cancellation."
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "Available 24/7",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message and we'll respond within 24 hours",
      availability: "24 hour response time",
      action: "Send Email"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      availability: "Mon-Fri 9AM-6PM EST",
      action: "Call Now"
    },
    {
      icon: Video,
      title: "Video Call",
      description: "Schedule a screen sharing session for complex issues",
      availability: "By appointment",
      action: "Schedule Call"
    }
  ];

  const quickLinks = [
    { title: "Getting Started Guide", href: "/docs/getting-started" },
    { title: "API Documentation", href: "/api" },
    { title: "Integration Guides", href: "/integrations" },
    { title: "Video Tutorials", href: "/tutorials" },
    { title: "Community Forum", href: "/community" },
    { title: "Feature Requests", href: "/feature-requests" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find answers to common questions, get support, or explore our resources to make the most of Alex AI.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles, tutorials, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
            >
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">{link.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Support Options */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Support
            </h2>
            <p className="text-gray-600">
              Choose the support option that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <option.icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {option.description}
                  </p>
                  <p className="text-blue-600 text-sm font-medium mb-4">
                    {option.availability}
                  </p>
                  <Button className="w-full" size="sm">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Quick answers to the most common questions
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-0">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Still Need Help */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you succeed. Don't hesitate to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
