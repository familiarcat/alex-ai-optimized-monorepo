import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Star, Users, Calendar, TrendingUp } from "lucide-react";

export function Hero() {
  const stats = [
    { icon: Users, label: "Active Artists", value: "10,000+" },
    { icon: Calendar, label: "Bookings Made", value: "50,000+" },
    { icon: Star, label: "Success Rate", value: "98%" },
    { icon: TrendingUp, label: "Revenue Growth", value: "150%" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Manage Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Artistic Career
              </span>
              with AI Power
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              The comprehensive platform for artists across all disciplines. 
              Book shows, manage portfolios, track finances, and grow your career 
              with AI-powered insights and automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/signup">
                  Start Your Journey
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/demo">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="text-sm text-gray-500">
              <p className="mb-2">Trusted by artists worldwide</p>
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
                <span>Join 10,000+ artists</span>
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
                    Artist Dashboard
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
                      "New booking request from The Blue Note",
                      "Portfolio view from Art Gallery NYC",
                      "Payment received for Jazz Festival",
                      "New opportunity: Poetry Reading Series"
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
