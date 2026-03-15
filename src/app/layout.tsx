import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DevRoleSwitcher } from '@/components/dev/role-switcher'
import { PWAInstallPrompt } from '@/components/shared/pwa-install-prompt'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'CRM Pro V2 — Hệ Điều Hành Bán Hàng BĐS',
  description: 'Quản lý pipeline bán hàng Bất Động Sản với AI Gemini. 5 Mốc thăng hạng, 72h Vàng, SOS Jump-in.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CRM Pro',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
        {children}
        <DevRoleSwitcher />
        <PWAInstallPrompt />
      </body>
    </html>
  )
}

