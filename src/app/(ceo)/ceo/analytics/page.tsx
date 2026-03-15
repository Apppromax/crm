'use client'

import { ArrowLeft, TrendingUp, TrendingDown, Target, Users, Flame, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { cn, formatCurrencyShort } from '@/lib/utils'

// Pipeline flow data (simplified Sankey-style)
const FLOW_DATA = {
    m1: { label: 'M1 Tiếp cận', count: 45, value: 112_500_000_000 },
    m2: { label: 'M2 Chào mồi', count: 28, value: 84_000_000_000 },
    m3: { label: 'M3 Niềm tin', count: 15, value: 52_500_000_000 },
    m4: { label: 'M4 Dồn chốt', count: 8, value: 32_000_000_000 },
    m5: { label: 'M5 Chốt cọc', count: 3, value: 13_500_000_000 },
}

const CONVERSION_RATES = [
    { from: 'M1→M2', rate: 62, change: '+5%', positive: true },
    { from: 'M2→M3', rate: 54, change: '-3%', positive: false },
    { from: 'M3→M4', rate: 53, change: '+8%', positive: true },
    { from: 'M4→M5', rate: 38, change: '-2%', positive: false },
]

const MONTHLY_TREND = [
    { month: 'T1', revenue: 8.5, target: 10 },
    { month: 'T2', revenue: 12.2, target: 10 },
    { month: 'T3', revenue: 5.5, target: 12 },
]

const SOURCE_DATA = [
    { source: 'Facebook Ads', leads: 25, won: 2, roi: 340, color: 'bg-blue-400' },
    { source: 'Google Ads', leads: 12, won: 1, roi: 280, color: 'bg-red-400' },
    { source: 'Referral', leads: 8, won: 1, roi: 720, color: 'bg-emerald-400' },
    { source: 'Website', leads: 15, won: 0, roi: 0, color: 'bg-amber-400' },
    { source: 'Cold Call', leads: 18, won: 0, roi: 0, color: 'bg-slate-400' },
]

export default function CEOAnalyticsPage() {
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
                    <p className="text-xs text-slate-500">Tháng 3/2026</p>
                </div>
            </header>

            <div className="px-4 py-4 space-y-5 pb-12">
                {/* Pipeline Flow (Visual Funnel) */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-300 mb-3">Pipeline Flow</h2>
                    <div className="space-y-2">
                        {Object.entries(FLOW_DATA).map(([key, data], idx) => {
                            const maxCount = FLOW_DATA.m1.count
                            const widthPct = (data.count / maxCount) * 100
                            return (
                                <div key={key} className="relative">
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
                        {CONVERSION_RATES.map(cr => (
                            <div key={cr.from} className="rounded-xl bg-white/5 border border-white/5 p-3">
                                <p className="text-[10px] text-slate-500">{cr.from}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl font-bold text-white">{cr.rate}%</span>
                                    <span className={cn(
                                        'flex items-center gap-0.5 text-[10px] font-medium',
                                        cr.positive ? 'text-emerald-400' : 'text-red-400'
                                    )}>
                                        {cr.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                        {cr.change}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Monthly Revenue Trend */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-300 mb-3">Doanh Thu Theo Tháng (tỷ VND)</h2>
                    <div className="space-y-3">
                        {MONTHLY_TREND.map(m => {
                            const maxVal = Math.max(...MONTHLY_TREND.map(mt => Math.max(mt.revenue, mt.target)))
                            const revPct = (m.revenue / maxVal) * 100
                            const targetPct = (m.target / maxVal) * 100
                            const hitTarget = m.revenue >= m.target
                            return (
                                <div key={m.month} className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500 w-6 font-medium">{m.month}</span>
                                    <div className="flex-1 space-y-1">
                                        {/* Revenue bar */}
                                        <div className="h-5 rounded bg-white/5 overflow-hidden relative">
                                            <div
                                                className={cn('h-full rounded flex items-center px-2', hitTarget ? 'bg-emerald-500' : 'bg-amber-500')}
                                                style={{ width: `${revPct}%` }}
                                            >
                                                <span className="text-[10px] font-bold text-white">{m.revenue}</span>
                                            </div>
                                            {/* Target line */}
                                            <div
                                                className="absolute top-0 h-full w-0.5 bg-red-400"
                                                style={{ left: `${targetPct}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-12 text-right">
                                        {hitTarget ? (
                                            <span className="text-[10px] text-emerald-400 font-semibold">✓ Đạt</span>
                                        ) : (
                                            <span className="text-[10px] text-amber-400 font-semibold">
                                                {Math.round((m.revenue / m.target) * 100)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 pt-1">
                            <span className="flex items-center gap-1"><span className="h-2 w-5 rounded bg-emerald-500" /> Đạt target</span>
                            <span className="flex items-center gap-1"><span className="h-2 w-5 rounded bg-amber-500" /> Chưa đạt</span>
                            <span className="flex items-center gap-1"><span className="h-2 w-0.5 bg-red-400" /> Target</span>
                        </div>
                    </div>
                </section>

                {/* Lead Source ROI */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-300 mb-3">Hiệu Quả Nguồn Lead</h2>
                    <div className="rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                        <div className="grid grid-cols-4 gap-px bg-white/5 text-[10px] text-slate-500 font-semibold">
                            <div className="bg-slate-950 px-3 py-2">Nguồn</div>
                            <div className="bg-slate-950 px-3 py-2 text-center">Leads</div>
                            <div className="bg-slate-950 px-3 py-2 text-center">Won</div>
                            <div className="bg-slate-950 px-3 py-2 text-right">ROI %</div>
                        </div>
                        {SOURCE_DATA.map(src => (
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
                </section>
            </div>
        </div>
    )
}
