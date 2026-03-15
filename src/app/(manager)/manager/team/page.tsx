import { Users, ChevronRight, Flame, Target, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const teamMembers = [
    { id: 'user-001', name: 'Nguyễn Văn A', leads: 5, compliance: 92, streak: 5, status: 'GREEN' as const },
    { id: 'user-002', name: 'Trần Minh B', leads: 4, compliance: 65, streak: 2, status: 'YELLOW' as const },
    { id: 'user-003', name: 'Lê Thị C', leads: 6, compliance: 38, streak: 0, status: 'RED' as const },
]

const statusConfig = {
    GREEN: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    YELLOW: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    RED: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
}

export default function TeamPage() {
    return (
        <div className="mx-auto max-w-2xl">
            <header className="sticky top-0 z-40 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary-500" />
                    Quản lý Team
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Team Alpha • {teamMembers.length} thành viên</p>
            </header>

            <div className="px-4 py-4 space-y-3">
                {teamMembers.map(member => {
                    const sc = statusConfig[member.status]
                    return (
                        <Link key={member.id} href={`/manager/team/${member.id}`}>
                            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 hover:border-slate-200 transition-all active:scale-[0.99]">
                                <div className="flex items-center gap-3">
                                    <div className={cn('h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold', sc.bg, sc.text)}>
                                        {member.name.split(' ').pop()?.[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-slate-800">{member.name}</h3>
                                            <span className={cn('h-2 w-2 rounded-full', sc.dot)} />
                                        </div>
                                        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                                            <span>{member.leads} leads</span>
                                            <span className="flex items-center gap-0.5">
                                                <Target className="h-3 w-3" /> {member.compliance}%
                                            </span>
                                            {member.streak > 0 && (
                                                <span className="flex items-center gap-0.5 text-orange-500">
                                                    <Flame className="h-3 w-3" /> {member.streak}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-300" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
