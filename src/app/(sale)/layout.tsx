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
        <div className="flex min-h-dvh flex-col sale-gradient-bg">
            <PrefetchPages paths={SALE_PREFETCH} />
            {/* Main Content */}
            <main className={cn('flex-1 page-enter', !isDetailPage && 'pb-24')}>
                {children}
            </main>

            {/* Bottom Navigation — Hidden on detail pages */}
            {!isDetailPage && (
                <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-2xl safe-bottom animate-slide-up border-t border-white/50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
                    <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            if (item.isAction) {
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex -mt-8 items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 press-effect"
                                    >
                                        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white p-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#3dafc9] text-white">
                                                <Icon className="h-5 w-5 stroke-[2.5]" />
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'glass-nav-item relative flex flex-col items-center gap-0.5 px-4 py-1.5 text-[11px]',
                                        '',
                                        isActive
                                            ? 'text-[#0284c7] font-semibold'
                                            : 'text-slate-400 hover:text-slate-500'
                                    )}
                                >
                                    <Icon className={cn(
                                        'h-[22px] w-[22px] transition-all duration-200',
                                        isActive && 'stroke-[2.5px] fill-[#0284c7]/10'
                                    )} />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            )}
        </div>
    )
}
