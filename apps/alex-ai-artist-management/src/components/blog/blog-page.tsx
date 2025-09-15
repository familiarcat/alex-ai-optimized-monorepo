"use client";

import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BlogPage() {
  const featuredPost = {
    title: "The Future of Artist Management: How AI is Transforming the Industry",
    excerpt: "Discover how artificial intelligence is revolutionizing the way artists manage their careers, from booking shows to tracking finances and building communities.",
    author: "Alex AI Team",
    date: "January 14, 2025",
    readTime: "8 min read",
    category: "Industry Insights",
    image: "/images/blog/featured-post.jpg"
  };

  const blogPosts = [
    {
      title: "10 Tips for Building a Strong Artist Portfolio",
      excerpt: "Learn the essential elements of a compelling artist portfolio that attracts booking agents and venue managers.",
      author: "Sarah Martinez",
      date: "January 12, 2025",
      readTime: "5 min read",
      category: "Portfolio Tips",
      image: "/images/blog/portfolio-tips.jpg"
    },
    {
      title: "How to Price Your Performances: A Complete Guide",
      excerpt: "Master the art of pricing your performances with our comprehensive guide to setting fair rates that reflect your value.",
      author: "Michael Chen",
      date: "January 10, 2025",
      readTime: "6 min read",
      category: "Business",
      image: "/images/blog/pricing-guide.jpg"
    },
    {
      title: "Social Media Strategies for Musicians",
      excerpt: "Boost your online presence with proven social media strategies that help musicians connect with fans and book more shows.",
      author: "Emma Thompson",
      date: "January 8, 2025",
      readTime: "7 min read",
      category: "Marketing",
      image: "/images/blog/social-media.jpg"
    },
    {
      title: "The Artist's Guide to Tax Season",
      excerpt: "Everything you need to know about taxes as an artist, from deductions to quarterly payments and record keeping.",
      author: "David Rodriguez",
      date: "January 6, 2025",
      readTime: "9 min read",
      category: "Finance",
      image: "/images/blog/taxes.jpg"
    },
    {
      title: "Building Your Fan Base: From Zero to 10K Followers",
      excerpt: "A step-by-step guide to growing your fan base organically and building meaningful connections with your audience.",
      author: "Lisa Park",
      date: "January 4, 2025",
      readTime: "6 min read",
      category: "Growth",
      image: "/images/blog/fan-base.jpg"
    },
    {
      title: "Venue Booking: How to Get Your Foot in the Door",
      excerpt: "Learn the insider secrets to booking venues and building relationships with booking agents and venue managers.",
      author: "James Wilson",
      date: "January 2, 2025",
      readTime: "5 min read",
      category: "Booking",
      image: "/images/blog/venue-booking.jpg"
    }
  ];

  const categories = [
    { name: "All", count: 45 },
    { name: "Industry Insights", count: 12 },
    { name: "Portfolio Tips", count: 8 },
    { name: "Business", count: 10 },
    { name: "Marketing", count: 7 },
    { name: "Finance", count: 5 },
    { name: "Growth", count: 3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Artist Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Latest insights, tips, and strategies to help you grow your artistic career. 
              Learn from industry experts and fellow artists who've been where you are.
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {category.name} ({category.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <Badge className="bg-blue-100 text-blue-800 mb-4">Featured Post</Badge>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-medium">{featuredPost.category}</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-blue-100 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center space-x-4 text-sm text-blue-200">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              <div className="p-8">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-full rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                    <p className="text-sm">Featured Image</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <span>{post.readTime}</span>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  Read More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Posts
          </Button>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest artist tips and industry insights delivered to your inbox weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            />
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
