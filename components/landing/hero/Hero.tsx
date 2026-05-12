'use client'

import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-white via-white to-[#f4f5fb] pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            For independent properties
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px] font-bold tracking-tight text-gray-900 leading-[1.05]">
            Hotels are losing control over their demand.{' '}
            <span className="text-primary-500">vayada</span> takes it back.
          </h1>

          <p className="mt-8 text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            vayada offers an AI &amp; trust-based distribution stack for
            independent hotels to end your OTA dependency with a Booking
            Engine, PMS, Channel Manager &amp; Hotel-Creator-Network.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#cta"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-6 py-3 transition-colors"
            >
              Book a demo
              <ArrowRightIcon className="w-4 h-4" />
            </a>
            <a
              href="#product"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 hover:border-gray-400 bg-white text-gray-900 text-sm font-medium px-6 py-3 transition-colors"
            >
              Explore the product
            </a>
          </div>
        </div>

        {/* Hero product mockup */}
        <div className="mt-16 md:mt-20 relative max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200/60 bg-white">
            <Image
              src="/hero-booking.png"
              alt="Vayada-powered booking page for Green Poya Resort in Lombok"
              width={1600}
              height={1000}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
