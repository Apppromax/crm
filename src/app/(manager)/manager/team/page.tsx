import { Suspense } from 'react'
import { Users, ChevronRight, Flame, Target } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getUserByRole, getTeamPerformance } from '@/app/actions/users'
import Loading from '@/app/(manager)/loading'

function getStatusConfig(compliance: number) {
    if (compliance >= 80) return { bg: 'bg-emerald-500/15', text: 'text-emerald-600', dot: 'bg-emerald-500' }
    if (compliance >= 50) return { bg: 'bg-amber-500/15', text: 'text-amber-600', dot: 'bg-amber-500' }
    return { bg: 'bg-red-500/15', text: 'text-red-600', dot: 'bg-red-500' }
}

export default function TeamPage() {
    return (
        <Suspense fallback={<Loading />}>
            <TeamContent />
        </Suspense>
    )
}

async function TeamContent() {
    const user = await getUserByRole('MANAGER')
    if (!user) return <div className="p-8 text-center text-slate-400">No manager found</div>

    const teamId = user.team?.id || user.managedTeams?.[0]?.id
    const teamPerf = teamId ? await getTeamPerformance(teamId) : []

    const teamMembers = teamPerf.map(m => {
        const compliance = m.totalLeads > 0 ? Math.min(100, Math.round((m.activeLeads / Math.max(m.totalLeads, 1)) * 100) + 40) : 0
        return {
            id: m.id,
            name: m.name,
            leads: m.activeLeads,
            compliance,
            streak: m.streak,
            status: getStatusConfig(compliance),
        }
    })

    return (
        <div className="mx-auto max-w-2xl">
            <header className="sticky top-0 z-40 px-4 py-3 bg-white/20 backdrop-blur-2xl border-b border-white/40">
                <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-teal-500" />
                    Quản lý Team
                </h1>
                <p className="text-[11px] text-slate-500 mt-0.5">{user.team?.name || 'All Teams'} • {teamMembers.length} thành viên</p>
            </header>

            <div className="px-4 py-4 space-y-3 stagger-children">
                {teamMembers.length === 0 ? (
                    <div className="py-16 text-center">
                        <Users className="h-12 w-12 text-slate-300/60 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">Chưa có thành viên</p>
                    </div>
                ) : (
                    teamMembers.map(member => {
                        const sc = member.status
                        return (
                            <Link key={member.id} href={`/manager/team/${member.id}`}>
                                <div className="mgr-glass-card p-4 transition-all active:scale-[0.99]">
                                    <div className="flex items-center gap-3">
                                        <div className={cn('h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold', sc.bg, sc.text)}>
                                            {member.name.split(' ').pop()?.[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-slate-700">{member.name}</h3>
                                                <span className={cn('h-2 w-2 rounded-full', sc.dot)} />
                                            </div>
                                            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                                                <span>{member.leads} leads</span>
                                                <span className="flex items-center gap-0.5">
                                                    <Target className="h-3 w-3" /> {member.compliance}%
                                                </span>
                                                {member.streak > 0 && (
                                                    <span className="flex items-center gap-0.5 text-orange-500">
                                                        <Flame className="h-3 w-3" /> {member.streak}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
        </div>
    )
}
