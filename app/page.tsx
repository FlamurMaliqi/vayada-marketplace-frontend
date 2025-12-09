'use client'

import { Navigation, Footer } from '@/components/layout'
import { Hero } from '@/components/landing'
import { useState, useEffect } from 'react'

export default function Home() {
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show footer when user scrolls down more than 100px
      if (window.scrollY > 100) {
        setShowFooter(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <div 
        className={`transition-opacity duration-500 ${
          showFooter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Footer />
      </div>
    </main>
  )
}

