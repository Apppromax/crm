'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { cn, getMilestoneLabel, formatCurrencyShort, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

interface LeadItem {
    id: string
    name: string
    source: string
    currentMilestone: number
    heatScore: number
    status: string
    dealValue: number | null
    lastInteractionAt: string | null
    interactionCount: number
}

type FilterStatus = 'ALL' | 'ACTIVE' | 'WON'

export function LeadsListClient({ leads }: { leads: LeadItem[] }) {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<FilterStatus>('ALL')
    const [milestoneFilter, setMilestoneFilter] = useState<number | null>(null)

    const filtered = leads.filter(lead => {
        if (filter !== 'ALL' && lead.status !== filter) return false
        if (milestoneFilter && lead.currentMilestone !== milestoneFilter) return false
        if (search && !lead.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const statusCounts = {
        ALL: leads.length,
        ACTIVE: leads.filter(l => l.status === 'ACTIVE').length,
        WON: leads.filter(l => l.status === 'WON').length,
    }

    return (
        <div className="mx-auto max-w-lg min-h-dvh">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="px-4 py-3">
                    <h1 className="text-lg font-bold text-slate-900 mb-3">Danh sách khách hàng</h1>

                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm theo tên..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-400/20"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {([
                            { key: 'ALL', label: 'Tất cả', count: statusCounts.ALL },
                            { key: 'ACTIVE', label: 'Đang theo', count: statusCounts.ACTIVE },
                            { key: 'WON', label: 'Đã chốt', count: statusCounts.WON },
                        ] as { key: FilterStatus; label: string; count: number }[]).map(s => (
                            <button
                                key={s.key}
                                onClick={() => setFilter(s.key)}
                                className={cn(
                                    'flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                                    filter === s.key
                                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                )}
                            >
                                {s.label}
                                <span className={cn(
                                    'rounded-full px-1.5 py-0.5 text-[10px]',
                                    filter === s.key ? 'bg-primary-200 text-primary-800' : 'bg-slate-100 text-slate-400'
                                )}>
                                    {s.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-none">
                        {[1, 2, 3, 4, 5].map(m => (
                            <button
                                key={m}
                                onClick={() => setMilestoneFilter(milestoneFilter === m ? null : m)}
                                className={cn(
                                    'whitespace-nowrap rounded-lg border px-2 py-1 text-[10px] font-medium transition-all',
                                    milestoneFilter === m
                                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                                        : 'border-slate-150 text-slate-400 hover:border-slate-300'
                                )}
                            >
                                M{m}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="px-4 py-3 space-y-2">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <Filter className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">Không tìm thấy khách hàng</p>
                    </div>
                ) : (
                    filtered.map(lead => <LeadListItem key={lead.id} lead={lead} />)
                )}
            </div>
        </div>
    )
}

function LeadListItem({ lead }: { lead: LeadItem }) {
    const percentage = lead.currentMilestone * 20

    return (
        <Link href={`/sale/leads/${lead.id}`}>
            <div className={cn(
                'rounded-xl bg-white border border-slate-100 p-3 transition-all active:scale-[0.98] hover:border-slate-200',
                lead.status === 'WON' && 'border-emerald-100 bg-emerald-50/30'
            )}>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shrink-0',
                        lead.status === 'WON' ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-100 text-primary-700'
                    )}>
                        {lead.name.split(' ').pop()?.[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-800 truncate">{lead.name}</h3>
                            {lead.status === 'WON' && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">WON</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400">M{lead.currentMilestone} • {getMilestoneLabel(lead.currentMilestone)}</span>
                            {lead.dealValue && (
                                <span className="text-[10px] font-semibold text-emerald-600">{formatCurrencyShort(lead.dealValue)}</span>
                            )}
                        </div>
                    </div>

                    <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                            <span className={cn(
                                'text-xs font-bold',
                                lead.heatScore >= 70 ? 'text-red-500' :
                                    lead.heatScore >= 40 ? 'text-orange-500' : 'text-slate-400'
                            )}>
                                🔥 {lead.heatScore}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                            {lead.lastInteractionAt ? formatRelativeTime(new Date(lead.lastInteractionAt)) : 'No activity'}
                        </p>
                    </div>
                </div>

                <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all',
                            lead.status === 'WON' ? 'bg-emerald-500' : 'bg-primary-500'
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </Link>
    )
}
