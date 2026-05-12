import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

export default function LandingFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
        <Link href={ROUTES.HOME} className="font-display text-base font-semibold text-primary-500">
          vayada
        </Link>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} vayada. AI-powered and trust-based direct distribution for independent hospitality.
        </p>
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <Link href={ROUTES.IMPRINT} className="transition-colors hover:text-ink">
            Imprint
          </Link>
          <Link href={ROUTES.PRIVACY} className="transition-colors hover:text-ink">
            Privacy Policy
          </Link>
          <Link href={ROUTES.TERMS} className="transition-colors hover:text-ink">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
