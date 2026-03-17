export default function Loading() {
    return (
        <div className="mx-auto max-w-lg px-4 py-4 space-y-4 page-enter">
            {/* Header skeleton */}
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-white/40 animate-pulse" />
                    <div className="space-y-1.5">
                        <div className="h-4 w-20 rounded-md bg-white/40 animate-pulse" />
                        <div className="h-3 w-32 rounded-md bg-white/40 animate-pulse" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-9 w-9 rounded-xl bg-white/40 animate-pulse" />
                    <div className="h-9 w-9 rounded-xl bg-white/40 animate-pulse" />
                </div>
            </div>

            {/* Cards skeleton — glass */}
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl p-4 space-y-3 sale-glass-card" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex items-center justify-between">
                            <div className="h-5 w-32 rounded-full bg-white/40 animate-pulse" />
                            <div className="h-5 w-16 rounded-full bg-white/40 animate-pulse" />
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/40 animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-6 w-20 rounded-lg bg-white/40 animate-pulse" />
                            <div className="h-6 w-20 rounded-lg bg-white/40 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Big button skeleton */}
            <div className="flex justify-center py-4">
                <div className="h-[100px] w-[100px] rounded-full bg-white/40 animate-pulse" />
            </div>

            {/* Stats skeleton */}
            <div className="sale-stats-card p-5">
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="text-center space-y-2">
                            <div className="h-7 w-12 rounded-md bg-white/40 animate-pulse mx-auto" />
                            <div className="h-3 w-16 rounded-md bg-white/40 animate-pulse mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
