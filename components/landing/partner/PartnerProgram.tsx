import { ArrowRightIcon } from '@heroicons/react/24/outline'

const STATS = [
  { value: '20%', label: 'Year 1 revenue share' },
  { value: '15%', label: 'Year 2 revenue share' },
  { value: '10%', label: 'Year 3 revenue share' },
]

export default function PartnerProgram() {
  return (
    <section id="partner-program" className="relative bg-white py-14 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-[#f7f8fc]/60 p-8 md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-radial)]" />
          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center lg:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
                Partner Program
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
                Earn by helping properties go{' '}
                <span className="text-primary-500">direct</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-500">
                Know hotels, villas or boutique stays that need better direct
                booking infrastructure? Introduce them to vayada and earn
                recurring revenue share for three years.
              </p>
              <p className="mt-5 text-sm leading-relaxed text-gray-500">
                We handle onboarding, setup and support. You bring trusted
                introductions.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
                <a
                  href="/partner-program"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-500 px-7 text-sm font-medium text-white shadow-glow transition-all hover:bg-primary-600"
                >
                  Become a partner
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
                <a
                  href="/partner-program"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-white px-7 text-sm text-ink transition-colors hover:bg-surface-elevated"
                >
                  Learn more
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-white p-3 text-center shadow-soft sm:p-6"
                >
                  <p className="font-display text-2xl font-semibold text-primary-500 sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-gray-500 sm:mt-2 sm:text-xs sm:tracking-[0.15em]">
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
