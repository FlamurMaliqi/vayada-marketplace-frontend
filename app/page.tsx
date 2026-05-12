import { Navigation } from '@/components/layout'
import {
  Hero,
  TrustedBy,
  ProblemSection,
  SolutionSection,
  PlatformSection,
  PricingSection,
  PartnerProgram,
  FinalCTA,
  LandingFooter,
} from '@/components/landing'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Navigation />
      <Hero />
      <TrustedBy />
      <ProblemSection />
      <SolutionSection />
      <PlatformSection />
      <PricingSection />
      <PartnerProgram />
      <FinalCTA />
      <LandingFooter />
    </main>
  )
}
