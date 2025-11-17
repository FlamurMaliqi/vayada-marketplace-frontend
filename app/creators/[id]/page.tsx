'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthenticatedNavigation, Footer } from '@/components/layout'
import { Button, Input, Textarea } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import type { Creator } from '@/lib/types'
import { formatNumber } from '@/lib/utils'
import {
  MapPinIcon,
  CheckBadgeIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  ChartBarIcon,
  EnvelopeIcon,
  LinkIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function CreatorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [requestForm, setRequestForm] = useState({
    message: '',
    proposedDates: '',
    collaborationType: '',
  })

  useEffect(() => {
    loadCreator()
  }, [params.id])

  const loadCreator = () => {
    const creatorId = Array.isArray(params.id) ? params.id[0] : params.id
    if (!creatorId) return
    
    setLoading(true)
    // Hardcoded mock data for frontend design
    setTimeout(() => {
      setCreator(getMockCreator(creatorId))
      setLoading(false)
    }, 300)
  }

  const handleRequestCollaboration = () => {
    if (!creator) return

    setRequesting(true)

    // Simulate collaboration request (frontend design only)
    setTimeout(() => {
      setRequesting(false)
      setShowRequestModal(false)
      // Reset form
      setRequestForm({ message: '', proposedDates: '', collaborationType: '' })
      // Redirect to collaborations page after a short delay
      setTimeout(() => {
        router.push(ROUTES.COLLABORATIONS)
      }, 500)
    }, 1000)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRequestForm(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Creator not found</h1>
          <Link href={ROUTES.MARKETPLACE}>
            <Button variant="primary">Back to Marketplace</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const totalFollowers = creator.platforms.reduce(
    (sum, platform) => sum + platform.followers,
    0
  )
  const avgEngagementRate =
    creator.platforms.reduce((sum, platform) => sum + platform.engagementRate, 0) /
    creator.platforms.length

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Marketplace
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start gap-6 mb-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                {creator.name.charAt(0)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900">{creator.name}</h1>
                  {creator.status === 'verified' && (
                    <div className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
                      <CheckBadgeIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span className="text-lg">{creator.location}</span>
                </div>

                {/* Niche Tags */}
                {creator.niche && creator.niche.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {creator.niche.map((niche, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full font-medium"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowRequestModal(true)}
                  >
                    Request Collaboration
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <UserGroupIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatNumber(totalFollowers)}
                  </div>
                  <div className="text-sm text-gray-600">Total Followers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ChartBarIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {avgEngagementRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg. Engagement</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <LinkIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {creator.platforms.length}
                  </div>
                  <div className="text-sm text-gray-600">Platforms</div>
                </div>
              </div>
            </div>

            {/* Platforms Detail */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platforms & Reach</h2>
              <div className="space-y-4">
                {creator.platforms.map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {platform.name}
                        </h3>
                        <span className="text-sm text-gray-500">@{platform.handle}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Followers</div>
                          <div className="text-lg font-bold text-gray-900">
                            {formatNumber(platform.followers)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Engagement Rate</div>
                          <div className="text-lg font-bold text-gray-900">
                            {platform.engagementRate.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  {creator.name} is a verified travel creator specializing in{' '}
                  {creator.niche.join(', ').toLowerCase()}. With a combined reach of{' '}
                  {formatNumber(totalFollowers)} followers across{' '}
                  {creator.platforms.length} platforms, they create authentic content
                  that resonates with their audience.
                </p>
                <p>
                  This creator is verified and ready to collaborate with hotels and
                  travel brands. They focus on creating genuine, engaging content that
                  showcases unique travel experiences and destinations.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Reach</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(totalFollowers)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Engagement Rate</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {avgEngagementRate.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="text-gray-900 font-medium">{creator.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className="text-gray-900 font-medium capitalize">{creator.status}</div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <EnvelopeIcon className="w-5 h-5" />
                  Send Message
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  Request Collaboration
                </button>
              </div>
            </div>

            {/* Similar Creators */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Explore More</h3>
              <Link href={ROUTES.MARKETPLACE}>
                <Button variant="outline" size="md" className="w-full">
                  Browse All Creators
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 rounded-t-3xl flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Request Collaboration</h2>
                <p className="text-primary-100 mt-1">Send a collaboration request to {creator?.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowRequestModal(false)
                  setRequestForm({ message: '', proposedDates: '', collaborationType: '' })
                }}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleRequestCollaboration()
              }}
              className="p-8 space-y-6"
            >
              {/* Collaboration Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Collaboration Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="collaborationType"
                  value={requestForm.collaborationType}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select collaboration type</option>
                  <option value="content-creation">Content Creation</option>
                  <option value="social-media">Social Media Promotion</option>
                  <option value="blog-post">Blog Post</option>
                  <option value="video-production">Video Production</option>
                  <option value="photography">Photography</option>
                  <option value="influencer-stay">Influencer Stay</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Proposed Dates */}
              <div>
                <Input
                  label="Proposed Dates"
                  name="proposedDates"
                  type="text"
                  value={requestForm.proposedDates}
                  onChange={handleFormChange}
                  placeholder="e.g., March 15-20, 2024 or Flexible"
                  helperText="When would you like to collaborate?"
                />
              </div>

              {/* Message */}
              <div>
                <Textarea
                  label="Message"
                  name="message"
                  value={requestForm.message}
                  onChange={handleFormChange}
                  required
                  rows={6}
                  placeholder="Tell the creator about your collaboration idea, what you can offer, and your expectations..."
                  helperText="Describe your collaboration proposal in detail"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setShowRequestModal(false)
                    setRequestForm({ message: '', proposedDates: '', collaborationType: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  isLoading={requesting}
                  disabled={requesting}
                >
                  {requesting ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

// Mock data for development
function getMockCreator(id: string): Creator {
  const mockCreators: Record<string, Creator> = {
    '1': {
      id: '1',
      name: 'Sarah Travels',
      niche: ['Luxury Travel', 'Beach Destinations'],
      platforms: [
        { name: 'Instagram', handle: '@sarahtravels', followers: 125000, engagementRate: 4.2 },
        { name: 'YouTube', handle: '@sarahtravels', followers: 45000, engagementRate: 6.8 },
        { name: 'TikTok', handle: '@sarahtravels', followers: 89000, engagementRate: 8.5 },
      ],
      audienceSize: 259000,
      location: 'Bali, Indonesia',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    '2': {
      id: '2',
      name: 'Adventure Mike',
      niche: ['Adventure Travel', 'Mountain Sports'],
      platforms: [
        { name: 'Instagram', handle: '@adventuremike', followers: 89000, engagementRate: 5.1 },
        { name: 'TikTok', handle: '@adventuremike', followers: 120000, engagementRate: 8.5 },
        { name: 'YouTube', handle: '@adventuremike', followers: 67000, engagementRate: 7.2 },
      ],
      audienceSize: 276000,
      location: 'Swiss Alps, Switzerland',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    '3': {
      id: '3',
      name: 'Tokyo Explorer',
      niche: ['City Travel', 'Food & Culture'],
      platforms: [
        { name: 'Instagram', handle: '@tokyoexplorer', followers: 156000, engagementRate: 4.8 },
        { name: 'Blog', handle: 'tokyoexplorer.com', followers: 25000, engagementRate: 3.2 },
      ],
      audienceSize: 181000,
      location: 'Tokyo, Japan',
      status: 'verified',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }
  return mockCreators[id] || mockCreators['1']
}

