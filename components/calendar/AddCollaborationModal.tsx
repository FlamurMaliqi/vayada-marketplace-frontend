'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { tripService } from '@/services/api/trips'
import type { TripResponse, ExternalCollaborationResponse } from '@/services/api/trips'

interface AddCollaborationModalProps {
    isOpen: boolean
    onClose: () => void
    onCollaborationCreated?: (collab: ExternalCollaborationResponse) => void
}

export function AddCollaborationModal({ isOpen, onClose, onCollaborationCreated }: AddCollaborationModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        tripId: '',
        hotelName: '',
        location: '',
        startDate: '',
        endDate: '',
        deliverables: '',
        notes: ''
    })

    const [trips, setTrips] = useState<TripResponse[]>([])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isOpen) {
            tripService.listTrips().then(setTrips).catch(() => {})
        }
    }, [isOpen])

    if (!isOpen) return null

    const resetForm = () => {
        setFormData({ title: '', tripId: '', hotelName: '', location: '', startDate: '', endDate: '', deliverables: '', notes: '' })
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            const collab = await tripService.createExternalCollaboration({
                title: formData.title,
                trip_id: formData.tripId || undefined,
                hotel_name: formData.hotelName || undefined,
                location: formData.location || undefined,
                start_date: formData.startDate,
                end_date: formData.endDate,
                deliverables: formData.deliverables || undefined,
                notes: formData.notes || undefined,
            })

            onCollaborationCreated?.(collab)
            resetForm()
            onClose()
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create collaboration'
            setError(message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="relative z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-10 overflow-y-auto pointer-events-none">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg pointer-events-auto">
                        <div className="absolute right-0 top-0 pr-4 pt-4">
                            <button
                                type="button"
                                className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
                                onClick={onClose}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 h-6 w-6 text-gray-900"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                                <h3 className="text-xl font-bold text-gray-900">Add Collaboration</h3>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Collaboration Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                                        Collaboration Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                                        placeholder="e.g., Hotel Partnership"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                {/* Link to Trip */}
                                <div>
                                    <label htmlFor="tripId" className="block text-sm font-semibold text-gray-700 mb-1">
                                        Link to Trip (optional)
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="tripId"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none bg-white text-gray-700"
                                            value={formData.tripId}
                                            onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                                        >
                                            <option value="">Select a trip to link</option>
                                            {trips.map((trip) => (
                                                <option key={trip.id} value={trip.id}>
                                                    {trip.name}{trip.location ? ` — ${trip.location}` : ''} ({trip.start_date} to {trip.end_date})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Hotel/Property Name */}
                                <div>
                                    <label htmlFor="hotelName" className="block text-sm font-semibold text-gray-700 mb-1">
                                        Hotel/Property Name
                                    </label>
                                    <input
                                        type="text"
                                        id="hotelName"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                                        placeholder="e.g., Grand Hotel"
                                        value={formData.hotelName}
                                        onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                                        placeholder="e.g., Paris, France"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-1">
                                            Start Date *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                id="startDate"
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-700"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-1">
                                            End Date *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                id="endDate"
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-700"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Deliverables */}
                                <div>
                                    <label htmlFor="deliverables" className="block text-sm font-semibold text-gray-700 mb-1">
                                        Deliverables (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        id="deliverables"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                                        placeholder="e.g., 3 Reels, 5 Stories"
                                        value={formData.deliverables}
                                        onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400 resize-none"
                                        placeholder="Add any additional notes..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Add Collaboration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
