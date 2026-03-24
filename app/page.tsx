'use client'

import { Navigation, Footer } from '@/components/layout'
import { Hero } from '@/components/landing'
import { useState, useEffect } from 'react'

export default function Home() {
  const [showFooter, setShowFooter] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show footer when user scrolls down more than 100px
      if (window.scrollY > 100) {
        setShowFooter(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSecretClick = () => {
    if (!showEasterEgg) {
      const newClicks = clicks + 1
      setClicks(newClicks)
      if (newClicks >= 7) {
        setShowEasterEgg(true)
      }
    }
  }

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <Navigation />
      <Hero />
      <div 
        className={`transition-opacity duration-500 ${
          showFooter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Footer />
      </div>
      
      {/* Easter Egg Trigger */}
      <div 
        onClick={handleSecretClick}
        className="fixed bottom-0 right-0 w-16 h-16 z-50 flex items-end justify-end p-4 cursor-default"
      >
        {showEasterEgg && (
          <div className="text-4xl animate-bounce drop-shadow-lg" title="You found me! 🌹">
            🌹
          </div>
        )}
      </div>
    </main>
  )
}
