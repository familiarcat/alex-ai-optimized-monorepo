/**
 * TypeScript types for Alex AI integration
 */

export interface AlexAIConfig {
  apiUrl: string;
  n8nApiKey: string;
  mcpServerUrl: string;
  vectorDbUrl: string;
  openaiApiKey: string;
  anthropicApiKey: string;
}

export interface AlexAIStatus {
  isConnected: boolean;
  lastHealthCheck: Date | null;
  crewMembers: CrewMember[];
  activeWorkflows: Workflow[];
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  isActive: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
}

export interface ArtistProfile {
  id: string;
  name: string;
  type: ArtistType;
  location: string;
  experienceLevel: ExperienceLevel;
  rating: number;
  avatar?: string;
  bio?: string;
  portfolio?: PortfolioItem[];
  preferences?: ArtistPreferences;
}

export type ArtistType = 
  | 'musician' 
  | 'visual' 
  | 'writer' 
  | 'photographer' 
  | 'dj' 
  | 'performer' 
  | 'artisan' 
  | 'digital';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'professional' | 'expert';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  category: string;
  createdAt: Date;
}

export interface ArtistPreferences {
  preferredVenues: string[];
  maxTravelDistance: number;
  minCompensation: number;
  availableDays: string[];
  genres: string[];
  audienceSize: {
    min: number;
    max: number;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  venue: string;
  type: ArtistType;
  date: string;
  time: string;
  location: string;
  compensation: number;
  audienceSize: number;
  compatibilityScore: number;
  description: string;
  requirements: string[];
  deadline: string;
  status: 'open' | 'applied' | 'closed' | 'expired';
  isRecommended: boolean;
  venueRating: number;
  travelDistance: string;
  contactInfo?: ContactInfo;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface Booking {
  id: string;
  opportunityId: string;
  artistId: string;
  venue: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  revenue: number;
  type: ArtistType;
  notes?: string;
  contractUrl?: string;
}

export interface DashboardMetrics {
  totalBookings: number;
  successRate: number;
  totalRevenue: number;
  averageRating: number;
  audienceReach: number;
  activeOpportunities: number;
}

export interface PerformanceStats {
  thisMonth: {
    bookings: number;
    revenue: number;
    performances: number;
    newOpportunities: number;
  };
  lastMonth: {
    bookings: number;
    revenue: number;
    performances: number;
    newOpportunities: number;
  };
}

export interface CareerInsights {
  growthTrend: 'positive' | 'negative' | 'stable';
  recommendations: string[];
  marketAnalysis: {
    demandLevel: 'low' | 'medium' | 'high';
    competitionLevel: 'low' | 'medium' | 'high';
    averageRates: number;
    topVenues: string[];
  };
}

export interface ApplicationData {
  coverLetter: string;
  portfolioItems: string[];
  availability: string[];
  specialRequirements?: string;
  expectedCompensation?: number;
}

export interface N8NWebhookResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  workflowId: string;
  executionTime: number;
}

export interface RAGQuery {
  query: string;
  context: string;
  filters?: Record<string, any>;
  limit?: number;
}

export interface RAGResponse {
  results: any[];
  confidence: number;
  sources: string[];
  query: string;
}
