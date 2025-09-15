"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Phone,
  Mail,
  ExternalLink,
  Plus,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data simulating N8N workflow results
const mockBookings = [
  {
    id: 1,
    title: "Jazz Night Performance",
    venue: "The Blue Note",
    date: "2025-01-20",
    time: "8:00 PM - 11:00 PM",
    location: "New York, NY",
    status: "confirmed",
    compensation: 1200,
    audienceSize: 200,
    contactPerson: "John Smith",
    contactEmail: "john@bluenote.com",
    contactPhone: "(555) 123-4567",
    contractSigned: true,
    paymentStatus: "pending",
    setupRequirements: ["Grand piano", "Sound system", "Lighting"],
    specialRequests: ["Quiet backstage area", "Vegetarian catering"],
    notes: "Main act for the evening. Expected high turnout.",
    createdAt: "2025-01-10",
    lastUpdated: "2025-01-15"
  },
  {
    id: 2,
    title: "Art Gallery Opening",
    venue: "Modern Art Gallery",
    date: "2025-01-25",
    time: "6:00 PM - 9:00 PM",
    location: "Brooklyn, NY",
    status: "pending",
    compensation: 800,
    audienceSize: 150,
    contactPerson: "Sarah Johnson",
    contactEmail: "sarah@modernart.com",
    contactPhone: "(555) 987-6543",
    contractSigned: false,
    paymentStatus: "not_applicable",
    setupRequirements: ["Display easels", "Lighting", "Security"],
    specialRequests: ["Artist statement display", "Business cards"],
    notes: "Waiting for contract approval from gallery owner.",
    createdAt: "2025-01-12",
    lastUpdated: "2025-01-14"
  },
  {
    id: 3,
    title: "Poetry Reading",
    venue: "Poetry House",
    date: "2025-01-28",
    time: "7:30 PM - 9:00 PM",
    location: "Manhattan, NY",
    status: "confirmed",
    compensation: 600,
    audienceSize: 75,
    contactPerson: "Michael Chen",
    contactEmail: "michael@poetryhouse.org",
    contactPhone: "(555) 456-7890",
    contractSigned: true,
    paymentStatus: "paid",
    setupRequirements: ["Microphone", "Podium", "Seating for 75"],
    specialRequests: ["Books for sale table", "Water provided"],
    notes: "Featured reader for the evening. 15-20 minute reading.",
    createdAt: "2025-01-08",
    lastUpdated: "2025-01-16"
  },
  {
    id: 4,
    title: "Wedding Photography",
    venue: "Private Estate",
    date: "2025-02-14",
    time: "10:00 AM - 6:00 PM",
    location: "Hamptons, NY",
    status: "confirmed",
    compensation: 2500,
    audienceSize: 120,
    contactPerson: "Emily Davis",
    contactEmail: "emily@weddingplanner.com",
    contactPhone: "(555) 321-9876",
    contractSigned: true,
    paymentStatus: "partial",
    setupRequirements: ["Professional camera equipment", "Backup equipment", "Lighting"],
    specialRequests: ["Second photographer", "Photo booth setup"],
    notes: "High-end wedding. Full day coverage required.",
    createdAt: "2025-01-05",
    lastUpdated: "2025-01-18"
  },
  {
    id: 5,
    title: "Corporate Event DJ",
    venue: "Convention Center",
    date: "2025-02-05",
    time: "7:00 PM - 11:00 PM",
    location: "Queens, NY",
    status: "cancelled",
    compensation: 1500,
    audienceSize: 300,
    contactPerson: "Robert Wilson",
    contactEmail: "robert@corporateevents.com",
    contactPhone: "(555) 654-3210",
    contractSigned: true,
    paymentStatus: "cancelled",
    setupRequirements: ["DJ equipment", "Sound system", "Lighting"],
    specialRequests: ["Playlist consultation", "MC services"],
    notes: "Event cancelled due to venue issues. Full refund processed.",
    createdAt: "2025-01-03",
    lastUpdated: "2025-01-20"
  }
];

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle
  }
};

const paymentStatusConfig = {
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800"
  },
  partial: {
    label: "Partial",
    color: "bg-yellow-100 text-yellow-800"
  },
  pending: {
    label: "Pending",
    color: "bg-blue-100 text-blue-800"
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800"
  },
  not_applicable: {
    label: "N/A",
    color: "bg-gray-100 text-gray-800"
  }
};

export function Bookings() {
  const [bookings, setBookings] = useState(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate N8N workflow data fetching
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      setBookings(mockBookings);
      setIsLoading(false);
    };

    fetchBookings();
  }, []);

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  const handleStatusUpdate = (bookingId: number, newStatus: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
          : booking
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'pending')
    .reduce((sum, booking) => sum + booking.compensation, 0);

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
              <p className="text-gray-600">Manage your performance bookings and scheduling</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{confirmedBookings}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{pendingBookings}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button variant="outline" size="sm">
                Calendar View
              </Button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const statusInfo = statusConfig[booking.status as keyof typeof statusConfig];
            const paymentInfo = paymentStatusConfig[booking.paymentStatus as keyof typeof paymentStatusConfig];
            const StatusIcon = statusInfo.icon;

            return (
              <div key={booking.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{booking.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{booking.venue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${booking.compensation}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${paymentInfo.color}`}>
                      {paymentInfo.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Contact Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{booking.contactPerson}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{booking.contactEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{booking.contactPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Booking Details</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Contract Signed:</span>
                        <span className={booking.contractSigned ? "text-green-600" : "text-red-600"}>
                          {booking.contractSigned ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Audience Size:</span>
                        <span className="text-gray-900">{booking.audienceSize} people</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-gray-900">{new Date(booking.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements and Notes */}
                {(booking.setupRequirements.length > 0 || booking.notes) && (
                  <div className="mb-4">
                    {booking.setupRequirements.length > 0 && (
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Setup Requirements:</h4>
                        <div className="flex flex-wrap gap-1">
                          {booking.setupRequirements.map((req, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {booking.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      View Contract
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Venue Details
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
