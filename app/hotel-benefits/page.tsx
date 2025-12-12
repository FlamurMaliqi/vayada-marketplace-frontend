"use client"

import Link from "next/link"
import { Navigation, Footer } from "@/components/layout"
import { Button } from "@/components/ui"
import { ROUTES } from "@/lib/constants/routes"
import {
  CheckIcon,
  FolderIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import { useState } from "react"

export default function HotelBenefitsPage() {
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
                  Stop DM Chaos.
                  <br />
                  Start driving <span className="text-primary-600">direct bookings.</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Join the free marketplace where you discover, vet, and manage creator partnerships in one centralized hub.
                  End the inbox chaos and find verified creators who match your target audience.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`${ROUTES.SIGNUP}?type=hotel`}>
                    <Button
                      variant="primary"
                      size="md"
                      className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl"
                    >
                      Register Hotel for Free
                    </Button>
                  </Link>
                  <Link href={ROUTES.CREATOR_BENEFITS}>
                    <Button
                      variant="outline"
                      size="md"
                      className="bg-white text-gray-800 border border-gray-200 hover:border-primary-200 hover:text-primary-700"
                    >
                      See Creator Profiles
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="rounded-2xl overflow-hidden shadow-xl bg-white max-w-md w-full">
                  <img src="/hotel-hero.JPG" alt="Hotel with pool and sea view" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature bar */}
        <section className="bg-[#f5f5f7] border-t border-b border-gray-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-700 text-sm md:text-base">
              {["100% Free to Join", "Verified Creator Data", "Centralized Dashboard", "Two-Way Reviews"].map((item) => (
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">The vayada hotel advantage</h2>
              <p className="text-base md:text-lg text-gray-600 mt-3">Three pillars that transform how you manage creator partnerships</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "Operational Control",
                  tag: "Efficiency",
                  description: "Gain full control over your creator partnerships. All inquiries, applications, and messages are centralized in one dashboard.",
                  footnote: "Stop drowning in fragmented DMs and scattered requests across platforms.",
                  Icon: FolderIcon,
                },
                {
                  title: "Data-Driven Vetting",
                  tag: "Risk Reduction",
                  description: "Access verified creator profiles with audience demographics, engagement rates, and platform metrics. Make informed decisions instantly.",
                  footnote: "Eliminate manual work chasing portfolio links and unverified stat screenshots.",
                  Icon: ShieldCheckIcon,
                },
                {
                  title: "Future Revenue Stream",
                  tag: "Future Hook",
                  description: "Build your reputation now to access the 2026 affiliate system. Cut OTA commissions and drive performance-based direct bookings.",
                  footnote: "Position for 5–6% total booking cost vs 15–20% OTA fees.",
                  Icon: ArrowTrendingUpIcon,
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
              <Link href={ROUTES.CREATOR_BENEFITS}>
                <Button
                  variant="outline"
                  size="md"
                  className="bg-white text-gray-800 border border-gray-200 hover:border-primary-300 hover:text-primary-700"
                >
                  See Creator Profiles
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
                  Verified operations
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Data Replaces DM Chaos</h2>
                <p className="text-base md:text-lg text-gray-600 mt-2">Your professional hotel dashboard works for you 24/7</p>
              </div>

              <div className="space-y-8 relative">
                {[
                  {
                    title: "Centralized Request Management",
                    description: "All creator stay inquiries are routed to a single, organized dashboard. Review, accept, or decline applications without sifting through cluttered email inboxes or scattered DMs.",
                    problem: "Drowning in Fragmented Requests: Creator inquiries arrive across email, Instagram DMs, website forms, and more.",
                    value: "Save hours weekly by managing all creator communications in one professional hub.",
                  },
                  {
                    title: "Transparent Creator Metrics",
                    description: "Access structured data including engagement rate, total reach, audience demographics, and platform breakdown. Verify creator quality at a glance.",
                    problem: "Inefficient Selection & Risk: Manually chasing portfolio links and unverified stat screenshots wastes time and increases risk.",
                    value: "Make data-driven decisions instantly. Find creators who genuinely match your target audience.",
                  },
                  {
                    title: "Creator Review System",
                    description: "Every completed collaboration results in a two-way review. Build a track record of successful partnerships that attracts higher-quality creators.",
                    problem: "Lack of Accountability: No way to verify if a creator will deliver on promises or behave professionally.",
                    value: "Reduce risk by partnering with creators who have verified positive reviews from other hotels.",
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
              <p className="text-base md:text-lg text-gray-600 mt-2">From discovery to successful partnership</p>
            </div>

            <div className="flex flex-col divide-y divide-gray-200">
              {[
                {
                  number: "01",
                  title: "Search & Filter",
                  badge: "NOW",
                  linkText: "Find the right creators for your property.",
                  description:
                    "Browse verified creator profiles filtered by audience demographics, engagement rates, platform, and content style. Find creators who match your target guest profile.",
                  Icon: MagnifyingGlassIcon,
                },
                {
                  number: "02",
                  title: "Connect & Negotiate",
                  badge: "NOW",
                  linkText: "Centralize all proposals and terms.",
                  description:
                    "Send collaboration invitations directly through the platform. Negotiate terms, define deliverables, and agree on collaboration type (free stay, paid collaboration, etc.).",
                  Icon: ChatBubbleLeftRightIcon,
                },
                {
                  number: "03",
                  title: "Manage & Approve",
                  badge: "NOW",
                  linkText: "Control scheduling and content.",
                  description:
                    "Manage booking dates, review content before publication, and maintain full control over the collaboration timeline and asset approval process.",
                  Icon: CalendarDaysIcon,
                },
                {
                  number: "04",
                  title: "Rate & Grow",
                  badge: "NOW",
                  linkText: "Build your reputation in the marketplace.",
                  description:
                    "Leave reviews for creators to help other hotels. Attract better partners over time as your property builds a strong review history and reputation.",
                  Icon: StarIcon,
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
                      <span className="text-[10px] font-semibold tracking-wide text-primary-700 bg-primary-50 px-2 py-1 rounded uppercase">
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
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to streamline your creator partnerships?</h3>
              <p className="text-base md:text-lg text-gray-600">
                Join hotels who have centralized their creator management and reduced operational chaos.
              </p>
              <div className="pt-2">
                <Link href={`${ROUTES.SIGNUP}?type=hotel`}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl px-8"
                  >
                    Register hotel for free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Performance revenue highlight */}
        <section className="bg-[#0c2140] py-18 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-4xl space-y-3">
              <span className="inline-flex items-center rounded-full bg-primary-600/20 text-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Coming 2026
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">Cut OTA Commissions. Drive Performance Revenue.</h2>
              <p className="text-base md:text-lg text-slate-200">
                Build your marketplace reputation now and gain early access to the 2026 affiliate tracking system. Replace expensive OTA fees with performance-based direct bookings.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { label: "Lower Commission Cost", value: "70%", sub: "Compared to traditional 15–20% OTA fees" },
                { label: "Total Booking Cost", value: "5–6%", sub: "Creator payout + vayada fee combined" },
                { label: "Guest Data Ownership", value: "100%", sub: "Build direct relationships, remarket commission-free" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-2xl bg-white/5 border border-white/10 px-6 py-5 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.6)]">
                  <div className="text-3xl font-bold text-primary-100">{value}</div>
                  <div className="mt-1 text-sm font-semibold text-white">{label}</div>
                  <p className="text-sm text-slate-200 mt-2">{sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  title: "Zero Risk Payouts",
                  body: "Commission is only paid after the guest has checked out. Cancellation or no-show? You pay nothing. Only pay for completed, profitable stays.",
                  highlights: [
                    { label: "Problem Solved", text: "Upfront marketing costs for bookings that cancel or no-show." },
                    { label: "Financial Impact", text: "Eliminate risk entirely. Every commission paid represents actual revenue earned." },
                  ],
                },
                {
                  title: "Transparent Tracking",
                  body: "Every creator receives a unique, trackable link. We handle all technical tracking for accurate attribution and automated commission calculation.",
                  highlights: [
                    { label: "Problem Solved", text: "Manual tracking, disputed commissions, and complex spreadsheet management." },
                    { label: "Financial Impact", text: "Single monthly overview of all commissions. Hassle-free, automated payments." },
                  ],
                },
              ].map(({ title, body, highlights }) => (
                <div key={title} className="rounded-2xl bg-white/5 border border-white/10 px-6 py-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.6)] space-y-4">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="text-sm md:text-base text-slate-100 leading-relaxed">{body}</p>
                  <div className="space-y-3">
                    {highlights.map(({ label, text }) => (
                      <div key={label} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                        <p className="text-xs font-semibold text-primary-100">{label}</p>
                        <p className="text-sm text-slate-100 mt-1 leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="rounded-2xl bg-white/5 border border-white/10 px-6 py-5 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.6)]">
                <div className="text-sm font-semibold text-white mb-3">OTA vs vayada comparison</div>
                <div className="space-y-3 text-sm text-slate-100">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span>Traditional OTA commission</span>
                    <span className="text-red-200 font-semibold">15–20%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span>vayada total cost</span>
                    <span className="text-primary-100 font-semibold">5–6%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span>Your savings</span>
                    <span className="text-green-200 font-semibold">~70%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Guest data ownership</span>
                    <span className="text-primary-100 font-semibold">100% yours</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-200 mt-4">
                Register your hotel now and complete successful collaborations to build your reputation, guaranteeing your place in the 2026 affiliate program.
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to take control of your creator partnerships?</h2>
            <p className="text-base md:text-lg text-gray-600">
              Join the marketplace where verified data replaces inbox chaos and professional partnerships drive direct bookings.
            </p>
            <div className="pt-2">
              <Link href={`${ROUTES.SIGNUP}?type=hotel`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl px-8 inline-flex items-center gap-2"
                >
                  Register our property for free
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
      question: "Is the marketplace really free for hotels?",
      answer:
        "Yes, registering your property and accessing the creator marketplace is completely free. There are no subscription fees or hidden costs for the current Phase 1 features.",
    },
    {
      question: "How do you verify creator data?",
      answer:
        "Creators put in the data about their metrics including follower counts, engagement rates, and audience demographics. We verify it with public sources and ask for proof when our algorithm alerts.",
    },
    {
      question: "What collaboration types can I offer?",
      answer:
        "You have full flexibility: free stays, discounted rates, paid collaborations or custom packages. You define the terms and deliverables for each collaboration.",
    },
    {
      question: "Will there be commission fees in the future?",
      answer:
        "In 2026, we're launching an optional affiliate tracking system where you can offer creators a commission on direct bookings they generate. You can decide the amount, the average will be around 5%. This is far lower than the 15-20% OTA fees, and you only pay after a completed stay.",
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
