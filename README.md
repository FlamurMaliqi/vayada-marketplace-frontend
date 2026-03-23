# vayada Creator Marketplace

A transparent marketplace connecting hotels with travel creators and influencers for authentic collaborations.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

The project follows a clean, modular architecture for easy maintenance and scalability.

```
vayada-creator-marketplace/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
│
├── components/             # React components
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── landing/            # Landing page components
│
├── lib/                    # Shared libraries
│   ├── types/              # TypeScript types
│   ├── constants/          # Application constants
│   └── utils/              # Utility functions
│
├── hooks/                  # Custom React hooks
├── services/               # Business logic & API services
│   ├── api/                # API services
│   └── auth/               # Authentication services
│
├── config/                 # Configuration files
└── styles/                 # Global styles
```

For detailed structure documentation, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## Features

- **Landing Page**: Beautiful, modern landing page with sections for hotels and creators
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Built with Tailwind CSS for a clean, professional look
- **TypeScript**: Type-safe development

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **React 18**: UI library
- **Heroicons**: Icon library
- **clsx & tailwind-merge**: Class name utilities

## Deployment

The project is ready to deploy to Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click Deploy!

Your site will be live in minutes! 🚀

## Next Steps

- Authentication system
- User profiles (hotels and creators)
- Discovery and filtering
- Collaboration request system
- Admin dashboard

