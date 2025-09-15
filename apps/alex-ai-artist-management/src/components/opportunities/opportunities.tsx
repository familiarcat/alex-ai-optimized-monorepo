"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users,
  Star,
  Clock,
  Music,
  Palette,
  BookOpen,
  Camera,
  Mic,
  Theater,
  Scissors,
  Code,
  ChevronDown,
  Heart,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data simulating N8N workflow results
const mockOpportunities = [
  {
    id: 1,
    title: "Jazz Night at The Blue Note",
    venue: "The Blue Note",
    type: "music",
    date: "2025-02-15",
    time: "8:00 PM - 11:00 PM",
    location: "New York, NY",
    compensation: 1200,
    audienceSize: 200,
    compatibilityScore: 95,
    description: "Seeking a skilled jazz pianist for our weekly jazz night. Must have experience with standards and improvisation.",
    requirements: ["Jazz experience", "Own instrument", "Professional setup"],
    deadline: "2025-01-25",
    status: "open",
    isRecommended: true,
    venueRating: 4.8,
    travelDistance: "2 miles"
  },
  {
    id: 2,
    title: "Contemporary Art Exhibition Opening",
    venue: "Modern Art Gallery",
    type: "visual",
    date: "2025-02-20",
    time: "6:00 PM - 9:00 PM",
    location: "Brooklyn, NY",
    compensation: 800,
    audienceSize: 150,
    compatibilityScore: 88,
    description: "Gallery opening featuring contemporary artists. Looking for a visual artist to showcase recent work.",
    requirements: ["Portfolio submission", "Artist statement", "Availability for opening"],
    deadline: "2025-01-30",
    status: "open",
    isRecommended: true,
    venueRating: 4.6,
    travelDistance: "8 miles"
  },
  {
    id: 3,
    title: "Poetry Reading Series",
    venue: "Poetry House",
    type: "writer",
    date: "2025-02-25",
    time: "7:30 PM - 9:00 PM",
    location: "Manhattan, NY",
    compensation: 600,
    audienceSize: 75,
    compatibilityScore: 92,
    description: "Monthly poetry reading series featuring emerging and established poets.",
    requirements: ["Original work", "15-20 minute reading", "Q&A participation"],
    deadline: "2025-02-10",
    status: "open",
    isRecommended: false,
    venueRating: 4.7,
    travelDistance: "5 miles"
  },
  {
    id: 4,
    title: "Wedding Photography - Summer Wedding",
    venue: "Private Estate",
    type: "photographer",
    date: "2025-06-15",
    time: "10:00 AM - 6:00 PM",
    location: "Hamptons, NY",
    compensation: 2500,
    audienceSize: 120,
    compatibilityScore: 85,
    description: "Luxury wedding photography opportunity at a private estate in the Hamptons.",
    requirements: ["Portfolio review", "Full day availability", "High-end equipment"],
    deadline: "2025-03-01",
    status: "open",
    isRecommended: true,
    venueRating: 4.9,
    travelDistance: "85 miles"
  },
  {
    id: 5,
    title: "Club Night DJ Set",
    venue: "Electric Lounge",
    type: "dj",
    date: "2025-02-10",
    time: "10:00 PM - 2:00 AM",
    location: "Queens, NY",
    compensation: 900,
    audienceSize: 300,
    compatibilityScore: 78,
    description: "Electronic music DJ set for our weekly club night. House and techno preferred.",
    requirements: ["DJ experience", "Music library", "Mixing skills"],
    deadline: "2025-01-28",
    status: "open",
    isRecommended: false,
    venueRating: 4.4,
    travelDistance: "12 miles"
  },
  {
    id: 6,
    title: "Theater Performance - One Act Play",
    venue: "Off-Broadway Theater",
    type: "performer",
    date: "2025-03-05",
    time: "8:00 PM - 10:00 PM",
    location: "Manhattan, NY",
    compensation: 750,
    audienceSize: 180,
    compatibilityScore: 91,
    description: "Lead role in an original one-act play about contemporary relationships.",
    requirements: ["Audition required", "Memorization", "Rehearsal commitment"],
    deadline: "2025-02-15",
    status: "open",
    isRecommended: true,
    venueRating: 4.5,
    travelDistance: "3 miles"
  }
];

