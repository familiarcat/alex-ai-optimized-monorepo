"use client";

import { Users, MessageCircle, Star, TrendingUp, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CommunityPage() {
  const communityStats = [
    { icon: Users, label: "Active Members", value: "10,000+" },
    { icon: MessageCircle, label: "Discussions", value: "50,000+" },
    { icon: Star, label: "Success Stories", value: "2,500+" },
    { icon: TrendingUp, label: "Growth Rate", value: "150%" }
  ];

  const featuredPosts = [
    {
      title: "How I Booked My First International Tour",
      author: "Sarah Chen",
      category: "Success Story",
      likes: 234,
      comments: 45,
      time: "2 hours ago"
    },
    {
      title: "Best Practices for Portfolio Organization",
      author: "Marcus Johnson",
      category: "Tips & Tricks",
      likes: 189,
      comments: 32,
      time: "5 hours ago"
    },
    {
      title: "New Feature Request: Calendar Integration",
      author: "Alex Team",
      category: "Product Update",
      likes: 156,
      comments: 28,
      time: "1 day ago"
    },
    {
      title: "Artist Meetup - NYC Next Week",
      author: "Community Team",
      category: "Events",
      likes: 98,
      comments: 67,
      time: "2 days ago"
    }
  ];

  const categories = [
    { name: "Success Stories", count: 1250, color: "bg-green-100 text-green-800" },
    { name: "Tips & Tricks", count: 890, color: "bg-blue-100 text-blue-800" },
    { name: "Feature Requests", count: 456, color: "bg-purple-100 text-purple-800" },
    { name: "Events", count: 234, color: "bg-orange-100 text-orange-800" },
    { name: "General Discussion", count: 1890, color: "bg-gray-100 text-gray-800" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Artist Community
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with thousands of artists worldwide. Share experiences, get advice, 
              and grow your career together with the Alex AI community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Join Community
              </Button>
              <Button size="lg" variant="outline">
                Browse Discussions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {communityStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Posts */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Discussions</h2>
            <div className="space-y-4">
              {featuredPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={post.category === "Success Story" ? "bg-green-100 text-green-800" :
                                      post.category === "Tips & Tricks" ? "bg-blue-100 text-blue-800" :
                                      post.category === "Product Update" ? "bg-purple-100 text-purple-800" :
                                      "bg-orange-100 text-orange-800"}>
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{post.time}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      by {post.author}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Discussion Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge className={category.color}>
                          {category.count}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Be respectful and supportive</li>
                  <li>• Share constructive feedback</li>
                  <li>• Help fellow artists succeed</li>
                  <li>• Keep discussions relevant</li>
                  <li>• No spam or self-promotion</li>
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Read Full Guidelines
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">NYC Artist Meetup</p>
                      <p className="text-sm text-gray-600">Next Friday, 6 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Webinar: Portfolio Tips</p>
                      <p className="text-sm text-gray-600">Next Tuesday, 2 PM EST</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Community AMA</p>
                      <p className="text-sm text-gray-600">Next Thursday, 7 PM EST</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Connect with artists, share your story, and grow your career with the support of thousands of fellow creators.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Join Now - It's Free
          </Button>
        </div>
      </div>
    </div>
  );
}
