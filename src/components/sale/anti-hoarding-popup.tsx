'use client'

import { AlertTriangle, X, ArrowRight, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AntiHoardingAlert } from '@/lib/engine'

interface Props {
    alert: AntiHoardingAlert
    leadName: string
    onAction: () => void
    onDismiss: () => void
}

export function AntiHoardingPopup({ alert, leadName, onAction, onDismiss }: Props) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onDismiss}>
            <div
                className={cn(
                    'w-full max-w-sm rounded-3xl shadow-2xl animate-slide-up overflow-hidden',
                    alert.severity === 'CRITICAL' ? 'bg-red-50' : 'bg-amber-50'
                )}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={cn(
                    'px-5 py-4 flex items-center gap-3',
                    alert.severity === 'CRITICAL'
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600'
                )}>
                    <AlertTriangle className="h-6 w-6 text-white" />
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-white">
                            {alert.type === 'CONSECUTIVE_MISS' && 'Cảnh báo gọi nhỡ!'}
                            {alert.type === 'LONG_STALE' && 'Cảnh báo ngâm lead!'}
                            {alert.type === 'AUTO_RECLAIM' && '⚠️ Sắp bị thu hồi!'}
                        </h3>
                        <p className="text-xs text-white/80">{leadName}</p>
                    </div>
                    <button onClick={onDismiss} className="text-white/60 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">{alert.message}</p>

                    <div className="flex gap-2">
                        <button
                            onClick={onDismiss}
                            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-white active:scale-[0.98]"
                        >
                            Để sau
                        </button>
                        <button
                            onClick={onAction}
                            className={cn(
                                'flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-1.5',
                                alert.severity === 'CRITICAL'
                                    ? 'bg-red-500 shadow-lg shadow-red-500/25 hover:bg-red-600'
                                    : 'bg-amber-500 shadow-lg shadow-amber-500/25 hover:bg-amber-600'
                            )}
                        >
                            {alert.type === 'CONSECUTIVE_MISS' ? <Phone className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                            {alert.actionLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
