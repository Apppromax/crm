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
    golden_72h: { icon: Zap, label: '72h Vàng', className: 'bg-amber-100/80 text-amber-700 border border-amber-200/60' },
    schedule_due: { icon: Clock, label: 'Lịch hẹn', className: 'bg-blue-100/80 text-blue-700 border border-blue-200/60' },
    retry: { icon: RotateCcw, label: 'Retry', className: 'bg-slate-100/80 text-slate-600 border border-slate-200/60' },
    hot_lead: { icon: Flame, label: 'Nóng', className: 'bg-red-100/80 text-red-600 border border-red-200/60' },
    manager_advice: { icon: MessageSquare, label: 'Lệnh sếp', className: 'bg-indigo-100/80 text-indigo-700 border border-indigo-200/60' },
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
                    'animate-slide-up glass-interactive bg-white/35 backdrop-blur-2xl border border-white/70 p-4 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_0px_rgba(255,255,255,0.6)] relative overflow-hidden',
                    // Nét viền Neon
                    (card.heatScore > 70 && card.priorityReason !== 'hot_lead') && 'ring-2 ring-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
                    // Hot seat (Dồn chốt)
                    card.priorityReason === 'hot_lead' && 'ring-2 ring-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse',
                    // Retry (Xám mờ)
                    card.priorityReason === 'retry' && 'opacity-65 grayscale-[30%]',
                    isGolden && !card.priorityReason.includes('hot') && 'ring-2 ring-amber-300/40'
                )}
                style={{ animationDelay: `${rank * 80}ms` }}
            >
                {/* Top Row: Priority Badge + Heat Score */}
                <div className="mb-2 flex items-center justify-between">
                    <div className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[11px] font-semibold shadow-sm',
                        badge.className
                    )}>
                        <BadgeIcon className="h-3 w-3" />
                        {badge.label}
                    </div>
                    <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-red-500" />
                        <span className="text-[16px] font-bold text-red-500 leading-none">
                            {card.heatScore}
                        </span>
                    </div>
                </div>

                {/* Name + Deal Value */}
                <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-tight">{card.name}</h3>
                    {card.dealValue && (
                        <span className="text-[17px] font-bold text-[#1B8954] leading-tight">
                            {card.dealValue >= 1000000000 ? `${(card.dealValue / 1000000000).toFixed(1)} tỷ` : formatCurrencyShort(card.dealValue)}
                        </span>
                    )}
                </div>

                {/* Milestone + Percentage + Progress Bar */}
                <div className="mb-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-medium text-slate-700">
                            Mốc {card.currentMilestone}: {getMilestoneLabel(card.currentMilestone)}
                        </span>
                        <span className="text-[13px] font-semibold text-[#1B8954]">{percentage}%</span>
                    </div>
                    <div className="h-[6px] rounded-full overflow-hidden bg-white/80">
                        <div
                            className={cn(
                                "milestone-bar h-full rounded-full transition-all duration-500",
                                card.currentMilestone === 1 && "bg-blue-300", // Tiếp cận: Xanh nhạt
                                card.currentMilestone === 2 && "bg-teal-400", // Chào mồi: Xanh ngọc
                                card.currentMilestone === 3 && "bg-amber-400", // Niềm tin: Vàng ấm
                                card.currentMilestone === 4 && "bg-orange-500", // Dồn chốt: Cam rực cháy
                                card.currentMilestone >= 5 && "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" // Chốt cọc: Kim Cương
                            )}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Bottom Row: Budget Badge + optional Mic */}
                <div className="flex items-center justify-between">
                    <span className={cn(
                        'rounded-full px-2.5 py-[3px] text-[11px] font-semibold flex items-center gap-1',
                        card.bantBudget === 'VERY_HIGH' ? 'bg-[#f8f5d7]/90 text-[#856b00] border border-[#f5ebba]/60 shadow-sm' :
                        card.bantBudget === 'HIGH' ? 'bg-[#e4fcda]/90 text-[#1B8954] border border-[#c1f5ab]/60 shadow-sm' :
                        'bg-[#f8f5d7]/90 text-[#856b00] border border-[#f5ebba]/60 shadow-sm'
                    )}>
                        <span>💰</span> {card.bantBudget === 'VERY_HIGH' ? 'Rất cao' : card.bantBudget === 'HIGH' ? 'Cao' : card.bantBudget === 'MEDIUM' ? 'TB' : card.bantBudget === 'LOW' ? 'Thấp' : 'Rất cao'}
                    </span>
                    
                    {/* Microphone icon for voice note */}
                    {card.priorityReason === 'hot_lead' && (
                        <div className="h-[28px] w-[28px] rounded-full bg-[#41d48c] shadow-[0_2px_8px_rgba(65,212,140,0.4)] flex items-center justify-center text-white">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
