'use client'

import { useEffect } from 'react'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'

// Cross-app auth handoff landing page.
//
// The PMS and Booking Engine admin "SWITCH APP" dropdowns deep-link here
// (`/handoff#token=...&expires_at=...&user=...&hotel_id=...`) so a user who
// is already signed in over there lands in the marketplace authenticated,
// without re-login. Auth data travels in the URL hash (not the query) so it
// never reaches server logs.
//
// The keys written here are exactly the ones `services/auth` reads back
// (`access_token`, `token_expires_at`, plus the STORAGE_KEYS user fields),
// and `token_expires_at` is the same epoch-ms format `storeToken()` uses,
// so the existing `getToken()` validity check works unchanged.
export default function HandoffPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const token = hashParams.get('token')
    const expiresAt = hashParams.get('expires_at')
    const userData = hashParams.get('user')

    // Optional `?redirect=...` — honored only if it's a same-origin
    // relative path, so another app can hand off onto a specific page.
    const queryParams = new URLSearchParams(window.location.search)
    const redirectParam = queryParams.get('redirect')
    const safeRedirect =
      redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
        ? redirectParam
        : null

    if (token && expiresAt) {
      localStorage.setItem('access_token', token)
      localStorage.setItem('token_expires_at', expiresAt)
      if (userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData))
          localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true')
          localStorage.setItem(STORAGE_KEYS.USER_ID, user.id)
          localStorage.setItem(STORAGE_KEYS.USER_EMAIL, user.email)
          localStorage.setItem(STORAGE_KEYS.USER_NAME, user.name)
          localStorage.setItem(STORAGE_KEYS.USER_TYPE, user.type)
          localStorage.setItem(STORAGE_KEYS.USER_STATUS, user.status)
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
        } catch {
          /* ignore — malformed user payload, token alone still signs them in */
        }
      }
      window.location.href = safeRedirect || ROUTES.MARKETPLACE
    } else {
      window.location.href = ROUTES.LOGIN
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
    </div>
  )
}
