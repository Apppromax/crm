import { formatCurrencyShort } from '@/lib/utils'
import { Crown, TrendingUp, Target, Zap, Users, ArrowUpRight, ArrowDownRight, Sparkles, BarChart3, Activity, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// CEO Mock Data
const revenueData = {
    actual: 6_800_000_000,
    pipeline: 15_500_000_000,
    target: 20_000_000_000,
    confidence: 75,
    achievementRate: 34,
}

const aiSummary = {
    line1: '📊 Doanh thu thực tế đạt 34% KPI tháng. Tốc độ chốt deal đang tăng 15% so với tuần trước.',
    line2: '⚠️ Bottleneck: 3 deal Mốc 4 bị delay quá 5 ngày. Cần Manager A can thiệp deal Phạm Minh Tuấn.',
    line3: '🌟 Cơ hội: 2 leads mới từ Facebook Ads có BANT score rất cao. Recommend: phân bổ cho sale có conversion rate tốt nhất.',
}

const topWarriors = [
    { name: 'Nguyễn Văn A', closed: 1, pipeline: 3, avatar: 'A', score: 92 },
    { name: 'Trần Minh B', closed: 0, pipeline: 2, avatar: 'B', score: 65 },
    { name: 'Lê Thị C', closed: 0, pipeline: 1, avatar: 'C', score: 38 },
]

export default function CEODashboard() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Chỉ Huy Tối Cao</h1>
                        <p className="text-xs text-slate-500">CEO Dashboard • Tháng 3/2026</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500">Cập nhật</p>
                    <p className="text-xs text-slate-400">5 phút trước</p>
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
                            {(revenueData.actual / 1_000_000_000).toFixed(1)}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">tỷ • Thực tế</p>
                    </div>

                    {/* Pipeline */}
                    <div className="text-center">
                        <p className="text-3xl font-black neon-cyan text-glow-cyan">
                            {(revenueData.pipeline / 1_000_000_000).toFixed(1)}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">tỷ • Pipeline</p>
                    </div>

                    {/* Confidence */}
                    <div className="text-center">
                        <p className="text-3xl font-black neon-gold text-glow-gold">
                            {revenueData.confidence}%
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Tự tin đạt KPI</p>
                    </div>
                </div>

                {/* Target Progress */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400">KPI: {formatCurrencyShort(revenueData.target)}</span>
                        <span className="text-xs font-semibold neon-cyan">{revenueData.achievementRate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-emerald-500 transition-all duration-1000"
                            style={{ width: `${revenueData.achievementRate}%` }}
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
                    <p className="text-sm text-slate-300 leading-relaxed">{aiSummary.line1}</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{aiSummary.line2}</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{aiSummary.line3}</p>
                </div>
            </div>

            {/* Team Efficiency */}
            <div className="glass rounded-3xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 neon-cyan" />
                    <h2 className="text-sm font-semibold text-slate-300">Top Warriors</h2>
                </div>
                <div className="space-y-3">
                    {topWarriors.map((w, idx) => (
                        <div key={w.name} className="flex items-center gap-3">
                            <div className="relative">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' :
                                    idx === 1 ? 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30' :
                                        'bg-slate-600/20 text-slate-500'
                                    }`}>
                                    {w.avatar}
                                </div>
                                {idx === 0 && (
                                    <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-200">{w.name}</p>
                                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                    <span>✓ {w.closed} chốt</span>
                                    <span>📊 {w.pipeline} pipeline</span>
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
                    ))}
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="glass rounded-2xl p-4 text-center">
                    <Activity className="h-5 w-5 neon-cyan mx-auto mb-2" />
                    <p className="text-2xl font-black text-white">23</p>
                    <p className="text-[10px] text-slate-500">Tương tác hôm nay</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                    <Zap className="h-5 w-5 neon-gold mx-auto mb-2" />
                    <p className="text-2xl font-black text-white">4.2x</p>
                    <p className="text-[10px] text-slate-500">Burn Rate</p>
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
