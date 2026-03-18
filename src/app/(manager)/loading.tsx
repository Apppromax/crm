export default function Loading() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-4 space-y-4 page-enter">
            {/* Header */}
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/40 animate-pulse" />
                    <div className="space-y-1.5">
                        <div className="h-4 w-24 rounded-lg bg-white/40 animate-pulse" />
                        <div className="h-3 w-36 rounded-lg bg-white/40 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-3 gap-3 stagger-children">
                {[1, 2, 3].map(i => (
                    <div key={i} className="mgr-glass-card p-4">
                        <div className="h-8 w-16 rounded-lg bg-white/40 animate-pulse mb-2 mx-auto" />
                        <div className="h-3 w-20 rounded-lg bg-white/40 animate-pulse mx-auto" />
                    </div>
                ))}
            </div>

            {/* Team list */}
            <div className="space-y-3 stagger-children">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="mgr-glass-card p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-white/40 animate-pulse" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-4 w-28 rounded-lg bg-white/40 animate-pulse" />
                            <div className="h-3 w-40 rounded-lg bg-white/40 animate-pulse" />
                        </div>
                        <div className="h-8 w-16 rounded-lg bg-white/40 animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    )
}
