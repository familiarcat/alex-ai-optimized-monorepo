"use client";

import { MapPin, Clock, Users, Heart, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CareersPage() {
  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      location: "Remote",
      type: "Full-time",
      department: "Engineering",
      description: "Join our engineering team to build the next generation of artist management tools."
    },
    {
      title: "Product Designer",
      location: "San Francisco, CA",
      type: "Full-time",
      department: "Design",
      description: "Help create beautiful, intuitive experiences for artists worldwide."
    },
    {
      title: "Community Manager",
      location: "Remote",
      type: "Full-time",
      department: "Community",
      description: "Build and nurture our growing community of artists and creators."
    },
    {
      title: "Sales Engineer",
      location: "New York, NY",
      type: "Full-time",
      department: "Sales",
      description: "Help artists and venues discover the power of Alex AI."
    },
    {
      title: "Marketing Specialist",
      location: "Remote",
      type: "Full-time",
      department: "Marketing",
      description: "Drive growth and brand awareness in the artist community."
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance for you and your family."
    },
    {
      icon: Zap,
      title: "Flexible Work",
      description: "Work from anywhere with flexible hours and unlimited PTO."
    },
    {
      icon: Users,
      title: "Team Events",
      description: "Regular team building events and company retreats."
    },
    {
      icon: Globe,
      title: "Learning Budget",
      description: "Annual budget for conferences, courses, and professional development."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Help us build the future of artist management. We're looking for passionate, 
              creative individuals who want to make a difference in the lives of artists worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline">
                Learn About Our Culture
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Work at Alex AI?
          </h2>
          <p className="text-gray-600">
            We're building something meaningful for the global artist community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-gray-600">
              Join our mission to empower artists worldwide
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {position.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {position.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{position.type}</span>
                        </div>
                        <Badge variant="outline">{position.department}</Badge>
                      </div>
                    </div>
                    <Button>
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Company Culture */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Culture
          </h2>
          <p className="text-gray-600">
            We believe in the power of creativity and the importance of supporting artists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Mission-Driven
            </h3>
            <p className="text-gray-600">
              Every day, we work to make the lives of artists easier and more successful. 
              Our mission drives everything we do.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Collaborative
            </h3>
            <p className="text-gray-600">
              We believe the best ideas come from diverse perspectives working together 
              towards a common goal.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Innovative
            </h3>
            <p className="text-gray-600">
              We're constantly pushing the boundaries of what's possible in artist 
              management and career development.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't See Your Role?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We're always looking for talented individuals who share our passion for supporting artists. 
            Send us your resume and let's talk!
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Send Us Your Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
