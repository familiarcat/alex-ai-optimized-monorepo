"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, 
  Edit, 
  Eye, 
  Download,
  Share,
  Plus,
  Image,
  Music,
  FileText,
  Video,
  Trash2,
  Star,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Award,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data simulating N8N workflow results
const mockPortfolioData = {
  artist: {
    name: "Sarah Chen",
    type: "Jazz Pianist",
    bio: "Award-winning jazz pianist with over 10 years of experience performing at prestigious venues worldwide. Known for innovative interpretations of jazz standards and original compositions.",
    location: "New York, NY",
    experience: "Professional",
    rating: 4.8,
    totalPerformances: 150,
    yearsActive: 10,
    genres: ["Jazz", "Contemporary", "Classical"],
    instruments: ["Piano", "Keyboards", "Synthesizer"]
  },
  media: [
    {
      id: 1,
      type: "video",
      title: "Blue Note Performance - 'All the Things You Are'",
      description: "Live performance at The Blue Note, showcasing innovative jazz improvisation",
      url: "/videos/blue-note-performance.mp4",
      thumbnail: "/images/blue-note-thumb.jpg",
      duration: "4:32",
      views: 12500,
      likes: 340,
      dateAdded: "2025-01-10",
      tags: ["jazz", "live", "improvisation", "blue note"]
    },
    {
      id: 2,
      type: "audio",
      title: "Original Composition - 'Midnight in Manhattan'",
      description: "Original jazz composition featuring contemporary harmonies and rhythmic complexity",
      url: "/audio/midnight-manhattan.mp3",
      thumbnail: "/images/midnight-manhattan-cover.jpg",
      duration: "6:15",
      plays: 8500,
      likes: 280,
      dateAdded: "2025-01-05",
      tags: ["original", "composition", "contemporary", "jazz"]
    },
    {
      id: 3,
      type: "image",
      title: "Performance at Jazz Festival 2024",
      description: "Headlining performance at the International Jazz Festival",
      url: "/images/jazz-festival-2024.jpg",
      thumbnail: "/images/jazz-festival-2024-thumb.jpg",
      views: 3200,
      likes: 95,
      dateAdded: "2024-12-20",
      tags: ["festival", "performance", "headline", "international"]
    },
    {
      id: 4,
      type: "document",
      title: "Press Kit 2025",
      description: "Complete press kit with bio, photos, and performance history",
      url: "/documents/press-kit-2025.pdf",
      thumbnail: "/images/press-kit-thumb.jpg",
      downloads: 150,
      dateAdded: "2025-01-01",
      tags: ["press", "kit", "bio", "marketing"]
    }
  ],
  achievements: [
    {
      id: 1,
      title: "Best Jazz Performance 2024",
      organization: "New York Jazz Awards",
      date: "2024-12-15",
      description: "Recognized for outstanding contribution to contemporary jazz",
      icon: Award
    },
    {
      id: 2,
      title: "Featured Artist - Jazz Monthly",
      organization: "Jazz Monthly Magazine",
      date: "2024-11-01",
      description: "Cover story and interview in leading jazz publication",
      icon: Star
    },
    {
      id: 3,
      title: "Blue Note Residency",
      organization: "The Blue Note",
      date: "2024-10-01",
      description: "Monthly residency at world-renowned jazz venue",
      icon: Music
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "John Smith",
      role: "Venue Manager",
      venue: "The Blue Note",
      text: "Sarah's performances consistently sell out and receive standing ovations. Her technical mastery and emotional depth make her one of the most sought-after jazz artists today.",
      rating: 5,
      date: "2025-01-15"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      role: "Event Coordinator",
      venue: "Jazz Festival International",
      text: "Working with Sarah is always a pleasure. Her professionalism and artistic excellence make her a perfect fit for our prestigious festival lineup.",
      rating: 5,
      date: "2024-12-20"
    }
  ],
  stats: {
    portfolioViews: 12500,
    mediaDownloads: 2800,
    socialShares: 450,
    pressMentions: 25,
    awardNominations: 8,
    performances: 150
  }
};

const mediaTypeIcons = {
  video: Video,
  audio: Music,
  image: Image,
  document: FileText
};

export function Portfolio() {
  const [data, setData] = useState(mockPortfolioData);
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulate N8N workflow data fetching
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setData(mockPortfolioData);
      setIsLoading(false);
    };

    fetchPortfolioData();
  }, []);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/portfolio/${data.artist.name.toLowerCase().replace(' ', '-')}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const { artist, media, achievements, testimonials, stats } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
              <p className="text-gray-600">Showcase your work and build your professional artistic brand</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleShare}>
                {copiedLink ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copiedLink ? "Copied!" : "Share Portfolio"}
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            </div>
          </div>
        </div>

        {/* Artist Profile Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              SC
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{artist.name}</h2>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{artist.rating}</span>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-3">{artist.type} • {artist.location}</p>
              <p className="text-gray-700 mb-4">{artist.bio}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{artist.totalPerformances}</p>
                  <p className="text-sm text-gray-600">Performances</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{artist.yearsActive}</p>
                  <p className="text-sm text-gray-600">Years Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.portfolioViews.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Portfolio Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
                  <p className="text-sm text-gray-600">Awards</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {artist.genres.map((genre, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: Eye },
                { id: "media", label: "Media Gallery", icon: Video },
                { id: "achievements", label: "Achievements", icon: Award },
                { id: "testimonials", label: "Testimonials", icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">Portfolio Performance</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-900 mb-2">{stats.portfolioViews.toLocaleString()}</p>
                    <p className="text-blue-700">Total views this year</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Download className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">Media Downloads</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-900 mb-2">{stats.mediaDownloads.toLocaleString()}</p>
                    <p className="text-green-700">Downloads across all media</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Share className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-purple-900">Social Shares</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-900 mb-2">{stats.socialShares.toLocaleString()}</p>
                    <p className="text-purple-700">Shares across platforms</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                    <div className="space-y-3">
                      {achievements.slice(0, 3).map((achievement) => {
                        const Icon = achievement.icon;
                        return (
                          <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Icon className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                              <p className="text-sm text-gray-600">{achievement.organization}</p>
                              <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Testimonials</h3>
                    <div className="space-y-3">
                      {testimonials.slice(0, 2).map((testimonial) => (
                        <div key={testimonial.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
                          <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.venue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Media Gallery Tab */}
            {activeTab === "media" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {media.map((item) => {
                    const MediaIcon = mediaTypeIcons[item.type as keyof typeof mediaTypeIcons];
                    return (
                      <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <MediaIcon className="w-12 h-12 text-gray-500" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <span>{item.type === 'video' || item.type === 'audio' ? item.duration : `${item.views} views`}</span>
                            <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div key={achievement.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-yellow-100 rounded-lg">
                            <Icon className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                            <p className="text-blue-600 font-medium mb-2">{achievement.organization}</p>
                            <p className="text-gray-600 mb-3">{achievement.description}</p>
                            <p className="text-sm text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === "testimonials" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 mb-4 italic">"{testimonial.text}"</blockquote>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-gray-600">{testimonial.role} at {testimonial.venue}</p>
                        <p className="text-sm text-gray-500 mt-1">{new Date(testimonial.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
