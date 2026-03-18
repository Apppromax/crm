'use client'

import { useState, useTransition } from 'react'
import { Bell, User, Flame, ChevronDown, ChevronUp, Zap, RotateCcw, X, Diamond, Heart, Loader2, MessageCircle, CreditCard, UserCheck } from 'lucide-react'
import { SmartCard } from '@/components/sale/smart-card'
import { BigButton } from '@/components/sale/big-button'
import { cn, formatCurrencyShort } from '@/lib/utils'
import { NotificationPanel } from '@/components/shared/notification-panel'
import { closeDeal, demoteToNurture } from '@/app/actions/leads'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CardData {
    id: string
    name: string
    currentMilestone: number
    heatScore: number
    priorityScore: number
    priorityReason: 'diamond' | 'hot_seat' | 'net' | 'retry' | 'golden_72h' | 'schedule_due' | 'fresh' | 'manager_advice' | string
    dealValue: number | null
    aiSummary: string | null
    bantBudget: string
    consecutiveMissCount: number
    hasManagerAdvice: boolean
    nextSchedule: { scheduledAt: Date; type: string } | null
}

interface QueueItem {
    id: string
    name: string
    currentMilestone: number
    heatScore: number
    priorityScore: number
    dealValue: number | null
    isGolden: boolean
    isRetry: boolean
    colorBadge: string | null
    sharpnessScore: number | null
    isUnprocessed: boolean
}

interface Props {
    userId: string
    topCards: CardData[]
    queueItems: QueueItem[]
    stats: {
        totalLeads: number
        milestone45: number
        streakCount: number
        pipelineValue: number
    }
}

