'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, Plus, Calendar, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PrefetchPages } from '@/components/prefetch-pages'

const SALE_PREFETCH = ['/sale', '/sale/leads', '/sale/schedule', '/sale/new']

const navItems = [
    { href: '/sale', icon: Home, label: 'Home' },
    { href: '/sale/leads', icon: ClipboardList, label: 'Leads' },
    { href: '/sale/new', icon: Plus, label: 'Thêm', isAction: true },
    { href: '/sale/schedule', icon: Calendar, label: 'Lịch' },
    { href: '/sale/settings', icon: Settings, label: 'Cài đặt' },
]

export default function SaleLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Hide bottom nav on lead detail pages
    const isDetailPage = pathname.match(/\/sale\/leads\/.+/)

    return (
        <div className="flex min-h-dvh flex-col bg-slate-50">
            <PrefetchPages paths={SALE_PREFETCH} />
            {/* Main Content */}
            <main className={cn('flex-1 page-enter', !isDetailPage && 'pb-20')}>
                {children}
            </main>

            {/* Bottom Navigation — Hidden on detail pages */}
            {!isDetailPage && (
                <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/90 backdrop-blur-2xl safe-bottom animate-slide-up">
                    <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            if (item.isAction) {
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex -mt-5 h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 transition-all duration-200 active:scale-90 hover:shadow-primary-500/50 hover:scale-105 press-effect"
                                    >
                                        <Icon className="h-6 w-6" />
                                    </Link>
                                )
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'relative flex flex-col items-center gap-0.5 px-3 py-2 text-xs',
                                        'transition-all duration-200',
                                        isActive
                                            ? 'text-primary-600 font-medium scale-105'
                                            : 'text-slate-400 hover:text-slate-600'
                                    )}
                                >
                                    <Icon className={cn(
                                        'h-5 w-5 transition-transform duration-200',
                                        isActive && 'stroke-[2.5px] -translate-y-0.5'
                                    )} />
                                    <span className={cn(
                                        'transition-all duration-200',
                                        isActive && 'font-semibold'
                                    )}>{item.label}</span>
                                    {/* Active indicator dot */}
                                    {isActive && (
                                        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary-500 animate-scale-in" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            )}
        </div>
    )
}
