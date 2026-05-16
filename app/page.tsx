import { redirect } from 'next/navigation'

// This app is the authenticated creator marketplace, served at app.vayada.com.
// The public marketing site is a separate deployment at vayada.com
// (the `vayada-landing` repo). Hitting the bare app domain just sends
// visitors to sign in; marketing lives on its own host.
export default function Home() {
  redirect('/login')
}
