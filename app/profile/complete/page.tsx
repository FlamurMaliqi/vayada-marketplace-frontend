'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button, Input, Textarea } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import { checkProfileStatus, isProfileComplete } from '@/lib/utils'
import type { UserType, CreatorProfileStatus, HotelProfileStatus } from '@/lib/types'
import { creatorService } from '@/services/api/creators'
import { hotelService } from '@/services/api/hotels'
import { ApiErrorResponse } from '@/services/api/client'
import {
  XMarkIcon,
  PlusIcon,
  CheckCircleIcon,
  MapPinIcon,
  UserIcon,
  BuildingOfficeIcon,
  LinkIcon,
  PhoneIcon,
  EnvelopeIcon,
  SparklesIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  GiftIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

const HOTEL_CATEGORIES = [
  'Resort',
  'Hotel',
  'Villa',
  'Apartment',
  'Hostel',
  'Boutique Hotel',
  'Luxury Hotel',
  'Eco Resort',
  'Spa Resort',
  'Beach Resort',
]

const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'Facebook']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const COLLABORATION_TYPES = ['Free Stay', 'Paid', 'Discount'] as const
const AGE_GROUP_OPTIONS = ['18-24', '25-34', '35-44', '45-54', '55+']
const COUNTRIES = ['USA', 'Germany', 'UK', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Austria', 'Belgium', 'Canada', 'Australia', 'Japan', 'South Korea', 'Singapore', 'Thailand', 'Indonesia', 'Malaysia', 'Philippines', 'India', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'South Africa', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Egypt']

