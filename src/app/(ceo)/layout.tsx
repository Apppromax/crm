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
        <div className="min-h-dvh mgr-gradient-bg transition-colors duration-700">
            <main className="pb-24 page-enter">{children}</main>

            {/* Bottom Navigation — Glass style matching Manager & Sale */}
            <div className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] animate-slide-up bg-[#eef2ff]/60 backdrop-blur-[40px] saturate-[1.8] border-t border-white/70 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.08),inset_0_1px_0px_rgba(255,255,255,0.8)] rounded-t-[32px]">
                <nav className="w-full max-w-[400px] mx-auto pointer-events-auto">
                    <div className="flex items-center justify-around px-2 pt-3 pb-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'glass-nav-item flex flex-col items-center justify-center gap-[4px] min-w-[56px] relative z-10',
                                        isActive
                                            ? 'text-teal-600 font-bold'
                                            : 'text-slate-400 font-medium hover:text-slate-600 transition-colors'
                                    )}
                                >
                                    <Icon className={cn(
                                        'transition-all duration-200',
                                        isActive ? 'h-[24px] w-[24px] stroke-[2.5px] drop-shadow-[0_2px_4px_rgba(20,184,166,0.3)]' : 'h-[22px] w-[22px] stroke-[2px]'
                                    )} />
                                    <span className={cn(
                                        "leading-none whitespace-nowrap tracking-tight",
                                        isActive ? "text-[11px]" : "text-[10px]"
                                    )}>{item.label}</span>
                                    {isActive && (
                                        <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-teal-500 animate-scale-in" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            </div>
        </div>
    )
}
