import { Suspense } from 'react'
import { formatCurrencyShort } from '@/lib/utils'
import { Crown, TrendingUp, Target, Zap, Users, ArrowUpRight, ArrowDownRight, Sparkles, BarChart3, Activity, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getUserByRole, getTeamPerformance } from '@/app/actions/users'
import { getDashboardMetrics } from '@/app/actions/dashboard'
import { RealtimeListener } from '@/components/realtime-listener'
import Loading from '@/app/(ceo)/loading'
import { prisma } from '@/lib/prisma'

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

    const [metrics, wonRevenueResult, allTeamPerf] = await Promise.all([
        getDashboardMetrics(orgId),
        prisma.lead.aggregate({ where: { orgId, status: 'WON' }, _sum: { dealValue: true } }),
        getAllTeamPerformance(orgId)
    ])
    const wonRevenue = wonRevenueResult._sum.dealValue || 0

    const pipelineValue = metrics.pipelineValue
    const target = 20_000_000_000
    const achievementRate = Math.round((wonRevenue / target) * 100)
    const confidence = metrics.activeLeads > 0 ? Math.min(95, Math.round(achievementRate + (pipelineValue / target) * 30)) : 0

    const now = new Date()
    const monthName = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

    return (
        <div className="mx-auto max-w-2xl px-4 py-6">
            <RealtimeListener table="leads" orgId={orgId} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Chỉ Huy Tối Cao</h1>
                        <p className="text-xs text-slate-500">CEO Dashboard • {monthName}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500">Cập nhật</p>
                    <p className="text-xs text-slate-400">vừa xong</p>
                </div>
            </div>

            {/* Revenue Pulse — Neon Numbers */}
            <div className="glass rounded-3xl p-6 mb-5">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 neon-cyan" />
                    <h2 className="text-sm font-semibold text-slate-300">Sức Mạnh Doanh Thu</h2>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                    {/* Actual Revenue */}
                    <div className="text-center">
                        <p className="text-3xl font-black neon-green text-glow-green">
                            {(wonRevenue / 1_000_000_000).toFixed(1)}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">tỷ • Thực tế</p>
                    </div>

                    {/* Pipeline */}
                    <div className="text-center">
                        <p className="text-3xl font-black neon-cyan text-glow-cyan">
                            {(pipelineValue / 1_000_000_000).toFixed(1)}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">tỷ • Pipeline</p>
                    </div>

                    {/* Confidence */}
                    <div className="text-center">
                        <p className="text-3xl font-black neon-gold text-glow-gold">
                            {confidence}%
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Tự tin đạt KPI</p>
                    </div>
                </div>

                {/* Target Progress */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400">KPI: {formatCurrencyShort(target)}</span>
                        <span className="text-xs font-semibold neon-cyan">{achievementRate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-emerald-500 transition-all duration-1000"
                            style={{ width: `${Math.min(100, achievementRate)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* AI Executive Summary */}
            <div className="glass rounded-3xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 neon-gold animate-glow" />
                    <h2 className="text-sm font-semibold text-slate-300">AI Gemini Insights</h2>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">AI</span>
                </div>
                <div className="space-y-2.5">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        📊 Doanh thu thực tế đạt {achievementRate}% KPI tháng. Pipeline hiện tại {formatCurrencyShort(pipelineValue)} với {metrics.activeLeads} leads đang theo.
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        ⚠️ Bottleneck: {metrics.milestoneDistribution.find(m => m.milestone >= 4)?.count || 0} deal ở Mốc 4-5 cần chốt. {metrics.sosCount > 0 ? `${metrics.sosCount} SOS alert đang chờ xử lý.` : 'Không có SOS alert.'}
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        🌟 Cơ hội: {metrics.milestoneDistribution.find(m => m.milestone === 1)?.count || 0} leads mới ở Mốc 1. Tổng giá trị pipeline giai đoạn cuối: {formatCurrencyShort(metrics.milestoneDistribution.filter(m => m.milestone >= 4).reduce((s, m) => s + m.value, 0))}.
                    </p>
                </div>
            </div>

            {/* Team Efficiency */}
            <div className="glass rounded-3xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 neon-cyan" />
                    <h2 className="text-sm font-semibold text-slate-300">Top Warriors</h2>
                </div>
                <div className="space-y-3">
                    {allTeamPerf.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">Chưa có dữ liệu team</p>
                    ) : (
                        allTeamPerf.slice(0, 5).map((w, idx) => (
                            <div key={w.id} className="flex items-center gap-3">
                                <div className="relative">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' :
                                        idx === 1 ? 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30' :
                                            'bg-slate-600/20 text-slate-500'
                                        }`}>
                                        {w.name.split(' ').pop()?.[0]}
                                    </div>
                                    {idx === 0 && (
                                        <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-200">{w.name}</p>
                                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                        <span>✓ {w.wonDeals} chốt</span>
                                        <span>📊 {w.activeLeads} pipeline</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${w.score >= 80 ? 'neon-green' : w.score >= 50 ? 'neon-gold' : 'neon-red'
                                        }`}>
                                        {w.score}
                                    </p>
                                    <p className="text-[10px] text-slate-500">score</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="glass rounded-2xl p-4 text-center">
                    <Activity className="h-5 w-5 neon-cyan mx-auto mb-2" />
                    <p className="text-2xl font-black text-white">{metrics.totalLeads}</p>
                    <p className="text-[10px] text-slate-500">Tổng Leads</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                    <Zap className="h-5 w-5 neon-gold mx-auto mb-2" />
                    <p className="text-2xl font-black text-white">{metrics.wonDeals}</p>
                    <p className="text-[10px] text-slate-500">Deals Won</p>
                </div>
            </div>

            {/* Deep Dive Links */}
            <div className="space-y-2 mb-6">
                <Link href="/ceo/analytics" className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition-all active:scale-[0.99]">
                    <BarChart3 className="h-5 w-5 neon-cyan" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">Phân Tích Chiến Lược</p>
                        <p className="text-[10px] text-slate-500">Pipeline flow, conversion, ROI nguồn lead</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-600" />
                </Link>
                <Link href="/ceo/team" className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition-all active:scale-[0.99]">
                    <Users className="h-5 w-5 neon-gold" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">Hiệu Suất Đội Ngũ</p>
                        <p className="text-[10px] text-slate-500">Revenue per member, compliance, ranking</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-600" />
                </Link>
            </div>
        </div>
    )
}



async function getAllTeamPerformance(orgId: string) {
    const members = await prisma.user.findMany({
        where: { orgId, role: 'SALE' },
        select: {
            id: true,
            name: true,
            streakCount: true,
            assignedLeads: {
                where: { status: { in: ['ACTIVE', 'WON'] } },
                select: {
                    currentMilestone: true,
                    dealValue: true,
                    status: true,
                },
            },
        },
    })

    return members
        .map(m => ({
            id: m.id,
            name: m.name,
            streak: m.streakCount,
            totalLeads: m.assignedLeads.length,
            activeLeads: m.assignedLeads.filter(l => l.status === 'ACTIVE').length,
            wonDeals: m.assignedLeads.filter(l => l.status === 'WON').length,
            revenue: m.assignedLeads.filter(l => l.status === 'WON').reduce((s, l) => s + (l.dealValue || 0), 0),
            pipeline: m.assignedLeads.filter(l => l.status === 'ACTIVE').reduce((s, l) => s + (l.dealValue || 0), 0),
            score: Math.round(
                (m.assignedLeads.filter(l => l.status === 'WON').length * 30) +
                (m.streakCount * 5) +
                (m.assignedLeads.filter(l => l.status === 'ACTIVE' && l.currentMilestone >= 4).length * 10) +
                Math.min(30, m.assignedLeads.filter(l => l.status === 'ACTIVE').length * 5)
            ),
        }))
        .sort((a, b) => b.score - a.score)
}
