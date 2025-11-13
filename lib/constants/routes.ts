/**
 * Application routes
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  MARKETPLACE: '/marketplace',
  COLLABORATIONS: '/collaborations',
  ABOUT: '/about',
  CONTACT: '/contact',
  BLOG: '/blog',
  PRICING: '/pricing',
  
  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  
  // Hotel routes
  HOTEL_DASHBOARD: '/hotel/dashboard',
  HOTEL_PROFILE: '/hotel/profile',
  HOTEL_CREATORS: '/hotel/creators',
  HOTEL_COLLABORATIONS: '/hotel/collaborations',
  HOTEL_SETTINGS: '/hotel/settings',
  
  // Creator routes
  CREATOR_DASHBOARD: '/creator/dashboard',
  CREATOR_PROFILE: '/creator/profile',
  CREATOR_HOTELS: '/creator/hotels',
  CREATOR_COLLABORATIONS: '/creator/collaborations',
  CREATOR_SETTINGS: '/creator/settings',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_VERIFICATIONS: '/admin/verifications',
  ADMIN_SETTINGS: '/admin/settings',
} as const

