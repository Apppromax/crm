export default function Loading() {
    return (
        <div className="mx-auto max-w-lg px-4 py-4 space-y-4 page-enter">
            {/* Header skeleton */}
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl skeleton" />
                    <div className="space-y-1.5">
                        <div className="h-4 w-20 skeleton" />
                        <div className="h-3 w-32 skeleton" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-9 w-9 rounded-xl skeleton" />
                    <div className="h-9 w-9 rounded-xl skeleton" />
                </div>
            </div>

            {/* Stats skeleton */}
            <div className="rounded-2xl p-4 skeleton h-28" />

            {/* Cards skeleton */}
            <div className="space-y-3 stagger-children">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl p-4 space-y-3 border border-slate-100 bg-white">
                        <div className="flex items-center justify-between">
                            <div className="h-5 w-32 skeleton" />
                            <div className="h-5 w-16 rounded-full skeleton" />
                        </div>
                        <div className="h-2 w-full rounded-full skeleton" />
                        <div className="flex gap-2">
                            <div className="h-8 w-20 rounded-lg skeleton" />
                            <div className="h-8 w-20 rounded-lg skeleton" />
                            <div className="h-8 flex-1 rounded-lg skeleton" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom buttons skeleton */}
            <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-16 rounded-2xl skeleton" />
                ))}
            </div>
        </div>
    )
}
