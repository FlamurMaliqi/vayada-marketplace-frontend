import { ArrowRightIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function PricingSection() {
  return (
    <section id="pricing" className="relative bg-white py-14 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
            Pricing
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Turn website visitors into direct bookings
          </h2>
          <p className="mt-5 text-lg text-gray-500">
            Start with zero risk. Move to a fixed monthly plan to scale.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {/* Commission plan */}
          <div className="relative flex flex-col rounded-3xl border border-border bg-[#f7f8fc]/60 p-8 transition-all hover:border-border-strong">
            <p className="text-sm uppercase tracking-widest text-gray-500">Commission</p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold text-ink">5%</span>
              <span className="text-sm text-gray-500">flat on direct bookings</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              No upfront cost. Risk-free exploring. Go live in one day. Best
              for properties who do not have a booking engine.
            </p>
            <ul className="mt-6 flex-1 space-y-2.5">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
                  <CheckIcon className="w-3 h-3 text-primary-500" strokeWidth={3} />
                </span>
                <span className="text-sm text-gray-700">Booking engine included</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
                  <CheckIcon className="w-3 h-3 text-primary-500" strokeWidth={3} />
                </span>
                <span className="text-sm text-gray-700">PMS included</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <XMarkIcon className="w-3 h-3 text-gray-400" strokeWidth={3} />
                </span>
                <span className="text-sm text-gray-500 line-through decoration-gray-400">Channel manager - not included</span>
              </li>
            </ul>
            <div className="mt-5 rounded-xl border border-border bg-white px-4 py-3">
              <p className="text-xs leading-relaxed text-gray-500">
                <span className="font-semibold">Heads up:</span> Channel manager is not
                included on Commission. Upgrade to Subscription to sync inventory across OTAs.
              </p>
            </div>
            <a
              href="#cta"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full border border-border-strong bg-white px-6 text-sm font-medium text-ink transition-colors hover:bg-surface-elevated"
            >
              Get started
            </a>
          </div>

          {/* Subscription plan - highlighted */}
          <div className="relative flex flex-col rounded-3xl border border-primary-500/50 bg-gradient-to-b from-primary-50 to-white p-8 shadow-glow">
            <span className="absolute -top-3 left-8 inline-block rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white">
              Most popular
            </span>
            <p className="text-sm uppercase tracking-widest text-gray-500">Subscription</p>
            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              <span className="font-display text-5xl font-semibold text-ink">$30</span>
              <span className="text-sm text-gray-500">/month base + $5 per extra room</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Predictable pricing for independent properties for more upside
              from every direct booking.
            </p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {[
                'Booking engine included',
                'PMS included',
                'Channel manager included',
                'Priority support',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
                    <CheckIcon className="w-3 h-3 text-primary-500" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#cta"
              className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-6 text-sm font-medium text-white transition-all hover:bg-primary-600"
            >
              Get started
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Standalone Booking Engine */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Separate product</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        <div className="flex flex-col gap-6 rounded-3xl border border-dashed border-border-strong bg-[#f7f8fc]/60 p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-widest text-gray-500">Standalone Booking Engine</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
              Already have a PMS? Plug in just the booking engine.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 md:text-base">
              For properties that want to use vayada&apos;s booking engine on
              top of their existing PMS with embeddable checkout, affiliate &amp;
              referral tracking, guest data export, and full API access.
            </p>
          </div>
          <a
            href="#cta"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary-500 px-7 text-sm font-medium text-white shadow-glow transition-all hover:bg-primary-600"
          >
            Talk to sales
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
        </div>
      </div>
    </section>
  )
}
