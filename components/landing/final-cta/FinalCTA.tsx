'use client'

import { FormEvent, useState } from 'react'
import {
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'

const BENEFITS = [
  { label: 'Boost direct bookings', Icon: ArrowTrendingUpIcon },
  { label: 'Trust-based demand', Icon: ShieldCheckIcon },
  { label: 'Increase revenue with upselling', Icon: ChartBarIcon },
]

export default function FinalCTA() {
  const [email, setEmail] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const subject = encodeURIComponent('Vayada demo request')
    const body = encodeURIComponent(
      email
        ? `Hi Vayada,\n\nI would like to book a 20-minute demo.\n\nMy email: ${email}`
        : 'Hi Vayada,\n\nI would like to book a 20-minute demo.'
    )

    window.location.href = `mailto:t.schreyer@vayada.com?subject=${subject}&body=${body}`
  }

  return (
    <section id="cta" className="relative bg-white py-14 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-br from-primary-50 via-white to-primary-50 p-8 shadow-soft md:p-16">
          <div className="pointer-events-none absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-[var(--gradient-radial)] opacity-60" />
          <div className="relative grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-500">
                <BoltIcon className="h-4 w-4" />
                Grow direct. Increase revenue.
              </div>
              <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] text-ink md:text-6xl">
                Ready to own your <span className="text-primary-500">demand</span>?
              </h2>
              <p className="mt-6 max-w-xl text-lg text-gray-500">
                Book a 20-minute demo and see how vayada helps you turn trust-based
                demand into more direct bookings and revenue.
              </p>
              <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
                {BENEFITS.map(({ label, Icon }) => (
                  <div key={label} className="flex flex-col items-start gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium leading-tight text-ink">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border-strong bg-white p-6 shadow-soft md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                  <CalendarDaysIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    Book a 20-minute demo
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    See vayada in action, tailored to your property.
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <label className="relative block">
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@hotel.com"
                    className="h-12 w-full rounded-xl border border-border-strong bg-white pl-11 pr-4 text-base text-ink placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 text-base font-medium text-white shadow-glow transition-all hover:bg-primary-600"
                >
                  Book a demo
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border-strong" />
                <span className="text-xs text-gray-500">or</span>
                <div className="h-px flex-1 bg-border-strong" />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">
                Or write us directly at{' '}
                <a
                  href="mailto:t.schreyer@vayada.com"
                  className="font-medium text-primary-500 underline-offset-4 hover:underline"
                >
                  t.schreyer@vayada.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
