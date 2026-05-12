import Image from 'next/image'
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline'

type Product = {
  id: string
  eyebrow: string
  title: string
  body: string
  bullets: string[]
  image: { src: string; alt: string }
  ctaLabel: string
  ctaHref: string
  reverse?: boolean
  badge?: string
}

const PRODUCTS: Product[] = [
  {
    id: 'booking-engine',
    eyebrow: 'Booking Engine',
    title: 'Turn website visitors into direct bookings',
    body: 'Launch a branded booking flow that converts demand, captures guest data and increases revenue per stay.',
    bullets: [
      'Branded checkout',
      'Affiliate & referral tracking',
      'Upsell experiences & transport',
    ],
    image: {
      src: '/booking-preview.jpg',
      alt: 'Live Vayada-powered direct booking page for Green Poya Resort in Lombok',
    },
    ctaLabel: 'Learn more about the Booking Engine',
    ctaHref: '#booking-engine',
    badge: 'vayada.com/green-poya',
  },
  {
    id: 'pms',
    eyebrow: 'Property Management',
    title: 'Manage rooms, rates and reservations in one place',
    body: 'A lightweight PMS for hotels and villas to run daily operations, manage availability and keep OTA channels synchronized.',
    bullets: ['Calendar & rates', 'Guest CRM', 'Channel Manager'],
    image: {
      src: '/pms-product-mock.png',
      alt: 'Vayada PMS calendar showing reservations across rooms and villas',
    },
    ctaLabel: 'Learn more about the PMS',
    ctaHref: '#pms',
    reverse: true,
  },
  {
    id: 'hcn',
    eyebrow: 'Hotel-Creator-Network',
    title: 'Trust becomes distribution with vetted creators',
    body: 'Join the free marketplace where you discover, vet, and manage creator partnerships in one centralized hub.',
    bullets: [
      'Vetted creator matching',
      'Centralized collaboration workflow',
      'Pay only on completed stays',
    ],
    image: {
      src: '/hcn-network-mock.png',
      alt: 'Vayada Hotel-Creator-Network dashboard with verified creator profiles',
    },
    ctaLabel: 'Learn more about the Hotel-Creator-Network',
    ctaHref: '#hcn',
  },
]

export default function PlatformSection() {
  return (
    <section id="product" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-4">
            The platform
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Modular infrastructure to win{' '}
            <span className="text-primary-500">direct bookings</span>
          </h2>
          <p className="mt-6 text-base text-gray-600 max-w-2xl">
            Built for independent properties at every stage: replace your full
            stack or add the tools your current setup is missing.
          </p>
        </div>

        <div className="mt-16 md:mt-20 space-y-20 md:space-y-28">
          {PRODUCTS.map((p) => (
            <div
              id={p.id}
              key={p.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                p.reverse ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary-500 font-semibold mb-4">
                  {p.eyebrow}
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                  {p.title}
                </h3>
                <p className="mt-5 text-base text-gray-600 leading-relaxed">
                  {p.body}
                </p>
                <ul className="mt-6 space-y-3">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
                        <CheckIcon className="w-3 h-3 text-primary-500" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={p.ctaHref}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  {p.ctaLabel}
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
              </div>

              <div className="relative">
                {p.badge && (
                  <div className="absolute -top-3 left-4 z-10 rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-700 shadow-sm">
                    {p.badge}
                  </div>
                )}
                <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200/60 bg-white">
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
