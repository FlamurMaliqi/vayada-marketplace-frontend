'use client'

import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { Navigation, Footer } from '@/components/layout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Back to Home Link */}
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          {/* About Us Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
              About Us
            </h1>
          </div>

          {/* Hero Image Section */}
          <div className="w-full mb-16">
            <div className="w-full h-[60vh] lg:h-[70vh] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=3389&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Luxury hotel room with ocean view"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-4xl mx-auto">
            {/* ABOUT VAYADA Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary-600 text-white font-semibold text-sm uppercase tracking-wider rounded-lg">
                ABOUT VAYADA
              </span>
            </div>

            {/* Our Journey Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our Journey
            </h2>

            {/* Story Content */}
            <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Our journey began with a deep passion for boutique and independent hotels. Starting at 17 years old, it began with building the Instagram page{' '}
              <a
                href="https://instagram.com/gloriouhotel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline font-semibold"
              >
                @gloriouhotel
              </a>{' '}
              to over 300,000 followers on Instagram, collaborating with hundreds of hotels worldwide.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              But behind the beauty of travel, we discovered the same recurring struggle everywhere: OTA dominance, high commissions, and outdated systems that prevented especially small and independent properties from thriving.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6 font-semibold">
              This is the reason why we are building vayada.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              vayada is a platform that connects properties, travelers, and creators in one thriving, modern ecosystem, empowering each of them through transparency, fairness, and technology.
            </p>
            </div>
          </div>

          {/* Vision & Mission Section */}
          <div className="mt-24 lg:mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Image */}
              <div className="order-2 lg:order-1">
                <div className="w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3389&auto=format&fit=crop&ixlib=rb-4.0.3"
                    alt="Luxurious hotel suite with tropical view"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column - Vision & Mission Content */}
              <div className="order-1 lg:order-2 space-y-12">
                {/* Vision Section */}
                <div>
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-blue-100 text-primary-700 font-semibold text-sm uppercase tracking-wider rounded-lg">
                      OUR VISION
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Transforming Hospitality
                  </h2>
                  
                  <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                    <p>
                      Our vision is to transform hospitality by giving independent hotels and vacation rentals control over their bookings, data, and guest relationships.
                    </p>
                    <p>
                      We believe in a transparent, performance-driven ecosystem where properties thrive through direct connections with travelers, supported by a global network of trusted creators.
                    </p>
                  </div>
                </div>

                {/* Mission Section */}
                <div>
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-gray-200 text-primary-700 font-semibold text-sm uppercase tracking-wider rounded-lg">
                      OUR MISSION
                    </span>
                  </div>
                  
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    Empowering independent hospitality and driving direct bookings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Trusted Partners Section */}
          <div className="mt-24 lg:mt-32">
            <div className="max-w-6xl mx-auto text-center">
              {/* Badge */}
              <div className="mb-6 flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-primary-700 font-semibold text-sm uppercase tracking-wider rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                  </svg>
                  HOTELS THAT TRUSTED @GLORIOUSHOTELS
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Trusted Partners
              </h2>

              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto mb-12">
                With over 300,000 followers, @glorioushotels has collaborated with 20+ boutique hotels and villas worldwide. These collaborations inspire vayada's mission to connect hotels, travelers, and creators in one powerful ecosystem.
              </p>

              {/* Partners Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  'Lesante Blu',
                  'Myconian Collection',
                  'Stella Rocca a Mare',
                  'Cap Vermell Grand Hotel',
                  'Ikies Santorini',
                  'Sukkho',
                  'Mykonos Bliss',
                  'Domes Aulus',
                  'Lesante Classic',
                ].map((partner) => (
                  <div
                    key={partner}
                    className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <p className="text-gray-900 font-semibold text-lg">
                      {partner}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

