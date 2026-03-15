import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="flex min-h-[50dvh] w-full flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
                <div className="absolute h-12 w-12 rounded-full border-4 border-amber-500/20"></div>
                <div className="absolute h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm font-medium text-slate-400 animate-pulse">Phân tích dữ liệu AI...</p>
        </div>
    )
}
