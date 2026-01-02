'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { authService } from '@/services/auth'
import {
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'

// Context for sidebar collapsed state
const SidebarContext = createContext<{
  isCollapsed: boolean
  toggleSidebar: () => void
}>({
  isCollapsed: true,
  toggleSidebar: () => { },
})

const HotelCustomIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
)

const ProfileCustomIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const CalendarCustomIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
)

const MessageCustomIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
)

export const useSidebar = () => useContext(SidebarContext)

export default function AuthenticatedNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved))
    } else {
      // Default to collapsed if no saved preference
      setIsCollapsed(true)
    }
  }, [])

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = () => {
    authService.logout()
    // authService.logout() already redirects to /login, so no need to push here
  }

  const isActive = (path: string) => pathname === path

  const navLinks = [
    {
      href: ROUTES.MARKETPLACE,
      label: 'Marketplace',
      icon: HotelCustomIcon,
    },
    {
      href: ROUTES.CALENDAR,
      label: 'Calendar',
      icon: CalendarCustomIcon,
    },
    {
      href: ROUTES.CHAT,
      label: 'Messages',
      icon: MessageCustomIcon,
    },
    {
      href: ROUTES.COLLABORATIONS,
      label: 'Collaborations',
      icon: UserGroupIcon,
    },
    {
      href: ROUTES.PROFILE,
      label: 'My Profile',
      icon: ProfileCustomIcon,
    },
  ]

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {/* Backdrop overlay when sidebar is expanded on mobile - click to collapse */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Transparent backdrop for desktop when sidebar is expanded - click to collapse */}
      {!isCollapsed && (
        <div
          className="hidden md:block fixed inset-0 z-30"
          style={{ left: '224px' }} // 56 * 4 = 224px (w-56)
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - Hidden on small screens when collapsed, visible when expanded or on larger screens */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 flex-col z-50 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'
          } ${isCollapsed
            ? 'hidden md:flex' // Hidden on small screens when collapsed, visible on larger screens
            : 'flex' // Always visible when expanded
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <Link
            href={ROUTES.MARKETPLACE}
            className="flex items-center justify-center transition-opacity hover:opacity-80"
          >
            <Image
              src="/vayada-logo-navbar.png"
              alt="vayada"
              width={isCollapsed ? 32 : 110}
              height={32}
              className={`object-contain transition-all duration-300 ${isCollapsed ? 'w-8 h-8' : 'h-8 w-auto'}`}
              priority
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center font-medium transition-all duration-200 ${isCollapsed ? 'justify-center px-2 py-3 rounded-lg' : 'gap-2 px-3 py-3 rounded-lg'
                  } ${active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                title={isCollapsed ? link.label : undefined}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button - Bottom Left */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-lg font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 w-full ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3 justify-start'
              }`}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Top Header - Visible on all screen sizes */}
      <header className={`fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 transition-all duration-300 ${isCollapsed ? 'md:pl-16' : 'md:pl-56'
        }`}>
        <div className="flex items-center justify-between h-full w-full px-6">
          {/* Toggle Button - Left - Hidden when sidebar is expanded */}
          {isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-all duration-200"
              title="Expand sidebar"
            >
              <ViewColumnsIcon className="w-5 h-5" />
            </button>
          )}

          {/* Logo - Centered - Visible on all screens */}
          <Link
            href={ROUTES.MARKETPLACE}
            className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            vayada
          </Link>
        </div>
      </header>
    </SidebarContext.Provider>
  )
}

