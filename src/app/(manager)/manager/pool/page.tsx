'use client'

import { useState } from 'react'
import { Archive, UserPlus, Clock, Flame, ChevronRight, Search, ArrowRight } from 'lucide-react'
import { cn, formatCurrencyShort, formatRelativeTime, getMilestoneLabel } from '@/lib/utils'

const POOL_LEADS = [
    {
        id: 'pool-001', name: 'Võ Hoàng Long', phone: '0912xxx456',
        source: 'Facebook Ads', milestone: 2, heatScore: 35, dealValue: 3_200_000_000,
        reason: 'Anti-Hoarding: 15 ngày không tương tác', addedAt: new Date(Date.now() - 172800000),
        previousOwner: 'Lê Thị C',
    },
    {
        id: 'pool-002', name: 'Nguyễn Thị Mai', phone: '0908xxx789',
        source: 'Referral', milestone: 1, heatScore: 20, dealValue: 2_100_000_000,
        reason: 'Gọi nhỡ 5 lần liên tiếp', addedAt: new Date(Date.now() - 432000000),
        previousOwner: 'Trần Minh B',
    },
    {
        id: 'pool-003', name: 'Trần Đức Anh', phone: '0976xxx321',
        source: 'Website', milestone: 3, heatScore: 50, dealValue: 6_500_000_000,
        reason: 'Manager thu hồi — chuyển team', addedAt: new Date(Date.now() - 86400000),
        previousOwner: 'Nguyễn Văn A',
    },
]

const TEAM_MEMBERS = [
    { id: 'user-001', name: 'Nguyễn Văn A', activeLeads: 5 },
    { id: 'user-002', name: 'Trần Minh B', activeLeads: 4 },
    { id: 'user-003', name: 'Lê Thị C', activeLeads: 6 },
]

export default function LeadPoolPage() {
    const [search, setSearch] = useState('')
    const [assigningId, setAssigningId] = useState<string | null>(null)
    const [assignedIds, setAssignedIds] = useState<string[]>([])

    const filtered = POOL_LEADS.filter(l =>
        !assignedIds.includes(l.id) &&
        l.name.toLowerCase().includes(search.toLowerCase())
    )

    function handleAssign(leadId: string, memberId: string) {
        setAssignedIds(prev => [...prev, leadId])
        setAssigningId(null)
    }

    return (
        <div className="mx-auto max-w-2xl min-h-dvh">
            <header className="sticky top-0 z-40 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Archive className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-slate-900">Kho Lead Chung</h1>
                        <p className="text-xs text-slate-400">{filtered.length} leads chờ phân bổ</p>
                    </div>
                </div>
            </header>

            {/* Search */}
            <div className="px-4 pt-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm lead..."
                        className="form-input pl-10"
                    />
                </div>
            </div>

            {/* Lead List */}
            <div className="px-4 py-3 space-y-3">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <Archive className="h-14 w-14 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 font-medium">Kho trống!</p>
                        <p className="text-xs text-slate-400 mt-1">Tất cả leads đã được phân bổ</p>
                    </div>
                ) : (
                    filtered.map(lead => (
                        <div key={lead.id} className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden animate-slide-up">
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-sm font-bold">
                                        {lead.name.split(' ').pop()?.[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-slate-800">{lead.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                            <span>M{lead.milestone} • {getMilestoneLabel(lead.milestone)}</span>
                                            <span className="flex items-center gap-0.5">
                                                <Flame className={cn('h-3 w-3', lead.heatScore >= 40 ? 'text-orange-500' : 'text-slate-300')} />
                                                {lead.heatScore}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {lead.source} • {formatCurrencyShort(lead.dealValue)}
                                        </p>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                                    <p className="text-xs text-amber-700">
                                        <span className="font-semibold">Lý do:</span> {lead.reason}
                                    </p>
                                    <p className="text-[10px] text-amber-500 mt-0.5">
                                        Từ: {lead.previousOwner} • {formatRelativeTime(lead.addedAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Assign Section */}
                            {assigningId === lead.id ? (
                                <div className="border-t border-slate-100 bg-slate-50 p-3">
                                    <p className="text-xs font-semibold text-slate-600 mb-2">Phân bổ cho:</p>
                                    <div className="space-y-1">
                                        {TEAM_MEMBERS.map(member => (
                                            <button
                                                key={member.id}
                                                onClick={() => handleAssign(lead.id, member.id)}
                                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-white transition-all active:scale-[0.98]"
                                            >
                                                <div className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                                                    {member.name.split(' ').pop()?.[0]}
                                                </div>
                                                <span className="flex-1 text-sm text-slate-700">{member.name}</span>
                                                <span className="text-[10px] text-slate-400">{member.activeLeads} leads</span>
                                                <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAssigningId(lead.id)}
                                    className="w-full border-t border-slate-100 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:bg-primary-50/50 transition-all"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Phân bổ lead
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
