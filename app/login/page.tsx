'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { Button, Input } from '@/components/ui'
import { Navigation, Footer } from '@/components/layout'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic will be added later
    console.log('Sign in:', formData)
    
    // For development: Set user as logged in and check profile status
    // In production, this would come from the auth API response
    if (typeof window !== 'undefined') {
      // Check if user has a profile (for demo purposes, you can set this manually)
      // In production, this would be checked via API
      const hasProfile = localStorage.getItem('hasProfile') === 'true'
      localStorage.setItem('isLoggedIn', 'true')
      
      // Set profile completion status
      // In production, this would come from the user's profile data
      if (hasProfile) {
        localStorage.setItem('profileComplete', 'true')
      } else {
        localStorage.setItem('profileComplete', 'false')
      }
    }
    
    // After successful login, redirect to marketplace
    router.push(ROUTES.MARKETPLACE)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 text-center">
              <h1 className="text-3xl font-bold text-white">vayada</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <div className="mt-2 text-right">
                  <Link
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            <div className="px-8 pb-8 text-center border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href={ROUTES.SIGNUP}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
