"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star, 
  Clock,
  MapPin,
  Music,
  Palette,
  BookOpen,
  Camera,
  Mic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { alexAI } from "@/lib/alex-ai";
import { ArtistProfile, DashboardMetrics, PerformanceStats, Booking, CareerInsights } from "@/types/alex-ai";

// Mock data fallback
const mockDashboardData = {
  artist: {
    name: "Sarah Chen",
    type: "Jazz Pianist",
    location: "New York, NY",
    avatar: "SC",
    experienceLevel: "Professional",
    rating: 4.8
  },
  metrics: {
    totalBookings: 47,
    successRate: 94,
    totalRevenue: 28450,
    averageRating: 4.8,
    audienceReach: 12500,
    activeOpportunities: 12
  },
  recentBookings: [
    {
      id: 1,
      venue: "The Blue Note",
      date: "2025-01-20",
      time: "8:00 PM",
      status: "confirmed",
      revenue: 1200,
      type: "music"
    },
    {
      id: 2,
      venue: "Art Gallery NYC",
      date: "2025-01-25",
      time: "6:00 PM",
      status: "pending",
      revenue: 800,
      type: "exhibition"
    },
    {
      id: 3,
      venue: "Poetry House",
      date: "2025-01-28",
      time: "7:30 PM",
      status: "confirmed",
      revenue: 600,
      type: "reading"
    }
  ],
  upcomingDeadlines: [
    {
      id: 1,
      task: "Submit application for Jazz Festival",
      deadline: "2025-01-16",
      priority: "high",
      type: "application"
    },
    {
      id: 2,
      task: "Confirm technical requirements for Blue Note",
      deadline: "2025-01-18",
      priority: "medium",
      type: "booking"
    },
    {
      id: 3,
      task: "Update portfolio with recent performances",
      deadline: "2025-01-22",
      priority: "low",
      type: "portfolio"
    }
  ],
  performanceStats: {
    thisMonth: {
      bookings: 8,
      revenue: 4200,
      performances: 6,
      newOpportunities: 15
    },
    lastMonth: {
      bookings: 6,
      revenue: 3800,
      performances: 5,
      newOpportunities: 12
    }
  }
};

const artistTypeIcons = {
  musician: Music,
  visual: Palette,
  writer: BookOpen,
  photographer: Camera,
  dj: Mic,
  performer: Star
};

export function Dashboard() {
  const [data, setData] = useState(mockDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [alexAIStatus, setAlexAIStatus] = useState<any>(null);
  const [careerInsights, setCareerInsights] = useState<CareerInsights | null>(null);

  useEffect(() => {
    // Initialize Alex AI and fetch dashboard data
    const initializeAndFetchData = async () => {
      setIsLoading(true);
      
      try {
        // Initialize Alex AI
        const status = await alexAI.initialize();
        setAlexAIStatus(status);
        
        // Fetch dashboard data using Alex AI
        const dashboardData = await alexAI.fetchDashboardData('artist_123');
        setData(dashboardData);
        
        // Fetch career insights
        const insights = await alexAI.getCareerInsights('artist_123', '30d');
        setCareerInsights(insights);
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to mock data
        setData(mockDashboardData);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAndFetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { artist, metrics, recentBookings, upcomingDeadlines, performanceStats } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {artist.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {artist.name}</h1>
              <p className="text-gray-600">{artist.type} • {artist.location}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{artist.rating}</span>
                <span className="text-sm text-gray-500">({metrics.totalBookings} bookings)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Booking Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.successRate}%</p>
                <p className="text-sm text-green-600">+3% from last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeOpportunities}</p>
                <p className="text-sm text-blue-600">3 new this week</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.averageRating}</p>
                <p className="text-sm text-yellow-600">Based on {metrics.totalBookings} reviews</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {artistTypeIcons[booking.type as keyof typeof artistTypeIcons] ? (
                          React.createElement(artistTypeIcons[booking.type as keyof typeof artistTypeIcons], {
                            className: "w-5 h-5 text-blue-600"
                          })
                        ) : (
                          <Music className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.venue}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${booking.revenue}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Deadlines</h2>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    <h3 className="font-medium text-gray-900 mb-1">{deadline.task}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Due: {new Date(deadline.deadline).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deadline.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : deadline.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {deadline.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Comparison */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance This Month</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bookings</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{performanceStats.thisMonth.bookings}</span>
                    <span className="text-sm text-green-600">
                      +{performanceStats.thisMonth.bookings - performanceStats.lastMonth.bookings}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Revenue</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">${performanceStats.thisMonth.revenue}</span>
                    <span className="text-sm text-green-600">
                      +${performanceStats.thisMonth.revenue - performanceStats.lastMonth.revenue}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Opportunities</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{performanceStats.thisMonth.newOpportunities}</span>
                    <span className="text-sm text-green-600">
                      +{performanceStats.thisMonth.newOpportunities - performanceStats.lastMonth.newOpportunities}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alex AI Status & Career Insights */}
        {(alexAIStatus || careerInsights) && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Alex AI Status */}
            {alexAIStatus && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Alex AI Status</h2>
                  <div className={`w-3 h-3 rounded-full ${alexAIStatus.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Crew Members:</span> {alexAIStatus.crewMembers.length} active
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Workflows:</span> {alexAIStatus.activeWorkflows.length} running
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Last Update:</span> {alexAIStatus.lastHealthCheck ? new Date(alexAIStatus.lastHealthCheck).toLocaleTimeString() : 'Never'}
                  </p>
                </div>
              </div>
            )}

            {/* Career Insights */}
            {careerInsights && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Career Insights</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Growth Trend:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      careerInsights.growthTrend === 'positive' ? 'bg-green-100 text-green-800' :
                      careerInsights.growthTrend === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {careerInsights.growthTrend}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Top Recommendations:</p>
                    <ul className="space-y-1">
                      {careerInsights.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="w-6 h-6" />
                <span>View Calendar</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="w-6 h-6" />
                <span>Browse Opportunities</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="w-6 h-6" />
                <span>Update Portfolio</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <DollarSign className="w-6 h-6" />
                <span>Track Finances</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
