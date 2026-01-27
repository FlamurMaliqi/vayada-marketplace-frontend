import type {
  ApiCreatorResponse,
  ApiPlatformResponse,
  ApiAgeGroup,
  ApiRatingResponse,
  CreatorProfile,
  ProfileHotelProfile,
  ProfileHotelListing,
  ListingFormData,
} from './types'
import type { PlatformAgeGroup, PlatformGenderSplit } from '@/lib/types'
import type { HotelProfile as ApiHotelProfile } from '@/lib/types'

/**
 * Transform frontend listing format to API format for create/update
 */
export function transformListingToApi(listingData: ListingFormData) {
  const offerings: Array<{
    collaboration_type: 'Free Stay' | 'Paid' | 'Discount'
    availability_months: string[]
    platforms: string[]
    free_stay_min_nights?: number
    free_stay_max_nights?: number
    paid_max_amount?: number
    discount_percentage?: number
  }> = []

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

  const result = {
    name: listingData.name,
    location: listingData.location,
    description: listingData.description,
    accommodation_type: listingData.accommodationType || undefined,
    images: listingData.images.filter((img) => !img.startsWith('data:')),
    collaboration_offerings: offerings,
    creator_requirements: {
      platforms: listingData.lookingForPlatforms,
      min_followers: listingData.lookingForMinFollowers || undefined,
      target_countries: listingData.targetGroupCountries,
      target_age_min: undefined as number | null | undefined,
      target_age_max: undefined as number | null | undefined,
      target_age_groups: listingData.targetGroupAgeGroups || [],
    },
  }

  if (listingData.targetGroupAgeGroups && listingData.targetGroupAgeGroups.length > 0) {
    let min = Infinity
    let max = -Infinity

    listingData.targetGroupAgeGroups.forEach(g => {
      if (g === '18-24') { min = Math.min(min, 18); max = Math.max(max, 24) }
      else if (g === '25-34') { min = Math.min(min, 25); max = Math.max(max, 34) }
      else if (g === '35-44') { min = Math.min(min, 35); max = Math.max(max, 44) }
      else if (g === '45-54') { min = Math.min(min, 45); max = Math.max(max, 54) }
      else if (g === '55+') { min = Math.min(min, 55); max = Math.max(max, 100) }
    })

    if (min !== Infinity) result.creator_requirements.target_age_min = min
    if (max !== -Infinity && max !== 100) {
      result.creator_requirements.target_age_max = max
    } else {
      result.creator_requirements.target_age_max = null
    }
  } else {
    result.creator_requirements.target_age_min = listingData.targetGroupAgeMin ?? null
    result.creator_requirements.target_age_max = listingData.targetGroupAgeMax ?? null
  }

  return result
}

/**
 * Transform API creator response to frontend CreatorProfile format
 * Handles both snake_case and camelCase API responses
 */
export function transformCreatorProfile(apiCreator: ApiCreatorResponse): CreatorProfile {
  const profilePicture = (apiCreator.profilePicture || apiCreator.profile_picture || '').trim() || undefined
  const shortDescription = apiCreator.shortDescription || apiCreator.short_description || ''
  const portfolioLink = apiCreator.portfolioLink || apiCreator.portfolio_link || undefined
  const email = apiCreator.email || ''
  const phone = apiCreator.phone || ''

  const platforms = (apiCreator.platforms || []).map((platform: ApiPlatformResponse) => {
    let genderSplit: PlatformGenderSplit = { male: 0, female: 0 }
    const rawGenderSplit = platform.genderSplit || platform.gender_split
    if (typeof rawGenderSplit === 'string') {
      try {
        genderSplit = JSON.parse(rawGenderSplit)
      } catch {
        genderSplit = { male: 0, female: 0 }
      }
    } else if (rawGenderSplit && typeof rawGenderSplit === 'object') {
      genderSplit = rawGenderSplit
    }

    const rawAgeGroups: ApiAgeGroup[] = platform.topAgeGroups || platform.top_age_groups || []
    const topAgeGroups = rawAgeGroups
      .map((ag: ApiAgeGroup) => {
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
      .filter((ag): ag is PlatformAgeGroup => {
        return ag !== null && ag.ageRange !== '' && ag.ageRange !== 'null'
      })

    return {
      id: platform.id,
      name: platform.name,
      handle: platform.handle || '',
      followers: platform.followers ?? 0,
      engagementRate: (platform.engagementRate || platform.engagement_rate) ?? 0,
      topCountries: platform.topCountries || platform.top_countries || [],
      topAgeGroups: topAgeGroups,
      genderSplit: genderSplit,
    }
  })

  const ratingData: ApiRatingResponse = apiCreator.rating || {}
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
    id: apiCreator.id || '',
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
export function transformHotelProfile(apiProfile: ApiHotelProfile): ProfileHotelProfile {
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
    listings: listings.map((apiListing): ProfileHotelListing => {
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
        targetGroupAgeGroups: creatorReqs.target_age_groups ?? [],
        status:
          apiListing.status === 'verified' || apiListing.status === 'pending' || apiListing.status === 'rejected'
            ? apiListing.status
            : 'pending',
      }
    }),
  }
}
