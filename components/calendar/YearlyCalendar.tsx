'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline'

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
    collaborations?: any[]
}

export function YearlyCalendar({ collaborations = [] }: YearlyCalendarProps) {
    const [year, setYear] = useState(2026)
    const [month, setMonth] = useState(0) // 0-11
    const [view, setView] = useState<'month' | 'year'>('year')

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

    // Monthly View Helper: Mock Data for Visuals
    const getMockEvents = (d: number) => {
        // Specific hardcoded events to match the provided image
        if (view === 'month' && month === 0 && year === 2026) {
            // Emma: 15-18
            if (d >= 15 && d <= 18) return { name: 'Emma', color: 'bg-purple-500', isStart: d === 15, isEnd: d === 18 }
            // Marcus: 22-25
            if (d >= 22 && d <= 25) return { name: 'Marcus', color: 'bg-orange-400', isStart: d === 22, isEnd: d === 25 }
            // Marcus: 26-28
            if (d >= 26 && d <= 28) return { name: 'Marcus', color: 'bg-orange-400', isStart: d === 26, isEnd: d === 28 }
        }
        return null
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
            const event = getMockEvents(d)
            slots.push(
                <div key={d} className="min-h-[120px] bg-white border border-gray-100 p-2 relative rounded-lg hover:border-gray-200 transition-colors">
                    <span className="text-sm font-medium text-gray-700 block mb-2">{d}</span>
                    {event && (
                        <div className={`text-xs text-white px-2 py-1 rounded w-full mb-1 ${event.color} shadow-sm`}>
                            {event.name}
                        </div>
                    )}
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
                    <h2 className="text-2xl font-bold text-gray-900">Collaboration Calendar</h2>
                    <p className="text-sm text-gray-500 mt-1">View all creator collaborations for the year</p>
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
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                        <span>Negotiating</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                        <span>Staying</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                        <span>Awaiting Assets</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                        <span>Campaign Active</span>
                    </div>
                </div>

                <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    <PlusIcon className="w-4 h-4" />
                    Add External Creator
                </button>
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
                                                return (
                                                    <div
                                                        key={day}
                                                        className={`h-12 relative flex items-center justify-center transition-colors
                              ${!isValidDate ? 'bg-gray-50/30 pattern-diagonal-lines' : ''}
                              ${isValidDate ? 'hover:bg-gray-100/50' : ''}
                            `}
                                                    >
                                                        {!isValidDate && <div className="w-full h-full bg-gray-50 opacity-50" />}
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
        </div>
    )
}
