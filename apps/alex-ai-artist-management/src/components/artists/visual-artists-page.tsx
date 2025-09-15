"use client";

import React from "react";
import { 
  Palette, 
  Camera, 
  Brush, 
  Image,
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
  Share2,
  Scissors,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Palette,
    title: "Gallery Exhibition Management",
    description: "Organize and manage your art exhibitions, gallery shows, and public displays with professional tools.",
    benefits: [
      "Exhibition planning and scheduling",
      "Gallery partnership management",
      "Artwork inventory tracking",
      "Exhibition promotion and marketing"
    ]
  },
  {
    icon: Image,
    title: "Digital Portfolio & Showcase",
    description: "Create stunning visual portfolios that showcase your artwork in the best possible light.",
    benefits: [
      "High-resolution image galleries",
      "Virtual exhibition spaces",
      "Artwork categorization and tagging",
      "Professional portfolio templates"
    ]
  },
  {
    icon: DollarSign,
    title: "Art Sales & Commission Tracking",
    description: "Manage art sales, commissions, and pricing with integrated tools for visual artists.",
    benefits: [
      "Sales tracking and analytics",
      "Commission management",
      "Pricing optimization tools",
      "Client relationship management"
    ]
  },
  {
    icon: Users,
    title: "Artist Network & Collaboration",
    description: "Connect with other visual artists, galleries, and art industry professionals.",
    benefits: [
      "Artist collaboration tools",
      "Gallery networking",
      "Art fair and event connections",
      "Mentorship opportunities"
    ]
  }
];

const artistTypes = [
  { name: "Painters", icon: Brush, description: "Oil, acrylic, watercolor, and mixed media artists" },
  { name: "Digital Artists", icon: Code, description: "Digital illustration, concept art, and digital media creators" },
  { name: "Sculptors", icon: Scissors, description: "3D artists, sculptors, and installation artists" },
  { name: "Photographers", icon: Camera, description: "Fine art, commercial, and artistic photographers" },
  { name: "Mixed Media", icon: Palette, description: "Artists working across multiple mediums and techniques" },
  { name: "Printmakers", icon: Image, description: "Traditional and contemporary printmaking artists" }
];

const testimonials = [
  {
    name: "Elena Rodriguez",
    role: "Contemporary Painter",
    quote: "Alex AI helped me organize my first solo exhibition. The gallery management tools made everything seamless, and I sold 80% of my pieces.",
    rating: 5,
    location: "San Francisco, CA"
  },
  {
    name: "James Chen",
    role: "Digital Artist",
    quote: "The portfolio features are incredible. My client base has grown by 60% since I started using Alex AI to showcase my work professionally.",
    rating: 5,
    location: "New York, NY"
  },
  {
    name: "Maria Santos",
    role: "Sculptor",
    quote: "Managing commissions and tracking sales used to be overwhelming. Now everything is organized and I can focus on creating art.",
    rating: 5,
    location: "Austin, TX"
  }
];

export function VisualArtistsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Palette className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              For <span className="text-yellow-300">Visual Artists</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Showcase your art, manage exhibitions, and grow your visual art career with tools designed specifically for artists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Palette className="w-5 h-5 mr-2" />
                Start Your Art Journey
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Image className="w-5 h-5 mr-2" />
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Types Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for All Visual Artists
            </h2>
            <p className="text-xl text-gray-600">
              Whether you work with traditional or digital mediums, we have tools tailored to your artistic practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artistTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Icon className="w-8 h-8 text-purple-600" />
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
              Everything Visual Artists Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From portfolio creation to exhibition management, our platform provides comprehensive tools for visual artists.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Icon className="w-8 h-8 text-purple-600" />
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
              Trusted by Visual Artists
            </h2>
            <p className="text-xl text-gray-600">
              See how Alex AI is helping visual artists showcase their work and grow their careers
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
                  <div className="text-purple-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Showcase Your Art?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of visual artists who are using Alex AI to manage their careers and reach new audiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
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
