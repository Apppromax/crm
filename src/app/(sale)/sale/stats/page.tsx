import { MOCK_LEADS, MOCK_STATS } from '@/lib/mock-data'
import { formatCurrencyShort, getMilestoneLabel } from '@/lib/utils'
import { TrendingUp, Target, Flame, Trophy, Users, Clock } from 'lucide-react'

export default function StatsPage() {
    const activeMilestones = [1, 2, 3, 4, 5].map(m => ({
        milestone: m,
        count: MOCK_LEADS.filter(l => l.currentMilestone === m && l.status === 'ACTIVE').length,
        label: getMilestoneLabel(m),
    }))

    return (
        <div className="mx-auto max-w-lg">
            <header className="sticky top-0 z-40 bg-transparent px-4 py-3">
                <h1 className="text-lg font-bold text-slate-800">Thống kê</h1>
            </header>

            <div className="px-4 py-4 space-y-4">
                {/* Revenue Summary */}
                <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-5 text-white shadow-xl shadow-primary-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-primary-200" />
                        <span className="text-sm font-medium text-primary-100">Pipeline Value</span>
                    </div>
                    <p className="text-3xl font-bold">{formatCurrencyShort(MOCK_STATS.pipelineValue)}</p>
                    <p className="text-sm text-primary-200 mt-1">{MOCK_STATS.totalLeads} leads đang theo</p>
                </div>

                {/* Quick KPIs */}
                <div className="grid grid-cols-2 gap-3">
                    <StatCard icon={<Trophy className="h-5 w-5 text-emerald-500" />} label="Đã chốt" value={`${MOCK_STATS.wonThisMonth}`} subtitle="tháng này" color="emerald" />
                    <StatCard icon={<Flame className="h-5 w-5 text-orange-500" />} label="Streak" value={`${MOCK_STATS.streakCount} ngày`} subtitle="liên tiếp" color="orange" />
                    <StatCard icon={<Target className="h-5 w-5 text-primary-500" />} label="Mốc 4-5" value={`${MOCK_STATS.milestone45}`} subtitle="sắp chốt" color="primary" />
                    <StatCard icon={<Clock className="h-5 w-5 text-amber-500" />} label="72h Vàng" value={`${MOCK_LEADS.filter(l => l.golden72hExpiresAt).length}`} subtitle="đang active" color="amber" />
                </div>

                {/* Funnel Chart */}
                <div className="mgr-glass-card p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        Phễu bán hàng
                    </h3>
                    <div className="space-y-2">
                        {activeMilestones.map(m => {
                            const maxCount = Math.max(...activeMilestones.map(am => am.count), 1)
                            const widthPct = Math.max((m.count / maxCount) * 100, 8)
                            return (
                                <div key={m.milestone} className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 w-8 shrink-0">M{m.milestone}</span>
                                    <div className="flex-1">
                                        <div className="h-8 rounded-lg bg-white/50 overflow-hidden relative">
                                            <div
                                                className="h-full rounded-lg bg-gradient-to-r from-primary-400 to-primary-500 flex items-center px-2 transition-all duration-500"
                                                style={{ width: `${widthPct}%` }}
                                            >
                                                <span className="text-xs font-bold text-white">{m.count}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 w-24 truncate text-right">{m.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, subtitle, color }: {
    icon: React.ReactNode
    label: string
    value: string
    subtitle: string
    color: string
}) {
    return (
        <div className="mgr-glass-card p-4">
            <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-slate-400">{label}</span></div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
        </div>
    )
}
