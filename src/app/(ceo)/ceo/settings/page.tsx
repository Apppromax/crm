import { Crown, Bell, Shield, ChevronRight, BarChart3, Globe } from 'lucide-react'
import { ExportLeadsButton } from './export-button'
import { getUserByRole } from '@/app/actions/users'
import { LogoutButton } from '@/components/logout-button'

export default async function CEOSettingsPage() {
    const user = await getUserByRole('CEO')
    if (!user) return <div className="p-8 text-center text-slate-400">Không tìm thấy thông tin profile</div>

    return (
        <div className="mx-auto max-w-2xl">
            <header className="sticky top-0 z-40 px-4 py-3 bg-white/20 backdrop-blur-2xl border-b border-white/40">
                <h1 className="text-lg font-bold text-slate-700">Cài đặt</h1>
            </header>

            <div className="px-4 py-4 space-y-4">
                {/* Profile */}
                <div className="mgr-glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/15 text-teal-600 text-lg font-bold ring-2 ring-teal-300/30">
                            {user.name.split(' ').pop()?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-slate-700 truncate">{user.name}</h3>
                            <p className="text-sm text-slate-400 truncate">{user.email}</p>
                            <span className="inline-flex items-center mt-1 rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-600 border border-teal-200/30">
                                {user.role} {user.org ? `• ${user.org.name}` : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Groups */}
                <SettingsGroup title="Báo cáo">
                    <SettingItem icon={<BarChart3 className="h-5 w-5" />} label="Tần suất báo cáo" subtitle="Hàng ngày, 8:00 AM" />

                    <ExportLeadsButton />

                    <SettingItem icon={<Globe className="h-5 w-5" />} label="Ngôn ngữ" subtitle="Tiếng Việt" />
                </SettingsGroup>

                <SettingsGroup title="Thông báo">
                    <SettingItem icon={<Bell className="h-5 w-5" />} label="Push Notifications" subtitle="SOS + Milestone + Revenue" />
                </SettingsGroup>

                <SettingsGroup title="Bảo mật">
                    <SettingItem icon={<Shield className="h-5 w-5" />} label="Đổi mật khẩu" subtitle="Lần cuối: 30 ngày trước" />
                </SettingsGroup>

                <LogoutButton />

                <p className="text-center text-[10px] text-slate-400 pb-4 mt-8">
                    CRM Pro V2 — Version 0.1.0
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

function SettingItem({ icon, label, subtitle }: { icon: React.ReactNode; label: string; subtitle: string }) {
    return (
        <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/20 transition-colors">
            <span className="text-slate-400">{icon}</span>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">{label}</p>
                <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300" />
        </button>
    )
}
