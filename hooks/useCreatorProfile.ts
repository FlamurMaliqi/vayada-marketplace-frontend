import { useState, useEffect, useRef } from 'react'
import { creatorService } from '@/services/api/creators'
import { ApiErrorResponse } from '@/services/api/client'
import { checkProfileStatus } from '@/lib/utils'
import { transformCreatorProfile } from '@/components/profile/transforms'
import { formatErrorForModal } from './useErrorModal'
import type { CreatorProfileStatus } from '@/lib/types'
import type { Creator as ApiCreator } from '@/lib/types'
import type {
  ProfilePlatform,
  PlatformAgeGroup,
  ApiCreatorResponse,
  CreatorUpdatePayload,
  CreatorProfile,
} from '@/components/profile/types'

export function useCreatorProfile(showError: (title: string, message: string | string[], details?: string) => void) {
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileStatus, setProfileStatus] = useState<CreatorProfileStatus | null>(null)
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false)
  const [activeCreatorTab, setActiveCreatorTab] = useState<'overview' | 'platforms' | 'reviews'>('overview')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [isSavingContact, setIsSavingContact] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [showPictureModal, setShowPictureModal] = useState(false)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [creatorProfilePictureFile, setCreatorProfilePictureFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const creatorImageInputRef = useRef<HTMLInputElement | null>(null)

  // Platform management state (co-located for edit sync)
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<number>>(new Set())
  const [platformCountryInputs, setPlatformCountryInputs] = useState<Record<number, string>>({})
  const [platformSaveStatus, setPlatformSaveStatus] = useState<Record<number, string>>({})

  const [editFormData, setEditFormData] = useState({
    name: '',
    profilePicture: '',
    shortDescription: '',
    location: '',
    portfolioLink: '',
    platforms: [] as ProfilePlatform[],
  })

  const loadProfile = async () => {
    setLoading(true)
    try {
      const status = await checkProfileStatus('creator') as CreatorProfileStatus | null
      setProfileStatus(status)

      if (status && !status.profile_complete) {
        setIsProfileIncomplete(true)
        setCreatorProfile(null)
        return
      }

      setIsProfileIncomplete(false)

      try {
        const apiProfile = await creatorService.getMyProfile()
        const profile = transformCreatorProfile(apiProfile as unknown as ApiCreatorResponse)
        setCreatorProfile(profile)
      } catch (error) {
        if (error instanceof ApiErrorResponse && error.status === 405) {
          console.warn('Profile endpoint not yet implemented:', error.status)
        } else {
          console.error('Failed to fetch creator profile:', error)
        }
        setCreatorProfile(null)
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
          const cleanAgeGroups: PlatformAgeGroup[] = (platform.topAgeGroups || [])
            .filter((ag): ag is PlatformAgeGroup => {
              return ag !== null && ag.ageRange !== undefined && ag.ageRange !== '' && ag.ageRange !== 'null'
            })

          return {
            ...platform,
            topCountries: platform.topCountries || [],
            topAgeGroups: cleanAgeGroups,
            genderSplit: platform.genderSplit || { male: 0, female: 0 },
          }
        }),
      })
      setExpandedPlatforms(new Set())
      setPlatformCountryInputs({})
    }
  }, [creatorProfile])

  const handleSaveContact = async () => {
    if (!email || !email.includes('@')) {
      return
    }

    setIsSavingContact(true)
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
    }, 500)
  }

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
      if (platform.topAgeGroups && platform.topAgeGroups.length > 0) {
        const invalidAgeGroups = platform.topAgeGroups.filter((tag) => {
          const ageRange = (tag.ageRange || '').toString().trim()
          return !ageRange || ageRange === '' || ageRange === 'null'
        })
        if (invalidAgeGroups.length > 0) {
          return `Platform ${i + 1}: All age groups must have a valid age range selected`
        }
      }
    }
    return null
  }

  const handleSaveProfile = async () => {
    const validationError = validateCreatorEdit()
    if (validationError) {
      showError('Validation Error', validationError)
      return
    }

    if (!creatorProfile) return

    setIsSavingProfile(true)
    try {
      const platforms = editFormData.platforms.map(platform => {
        const validAgeGroups = platform.topAgeGroups && platform.topAgeGroups.length > 0
          ? platform.topAgeGroups
            .filter((tag): tag is PlatformAgeGroup => {
              const ageRange = tag.ageRange?.trim() || ''
              return ageRange !== '' && ageRange !== 'null'
            })
            .map((tag) => ({
              ageRange: tag.ageRange.trim(),
              percentage: tag.percentage,
            }))
          : []

        return {
          name: platform.name as 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook',
          handle: platform.handle.trim(),
          followers: platform.followers,
          engagement_rate: platform.engagementRate,
          ...(platform.topCountries && platform.topCountries.length > 0 && {
            top_countries: platform.topCountries.map(tc => ({
              country: tc.country,
              percentage: tc.percentage,
            })),
          }),
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

      const audienceSize = platforms.reduce((sum, p) => sum + p.followers, 0)

      let profilePictureUrl: string | undefined = undefined
      if (creatorProfilePictureFile) {
        try {
          const uploadResponse = await creatorService.uploadProfilePicture(creatorProfilePictureFile)
          profilePictureUrl = uploadResponse.url
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

      const updatePayload: CreatorUpdatePayload = {
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
        ...(profilePictureUrl && {
          profilePicture: profilePictureUrl,
        }),
      }

      const updatedProfile = await creatorService.updateMyProfile(updatePayload as unknown as Partial<ApiCreator>)

      const responseWithSnakeCase = updatedProfile as ApiCreator & { profile_picture?: string | null }
      const pictureUrl = updatedProfile.profilePicture || responseWithSnakeCase.profile_picture
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

      await loadProfile()

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

  const handleCreatorImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      showError('Invalid File Type', 'Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('File Too Large', 'Image must be less than 5MB')
      return
    }

    try {
      setCreatorProfilePictureFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string)
        setEditFormData(prev => ({
          ...prev,
          profilePicture: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error handling image:', error)
    }
  }

  return {
    creatorProfile,
    setCreatorProfile,
    loading,
    profileStatus,
    isProfileIncomplete,
    activeCreatorTab,
    setActiveCreatorTab,
    email,
    setEmail,
    phone,
    setPhone,
    isEditingContact,
    setIsEditingContact,
    isSavingContact,
    isEditingProfile,
    setIsEditingProfile,
    isSavingProfile,
    showPictureModal,
    setShowPictureModal,
    profilePicturePreview,
    setProfilePicturePreview,
    creatorProfilePictureFile,
    setCreatorProfilePictureFile,
    editFormData,
    setEditFormData,
    fileInputRef,
    creatorImageInputRef,
    expandedPlatforms,
    setExpandedPlatforms,
    platformCountryInputs,
    setPlatformCountryInputs,
    platformSaveStatus,
    setPlatformSaveStatus,
    loadProfile,
    handleSaveContact,
    handleSaveProfile,
    handleCancelEdit,
    handleCreatorImageChange,
  }
}
