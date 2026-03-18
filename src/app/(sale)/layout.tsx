'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, Calendar, Settings, Home, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PrefetchPages } from '@/components/prefetch-pages'
import { useThemeStore } from '@/lib/stores'

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
    const saleTheme = useThemeStore(s => s.saleTheme)

    // Hide bottom nav on lead detail pages
    const isDetailPage = pathname.match(/\/sale\/leads\/.+/)

    return (
        <div className="flex min-h-dvh flex-col sale-gradient-bg transition-colors duration-700" data-theme={saleTheme}>
            <PrefetchPages paths={SALE_PREFETCH} />
            {/* Main Content */}
            <main className={cn('flex-1 page-enter', !isDetailPage && 'pb-24')}>
                {children}
            </main>

            {/* Bottom Navigation — Hidden on detail pages */}
            {!isDetailPage && (
                <div className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] animate-slide-up bg-[#f4f7f9]/60 backdrop-blur-[40px] saturate-[1.8] border-t border-white/70 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.1),inset_0_1px_0px_rgba(255,255,255,0.8)] rounded-t-[32px]">
                    <nav className="w-full max-w-[400px] mx-auto pointer-events-auto">
                        <div className="flex items-center justify-around px-2 pt-3 pb-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                const Icon = item.icon

                                if (item.isAction) {
                                    return (
                                        <div key={item.href} className="relative w-[60px] h-[40px] flex justify-center">
                                            <Link
                                                href={item.href}
                                                className="absolute bottom-1 group transition-transform duration-200 active:scale-95 hover:scale-105"
                                            >
                                                <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gradient-to-br from-[#71d4ef] via-[#10a1d7] to-[#0284c7] text-white shadow-[0_12px_24px_-4px_rgba(18,161,215,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-white/60 ring-[4px] ring-[#e3f6fc]/80 group-hover:shadow-[0_16px_36px_-6px_rgba(18,161,215,0.9)] transition-all">
                                                    <Icon className="h-8 w-8 stroke-[2.5]" />
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                }

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'glass-nav-item flex flex-col items-center justify-center gap-[4px] min-w-[64px] relative z-10',
                                            isActive
                                                ? 'text-[#0ea5e9] font-bold'
                                                : 'text-[#8da3b8] font-medium hover:text-[#64748b] transition-colors'
                                        )}
                                    >
                                        <Icon className={cn(
                                            'transition-all duration-200',
                                            isActive ? 'h-[25px] w-[25px] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(14,165,233,0.3)]' : 'h-[23px] w-[23px] stroke-[2.5px]'
                                        )} />
                                        <span className={cn(
                                            "leading-none whitespace-nowrap tracking-tight",
                                            isActive ? "text-[12px]" : "text-[11px]"
                                        )}>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </nav>
                </div>
            )}
        </div>
    )
}
