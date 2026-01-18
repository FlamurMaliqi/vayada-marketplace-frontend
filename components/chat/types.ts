/**
 * Chat-related type definitions
 */

export interface PlatformInfo {
  name: string
  platform?: string
}

export interface PendingRequest {
  id: string
  name: string
  time: string
  followers: string
  followersPlatform: string
  engagement: string
  engagementPlatform: string
  platforms: PlatformInfo[]
  location: string
  collaborationType: string
  offerDetails: string
  avatarColor: string
  avatarUrl: string | null | undefined
  initials: string
  isReceived: boolean
  status: string
}
