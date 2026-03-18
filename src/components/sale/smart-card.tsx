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

export function SmartCard({ card, rank }: SmartCardProps) {
    // Độ nét -> Màu sắc nền Gradient (Kính mờ)
    const heatGradient =
        card.heatScore >= 80 ? 'bg-gradient-to-br from-rose-400/20 via-orange-300/10 to-transparent' : // Nét cao
        card.heatScore >= 50 ? 'bg-gradient-to-br from-amber-300/20 via-yellow-200/10 to-transparent' : // Nét vừa
        'bg-gradient-to-br from-sky-300/20 via-blue-200/10 to-transparent' // Nét thấp

    return (
        <Link href={`/sale/leads/${card.id}`}>
            <div
                className={cn(
                    'animate-slide-up relative overflow-hidden p-4 rounded-[24px] backdrop-blur-[40px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.4)]',
                    heatGradient,
                    // Nổi bật thẻ Hot Lead (dồn chốt)
                    card.priorityReason === 'hot_lead' && 'shadow-[0_4px_30px_-5px_rgba(249,115,22,0.3)]'
                )}
                style={{ animationDelay: `${rank * 80}ms` }}
            >
                <div className="flex items-center justify-between mb-1">
                    {/* Tên khách hàng */}
                    <h3 className="text-[17px] font-bold text-slate-800 leading-tight truncate pr-3 flex-1">
                        {card.name}
                    </h3>
                    
                    {/* Tag Độ Nét & Giá Trị */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-white/40 px-2 py-0.5 rounded-full shadow-sm">
                            <Flame className={cn("h-3 w-3", card.heatScore >= 80 ? "text-rose-500 fill-rose-500" : card.heatScore >= 50 ? "text-amber-500 fill-amber-500" : "text-sky-500")} />
                            <span className="text-[11px] font-bold text-slate-700">{card.heatScore}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between mt-2">
                    {/* Tag Mốc gọn gàng */}
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-white/50 text-[11px] font-semibold text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        Mốc {card.currentMilestone}
                    </span>

                    {/* Deal Value */}
                    {card.dealValue && (
                        <span className="text-[14px] font-black tracking-tight text-emerald-600/90 drop-shadow-[0_1px_0px_rgba(255,255,255,1)]">
                            {card.dealValue >= 1000000000 ? `${(card.dealValue / 1000000000).toFixed(1)} tỷ` : formatCurrencyShort(card.dealValue)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
