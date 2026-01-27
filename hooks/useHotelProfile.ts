import { useState, useEffect, useRef } from 'react'
import { hotelService } from '@/services/api/hotels'
import { ApiErrorResponse } from '@/services/api/client'
import { checkProfileStatus } from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/constants'
import { transformHotelProfile } from '@/components/profile/transforms'
import { formatErrorForModal } from './useErrorModal'
import type { HotelProfileStatus } from '@/lib/types'
import type { ProfileHotelProfile } from '@/components/profile/types'

export function useHotelProfile(showError: (title: string, message: string | string[], details?: string) => void) {
  const [hotelProfile, setHotelProfile] = useState<ProfileHotelProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileStatus, setProfileStatus] = useState<HotelProfileStatus | null>(null)
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false)
  const [activeHotelTab, setActiveHotelTab] = useState<'overview' | 'listings'>('overview')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [isSavingContact, setIsSavingContact] = useState(false)
  const [isEditingHotelProfile, setIsEditingHotelProfile] = useState(false)
  const [isSavingHotelProfile, setIsSavingHotelProfile] = useState(false)
  const [showHotelPictureModal, setShowHotelPictureModal] = useState(false)
  const [hotelPicturePreview, setHotelPicturePreview] = useState<string | null>(null)
  const [hotelProfilePictureFile, setHotelProfilePictureFile] = useState<File | null>(null)
  const hotelFileInputRef = useRef<HTMLInputElement | null>(null)

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

  const [collapsedListingCards, setCollapsedListingCards] = useState<Set<string>>(new Set())

  const loadProfile = async () => {
    setLoading(true)
    try {
      const status = await checkProfileStatus('hotel') as HotelProfileStatus | null
      setProfileStatus(status)

      if (status && !status.profile_complete) {
        setIsProfileIncomplete(true)
        setHotelProfile(null)
        return
      }

      setIsProfileIncomplete(false)

      try {
        const apiProfile = await hotelService.getMyProfile()
        const profile = transformHotelProfile(apiProfile)
        setHotelProfile(profile)
      } catch (error) {
        if (error instanceof ApiErrorResponse && error.status === 405) {
          console.warn('Profile endpoint not yet implemented:', error.status)
        } else {
          console.error('Failed to fetch hotel profile:', error)
        }
        setHotelProfile(null)
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
    loadProfile()
  }, [])

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
      if (hotelProfile.listings && hotelProfile.listings.length > 0) {
        setCollapsedListingCards(new Set(hotelProfile.listings.map(listing => listing.id)))
      } else {
        setCollapsedListingCards(new Set())
      }
    }
  }, [hotelProfile])

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
    const validationError = validateHotelEdit()
    if (validationError) {
      showError('Validation Error', validationError)
      return
    }

    if (!hotelProfile) return

    setIsSavingHotelProfile(true)
    try {
      const payload: {
        name?: string
        location?: string
        picture?: string | null
        website?: string
        about?: string
        email?: string
        phone?: string
      } = {}

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

      if (hotelProfilePictureFile) {
        const formData = new FormData()

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

        const userEmail = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL) : null
        if (userEmail && userEmail !== hotelProfile.email) {
          formData.append('email', userEmail)
        }

        formData.append('picture', hotelProfilePictureFile)

        const updatedProfile = await hotelService.updateMyProfile(formData)

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
        const currentPicture = hotelProfile.picture || ''
        const newPicture = hotelEditFormData.picture || ''
        if (newPicture !== currentPicture) {
          if (newPicture.trim() === '') {
            payload.picture = null
          } else if (!newPicture.startsWith('data:')) {
            payload.picture = newPicture.trim()
          }
        }

        const userEmail = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.USER_EMAIL) : null
        if (userEmail && userEmail !== hotelProfile.email) {
          payload.email = userEmail
        }

        if (Object.keys(payload).length === 0) {
          setIsEditingHotelProfile(false)
          setIsSavingHotelProfile(false)
          return
        }

        const updatedProfile = await hotelService.updateMyProfile(payload)

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

      await loadProfile()

      setIsEditingHotelProfile(false)

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

      if (Object.keys(payload).length === 0) {
        setIsEditingContact(false)
        setIsSavingContact(false)
        return
      }

      await hotelService.updateMyProfile(payload)
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

  return {
    hotelProfile,
    setHotelProfile,
    loading,
    profileStatus,
    isProfileIncomplete,
    activeHotelTab,
    setActiveHotelTab,
    email,
    setEmail,
    phone,
    setPhone,
    isEditingContact,
    setIsEditingContact,
    isSavingContact,
    isEditingHotelProfile,
    setIsEditingHotelProfile,
    isSavingHotelProfile,
    showHotelPictureModal,
    setShowHotelPictureModal,
    hotelPicturePreview,
    setHotelPicturePreview,
    hotelProfilePictureFile,
    setHotelProfilePictureFile,
    hotelEditFormData,
    setHotelEditFormData,
    hotelFileInputRef,
    collapsedListingCards,
    setCollapsedListingCards,
    loadProfile,
    handleSaveHotelProfile,
    handleCancelHotelEdit,
    handleSaveHotelContact,
  }
}
