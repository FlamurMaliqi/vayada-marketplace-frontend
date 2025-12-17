'use client'

import { useState } from 'react'
import { NAVIGATION_LINKS } from '@/lib/constants'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui'
import Image from 'next/image'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Filter to only show "For Properties" and "For Creators" in center
  const centerLinks = NAVIGATION_LINKS.filter(link => 
    link.label === 'For Properties' || link.label === 'For Creators'
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href={ROUTES.HOME} className="flex items-center gap-2">
              <Image
                src="/vayada-logo.svg"
                alt="vayada logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-xl font-normal text-black lowercase">vayada</span>
            </a>
          </div>
          
          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {centerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {/* Right Side - Contact us */}
          <div className="hidden md:flex items-center">
            <a href={ROUTES.CONTACT}>
              <Button variant="primary" size="md" className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                Contact us
              </Button>
            </a>
          </div>

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
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {centerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-gray-700 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={ROUTES.CONTACT}
              className="block"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button variant="primary" size="md" className="w-full">
                Contact us
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

