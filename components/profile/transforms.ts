import type {
  ApiCreatorResponse,
  ApiPlatformResponse,
  ApiAgeGroup,
  ApiRatingResponse,
  CreatorProfile,
  ProfileHotelProfile,
  ProfileHotelListing,
  ListingFormData,
  ListingOffering,
} from './types'
import type { PlatformAgeGroup, PlatformGenderSplit, CreatorType, CollaborationOffering } from '@/lib/types'
import type { HotelProfile as ApiHotelProfile } from '@/lib/types'

type ApiOfferingPayload = {
  collaboration_type: 'Free Stay' | 'Paid' | 'Discount' | 'Affiliate'
  availability_months: string[]
  platforms: string[]
  min_followers?: number
  free_stay_min_nights?: number
  free_stay_max_nights?: number
  paid_max_amount?: number
  currency?: string
  discount_percentage?: number
  commission_percentage?: number
}

function offeringToApi(o: ListingOffering): ApiOfferingPayload {
  const base: ApiOfferingPayload = {
    collaboration_type: o.type,
    availability_months: o.availabilityMonths,
    platforms: o.platforms,
  }
  if (o.minFollowers !== undefined && o.minFollowers !== null) base.min_followers = o.minFollowers
  if (o.type === 'Free Stay') {
    base.free_stay_min_nights = o.freeStayMinNights
    base.free_stay_max_nights = o.freeStayMaxNights
  } else if (o.type === 'Paid') {
    base.paid_max_amount = o.paidMaxAmount
    base.currency = o.currency || 'USD'
  } else if (o.type === 'Discount') {
    base.discount_percentage = o.discountPercentage
  } else if (o.type === 'Affiliate') {
    base.commission_percentage = o.commissionPercentage
  }
  return base
}

/**
 * Transform frontend listing format to API format for create/update
 */
export function transformListingToApi(listingData: ListingFormData) {
  const offerings = listingData.offerings.map(offeringToApi)

  const result = {
    name: listingData.name,
    location: listingData.location,
    description: listingData.description,
    accommodation_type: listingData.accommodationType || undefined,
    images: listingData.images.filter((img) => !img.startsWith('data:')),
    collaboration_offerings: offerings,
    creator_requirements: {
      platforms: listingData.lookingForPlatforms,
      target_countries: listingData.targetGroupCountries,
      target_age_min: undefined as number | null | undefined,
      target_age_max: undefined as number | null | undefined,
      target_age_groups: listingData.targetGroupAgeGroups || [],
      creator_types: listingData.lookingForCreatorTypes || [],
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
  const creatorType: CreatorType = (apiCreator.creatorType || apiCreator.creator_type || 'Lifestyle') as CreatorType
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
    creatorType,
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
      const apiOfferings = apiListing.collaboration_offerings || []

      const offerings: ListingOffering[] = apiOfferings.map((o: CollaborationOffering) => ({
        type: o.collaboration_type,
        availabilityMonths: o.availability_months || [],
        platforms: o.platforms || [],
        minFollowers: o.min_followers ?? undefined,
        freeStayMinNights: o.free_stay_min_nights ?? undefined,
        freeStayMaxNights: o.free_stay_max_nights ?? undefined,
        paidMaxAmount: o.paid_max_amount ?? undefined,
        currency: o.currency ?? undefined,
        discountPercentage: o.discount_percentage ?? undefined,
        commissionPercentage: o.commission_percentage ?? undefined,
      }))

      // Aggregated/legacy fields kept so existing read-only views don't break.
      const collaborationTypes = Array.from(
        new Set(apiOfferings.map((o) => o.collaboration_type)),
      ) as ProfileHotelListing['collaborationTypes']

      const availabilityMonths = Array.from(
        new Set(apiOfferings.flatMap((o) => o.availability_months || []))
      )
      const platforms = Array.from(new Set(apiOfferings.flatMap((o) => o.platforms || [])))

      const freeStayOffering = apiOfferings.find((o) => o.collaboration_type === 'Free Stay')
      const paidOffering = apiOfferings.find((o) => o.collaboration_type === 'Paid')
      const discountOffering = apiOfferings.find((o) => o.collaboration_type === 'Discount')
      const affiliateOffering = apiOfferings.find((o) => o.collaboration_type === 'Affiliate')

      const creatorReqs = apiListing.creator_requirements || {
        platforms: [],
        target_countries: [],
        target_age_min: undefined,
        target_age_max: undefined,
        creator_types: [],
      }

      return {
        id: apiListing.id,
        name: apiListing.name,
        location: apiListing.location,
        description: apiListing.description,
        images: apiListing.images || [],
        accommodationType: apiListing.accommodation_type || undefined,
        offerings,
        collaborationTypes,
        availability: availabilityMonths,
        platforms,
        freeStayMinNights: freeStayOffering?.free_stay_min_nights ?? undefined,
        freeStayMaxNights: freeStayOffering?.free_stay_max_nights ?? undefined,
        paidMaxAmount: paidOffering?.paid_max_amount ?? undefined,
        currency: paidOffering?.currency ?? undefined,
        discountPercentage: discountOffering?.discount_percentage ?? undefined,
        commissionPercentage: affiliateOffering?.commission_percentage ?? undefined,
        lookingForPlatforms: creatorReqs.platforms || [],
        targetGroupCountries: creatorReqs.target_countries || [],
        targetGroupAgeMin: creatorReqs.target_age_min ?? undefined,
        targetGroupAgeMax: creatorReqs.target_age_max ?? undefined,
        targetGroupAgeGroups: creatorReqs.target_age_groups ?? [],
        lookingForCreatorTypes: (creatorReqs.creator_types || []) as CreatorType[],
        status:
          apiListing.status === 'verified' || apiListing.status === 'pending' || apiListing.status === 'rejected'
            ? apiListing.status
            : 'pending',
      }
    }),
  }
}
