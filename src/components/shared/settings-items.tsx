'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { ChangePasswordModal } from '@/components/shared/change-password-modal'
import { HelpModal } from '@/components/shared/help-modal'
import { useThemeStore } from '@/lib/stores'

interface SettingItemProps {
    icon: React.ReactNode
    label: string
    subtitle: string
    onClick?: () => void
    toggle?: boolean
    toggled?: boolean
    onToggle?: (v: boolean) => void
}

export function InteractiveSettingItem({ icon, label, subtitle, onClick, toggle, toggled, onToggle }: SettingItemProps) {
    return (
        <button
            onClick={toggle ? () => onToggle?.(!toggled) : onClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50/50 transition-colors"
        >
            <span className="text-slate-400">{icon}</span>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
            {toggle ? (
                <div className={`relative w-10 h-6 rounded-full transition-colors ${toggled ? 'bg-primary-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${toggled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
            ) : (
                <ChevronRight className="h-4 w-4 text-slate-300" />
            )}
        </button>
    )
}

export function SettingsModals() {
    const [showPassword, setShowPassword] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    return { showPassword, setShowPassword, showHelp, setShowHelp }
}

export function PasswordButton() {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <InteractiveSettingItem
                icon={<span className="text-slate-400">🔐</span>}
                label="Bảo mật"
                subtitle="Đổi mật khẩu"
                onClick={() => setShowModal(true)}
            />
            <ChangePasswordModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    )
}

export function HelpButton() {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <InteractiveSettingItem
                icon={<span className="text-slate-400">❓</span>}
                label="Trợ giúp"
                subtitle="FAQ & Hỗ trợ"
                onClick={() => setShowModal(true)}
            />
            <HelpModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    )
}

export function DarkModeToggle() {
    const { isDark, toggle } = useThemeStore()

    return (
        <InteractiveSettingItem
            icon={<span className="text-slate-400">🌙</span>}
            label="Dark Mode"
            subtitle={isDark ? 'Bật' : 'Tắt'}
            toggle
            toggled={isDark}
            onToggle={() => toggle()}
        />
    )
}

export function SaleThemeSelector() {
    const { saleTheme, setSaleTheme } = useThemeStore()

    const themes: { id: 'default' | 'acid' | 'luxury' | 'silver', name: string, icon: string }[] = [
        { id: 'default', name: 'Mặc định (Ice)', icon: '🌊' },
        { id: 'acid', name: 'Electric Acid', icon: '🔥' },
        { id: 'luxury', name: 'Neo-Luxury', icon: '⚜️' },
        { id: 'silver', name: 'Liquid Silver', icon: '💿' },
    ]

    return (
        <div className="px-4 pt-3 pb-4">
            <p className="text-sm font-semibold text-slate-700 mb-3 ml-1">Chủ đề giao diện (Mới)</p>
            <div className="grid grid-cols-2 gap-2">
                {themes.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSaleTheme(t.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-[20px] border shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${saleTheme === t.id ? 'bg-white/80 border-sky-400 text-sky-700 ring-2 ring-sky-400/20' : 'bg-white/30 border-white/50 text-slate-600 hover:bg-white/50'} transition-all active:scale-95`}
                    >
                        <span className="text-[26px] mb-1.5 drop-shadow-md">{t.icon}</span>
                        <span className="text-[11px] font-black text-center leading-tight tracking-tight uppercase">{t.name}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
