'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Phone, Video, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn, formatCurrencyShort } from '@/lib/utils'
import Link from 'next/link'

// Mock schedule data
const MOCK_SCHEDULES = [
    {
        id: 's1', leadId: 'lead-001', leadName: 'Trần Thị Bảo Ngọc',
        type: 'MEETING' as const, title: 'Xem nhà mẫu The Grand',
        date: new Date(2026, 2, 15, 14, 0),
        location: 'Nhà mẫu The Grand Manhattan, Q1',
        milestone: 3, dealValue: 3_500_000_000,
    },
    {
        id: 's2', leadId: 'lead-002', leadName: 'Nguyễn Văn Đức',
        type: 'CALL' as const, title: 'Gọi follow-up phương án tài chính',
        date: new Date(2026, 2, 15, 16, 30),
        milestone: 2, dealValue: 5_000_000_000,
    },
    {
        id: 's3', leadId: 'lead-004', leadName: 'Phạm Minh Tuấn',
        type: 'MEETING' as const, title: 'Gặp mặt bàn hợp đồng',
        date: new Date(2026, 2, 16, 10, 0),
        location: 'VP Công ty, 123 Nguyễn Huệ',
        milestone: 4, dealValue: 4_200_000_000,
    },
    {
        id: 's4', leadId: 'lead-003', leadName: 'Hoàng Anh Kiệt',
        type: 'VIDEO' as const, title: 'Zoom trình bày dòng tiền',
        date: new Date(2026, 2, 17, 9, 0),
        milestone: 4, dealValue: 8_200_000_000,
    },
]

const typeConfig = {
    MEETING: { icon: MapPin, color: 'text-primary-500', bg: 'bg-primary-50', label: 'Gặp mặt' },
    CALL: { icon: Phone, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Gọi điện' },
    VIDEO: { icon: Video, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Video call' },
}

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 15))

    const today = new Date(2026, 2, 15)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() - today.getDay() + 1 + i) // Mon-Sun
        return d
    })

    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

    const filteredSchedules = MOCK_SCHEDULES.filter(s =>
        s.date.toDateString() === selectedDate.toDateString()
    )

    const upcomingSchedules = MOCK_SCHEDULES
        .filter(s => s.date > selectedDate)
        .sort((a, b) => a.date.getTime() - b.date.getTime())

    return (
        <div className="mx-auto max-w-lg min-h-dvh">
            <header className="sticky top-0 z-40 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary-500" />
                        Lịch hẹn
                    </h1>
                    <Link
                        href="/sale/new"
                        className="flex items-center gap-1 rounded-xl bg-primary-50 px-3 py-2 text-xs font-medium text-primary-600 hover:bg-primary-100"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Thêm
                    </Link>
                </div>
            </header>

            {/* Week Calendar Strip */}
            <div className="bg-white border-b border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                    <button className="text-slate-400 hover:text-slate-600"><ChevronLeft className="h-4 w-4" /></button>
                    <p className="text-sm font-semibold text-slate-700">Tháng 3, 2026</p>
                    <button className="text-slate-400 hover:text-slate-600"><ChevronRight className="h-4 w-4" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day, idx) => {
                        const isSelected = day.toDateString() === selectedDate.toDateString()
                        const isToday = day.toDateString() === today.toDateString()
                        const hasEvents = MOCK_SCHEDULES.some(s => s.date.toDateString() === day.toDateString())
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    'flex flex-col items-center rounded-xl py-2 transition-all',
                                    isSelected
                                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                                        : isToday
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-slate-500 hover:bg-slate-50'
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
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {filteredSchedules.length > 0 && ` — ${filteredSchedules.length} lịch`}
                </p>

                {filteredSchedules.length === 0 ? (
                    <div className="py-12 text-center">
                        <Calendar className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">Không có lịch hẹn</p>
                        <p className="text-xs text-slate-300 mt-1">Ngày rảnh — tập trung gọi leads mới!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredSchedules.map(schedule => {
                            const config = typeConfig[schedule.type]
                            const Icon = config.icon
                            return (
                                <Link key={schedule.id} href={`/sale/leads/${schedule.leadId}`}>
                                    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 hover:border-slate-200 transition-all active:scale-[0.99]">
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
                                                <h3 className="text-sm font-semibold text-slate-800 truncate">{schedule.title}</h3>
                                                <p className="text-xs text-primary-600 font-medium mt-0.5">{schedule.leadName}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {schedule.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {schedule.location && (
                                                        <span className="flex items-center gap-1 truncate">
                                                            <MapPin className="h-3 w-3" />
                                                            {schedule.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-400 shrink-0">
                                                {formatCurrencyShort(schedule.dealValue)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Upcoming */}
            {upcomingSchedules.length > 0 && (
                <div className="px-4 pb-24">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sắp tới</p>
                    <div className="space-y-2">
                        {upcomingSchedules.slice(0, 5).map(s => {
                            const config = typeConfig[s.type]
                            const Icon = config.icon
                            return (
                                <div key={s.id} className="flex items-center gap-3 rounded-xl bg-white border border-slate-100 p-3">
                                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                                        <Icon className={cn('h-4 w-4', config.color)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">{s.leadName}</p>
                                        <p className="text-[10px] text-slate-400">
                                            {s.date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                                            {' • '}
                                            {s.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
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
