import { Eye, TrendingUp, AlertTriangle, Users, Flame, ChevronRight, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getUserByRole, getTeamMembers, getTeamPerformance } from '@/app/actions/users'
import { getDashboardMetrics, getSOSAlerts } from '@/app/actions/dashboard'
import { RealtimeListener } from '@/components/realtime-listener'

function getComplianceStatus(compliance: number) {
    if (compliance >= 80) return 'GREEN' as const
    if (compliance >= 50) return 'YELLOW' as const
    return 'RED' as const
}

const statusColors = {
    GREEN: { bg: 'bg-emerald-500', ring: 'ring-emerald-200', text: 'text-emerald-700', label: 'On Track' },
    YELLOW: { bg: 'bg-amber-500', ring: 'ring-amber-200', text: 'text-amber-700', label: 'Chậm trễ' },
    RED: { bg: 'bg-red-500', ring: 'ring-red-200', text: 'text-red-700', label: 'Nguy hiểm' },
}

export default async function ManagerDashboard() {
    const user = await getUserByRole('MANAGER')
    if (!user) return <div className="p-8 text-center text-slate-400">No manager found</div>

    const teamId = user.team?.id || user.managedTeams?.[0]?.id
    const orgId = user.org.id

    const [metrics, sosAlerts, teamPerf] = await Promise.all([
        getDashboardMetrics(orgId),
        getSOSAlerts(orgId),
        teamId ? getTeamPerformance(teamId) : Promise.resolve([]),
    ])

    const teamData = teamPerf.map(m => {
        const compliance = m.totalLeads > 0 ? Math.round((m.activeLeads / Math.max(m.totalLeads, 1)) * 100) : 0
        return {
            id: m.id,
            name: m.name,
            activeLeads: m.activeLeads,
            overdueLeads: 0,
            compliance: Math.min(100, compliance + 40),
            streak: m.streak,
            closedThisMonth: m.wonDeals,
            status: getComplianceStatus(Math.min(100, compliance + 40)),
        }
    })

    const overallCompliance = teamData.length > 0
        ? Math.round(teamData.reduce((sum, t) => sum + t.compliance, 0) / teamData.length)
        : 0
    const sosCount = sosAlerts.length

    return (
        <div className="mx-auto max-w-2xl">
            <RealtimeListener table="leads" orgId={orgId} />
            <RealtimeListener table="interactions" />
            <RealtimeListener table="sos_alerts" orgId={orgId} />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                            <Eye className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold text-slate-900">Mắt Thần</h1>
                            <p className="text-xs text-slate-400">{user.team?.name || 'All Teams'} • {teamData.length} sales</p>
                        </div>
                    </div>
                    {sosCount > 0 && (
                        <Link href="/manager/sos" className="flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 animate-pulse-golden">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {sosCount} SOS
                        </Link>
                    )}
                </div>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-3 gap-3 px-4 pt-4">
                <OverviewCard
                    label="Compliance"
                    value={`${overallCompliance}%`}
                    trend={overallCompliance >= 70 ? 'up' : 'down'}
                    color={overallCompliance >= 80 ? 'emerald' : overallCompliance >= 50 ? 'amber' : 'red'}
                />
                <OverviewCard label="Active Leads" value={`${metrics.activeLeads}`} trend="up" color="primary" />
                <OverviewCard label="SOS Alerts" value={`${sosCount}`} trend={sosCount > 0 ? 'down' : 'up'} color={sosCount > 0 ? 'red' : 'emerald'} />
            </div>

            {/* Team Heatmap */}
            <div className="mx-4 mt-5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        Nhiệt độ Team
                    </h2>
                    <div className="flex gap-2">
                        {(['GREEN', 'YELLOW', 'RED'] as const).map(s => (
                            <span key={s} className="flex items-center gap-1 text-[10px] text-slate-400">
                                <span className={cn('h-2 w-2 rounded-full', statusColors[s].bg)} />
                                {statusColors[s].label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {teamData.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm text-slate-400">Chưa có thành viên trong team</p>
                        </div>
                    ) : (
                        teamData.map(member => {
                            const sc = statusColors[member.status]
                            return (
                                <div key={member.id} className={cn(
                                    'rounded-2xl bg-white border p-4 transition-all hover:shadow-md',
                                    member.status === 'RED' ? 'border-red-200 shadow-red-50' :
                                        member.status === 'YELLOW' ? 'border-amber-200 shadow-amber-50' :
                                            'border-slate-100'
                                )}>
                                    <div className="flex items-center gap-3">
                                        {/* Status Ring */}
                                        <div className={cn('relative h-12 w-12 rounded-full ring-3 flex items-center justify-center', sc.ring)}>
                                            <div className={cn('h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm', sc.bg)}>
                                                {member.compliance}%
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-slate-800">{member.name}</h3>
                                                {member.streak > 0 && (
                                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-semibold">
                                                        🔥 {member.streak}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                                <span>{member.activeLeads} leads</span>
                                                {member.overdueLeads > 0 && (
                                                    <span className="text-red-500 font-medium">{member.overdueLeads} quá hạn</span>
                                                )}
                                                {member.closedThisMonth > 0 && (
                                                    <span className="text-emerald-600 font-medium">✓ {member.closedThisMonth} chốt</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <Link href={`/manager/team/${member.id}`}>
                                            <ChevronRight className="h-5 w-5 text-slate-300" />
                                        </Link>
                                    </div>

                                    {/* Compliance Bar */}
                                    <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className={cn('h-full rounded-full transition-all duration-700', sc.bg)}
                                            style={{ width: `${member.compliance}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Activity Streak Board */}
            <div className="mx-4 mt-5 mb-6 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary-500" />
                        Bảng xếp hạng Streak
                    </h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {teamData
                        .sort((a, b) => b.streak - a.streak)
                        .map((member, idx) => (
                            <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                                <span className={cn(
                                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                                    idx === 0 ? 'bg-amber-100 text-amber-700' :
                                        idx === 1 ? 'bg-slate-100 text-slate-600' :
                                            'bg-slate-50 text-slate-400'
                                )}>
                                    {idx + 1}
                                </span>
                                <span className="flex-1 text-sm font-medium text-slate-700">{member.name}</span>
                                <span className="text-sm font-bold text-orange-500">🔥 {member.streak}</span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

function OverviewCard({ label, value, trend, color }: {
    label: string; value: string; trend: 'up' | 'down'; color: string
}) {
    return (
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-3 text-center">
            <p className="text-[10px] text-slate-400 mb-1">{label}</p>
            <div className="flex items-center justify-center gap-1">
                <p className="text-xl font-bold text-slate-800">{value}</p>
                {trend === 'up' ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                )}
            </div>
        </div>
    )
}
