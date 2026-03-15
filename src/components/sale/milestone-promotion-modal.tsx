'use client'

import { useState } from 'react'
import { ArrowUp, X, Calendar, Clock, Loader2 } from 'lucide-react'
import { cn, getMilestoneLabel } from '@/lib/utils'

interface Props {
    currentMilestone: number
    signal: string
    leadId: string
    userId: string
    onPromote: () => void | Promise<void>
    onSkip: () => void | Promise<void>
    onClose: () => void
}

export function MilestonePromotionModal({ currentMilestone, signal, leadId, userId, onPromote, onSkip, onClose }: Props) {
    const [scheduleType, setScheduleType] = useState<string>('none')
    const [scheduleDate, setScheduleDate] = useState('')
    const [scheduleTime, setScheduleTime] = useState('')
    const [isPromoting, setIsPromoting] = useState(false)
    const [isSkipping, setIsSkipping] = useState(false)
    const nextMilestone = Math.min(currentMilestone + 1, 5)

    async function handlePromote() {
        setIsPromoting(true)
        try {
            await onPromote()
        } finally {
            setIsPromoting(false)
        }
    }

    async function handleSkip() {
        setIsSkipping(true)
        try {
            await onSkip()
        } finally {
            setIsSkipping(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-lg rounded-t-3xl bg-white shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="h-1 w-10 rounded-full bg-slate-200" />
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    {/* Close */}
                    <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>

                    <h2 className="text-lg font-bold text-slate-800 mb-1">Ghi chú đã lưu! ✅</h2>
                    <p className="text-sm text-slate-400 mb-4">Bạn muốn làm gì tiếp?</p>

                    {/* Promotion Question */}
                    <div className="rounded-2xl bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100 p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ArrowUp className="h-5 w-5 text-primary-600" />
                            <span className="text-sm font-semibold text-primary-700">Thăng mốc?</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">{signal}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">
                                Mốc {currentMilestone}: {getMilestoneLabel(currentMilestone)}
                            </span>
                            <span className="text-primary-400">→</span>
                            <span className="text-xs font-semibold text-primary-600">
                                Mốc {nextMilestone}: {getMilestoneLabel(nextMilestone)}
                            </span>
                        </div>
                    </div>

                    {/* Schedule Follow-up */}
                    <div className="mb-5">
                        <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            Hẹn lịch follow-up
                        </p>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            {[
                                { key: '2h', label: '2 giờ nữa' },
                                { key: 'tomorrow', label: 'Ngày mai' },
                                { key: 'custom', label: 'Tùy chỉnh' },
                            ].map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => setScheduleType(opt.key)}
                                    className={cn(
                                        'rounded-xl border px-3 py-2.5 text-xs font-medium transition-all',
                                        scheduleType === opt.key
                                            ? 'border-primary-400 bg-primary-50 text-primary-700'
                                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        {scheduleType === 'custom' && (
                            <div className="flex gap-2 animate-slide-up">
                                <input
                                    type="date"
                                    value={scheduleDate}
                                    onChange={e => setScheduleDate(e.target.value)}
                                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
                                />
                                <input
                                    type="time"
                                    value={scheduleTime}
                                    onChange={e => setScheduleTime(e.target.value)}
                                    className="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSkip}
                            disabled={isSkipping || isPromoting}
                            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-1.5"
                        >
                            {isSkipping ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Giữ mốc'}
                        </button>
                        <button
                            onClick={handlePromote}
                            disabled={isPromoting || isSkipping}
                            className="flex-1 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-primary-500/40 active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-40"
                        >
                            {isPromoting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <ArrowUp className="h-4 w-4" />
                                    Thăng lên Mốc {nextMilestone}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
