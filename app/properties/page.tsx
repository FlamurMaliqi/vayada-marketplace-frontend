'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { HotelCard } from '@/components/marketplace/HotelCard'
import { Button } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import type { Hotel } from '@/lib/types'
import { hotelService } from '@/services/api/hotels'
import {
  CheckBadgeIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  LockClosedIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

// Number of hotels to show before the blur overlay (first row only)
const VISIBLE_HOTELS_COUNT = 3

export default function PublicPropertiesPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHotels()
  }, [])

  const loadHotels = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await hotelService.getAll()
      setHotels(response.data)
    } catch (err) {
      console.error('Error loading hotels:', err)
      setError('Failed to load properties. Please try again.')
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from hotels
  const stats = useMemo(() => {
    const uniqueCountries = new Set(hotels.map(h => h.location.split(',').pop()?.trim())).size
    const uniqueTypes = new Set(hotels.map(h => h.accommodationType).filter(Boolean)).size
    return {
      totalHotels: hotels.length,
      countries: uniqueCountries,
      propertyTypes: uniqueTypes,
    }
  }, [hotels])

  // Split into visible and hidden
  const visibleHotels = hotels.slice(0, VISIBLE_HOTELS_COUNT)
  const hiddenHotels = hotels.slice(VISIBLE_HOTELS_COUNT)
  const hiddenCount = hiddenHotels.length

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 via-white to-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4" />
              Open Collaboration Opportunities
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Dream Properties
              <span className="text-primary-600"> Seeking Creators</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Browse verified hotels actively looking for creator collaborations.
              Find your next dream stay and build your professional portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary-600 mb-1">
                <BuildingOfficeIcon className="w-5 h-5" />
                <span className="text-2xl md:text-3xl font-bold">{stats.totalHotels}</span>
              </div>
              <p className="text-sm text-gray-600">Open Listings</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary-600 mb-1">
                <GlobeAltIcon className="w-5 h-5" />
                <span className="text-2xl md:text-3xl font-bold">{stats.countries}+</span>
              </div>
              <p className="text-sm text-gray-600">Countries</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary-600 mb-1">
                <CheckBadgeIcon className="w-5 h-5" />
                <span className="text-2xl md:text-3xl font-bold">100%</span>
              </div>
              <p className="text-sm text-gray-600">Verified Properties</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Gallery */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error notification */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <p className="text-red-700">{error}</p>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                &times;
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Visible Hotels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} isPublic />
                ))}
              </div>

              {/* Blurred/Teaser Section */}
              {hiddenCount > 0 && (
                <div className="relative mt-6">
                  {/* Blurred preview cards - 2 rows */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 blur-[6px] opacity-40 pointer-events-none select-none" aria-hidden="true">
                    {hiddenHotels.slice(0, 6).map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} isPublic />
                    ))}
                  </div>

                  {/* Gradient fade overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white pointer-events-none" />

                  {/* CTA Overlay - centered over blurred rows */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 md:p-10 max-w-lg mx-4 text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LockClosedIcon className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        {hiddenCount}+ More Properties
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Sign up for free to access all open collaborations, apply to hotels, and build your professional portfolio.
                      </p>
                      <div className="space-y-3">
                        <Link href={`${ROUTES.SIGNUP}?type=creator`} className="block">
                          <Button variant="primary" size="lg" className="w-full">
                            Sign Up Free to See All
                          </Button>
                        </Link>
                        <Link href={ROUTES.LOGIN} className="block">
                          <Button variant="outline" size="md" className="w-full">
                            Already have an account? Sign in
                          </Button>
                        </Link>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        No credit card required. Free forever.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Why creators choose vayada
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckBadgeIcon,
                title: 'Verified Hotels',
                description: 'All properties are verified. No scams, no fake listings, only real opportunities.',
              },
              {
                icon: UserGroupIcon,
                title: 'Direct Access',
                description: 'Apply directly to hotels. No agencies, no middlemen, just you and the property.',
              },
              {
                icon: SparklesIcon,
                title: 'Build Your Portfolio',
                description: 'Complete collaborations, earn reviews, and grow your professional reputation.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to land your dream collaboration?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join vayada for free and get instant access to all {stats.totalHotels} open hotel listings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${ROUTES.SIGNUP}?type=creator`}>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-primary-700 border-white hover:bg-primary-50 px-8"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href={ROUTES.CREATOR_BENEFITS}>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
