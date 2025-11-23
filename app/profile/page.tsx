'use client'

import { useState, useEffect, useRef } from 'react'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { Button, Input, Textarea, StarRating } from '@/components/ui'
import { MapPinIcon, CheckBadgeIcon, StarIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'
import type { CreatorRating, CollaborationReview } from '@/lib/types'

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
  category: string
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
const HOTEL_CATEGORIES = ['Resort', 'Hotel', 'Villa', 'Apartment', 'Hostel', 'Boutique Hotel', 'Luxury Hotel', 'Eco Resort', 'Spa Resort', 'Beach Resort']
const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'Facebook']
const COLLABORATION_TYPES = ['Free Stay', 'Paid', 'Discount'] as const
const COUNTRIES = ['USA', 'Germany', 'UK', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Austria', 'Belgium', 'Canada', 'Australia', 'Japan', 'South Korea', 'Singapore', 'Thailand', 'Indonesia', 'Malaysia', 'Philippines', 'India', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'South Africa', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Egypt']

export default function ProfilePage() {
  const { isCollapsed } = useSidebar()
  const [userType, setUserType] = useState<UserType>('creator')
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const [hotelProfile, setHotelProfile] = useState<HotelProfile | null>(null)
  const [loading, setLoading] = useState(true)
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hotelFileInputRef = useRef<HTMLInputElement>(null)
  const listingImageInputRef = useRef<HTMLInputElement>(null)
  
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
    category: '',
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
        platforms: (creatorProfile.platforms || []).map(platform => ({
          ...platform,
          topCountries: platform.topCountries || [],
          topAgeGroups: platform.topAgeGroups || [],
          genderSplit: platform.genderSplit || { male: 0, female: 0 },
        })),
      })
    }
  }, [creatorProfile])

  const loadProfile = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (userType === 'creator') {
        const now = new Date()
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        const fourMonthsAgo = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000)

        setCreatorProfile({
          id: '1',
          name: 'Sarah Travels',
          shortDescription: 'Luxury travel & lifestyle creator focusing on boutique hotels and unique experiences.',
          location: 'Los Angeles, USA',
          status: 'verified',
          rating: {
            averageRating: 4.8,
            totalReviews: 12,
            reviews: [
              {
                id: 'r1',
                hotelId: 'h1',
                hotelName: 'Sunset Beach Villa',
                rating: 5,
                comment: 'Excellent collaboration! Sarah delivered high-quality content and was very professional throughout the process. The photos and videos exceeded our expectations.',
                createdAt: oneMonthAgo,
              },
              {
                id: 'r2',
                hotelId: 'h2',
                hotelName: 'Mountain View Lodge',
                rating: 5,
                comment: 'Amazing content creator. The photos and videos perfectly captured the essence of our lodge. Highly recommend!',
                createdAt: twoMonthsAgo,
              },
              {
                id: 'r3',
                hotelId: 'h3',
                hotelName: 'Urban Boutique Hotel',
                rating: 4,
                comment: 'Great collaboration, very responsive and delivered on time. The content was good quality.',
                createdAt: threeMonthsAgo,
              },
              {
                id: 'r4',
                hotelId: 'h4',
                hotelName: 'Desert Oasis Resort',
                rating: 5,
                comment: 'Outstanding work! Sarah perfectly showcased our resort and reached our target audience effectively.',
                createdAt: fourMonthsAgo,
              },
            ],
          },
          platforms: [
            {
              name: 'Instagram',
              handle: '@sarahtravels',
              followers: 125000,
              engagementRate: 4.2,
              topCountries: [
                { country: 'Indonesia', percentage: 35 },
                { country: 'Australia', percentage: 22 },
                { country: 'Singapore', percentage: 15 },
              ],
              topAgeGroups: [
                { ageRange: '25-34', percentage: 48 },
                { ageRange: '18-24', percentage: 28 },
              ],
              genderSplit: { male: 45, female: 55 },
            },
            {
              name: 'TikTok',
              handle: '@sarahtravels',
              followers: 89000,
              engagementRate: 8.5,
              topCountries: [
                { country: 'United States', percentage: 28 },
                { country: 'United Kingdom', percentage: 18 },
                { country: 'Canada', percentage: 11 },
              ],
              topAgeGroups: [
                { ageRange: '18-24', percentage: 55 },
                { ageRange: '25-34', percentage: 31 },
              ],
              genderSplit: { male: 54, female: 46 },
            },
            {
              name: 'YouTube',
              handle: '@sarahtravels',
              followers: 45000,
              engagementRate: 6.8,
            },
            {
              name: 'Facebook',
              handle: '@sarahtravels',
              followers: 32000,
              engagementRate: 3.2,
            },
            {
              name: 'Blog/Website',
              handle: 'sarahtravels.com',
              followers: 15000,
              engagementRate: 5.1,
            },
          ],
          portfolioLink: 'https://sarahtravels.com/portfolio',
          email: 'sarah.travels@example.com',
          phone: '+1 (555) 123-4567',
        })
      } else {
        setHotelProfile({
          id: '1',
          name: 'Luxury Villa Management',
          picture: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          category: 'Resort',
          location: 'Bali, Indonesia',
          status: 'verified',
          website: 'https://luxuryvillamanagement.com',
          about: 'A luxury resort offering unique experiences in the heart of Bali. We specialize in providing exceptional hospitality and creating memorable stays for our guests.',
          email: 'contact@luxuryvillamanagement.com',
          phone: '+62 361 123456',
          listings: [
            {
              id: 'listing-1',
              name: 'Luxury Beach Villa',
              location: 'Bali, Indonesia',
              description: 'A stunning beachfront villa with private pool and ocean views.',
              images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
              accommodationType: 'Villa',
              collaborationTypes: ['Free Stay', 'Discount'],
              availability: ['January', 'February', 'March', 'April', 'May', 'June'],
              platforms: ['Instagram', 'TikTok', 'YouTube'],
              freeStayMinNights: 2,
              freeStayMaxNights: 5,
              discountPercentage: 20,
              lookingForPlatforms: ['Instagram', 'TikTok'],
              lookingForMinFollowers: 50000,
              targetGroupCountries: ['USA', 'Germany', 'UK'],
              targetGroupAgeMin: 25,
              targetGroupAgeMax: 45,
              status: 'verified',
            },
            {
              id: 'listing-2',
              name: 'Mountain Resort',
              location: 'Swiss Alps, Switzerland',
              description: 'A cozy mountain resort perfect for winter sports enthusiasts.',
              images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=3389&auto=format&fit=crop&ixlib=rb-4.0.3'],
              accommodationType: 'Resort',
              collaborationTypes: ['Paid', 'Discount'],
              availability: ['December', 'January', 'February', 'March'],
              platforms: ['Instagram', 'Facebook'],
              paidMaxAmount: 3000,
              discountPercentage: 15,
              lookingForPlatforms: ['Instagram', 'YouTube'],
              lookingForMinFollowers: 75000,
              targetGroupCountries: ['USA', 'UK', 'France'],
              targetGroupAgeMin: 30,
              targetGroupAgeMax: 50,
              status: 'verified',
            },
          ],
        })
      }
      setLoading(false)
    }, 300)
  }

  useEffect(() => {
    if (hotelProfile) {
      setHotelEditFormData({
        name: hotelProfile.name,
        picture: hotelProfile.picture || '',
        category: hotelProfile.category,
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

  const handleSaveProfile = async () => {
    if (!editFormData.name || !editFormData.shortDescription || !editFormData.location) {
      return
    }
    
    setIsSavingProfile(true)
    // Simulate API call
    setTimeout(() => {
      if (creatorProfile) {
        setCreatorProfile({
          ...creatorProfile,
          name: editFormData.name,
          profilePicture: editFormData.profilePicture || undefined,
          shortDescription: editFormData.shortDescription,
          location: editFormData.location,
          portfolioLink: editFormData.portfolioLink || undefined,
          platforms: editFormData.platforms,
        })
      }
      setIsEditingProfile(false)
      setIsSavingProfile(false)
      // In production, make API call to save profile
    }, 500)
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
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    setIsEditingProfile(false)
  }

  const handleSaveHotelProfile = async () => {
    if (!hotelEditFormData.name || !hotelEditFormData.category || !hotelEditFormData.location) {
      return
    }

    setIsSavingHotelProfile(true)
    setTimeout(() => {
      if (hotelProfile) {
        setHotelProfile({
          ...hotelProfile,
          name: hotelEditFormData.name,
          picture: hotelEditFormData.picture || undefined,
          category: hotelEditFormData.category,
          location: hotelEditFormData.location,
          website: hotelEditFormData.website || undefined,
          about: hotelEditFormData.about || undefined,
          email: email,
          phone: phone,
        })
      }
      setIsEditingHotelProfile(false)
      setIsSavingHotelProfile(false)
    }, 500)
  }

  const handleCancelHotelEdit = () => {
    if (hotelProfile) {
      setHotelEditFormData({
        name: hotelProfile.name,
        picture: hotelProfile.picture || '',
        category: hotelProfile.category,
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
      if (hotelFileInputRef.current) {
        hotelFileInputRef.current.value = ''
      }
    }
    setIsEditingHotelProfile(false)
  }

  const handleSaveHotelContact = async () => {
    if (!email || !email.includes('@')) {
      return
    }
    
    setIsSavingContact(true)
    setTimeout(() => {
      if (hotelProfile) {
        setHotelProfile({
          ...hotelProfile,
          email: email,
          phone: phone,
        })
      }
      setIsEditingContact(false)
      setIsSavingContact(false)
    }, 500)
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
      return
    }

    setIsSavingListing(true)
    setTimeout(() => {
      if (hotelProfile) {
        if (editingListingId) {
          // Update existing listing
          setHotelProfile({
            ...hotelProfile,
            listings: hotelProfile.listings.map((listing) =>
              listing.id === editingListingId
                ? {
                    ...listing,
                    ...listingFormData,
                    images: listingFormData.images.length > 0 ? listingFormData.images : listing.images,
                  }
                : listing
            ),
          })
        } else {
          // Add new listing
          const newListing: HotelListing = {
            id: `listing-${Date.now()}`,
            ...listingFormData,
            status: 'pending',
          }
          setHotelProfile({
            ...hotelProfile,
            listings: [...hotelProfile.listings, newListing],
          })
        }
      }
      setShowListingModal(false)
      setEditingListingId(null)
      setIsSavingListing(false)
    }, 500)
  }

  const handleCancelListing = () => {
    setShowListingModal(false)
    setEditingListingId(null)
    setListingImagePreview(null)
    if (listingImageInputRef.current) {
      listingImageInputRef.current.value = ''
    }
  }

  const handleDeleteListing = (listingId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      if (hotelProfile) {
        setHotelProfile({
          ...hotelProfile,
          listings: hotelProfile.listings.filter((listing) => listing.id !== listingId),
        })
      }
    }
  }

  const addListingImage = () => {
    listingImageInputRef.current?.click()
  }

  const handleListingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setListingFormData({
          ...listingFormData,
          images: [...listingFormData.images, result],
        })
      }
      reader.readAsDataURL(file)
    }
    // Reset input so the same file can be selected again
    if (listingImageInputRef.current) {
      listingImageInputRef.current.value = ''
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
    const newCountries = (platform.topCountries || []).map((country, i) =>
      i === countryIndex ? { ...country, [field]: value } : country
    )
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


  return (
    <main className="min-h-screen bg-white">
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Profile
            </h1>
            <p className="text-lg text-gray-600 font-medium mb-6">
              Manage your profile information
            </p>

            {/* User Type Toggle */}
            <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200/50 w-fit">
              <button
                onClick={() => setUserType('creator')}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  userType === 'creator'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Creator Profile
              </button>
              <button
                onClick={() => setUserType('hotel')}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  userType === 'hotel'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Hotel Profile
              </button>
            </div>
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
                  {/* Tab Navigation with Edit Button */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 w-fit">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setActiveCreatorTab('overview')}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                            activeCreatorTab === 'overview'
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }`}
                        >
                          Overview
                        </button>
                        <button
                          onClick={() => setActiveCreatorTab('platforms')}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                            activeCreatorTab === 'platforms'
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }`}
                        >
                          Social Media Platforms
                        </button>
                        <button
                          onClick={() => setActiveCreatorTab('reviews')}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                            activeCreatorTab === 'reviews'
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }`}
                        >
                          Reviews & Ratings
                        </button>
                      </div>
                    </div>
                    {!isEditingProfile ? (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingProfile(true)}
                      >
                        <PencilIcon className="w-5 h-5 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSavingProfile}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleSaveProfile}
                          isLoading={isSavingProfile}
                          disabled={!editFormData.name || !editFormData.shortDescription || !editFormData.location}
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Tab Content */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {/* Overview Tab */}
                    {activeCreatorTab === 'overview' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                        </div>

                        {!isEditingProfile ? (
                          <div className="flex items-start gap-6">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0">
                              {creatorProfile.profilePicture ? (
                                <button
                                  onClick={() => setShowPictureModal(true)}
                                  className="cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                  <img
                                    src={creatorProfile.profilePicture}
                                    alt={creatorProfile.name}
                                    className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-100 shadow-lg"
                                  />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setShowPictureModal(true)}
                                  className="cursor-pointer hover:opacity-90 transition-opacity"
                                >
                                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-5xl shadow-lg border-4 border-gray-100">
                                    {creatorProfile.name.charAt(0)}
                                  </div>
                                </button>
                              )}
                            </div>

                            {/* Profile Information */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-3xl font-bold text-gray-900">{creatorProfile.name}</h3>
                                {creatorProfile.status === 'verified' && (
                                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                                    <CheckBadgeIcon className="w-5 h-5" />
                                    <span className="text-sm font-semibold">Verified</span>
                                  </div>
                                )}
                              </div>

                              {/* Location */}
                              <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <MapPinIcon className="w-5 h-5" />
                                <span className="text-lg">{creatorProfile.location}</span>
                              </div>

                              {/* Rating */}
                              {creatorProfile.rating && (
                                <div className="mb-4">
                                  <StarRating
                                    rating={creatorProfile.rating.averageRating}
                                    totalReviews={creatorProfile.rating.totalReviews}
                                    size="md"
                                  />
                                </div>
                              )}

                              {/* Short Description */}
                              <div className="mt-6">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                  Description
                                </h4>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                  {creatorProfile.shortDescription}
                                </p>
                              </div>

                              {/* Portfolio Link */}
                              {creatorProfile.portfolioLink && (
                                <div className="mt-6">
                                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Portfolio
                                  </h4>
                                  <a
                                    href={creatorProfile.portfolioLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>{creatorProfile.portfolioLink}</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Input
                                  label="Name"
                                  value={editFormData.name}
                                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                  required
                                  placeholder="Your name"
                                />
                              </div>
                              <div>
                                <Input
                                  label="Location"
                                  value={editFormData.location}
                                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                  required
                                  placeholder="City, Country"
                                />
                              </div>
                            </div>
                            <div>
                              <Textarea
                                label="Short Description"
                                value={editFormData.shortDescription}
                                onChange={(e) => setEditFormData({ ...editFormData, shortDescription: e.target.value })}
                                required
                                rows={4}
                                placeholder="Describe yourself and your content..."
                              />
                            </div>
                            <div>
                              <Input
                                label="Portfolio Link"
                                type="url"
                                value={editFormData.portfolioLink}
                                onChange={(e) => setEditFormData({ ...editFormData, portfolioLink: e.target.value })}
                                placeholder="https://yourportfolio.com"
                                helperText="Optional: Link to your portfolio website"
                              />
                            </div>
                          </div>
                        )}

                  {/* Contact Information Section */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                    </div>

                    <div className="space-y-6">
                      {!isEditingContact ? (
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

                          <Button
                            variant="outline"
                            onClick={() => setIsEditingContact(true)}
                            className="w-full sm:w-auto"
                          >
                            Edit Contact Information
                          </Button>
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
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
                          <div className="flex gap-3">
                            <Button
                              variant="primary"
                              onClick={handleSaveContact}
                              isLoading={isSavingContact}
                              disabled={!email || !email.includes('@')}
                            >
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditingContact(false)
                                if (creatorProfile?.email) {
                                  setEmail(creatorProfile.email)
                                }
                                if (creatorProfile?.phone) {
                                  setPhone(creatorProfile.phone)
                                }
                              }}
                              disabled={isSavingContact}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                      </div>
                    )}

                    {/* Social Media Platforms Tab */}
                    {activeCreatorTab === 'platforms' && (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-gray-900">Social Media Platforms</h2>
                          </div>
                          {isEditingProfile && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={addPlatform}
                            >
                              <PlusIcon className="w-4 h-4 mr-2" />
                              Add Platform
                            </Button>
                          )}
                        </div>

                        {!isEditingProfile ? (
                          <div className="space-y-4">
                            {creatorProfile.platforms.map((platform, index) => (
                              <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                              >
                                {/* Platform Header */}
                                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-700 border border-gray-200">
                                    {getPlatformIcon(platform.name)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold text-gray-900 text-lg">{platform.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <span className="font-medium">{platform.handle}</span>
                                      <span className="text-gray-400">•</span>
                                      <span>{formatFollowersDE(platform.followers)} Follower</span>
                                      <span className="text-gray-400">•</span>
                                      <span>{platform.engagementRate.toFixed(1).replace('.', ',')}% Engagement</span>
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
                                              {ageGroup.ageRange}: <span className="font-semibold text-gray-900">{ageGroup.percentage}%</span>
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
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {editFormData.platforms.map((platform, index) => (
                              <div
                                key={index}
                                className="p-6 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="font-semibold text-gray-900">Platform {index + 1}</h3>
                                  {editFormData.platforms.length > 1 && (
                                    <button
                                      onClick={() => removePlatform(index)}
                                      className="text-red-600 hover:text-red-700 p-1"
                                    >
                                      <XMarkIcon className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input
                                    label="Platform Name"
                                    value={platform.name}
                                    onChange={(e) => updatePlatform(index, 'name', e.target.value)}
                                    placeholder="Instagram, TikTok, YouTube, etc."
                                    required
                                  />
                                  <Input
                                    label="Handle"
                                    value={platform.handle}
                                    onChange={(e) => updatePlatform(index, 'handle', e.target.value)}
                                    placeholder="@username"
                                    required
                                  />
                                  <Input
                                    label="Followers"
                                    type="number"
                                    value={platform.followers || ''}
                                    onChange={(e) => updatePlatform(index, 'followers', parseInt(e.target.value) || 0)}
                                    placeholder="125000"
                                    required
                                  />
                                  <Input
                                    label="Engagement Rate (%)"
                                    type="number"
                                    step="0.1"
                                    value={platform.engagementRate || ''}
                                    onChange={(e) => updatePlatform(index, 'engagementRate', parseFloat(e.target.value) || 0)}
                                    placeholder="4.2"
                                    required
                                  />
                                </div>

                                {/* Top Countries */}
                                <div className="mt-6 pt-6 border-t border-gray-300">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-gray-900">Top Countries</h4>
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => addTopCountry(index)}
                                    >
                                      <PlusIcon className="w-4 h-4 mr-2" />
                                      Add Country
                                    </Button>
                                  </div>
                                  {(platform.topCountries || []).map((country, countryIdx) => (
                                    <div key={countryIdx} className="mb-3 p-3 bg-white rounded border border-gray-200">
                                      <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                          <Input
                                            label="Country"
                                            value={country.country}
                                            onChange={(e) => updateTopCountry(index, countryIdx, 'country', e.target.value)}
                                            placeholder="Germany, USA, etc."
                                          />
                                        </div>
                                        <div className="w-32">
                                          <Input
                                            label="Percentage"
                                            type="number"
                                            value={country.percentage || ''}
                                            onChange={(e) => updateTopCountry(index, countryIdx, 'percentage', parseInt(e.target.value) || 0)}
                                            placeholder="32"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeTopCountry(index, countryIdx)}
                                          className="mb-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                        >
                                          <XMarkIcon className="w-5 h-5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Top Age Groups */}
                                <div className="mt-6 pt-6 border-t border-gray-300">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-gray-900">Top Age Groups</h4>
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => addTopAgeGroup(index)}
                                    >
                                      <PlusIcon className="w-4 h-4 mr-2" />
                                      Add Age Group
                                    </Button>
                                  </div>
                                  {(platform.topAgeGroups || []).map((ageGroup, ageGroupIdx) => (
                                    <div key={ageGroupIdx} className="mb-3 p-3 bg-white rounded border border-gray-200">
                                      <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                          <Input
                                            label="Age Range"
                                            value={ageGroup.ageRange}
                                            onChange={(e) => updateTopAgeGroup(index, ageGroupIdx, 'ageRange', e.target.value)}
                                            placeholder="25-34, 18-24, etc."
                                          />
                                        </div>
                                        <div className="w-32">
                                          <Input
                                            label="Percentage"
                                            type="number"
                                            value={ageGroup.percentage || ''}
                                            onChange={(e) => updateTopAgeGroup(index, ageGroupIdx, 'percentage', parseInt(e.target.value) || 0)}
                                            placeholder="45"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeTopAgeGroup(index, ageGroupIdx)}
                                          className="mb-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                        >
                                          <XMarkIcon className="w-5 h-5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Gender Split */}
                                <div className="mt-6 pt-6 border-t border-gray-300">
                                  <h4 className="font-semibold text-gray-900 mb-4">Gender Split</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <Input
                                      label="Male (%)"
                                      type="number"
                                      value={platform.genderSplit?.male || ''}
                                      onChange={(e) => updateGenderSplit(index, 'male', parseInt(e.target.value) || 0)}
                                      placeholder="62"
                                    />
                                    <Input
                                      label="Female (%)"
                                      type="number"
                                      value={platform.genderSplit?.female || ''}
                                      onChange={(e) => updateGenderSplit(index, 'female', parseInt(e.target.value) || 0)}
                                      placeholder="38"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {editFormData.platforms.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                <p>No platforms added. Click "Add Platform" to get started.</p>
                              </div>
                            )}
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
                                    rating={creatorProfile.rating.averageRating}
                                    totalReviews={creatorProfile.rating.totalReviews}
                                    size="lg"
                                  />
                                </div>
                                <div className="text-right">
                                  <div className="text-4xl font-bold text-gray-900">
                                    {creatorProfile.rating.averageRating.toFixed(1)}
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
                              disabled={!hotelEditFormData.name || !hotelEditFormData.category || !hotelEditFormData.location}
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
                                {hotelProfile.picture ? (
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

                                {/* Category */}
                                <div className="mb-4">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
                                    {hotelProfile.category}
                                  </span>
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
                              <div>
                                <label className="block text-base font-medium text-gray-900 mb-2">
                                  Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={hotelEditFormData.category}
                                  onChange={(e) => setHotelEditFormData({ ...hotelEditFormData, category: e.target.value })}
                                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  required
                                >
                                  <option value="">Select category</option>
                                  {HOTEL_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                                </select>
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
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        const result = reader.result as string
                        setHotelPicturePreview(result)
                        setHotelEditFormData({ ...hotelEditFormData, picture: result })
                        setShowHotelPictureModal(false)
                        setIsEditingHotelProfile(true)
                      }
                      reader.readAsDataURL(file)
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
                {creatorProfile.profilePicture ? (
                  <img
                    src={creatorProfile.profilePicture}
                    alt={creatorProfile.name}
                    className="w-64 h-64 rounded-2xl object-cover border-4 border-gray-100 shadow-lg"
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
    </main>
  )
}
