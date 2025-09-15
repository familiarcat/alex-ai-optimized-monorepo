"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Star, Users, Calendar, TrendingUp } from "lucide-react";

export function Hero() {
  const stats = [
    { icon: Users, label: "Active Artists", value: "10,000+" },
    { icon: Calendar, label: "Shows Booked", value: "50,000+" },
    { icon: Star, label: "Success Rate", value: "98%" },
    { icon: TrendingUp, label: "Earnings Growth", value: "150%" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-blue-100/20 to-purple-100/20"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="block mb-2">YOUR ART</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                DESERVES BETTER
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                WE'RE HERE TO HELP
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A platform built by artists, for artists. Where your creativity is the priority, 
              not the algorithm. Where community matters more than competition. Where every artist 
              has the tools they need to thrive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 font-bold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => window.location.href = '/signup'}
              >
                Join Our Community
              </button>
              <button 
                className="border-2 border-gray-800 text-gray-800 hover:bg-gray-100 text-lg px-8 py-4 font-bold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => window.location.href = '/demo'}
              >
                <Play className="w-5 h-5 mr-2 inline" />
                See How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="text-sm text-gray-500">
              <p className="mb-2">Join 10,000+ artists who are thriving</p>
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span>Join our community</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="space-y-6">
                {/* Mock Dashboard */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Creative Hub
                  </h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <stat.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                          <p className="text-sm text-gray-600">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recent Activity</h4>
                  <div className="space-y-2">
                    {[
                      "The Blue Note wants your sound",
                      "Art Gallery NYC discovered your work",
                      "Jazz Festival payment received",
                      "Poetry Reading Series needs your voice"
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
