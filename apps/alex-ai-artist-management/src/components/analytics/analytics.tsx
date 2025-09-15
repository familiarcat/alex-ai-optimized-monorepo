"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users,
  Calendar,
  Star,
  Target,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock analytics data simulating N8N workflow results
const mockAnalyticsData = {
  overview: {
    totalRevenue: 28450,
    revenueGrowth: 15.2,
    totalBookings: 47,
    bookingGrowth: 8.5,
    averageRating: 4.8,
    ratingGrowth: 2.1,
    audienceReach: 12500,
    reachGrowth: 22.3
  },
  monthlyTrends: [
    { month: "Jan", revenue: 4200, bookings: 8, rating: 4.7 },
    { month: "Feb", revenue: 3800, bookings: 6, rating: 4.8 },
    { month: "Mar", revenue: 4500, bookings: 9, rating: 4.9 },
    { month: "Apr", revenue: 5200, bookings: 10, rating: 4.8 },
    { month: "May", revenue: 4800, bookings: 8, rating: 4.9 },
    { month: "Jun", revenue: 5940, bookings: 12, rating: 4.8 }
  ],
  venuePerformance: [
    { venue: "The Blue Note", bookings: 12, revenue: 14400, rating: 4.9 },
    { venue: "Art Gallery NYC", bookings: 8, revenue: 6400, rating: 4.7 },
    { venue: "Poetry House", bookings: 6, revenue: 3600, rating: 4.8 },
    { venue: "Jazz Club Downtown", bookings: 4, revenue: 3200, rating: 4.6 },
    { venue: "Community Center", bookings: 3, revenue: 900, rating: 4.5 }
  ],
  genreBreakdown: [
    { genre: "Jazz", percentage: 45, bookings: 21, revenue: 16800 },
    { genre: "Contemporary", percentage: 25, bookings: 12, revenue: 9600 },
    { genre: "Classical", percentage: 15, bookings: 7, revenue: 5600 },
    { genre: "Experimental", percentage: 10, bookings: 5, revenue: 4000 },
    { genre: "Other", percentage: 5, bookings: 2, revenue: 1600 }
  ],
  goals: [
    { id: 1, title: "Monthly Revenue Target", target: 5000, current: 4200, unit: "$", deadline: "2025-01-31" },
    { id: 2, title: "Booking Success Rate", target: 95, current: 94, unit: "%", deadline: "2025-02-28" },
    { id: 3, title: "New Venue Partnerships", target: 5, current: 3, unit: "venues", deadline: "2025-03-31" },
    { id: 4, title: "Average Rating", target: 4.9, current: 4.8, unit: "stars", deadline: "2025-04-30" }
  ]
};

export function Analytics() {
  const [data, setData] = useState(mockAnalyticsData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  // Simulate N8N workflow data fetching
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockAnalyticsData);
      setIsLoading(false);
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your performance data...</p>
        </div>
      </div>
    );
  }

  const { overview, monthlyTrends, venuePerformance, genreBreakdown, goals } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Analytics</h1>
            <p className="text-gray-600">Track your performance and gain insights into your artistic growth</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${overview.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{overview.revenueGrowth}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalBookings}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{overview.bookingGrowth}%</span>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{overview.averageRating}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{overview.ratingGrowth}%</span>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Audience Reach</p>
                <p className="text-2xl font-bold text-gray-900">{overview.audienceReach.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{overview.reachGrowth}%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Monthly Trends</h2>
              <BarChart3 className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{trend.month}</span>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">${trend.revenue}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{trend.bookings}</p>
                      <p className="text-xs text-gray-500">Bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{trend.rating}</p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genre Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Genre Breakdown</h2>
              <PieChart className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {genreBreakdown.map((genre, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: `hsl(${index * 72}, 70%, 50%)` 
                      }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{genre.genre}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-sm text-gray-900">{genre.percentage}%</span>
                    <span className="text-sm text-gray-500">{genre.bookings} bookings</span>
                    <span className="text-sm font-semibold text-gray-900">${genre.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Venue Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Venues</h2>
            <div className="space-y-4">
              {venuePerformance.map((venue, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{venue.venue}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{venue.rating}</span>
                      <span className="text-sm text-gray-500">• {venue.bookings} bookings</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${venue.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Goal Progress</h2>
              <Target className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                      <span className="text-sm text-gray-500">
                        {goal.current}{goal.unit} / {goal.target}{goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress >= 100 ? 'bg-green-600' : 
                          progress >= 75 ? 'bg-blue-600' : 
                          progress >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{Math.round(progress)}% complete</span>
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">AI-Powered Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Revenue Optimization</h3>
              <p className="text-sm text-blue-800">
                Your jazz performances at The Blue Note are generating 40% higher revenue than average. 
                Consider expanding jazz bookings to similar venues in the area.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Growth Opportunity</h3>
              <p className="text-sm text-green-800">
                Your booking success rate has improved by 8.5% this month. 
                This momentum suggests it's a good time to negotiate higher rates with repeat venues.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Audience Expansion</h3>
              <p className="text-sm text-yellow-800">
                Your audience reach has grown 22.3% this quarter. 
                Consider leveraging this growth for social media partnerships and brand collaborations.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Performance Trends</h3>
              <p className="text-sm text-purple-800">
                Your average rating has consistently been above 4.8. 
                This high rating makes you eligible for premium venue partnerships and festival bookings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
