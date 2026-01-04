/**
 * Core domain types for Vayada marketplace
 */

// User types
export type UserType = 'hotel' | 'creator' | 'admin'

export type UserStatus = 'pending' | 'verified' | 'rejected' | 'suspended'

// Profile Status types
export interface CreatorProfileStatus {
  profile_complete: boolean
  missing_fields: string[]
  missing_platforms: boolean
  completion_steps: string[]
}

export interface HotelProfileStatus {
  profile_complete: boolean
  missing_fields: string[]
  has_defaults: {
    location: boolean
  }
  missing_listings: boolean
  completion_steps: string[]
}

// Navigation
export interface NavigationLink {
  label: string
  href: string
  external?: boolean
}

// UI Components
import type { ComponentType } from 'react'

export interface Feature {
  icon: ComponentType<{ className?: string }>
  iconClassName?: string
  title: string
  description: string
}

export interface Step {
  number: number
  title: string
  description: string
}

export interface Advantage {
  icon: ComponentType<{ className?: string }>
  iconClassName?: string
  title: string
  description: string
}

export interface SectionContent {
  title: string
  subtitle: string
  advantages: Advantage[]
  steps: Step[]
  ctaText: string
  ctaHref: string
}

// Hotel types
// Hotel represents a single property/listing
export interface Hotel {
  id: string
  hotelProfileId: string // Reference to the hotel profile that owns this listing
  name: string
  location: string
  description: string
  picture?: string
  images: string[]
  accommodationType?: string // Hotel, Boutiques Hotel, City Hotel, Luxury Hotel, Apartment, Villa, Lodge
  collaborationType?: 'Kostenlos' | 'Bezahlt' // Free, Paid
  availability?: string[] // Array of months
  platforms?: string[] // Array of platform names: 'Instagram', 'TikTok', 'YouTube', 'Facebook'
  domain?: string // Website domain
  boardType?: 'All Inclusive' | 'Full Board' | 'Half Board' | 'Bed & Breakfast' | 'Room Only'
  numberOfNights?: number // Maximum number of nights for free collaboration
  targetAudience?: string[] // Target audience regions: 'Asia', 'Africa', 'Middle East', 'Australia', 'North America', 'South America'
  minFollowers?: number // Minimum number of followers required (e.g., 10000)
  targetAgeMin?: number // Minimum target age
  targetAgeMax?: number // Maximum target age
  socialLinks?: {
    instagram?: string
    tiktok?: string
    facebook?: string
    youtube?: string
  }
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

// Collaboration Offering types
export interface CollaborationOffering {
  id: string
  listing_id: string
  collaboration_type: 'Free Stay' | 'Paid' | 'Discount'
  availability_months: string[]
  platforms: string[]
  free_stay_min_nights?: number | null
  free_stay_max_nights?: number | null
  paid_max_amount?: number | null
  discount_percentage?: number | null
  created_at: string
  updated_at: string
}

// Creator Requirements types
export interface CreatorRequirements {
  id: string
  listing_id: string
  platforms: string[]
  min_followers?: number | null
  target_countries: string[]
  target_age_min?: number | null
  target_age_max?: number | null
  created_at: string
  updated_at: string
}

// Hotel Listing with full details
export interface HotelListing {
  id: string
  hotel_profile_id: string
  name: string
  location: string
  description: string
  accommodation_type?: string | null
  images: string[]
  status: 'pending' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
  collaboration_offerings: CollaborationOffering[]
  creator_requirements: CreatorRequirements
}

// HotelProfile represents the main hotel account that can have multiple listings
export interface HotelProfile {
  id: string
  user_id: string // Reference to the user account
  name: string // Company/Chain name
  category: string
  location: string
  picture?: string | null
  website?: string | null
  about?: string | null
  email: string
  phone?: string | null
  status: UserStatus
  created_at: string
  updated_at: string
  listings: HotelListing[] // All properties/listings owned by this hotel
}

// Creator types
export interface Creator {
  id: string
  email: string
  name: string
  platforms: Platform[]
  audienceSize: number
  avgEngagementRate?: number
  location: string
  portfolioLink?: string
  shortDescription?: string
  phone?: string | null
  profilePicture?: string | null
  rating?: CreatorRating
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreatorRating {
  averageRating: number // 1-5
  totalReviews: number
  reviews?: CollaborationReview[]
}

export interface CollaborationReview {
  id: string
  hotelId: string
  hotelName: string
  rating: number // 1-5
  comment?: string
  createdAt: Date
}

export interface PlatformCountry {
  country: string
  percentage: number
}

export interface PlatformAgeGroup {
  ageRange: string
  percentage: number
}

export interface PlatformGenderSplit {
  male: number
  female: number
  other?: number
}

export interface Platform {
  name: string
  handle: string
  followers: number
  engagementRate: number
  topCountries?: PlatformCountry[]
  topAgeGroups?: PlatformAgeGroup[]
  genderSplit?: PlatformGenderSplit
}

export interface PlatformDeliverable {
  id: string
  type: string
  quantity: number
  completed?: boolean
  completed_at?: string | null
}

export interface PlatformDeliverablesItem {
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'Content Package' | 'Custom' | string
  deliverables: PlatformDeliverable[]
}

// Collaboration types
export interface Collaboration {
  id: string
  hotelId: string
  creatorId: string
  status: CollaborationStatus
  initiator_type: UserType
  is_initiator: boolean
  hasRated?: boolean // Whether the hotel has rated this completed collaboration
  whyGreatFit?: string
  platformDeliverables?: PlatformDeliverablesItem[]
  travelDateFrom?: string | null
  travelDateTo?: string | null
  preferredDateFrom?: string | null
  preferredDateTo?: string | null
  hotelAgreedAt?: Date | null
  creatorAgreedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export type CollaborationStatus = 'pending' | 'negotiating' | 'accepted' | 'rejected' | 'completed' | 'cancelled'

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Auth types
export interface RegisterRequest {
  email: string
  password: string
  type: 'creator' | 'hotel'
  name?: string
}

export interface RegisterResponse {
  id: string
  email: string
  name: string
  type: 'creator' | 'hotel'
  status: UserStatus
  access_token: string
  token_type: string
  expires_in: number
  message: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  id: string
  email: string
  name: string
  type: 'creator' | 'hotel'
  status: UserStatus
  access_token: string
  token_type: string
  expires_in: number
  message: string
}
