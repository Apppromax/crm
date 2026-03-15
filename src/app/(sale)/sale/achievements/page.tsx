import { ArrowLeft, Flame, Trophy, Star, Target, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { cn, formatCurrencyShort } from '@/lib/utils'
import { AchievementBadges } from '@/components/shared/gamification'
import { getUserByRole, getUserStats } from '@/app/actions/users'

export default async function AchievementsPage() {
    const user = await getUserByRole('SALE')
    if (!user) return <div className="p-8 text-center text-slate-400">No user found</div>

    const stats = await getUserStats(user.id)

    return (
        <div className="mx-auto max-w-2xl min-h-dvh">
            <header className="sticky top-0 z-40 flex items-center gap-3 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <Link href="/sale/settings" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Thành Tích
                </h1>
            </header>

            <div className="px-4 py-4 space-y-5">
                {/* Streak Card */}
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-5 text-white shadow-xl shadow-orange-500/20">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Flame className="h-6 w-6" />
                            <span className="text-sm font-semibold">Chuỗi Streak</span>
                        </div>
                        <span className="text-4xl font-black">{stats.streak}</span>
                    </div>
                    <div className="flex gap-1">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'flex-1 h-2 rounded-full',
                                    i < stats.streak ? 'bg-white' : 'bg-white/20'
                                )}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-white/70 mt-2">
                        {stats.streak >= 7 ? '🏆 1 tuần liên tiếp!' : `Còn ${7 - stats.streak} ngày nữa để đạt "1 Tuần Streak"`}
                    </p>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-2">
                    <StatCard icon={<Trophy className="h-4 w-4 text-amber-500" />} value={`${stats.milestone45}`} label="Deals M4-5" />
                    <StatCard icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} value={formatCurrencyShort(stats.pipelineValue)} label="Pipeline" />
                    <StatCard icon={<Zap className="h-4 w-4 text-primary-500" />} value={`${stats.activeLeads}`} label="Active" />
                </div>

                {/* Badges */}
                <AchievementBadges />

                {/* Activity Summary */}
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        Kỷ lục cá nhân
                    </h3>
                    <div className="space-y-2">
                        <RecordRow label="Streak hiện tại" value={`${stats.streak} ngày`} />
                        <RecordRow label="Active Leads" value={`${stats.activeLeads}`} />
                        <RecordRow label="Pipeline Value" value={formatCurrencyShort(stats.pipelineValue)} />
                        <RecordRow label="Milestone 4-5" value={`${stats.milestone45} leads`} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-3 text-center">
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-base font-bold text-slate-800">{value}</p>
            <p className="text-[10px] text-slate-400">{label}</p>
        </div>
    )
}

function RecordRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
            <span className="text-xs text-slate-400">{label}</span>
            <span className="text-xs font-semibold text-slate-700">{value}</span>
        </div>
    )
}
