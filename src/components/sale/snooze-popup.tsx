'use client'

import { Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SNOOZE_OPTIONS, type SnoozeOption } from '@/lib/engine'

interface Props {
    onSelect: (option: SnoozeOption) => void
    onClose: () => void
}

export function SnoozePopup({ onSelect, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-lg rounded-t-3xl bg-white shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1 w-10 rounded-full bg-slate-200" />
                </div>

                <div className="px-6 pb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary-500" />
                            <h2 className="text-base font-bold text-slate-800">Tạm hoãn (Snooze)</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="text-sm text-slate-400 mb-4">Lead sẽ tạm ẩn khỏi Top 3 và trở lại sau:</p>

                    <div className="grid grid-cols-3 gap-2">
                        {SNOOZE_OPTIONS.map(option => (
                            <button
                                key={option.key}
                                onClick={() => onSelect(option)}
                                className={cn(
                                    'flex flex-col items-center gap-1 rounded-xl border border-slate-200 py-3 px-2',
                                    'text-sm font-medium text-slate-600 transition-all',
                                    'hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700',
                                    'active:scale-95'
                                )}
                            >
                                <span className="text-lg">{option.icon}</span>
                                <span className="text-xs">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
