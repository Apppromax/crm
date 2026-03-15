'use client'

import { useState } from 'react'
import { Bell, X, Check, AlertTriangle, MessageSquare, ArrowUp, Clock, CheckCheck } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'

interface Notification {
    id: string
    type: 'SOS' | 'MILESTONE' | 'ADVICE' | 'SCHEDULE' | 'SYSTEM'
    title: string
    message: string
    read: boolean
    createdAt: Date
    leadId?: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'n1', type: 'SOS', title: 'SOS: Lead quá hạn',
        message: 'Phạm Minh Tuấn (Mốc 4) — Lịch hẹn bị hủy 2 lần. Cần can thiệp.',
        read: false, createdAt: new Date(Date.now() - 3600000), leadId: 'lead-004',
    },
    {
        id: 'n2', type: 'MILESTONE', title: 'Thăng mốc thành công!',
        message: 'Trần Thị Bảo Ngọc đã thăng lên Mốc 3: Niềm tin ✨',
        read: false, createdAt: new Date(Date.now() - 7200000), leadId: 'lead-001',
    },
    {
        id: 'n3', type: 'ADVICE', title: 'Lệnh sếp mới',
        message: 'Manager đã gửi chỉ thị cho lead Trần Thị Bảo Ngọc. Xem ngay.',
        read: false, createdAt: new Date(Date.now() - 14400000), leadId: 'lead-001',
    },
    {
        id: 'n4', type: 'SCHEDULE', title: 'Lịch hẹn sắp tới',
        message: 'Bạn có cuộc hẹn với Nguyễn Văn Đức trong 1 giờ.',
        read: true, createdAt: new Date(Date.now() - 28800000), leadId: 'lead-002',
    },
    {
        id: 'n5', type: 'SYSTEM', title: 'Chuỗi streak 5 ngày! 🔥',
        message: 'Chúc mừng! Bạn đã tương tác đủ leads 5 ngày liên tiếp.',
        read: true, createdAt: new Date(Date.now() - 86400000),
    },
]

const typeConfig = {
    SOS: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    MILESTONE: { icon: ArrowUp, color: 'text-primary-500', bg: 'bg-primary-50' },
    ADVICE: { icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    SCHEDULE: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    SYSTEM: { icon: Bell, color: 'text-slate-500', bg: 'bg-slate-50' },
}

interface Props {
    isOpen: boolean
    onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: Props) {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

    const unreadCount = notifications.filter(n => !n.read).length

    function markAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    function markRead(id: string) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[90] flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-sm h-full bg-white shadow-2xl animate-slide-up overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-slate-700" />
                        <h2 className="text-base font-bold text-slate-800">Thông báo</h2>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:text-primary-700"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                Đọc hết
                            </button>
                        )}
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Notification List */}
                <div className="divide-y divide-slate-50">
                    {notifications.map(notif => {
                        const config = typeConfig[notif.type]
                        const Icon = config.icon
                        return (
                            <div
                                key={notif.id}
                                onClick={() => markRead(notif.id)}
                                className={cn(
                                    'px-4 py-3 flex gap-3 transition-colors cursor-pointer',
                                    !notif.read ? 'bg-primary-50/30' : 'hover:bg-slate-50/50'
                                )}
                            >
                                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', config.bg)}>
                                    <Icon className={cn('h-4 w-4', config.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={cn('text-sm font-medium truncate', !notif.read ? 'text-slate-900' : 'text-slate-600')}>
                                            {notif.title}
                                        </p>
                                        {!notif.read && <span className="h-2 w-2 rounded-full bg-primary-500 shrink-0" />}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                    <p className="text-[10px] text-slate-300 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
