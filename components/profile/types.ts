import type {
  CreatorRating,
  CollaborationReview,
  PlatformCountry,
  PlatformAgeGroup,
  PlatformGenderSplit,
  CreatorType
} from '@/lib/types'

// Re-export for convenience
export type { PlatformCountry, PlatformAgeGroup, PlatformGenderSplit }

// Profile page specific types
export type UserType = 'hotel' | 'creator'
export type CreatorTab = 'overview' | 'platforms' | 'reviews'
export type HotelTab = 'overview' | 'listings'

// Platform with optional id (for profile management)
export interface ProfilePlatform {
  id?: string
  name: string
  handle: string
  followers: number
  engagementRate: number
  topCountries?: PlatformCountry[]
  topAgeGroups?: PlatformAgeGroup[]
  genderSplit?: PlatformGenderSplit
}

// API response types that may have snake_case or camelCase fields
export interface ApiAgeGroup {
  ageRange?: string | null
  age_range?: string | null
  percentage?: number
}

export interface ApiPlatformResponse {
  id?: string
  name: string
  handle?: string
  followers?: number
  engagementRate?: number
  engagement_rate?: number
  topCountries?: PlatformCountry[]
  top_countries?: PlatformCountry[]
  topAgeGroups?: ApiAgeGroup[]
  top_age_groups?: ApiAgeGroup[]
  genderSplit?: PlatformGenderSplit | string
  gender_split?: PlatformGenderSplit | string
}

export interface ApiRatingResponse {
  averageRating?: number
  average_rating?: number
  totalReviews?: number
  total_reviews?: number
  reviews?: CollaborationReview[]
}

export interface ApiCreatorResponse {
  id?: string
  name?: string
  email?: string
  phone?: string | null
  location?: string
  status?: 'verified' | 'pending' | 'rejected'
  profilePicture?: string
  profile_picture?: string
  shortDescription?: string
  short_description?: string
  portfolioLink?: string
  portfolio_link?: string
  creatorType?: CreatorType
  creator_type?: CreatorType
  platforms?: ApiPlatformResponse[]
  rating?: ApiRatingResponse
}

// Update payload for creator profile (uses snake_case for backend compatibility)
export interface CreatorUpdatePayload {
  name?: string
  location?: string
  short_description?: string
  portfolio_link?: string
  phone?: string
  profilePicture?: string
  audience_size?: number
  creator_type?: CreatorType
  platforms?: Array<{
    name: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook'
    handle: string
    followers: number
    engagement_rate: number
    top_countries?: Array<{ country: string; percentage: number }>
    topAgeGroups?: Array<{ ageRange: string; percentage: number }>
    gender_split?: { male: number; female: number }
  }>
}

// Creator profile for display
export interface CreatorProfile {
  id: string
  name: string
  profilePicture?: string
  shortDescription: string
  location: string
  status: 'verified' | 'pending' | 'rejected'
  creatorType: CreatorType
  rating?: CreatorRating
  platforms: ProfilePlatform[]
  portfolioLink?: string
  email: string
  phone?: string
}

// Hotel listing for profile management
export interface ProfileHotelListing {
  id: string
  name: string
  location: string
  description: string
  images: string[]
  accommodationType?: string
  collaborationTypes: ('Free Stay' | 'Paid' | 'Discount')[]
  availability: string[]
  platforms: string[]
  freeStayMinNights?: number
  freeStayMaxNights?: number
  paidMaxAmount?: number
  discountPercentage?: number
  lookingForPlatforms: string[]
  lookingForMinFollowers?: number
  targetGroupCountries: string[]
  targetGroupAgeMin?: number
  targetGroupAgeMax?: number
  targetGroupAgeGroups?: string[]
  lookingForCreatorTypes?: CreatorType[]
  status: 'verified' | 'pending' | 'rejected'
}

// Hotel profile for display
export interface ProfileHotelProfile {
  id: string
  name: string
  picture?: string
  location: string
  status: 'verified' | 'pending' | 'rejected'
  website?: string
  about?: string
  email: string
  phone?: string
  listings: ProfileHotelListing[]
}

// Form data types
export interface CreatorEditFormData {
  name: string
  profilePicture: string
  shortDescription: string
  location: string
  portfolioLink: string
  creatorType: CreatorType
  platforms: ProfilePlatform[]
}

export interface HotelEditFormData {
  name: string
  picture: string
  location: string
  website: string
  about: string
}

export interface ListingFormData {
  name: string
  location: string
  description: string
  images: string[]
  accommodationType: string
  collaborationTypes: ('Free Stay' | 'Paid' | 'Discount')[]
  availability: string[]
  platforms: string[]
  freeStayMinNights?: number
  freeStayMaxNights?: number
  paidMaxAmount?: number
  discountPercentage?: number
  lookingForPlatforms: string[]
  lookingForMinFollowers?: number
  targetGroupCountries: string[]
  targetGroupAgeMin?: number
  targetGroupAgeMax?: number
  targetGroupAgeGroups?: string[]
  lookingForCreatorTypes?: CreatorType[]
}

// Modal state types
export interface ErrorModalState {
  isOpen: boolean
  title: string
  message: string | string[]
  details?: string
}

export interface DeleteConfirmModalState {
  isOpen: boolean
  listingId: string | null
  listingName: string
}

/**
 * Factory function for empty listing form data
 */
export function createEmptyListingFormData(): ListingFormData {
  return {
    name: '',
    location: '',
    description: '',
    images: [],
    accommodationType: '',
    collaborationTypes: [],
    availability: [],
    platforms: [],
    freeStayMinNights: undefined,
    freeStayMaxNights: undefined,
    paidMaxAmount: undefined,
    discountPercentage: undefined,
    lookingForPlatforms: [],
    lookingForMinFollowers: undefined,
    targetGroupCountries: [],
    targetGroupAgeMin: undefined,
    targetGroupAgeMax: undefined,
    targetGroupAgeGroups: [],
    lookingForCreatorTypes: [],
  }
}
