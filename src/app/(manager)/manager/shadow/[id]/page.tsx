import { Suspense } from 'react'
import { ArrowLeft, Phone, MessageSquare, FileText, Clock, Target, Flame, Eye, TrendingUp } from 'lucide-react'
import { cn, formatRelativeTime, getMilestoneLabel, formatCurrencyShort } from '@/lib/utils'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Loading from '@/app/(manager)/loading'

interface Props {
    params: Promise<{ id: string }>
}

export default function ShadowWrapper({ params }: Props) {
    return (
        <Suspense fallback={<Loading />}>
            <ShadowPage params={params} />
        </Suspense>
    )
}

async function ShadowPage({ params }: Props) {
    const { id } = await params

    // Fetch lead with detail + interactions + assignee
    const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
            assignee: { select: { name: true, email: true, streakCount: true } },
            source: { select: { name: true } },
            interactions: {
                orderBy: { createdAt: 'desc' },
                take: 10,
                select: {
                    id: true,
                    type: true,
                    content: true,
                    createdAt: true,
                },
            },
            milestoneHistory: {
                orderBy: { changedAt: 'desc' },
                take: 5,
                select: {
                    fromMilestone: true,
                    toMilestone: true,
                    changedAt: true,
                    reason: true,
                },
            },
            schedules: {
                where: { status: 'PENDING' },
                orderBy: { scheduledAt: 'asc' },
                take: 3,
                select: {
                    type: true,
                    scheduledAt: true,
                    note: true,
                },
            },
        },
    })

    if (!lead) notFound()

    const milestonePercent = lead.currentMilestone * 20

    const typeIcons: Record<string, { icon: string; color: string }> = {
        CALL: { icon: '📞', color: 'bg-emerald-50 text-emerald-600' },
        CHAT: { icon: '💬', color: 'bg-blue-50 text-blue-600' },
        MEETING: { icon: '🤝', color: 'bg-amber-50 text-amber-600' },
        NOTE: { icon: '📝', color: 'bg-slate-50 text-slate-600' },
        EMAIL: { icon: '✉️', color: 'bg-indigo-50 text-indigo-600' },
    }

    return (
        <div className="mx-auto max-w-2xl min-h-dvh">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center gap-3 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <Link href="/manager" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors press-effect">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-indigo-500" />
                        <h1 className="text-base font-semibold text-slate-900">{lead.name}</h1>
                    </div>
                    <p className="text-xs text-slate-400">
                        {lead.assignee?.name || 'Chưa gán'} • {lead.source?.name || 'Unknown'}
                    </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                    Chế độ xem
                </span>
            </header>

            {/* Milestone Bar */}
            <div className="px-4 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600">
                        M{lead.currentMilestone} — {getMilestoneLabel(lead.currentMilestone)}
                    </span>
                    <span className="text-[10px] text-slate-400">{milestonePercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 milestone-bar"
                        style={{ width: `${milestonePercent}%` }}
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 px-4 pt-4 stagger-children">
                <div className="rounded-xl bg-white border border-slate-100 p-3 text-center">
                    <p className={cn(
                        'text-lg font-bold',
                        lead.heatScore >= 70 ? 'text-red-500' : lead.heatScore >= 40 ? 'text-orange-500' : 'text-slate-600'
                    )}>
                        🔥 {lead.heatScore}
                    </p>
                    <p className="text-[10px] text-slate-400">Heat Score</p>
                </div>
                <div className="rounded-xl bg-white border border-slate-100 p-3 text-center">
                    <p className="text-lg font-bold text-slate-800">{lead.interactions.length}</p>
                    <p className="text-[10px] text-slate-400">Tương tác</p>
                </div>
                <div className="rounded-xl bg-white border border-slate-100 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-600">
                        {lead.dealValue ? formatCurrencyShort(lead.dealValue) : 'N/A'}
                    </p>
                    <p className="text-[10px] text-slate-400">Giá trị</p>
                </div>
            </div>

            {/* BANT */}
            {(lead.bantBudget || lead.bantAuthority || lead.bantNeed || lead.bantTimeline) && (
                <div className="mx-4 mt-4 rounded-xl bg-white border border-slate-100 p-4">
                    <h3 className="text-xs font-bold text-slate-600 mb-2">BANT</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-slate-400">Budget:</span> <span className="font-medium text-slate-700">{lead.bantBudget || '-'}</span></div>
                        <div><span className="text-slate-400">Authority:</span> <span className="font-medium text-slate-700">{lead.bantAuthority || '-'}</span></div>
                        <div><span className="text-slate-400">Need:</span> <span className="font-medium text-slate-700">{lead.bantNeed || '-'}</span></div>
                        <div><span className="text-slate-400">Timeline:</span> <span className="font-medium text-slate-700">{lead.bantTimeline || '-'}</span></div>
                    </div>
                </div>
            )}

            {/* Upcoming Schedules */}
            {lead.schedules.length > 0 && (
                <div className="mx-4 mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
                    <h3 className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Lịch hẹn sắp tới
                    </h3>
                    <div className="space-y-2">
                        {lead.schedules.map((s, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <span className="text-amber-800">{s.type} {s.note ? `— ${s.note}` : ''}</span>
                                <span className="text-amber-600 font-medium">
                                    {new Date(s.scheduledAt).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Interaction History */}
            <div className="px-4 mt-5 mb-24">
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                    Lịch sử tương tác ({lead.interactions.length})
                </h3>
                <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-100" />
                    <div className="space-y-1 stagger-children">
                        {lead.interactions.map((act) => {
                            const ti = typeIcons[act.type] || typeIcons['NOTE']
                            return (
                                <div key={act.id} className="relative flex gap-3 rounded-xl p-3">
                                    <div className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm', ti.color)}>
                                        {ti.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700 leading-relaxed">{act.content || act.type}</p>
                                        <span className="text-[10px] text-slate-400">
                                            {formatRelativeTime(typeof act.createdAt === 'string' ? act.createdAt : act.createdAt.toISOString())}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        {lead.interactions.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-8">Chưa có tương tác nào</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
