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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15">
                    <Calendar className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Báo Cáo Tuần</h1>
                    <p className="text-xs text-slate-400">{snapshot.period}</p>
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
                    color="teal"
                />
                <MetricCard
                    label="Tỷ lệ chốt"
                    value={`${snapshot.metrics.conversionRate}%`}
                    icon={<span>🎯</span>}
                    color="slate"
                />
            </div>

            {/* Activity */}
            <div className="mgr-glass-card p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-600 mb-3">📈 Hoạt Động</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xl font-bold text-slate-700">{snapshot.metrics.totalInteractions}</p>
                        <p className="text-[10px] text-slate-400">Tương tác</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-700">{snapshot.metrics.avgDailyInteractions}</p>
                        <p className="text-[10px] text-slate-400">/ngày</p>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-700">{snapshot.metrics.lostLeads}</p>
                        <p className="text-[10px] text-slate-400">Mất leads</p>
                    </div>
                </div>
            </div>

            {/* Milestone Movement */}
            <div className="mgr-glass-card p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-600 mb-3">🔄 Chuyển Động Mốc</h3>
                <div className="flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                        <div>
                            <p className="text-2xl font-bold text-emerald-500">{snapshot.milestoneMovement.promotions}</p>
                            <p className="text-[10px] text-slate-400">Thăng mốc</p>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/40" />
                    <div className="flex items-center gap-2">
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                        <div>
                            <p className="text-2xl font-bold text-red-500">{snapshot.milestoneMovement.demotions}</p>
                            <p className="text-[10px] text-slate-400">Rớt mốc</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            {snapshot.topPerformers.length > 0 && (
                <div className="mgr-glass-card p-4 mb-4">
                    <h3 className="text-sm font-semibold text-slate-600 mb-3">🏆 Top Performers</h3>
                    <div className="space-y-2">
                        {snapshot.topPerformers.map((p, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{['🥇', '🥈', '🥉'][i]}</span>
                                    <span className="text-sm text-slate-600">{p.name}</span>
                                </div>
                                <span className="text-xs text-slate-400">{p.interactions} tương tác</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Alerts */}
            {snapshot.alerts.length > 0 && (
                <div className="mgr-glass-card p-4 mb-4 ring-1 ring-amber-300/30">
                    <h3 className="text-sm font-semibold text-amber-600 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Cần Lưu Ý
                    </h3>
                    <div className="space-y-1.5">
                        {snapshot.alerts.map((a, i) => (
                            <p key={i} className="text-xs text-amber-700/80">{a}</p>
                        ))}
                    </div>
                </div>
            )}

            {/* Copy to Zalo/Telegram */}
            <CopyReportButton textReport={snapshot.textReport} />

            {/* Preview */}
            <div className="mgr-glass-card p-4 mt-4">
                <h3 className="text-sm font-semibold text-slate-600 mb-2">
                    📋 Preview (Zalo / Telegram)
                </h3>
                <pre className="text-xs text-slate-500 whitespace-pre-wrap font-mono leading-relaxed bg-white/30 rounded-xl p-3">
                    {snapshot.textReport}
                </pre>
            </div>
        </div>
    )
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-500/10 text-emerald-500',
        amber: 'bg-amber-500/10 text-amber-500',
        teal: 'bg-teal-500/10 text-teal-500',
        slate: 'bg-slate-500/10 text-slate-500',
    }

    return (
        <div className="mgr-glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${colorMap[color]}`}>
                    {icon}
                </div>
                <span className="text-xs text-slate-400">{label}</span>
            </div>
            <p className="text-xl font-bold text-slate-700">{value}</p>
        </div>
    )
}
