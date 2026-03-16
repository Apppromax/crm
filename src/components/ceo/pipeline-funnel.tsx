'use client'

import { cn } from '@/lib/utils'

interface FlowNode {
    label: string
    value: number
    color: string
}

interface Props {
    data: {
        m1: number  // Tiếp cận
        m2: number  // Chào mồi
        m3: number  // Niềm tin
        m4: number  // Dồn chốt
        m5: number  // Chốt cọc
        lost: number // Lost/Recycled
    }
}

const milestones = [
    { key: 'm1', label: 'Tiếp cận', color: 'bg-sky-400', text: 'text-sky-700', bg: 'bg-sky-50' },
    { key: 'm2', label: 'Chào mồi', color: 'bg-blue-400', text: 'text-blue-700', bg: 'bg-blue-50' },
    { key: 'm3', label: 'Niềm tin', color: 'bg-indigo-400', text: 'text-indigo-700', bg: 'bg-indigo-50' },
    { key: 'm4', label: 'Dồn chốt', color: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50' },
    { key: 'm5', label: 'Chốt cọc', color: 'bg-emerald-400', text: 'text-emerald-700', bg: 'bg-emerald-50' },
]

export function PipelineFunnel({ data }: Props) {
    const total = data.m1 + data.m2 + data.m3 + data.m4 + data.m5 + data.lost
    if (total === 0) return null

    const values = [data.m1, data.m2, data.m3, data.m4, data.m5]
    const maxVal = Math.max(...values, 1)

    // Conversion rates between stages
    const conversions = values.slice(0, -1).map((v, i) => {
        if (v === 0) return 0
        return Math.round((values[i + 1] / v) * 100)
    })

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
            <h3 className="text-sm font-semibold text-white/80 mb-4">📊 Pipeline Funnel</h3>

            <div className="space-y-3">
                {milestones.map((m, i) => {
                    const value = values[i]
                    const width = Math.max(8, (value / maxVal) * 100)

                    return (
                        <div key={m.key}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-white/60">{m.label}</span>
                                <span className="text-xs font-bold text-white/90">{value}</span>
                            </div>
                            <div className="relative h-8 rounded-lg bg-white/5 overflow-hidden">
                                <div
                                    className={cn('h-full rounded-lg transition-all duration-700 flex items-center justify-end px-2', m.color)}
                                    style={{ width: `${width}%` }}
                                >
                                    {value > 0 && (
                                        <span className="text-[10px] font-bold text-white/90">
                                            {Math.round((value / total) * 100)}%
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Conversion arrow */}
                            {i < conversions.length && (
                                <div className="flex items-center justify-center py-1">
                                    <div className="flex items-center gap-1">
                                        <div className="h-3 w-px bg-white/20" />
                                        <span className={cn(
                                            'text-[10px] font-medium',
                                            conversions[i] >= 50 ? 'text-emerald-400' :
                                                conversions[i] >= 30 ? 'text-amber-400' : 'text-red-400'
                                        )}>
                                            ↓ {conversions[i]}%
                                        </span>
                                        <div className="h-3 w-px bg-white/20" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Lost */}
            {data.lost > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">🔄 Lost / Recycled</span>
                        <span className="text-xs font-medium text-red-400">{data.lost}</span>
                    </div>
                </div>
            )}

            {/* Overall conversion */}
            <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">Tổng conversion M1→M5</span>
                    <span className={cn(
                        'text-sm font-bold',
                        data.m1 > 0 && (data.m5 / data.m1) * 100 >= 10
                            ? 'text-emerald-400' : 'text-amber-400'
                    )}>
                        {data.m1 > 0 ? Math.round((data.m5 / data.m1) * 100) : 0}%
                    </span>
                </div>
            </div>
        </div>
    )
}
