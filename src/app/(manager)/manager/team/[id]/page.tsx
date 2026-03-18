import { Suspense } from 'react'
import { ArrowLeft, MessageSquare, Eye, Flame, Target, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { cn, formatRelativeTime, getMilestoneLabel, formatCurrencyShort } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Loading from '@/app/(manager)/loading'

interface Props {
    params: Promise<{ id: string }>
}

export default function TeamMemberWrapper({ params }: Props) {
    return (
        <Suspense fallback={<Loading />}>
            <TeamMemberDetail params={params} />
        </Suspense>
    )
}

async function TeamMemberDetail({ params }: Props) {
    const { id } = await params

    const member = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            streakCount: true,
            role: true,
            assignedLeads: {
                where: { status: 'ACTIVE' },
                select: {
                    id: true,
                    name: true,
                    currentMilestone: true,
                    heatScore: true,
                    dealValue: true,
                    lastInteractionAt: true,
                    status: true,
                },
                orderBy: { heatScore: 'desc' },
            },
            interactions: {
                where: {
                    createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                },
                select: { id: true },
            },
            schedules: {
                where: {
                    status: 'PENDING',
                    scheduledAt: { gte: new Date() },
                },
                select: { id: true },
            },
        },
    })

    if (!member) notFound()

    const totalLeads = member.assignedLeads.length
    const interactionsWeek = member.interactions.length
    const pendingSchedules = member.schedules.length
    const wonLeads = await prisma.lead.count({
        where: { assignedTo: id, status: 'WON' },
    })

    // Compliance heuristic: interactions / (leads * 3) per week
    const expectedInteractions = Math.max(totalLeads * 3, 1)
    const compliance = Math.min(100, Math.round((interactionsWeek / expectedInteractions) * 100))

    const status = compliance >= 70 ? 'GREEN' : compliance >= 40 ? 'YELLOW' : 'RED' as const

    const statusColors = {
        GREEN: { bg: 'bg-emerald-500', label: 'On Track' },
        YELLOW: { bg: 'bg-amber-500', label: 'Cần hỗ trợ' },
        RED: { bg: 'bg-red-500', label: 'Cần can thiệp' },
    }
    const sc = statusColors[status]

    return (
        <div className="mx-auto max-w-2xl min-h-dvh">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-2xl border-b border-white/40">
                <Link href="/manager/team" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-white/30 transition-colors press-effect">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-base font-semibold text-slate-700">{member.name}</h1>
                    <p className="text-xs text-slate-400">{member.email}</p>
                </div>
                <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold text-white', sc.bg)}>
                    {sc.label}
                </span>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2 px-4 pt-4 stagger-children">
                <StatMini
                    icon={<Target className="h-4 w-4 text-primary-500" />}
                    value={`${compliance}%`}
                    label="Compliance"
                />
                <StatMini
                    icon={<Flame className="h-4 w-4 text-orange-500" />}
                    value={`${member.streakCount}`}
                    label="Streak"
                />
                <StatMini
                    icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                    value={`${wonLeads}`}
                    label="Chốt"
                />
                <StatMini
                    icon={<Clock className="h-4 w-4 text-slate-400" />}
                    value={`${interactionsWeek}`}
                    label="TT/tuần"
                />
            </div>

            {/* Lead List */}
            <div className="px-4 mt-5">
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                    Danh sách Lead ({totalLeads})
                </h3>
                <div className="space-y-2 stagger-children">
                    {member.assignedLeads.length === 0 ? (
                        <div className="py-12 text-center animate-fade-in">
                            <p className="text-sm text-slate-400">Chưa có lead nào</p>
                        </div>
                    ) : (
                        member.assignedLeads.map(lead => (
                            <Link key={lead.id} href={`/manager/shadow/${lead.id}`}>
                                <div className="mgr-glass-card p-3 flex items-center gap-3 transition-all active:scale-[0.98] press-effect">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/15 text-teal-600 text-xs font-bold shrink-0">
                                        {lead.name.split(' ').pop()?.[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">{lead.name}</p>
                                        <p className="text-[10px] text-slate-400">
                                            M{lead.currentMilestone} • {getMilestoneLabel(lead.currentMilestone)}
                                            {lead.dealValue ? ` • ${formatCurrencyShort(lead.dealValue)}` : ''}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className={cn(
                                            'text-xs font-bold',
                                            lead.heatScore >= 70 ? 'text-red-500' : lead.heatScore >= 40 ? 'text-orange-500' : 'text-slate-400'
                                        )}>
                                            🔥 {lead.heatScore}
                                        </span>
                                        <p className="text-[10px] text-slate-400">
                                            {lead.lastInteractionAt ? formatRelativeTime(
                                                typeof lead.lastInteractionAt === 'string' ? lead.lastInteractionAt : lead.lastInteractionAt.toISOString()
                                            ) : '-'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Summary */}
            <div className="px-4 mt-5 mb-24">
                <div className="mgr-glass-card p-4 text-center">
                    <p className="text-xs text-slate-400">
                        {pendingSchedules} lịch hẹn sắp tới • {interactionsWeek} tương tác tuần này
                    </p>
                </div>
            </div>
        </div>
    )
}

function StatMini({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="mgr-glass-card p-2.5 text-center">
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-sm font-bold text-slate-800">{value}</p>
            <p className="text-[10px] text-slate-400">{label}</p>
        </div>
    )
}
