'use client'

import { useState, useEffect } from 'react'
import { Flame, X, Trophy, Star, Target, Zap, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// Streak Celebration Modal
// ============================================

interface StreakCelebrationProps {
    streakCount: number
    onClose: () => void
}

export function StreakCelebration({ streakCount, onClose }: StreakCelebrationProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setTimeout(() => setShow(true), 100)
    }, [])

    const messages: Record<number, { emoji: string; title: string; subtitle: string }> = {
        3: { emoji: '🔥', title: '3 ngày liên tiếp!', subtitle: 'Bạn đang build momentum!' },
        5: { emoji: '⚡', title: '5 ngày liên tiếp!', subtitle: 'Tốc độ tuyệt vời!' },
        7: { emoji: '🏆', title: '1 tuần liên tiếp!', subtitle: 'Bạn là chiến binh thực thụ!' },
        10: { emoji: '👑', title: '10 ngày liên tiếp!', subtitle: 'LEGEND! Team đang học hỏi bạn!' },
        14: { emoji: '💎', title: '2 tuần liên tiếp!', subtitle: 'Bạn đang phá kỷ lục công ty!' },
    }

    const msg = messages[streakCount] || {
        emoji: '🔥', title: `${streakCount} ngày liên tiếp!`, subtitle: 'Tiếp tục giữ streak!'
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className={cn(
                    'w-full max-w-xs rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-1 shadow-2xl shadow-orange-500/30 transition-all duration-500',
                    show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                )}
                onClick={e => e.stopPropagation()}
            >
                <div className="rounded-[22px] bg-white p-6 text-center">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400"><X className="h-5 w-5" /></button>

                    {/* Animated flame */}
                    <div className="relative mx-auto mb-4">
                        <span className="text-6xl block animate-bounce-soft">{msg.emoji}</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(6)].map((_, i) => (
                                <span
                                    key={i}
                                    className="absolute text-xl opacity-50 animate-ping"
                                    style={{
                                        animationDelay: `${i * 0.2}s`,
                                        animationDuration: '1.5s',
                                        transform: `rotate(${i * 60}deg) translateY(-40px)`,
                                    }}
                                >
                                    ✨
                                </span>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-xl font-black text-slate-800">{msg.title}</h2>
                    <p className="text-sm text-slate-500 mt-1">{msg.subtitle}</p>

                    {/* Streak counter */}
                    <div className="flex items-center justify-center gap-1 mt-4">
                        {Array.from({ length: Math.min(streakCount, 10) }).map((_, i) => (
                            <Flame
                                key={i}
                                className={cn(
                                    'h-5 w-5 transition-all',
                                    i < 3 ? 'text-red-500' : i < 5 ? 'text-orange-500' : i < 7 ? 'text-amber-500' : 'text-yellow-400'
                                )}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-5 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        Tiếp tục chinh phục! 💪
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================
// Achievement Badge Component
// ============================================

export interface Badge {
    id: string
    icon: typeof Trophy
    label: string
    description: string
    earned: boolean
    earnedAt?: Date
    color: string
}

const ALL_BADGES: Badge[] = [
    { id: 'first-close', icon: Trophy, label: 'Chốt đầu tiên', description: 'Chốt cọc deal đầu tiên', earned: true, earnedAt: new Date(2026, 1, 20), color: 'text-amber-500' },
    { id: 'streak-5', icon: Flame, label: 'Streak 5', description: '5 ngày tương tác liên tiếp', earned: true, earnedAt: new Date(2026, 2, 10), color: 'text-orange-500' },
    { id: 'golden-hero', icon: Zap, label: 'Golden Hero', description: 'Hoàn thành 3 leads trong 72h Vàng', earned: true, earnedAt: new Date(2026, 2, 12), color: 'text-yellow-500' },
    { id: 'milestone-master', icon: Target, label: 'Milestone Master', description: 'Thăng 10 mốc trong 1 tháng', earned: false, color: 'text-primary-500' },
    { id: 'top-warrior', icon: Award, label: 'Top Warrior', description: 'Xếp hạng #1 team trong tháng', earned: false, color: 'text-indigo-500' },
    { id: 'streak-30', icon: Star, label: 'Huyền thoại', description: '30 ngày streak liên tiếp', earned: false, color: 'text-purple-500' },
]

export function AchievementBadges() {
    const earned = ALL_BADGES.filter(b => b.earned)
    const locked = ALL_BADGES.filter(b => !b.earned)

    return (
        <div className="space-y-4">
            {/* Earned */}
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Đã đạt ({earned.length})</p>
                <div className="grid grid-cols-3 gap-2">
                    {earned.map(badge => {
                        const Icon = badge.icon
                        return (
                            <div key={badge.id} className="rounded-xl bg-white border border-slate-100 shadow-sm p-3 text-center">
                                <Icon className={cn('h-7 w-7 mx-auto mb-1.5', badge.color)} />
                                <p className="text-xs font-semibold text-slate-700">{badge.label}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{badge.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Locked */}
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Chưa đạt ({locked.length})</p>
                <div className="grid grid-cols-3 gap-2">
                    {locked.map(badge => {
                        const Icon = badge.icon
                        return (
                            <div key={badge.id} className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center opacity-50">
                                <Icon className="h-7 w-7 mx-auto mb-1.5 text-slate-300" />
                                <p className="text-xs font-medium text-slate-400">{badge.label}</p>
                                <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">{badge.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
