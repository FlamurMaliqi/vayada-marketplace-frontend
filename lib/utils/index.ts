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
import type { HotelListing, Hotel } from '@/lib/types'

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
