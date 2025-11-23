/**
 * Core domain types for Vayada marketplace
 */

// User types
export type UserType = 'hotel' | 'creator' | 'admin'

export type UserStatus = 'pending' | 'verified' | 'rejected' | 'suspended'

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
  images: string[]
  accommodationType?: string // Hotel, Resort, Boutique Hotel, Lodge, Apartment, Villa
  collaborationType?: 'Kostenlos' | 'Bezahlt' // Free, Paid
  availability?: string[] // Array of months
  platforms?: string[] // Array of platform names: 'Instagram', 'TikTok', 'YouTube', 'Facebook'
  domain?: string // Website domain
  boardType?: 'All Inclusive' | 'Full Board' | 'Half Board' | 'Bed & Breakfast' | 'Room Only'
  numberOfNights?: number // Maximum number of nights for free collaboration
  targetAudience?: string[] // Target audience regions: 'Asia', 'Africa', 'Middle East', 'Australia', 'North America', 'South America'
  minFollowers?: number // Minimum number of followers required (e.g., 10000)
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

// HotelProfile represents the main hotel account that can have multiple listings
export interface HotelProfile {
  id: string
  userId: string // Reference to the user account
  name: string // Company/Chain name
  description?: string
  logo?: string
  listings: Hotel[] // All properties/listings owned by this hotel
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

// Creator types
export interface Creator {
  id: string
  name: string
  platforms: Platform[]
  audienceSize: number
  location: string
  portfolioLink?: string
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

// Collaboration types
export interface Collaboration {
  id: string
  hotelId: string
  creatorId: string
  status: CollaborationStatus
  hasRated?: boolean // Whether the hotel has rated this completed collaboration
  createdAt: Date
  updatedAt: Date
}

export type CollaborationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'

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
  message: string
}
