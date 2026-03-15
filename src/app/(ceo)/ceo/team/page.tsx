import { ArrowLeft, Users, Trophy, TrendingUp, Target, Flame, Crown, Medal } from 'lucide-react'
import Link from 'next/link'
import { cn, formatCurrencyShort } from '@/lib/utils'

const TEAM_PERFORMANCE = [
    {
        id: '1', name: 'Nguyễn Văn A', role: 'Senior',
        revenue: 13_500_000_000, target: 15_000_000_000,
        deals: 3, leads: 12, streak: 5, compliance: 92,
        rank: 1,
    },
    {
        id: '2', name: 'Trần Minh B', role: 'Mid',
        revenue: 8_200_000_000, target: 10_000_000_000,
        deals: 2, leads: 8, streak: 2, compliance: 65,
        rank: 2,
    },
    {
        id: '3', name: 'Lê Thị C', role: 'Junior',
        revenue: 3_000_000_000, target: 8_000_000_000,
        deals: 1, leads: 15, streak: 0, compliance: 38,
        rank: 3,
    },
]

const rankIcons = [Crown, Medal, Medal]
const rankColors = ['text-amber-400', 'text-slate-300', 'text-amber-700']

export default function CEOTeamPage() {
    const totalRevenue = TEAM_PERFORMANCE.reduce((s, t) => s + t.revenue, 0)
    const totalTarget = TEAM_PERFORMANCE.reduce((s, t) => s + t.target, 0)
    const totalDeals = TEAM_PERFORMANCE.reduce((s, t) => s + t.deals, 0)

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
                            {Math.round((totalRevenue / totalTarget) * 100)}%
                        </p>
                        <p className="text-[10px] text-slate-500">vs Target</p>
                    </div>
                </div>

                {/* Individual Cards */}
                {TEAM_PERFORMANCE.map((member, idx) => {
                    const RankIcon = rankIcons[idx] || Medal
                    const pct = Math.round((member.revenue / member.target) * 100)
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
                                    <RankIcon className={cn('absolute -top-1 -right-1 h-4 w-4', rankColors[idx])} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                                    <p className="text-xs text-slate-500">{member.role} • #{member.rank}</p>
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
                })}
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
