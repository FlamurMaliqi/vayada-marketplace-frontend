'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import {
  ROUTES,
  PRODUCT_LOGIN_URLS,
  STORAGE_KEYS,
  type ProductKey,
} from '@/lib/constants'
import { Navigation } from '@/components/layout'
import { LandingFooter } from '@/components/landing'

interface ProductCard {
  key: ProductKey
  title: string
  description: string
  tags: string[]
  icon: typeof BuildingOffice2Icon
}

const PRODUCTS: ProductCard[] = [
  {
    key: 'PMS',
    title: 'PMS & booking engine',
    description:
      'Manage your property, reservations, rates, and direct bookings.',
    tags: ['Calendar', 'Reservations', 'Rates'],
    icon: BuildingOffice2Icon,
  },
  {
    key: 'HOTEL_CREATOR_NETWORK',
    title: 'Hotel creator network',
    description:
      'Access the marketplace, creator tools, and your partner dashboard.',
    tags: ['Marketplace', 'Creator tools'],
    icon: UserGroupIcon,
  },
]

export default function ChooseProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Keep the chooser hidden until we've decided whether to auto-skip, so a
  // returning user with a remembered product never sees the cards flash.
  const [ready, setReady] = useState(false)

  const goToProduct = (key: ProductKey) => {
    if (key === 'PMS') {
      // External product on its own domain — full navigation.
      window.location.href = PRODUCT_LOGIN_URLS.PMS
    } else {
      router.push(PRODUCT_LOGIN_URLS.HOTEL_CREATOR_NETWORK)
    }
  }

  const selectProduct = (key: ProductKey) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_PRODUCT, key)
    } catch {
      // localStorage can be unavailable (private mode); ignore and continue.
    }
    goToProduct(key)
  }

  useEffect(() => {
    // `?choose=1` always shows the chooser (escape hatch from the remembered
    // product, e.g. the "Choose a different product" link on a login page).
    if (searchParams.get('choose') === '1') {
      setReady(true)
      return
    }

    let remembered: string | null = null
    try {
      remembered = localStorage.getItem(STORAGE_KEYS.LAST_PRODUCT)
    } catch {
      remembered = null
    }

    if (remembered === 'PMS' || remembered === 'HOTEL_CREATOR_NETWORK') {
      goToProduct(remembered)
      return
    }

    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <main className="min-h-screen bg-white text-ink">
      <Navigation />

      <section className="flex min-h-screen flex-col items-center justify-center px-4 pb-16 pt-28 sm:px-6 md:pt-36 lg:px-8">
        {!ready ? (
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-500"
            role="status"
            aria-label="Loading"
          />
        ) : (
          <div className="w-full max-w-4xl">
            <div className="text-center">
              <h1 className="font-display text-3xl font-semibold sm:text-4xl">
                Welcome to vayada
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:text-lg">
                Which product would you like to sign in to?
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {PRODUCTS.map((product) => {
                const Icon = product.icon
                return (
                  <button
                    key={product.key}
                    type="button"
                    onClick={() => selectProduct(product.key)}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 text-left transition-all hover:border-primary-500 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:p-8"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 text-xl font-semibold">
                      {product.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      {product.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-[#f7f9ff] px-3 py-1 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                      Sign in
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not sure which one?{' '}
              <a
                href={ROUTES.HOME}
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Learn about our products
              </a>
            </p>
          </div>
        )}
      </section>

      <LandingFooter />
    </main>
  )
}
