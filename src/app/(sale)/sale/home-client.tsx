'use client'

import { useState } from 'react'
import { Bell, User } from 'lucide-react'
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
            {/* Header — transparent, blends into gradient */}
            <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-transparent">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-md shadow-primary-500/20">
                        <span className="text-sm font-bold text-white">C</span>
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-slate-800">CRM Pro</h1>
                        <p className="text-xs text-slate-500">{topCards.length} khách cần xử lý</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowNotifications(true)}
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-white/40"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-danger border-2 border-white/80" />
                    </button>
                    <Link
                        href="/sale/achievements"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-white/40"
                    >
                        <User className="h-5 w-5" />
                    </Link>
                </div>
            </header>

            {/* Top 3 Cards — glass */}
            <div className="px-4 pt-2 space-y-3 stagger-children">
                {topCards.map((card, index) => (
                    <SmartCard key={card.id} card={card as any} rank={index + 1} />
                ))}
            </div>

            {/* Big Button — circular with rainbow ring */}
            {topCards.length > 0 && (
                <div className="flex justify-center px-4 pt-6 pb-4 animate-pop-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                    <BigButton leadName={topCards[0].name} leadId={topCards[0].id} />
                </div>
            )}

            {/* Quick Stats — glass card with warm gradient */}
            <div className="mx-4 mb-6 sale-stats-card p-5 animate-scale-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-primary-600">{stats.totalLeads}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Active Leads</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-success">{stats.milestone45}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Mốc 4-5</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-warning">{stats.streakCount}</p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-center gap-1">🔥 Streak</p>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/40 text-center">
                    <p className="text-xs text-slate-500">Pipeline Value</p>
                    <p className="text-xl font-bold text-emerald-600 mt-0.5">{formatCurrencyShort(stats.pipelineValue)}</p>
                </div>
            </div>

            <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} userId={userId} />
        </div>
    )
}
