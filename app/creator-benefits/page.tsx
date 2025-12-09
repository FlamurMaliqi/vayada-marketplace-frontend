'use client'

import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { CREATORS_SECTION } from '@/lib/constants'
import { Navigation, Footer } from '@/components/layout'
import { Button } from '@/components/ui'
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  ChartBarSquareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function CreatorBenefitsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/creator-hero.png)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-800/80 to-gray-900/90"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full text-center py-32">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-gray-700/50 backdrop-blur-sm text-gray-200 rounded-lg text-sm font-medium">
                  For Creators & Influencers
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Your Reach.</span>
                <br />
                <span className="text-primary-400">Turned into partnerships.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed max-w-3xl mx-auto">
                Earn fair compensation while building authentic relationships with travel brands. Discover exciting hotel collaborations that align with your content and values.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={ROUTES.SIGNUP}>
                  <Button variant="primary" size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl">
                    Join as a Creator
                  </Button>
                </Link>
                <Link href={ROUTES.CONTACT}>
                  <Button variant="outline" size="lg" className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700/70 shadow-lg hover:shadow-xl">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Join vayada?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join a platform designed to empower creators and build meaningful partnerships
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {CREATORS_SECTION.advantages.map((advantage, index) => {
                const IconComponent = advantage.icon
                return (
                  <div key={index} className="flex items-start bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                        <IconComponent className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How It Works for Creators
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started in four simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {CREATORS_SECTION.steps.map((step) => (
                <div key={step.number} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features/Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-4">100%</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Relationships</h3>
                <p className="text-gray-600">Work directly with hotels, no middlemen taking cuts</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-4">Fair</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">Negotiate rates that reflect your true value</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-4">Verified</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Partners</h3>
                <p className="text-gray-600">Connect with verified hotels that match your niche</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join vayada today and start building authentic partnerships with hotels worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.SIGNUP}>
                <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100 border-white">
                  Sign Up Now
                </Button>
              </Link>
              <Link href={ROUTES.CONTACT}>
                <Button variant="outline" size="lg" className="bg-transparent text-white hover:bg-white/10 border-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}




