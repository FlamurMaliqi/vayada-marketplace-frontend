import type { Metadata } from 'next'
import Image from 'next/image'
import {
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { Navigation } from '@/components/layout'
import { FinalCTA, LandingFooter } from '@/components/landing'

export const metadata: Metadata = {
  title: 'PMS + Channel Manager | vayada',
  description:
    "vayada's PMS helps independent properties manage operations, reservations and distribution in one place with a built-in channel manager.",
}

const HERO_BULLETS = [
  'Smarter daily operations',
  'Synchronized inventory across OTAs',
  'Less manual work',
]

const FEATURES = [
  {
    title: 'Centralized property management',
    description:
      'Keep your front desk aligned and track daily operations from one dashboard: arrivals, departures, occupancy forecast and revenue.',
    image: '/pms-dashboard.png',
    alt: 'Vayada PMS dashboard showing reservations and property operations',
  },
  {
    title: 'Live calendar and inventory control',
    description:
      'Plan your operations and keep bookings, room blocks and availability organized in one simple calendar view.',
    image: '/pms-calendar.png',
    alt: 'Vayada PMS calendar showing booking inventory across rooms',
    reverse: true,
  },
  {
    title: 'Built-in channel manager',
    description:
      'Connect to Booking.com, Airbnb, Expedia and 50+ OTAs while syncing rates, availability and bookings in real time.',
    image: '/pms-channel.png',
    alt: 'Vayada PMS channel manager for OTA synchronization',
  },
]

const OUTCOMES = [
  {
    title: 'Less manual work',
    description: 'Automate tasks and reduce time spent on repetitive operations.',
    Icon: ClockIcon,
  },
  {
    title: 'Fewer overbookings',
    description: 'Keep inventory and bookings synchronized across all channels.',
    Icon: ShieldCheckIcon,
  },
  {
    title: 'Better team coordination',
    description: 'Everyone stays aligned with real-time updates and centralized data.',
    Icon: UsersIcon,
  },
  {
    title: 'More distribution control',
    description: 'Manage rates, availability and promotions from one powerful system.',
    Icon: AdjustmentsHorizontalIcon,
  },
  {
    title: 'Ready to scale',
    description: 'Built for independent hospitality today and ready for your growth tomorrow.',
    Icon: ArrowTrendingUpIcon,
  },
]

function ProductPanel() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-10 -bottom-8 -top-8 rounded-[3rem] bg-primary-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-white shadow-elevated">
        <div className="flex items-center gap-1.5 border-b border-border bg-[#f7f8fc] px-4 py-3 text-xs text-gray-500">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 truncate">vayada PMS</span>
        </div>
        <Image
          src="/hero-pms.png"
          alt="Vayada PMS dashboard preview"
          width={1200}
          height={800}
          priority
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  )
}

export default function PmsPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Navigation />

      <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-primary-500 transition-colors hover:text-primary-600"
              >
                <span aria-hidden="true">&larr;</span>
                PMS + Channel Manager
              </a>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
                The PMS built for modern independent hospitality
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
                Manage reservations, availability, rates and OTA channels from one
                simple system built for independent properties.
              </p>

              <ul className="mt-8 space-y-3">
                {HERO_BULLETS.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-3 text-base">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-500">
                      <CheckIcon className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <a
                  href="#cta"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-500 px-7 text-base font-medium text-white shadow-glow transition-all hover:bg-primary-600"
                >
                  Book a demo
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <ProductPanel />
          </div>
        </div>
      </section>

      <section className="relative bg-white py-20 md:py-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
              Feature Highlights
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
              Built to keep daily operations simple and connected
            </h2>
          </div>

          <div className="mt-16 space-y-8">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.title}
                className="grid items-center gap-10 overflow-hidden rounded-3xl border border-border bg-primary-50/40 p-8 md:grid-cols-2 md:p-12"
              >
                <div className={feature.reverse ? 'md:order-2' : ''}>
                  <div className="overflow-hidden rounded-2xl border border-border-strong bg-white shadow-soft">
                    <Image
                      src={feature.image}
                      alt={feature.alt}
                      width={1200}
                      height={800}
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </div>
                <div className={feature.reverse ? 'md:order-1' : ''}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-500 font-display text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <h3 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-5 text-base leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white pb-20 md:pb-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border-strong bg-primary-50 p-8 md:p-14">
            <h2 className="text-center font-display text-2xl font-semibold text-ink md:text-3xl">
              What this means for your property
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {OUTCOMES.map(({ title, description, Icon }) => (
                <div key={title} className="text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white text-primary-500 shadow-soft">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <LandingFooter />
    </main>
  )
}
