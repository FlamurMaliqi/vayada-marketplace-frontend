export const siteConfig = {
  name: 'Vayada',
  description: 'A transparent marketplace connecting hotels with verified travel influencers for authentic collaborations.',
  url: 'https://vayada.com',
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
        { label: 'How It Works', href: '#hotels' },
        { label: 'Sign Up', href: '/signup?type=hotel' },
        { label: 'Benefits', href: '/pricing' },
      ],
      creators: [
        { label: 'How It Works', href: '#creators' },
        { label: 'Sign Up', href: '/signup?type=creator' },
        { label: 'Benefits', href: '/creators/benefits' },
      ],
      company: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ],
    },
  },
} as const

