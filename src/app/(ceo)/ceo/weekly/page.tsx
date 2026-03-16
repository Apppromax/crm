import { Suspense } from 'react'
import { getUserByRole } from '@/app/actions/users'
import { generateWeeklySnapshot } from '@/app/actions/weekly-snapshot'
import { formatCurrencyShort } from '@/lib/utils'
import { Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Copy, Users, AlertTriangle } from 'lucide-react'
import Loading from '@/app/(ceo)/loading'
import { CopyReportButton } from './copy-button'

export default function WeeklyReportPage() {
    return (
        <Suspense fallback={<Loading />}>
            <WeeklyReportContent />
        </Suspense>
    )
}

async function WeeklyReportContent() {
    const user = await getUserByRole('CEO')
    if (!user) return <div className="p-8 text-center text-slate-400">No CEO user found</div>

    const snapshot = await generateWeeklySnapshot(user.org.id)

    return (
        <div className="mx-auto max-w-2xl px-4 py-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">Báo Cáo Tuần</h1>
                    <p className="text-xs text-slate-500">{snapshot.period}</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <MetricCard
                    label="Deals Won"
                    value={String(snapshot.metrics.wonDeals)}
                    icon={<TrendingUp className="h-4 w-4" />}
                    color="emerald"
                />
                <MetricCard
                    label="Doanh thu"
                    value={formatCurrencyShort(snapshot.metrics.revenue)}
                    icon={<span>💰</span>}
                    color="amber"
                />
                <MetricCard
                    label="Leads mới"
                    value={String(snapshot.metrics.newLeads)}
                    icon={<Users className="h-4 w-4" />}
                    color="sky"
                />
                <MetricCard
                    label="Tỷ lệ chốt"
                    value={`${snapshot.metrics.conversionRate}%`}
                    icon={<span>🎯</span>}
                    color="indigo"
                />
            </div>

            {/* Activity */}
            <div className="glass rounded-2xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">📈 Hoạt Động</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xl font-bold text-white">{snapshot.metrics.totalInteractions}</p>
                        <p className="text-[10px] text-slate-500">Tương tác</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-white">{snapshot.metrics.avgDailyInteractions}</p>
                        <p className="text-[10px] text-slate-500">/ngày</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-white">{snapshot.metrics.lostLeads}</p>
                        <p className="text-[10px] text-slate-500">Mất leads</p>
                    </div>
                </div>
            </div>

            {/* Milestone Movement */}
            <div className="glass rounded-2xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">🔄 Chuyển Động Mốc</h3>
                <div className="flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                        <div>
                            <p className="text-2xl font-bold text-emerald-400">{snapshot.milestoneMovement.promotions}</p>
                            <p className="text-[10px] text-slate-500">Thăng mốc</p>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <ArrowDownRight className="h-5 w-5 text-red-400" />
                        <div>
                            <p className="text-2xl font-bold text-red-400">{snapshot.milestoneMovement.demotions}</p>
                            <p className="text-[10px] text-slate-500">Rớt mốc</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            {snapshot.topPerformers.length > 0 && (
                <div className="glass rounded-2xl p-4 mb-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">🏆 Top Performers</h3>
                    <div className="space-y-2">
                        {snapshot.topPerformers.map((p, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{['🥇', '🥈', '🥉'][i]}</span>
                                    <span className="text-sm text-slate-300">{p.name}</span>
                                </div>
                                <span className="text-xs text-slate-500">{p.interactions} tương tác</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Alerts */}
            {snapshot.alerts.length > 0 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 mb-4">
                    <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Cần Lưu Ý
                    </h3>
                    <div className="space-y-1.5">
                        {snapshot.alerts.map((a, i) => (
                            <p key={i} className="text-xs text-amber-300/80">{a}</p>
                        ))}
                    </div>
                </div>
            )}

            {/* Copy to Zalo/Telegram */}
            <CopyReportButton textReport={snapshot.textReport} />

            {/* Preview */}
            <div className="glass rounded-2xl p-4 mt-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                    📋 Preview (Zalo / Telegram)
                </h3>
                <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono leading-relaxed bg-black/30 rounded-xl p-3">
                    {snapshot.textReport}
                </pre>
            </div>
        </div>
    )
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-500/10 text-emerald-400',
        amber: 'bg-amber-500/10 text-amber-400',
        sky: 'bg-sky-500/10 text-sky-400',
        indigo: 'bg-indigo-500/10 text-indigo-400',
    }

    return (
        <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${colorMap[color]}`}>
                    {icon}
                </div>
                <span className="text-xs text-slate-500">{label}</span>
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    )
}
