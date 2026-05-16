import { redirect } from 'next/navigation'

// The public marketing/landing site now lives in the `vayada-landing` repo.
// This app is the authenticated creator marketplace, so its root just sends
// visitors to sign in.
//
// Phase 3 / domain cutover: once the marketing site has its own host, point
// this redirect at the marketing domain instead of `/login`.
export default function Home() {
  redirect('/login')
}
