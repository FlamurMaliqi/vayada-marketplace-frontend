import { Button } from '@/components/ui'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

export default function Hero() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Hotels Section */}
        <section className="relative min-h-screen flex items-center justify-start px-4 sm:px-6 lg:px-8">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/hotel-hero.JPG)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-900/80"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full pt-32 pb-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">Less OTAs.</span>
                <br />
                <span className="text-primary-400">More Direct Bookings.</span>
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 leading-relaxed">
                Replace fragmented tools. Turn creators into your booking channel.
              </p>
              <Link href={ROUTES.HOTEL_BENEFITS}>
                <Button variant="primary" size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Creators Section */}
        <section className="relative min-h-screen flex items-center justify-start px-4 sm:px-6 lg:px-8">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/creator-hero.png)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/70 to-gray-900/80"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full pt-32 pb-20">
            <div className="max-w-2xl">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-gray-700/50 backdrop-blur-sm text-gray-200 rounded-lg text-sm font-medium">
                  For Creators
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">Your Reach.</span>
                <br />
                <span className="text-primary-400">Turned into partnerships.</span>
              </h2>
              <p className="text-lg md:text-xl text-white mb-8 leading-relaxed">
                Trade your travel influence for partnerships with curated & high-quality hotels worldwide.
              </p>
              <Link href={ROUTES.CREATOR_BENEFITS}>
                <Button variant="outline" size="lg" className="bg-gray-800/50 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700/70 shadow-lg hover:shadow-xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

