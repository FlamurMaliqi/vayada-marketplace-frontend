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
      <div className="relative flex items-center h-16">
        {/* Left Side - Logo */}
        <div className="absolute left-[10vw] flex items-center">
          <a href={ROUTES.HOME} className="flex items-center gap-2">
            <Image
              src="/vayada-logo.svg"
              alt="vayada logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
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
        
        {/* Right Side - Contact us and Sign up */}
        <div className="absolute right-[10vw] hidden md:flex items-center gap-4">
          <a 
            href={ROUTES.CONTACT}
            className="text-gray-500 hover:text-primary-600 transition-colors font-medium border-[0.2px] border-black-300David Matthaei rounded-2xl px-4 py-2"
          >
            Contact us
          </a>
          <a href={ROUTES.LOGIN}>
            <Button variant="primary" size="md" className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl px-4 py-2">
              Sign In
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden absolute right-[10vw] text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
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
              className="block text-gray-700 hover:text-primary-600 font-medium border-[0.5px] border-black rounded-xl px-4 py-2 text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact us
            </a>
            <a
              href={ROUTES.SIGNUP}
              className="block"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button variant="primary" size="md" className="w-full">
                Sign up
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