const artistTypeIcons = {
  music: Music,
  visual: Palette,
  writer: BookOpen,
  photographer: Camera,
  dj: Mic,
  performer: Theater,
  artisan: Scissors,
  digital: Code
};

const opportunityTypes = [
  { value: "all", label: "All Types", icon: Search },
  { value: "music", label: "Music", icon: Music },
  { value: "visual", label: "Visual Arts", icon: Palette },
  { value: "writer", label: "Writing", icon: BookOpen },
  { value: "photographer", label: "Photography", icon: Camera },
  { value: "dj", label: "DJ", icon: Mic },
  { value: "performer", label: "Performance", icon: Theater },
  { value: "artisan", label: "Artisan", icon: Scissors },
  { value: "digital", label: "Digital Arts", icon: Code }
];

export function Opportunities() {
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [filteredOpportunities, setFilteredOpportunities] = useState(mockOpportunities);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("compatibility");
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate N8N workflow data fetching
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setOpportunities(mockOpportunities);
      setIsLoading(false);
    };

    fetchOpportunities();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = opportunities;

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(opp => opp.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by recommended only
    if (showRecommendedOnly) {
      filtered = filtered.filter(opp => opp.isRecommended);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "compatibility":
          return b.compatibilityScore - a.compatibilityScore;
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "compensation":
          return b.compensation - a.compensation;
        case "venue_rating":
          return b.venueRating - a.venueRating;
        default:
          return 0;
      }
    });

    setFilteredOpportunities(filtered);
  }, [opportunities, searchTerm, selectedType, sortBy, showRecommendedOnly]);

  const handleApply = (opportunityId: number) => {
    // Simulate application submission via N8N workflow
    setOpportunities(prev => 
      prev.map(opp => 
        opp.id === opportunityId 
          ? { ...opp, status: "applied" }
          : opp
      )
    );
  };

  const toggleFavorite = (opportunityId: number) => {
    setOpportunities(prev => 
      prev.map(opp => 
        opp.id === opportunityId 
          ? { ...opp, isRecommended: !opp.isRecommended }
          : opp
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding opportunities for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Opportunities</h1>
          <p className="text-gray-600">Discover and apply to opportunities that match your artistic profile</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {opportunityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="compatibility">Sort by Compatibility</option>
                <option value="date">Sort by Date</option>
                <option value="compensation">Sort by Compensation</option>
                <option value="venue_rating">Sort by Venue Rating</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Recommended Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="recommended"
                checked={showRecommendedOnly}
                onChange={(e) => setShowRecommendedOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="recommended" className="ml-2 text-sm text-gray-700">
                Recommended only
              </label>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredOpportunities.length} of {opportunities.length} opportunities
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity) => {
            const TypeIcon = artistTypeIcons[opportunity.type as keyof typeof artistTypeIcons] || Music;
            
            return (
              <div key={opportunity.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TypeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                      <p className="text-gray-600">{opportunity.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {opportunity.isRecommended && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    <button
                      onClick={() => toggleFavorite(opportunity.id)}
                      className={`p-1 rounded-full ${
                        opportunity.isRecommended 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${opportunity.isRecommended ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Compatibility Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Compatibility Score</span>
                    <span className="text-sm font-bold text-blue-600">{opportunity.compatibilityScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${opportunity.compatibilityScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(opportunity.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{opportunity.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{opportunity.audienceSize} people</span>
                  </div>
                </div>

                {/* Compensation and Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-bold text-gray-900">${opportunity.compensation}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{opportunity.venueRating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{opportunity.description}</p>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-1">
                    {opportunity.requirements.map((req, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deadline and Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Deadline:</span> {new Date(opportunity.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('#', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApply(opportunity.id)}
                      disabled={opportunity.status === 'applied'}
                    >
                      {opportunity.status === 'applied' ? 'Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setShowRecommendedOnly(false);
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
