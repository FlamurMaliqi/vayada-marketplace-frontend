import Link from 'next/link'
import { ArrowRightIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Navigation } from '@/components/layout'
import { LandingFooter } from '@/components/landing'
import { ROUTES } from '@/lib/constants/routes'

const plans = [
  {
    name: 'Commission',
    eyebrow: 'Start without setup cost',
    price: '5%',
    suffix: 'flat on direct bookings',
    description:
      'No upfront cost. Risk-free exploring. Go live in one day. Best for properties who do not have a booking engine.',
    features: ['Booking engine included', 'PMS included'],
    excluded: ['Channel manager not included'],
    note:
      'Channel manager is not included on Commission. Upgrade to Subscription to sync inventory across OTAs.',
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Subscription',
    eyebrow: 'Most popular',
    price: '$30',
    suffix: '/month base + $5 per extra room',
    description:
      'Predictable pricing for independent properties that want more upside from every direct booking.',
    features: [
      'Booking engine included',
      'PMS included',
      'Channel manager included',
      'Priority support',
    ],
    excluded: [],
    note: 'Use the full direct booking stack with fixed monthly pricing and no direct booking commission.',
    cta: 'Book a demo',
    highlighted: true,
  },
]

const comparisonRows = [
  ['Booking engine', 'Included', 'Included'],
  ['PMS', 'Included', 'Included'],
  ['Channel manager', 'Upgrade required', 'Included'],
  ['Support', 'Standard', 'Priority'],
  ['Best for', 'Launching direct bookings', 'Scaling direct bookings'],
]

const faqs = [
  {
    question: 'Which plan should a property start with?',
    answer:
      'Commission is the lowest-risk starting point when you need a booking engine and want to validate direct bookings first. Subscription is better when you want channel manager access and predictable monthly cost.',
  },
  {
    question: 'Can we use only the booking engine?',
    answer:
      'Yes. The standalone booking engine is available for properties that already have a PMS and want embeddable checkout, affiliate and referral tracking, guest data export, and API access.',
  },
  {
    question: 'Is the channel manager included in every plan?',
    answer:
      'No. Channel manager access is included with Subscription. Commission keeps the entry point simple with the booking engine and PMS included.',
  },
  {
    question: 'How quickly can a property go live?',
    answer:
      'The Commission plan is designed for a one-day launch path. Timing can vary depending on property setup, room data, and existing systems.',
  },
]

function FeatureItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
        <CheckIcon className="h-3 w-3 text-primary-500" strokeWidth={3} />
      </span>
      <span className="text-sm text-gray-700">{children}</span>
    </li>
  )
}

function ExcludedItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
        <XMarkIcon className="h-3 w-3 text-gray-400" strokeWidth={3} />
      </span>
      <span className="text-sm text-gray-500 line-through decoration-gray-400">{children}</span>
    </li>
  )
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Navigation />

      <section id="pricing" className="relative overflow-hidden bg-white pt-28 md:pt-36">
        <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-primary-50 via-white to-white" />
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 md:pb-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-500">Pricing</p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-tight text-ink md:text-7xl">
              Pricing built for direct bookings
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500 md:text-xl">
              Start with zero risk. Move to a fixed monthly plan when direct bookings become a core channel.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.highlighted
                    ? 'relative flex flex-col rounded-3xl border border-primary-500/50 bg-gradient-to-b from-primary-50 to-white p-8 shadow-glow'
                    : 'relative flex flex-col rounded-3xl border border-border bg-[#f7f8fc]/70 p-8 transition-all hover:border-border-strong'
                }
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-8 inline-block rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white">
                    {plan.eyebrow}
                  </span>
                )}
                <p className="text-sm uppercase tracking-widest text-gray-500">{plan.name}</p>
                {!plan.highlighted && (
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-primary-500">
                    {plan.eyebrow}
                  </p>
                )}
                <div className="mt-5 flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold text-ink">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.suffix}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">{plan.description}</p>

                <ul className="mt-7 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <FeatureItem key={feature}>{feature}</FeatureItem>
                  ))}
                  {plan.excluded.map((feature) => (
                    <ExcludedItem key={feature}>{feature}</ExcludedItem>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-border bg-white px-4 py-3">
                  <p className="text-xs leading-relaxed text-gray-500">{plan.note}</p>
                </div>

                <Link
                  href={ROUTES.SIGNUP}
                  className={
                    plan.highlighted
                      ? 'mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-6 text-sm font-medium text-white transition-all hover:bg-primary-600'
                      : 'mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-border-strong bg-white px-6 text-sm font-medium text-ink transition-colors hover:bg-surface-elevated'
                  }
                >
                  {plan.cta}
                  {plan.highlighted && <ArrowRightIcon className="h-4 w-4" />}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Separate product</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-col gap-6 rounded-3xl border border-dashed border-border-strong bg-[#f7f8fc]/70 p-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-widest text-gray-500">Standalone Booking Engine</p>
                <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
                  Already have a PMS? Plug in just the booking engine.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-500 md:text-base">
                  Use vayada&apos;s booking engine on top of your existing PMS with embeddable checkout,
                  affiliate and referral tracking, guest data export, and full API access.
                </p>
              </div>
              <Link
                href={ROUTES.CONTACT}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary-500 px-7 text-sm font-medium text-white shadow-glow transition-all hover:bg-primary-600"
              >
                Talk to sales
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fc] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-500">Compare</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
              Choose by operating model
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl border border-border bg-white">
            <div className="grid grid-cols-3 border-b border-border bg-white px-5 py-4 text-xs font-medium uppercase tracking-[0.18em] text-gray-500 md:px-8">
              <span>Feature</span>
              <span>Commission</span>
              <span>Subscription</span>
            </div>
            {comparisonRows.map(([feature, commission, subscription]) => (
              <div
                key={feature}
                className="grid grid-cols-3 gap-3 border-b border-border px-5 py-5 text-sm last:border-b-0 md:px-8"
              >
                <span className="font-medium text-ink">{feature}</span>
                <span className="text-gray-500">{commission}</span>
                <span className="text-gray-700">{subscription}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-500">FAQ</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
              Pricing questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-3xl border border-border bg-white p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-medium text-ink">
                  {faq.question}
                  <span className="text-primary-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-gray-500">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="bg-white pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-gradient-to-b from-primary-50 to-white px-6 py-12 text-center md:px-12 md:py-16">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-500">Direct distribution</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
              See which pricing model fits your property.
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={ROUTES.SIGNUP}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-500 px-7 text-sm font-medium text-white shadow-glow transition-all hover:bg-primary-600"
              >
                Get started
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={ROUTES.CONTACT}
                className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-white px-7 text-sm font-medium text-ink transition-colors hover:bg-surface-elevated"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  )
}
