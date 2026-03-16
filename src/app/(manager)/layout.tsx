'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, AlertTriangle, Users, Archive, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PrefetchPages } from '@/components/prefetch-pages'

const MGR_PREFETCH = ['/manager', '/manager/sos', '/manager/team', '/manager/pool']

const navItems = [
    { href: '/manager', icon: LayoutDashboard, label: 'Heatmap' },
    { href: '/manager/sos', icon: AlertTriangle, label: 'SOS' },
    { href: '/manager/team', icon: Users, label: 'Team' },
    { href: '/manager/pool', icon: Archive, label: 'Kho Lead' },
    { href: '/manager/settings', icon: Settings, label: 'Cài đặt' },
]

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-dvh flex-col bg-slate-50">
            <PrefetchPages paths={MGR_PREFETCH} />
            <main className="flex-1 pb-20 page-enter">{children}</main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/90 backdrop-blur-2xl safe-bottom">
                <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'relative flex flex-col items-center gap-0.5 px-3 py-2 text-xs',
                                    'transition-all duration-200',
                                    isActive ? 'text-primary-600 font-medium scale-105' : 'text-slate-400 hover:text-slate-600'
                                )}
                            >
                                <Icon className={cn(
                                    'h-5 w-5 transition-transform duration-200',
                                    isActive && 'stroke-[2.5px] -translate-y-0.5'
                                )} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary-500 animate-scale-in" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
