'use client'

import { useState } from 'react'
import { CheckIcon, XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { PlatformIcon } from '@/components/ui/icons'
import type { PendingRequest, PlatformInfo } from './types'

interface PendingApplicationsListProps {
  requests: PendingRequest[]
  userType: string | null
  onViewDetails: (id: string) => void
  onAccept: (id: string) => void
  onDecline: (id: string) => void
}

export function PendingApplicationsList({
  requests,
  userType,
  onViewDetails,
  onAccept,
  onDecline,
}: PendingApplicationsListProps) {
  const [applicationsTab, setApplicationsTab] = useState<'received' | 'sent'>('received')

  const receivedCount = requests.filter((r) => r.isReceived).length
  const sentCount = requests.filter((r) => !r.isReceived).length
  const filteredRequests = requests.filter((r) =>
    applicationsTab === 'received' ? r.isReceived : !r.isReceived
  )

  return (
    <div className="border-b-4 border-gray-50">
      <div className="px-4 py-3 flex items-center justify-between bg-gray-50/50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">
            New Applications
          </span>
        </div>
        <span className="bg-blue-600/10 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-600/20">
          {requests.length} total
        </span>
      </div>

      {/* Sub-tabs for Received/Sent */}
      <div className="px-3 py-2 bg-white border-b border-gray-100 flex gap-2">
        <button
          onClick={() => setApplicationsTab('received')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
            applicationsTab === 'received'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          Received
          <span
            className={`px-1.5 py-0.5 rounded-md text-[9px] ${
              applicationsTab === 'received' ? 'bg-white/20' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {receivedCount}
          </span>
        </button>
        <button
          onClick={() => setApplicationsTab('sent')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
            applicationsTab === 'sent'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          Sent
          <span
            className={`px-1.5 py-0.5 rounded-md text-[9px] ${
              applicationsTab === 'sent' ? 'bg-white/20' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {sentCount}
          </span>
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="p-3 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => onViewDetails(request.id)}
            >
              <div className="flex items-center gap-3">
                {request.avatarUrl ? (
                  <img
                    src={request.avatarUrl}
                    alt={request.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${request.avatarColor}`}
                  >
                    {request.initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <h4 className="text-sm font-semibold text-gray-900 leading-none">
                      {request.name}
                    </h4>
                    <span className="text-[10px] text-gray-400">{request.time}</span>
                  </div>
                  {userType === 'hotel' ? (
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium leading-none">
                      <span>{request.followers}</span>
                      <span>•</span>
                      <span>{request.engagement}</span>
                      <div className="flex items-center gap-1">
                        {request.platforms && request.platforms.length > 0 ? (
                          request.platforms.map((p: PlatformInfo) => (
                            <PlatformIcon
                              key={p.name}
                              platform={(p.name || p.platform || '').toLowerCase()}
                              className="w-3 h-3 text-gray-400"
                            />
                          ))
                        ) : (
                          <PlatformIcon
                            platform={request.followersPlatform}
                            className="w-3 h-3 text-gray-400"
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium leading-none">
                      {request.location && (
                        <>
                          <MapPinIcon className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[120px]">{request.location}</span>
                        </>
                      )}
                      {request.collaborationType && request.offerDetails && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-blue-600">
                            {request.offerDetails}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {request.isReceived ? (
                    <>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm"
                        title="Accept"
                        onClick={(e) => {
                          e.stopPropagation()
                          onAccept(request.id)
                        }}
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl transition-colors shadow-sm"
                        title="Decline"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDecline(request.id)
                        }}
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 italic whitespace-nowrap">
                        Waiting for {userType === 'hotel' ? 'Creator' : 'Hotel'} response
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white">
            <p className="text-xs font-medium text-gray-400 italic">
              No {applicationsTab} applications found
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
