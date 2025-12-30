import React, { useState } from 'react'
import {
    XMarkIcon,
    CalendarIcon,
    DocumentTextIcon,
    PlusIcon,
    MinusIcon,
    TrashIcon
} from '@heroicons/react/24/outline'

interface Deliverable {
    id?: string
    type: string
    quantity: number
}

interface PlatformDeliverables {
    platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook'
    deliverables: Deliverable[]
}

interface SuggestChangesModalProps {
    isOpen: boolean
    onClose: () => void
    initialCheckIn: string
    initialCheckOut: string
    initialPlatformDeliverables: PlatformDeliverables[]
    onSubmit: (data: { travel_date_from: string, travel_date_to: string, platform_deliverables: PlatformDeliverables[] }) => void
}

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Facebook'] as const

export default function SuggestChangesModal({
    isOpen,
    onClose,
    initialCheckIn,
    initialCheckOut,
    initialPlatformDeliverables,
    onSubmit
}: SuggestChangesModalProps) {
    const [checkIn, setCheckIn] = useState(initialCheckIn)
    const [checkOut, setCheckOut] = useState(initialCheckOut)
    const [platformDeliverables, setPlatformDeliverables] = useState<PlatformDeliverables[]>(
        initialPlatformDeliverables.length > 0
            ? JSON.parse(JSON.stringify(initialPlatformDeliverables)) // Deep clone for local editing
            : [{ platform: 'Instagram', deliverables: [{ type: '', quantity: 1 }] }]
    )

    if (!isOpen) return null

    const handlePlatformChange = (index: number, platform: any) => {
        const next = [...platformDeliverables]
        next[index].platform = platform
        setPlatformDeliverables(next)
    }

    const handleDeliverableChange = (pIndex: number, dIndex: number, field: keyof Deliverable, value: any) => {
        const next = [...platformDeliverables]
        const deliverable = next[pIndex].deliverables[dIndex] as any
        deliverable[field] = value
        setPlatformDeliverables(next)
    }

    const addPlatform = () => {
        setPlatformDeliverables([...platformDeliverables, { platform: 'Instagram', deliverables: [{ type: '', quantity: 1 }] }])
    }

    const removePlatform = (index: number) => {
        setPlatformDeliverables(platformDeliverables.filter((_, i) => i !== index))
    }

    const addDeliverable = (pIndex: number) => {
        const next = [...platformDeliverables]
        next[pIndex].deliverables.push({ type: '', quantity: 1 })
        setPlatformDeliverables(next)
    }

    const removeDeliverable = (pIndex: number, dIndex: number) => {
        const next = [...platformDeliverables]
        next[pIndex].deliverables = next[pIndex].deliverables.filter((_, i) => i !== dIndex)
        if (next[pIndex].deliverables.length === 0) {
            setPlatformDeliverables(platformDeliverables.filter((_, i) => i !== pIndex))
        } else {
            setPlatformDeliverables(next)
        }
    }

    const adjustQuantity = (pIndex: number, dIndex: number, delta: number) => {
        const next = [...platformDeliverables]
        const current = next[pIndex].deliverables[dIndex].quantity
        next[pIndex].deliverables[dIndex].quantity = Math.max(1, current + delta)
        setPlatformDeliverables(next)
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-[550px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Suggest Changes</h2>
                        <p className="text-sm text-gray-500 mt-1">Proposal for negotiation</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
                    {/* Stay Dates */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900">Stay Dates</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Check-in</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Check-out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                    <DocumentTextIcon className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900">Deliverables</h3>
                            </div>
                            <button
                                onClick={addPlatform}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-all shadow-sm"
                            >
                                <PlusIcon className="w-3.5 h-3.5" /> Add Platform
                            </button>
                        </div>

                        <div className="space-y-6">
                            {platformDeliverables.map((pd, pIndex) => (
                                <div key={pIndex} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 max-w-[150px]">
                                            <select
                                                value={pd.platform}
                                                onChange={(e) => handlePlatformChange(pIndex, e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                                            >
                                                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => addDeliverable(pIndex)}
                                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase"
                                            >
                                                + Add Deliverable
                                            </button>
                                            <button onClick={() => removePlatform(pIndex)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {pd.deliverables.map((d, dIndex) => (
                                            <div key={dIndex} className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={d.type}
                                                    onChange={(e) => handleDeliverableChange(pIndex, dIndex, 'type', e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-all font-medium"
                                                    placeholder="e.g. Stories with link"
                                                />
                                                <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-2 py-1.5">
                                                    <button onClick={() => adjustQuantity(pIndex, dIndex, -1)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                                        <MinusIcon className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-bold text-gray-900 min-w-[16px] text-center">{d.quantity}</span>
                                                    <button onClick={() => adjustQuantity(pIndex, dIndex, 1)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                                        <PlusIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeDeliverable(pIndex, dIndex)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit({
                            travel_date_from: checkIn,
                            travel_date_to: checkOut,
                            platform_deliverables: platformDeliverables
                        })}
                        className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
                    >
                        Send Counter-Offer
                    </button>
                </div>
            </div>
        </div>
    )
}
