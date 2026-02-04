'use client'

import { useState } from 'react'
import {
  PencilSquareIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserIcon,
  MapPinIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'
import { PlatformBadge, AvatarSimple } from '@/components/ui'
import { getStatusClasses } from '@/lib/constants'
import { formatCompactNumber } from '@/lib/utils'
import type { DetailedCollaboration, ConversationResponse, PlatformDeliverablesItem, PlatformDeliverable } from '@/services/api/collaborations'

interface ChatDetailsPanelProps {
  activeChat: ConversationResponse
  activeCollaboration: DetailedCollaboration
  userType: string | null
  onToggleDeliverable: (deliverableId: string) => void
  onSuggestChanges: () => void
  onApproveTerms: () => void
}

export function ChatDetailsPanel({
  activeChat,
  activeCollaboration,
  userType,
  onToggleDeliverable,
  onSuggestChanges,
  onApproveTerms,
}: ChatDetailsPanelProps) {
  const [isEditingSidebar, setIsEditingSidebar] = useState(false)
  const [localCollaboration, setLocalCollaboration] = useState<DetailedCollaboration | null>(null)

  // Flatten deliverables for display
  const flatDeliverables =
    activeCollaboration?.platformDeliverables?.flatMap((pd: PlatformDeliverablesItem) =>
      pd.deliverables.map((d: PlatformDeliverable) => {
        const platformName = pd.platform.toLowerCase()
        const typeLower = d.type.toLowerCase()
        const displayType = typeLower.includes(platformName) ? d.type : `${pd.platform} ${d.type}`

        return {
          id: d.id,
          type: displayType,
          count: d.quantity,
          completed: d.status === 'completed',
        }
      })
    ) || []

  const stayDetails = {
    checkIn:
      activeCollaboration?.travelDateFrom || activeCollaboration?.preferredDateFrom || 'TBD',
    checkOut: activeCollaboration?.travelDateTo || activeCollaboration?.preferredDateTo || 'TBD',
  }

  // Calculate progress
  const totalDeliverables = flatDeliverables.length
  const completedCount = flatDeliverables.filter((d) => d.completed).length
  const progressPercentage = totalDeliverables > 0 ? (completedCount / totalDeliverables) * 100 : 0

  // Get offer display value
  const getOfferValue = () => {
    const collab = isEditingSidebar && localCollaboration ? localCollaboration : activeCollaboration
    if (collab.collaborationType === 'Free Stay') {
      return `${collab.freeStayMaxNights || '?'} Nights`
    } else if (collab.collaborationType === 'Paid') {
      return `$${collab.paidAmount || '?'}`
    } else if (collab.collaborationType === 'Discount') {
      return `${collab.discountPercentage || '?'}% Off`
    }
    return '-'
  }

  return (
    <div className="w-[350px] flex flex-col h-full bg-white flex-shrink-0 border-l border-gray-100">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Collaboration Details
            </h3>
            <div className="flex items-center gap-2">
              {isEditingSidebar ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditingSidebar(false)
                      setLocalCollaboration(null)
                    }}
                    className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingSidebar(false)
                      setLocalCollaboration(null)
                    }}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase transition-colors"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setLocalCollaboration(activeCollaboration)
                    setIsEditingSidebar(true)
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase transition-all"
                >
                  <PencilSquareIcon className="w-3 h-3" /> Edit
                </button>
              )}
            </div>
          </div>

          {/* Partner Info */}
          <div className="flex items-center gap-3 mb-2">
            <AvatarSimple
              src={activeChat.partner_avatar}
              name={activeChat.partner_name}
              size="lg"
              variant="blue"
            />
            <div>
              <h2 className="font-bold text-gray-900">{activeChat.partner_name}</h2>
              {activeCollaboration.listingName && (
                <p className="text-[10px] text-gray-400 font-medium">
                  {userType === 'hotel' ? 'Applied to:' : 'Property:'}{' '}
                  <span className="text-blue-600">{activeCollaboration.listingName}</span>
                </p>
              )}
            </div>
            <span
              className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getStatusClasses(activeChat.collaboration_status)}`}
            >
              {activeChat.collaboration_status}
            </span>
          </div>

          {/* Partner Stats */}
          {userType === 'creator' ? (
            // Show Hotel Stats when creator is signed in
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <h4 className="text-xs font-bold text-gray-900 uppercase">Hotel Details</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {activeCollaboration.hotel?.name && (
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Property</div>
                    <div className="text-sm font-bold text-gray-900">
                      {activeCollaboration.hotel.name}
                    </div>
                  </div>
                )}
                {activeCollaboration.listingLocation && (
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Location</div>
                    <div className="text-sm font-medium text-gray-900">
                      {activeCollaboration.listingLocation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Show Creator Stats when hotel is signed in
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase">Creator Stats</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Followers</div>
                    <div className="text-sm font-bold text-gray-900">
                      {formatCompactNumber(activeCollaboration.creator?.audienceSize)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase">Engagement</div>
                    <div className="text-sm font-bold text-gray-900">
                      {(activeCollaboration.creator?.avgEngagementRate || 0).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeCollaboration.creator?.platforms?.map((p) => (
                    <PlatformBadge key={p.name} platform={(p.name || 'platform').toLowerCase()} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Collaboration Terms */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BanknotesIcon className="w-4 h-4 text-gray-400" />
              <h4 className="text-xs font-bold text-gray-900 uppercase">Collaboration Terms</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Type</div>
                <div className="text-sm font-bold text-gray-900">
                  {activeCollaboration.collaborationType || '-'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Value</div>
                <div className="text-sm font-bold text-blue-600">{getOfferValue()}</div>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <h4 className="text-xs font-bold text-gray-900 uppercase">Stay Details</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Check-in</div>
                <div className="text-sm font-medium text-gray-900">{stayDetails.checkIn}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Check-out</div>
                <div className="text-sm font-medium text-gray-900">{stayDetails.checkOut}</div>
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                <h4 className="text-xs font-bold text-gray-900 uppercase">Deliverables</h4>
              </div>
              <div className="text-[10px] font-bold text-gray-400">
                {completedCount}/{totalDeliverables} complete
              </div>
            </div>
            {totalDeliverables > 0 && (
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            )}
            <div className="space-y-2">
              {flatDeliverables.map((d) => (
                <div
                  key={d.id}
                  onClick={() => onToggleDeliverable(d.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                    d.completed
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                      : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        d.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300 group-hover:border-blue-400'
                      }`}
                    >
                      {d.completed && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${d.completed ? 'line-through opacity-60' : ''}`}
                    >
                      {d.type}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      d.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    ×{d.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {activeChat.collaboration_status.toLowerCase() === 'negotiating' && (
        <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
          <button
            onClick={onSuggestChanges}
            className="flex-1 py-2.5 px-4 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Suggest Changes
          </button>
          <button
            onClick={onApproveTerms}
            className="flex-1 py-2.5 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Approve Terms
          </button>
        </div>
      )}
    </div>
  )
}
