'use client'

import { cn, formatCurrencyShort } from '@/lib/utils'
import { Flame, Diamond, Zap, UserCheck, MessageCircle, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface SmartCardProps {
    card: {
        id: string
        name: string
        currentMilestone: number
        heatScore: number
        priorityScore: number
        priorityReason: 'diamond' | 'hot_seat' | 'net' | 'retry' | 'golden_72h' | 'schedule_due' | 'fresh' | 'manager_advice' | string
        dealValue: number | null
        aiSummary: string | null
        bantBudget: string
        consecutiveMissCount: number
        hasManagerAdvice: boolean
        nextSchedule: { scheduledAt: Date; type: string } | null
    }
    rank: number
}

// ============================================
// MILESTONE DESIGN SYSTEM
// ============================================
const MILESTONES = [
    {
        id: 1,
        label: 'Tiếp cận',
        color: 'from-sky-300 to-sky-400',      // Xanh nhạt
        textColor: 'text-sky-700',
        bgTag: 'bg-sky-100 text-sky-700 border-sky-200/60',
        dotActive: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]',
        barFill: 'from-sky-300 to-sky-400',
    },
    {
        id: 2,
        label: 'Chào mồi',
        color: 'from-teal-300 to-teal-500',     // Xanh ngọc
        textColor: 'text-teal-700',
        bgTag: 'bg-teal-100 text-teal-700 border-teal-200/60',
        dotActive: 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]',
        barFill: 'from-sky-300 via-teal-400 to-teal-500',
    },
    {
        id: 3,
        label: 'Niềm tin',
        color: 'from-amber-300 to-amber-500',   // Vàng ấm
        textColor: 'text-amber-700',
        bgTag: 'bg-amber-100 text-amber-700 border-amber-200/60',
        dotActive: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
        barFill: 'from-sky-300 via-teal-400 to-amber-500',
    },
    {
        id: 4,
        label: 'Dồn chốt',
        color: 'from-orange-400 to-red-500',    // Cam rực cháy
        textColor: 'text-orange-700',
        bgTag: 'bg-orange-500 text-white border-orange-400/60 shadow-[0_0_12px_rgba(249,115,22,0.5)]',
        dotActive: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]',
        barFill: 'from-sky-300 via-amber-400 to-orange-500',
    },
    {
        id: 5,
        label: '💎 Kim Cương',
        color: 'from-cyan-200 via-teal-300 to-emerald-400', // Kim cương
        textColor: 'text-teal-900',
        bgTag: 'bg-gradient-to-r from-cyan-200 via-teal-200 to-emerald-200 text-teal-900 border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.9),0_0_8px_rgba(45,212,191,0.4)] font-black',
        dotActive: 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(45,212,191,0.7)]',
        barFill: 'from-sky-300 via-amber-400 via-orange-500 to-emerald-400',
    },
]

// Gợi ý "Dấu hiệu tin tưởng" cho Mốc 3
const TRUST_SIGNALS = [
    { icon: MessageCircle, label: 'Kết bạn Zalo' },
    { icon: CreditCard, label: 'Gửi CCCD' },
    { icon: UserCheck, label: 'Mời cafe' },
]