export function SaleHomeClient({ userId, topCards, queueItems, stats }: Props) {
    const [showNotifications, setShowNotifications] = useState(false)
    const [showQueue, setShowQueue] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const hotSeats = topCards.filter(c => c.priorityReason === 'hot_seat')
    const normalCards = topCards.filter(c => c.priorityReason !== 'hot_seat')

    // Queue Gameification logic
    const totalQueue = queueItems.length
    let queueColorClass = ''
    let barWidthPercent = 100 // Visual width relative to panic level

    if (totalQueue === 0) {
        queueColorClass = "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"
        barWidthPercent = 100
    } else if (totalQueue <= 4) {
        queueColorClass = "bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.5)]"
        barWidthPercent = 50
    } else {
        queueColorClass = "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"
        barWidthPercent = 15
    }
    return (
        <div className="mx-auto max-w-lg">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-transparent">
                <div className="flex items-center gap-2 bg-white/25 backdrop-blur-2xl rounded-full pr-4 p-1 pl-1 border border-white/50 shadow-[0_2px_12px_rgba(0,0,0,0.04),inset_0_1px_0px_rgba(255,255,255,0.5)]">
                    <div className="h-9 w-9 rounded-full bg-teal-500 flex items-center justify-center shadow-sm">
                        <span className="text-[15px] font-bold text-white">C</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-[13px] font-bold text-slate-900 leading-tight">CRM Pro</h1>
                        <p className="text-[10px] font-medium text-slate-800 leading-tight mt-0.5">{topCards.length} khách cần xử lý</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/25 backdrop-blur-2xl rounded-full px-1.5 py-1.5 border border-white/50 shadow-[0_2px_12px_rgba(0,0,0,0.04),inset_0_1px_0px_rgba(255,255,255,0.5)]">
                    <button
                        onClick={() => setShowNotifications(true)}
                        className="relative flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-white/40"
                    >
                        <Bell className="h-4 w-4 stroke-[2]" />
                        <span className="absolute right-0.5 top-0.5 h-[7px] w-[7px] rounded-full bg-red-500 border border-white" />
                    </button>
                    <Link
                        href="/sale/achievements"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-white/40"
                    >
                        <User className="h-4 w-4 stroke-[2]" />
                    </Link>
                </div>
            </header>

            {/* ============================================ */}
            {/* HOT SEAT — “TREO” AREA (Floating, Separated) */}
            {/* ============================================ */}
            {hotSeats.length > 0 && (
                <div className="mx-4 mt-1 mb-5 relative animate-scale-in">
                    {/* Floating platform glow — đỏ rực sáng */}
                    <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-red-500/25 via-orange-500/20 to-red-400/25 blur-xl -z-10 animate-pulse" />

                    {/* Container with burning border */}
                    <div className="relative rounded-[28px] border-2 border-red-500/70 bg-gradient-to-br from-red-50/50 via-white/30 to-orange-50/40 backdrop-blur-2xl p-4 shadow-[0_12px_40px_-8px_rgba(239,68,68,0.5),inset_0_1px_0_rgba(255,255,255,0.6)]">
                        {/* Label */}
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-300/60 to-transparent" />
                            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-[0_4px_16px_rgba(239,68,68,0.6)] animate-pulse">
                                <Flame className="w-3 h-3 fill-white" /> VÙNG TREO · DỒN CHỐT
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-red-300/60 to-transparent" />
                        </div>

                        {/* 3 Tín hiệu checklist */}
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 bg-emerald-100/80 border border-emerald-200/60 text-emerald-700 text-[9px] font-bold px-2 py-1 rounded-lg">
                                <Heart className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" /> Tin Sale
                            </span>
                            <span className="inline-flex items-center gap-1 bg-blue-100/80 border border-blue-200/60 text-blue-700 text-[9px] font-bold px-2 py-1 rounded-lg">
                                <MessageCircle className="w-2.5 h-2.5" /> Thích Dự án
                            </span>
                            <span className="inline-flex items-center gap-1 bg-amber-100/80 border border-amber-200/60 text-amber-700 text-[9px] font-bold px-2 py-1 rounded-lg">
                                <CreditCard className="w-2.5 h-2.5" /> Hỏi giá
                            </span>
                        </div>

                        {/* Floating cards */}
                        <div className="flex flex-col gap-3">
                            {hotSeats.map((card) => (
                                <div key={card.id}>
                                    <SmartCard card={card as any} rank={0} />
                                    {/* CHỐT / NUÔI LẠI Buttons */}
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            disabled={isPending}
                                            onClick={() => startTransition(async () => {
                                                await closeDeal(card.id, userId)
                                                router.refresh()
                                            })}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white text-sm font-black shadow-[0_4px_20px_rgba(45,212,191,0.5)] transition-all hover:shadow-[0_6px_28px_rgba(45,212,191,0.7)] active:scale-[0.97] disabled:opacity-50"
                                        >
                                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Diamond className="w-4 h-4 fill-white" />}
                                            CHỐT CỌC
                                        </button>
                                        <button
                                            disabled={isPending}
                                            onClick={() => startTransition(async () => {
                                                await demoteToNurture(card.id, userId)
                                                router.refresh()
                                            })}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-white/60 border-2 border-slate-200 text-slate-600 text-sm font-bold backdrop-blur-sm transition-all hover:bg-white/80 active:scale-[0.97] disabled:opacity-50"
                                        >
                                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                            NUÔI LẠI
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom hint */}
                        <p className="text-center text-[10px] text-red-600/80 font-semibold mt-3 tracking-wide">
                            ⚡ Tập trung chốt — Không để khách tuột tay!
                        </p>
                    </div>
                </div>
            )}

            {/* Normal Top Cards — glass */}
            {normalCards.length > 0 && (
                <div className="px-4 pt-2 flex flex-col gap-4 stagger-children">
                    {normalCards.map((card, index) => (
                        <SmartCard key={card.id} card={card as any} rank={index + 1} />
                    ))}
                </div>
            )}

            {/* ============================================ */}
            {/* QUEUE BAR — Clickable + Expandable Panel      */}
            {/* ============================================ */}
            <div className="mx-4 mt-6 animate-slide-up" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
                <button
                    onClick={() => setShowQueue(!showQueue)}
                    className="w-full bg-white/40 backdrop-blur-2xl rounded-2xl p-[3px] border border-white/60 shadow-sm relative z-20 transition-all hover:bg-white/50 active:scale-[0.99]"
                >
                    <div className="flex items-center px-1.5 py-1">
                        <div className="flex-none bg-gradient-to-b from-white to-slate-50 rounded-full px-3 py-1 border border-black/5 shadow-sm">
                            <span className="text-[10px] font-black text-slate-800 whitespace-nowrap">GIỎ ĐỢI ({totalQueue})</span>
                        </div>
                        <div className="flex-1 mx-2 h-[6px] rounded-full bg-rose-200 overflow-hidden shadow-inner">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    queueColorClass
                                )}
                                style={{ width: `${barWidthPercent}%` }}
                            />
                        </div>
                        <div className="w-6 h-6 shrink-0 rounded-full bg-slate-200 flex items-center justify-center">
                            {showQueue ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />}
                        </div>
                    </div>
                </button>

                {/* Queue Panel — expandable */}
                {showQueue && (
                    <div className="mt-2 bg-white/50 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-lg overflow-hidden animate-slide-up">
                        <div className="px-4 py-3 border-b border-white/40 flex items-center justify-between">
                            <h3 className="text-[13px] font-bold text-slate-800">Danh sách hàng đợi</h3>
                            <button onClick={() => setShowQueue(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {totalQueue === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <div className="text-3xl mb-2">🎉</div>
                                <p className="text-sm font-semibold text-emerald-600">Giỏ đợi trống!</p>
                                <p className="text-xs text-slate-500 mt-1">Bạn đã xử lý xong tất cả khách hàng</p>
                            </div>
                        ) : (
                            <div className="max-h-[300px] overflow-y-auto">
                                {queueItems.map((item, i) => (
                                    <Link
                                        key={item.id}
                                        href={`/sale/leads/${item.id}`}
                                        className="flex items-center gap-3 px-4 py-3 border-b border-white/30 last:border-b-0 hover:bg-white/30 transition-colors group"
                                    >
                                        {/* Rank */}
                                        <span className="text-[11px] font-bold text-slate-400 w-5 text-center">{i + 4}</span>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[13px] font-semibold text-slate-800 truncate">{item.name}</span>
                                                {/* Tier 1: Nhãn màu nét */}
                                                {item.colorBadge === 'GREEN' && (
                                                    <span className="flex-none inline-flex items-center gap-0.5 bg-emerald-100/80 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">● Nét</span>
                                                )}
                                                {item.colorBadge === 'ORANGE' && (
                                                    <span className="flex-none inline-flex items-center gap-0.5 bg-amber-100/80 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">● Tiềm năng</span>
                                                )}
                                                {item.colorBadge === 'RED' && (
                                                    <span className="flex-none inline-flex items-center gap-0.5 bg-red-100/80 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">● Thấp</span>
                                                )}
                                                {/* Tier 2: Fresh */}
                                                {item.isUnprocessed && (
                                                    <span className="flex-none inline-flex items-center gap-0.5 bg-slate-100/80 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">Mới</span>
                                                )}
                                                {/* Tier 3: Tags */}
                                                {item.isGolden && (
                                                    <span className="flex-none inline-flex items-center gap-0.5 bg-amber-100/80 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <Zap className="w-2.5 h-2.5" /> 72h
                                                    </span>
                                                )}
                                                {item.isRetry && (
                                                    <span className="flex-none inline-flex items-center gap-0.5 bg-slate-100/80 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <RotateCcw className="w-2.5 h-2.5" /> Retry
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-slate-500">Mốc {item.currentMilestone} · 🔥 {item.heatScore}</span>
                                        </div>

                                        {/* Deal Value */}
                                        {item.dealValue && (
                                            <span className="text-[12px] font-bold text-emerald-600 whitespace-nowrap">
                                                {item.dealValue >= 1000000000 ? `${(item.dealValue / 1000000000).toFixed(1)} tỷ` : formatCurrencyShort(item.dealValue)}
                                            </span>
                                        )}

                                        {/* Arrow hint */}
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-300 -rotate-90 group-hover:text-slate-500 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Big Button overlaps with Stats box */}
            {topCards.length > 0 && (
                <div className="flex justify-center pt-6 animate-pop-in relative z-20 -mb-[50px] pointer-events-none" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                    <div className="pointer-events-auto">
                    <BigButton leadName={topCards[0].name} leadId={topCards[0].id} />
                    </div>
                </div>
            )}

            {/* Quick Stats — glass card with warm gradient */}
            <div className="mx-4 mb-6 bg-white/25 backdrop-blur-2xl border border-white/60 p-5 pt-[60px] pb-5 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_0px_rgba(255,255,255,0.5)] animate-scale-in relative z-10" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                <div className="grid grid-cols-3 gap-2 text-center text-slate-800">
                    <div className="flex flex-col items-center">
                        <p className="text-[26px] font-bold text-[#1A89B0] leading-none mb-1">{stats.totalLeads}</p>
                        <p className="text-[11px] font-semibold text-slate-700">Active Leads</p>
                    </div>
                    <div className="flex flex-col items-center border-l border-r border-white/60">
                        <p className="text-[26px] font-bold text-[#2ea869] leading-none mb-1">{stats.milestone45}</p>
                        <p className="text-[11px] font-semibold text-slate-700">Mốc 4-5</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-[26px] font-bold text-[#e89028] leading-none mb-1">{stats.streakCount}</p>
                        <p className="text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1"><Flame className="w-3 h-3 text-red-500 fill-red-500" /> Streak</p>
                    </div>
                </div>
                
                <div className="mt-4 text-center">
                    <p className="text-[12px] font-semibold text-slate-800 mb-0.5">Pipeline Value</p>
                    <p className="text-[38px] font-bold leading-none tracking-tight text-white drop-shadow-[0_2px_8px_rgba(230,120,70,0.5)]">
                        {stats.pipelineValue >= 1000000000 ? `${(stats.pipelineValue / 1000000000).toFixed(1)} tỷ` : formatCurrencyShort(stats.pipelineValue)}
                    </p>
                </div>
            </div>

            <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} userId={userId} />
        </div>
    )
}
