export const siteConfig = {
  name: 'Vayada',
  description: 'A transparent marketplace connecting hotels with verified travel influencers for authentic collaborations.',
  url: 'https://vayada.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/vayada',
    github: 'https://github.com/vayada',
  },
  branding: {
    colors: {
      primary: {
        50: '#EFF2FF',
        100: '#DFE5FF',
        200: '#BFCBFF',
        300: '#9FB1FF',
        400: '#5F7FFF',
        500: '#2F52F5',
        600: '#1E3EDB',
        700: '#162FB8',
        800: '#0F2095',
        900: '#081172',
      },
    },
  },
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

