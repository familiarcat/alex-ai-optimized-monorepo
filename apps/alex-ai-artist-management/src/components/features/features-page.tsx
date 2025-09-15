"use client";

import React from "react";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  TrendingUp,
  Globe,
  FileText,
  Award,
  CheckCircle,
  ArrowRight,
  Music,
  Palette,
  BookOpen,
  Theater,
  Camera,
  Mic,
  BarChart3,
  Zap,
  Shield,
  Smartphone,
  Cloud,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mainFeatures = [
  {
    icon: Calendar,
    title: "Smart Booking Management",
    description: "AI-powered venue matching and automated booking processes",
    benefits: [
      "Intelligent venue compatibility scoring",
      "Automated contract generation",
      "Performance scheduling optimization",
      "Conflict detection and resolution"
    ]
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive career insights and performance tracking",
    benefits: [
      "Revenue trend analysis",
      "Booking success rate tracking",
      "Audience demographic insights",
      "Career progression monitoring"
    ]
  },
  {
    icon: Globe,
    title: "Portfolio Management",
    description: "Professional showcase tools for all artistic disciplines",
    benefits: [
      "Multi-media portfolio builder",
      "SEO optimization tools",
      "Social media integration",
      "Professional branding tools"
    ]
  },
  {
    icon: Bot,
    title: "AI-Powered Insights",
    description: "Machine learning recommendations and career guidance",
    benefits: [
      "Opportunity matching algorithms",
      "Pricing optimization suggestions",
      "Market trend analysis",
      "Personalized career recommendations"
    ]
  }
];

const featureCategories = [
  {
    title: "Booking & Scheduling",
    icon: Calendar,
    features: [
      "Smart venue matching",
      "Automated scheduling",
      "Contract management",
      "Payment processing",
      "Performance tracking"
    ]
  },
  {
    title: "Portfolio & Media",
    icon: Globe,
    features: [
      "Multi-media galleries",
      "Professional showcases",
      "SEO optimization",
      "Social media integration",
      "Brand management"
    ]
  },
  {
    title: "Analytics & Insights",
    icon: BarChart3,
    features: [
      "Performance metrics",
      "Revenue tracking",
      "Audience analytics",
      "Career insights",
      "Market trends"
    ]
  },
  {
    title: "Collaboration",
    icon: Users,
    features: [
      "Team management",
      "Client communication",
      "Industry networking",
      "Mentorship connections",
      "Project collaboration"
    ]
  }
];

const artistSpecificFeatures = [
  {
    category: "Musicians",
    icon: Music,
    features: [
      "Audio portfolio management",
      "Band collaboration tools",
      "Performance booking",
      "Music industry networking",
      "Revenue sharing systems"
    ]
  },
  {
    category: "Visual Artists",
    icon: Palette,
    features: [
      "Gallery exhibition management",
      "Art sales tracking",
      "Commission management",
      "Visual portfolio showcase",
      "Art fair networking"
    ]
  },
  {
    category: "Writers",
    icon: BookOpen,
    features: [
      "Reading booking management",
      "Manuscript organization",
      "Publication tracking",
      "Literary networking",
      "Writing goal setting"
    ]
  },
  {
    category: "Performers",
    icon: Theater,
    features: [
      "Performance booking",
      "Cast management",
      "Audition tracking",
      "Demo reel creation",
      "Entertainment networking"
    ]
  }
];

const integrations = [
  { name: "Spotify", icon: Music, description: "Music streaming integration" },
  { name: "Instagram", icon: Camera, description: "Visual content sharing" },
  { name: "YouTube", icon: Mic, description: "Video portfolio showcase" },
  { name: "PayPal", icon: DollarSign, description: "Payment processing" },
  { name: "Google Calendar", icon: Calendar, description: "Schedule synchronization" },
  { name: "Mailchimp", icon: Users, description: "Email marketing" }
];

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Zap className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful <span className="text-yellow-300">Features</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Everything you need to manage your artistic career, from booking performances to tracking your success.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <ArrowRight className="w-5 h-5 mr-2" />
              Get Started Today
            </Button>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools is designed to empower artists across all disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature Categories Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Feature Categories
            </h2>
            <p className="text-xl text-gray-600">
              Organized tools for every aspect of your artistic career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="text-center mb-6">
                    <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                      <Icon className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Artist-Specific Features */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Specialized for Every Artist
            </h2>
            <p className="text-xl text-gray-600">
              Tailored features for different types of artists and creative professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {artistSpecificFeatures.map((artist, index) => {
              const Icon = artist.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-6">
                    <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{artist.category}</h3>
                  </div>
                  <ul className="space-y-3">
                    {artist.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Integrations Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600">
              Connect with the tools and platforms you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <div key={index} className="text-center">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200 mb-4">
                    <Icon className="w-8 h-8 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{integration.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{integration.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security & Reliability */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Secure & Reliable
            </h2>
            <p className="text-xl text-gray-600">
              Your data is protected with enterprise-grade security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-2xl w-fit mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">End-to-end encryption and secure data storage</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-2xl w-fit mx-auto mb-4">
                <Cloud className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud Reliability</h3>
              <p className="text-gray-600">99.9% uptime with automatic backups</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-2xl w-fit mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Ready</h3>
              <p className="text-gray-600">Access your platform from any device, anywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience All Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and discover how Alex AI can transform your artistic career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
