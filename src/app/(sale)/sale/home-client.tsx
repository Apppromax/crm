'use client'

import { useState } from 'react'
import { Bell, User, Flame } from 'lucide-react'
import { SmartCard } from '@/components/sale/smart-card'
import { BigButton } from '@/components/sale/big-button'
import { formatCurrencyShort } from '@/lib/utils'
import { NotificationPanel } from '@/components/shared/notification-panel'
import Link from 'next/link'

interface CardData {
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

interface Props {
    userId: string
    topCards: CardData[]
    stats: {
        totalLeads: number
        milestone45: number
        streakCount: number
        pipelineValue: number
    }
}

export function SaleHomeClient({ userId, topCards, stats }: Props) {
    const [showNotifications, setShowNotifications] = useState(false)

    return (
        <div className="mx-auto max-w-lg">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-transparent">
                <div className="flex items-center gap-2 bg-white/25 backdrop-blur-2xl rounded-full pr-4 p-1 pl-1 border border-white/50 shadow-[0_2px_12px_rgba(0,0,0,0.04),inset_0_1px_0px_rgba(255,255,255,0.5)]">
                    <div className="h-9 w-9 rounded-full bg-[#18C3F5] flex items-center justify-center shadow-sm">
                        <span className="text-[15px] font-bold text-white">C</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-[13px] font-bold text-slate-900 leading-tight">CRM Pro</h1>
                        <p className="text-[10px] font-medium text-slate-800 leading-tight mt-0.5">{topCards.length} khách cần xử lý</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/25 backdrop-blur-2xl rounded-full px-1.5 py-1.5 border border-white/50 shadow-[0_2px_12px_rgba(0,0,0,0.04),inset_0_1px_0px_rgba(255,255,255,0.5)]">
                    <button
                        onClick={() => setShowNotifications(true)}
                        className="relative flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-white/40"
                    >
                        <Bell className="h-4 w-4 stroke-[2]" />
                        <span className="absolute right-0.5 top-0.5 h-[7px] w-[7px] rounded-full bg-red-500 border border-white" />
                    </button>
                    <Link
                        href="/sale/achievements"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-white/40"
                    >
                        <User className="h-4 w-4 stroke-[2]" />
                    </Link>
                </div>
            </header>

            {/* Top Cards — glass */}
            <div className="px-4 pt-1 flex flex-col gap-4 stagger-children">
                {topCards.map((card, index) => (
                    <SmartCard key={card.id} card={card as any} rank={index + 1} />
                ))}
            </div>

            {/* Big Button overlaps with Stats box */}
            {topCards.length > 0 && (
                <div className="flex justify-center pt-6 animate-pop-in relative z-20 -mb-[50px] pointer-events-none" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                    <div className="pointer-events-auto">
                    <BigButton leadName={topCards[0].name} leadId={topCards[0].id} />
                    </div>
                </div>
            )}

            {/* Quick Stats — glass card with warm gradient */}
            <div className="mx-4 mb-6 bg-white/25 backdrop-blur-2xl border border-white/60 p-5 pt-[60px] pb-5 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_0px_rgba(255,255,255,0.5)] animate-scale-in relative z-10" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                <div className="grid grid-cols-3 gap-2 text-center text-slate-800">
                    <div className="flex flex-col items-center">
                        <p className="text-[26px] font-bold text-[#1A89B0] leading-none mb-1">{stats.totalLeads}</p>
                        <p className="text-[11px] font-semibold text-slate-700">Active Leads</p>
                    </div>
                    <div className="flex flex-col items-center border-l border-r border-white/60">
                        <p className="text-[26px] font-bold text-[#2ea869] leading-none mb-1">{stats.milestone45}</p>
                        <p className="text-[11px] font-semibold text-slate-700">Mốc 4-5</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-[26px] font-bold text-[#e89028] leading-none mb-1">{stats.streakCount}</p>
                        <p className="text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1"><Flame className="w-3 h-3 text-red-500 fill-red-500" /> Streak</p>
                    </div>
                </div>
                
                <div className="mt-4 text-center">
                    <p className="text-[12px] font-semibold text-slate-800 mb-0.5">Pipeline Value</p>
                    <p className="text-[38px] font-bold leading-none tracking-tight text-white drop-shadow-[0_2px_8px_rgba(230,120,70,0.5)]">
                        {stats.pipelineValue >= 1000000000 ? `${(stats.pipelineValue / 1000000000).toFixed(1)} tỷ` : formatCurrencyShort(stats.pipelineValue)}
                    </p>
                </div>
            </div>

            <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} userId={userId} />
        </div>
    )
}
