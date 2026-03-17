'use client'

import { cn, formatCurrencyShort, getMilestoneLabel, getMilestonePercentage } from '@/lib/utils'
import { Zap, Clock, RotateCcw, Flame, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface SmartCardProps {
    card: {
        id: string
        name: string
        currentMilestone: number
        heatScore: number
        priorityScore: number
        priorityReason: 'golden_72h' | 'schedule_due' | 'retry' | 'hot_lead' | 'manager_advice'
        dealValue: number | null
        aiSummary: string | null
        bantBudget: string
        consecutiveMissCount: number
        hasManagerAdvice: boolean
        nextSchedule: { scheduledAt: Date; type: string } | null
    }
    rank: number
}

const priorityBadges = {
    golden_72h: { icon: Zap, label: '72h Vàng', className: 'bg-amber-100/80 text-amber-700 border-amber-200/60' },
    schedule_due: { icon: Clock, label: 'Lịch hẹn', className: 'bg-blue-100/80 text-blue-700 border-blue-200/60' },
    retry: { icon: RotateCcw, label: 'Retry', className: 'bg-slate-100/80 text-slate-600 border-slate-200/60' },
    hot_lead: { icon: Flame, label: 'Nóng', className: 'bg-red-100/80 text-red-600 border-red-200/60' },
    manager_advice: { icon: MessageSquare, label: 'Lệnh sếp', className: 'bg-indigo-100/80 text-indigo-700 border-indigo-200/60' },
}

export function SmartCard({ card, rank }: SmartCardProps) {
    const badge = priorityBadges[card.priorityReason]
    const BadgeIcon = badge.icon
    const percentage = getMilestonePercentage(card.currentMilestone)
    const isGolden = card.priorityReason === 'golden_72h'

    return (
        <Link href={`/sale/leads/${card.id}`}>
            <div
                className={cn(
                    'animate-slide-up bg-white/50 backdrop-blur-xl border border-white/60 p-4 transition-all active:scale-[0.98] rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]',
                    isGolden && 'ring-2 ring-amber-300/40',
                )}
                style={{ animationDelay: `${rank * 80}ms` }}
            >
                {/* Optional Top Row: Badge + Heat Score (Shown mostly for rank > 1 matching image) */}
                {(card.priorityReason === 'hot_lead' || rank === 2) && (
                    <div className="mb-1 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100/80 text-red-500 border border-red-200/60 px-2 py-0.5 text-xs font-semibold shadow-sm">
                            <Flame className="h-3 w-3" />
                            Nóng
                        </div>
                        <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-red-500" />
                            <span className="text-[15px] font-bold text-red-500 shadow-sm">
                                {card.heatScore || 75}
                            </span>
                        </div>
                    </div>
                )}

                {/* Name + Deal Value */}
                <div className="mb-0.5 flex items-center justify-between">
                    <h3 className="text-[17px] font-semibold text-slate-900 leading-tight">{card.name}</h3>
                    {card.dealValue && (
                        <span className="text-[17px] font-semibold text-[#1B8954]">
                            {card.dealValue >= 1000000000 ? `${(card.dealValue / 1000000000).toFixed(1)} tỷ` : formatCurrencyShort(card.dealValue)}
                        </span>
                    )}
                </div>

                {/* Milestone Progress Bar */}
                <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-medium text-slate-800">
                            Mốc {card.currentMilestone}: {getMilestoneLabel(card.currentMilestone)}
                        </span>
                        <span className="text-[13px] font-semibold text-[#1B8954]">{percentage}%</span>
                    </div>
                    <div className="h-[6px] rounded-full overflow-hidden bg-white">
                        <div
                            className="milestone-bar h-full rounded-full bg-[#1A89B0]"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            'rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-0.5',
                            card.bantBudget === 'VERY_HIGH' ? 'bg-[#f8f5d7]/90 text-[#856b00] border border-[#f5ebba]/60 shadow-sm' :
                            card.bantBudget === 'HIGH' ? 'bg-[#e4fcda]/90 text-[#1B8954] border border-[#c1f5ab]/60 shadow-sm' :
                            'bg-[#f8f5d7]/90 text-[#856b00] border border-[#f5ebba]/60 shadow-sm' // Default to yellow for image exact match
                        )}>
                            <span className="text-[#dcb525]">💰</span> {card.bantBudget === 'VERY_HIGH' ? 'Rất cao' : card.bantBudget === 'HIGH' ? 'Cao' : card.bantBudget === 'MEDIUM' ? 'TB' : card.bantBudget === 'LOW' ? 'Thấp' : 'Rất cao'}
                        </span>
                    </div>
                    
                    {/* Microphone icon for second card */}
                    {rank === 2 && (
                        <div className="h-[26px] w-[34px] rounded-full bg-[#41d48c] shadow-[0_2px_8px_rgba(65,212,140,0.5)] flex items-center justify-center text-white">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
