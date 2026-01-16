/**
 * Utility functions
 */

export * from './profileStatus'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Transform HotelListing from API to Hotel type for frontend
 */
import type { HotelListing, Hotel, Creator, Platform } from '@/lib/types'

// Backend API response types for marketplace (snake_case from backend)
interface CreatorMarketplaceResponse {
  id: string
  name: string
  location: string
  short_description: string
  portfolio_link: string | null
  profile_picture: string | null
  platforms: Array<{
    id: string
    name: "Instagram" | "TikTok" | "YouTube" | "Facebook"
    handle: string
    followers: number
    engagement_rate: number
    top_countries: Array<{ country: string; percentage: number }> | null
    top_age_groups: Array<{ ageRange: string; percentage: number }> | null
    gender_split: { male: number; female: number; other?: number } | null
  }>
  audience_size: number
  average_rating: number
  total_reviews: number
  created_at: string
}

interface ListingMarketplaceResponse {
  id: string
  hotel_profile_id: string
  hotel_name: string
  hotel_picture: string | null
  name: string
  location: string
  description: string
  accommodation_type: string | null
  images: string[]
  status: "pending" | "verified" | "rejected"
  collaboration_offerings: Array<{
    id: string
    listing_id: string
    collaboration_type: "Free Stay" | "Paid" | "Discount"
    availability_months: string[]
    platforms: ("Instagram" | "TikTok" | "YouTube" | "Facebook")[]
    free_stay_min_nights: number | null
    free_stay_max_nights: number | null
    paid_max_amount: string | null // Backend returns as string (e.g., "2000.00")
    discount_percentage: number | null
    created_at: string
    updated_at: string
  }>
  creator_requirements?: {
    id: string
    listing_id: string
    platforms: ("Instagram" | "TikTok" | "YouTube" | "Facebook")[]
    min_followers: number | null
    target_countries: string[]
    target_age_min: number | null
    target_age_max: number | null
    created_at: string
    updated_at: string
  }
  created_at: string
}

/**
 * Transform CreatorMarketplaceResponse from API to Creator type for frontend
 */
export function transformCreatorMarketplaceResponse(apiCreator: CreatorMarketplaceResponse): Creator {
  // Transform platforms - remove id field and map from snake_case to camelCase
  const platforms: Platform[] = apiCreator.platforms.map((platform) => ({
    name: platform.name,
    handle: platform.handle,
    followers: platform.followers,
    engagementRate: typeof platform.engagement_rate === 'number' ? platform.engagement_rate : 0,
    topCountries: platform.top_countries || undefined,
    topAgeGroups: platform.top_age_groups || undefined,
    genderSplit: platform.gender_split || undefined,
  }))

  return {
    id: apiCreator.id,
    email: '', // Not provided by marketplace endpoint
    name: apiCreator.name,
    platforms,
    audienceSize: apiCreator.audience_size,
    location: apiCreator.location,
    portfolioLink: apiCreator.portfolio_link || undefined,
    shortDescription: apiCreator.short_description || undefined,
    phone: null,
    profilePicture: apiCreator.profile_picture || undefined,
    rating: {
      averageRating: apiCreator.average_rating,
      totalReviews: apiCreator.total_reviews,
    },
    status: 'verified' as const, // Marketplace only returns active/verified creators
    createdAt: new Date(apiCreator.created_at),
    updatedAt: new Date(apiCreator.created_at), // Use created_at as fallback
  }
}

/**
 * Transform ListingMarketplaceResponse from API to Hotel type for frontend
 */
