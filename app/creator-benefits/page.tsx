"use client"

import Link from "next/link"
import { Navigation, Footer } from "@/components/layout"
import { Button } from "@/components/ui"
import { ROUTES } from "@/lib/constants/routes"
import {
  ArrowRightIcon,
  CheckIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  CameraIcon,
  StarIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline"
import { useState } from "react"

export default function CreatorBenefitsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-[#f8f8fb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
                  Stop Chasing DMs.
                  <br />
                  Start Securing{" "}
                  <span className="text-primary-600">Professional Hotel Collaborations.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Join the free marketplace where hotels find you based on verified data, ending the chaos of manual outreach and negotiation.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`${ROUTES.SIGNUP}?type=creator`}>
                    <Button
                      variant="primary"
                      size="md"
                      className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                    >
                      Apply to join the free marketplace
                      <ArrowRightIcon className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href={ROUTES.PROPERTIES}>
                    <Button
                      variant="outline"
                      size="md"
                      className="bg-white text-gray-800 border border-gray-200 hover:border-primary-200 hover:text-primary-700"
                    >
                      Browse Properties
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="rounded-2xl overflow-hidden shadow-xl bg-white max-w-md w-full">
                  <img
                    src="/creator-hero.jpg"
                    alt="Creator with camera"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature bar */}
        <section className="bg-[#f5f5f7] border-t border-b border-gray-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-700 text-sm md:text-base">
              {["100% Free to Join", "Verified Profile Data", "Direct Hotel Connections", "Fair Compensation"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-primary-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantage pillars */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#eef2ff] via-[#f8f8fb] to-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-10 top-12 h-48 w-48 rounded-full bg-primary-100/60 blur-3xl" />
            <div className="absolute right-0 bottom-10 h-56 w-56 rounded-full bg-indigo-100/50 blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">The vayada professional advantage</h2>
              <p className="text-base md:text-lg text-gray-600 mt-3">Three pillars that transform how you collaborate with hotels</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "Verified Data, Vetted Partners",
                  tag: "Credibility",
                  description:
                    "Replaces disorganized pitch decks with a transparent, verified profile showing audience demographics and 5-star hotel reviews.",
                  footnote: "Higher acceptance rate for high-quality collaborations (e.g., free stays, B&B) because hotels trust your data.",
                  Icon: ArrowTrendingUpIcon,
                },
                {
                  title: "Direct Collaboration Access",
                  tag: "Efficiency",
                  description:
                    "Discover open hotel collaborations and apply instantly. No agencies, no middlemen, just a streamlined hub. With vayada you save hours of time",
                  footnote: "You save hours of manual outreach and negotiation, focusing only on creating content.",
                  Icon: UserGroupIcon,
                },
                {
                  title: "Secure Your 2026 Revenue Stream",
                  tag: "Future Hook",
                  description:
                    "Build your reputation now to guarantee access to the future affiliate system, turning content into long-term performance income.",
                  footnote: "Positions you for the 2026 launch to earn up to 10% commission with a 30-day tracking window.",
                  Icon: CalendarDaysIcon,
                },
              ].map(({ title, tag, description, footnote, Icon }) => (
                <div
                  key={title}
                  className="bg-white/80 backdrop-blur rounded-2xl shadow-md border border-white/60 p-6 flex flex-col gap-4 transition-all duration-200 hover:border-primary-200 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm font-semibold text-primary-600 mt-1">{tag}</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">{description}</p>
                  <p className="text-gray-800 font-semibold text-sm md:text-base">→ {footnote}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link href={ROUTES.PROPERTIES}>
                <Button
                  variant="outline"
                  size="md"
                  className="bg-white text-gray-800 border border-gray-200 hover:border-primary-300 hover:text-primary-700 inline-flex items-center gap-2"
                >
                  Browse Properties
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Data replaces DM chaos */}
        <section className="bg-white pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-gray-100 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] bg-gradient-to-br from-white via-white to-indigo-50/30 p-8 md:p-10">
              <div className="absolute -left-10 top-0 h-full w-24 bg-primary-50/70 blur-2xl" />
              <div className="text-left mb-8 relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Professional profile
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Data Replaces DM Chaos</h2>
                <p className="text-base md:text-lg text-gray-600 mt-2">Your professional creator profile works for you 24/7</p>
              </div>

              <div className="space-y-8 relative">
                {[
                  {
                    title: "Verified Data Profile",
                    description:
                      "Your profile displays verified audience demographics and engagement rates across all your platforms. This is the professional standard hotels demand.",
                    problem: "Inefficient Selection & Risk: Hotels can't verify quality. You stop being judged solely on follower count or manual screenshots.",
                    value: "Hotels trust and find you faster, leading to a higher acceptance rate for quality collaborations (e.g., free stays).",
                  },
                  {
                    title: "Hotel Review History",
                    description:
                      "Every successful collaboration results in a rating and review from the hotel. This builds your public, professional track record and credibility within the industry.",
                    problem: "Lack of Credibility: You move from being a one-off requester to a vetted, reliable partner.",
                    value: "Excellent reviews provide negotiation power for securing better terms on future collaborations.",
                  },
                ].map(({ title, description, problem, value }) => (
                  <div
                    key={title}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 transition transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h3>
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">{description}</p>
                    </div>
                    <div className="flex flex-col gap-4 lg:w-80">
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-[0_6px_18px_-12px_rgba(248,113,113,0.9)]">
                        <p className="text-sm font-semibold text-red-700">Problem Solved</p>
                        <p className="text-sm text-red-800 mt-1 leading-relaxed">{problem}</p>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 shadow-[0_6px_18px_-12px_rgba(79,70,229,0.4)]">
                        <p className="text-sm font-semibold text-indigo-700">Immediate Value</p>
                        <p className="text-sm text-indigo-800 mt-1 leading-relaxed">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4-step journey */}
        <section className="bg-[#f8f8fb] py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">The Simple 4-Step Journey</h2>
              <p className="text-base md:text-lg text-gray-600 mt-2">From collaboration to credibility</p>
            </div>

            <div className="flex flex-col divide-y divide-gray-200">
              {[
                {
                  number: "01",
                  title: "Discover & Partner",
                  badge: "NOW",
                  linkText: "Find your next dream property in one centralized hub.",
                  description:
                    "Browse verified hotel listings, see their exact collaboration offerings (e.g., Free Stay - 3 nights), and apply instantly via the centralized marketplace.",
                  Icon: MagnifyingGlassIcon,
                },
                {
                  number: "02",
                  title: "Create & Captivate",
                  badge: "NOW",
                  linkText: "Focus on authentic content that truly inspires travel.",
                  description:
                    "Focus on producing high-quality content. Once the collaboration is complete, the hotel reviews your professionalism on your profile.",
                  Icon: CameraIcon,
                },
                {
                  number: "03",
                  title: "Build your Track Record",
                  badge: "NOW",
                  linkText: "Establish your professional reputation.",
                  description:
                    "Your profile gains verifiable reviews (e.g., 4.8 stars, 12 reviews) that give you leverage for better future partnerships and terms.",
                  Icon: StarIcon,
                },
                {
                  number: "04",
                  title: "Position for Payouts",
                  badge: "FUTURE",
                  linkText: "Secure your place in the 2026 earning model.",
                  description:
                    "By building a strong track record today, you secure access to the 2026 performance-based earning model to generate transparent, automated income.",
                  Icon: CurrencyDollarIcon,
                },
              ].map(({ number, title, badge, linkText, description, Icon }) => (
                <div key={number} className="py-7 md:py-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                  <div className="flex items-center gap-3 md:gap-4 min-w-[90px]">
                    <span className="text-3xl md:text-4xl font-bold text-[#c7cdf6]">{number}</span>
                    <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h3>
                      <span
                        className={`text-[10px] font-semibold tracking-wide px-2 py-1 rounded uppercase ${
                          badge === "NOW"
                            ? "text-primary-700 bg-primary-50"
                            : "text-gray-700 bg-gray-100"
                        }`}
                      >
                        {badge}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-primary-700">{linkText}</p>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white pt-20 md:pt-24 pb-24 md:pb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-primary-100 bg-[#f4f5ff] px-6 py-10 md:px-12 md:py-14 shadow-[0_20px_60px_-40px_rgba(59,130,246,0.35)] text-center space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to start your journey?</h3>
              <p className="text-base md:text-lg text-gray-600">
                Join thousands of creators who have professionalized their hotel partnerships
              </p>
              <div className="pt-2">
                <Link href={`${ROUTES.SIGNUP}?type=creator`}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl px-8 inline-flex items-center gap-2"
                  >
                    Apply to join free
                    <ArrowRightIcon className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Performance revenue highlight */}
        <section className="bg-[#0c2140] py-18 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-4xl space-y-4">
              <span className="inline-flex items-center rounded-full bg-primary-600/20 text-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Coming 2026
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Build Your Reputation Now. Earn Commission Later.
              </h2>
              <p className="text-base md:text-lg text-slate-200">
                While the marketplace today focuses on high-quality collaborations and building credibility, we are laying the foundation for your long-term, passive income. In 2026, vayada launches its integrated affiliate tracking system.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { label: "Average Commission Rate", value: "5%", sub: "On every direct booking generated through your unique tracking link (up to 10%)." },
                { label: "Day Tracking Window", value: "30", sub: "Your influence has a longer shelf life. Secure commissions even if guests book weeks later." },
                { label: "Long-Term Partnerships", value: "∞", sub: "Move from one-off stays to revenue-sharing partnerships with hotels." },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-2xl bg-white/5 border border-white/10 px-6 py-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.6)]">
                  <div className="text-5xl md:text-6xl font-extrabold text-primary-400 mb-2">{value}</div>
                  <div className="mt-2 text-base font-bold text-white">{label}</div>
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">{sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  title: "30-Day Tracking Window",
                  body: "Unlike single-session links, vayada will guarantee you earn commission on any direct booking made up to 30 days after your audience clicks your unique link.",
                  highlights: [
                    { label: "Problem Solved", text: "The frustration of lost revenue when followers research, click, and book weeks later." },
                    { label: "Financial Impact", text: "Maximizes your future earning potential, ensuring your content's influence is rewarded for a full month." },
                  ],
                },
                {
                  title: "Transparent Payouts",
                  body: "Commissions will be tracked automatically and paid directly through the hotel's integrated PMS system. No chasing invoices or manual spreadsheets.",
                  highlights: [
                    { label: "Problem Solved", text: "Eliminates the friction, distrust, and administrative burden of ensuring timely payment." },
                    { label: "Financial Impact", text: "Ensures timely, automated, and transparent income, treating you like a true business partner." },
                  ],
                },
              ].map(({ title, body, highlights }) => (
                <div key={title} className="rounded-2xl bg-white/5 border border-white/10 px-6 py-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.6)] space-y-5">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
                  <p className="text-sm md:text-base text-slate-200 leading-relaxed">{body}</p>
                  <div className="space-y-3">
                    {highlights.map(({ label, text }) => (
                      <div key={label} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                        <p className="text-sm font-bold text-primary-400 mb-1">{label}</p>
                        <p className="text-sm text-slate-200 mt-1 leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <div className="rounded-2xl bg-white/5 border border-white/10 px-6 py-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.6)] max-w-md">
                <div className="text-lg font-bold text-white mb-5">Example Earnings (5% Commission)</div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-slate-300">Average Booking Value</span>
                    <span className="text-white font-bold">€600</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-slate-300">Monthly Bookings Converted</span>
                    <span className="text-white font-bold">28 bookings</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-slate-300">Monthly Commission Income</span>
                    <span className="text-white font-bold">€840</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-300">Annual Potential Income</span>
                    <span className="text-2xl font-extrabold text-primary-400">€10,080</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-200 mt-4">
                Join the free marketplace now and complete successful collaborations to earn strong hotel reviews, guaranteeing your place in the 2026 performance model.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-base md:text-lg text-gray-600 mt-2">Everything you need to know about joining vayada</p>
            </div>

            <FAQAccordion />
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#f8f8fb] py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ready to Professionalize Your Influence?
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Join the marketplace where your verified data opens doors to premium hotel partnerships and sustainable income.
            </p>
            <div className="pt-2">
              <Link href={`${ROUTES.SIGNUP}?type=creator`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl px-8 inline-flex items-center gap-2"
                >
                  Apply to Join the Free Marketplace
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Is the marketplace free for creators?",
      answer:
        "Yes, joining the vayada marketplace and applying for collaborations is completely free. There are no hidden fees or subscriptions.",
    },
    {
      question: "What kind of collaborations can I apply for?",
      answer:
        "Hotels offer various collaboration types including free stays, B&B arrangements, and discounted rates. Each listing clearly shows what's being offered so you can apply to opportunities that match your content style.",
    },
    {
      question: "How do hotels evaluate my profile?",
      answer:
        "Hotels review your verified data profile which displays your audience demographics, engagement rates, and review history from past collaborations. This professional presentation helps you stand out from generic DM requests.",
    },
    {
      question: "Will I be able to earn commission in the future?",
      answer:
        "Yes! In 2026, vayada is launching an integrated affiliate tracking system where you can earn up to 10% commission on direct bookings with a 30-day tracking window. Build your reputation now to be first in line.",
    },
  ]

  return (
    <div className="space-y-0">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full py-5 flex items-center justify-between text-left hover:text-primary-600 transition-colors"
            >
              <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
              {isOpen ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="pb-5 pl-0">
                <p className="text-base text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
