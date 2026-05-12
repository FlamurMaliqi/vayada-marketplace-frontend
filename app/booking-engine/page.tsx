import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowRightIcon,
  ChartBarIcon,
  CheckIcon,
  CursorArrowRaysIcon,
  ShoppingCartIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { Navigation } from '@/components/layout'
import { FinalCTA, LandingFooter } from '@/components/landing'

export const metadata: Metadata = {
  title: 'Booking Engine - vayada',
  description:
    "vayada's Booking Engine helps independent hotels convert more direct demand, own more guest data, and increase revenue per stay.",
}

const HERO_BULLETS = [
  'More direct bookings',
  'More owned guest data',
  'More revenue per stay',
]

const FEATURES = [
  {
    title: 'Fully customizable',
    body: "Customize your booking engine's look to match your brand. Starting from the domain and hero image to font, colors, text, and booking flow.",
    image: {
      src: '/be-customizable.png',
      alt: 'Customizable Vayada booking engine brand settings',
      width: 1920,
      height: 1200,
    },
  },
  {
    title: 'Refer a Guest',
    body: 'Turn guests and creators into promoters with trackable referral links that drive more direct bookings and reward successful recommendations.',
    image: {
      src: '/be-referaguest.png',
      alt: 'Refer a Guest flow in the Vayada booking engine',
      width: 1920,
      height: 1197,
    },
    reverse: true,
  },
  {
    title: 'Upsell services, experiences & transportation',
    body: 'Offer your own add-ons directly in the booking journey, from breakfast and airport transfers to wellness and local experiences.',
    image: {
      src: '/be-upselling.png',
      alt: 'Upsell services and transportation during direct booking',
      width: 1920,
      height: 1084,
    },
  },
]

const OUTCOMES = [
  {
    title: 'Stronger direct channel',
    body: 'Increase demand on your website and reduce reliance on third-party OTAs.',
    Icon: CursorArrowRaysIcon,
  },
  {
    title: 'Lower OTA dependency',
    body: 'Reduce commissions and increase profitability with every direct booking.',
    Icon: ChartBarIcon,
  },
  {
    title: 'Better guest relationships',
    body: 'Own your guest data to personalize stays and drive repeat bookings.',
    Icon: UserGroupIcon,
  },
  {
    title: 'Higher basket size',
    body: 'Increase revenue per stay with add-ons, upgrades and experiences.',
    Icon: ShoppingCartIcon,
  },
]

const AI_BULLETS = [
  'Live competitor pricing',
  'Auto-raise rates on occupancy',
  'Abandonment recovery',
]

function CheckBullet({ children }: { children: string }) {
  return (
    <li className="flex items-center gap-3 text-base">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-500">
        <CheckIcon className="h-3 w-3" strokeWidth={3} />
      </span>
      <span className="text-gray-700">{children}</span>
    </li>
  )
}

export default function BookingEnginePage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Navigation />

      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-primary-500"
              >
                <span aria-hidden="true">←</span>
                Booking Engine
              </Link>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
                The booking engine built for independent hospitality
              </h1>
              <p className="mt-6 max-w-xl text-lg text-gray-500">
                vayada&apos;s Booking Engine helps independent hotels convert
                more direct demand, own more guest data, and increase their
                revenue.
              </p>
              <ul className="mt-8 space-y-3">
                {HERO_BULLETS.map((bullet) => (
                  <CheckBullet key={bullet}>{bullet}</CheckBullet>
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

            <div className="relative">
              <div className="absolute -inset-x-10 -top-8 -bottom-8 rounded-[3rem] bg-primary-500/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-white shadow-elevated">
                <Image
                  src="/hero-booking.png"
                  alt="vayada booking engine preview"
                  width={1920}
                  height={966}
                  priority
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary-500">
              Feature Highlights
            </span>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
              Everything you need to increase your direct bookings and stay value
            </h2>
          </div>

          <div className="mt-16 space-y-8">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="grid items-center gap-10 overflow-hidden rounded-3xl border border-border bg-[#f7f8fc]/70 p-8 md:grid-cols-2 md:p-12"
              >
                <div className={feature.reverse ? 'md:order-2' : ''}>
                  <div className="overflow-hidden rounded-2xl border border-border-strong bg-white shadow-soft">
                    <Image
                      src={feature.image.src}
                      alt={feature.image.alt}
                      width={feature.image.width}
                      height={feature.image.height}
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </div>
                <div className={feature.reverse ? 'md:order-1' : ''}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-500 font-display text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <h3 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-5 text-base leading-relaxed text-gray-500">
                    {feature.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-20 md:pb-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border-strong bg-primary-50 p-10 md:p-14">
            <h3 className="text-center font-display text-2xl font-semibold text-ink md:text-3xl">
              What this means for your hotel
            </h3>
            <div className="mt-10 grid gap-8 md:grid-cols-4">
              {OUTCOMES.map(({ title, body, Icon }) => (
                <div key={title} className="text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white text-primary-500 shadow-soft">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 font-display text-base font-semibold text-ink">
                    {title}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20 md:pb-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="group relative grid gap-8 overflow-hidden rounded-3xl border border-border bg-[#f7f8fc]/70 p-8 transition-all hover:border-border-strong md:grid-cols-2 md:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-xs uppercase tracking-[0.2em] text-primary-500">
                  AI Distribution
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-500/30 bg-primary-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-primary-500">
                  <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-primary-500" />
                  Coming soon
                </span>
              </div>
              <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
                Ask anything. Automate everything.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Natural-language access to demand, performance, competitors and
                guests with automations that execute the playbook.
              </p>
              <ul className="mt-6 space-y-2">
                {AI_BULLETS.map((bullet) => (
                  <CheckBullet key={bullet}>{bullet}</CheckBullet>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-border-strong bg-white p-6">
                <div className="flex items-center gap-2 text-xs text-primary-500">
                  <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-primary-500" />
                  Ask Intelligence · live
                </div>
                <div className="mt-4 space-y-2.5">
                  {[
                    'Why did my direct share drop?',
                    'Compare my pricing to competitors',
                    'Any events near me in 60 days?',
                  ].map((prompt) => (
                    <div
                      key={prompt}
                      className="rounded-lg border border-border bg-[#f7f8fc] px-3 py-2 text-sm text-ink"
                    >
                      {prompt}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg border border-primary-500/30 bg-primary-50 p-3 text-xs">
                  <div className="flex items-center gap-2 text-primary-500">
                    <SparklesIcon className="h-4 w-4" />
                    Recommendation
                  </div>
                  <div className="mt-1 text-gray-700">
                    Raise weekend rates +12% because local event demand is
                    increasing.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <LandingFooter />
    </main>
  )
}
