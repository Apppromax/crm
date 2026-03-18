import { User, Bell, Smartphone, Globe, Trophy, BarChart3, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getUserByRole } from '@/app/actions/users'
import { LogoutButton } from '@/components/logout-button'
import { PasswordButton, HelpButton, SaleThemeSelector } from '@/components/shared/settings-items'

export default async function SettingsPage() {
    const user = await getUserByRole('SALE')
    if (!user) return <div className="p-8 text-center text-slate-400">Không tìm thấy thông tin profile</div>

    return (
        <div className="mx-auto max-w-lg">
            <header className="sticky top-0 z-40 bg-transparent px-4 py-3">
                <h1 className="text-lg font-bold text-slate-800">Cài đặt</h1>
            </header>

            <div className="px-4 py-4 space-y-4">
                {/* Profile */}
                <div className="mgr-glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100/80 text-primary-700 text-lg font-bold">
                            {user.name.split(' ').pop()?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-slate-800 truncate">{user.name}</h3>
                            <p className="text-sm text-slate-500 truncate">{user.email}</p>
                            <span className="inline-flex items-center mt-1 rounded-full bg-primary-50/80 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                                {user.role} {user.team ? `• ${user.team.name}` : ''}
                            </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                    </div>
                </div>

                {/* Settings Groups */}
                <SettingsGroup title="Ưu tiên">
                    <SettingItem icon={<Bell className="h-5 w-5" />} label="Thông báo" subtitle="Sắp ra mắt" disabled />
                    <SettingItem icon={<Smartphone className="h-5 w-5" />} label="Cài đặt PWA" subtitle="Sắp ra mắt" disabled />
                </SettingsGroup>

                <SettingsGroup title="Giao diện thiết kế">
                    <SaleThemeSelector />
                    <div className="border-t border-white/30">
                        <SettingItem icon={<Globe className="h-5 w-5" />} label="Ngôn ngữ" subtitle="Tiếng Việt" />
                    </div>
                </SettingsGroup>

                <SettingsGroup title="Cá nhân">
                    <Link href="/sale/achievements">
                        <SettingItem icon={<Trophy className="h-5 w-5" />} label="Thành tích" subtitle="Badges, streak, kỷ lục" />
                    </Link>
                    <Link href="/sale/stats">
                        <SettingItem icon={<BarChart3 className="h-5 w-5" />} label="Thống kê" subtitle="Funnel, tỷ lệ chốt" />
                    </Link>
                </SettingsGroup>

                <SettingsGroup title="Khác">
                    <PasswordButton />
                    <HelpButton />
                </SettingsGroup>

                {/* Logout */}
                <LogoutButton />

                <p className="text-center text-[10px] text-slate-400 pb-4 mt-8">
                    CRM Pro V2 — Version 0.2.0
                </p>
            </div>
        </div>
    )
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">{title}</p>
            <div className="mgr-glass-card divide-y divide-white/30 overflow-hidden">
                {children}
            </div>
        </div>
    )
}

function SettingItem({ icon, label, subtitle, disabled }: { icon: React.ReactNode; label: string; subtitle: string; disabled?: boolean }) {
    return (
        <button disabled={disabled} className={cn(
            'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
            disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/30'
        )}>
            <span className="text-slate-500">{icon}</span>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300" />
        </button>
    )
}
