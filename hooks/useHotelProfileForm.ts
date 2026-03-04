'use client'

import { useState, useRef, useCallback } from 'react'
import { countries } from 'countries-list'
import type { HotelFormState, ListingFormData } from '@/lib/types'

const COUNTRIES = Object.values(countries).map(country => country.name).sort()

interface UseHotelProfileFormOptions {
  initialName?: string
  onError?: (message: string) => void
}

export function useHotelProfileForm(options: UseHotelProfileFormOptions = {}) {
  const { initialName = '', onError } = options

  // Form state
  const [form, setForm] = useState<HotelFormState>({
    name: initialName,
    location: '',
    about: '',
    website: '',
    phone: '',
    picture: '',
  })

  // Listings state
  const [listings, setListings] = useState<ListingFormData[]>([])
  const [collapsedCards, setCollapsedCards] = useState<Set<number>>(new Set())
  const [countryInputs, setCountryInputs] = useState<Record<number, string>>({})

  // Image state
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const listingImageInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const hotelImageInputRef = useRef<HTMLInputElement>(null)

  // Form change handler
  const handleFormChange = useCallback((updates: Partial<HotelFormState>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }, [])

  // Profile image handler
  const handleProfileImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      onError?.('Please upload an image file (JPG, PNG, WebP)')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      onError?.('Image must be less than 20MB')
      return
    }

    setProfilePictureFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, picture: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }, [onError])

  // Listing handlers
  const addListing = useCallback(() => {
    setListings(prev => [...prev, {
      name: '',
      location: form.location || '',
      description: '',
      accommodation_type: '',
      images: [],
      imageFiles: [],
      collaborationTypes: [],
      availability: [],
      platforms: [],
      lookingForPlatforms: [],
      targetGroupCountries: [],
      targetGroupAgeGroups: [],
    }])
    listingImageInputRefs.current.push(null)
  }, [form.location])

  const removeListing = useCallback((index: number) => {
    setListings(prev => prev.filter((_, i) => i !== index))
    listingImageInputRefs.current = listingImageInputRefs.current.filter((_, i) => i !== index)

    // Clean up collapsed cards
    setCollapsedCards(prev => {
      const newCollapsed = new Set<number>()
      prev.forEach((collapsedIndex) => {
        if (collapsedIndex < index) {
          newCollapsed.add(collapsedIndex)
        } else if (collapsedIndex > index) {
          newCollapsed.add(collapsedIndex - 1)
        }
      })
      return newCollapsed
    })
  }, [])

  const toggleListingCollapse = useCallback((index: number) => {
    setCollapsedCards(prev => {
      const newCollapsed = new Set(prev)
      if (newCollapsed.has(index)) {
        newCollapsed.delete(index)
      } else {
        newCollapsed.add(index)
      }
      return newCollapsed
    })
  }, [])

  const updateListing = useCallback((
    index: number,
    field: keyof ListingFormData,
    value: ListingFormData[keyof ListingFormData]
  ) => {
    setListings(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  // Listing image handlers
  const handleListingImageChange = useCallback((
    listingIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const maxImages = 10
    const currentListing = listings[listingIndex]

    // Validate total count
    if (currentListing.images.length + fileArray.length > maxImages) {
      onError?.(`Maximum ${maxImages} images allowed per listing`)
      if (listingImageInputRefs.current[listingIndex]) {
        listingImageInputRefs.current[listingIndex]!.value = ''
      }
      return
    }

    // Validate all files first
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        onError?.('Please upload image files only (JPG, PNG, WebP)')
        if (listingImageInputRefs.current[listingIndex]) {
          listingImageInputRefs.current[listingIndex]!.value = ''
        }
        return
      }
      if (file.size > 20 * 1024 * 1024) {
        onError?.('Image must be less than 20MB')
        if (listingImageInputRefs.current[listingIndex]) {
          listingImageInputRefs.current[listingIndex]!.value = ''
        }
        return
      }
    }

    // Process all files
    let processedCount = 0
    const newImages: string[] = []
    const newFiles: File[] = []

    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImages.push(reader.result as string)
        newFiles.push(file)
        processedCount++

        // When all files are processed, update state once
        if (processedCount === fileArray.length) {
          setListings(prev => {
            const updated = [...prev]
            updated[listingIndex] = {
              ...updated[listingIndex],
              images: [...updated[listingIndex].images, ...newImages],
              imageFiles: [...updated[listingIndex].imageFiles, ...newFiles],
            }
            return updated
          })
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (listingImageInputRefs.current[listingIndex]) {
      listingImageInputRefs.current[listingIndex]!.value = ''
    }
  }, [listings, onError])

  const removeListingImage = useCallback((listingIndex: number, imageIndex: number) => {
    setListings(prev => {
      const updated = [...prev]
      updated[listingIndex] = {
        ...updated[listingIndex],
        images: updated[listingIndex].images.filter((_, i) => i !== imageIndex),
        imageFiles: updated[listingIndex].imageFiles.filter((_, i) => i !== imageIndex),
      }
      return updated
    })
  }, [])

  // Country input handler
  const handleCountryInputChange = useCallback((index: number, value: string) => {
    setCountryInputs(prev => ({ ...prev, [index]: value }))
  }, [])

  // Validation
  const validateForm = useCallback((): boolean => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      onError?.('Hotel name must be at least 2 characters')
      return false
    }

    if (!form.location.trim()) {
      onError?.('Location is required')
      return false
    }

    if (!form.about.trim()) {
      onError?.('About section is recommended. Please add a description about your hotel.')
      return false
    }

    if (form.about.trim().length < 50) {
      onError?.('About section must be at least 50 characters')
      return false
    }

    if (!form.website.trim()) {
      onError?.('Website is recommended. Please add your hotel website URL.')
      return false
    }

    if (listings.length === 0) {
      onError?.('At least one property listing is required. Please add a listing.')
      return false
    }

    // Validate each listing
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i]
      if (!listing.name.trim()) {
        onError?.(`Listing ${i + 1}: Property name is required`)
        return false
      }
      if (!listing.location.trim()) {
        onError?.(`Listing ${i + 1}: Property location is required`)
        return false
      }
      if (!listing.accommodation_type.trim()) {
        onError?.(`Listing ${i + 1}: Accommodation type is required`)
        return false
      }
      if (!listing.description.trim()) {
        onError?.(`Listing ${i + 1}: Property description is required`)
        return false
      }
      if (listing.description.trim().length < 10) {
        onError?.(`Listing ${i + 1}: Property description must be at least 10 characters`)
        return false
      }
      if (listing.collaborationTypes.length === 0) {
        onError?.(`Listing ${i + 1}: At least one collaboration type is required`)
        return false
      }
      if (listing.availability.length === 0) {
        onError?.(`Listing ${i + 1}: At least one availability month is required`)
        return false
      }
      if (listing.platforms.length === 0) {
        onError?.(`Listing ${i + 1}: At least one platform is required`)
        return false
      }
      if (listing.lookingForPlatforms.length === 0) {
        onError?.(`Listing ${i + 1}: At least one platform in "Looking For" is required`)
        return false
      }
      if (listing.collaborationTypes.includes('Free Stay')) {
        if (!listing.freeStayMinNights || listing.freeStayMinNights <= 0) {
          onError?.(`Listing ${i + 1}: Free Stay requires minimum nights greater than 0`)
          return false
        }
        if (!listing.freeStayMaxNights || listing.freeStayMaxNights < listing.freeStayMinNights) {
          onError?.(`Listing ${i + 1}: Free Stay max nights must be greater than min nights`)
          return false
        }
      }
      if (listing.collaborationTypes.includes('Paid')) {
        if (!listing.paidMaxAmount || listing.paidMaxAmount <= 0) {
          onError?.(`Listing ${i + 1}: Paid collaboration requires max amount greater than 0`)
          return false
        }
      }
      if (listing.collaborationTypes.includes('Discount')) {
        if (!listing.discountPercentage || listing.discountPercentage <= 0 || listing.discountPercentage > 100) {
          onError?.(`Listing ${i + 1}: Discount percentage must be between 1 and 100`)
          return false
        }
      }
    }

    return true
  }, [form, listings, onError])

  // Calculate progress
  const calculateProgress = useCallback((): number => {
    let progress = 0
    // Step 1: Basic Info (50% total)
    if (form.name.trim() && form.name.length >= 2) progress += 10
    if (form.location.trim()) progress += 10
    if (form.about.trim() && form.about.length >= 50) progress += 10
    if (form.website.trim()) progress += 10
    if (form.phone.trim()) progress += 10

    // Step 2: Listings (50% total)
    if (listings.length > 0) {
      progress += 20
      // check first listing for details
      const firstListing = listings[0]
      if (firstListing.name) progress += 5
      if (firstListing.location) progress += 5
      if (firstListing.description && firstListing.description.length >= 10) progress += 5
      if (firstListing.collaborationTypes.length > 0) progress += 5
      if (firstListing.availability.length > 0) progress += 10
    }

    return Math.min(100, progress)
  }, [form, listings])

  // Can proceed to next step
  const canProceedStep1 = useCallback((): boolean => {
    return !!(
      form.name.trim() &&
      form.name.trim().length >= 2 &&
      form.location.trim()
    )
  }, [form])

  return {
    // State
    form,
    listings,
    collapsedCards,
    countryInputs,
    countries: COUNTRIES,
    profilePictureFile,
    listingImageInputRefs,
    hotelImageInputRef,

    // Form handlers
    handleFormChange,
    handleProfileImageChange,

    // Listing handlers
    addListing,
    removeListing,
    toggleListingCollapse,
    updateListing,

    // Image handlers
    handleListingImageChange,
    removeListingImage,

    // Country input handler
    handleCountryInputChange,

    // Validation & progress
    validateForm,
    calculateProgress,
    canProceedStep1,

    // State setters for external control
    setForm,
    setListings,
    setProfilePictureFile,
  }
}
