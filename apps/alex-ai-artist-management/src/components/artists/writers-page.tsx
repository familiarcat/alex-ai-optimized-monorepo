"use client";

import React from "react";
import { 
  BookOpen, 
  PenTool, 
  Type, 
  FileText,
  Calendar,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Globe,
  Award,
  CheckCircle,
  ArrowRight,
  Share2,
  Mic,
  Edit3,
  BookMarked
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Reading & Book Tour Management",
    description: "Organize book readings, poetry slams, and literary events with professional booking tools.",
    benefits: [
      "Reading venue booking and scheduling",
      "Book tour planning and logistics",
      "Event promotion and marketing",
      "Audience engagement tracking"
    ]
  },
  {
    icon: FileText,
    title: "Writing Portfolio & Manuscript Management",
    description: "Showcase your writing portfolio, manage manuscripts, and track publication submissions.",
    benefits: [
      "Writing sample organization",
      "Manuscript version control",
      "Publication submission tracking",
      "Writing goal setting and progress"
    ]
  },
  {
    icon: Users,
    title: "Literary Community & Networking",
    description: "Connect with other writers, publishers, and literary industry professionals.",
    benefits: [
      "Writer networking and collaboration",
      "Publisher and agent connections",
      "Writing group management",
      "Literary event networking"
    ]
  },
  {
    icon: TrendingUp,
    title: "Writing Career Analytics",
    description: "Track your writing progress, publication success, and audience engagement metrics.",
    benefits: [
      "Writing productivity tracking",
      "Publication success metrics",
      "Reading audience analytics",
      "Career milestone tracking"
    ]
  }
];

const writerTypes = [
  { name: "Novelists", icon: BookOpen, description: "Fiction and non-fiction book authors" },
  { name: "Poets", icon: PenTool, description: "Poetry and spoken word artists" },
  { name: "Journalists", icon: Type, description: "News, feature, and investigative writers" },
  { name: "Screenwriters", icon: FileText, description: "Film, TV, and media script writers" },
  { name: "Bloggers", icon: Edit3, description: "Content creators and digital writers" },
  { name: "Academic Writers", icon: BookMarked, description: "Research and scholarly writers" }
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Poet & Author",
    quote: "Alex AI helped me organize my first poetry tour. The venue matching was perfect, and I connected with amazing literary communities.",
    rating: 5,
    location: "Portland, OR"
  },
  {
    name: "Michael Torres",
    role: "Novelist",
    quote: "Managing my book promotion and reading schedule used to be chaotic. Now everything is organized and I can focus on writing.",
    rating: 5,
    location: "Brooklyn, NY"
  },
  {
    name: "Dr. Lisa Chen",
    role: "Academic Writer",
    quote: "The writing portfolio feature helped me showcase my research and connect with academic publishers. Game-changer for my career.",
    rating: 5,
    location: "Boston, MA"
  }
];

export function WritersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <BookOpen className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              For <span className="text-yellow-300">Writers</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Manage your writing career, organize readings, and connect with the literary community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <PenTool className="w-5 h-5 mr-2" />
                Start Writing Journey
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <BookOpen className="w-5 h-5 mr-2" />
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Writer Types Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for All Writers
            </h2>
            <p className="text-xl text-gray-600">
              From poets to novelists, journalists to screenwriters, we support writers across all genres and formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {writerTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{type.name}</h3>
                  </div>
                  <p className="text-gray-600">{type.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Writers Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From manuscript management to reading bookings, our platform provides comprehensive tools for writers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Icon className="w-8 h-8 text-green-600" />
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
              Trusted by Writers
            </h2>
            <p className="text-xl text-gray-600">
              See how Alex AI is helping writers manage their careers and connect with their audience
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
                  <div className="text-green-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Elevate Your Writing Career?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of writers who are using Alex AI to manage their careers and reach new audiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
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
