'use client'

import {
  ChatBubbleOvalLeftEllipsisIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

interface SystemMessageProps {
  content: string
}

export function SystemMessage({ content }: SystemMessageProps) {
  const isNegotiation =
    content.toLowerCase().includes('counter-offer') ||
    content.toLowerCase().includes('suggested')
  const isSuccess =
    content.toLowerCase().includes('completed') ||
    content.toLowerCase().includes('accepted') ||
    content.toLowerCase().includes('agreed')
  const isIncomplete = content.toLowerCase().includes('incomplete')

  // Split content if it has structured data (header: detail1 • detail2)
  let header = content
  let subtext: string[] = []

  if (content.includes(':')) {
    const parts = content.split(':')
    header = parts[0].trim()
    const details = parts.slice(1).join(':').trim()
    if (details) {
      subtext = details
        .split('•')
        .map((s) => s.trim())
        .filter(Boolean)
    }
  }

  let bgColor = 'bg-gray-100/50 text-gray-500 border-gray-200'
  let Icon = ChatBubbleOvalLeftEllipsisIcon
  let iconColor = 'text-gray-400'

  if (isNegotiation) {
    bgColor = 'bg-blue-50/50 text-blue-700 border-blue-100'
    iconColor = 'text-blue-500'
    Icon = ArrowPathIcon
  } else if (isSuccess) {
    bgColor = 'bg-emerald-50/50 text-emerald-700 border-emerald-100'
    iconColor = 'text-emerald-500'
    Icon = CheckCircleIcon
  } else if (isIncomplete) {
    bgColor = 'bg-amber-50/50 text-amber-700 border-amber-100'
    iconColor = 'text-amber-500'
    Icon = ExclamationCircleIcon
  }

  // If it has subtext or is a negotiation, render as a structured box
  if (subtext.length > 0 || isNegotiation) {
    return (
      <div className="flex justify-center my-10 px-4">
        <div
          className={`w-full max-w-sm rounded-2xl border ${bgColor} p-4 shadow-sm animate-in fade-in zoom-in duration-300`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-9 h-9 rounded-xl ${bgColor.split(' ')[0]} border border-white/50 flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="flex-1 space-y-1.5">
              <p className="text-[10px] font-black tracking-widest uppercase opacity-60">
                {header}
              </p>
              {subtext.length > 0 ? (
                <ul className="space-y-1.5">
                  {subtext.map((s, i) => (
                    <li
                      key={i}
                      className="text-[13px] font-bold leading-tight flex items-start gap-2 text-gray-900"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${iconColor.replace('text-', 'bg-')} opacity-40 flex-shrink-0`}
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] font-bold leading-tight text-gray-900">
                  {content.includes(':') ? content.split(':')[1].trim() : content}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center my-8">
      <div
        className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border ${bgColor} shadow-sm max-w-[80%] animate-in fade-in zoom-in duration-300`}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
        <span className="text-xs font-bold">{content}</span>
      </div>
    </div>
  )
}
