'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showBanner, setShowBanner] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Check if already dismissed
        const wasDismissed = localStorage.getItem('pwa-install-dismissed')
        if (wasDismissed) return

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) return

        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            // Show banner after small delay
            setTimeout(() => setShowBanner(true), 3000)
        }

        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    async function handleInstall() {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setShowBanner(false)
        }
        setDeferredPrompt(null)
    }

    function handleDismiss() {
        setShowBanner(false)
        setDismissed(true)
        localStorage.setItem('pwa-install-dismissed', '1')
    }

    if (!showBanner || dismissed) return null

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[70] mx-auto max-w-lg animate-slide-up">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-4">
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100">
                        <Smartphone className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1 pr-4">
                        <h3 className="text-sm font-bold text-slate-800">Cài CRM Pro lên điện thoại</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Trải nghiệm mượt hơn, offline mode, thông báo đầy đủ</p>
                    </div>
                </div>

                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleDismiss}
                        className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-all"
                    >
                        Để sau
                    </button>
                    <button
                        onClick={handleInstall}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary-500 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-600 transition-all"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Cài ngay
                    </button>
                </div>
            </div>
        </div>
    )
}
