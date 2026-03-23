'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { ROUTES } from '@/lib/constants'
import { newsletterService, NewsletterPreferences } from '@/services/api/newsletter'
import {
  EnvelopeIcon,
  GlobeAltIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

export default function NewsletterSettingsPage() {
  const { isCollapsed } = useSidebar()
  const [prefs, setPrefs] = useState<NewsletterPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [countryInput, setCountryInput] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const data = await newsletterService.getPreferences()
        setPrefs(data)
      } catch {
        setError('Failed to load newsletter preferences.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const save = async (updates: Partial<NewsletterPreferences>) => {
    if (isSaving) return
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)
      const updated = await newsletterService.updatePreferences(updates)
      setPrefs(updated)
      setSuccess('Preferences saved.')
    } catch {
      setError('Failed to save preferences.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleEnabled = () => {
    if (!prefs) return
    save({ enabled: !prefs.enabled })
  }

  const addCountry = () => {
    const trimmed = countryInput.trim()
    if (!trimmed || !prefs) return
    const current = prefs.country_filter || []
    if (current.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      setCountryInput('')
      return
    }
    const updated = [...current, trimmed]
    save({ country_filter: updated })
    setCountryInput('')
  }

  const removeCountry = (country: string) => {
    if (!prefs) return
    const current = prefs.country_filter || []
    const updated = current.filter(c => c !== country)
    save({ country_filter: updated.length > 0 ? updated : [] })
  }

  const clearCountryFilter = () => {
    save({ country_filter: [] })
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>

        <div className="max-w-4xl mx-auto pt-4 pb-8 px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href={ROUTES.SETTINGS_PRIVACY}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Privacy Settings
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
              Newsletter Preferences
            </h1>
            <p className="text-lg text-gray-600">
              Get weekly recommendations for hotels or creators tailored to you
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : prefs ? (
            <div className="space-y-6">
              {/* Weekly Newsletter Toggle */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <EnvelopeIcon className="h-6 w-6 text-primary-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Weekly Newsletter</h2>
                      <p className="text-sm text-gray-500">
                        Receive weekly recommendations and discover new members on vayada
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleEnabled}
                    disabled={isSaving}
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      ${prefs.enabled ? 'bg-primary-600' : 'bg-gray-200'}
                      ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    <span
                      className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                        ${prefs.enabled ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              </div>

              {/* Country Filter */}
              {prefs.enabled && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <GlobeAltIcon className="h-6 w-6 text-primary-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Country Filter</h2>
                        <p className="text-sm text-gray-500">
                          Only receive recommendations from specific countries. Leave empty to get recommendations from everywhere.
                        </p>
                      </div>
                    </div>

                    {/* Current filters */}
                    {prefs.country_filter && prefs.country_filter.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {prefs.country_filter.map((country) => (
                          <span
                            key={country}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                          >
                            {country}
                            <button
                              onClick={() => removeCountry(country)}
                              disabled={isSaving}
                              className="hover:text-primary-900 disabled:opacity-50"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                        <button
                          onClick={clearCountryFilter}
                          disabled={isSaving}
                          className="text-sm text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
                        >
                          Clear all
                        </button>
                      </div>
                    )}

                    {/* Add country */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={countryInput}
                        onChange={(e) => setCountryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCountry()
                          }
                        }}
                        placeholder="e.g. Spain, Thailand, Italy..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        onClick={addCountry}
                        disabled={isSaving || !countryInput.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {(!prefs.country_filter || prefs.country_filter.length === 0) && (
                      <p className="mt-3 text-xs text-gray-400">
                        No filter set — you will receive recommendations from all countries.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-50 rounded-lg border border-blue-100 p-5">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">What you will receive</h3>
                <ul className="text-sm text-blue-800 space-y-1.5 list-disc list-inside">
                  <li>Personalized weekly recommendations every Monday</li>
                  <li>New hotels or creators that recently joined vayada</li>
                  <li>Recommendations filtered by your country preferences</li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
