'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { CreatorCard } from '@/components/marketplace/CreatorCard'
import { Button, PlatformIcon, StarRating } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import type { Creator } from '@/lib/types'
import { creatorService } from '@/services/api/creators'
import {
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  SparklesIcon,
  MapPinIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import { formatNumber } from '@/lib/utils'

// Number of creators to show before the blur overlay
const VISIBLE_CREATORS_COUNT = 6

export default function PublicCreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCreators()
  }, [])

  const loadCreators = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await creatorService.getAll()
      setCreators(response.data)
    } catch (err) {
      console.error('Error loading creators:', err)
      setError('Failed to load creators. Please try again.')
      setCreators([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from creators
  const stats = useMemo(() => {
    const totalReach = creators.reduce((sum, c) => sum + c.audienceSize, 0)
    const uniqueCountries = new Set(creators.map(c => c.location.split(',').pop()?.trim())).size
    return {
      totalCreators: creators.length,
      totalReach,
      countries: uniqueCountries,
    }
  }, [creators])

  // Sort by audience size for display
  const sortedCreators = useMemo(() => {
    return [...creators].sort((a, b) => b.audienceSize - a.audienceSize)
  }, [creators])

  // Split into visible and hidden
  const visibleCreators = sortedCreators.slice(0, VISIBLE_CREATORS_COUNT)
  const hiddenCreators = sortedCreators.slice(VISIBLE_CREATORS_COUNT)
  const hiddenCount = hiddenCreators.length

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 via-white to-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4" />
              Verified Creator Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Travel Creators
              <span className="text-primary-600"> That Convert</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Browse our curated community of verified travel influencers.
              Find the perfect match for your property and start driving direct bookings.
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
                <CheckBadgeIcon className="w-5 h-5" />
                <span className="text-2xl md:text-3xl font-bold">{stats.totalCreators}</span>
              </div>
              <p className="text-sm text-gray-600">Verified Creators</p>
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
                <UserGroupIcon className="w-5 h-5" />
                <span className="text-2xl md:text-3xl font-bold">{formatNumber(stats.totalReach)}</span>
              </div>
              <p className="text-sm text-gray-600">Combined Reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Gallery */}
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
              {/* Visible Creators Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCreators.map((creator) => (
                  <CreatorCard key={creator.id} creator={creator} isPublic />
                ))}
              </div>

              {/* Blurred/Teaser Section */}
              {hiddenCount > 0 && (
                <div className="relative mt-6">
                  {/* Blurred preview cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 blur-[6px] opacity-60 pointer-events-none select-none" aria-hidden="true">
                    {hiddenCreators.slice(0, 3).map((creator) => (
                      <CreatorCard key={creator.id} creator={creator} isPublic />
                    ))}
                  </div>

                  {/* Gradient fade overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white pointer-events-none" />

                  {/* CTA Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 md:p-10 max-w-lg mx-4 text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LockClosedIcon className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        {hiddenCount}+ More Creators
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Sign up for free to access all verified creators, send collaboration invitations, and manage your partnerships.
                      </p>
                      <div className="space-y-3">
                        <Link href={`${ROUTES.SIGNUP}?type=hotel`} className="block">
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
            Why hotels choose vayada
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckBadgeIcon,
                title: 'Verified Data',
                description: 'All creator metrics are verified. No fake followers, no inflated engagement rates.',
              },
              {
                icon: UserGroupIcon,
                title: 'Direct Contact',
                description: 'Connect directly with creators. No middlemen, no agencies, no hidden fees.',
              },
              {
                icon: SparklesIcon,
                title: 'Free to Join',
                description: 'Register your property for free. Only pay when you start a paid collaboration.',
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
            Ready to find your perfect creators?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join vayada for free and get instant access to all {stats.totalCreators} verified travel creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${ROUTES.SIGNUP}?type=hotel`}>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-primary-700 border-white hover:bg-primary-50 px-8"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href={ROUTES.HOTEL_BENEFITS}>
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
