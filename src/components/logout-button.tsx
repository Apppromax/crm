'use client'

import { LogOut } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'

export function LogoutButton() {
    return (
        <button
            onClick={() => { logoutAction() }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-danger/20 bg-danger/5 py-3 text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
        >
            <LogOut className="h-4 w-4" />
            Đăng xuất
        </button>
    )
}
