'use client'

import { AuthenticatedNavigation } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { YearlyCalendar } from '@/components/calendar/YearlyCalendar'

function CalendarPageContent() {
    const { isCollapsed } = useSidebar()

    return (
        <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>
            <AuthenticatedNavigation />
            <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-16' : 'md:pl-56'} pt-16`}>
                <div className="w-full pt-8 pb-8 px-8">
                    <YearlyCalendar />
                </div>
            </div>
        </main>
    )
}

export default function CalendarPage() {
    return <CalendarPageContent />
}
