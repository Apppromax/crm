import { BarChart3, TrendingUp, Users, Target, Calendar, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn, formatCurrencyShort } from '@/lib/utils'

// Mock report data
const weeklyData = [
    { week: 'T1', calls: 45, meetings: 3, won: 0, pipeline: 8_500_000_000 },
    { week: 'T2', calls: 52, meetings: 5, won: 1, pipeline: 12_200_000_000 },
    { week: 'T3', calls: 38, meetings: 4, won: 0, pipeline: 15_500_000_000 },
    { week: 'Nay', calls: 23, meetings: 2, won: 1, pipeline: 15_500_000_000 },
]

const milestoneDistribution = [
    { label: 'M1 Tiếp cận', count: 1, color: 'bg-sky-400' },
    { label: 'M2 Chào mồi', count: 1, color: 'bg-teal-400' },
    { label: 'M3 Niềm tin', count: 2, color: 'bg-amber-400' },
    { label: 'M4 Dồn chốt', count: 1, color: 'bg-orange-400' },
    { label: 'M5 Chốt cọc', count: 1, color: 'bg-emerald-400' },
]

export default function ReportsPage() {
    const totalCalls = weeklyData.reduce((s, w) => s + w.calls, 0)
    const totalMeetings = weeklyData.reduce((s, w) => s + w.meetings, 0)
    const totalWon = weeklyData.reduce((s, w) => s + w.won, 0)

    return (
        <div className="mx-auto max-w-2xl">
            <header className="sticky top-0 z-40 px-4 py-3 bg-white/20 backdrop-blur-2xl border-b border-white/40">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-teal-500" />
                            Báo cáo
                        </h1>
                        <p className="text-[11px] text-slate-500 mt-0.5">Tháng 3/2026</p>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-xl bg-teal-500/10 border border-teal-200/30 backdrop-blur-sm px-3 py-2 text-xs font-medium text-teal-600 hover:bg-teal-500/15 transition-all active:scale-[0.98]">
                        <Download className="h-3.5 w-3.5" />
                        Export
                    </button>
                </div>
            </header>

            <div className="px-4 py-4 space-y-4">
                {/* KPI Summary */}
                <div className="grid grid-cols-3 gap-3">
                    <KPICard label="Tổng cuộc gọi" value={`${totalCalls}`} change="+12%" positive />
                    <KPICard label="Gặp mặt" value={`${totalMeetings}`} change="+28%" positive />
                    <KPICard label="Chốt deal" value={`${totalWon}`} change="0%" positive={false} />
                </div>

                {/* Weekly Activity Chart */}
                <div className="mgr-glass-card p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        Hoạt động theo tuần
                    </h3>
                    <div className="space-y-3">
                        {weeklyData.map(w => {
                            const maxCalls = Math.max(...weeklyData.map(wd => wd.calls))
                            return (
                                <div key={w.week} className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 w-8 shrink-0 font-medium">{w.week}</span>
                                    <div className="flex-1 flex items-center gap-2">
                                        <div className="flex-1 h-6 rounded-lg bg-white/30 overflow-hidden relative">
                                            <div
                                                className="h-full rounded-lg bg-gradient-to-r from-teal-300 to-teal-500 flex items-center px-2"
                                                style={{ width: `${(w.calls / maxCalls) * 100}%` }}
                                            >
                                                <span className="text-[10px] font-bold text-white">{w.calls}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 w-10 justify-end">
                                            {Array.from({ length: w.meetings }).map((_, i) => (
                                                <div key={i} className="h-2 w-2 rounded-full bg-sky-400" />
                                            ))}
                                        </div>
                                        {w.won > 0 && (
                                            <span className="text-[10px] bg-emerald-500/15 text-emerald-600 px-1.5 py-0.5 rounded-md font-bold border border-emerald-200/30">
                                                ✓{w.won}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex gap-4 mt-3 pt-2 border-t border-white/20 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><span className="h-2 w-5 rounded bg-teal-400" /> Calls</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-400" /> Meetings</span>
                        <span className="flex items-center gap-1"><span className="text-emerald-600">✓</span> Won</span>
                    </div>
                </div>

                {/* Milestone Distribution */}
                <div className="mgr-glass-card p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Target className="h-4 w-4 text-slate-400" />
                        Phân bố Milestone
                    </h3>
                    <div className="h-8 rounded-xl overflow-hidden flex mb-3">
                        {milestoneDistribution.map(m => {
                            const total = milestoneDistribution.reduce((s, md) => s + md.count, 0)
                            const pct = (m.count / total) * 100
                            return (
                                <div
                                    key={m.label}
                                    className={cn('flex items-center justify-center text-[10px] font-bold text-white', m.color)}
                                    style={{ width: `${pct}%` }}
                                >
                                    {m.count}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {milestoneDistribution.map(m => (
                            <span key={m.label} className="flex items-center gap-1 text-[10px] text-slate-500">
                                <span className={cn('h-2 w-2 rounded-sm', m.color)} />
                                {m.label} ({m.count})
                            </span>
                        ))}
                    </div>
                </div>

                {/* Pipeline Value */}
                <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 p-5 text-white shadow-xl shadow-teal-500/20 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-teal-200" />
                        <span className="text-sm font-medium text-teal-100">Pipeline Value</span>
                    </div>
                    <p className="text-3xl font-bold">{formatCurrencyShort(15_500_000_000)}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-300" />
                        <span className="text-xs text-teal-200">+82% so với đầu tháng</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPICard({ label, value, change, positive }: {
    label: string; value: string; change: string; positive: boolean
}) {
    return (
        <div className="mgr-glass-card p-3 text-center">
            <p className="text-[10px] text-slate-400 mb-1">{label}</p>
            <p className="text-xl font-bold text-slate-700">{value}</p>
            <div className="flex items-center justify-center gap-0.5 mt-0.5">
                {positive ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                    <ArrowDownRight className="h-3 w-3 text-slate-400" />
                )}
                <span className={cn('text-[10px] font-medium', positive ? 'text-emerald-500' : 'text-slate-400')}>
                    {change}
                </span>
            </div>
        </div>
    )
}
