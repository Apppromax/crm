import { User, Bell, Shield, Palette, HelpCircle, ChevronRight, Smartphone, Moon, Globe, Trophy, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { getUserByRole } from '@/app/actions/users'
import { LogoutButton } from '@/components/logout-button'

export default async function SettingsPage() {
    const user = await getUserByRole('SALE')
    if (!user) return <div className="p-8 text-center text-slate-400">Không tìm thấy thông tin profile</div>

    return (
        <div className="mx-auto max-w-lg">
            <header className="sticky top-0 z-40 bg-white/80 px-4 py-3 backdrop-blur-xl border-b border-slate-100">
                <h1 className="text-lg font-bold text-slate-900">Cài đặt</h1>
            </header>

            <div className="px-4 py-4 space-y-4">
                {/* Profile */}
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-lg font-bold">
                            {user.name.split(' ').pop()?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-slate-800 truncate">{user.name}</h3>
                            <p className="text-sm text-slate-400 truncate">{user.email}</p>
                            <span className="inline-flex items-center mt-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                                {user.role} {user.team ? `• ${user.team.name}` : ''}
                            </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                    </div>
                </div>

                {/* Settings Groups */}
                <SettingsGroup title="Ưu tiên">
                    <SettingItem icon={<Bell className="h-5 w-5" />} label="Thông báo" subtitle="Push, in-app, email" />
                    <SettingItem icon={<Smartphone className="h-5 w-5" />} label="Cài đặt PWA" subtitle="Cài app về điện thoại" />
                </SettingsGroup>

                <SettingsGroup title="Giao diện">
                    <SettingItem icon={<Moon className="h-5 w-5" />} label="Dark Mode" subtitle="Tắt" />
                    <SettingItem icon={<Globe className="h-5 w-5" />} label="Ngôn ngữ" subtitle="Tiếng Việt" />
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
                    <SettingItem icon={<Shield className="h-5 w-5" />} label="Bảo mật" subtitle="Đổi mật khẩu" />
                    <SettingItem icon={<HelpCircle className="h-5 w-5" />} label="Trợ giúp" subtitle="FAQ & Hỗ trợ" />
                </SettingsGroup>

                {/* Logout */}
                <LogoutButton />

                <p className="text-center text-[10px] text-slate-300 pb-4 mt-8">
                    CRM Pro V2 — Version 0.1.0
                </p>
            </div>
        </div>
    )
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">{title}</p>
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
                {children}
            </div>
        </div>
    )
}

function SettingItem({ icon, label, subtitle }: { icon: React.ReactNode; label: string; subtitle: string }) {
    return (
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50/50 transition-colors">
            <span className="text-slate-400">{icon}</span>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300" />
        </button>
    )
}
