'use client'

import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, Phone, MessageSquare, FileText, Clock, Target, Flame, MapPin } from 'lucide-react'
import { cn, formatRelativeTime, getMilestoneLabel } from '@/lib/utils'
import Link from 'next/link'

// Mock: Manager's view of what Sale is doing in real-time
const SHADOW_ACTIVITY = [
    {
        id: 'act-1', time: new Date(Date.now() - 180000),
        type: 'NOTE' as const, icon: FileText,
        description: 'Ghi chú: "Khách quan tâm căn 2PN, hỏi thêm về view sông"',
        leadName: 'Trần Thị Bảo Ngọc', milestone: 3,
    },
    {
        id: 'act-2', time: new Date(Date.now() - 600000),
        type: 'CALL' as const, icon: Phone,
        description: 'Gọi điện 4 phút 32 giây — Đã kết nối',
        leadName: 'Nguyễn Văn Đức', milestone: 2,
    },
    {
        id: 'act-3', time: new Date(Date.now() - 1800000),
        type: 'SCHEDULE' as const, icon: Clock,
        description: 'Đặt lịch hẹn gặp mặt thứ 7, 14:00 tại nhà mẫu',
        leadName: 'Trần Thị Bảo Ngọc', milestone: 3,
    },
    {
        id: 'act-4', time: new Date(Date.now() - 3600000),
        type: 'MILESTONE' as const, icon: Target,
        description: 'Thăng mốc: Mốc 2 → Mốc 3 (Niềm tin)',
        leadName: 'Trần Thị Bảo Ngọc', milestone: 3,
    },
    {
        id: 'act-5', time: new Date(Date.now() - 5400000),
        type: 'CHAT' as const, icon: MessageSquare,
        description: 'Gửi Zalo: Bảng tính dòng tiền chi tiết',
        leadName: 'Hoàng Anh Kiệt', milestone: 4,
    },
]

const typeColors: Record<string, string> = {
    NOTE: 'bg-blue-50 text-blue-500',
    CALL: 'bg-emerald-50 text-emerald-500',
    SCHEDULE: 'bg-amber-50 text-amber-500',
    MILESTONE: 'bg-primary-50 text-primary-500',
    CHAT: 'bg-indigo-50 text-indigo-500',
}

export default function ShadowModePage() {
    const [isLive, setIsLive] = useState(true)
    const saleName = 'Nguyễn Văn A'

    return (
        <div className="mx-auto max-w-2xl min-h-dvh bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center gap-3 bg-slate-950/90 px-4 py-3 backdrop-blur-xl border-b border-white/5">
                <Link href="/manager" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-emerald-400" />
                        <h1 className="text-base font-semibold text-white">Shadow Mode</h1>
                    </div>
                    <p className="text-xs text-slate-500">Đang theo dõi: {saleName}</p>
                </div>
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all',
                        isLive
                            ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                    )}
                >
                    <span className={cn('h-2 w-2 rounded-full', isLive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400')} />
                    {isLive ? 'LIVE' : 'PAUSED'}
                </button>
            </header>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-2 px-4 pt-4">
                <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                    <p className="text-lg font-bold text-white">5</p>
                    <p className="text-[10px] text-slate-500">Leads hôm nay</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-400">3</p>
                    <p className="text-[10px] text-slate-500">Gọi + Chat</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                    <p className="text-lg font-bold text-amber-400">15m</p>
                    <p className="text-[10px] text-slate-500">Avg response</p>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="px-4 mt-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Hoạt động real-time</p>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-white/5" />

                    <div className="space-y-1">
                        {SHADOW_ACTIVITY.map((act, idx) => {
                            const Icon = act.icon
                            const colorClass = typeColors[act.type] || 'bg-slate-50 text-slate-500'
                            return (
                                <div key={act.id} className={cn(
                                    'relative flex gap-3 rounded-xl p-3 transition-all',
                                    idx === 0 && isLive ? 'bg-white/5 ring-1 ring-emerald-500/20' : ''
                                )}>
                                    {/* Icon */}
                                    <div className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', colorClass)}>
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-200 leading-relaxed">{act.description}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-xs text-primary-400 font-medium">{act.leadName}</span>
                                            <span className="text-[10px] text-slate-600">M{act.milestone}</span>
                                            <span className="text-[10px] text-slate-600 ml-auto">{formatRelativeTime(act.time)}</span>
                                        </div>
                                    </div>

                                    {/* Live indicator */}
                                    {idx === 0 && isLive && (
                                        <span className="absolute top-3 right-3 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 px-4 py-3 safe-bottom">
                <div className="mx-auto max-w-2xl flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-500/20 py-3 text-sm font-medium text-indigo-400 hover:bg-indigo-500/30 transition-all">
                        <MessageSquare className="h-4 w-4" />
                        Gửi lệnh
                    </button>
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all',
                            isLive
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        )}
                    >
                        {isLive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {isLive ? 'Tắt theo dõi' : 'Bật theo dõi'}
                    </button>
                </div>
            </div>
        </div>
    )
}
