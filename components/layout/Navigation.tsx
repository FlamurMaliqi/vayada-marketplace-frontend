'use client'

import { useState } from 'react'
import { ROUTES } from '@/lib/constants/routes'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const NAV_LINKS = [
  { label: 'Booking Engine', href: '/booking-engine' },
  { label: 'PMS', href: '/pms' },
  { label: 'Hotel-Creator-Network', href: '/hotel-creator-network' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Partner Program', href: '/partner-program' },
]

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={ROUTES.HOME} className="flex items-center">
            <span className="font-display text-lg font-semibold text-primary-500 lowercase">
              vayada
            </span>
          </a>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={ROUTES.CHOOSE_PRODUCT}
              className="px-3 py-2 text-sm text-gray-500 transition-colors hover:text-ink"
            >
              Log in
            </a>
            <a
              href="/#cta"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition-all hover:bg-primary-600"
            >
              Book a demo
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-2 py-2 text-sm text-gray-700 hover:text-ink"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={ROUTES.CHOOSE_PRODUCT}
              className="block px-2 py-2 text-sm text-gray-700 hover:text-ink"
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </a>
            <a
              href="/#cta"
              className="mx-2 mt-2 flex items-center justify-center gap-2 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a demo
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
