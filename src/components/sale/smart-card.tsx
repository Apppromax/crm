'use client'

import { cn, formatCurrencyShort } from '@/lib/utils'
import { Flame } from 'lucide-react'
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

export function SmartCard({ card, rank }: SmartCardProps) {
    // Độ nét -> Màu sắc nền Gradient (Kính mờ)
    const heatGradient =
        card.priorityReason === 'retry' ? 'bg-slate-200/40 grayscale' : 
        card.priorityReason === 'diamond' ? 'bg-gradient-to-tr from-cyan-100/40 via-teal-100/30 to-emerald-100/40' :
        card.heatScore >= 80 ? 'bg-gradient-to-br from-rose-500/20 via-orange-400/20 to-transparent' : // Nét cao
        card.heatScore >= 50 ? 'bg-gradient-to-br from-amber-400/20 via-yellow-300/10 to-transparent' : // Nét vừa
        'bg-gradient-to-br from-sky-400/20 via-blue-300/10 to-transparent' // Nét thấp

    // Viền & Hiệu ứng đặc biệt
    const interactiveClasses = 
        card.priorityReason === 'retry' ? 'opacity-[0.6] blur-[0.2px] border-slate-300/50' :
        card.priorityReason === 'diamond' ? 'shadow-[0_0_20px_-5px_rgba(45,212,191,0.6)] border-2 border-teal-300/80 animate-shimmer scale-[1.01]' :
        card.priorityReason === 'hot_seat' ? 'shadow-[0_0_25px_-5px_rgba(249,115,22,0.8)] border-2 border-orange-500 animate-pulse scale-[1.02]' :
        card.heatScore >= 80 ? 'shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)] border-2 border-rose-400/80 saturate-[1.1]' :
        'border-white/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)] border'

    // Nhãn Mốc (Milestone Tag)
    const milestoneColor =
        card.currentMilestone === 5 ? 'bg-gradient-to-r from-teal-200 to-emerald-300 text-teal-900 border border-white font-black shadow-[0_0_15px_rgba(255,255,255,0.8)]' :
        card.currentMilestone === 4 ? 'bg-orange-500 text-white font-black shadow-[0_0_12px_rgba(249,115,22,0.6)]' :
        card.currentMilestone === 3 ? 'bg-amber-100 text-amber-700 font-bold border border-amber-300/50' :
        card.currentMilestone === 2 ? 'bg-cyan-100 text-cyan-700 font-bold border border-cyan-300/50' :
        'bg-blue-100 text-blue-700 font-bold border border-blue-300/50'

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
                <div className="flex items-center justify-between mb-1">
                    {/* Tên khách hàng */}
                    <h3 className="text-[17px] font-bold text-slate-800 leading-tight truncate pr-3 flex-1 drop-shadow-sm">
                        {card.name}
                    </h3>
                    
                    {/* Tag Độ Nét / Retry */}
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

                <div className="flex items-end justify-between mt-2">
                    {/* Tag Mốc chuẩn xác màu */}
                    <span className={cn(
                        "inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
                        milestoneColor
                    )}>
                        {card.currentMilestone === 5 ? '💎 Chốt cọc' : `Mốc ${card.currentMilestone}`}
                    </span>

                    {/* Deal Value */}
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
