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
    topCards: CardData[]
    stats: {
        totalLeads: number
        milestone45: number
        streakCount: number
        pipelineValue: number
    }
}

export function SaleHomeClient({ topCards, stats }: Props) {
    const [showNotifications, setShowNotifications] = useState(false)

    return (
        <div className="mx-auto max-w-lg">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-md shadow-primary-500/20">
                        <span className="text-sm font-bold text-white">C</span>
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-slate-900">CRM Pro</h1>
                        <p className="text-xs text-slate-400">{topCards.length} khách cần xử lý</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowNotifications(true)}
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-danger border-2 border-white" />
                    </button>
                    <Link
                        href="/sale/achievements"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
                    >
                        <User className="h-5 w-5" />
                    </Link>
                </div>
            </header>

            {/* Top 3 Cards — from DB */}
            <div className="px-4 pt-4 space-y-3">
                {topCards.map((card, index) => (
                    <SmartCard key={card.id} card={card as any} rank={index + 1} />
                ))}
            </div>

            {topCards.length > 0 && (
                <div className="px-4 pt-5 pb-4">
                    <BigButton leadName={topCards[0].name} leadId={topCards[0].id} />
                </div>
            )}

            {/* Quick Stats — from DB */}
            <div className="mx-4 mb-6 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-primary-600">{stats.totalLeads}</p>
                        <p className="text-xs text-slate-400">Active Leads</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-success">{stats.milestone45}</p>
                        <p className="text-xs text-slate-400">Mốc 4-5</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-warning">{stats.streakCount}</p>
                        <p className="text-xs text-slate-400 flex items-center justify-center gap-1">🔥 Streak</p>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-50 text-center">
                    <p className="text-xs text-slate-400">Pipeline Value</p>
                    <p className="text-lg font-bold text-emerald-600">{formatCurrencyShort(stats.pipelineValue)}</p>
                </div>
            </div>

            <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
    )
}