// Group countries by continent
const COUNTRIES_BY_CONTINENT: Record<string, string[]> = {
  'North America': ['USA', 'Canada', 'Mexico'],
  'Europe': ['Germany', 'UK', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Austria', 'Belgium'],
  'Asia': ['Japan', 'South Korea', 'Singapore', 'Thailand', 'Indonesia', 'Malaysia', 'Philippines', 'India', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'],
  'Oceania': ['Australia'],
  'South America': ['Brazil', 'Argentina', 'Chile'],
  'Africa': ['South Africa', 'Egypt'],
}

const CONTINENT_ORDER = ['North America', 'Europe', 'Asia', 'Oceania', 'South America', 'Africa']

interface PlatformFormData {
  name: string
  handle: string
  followers: number | ''
  engagement_rate: number | ''
  top_countries?: Array<{ country: string; percentage: number }>
  top_age_groups?: Array<{ ageRange: string; percentage: number }>
  gender_split?: { male: number; female: number }
}

export default function ProfileCompletePage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [profileStatus, setProfileStatus] = useState<CreatorProfileStatus | HotelProfileStatus | null>(null)
  const [error, setError] = useState('')
  const [profileCompleted, setProfileCompleted] = useState(false)

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

  // Real-time progress calculation
  const calculateProgress = (): number => {
    if (!userType) return 0

    if (userType === 'creator') {
      let progress = 0
      // Step 1: Basic Info (50% total)
      if (creatorForm.name.trim()) progress += 10
      if (creatorForm.location.trim()) progress += 10
      if (creatorForm.short_description.trim() && creatorForm.short_description.length >= 10) progress += 10
      if (creatorForm.phone.trim()) progress += 10
      if (creatorForm.profile_image) progress += 10

      // Step 2: Platforms (50% total)
      if (creatorPlatforms.length > 0) {
        progress += 20 // Base points for having a platform

        // check first platform for details (30% max)
        const firstPlatform = creatorPlatforms[0]
        if (firstPlatform.name) progress += 5
        if (firstPlatform.handle) progress += 5
        if (firstPlatform.followers !== '') progress += 10
        if (firstPlatform.engagement_rate !== '') progress += 10
      }

      return Math.min(100, progress)
    }

    if (userType === 'hotel') {
      let progress = 0
      // Step 1: Basic Info (50% total)
      if (hotelForm.name.trim() && hotelForm.name.length >= 2) progress += 10
      if (hotelForm.location.trim()) progress += 10
      if (hotelForm.about.trim() && hotelForm.about.length >= 50) progress += 10
      if (hotelForm.website.trim()) progress += 10
      if (hotelForm.phone.trim()) progress += 10

      // Step 2: Listings (50% total)
      if (hotelListings.length > 0) {
        progress += 20
        // check first listing for details
        const firstListing = hotelListings[0]
        if (firstListing.name) progress += 5
        if (firstListing.location) progress += 5
        if (firstListing.description && firstListing.description.length >= 10) progress += 5
        if (firstListing.collaborationTypes.length > 0) progress += 5
        if (firstListing.availability.length > 0) progress += 10
      }

      return Math.min(100, progress)
    }

    return 0
  }

  // Step management
  const [currentStep, setCurrentStep] = useState<number>(1)
  const creatorSteps = ['Basic Information', 'Social Media Platforms']
  const hotelSteps = ['Basic Information', 'Property Listings']

  // Creator form state
  const [creatorForm, setCreatorForm] = useState({
    name: '',
    location: '',
    short_description: '',
    portfolio_link: '',
    phone: '',
    profile_image: '',
  })
  const [creatorPlatforms, setCreatorPlatforms] = useState<PlatformFormData[]>([])
  const [platformCountryInputs, setPlatformCountryInputs] = useState<Record<number, string>>({})
  const [platformSaveStatus, setPlatformSaveStatus] = useState<Record<number, string>>({})
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<number>>(new Set())
  const [collapsedPlatformCards, setCollapsedPlatformCards] = useState<Set<number>>(new Set())

  // Hotel form state
  const [hotelForm, setHotelForm] = useState({
    name: '',
    location: '',
    about: '',
    website: '',
    phone: '',
  })

  // Hotel listing form state
  interface ListingFormData {
    name: string
    location: string
    description: string
    accommodation_type: string
    images: string[]
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
  }
  const [hotelListings, setHotelListings] = useState<ListingFormData[]>([])
  const listingImageInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const creatorImageInputRef = useRef<HTMLInputElement>(null)
  const [collapsedListingCards, setCollapsedListingCards] = useState<Set<number>>(new Set())
  const [expandedContinents, setExpandedContinents] = useState<Record<number, Set<string>>>({})

  useEffect(() => {
    // Get user type from localStorage
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType') as UserType | null
      setUserType(storedUserType)

      // Pre-fill forms with user data
      const userName = localStorage.getItem('userName') || ''

      if (storedUserType === 'hotel') {
        setHotelForm(prev => ({
          ...prev,
          name: userName,
        }))
      } else if (storedUserType === 'creator') {
        setCreatorForm(prev => ({
          ...prev,
          name: userName,
        }))
      }

      if (storedUserType) {
        loadProfileStatus(storedUserType, true) // Skip redirect in closed beta, show completion message if already complete
      } else {
        // No user type, redirect to login
        router.push(ROUTES.LOGIN)
      }
    }
  }, [router])

  const loadProfileStatus = async (type: UserType, skipRedirect = false) => {
    setLoading(true)
    try {
      const status = await checkProfileStatus(type)
      setProfileStatus(status)

      if (status && status.profile_complete && !skipRedirect && !profileCompleted) {
        // Profile already complete, but only redirect if not in completion flow
        // In closed beta, we show completion message instead of redirecting
        setProfileCompleted(true)
        return
      }
    } catch (error) {
      console.error('Failed to load profile status:', error)
    } finally {
      setLoading(false)
    }
  }

  const addPlatform = () => {
    setCreatorPlatforms([
      ...creatorPlatforms,
      {
        name: '',
        handle: '',
        followers: '',
        engagement_rate: '',
      },
    ])
  }

  const removePlatform = (index: number) => {
    setCreatorPlatforms(creatorPlatforms.filter((_, i) => i !== index))
    setPlatformSaveStatus((prev) => {
      const next = { ...prev }
      delete next[index]
      // shift keys above removed index down by 1 to keep alignment
      const shifted: Record<number, string> = {}
      Object.entries(next).forEach(([k, v]) => {
        const num = Number(k)
        shifted[num > index ? num - 1 : num] = v
      })
      return shifted
    })

    // Clean up collapsedPlatformCards: remove the deleted index and adjust all indices greater than it
    const newCollapsed = new Set<number>()
    collapsedPlatformCards.forEach((collapsedIndex) => {
      if (collapsedIndex < index) {
        // Keep indices before the removed one as-is
        newCollapsed.add(collapsedIndex)
      } else if (collapsedIndex > index) {
        // Decrement indices after the removed one
        newCollapsed.add(collapsedIndex - 1)
      }
      // Skip the removed index itself
    })
    setCollapsedPlatformCards(newCollapsed)

    // Clean up expandedPlatforms: remove the deleted index and adjust all indices greater than it
    const newExpanded = new Set<number>()
    expandedPlatforms.forEach((expandedIndex) => {
      if (expandedIndex < index) {
        // Keep indices before the removed one as-is
        newExpanded.add(expandedIndex)
      } else if (expandedIndex > index) {
        // Decrement indices after the removed one
        newExpanded.add(expandedIndex - 1)
      }
      // Skip the removed index itself
    })
    setExpandedPlatforms(newExpanded)
  }

  const updatePlatform = (index: number, field: keyof PlatformFormData, value: any) => {
    const updated = [...creatorPlatforms]
    updated[index] = { ...updated[index], [field]: value }
    setCreatorPlatforms(updated)
  }

  const togglePlatformExpanded = (index: number) => {
    const newExpanded = new Set(expandedPlatforms)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedPlatforms(newExpanded)
  }

  const togglePlatformCardCollapse = (index: number) => {
    const newCollapsed = new Set(collapsedPlatformCards)
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index)
    } else {
      newCollapsed.add(index)
    }
    setCollapsedPlatformCards(newCollapsed)
  }

  const addTopCountry = (platformIndex: number) => {
    const updated = [...creatorPlatforms]
    if (!updated[platformIndex].top_countries) {
      updated[platformIndex].top_countries = []
    }
    updated[platformIndex].top_countries!.push({ country: '', percentage: 0 })
    setCreatorPlatforms(updated)
  }

  const removeTopCountry = (platformIndex: number, countryIndex: number) => {
    const updated = [...creatorPlatforms]
    if (updated[platformIndex].top_countries) {
      updated[platformIndex].top_countries = updated[platformIndex].top_countries!.filter((_, i) => i !== countryIndex)
    }
    setCreatorPlatforms(updated)
  }

  const updateTopCountry = (platformIndex: number, countryIndex: number, field: 'country' | 'percentage', value: string | number) => {
    const updated = [...creatorPlatforms]
    if (updated[platformIndex].top_countries) {
      updated[platformIndex].top_countries![countryIndex] = {
        ...updated[platformIndex].top_countries![countryIndex],
        [field]: value,
      }
    }
    setCreatorPlatforms(updated)
  }

  const addTopAgeGroup = (platformIndex: number) => {
    const updated = [...creatorPlatforms]
    if (!updated[platformIndex].top_age_groups) {
      updated[platformIndex].top_age_groups = []
    }
    updated[platformIndex].top_age_groups!.push({ ageRange: '', percentage: 0 })
    setCreatorPlatforms(updated)
  }

  const removeTopAgeGroup = (platformIndex: number, ageGroupIndex: number) => {
    const updated = [...creatorPlatforms]
    if (updated[platformIndex].top_age_groups) {
      updated[platformIndex].top_age_groups = updated[platformIndex].top_age_groups!.filter((_, i) => i !== ageGroupIndex)
    }
    setCreatorPlatforms(updated)
  }

  const updateTopAgeGroup = (platformIndex: number, ageGroupIndex: number, field: 'ageRange' | 'percentage', value: string | number) => {
    const updated = [...creatorPlatforms]
    if (updated[platformIndex].top_age_groups) {
      updated[platformIndex].top_age_groups![ageGroupIndex] = {
        ...updated[platformIndex].top_age_groups![ageGroupIndex],
        [field]: value,
      }
    }
    setCreatorPlatforms(updated)
  }

  const updateGenderSplit = (platformIndex: number, field: 'male' | 'female', value: string) => {
    const updated = [...creatorPlatforms]
    if (!updated[platformIndex].gender_split) {
      updated[platformIndex].gender_split = { male: 0, female: 0 }
    }
    // Parse the value, handling empty string
    if (value === '' || value === null || value === undefined) {
      updated[platformIndex].gender_split![field] = 0
    } else {
      const numValue = parseFloat(value) || 0
      // Clamp between 0 and 100
      const clampedValue = Math.max(0, Math.min(100, numValue))
      updated[platformIndex].gender_split![field] = clampedValue
    }
    setCreatorPlatforms(updated)
  }

  // Country input helpers for inline picker
  const handleCountryInputChange = (platformIndex: number, value: string) => {
    setPlatformCountryInputs((prev) => ({ ...prev, [platformIndex]: value }))
  }

  const addCountryFromInput = (platformIndex: number, overrideValue?: string) => {
    const value = (overrideValue ?? platformCountryInputs[platformIndex])?.trim()
    if (!value) return
    const updated = [...creatorPlatforms]
    if (!updated[platformIndex].top_countries) {
      updated[platformIndex].top_countries = []
    }
    // Limit to 3 countries
    if (updated[platformIndex].top_countries!.length >= 3) return
    updated[platformIndex].top_countries!.push({ country: value, percentage: 0 })
    setCreatorPlatforms(updated)
    setPlatformCountryInputs((prev) => ({ ...prev, [platformIndex]: '' }))
  }

  const removeCountryTag = (platformIndex: number, countryIndex: number) => {
    removeTopCountry(platformIndex, countryIndex)
  }

  const toggleAgeGroupTag = (platformIndex: number, ageRange: string) => {
    const updated = [...creatorPlatforms]
    if (!updated[platformIndex].top_age_groups) {
      updated[platformIndex].top_age_groups = []
    }
    const existingIndex = updated[platformIndex].top_age_groups!.findIndex((a) => a.ageRange === ageRange)
    if (existingIndex >= 0) {
      updated[platformIndex].top_age_groups = updated[platformIndex].top_age_groups!.filter((_, i) => i !== existingIndex)
    } else {
      if (updated[platformIndex].top_age_groups!.length >= 3) return
      updated[platformIndex].top_age_groups!.push({ ageRange, percentage: 0 })
    }
    setCreatorPlatforms(updated)
  }

  const getAvailableCountries = (platformIndex: number) => {
    const selected = creatorPlatforms[platformIndex].top_countries?.map((c) => c.country) || []
    const query = (platformCountryInputs[platformIndex] || '').toLowerCase()
    return COUNTRIES.filter(
      (c) => !selected.includes(c) && c.toLowerCase().includes(query)
    ).slice(0, 8) // keep dropdown compact
  }

  const validateCreatorForm = (): boolean => {
    if (!creatorForm.name.trim()) {
      setError('Name is required')
      return false
    }

    if (!creatorForm.location.trim()) {
      setError('Location is required')
      return false
    }

    if (!creatorForm.short_description.trim()) {
      setError('Short description is required')
      return false
    }

    if (creatorForm.short_description.trim().length < 10) {
      setError('Short description must be at least 10 characters')
      return false
    }

    if (creatorForm.short_description.trim().length > 500) {
      setError('Short description must be at most 500 characters')
      return false
    }

    if (creatorPlatforms.length === 0) {
      setError('At least one platform is required')
      return false
    }

    for (let i = 0; i < creatorPlatforms.length; i++) {
      const platform = creatorPlatforms[i]
      if (!platform.name) {
        setError(`Platform ${i + 1}: Platform name is required`)
        return false
      }
      if (!platform.handle.trim()) {
        setError(`Platform ${i + 1}: Handle is required`)
        return false
      }
      if (platform.followers === '' || Number(platform.followers) <= 0) {
        setError(`Platform ${i + 1}: Followers must be greater than 0`)
        return false
      }
      if (platform.engagement_rate === '' || Number(platform.engagement_rate) <= 0 || Number(platform.engagement_rate) > 100) {
        setError(`Platform ${i + 1}: Engagement rate must be greater than 0 and less than or equal to 100`)
        return false
      }
    }

    return true
  }

  const validateHotelForm = (): boolean => {
    if (!hotelForm.name.trim() || hotelForm.name.trim().length < 2) {
      setError('Hotel name must be at least 2 characters')
      return false
    }

    if (!hotelForm.location.trim()) {
      setError('Location is required')
      return false
    }

    if (!hotelForm.about.trim()) {
      setError('About section is recommended. Please add a description about your hotel.')
      return false
    }

    if (hotelForm.about.trim().length < 50) {
      setError('About section must be at least 50 characters')
      return false
    }

    if (!hotelForm.website.trim()) {
      setError('Website is recommended. Please add your hotel website URL.')
      return false
    }

    if (hotelListings.length === 0) {
      setError('At least one property listing is required. Please add a listing.')
      return false
    }

    // Validate each listing
    for (let i = 0; i < hotelListings.length; i++) {
      const listing = hotelListings[i]
      if (!listing.name.trim()) {
        setError(`Listing ${i + 1}: Property name is required`)
        return false
      }
      if (!listing.location.trim()) {
        setError(`Listing ${i + 1}: Property location is required`)
        return false
      }
      if (!listing.accommodation_type.trim()) {
        setError(`Listing ${i + 1}: Accommodation type is required`)
        return false
      }
      if (!listing.description.trim()) {
        setError(`Listing ${i + 1}: Property description is required`)
        return false
      }
      if (listing.description.trim().length < 10) {
        setError(`Listing ${i + 1}: Property description must be at least 10 characters`)
        return false
      }
      if (listing.collaborationTypes.length === 0) {
        setError(`Listing ${i + 1}: At least one collaboration type is required`)
        return false
      }
      if (listing.availability.length === 0) {
        setError(`Listing ${i + 1}: At least one availability month is required`)
        return false
      }
      if (listing.platforms.length === 0) {
        setError(`Listing ${i + 1}: At least one platform is required`)
        return false
      }
      if (listing.lookingForPlatforms.length === 0) {
        setError(`Listing ${i + 1}: At least one platform in "Looking For" is required`)
        return false
      }
      if (listing.targetGroupCountries.length === 0) {
        setError(`Listing ${i + 1}: At least one target country is required`)
        return false
      }
      // Validate Free Stay details if selected
      if (listing.collaborationTypes.includes('Free Stay')) {
        if (!listing.freeStayMinNights || listing.freeStayMinNights <= 0) {
          setError(`Listing ${i + 1}: Free Stay requires minimum nights greater than 0`)
          return false
        }
        if (!listing.freeStayMaxNights || listing.freeStayMaxNights <= listing.freeStayMinNights) {
          setError(`Listing ${i + 1}: Free Stay max nights must be greater than min nights`)
          return false
        }
      }
      // Validate Paid details if selected
      if (listing.collaborationTypes.includes('Paid')) {
        if (!listing.paidMaxAmount || listing.paidMaxAmount <= 0) {
          setError(`Listing ${i + 1}: Paid collaboration requires max amount greater than 0`)
          return false
        }
      }
      // Validate Discount details if selected
      if (listing.collaborationTypes.includes('Discount')) {
        if (!listing.discountPercentage || listing.discountPercentage <= 0 || listing.discountPercentage > 100) {
          setError(`Listing ${i + 1}: Discount percentage must be between 1 and 100`)
          return false
        }
      }
    }

    return true
  }

  const addListing = () => {
    setHotelListings([
      ...hotelListings,
      {
        name: '',
        location: hotelForm.location || '',
        description: '',
        accommodation_type: '',
        images: [],
        collaborationTypes: [],
        availability: [],
        platforms: [],
        lookingForPlatforms: [],
        targetGroupCountries: [],
      },
    ])
    listingImageInputRefs.current.push(null)
  }

  const removeListing = (index: number) => {
    setHotelListings(hotelListings.filter((_, i) => i !== index))
    listingImageInputRefs.current = listingImageInputRefs.current.filter((_, i) => i !== index)

    // Clean up collapsedListingCards: remove the deleted index and adjust all indices greater than it
    const newCollapsed = new Set<number>()
    collapsedListingCards.forEach((collapsedIndex) => {
      if (collapsedIndex < index) {
        // Keep indices before the removed one as-is
        newCollapsed.add(collapsedIndex)
      } else if (collapsedIndex > index) {
        // Decrement indices after the removed one
        newCollapsed.add(collapsedIndex - 1)
      }
      // Skip the removed index itself
    })
    setCollapsedListingCards(newCollapsed)
  }

  const toggleListingCardCollapse = (index: number) => {
    const newCollapsed = new Set(collapsedListingCards)
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index)
    } else {
      newCollapsed.add(index)
    }
    setCollapsedListingCards(newCollapsed)
  }

  const toggleContinent = (listingIndex: number, continent: string) => {
    setExpandedContinents((prev) => {
      const listingExpanded = prev[listingIndex] || new Set<string>()
      const newExpanded = new Set(listingExpanded)
      // If in Set, it's expanded - remove to collapse
      // If not in Set, it's collapsed - add to expand
      if (newExpanded.has(continent)) {
        newExpanded.delete(continent) // Remove from Set = collapsed
      } else {
        newExpanded.add(continent) // Add to Set = expanded
      }
      return { ...prev, [listingIndex]: newExpanded }
    })
  }

  const updateListing = (index: number, field: keyof ListingFormData, value: any) => {
    const updated = [...hotelListings]
    updated[index] = { ...updated[index], [field]: value }
    setHotelListings(updated)
  }

  const handleListingImageChange = (listingIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const updated = [...hotelListings]
      updated[listingIndex] = {
        ...updated[listingIndex],
        images: [...updated[listingIndex].images, result],
      }
      setHotelListings(updated)
    }
    reader.readAsDataURL(file)

    // Reset input
    if (listingImageInputRefs.current[listingIndex]) {
      listingImageInputRefs.current[listingIndex]!.value = ''
    }
  }

  const removeListingImage = (listingIndex: number, imageIndex: number) => {
    const updated = [...hotelListings]
    updated[listingIndex] = {
      ...updated[listingIndex],
      images: updated[listingIndex].images.filter((_, i) => i !== imageIndex),
    }
    setHotelListings(updated)
  }

  const handleCreatorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    // Validate file type (image only)
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP)')
      return
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setCreatorForm(prev => ({
        ...prev,
        profile_image: reader.result as string
      }))
      setError('') // Clear any previous errors
    }
    reader.readAsDataURL(file)
  }

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateCreatorForm()) {
      return
    }

    setSubmitting(true)
    try {
      // Prepare platform data
      // Use camelCase for genderSplit, snake_case for other fields
      const platforms = creatorPlatforms.map(p => ({
        name: p.name,
        handle: p.handle,
        followers: Number(p.followers),
        engagementRate: Number(p.engagement_rate), // camelCase for engagementRate
        ...(p.top_countries && p.top_countries.length > 0 && {
          topCountries: p.top_countries.map(tc => ({
            country: tc.country,
            percentage: tc.percentage,
          })),
        }),
        ...(p.top_age_groups && p.top_age_groups.length > 0 && {
          topAgeGroups: p.top_age_groups.map(tag => ({
            ageRange: tag.ageRange,
            percentage: tag.percentage,
          })),
        }),
        ...(p.gender_split && (p.gender_split.male > 0 || p.gender_split.female > 0) && {
          genderSplit: {
            male: p.gender_split.male,
            female: p.gender_split.female,
          },
        }),
      }))

      // Calculate total audience size from platforms
      const audienceSize = platforms.reduce((sum, p) => sum + p.followers, 0)

      // Update creator profile
      // Profile completion endpoint expects camelCase for platforms (genderSplit, engagementRate, etc.)
      const updatePayload = {
        name: creatorForm.name,
        location: creatorForm.location,
        platforms: platforms, // Already in camelCase format
        audienceSize: audienceSize, // camelCase
        ...(creatorForm.portfolio_link && creatorForm.portfolio_link.trim() && {
          portfolioLink: creatorForm.portfolio_link.trim(), // camelCase
        }),
        ...(creatorForm.short_description && creatorForm.short_description.trim() && {
          shortDescription: creatorForm.short_description.trim(), // camelCase
        }),
        ...(creatorForm.phone && creatorForm.phone.trim() && {
          phone: creatorForm.phone.trim(),
        }),
        ...(creatorForm.profile_image && {
          profilePicture: creatorForm.profile_image,
        }),
      }

      await creatorService.updateMyProfile(updatePayload as any)

      // Check if profile is now complete after successful update
      const isComplete = await isProfileComplete('creator')
      if (isComplete) {
        setProfileCompleted(true)
        // Update localStorage so warning banner disappears
        if (typeof window !== 'undefined') {
          localStorage.setItem('profileComplete', 'true')
        }
        await loadProfileStatus('creator', true) // Skip redirect, show completion message
      } else {
        // Reload status to show updated completion steps
        await loadProfileStatus('creator', true)
        setError('Profile updated, but some fields may still be missing. Please check the requirements.')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      if (error instanceof ApiErrorResponse) {
        setError(formatErrorDetail(error.data.detail) || 'Failed to update profile')
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateHotelForm()) {
      return
    }

    setSubmitting(true)
    try {
      // Get email from localStorage (stored during login) - backend requires it
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null

      if (!userEmail) {
        setError('Email is required. Please log in again.')
        setSubmitting(false)
        return
      }

      // Update hotel profile
      await hotelService.updateMyProfile({
        name: hotelForm.name,
        location: hotelForm.location,
        about: hotelForm.about || undefined,
        website: hotelForm.website || undefined,
        phone: hotelForm.phone || undefined,
        email: userEmail, // Backend requires email
      })

      // Create listings
      for (const listing of hotelListings) {
        // Transform collaboration types to offerings
        const offerings: Array<{
          collaboration_type: 'Free Stay' | 'Paid' | 'Discount'
          availability_months: string[]
          platforms: string[]
          free_stay_min_nights?: number
          free_stay_max_nights?: number
          paid_max_amount?: number
          discount_percentage?: number
        }> = []

        if (listing.collaborationTypes.includes('Free Stay')) {
          offerings.push({
            collaboration_type: 'Free Stay',
            availability_months: listing.availability,
            platforms: listing.platforms,
            free_stay_min_nights: listing.freeStayMinNights,
            free_stay_max_nights: listing.freeStayMaxNights,
          })
        }

        if (listing.collaborationTypes.includes('Paid')) {
          offerings.push({
            collaboration_type: 'Paid',
            availability_months: listing.availability,
            platforms: listing.platforms,
            paid_max_amount: listing.paidMaxAmount,
          })
        }

        if (listing.collaborationTypes.includes('Discount')) {
          offerings.push({
            collaboration_type: 'Discount',
            availability_months: listing.availability,
            platforms: listing.platforms,
            discount_percentage: listing.discountPercentage,
          })
        }

        // Filter out base64 images (previews) - only keep URLs
        const imageUrls = listing.images.filter((img) => !img.startsWith('data:'))

        await hotelService.createListing({
          name: listing.name,
          location: listing.location,
          description: listing.description,
          accommodation_type: listing.accommodation_type || undefined,
          images: imageUrls,
          collaboration_offerings: offerings,
          creator_requirements: {
            platforms: listing.lookingForPlatforms,
            min_followers: listing.lookingForMinFollowers || undefined,
            target_countries: listing.targetGroupCountries,
            target_age_min: listing.targetGroupAgeMin || undefined,
            target_age_max: listing.targetGroupAgeMax || undefined,
          },
        })
      }

      // Check if profile is now complete after successful update
      const isComplete = await isProfileComplete('hotel')
      if (isComplete) {
        setProfileCompleted(true)
        // Update localStorage so warning banner disappears
        if (typeof window !== 'undefined') {
          localStorage.setItem('profileComplete', 'true')
        }
        await loadProfileStatus('hotel', true) // Skip redirect, show completion message
      } else {
        // Reload status to show updated completion steps
        await loadProfileStatus('hotel', true)
        setError('Profile updated, but some fields may still be missing. Please check the requirements.')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      if (error instanceof ApiErrorResponse) {
        setError(formatErrorDetail(error.data.detail) || 'Failed to update profile')
      } else {
        setError('Failed to update profile. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => {
    const steps = userType === 'creator' ? creatorSteps : hotelSteps
    const totalSteps = steps.length
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setError('')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const canProceedToNextStep = (): boolean => {
    if (userType === 'creator') {
      if (currentStep === 1) {
        // Validate basic info
        return !!(
          creatorForm.name.trim() &&
          creatorForm.location.trim() &&
          creatorForm.short_description.trim() &&
          creatorForm.short_description.trim().length >= 10
        )
      }
      return true
    } else if (userType === 'hotel') {
      // Hotel
      if (currentStep === 1) {
        // Validate basic info
        return !!(
          hotelForm.name.trim() &&
          hotelForm.name.trim().length >= 2 &&
          hotelForm.location.trim()
        )
      }
      return true
    }
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  if (!userType || !profileStatus) {
    return null
  }

  // Show completion screen if profile is completed
  if (profileCompleted || profileStatus.profile_complete) {
    return (
      <div className="min-h-screen bg-white relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-center relative">
            <a
              href="/"
              className="absolute left-0 p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              title="Back to Home"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2">
              <Image
                src="/vayada-logo.svg"
                alt="vayada logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
          </div>
        </div>

        {/* Completion Message - Overlapping with header */}
        <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 -mt-8">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Profile Complete!
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6 text-center leading-relaxed text-lg">
              Thank you for completing your profile! We're currently in closed beta preparing for launch, and we'll notify you as soon as the platform goes live.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const steps = userType === 'creator' ? creatorSteps : hotelSteps
  const totalSteps = steps.length

  // Use real-time calculation if available, otherwise fall back to profile status
  // But strictly prioritize real-time form state for immediate feedback
  const completionPercentage = profileStatus?.profile_complete
    ? 100
    : calculateProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Minimal Header */}
      <div className="relative bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center relative">
          <a
            href="/"
            className="absolute left-0 p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            title="Back to Home"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </a>
          <div className="flex items-center gap-2">
            <Image
              src="/vayada-logo.svg"
              alt="vayada logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
            <span className="text-sm font-bold text-primary-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Compact Header Card with Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Title & Subtitle */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              {userType === 'creator' ? (
                <UserIcon className="w-5 h-5 text-white" />
              ) : (
                <BuildingOfficeIcon className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Complete Your Profile
              </h1>
              <p className="text-xs text-gray-500 max-w-xs">
                {userType === 'creator'
                  ? 'Add info to connect with hotels'
                  : 'Update info to collaborate'}
              </p>
            </div>
          </div>

          {/* Right: Step Indicators */}
          <div className="flex items-center">
            {steps.map((step, index) => {
              const stepNumber = index + 1
              const isActive = currentStep === stepNumber
              const isCompleted = currentStep > stepNumber

              return (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${isActive
                        ? 'bg-primary-600 text-white shadow-md'
                        : isCompleted
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                        }`}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <span
                      className={`mt-1 text-[10px] font-medium uppercase tracking-wide ${isActive ? 'text-primary-700' : isCompleted ? 'text-primary-700' : 'text-gray-400'
                        }`}
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-2 mb-3.5 ${isCompleted ? 'bg-primary-200' : 'bg-gray-100'
                        }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Creator Form */}
        {userType === 'creator' && (
          <form onSubmit={currentStep === totalSteps ? handleCreatorSubmit : (e) => { e.preventDefault(); nextStep(); }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                    <p className="text-xs text-gray-500">Your creator profile details</p>
                  </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-5">
                  {/* Left Column: Name & Location */}
                  <div className="flex-1 space-y-3">
                    <Input
                      label="Name"
                      type="text"
                      value={creatorForm.name}
                      onChange={(e) => setCreatorForm({ ...creatorForm, name: e.target.value })}
                      required
                      placeholder="Your full name"
                      error={error && error.includes('Name') ? error : undefined}
                      leadingIcon={<UserIcon className="w-5 h-5 text-gray-400" />}
                    />

                    <Input
                      label="Location"
                      type="text"
                      value={creatorForm.location}
                      onChange={(e) => setCreatorForm({ ...creatorForm, location: e.target.value })}
                      required
                      placeholder="e.g., New York, USA"
                      error={error && error.includes('Location') ? error : undefined}
                      leadingIcon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
                    />
                  </div>

                  {/* Right Column: Profile Picture */}
                  <div className="w-full md:w-auto flex flex-col items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">Profile Picture</span>
                    <div
                      className="relative w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-all overflow-hidden bg-gray-50 group"
                      onClick={() => creatorImageInputRef.current?.click()}
                    >
                      {creatorForm.profile_image ? (
                        <>
                          <img
                            src={creatorForm.profile_image}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-[10px] font-medium">Change</span>
                          </div>
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
                    <input
                      type="file"
                      ref={creatorImageInputRef}
                      onChange={handleCreatorImageChange}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Textarea
                    label="Creator Biography"
                    value={creatorForm.short_description}
                    onChange={(e) => setCreatorForm({ ...creatorForm, short_description: e.target.value })}
                    required
                    placeholder="Tell us about yourself as a travel creator"
                    rows={3}
                    maxLength={500}
                    error={error && error.includes('description') ? error : undefined}
                    helperText={`${creatorForm.short_description.length}/500 characters`}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gray-700">Portfolio Link</h4>
                  <Input
                    label=""
                    type="url"
                    value={creatorForm.portfolio_link}
                    onChange={(e) => setCreatorForm({ ...creatorForm, portfolio_link: e.target.value })}
                    placeholder="https://your-portfolio.com"
                    helperText="Optional - Your website, media kit, or best-performing content URL"
                    leadingIcon={<LinkIcon className="w-5 h-5 text-gray-400" />}
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">Contact Information</h4>
                    <p className="text-sm text-gray-500 mt-1">Your email & phone number for direct communication with properties after both accept a collaboration</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : ''}
                      disabled
                      required
                      leadingIcon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
                      className="bg-gray-50 text-gray-500"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      required
                      value={creatorForm.phone}
                      onChange={(e) => setCreatorForm({ ...creatorForm, phone: e.target.value })}
                      placeholder="+1-555-123-4567"
                      leadingIcon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Step 2: Platforms Section */}
            {currentStep === 2 && (
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
                      const isAdded = creatorPlatforms.some((p) => p.name === platformName)
                      const platformIndex = creatorPlatforms.findIndex((p) => p.name === platformName)

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
                                  setCreatorPlatforms([
                                    ...creatorPlatforms,
                                    {
                                      name: platformName,
                                      handle: '',
                                      followers: '',
                                      engagement_rate: '',
                                    },
                                  ])
                                }}
                                className="px-4 py-2 border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                              >
                                Add Manually
                              </button>
                            )}
                          </div>

                          {isAdded && platformIndex !== -1 && (
                            <div className="border-t border-gray-100 bg-white px-4 md:px-6 pb-5 pt-4 rounded-b-2xl">
                              <div className="space-y-3 mb-4">
                                <Input
                                  label="Username"
                                  type="text"
                                  value={platformIndex >= 0 ? creatorPlatforms[platformIndex].handle : ''}
                                  onChange={(e) => updatePlatform(platformIndex, 'handle', e.target.value)}
                                  placeholder="@ username"
                                  required
                                  className="bg-gray-50"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    label="Followers"
                                    type="number"
                                    value={platformIndex >= 0 ? creatorPlatforms[platformIndex].followers : ''}
                                    onChange={(e) => updatePlatform(platformIndex, 'followers', e.target.value === '' ? '' : parseInt(e.target.value))}
                                    required
                                    placeholder="0"
                                    min={1}
                                    className="bg-gray-50"
                                  />
                                  <Input
                                    label="Engagement Rate (%)"
                                    type="number"
                                    value={platformIndex >= 0 ? creatorPlatforms[platformIndex].engagement_rate : ''}
                                    onChange={(e) => updatePlatform(platformIndex, 'engagement_rate', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    required
                                    placeholder="0.00"
                                    min={0.01}
                                    max={100}
                                    step="0.01"
                                    className="bg-gray-50"
                                  />
                                </div>
                              </div>

                              {/* Save button always visible */}
                              <div className="pt-2">
                                <Button
                                  type="button"
                                  variant="primary"
                                  className="w-full justify-center text-base font-semibold"
                                  onClick={() => {
                                    setPlatformSaveStatus((prev) => ({ ...prev, [platformIndex]: 'Saved!' }))
                                    togglePlatformCardCollapse(platformIndex)
                                    setTimeout(() => {
                                      setPlatformSaveStatus((prev) => {
                                        const next = { ...prev }
                                        delete next[platformIndex]
                                        return next
                                      })
                                    }, 2000)
                                  }}
                                >
                                  Save {platformName} Profile
                                </Button>
                                {platformSaveStatus[platformIndex] && (
                                  <p className="text-sm text-green-600 text-center mt-2 font-medium">
                                    {platformSaveStatus[platformIndex]}
                                  </p>
                                )}
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
                                        {creatorPlatforms[platformIndex].top_countries && creatorPlatforms[platformIndex].top_countries!.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                            {creatorPlatforms[platformIndex].top_countries!.map((country, countryIndex) => (
                                              <span key={countryIndex} className="inline-flex items-center gap-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 border border-primary-100">
                                                {country.country}
                                                <button
                                                  type="button"
                                                  onClick={() => removeCountryTag(platformIndex, countryIndex)}
                                                  className="text-primary-500 hover:text-primary-700"
                                                >
                                                  <XMarkIcon className="w-3 h-3" />
                                                </button>
                                              </span>
                                            ))}
                                          </div>
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
                                          const isSelected = creatorPlatforms[platformIndex].top_age_groups?.some((a) => a.ageRange === range)
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
                                          value={creatorPlatforms[platformIndex].gender_split?.male && creatorPlatforms[platformIndex].gender_split!.male > 0 ? creatorPlatforms[platformIndex].gender_split!.male : ''}
                                          onChange={(e) => {
                                            const val = e.target.value
                                            const cleanVal = val === '' ? '' : val.replace(/^0+(?=\d)/, '') || val
                                            updateGenderSplit(platformIndex, 'male', cleanVal)
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
                                          value={creatorPlatforms[platformIndex].gender_split?.female && creatorPlatforms[platformIndex].gender_split!.female > 0 ? creatorPlatforms[platformIndex].gender_split!.female : ''}
                                          onChange={(e) => {
                                            const val = e.target.value
                                            const cleanVal = val === '' ? '' : val.replace(/^0+(?=\d)/, '') || val
                                            updateGenderSplit(platformIndex, 'female', cleanVal)
                                          }}
                                          placeholder="55"
                                          min={0}
                                          max={100}
                                          step="0.1"
                                          className="bg-gray-50"
                                        />
                                      </div>
                                      {creatorPlatforms[platformIndex].gender_split && (creatorPlatforms[platformIndex].gender_split!.male + creatorPlatforms[platformIndex].gender_split!.female) > 100 && (
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
                  {creatorPlatforms.length === 0 && (
                    <p className="text-center text-orange-700 font-medium text-sm mt-4">
                      Connect at least one platform to complete your profile
                    </p>
                  )}

                  {/* Info Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3 mt-6">
                    <div className="w-7 h-7 rounded-full bg-white border border-primary-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 font-bold text-sm leading-none">i</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      All data should be verifiable via platform insights (e.g., Instagram Insights, YouTube Analytics).
                    </p>
                  </div>
                </div>

              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <XMarkIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-gray-200 flex items-center justify-between gap-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="px-6 py-3"
                >
                  Previous
                </Button>
              )}
              <div className="flex-1" />
              <Button
                type="submit"
                variant="primary"
                className="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={submitting || (currentStep < totalSteps && !canProceedToNextStep())}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : currentStep === totalSteps ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Review & Complete Profile
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Next
                    <ChevronDownIcon className="w-5 h-5 rotate-[-90deg]" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Hotel Form */}
        {userType === 'hotel' && (
          <form onSubmit={currentStep === totalSteps ? handleHotelSubmit : (e) => { e.preventDefault(); nextStep(); }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                    <BuildingOfficeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                    <p className="text-xs text-gray-500">Your hotel details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Hotel Name"
                      type="text"
                      value={hotelForm.name}
                      onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                      required
                      placeholder="Your hotel or company name"
                      helperText={undefined}
                      leadingIcon={<BuildingOfficeIcon className="w-5 h-5" />}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      label="Location"
                      type="text"
                      value={hotelForm.location}
                      onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                      required
                      placeholder="Enter your hotel location"
                      error={error && error.includes('Location') ? error : undefined}
                      helperText="Country or island, e.g., Bali, Indonesia."
                      leadingIcon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <Textarea
                    label="About"
                    value={hotelForm.about}
                    onChange={(e) => setHotelForm({ ...hotelForm, about: e.target.value })}
                    placeholder="Describe your hotel, amenities, unique features, and what makes it special (minimum 50 characters)"
                    rows={4}
                    maxLength={5000}
                    required
                    helperText={`${hotelForm.about.length}/5000 characters`}
                    className="resize-none"
                    error={error && error.includes('About') ? error : undefined}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Website"
                      type="url"
                      value={hotelForm.website}
                      onChange={(e) => setHotelForm({ ...hotelForm, website: e.target.value })}
                      placeholder="https://your-hotel.com"
                      required
                      helperText={
                        profileStatus && 'missing_fields' in profileStatus && profileStatus.missing_fields.includes('website')
                          ? undefined
                          : undefined
                      }
                      error={error && error.includes('Website') ? error : undefined}
                      leadingIcon={<GlobeAltIcon className="w-5 h-5 text-gray-400" />}
                    />

                    <Input
                      label="Phone"
                      type="tel"
                      value={hotelForm.phone}
                      onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })}
                      placeholder="+1-555-123-4567"
                      required
                      helperText={undefined}
                      leadingIcon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Property Listings Section - REQUIRED */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                    <BuildingOfficeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Property Listings</h3>
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
                        {hotelListings.length} listing{hotelListings.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Add at least one property listing <span className="font-semibold text-red-600">(required)</span>
                    </p>
                  </div>
                </div>

                {hotelListings.length === 0 && (
                  <div className="border border-primary-200 rounded-xl p-6 text-center bg-white shadow-sm border-dashed">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-primary-50 flex items-center justify-center">
                      <BuildingOfficeIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-primary-800 font-semibold mb-1 text-sm">No listings added yet</p>
                    <p className="text-xs text-gray-600">Add at least one property listing to complete your profile.</p>
                  </div>
                )}

                {hotelListings.map((listing, index) => {
                  // Check if listing is complete (has all required basic fields)
                  const isComplete = listing.name.trim() &&
                    listing.location.trim() &&
                    listing.accommodation_type.trim() &&
                    listing.description.trim() &&
                    listing.collaborationTypes.length > 0 &&
                    listing.availability.length > 0 &&
                    listing.platforms.length > 0 &&
                    listing.lookingForPlatforms.length > 0 &&
                    listing.targetGroupCountries.length > 0

                  return (
                    <div
                      key={index}
                      className="border border-primary-100 rounded-xl p-4 space-y-3 bg-white shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-primary-100/70">
                        <button
                          type="button"
                          onClick={() => toggleListingCardCollapse(index)}
                          className="flex items-center gap-2 flex-1 text-left hover:opacity-80 transition-opacity"
                        >
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center font-semibold text-xs ${isComplete
                            ? 'bg-green-50 text-green-700'
                            : 'bg-primary-50 text-primary-700'
                            }`}>
                            {isComplete ? (
                              <CheckCircleIcon className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 text-sm">
                                {listing.name || `Property Listing ${index + 1}`}
                              </h4>
                              {isComplete && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                  Complete
                                </span>
                              )}
                            </div>
                            {collapsedListingCards.has(index) && listing.name && (
                              <p className="text-xs text-gray-500 mt-0">
                                {listing.location && `${listing.location}`} {listing.accommodation_type && `• ${listing.accommodation_type}`}
                              </p>
                            )}
                          </div>
                          {collapsedListingCards.has(index) ? (
                            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <div className="flex items-center gap-2">
                          {hotelListings.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeListing(index)}
                              className="p-1 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Remove listing"
                            >
                              <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {!collapsedListingCards.has(index) && (
                        <>
                          {/* Basic Information */}
                          <div className="space-y-4">
                            <h5 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <Input
                                label="Listing Name"
                                type="text"
                                value={listing.name}
                                onChange={(e) => updateListing(index, 'name', e.target.value)}
                                required
                                placeholder="Luxury Beach Villa"
                              />

                              <Input
                                label="Location"
                                type="text"
                                value={listing.location}
                                onChange={(e) => updateListing(index, 'location', e.target.value)}
                                required
                                placeholder="Bali, Indonesia"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Accommodation Type <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={listing.accommodation_type}
                                onChange={(e) => updateListing(index, 'accommodation_type', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-sm text-gray-900"
                              >
                                <option value="">Select type</option>
                                {HOTEL_CATEGORIES.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <Textarea
                              label="Description"
                              value={listing.description}
                              onChange={(e) => updateListing(index, 'description', e.target.value)}
                              required
                              rows={3}
                              placeholder="A stunning beachfront villa with private pool and ocean views."
                            />

                            {/* Images */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
                              <div className="space-y-3">
                                {listing.images.length > 0 && (
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {listing.images.map((image, imageIndex) => (
                                      <div key={imageIndex} className="relative group">
                                        <img
                                          src={image}
                                          alt={`Listing ${index + 1} - Image ${imageIndex + 1}`}
                                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                          }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeListingImage(index, imageIndex)}
                                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <XMarkIcon className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <input
                                  ref={(el) => {
                                    listingImageInputRefs.current[index] = el
                                  }}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleListingImageChange(index, e)}
                                />
                                <Button
                                  variant="outline"
                                  type="button"
                                  onClick={() => listingImageInputRefs.current[index]?.click()}
                                >
                                  <PlusIcon className="w-5 h-5 mr-2" />
                                  Add Image
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Offerings Section */}
                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-1 h-5 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                              <h5 className="text-sm font-semibold text-gray-900">Offerings</h5>
                            </div>
                            <div className="space-y-3">
                              {/* Collaboration Types */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                  Collaboration Types <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {COLLABORATION_TYPES.map((type) => {
                                    const isSelected = listing.collaborationTypes.includes(type)
                                    const icons = {
                                      'Free Stay': GiftIcon,
                                      'Paid': CurrencyDollarIcon,
                                      'Discount': TagIcon,
                                    }
                                    const Icon = icons[type as keyof typeof icons]

                                    return (
                                      <label
                                        key={type}
                                        className={`relative flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                                          ? 'bg-primary-50 border-primary-300 shadow-sm'
                                          : 'bg-white border-gray-200 hover:border-primary-200 hover:shadow-sm'
                                          }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              updateListing(index, 'collaborationTypes', [...listing.collaborationTypes, type])
                                            } else {
                                              updateListing(index, 'collaborationTypes', listing.collaborationTypes.filter((t) => t !== type))
                                            }
                                          }}
                                          className="sr-only"
                                        />
                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${isSelected
                                          ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                                          : 'bg-gray-100'
                                          }`}>
                                          <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                                        </div>
                                        <div className="flex-1">
                                          <div className={`text-sm font-semibold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>{type}</div>
                                          {isSelected && (
                                            <div className="mt-0.5 flex items-center gap-1">
                                              <CheckCircleIcon className="w-3 h-3 text-primary-600" />
                                              <span className="text-[10px] text-primary-600">Selected</span>
                                            </div>
                                          )}
                                        </div>
                                      </label>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Free Stay Details */}
                              {listing.collaborationTypes.includes('Free Stay') && (
                                <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-200 shadow-sm transition-all">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                      <GiftIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h6 className="font-semibold text-gray-900 text-sm">Free Stay Details</h6>
                                      <p className="text-[10px] text-gray-600">Specify the night range for free stays</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                      label="Min. Nights"
                                      type="number"
                                      value={listing.freeStayMinNights || ''}
                                      min={1}
                                      onChange={(e) => {
                                        const { value } = e.target
                                        if (value === '') {
                                          updateListing(index, 'freeStayMinNights', undefined)
                                          return
                                        }
                                        const parsed = parseInt(value)
                                        updateListing(index, 'freeStayMinNights', Number.isNaN(parsed) ? undefined : Math.max(1, parsed))
                                      }}
                                      placeholder="1"
                                      required
                                    />
                                    <Input
                                      label="Max. Nights"
                                      type="number"
                                      value={listing.freeStayMaxNights || ''}
                                      onChange={(e) => updateListing(index, 'freeStayMaxNights', parseInt(e.target.value) || undefined)}
                                      placeholder="5"
                                      required
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Paid Details */}
                              {listing.collaborationTypes.includes('Paid') && (
                                <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-200 shadow-sm transition-all">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                      <CurrencyDollarIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h6 className="font-semibold text-gray-900 text-sm">Paid Details</h6>
                                      <p className="text-[10px] text-gray-600">Set the maximum payment amount</p>
                                    </div>
                                  </div>
                                  <Input
                                    label="Max. Amount ($)"
                                    type="number"
                                    value={listing.paidMaxAmount || ''}
                                    onChange={(e) => updateListing(index, 'paidMaxAmount', parseInt(e.target.value) || undefined)}
                                    placeholder="5000"
                                    required
                                  />
                                </div>
                              )}

                              {/* Discount Details */}
                              {listing.collaborationTypes.includes('Discount') && (
                                <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-200 shadow-sm transition-all">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                      <TagIcon className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h6 className="font-semibold text-gray-900 text-sm">Discount Details</h6>
                                      <p className="text-[10px] text-gray-600">Set the discount percentage</p>
                                    </div>
                                  </div>
                                  <Input
                                    label="Discount Percentage (%)"
                                    type="number"
                                    value={listing.discountPercentage || ''}
                                    onChange={(e) => updateListing(index, 'discountPercentage', parseInt(e.target.value) || undefined)}
                                    placeholder="20"
                                    min={1}
                                    max={100}
                                    required
                                  />
                                </div>
                              )}

                              {/* Availability */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <CalendarDaysIcon className="w-4 h-4 text-primary-600" />
                                  <label className="block text-xs font-semibold text-gray-700">
                                    Availability (Months) <span className="text-red-500">*</span>
                                  </label>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                    {MONTHS.map((month) => {
                                      const isSelected = listing.availability.includes(month)
                                      const monthAbbr = month.substring(0, 3)

                                      return (
                                        <label
                                          key={month}
                                          className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                            ? 'bg-primary-50 border-primary-400 shadow-sm'
                                            : 'bg-white border-gray-200 hover:border-primary-200 hover:bg-primary-50/30'
                                            }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                updateListing(index, 'availability', [...listing.availability, month])
                                              } else {
                                                updateListing(index, 'availability', listing.availability.filter((m) => m !== month))
                                              }
                                            }}
                                            className="sr-only"
                                          />
                                          <div className={`text-xs font-medium mb-1 ${isSelected ? 'text-primary-700' : 'text-gray-500'}`}>
                                            {monthAbbr}
                                          </div>
                                          <div className={`text-[10px] font-normal ${isSelected ? 'text-primary-600' : 'text-gray-400'}`}>
                                            {month.length > 6 ? month.substring(6) : ''}
                                          </div>
                                          {isSelected && (
                                            <div className="absolute top-1 right-1">
                                              <CheckCircleIcon className="w-4 h-4 text-primary-600" />
                                            </div>
                                          )}
                                        </label>
                                      )
                                    })}
                                  </div>
                                  {listing.availability.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                      <p className="text-xs text-gray-600">
                                        <span className="font-medium text-primary-700">{listing.availability.length}</span> month{listing.availability.length !== 1 ? 's' : ''} selected: {listing.availability.join(', ')}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Platforms */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Posting platforms for this collaboration</label>
                                <p className="text-[10px] text-gray-500 mb-2">Where the creator will post for this listing (choose at least one).</p>
                                <div className="flex flex-wrap gap-2">
                                  {PLATFORM_OPTIONS.map((platform) => (
                                    <label key={platform} className="flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={listing.platforms.includes(platform)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            updateListing(index, 'platforms', [...listing.platforms, platform])
                                          } else {
                                            updateListing(index, 'platforms', listing.platforms.filter((p) => p !== platform))
                                          }
                                        }}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                      />
                                      <span className="ml-2 text-gray-700">{platform}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Looking For Section */}
                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-1 h-5 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                              <h5 className="text-sm font-semibold text-gray-900">Looking For</h5>
                            </div>
                            <div className="space-y-3">
                              {/* Platforms */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Creator's existing platforms</label>
                                <p className="text-[10px] text-gray-500 mb-2">Platforms the creator should already have. Pick at least one.</p>
                                <div className="flex flex-wrap gap-2">
                                  {PLATFORM_OPTIONS.map((platform) => (
                                    <label key={platform} className="flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={listing.lookingForPlatforms.includes(platform)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            updateListing(index, 'lookingForPlatforms', [...listing.lookingForPlatforms, platform])
                                          } else {
                                            updateListing(index, 'lookingForPlatforms', listing.lookingForPlatforms.filter((p) => p !== platform))
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
                              <Input
                                label="Min. Follower Amount (optional)"
                                type="number"
                                value={listing.lookingForMinFollowers || ''}
                                onChange={(e) => updateListing(index, 'lookingForMinFollowers', parseInt(e.target.value) || undefined)}
                                placeholder="50000"
                              />

                              {/* Target Group Countries */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                    <GlobeAltIcon className="w-4 h-4 text-white" />
                                  </div>
                                  <label className="block text-xs font-semibold text-gray-700">
                                    Target Group - Countries <span className="text-red-500">*</span>
                                  </label>
                                </div>
                                <div className="space-y-2 max-h-80 overflow-y-auto p-2">
                                  {CONTINENT_ORDER.map((continent) => {
                                    const countries = COUNTRIES_BY_CONTINENT[continent]
                                    // Default to collapsed - only expand if explicitly in the expanded Set
                                    const isCollapsed = !expandedContinents[index]?.has(continent)
                                    const selectedInContinent = countries.filter((c) => listing.targetGroupCountries.includes(c))
                                    const allSelected = selectedInContinent.length === countries.length
                                    const someSelected = selectedInContinent.length > 0 && selectedInContinent.length < countries.length

                                    return (
                                      <div key={continent} className="border-2 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                                        <button
                                          type="button"
                                          onClick={() => toggleContinent(index, continent)}
                                          className={`w-full flex items-center justify-between p-3 transition-all ${allSelected
                                            ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-300'
                                            : someSelected
                                              ? 'bg-gradient-to-r from-primary-50/70 to-primary-50/30 border-primary-200'
                                              : 'bg-white hover:bg-gray-50 border-gray-200'
                                            }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${allSelected
                                              ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                                              : someSelected
                                                ? 'bg-primary-200'
                                                : 'bg-gray-100'
                                              }`}>
                                              {isCollapsed ? (
                                                <ChevronDownIcon className={`w-4 h-4 ${allSelected ? 'text-white' : 'text-gray-600'}`} />
                                              ) : (
                                                <ChevronUpIcon className={`w-4 h-4 ${allSelected ? 'text-white' : 'text-gray-600'}`} />
                                              )}
                                            </div>
                                            <span className={`font-semibold ${allSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                                              {continent}
                                            </span>
                                            {allSelected && (
                                              <div className="flex items-center gap-1 px-2 py-1 bg-primary-600 text-white rounded-full">
                                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                                <span className="text-xs font-medium">All</span>
                                              </div>
                                            )}
                                            {someSelected && (
                                              <div className="flex items-center gap-1 px-2 py-1 bg-primary-200 text-primary-700 rounded-full">
                                                <span className="text-xs font-medium">{selectedInContinent.length} selected</span>
                                              </div>
                                            )}
                                          </div>
                                        </button>
                                        {!isCollapsed && (
                                          <div className="p-4 bg-white border-t-2 border-gray-100">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                                              {countries.map((country) => {
                                                const isSelected = listing.targetGroupCountries.includes(country)
                                                return (
                                                  <label
                                                    key={country}
                                                    className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all border-2 ${isSelected
                                                      ? 'bg-primary-50 border-primary-300 shadow-sm'
                                                      : 'bg-white border-gray-200 hover:border-primary-200 hover:bg-primary-50/30'
                                                      }`}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={isSelected}
                                                      onChange={(e) => {
                                                        if (e.target.checked) {
                                                          updateListing(index, 'targetGroupCountries', [...listing.targetGroupCountries, country])
                                                        } else {
                                                          updateListing(index, 'targetGroupCountries', listing.targetGroupCountries.filter((c) => c !== country))
                                                        }
                                                      }}
                                                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                                                    />
                                                    <span className={`text-sm font-medium ${isSelected ? 'text-primary-900' : 'text-gray-700'}`}>
                                                      {country}
                                                    </span>
                                                  </label>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                                {listing.targetGroupCountries.length > 0 && (
                                  <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl border-2 border-primary-200 shadow-sm">
                                    <div className="flex items-center gap-2">
                                      <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                                      <p className="text-sm text-gray-700">
                                        <span className="font-bold text-primary-700">{listing.targetGroupCountries.length}</span> countr{listing.targetGroupCountries.length !== 1 ? 'ies' : 'y'} selected
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Target Group Age */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Target Group - Age Group</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    label="Min. Age (optional)"
                                    type="number"
                                    value={listing.targetGroupAgeMin || ''}
                                    onChange={(e) => updateListing(index, 'targetGroupAgeMin', parseInt(e.target.value) || undefined)}
                                    placeholder="25"
                                  />
                                  <Input
                                    label="Max. Age (optional)"
                                    type="number"
                                    value={listing.targetGroupAgeMax || ''}
                                    onChange={(e) => updateListing(index, 'targetGroupAgeMax', parseInt(e.target.value) || undefined)}
                                    placeholder="45"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}

                <button
                  type="button"
                  onClick={addListing}
                  className="w-full py-3 border-2 border-dashed border-primary-200 rounded-lg text-primary-700 hover:border-primary-400 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 font-semibold text-sm group"
                >
                  <PlusIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Add Another Property Listing
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <XMarkIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-gray-200 flex items-center justify-between gap-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="px-6 py-3"
                >
                  Previous
                </Button>
              )}
              <div className="flex-1" />
              <Button
                type="submit"
                variant="primary"
                className="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={submitting || (currentStep < totalSteps && !canProceedToNextStep())}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : currentStep === totalSteps ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    Complete Profile
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Next
                    <ChevronDownIcon className="w-5 h-5 rotate-[-90deg]" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

