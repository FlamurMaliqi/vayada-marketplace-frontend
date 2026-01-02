'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedNavigation } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { YearlyCalendar } from '@/components/calendar/YearlyCalendar'
import { collaborationService, transformCollaborationResponse, type CollaborationResponse } from '@/services/api/collaborations'
import { CollaborationRequestDetailModal } from '@/components/marketplace/CollaborationRequestDetailModal'
import type { Collaboration, Hotel, Creator } from '@/lib/types'

function CalendarPageContent() {
    const { isCollapsed } = useSidebar()
    const [collaborations, setCollaborations] = useState<CollaborationResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [detailCollaboration, setDetailCollaboration] = useState<(Collaboration & { hotel?: Hotel; creator?: Creator }) | null>(null)
    const [userType, setUserType] = useState<'hotel' | 'creator'>('hotel')

    useEffect(() => {
        const storedUserType = localStorage.getItem('userType') as 'hotel' | 'creator'
        if (storedUserType) {
            setUserType(storedUserType)
        }

        const fetchCollaborations = async () => {
            try {
                let data: CollaborationResponse[] = []
                if (storedUserType === 'creator') {
                    data = await collaborationService.getCreatorCollaborations()
                } else {
                    data = await collaborationService.getHotelCollaborations()
                }
                setCollaborations(data)
            } catch (error) {
                console.error('Failed to fetch collaborations:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCollaborations()
    }, [])

    const handleViewDetails = async (id: string) => {
        try {
            const detailResponse = userType === 'creator'
                ? await collaborationService.getCreatorCollaborationDetails(id)
                : await collaborationService.getHotelCollaborationDetails(id)
            const detailedCollaboration = transformCollaborationResponse(detailResponse)
            setDetailCollaboration(detailedCollaboration)
        } catch (error) {
            console.error('Error fetching collaboration details:', error)
        }
    }

    const handleAccept = async (id: string) => {
        try {
            await collaborationService.respondToCollaboration(id, { status: 'accepted' })
            handleViewDetails(id)
            // Optionally refresh the full list
        } catch (error) {
            console.error('Failed to accept collaboration:', error)
        }
    }

    const handleDecline = async (id: string) => {
        try {
            await collaborationService.respondToCollaboration(id, { status: 'declined' })
            handleViewDetails(id)
        } catch (error) {
            console.error('Failed to decline collaboration:', error)
        }
    }

    const handleApprove = async (id: string) => {
        try {
            await collaborationService.approveCollaboration(id)
            handleViewDetails(id)
        } catch (error) {
            console.error('Failed to approve collaboration:', error)
        }
    }

    return (
        <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>
            <AuthenticatedNavigation />
            <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-16' : 'md:pl-56'} pt-16`}>
                <div className="w-full pt-8 pb-8 px-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[600px] bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <YearlyCalendar
                            collaborations={collaborations}
                            onViewDetails={handleViewDetails}
                            userType={userType}
                        />
                    )}
                </div>
            </div>

            <CollaborationRequestDetailModal
                isOpen={!!detailCollaboration}
                onClose={() => setDetailCollaboration(null)}
                collaboration={detailCollaboration}
                currentUserType={userType}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onApprove={handleApprove}
            />
        </main>
    )
}

export default function CalendarPage() {
    return <CalendarPageContent />
}
