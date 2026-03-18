'use client'

import { useState, useTransition } from 'react'
import { CheckCircle, MessageSquare, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { resolveSOSAlert } from '@/app/actions/dashboard'

interface Props {
    alertId: string
    userId: string
}

export function SOSClientActions({ alertId, userId }: Props) {
    const router = useRouter()
    const [isResolving, setIsResolving] = useState(false)
    const [resolved, setResolved] = useState(false)

    async function handleResolve() {
        // INSTANT feedback
        setResolved(true)
        // Server call in background
        resolveSOSAlert(alertId, userId)
            .then(() => setTimeout(() => router.refresh(), 300))
            .catch(err => {
                console.error('Resolve failed:', err)
                setResolved(false)
            })
    }

    if (resolved) {
        return (
            <span className="ml-auto flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-300/30 backdrop-blur-sm px-3 py-2 text-xs text-emerald-600 font-medium">
                <CheckCircle className="h-3.5 w-3.5" /> Đã xử lý
            </span>
        )
    }

    return (
        <button
            onClick={handleResolve}
            disabled={isResolving}
            className="ml-auto flex items-center gap-1 rounded-xl border border-white/40 bg-white/20 backdrop-blur-sm px-3 py-2 text-xs text-slate-500 hover:bg-white/30 transition-all disabled:opacity-40"
        >
            {isResolving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
            Xong
        </button>
    )
}
