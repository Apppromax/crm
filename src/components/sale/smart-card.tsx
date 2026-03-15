'use client'

import { cn, formatCurrencyShort, getMilestoneLabel, getMilestonePercentage } from '@/lib/utils'
import { Zap, Clock, RotateCcw, Flame, MessageSquare, ChevronRight } from 'lucide-react'
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
    golden_72h: { icon: Zap, label: '72h Vàng', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    schedule_due: { icon: Clock, label: 'Lịch hẹn', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    retry: { icon: RotateCcw, label: 'Retry', className: 'bg-slate-100 text-slate-600 border-slate-200' },
    hot_lead: { icon: Flame, label: 'Nóng', className: 'bg-red-100 text-red-600 border-red-200' },
    manager_advice: { icon: MessageSquare, label: 'Lệnh sếp', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
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
                    'animate-slide-up rounded-2xl bg-white p-4 shadow-sm border transition-all active:scale-[0.98]',
                    isGolden
                        ? 'border-amber-200 shadow-amber-100/50'
                        : 'border-slate-100 hover:border-slate-200',
                    rank === 1 && 'ring-2 ring-primary-100'
                )}
                style={{ animationDelay: `${rank * 80}ms` }}
            >
                {/* Top Row: Badge + Heat Score */}
                <div className="mb-3 flex items-center justify-between">
                    <div className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', badge.className)}>
                        <BadgeIcon className={cn('h-3.5 w-3.5', isGolden && 'animate-pulse-golden')} />
                        {badge.label}
                    </div>
                    <div className="flex items-center gap-2">
                        {card.hasManagerAdvice && (
                            <span className="flex h-6 items-center rounded-full bg-indigo-50 px-2 text-[10px] font-semibold text-indigo-600 border border-indigo-100">
                                📩 Lệnh sếp
                            </span>
                        )}
                        <div className="flex items-center gap-1">
                            <Flame className={cn('h-4 w-4', card.heatScore >= 70 ? 'text-red-500' : card.heatScore >= 40 ? 'text-orange-400' : 'text-slate-300')} />
                            <span className={cn('text-sm font-bold', card.heatScore >= 70 ? 'text-red-500' : card.heatScore >= 40 ? 'text-orange-500' : 'text-slate-400')}>
                                {card.heatScore}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Name + Deal Value */}
                <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-base font-semibold text-slate-900 leading-tight">{card.name}</h3>
                    {card.dealValue && (
                        <span className="ml-2 shrink-0 text-sm font-semibold text-emerald-600">
                            {formatCurrencyShort(card.dealValue)}
                        </span>
                    )}
                </div>

                {/* Milestone Progress Bar */}
                <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-500">
                            Mốc {card.currentMilestone}: {getMilestoneLabel(card.currentMilestone)}
                        </span>
                        <span className="text-xs font-bold text-primary-600">{percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                            className="milestone-bar h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* AI Summary */}
                {card.aiSummary && (
                    <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                        💡 {card.aiSummary}
                    </p>
                )}

                {/* Bottom: Budget + Arrow */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            'rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                            card.bantBudget === 'VERY_HIGH' && 'bg-emerald-100 text-emerald-700',
                            card.bantBudget === 'HIGH' && 'bg-green-100 text-green-700',
                            card.bantBudget === 'MEDIUM' && 'bg-yellow-100 text-yellow-700',
                            card.bantBudget === 'LOW' && 'bg-slate-100 text-slate-500',
                            card.bantBudget === 'UNKNOWN' && 'bg-slate-50 text-slate-400',
                        )}>
                            💰 {card.bantBudget === 'VERY_HIGH' ? 'Rất cao' : card.bantBudget === 'HIGH' ? 'Cao' : card.bantBudget === 'MEDIUM' ? 'TB' : card.bantBudget === 'LOW' ? 'Thấp' : '?'}
                        </span>
                        {card.consecutiveMissCount > 0 && (
                            <span className="text-[10px] text-slate-400">
                                📵 Hụt {card.consecutiveMissCount}x
                            </span>
                        )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
            </div>
        </Link>
    )
}
