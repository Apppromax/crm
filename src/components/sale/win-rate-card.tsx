'use client'

import { useState } from 'react'
import { TrendingUp, ChevronDown, ChevronUp, Target, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { predictWinRate } from '@/lib/win-rate'

type WinPrediction = ReturnType<typeof predictWinRate>

interface Props {
    prediction: WinPrediction
}

export function WinRateCard({ prediction }: Props) {
    const [expanded, setExpanded] = useState(false)

    const colorMap = {
        'Rất cao': { ring: 'ring-emerald-400', text: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
        'Cao': { ring: 'ring-primary-400', text: 'text-primary-600', bg: 'bg-primary-50', bar: 'bg-primary-500' },
        'Trung bình': { ring: 'ring-amber-400', text: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' },
        'Thấp': { ring: 'ring-orange-400', text: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-500' },
        'Rất thấp': { ring: 'ring-red-400', text: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500' },
    }

    const colors = colorMap[prediction.label as keyof typeof colorMap] || colorMap['Trung bình']

    return (
        <div className="mx-4 mb-4">
            <button
                onClick={() => setExpanded(!expanded)}
                className={cn(
                    'w-full rounded-2xl mgr-glass-card p-4',
                    'transition-all hover:shadow-md'
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colors.bg)}>
                            <Target className={cn('h-5 w-5', colors.text)} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-slate-400">Win Rate</p>
                            <div className="flex items-center gap-2">
                                <span className={cn('text-lg font-bold', colors.text)}>{prediction.probability}%</span>
                                <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-full', colors.bg, colors.text)}>
                                    {prediction.label}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            'text-[10px] font-medium px-2 py-0.5 rounded-full',
                            prediction.confidence === 'HIGH' ? 'bg-emerald-50 text-emerald-600' :
                                prediction.confidence === 'MEDIUM' ? 'bg-amber-50 text-amber-600' :
                                    'bg-slate-100 text-slate-500'
                        )}>
                            {prediction.confidence === 'HIGH' ? '🎯 Tin cậy cao' :
                                prediction.confidence === 'MEDIUM' ? '📊 Trung bình' : '❓ Cần thêm data'}
                        </span>
                        {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 rounded-full bg-white/50 overflow-hidden">
                    <div
                        className={cn('h-full rounded-full transition-all duration-700', colors.bar)}
                        style={{ width: `${prediction.probability}%` }}
                    />
                </div>
            </button>

            {expanded && (
                <div className="mt-2 mgr-glass-card p-4 space-y-3 animate-slide-up">
                    {/* Factors */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            Yếu tố đánh giá
                        </p>
                        <div className="space-y-2">
                            {prediction.factors.map((f, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className={cn(
                                        'text-xs font-mono w-8 text-right',
                                        f.impact > 0 ? 'text-emerald-600' : f.impact < 0 ? 'text-red-500' : 'text-slate-400'
                                    )}>
                                        {f.impact > 0 ? '+' : ''}{f.impact}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-700">{f.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{f.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div className="rounded-xl bg-primary-50/50 px-3 py-2">
                        <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-primary-700">{prediction.recommendation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
