'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Squares2X2Icon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'

export default function Hero() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Properties Section */}
        <section 
          className="relative min-h-screen flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 lg:pt-40 transition-all duration-500 ease-in-out"
          style={{
            flex: hoveredSection === 'properties' ? '0.8' : hoveredSection === 'creators' ? '0.2' : '1'
          }}
          onMouseEnter={() => setHoveredSection('properties')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/hotel-hero.JPG)'
            }}
          >
            <div className="absolute inset-0 bg-blue-900/70"></div>
          </div>
          <div className="relative z-10 w-full text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 border border-white text-white rounded-full text-sm font-medium">
                  For Properties
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">Less OTAs.</span>
                <br />
                <span style={{ color: '#2e51f4' }}>More Direct Bookings.</span>
              </h1>
              <p className="text-lg md:text-xl text-white leading-relaxed">
                Streamline your workflow. Convert influencer reach to direct bookings.
              </p>

              {/* Info Box - Appears on hover */}
              <div className={`mt-8 w-full transition-all duration-500 ease-in-out ${
                hoveredSection === 'properties' 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}>
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Squares2X2Icon className="w-8 h-8 text-primary-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col items-center text-center">
                    <p className="text-gray-900 font-medium text-sm md:text-base mb-4">
                      Win back bookings from OTAs while boosting direct reservations with creators.
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        <span className="text-gray-700 text-xs md:text-sm">Save Manual Work</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        <span className="text-gray-700 text-xs md:text-sm">Find the Right Creators</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={ROUTES.HOTEL_BENEFITS}>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="flex items-center justify-center gap-2 rounded-3xl"
                      >
                        Learn More
                        <ArrowRightIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creators Section */}
        <section 
          className="relative min-h-screen flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 lg:pt-40 transition-all duration-500 ease-in-out"
          style={{
            flex: hoveredSection === 'creators' ? '0.8' : hoveredSection === 'properties' ? '0.2' : '1'
          }}
          onMouseEnter={() => setHoveredSection('creators')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/creator-hero.jpg)'
            }}
          >
            <div className="absolute inset-0 bg-blue-900/70"></div>
          </div>
          <div className="relative z-10 w-full text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 border border-white text-white rounded-full text-sm font-medium">
                  For Creators
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">Your Reach.</span>
                <br />
                <span style={{ color: '#2e51f4' }}>Turned into partnerships.</span>
              </h2>
              <p className="text-lg md:text-xl text-white leading-relaxed">
                Trade your travel influence for partnerships with curated & high-quality hotels worldwide.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

