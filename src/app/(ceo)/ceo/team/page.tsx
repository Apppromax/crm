import { Suspense } from 'react'
import { ArrowLeft, Users, Trophy, TrendingUp, Target, Flame, Crown, Medal } from 'lucide-react'
import Link from 'next/link'
import { cn, formatCurrencyShort } from '@/lib/utils'
import { getUserByRole } from '@/app/actions/users'
import { getCachedAllTeamPerformance } from '@/lib/cache'
import Loading from '@/app/(ceo)/loading'

const rankIcons = [Crown, Medal, Medal]
const rankColors = ['text-amber-400', 'text-slate-300', 'text-amber-700']

export default function CEOTeamPage() {
    return (
        <Suspense fallback={<Loading />}>
            <CEOTeamContent />
        </Suspense>
    )
}

async function CEOTeamContent() {
    const user = await getUserByRole('CEO')
    if (!user) return <div className="p-8 text-center text-slate-400">No CEO found</div>

    const allPerf = await getCachedAllTeamPerformance(user.org.id)

    const teamPerf = allPerf.map(m => {
        const target = 10_000_000_000
        const compliance = (m.activeLeads + m.wonDeals) > 0
            ? Math.min(100, Math.round((m.activeLeads / Math.max(m.activeLeads + m.wonDeals, 1)) * 100) + 40)
            : 0
        return {
            id: m.id,
            name: m.name,
            revenue: m.revenue,
            target,
            pipeline: m.pipeline,
            deals: m.wonDeals,
            leads: m.activeLeads,
            streak: m.streak,
            compliance,
        }
    }).sort((a, b) => b.revenue - a.revenue || b.deals - a.deals || b.streak - a.streak)

    const totalRevenue = teamPerf.reduce((s, t) => s + t.revenue, 0)
    const totalTarget = teamPerf.reduce((s, t) => s + t.target, 0)
    const totalDeals = teamPerf.reduce((s, t) => s + t.deals, 0)

    return (
        <div className="mx-auto max-w-2xl min-h-dvh bg-slate-950">
            <header className="sticky top-0 z-40 flex items-center gap-3 bg-slate-950/90 px-4 py-3 backdrop-blur-xl border-b border-white/5">
                <Link href="/ceo" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-base font-semibold text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-cyan-400" />
                    Hiệu Suất Đội Ngũ
                </h1>
            </header>

            <div className="px-4 py-4 space-y-5 pb-12">
                {/* Team Summary */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                        <p className="text-sm font-bold text-cyan-400">{formatCurrencyShort(totalRevenue)}</p>
                        <p className="text-[10px] text-slate-500">Tổng doanh thu</p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                        <p className="text-sm font-bold text-white">{totalDeals}</p>
                        <p className="text-[10px] text-slate-500">Deals chốt</p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                        <p className={cn('text-sm font-bold', totalRevenue >= totalTarget ? 'text-emerald-400' : 'text-amber-400')}>
                            {totalTarget > 0 ? Math.round((totalRevenue / totalTarget) * 100) : 0}%
                        </p>
                        <p className="text-[10px] text-slate-500">vs Target</p>
                    </div>
                </div>

                {/* Individual Cards */}
                {teamPerf.length === 0 ? (
                    <div className="py-16 text-center">
                        <Users className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">Chưa có dữ liệu team</p>
                    </div>
                ) : (
                    teamPerf.map((member, idx) => {
                        const RankIcon = rankIcons[idx] || Medal
                        const pct = member.target > 0 ? Math.round((member.revenue / member.target) * 100) : 0
                        return (
                            <div key={member.id} className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
                                {/* Header */}
                                <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5">
                                    <div className="relative">
                                        <div className={cn(
                                            'flex h-12 w-12 items-center justify-center rounded-full text-base font-bold',
                                            idx === 0 ? 'bg-amber-500/20 text-amber-400' :
                                                idx === 1 ? 'bg-slate-500/20 text-slate-300' :
                                                    'bg-amber-800/20 text-amber-700'
                                        )}>
                                            {member.name.split(' ').pop()?.[0]}
                                        </div>
                                        <RankIcon className={cn('absolute -top-1 -right-1 h-4 w-4', rankColors[idx] || 'text-slate-600')} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                                        <p className="text-xs text-slate-500">#{idx + 1}</p>
                                    </div>
                                    {member.streak > 0 && (
                                        <span className="flex items-center gap-1 text-xs text-orange-400">
                                            <Flame className="h-3.5 w-3.5" />
                                            {member.streak}
                                        </span>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="px-4 py-3">
                                    {/* Revenue bar */}
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-slate-400">Doanh thu</span>
                                        <span className="text-xs font-semibold text-white">
                                            {formatCurrencyShort(member.revenue)} / {formatCurrencyShort(member.target)}
                                        </span>
                                    </div>
                                    <div className="h-2.5 rounded-full bg-white/5 overflow-hidden mb-3">
                                        <div
                                            className={cn(
                                                'h-full rounded-full transition-all',
                                                pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-cyan-500' : 'bg-amber-500'
                                            )}
                                            style={{ width: `${Math.min(pct, 100)}%` }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <MiniStat icon={<Trophy className="h-3 w-3" />} value={`${member.deals}`} label="Deals" className="text-emerald-400" />
                                        <MiniStat icon={<Target className="h-3 w-3" />} value={`${member.compliance}%`} label="Compliance" className="text-cyan-400" />
                                        <MiniStat icon={<TrendingUp className="h-3 w-3" />} value={`${member.leads}`} label="Leads" className="text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

function MiniStat({ icon, value, label, className }: {
    icon: React.ReactNode; value: string; label: string; className?: string
}) {
    return (
        <div className="text-center">
            <div className={cn('flex items-center justify-center gap-1 text-xs font-bold', className)}>
                {icon} {value}
            </div>
            <p className="text-[10px] text-slate-600">{label}</p>
        </div>
    )
}

