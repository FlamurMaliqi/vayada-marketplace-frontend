'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import type { CollaborationResponse } from '@/services/api/collaborations'
import { CalendarEventModal } from './CalendarEventModal'
import { AddCollaborationModal } from './AddCollaborationModal'
import { AddTripModal } from './AddTripModal'

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const MONTH_NAMES_FULL = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface YearlyCalendarProps {
    collaborations?: CollaborationResponse[]
    onViewDetails: (id: string) => void
    userType?: 'hotel' | 'creator'
}

export function YearlyCalendar({ collaborations = [], onViewDetails, userType = 'hotel' }: YearlyCalendarProps) {
    const [year, setYear] = useState(2026)
    const [month, setMonth] = useState(0) // 0-11
    const [view, setView] = useState<'month' | 'year'>('year')
    const [selectedCollaboration, setSelectedCollaboration] = useState<CollaborationResponse | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isTripModalOpen, setIsTripModalOpen] = useState(false)

    const getDaysInMonth = (monthIndex: number, year: number) => {
        return new Date(year, monthIndex + 1, 0).getDate()
    }

    const handlePrev = () => {
        if (view === 'year') {
            setYear(year - 1)
        } else {
            if (month === 0) {
                setMonth(11)
                setYear(year - 1)
            } else {
                setMonth(month - 1)
            }
        }
    }

    const handleNext = () => {
        if (view === 'year') {
            setYear(year + 1)
        } else {
            if (month === 11) {
                setMonth(0)
                setYear(year + 1)
            } else {
                setMonth(month + 1)
            }
        }
    }

    const renderMonthlyGrid = () => {
        const daysInCurrentMonth = getDaysInMonth(month, year)
        const firstDayOfWeek = new Date(year, month, 1).getDay() // 0 = Sun

        // Create grid slots
        const slots = []

        // Empty slots for previous month
        for (let i = 0; i < firstDayOfWeek; i++) {
            slots.push(<div key={`empty-start-${i}`} className="min-h-[120px] bg-gray-50/20 border border-gray-100 rounded-lg"></div>)
        }

        // Days for current month
        for (let d = 1; d <= daysInCurrentMonth; d++) {
            slots.push(
                <div key={d} className="min-h-[120px] bg-white border border-gray-100 p-2 relative rounded-lg hover:border-gray-200 transition-colors">
                    <span className="text-sm font-medium text-gray-700 block mb-2">{d}</span>
                </div>
            )
        }

        // Fill remaining slots to force grid structure if needed (optional)
        return slots
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {userType === 'creator' ? 'My Calendar' : 'Collaboration Calendar'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {userType === 'creator' ? 'Manage your trips and collaborations' : 'View all creator collaborations for the year'}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="bg-gray-100 p-1 rounded-lg flex items-center text-sm font-medium">
                        <button
                            onClick={() => setView('month')}
                            className={`px-3 py-1.5 rounded-md transition-all ${view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setView('year')}
                            className={`px-3 py-1.5 rounded-md transition-all ${view === 'year' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Year
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button
                            onClick={handlePrev}
                            className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 hover:text-gray-900"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-gray-900 min-w-[3rem] text-center whitespace-nowrap px-2">
                            {view === 'year' ? year : `${MONTHS[month]} ${year}`}
                        </span>
                        <button
                            onClick={handleNext}
                            className="p-1 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500 hover:text-gray-900"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Legend & Actions Row */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-gray-600">
                    <span className="text-gray-400">Status:</span>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#64748b]"></span>
                        <span>Negotiating</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span>Staying</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0fb981]"></span>
                        <span>Campaign Active</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {userType === 'creator' && (
                        <button
                            onClick={() => setIsTripModalOpen(true)}
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-gray-200 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plane h-4 w-4"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>
                            Add Trip
                        </button>
                    )}
                    <button
                        onClick={() => userType === 'creator' ? setIsAddModalOpen(true) : null}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                        {userType === 'creator' ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-4 h-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                Add Collaboration
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>
                                Add External Creator
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* VIEW: YEARLY */}
            {view === 'year' && (
                <div className="overflow-x-auto pb-4">
                    <div className="min-w-[1000px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-[80px_1fr] border-b border-gray-100">
                            <div className="p-3"></div>
                            <div className="grid" style={{ gridTemplateColumns: 'repeat(31, minmax(0, 1fr))' }}>
                                {DAYS.map(day => (
                                    <div key={day} className="text-[10px] text-gray-400 text-center py-2 font-medium">
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Months Rows */}
                        <div className="divide-y divide-gray-50">
                            {MONTHS.map((monthName, monthIndex) => {
                                const daysInMonth = getDaysInMonth(monthIndex, year)
                                return (
                                    <div key={monthName} className="grid grid-cols-[80px_1fr] group hover:bg-gray-50/50 transition-colors">
                                        <div className="p-3 text-xs font-semibold text-gray-600 flex items-center border-r border-gray-50 group-hover:border-gray-100 transition-colors">
                                            {monthName}
                                        </div>
                                        <div className="grid divide-x divide-gray-50 border-r border-gray-50" style={{ gridTemplateColumns: 'repeat(31, minmax(0, 1fr))' }}>
                                            {DAYS.map(day => {
                                                const isValidDate = day <= daysInMonth

                                                // Create date for this cell (local time)
                                                const cellDate = new Date(year, monthIndex, day)

                                                // Format as YYYY-MM-DD for comparison
                                                const yearStr = cellDate.getFullYear()
                                                const monthStr = String(cellDate.getMonth() + 1).padStart(2, '0')
                                                const dayStr = String(cellDate.getDate()).padStart(2, '0')
                                                const currentDateStr = `${yearStr}-${monthStr}-${dayStr}`

                                                // Find active collaboration for this day
                                                const activeCollab = isValidDate ? collaborations.find(c => {
                                                    // Get date strings (assuming YYYY-MM-DD or ISO)
                                                    let startStr = c.travel_date_from || c.preferred_date_from
                                                    let endStr = c.travel_date_to || c.preferred_date_to

                                                    if (!startStr || !endStr) return false

                                                    // Extract YYYY-MM-DD part
                                                    startStr = startStr.split('T')[0]
                                                    endStr = endStr.split('T')[0]

                                                    return currentDateStr >= startStr && currentDateStr <= endStr
                                                }) : null

                                                // Determine visuals
                                                let isStart = false
                                                let isEnd = false
                                                let colorClass = ''

                                                if (activeCollab) {
                                                    let startStr = activeCollab.travel_date_from || activeCollab.preferred_date_from
                                                    let endStr = activeCollab.travel_date_to || activeCollab.preferred_date_to

                                                    if (startStr) startStr = startStr.split('T')[0]
                                                    if (endStr) endStr = endStr.split('T')[0]

                                                    isStart = currentDateStr === startStr
                                                    isEnd = currentDateStr === endStr

                                                    if (activeCollab.status === 'pending') colorClass = 'bg-[#64748b]'
                                                    else if (activeCollab.status === 'accepted') colorClass = 'bg-blue-500'
                                                    else if (activeCollab.status === 'completed') colorClass = 'bg-[#0fb981]'
                                                    else colorClass = 'bg-gray-400'
                                                }

                                                return (
                                                    <div
                                                        key={day}
                                                        className={`h-12 relative flex items-center justify-center transition-colors
                              ${!isValidDate ? 'bg-gray-50/30 pattern-diagonal-lines' : ''}
                              ${isValidDate && !activeCollab ? 'hover:bg-gray-100/50' : ''}
                            `}
                                                        style={{ zIndex: isStart ? 10 : 1 }}
                                                    >
                                                        {!isValidDate && <div className="w-full h-full bg-gray-50 opacity-50" />}

                                                        {activeCollab && (
                                                            <div
                                                                onClick={() => setSelectedCollaboration(activeCollab)}
                                                                className={`h-8 w-full flex items-center px-2 cursor-pointer hover:brightness-95 transition-all
                                                                    ${colorClass} text-white shadow-sm shrink-0
                                                                    ${isStart ? 'rounded-l-md ml-1' : ''}
                                                                    ${isEnd ? 'rounded-r-md mr-1' : ''}
                                                                    ${!isStart && !isEnd ? 'rounded-none min-w-[calc(100%+1px)] -ml-[1px]' : ''} 
                                                                    ${isStart ? 'overflow-visible' : 'overflow-hidden'}
                                                                `}
                                                                title={`${userType === 'creator' ? activeCollab.hotel_name : activeCollab.creator_name} - ${activeCollab.status}`}
                                                            >
                                                                {isStart && (
                                                                    <div className="flex items-center gap-2 min-w-max relative z-20">
                                                                        {userType === 'creator' ? (
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 h-4 w-4 text-white/80"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                                                                        ) : (
                                                                            activeCollab.creator_profile_picture ? (
                                                                                <img
                                                                                    src={activeCollab.creator_profile_picture}
                                                                                    alt=""
                                                                                    className="w-5 h-5 rounded-full border border-white/30 object-cover"
                                                                                />
                                                                            ) : (
                                                                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold">
                                                                                    {activeCollab.creator_name.charAt(0)}
                                                                                </div>
                                                                            )
                                                                        )}
                                                                        <span className="text-xs font-medium whitespace-nowrap drop-shadow-sm">
                                                                            {userType === 'creator' ? activeCollab.hotel_name : activeCollab.creator_name}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: MONTHLY */}
            {view === 'month' && (
                <div className="w-full">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {renderMonthlyGrid()}
                    </div>
                </div>
            )}

            {!collaborations.length && (
                <div className="text-center py-8 text-xs text-gray-300 border-t border-gray-100 mt-4">
                    No collaborations found for {view === 'year' ? year : `${MONTHS[month]} ${year}`}
                </div>
            )}

            <CalendarEventModal
                isOpen={!!selectedCollaboration}
                onClose={() => setSelectedCollaboration(null)}
                collaboration={selectedCollaboration}
                onViewDetails={onViewDetails}
                userType={userType}
            />

            <AddCollaborationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <AddTripModal
                isOpen={isTripModalOpen}
                onClose={() => setIsTripModalOpen(false)}
            />
        </div>
    )
}
