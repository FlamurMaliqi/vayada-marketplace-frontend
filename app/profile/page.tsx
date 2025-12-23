'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { ROUTES } from '@/lib/constants/routes'
import { Button, Input, Textarea, StarRating, ErrorModal } from '@/components/ui'
import { MapPinIcon, CheckBadgeIcon, StarIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { TrashIcon, ChevronDownIcon, ChevronUpIcon, InformationCircleIcon, EnvelopeIcon, PhoneIcon, LinkIcon, UserIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'
import type { CreatorRating, CollaborationReview, HotelProfile as ApiHotelProfile, HotelListing as ApiHotelListing, Creator as ApiCreator } from '@/lib/types'
import { hotelService } from '@/services/api/hotels'
import { creatorService } from '@/services/api/creators'
import { ApiErrorResponse } from '@/services/api/client'
import { checkProfileStatus } from '@/lib/utils'
import type { CreatorProfileStatus, HotelProfileStatus } from '@/lib/types'

type UserType = 'hotel' | 'creator'

interface PlatformCountry {
  country: string
  percentage: number
}

interface PlatformAgeGroup {
  ageRange: string
  percentage: number
}

interface PlatformGenderSplit {
  male: number
  female: number
}

interface Platform {
  id?: string
  name: string
  handle: string
  followers: number
  engagementRate: number
  topCountries?: PlatformCountry[]
  topAgeGroups?: PlatformAgeGroup[]
  genderSplit?: PlatformGenderSplit
}

// Mock data for Creator Profile
interface CreatorProfile {
  id: string
  name: string
  profilePicture?: string
  shortDescription: string
  location: string
  status: 'verified' | 'pending' | 'rejected'
  rating?: CreatorRating
  platforms: Platform[]
  portfolioLink?: string
  email: string
  phone?: string
}

// Mock data for Hotel Profile
interface HotelListing {
  id: string
  name: string
  location: string
  description: string
  images: string[]
  accommodationType?: string
  // Offerings per listing
  collaborationTypes: ('Free Stay' | 'Paid' | 'Discount')[]
  availability: string[] // months
  platforms: string[] // Instagram, TikTok, YouTube, Facebook
  freeStayMinNights?: number
  freeStayMaxNights?: number
  paidMaxAmount?: number
  discountPercentage?: number
  // Looking for per listing
  lookingForPlatforms: string[]
  lookingForMinFollowers?: number
  targetGroupCountries: string[]
  targetGroupAgeMin?: number
  targetGroupAgeMax?: number
  status: 'verified' | 'pending' | 'rejected'
}

interface HotelProfile {
  id: string
  name: string
  picture?: string
  location: string
  status: 'verified' | 'pending' | 'rejected'
  website?: string
  about?: string
  email: string
  phone?: string
  listings: HotelListing[]
}

type CreatorTab = 'overview' | 'platforms' | 'reviews'
type HotelTab = 'overview' | 'listings'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const HOTEL_CATEGORIES = ['Hotel', 'Boutiques Hotel', 'City Hotel', 'Luxury Hotel', 'Apartment', 'Villa', 'Lodge']
const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'Facebook']
const COLLABORATION_TYPES = ['Free Stay', 'Paid', 'Discount'] as const
const AGE_GROUP_OPTIONS = ['18-24', '25-34', '35-44', '45-54', '55+']
const COUNTRIES = ['USA', 'Germany', 'UK', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Austria', 'Belgium', 'Canada', 'Australia', 'Japan', 'South Korea', 'Singapore', 'Thailand', 'Indonesia', 'Malaysia', 'Philippines', 'India', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'South Africa', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Egypt']

export default function ProfilePage() {
  const router = useRouter()
  const { isCollapsed } = useSidebar()
  // Initialize userType from localStorage if available, otherwise default to 'creator'
  const [userType, setUserType] = useState<UserType>(() => {
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType') as UserType | null
      if (storedUserType && (storedUserType === 'creator' || storedUserType === 'hotel')) {
        return storedUserType
      }
    }
    return 'creator'
  })
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const [hotelProfile, setHotelProfile] = useState<HotelProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileStatus, setProfileStatus] = useState<CreatorProfileStatus | HotelProfileStatus | null>(null)
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false)
  const [activeCreatorTab, setActiveCreatorTab] = useState<CreatorTab>('overview')
  const [activeHotelTab, setActiveHotelTab] = useState<HotelTab>('overview')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [isSavingContact, setIsSavingContact] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isEditingHotelProfile, setIsEditingHotelProfile] = useState(false)
  const [isSavingHotelProfile, setIsSavingHotelProfile] = useState(false)
  const [showPictureModal, setShowPictureModal] = useState(false)
  const [showHotelPictureModal, setShowHotelPictureModal] = useState(false)
  const [showListingModal, setShowListingModal] = useState(false)
  const [editingListingId, setEditingListingId] = useState<string | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [hotelPicturePreview, setHotelPicturePreview] = useState<string | null>(null)
  const [listingImagePreview, setListingImagePreview] = useState<string | null>(null)
  const [creatorProfilePictureFile, setCreatorProfilePictureFile] = useState<File | null>(null)
  const [hotelProfilePictureFile, setHotelProfilePictureFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const hotelFileInputRef = useRef<HTMLInputElement | null>(null)
  const listingImageInputRef = useRef<HTMLInputElement | null>(null)
  const creatorImageInputRef = useRef<HTMLInputElement | null>(null)
  
  // Error modal state
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean
    title: string
    message: string | string[]
    details?: string
  }>({
    isOpen: false,
    title: 'Error',
    message: '',
  })
  
  // Platform management state
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<number>>(new Set())
  const [platformCountryInputs, setPlatformCountryInputs] = useState<Record<number, string>>({})
  const [platformSaveStatus, setPlatformSaveStatus] = useState<Record<number, string>>({})
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    profilePicture: '',
    shortDescription: '',
    location: '',
    portfolioLink: '',
    platforms: [] as Platform[],
  })

  // Hotel edit form state
  const [hotelEditFormData, setHotelEditFormData] = useState({
    name: '',
    picture: '',
    location: '',
    website: '',
    about: '',
    collaborationTypes: [] as ('Free Stay' | 'Paid' | 'Discount')[],
    availability: [] as string[],
    platforms: [] as string[],
    freeStayMinNights: undefined as number | undefined,
    freeStayMaxNights: undefined as number | undefined,
    paidMaxAmount: undefined as number | undefined,
    discountPercentage: undefined as number | undefined,
    lookingForPlatforms: [] as string[],
    lookingForMinFollowers: undefined as number | undefined,
    targetGroupCountries: [] as string[],
    targetGroupAgeMin: undefined as number | undefined,
    targetGroupAgeMax: undefined as number | undefined,
  })

  // Listing edit form state
  const [listingFormData, setListingFormData] = useState({
    name: '',
    location: '',
    description: '',
    images: [] as string[],
    accommodationType: '',
    collaborationTypes: [] as ('Free Stay' | 'Paid' | 'Discount')[],
    availability: [] as string[],
    platforms: [] as string[],
    freeStayMinNights: undefined as number | undefined,
    freeStayMaxNights: undefined as number | undefined,
    paidMaxAmount: undefined as number | undefined,
    discountPercentage: undefined as number | undefined,
    lookingForPlatforms: [] as string[],
    lookingForMinFollowers: undefined as number | undefined,
    targetGroupCountries: [] as string[],
    targetGroupAgeMin: undefined as number | undefined,
    targetGroupAgeMax: undefined as number | undefined,
  })
  const [isSavingListing, setIsSavingListing] = useState(false)

  // Load user type from localStorage on mount
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') as UserType | null
    if (storedUserType && (storedUserType === 'creator' || storedUserType === 'hotel')) {
      setUserType(storedUserType)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [userType])

  useEffect(() => {
    if (creatorProfile?.email) {
      setEmail(creatorProfile.email)
    }
    if (creatorProfile?.phone) {
      setPhone(creatorProfile.phone)
    }
    if (creatorProfile) {
      setEditFormData({
        name: creatorProfile.name,
        profilePicture: creatorProfile.profilePicture || '',
        shortDescription: creatorProfile.shortDescription,
        location: creatorProfile.location,
        portfolioLink: creatorProfile.portfolioLink || '',
        platforms: (creatorProfile.platforms || []).map(platform => {
          // Clean age groups - filter out any with empty or null ageRange
          const cleanAgeGroups: PlatformAgeGroup[] = (platform.topAgeGroups || [])
            .map((ag: any) => {
              // Handle both camelCase and snake_case formats, and null values
              const ageRangeValue = ag.ageRange ?? ag.age_range ?? null
              // Skip if null or undefined
              if (ageRangeValue === null || ageRangeValue === undefined) {
                return null
              }
              const ageRange = String(ageRangeValue).trim()
              return {
                ageRange: ageRange,
                percentage: ag.percentage ?? 0,
              }
            })
            .filter((ag: any): ag is PlatformAgeGroup => ag !== null && ag.ageRange && ag.ageRange !== '' && ag.ageRange !== 'null') // Remove null entries and invalid age ranges

          return {
            ...platform,
            topCountries: platform.topCountries || [],
            topAgeGroups: cleanAgeGroups, // Only include valid age groups
            genderSplit: platform.genderSplit || { male: 0, female: 0 },
          }
        }),
      })
      // Reset expanded platforms when profile loads - all collapsed by default
      setExpandedPlatforms(new Set())
      setPlatformCountryInputs({})
    }
  }, [creatorProfile])

  /**
   * Transform frontend listing format to API format for create/update
   */
  const transformListingToApi = (listingData: typeof listingFormData) => {
    // Group collaboration offerings by type
    const offerings: Array<{
      collaboration_type: 'Free Stay' | 'Paid' | 'Discount'
      availability_months: string[]
      platforms: string[]
      free_stay_min_nights?: number
      free_stay_max_nights?: number
      paid_max_amount?: number
      discount_percentage?: number
    }> = []

    // Create offerings for each collaboration type
    if (listingData.collaborationTypes.includes('Free Stay')) {
      offerings.push({
        collaboration_type: 'Free Stay',
        availability_months: listingData.availability,
        platforms: listingData.platforms,
        free_stay_min_nights: listingData.freeStayMinNights,
        free_stay_max_nights: listingData.freeStayMaxNights,
      })
    }

    if (listingData.collaborationTypes.includes('Paid')) {
      offerings.push({
        collaboration_type: 'Paid',
        availability_months: listingData.availability,
        platforms: listingData.platforms,
        paid_max_amount: listingData.paidMaxAmount,
      })
    }

    if (listingData.collaborationTypes.includes('Discount')) {
      offerings.push({
        collaboration_type: 'Discount',
        availability_months: listingData.availability,
        platforms: listingData.platforms,
        discount_percentage: listingData.discountPercentage,
      })
    }

    return {
      name: listingData.name,
      location: listingData.location,
      description: listingData.description,
      accommodation_type: listingData.accommodationType || undefined,
      images: listingData.images.filter((img) => !img.startsWith('data:')), // Filter out base64 previews
      collaboration_offerings: offerings,
      creator_requirements: {
        platforms: listingData.lookingForPlatforms,
        min_followers: listingData.lookingForMinFollowers || undefined,
        target_countries: listingData.targetGroupCountries,
        target_age_min: listingData.targetGroupAgeMin || undefined,
        target_age_max: listingData.targetGroupAgeMax || undefined,
      },
    }
  }

  /**
   * Transform API creator response to frontend CreatorProfile format
   * Handles both snake_case and camelCase API responses
   */
  const transformCreatorProfile = (apiCreator: any): CreatorProfile => {
    // Handle both snake_case and camelCase field names
    const profilePicture = (apiCreator.profilePicture || apiCreator.profile_picture || '').trim() || undefined
    const shortDescription = apiCreator.shortDescription || apiCreator.short_description || ''
    const portfolioLink = apiCreator.portfolioLink || apiCreator.portfolio_link || undefined
    const email = apiCreator.email || ''
    const phone = apiCreator.phone || ''
    
    // Transform platforms - handle both snake_case and camelCase
    const platforms = (apiCreator.platforms || []).map((platform: any) => {
      // Handle genderSplit - might be a string (JSON) or object
      let genderSplit = platform.genderSplit || platform.gender_split
      if (typeof genderSplit === 'string') {
        try {
          genderSplit = JSON.parse(genderSplit)
        } catch (e) {
          genderSplit = { male: 0, female: 0 }
        }
      }
      if (!genderSplit || typeof genderSplit !== 'object') {
        genderSplit = { male: 0, female: 0 }
      }

      // Handle age groups - transform from backend format and filter out invalid ones
      const rawAgeGroups = platform.topAgeGroups || platform.top_age_groups || []
      const topAgeGroups = rawAgeGroups
        .map((ag: any) => {
          // Handle both ageRange (camelCase) and age_range (snake_case)
          // Also handle null values from backend
          const ageRangeValue = ag.ageRange ?? ag.age_range ?? null
          if (ageRangeValue === null || ageRangeValue === undefined) {
            return null
          }
          const ageRange = String(ageRangeValue).trim()
          return {
            ageRange: ageRange,
            percentage: ag.percentage ?? 0,
          }
        })
        .filter((ag: any) => {
          return ag !== null && ag.ageRange && ag.ageRange !== '' && ag.ageRange !== 'null'
        })

      return {
        id: platform.id,
        name: platform.name,
        handle: platform.handle || '',
        followers: platform.followers ?? 0,
        engagementRate: (platform.engagementRate || platform.engagement_rate) ?? 0,
        topCountries: platform.topCountries || platform.top_countries || [],
        topAgeGroups: topAgeGroups, // Already filtered and transformed (no empty age ranges)
        genderSplit: genderSplit,
      }
    })

    // Handle rating - might be missing or have different structure
    // Handle both snake_case and camelCase, ensure averageRating is always a valid number
    const ratingData = apiCreator.rating || {}
    const averageRating = ratingData.averageRating ?? ratingData.average_rating ?? 0
    const totalReviews = ratingData.totalReviews ?? ratingData.total_reviews ?? 0
    const reviews = ratingData.reviews || []
    
    const rating = {
      averageRating: typeof averageRating === 'number' && !isNaN(averageRating) 
        ? averageRating 
        : 0,
      totalReviews: typeof totalReviews === 'number' && !isNaN(totalReviews)
        ? totalReviews
        : 0,
      reviews: Array.isArray(reviews) ? reviews : [],
    }

    return {
      id: apiCreator.id,
      name: apiCreator.name || '',
      profilePicture,
      shortDescription,
      location: apiCreator.location || '',
      status:
        apiCreator.status === 'verified' || apiCreator.status === 'pending' || apiCreator.status === 'rejected'
          ? apiCreator.status
          : 'pending',
      rating,
      platforms,
      portfolioLink,
      email,
      phone,
    }
  }

  /**
   * Transform API hotel profile response to frontend format
   * Converts snake_case to camelCase and transforms nested structures
   */
  const transformHotelProfile = (apiProfile: ApiHotelProfile): HotelProfile => {
    const listings = apiProfile.listings || []

    return {
      id: apiProfile.id,
      name: apiProfile.name,
      picture: apiProfile.picture || undefined,
      location: apiProfile.location,
      status:
        apiProfile.status === 'verified' || apiProfile.status === 'pending' || apiProfile.status === 'rejected'
          ? apiProfile.status
          : 'pending',
      website: apiProfile.website || undefined,
      about: apiProfile.about || undefined,
      email: apiProfile.email,
      phone: apiProfile.phone || '',
      listings: listings.map((apiListing) => {
        const offerings = apiListing.collaboration_offerings || []
        const collaborationTypes = offerings.map((offering) => offering.collaboration_type) as (
          | 'Free Stay'
          | 'Paid'
          | 'Discount'
        )[]

        const availabilityMonths = Array.from(
          new Set(offerings.flatMap((offering) => offering.availability_months || []))
        )

        const platforms = Array.from(new Set(offerings.flatMap((offering) => offering.platforms || [])))

        const freeStayOffering = offerings.find((o) => o.collaboration_type === 'Free Stay')
        const paidOffering = offerings.find((o) => o.collaboration_type === 'Paid')
        const discountOffering = offerings.find((o) => o.collaboration_type === 'Discount')

        const creatorReqs = apiListing.creator_requirements || {
          platforms: [],
          min_followers: undefined,
          target_countries: [],
          target_age_min: undefined,
          target_age_max: undefined,
        }

        return {
          id: apiListing.id,
          name: apiListing.name,
          location: apiListing.location,
          description: apiListing.description,
          images: apiListing.images || [],
          accommodationType: apiListing.accommodation_type || undefined,
          collaborationTypes,
          availability: availabilityMonths,
          platforms,
          freeStayMinNights: freeStayOffering?.free_stay_min_nights ?? undefined,
          freeStayMaxNights: freeStayOffering?.free_stay_max_nights ?? undefined,
          paidMaxAmount: paidOffering?.paid_max_amount ?? undefined,
          discountPercentage: discountOffering?.discount_percentage ?? undefined,
          lookingForPlatforms: creatorReqs.platforms || [],
          lookingForMinFollowers: creatorReqs.min_followers ?? undefined,
          targetGroupCountries: creatorReqs.target_countries || [],
          targetGroupAgeMin: creatorReqs.target_age_min ?? undefined,
          targetGroupAgeMax: creatorReqs.target_age_max ?? undefined,
          status:
            apiListing.status === 'verified' || apiListing.status === 'pending' || apiListing.status === 'rejected'
              ? apiListing.status
              : 'pending',
        }
      }),
    }
  }

  /**
   * Format error detail for display
   * Handles string, array of validation errors, or object
   */
  const formatErrorDetail = (detail: unknown): string => {
    if (typeof detail === 'string') {
      return detail
    }
    if (Array.isArray(detail)) {
      // Pydantic validation errors: [{type, loc, msg, input, url}, ...]
      return detail.map((err: any) => {
        const field = Array.isArray(err.loc) ? err.loc.slice(1).join('.') : 'field'
        return `${field}: ${err.msg || 'Validation error'}`
      }).join('; ')
    }
    if (detail && typeof detail === 'object') {
      return JSON.stringify(detail)
    }
    return 'An error occurred'
  }

  /**
   * Format error detail for modal display (returns array of messages)
   * Handles string, array of validation errors, or object
   */
  const formatErrorForModal = (detail: unknown): string[] => {
    if (typeof detail === 'string') {
      return [detail]
    }
    if (Array.isArray(detail)) {
      // Pydantic validation errors: [{type, loc, msg, input, url}, ...]
      return detail.map((err: any) => {
        const field = Array.isArray(err.loc) ? err.loc.slice(1).join('.') : 'field'
        return `${field}: ${err.msg || 'Validation error'}`
      })
    }
    if (detail && typeof detail === 'object') {
      return [JSON.stringify(detail)]
    }
    return ['An error occurred']
  }

  /**
   * Show error modal
   */
  const showError = (title: string, message: string | string[], details?: string) => {
    setErrorModal({
      isOpen: true,
      title,
      message,
      details,
    })
  }

  /**
   * Close error modal
   */
  const closeError = () => {
    setErrorModal(prev => ({ ...prev, isOpen: false }))
  }

  const loadProfile = async () => {
    // Don't load profile if userType is not set or invalid
    if (!userType || (userType !== 'creator' && userType !== 'hotel')) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // Check profile status first
      const status = await checkProfileStatus(userType)
      setProfileStatus(status)
      
      if (status && !status.profile_complete) {
        // Profile is incomplete - show page without profile data
        setIsProfileIncomplete(true)
        setCreatorProfile(null)
        setHotelProfile(null)
        return
      }
      
      // Profile is complete, fetch profile data
      setIsProfileIncomplete(false)
      
      if (userType === 'creator') {
        try {
          const apiProfile = await creatorService.getMyProfile()
          // Debug: inspect how backend returns country percentages per platform
          console.log('Creator profile (backend response)', apiProfile?.platforms?.map?.((p: any) => ({
            name: p?.name,
            topCountries: p?.topCountries || p?.top_countries,
          })))
          const profile = transformCreatorProfile(apiProfile)
          setCreatorProfile(profile)
        } catch (error) {
          // Check if it's a 405 (Method Not Allowed) - endpoint not implemented yet
          if (error instanceof ApiErrorResponse && error.status === 405) {
            console.warn('Profile endpoint not yet implemented:', error.status)
          } else {
            console.error('Failed to fetch creator profile:', error)
          }
          // If profile fetch fails, still show the page (empty state will display)
          setCreatorProfile(null)
        }
      } else if (userType === 'hotel') {
        try {
          const apiProfile = await hotelService.getMyProfile()
          // Transform API response to local HotelProfile format
          const profile: HotelProfile = {
            id: apiProfile.id,
            name: apiProfile.name,
            email: apiProfile.email,
            phone: apiProfile.phone || undefined,
            location: apiProfile.location,
            website: apiProfile.website || undefined,
            about: apiProfile.about || undefined,
            picture: (apiProfile.picture && apiProfile.picture.trim() !== '') ? apiProfile.picture : undefined,
            status: (apiProfile.status === 'verified' || apiProfile.status === 'pending' || apiProfile.status === 'rejected') 
              ? apiProfile.status 
              : 'pending',
            listings: (apiProfile.listings || []).map((listing: any) => ({
              id: listing.id,
              name: listing.name,
              location: listing.location,
              description: listing.description,
              images: listing.images || [],
              accommodationType: listing.accommodationType || listing.accommodation_type || undefined,
              collaborationTypes: (listing.collaborationOfferings || listing.collaboration_offerings || []).map((offering: any) => offering.collaborationType || offering.collaboration_type),
              availability: (listing.collaborationOfferings?.[0]?.availabilityMonths || listing.collaboration_offerings?.[0]?.availability_months || []),
              platforms: (listing.collaborationOfferings?.[0]?.platforms || listing.collaboration_offerings?.[0]?.platforms || []),
              freeStayMinNights: listing.collaborationOfferings?.[0]?.freeStayMinNights || listing.collaboration_offerings?.[0]?.free_stay_min_nights || undefined,
              freeStayMaxNights: listing.collaborationOfferings?.[0]?.freeStayMaxNights || listing.collaboration_offerings?.[0]?.free_stay_max_nights || undefined,
              paidMaxAmount: listing.collaborationOfferings?.[0]?.paidMaxAmount || listing.collaboration_offerings?.[0]?.paid_max_amount || undefined,
              discountPercentage: listing.collaborationOfferings?.[0]?.discountPercentage || listing.collaboration_offerings?.[0]?.discount_percentage || undefined,
              lookingForPlatforms: listing.creatorRequirements?.platforms || listing.creator_requirements?.platforms || [],
              lookingForMinFollowers: listing.creatorRequirements?.minFollowers || listing.creator_requirements?.min_followers || undefined,
              targetGroupCountries: listing.creatorRequirements?.targetCountries || listing.creator_requirements?.target_countries || [],
              targetGroupAgeMin: listing.creatorRequirements?.targetAgeMin || listing.creator_requirements?.target_age_min || undefined,
              targetGroupAgeMax: listing.creatorRequirements?.targetAgeMax || listing.creator_requirements?.target_age_max || undefined,
              status: listing.status || 'pending',
            })),
          }
          setHotelProfile(profile)
        } catch (error) {
          // Check if it's a 405 (Method Not Allowed) - endpoint not implemented yet
          if (error instanceof ApiErrorResponse && error.status === 405) {
            console.warn('Profile endpoint not yet implemented:', error.status)
          } else {
            console.error('Failed to fetch hotel profile:', error)
          }
          // If profile fetch fails, still show the page (empty state will display)
          setHotelProfile(null)
        }
      }
    } catch (error: unknown) {
      console.error(
        'Failed to check profile status:',
        error instanceof Error ? error : String(error)
      )
      setIsProfileIncomplete(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hotelProfile) {
      setHotelEditFormData({
        name: hotelProfile.name,
        picture: hotelProfile.picture || '',
        location: hotelProfile.location,
        website: hotelProfile.website || '',
        about: hotelProfile.about || '',
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
      })
      setEmail(hotelProfile.email)
      setPhone(hotelProfile.phone || '')
    }
  }, [hotelProfile])

  // Platform Icon Component
  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase()
    if (platformLower.includes('instagram')) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    }
    if (platformLower.includes('tiktok')) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    }
    if (platformLower.includes('youtube') || platformLower.includes('yt')) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
    if (platformLower.includes('facebook')) {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
    if (platformLower.includes('blog') || platformLower.includes('website')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
    return null
  }

  // Format followers with German number format (22.000)
  const formatFollowersDE = (num: number): string => {
    return new Intl.NumberFormat('de-DE').format(num)
  }

  // Get country flag emoji
  const getCountryFlag = (country: string): string => {
    const countryFlags: Record<string, string> = {
      'Germany': '🇩🇪',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'United States': '🇺🇸',
      'USA': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Australia': '🇦🇺',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Singapore': '🇸🇬',
      'Thailand': '🇹🇭',
      'Indonesia': '🇮🇩',
      'Malaysia': '🇲🇾',
      'Philippines': '🇵🇭',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'South Africa': '🇿🇦',
      'UAE': '🇦🇪',
      'Saudi Arabia': '🇸🇦',
      'Qatar': '🇶🇦',
      'Kuwait': '🇰🇼',
      'Egypt': '🇪🇬',
      'Greece': '🇬🇷',
      'Costa Rica': '🇨🇷',
    }
    return countryFlags[country] || '🏳️'
  }

  const handleSaveContact = async () => {
    if (!email || !email.includes('@')) {
      return
    }
    
    setIsSavingContact(true)
    // Simulate API call
    setTimeout(() => {
      if (creatorProfile) {
        setCreatorProfile({
          ...creatorProfile,
          email: email,
          phone: phone,
        })
      }
      setIsEditingContact(false)
      setIsSavingContact(false)
      // In production, make API call to save contact information
    }, 500)
  }

  /**
   * Validate creator profile edit form
   * Matches backend validation rules
   */
  const validateCreatorEdit = (): string | null => {
    if (!editFormData.name || !editFormData.name.trim()) {
      return 'Name is required'
    }
    if (!editFormData.location || !editFormData.location.trim()) {
      return 'Location is required'
    }
    if (!editFormData.shortDescription || editFormData.shortDescription.trim().length < 10) {
      return 'Short description must be at least 10 characters'
    }
    if (editFormData.shortDescription.trim().length > 500) {
      return 'Short description must be at most 500 characters'
    }
    if (editFormData.portfolioLink && editFormData.portfolioLink.trim() && !/^https?:\/\//i.test(editFormData.portfolioLink.trim())) {
      return 'Portfolio link must start with http or https'
    }
    if (editFormData.platforms.length === 0) {
      return 'At least one platform is required'
    }
    // Validate each platform
    for (let i = 0; i < editFormData.platforms.length; i++) {
      const platform = editFormData.platforms[i]
      if (!platform.name || !['Instagram', 'TikTok', 'YouTube', 'Facebook'].includes(platform.name)) {
        return `Platform ${i + 1}: Platform name must be one of: Instagram, TikTok, YouTube, Facebook`
      }
      if (!platform.handle || !platform.handle.trim()) {
        return `Platform ${i + 1}: Handle is required`
      }
      if (!platform.followers || platform.followers <= 0) {
        return `Platform ${i + 1}: Followers must be greater than 0`
      }
      if (!platform.engagementRate || platform.engagementRate <= 0) {
        return `Platform ${i + 1}: Engagement rate must be greater than 0`
      }
      // Validate age groups - if any exist, they must have valid age ranges
      // Handle both ageRange (camelCase) and age_range (snake_case) formats, and null values
      if (platform.topAgeGroups && platform.topAgeGroups.length > 0) {
        const invalidAgeGroups = platform.topAgeGroups.filter((tag: any) => {
          const ageRange = (tag.ageRange || tag.age_range || '').toString().trim()
          return !ageRange || ageRange === '' || ageRange === 'null' || tag.ageRange === null || tag.age_range === null
        })
        if (invalidAgeGroups.length > 0) {
          return `Platform ${i + 1}: All age groups must have a valid age range selected`
        }
      }
    }
    return null
  }

  const handleSaveProfile = async () => {
    // Validate form
    const validationError = validateCreatorEdit()
    if (validationError) {
      showError('Validation Error', validationError)
      return
    }

    if (!creatorProfile) return

    setIsSavingProfile(true)
    try {
      // Transform platforms to API format
      // IMPORTANT: API uses REPLACE strategy - must include ALL platforms
      // Use snake_case for nested fields as backend expects it
      const platforms = editFormData.platforms.map(platform => {
        // Filter out empty or null age ranges first - handle both ageRange and age_range formats
        const validAgeGroups = platform.topAgeGroups && platform.topAgeGroups.length > 0
          ? platform.topAgeGroups
              .map((tag: any) => {
                // Handle both camelCase and snake_case formats, and null values
                const ageRangeValue = tag.ageRange ?? tag.age_range ?? null
                // Only process if we have a valid non-null value
                if (ageRangeValue === null || ageRangeValue === undefined) {
                  return null
                }
                const trimmedAgeRange = String(ageRangeValue).trim()
                return {
                  ageRange: trimmedAgeRange,
                  percentage: tag.percentage ?? 0,
                }
              })
              .filter((tag: any) => {
                // Filter out null entries and invalid age ranges
                if (!tag || tag === null) return false
                return tag.ageRange && tag.ageRange !== '' && tag.ageRange !== 'null'
              })
              .map((tag: any) => ({
                ageRange: tag.ageRange.trim(), // Use camelCase - backend expects ageRange not age_range
                percentage: tag.percentage,
              }))
          : []

        return {
          name: platform.name as 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook',
          handle: platform.handle.trim(),
          followers: platform.followers,
          engagement_rate: platform.engagementRate, // Use snake_case
          ...(platform.topCountries && platform.topCountries.length > 0 && {
            top_countries: platform.topCountries.map(tc => ({
              country: tc.country,
              percentage: tc.percentage,
            })),
          }),
          // Only include topAgeGroups if there are valid age groups (use camelCase like complete page)
          ...(validAgeGroups.length > 0 && {
            topAgeGroups: validAgeGroups,
          }),
          ...(platform.genderSplit && (platform.genderSplit.male > 0 || platform.genderSplit.female > 0) && {
            gender_split: {
              male: platform.genderSplit.male,
              female: platform.genderSplit.female,
            },
          }),
        }
      })

      // Calculate audience size (sum of all platform followers)
      const audienceSize = platforms.reduce((sum, p) => sum + p.followers, 0)

      // If there's a profile picture file, upload it first
      let profilePictureUrl: string | undefined = undefined
      if (creatorProfilePictureFile) {
        try {
          const uploadResponse = await creatorService.uploadProfilePicture(creatorProfilePictureFile)
          profilePictureUrl = uploadResponse.url
          // Note: profilePicture field may not be in schema yet, but we'll include it for future support
        } catch (error: unknown) {
          const detail =
            error instanceof ApiErrorResponse
              ? error.data.detail
              : null
          const message =
            typeof detail === 'string'
              ? detail
              : Array.isArray(detail) && detail[0]?.msg
                ? detail[0].msg
                : 'Failed to upload profile picture'
          showError('Failed to Upload Image', formatErrorForModal(detail || message))
          setIsSavingProfile(false)
          return
        }
      }

      // Build update payload - always use JSON for creator profiles
      const updatePayload = {
        name: editFormData.name.trim(),
        location: editFormData.location.trim(),
        short_description: editFormData.shortDescription.trim(),
        platforms: platforms,
        audience_size: audienceSize,
        ...(editFormData.portfolioLink && editFormData.portfolioLink.trim() && {
          portfolio_link: editFormData.portfolioLink.trim(),
        }),
        ...(phone && phone.trim() && {
          phone: phone.trim(),
        }),
        // Include profile picture URL if uploaded (may not be in schema yet)
        ...(profilePictureUrl && {
          profilePicture: profilePictureUrl,
        }),
      }
      
      // Debug: inspect payload we send (check country percentages)
      console.log('Creator update payload (profile page):', updatePayload.platforms?.map((p: any) => ({
        name: p?.name,
        topCountries: p?.topCountries,
      })))

      // Update creator profile (replaces all platforms)
      const updatedProfile = await creatorService.updateMyProfile(updatePayload as any)
      
      // Update profile picture immediately from response if available
      if (updatedProfile && (updatedProfile.profilePicture || (updatedProfile as any).profile_picture)) {
        const pictureUrl = updatedProfile.profilePicture || (updatedProfile as any).profile_picture
        if (pictureUrl && pictureUrl.trim() !== '') {
          setEditFormData(prev => ({
            ...prev,
            profilePicture: pictureUrl
          }))
          if (creatorProfile) {
            setCreatorProfile(prev => prev ? {
              ...prev,
              profilePicture: pictureUrl
            } : null)
          }
        }
      }
      
      // Re-fetch full profile to get updated data
      await loadProfile()
      
      // Clear file state after successful save
      setCreatorProfilePictureFile(null)
      setProfilePicturePreview(null)
      
      setIsEditingProfile(false)
    } catch (error: unknown) {
      const detail =
        error instanceof ApiErrorResponse
          ? error.data.detail
          : null
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail) && detail[0]?.msg
            ? detail[0].msg
            : 'Failed to save profile'
      showError('Failed to Save Profile', formatErrorForModal(detail || message))
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleCancelEdit = () => {
    if (creatorProfile) {
      setEditFormData({
        name: creatorProfile.name,
        profilePicture: creatorProfile.profilePicture || '',
        shortDescription: creatorProfile.shortDescription,
        location: creatorProfile.location,
        portfolioLink: creatorProfile.portfolioLink || '',
        platforms: (creatorProfile.platforms || []).map(platform => ({
          ...platform,
          topCountries: platform.topCountries || [],
          topAgeGroups: platform.topAgeGroups || [],
          genderSplit: platform.genderSplit || { male: 0, female: 0 },
        })),
      })
      setProfilePicturePreview(null)
      setCreatorProfilePictureFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    setIsEditingProfile(false)
  }

  /**
   * Validate hotel profile edit form
   * Matches backend validation rules
   */
  const validateHotelEdit = (): string | null => {
    if (hotelEditFormData.name && !hotelEditFormData.name.trim()) {
      return 'Name cannot be empty'
    }
    if (hotelEditFormData.location && !hotelEditFormData.location.trim()) {
      return 'Location cannot be empty'
    }
    if (hotelEditFormData.location && hotelEditFormData.location.trim().toLowerCase() === 'not specified') {
      return 'Location cannot be "Not specified"'
    }
    if (hotelEditFormData.about && hotelEditFormData.about.trim().length > 0 && hotelEditFormData.about.trim().length < 50) {
      return 'About must be at least 50 characters when provided'
    }
    if (hotelEditFormData.website && hotelEditFormData.website.trim() && !/^https?:\/\//i.test(hotelEditFormData.website.trim())) {
      return 'Website must start with http or https'
    }
    if (phone !== undefined && phone !== null && phone.trim() === '') {
      return 'Phone cannot be empty if provided'
    }
    return null
  }

  const handleSaveHotelProfile = async () => {
    // Validate form
    const validationError = validateHotelEdit()
    if (validationError) {
      showError('Validation Error', validationError)
      return
    }

    if (!hotelProfile) return

    setIsSavingHotelProfile(true)
    try {
      // Build partial update payload - only include changed fields
      const payload: {
        name?: string
        location?: string
        picture?: string | null
        website?: string
        about?: string
        email?: string
        phone?: string
      } = {}

      // Only include fields that have changed
      if (hotelEditFormData.name.trim() !== hotelProfile.name) {
        payload.name = hotelEditFormData.name.trim()
      }
      if (hotelEditFormData.location.trim() !== hotelProfile.location) {
        payload.location = hotelEditFormData.location.trim()
      }
      if ((hotelEditFormData.website || '') !== (hotelProfile.website || '')) {
        payload.website = hotelEditFormData.website.trim() || undefined
      }
      if ((hotelEditFormData.about || '') !== (hotelProfile.about || '')) {
        payload.about = hotelEditFormData.about.trim() || undefined
      }
      if ((phone || '') !== (hotelProfile.phone || '')) {
        payload.phone = phone || undefined
      }
      
      // If there's a profile picture file, use FormData; otherwise use JSON
      if (hotelProfilePictureFile) {
        // Use FormData for file upload
        const formData = new FormData()
        
        // Add all fields that have changed
        if (hotelEditFormData.name.trim() !== hotelProfile.name) {
          formData.append('name', hotelEditFormData.name.trim())
        }
        if (hotelEditFormData.location.trim() !== hotelProfile.location) {
          formData.append('location', hotelEditFormData.location.trim())
        }
        if ((hotelEditFormData.website || '') !== (hotelProfile.website || '')) {
          formData.append('website', hotelEditFormData.website.trim() || '')
        }
        if ((hotelEditFormData.about || '') !== (hotelProfile.about || '')) {
          formData.append('about', hotelEditFormData.about.trim() || '')
        }
        if ((phone || '') !== (hotelProfile.phone || '')) {
          formData.append('phone', phone || '')
        }
        
        // Include email if it changed
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
        if (userEmail && userEmail !== hotelProfile.email) {
          formData.append('email', userEmail)
        }
        
        // Add image file with the correct field name
        formData.append('picture', hotelProfilePictureFile)
        
        // Update hotel profile with FormData
        const updatedProfile = await hotelService.updateMyProfile(formData)
        
        // Update picture immediately from response if available
        if (updatedProfile && updatedProfile.picture) {
          setHotelEditFormData(prev => ({
            ...prev,
            picture: updatedProfile.picture || ''
          }))
          if (hotelProfile) {
            setHotelProfile(prev => prev ? {
              ...prev,
              picture: updatedProfile.picture || undefined
            } : null)
          }
        }
      } else {
        // Handle picture - can be URL or null to clear (no file upload)
        const currentPicture = hotelProfile.picture || ''
        const newPicture = hotelEditFormData.picture || ''
        if (newPicture !== currentPicture) {
          if (newPicture.trim() === '') {
            payload.picture = null // Clear picture
          } else if (!newPicture.startsWith('data:')) {
            // Only include if it's a URL (not base64 preview)
            payload.picture = newPicture.trim()
          }
        }

        // Include email if it changed (get from localStorage)
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
        if (userEmail && userEmail !== hotelProfile.email) {
          payload.email = userEmail
        }

        // Only make API call if there are changes
        if (Object.keys(payload).length === 0) {
          setIsEditingHotelProfile(false)
          setIsSavingHotelProfile(false)
          return
        }

        // Update hotel profile with partial data
        const updatedProfile = await hotelService.updateMyProfile(payload)
        
        // Update picture immediately from response if available
        if (updatedProfile && updatedProfile.picture) {
          setHotelEditFormData(prev => ({
            ...prev,
            picture: updatedProfile.picture || ''
          }))
          if (hotelProfile) {
            setHotelProfile(prev => prev ? {
              ...prev,
              picture: updatedProfile.picture || undefined
            } : null)
          }
        }
      }
      
      // Re-fetch full profile to get updated data
      await loadProfile()
      
      setIsEditingHotelProfile(false)
      
      // Clear file input and preview
      const hotelInput = hotelFileInputRef.current
      if (hotelInput) {
        hotelInput.value = ''
      }
      setHotelPicturePreview(null)
      setHotelProfilePictureFile(null)
    } catch (error: unknown) {
      const detail =
        error instanceof ApiErrorResponse
          ? error.data.detail
          : null
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail) && detail[0]?.msg
            ? detail[0].msg
            : 'Failed to save profile'
      showError('Failed to Save Profile', formatErrorForModal(detail || message))
    } finally {
      setIsSavingHotelProfile(false)
    }
  }

  const handleCancelHotelEdit = () => {
    if (hotelProfile) {
      setHotelEditFormData({
        name: hotelProfile.name,
        picture: hotelProfile.picture || '',
        location: hotelProfile.location,
        website: hotelProfile.website || '',
        about: hotelProfile.about || '',
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
      })
      setEmail(hotelProfile.email)
      setPhone(hotelProfile.phone || '')
      setHotelPicturePreview(null)
      setHotelProfilePictureFile(null)
      if (hotelFileInputRef.current) {
        hotelFileInputRef.current.value = ''
      }
    }
    setIsEditingHotelProfile(false)
  }

  const handleSaveHotelContact = async () => {
    if (!email || !email.includes('@')) {
      showError('Validation Error', 'Please enter a valid email address')
      return
    }
    
    if (!hotelProfile) return

    setIsSavingContact(true)
    try {
      // Build partial update - only include changed fields
      const payload: {
        email?: string
        phone?: string
      } = {}

      if (email !== hotelProfile.email) {
        payload.email = email
      }
      if ((phone || '') !== (hotelProfile.phone || '')) {
        payload.phone = phone || undefined
      }

      // Only make API call if there are changes
      if (Object.keys(payload).length === 0) {
        setIsEditingContact(false)
        setIsSavingContact(false)
        return
      }

      // Update hotel profile with partial data
      await hotelService.updateMyProfile(payload)
      
      // Re-fetch full profile to get updated data
      await loadProfile()
      
      setIsEditingContact(false)
    } catch (error: unknown) {
      const detail =
        error instanceof ApiErrorResponse
          ? error.data.detail
          : null
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail) && detail[0]?.msg
            ? detail[0].msg
            : 'Failed to save contact information'
      showError('Failed to Save Contact Information', formatErrorForModal(detail || message))
    } finally {
      setIsSavingContact(false)
    }
  }

  const openAddListingModal = () => {
    setListingFormData({
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
    })
    setEditingListingId(null)
    setListingImagePreview(null)
    setShowListingModal(true)
  }

  const openEditListingModal = (listing: HotelListing) => {
    setListingFormData({
      name: listing.name,
      location: listing.location,
      description: listing.description,
      images: listing.images || [],
      accommodationType: listing.accommodationType || '',
      collaborationTypes: listing.collaborationTypes || [],
      availability: listing.availability || [],
      platforms: listing.platforms || [],
      freeStayMinNights: listing.freeStayMinNights,
      freeStayMaxNights: listing.freeStayMaxNights,
      paidMaxAmount: listing.paidMaxAmount,
      discountPercentage: listing.discountPercentage,
      lookingForPlatforms: listing.lookingForPlatforms || [],
      lookingForMinFollowers: listing.lookingForMinFollowers,
      targetGroupCountries: listing.targetGroupCountries || [],
      targetGroupAgeMin: listing.targetGroupAgeMin,
      targetGroupAgeMax: listing.targetGroupAgeMax,
    })
    setEditingListingId(listing.id)
    setListingImagePreview(null)
    setShowListingModal(true)
  }

  const handleSaveListing = async () => {
    if (!listingFormData.name || !listingFormData.location || !listingFormData.description) {
      showError('Validation Error', 'Please fill in all required fields: name, location, and description.')
      return
    }

    if (!listingFormData.collaborationTypes.length || !listingFormData.availability.length) {
      showError('Validation Error', 'Please add at least one collaboration offering with availability months.')
      return
    }

    if (!listingFormData.lookingForPlatforms.length || !listingFormData.targetGroupCountries.length) {
      showError('Validation Error', 'Please specify platforms and target countries for creator requirements.')
      return
    }

    setIsSavingListing(true)
    try {
      // Separate existing URLs from new base64 images
      let imageUrls = listingFormData.images.filter((img) => !img.startsWith('data:'))
      const base64Images = listingFormData.images.filter((img) => img.startsWith('data:'))
      
      // Upload new base64 images first (convert to File objects)
      if (base64Images.length > 0) {
        try {
          const files: File[] = []
          for (const base64 of base64Images) {
            const response = await fetch(base64)
            const blob = await response.blob()
            const file = new File([blob], 'image.jpg', { type: blob.type })
            files.push(file)
          }
          
          // Upload images using standalone endpoint
          const uploadResponse = await hotelService.uploadListingImages(files)
          const newImageUrls = uploadResponse.images.map((img) => img.url)
          imageUrls = [...imageUrls, ...newImageUrls]
        } catch (error: unknown) {
          const detail =
            error instanceof ApiErrorResponse
              ? error.data.detail
              : null
          const message =
            typeof detail === 'string'
              ? detail
              : Array.isArray(detail) && detail[0]?.msg
                ? detail[0].msg
                : 'Failed to upload images'
          showError('Failed to Upload Images', formatErrorForModal(detail || message))
          setIsSavingListing(false)
          return
        }
      }
      
      // Build listing data with all image URLs (existing + newly uploaded)
      const apiListingData = transformListingToApi({
        ...listingFormData,
        images: imageUrls,
      })
      
      if (editingListingId) {
        const listingId = editingListingId as string
        // Update existing listing with all image URLs
        await hotelService.updateListing(listingId, apiListingData)
      } else {
        // Create new listing with all image URLs
        await hotelService.createListing(apiListingData)
      }
      
      // Re-fetch full profile to get updated data
      await loadProfile()
      
      setShowListingModal(false)
      setEditingListingId(null)
      setIsSavingListing(false)
      setListingImagePreview(null)
    } catch (error: unknown) {
      const err = error as any
      const detail =
        err && typeof err === 'object' && 'data' in err && err.data?.detail
          ? err.data.detail
          : null
      const logError = error instanceof Error ? error : new Error(String(error))
      console.error('Failed to save listing:', logError)
      if (detail) {
        showError('Failed to Save Listing', formatErrorForModal(detail))
      } else {
        showError('Failed to Save Listing', 'Failed to save listing. Please try again.')
      }
      setIsSavingListing(false)
    }
  }

  const handleCancelListing = () => {
    setShowListingModal(false)
    setEditingListingId(null)
    setListingImagePreview(null)
    if (listingImageInputRef.current) {
      listingImageInputRef.current.value = ''
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    // Check if this is the only listing - hotels must have at least one listing
    if (!hotelProfile || hotelProfile.listings.length <= 1) {
      showError('Cannot Delete Listing', 'You must have at least one listing. Please add another listing before deleting this one.')
      return
    }

    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return
    }

    try {
      await hotelService.deleteListing(listingId)
      
      // Re-fetch full profile to get updated data
      await loadProfile()
    } catch (error: unknown) {
      const detail =
        error instanceof ApiErrorResponse
          ? error.data.detail
          : null
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail) && detail[0]?.msg
            ? detail[0].msg
            : 'Failed to delete listing'
      showError('Failed to Delete Listing', formatErrorForModal(detail || message))
    }
  }

  const addListingImage = () => {
    listingImageInputRef.current?.click()
  }

  const handleListingImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const fileList = Array.from(files)

    // Validate files
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) {
        showError('Invalid File Type', 'Please select image files only')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        showError('File Too Large', `${file.name} is larger than 5MB`)
        return
      }
    }

    try {
      // Upload images using standalone endpoint
      const uploadResponse = await hotelService.uploadListingImages(fileList)
      const newImageUrls = uploadResponse.images.map((img) => img.url)
      
      // Add uploaded URLs to form data
      setListingFormData({
        ...listingFormData,
        images: [...listingFormData.images, ...newImageUrls],
      })
    } catch (error: unknown) {
      const detail =
        error instanceof ApiErrorResponse
          ? error.data.detail
          : null
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail) && detail[0]?.msg
            ? detail[0].msg
            : 'Failed to upload images'
      showError('Failed to Upload Images', formatErrorForModal(detail || message))
    } finally {
      // Reset input so the same file can be selected again
      const listingInput = listingImageInputRef.current
      if (listingInput) {
        listingInput.value = ''
      }
    }
  }

  const removeListingImage = (index: number) => {
    setListingFormData({
      ...listingFormData,
      images: listingFormData.images.filter((_, i) => i !== index),
    })
  }

  const addPlatform = () => {
    setEditFormData({
      ...editFormData,
      platforms: [...editFormData.platforms, { 
        name: '', 
        handle: '', 
        followers: 0, 
        engagementRate: 0,
        topCountries: [],
        topAgeGroups: [],
        genderSplit: { male: 0, female: 0 },
      }],
    })
  }

  const removePlatform = (index: number) => {
    setEditFormData({
      ...editFormData,
      platforms: editFormData.platforms.filter((_, i) => i !== index),
    })
  }

  const updatePlatform = (index: number, field: keyof Platform, value: string | number | PlatformCountry[] | PlatformAgeGroup[] | PlatformGenderSplit) => {
    setEditFormData({
      ...editFormData,
      platforms: editFormData.platforms.map((platform, i) =>
        i === index ? { ...platform, [field]: value } : platform
      ),
    })
  }

  const addTopCountry = (platformIndex: number) => {
    const platform = editFormData.platforms[platformIndex]
    const newCountries = [...(platform.topCountries || []), { country: '', percentage: 0 }]
    updatePlatform(platformIndex, 'topCountries', newCountries)
  }

  const removeTopCountry = (platformIndex: number, countryIndex: number) => {
    const platform = editFormData.platforms[platformIndex]
    const newCountries = (platform.topCountries || []).filter((_, i) => i !== countryIndex)
    updatePlatform(platformIndex, 'topCountries', newCountries)
  }

  const updateTopCountry = (platformIndex: number, countryIndex: number, field: 'country' | 'percentage', value: string | number) => {
    const platform = editFormData.platforms[platformIndex]
    const newCountries = (platform.topCountries || []).map((country, i) => {
      if (i !== countryIndex) return country
      const nextValue =
        field === 'percentage'
          ? (() => {
              const parsed = typeof value === 'number' ? value : parseFloat(String(value))
              const safeValue = Number.isNaN(parsed) ? 0 : parsed
              return Math.max(0, Math.min(100, safeValue))
            })()
          : value
      return { ...country, [field]: nextValue }
    })
    updatePlatform(platformIndex, 'topCountries', newCountries)
  }

  const addTopAgeGroup = (platformIndex: number) => {
    const platform = editFormData.platforms[platformIndex]
    const newAgeGroups = [...(platform.topAgeGroups || []), { ageRange: '', percentage: 0 }]
    updatePlatform(platformIndex, 'topAgeGroups', newAgeGroups)
  }

  const removeTopAgeGroup = (platformIndex: number, ageGroupIndex: number) => {
    const platform = editFormData.platforms[platformIndex]
    const newAgeGroups = (platform.topAgeGroups || []).filter((_, i) => i !== ageGroupIndex)
    updatePlatform(platformIndex, 'topAgeGroups', newAgeGroups)
  }

  const updateTopAgeGroup = (platformIndex: number, ageGroupIndex: number, field: 'ageRange' | 'percentage', value: string | number) => {
    const platform = editFormData.platforms[platformIndex]
    const newAgeGroups = (platform.topAgeGroups || []).map((ageGroup, i) =>
      i === ageGroupIndex ? { ...ageGroup, [field]: value } : ageGroup
    )
    updatePlatform(platformIndex, 'topAgeGroups', newAgeGroups)
  }

  const updateGenderSplit = (platformIndex: number, field: 'male' | 'female', value: number) => {
    const platform = editFormData.platforms[platformIndex]
    const newGenderSplit = { ...(platform.genderSplit || { male: 0, female: 0 }), [field]: value }
    updatePlatform(platformIndex, 'genderSplit', newGenderSplit)
  }

  // Platform management helpers (matching complete page design)
  const togglePlatformExpanded = (platformIndex: number) => {
    const newExpanded = new Set(expandedPlatforms)
    if (newExpanded.has(platformIndex)) {
      newExpanded.delete(platformIndex)
    } else {
      newExpanded.add(platformIndex)
    }
    setExpandedPlatforms(newExpanded)
  }

  const handleCountryInputChange = (platformIndex: number, value: string) => {
    setPlatformCountryInputs((prev) => ({ ...prev, [platformIndex]: value }))
  }

  const addCountryFromInput = (platformIndex: number, overrideValue?: string) => {
    const value = (overrideValue ?? platformCountryInputs[platformIndex])?.trim()
    if (!value) return
    const platform = editFormData.platforms[platformIndex]
    if (!platform.topCountries) {
      updatePlatform(platformIndex, 'topCountries', [])
    }
    // Limit to 3 countries
    if ((platform.topCountries || []).length >= 3) return
    // Avoid duplicates
    const exists = (platform.topCountries || []).some(
      (c) => c.country.toLowerCase() === value.toLowerCase()
    )
    if (exists) {
      setPlatformCountryInputs((prev) => ({ ...prev, [platformIndex]: '' }))
      return
    }
    const newCountries = [...(platform.topCountries || []), { country: value, percentage: 0 }]
    updatePlatform(platformIndex, 'topCountries', newCountries)
    setPlatformCountryInputs((prev) => ({ ...prev, [platformIndex]: '' }))
  }

  const removeCountryTag = (platformIndex: number, countryIndex: number) => {
    removeTopCountry(platformIndex, countryIndex)
  }

  const toggleAgeGroupTag = (platformIndex: number, ageRange: string) => {
    const platform = editFormData.platforms[platformIndex]
    if (!platform.topAgeGroups) {
      updatePlatform(platformIndex, 'topAgeGroups', [])
    }
    const existingIndex = (platform.topAgeGroups || []).findIndex((a) => a.ageRange === ageRange)
    if (existingIndex >= 0) {
      const newAgeGroups = (platform.topAgeGroups || []).filter((_, i) => i !== existingIndex)
      updatePlatform(platformIndex, 'topAgeGroups', newAgeGroups)
    } else {
      if ((platform.topAgeGroups || []).length >= 3) return
      const newAgeGroups = [...(platform.topAgeGroups || []), { ageRange, percentage: 0 }]
      updatePlatform(platformIndex, 'topAgeGroups', newAgeGroups)
    }
  }

  const getAvailableCountries = (platformIndex: number) => {
    const platform = editFormData.platforms[platformIndex]
    const selected = (platform.topCountries || []).map((c) => c.country)
    const query = (platformCountryInputs[platformIndex] || '').toLowerCase()
    if (!query.trim()) return []
    return COUNTRIES.filter(
      (c) => !selected.includes(c) && c.toLowerCase().includes(query)
    ).slice(0, 8) // keep dropdown compact
  }

  const handleCreatorImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      showError('Invalid File Type', 'Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('File Too Large', 'Image must be less than 5MB')
      return
    }

    try {
      // Store the File object for upload
      setCreatorProfilePictureFile(file)
      
      // Create preview for display
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string)
        setEditFormData({
          ...editFormData,
          profilePicture: reader.result as string, // Keep preview URL for display
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error handling image:', error)
    }
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>
        
        <div className="max-w-7xl mx-auto pt-4 pb-8" style={{ paddingLeft: 'clamp(0.5rem, 3%, 3rem)', paddingRight: '2rem' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Profile
            </h1>
            <p className="text-lg text-gray-600 font-medium mb-6">
              Manage your profile information
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Creator Profile Tabs */}
              {userType === 'creator' && creatorProfile && (
                <>
                  {/* Header with Tabs and Action Buttons */}
                  <div className="pt-6 pr-6 pb-6 pl-0 mb-6" style={{ backgroundColor: '#f9f8f6' }}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      {/* Tab Navigation */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setActiveCreatorTab('overview')}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                            activeCreatorTab === 'overview'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Overview
                        </button>
                        <button
                          onClick={() => setActiveCreatorTab('platforms')}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                            activeCreatorTab === 'platforms'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Social Media Platforms
                        </button>
                        <button
                          onClick={() => setActiveCreatorTab('reviews')}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                            activeCreatorTab === 'reviews'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Reviews & Ratings
                        </button>
                      </div>
                      {/* Action Buttons */}
                      {isEditingProfile ? (
                        <div className="flex gap-3">
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSavingProfile}
                            className="px-4 py-2.5 rounded-lg font-semibold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={isSavingProfile || !editFormData.name || !editFormData.shortDescription || !editFormData.location}
                            className="px-4 py-2.5 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSavingProfile ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="p-2.5 rounded-lg bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center"
                          title="Edit Profile"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
                    {/* Overview Tab */}
                    {activeCreatorTab === 'overview' && (
                      <div className="space-y-5">
                        {/* Edit Profile Section */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
                              <p className="text-xs text-gray-500">Update your profile details</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col-reverse md:flex-row gap-5">
                          {/* Left Column: Name & Location */}
                          <div className="flex-1 space-y-3">
                            <Input
                              label="Name *"
                              type="text"
                              value={isEditingProfile ? editFormData.name : creatorProfile.name}
                              onChange={(e) => {
                                if (isEditingProfile) {
                                  setEditFormData({ ...editFormData, name: e.target.value })
                                }
                              }}
                              disabled={!isEditingProfile}
                              required
                              placeholder="Your full name"
                              leadingIcon={<UserIcon className="w-5 h-5 text-gray-400" />}
                            />

                            <Input
                              label="Location *"
                              type="text"
                              value={isEditingProfile ? editFormData.location : creatorProfile.location}
                              onChange={(e) => {
                                if (isEditingProfile) {
                                  setEditFormData({ ...editFormData, location: e.target.value })
                                }
                              }}
                              disabled={!isEditingProfile}
                              required
                              placeholder="e.g., New York, USA"
                              leadingIcon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
                            />
                          </div>

                          {/* Right Column: Profile Picture */}
                          <div className="w-full md:w-auto flex flex-col items-center gap-2">
                            <span className="text-xs font-semibold text-gray-700">Profile Picture</span>
                            <div
                              className={`relative w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center transition-all overflow-hidden bg-gray-50 group ${
                                isEditingProfile ? 'cursor-pointer hover:border-primary-500 hover:bg-gray-50' : 'cursor-default'
                              }`}
                              onClick={() => {
                                if (isEditingProfile) {
                                  fileInputRef.current?.click()
                                }
                              }}
                            >
                              {(() => {
                                const profilePic = isEditingProfile ? editFormData.profilePicture : creatorProfile.profilePicture
                                return profilePic && profilePic.trim() !== ''
                              })() ? (
                                <>
                                  <img
                                    src={(isEditingProfile ? editFormData.profilePicture : creatorProfile.profilePicture) || ''}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // If image fails to load, hide it and show upload placeholder
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                    }}
                                  />
                                  {isEditingProfile && (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span className="text-white text-[10px] font-medium">Change</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div className="w-6 h-6 text-gray-400 mb-1 group-hover:text-primary-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                    </svg>
                                  </div>
                                  <span className="text-[10px] text-gray-500 font-medium group-hover:text-primary-600">Upload</span>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 text-center">Optional - JPG, PNG or WebP (max 5MB)</p>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleCreatorImageChange}
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Textarea
                            label="Creator Biography *"
                            value={isEditingProfile ? editFormData.shortDescription : creatorProfile.shortDescription}
                            onChange={(e) => {
                              if (isEditingProfile) {
                                setEditFormData({ ...editFormData, shortDescription: e.target.value })
                              }
                            }}
                            disabled={!isEditingProfile}
                            required
                            placeholder="Tell us about yourself as a travel creator..."
                            rows={3}
                            maxLength={500}
                            helperText={`${(isEditingProfile ? editFormData.shortDescription : creatorProfile.shortDescription).length}/500 characters`}
                          />
                          <p className="text-xs text-gray-500 mt-1">Highlight your niche, primary audience demographics, and unique travel style.</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-gray-700">Portfolio Link</h4>
                          <Input
                            label=""
                            type="url"
                            value={isEditingProfile ? editFormData.portfolioLink : (creatorProfile.portfolioLink || '')}
                            onChange={(e) => {
                              if (isEditingProfile) {
                                setEditFormData({ ...editFormData, portfolioLink: e.target.value })
                              }
                            }}
                            disabled={!isEditingProfile}
                            placeholder="https://your-portfolio.com"
                            helperText="Optional - Your website, media kit, or best-performing content URL"
                            leadingIcon={<LinkIcon className="w-5 h-5 text-gray-400" />}
                          />
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-4 pt-2">
                          <div>
                            <h4 className="text-base font-bold text-gray-900">Contact Information</h4>
                            <p className="text-sm text-gray-500 mt-1">Your email & phone number for direct communication with properties after both accept a collaboration</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Email *"
                              type="email"
                              value={typeof window !== 'undefined' ? localStorage.getItem('userEmail') || email : email}
                              disabled
                              required
                              leadingIcon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
                              className="bg-gray-50 text-gray-500"
                            />
                            <Input
                              label="Phone *"
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => {
                                if (isEditingProfile) {
                                  setPhone(e.target.value)
                                }
                              }}
                              disabled={!isEditingProfile}
                              placeholder="+1-555-123-4567"
                              leadingIcon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social Media Platforms Tab */}
                    {activeCreatorTab === 'platforms' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Social Media Platforms</h2>
                        </div>

                        {!isEditingProfile ? (
                          <div className="space-y-4">
                            {creatorProfile.platforms && creatorProfile.platforms.length > 0 ? (
                              creatorProfile.platforms.map((platform, index) => {
                                const platformColors: Record<string, string> = {
                                  Instagram: 'from-yellow-400 via-pink-500 to-purple-600',
                                  TikTok: 'from-gray-900 to-gray-800',
                                  YouTube: 'from-red-600 to-red-500',
                                  Facebook: 'from-blue-600 to-blue-500',
                                }

                                const renderPlatformIcon = () => {
                                  if (platform.name === 'Instagram') {
                                    return (
                                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                                      </svg>
                                    )
                                  }
                                  if (platform.name === 'TikTok') {
                                    return (
                                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.96-.1z" />
                                      </svg>
                                    )
                                  }
                                  if (platform.name === 'YouTube') {
                                    return (
                                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                      </svg>
                                    )
                                  }
                                  return (
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                  )
                                }

                                return (
                                  <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                                  >
                                    {/* Platform Header */}
                                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-white bg-gradient-to-br ${platformColors[platform.name] || 'from-gray-500 to-gray-400'}`}>
                                        {renderPlatformIcon()}
                                      </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 text-lg">{platform.name}</h3>
                                      </div>
                                      <div className="flex items-center gap-2 text-gray-700">
                                        <span className="font-medium">{platform.handle}</span>
                                        <span className="text-gray-400">•</span>
                                        <span>{formatFollowersDE(platform.followers ?? 0)} Follower</span>
                                        <span className="text-gray-400">•</span>
                                        <span>{(platform.engagementRate ?? 0).toFixed(1).replace('.', ',')}% Engagement</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Platform Metrics */}
                                  {(platform.topCountries && platform.topCountries.length > 0) ||
                                   (platform.topAgeGroups && platform.topAgeGroups.length > 0) ||
                                   platform.genderSplit ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      {/* Top Countries */}
                                      {platform.topCountries && platform.topCountries.length > 0 && (
                                        <div>
                                          <div className="text-sm font-semibold text-gray-700 mb-2">Top Countries</div>
                                          <ul className="space-y-2">
                                            {platform.topCountries.map((country, idx) => (
                                              <li key={idx} className="flex items-center gap-2">
                                                <span className="text-lg">{getCountryFlag(country.country)}</span>
                                                <span className="text-sm text-gray-700">{country.country}: <span className="font-semibold text-gray-900">{country.percentage}%</span></span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Top Age Groups */}
                                      {platform.topAgeGroups && platform.topAgeGroups.length > 0 && (
                                        <div>
                                          <div className="text-sm font-semibold text-gray-700 mb-2">Top Age Groups</div>
                                          <ul className="space-y-2">
                                            {platform.topAgeGroups.map((ageGroup, idx) => (
                                              <li key={idx} className="text-sm text-gray-700">
                                                {ageGroup.ageRange}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Gender Split */}
                                      {platform.genderSplit && (
                                        <div>
                                          <div className="text-sm font-semibold text-gray-700 mb-2">Gender Split</div>
                                          <div className="space-y-2">
                                            <div className="text-sm text-gray-700">Male: <span className="font-semibold text-gray-900">{platform.genderSplit.male}%</span></div>
                                            <div className="text-sm text-gray-700">Female: <span className="font-semibold text-gray-900">{platform.genderSplit.female}%</span></div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-500 italic">
                                      No additional metrics available. Edit your profile to add platform metrics.
                                    </div>
                                  )}
                                </div>
                                )
                              })
                            ) : (
                              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                <p className="text-gray-500">No platforms added yet. Edit your profile to add social media platforms.</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center shadow-sm">
                                  <LinkIcon className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900">Connect Your Platforms</h3>
                                  <p className="text-sm text-gray-600">
                                    Link your accounts and define your audience per platform
                                  </p>
                                </div>
                              </div>

                              <p className="text-sm text-gray-700">
                                Add at least one platform with audience demographics to help match you with the right properties.
                              </p>

                              {/* Platform Cards Grid */}
                              <div className="space-y-3 mt-4">
                            {PLATFORM_OPTIONS.map((platformName) => {
                              const isAdded = editFormData.platforms.some((p) => p.name === platformName)
                              const platformIndex = editFormData.platforms.findIndex((p) => p.name === platformName)

                              const platformColors: Record<string, string> = {
                                Instagram: 'from-yellow-400 via-pink-500 to-purple-600',
                                TikTok: 'from-gray-900 to-gray-800',
                                YouTube: 'from-red-600 to-red-500',
                                Facebook: 'from-blue-600 to-blue-500',
                              }

                              const renderIcon = () => {
                                if (platformName === 'Instagram') {
                                  return (
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                                    </svg>
                                  )
                                }
                                if (platformName === 'TikTok') {
                                  return (
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.96-.1z" />
                                    </svg>
                                  )
                                }
                                if (platformName === 'YouTube') {
                                  return (
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                  )
                                }
                                return (
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                  </svg>
                                )
                              }

                              return (
                                <div key={platformName} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
                                  <div className="flex items-center justify-between gap-4 p-4">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm text-white bg-gradient-to-br ${platformColors[platformName] || 'from-gray-500 to-gray-400'}`}>
                                        {renderIcon()}
                                      </div>
                                      <div>
                                        <p className="font-bold text-gray-900 text-lg">{platformName}</p>
                                      </div>
                                    </div>

                                    {isAdded && platformIndex !== -1 ? (
                                      <button
                                        type="button"
                                        onClick={() => removePlatform(platformIndex)}
                                        className="px-4 py-2 border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                                      >
                                        Cancel
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditFormData({
                                            ...editFormData,
                                            platforms: [
                                              ...editFormData.platforms,
                                              {
                                                name: platformName,
                                                handle: '',
                                                followers: 0,
                                                engagementRate: 0,
                                                topCountries: [],
                                                topAgeGroups: [],
                                                genderSplit: { male: 0, female: 0 },
                                              },
                                            ],
                                          })
                                        }}
                                        className="px-4 py-2 border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                                      >
                                        Add
                                      </button>
                                    )}
                                  </div>

                                  {isAdded && platformIndex !== -1 && (
                                    <div className="border-t border-gray-100 bg-white px-4 md:px-6 pb-5 pt-4 rounded-b-2xl">
                                      <div className="space-y-3 mb-4">
                                        <Input
                                          label="Username"
                                          type="text"
                                          value={platformIndex >= 0 ? editFormData.platforms[platformIndex].handle : ''}
                                          onChange={(e) => updatePlatform(platformIndex, 'handle', e.target.value)}
                                          placeholder="@ username"
                                          required
                                          className="bg-gray-50"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <Input
                                            label="Followers"
                                            type="number"
                                            value={platformIndex >= 0 ? editFormData.platforms[platformIndex].followers || '' : ''}
                                            onChange={(e) => updatePlatform(platformIndex, 'followers', e.target.value === '' ? '' : parseInt(e.target.value))}
                                            required
                                            placeholder="0"
                                            min={1}
                                            className="bg-gray-50"
                                          />
                                          <Input
                                            label="Engagement Rate (%)"
                                            type="number"
                                            value={platformIndex >= 0 ? editFormData.platforms[platformIndex].engagementRate || '' : ''}
                                            onChange={(e) => {
                                              const raw = e.target.value.replace(',', '.')
                                              updatePlatform(platformIndex, 'engagementRate', raw === '' ? '' : parseFloat(raw))
                                            }}
                                            required
                                            placeholder="0.00"
                                            min={0.01}
                                            max={100}
                                            step="0.01"
                                            className="bg-gray-50"
                                          />
                                        </div>
                                      </div>

                                      <div className="bg-white border border-gray-200 rounded-xl p-3">
                                        <button
                                          type="button"
                                          onClick={() => togglePlatformExpanded(platformIndex)}
                                          className="flex items-center justify-between w-full text-left"
                                        >
                                          <span className="text-sm font-semibold text-gray-800">Audience Demographics (Optional)</span>
                                          {expandedPlatforms.has(platformIndex) ? (
                                            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                          ) : (
                                            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                          )}
                                        </button>

                                        {expandedPlatforms.has(platformIndex) && (
                                          <div className="mt-4 space-y-4">
                                            {/* Top Countries */}
                                            <div className="space-y-2">
                                              <div className="flex items-center justify-between">
                                                <div>
                                                  <p className="text-sm font-semibold text-gray-800">Top Countries</p>
                                                  <p className="text-xs text-gray-500">Select up to 3 countries with their audience percentage</p>
                                                </div>
                                              </div>
                                              <div className="space-y-2">
                                                <input
                                                  type="text"
                                                  value={platformCountryInputs[platformIndex] || ''}
                                                  onChange={(e) => handleCountryInputChange(platformIndex, e.target.value)}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault()
                                                      addCountryFromInput(platformIndex)
                                                    }
                                                  }}
                                                  placeholder="Search countries..."
                                                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                                                />
                                                {/* Dropdown suggestions */}
                                                {getAvailableCountries(platformIndex).length > 0 && (
                                                  <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                                                    {getAvailableCountries(platformIndex).map((country) => (
                                                      <button
                                                        key={country}
                                                        type="button"
                                                        onClick={() => addCountryFromInput(platformIndex, country)}
                                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50"
                                                      >
                                                        {country}
                                                      </button>
                                                    ))}
                                                  </div>
                                                )}
                                                {editFormData.platforms[platformIndex]?.topCountries?.length ? (
                                                  <div className="space-y-2">
                                                    {editFormData.platforms[platformIndex].topCountries!.map((country, countryIndex) => (
                                                      <div
                                                        key={`${country.country}-${countryIndex}`}
                                                        className="flex items-center gap-3 rounded-lg border border-gray-200 bg-primary-50/60 px-3 py-2"
                                                      >
                                                        <div className="flex-1 min-w-0">
                                                          <p className="text-sm font-semibold text-gray-800 truncate">{country.country || 'Country'}</p>
                                                          <p className="text-xs text-gray-500">Audience percentage</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                          <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1">
                                                            <input
                                                              type="text"
                                                              inputMode="decimal"
                                                              value={country.percentage && country.percentage > 0 ? country.percentage : ''}
                                                              onChange={(e) => {
                                                                const raw = e.target.value
                                                                const parsed = raw === '' ? 0 : parseFloat(raw)
                                                                updateTopCountry(platformIndex, countryIndex, 'percentage', parsed)
                                                              }}
                                                              placeholder="0"
                                                              className="w-16 bg-transparent text-sm text-gray-800 outline-none"
                                                            />
                                                            <span className="text-sm text-gray-500">%</span>
                                                          </div>
                                                          <button
                                                            type="button"
                                                            onClick={() => removeCountryTag(platformIndex, countryIndex)}
                                                            className="p-1 text-gray-500 hover:text-primary-700"
                                                            aria-label={`Remove ${country.country}`}
                                                          >
                                                            <XMarkIcon className="w-4 h-4" />
                                                          </button>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                ) : (
                                                  <p className="text-xs text-gray-500">Add up to 3 countries and set the audience % for each.</p>
                                                )}
                                              </div>
                                            </div>

                                            {/* Top Age Groups */}
                                            <div className="space-y-2">
                                              <div>
                                                <p className="text-sm font-semibold text-gray-800">Age Groups</p>
                                                <p className="text-xs text-gray-500">Select up to 3 age groups with their audience percentage</p>
                                              </div>
                                              <div className="flex flex-wrap gap-2">
                                                {AGE_GROUP_OPTIONS.map((range) => {
                                                  const isSelected = editFormData.platforms[platformIndex]?.topAgeGroups?.some((a) => a.ageRange === range)
                                                  return (
                                                    <button
                                                      key={range}
                                                      type="button"
                                                      onClick={() => toggleAgeGroupTag(platformIndex, range)}
                                                      className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
                                                        isSelected
                                                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                                                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary-200 hover:text-primary-700'
                                                      }`}
                                                    >
                                                      {range}
                                                    </button>
                                                  )
                                                })}
                                              </div>
                                            </div>

                                            {/* Gender Split */}
                                            <div className="space-y-2">
                                              <p className="text-sm font-semibold text-gray-800">Gender Split</p>
                                              <div className="grid grid-cols-2 gap-3">
                                                <Input
                                                  label="Male %"
                                                  type="number"
                                                  value={editFormData.platforms[platformIndex]?.genderSplit?.male && editFormData.platforms[platformIndex].genderSplit!.male > 0 ? editFormData.platforms[platformIndex].genderSplit!.male : ''}
                                                  onChange={(e) => {
                                                    const val = e.target.value
                                                    const cleanVal = val === '' ? '' : val.replace(/^0+(?=\d)/, '') || val
                                                    updateGenderSplit(platformIndex, 'male', cleanVal === '' ? 0 : parseInt(cleanVal))
                                                  }}
                                                  placeholder="45"
                                                  min={0}
                                                  max={100}
                                                  step="0.1"
                                                  className="bg-gray-50"
                                                />
                                                <Input
                                                  label="Female %"
                                                  type="number"
                                                  value={editFormData.platforms[platformIndex]?.genderSplit?.female && editFormData.platforms[platformIndex].genderSplit!.female > 0 ? editFormData.platforms[platformIndex].genderSplit!.female : ''}
                                                  onChange={(e) => {
                                                    const val = e.target.value
                                                    const cleanVal = val === '' ? '' : val.replace(/^0+(?=\d)/, '') || val
                                                    updateGenderSplit(platformIndex, 'female', cleanVal === '' ? 0 : parseInt(cleanVal))
                                                  }}
                                                  placeholder="55"
                                                  min={0}
                                                  max={100}
                                                  step="0.1"
                                                  className="bg-gray-50"
                                                />
                                              </div>
                                              {editFormData.platforms[platformIndex]?.genderSplit && (editFormData.platforms[platformIndex].genderSplit!.male + editFormData.platforms[platformIndex].genderSplit!.female) > 100 && (
                                                <p className="text-xs text-red-600 mt-1">⚠️ Total &gt; 100%</p>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Error Message */}
                          {editFormData.platforms.length === 0 && (
                            <p className="text-center text-orange-700 font-medium text-sm mt-4">
                              Connect at least one platform to complete your profile
                            </p>
                          )}

                              {/* Info Box */}
                              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
                                <InformationCircleIcon className="w-5 h-5 text-primary-600" />
                                <p className="leading-snug">
                                  All data should be verifiable via platform insights (e.g., Instagram Insights, YouTube Analytics).
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reviews & Ratings Tab */}
                    {activeCreatorTab === 'reviews' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
                        </div>

                        {creatorProfile.rating && creatorProfile.rating.totalReviews > 0 ? (
                          <div className="space-y-6">
                            {/* Rating Summary */}
                            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Rating</h3>
                                  <StarRating
                                    rating={creatorProfile.rating.averageRating ?? 0}
                                    totalReviews={creatorProfile.rating.totalReviews ?? 0}
                                    size="lg"
                                  />
                                </div>
                                <div className="text-right">
                                  <div className="text-4xl font-bold text-gray-900">
                                    {(creatorProfile.rating?.averageRating ?? 0).toFixed(1)}
                                  </div>
                                  <div className="text-sm text-gray-600">out of 5.0</div>
                                </div>
                              </div>
                            </div>

                            {/* Reviews List */}
                            {creatorProfile.rating.reviews && creatorProfile.rating.reviews.length > 0 ? (
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  All Reviews ({creatorProfile.rating.reviews.length})
                                </h3>
                                <div className="space-y-4">
                                  {creatorProfile.rating.reviews.map((review) => (
                                    <div
                                      key={review.id}
                                      className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-gray-900 mb-1">
                                            {review.hotelName}
                                          </h4>
                                          <p className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                            })}
                                          </p>
                                        </div>
                                        <StarRating
                                          rating={review.rating}
                                          size="sm"
                                          showNumber={false}
                                          showReviews={false}
                                        />
                                      </div>
                                      {review.comment && (
                                        <p className="text-gray-700 leading-relaxed mt-3">
                                          {review.comment}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">No reviews yet</p>
                                <p className="text-sm text-gray-500 mt-2">
                                  Reviews from hotels will appear here after collaborations
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                            <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">No reviews yet</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Reviews from hotels will appear here after collaborations
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Hotel Profile Tabs */}
              {userType === 'hotel' && hotelProfile && (
                <>
                  {/* Tab Navigation with Edit Button */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 w-fit">
                      <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveHotelTab('overview')}
                        className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          activeHotelTab === 'overview'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => setActiveHotelTab('listings')}
                        className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                          activeHotelTab === 'listings'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                      >
                        Listings
                      </button>
                      </div>
                    </div>
                    {activeHotelTab === 'overview' && (
                      <>
                        {!isEditingHotelProfile ? (
                          <Button
                            variant="outline"
                            onClick={() => setIsEditingHotelProfile(true)}
                          >
                            <PencilIcon className="w-5 h-5 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={handleCancelHotelEdit}
                              disabled={isSavingHotelProfile}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              onClick={handleSaveHotelProfile}
                              isLoading={isSavingHotelProfile}
                              disabled={!hotelEditFormData.name || !hotelEditFormData.location}
                            >
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Tab Content */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {activeHotelTab === 'overview' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                        </div>

                        {!isEditingHotelProfile ? (
                          <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="flex items-start gap-6">
                              {/* Hotel Picture */}
                              <div className="flex-shrink-0">
                                {hotelProfile.picture && hotelProfile.picture.trim() !== '' ? (
                                  <button
                                    onClick={() => setShowHotelPictureModal(true)}
                                    className="cursor-pointer hover:opacity-90 transition-opacity"
                                  >
                                    <img
                                      src={hotelProfile.picture}
                                      alt={hotelProfile.name}
                                      className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-100 shadow-lg"
                                    />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setShowHotelPictureModal(true)}
                                    className="cursor-pointer hover:opacity-90 transition-opacity"
                                  >
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-5xl shadow-lg border-4 border-gray-100">
                                      {hotelProfile.name.charAt(0)}
                                    </div>
                                  </button>
                                )}
                              </div>

                              {/* Hotel Information */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-3xl font-bold text-gray-900">{hotelProfile.name}</h3>
                                  {hotelProfile.status === 'verified' && (
                                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                                      <CheckBadgeIcon className="w-5 h-5" />
                                      <span className="text-sm font-semibold">Verified</span>
                                    </div>
                                  )}
                                </div>

                                {/* Location */}
                                <div className="flex items-center gap-2 text-gray-600 mb-4">
                                  <MapPinIcon className="w-5 h-5" />
                                  <span className="text-lg">{hotelProfile.location}</span>
                                </div>

                                {/* Website */}
                                {hotelProfile.website && (
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                    <a
                                      href={hotelProfile.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary-600 hover:text-primary-700 font-semibold text-base"
                                    >
                                      {hotelProfile.website}
                                    </a>
                                  </div>
                                )}

                                {/* Description */}
                                {hotelProfile.about && (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <p className="text-gray-700 leading-relaxed">{hotelProfile.about}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Contact Information Section in View Mode */}
                            <div className="pt-8 border-t border-gray-200">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                              </div>
                              <div className="space-y-4">
                                {/* Email Display */}
                                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="flex items-center gap-3 mb-2">
                                    <svg
                                      className="w-5 h-5 text-gray-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <label className="text-sm font-medium text-gray-700">E-Mail</label>
                                  </div>
                                  <p className="text-lg font-semibold text-gray-900 ml-8">{email || 'Not provided'}</p>
                                </div>

                                {/* Phone Display */}
                                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="flex items-center gap-3 mb-2">
                                    <svg
                                      className="w-5 h-5 text-gray-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                      />
                                    </svg>
                                    <label className="text-sm font-medium text-gray-700">Telefon</label>
                                  </div>
                                  <p className="text-lg font-semibold text-gray-900 ml-8">{phone || 'Not provided'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Input
                                  label="Name"
                                  value={hotelEditFormData.name}
                                  onChange={(e) => setHotelEditFormData({ ...hotelEditFormData, name: e.target.value })}
                                  required
                                  placeholder="Hotel name"
                                />
                              </div>
                            </div>
                            <div>
                              <Input
                                label="Location"
                                value={hotelEditFormData.location}
                                onChange={(e) => setHotelEditFormData({ ...hotelEditFormData, location: e.target.value })}
                                required
                                placeholder="City, Country"
                              />
                            </div>
                            <div>
                              <Input
                                label="Website (optional)"
                                type="url"
                                value={hotelEditFormData.website}
                                onChange={(e) => setHotelEditFormData({ ...hotelEditFormData, website: e.target.value })}
                                placeholder="https://example.com"
                              />
                            </div>
                            <div>
                              <Textarea
                                label="About (optional)"
                                value={hotelEditFormData.about}
                                onChange={(e) => setHotelEditFormData({ ...hotelEditFormData, about: e.target.value })}
                                rows={6}
                                placeholder="Describe your hotel..."
                              />
                            </div>

                            {/* Contact Information Section */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <Input
                                    label="E-Mail"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    helperText="Your email address for contact"
                                  />
                                </div>
                                <div>
                                  <Input
                                    label="Telefon (optional)"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                    helperText="Your phone number for contact"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {activeHotelTab === 'listings' && (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
                          </div>
                          <Button
                            variant="primary"
                            onClick={openAddListingModal}
                          >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Listing
                          </Button>
                        </div>

                        {hotelProfile.listings && hotelProfile.listings.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hotelProfile.listings.map((listing) => (
                              <div
                                key={listing.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                              >
                                {/* Listing Image */}
                                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
                                  {listing.images && listing.images.length > 0 ? (
                                    <img
                                      src={listing.images[0]}
                                      alt={listing.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-primary-600 text-3xl font-bold">
                                        {listing.name.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                  {/* Status Badge */}
                                  <div className="absolute top-3 right-3">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        listing.status === 'verified'
                                          ? 'bg-green-100 text-green-700'
                                          : listing.status === 'pending'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}
                                    >
                                      {listing.status === 'verified' ? 'Verified' : listing.status === 'pending' ? 'Pending' : 'Rejected'}
                                    </span>
                                  </div>
                                </div>

                                {/* Listing Info */}
                                <div className="p-6">
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.name}</h3>
                                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                                    <MapPinIcon className="w-4 h-4" />
                                    <span className="text-sm">{listing.location}</span>
                                  </div>
                                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{listing.description}</p>

                                  {/* Listing Details */}
                                  <div className="space-y-2 mb-4">
                                    {listing.accommodationType && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Type:</span>
                                        <span className="text-xs font-medium text-gray-700">{listing.accommodationType}</span>
                                      </div>
                                    )}
                                    {listing.collaborationTypes && listing.collaborationTypes.length > 0 && (
                                      <div>
                                        <span className="text-xs text-gray-500">Collaboration:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {listing.collaborationTypes.map((type, idx) => (
                                            <span
                                              key={idx}
                                              className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium"
                                            >
                                              {type}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {listing.platforms && listing.platforms.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Platforms:</span>
                                        <span className="text-xs font-medium text-gray-700">{listing.platforms.join(', ')}</span>
                                      </div>
                                    )}
                                    {listing.availability && listing.availability.length > 0 && (
                                      <div>
                                        <span className="text-xs text-gray-500">Availability:</span>
                                        <span className="text-xs font-medium text-gray-700 ml-1">
                                          {listing.availability.length} months
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1"
                                      onClick={() => openEditListingModal(listing)}
                                    >
                                      <PencilIcon className="w-4 h-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                                      onClick={() => handleDeleteListing(listing.id)}
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-500 text-lg mb-4">No listings yet</p>
                            <Button
                              variant="primary"
                              onClick={openAddListingModal}
                            >
                              <PlusIcon className="w-5 h-5 mr-2" />
                              Create Your First Listing
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Empty State - Profile data not available */}
              {!loading && !creatorProfile && !hotelProfile && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Profile Data Unavailable
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your profile status is being checked, but profile data endpoints are currently unavailable. 
                      You can still manage your profile through the profile completion page.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => router.push(ROUTES.PROFILE_COMPLETE)}
                    >
                      Go to Profile Completion
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Hotel Picture Modal */}
      {showHotelPictureModal && hotelProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowHotelPictureModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">Hotel Picture</h3>
              <button
                onClick={() => setShowHotelPictureModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Large Picture Preview */}
              <div className="flex justify-center">
                {hotelProfile.picture ? (
                  <img
                    src={hotelProfile.picture}
                    alt={hotelProfile.name}
                    className="w-64 h-64 rounded-2xl object-cover border-4 border-gray-100 shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-8xl shadow-lg border-4 border-gray-100">
                    {hotelProfile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <input
                  ref={hotelFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      if (!file.type.startsWith('image/')) {
                        showError('Invalid File Type', 'Please select an image file')
                        return
                      }
                      
                      // Validate file size (5MB max)
                      if (file.size > 5 * 1024 * 1024) {
                        showError('File Too Large', 'Image must be less than 5MB')
                        return
                      }
                      
                      // Store the File object for upload
                      setHotelProfilePictureFile(file)
                      
                      // Show preview immediately
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        const result = reader.result as string
                        setHotelPicturePreview(result)
                        setHotelEditFormData({ ...hotelEditFormData, picture: result })
                      }
                      reader.readAsDataURL(file)
                      // Reset preview
                      setHotelPicturePreview(null)
                      setHotelEditFormData({ ...hotelEditFormData, picture: hotelProfile?.picture || '' })
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    hotelFileInputRef.current?.click()
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Change Picture
                </Button>
                {hotelProfile.picture && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (hotelProfile) {
                        setHotelProfile({
                          ...hotelProfile,
                          picture: undefined,
                        })
                        setHotelEditFormData({
                          ...hotelEditFormData,
                          picture: '',
                        })
                        setHotelPicturePreview(null)
                        if (hotelFileInputRef.current) {
                          hotelFileInputRef.current.value = ''
                        }
                      }
                      setShowHotelPictureModal(false)
                    }}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Delete Picture
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Modal */}
      {showPictureModal && creatorProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowPictureModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">Profile Picture</h3>
              <button
                onClick={() => setShowPictureModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Large Picture Preview */}
              <div className="flex justify-center">
                {creatorProfile.profilePicture && creatorProfile.profilePicture.trim() !== '' ? (
                  <img
                    src={creatorProfile.profilePicture}
                    alt={creatorProfile.name}
                    className="w-64 h-64 rounded-2xl object-cover border-4 border-gray-100 shadow-lg"
                    onError={(e) => {
                      // If image fails to load, show fallback
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      // Show the fallback div instead
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                ) : (
                  <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-8xl shadow-lg border-4 border-gray-100">
                    {creatorProfile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        const result = reader.result as string
                        setProfilePicturePreview(result)
                        setEditFormData({ ...editFormData, profilePicture: result })
                        setShowPictureModal(false)
                        setIsEditingProfile(true)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    fileInputRef.current?.click()
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Change Picture
                </Button>
                {creatorProfile.profilePicture && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (creatorProfile) {
                        setCreatorProfile({
                          ...creatorProfile,
                          profilePicture: undefined,
                        })
                        setEditFormData({
                          ...editFormData,
                          profilePicture: '',
                        })
                        setProfilePicturePreview(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }
                      setShowPictureModal(false)
                    }}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Delete Picture
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listing Edit/Add Modal */}
      {showListingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={handleCancelListing}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingListingId ? 'Edit Listing' : 'Add New Listing'}
              </h3>
              <button
                onClick={handleCancelListing}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Basic Information Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                  <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Listing Name"
                      value={listingFormData.name}
                      onChange={(e) => setListingFormData({ ...listingFormData, name: e.target.value })}
                      required
                      placeholder="Luxury Beach Villa"
                    />
                    <Input
                      label="Location"
                      value={listingFormData.location}
                      onChange={(e) => setListingFormData({ ...listingFormData, location: e.target.value })}
                      required
                      placeholder="Bali, Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">
                      Accommodation Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={listingFormData.accommodationType}
                      onChange={(e) => setListingFormData({ ...listingFormData, accommodationType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select type</option>
                      {HOTEL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Textarea
                      label="Description"
                      value={listingFormData.description}
                      onChange={(e) => setListingFormData({ ...listingFormData, description: e.target.value })}
                      required
                      rows={4}
                      placeholder="Describe your listing..."
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">Images</label>
                    <div className="space-y-4">
                      {listingFormData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {listingFormData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Listing ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeListingImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input
                        ref={listingImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleListingImageChange}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={addListingImage}
                      >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Image
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offerings Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                  <h2 className="text-xl font-bold text-gray-900">Offerings</h2>
                </div>
                <div className="space-y-6">
                  {/* Collaboration Types */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-3">
                      Collaboration Types
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLLABORATION_TYPES.map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={listingFormData.collaborationTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setListingFormData({
                                  ...listingFormData,
                                  collaborationTypes: [...listingFormData.collaborationTypes, type],
                                })
                              } else {
                                setListingFormData({
                                  ...listingFormData,
                                  collaborationTypes: listingFormData.collaborationTypes.filter((t) => t !== type),
                                })
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="ml-2 text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-3">Availability (Months)</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {MONTHS.map((month) => (
                        <label key={month} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={listingFormData.availability.includes(month)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setListingFormData({
                                  ...listingFormData,
                                  availability: [...listingFormData.availability, month],
                                })
                              } else {
                                setListingFormData({
                                  ...listingFormData,
                                  availability: listingFormData.availability.filter((m) => m !== month),
                                })
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="ml-2 text-gray-700 text-sm">{month}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-3">Platforms</label>
                    <div className="flex flex-wrap gap-3">
                      {PLATFORM_OPTIONS.map((platform) => (
                        <label key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={listingFormData.platforms.includes(platform)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setListingFormData({
                                  ...listingFormData,
                                  platforms: [...listingFormData.platforms, platform],
                                })
                              } else {
                                setListingFormData({
                                  ...listingFormData,
                                  platforms: listingFormData.platforms.filter((p) => p !== platform),
                                })
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="ml-2 text-gray-700">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Free Stay Details */}
                  {listingFormData.collaborationTypes.includes('Free Stay') && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Free Stay Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Min. Nights"
                          type="number"
                          value={listingFormData.freeStayMinNights || ''}
                          onChange={(e) =>
                            setListingFormData({
                              ...listingFormData,
                              freeStayMinNights: parseInt(e.target.value) || undefined,
                            })
                          }
                          placeholder="2"
                        />
                        <Input
                          label="Max. Nights"
                          type="number"
                          value={listingFormData.freeStayMaxNights || ''}
                          onChange={(e) =>
                            setListingFormData({
                              ...listingFormData,
                              freeStayMaxNights: parseInt(e.target.value) || undefined,
                            })
                          }
                          placeholder="5"
                        />
                      </div>
                    </div>
                  )}

                  {/* Paid Details */}
                  {listingFormData.collaborationTypes.includes('Paid') && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Paid Details</h4>
                      <Input
                        label="Max. Amount ($)"
                        type="number"
                        value={listingFormData.paidMaxAmount || ''}
                        onChange={(e) =>
                          setListingFormData({
                            ...listingFormData,
                            paidMaxAmount: parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="5000"
                      />
                    </div>
                  )}

                  {/* Discount Details */}
                  {listingFormData.collaborationTypes.includes('Discount') && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Discount Details</h4>
                      <Input
                        label="Discount Percentage (%)"
                        type="number"
                        value={listingFormData.discountPercentage || ''}
                        onChange={(e) =>
                          setListingFormData({
                            ...listingFormData,
                            discountPercentage: parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="30"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Looking For Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                  <h2 className="text-xl font-bold text-gray-900">Looking For</h2>
                </div>
                <div className="space-y-6">
                  {/* Platforms */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-3">Platforms</label>
                    <div className="flex flex-wrap gap-3">
                      {PLATFORM_OPTIONS.map((platform) => (
                        <label key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={listingFormData.lookingForPlatforms.includes(platform)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setListingFormData({
                                  ...listingFormData,
                                  lookingForPlatforms: [...listingFormData.lookingForPlatforms, platform],
                                })
                              } else {
                                setListingFormData({
                                  ...listingFormData,
                                  lookingForPlatforms: listingFormData.lookingForPlatforms.filter((p) => p !== platform),
                                })
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="ml-2 text-gray-700">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Min Followers */}
                  <div>
                    <Input
                      label="Min. Follower Amount (optional)"
                      type="number"
                      value={listingFormData.lookingForMinFollowers || ''}
                      onChange={(e) =>
                        setListingFormData({
                          ...listingFormData,
                          lookingForMinFollowers: parseInt(e.target.value) || undefined,
                        })
                      }
                      placeholder="50000"
                    />
                  </div>

                  {/* Target Group Countries */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-3">Target Group - Countries</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-4 border border-gray-200 rounded-lg">
                      {COUNTRIES.map((country) => (
                        <label key={country} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={listingFormData.targetGroupCountries.includes(country)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setListingFormData({
                                  ...listingFormData,
                                  targetGroupCountries: [...listingFormData.targetGroupCountries, country],
                                })
                              } else {
                                setListingFormData({
                                  ...listingFormData,
                                  targetGroupCountries: listingFormData.targetGroupCountries.filter((c) => c !== country),
                                })
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <span className="ml-2 text-gray-700 text-sm">{country}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Target Group Age */}
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-3">Target Group - Age Group</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Min. Age (optional)"
                        type="number"
                        value={listingFormData.targetGroupAgeMin || ''}
                        onChange={(e) =>
                          setListingFormData({
                            ...listingFormData,
                            targetGroupAgeMin: parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="25"
                      />
                      <Input
                        label="Max. Age (optional)"
                        type="number"
                        value={listingFormData.targetGroupAgeMax || ''}
                        onChange={(e) =>
                          setListingFormData({
                            ...listingFormData,
                            targetGroupAgeMax: parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="45"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCancelListing}
                  disabled={isSavingListing}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveListing}
                  isLoading={isSavingListing}
                  disabled={!listingFormData.name || !listingFormData.location || !listingFormData.description}
                >
                  {editingListingId ? 'Save Changes' : 'Create Listing'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeError}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
    </main>
  )
}

