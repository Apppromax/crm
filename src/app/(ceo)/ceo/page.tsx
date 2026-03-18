import { Suspense } from 'react'
import { formatCurrencyShort } from '@/lib/utils'
import { Crown, TrendingUp, Target, Zap, Users, ArrowUpRight, ArrowDownRight, Sparkles, BarChart3, Activity, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getUserByRole, getTeamPerformance } from '@/app/actions/users'
import { getDashboardMetrics } from '@/app/actions/dashboard'
import { RealtimeListener } from '@/components/realtime-listener'
import Loading from '@/app/(ceo)/loading'
import { getCachedWonRevenue, getCachedAllTeamPerformance } from '@/lib/cache'
import { PipelineFunnel } from '@/components/ceo/pipeline-funnel'

export default function CEOPage() {
    return (
        <Suspense fallback={<Loading />}>
            <CEODashboard />
        </Suspense>
    )
}

async function CEODashboard() {
    const user = await getUserByRole('CEO')
    if (!user) return <div className="p-8 text-center text-slate-400">No CEO user found</div>

    const orgId = user.org.id

    const [metrics, wonRevenue, allTeamPerf] = await Promise.all([
        getDashboardMetrics(orgId),
        getCachedWonRevenue(orgId),
        getCachedAllTeamPerformance(orgId)
    ])

    const pipelineValue = metrics.pipelineValue
    const target = 20_000_000_000
    const achievementRate = Math.round((wonRevenue / target) * 100)
    const confidence = metrics.activeLeads > 0 ? Math.min(95, Math.round(achievementRate + (pipelineValue / target) * 30)) : 0

    const now = new Date()
    const monthName = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

    return (
        <div className="mx-auto max-w-2xl px-4 py-6 pb-8">
            <RealtimeListener table="leads" orgId={orgId} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">Chỉ Huy Tối Cao</h1>
                        <p className="text-xs text-slate-400">CEO Dashboard • {monthName}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-400">Cập nhật</p>
                    <p className="text-xs text-slate-500">vừa xong</p>
                </div>
            </div>

            {/* Revenue Pulse */}
            <div className="mgr-glass-card p-6 mb-5">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-teal-500" />
                    <h2 className="text-sm font-semibold text-slate-600">Sức Mạnh Doanh Thu</h2>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="text-center">
                        <p className="text-3xl font-black text-emerald-600">
                            {(wonRevenue / 1_000_000_000).toFixed(1)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">tỷ • Thực tế</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-teal-500">
                            {(pipelineValue / 1_000_000_000).toFixed(1)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">tỷ • Pipeline</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-amber-500">
                            {confidence}%
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Tự tin đạt KPI</p>
                    </div>
                </div>

                {/* Target Progress */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400">KPI: {formatCurrencyShort(target)}</span>
                        <span className="text-xs font-semibold text-teal-600">{achievementRate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/40 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-emerald-500 transition-all duration-1000"
                            style={{ width: `${Math.min(100, achievementRate)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* AI Executive Summary */}
            <div className="mgr-glass-card p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h2 className="text-sm font-semibold text-slate-600">AI Gemini Insights</h2>
                    <span className="text-[10px] bg-amber-500/15 text-amber-600 px-2 py-0.5 rounded-full font-medium border border-amber-200/30">AI</span>
                </div>
                <div className="space-y-2.5">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        📊 Doanh thu thực tế đạt {achievementRate}% KPI tháng. Pipeline hiện tại {formatCurrencyShort(pipelineValue)} với {metrics.activeLeads} leads đang theo.
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        ⚠️ Bottleneck: {metrics.milestoneDistribution.find(m => m.milestone >= 4)?.count || 0} deal ở Mốc 4-5 cần chốt. {metrics.sosCount > 0 ? `${metrics.sosCount} SOS alert đang chờ xử lý.` : 'Không có SOS alert.'}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        🌟 Cơ hội: {metrics.milestoneDistribution.find(m => m.milestone === 1)?.count || 0} leads mới ở Mốc 1. Tổng giá trị pipeline giai đoạn cuối: {formatCurrencyShort(metrics.milestoneDistribution.filter(m => m.milestone >= 4).reduce((s, m) => s + m.value, 0))}.
                    </p>
                </div>
            </div>

            {/* Team Efficiency */}
            <div className="mgr-glass-card p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-teal-500" />
                    <h2 className="text-sm font-semibold text-slate-600">Top Warriors</h2>
                </div>
                <div className="space-y-3 stagger-children">
                    {allTeamPerf.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">Chưa có dữ liệu team</p>
                    ) : (
                        allTeamPerf.slice(0, 5).map((w, idx) => (
                            <div key={w.id} className="flex items-center gap-3">
                                <div className="relative">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-amber-500/15 text-amber-600 ring-1 ring-amber-300/30' :
                                        idx === 1 ? 'bg-slate-500/10 text-slate-500 ring-1 ring-slate-300/30' :
                                            'bg-slate-100/50 text-slate-400'
                                        }`}>
                                        {w.name.split(' ').pop()?.[0]}
                                    </div>
                                    {idx === 0 && (
                                        <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">{w.name}</p>
                                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                        <span>✓ {w.wonDeals} chốt</span>
                                        <span>📊 {w.activeLeads} pipeline</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${w.score >= 80 ? 'text-emerald-500' : w.score >= 50 ? 'text-amber-500' : 'text-red-500'
                                        }`}>
                                        {w.score}
                                    </p>
                                    <p className="text-[10px] text-slate-400">score</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="mgr-glass-card p-4 text-center">
                    <Activity className="h-5 w-5 text-teal-500 mx-auto mb-2" />
                    <p className="text-2xl font-black text-slate-700">{metrics.totalLeads}</p>
                    <p className="text-[10px] text-slate-400">Tổng Leads</p>
                </div>
                <div className="mgr-glass-card p-4 text-center">
                    <Zap className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-black text-slate-700">{metrics.wonDeals}</p>
                    <p className="text-[10px] text-slate-400">Deals Won</p>
                </div>
            </div>

            {/* Pipeline Funnel */}
            <div className="mb-6">
                <PipelineFunnel data={{
                    m1: metrics.milestoneDistribution.find(m => m.milestone === 1)?.count || 0,
                    m2: metrics.milestoneDistribution.find(m => m.milestone === 2)?.count || 0,
                    m3: metrics.milestoneDistribution.find(m => m.milestone === 3)?.count || 0,
                    m4: metrics.milestoneDistribution.find(m => m.milestone === 4)?.count || 0,
                    m5: metrics.milestoneDistribution.find(m => m.milestone === 5)?.count || 0,
                    lost: 0,
                }} />
            </div>

            {/* Deep Dive Links */}
            <div className="space-y-2 mb-6 stagger-children">
                <Link href="/ceo/analytics" className="mgr-glass-card p-4 flex items-center gap-3 transition-all active:scale-[0.99]">
                    <BarChart3 className="h-5 w-5 text-teal-500" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Phân Tích Chiến Lược</p>
                        <p className="text-[10px] text-slate-400">Pipeline flow, conversion, ROI nguồn lead</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                </Link>
                <Link href="/ceo/team" className="mgr-glass-card p-4 flex items-center gap-3 transition-all active:scale-[0.99]">
                    <Users className="h-5 w-5 text-amber-500" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Hiệu Suất Đội Ngũ</p>
                        <p className="text-[10px] text-slate-400">Revenue per member, compliance, ranking</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                </Link>
                <Link href="/ceo/weekly" className="mgr-glass-card p-4 flex items-center gap-3 transition-all active:scale-[0.99]">
                    <span className="text-lg">📊</span>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Báo Cáo Tuần</p>
                        <p className="text-[10px] text-slate-400">Copy & paste vào Zalo/Telegram</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                </Link>
            </div>
        </div>
    )
}
