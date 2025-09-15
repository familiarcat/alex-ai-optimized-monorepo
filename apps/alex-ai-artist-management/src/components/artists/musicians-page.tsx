"use client";

import React from "react";
import { 
  Music, 
  Mic, 
  Headphones, 
  Volume2,
  Calendar,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Globe,
  FileText,
  Award,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Music,
    title: "Performance Booking Management",
    description: "Streamline venue bookings, contract management, and performance scheduling with our intelligent booking system.",
    benefits: [
      "Automated venue matching based on your genre and audience",
      "Contract generation and digital signing",
      "Performance calendar with conflict detection",
      "Payment tracking and invoicing"
    ]
  },
  {
    icon: Mic,
    title: "Audio Portfolio & Demo Management",
    description: "Showcase your music with professional audio portfolios, demo reels, and streaming integrations.",
    benefits: [
      "High-quality audio streaming and downloads",
      "Demo reel creation and sharing",
      "Streaming platform integration",
      "Audio analytics and listener insights"
    ]
  },
  {
    icon: Users,
    title: "Band & Collaboration Management",
    description: "Manage band members, collaborators, and musical partnerships with dedicated tools for group projects.",
    benefits: [
      "Band member management and scheduling",
      "Revenue sharing and split payments",
      "Collaboration project tracking",
      "Group communication and file sharing"
    ]
  },
  {
    icon: TrendingUp,
    title: "Music Industry Analytics",
    description: "Track your performance metrics, audience growth, and career progression with detailed analytics.",
    benefits: [
      "Performance success rate tracking",
      "Audience demographic analysis",
      "Revenue trend monitoring",
      "Industry benchmark comparisons"
    ]
  }
];

const testimonials = [
  {
    name: "Marcus Johnson",
    role: "Jazz Saxophonist",
    quote: "Alex AI has transformed how I manage my bookings. The venue matching is incredibly accurate, and I've increased my performance opportunities by 40%.",
    rating: 5,
    location: "New York, NY"
  },
  {
    name: "Sarah & The Echoes",
    role: "Indie Rock Band",
    quote: "Managing our band's schedule, contracts, and payments used to be a nightmare. Now it's all automated and organized in one place.",
    rating: 5,
    location: "Los Angeles, CA"
  },
  {
    name: "David Chen",
    role: "Classical Pianist",
    quote: "The audio portfolio feature helped me land my first major venue booking. The professional presentation made all the difference.",
    rating: 5,
    location: "Chicago, IL"
  }
];

const pricing = [
  {
    name: "Solo Artist",
    price: "$29",
    period: "/month",
    description: "Perfect for individual musicians and solo performers",
    features: [
      "Up to 50 bookings per month",
      "Audio portfolio with 10 tracks",
      "Basic analytics and reporting",
      "Email support",
      "Contract templates",
      "Payment processing"
    ],
    popular: false
  },
  {
    name: "Band Pro",
    price: "$79",
    period: "/month",
    description: "Ideal for bands and musical groups",
    features: [
      "Up to 200 bookings per month",
      "Unlimited audio portfolio",
      "Advanced analytics and insights",
      "Band member management",
      "Revenue sharing tools",
      "Priority support",
      "Social media integration"
    ],
    popular: true
  },
  {
    name: "Music Label",
    price: "$199",
    period: "/month",
    description: "For music labels and artist management companies",
    features: [
      "Unlimited bookings",
      "Multi-artist management",
      "Custom branding",
      "Advanced reporting suite",
      "API access",
      "Dedicated account manager",
      "White-label options"
    ],
    popular: false
  }
];

const stats = [
  { label: "Musicians Using Alex AI", value: "15,000+" },
  { label: "Bookings Processed", value: "250,000+" },
  { label: "Average Revenue Increase", value: "35%" },
  { label: "Venue Partnerships", value: "5,000+" }
];

export function MusiciansPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Music className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Built for <span className="text-yellow-300">Musicians</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Everything you need to manage your musical career, from booking performances to tracking your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Play className="w-5 h-5 mr-2" />
                Start Your Musical Journey
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Download className="w-5 h-5 mr-2" />
                Download Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Musicians Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From solo artists to full bands, our platform provides the tools you need to succeed in today's music industry.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
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

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Musicians Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See how Alex AI is helping musicians achieve their career goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-blue-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Flexible pricing designed for musicians at every stage of their career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-sm border-2 transition-all hover:shadow-lg ${
                plan.popular ? 'border-blue-500 relative' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Elevate Your Musical Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of musicians who are already using Alex AI to manage their careers and grow their success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Share2 className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
