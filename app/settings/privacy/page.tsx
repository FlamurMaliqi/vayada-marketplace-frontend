'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { ROUTES } from '@/lib/constants'
import { consentService, ConsentStatusResponse, ConsentHistoryItem } from '@/services/api/consent'
import { useCookieConsent } from '@/context/CookieConsentContext'
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CogIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

export default function PrivacySettingsPage() {
  const { isCollapsed } = useSidebar()
  const { consent, openSettings } = useCookieConsent()
  const [consentStatus, setConsentStatus] = useState<ConsentStatusResponse | null>(null)
  const [consentHistory, setConsentHistory] = useState<ConsentHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load consent status
  useEffect(() => {
    const loadConsentData = async () => {
      try {
        setIsLoading(true)
        const [status, history] = await Promise.all([
          consentService.getConsentStatus(),
          consentService.getConsentHistory(10),
        ])
        setConsentStatus(status)
        setConsentHistory(history.history)
      } catch (err) {
        console.error('Failed to load consent data:', err)
        setError('Failed to load your consent settings. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadConsentData()
  }, [])

  const handleMarketingConsentToggle = async () => {
    if (!consentStatus || isUpdating) return

    try {
      setIsUpdating(true)
      setError(null)
      setSuccessMessage(null)

      const newConsent = !consentStatus.marketing_consent
      const result = await consentService.updateMarketingConsent({
        marketing_consent: newConsent,
      })

      setConsentStatus({
        ...consentStatus,
        marketing_consent: result.marketing_consent,
        marketing_consent_at: result.marketing_consent_at,
      })

      setSuccessMessage(result.message)

      // Refresh history
      const history = await consentService.getConsentHistory(10)
      setConsentHistory(history.history)
    } catch (err) {
      console.error('Failed to update marketing consent:', err)
      setError('Failed to update your marketing preferences. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>

        <div className="max-w-4xl mx-auto pt-4 pb-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
              Privacy Settings
            </h1>
            <p className="text-lg text-gray-600">
              Manage your privacy preferences and data rights under GDPR
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Consent Status Cards */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Consent Status</h2>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {/* Terms of Service */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Terms of Service</h3>
                        <p className="text-sm text-gray-500">
                          {consentStatus?.terms_accepted
                            ? `Accepted on ${formatDate(consentStatus.terms_accepted_at)}`
                            : 'Not accepted'}
                        </p>
                      </div>
                    </div>
                    {consentStatus?.terms_accepted ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  {/* Privacy Policy */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Privacy Policy</h3>
                        <p className="text-sm text-gray-500">
                          {consentStatus?.privacy_accepted
                            ? `Accepted on ${formatDate(consentStatus.privacy_accepted_at)}`
                            : 'Not accepted'}
                        </p>
                      </div>
                    </div>
                    {consentStatus?.privacy_accepted ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  {/* Marketing Consent */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Marketing Communications</h3>
                        <p className="text-sm text-gray-500">
                          Receive updates, offers, and marketing emails
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleMarketingConsentToggle}
                      disabled={isUpdating}
                      className={`
                        relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                        ${consentStatus?.marketing_consent ? 'bg-primary-600' : 'bg-gray-200'}
                        ${isUpdating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                          ${consentStatus?.marketing_consent ? 'translate-x-5' : 'translate-x-0'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Newsletter Preferences */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <EnvelopeIcon className="h-6 w-6 text-primary-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Weekly Newsletter</h3>
                      <p className="text-sm text-gray-500">
                        Get weekly recommendations for hotels or creators, plus new members on Vayada
                      </p>
                    </div>
                  </div>
                  <Link
                    href={ROUTES.SETTINGS_NEWSLETTER}
                    className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>

              {/* Cookie Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CogIcon className="h-6 w-6 text-primary-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Cookie Settings</h3>
                      <p className="text-sm text-gray-500">
                        {consent ? (
                          <>
                            Necessary: On |{' '}
                            Functional: {consent.functional ? 'On' : 'Off'} |{' '}
                            Analytics: {consent.analytics ? 'On' : 'Off'} |{' '}
                            Marketing: {consent.marketing ? 'On' : 'Off'}
                          </>
                        ) : (
                          'Not configured'
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={openSettings}
                    className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    Manage Cookies
                  </button>
                </div>
              </div>

              {/* Data Rights Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Your Data Rights</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Exercise your rights under GDPR Articles 17 & 20
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  <Link
                    href={ROUTES.SETTINGS_DATA_EXPORT}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Export Your Data</h3>
                        <p className="text-sm text-gray-500">
                          Download a copy of all your personal data (Article 20)
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </Link>

                  <Link
                    href={ROUTES.SETTINGS_DELETE_ACCOUNT}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <TrashIcon className="h-5 w-5 text-red-400" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                        <p className="text-sm text-gray-500">
                          Request permanent deletion of your account (Article 17)
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </Link>
                </div>
              </div>

              {/* Consent History */}
              {consentHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Consent Changes</h2>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {consentHistory.slice(0, 5).map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {item.consent_type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            item.consent_given
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.consent_given ? 'Given' : 'Withdrawn'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
