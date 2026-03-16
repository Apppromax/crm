export default function Loading() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-4 space-y-4 page-enter">
            {/* Header */}
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl skeleton" />
                    <div className="space-y-1.5">
                        <div className="h-4 w-24 skeleton" />
                        <div className="h-3 w-36 skeleton" />
                    </div>
                </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-3 gap-3 stagger-children">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl p-4 border border-slate-100 bg-white">
                        <div className="h-8 w-16 skeleton mb-2" />
                        <div className="h-3 w-20 skeleton" />
                    </div>
                ))}
            </div>

            {/* Team list */}
            <div className="space-y-3 stagger-children">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full skeleton" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-4 w-28 skeleton" />
                            <div className="h-3 w-40 skeleton" />
                        </div>
                        <div className="h-8 w-16 rounded-lg skeleton" />
                    </div>
                ))}
            </div>
        </div>
    )
}
