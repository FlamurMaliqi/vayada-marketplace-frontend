import { countries } from 'countries-list'
import type {
  ProfilePlatform,
  PlatformCountry,
  PlatformAgeGroup,
  PlatformGenderSplit,
} from '@/components/profile/types'

const COUNTRIES = Object.values(countries).map(country => country.name).sort()

export function usePlatformManagement(
  editFormData: { platforms: ProfilePlatform[] },
  setEditFormData: React.Dispatch<React.SetStateAction<{
    name: string
    profilePicture: string
    shortDescription: string
    location: string
    portfolioLink: string
    platforms: ProfilePlatform[]
  }>>,
  expandedPlatforms: Set<number>,
  setExpandedPlatforms: React.Dispatch<React.SetStateAction<Set<number>>>,
  platformCountryInputs: Record<number, string>,
  setPlatformCountryInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>,
) {
  const addPlatform = () => {
    setEditFormData(prev => ({
      ...prev,
      platforms: [...prev.platforms, {
        name: '',
        handle: '',
        followers: 0,
        engagementRate: 0,
        topCountries: [],
        topAgeGroups: [],
        genderSplit: { male: 0, female: 0 },
      }],
    }))
  }

  const removePlatform = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index),
    }))
  }

  const updatePlatform = (index: number, field: keyof ProfilePlatform, value: string | number | PlatformCountry[] | PlatformAgeGroup[] | PlatformGenderSplit) => {
    setEditFormData(prev => ({
      ...prev,
      platforms: prev.platforms.map((platform, i) =>
        i === index ? { ...platform, [field]: value } : platform
      ),
    }))
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
    if ((platform.topCountries || []).length >= 3) return
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
    ).slice(0, 8)
  }

  return {
    addPlatform,
    removePlatform,
    updatePlatform,
    addTopCountry,
    removeTopCountry,
    updateTopCountry,
    addTopAgeGroup,
    removeTopAgeGroup,
    updateTopAgeGroup,
    updateGenderSplit,
    togglePlatformExpanded,
    handleCountryInputChange,
    addCountryFromInput,
    removeCountryTag,
    toggleAgeGroupTag,
    getAvailableCountries,
  }
}
