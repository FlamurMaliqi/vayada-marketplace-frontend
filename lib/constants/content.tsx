/**
 * Content constants for landing page
 */

import { NavigationLink, Feature, Step, Advantage, SectionContent } from '@/lib/types'
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline'

// Navigation links
export const NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'For Properties', href: '/hotel-benefits' },
  { label: 'For Creators', href: '/creator-benefits' },
  { label: 'How It Works', href: '#how-it-works' },
]

// Hero features
export const HERO_FEATURES: Feature[] = [
  {
    icon: ShieldCheckIcon,
    iconClassName: 'w-8 h-8',
    title: 'Verified Community',
    description: 'All users go through verification to ensure quality and trust',
  },
  {
    icon: BoltIcon,
    iconClassName: 'w-8 h-8',
    title: 'Direct Connections',
    description: 'No middlemen. Hotels and creators connect and collaborate directly',
  },
  {
    icon: ChartBarIcon,
    iconClassName: 'w-8 h-8',
    title: 'Measurable Results',
    description: 'Track bookings and engagement to build data-driven partnerships',
  },
]

// Hotels section content
export const HOTELS_SECTION: SectionContent = {
  title: 'For Hotels',
  subtitle: 'Reach new audiences through authentic creator-driven storytelling. Connect directly with verified travel influencers who align with your brand.',
  advantages: [
    {
      icon: UsersIcon,
      iconClassName: 'w-6 h-6',
      title: 'Access Verified Creators',
      description: 'Browse and filter through a curated community of verified travel creators. Find influencers who match your property\'s vibe, location, and target audience.',
    },
    {
      icon: BoltIcon,
      iconClassName: 'w-6 h-6',
      title: 'No Middlemen, Lower Costs',
      description: 'Cut out agencies and intermediaries. Work directly with creators, negotiate fair rates, and build lasting partnerships without hidden fees.',
    },
    {
      icon: ChartBarIcon,
      iconClassName: 'w-6 h-6',
      title: 'Track Real Impact',
      description: 'Measure which creators drive actual bookings and engagement. Make data-driven decisions and invest in partnerships that deliver results.',
    },
    {
      icon: CurrencyDollarIcon,
      iconClassName: 'w-6 h-6',
      title: 'Transparent Pricing',
      description: 'See creator rates upfront. No surprise costs or hidden commissions. Build partnerships based on transparency and mutual respect.',
    },
  ],
  steps: [
    {
      number: 1,
      title: 'Create Your Profile',
      description: 'Showcase your property, highlight unique features, and set your collaboration preferences.',
    },
    {
      number: 2,
      title: 'Browse & filter creators',
      description: 'Search verified creators by audience size, followers, and engagement metrics.',
    },
    {
      number: 3,
      title: 'Send Collaboration Requests',
      description: 'Invite creators to collaborate or respond to applications from interested influencers.',
    },
    {
      number: 4,
      title: 'Connect & Collaborate',
      description: 'Once both parties accept, exchange contact information and coordinate your partnership.',
    },
  ],
  ctaText: 'Join as a Hotel',
  ctaHref: '/signup?type=hotel',
}

// Creators section content
export const CREATORS_SECTION: SectionContent = {
  title: 'For Creators & Influencers',
  subtitle: 'Earn fair compensation while building authentic relationships with travel brands. Discover exciting hotel collaborations that align with your content and values.',
  advantages: [
    {
      icon: CurrencyDollarIcon,
      iconClassName: 'w-6 h-6',
      title: 'Fair Compensation',
      description: 'Negotiate rates directly with hotels. No agencies taking cuts. Get paid what you\'re worth for your authentic content and influence.',
    },
    {
      icon: UserGroupIcon,
      iconClassName: 'w-6 h-6',
      title: 'Direct Relationships',
      description: 'Build long-term partnerships with hotels. Work directly with decision-makers and create content that truly represents your brand and theirs.',
    },
    {
      icon: MagnifyingGlassIcon,
      iconClassName: 'w-6 h-6',
      title: 'Curated Opportunities',
      description: 'Discover hotels that align with your niche and values. Filter by location, property type, and collaboration style to find perfect matches.',
    },
    {
      icon: ChartBarSquareIcon,
      iconClassName: 'w-6 h-6',
      title: 'Performance Tracking',
      description: 'Showcase your impact. Track bookings and engagement you drive, building your reputation and opening doors to better opportunities.',
    },
  ],
  steps: [
    {
      number: 1,
      title: 'Build Your Profile',
      description: 'Showcase your niche, audience demographics, platforms, and portfolio. Let hotels discover your unique storytelling style.',
    },
    {
      number: 2,
      title: 'Get Verified',
      description: 'Complete our simple verification process to gain access to the platform and build trust with potential hotel partners.',
    },
    {
      number: 3,
      title: 'Discover Opportunities',
      description: 'Browse hotel campaigns and properties. Apply to collaborations that match your travel style and audience interests.',
    },
    {
      number: 4,
      title: 'Build Partnerships',
      description: 'When both sides accept, connect directly with hotels to coordinate stays and create authentic, engaging content.',
    },
  ],
  ctaText: 'Join as a Creator',
  ctaHref: '/signup?type=creator',
}

// How it works steps
export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: 1,
    title: 'Join & Verify',
    description: 'Hotels and creators create profiles and complete a simple verification step to ensure quality and trust within the community.',
  },
  {
    number: 2,
    title: 'Discover',
    description: 'Hotels browse and filter verified creators. Creators discover hotel campaigns and properties that match their niche and audience.',
  },
  {
    number: 3,
    title: 'Connect',
    description: 'Send and receive collaboration requests. When both parties accept, contact information is shared for direct coordination.',
  },
  {
    number: 4,
    title: 'Collaborate',
    description: 'Work together to create authentic content, drive bookings, and build lasting partnerships that deliver measurable results.',
  },
]

