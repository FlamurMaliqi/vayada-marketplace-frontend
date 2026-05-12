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
    ctaHref: '/booking-engine',
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
    ctaHref: '/pms',
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
    ctaHref: '/hotel-creator-network',
  },
]

export default function PlatformSection() {
  return (
    <section id="product" className="relative bg-white pt-14 pb-8 md:pt-32 md:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[var(--gradient-radial)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
            The platform
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
            Modular infrastructure to win{' '}
            <span className="text-primary-500">direct bookings</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-500">
            Built for independent properties at every stage: replace your full
            stack or add the tools your current setup is missing.
          </p>
        </div>

        <div className="mt-20 space-y-8">
          {PRODUCTS.map((p) => (
            <div
              id={p.id}
              key={p.id}
              className="group relative flex flex-col gap-8 overflow-hidden rounded-3xl border border-border bg-white p-8 transition-all hover:border-border-strong md:p-12"
            >
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <div className={p.reverse ? 'md:order-2' : ''}>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
                    {p.eyebrow}
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-gray-500">
                    {p.body}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-sm">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-500">
                          <CheckIcon className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="text-gray-700">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`relative ${p.reverse ? 'md:order-1' : ''}`}>
                  {p.badge && (
                    <div className="flex items-center gap-1.5 border-b border-border bg-[#f7f8fc] px-3 py-2 text-[10px] text-gray-500">
                      <span className="h-2 w-2 rounded-full bg-red-400/70" />
                      <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                      <span className="h-2 w-2 rounded-full bg-green-400/70" />
                      <span className="ml-3">{p.badge}</span>
                    </div>
                  )}
                  <div className={`relative overflow-hidden border border-border-strong bg-white ${p.badge ? 'rounded-b-2xl' : 'rounded-2xl'} md:min-h-[280px]`}>
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      width={1200}
                      height={800}
                      className="block h-auto w-full md:h-full md:object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className={p.reverse ? 'md:text-right' : 'md:text-left'}>
                <a
                  href={p.ctaHref}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary-500 px-6 text-sm font-medium text-white shadow-glow transition-all hover:bg-primary-600"
                >
                  {p.ctaLabel}
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
