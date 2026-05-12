import { Navigation, Footer } from '@/components/layout'
import {
  Hero,
  TrustedBy,
  ProblemSection,
  SolutionSection,
  PlatformSection,
  PricingSection,
  PartnerProgram,
  FinalCTA,
} from '@/components/landing'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <TrustedBy />
      <ProblemSection />
      <SolutionSection />
      <PlatformSection />
      <PricingSection />
      <PartnerProgram />
      <FinalCTA />
      <Footer />
    </main>
  )
}
