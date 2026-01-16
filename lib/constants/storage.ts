/**
 * Centralized localStorage keys to prevent typos and ensure consistency.
 */
export const STORAGE_KEYS = {
  // Auth state
  IS_LOGGED_IN: 'isLoggedIn',
  USER_ID: 'userId',
  USER_EMAIL: 'userEmail',
  USER_NAME: 'userName',
  USER_TYPE: 'userType',
  USER_STATUS: 'userStatus',
  USER: 'user',

  // Profile state
  PROFILE_COMPLETE: 'profileComplete',
  HAS_PROFILE: 'hasProfile',

  // UI state
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
