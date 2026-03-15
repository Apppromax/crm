'use client'

import { useState } from 'react'
import { AlertTriangle, Eye, MessageSquare, Clock, CheckCircle, X, ChevronDown, Flame } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'

const MOCK_SOS = [
    {
        id: 'sos-001',
        type: 'HOT_NOT_CLOSED' as const,
        severity: 'CRITICAL' as const,
        status: 'ACTIVE' as const,
        message: 'Phạm Minh Tuấn — Mốc 4 quá 5 ngày chưa chốt booking. Lịch hẹn gặp thứ 7 bị hủy lần 2.',
        createdAt: new Date(Date.now() - 2 * 3600000),
        lead: {
            id: 'lead-004', name: 'Phạm Minh Tuấn', currentMilestone: 4, heatScore: 90,
            assignee: 'Nguyễn Văn A',
            dealValue: 4_200_000_000,
        },
    },
    {
        id: 'sos-002',
        type: 'STUCK_MILESTONE' as const,
        severity: 'WARNING' as const,
        status: 'ACTIVE' as const,
        message: 'Đặng Quốc Bảo — Mốc 3 hơn 7 ngày không thăng. Khách cần bàn thêm với vợ.',
        createdAt: new Date(Date.now() - 12 * 3600000),
        lead: {
            id: 'lead-006', name: 'Đặng Quốc Bảo', currentMilestone: 3, heatScore: 45,
            assignee: 'Nguyễn Văn A',
            dealValue: 2_800_000_000,
        },
    },
]

export default function SOSPage() {
    const [resolvedIds, setResolvedIds] = useState<string[]>([])

    function handleResolve(id: string) {
        setResolvedIds(prev => [...prev, id])
    }

    const activeAlerts = MOCK_SOS.filter(s => !resolvedIds.includes(s.id))

    return (
        <div className="mx-auto max-w-2xl">
            <header className="sticky top-0 z-40 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    SOS Alerts
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">{activeAlerts.length} cảnh báo cần xử lý</p>
            </header>

            <div className="px-4 py-4 space-y-3">
                {activeAlerts.length === 0 ? (
                    <div className="py-20 text-center">
                        <CheckCircle className="h-16 w-16 text-emerald-200 mx-auto mb-4" />
                        <h3 className="text-base font-semibold text-slate-600">Không có SOS nào!</h3>
                        <p className="text-sm text-slate-400 mt-1">Team đang hoạt động ổn</p>
                    </div>
                ) : (
                    activeAlerts.map(sos => (
                        <div key={sos.id} className={cn(
                            'rounded-2xl border p-4 animate-slide-up',
                            sos.severity === 'CRITICAL'
                                ? 'bg-red-50/50 border-red-200'
                                : 'bg-amber-50/50 border-amber-200'
                        )}>
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                        sos.severity === 'CRITICAL' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
                                    )}>
                                        {sos.severity}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{formatRelativeTime(sos.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Flame className={cn('h-4 w-4', sos.lead.heatScore >= 70 ? 'text-red-500' : 'text-orange-400')} />
                                    <span className="text-xs font-bold text-slate-600">{sos.lead.heatScore}</span>
                                </div>
                            </div>

                            {/* Lead Info */}
                            <h3 className="text-sm font-semibold text-slate-800 mb-0.5">{sos.lead.name}</h3>
                            <p className="text-xs text-slate-400 mb-2">
                                Mốc {sos.lead.currentMilestone} • {sos.lead.assignee} • {(sos.lead.dealValue / 1_000_000_000).toFixed(1)} tỷ
                            </p>

                            {/* Message */}
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">{sos.message}</p>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/sale/leads/${sos.lead.id}`}
                                    className="flex items-center gap-1.5 rounded-xl bg-primary-500 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-600 transition-all"
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    Xem chi tiết
                                </Link>
                                <button className="flex items-center gap-1.5 rounded-xl bg-indigo-100 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-200 transition-all">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Gửi lệnh
                                </button>
                                <button
                                    onClick={() => handleResolve(sos.id)}
                                    className="ml-auto flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Xong
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