export function SmartCard({ card, rank }: SmartCardProps) {
    const ms = card.currentMilestone
    const msConfig = MILESTONES[Math.min(ms, 5) - 1]

    // Nền gradient Card theo milestone
    const heatGradient =
        card.priorityReason === 'retry' ? 'bg-slate-200/40 grayscale' :
        ms === 5 ? 'bg-gradient-to-tr from-cyan-100/50 via-teal-50/40 to-emerald-100/50' :
        ms === 4 ? 'bg-gradient-to-br from-orange-100/50 via-red-50/30 to-amber-50/40' :
        ms === 3 ? 'bg-gradient-to-br from-amber-100/40 via-yellow-50/30 to-transparent' :
        ms === 2 ? 'bg-gradient-to-br from-teal-100/40 via-cyan-50/30 to-transparent' :
        'bg-gradient-to-br from-sky-100/40 via-blue-50/20 to-transparent'

    // Viền & Hiệu ứng đặc biệt
    const interactiveClasses =
        card.priorityReason === 'retry' ? 'opacity-[0.6] blur-[0.2px] border-slate-300/50' :
        ms === 5 ? 'shadow-[0_0_30px_-5px_rgba(45,212,191,0.6),inset_0_1px_0_rgba(255,255,255,0.8)] border-2 border-teal-300/80 animate-shimmer scale-[1.01]' :
        card.priorityReason === 'hot_seat' ? 'shadow-[0_0_25px_-5px_rgba(249,115,22,0.8)] border-2 border-orange-500 animate-pulse scale-[1.02]' :
        card.heatScore >= 80 ? 'shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)] border-2 border-rose-400/80 saturate-[1.1]' :
        'border-white/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)] border'

    return (
        <Link href={`/sale/leads/${card.id}`}>
            <div
                className={cn(
                    'animate-slide-up relative overflow-hidden p-4 rounded-[24px] backdrop-blur-[40px] inset-shadow-sm',
                    heatGradient,
                    interactiveClasses
                )}
                style={{ animationDelay: `${rank * 80}ms` }}
            >
                {/* Row 1: Name + HeatScore */}
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[17px] font-bold text-slate-800 leading-tight truncate pr-3 flex-1 drop-shadow-sm">
                        {card.name}
                    </h3>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {card.priorityReason === 'retry' ? (
                            <span className="flex items-center gap-1 bg-slate-300/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-600 shadow-sm">
                                ↻ Chờ Retry
                            </span>
                        ) : (
                            <div className="flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded-full shadow-sm">
                                <Flame className={cn("h-3 w-3", card.heatScore >= 80 ? "text-rose-500 fill-rose-500" : card.heatScore >= 50 ? "text-amber-500 fill-amber-500" : "text-sky-500")} />
                                <span className="text-[11px] font-bold text-slate-700">{card.heatScore}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 2: Milestone Progress Bar */}
                {card.priorityReason !== 'retry' && (
                    <div className="mb-3">
                        <MilestoneBar currentMilestone={ms} />
                    </div>
                )}

                {/* Row 3: Gợi ý Mốc 3 — Dấu hiệu Tin Tưởng */}
                {ms === 3 && card.priorityReason !== 'retry' && (
                    <div className="mb-3 flex items-center gap-1.5 bg-amber-50/70 border border-amber-200/50 rounded-xl px-3 py-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-amber-700 mr-1">Tìm dấu hiệu:</span>
                        {TRUST_SIGNALS.map(sig => (
                            <span key={sig.label} className="inline-flex items-center gap-0.5 bg-white/80 border border-amber-100 rounded-md px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">
                                <sig.icon className="w-2.5 h-2.5" />
                                {sig.label}
                            </span>
                        ))}
                    </div>
                )}

                {/* Row 4: Tag + Value */}
                <div className="flex items-end justify-between">
                    <span className={cn(
                        "inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[11px] border",
                        msConfig.bgTag
                    )}>
                        {msConfig.label}
                    </span>

                    {card.dealValue && card.priorityReason !== 'retry' && (
                        <span className="text-[14px] font-black tracking-tight text-emerald-600/90 drop-shadow-[0_1px_0px_rgba(255,255,255,1)]">
                            {card.dealValue >= 1000000000 ? `${(card.dealValue / 1000000000).toFixed(1)} tỷ` : formatCurrencyShort(card.dealValue)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

// ============================================
// MILESTONE PROGRESS BAR COMPONENT
// ============================================
function MilestoneBar({ currentMilestone }: { currentMilestone: number }) {
    const ms = Math.min(currentMilestone, 5)
    const msConfig = MILESTONES[ms - 1]
    const progressPercent = ((ms - 1) / 4) * 100

    return (
        <div className="relative flex items-center gap-0">
            {/* Background track */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-slate-200/60" />

            {/* Filled track */}
            <div
                className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-gradient-to-r transition-all duration-700",
                    msConfig.barFill
                )}
                style={{ width: `${progressPercent}%` }}
            />

            {/* Dots */}
            <div className="relative flex items-center justify-between w-full">
                {MILESTONES.map((milestone) => {
                    const isActive = milestone.id <= ms
                    const isCurrent = milestone.id === ms
                    const isDiamond = milestone.id === 5 && isCurrent

                    return (
                        <div key={milestone.id} className="relative flex flex-col items-center" style={{ width: '20%' }}>
                            {/* Dot */}
                            <div className={cn(
                                "rounded-full transition-all duration-500 flex items-center justify-center",
                                isDiamond ? 'w-6 h-6' : isCurrent ? 'w-4 h-4' : 'w-2.5 h-2.5',
                                isActive ? msConfig.dotActive : 'bg-slate-200',
                                isCurrent && !isDiamond && 'ring-2 ring-white ring-offset-1',
                                isDiamond && 'ring-2 ring-white ring-offset-2 animate-shimmer',
                            )}>
                                {isDiamond && <Diamond className="w-3 h-3 text-white fill-white" />}
                            </div>
                            {/* Label (only current) */}
                            {isCurrent && (
                                <span className={cn(
                                    "absolute -bottom-4 text-[8px] font-black whitespace-nowrap tracking-wide",
                                    msConfig.textColor
                                )}>
                                    {milestone.id === 5 ? 'KIM CƯƠNG' : milestone.label.toUpperCase()}
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
