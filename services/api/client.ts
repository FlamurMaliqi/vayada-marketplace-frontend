/**
 * API client configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiError {
  detail: string | Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

export class ApiErrorResponse extends Error {
  status: number
  data: ApiError

  constructor(status: number, data: ApiError) {
    super(data.detail as string || `API Error: ${status}`)
    this.name = 'ApiErrorResponse'
    this.status = status
    this.data = data
  }
}

export class ApiClient {
  private baseURL: string
  private TOKEN_KEY = 'access_token'
  private EXPIRES_AT_KEY = 'token_expires_at'

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Get JWT token from localStorage if not expired
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null

    const token = localStorage.getItem(this.TOKEN_KEY)
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY)

    if (!token || !expiresAt) return null

    // Check if token is expired
    if (Date.now() >= parseInt(expiresAt)) {
      this.clearToken()
      return null
    }

    return token
  }

  /**
   * Clear token from localStorage
   */
  private clearToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.EXPIRES_AT_KEY)
  }

  /**
   * Handle 401 errors (token expired/invalid)
   */
  private handleUnauthorized(error: ApiErrorResponse): void {
    this.clearToken()
    
    if (typeof window !== 'undefined') {
      const errorMessage = error.data.detail as string || ''
      const isExpired = errorMessage.includes('expired') || errorMessage.includes('Expired')
      
      if (isExpired) {
        window.location.href = '/login?expired=true'
      } else {
        window.location.href = '/login'
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get token for authenticated requests (skip for auth endpoints)
    const token = !endpoint.startsWith('/auth/') ? this.getToken() : null
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)
      
      const data = await response.json()
      
      if (!response.ok) {
        const error = new ApiErrorResponse(response.status, data as ApiError)
        
        // Handle 401 errors (token expired/invalid)
        // Skip redirect for auth endpoints (login/register) - let them handle errors
        if (response.status === 401 && !endpoint.startsWith('/auth/')) {
          this.handleUnauthorized(error)
        }
        
        throw error
      }

      return data as T
    } catch (error) {
      if (error instanceof ApiErrorResponse) {
        throw error
      }
      console.error('API request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Upload file(s) using multipart/form-data
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get token for authenticated requests
    const token = !endpoint.startsWith('/auth/') ? this.getToken() : null
    
    const headers: Record<string, string> = {
      // Don't set Content-Type for FormData - browser will set it with boundary
      ...(options?.headers as Record<string, string>),
    }

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const config: RequestInit = {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    }

    try {
      const response = await fetch(url, config)
      
      const data = await response.json()
      
      if (!response.ok) {
        const error = new ApiErrorResponse(response.status, data as ApiError)
        
        // Handle 401 errors (token expired/invalid)
        // Skip redirect for auth endpoints (login/register) - let them handle errors
        if (response.status === 401 && !endpoint.startsWith('/auth/')) {
          this.handleUnauthorized(error)
        }
        
        throw error
      }

      return data as T
    } catch (error) {
      if (error instanceof ApiErrorResponse) {
        throw error
      }
      console.error('API upload failed:', error)
      throw error
    }
  }
}

export const apiClient = new ApiClient()

