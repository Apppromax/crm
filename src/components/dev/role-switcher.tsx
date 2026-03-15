'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Users, Eye, Crown, ArrowRight, X, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'

const ROLES = [
    {
        key: 'SALE',
        label: 'Sale',
        description: 'Bán hàng — Top 3, Ghi chú, AI Coach',
        href: '/sale',
        icon: Users,
        color: 'bg-primary-500',
        ring: 'ring-primary-200',
        gradient: 'from-primary-500 to-primary-600',
    },
    {
        key: 'MANAGER',
        label: 'Manager',
        description: 'Mắt Thần — Heatmap, SOS, Team',
        href: '/manager',
        icon: Eye,
        color: 'bg-indigo-500',
        ring: 'ring-indigo-200',
        gradient: 'from-indigo-500 to-indigo-600',
    },
    {
        key: 'DIRECTOR',
        label: 'CEO',
        description: 'Chỉ Huy — Revenue, AI Insights',
        href: '/ceo',
        icon: Crown,
        color: 'bg-amber-500',
        ring: 'ring-amber-200',
        gradient: 'from-amber-500 to-amber-600',
    },
] as const

function getCurrentRole(pathname: string): string {
    if (pathname.startsWith('/manager')) return 'MANAGER'
    if (pathname.startsWith('/ceo')) return 'DIRECTOR'
    if (pathname.startsWith('/sale')) return 'SALE'
    return 'SALE'
}

export function DevRoleSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const currentRole = getCurrentRole(pathname)
    const currentRoleData = ROLES.find(r => r.key === currentRole)!
    const CurrentIcon = currentRoleData.icon

    function switchRole(href: string) {
        setIsOpen(false)
        router.push(href)
    }

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    'fixed bottom-24 right-4 z-[80] flex items-center gap-2 rounded-full px-3 py-2.5',
                    'bg-slate-900/90 text-white shadow-xl backdrop-blur-sm',
                    'transition-all hover:scale-105 active:scale-95',
                    'border border-white/10'
                )}
            >
                <Repeat className="h-4 w-4 text-slate-300" />
                <span className="text-xs font-semibold">{currentRoleData.label}</span>
                <span className={cn('h-2 w-2 rounded-full', currentRoleData.color)} />
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-3xl bg-white shadow-2xl animate-slide-up overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-2">
                            <div>
                                <h2 className="text-base font-bold text-slate-800">Chuyển Role</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Dev mode — chọn role để test</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Role Cards */}
                        <div className="px-5 pb-5 space-y-2 mt-2">
                            {ROLES.map(role => {
                                const Icon = role.icon
                                const isActive = role.key === currentRole
                                return (
                                    <button
                                        key={role.key}
                                        onClick={() => switchRole(role.href)}
                                        disabled={isActive}
                                        className={cn(
                                            'w-full flex items-center gap-3 rounded-2xl p-4 text-left transition-all',
                                            isActive
                                                ? 'bg-gradient-to-r text-white shadow-lg ' + role.gradient
                                                : 'bg-slate-50 hover:bg-slate-100 active:scale-[0.98]'
                                        )}
                                    >
                                        <div className={cn(
                                            'flex h-11 w-11 items-center justify-center rounded-xl shrink-0',
                                            isActive ? 'bg-white/20' : role.color + '/10'
                                        )}>
                                            <Icon className={cn('h-5 w-5', isActive ? 'text-white' : role.color.replace('bg-', 'text-'))} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className={cn('text-sm font-semibold', isActive ? 'text-white' : 'text-slate-800')}>
                                                    {role.label}
                                                </p>
                                                {isActive && (
                                                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium">
                                                        ĐANG DÙNG
                                                    </span>
                                                )}
                                            </div>
                                            <p className={cn('text-xs mt-0.5', isActive ? 'text-white/70' : 'text-slate-400')}>
                                                {role.description}
                                            </p>
                                        </div>
                                        {!isActive && (
                                            <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Dev Info */}
                        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
                            <p className="text-[10px] text-slate-400 text-center">
                                🔧 Dev Only — Sẽ bị ẩn khi có Auth. Hiện tại dùng mock data.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
