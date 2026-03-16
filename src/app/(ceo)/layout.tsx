'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Crown, BarChart3, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/ceo', icon: Crown, label: 'Dashboard' },
    { href: '/ceo/analytics', icon: BarChart3, label: 'Phân tích' },
    { href: '/ceo/team', icon: Users, label: 'Đội ngũ' },
    { href: '/ceo/settings', icon: Settings, label: 'Cài đặt' },
]

export default function CEOLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-dvh" style={{ background: '#0b0f19' }}>
            <main className="pb-20 page-enter">{children}</main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-slate-950/95 backdrop-blur-2xl safe-bottom">
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
                                    isActive ? 'text-amber-400 font-medium scale-105' : 'text-slate-600 hover:text-slate-400'
                                )}
                            >
                                <Icon className={cn(
                                    'h-5 w-5 transition-transform duration-200',
                                    isActive && 'stroke-[2.5px] -translate-y-0.5'
                                )} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-amber-400 animate-scale-in" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
