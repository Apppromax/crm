import { Suspense } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, Target, Users, Flame, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { cn, formatCurrencyShort } from '@/lib/utils'
import { getUserByRole } from '@/app/actions/users'
import { getDashboardMetrics } from '@/app/actions/dashboard'
import { prisma } from '@/lib/prisma'
import Loading from '@/app/(ceo)/loading'

export default function CEOAnalyticsWrapper() {
    return (
        <Suspense fallback={<Loading />}>
            <CEOAnalyticsPage />
        </Suspense>
    )
}

async function getLeadSourceAnalytics(orgId: string) {
    const sources = await prisma.leadSource.findMany({
        where: {
            leads: { some: { orgId } },
        },
        include: {
            leads: {
                where: { orgId },
                select: { status: true, dealValue: true },
            },
        },
    })

    return sources.map(s => ({
        source: s.name,
        leads: s.leads.length,
        won: s.leads.filter(l => l.status === 'WON').length,
        roi: s.leads.filter(l => l.status === 'WON').length > 0
            ? Math.round((s.leads.filter(l => l.status === 'WON').reduce((sum: number, l) => sum + (l.dealValue || 0), 0) / Math.max(1, s.leads.length * 500000)) * 100)
            : 0,
        color: getSourceColor(s.name),
    }))
}

function getSourceColor(name: string): string {
    const colorMap: Record<string, string> = {
        'Facebook Ads': 'bg-blue-400',
        'Google Ads': 'bg-red-400',
        'Referral': 'bg-emerald-400',
        'Website': 'bg-amber-400',
        'Cold Call': 'bg-slate-400',
        'Zalo': 'bg-sky-400',
        'Event': 'bg-purple-400',
    }
    return colorMap[name] || 'bg-cyan-400'
}

