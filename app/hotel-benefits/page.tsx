'use client'

import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { HOTELS_SECTION } from '@/lib/constants'
import { Navigation, Footer } from '@/components/layout'
import { Button } from '@/components/ui'
import { CheckIcon } from '@heroicons/react/24/outline'

export default function HotelBenefitsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-[#f8f8fb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
                  Stop DM Chaos.
                  <br />
                  Start driving <span className="text-primary-600">direct bookings.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Join the free marketplace where you discover, vet, and manage creator partnerships in one centralized hub.
                  End the inbox chaos and find verified creators who match your target audience.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`${ROUTES.SIGNUP}?type=hotel`}>
                    <Button
                      variant="primary"
                      size="md"
                      className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl"
                    >
                      Register Hotel for Free
                    </Button>
                  </Link>
                  <Link href={ROUTES.CREATOR_BENEFITS}>
                    <Button
                      variant="outline"
                      size="md"
                      className="bg-white text-gray-800 border border-gray-200 hover:border-primary-200 hover:text-primary-700"
                    >
                      See Creator Profiles
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="rounded-2xl overflow-hidden shadow-xl bg-white max-w-md w-full">
                  <img
                    src="/hotel-hero.JPG"
                    alt="Hotel with pool and sea view"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature bar */}
        <section className="bg-[#f5f5f7] border-t border-b border-gray-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-700 text-sm md:text-base">
              {[
                '100% Free to Join',
                'Verified Creator Data',
                'Centralized Dashboard',
                'Two-Way Reviews',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-primary-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
