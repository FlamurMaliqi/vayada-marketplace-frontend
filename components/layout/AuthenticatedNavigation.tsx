'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { authService } from '@/services/auth'
import {
  BuildingStorefrontIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  UserIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'

// Context for sidebar collapsed state
const SidebarContext = createContext<{
  isCollapsed: boolean
  toggleSidebar: () => void
}>({
  isCollapsed: true,
  toggleSidebar: () => {},
})

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
      icon: BuildingStorefrontIcon,
    },
    {
      href: ROUTES.COLLABORATIONS,
      label: 'Collaborations',
      icon: UserGroupIcon,
    },
    {
      href: ROUTES.PROFILE,
      label: 'My Profile',
      icon: UserIcon,
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
          style={{ left: '256px' }} // 64 * 4 = 256px (w-64)
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar - Hidden on small screens when collapsed, visible when expanded or on larger screens */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-primary-800 flex-col z-50 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isCollapsed 
            ? 'hidden md:flex' // Hidden on small screens when collapsed, visible on larger screens
            : 'flex' // Always visible when expanded
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center font-medium transition-all duration-200 ${
                  isCollapsed ? 'justify-center px-3 py-3 rounded-lg' : 'gap-3 px-4 py-3 rounded-lg'
                } ${
                  active
                    ? 'bg-primary-700 text-white'
                    : 'text-white/80 hover:text-white hover:bg-primary-700/50'
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
        <div className="mt-auto p-4 border-t border-primary-700/50">
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-lg font-medium text-white/80 hover:text-white hover:bg-primary-700/50 transition-all duration-200 w-full ${
              isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3 justify-start'
            }`}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Top Header - Visible on all screen sizes */}
      <header className={`fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 transition-all duration-300 ${
        isCollapsed ? 'md:pl-20' : 'md:pl-64'
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

          {/* Logo - Centered */}
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

