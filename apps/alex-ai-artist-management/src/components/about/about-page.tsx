"use client";

import React from "react";
import { 
  Users, 
  Target, 
  Award, 
  Globe,
  Heart,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Artists Empowered", value: "50,000+" },
  { label: "Bookings Processed", value: "1M+" },
  { label: "Countries Served", value: "120+" },
  { label: "Venue Partnerships", value: "15,000+" }
];

const values = [
  {
    icon: Heart,
    title: "Artist-First",
    description: "Every feature is designed with the artist's needs and career growth in mind."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously push the boundaries of what's possible in artist management technology."
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making professional artist management tools accessible to creators worldwide."
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a supportive ecosystem where artists can connect and collaborate."
  }
];

const team = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Former musician turned tech entrepreneur, passionate about empowering artists with technology."
  },
  {
    name: "Sarah Johnson",
    role: "Head of Product",
    bio: "Product strategist with 10+ years experience in creative industry platforms."
  },
  {
    name: "Marcus Rodriguez",
    role: "Lead Engineer",
    bio: "Full-stack developer specializing in AI and machine learning applications."
  },
  {
    name: "Elena Kim",
    role: "Artist Relations",
    bio: "Former gallery curator helping bridge the gap between technology and artistry."
  }
];

const milestones = [
  {
    year: "2020",
    title: "Founded",
    description: "Alex AI was founded with a vision to revolutionize artist career management."
  },
  {
    year: "2021",
    title: "First 1,000 Artists",
    description: "Reached our first milestone of 1,000 artists using our platform."
  },
  {
    year: "2022",
    title: "AI Integration",
    description: "Launched our AI-powered booking and opportunity matching system."
  },
  {
    year: "2023",
    title: "Global Expansion",
    description: "Expanded to serve artists in over 50 countries worldwide."
  },
  {
    year: "2024",
    title: "50K Artists",
    description: "Celebrated reaching 50,000 artists across all creative disciplines."
  }
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-yellow-300">Alex AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Empowering artists worldwide with AI-powered tools and comprehensive career management solutions.
            </p>
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

      {/* Mission Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                At Alex AI, we believe that every artist deserves access to professional tools and opportunities 
                that can help them build successful, sustainable careers. Our mission is to democratize artist 
                management and make it accessible to creators at every stage of their journey.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Through innovative AI technology, comprehensive platform features, and a supportive community, 
                we're building the future of artist career management.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Join Our Mission
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700">
                To become the world's leading platform for artist career management, where every creative 
                professional can access the tools, opportunities, and community they need to thrive.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="p-4 bg-blue-100 rounded-2xl w-fit mx-auto mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind Alex AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to empower artists
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center relative z-10">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Become part of the growing community of artists who are transforming their careers with Alex AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
