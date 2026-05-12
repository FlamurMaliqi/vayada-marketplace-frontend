'use client'

import { useState } from 'react'
import { ROUTES } from '@/lib/constants/routes'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const NAV_LINKS = [
  { label: 'Booking Engine', href: '#booking-engine' },
  { label: 'PMS', href: '#pms' },
  { label: 'Hotel-Creator-Network', href: '#hcn' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Partner Program', href: '#partner' },
]

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={ROUTES.HOME} className="flex items-center">
            <span className="text-xl font-semibold text-primary-500 lowercase tracking-tight">
              vayada
            </span>
          </a>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side - Sign In + Book a demo */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={ROUTES.LOGIN}
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors px-3 py-2"
            >
              Sign in
            </a>
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
            >
              Book a demo
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-2 py-2 text-sm text-gray-700 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={ROUTES.LOGIN}
              className="block px-2 py-2 text-sm text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </a>
            <a
              href="#cta"
              className="block mx-2 mt-2 text-center rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a demo →
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
