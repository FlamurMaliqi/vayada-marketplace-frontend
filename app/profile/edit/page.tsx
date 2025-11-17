'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthenticatedNavigation, Footer, ProfileWarningBanner } from '@/components/layout'
import { Button, Input, Textarea } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import { hotelService, creatorService } from '@/services/api'
import type { Hotel, Creator, UserType, Platform, HotelProfile } from '@/lib/types'
import {
  PlusIcon,
  XMarkIcon,
  ArrowLeftIcon,
  PhotoIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ProfileEditPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>('creator')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Profile form data (from profiles table)
  const [profileData, setProfileData] = useState({
    email: '',
    avatar: '',
    name: '',
  })

  // Hotel Profile form data
  const [hotelProfileData, setHotelProfileData] = useState({
    name: '',
    description: '',
    logo: '',
  })
  
  // Listings management
  const [listings, setListings] = useState<Hotel[]>([])
  const [editingListing, setEditingListing] = useState<Hotel | null>(null)
  const [showListingForm, setShowListingForm] = useState(false)
  const [listingFormData, setListingFormData] = useState({
    name: '',
    location: '',
    description: '',
    images: [] as string[],
    newImage: '',
    accommodationType: '',
    collaborationType: '' as 'Kostenlos' | 'Bezahlt' | '',
    availability: [] as string[],
  })
  const [listingImageErrors, setListingImageErrors] = useState<Set<number>>(new Set())

  // Creator form data
  const [creatorData, setCreatorData] = useState({
    name: '',
    location: '',
    niche: [] as string[],
    newNiche: '',
    audienceSize: 0,
    platforms: [] as Platform[],
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      // Hardcode userType for now - will be set by backend later
      // For testing: change 'hotel' to 'creator' to test creator profile
      const hardcodedUserType: UserType = 'hotel'
      
      // Set in localStorage for consistency
      if (typeof window !== 'undefined') {
        if (!localStorage.getItem('userType')) {
          localStorage.setItem('userType', hardcodedUserType)
        }
      }
      
      // Get user type from localStorage (in production, this would come from auth context)
      const storedUserType = typeof window !== 'undefined'
        ? (localStorage.getItem('userType') as UserType) || hardcodedUserType
        : hardcodedUserType
      
      setUserType(storedUserType)

      // Get user ID (in production, this would come from auth context)
      const userId = typeof window !== 'undefined'
        ? localStorage.getItem('userId') || '1'
        : '1'

      // Load profile data (from profiles table)
      // In production, this would come from the profiles API
      const profileInfo = {
        email: typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : '',
        avatar: typeof window !== 'undefined' ? localStorage.getItem('userAvatar') || '' : '',
        name: typeof window !== 'undefined' ? localStorage.getItem('userName') || '' : '',
      }
      setProfileData(profileInfo)

      if (storedUserType === 'hotel') {
        try {
          // In production, this would fetch HotelProfile with all listings
          // For now, use mock data
          const mockHotelProfile = getMockHotelProfile(userId)
          setHotelProfileData({
            name: mockHotelProfile.name || '',
            description: mockHotelProfile.description || '',
            logo: mockHotelProfile.logo || '',
          })
          setListings(mockHotelProfile.listings || [])
          setImageErrors(new Set()) // Clear image errors when loading
          // Update profile name if not set
          if (!profileInfo.name) {
            setProfileData(prev => ({ ...prev, name: mockHotelProfile.name || '' }))
          }
        } catch (error) {
          console.error('Error loading hotel profile:', error)
          // Use mock data for development
          const mockHotelProfile = getMockHotelProfile(userId)
          setHotelProfileData({
            name: mockHotelProfile.name || '',
            description: mockHotelProfile.description || '',
            logo: mockHotelProfile.logo || '',
          })
          setListings(mockHotelProfile.listings || [])
          if (!profileInfo.name) {
            setProfileData(prev => ({ ...prev, name: mockHotelProfile.name || '' }))
          }
        }
      } else {
        try {
          const creator = await creatorService.getById(userId)
          setCreatorData({
            name: creator.name || '',
            location: creator.location || '',
            niche: creator.niche || [],
            newNiche: '',
            audienceSize: creator.audienceSize || 0,
            platforms: creator.platforms || [],
          })
          // Update profile name if not set
          if (!profileInfo.name) {
            setProfileData(prev => ({ ...prev, name: creator.name || '' }))
          }
        } catch (error) {
          console.error('Error loading creator profile:', error)
          // Use mock data for development
          const mockCreator = getMockCreator(userId)
          setCreatorData({
            name: mockCreator.name || '',
            location: mockCreator.location || '',
            niche: mockCreator.niche || [],
            newNiche: '',
            audienceSize: mockCreator.audienceSize || 0,
            platforms: mockCreator.platforms || [],
          })
          if (!profileInfo.name) {
            setProfileData(prev => ({ ...prev, name: mockCreator.name || '' }))
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Profile form handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  // Hotel Profile form handlers
  const handleHotelProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setHotelProfileData(prev => ({ ...prev, [name]: value }))
  }

  // Listing form handlers
  const handleListingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setListingFormData(prev => ({ ...prev, [name]: value }))
  }

  const addListingImage = () => {
    if (listingFormData.newImage.trim()) {
      setListingFormData(prev => ({
        ...prev,
        images: [...prev.images, prev.newImage.trim()],
        newImage: '',
      }))
      setListingImageErrors(prev => {
        const newSet = new Set(prev)
        newSet.delete(listingFormData.images.length)
        return newSet
      })
    }
  }

  const removeListingImage = (index: number) => {
    setListingFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setListingImageErrors(prev => {
      const newSet = new Set<number>()
      prev.forEach(errIndex => {
        if (errIndex < index) {
          newSet.add(errIndex)
        } else if (errIndex > index) {
          newSet.add(errIndex - 1)
        }
      })
      return newSet
    })
  }

  const moveListingImageUp = (index: number) => {
    if (index === 0) return
    setListingFormData(prev => {
      const newImages = [...prev.images]
      const temp = newImages[index]
      newImages[index] = newImages[index - 1]
      newImages[index - 1] = temp
      return { ...prev, images: newImages }
    })
    setListingImageErrors(prev => {
      const newSet = new Set<number>()
      prev.forEach(errIndex => {
        if (errIndex === index) {
          newSet.add(index - 1)
        } else if (errIndex === index - 1) {
          newSet.add(index)
        } else {
          newSet.add(errIndex)
        }
      })
      return newSet
    })
  }

  const moveListingImageDown = (index: number) => {
    if (index === listingFormData.images.length - 1) return
    setListingFormData(prev => {
      const newImages = [...prev.images]
      const temp = newImages[index]
      newImages[index] = newImages[index + 1]
      newImages[index + 1] = temp
      return { ...prev, images: newImages }
    })
    setListingImageErrors(prev => {
      const newSet = new Set<number>()
      prev.forEach(errIndex => {
        if (errIndex === index) {
          newSet.add(index + 1)
        } else if (errIndex === index + 1) {
          newSet.add(index)
        } else {
          newSet.add(errIndex)
        }
      })
      return newSet
    })
  }

  // Listing management functions
  const openNewListingForm = () => {
    setEditingListing(null)
    setListingFormData({
      name: '',
      location: '',
      description: '',
      images: [],
      newImage: '',
      accommodationType: '',
      collaborationType: '',
      availability: [],
    })
    setListingImageErrors(new Set())
    setShowListingForm(true)
  }

  const openEditListingForm = (listing: Hotel) => {
    setEditingListing(listing)
    setListingFormData({
      name: listing.name,
      location: listing.location,
      description: listing.description,
      images: listing.images || [],
      newImage: '',
      accommodationType: listing.accommodationType || '',
      collaborationType: listing.collaborationType || '',
      availability: listing.availability || [],
    })
    setListingImageErrors(new Set())
    setShowListingForm(true)
  }

  const cancelListingForm = () => {
    setShowListingForm(false)
    setEditingListing(null)
    setListingFormData({
      name: '',
      location: '',
      description: '',
      images: [],
      newImage: '',
      accommodationType: '',
      collaborationType: '',
      availability: [],
    })
    setListingImageErrors(new Set())
  }

  const saveListing = () => {
    if (!listingFormData.name || !listingFormData.location || !listingFormData.description) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.')
      return
    }

    const userId = typeof window !== 'undefined'
      ? localStorage.getItem('userId') || '1'
      : '1'

    if (editingListing) {
      // Update existing listing
      setListings(prev => prev.map(listing => 
        listing.id === editingListing.id
          ? {
              ...listing,
              name: listingFormData.name,
              location: listingFormData.location,
              description: listingFormData.description,
              images: listingFormData.images,
              accommodationType: listingFormData.accommodationType || undefined,
              collaborationType: listingFormData.collaborationType as 'Kostenlos' | 'Bezahlt' || undefined,
              availability: listingFormData.availability,
              updatedAt: new Date(),
            }
          : listing
      ))
    } else {
      // Create new listing
      const newListing: Hotel = {
        id: `listing-${Date.now()}`,
        hotelProfileId: `profile-${userId}`,
        name: listingFormData.name,
        location: listingFormData.location,
        description: listingFormData.description,
        images: listingFormData.images,
        accommodationType: listingFormData.accommodationType || undefined,
        collaborationType: listingFormData.collaborationType as 'Kostenlos' | 'Bezahlt' || undefined,
        availability: listingFormData.availability,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setListings(prev => [...prev, newListing])
    }

    cancelListingForm()
  }

  const deleteListing = (listingId: string) => {
    if (confirm('Möchten Sie dieses Listing wirklich löschen?')) {
      setListings(prev => prev.filter(listing => listing.id !== listingId))
    }
  }

  const toggleAvailabilityMonth = (month: string) => {
    setListingFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(month)
        ? prev.availability.filter(m => m !== month)
        : [...prev.availability, month],
    }))
  }

  // Creator form handlers
  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'audienceSize') {
      setCreatorData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setCreatorData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addNiche = () => {
    if (creatorData.newNiche.trim()) {
      setCreatorData(prev => ({
        ...prev,
        niche: [...prev.niche, prev.newNiche.trim()],
        newNiche: '',
      }))
    }
  }

  const removeNiche = (index: number) => {
    setCreatorData(prev => ({
      ...prev,
      niche: prev.niche.filter((_, i) => i !== index),
    }))
  }

  const addPlatform = () => {
    setCreatorData(prev => ({
      ...prev,
      platforms: [...prev.platforms, { name: '', handle: '', followers: 0, engagementRate: 0 }],
    }))
  }

  const removePlatform = (index: number) => {
    setCreatorData(prev => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index),
    }))
  }

  const updatePlatform = (index: number, field: string, value: string | number) => {
    setCreatorData(prev => ({
      ...prev,
      platforms: prev.platforms.map((platform, i) =>
        i === index ? { ...platform, [field]: value } : platform
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const userId = typeof window !== 'undefined'
        ? localStorage.getItem('userId') || '1'
        : '1'

      if (userType === 'hotel') {
        // Update hotel profile and listings
        console.log('Updating hotel profile:', hotelProfileData)
        console.log('Updating listings:', listings)
        // TODO: API call to update hotel profile and listings
        // await hotelProfileService.update(userId, {
        //   name: hotelProfileData.name,
        //   description: hotelProfileData.description,
        //   logo: hotelProfileData.logo,
        //   listings: listings,
        // })
      } else {
        // Update creator profile
        console.log('Updating creator profile:', creatorData)
        // TODO: API call to update creator profile
        await creatorService.update(userId, {
          name: creatorData.name,
          location: creatorData.location,
          niche: creatorData.niche,
          platforms: creatorData.platforms,
        })
      }

      // Mark profile as complete
      if (typeof window !== 'undefined') {
        localStorage.setItem('profileComplete', 'true')
        localStorage.setItem('hasProfile', 'true')
      }

      // Redirect to profile page after successful update
      router.push(ROUTES.PROFILE)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavigation />
        <ProfileWarningBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />
      <ProfileWarningBanner />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={ROUTES.PROFILE}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Edit Profile
          </h1>
          <p className="text-lg text-gray-600">
            {userType === 'hotel'
              ? 'Update your hotel information'
              : 'Update your creator profile'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Profile Information Section */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Input
                  label="Avatar URL"
                  name="avatar"
                  type="url"
                  value={profileData.avatar}
                  onChange={handleProfileChange}
                  placeholder="https://example.com/avatar.jpg"
                  helperText="URL to your profile picture"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                  placeholder="Your full name"
                />
              </div>
            </div>
          </div>

          {/* Hotel or Creator Specific Fields */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {userType === 'hotel' ? 'Hotel Information' : 'Creator Information'}
            </h2>
          </div>

          {userType === 'hotel' ? (
            <>
              {/* Hotel Profile Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hotel Profil Information</h3>
                <div className="space-y-4">
                  <div>
                    <Input
                      label="Firmenname / Hotelkette"
                      name="name"
                      value={hotelProfileData.name}
                      onChange={handleHotelProfileChange}
                      required
                      placeholder="Luxury Villa Management"
                    />
                  </div>
                  <div>
                    <Textarea
                      label="Beschreibung"
                      name="description"
                      value={hotelProfileData.description}
                      onChange={handleHotelProfileChange}
                      placeholder="Beschreiben Sie Ihre Hotelkette oder Agentur..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Input
                      label="Logo URL (optional)"
                      name="logo"
                      type="url"
                      value={hotelProfileData.logo}
                      onChange={handleHotelProfileChange}
                      placeholder="https://example.com/logo.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Listings Management */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Properties / Listings</h3>
                  {!showListingForm && (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={openNewListingForm}
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Neues Listing hinzufügen
                    </Button>
                  )}
                </div>

                {/* Listing Form */}
                {showListingForm && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-primary-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {editingListing ? 'Listing bearbeiten' : 'Neues Listing hinzufügen'}
                      </h4>
                      <button
                        type="button"
                        onClick={cancelListingForm}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Property Name *"
                          name="name"
                          value={listingFormData.name}
                          onChange={handleListingFormChange}
                          required
                          placeholder="Sunset Beach Villa"
                        />
                        <Input
                          label="Standort *"
                          name="location"
                          value={listingFormData.location}
                          onChange={handleListingFormChange}
                          required
                          placeholder="Bali, Indonesia"
                        />
                      </div>

                      <Textarea
                        label="Beschreibung *"
                        name="description"
                        value={listingFormData.description}
                        onChange={handleListingFormChange}
                        required
                        placeholder="Beschreiben Sie diese Property..."
                        rows={3}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unterkunftstyp
                          </label>
                          <select
                            name="accommodationType"
                            value={listingFormData.accommodationType}
                            onChange={handleListingFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="">Bitte wählen</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Resort">Resort</option>
                            <option value="Boutique Hotel">Boutique Hotel</option>
                            <option value="Lodge">Lodge</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kollaborationstyp
                          </label>
                          <select
                            name="collaborationType"
                            value={listingFormData.collaborationType}
                            onChange={handleListingFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="">Bitte wählen</option>
                            <option value="Kostenlos">Kostenlos</option>
                            <option value="Bezahlt">Bezahlt</option>
                          </select>
                        </div>
                      </div>

                      {/* Availability Months */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Verfügbarkeit (Monate)
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'].map((month) => (
                            <button
                              key={month}
                              type="button"
                              onClick={() => toggleAvailabilityMonth(month)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                listingFormData.availability.includes(month)
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {month.substring(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Listing Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bilder
                        </label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            name="newImage"
                            value={listingFormData.newImage}
                            onChange={handleListingFormChange}
                            placeholder="https://example.com/image.jpg"
                            type="url"
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addListingImage()
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addListingImage}
                          >
                            <PlusIcon className="w-5 h-5" />
                          </Button>
                        </div>
                        {listingFormData.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {listingFormData.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Listing image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                  onError={() => {
                                    setListingImageErrors(prev => new Set(prev).add(index))
                                  }}
                                />
                                {!listingImageErrors.has(index) && (
                                  <button
                                    type="button"
                                    onClick={() => removeListingImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="primary"
                          onClick={saveListing}
                          className="flex-1"
                        >
                          {editingListing ? 'Änderungen speichern' : 'Listing hinzufügen'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelListingForm}
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Listings List */}
                {listings.length > 0 ? (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{listing.name}</h4>
                            <p className="text-sm text-gray-600">{listing.location}</p>
                            {listing.accommodationType && (
                              <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                                {listing.accommodationType}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openEditListingForm(listing)}
                            >
                              Bearbeiten
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => deleteListing(listing.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Noch keine Listings vorhanden.</p>
                    <p className="text-sm mt-2">Klicken Sie auf "Neues Listing hinzufügen" um zu beginnen.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <Input
                  label="Creator Name / Brand Name"
                  name="name"
                  value={creatorData.name}
                  onChange={handleCreatorChange}
                  required
                  placeholder="Sarah Travels"
                />
              </div>

              <div>
                <Input
                  label="Location"
                  name="location"
                  value={creatorData.location}
                  onChange={handleCreatorChange}
                  required
                  placeholder="Bali, Indonesia"
                />
              </div>

              <div>
                <Input
                  label="Total Audience Size"
                  name="audienceSize"
                  type="number"
                  value={creatorData.audienceSize || ''}
                  onChange={handleCreatorChange}
                  placeholder="170000"
                  helperText="Total number of followers across all platforms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niche / Specialties
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    name="newNiche"
                    value={creatorData.newNiche}
                    onChange={handleCreatorChange}
                    placeholder="Add niche (e.g., Luxury Travel, Beach Destinations)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addNiche()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addNiche}>
                    <PlusIcon className="w-5 h-5" />
                  </Button>
                </div>
                {creatorData.niche.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {creatorData.niche.map((niche, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm"
                      >
                        {niche}
                        <button
                          type="button"
                          onClick={() => removeNiche(index)}
                          className="hover:text-primary-900"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Social Media Platforms
                  </label>
                  <Button type="button" variant="outline" size="sm" onClick={addPlatform}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Platform
                  </Button>
                </div>
                <div className="space-y-4">
                  {creatorData.platforms.map((platform, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Platform {index + 1}</h4>
                        {creatorData.platforms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePlatform(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Platform Name"
                          value={platform.name}
                          onChange={(e) =>
                            updatePlatform(index, 'name', e.target.value)
                          }
                          placeholder="Instagram"
                          required
                        />
                        <Input
                          label="Handle"
                          value={platform.handle}
                          onChange={(e) =>
                            updatePlatform(index, 'handle', e.target.value)
                          }
                          placeholder="@username"
                          required
                        />
                        <Input
                          label="Followers"
                          type="number"
                          value={platform.followers || ''}
                          onChange={(e) =>
                            updatePlatform(index, 'followers', parseInt(e.target.value) || 0)
                          }
                          placeholder="100000"
                          required
                        />
                        <Input
                          label="Engagement Rate (%)"
                          type="number"
                          step="0.1"
                          value={platform.engagementRate || ''}
                          onChange={(e) =>
                            updatePlatform(index, 'engagementRate', parseFloat(e.target.value) || 0)
                          }
                          placeholder="4.5"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  {creatorData.platforms.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No platforms added. Click "Add Platform" to get started.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
              isLoading={saving}
            >
              Save Changes
            </Button>
            <Link href={ROUTES.PROFILE}>
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  )
}

// Mock data for development
function getMockHotelProfile(id: string): HotelProfile {
  return {
    id: 'profile-1',
    userId: id,
    name: 'Luxury Villa Management',
    description: 'Wir sind eine führende Villa-Management-Agentur mit über 15 exklusiven Properties in den schönsten Destinationen weltweit.',
    logo: undefined,
    listings: [
      {
        id: '1',
        hotelProfileId: 'profile-1',
        name: 'Sunset Beach Villa',
        location: 'Bali, Indonesia',
        description: 'Luxuriöse Strandvilla mit atemberaubendem Meerblick und erstklassigen Annehmlichkeiten.',
        images: ['/hotel1.jpg'],
        accommodationType: 'Villa',
        collaborationType: 'Kostenlos',
        availability: ['Juni', 'Juli', 'August', 'September'],
        platforms: ['Instagram', 'TikTok'],
        status: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        hotelProfileId: 'profile-1',
        name: 'Mountain View Lodge',
        location: 'Swiss Alps, Switzerland',
        description: 'Gemütliche Alpenlodge perfekt für Abenteuerlustige und Naturliebhaber.',
        images: ['/hotel2.jpg'],
        accommodationType: 'Lodge',
        collaborationType: 'Bezahlt',
        availability: ['Dezember', 'Januar', 'Februar', 'März'],
        platforms: ['Instagram', 'Facebook'],
        status: 'verified',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    status: 'verified',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

function getMockCreator(id: string): Creator {
  return {
    id,
    name: 'Sarah Travels',
    niche: ['Luxury Travel', 'Beach Destinations'],
    platforms: [
      {
        name: 'Instagram',
        handle: '@sarahtravels',
        followers: 125000,
        engagementRate: 4.2,
      },
    ],
    audienceSize: 170000,
    location: 'Bali, Indonesia',
    status: 'verified',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