async function CEOAnalyticsPage() {
    const user = await getUserByRole('CEO')
    if (!user) return <div className="p-8 text-center text-slate-400">No CEO found</div>

    const orgId = user.org.id
    const [metrics, sourceData] = await Promise.all([
        getDashboardMetrics(orgId),
        getLeadSourceAnalytics(orgId),
    ])

    // Build pipeline flow from milestone distribution
    const milestoneLabels: Record<number, string> = {
        1: 'M1 Tiếp cận',
        2: 'M2 Chào mồi',
        3: 'M3 Niềm tin',
        4: 'M4 Dồn chốt',
        5: 'M5 Chốt cọc',
    }

    const flowData = [1, 2, 3, 4, 5].map(m => {
        const dist = metrics.milestoneDistribution.find(d => d.milestone === m)
        return {
            key: `m${m}`,
            label: milestoneLabels[m],
            count: dist?.count || 0,
            value: dist?.value || 0,
        }
    })

    const maxCount = Math.max(...flowData.map(d => d.count), 1)

    // Calculate conversion rates between milestones
    const conversionRates = [
        { from: 'M1→M2', rate: calcConversion(flowData[0].count, flowData[1].count) },
        { from: 'M2→M3', rate: calcConversion(flowData[1].count, flowData[2].count) },
        { from: 'M3→M4', rate: calcConversion(flowData[2].count, flowData[3].count) },
        { from: 'M4→M5', rate: calcConversion(flowData[3].count, flowData[4].count) },
    ]

    const now = new Date()
    const monthName = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

    return (
        <div className="mx-auto max-w-2xl min-h-dvh bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center gap-3 bg-slate-950/90 px-4 py-3 backdrop-blur-xl border-b border-white/5">
                <Link href="/ceo" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-base font-semibold text-white flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-cyan-400" />
                        Phân Tích Chiến Lược
                    </h1>
                    <p className="text-xs text-slate-500">{monthName}</p>
                </div>
            </header>

            <div className="px-4 py-4 space-y-5 pb-12">
                {/* Pipeline Flow (Visual Funnel) */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-300 mb-3">Pipeline Flow</h2>
                    <div className="space-y-2">
                        {flowData.map((data, idx) => {
                            const widthPct = Math.max(5, (data.count / maxCount) * 100)
                            return (
                                <div key={data.key} className="relative">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-slate-500 w-20 shrink-0">{data.label}</span>
                                        <div className="flex-1">
                                            <div className="h-8 rounded-lg bg-white/5 overflow-hidden">
                                                <div
                                                    className="h-full rounded-lg flex items-center px-3 transition-all"
                                                    style={{
                                                        width: `${widthPct}%`,
                                                        background: `linear-gradient(90deg, 
                              hsl(${190 + idx * 15}, 80%, ${55 - idx * 5}%), 
                              hsl(${200 + idx * 15}, 70%, ${45 - idx * 5}%)
                            )`,
                                                    }}
                                                >
                                                    <span className="text-xs font-bold text-white">{data.count}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-500 w-16 text-right">{formatCurrencyShort(data.value)}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Conversion Rates */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-300 mb-3">Tỷ Lệ Chuyển Đổi</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {conversionRates.map(cr => (
                            <div key={cr.from} className="rounded-xl bg-white/5 border border-white/5 p-3">
                                <p className="text-[10px] text-slate-500">{cr.from}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl font-bold text-white">{cr.rate}%</span>
                                    <span className={cn(
                                        'flex items-center gap-0.5 text-[10px] font-medium',
                                        cr.rate >= 50 ? 'text-emerald-400' : 'text-amber-400'
                                    )}>
                                        {cr.rate >= 50 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                        {cr.rate >= 50 ? 'Tốt' : 'Cần cải thiện'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Metrics */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-300 mb-3">Tổng Quan Pipeline</h2>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                            <p className="text-xl font-bold text-cyan-400">{metrics.totalLeads}</p>
                            <p className="text-[10px] text-slate-500">Tổng Leads</p>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                            <p className="text-xl font-bold text-emerald-400">{metrics.wonDeals}</p>
                            <p className="text-[10px] text-slate-500">Won</p>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                            <p className="text-xl font-bold text-amber-400">{formatCurrencyShort(metrics.pipelineValue)}</p>
                            <p className="text-[10px] text-slate-500">Pipeline</p>
                        </div>
                    </div>
                </section>

                {/* Lead Source ROI */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-300 mb-3">Hiệu Quả Nguồn Lead</h2>
                    {sourceData.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-6">Chưa có dữ liệu nguồn lead</p>
                    ) : (
                        <div className="rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                            <div className="grid grid-cols-4 gap-px bg-white/5 text-[10px] text-slate-500 font-semibold">
                                <div className="bg-slate-950 px-3 py-2">Nguồn</div>
                                <div className="bg-slate-950 px-3 py-2 text-center">Leads</div>
                                <div className="bg-slate-950 px-3 py-2 text-center">Won</div>
                                <div className="bg-slate-950 px-3 py-2 text-right">ROI %</div>
                            </div>
                            {sourceData.map(src => (
                                <div key={src.source} className="grid grid-cols-4 gap-px bg-white/5">
                                    <div className="bg-slate-950 px-3 py-2.5 flex items-center gap-1.5">
                                        <span className={cn('h-2 w-2 rounded-sm', src.color)} />
                                        <span className="text-xs text-slate-300">{src.source}</span>
                                    </div>
                                    <div className="bg-slate-950 px-3 py-2.5 text-center text-xs text-slate-400">{src.leads}</div>
                                    <div className="bg-slate-950 px-3 py-2.5 text-center text-xs font-semibold text-emerald-400">
                                        {src.won > 0 ? src.won : '-'}
                                    </div>
                                    <div className="bg-slate-950 px-3 py-2.5 text-right">
                                        <span className={cn(
                                            'text-xs font-semibold',
                                            src.roi > 300 ? 'text-emerald-400' : src.roi > 0 ? 'text-amber-400' : 'text-slate-600'
                                        )}>
                                            {src.roi > 0 ? `${src.roi}%` : '-'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

function calcConversion(from: number, to: number): number {
    if (from === 0) return 0
    return Math.round((to / from) * 100)
}
