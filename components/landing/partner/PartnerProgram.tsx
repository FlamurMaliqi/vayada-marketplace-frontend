import { ArrowRightIcon } from '@heroicons/react/24/outline'

const STATS = [
  { value: '20%', label: 'Year 1 revenue share' },
  { value: '15%', label: 'Year 2 revenue share' },
  { value: '10%', label: 'Year 3 revenue share' },
]

export default function PartnerProgram() {
  return (
    <section id="partner" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gray-50 border border-gray-200 p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-4">
                Partner Program
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Earn by helping properties go{' '}
                <span className="text-primary-500">direct</span>
              </h2>
              <p className="mt-6 text-base text-gray-600 leading-relaxed">
                Know hotels, villas or boutique stays that need better direct
                booking infrastructure? Introduce them to vayada and earn
                recurring revenue share for three years.
              </p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                We handle onboarding, setup and support. You bring trusted
                introductions.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-3 transition-colors"
                >
                  Become a partner
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
                <a
                  href="#cta"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 hover:border-gray-400 bg-white text-gray-900 text-sm font-medium px-5 py-3 transition-colors"
                >
                  Learn more
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white border border-gray-200 p-6 text-center"
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary-500 mb-2">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-600 leading-tight">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
