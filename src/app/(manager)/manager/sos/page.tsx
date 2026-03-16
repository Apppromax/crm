import { Suspense } from 'react'
import { AlertTriangle, Eye, MessageSquare, CheckCircle, Flame } from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { getUserByRole } from '@/app/actions/users'
import { getSOSAlerts } from '@/app/actions/dashboard'
import { SOSClientActions } from './sos-client'
import Loading from '@/app/(manager)/loading'

export default function SOSPageWrapper() {
    return (
        <Suspense fallback={<Loading />}>
            <SOSPage />
        </Suspense>
    )
}

async function SOSPage() {
    const user = await getUserByRole('MANAGER')
    if (!user) return <div className="p-8 text-center text-slate-400">No manager found</div>

    const sosAlerts = await getSOSAlerts(user.org.id)

    return (
        <div className="mx-auto max-w-2xl">
            <header className="sticky top-0 z-40 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    SOS Alerts
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">{sosAlerts.length} cảnh báo cần xử lý</p>
            </header>

            <div className="px-4 py-4 space-y-3 stagger-children">
                {sosAlerts.length === 0 ? (
                    <div className="py-20 text-center">
                        <CheckCircle className="h-16 w-16 text-emerald-200 mx-auto mb-4" />
                        <h3 className="text-base font-semibold text-slate-600">Không có SOS nào!</h3>
                        <p className="text-sm text-slate-400 mt-1">Team đang hoạt động ổn</p>
                    </div>
                ) : (
                    sosAlerts.map(sos => (
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
                            </div>

                            {/* Lead Info */}
                            <h3 className="text-sm font-semibold text-slate-800 mb-0.5">{sos.lead.name}</h3>
                            <p className="text-xs text-slate-400 mb-2">
                                Mốc {sos.lead.currentMilestone} • {sos.lead.assignee?.name || 'Unassigned'} • {sos.lead.dealValue ? `${(sos.lead.dealValue / 1_000_000_000).toFixed(1)} tỷ` : 'N/A'}
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
                                <SOSClientActions alertId={sos.id} userId={user.id} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
