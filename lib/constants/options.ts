/**
 * Centralized constants for the application
 * Import from here instead of defining locally to ensure consistency
 */

// Month names - full
export const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const

// Month names - abbreviated
export const MONTHS_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const

// Creator type options (Lifestyle vs Travel)
export const CREATOR_TYPE_OPTIONS = ['Lifestyle', 'Travel'] as const

// Platform options for creators (base platforms)
export const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'Facebook'] as const

// Platform options including content packages (for collaborations)
export const PLATFORM_OPTIONS_WITH_CONTENT = [
  'Instagram', 'Facebook', 'TikTok', 'YouTube', 'Content Package'
] as const

// Platform options including custom (for suggest changes modal)
export const PLATFORM_OPTIONS_ALL = [
  'Instagram', 'TikTok', 'YouTube', 'Facebook', 'Content Package', 'Custom'
] as const

// Collaboration types
export const COLLABORATION_TYPES = ['Free Stay', 'Paid', 'Discount'] as const

// Platform to deliverables mapping
export const PLATFORM_DELIVERABLES: Record<string, readonly string[]> = {
  'Instagram': ['Instagram Post', 'Instagram Stories', 'Instagram Reel'],
  'Facebook': ['Facebook Post', 'Facebook Stories', 'Facebook Reel'],
  'TikTok': ['TikTok Video'],
  'YouTube': ['YouTube Video', 'YouTube Shorts'],
  'Content Package': ['Photos', 'Videos'],
  'Custom': ['Custom Deliverable'],
} as const

// Calendar constants
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const DAYS_IN_MONTH = Array.from({ length: 31 }, (_, i) => i + 1)

// Hotel/Accommodation types for filters
export const HOTEL_TYPES = [
  'Hotel',
  'Boutiques Hotel',
  'City Hotel',
  'Luxury Hotel',
  'Apartment',
  'Villa',
  'Lodge',
] as const

// Offering types for filters (display names)
export const OFFERING_OPTIONS = [
  'Free stay',
  'Paid stay',
  'Discount',
] as const

// Budget filter range
export const BUDGET_RANGE = {
  min: 500,
  max: 10000,
  step: 100,
} as const

// Followers filter range
export const FOLLOWERS_RANGE = {
  min: 0,
  max: 1000000,
  step: 1000,
} as const

// Engagement rate filter range
export const ENGAGEMENT_RATE_RANGE = {
  min: 0,
  max: 10,
  step: 0.1,
} as const

// Age group options for audience demographics
export const AGE_GROUP_OPTIONS = ['18-24', '25-34', '35-44', '45-54', '55+'] as const

// All countries list for filters
export const ALL_COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'UK', 'USA', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
] as const

// Type exports for type-safe usage
export type Month = typeof MONTHS_FULL[number]
export type MonthAbbr = typeof MONTHS_ABBR[number]
export type PlatformOption = typeof PLATFORM_OPTIONS[number]
export type PlatformOptionWithContent = typeof PLATFORM_OPTIONS_WITH_CONTENT[number]
export type PlatformOptionAll = typeof PLATFORM_OPTIONS_ALL[number]
export type CollaborationType = typeof COLLABORATION_TYPES[number]
export type HotelType = typeof HOTEL_TYPES[number]
export type OfferingOption = typeof OFFERING_OPTIONS[number]
export type Country = typeof ALL_COUNTRIES[number]
export type AgeGroup = typeof AGE_GROUP_OPTIONS[number]
export type CreatorTypeOption = typeof CREATOR_TYPE_OPTIONS[number]
