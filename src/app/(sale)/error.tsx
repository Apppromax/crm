'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('[Sale Error]', error)
    }, [error])

    return (
        <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4">
            <div className="text-center max-w-sm">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-red-50 mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Đã xảy ra lỗi</h2>
                <p className="text-sm text-slate-500 mb-6">
                    Có sự cố khi tải trang. Vui lòng thử lại.
                </p>
                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 mx-auto rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-all"
                >
                    <RefreshCw className="h-4 w-4" />
                    Thử lại
                </button>
                {error.digest && (
                    <p className="text-[10px] text-slate-300 mt-4">Error ID: {error.digest}</p>
                )}
            </div>
        </div>
    )
}
