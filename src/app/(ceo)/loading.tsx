export default function Loading() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-6 page-enter" style={{ background: '#0b0f19', minHeight: '100dvh' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl skeleton-dark" />
                    <div className="space-y-1.5">
                        <div className="h-4 w-24 skeleton-dark" />
                        <div className="h-3 w-32 skeleton-dark" />
                    </div>
                </div>
                <div className="h-9 w-9 rounded-xl skeleton-dark" />
            </div>

            {/* Revenue card */}
            <div className="rounded-2xl p-5 h-36 skeleton-dark mb-4" />

            {/* KPI grid */}
            <div className="grid grid-cols-3 gap-2 mb-4 stagger-children">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-xl p-3 h-20 skeleton-dark" />
                ))}
            </div>

            {/* Pipeline funnel */}
            <div className="rounded-2xl p-5 h-64 skeleton-dark mb-4" />

            {/* Links */}
            <div className="space-y-2 stagger-children">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl p-4 h-16 skeleton-dark" />
                ))}
            </div>
        </div>
    )
}
