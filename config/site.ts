import { MARKETING_BASE_URL } from '@/lib/constants/routes'

// This is the authenticated app (app.vayada.com). Signup lives here; the
// "How It Works" / Benefits / About / Contact destinations are marketing
// pages on the marketing site (vayada.com).
export const siteConfig = {
  name: 'vayada',
  description: 'A transparent marketplace connecting hotels with verified travel influencers for authentic collaborations.',
  url: 'https://app.vayada.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/vayada',
    github: 'https://github.com/vayada',
    instagram: 'https://www.instagram.com/glorioushotels/',
    linkedin: 'https://linkedin.com/company/vayada',
    whatsapp: 'https://wa.me/your-number',
  },
  // Note: Colors are now centralized in tailwind.config.js
  // Use Tailwind classes: primary-500, success-500, warning-500, error-500, info-500
  hero: {
    title: 'Where hotels and creators connect',
    subtitle: 'A transparent marketplace that replaces agencies and middlemen. Hotels and creators collaborate directly, building authentic partnerships that drive real results.',
    cta: {
      hotel: {
        text: "I'm a Hotel",
        href: '/signup?type=hotel',
      },
      creator: {
        text: "I'm a Creator",
        href: '/signup?type=creator',
      },
    },
  },
  footer: {
    description: 'Connecting hotels with travel creators for authentic collaborations.',
    links: {
      hotels: [
        { label: 'How It Works', href: `${MARKETING_BASE_URL}/#hotels` },
        { label: 'Sign Up', href: '/signup?type=hotel' },
        { label: 'Benefits', href: `${MARKETING_BASE_URL}/pricing` },
      ],
      creators: [
        { label: 'How It Works', href: `${MARKETING_BASE_URL}/#creators` },
        { label: 'Sign Up', href: '/signup?type=creator' },
        { label: 'Benefits', href: `${MARKETING_BASE_URL}/creator-benefits` },
      ],
      company: [
        { label: 'About', href: `${MARKETING_BASE_URL}/about` },
        { label: 'Contact', href: `${MARKETING_BASE_URL}/contact` }
      ],
    },
  },
} as const
