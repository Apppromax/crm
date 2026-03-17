'use client'

import { useState, useTransition } from 'react'
import { Calendar, Clock, MapPin, Phone, Video, Users, Plus, Check, X } from 'lucide-react'
import { cn, formatCurrencyShort } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSchedule, completeSchedule } from '@/app/actions/dashboard'

type ScheduleItem = {
    id: string
    leadId: string
    leadName: string
    type: string
    note: string | null
    scheduledAt: string
    status: string
    milestone: number
    dealValue: number | null
}

type LeadOption = {
    id: string
    name: string
    milestone: number
    dealValue: number | null
}

const typeConfig: Record<string, { icon: typeof Phone; color: string; bg: string; label: string }> = {
    MEETING: { icon: Users, color: 'text-primary-500', bg: 'bg-primary-50/80', label: 'Gặp mặt' },
    FOLLOW_UP: { icon: Phone, color: 'text-emerald-500', bg: 'bg-emerald-50/80', label: 'Follow-up' },
    GOLDEN_72H: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50/80', label: '72h Vàng' },
    AI_WARMUP: { icon: Video, color: 'text-indigo-500', bg: 'bg-indigo-50/80', label: 'AI Warmup' },
}

export function ScheduleClient({
    schedules, leads, userId,
}: {
    schedules: ScheduleItem[]
    leads: LeadOption[]
    userId: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showForm, setShowForm] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())

    const today = new Date()
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() - today.getDay() + 1 + i)
        return d
    })

    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

    const filteredSchedules = schedules.filter(s => {
        const sDate = new Date(s.scheduledAt)
        return sDate.toDateString() === selectedDate.toDateString()
    })

    const upcomingSchedules = schedules
        .filter(s => new Date(s.scheduledAt) > selectedDate)
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

    async function handleComplete(scheduleId: string) {
        startTransition(async () => {
            await completeSchedule(scheduleId)
            router.refresh()
        })
    }

    async function handleCreateSchedule(formData: FormData) {
        const leadId = formData.get('leadId') as string
        const type = formData.get('type') as 'FOLLOW_UP' | 'MEETING' | 'GOLDEN_72H' | 'AI_WARMUP'
        const date = formData.get('date') as string
        const time = formData.get('time') as string
        const note = formData.get('note') as string

        if (!leadId || !type || !date || !time) return

        startTransition(async () => {
            await createSchedule({
                leadId,
                userId,
                type,
                scheduledAt: `${date}T${time}:00`,
                note: note || undefined,
            })
            setShowForm(false)
            router.refresh()
        })
    }

    return (
        <div className="mx-auto max-w-lg min-h-dvh">
            <header className="sticky top-0 z-40 bg-white/20 backdrop-blur-2xl border-b border-white/30 px-4 py-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary-500" />
                        Lịch hẹn
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-1 rounded-xl bg-primary-50/80 px-3 py-2 text-xs font-medium text-primary-600 hover:bg-primary-100/80 transition-all"
                    >
                        {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {showForm ? 'Đóng' : 'Thêm'}
                    </button>
                </div>
            </header>

            {/* Create Schedule Form */}
            {showForm && (
                <div className="mx-4 mb-3 sale-glass-card p-4 animate-slide-up">
                    <form action={handleCreateSchedule} className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Khách hàng</label>
                            <select name="leadId" required
                                className="w-full rounded-xl border border-white/50 bg-white/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all"
                            >
                                <option value="">Chọn khách hàng...</option>
                                {leads.map(l => (
                                    <option key={l.id} value={l.id}>
                                        {l.name} — M{l.milestone} {l.dealValue ? `(${formatCurrencyShort(l.dealValue)})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Loại</label>
                                <select name="type" required
                                    className="w-full rounded-xl border border-white/50 bg-white/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 transition-all"
                                >
                                    <option value="FOLLOW_UP">Follow-up</option>
                                    <option value="MEETING">Gặp mặt</option>
                                    <option value="GOLDEN_72H">72h Vàng</option>
                                    <option value="AI_WARMUP">AI Warmup</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Ngày</label>
                                <input type="date" name="date" required
                                    defaultValue={today.toISOString().split('T')[0]}
                                    className="w-full rounded-xl border border-white/50 bg-white/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Giờ</label>
                                <input type="time" name="time" required
                                    defaultValue="09:00"
                                    className="w-full rounded-xl border border-white/50 bg-white/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-slate-500 mb-1 block">Ghi chú</label>
                                <input type="text" name="note" placeholder="VD: Xem dự án"
                                    className="w-full rounded-xl border border-white/50 bg-white/50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 transition-all"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={isPending}
                            className="w-full rounded-xl bg-primary-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/20 hover:bg-primary-600 disabled:opacity-50 transition-all"
                        >
                            {isPending ? 'Đang tạo...' : 'Tạo lịch hẹn'}
                        </button>
                    </form>
                </div>
            )}

            {/* Week Calendar Strip */}
            <div className="mx-4 mb-3 sale-glass-card p-3">
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day, idx) => {
                        const isSelected = day.toDateString() === selectedDate.toDateString()
                        const isToday = day.toDateString() === today.toDateString()
                        const hasEvents = schedules.some(s =>
                            new Date(s.scheduledAt).toDateString() === day.toDateString()
                        )
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    'flex flex-col items-center rounded-xl py-2 transition-all',
                                    isSelected
                                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                                        : isToday
                                            ? 'bg-primary-50/80 text-primary-700'
                                            : 'text-slate-500 hover:bg-white/50'
                                )}
                            >
                                <span className="text-[10px] font-medium">{dayNames[idx]}</span>
                                <span className={cn('text-sm font-bold mt-0.5', isSelected ? 'text-white' : '')}>{day.getDate()}</span>
                                {hasEvents && !isSelected && (
                                    <span className="mt-0.5 h-1 w-1 rounded-full bg-primary-400" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Selected Day Events */}
            <div className="px-4 py-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {filteredSchedules.length > 0 && ` — ${filteredSchedules.length} lịch`}
                </p>

                {filteredSchedules.length === 0 ? (
                    <div className="py-12 text-center">
                        <Calendar className="h-12 w-12 text-slate-300/60 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">Không có lịch hẹn</p>
                        <p className="text-xs text-slate-400 mt-1">Ngày rảnh — tập trung gọi leads mới!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredSchedules.map(schedule => {
                            const config = typeConfig[schedule.type] || typeConfig.FOLLOW_UP
                            const Icon = config.icon
                            const schedDate = new Date(schedule.scheduledAt)
                            return (
                                <div key={schedule.id} className="sale-glass-card p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', config.bg)}>
                                            <Icon className={cn('h-5 w-5', config.color)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded', config.bg, config.color)}>
                                                    {config.label}
                                                </span>
                                                <span className="text-[10px] text-slate-400">M{schedule.milestone}</span>
                                            </div>
                                            <Link href={`/sale/leads/${schedule.leadId}`}>
                                                <h3 className="text-sm font-semibold text-primary-600 hover:underline">{schedule.leadName}</h3>
                                            </Link>
                                            {schedule.note && (
                                                <p className="text-xs text-slate-500 mt-0.5">{schedule.note}</p>
                                            )}
                                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {schedDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {schedule.dealValue && (
                                                    <span className="text-xs font-medium text-slate-400">
                                                        {formatCurrencyShort(schedule.dealValue)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleComplete(schedule.id)}
                                            disabled={isPending}
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50/80 text-emerald-500 hover:bg-emerald-100/80 transition-colors disabled:opacity-50"
                                            title="Hoàn thành"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Upcoming */}
            {upcomingSchedules.length > 0 && (
                <div className="px-4 pb-24">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sắp tới</p>
                    <div className="space-y-2">
                        {upcomingSchedules.slice(0, 5).map(s => {
                            const config = typeConfig[s.type] || typeConfig.FOLLOW_UP
                            const Icon = config.icon
                            const sDate = new Date(s.scheduledAt)
                            return (
                                <div key={s.id} className="flex items-center gap-3 sale-glass-card p-3">
                                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                                        <Icon className={cn('h-4 w-4', config.color)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">{s.leadName}</p>
                                        <p className="text-[10px] text-slate-400">
                                            {sDate.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                                            {' • '}
                                            {sDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