export function transformListingMarketplaceResponse(apiListing: ListingMarketplaceResponse): Hotel {
  // Process collaboration offerings to extract collaboration type, availability, platforms
  const offerings = apiListing.collaboration_offerings || []
  
  // Determine collaboration type (Kostenlos if has Free Stay, otherwise Bezahlt if has Paid)
  let collaborationType: 'Kostenlos' | 'Bezahlt' | undefined
  const hasFreeStay = offerings.some(o => o.collaboration_type === 'Free Stay')
  const hasPaid = offerings.some(o => o.collaboration_type === 'Paid')
  
  if (hasFreeStay) {
    collaborationType = 'Kostenlos'
  } else if (hasPaid) {
    collaborationType = 'Bezahlt'
  }
  
  // Get availability months (union of all offerings)
  const availabilityMonths = Array.from(
    new Set(offerings.flatMap(o => o.availability_months || []))
  )
  
  // Get platforms (union of all offerings)
  const platforms = Array.from(
    new Set(offerings.flatMap(o => o.platforms || []))
  )
  
  // Get max nights from free stay offering
  const freeStayOffering = offerings.find(o => o.collaboration_type === 'Free Stay')
  const numberOfNights = freeStayOffering?.free_stay_max_nights || undefined

  // Extract creator requirements
  const creatorRequirements = apiListing.creator_requirements
  const targetAudience = creatorRequirements?.target_countries || []
  const minFollowers = creatorRequirements?.min_followers || undefined
  const targetAgeMin = creatorRequirements?.target_age_min || undefined
  const targetAgeMax = creatorRequirements?.target_age_max || undefined

  // Use hotel picture as first image if listing has no images, otherwise use listing images
  const images = apiListing.images && apiListing.images.length > 0
    ? apiListing.images
    : apiListing.hotel_picture
    ? [apiListing.hotel_picture]
    : []

  return {
    id: apiListing.id,
    hotelProfileId: apiListing.hotel_profile_id,
    name: apiListing.name,
    location: apiListing.location,
    description: apiListing.description,
    images,
    accommodationType: apiListing.accommodation_type || undefined,
    collaborationType,
    availability: availabilityMonths.length > 0 ? availabilityMonths : undefined,
    platforms: platforms.length > 0 ? platforms : undefined,
    domain: undefined, // Not provided in listing response
    boardType: undefined, // Not provided in listing response
    numberOfNights,
    targetAudience: targetAudience.length > 0 ? targetAudience : undefined,
    minFollowers,
    targetAgeMin,
    targetAgeMax,
    socialLinks: undefined, // Not provided in listing response
    status: apiListing.status,
    createdAt: new Date(apiListing.created_at),
    updatedAt: new Date(apiListing.created_at), // Use created_at as fallback
  }
}

export function transformHotelListingToHotel(listing: HotelListing): Hotel {
  // Handle empty or missing collaboration offerings
  const offerings = listing.collaboration_offerings || []
  
  // Extract collaboration types from offerings
  const hasFreeStay = offerings.some(
    (o) => o.collaboration_type === 'Free Stay'
  )
  const hasPaid = offerings.some(
    (o) => o.collaboration_type === 'Paid'
  )
  
  // Determine collaboration type (Kostenlos if has Free Stay, otherwise Bezahlt if has Paid)
  let collaborationType: 'Kostenlos' | 'Bezahlt' | undefined
  if (hasFreeStay) {
    collaborationType = 'Kostenlos'
  } else if (hasPaid) {
    collaborationType = 'Bezahlt'
  }

  // Get availability months (union of all offerings)
  const availabilityMonths = Array.from(
    new Set(
      offerings.flatMap((offering) => offering.availability_months || [])
    )
  )

  // Get platforms (union of all offerings)
  const platforms = Array.from(
    new Set(
      offerings.flatMap((offering) => offering.platforms || [])
    )
  )

  // Extract collaboration-specific fields from the first offering of each type
  const freeStayOffering = offerings.find(
    (o) => o.collaboration_type === 'Free Stay'
  )
  
  // Get target audience from creator requirements
  const targetAudience = listing.creator_requirements?.target_countries || []

  return {
    id: listing.id,
    hotelProfileId: listing.hotel_profile_id,
    name: listing.name,
    location: listing.location,
    description: listing.description,
    images: listing.images || [],
    accommodationType: listing.accommodation_type || undefined,
    collaborationType,
    availability: availabilityMonths.length > 0 ? availabilityMonths : undefined,
    platforms: platforms.length > 0 ? platforms : undefined,
    numberOfNights: freeStayOffering?.free_stay_max_nights || undefined,
    targetAudience: targetAudience.length > 0 ? targetAudience : undefined,
    minFollowers: listing.creator_requirements?.min_followers || undefined,
    status: listing.status,
    createdAt: new Date(listing.created_at),
    updatedAt: new Date(listing.updated_at),
  }
}
