'use client'

export default function OfflinePage() {
    return (
        <div className="min-h-dvh flex items-center justify-center bg-slate-50 px-4">
            <div className="text-center max-w-sm">
                <div className="text-6xl mb-6">📡</div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Mất kết nối</h1>
                <p className="text-sm text-slate-500 mb-6">
                    Bạn đang offline. Kiểm tra kết nối internet và thử lại.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-600 transition-all"
                >
                    Thử lại
                </button>
                <p className="text-xs text-slate-400 mt-8">
                    CRM Pro V2 — Dữ liệu đã xem trước đó vẫn khả dụng
                </p>
            </div>
        </div>
    )
}
