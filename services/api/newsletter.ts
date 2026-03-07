/**
 * Newsletter preferences API service
 */

import { apiClient } from './client'

export interface NewsletterPreferences {
  enabled: boolean
  country_filter: string[] | null
}

export interface UpdateNewsletterPreferencesRequest {
  enabled?: boolean
  country_filter?: string[] | null
}

export const newsletterService = {
  getPreferences: async (): Promise<NewsletterPreferences> => {
    return apiClient.get<NewsletterPreferences>('/newsletter/preferences')
  },

  updatePreferences: async (data: UpdateNewsletterPreferencesRequest): Promise<NewsletterPreferences> => {
    return apiClient.put<NewsletterPreferences>('/newsletter/preferences', data)
  },
}
