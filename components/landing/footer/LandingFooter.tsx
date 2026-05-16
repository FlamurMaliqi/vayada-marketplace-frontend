import { MARKETING_BASE_URL } from '@/lib/constants/routes'

// Home + legal pages live on the marketing site (vayada.com), not in this app.
export default function LandingFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
        <a href={MARKETING_BASE_URL} className="font-display text-base font-semibold text-primary-500">
          vayada
        </a>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} vayada. AI-powered and trust-based direct distribution for independent hospitality.
        </p>
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <a href={`${MARKETING_BASE_URL}/imprint`} className="transition-colors hover:text-ink">
            Imprint
          </a>
          <a href={`${MARKETING_BASE_URL}/privacy`} className="transition-colors hover:text-ink">
            Privacy Policy
          </a>
          <a href={`${MARKETING_BASE_URL}/terms`} className="transition-colors hover:text-ink">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
