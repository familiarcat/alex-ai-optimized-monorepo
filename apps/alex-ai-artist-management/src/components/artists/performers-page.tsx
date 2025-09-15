"use client";

import React from "react";
import { 
  Theater, 
  Mic, 
  Users, 
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Globe,
  FileText,
  Award,
  CheckCircle,
  ArrowRight,
  Share2,
  Camera,
  Play,
  Music,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Theater,
    title: "Performance Booking & Scheduling",
    description: "Manage theater bookings, live performances, and entertainment events with professional tools.",
    benefits: [
      "Theater and venue booking management",
      "Performance scheduling and coordination",
      "Audition tracking and management",
      "Event promotion and marketing"
    ]
  },
  {
    icon: Users,
    title: "Cast & Crew Management",
    description: "Organize production teams, cast members, and crew for performances and shows.",
    benefits: [
      "Cast and crew coordination",
      "Rehearsal scheduling",
      "Production timeline management",
      "Team communication tools"
    ]
  },
  {
    icon: Camera,
    title: "Performance Portfolio & Reels",
    description: "Create compelling performance portfolios and demo reels to showcase your talent.",
    benefits: [
      "Video portfolio management",
      "Demo reel creation and editing",
      "Performance highlight reels",
      "Professional headshots and media"
    ]
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track your performance success, audience engagement, and career growth metrics.",
    benefits: [
      "Performance success tracking",
      "Audience engagement analytics",
      "Career milestone monitoring",
      "Industry networking insights"
    ]
  }
];

const performerTypes = [
  { name: "Actors", icon: Theater, description: "Stage, film, and television performers" },
  { name: "Dancers", icon: Users, description: "Ballet, contemporary, and street dancers" },
  { name: "Comedians", icon: Mic, description: "Stand-up, improv, and sketch comedians" },
  { name: "Circus Artists", icon: Zap, description: "Acrobats, jugglers, and circus performers" },
  { name: "Magicians", icon: Play, description: "Stage magicians and illusionists" },
  { name: "Variety Acts", icon: Music, description: "Multi-talented entertainment performers" }
];

const testimonials = [
  {
    name: "Jessica Martinez",
    role: "Theater Actor",
    quote: "Alex AI revolutionized how I manage my acting career. The audition tracking and performance booking features are incredible.",
    rating: 5,
    location: "Los Angeles, CA"
  },
  {
    name: "Marcus Thompson",
    role: "Stand-up Comedian",
    quote: "Managing my comedy tour and venue bookings used to be overwhelming. Now everything is organized and I can focus on performing.",
    rating: 5,
    location: "Chicago, IL"
  },
  {
    name: "Sofia Rodriguez",
    role: "Contemporary Dancer",
    quote: "The portfolio features helped me showcase my dance performances professionally. I've booked more gigs than ever before.",
    rating: 5,
    location: "Miami, FL"
  }
];

export function PerformersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Theater className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              For <span className="text-yellow-300">Performers</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Take center stage with tools designed for actors, dancers, comedians, and all live entertainment artists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <Theater className="w-5 h-5 mr-2" />
                Start Performing
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Camera className="w-5 h-5 mr-2" />
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Performer Types Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for All Performers
            </h2>
            <p className="text-xl text-gray-600">
              From actors to dancers, comedians to circus artists, we support performers across all entertainment disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {performerTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Icon className="w-8 h-8 text-orange-600" />
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
              Everything Performers Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From audition management to performance booking, our platform provides comprehensive tools for performers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Icon className="w-8 h-8 text-orange-600" />
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
              Trusted by Performers
            </h2>
            <p className="text-xl text-gray-600">
              See how Alex AI is helping performers manage their careers and showcase their talent
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
                  <div className="text-orange-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Center Stage?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of performers who are using Alex AI to manage their careers and showcase their talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
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
