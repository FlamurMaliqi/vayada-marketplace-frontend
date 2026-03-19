/**
 * Trip and External Collaboration API service
 */
import { apiClient } from './client'

export interface TripResponse {
  id: string
  creator_id: string
  name: string
  location: string | null
  start_date: string
  end_date: string
  notes: string | null
  created_at: string
  updated_at: string
  external_collaborations: ExternalCollaborationResponse[]
}

export interface ExternalCollaborationResponse {
  id: string
  creator_id: string
  trip_id: string | null
  title: string
  hotel_name: string | null
  location: string | null
  collaboration_type: string | null
  start_date: string
  end_date: string
  deliverables: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateTripRequest {
  name: string
  location?: string
  start_date: string
  end_date: string
  notes?: string
}

export interface UpdateTripRequest {
  name?: string
  location?: string
  start_date?: string
  end_date?: string
  notes?: string
}

export interface CreateExternalCollaborationRequest {
  trip_id?: string
  title: string
  hotel_name?: string
  location?: string
  collaboration_type?: 'Custom / External' | 'Paid' | 'Free Stay'
  start_date: string
  end_date: string
  deliverables?: string
  notes?: string
}

export interface UpdateExternalCollaborationRequest {
  trip_id?: string
  title?: string
  hotel_name?: string
  location?: string
  collaboration_type?: 'Custom / External' | 'Paid' | 'Free Stay'
  start_date?: string
  end_date?: string
  deliverables?: string
  notes?: string
}

export const tripService = {
  /**
   * Create a new trip
   */
  createTrip: async (data: CreateTripRequest): Promise<TripResponse> => {
    return apiClient.post<TripResponse>('/trips', data)
  },

  /**
   * List all trips for the current creator
   */
  listTrips: async (): Promise<TripResponse[]> => {
    return apiClient.get<TripResponse[]>('/trips')
  },

  /**
   * Get a trip by ID
   */
  getTrip: async (tripId: string): Promise<TripResponse> => {
    return apiClient.get<TripResponse>(`/trips/${tripId}`)
  },

  /**
   * Update a trip
   */
  updateTrip: async (tripId: string, data: UpdateTripRequest): Promise<TripResponse> => {
    return apiClient.put<TripResponse>(`/trips/${tripId}`, data)
  },

  /**
   * Delete a trip
   */
  deleteTrip: async (tripId: string): Promise<void> => {
    return apiClient.delete<void>(`/trips/${tripId}`)
  },

  /**
   * Create an external collaboration
   */
  createExternalCollaboration: async (data: CreateExternalCollaborationRequest): Promise<ExternalCollaborationResponse> => {
    return apiClient.post<ExternalCollaborationResponse>('/trips/external-collaborations', data)
  },

  /**
   * List all external collaborations for the current creator
   */
  listExternalCollaborations: async (): Promise<ExternalCollaborationResponse[]> => {
    return apiClient.get<ExternalCollaborationResponse[]>('/trips/external-collaborations')
  },

  /**
   * Update an external collaboration
   */
  updateExternalCollaboration: async (collabId: string, data: UpdateExternalCollaborationRequest): Promise<ExternalCollaborationResponse> => {
    return apiClient.put<ExternalCollaborationResponse>(`/trips/external-collaborations/${collabId}`, data)
  },

  /**
   * Delete an external collaboration
   */
  deleteExternalCollaboration: async (collabId: string): Promise<void> => {
    return apiClient.delete<void>(`/trips/external-collaborations/${collabId}`)
  },
}
