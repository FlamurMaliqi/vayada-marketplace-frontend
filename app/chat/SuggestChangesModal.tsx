import React, { useState } from 'react'
import {
    XMarkIcon,
    CalendarIcon,
    DocumentTextIcon,
    PlusIcon,
    MinusIcon
} from '@heroicons/react/24/outline'

interface Deliverable {
    id: number
    type: string
    count: number
}

interface SuggestChangesModalProps {
    isOpen: boolean
    onClose: () => void
    initialCheckIn: string
    initialCheckOut: string
    initialDeliverables: Deliverable[]
    onSubmit: (data: any) => void
}

export default function SuggestChangesModal({
    isOpen,
    onClose,
    initialCheckIn,
    initialCheckOut,
    initialDeliverables,
    onSubmit
}: SuggestChangesModalProps) {
    const [checkIn, setCheckIn] = useState(initialCheckIn)
    const [checkOut, setCheckOut] = useState(initialCheckOut)
    const [deliverables, setDeliverables] = useState<Deliverable[]>(initialDeliverables)

    if (!isOpen) return null

    const handleDeliverableChange = (id: number, field: keyof Deliverable, value: string | number) => {
        setDeliverables(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d))
    }

    const incrementCount = (id: number) => {
        setDeliverables(prev => prev.map(d => d.id === id ? { ...d, count: d.count + 1 } : d))
    }

    const decrementCount = (id: number) => {
        setDeliverables(prev => prev.map(d => d.id === id && d.count > 0 ? { ...d, count: d.count - 1 } : d))
    }

    const removeDeliverable = (id: number) => {
        setDeliverables(prev => prev.filter(d => d.id !== id))
    }

    const addDeliverable = () => {
        const newId = Math.max(...deliverables.map(d => d.id), 0) + 1
        setDeliverables([...deliverables, { id: newId, type: '', count: 1 }])
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-[500px] shadow-xl transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">Suggest Changes</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 pt-2 space-y-6">
                    {/* Stay Dates */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <CalendarIcon className="w-4 h-4 text-gray-900" />
                            <h3 className="font-bold text-sm text-gray-900">Stay Dates</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Check-in</label>
                                <input
                                    type="text"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Check-out</label>
                                <input
                                    type="text"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <DocumentTextIcon className="w-4 h-4 text-gray-900" />
                                <h3 className="font-bold text-sm text-gray-900">Deliverables</h3>
                            </div>
                            <button
                                onClick={addDeliverable}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                            >
                                <PlusIcon className="w-3 h-3" /> Add
                            </button>
                        </div>

                        <div className="space-y-3">
                            {deliverables.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-1 rounded-lg">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={item.type}
                                            onChange={(e) => handleDeliverableChange(item.id, 'type', e.target.value)}
                                            className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            placeholder="e.g. Instagram Reels"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => decrementCount(item.id)}
                                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-bold text-gray-900 w-4 text-center">{item.count}</span>
                                        <button
                                            onClick={() => incrementCount(item.id)}
                                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeDeliverable(item.id)}
                                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 ml-2 transition-colors"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 pt-2">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit({ checkIn, checkOut, deliverables })}
                        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Send Counter-Offer
                    </button>
                </div>
            </div>
        </div>
    )
}
