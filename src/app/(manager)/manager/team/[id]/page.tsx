'use client'

import { ArrowLeft, Phone, MessageSquare, Eye, Flame, Target, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { cn, formatRelativeTime, getMilestoneLabel, formatCurrencyShort } from '@/lib/utils'
import { MOCK_LEADS } from '@/lib/mock-data'

// Mock team member data with their leads
const TEAM_MEMBERS: Record<string, {
    name: string; email: string; streak: number; compliance: number
    closedThisMonth: number; avgResponseTime: string; status: 'GREEN' | 'YELLOW' | 'RED'
}> = {
    'user-001': { name: 'Nguyễn Văn A', email: 'a.nv@crmpro.vn', streak: 5, compliance: 92, closedThisMonth: 1, avgResponseTime: '15 phút', status: 'GREEN' },
    'user-002': { name: 'Trần Minh B', email: 'b.tm@crmpro.vn', streak: 2, compliance: 65, closedThisMonth: 0, avgResponseTime: '2.5 giờ', status: 'YELLOW' },
    'user-003': { name: 'Lê Thị C', email: 'c.lt@crmpro.vn', streak: 0, compliance: 38, closedThisMonth: 0, avgResponseTime: '8 giờ', status: 'RED' },
}

export default function TeamMemberDetail({ params }: { params: Promise<{ id: string }> }) {
    // In real app, await params; using default for demo
    const memberId = 'user-001'
    const member = TEAM_MEMBERS[memberId] || TEAM_MEMBERS['user-001']
    const memberLeads = MOCK_LEADS.filter(l => l.status === 'ACTIVE')

    const statusColors = {
        GREEN: { bg: 'bg-emerald-500', text: 'text-emerald-700', label: 'On Track' },
        YELLOW: { bg: 'bg-amber-500', text: 'text-amber-700', label: 'Cần hỗ trợ' },
        RED: { bg: 'bg-red-500', text: 'text-red-700', label: 'Cần can thiệp ngay' },
    }
    const sc = statusColors[member.status]

    return (
        <div className="mx-auto max-w-2xl min-h-dvh">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center gap-3 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <Link href="/manager" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-base font-semibold text-slate-900">{member.name}</h1>
                    <p className="text-xs text-slate-400">{member.email}</p>
                </div>
                <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold text-white', sc.bg)}>
                    {sc.label}
                </span>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2 px-4 pt-4">
                <StatMini icon={<Target className="h-4 w-4 text-primary-500" />} value={`${member.compliance}%`} label="Compliance" />
                <StatMini icon={<Flame className="h-4 w-4 text-orange-500" />} value={`${member.streak}`} label="Streak" />
                <StatMini icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} value={`${member.closedThisMonth}`} label="Chốt" />
                <StatMini icon={<Clock className="h-4 w-4 text-slate-400" />} value={member.avgResponseTime} label="Avg Reply" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 px-4 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-500 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 transition-all">
                    <MessageSquare className="h-4 w-4" />
                    Gửi lệnh
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary-500 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-600 transition-all">
                    <Eye className="h-4 w-4" />
                    Shadow Mode
                </button>
            </div>

            {/* Lead List */}
            <div className="px-4 mt-5">
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                    Danh sách Lead ({memberLeads.length})
                </h3>
                <div className="space-y-2">
                    {memberLeads.map(lead => (
                        <Link key={lead.id} href={`/sale/leads/${lead.id}`}>
                            <div className="rounded-xl bg-white border border-slate-100 p-3 flex items-center gap-3 hover:border-slate-200 transition-all active:scale-[0.98]">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold shrink-0">
                                    {lead.name.split(' ').pop()?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">{lead.name}</p>
                                    <p className="text-[10px] text-slate-400">
                                        M{lead.currentMilestone} • {getMilestoneLabel(lead.currentMilestone)}
                                        {lead.dealValue ? ` • ${formatCurrencyShort(lead.dealValue)}` : ''}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={cn(
                                        'text-xs font-bold',
                                        lead.heatScore >= 70 ? 'text-red-500' : lead.heatScore >= 40 ? 'text-orange-500' : 'text-slate-400'
                                    )}>
                                        🔥 {lead.heatScore}
                                    </span>
                                    <p className="text-[10px] text-slate-400">
                                        {lead.lastInteractionAt ? formatRelativeTime(lead.lastInteractionAt) : '-'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Manager Advice History */}
            <div className="px-4 mt-5 mb-24">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-indigo-500" />
                    Lệnh đã gửi
                </h3>
                <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 space-y-3">
                    <div>
                        <p className="text-xs text-indigo-400 mb-1">2 giờ trước • Lead: Trần Thị Bảo Ngọc</p>
                        <p className="text-sm text-indigo-800">Khách này phải chốt trong tuần. Mời xem nhà mẫu thứ 7. Nhấn mạnh chính sách trả góp 0%.</p>
                    </div>
                    <div className="border-t border-indigo-100 pt-3">
                        <p className="text-xs text-indigo-400 mb-1">1 ngày trước • Lead: Phạm Minh Tuấn</p>
                        <p className="text-sm text-indigo-800">Gặp mặt lần 2, đưa bảng so sánh căn A vs B. Push chốt.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatMini({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="rounded-xl bg-white border border-slate-100 p-2.5 text-center">
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-sm font-bold text-slate-800">{value}</p>
            <p className="text-[10px] text-slate-400">{label}</p>
        </div>
    )
}
