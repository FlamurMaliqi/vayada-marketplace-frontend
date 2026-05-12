'use client'

import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-white px-3 py-1 text-xs text-gray-500 shadow-soft">
            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-primary-500" />
            For independent properties
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-ink md:text-7xl">
            Hotels are losing control
            <br />
            over their demand.
            <br />
            <span className="text-primary-500">vayada</span> takes it back.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500 md:text-xl">
            vayada offers an AI &amp; trust-based distribution stack for
            independent hotels to end your OTA dependency with a Booking
            Engine, PMS, Channel Manager &amp; Hotel-Creator-Network.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#cta"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-500 px-7 text-base font-medium text-white shadow-glow transition-all hover:bg-primary-600"
            >
              Book a demo
              <ArrowRightIcon className="w-4 h-4" />
            </a>
            <a
              href="#product"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-white px-7 text-base text-ink transition-colors hover:bg-surface-elevated"
            >
              Explore the product
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-6xl">
          <div className="absolute -inset-x-20 -top-10 -bottom-10 rounded-[3rem] bg-primary-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-white shadow-elevated">
            <Image
              src="/hero-booking.png"
              alt="Vayada-powered booking page for Green Poya Resort in Lombok"
              width={1600}
              height={1200}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
