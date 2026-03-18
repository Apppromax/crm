'use client'

import { useState } from 'react'
import { Archive, UserPlus, Flame, Search, ArrowRight, Loader2 } from 'lucide-react'
import { cn, formatCurrencyShort, formatRelativeTime, getMilestoneLabel } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { assignLead } from '@/app/actions/leads'

interface PoolLead {
    id: string
    name: string
    source: string
    milestone: number
    heatScore: number
    dealValue: number | null
    previousOwner: string
    updatedAt: string
}

interface TeamMember {
    id: string
    name: string
    activeLeads: number
}

interface Props {
    leads: PoolLead[]
    teamMembers: TeamMember[]
    teamId: string
}

export function LeadPoolClient({ leads, teamMembers, teamId }: Props) {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [assigningId, setAssigningId] = useState<string | null>(null)
    const [assignedIds, setAssignedIds] = useState<string[]>([])
    const [busyAssign, setBusyAssign] = useState<string | null>(null)

    const filtered = leads.filter(l =>
        !assignedIds.includes(l.id) &&
        l.name.toLowerCase().includes(search.toLowerCase())
    )

    async function handleAssign(leadId: string, memberId: string) {
        setAssignedIds(prev => [...prev, leadId])
        setAssigningId(null)

        assignLead(leadId, memberId, teamId)
            .then(() => router.refresh())
            .catch(err => {
                console.error('Assign failed:', err)
                setAssignedIds(prev => prev.filter(id => id !== leadId))
            })
    }

    return (
        <div className="mx-auto max-w-2xl min-h-dvh">
            <header className="sticky top-0 z-40 px-4 py-3 bg-white/20 backdrop-blur-2xl border-b border-white/40">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Archive className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-800">Kho Lead Chung</h1>
                        <p className="text-[11px] text-slate-500">{filtered.length} leads chờ phân bổ</p>
                    </div>
                </div>
            </header>

            <div className="px-4 pt-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm lead..."
                        className="w-full rounded-xl border border-white/50 bg-white/40 backdrop-blur-sm py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-400 focus:bg-white/60 focus:ring-2 focus:ring-teal-400/20 transition-all"
                    />
                </div>
            </div>

            <div className="px-4 py-3 space-y-3 stagger-children">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <Archive className="h-14 w-14 text-slate-300/60 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 font-medium">Kho trống!</p>
                        <p className="text-xs text-slate-400 mt-1">Tất cả leads đã được phân bổ</p>
                    </div>
                ) : (
                    filtered.map(lead => (
                        <div key={lead.id} className="mgr-glass-card overflow-hidden animate-slide-up">
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 text-sm font-bold">
                                        {lead.name.split(' ').pop()?.[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-slate-700">{lead.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                            <span>M{lead.milestone} • {getMilestoneLabel(lead.milestone)}</span>
                                            <span className="flex items-center gap-0.5">
                                                <Flame className={cn('h-3 w-3', lead.heatScore >= 40 ? 'text-orange-500' : 'text-slate-300')} />
                                                {lead.heatScore}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {lead.source} • {lead.dealValue ? formatCurrencyShort(lead.dealValue) : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 rounded-xl bg-amber-500/8 border border-amber-200/30 backdrop-blur-sm px-3 py-2">
                                    <p className="text-xs text-amber-600">
                                        <span className="font-semibold">Từ:</span> {lead.previousOwner} • {formatRelativeTime(new Date(lead.updatedAt))}
                                    </p>
                                </div>
                            </div>

                            {assigningId === lead.id ? (
                                <div className="border-t border-white/30 bg-white/20 backdrop-blur-sm p-3">
                                    <p className="text-xs font-semibold text-slate-600 mb-2">Phân bổ cho:</p>
                                    <div className="space-y-1">
                                        {teamMembers.map(member => (
                                            <button
                                                key={member.id}
                                                onClick={() => handleAssign(lead.id, member.id)}
                                                disabled={busyAssign !== null}
                                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-white/30 transition-all active:scale-[0.98] disabled:opacity-40"
                                            >
                                                <div className="h-7 w-7 rounded-full bg-teal-500/15 text-teal-600 flex items-center justify-center text-xs font-bold">
                                                    {member.name.split(' ').pop()?.[0]}
                                                </div>
                                                <span className="flex-1 text-sm text-slate-600">{member.name}</span>
                                                <span className="text-[10px] text-slate-400">{member.activeLeads} leads</span>
                                                {busyAssign === member.id ? (
                                                    <Loader2 className="h-3.5 w-3.5 text-teal-500 animate-spin" />
                                                ) : (
                                                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAssigningId(lead.id)}
                                    className="w-full border-t border-white/30 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-teal-600 hover:bg-white/20 transition-all"
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
