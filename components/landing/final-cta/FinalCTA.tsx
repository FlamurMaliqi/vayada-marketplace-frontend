import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline'

const BENEFITS = [
  'Boost direct bookings',
  'Trust-based demand',
  'Increase revenue with upselling',
]

export default function FinalCTA() {
  return (
    <section id="cta" className="bg-[#f4f5fb] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-4">
            Grow direct. Increase revenue.
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Ready to{' '}
            <span className="text-primary-500">own your demand?</span>
          </h2>
          <p className="mt-6 text-base text-gray-600 leading-relaxed">
            Book a 20-minute demo and see how vayada helps you turn trust-based
            demand into more direct bookings and revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10">
          {BENEFITS.map((b) => (
            <div
              key={b}
              className="flex items-center gap-3 rounded-full bg-white border border-gray-200 px-5 py-3"
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
                <CheckIcon className="w-3 h-3 text-primary-500" strokeWidth={3} />
              </span>
              <span className="text-sm text-gray-800">{b}</span>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto rounded-2xl bg-white border border-gray-200 p-8 md:p-10 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Book a 20-minute demo
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            See vayada in action, tailored to your property.
          </p>
          <a
            href="mailto:t.schreyer@vayada.com"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-6 py-3 transition-colors"
          >
            Book a demo
            <ArrowRightIcon className="w-4 h-4" />
          </a>
          <p className="mt-6 text-xs text-gray-500">
            or write us directly at{' '}
            <a
              href="mailto:t.schreyer@vayada.com"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              t.schreyer@vayada.com
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
