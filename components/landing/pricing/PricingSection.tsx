import { ArrowRightIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-[#f4f5fb] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-4">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Turn website visitors into{' '}
            <span className="text-primary-500">direct bookings</span>
          </h2>
          <p className="mt-6 text-base text-gray-600 max-w-2xl">
            Start with zero risk. Move to a fixed monthly plan to scale.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Commission plan */}
          <div className="rounded-2xl bg-white border border-gray-200 p-8">
            <p className="text-sm text-gray-500 mb-4">Commission</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-gray-900">5%</span>
              <span className="text-sm text-gray-600">flat on direct bookings</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              No upfront cost. Risk-free exploring. Go live in one day. Best
              for properties who do not have a booking engine.
            </p>
            <ul className="space-y-3 mb-6">
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
                <span className="text-sm text-gray-500">Channel manager — not included</span>
              </li>
            </ul>
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 mb-6">
              <p className="text-xs text-amber-900 leading-relaxed">
                <span className="font-semibold">Heads up:</span> Channel manager is not
                included on Commission. Upgrade to Subscription to sync inventory across OTAs.
              </p>
            </div>
            <a
              href="#cta"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 hover:border-gray-400 bg-white text-gray-900 text-sm font-medium px-5 py-3 transition-colors"
            >
              Get started
            </a>
          </div>

          {/* Subscription plan - highlighted */}
          <div className="relative rounded-2xl bg-gray-900 text-white p-8 ring-1 ring-gray-900">
            <span className="absolute -top-3 left-8 inline-block rounded-full bg-primary-500 text-white text-xs font-medium px-3 py-1">
              Most popular
            </span>
            <p className="text-sm text-gray-400 mb-4">Subscription</p>
            <div className="flex items-baseline gap-2 mb-4 flex-wrap">
              <span className="text-4xl font-bold">$30</span>
              <span className="text-sm text-gray-400">/month base + $5 per extra room</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Predictable pricing for independent properties for more upside
              from every direct booking.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Booking engine included',
                'PMS included',
                'Channel manager included',
                'Priority support',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-500/20">
                    <CheckIcon className="w-3 h-3 text-primary-400" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-gray-200">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#cta"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-3 transition-colors"
            >
              Get started
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Standalone Booking Engine */}
        <div className="mt-10 max-w-4xl rounded-2xl bg-white border border-gray-200 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-3">
              Separate product
            </p>
            <p className="text-sm text-gray-500 mb-2">Standalone Booking Engine</p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Already have a PMS? Plug in just the booking engine.
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              For properties that want to use vayada&apos;s booking engine on
              top of their existing PMS to embeddable checkout, affiliate &amp;
              referral tracking, guest data export, and full API access.
            </p>
          </div>
          <a
            href="#cta"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 hover:border-gray-400 bg-white text-gray-900 text-sm font-medium px-5 py-3 transition-colors flex-shrink-0"
          >
            Talk to sales
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
