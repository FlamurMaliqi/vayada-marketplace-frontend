import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import {
  ArrowRightIcon,
  ChartBarIcon,
  CheckIcon,
  CheckBadgeIcon,
  LinkIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { LandingFooter } from '@/components/landing'
import { Navigation } from '@/components/layout'
import { PlatformIcon } from '@/components/ui/icons/SocialIcons'
import { ROUTES } from '@/lib/constants/routes'
import { creatorService } from '@/services/api/creators'
import { hotelService } from '@/services/api/hotels'

export const metadata: Metadata = {
  title: 'Hotel-Creator-Network - vayada',
  description:
    'Vayada matches independent hotels with vetted creators and turns word of mouth into measurable, attributable direct bookings.',
}

export const dynamic = 'force-dynamic'

const problemCards = [
  {
    title: 'Untracked recommendations',
    body: 'Hotels cannot measure which creators and guest conversations actually drive demand.',
  },
  {
    title: 'Manual collaboration chaos',
    body: 'Applications, dates, terms and deliverables get scattered across DMs and emails.',
  },
  {
    title: 'Bookings leak to OTAs',
    body: 'Inspired travelers still search on marketplaces, where hotels lose margin and guest data.',
  },
]

const hotelFeatures = [
  'Verified creator data',
  'Centralized dashboard',
  'Two-way reviews',
  'Affiliate tracking',
]

const creatorFeatures = [
  'Verified creator profile',
  'Open hotel offers',
  'Structured applications',
  'Future affiliate revenue',
]

const workflowSteps = [
  {
    title: 'Discover',
    body: 'Hotels find creators. Creators find hotel offers.',
  },
  {
    title: 'Match',
    body: 'Both sides agree on dates, deliverables and collaboration terms.',
  },
  {
    title: 'Create',
    body: 'Creators produce content and trusted recommendations for the property.',
  },
  {
    title: 'Track',
    body: 'Referral links turn creator trust into measurable direct bookings.',
  },
]

const affiliatePoints = [
  {
    title: 'Unique creator links',
    body: 'Track every creator, property and campaign individually.',
  },
  {
    title: 'Commission on confirmed stays',
    body: 'Pay for results instead of vague exposure.',
  },
  {
    title: 'Guest data stays direct',
    body: "Bookings land in the hotel's own flow, not on an OTA.",
  },
]

type NetworkStats = {
  networkMembers: string
  combinedReach: string
  propertiesOnboarded: string
}

function formatCount(value: number) {
  if (value >= 1_000_000) {
    return `${Math.floor(value / 1_000_000)}M+`
  }

  if (value >= 1000) {
    return `${Math.floor(value / 1000)}K+`
  }

  if (value >= 100) {
    return `${Math.floor(value / 10) * 10}+`
  }

  return value.toLocaleString('en-US')
}

async function getNetworkStats(): Promise<NetworkStats | null> {
  try {
    const [creatorsResponse, hotelsResponse] = await Promise.all([
      creatorService.getAll(),
      hotelService.getAll(),
    ])

    const creators = creatorsResponse.data
    const hotels = hotelsResponse.data
    const combinedReach = creators.reduce((total, creator) => {
      const audienceSize =
        creator.audienceSize ||
        creator.platforms.reduce((sum, platform) => sum + (platform.followers || 0), 0)

      return total + audienceSize
    }, 0)

    return {
      networkMembers: formatCount(creators.length + hotels.length),
      combinedReach: formatCount(combinedReach),
      propertiesOnboarded: formatCount(hotels.length),
    }
  } catch (error) {
    console.error('Failed to load Hotel-Creator-Network stats:', error)
    return null
  }
}

export default async function HotelCreatorNetworkPage() {
  const stats = await getNetworkStats()

  return (
    <main className="min-h-screen bg-white text-ink">
      <Navigation />

      <section className="relative overflow-hidden border-b border-border pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
              Hotel-Creator-Network
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
              Turn creator trust into{' '}
              <span className="text-primary-500">direct bookings</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-500">
              Vayada connects independent hotels with verified creators,
              manages collaborations in one place and turns referrals into
              measurable direct bookings.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={`${ROUTES.SIGNUP}?type=hotel`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-500 px-7 text-base font-medium text-white shadow-glow transition-all hover:bg-primary-600"
              >
                For Hotels
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={`${ROUTES.SIGNUP}?type=creator`}
                className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-white px-7 text-base text-ink transition-colors hover:bg-gray-50"
              >
                For Creators
              </Link>
            </div>
            {stats && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-gray-500">
                <span>
                  <strong className="font-semibold text-ink">
                    {stats.networkMembers}
                  </strong>{' '}
                  network members
                </span>
                <span className="hidden text-border-strong sm:inline">/</span>
                <span>
                  <strong className="font-semibold text-ink">
                    {stats.combinedReach}
                  </strong>{' '}
                  combined reach
                </span>
                <span className="hidden text-border-strong sm:inline">/</span>
                <span>
                  <strong className="font-semibold text-ink">
                    {stats.propertiesOnboarded}
                  </strong>{' '}
                  properties onboarded
                </span>
              </div>
            )}
          </div>

          <div className="relative mx-auto mt-14 max-w-5xl">
            <div className="absolute -inset-x-8 -top-4 -bottom-4 rounded-[3rem] bg-primary-50 blur-3xl" />
            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
              <ProductFrame>
                <Image
                  src="/hcn-hotel-card-detail.png"
                  alt="Vayada hotel profile card with collaboration details"
                  width={900}
                  height={700}
                  className="h-full w-full object-cover"
                  priority
                />
              </ProductFrame>
              <div className="flex justify-center">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-border-strong bg-white text-primary-500 shadow-soft md:h-16 md:w-16">
                  <ArrowRightIcon className="h-7 w-7" />
                </div>
              </div>
              <ProductFrame>
                <CreatorMarketplacePreview />
              </ProductFrame>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            title={
              <>
                Travel decisions start with trust, but bookings still leak to{' '}
                <span className="text-primary-500">OTAs</span>
              </>
            }
            body="Creators influence where people stay through stories, DMs and word of mouth. Hotels get visibility, but often lose tracking, guest data and bookings to third-party channels."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {problemCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-border bg-white p-7 shadow-soft"
              >
                <h3 className="font-display text-xl font-semibold text-ink">
                  {card.title}
                </h3>
                <p className="mt-3 leading-relaxed text-gray-500">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AudienceSection
        id="for-hotels"
        eyebrow="For Hotels"
        title="Stop DM chaos. Start driving direct bookings."
        body="Join the marketplace to discover verified creators, manage collaboration requests and turn trusted reach into direct demand for your property."
        ctaLabel="Register hotel for free"
        ctaHref={`${ROUTES.SIGNUP}?type=hotel`}
        image="/hcn-analytics.png"
        imageAlt="Creator analytics modal with Instagram and TikTok audience data"
        features={hotelFeatures}
        icon="hotel"
      />

      <AudienceSection
        id="for-creators"
        eyebrow="For Creators"
        title="Stop chasing DMs. Start securing hotel collaborations."
        body="Create a verified profile, apply to curated hotel offers and build a professional track record with reviews from completed collaborations."
        ctaLabel="Apply as creator"
        ctaHref={`${ROUTES.SIGNUP}?type=creator`}
        image="/hcn-creator-offer.png"
        imageAlt="Hotel offer detail page on the Vayada creator marketplace"
        features={creatorFeatures}
        reverse
        icon="creator"
      />

      <section className="border-y border-border bg-[#f7f9ff] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="How it works"
            title={
              <>
                From collaboration to{' '}
                <span className="text-primary-500">direct booking demand</span>
              </>
            }
          />
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-border bg-white p-6 shadow-soft"
              >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-50 font-display text-sm font-semibold text-primary-500">
                  {index + 1}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
              Affiliate tracking
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
              Turn recommendations into{' '}
              <span className="text-primary-500">measurable revenue</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-500">
              Every creator can receive a unique referral link connected to the
              hotel's direct booking engine. Hotels track clicks, bookings and
              revenue while creators can earn commission on confirmed stays.
            </p>
            <ul className="mt-7 space-y-4">
              {affiliatePoints.map((point) => (
                <li key={point.title} className="flex items-start gap-3">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-500">
                    <CheckIcon className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>
                    <span className="block font-medium text-ink">
                      {point.title}
                    </span>
                    <span className="block text-sm leading-relaxed text-gray-500">
                      {point.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-primary-50 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-white shadow-elevated">
              <Image
                src="/be-referaguest.png"
                alt="Direct booking page connected to Vayada referral tracking"
                width={1200}
                height={800}
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="px-4 py-14 sm:px-6 md:py-28 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-br from-primary-50 via-white to-[#f7f9ff] p-8 text-center shadow-soft md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-hero)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
              Ready to turn trust into{' '}
              <span className="text-primary-500">direct bookings</span>?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-500">
              Whether you are a hotel looking for creator-led demand or a
              creator looking for better collaborations, Vayada gives you the
              infrastructure to work together and grow.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={ROUTES.SIGNUP}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-500 px-7 text-base font-medium text-white shadow-glow transition-all hover:bg-primary-600"
              >
                Sign up
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-white px-7 text-base text-ink transition-colors hover:bg-gray-50"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  )
}

function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string
  title: ReactNode
  body?: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
        {title}
      </h2>
      {body && (
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-500">
          {body}
        </p>
      )}
    </div>
  )
}

function ProductFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border-strong bg-white shadow-elevated">
      {children}
    </div>
  )
}

function CreatorMarketplacePreview() {
  return (
    <div className="bg-white p-4 sm:p-6">
      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="relative h-72 overflow-hidden bg-gray-950">
          <Image
            src="/creator-hero.jpg"
            alt=""
            fill
            className="scale-110 object-cover opacity-75 blur-sm"
            sizes="(min-width: 768px) 440px, 90vw"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,32,0.18)_0%,rgba(8,17,32,0.44)_45%,rgba(8,17,32,0.90)_100%)]" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-white/90 px-3 py-1.5 text-xs font-bold text-amber-700 shadow-sm backdrop-blur-md">
              <PaperAirplaneIcon className="h-3.5 w-3.5" />
              Travel
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/90 text-gray-800 shadow-sm backdrop-blur-md">
              <PlatformIcon platform="Instagram" className="h-[18px] w-[18px]" />
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex items-end gap-4">
              <div className="relative flex-shrink-0">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl ring-1 ring-white/40">
                  <Image
                    src="/creator-hero.jpg"
                    alt="Dario Explore"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 shadow-md ring-4 ring-white">
                  <CheckBadgeIcon className="h-5 w-5 text-white" />
                </div>
              </div>

              <div className="min-w-0 pb-1 text-white">
                <h3 className="truncate text-2xl font-extrabold tracking-tight">
                  Dario Explore
                </h3>
                <div className="mt-1 flex items-center text-sm font-semibold text-white/80">
                  <MapPinIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-white/65" />
                  <span className="truncate">Osaka, Japan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 rounded-lg border border-gray-200 bg-gray-50">
            <div className="min-w-0 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                <UserGroupIcon className="h-4 w-4 text-primary-500" />
                <span>Reach</span>
              </div>
              <p className="truncate text-2xl font-extrabold tracking-tight text-gray-950">
                190,000
              </p>
            </div>
            <div className="min-w-0 border-l border-gray-200 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                <ChartBarIcon className="h-4 w-4 text-primary-500" />
                <span>Engagement</span>
              </div>
              <p className="truncate text-2xl font-extrabold tracking-tight text-gray-950">
                4.9%
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              Audience
            </div>
            <div className="flex flex-wrap gap-2">
              {['Japan', 'USA', 'UK'].map((country) => (
                <span
                  key={country}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 ring-1 ring-gray-200"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              Platforms
            </div>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'TikTok'].map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm ring-1 ring-gray-200"
                >
                  <PlatformIcon platform={platform} className="h-3.5 w-3.5 text-gray-500" />
                  {platform}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-glow">
            View Profile
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

function AudienceSection({
  id,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
  features,
  reverse = false,
  icon,
}: {
  id: string
  eyebrow: string
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
  image: string
  imageAlt: string
  features: string[]
  reverse?: boolean
  icon: 'hotel' | 'creator'
}) {
  return (
    <section id={id} className="border-b border-border py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className={reverse ? 'md:order-2' : ''}>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
              {eyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
              {title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-500">{body}</p>
            <Link
              href={ctaHref}
              className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary-500 px-6 text-sm font-medium text-white shadow-glow transition-all hover:bg-primary-600"
            >
              {ctaLabel}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className={`relative ${reverse ? 'md:order-1' : ''}`}>
            <div className="absolute inset-0 rounded-[2rem] bg-primary-50 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-white shadow-elevated">
              <Image
                src={image}
                alt={imageAlt}
                width={1200}
                height={800}
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <li key={feature} className="border-t border-border pt-5">
              <FeatureIcon icon={icon} label={feature} />
              <p className="mt-3 font-display text-lg font-semibold text-ink">
                {feature}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {getFeatureBody(feature)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FeatureIcon({
  icon,
  label,
}: {
  icon: 'hotel' | 'creator'
  label: string
}) {
  const Icon =
    label.includes('tracking') || label.includes('affiliate')
      ? LinkIcon
      : label.includes('data') || label.includes('profile')
        ? ShieldCheckIcon
        : label.includes('dashboard') || label.includes('applications')
          ? ChartBarIcon
          : SparklesIcon

  return (
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-500">
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="sr-only">{`${icon} ${label}`}</span>
    </span>
  )
}

function getFeatureBody(feature: string) {
  const descriptions: Record<string, string> = {
    'Verified creator data':
      'Review reach, engagement, audience countries and platform performance before approving a collaboration.',
    'Centralized dashboard':
      'Manage applications, messages, terms and deliverables in one organized workspace.',
    'Two-way reviews':
      'Build trust with creators and reduce risk before future collaborations.',
    'Affiliate tracking':
      'Give creators tracked referral links so every recommendation can become a measurable booking.',
    'Verified creator profile':
      'Show hotels your reach, engagement, audience data and platforms in one professional profile.',
    'Open hotel offers':
      'Browse properties offering free stays, packages or paid collaborations.',
    'Structured applications':
      'Apply with preferred dates, platforms and deliverables in one simple flow.',
    'Future affiliate revenue':
      'Build your track record now and get ready to earn commission from tracked bookings.',
  }

  return descriptions[feature]
}
