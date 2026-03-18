import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatCurrencyShort(amount: number): string {
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(1)} tỷ`
    }
    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toFixed(0)} triệu`
    }
    return formatCurrency(amount)
}

export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    if (days < 7) return `${days} ngày trước`
    return d.toLocaleDateString('vi-VN')
}

export function getMilestoneLabel(milestone: number): string {
    const labels: Record<number, string> = {
        1: 'Tiếp cận',
        2: 'Chào mồi',
        3: 'Niềm tin',
        4: 'Dồn chốt',
        5: '💎 Kim Cương',
    }
    return labels[milestone] || `Mốc ${milestone}`
}

export function getMilestonePercentage(milestone: number): number {
    return milestone * 20
}

// Milestone → Color mapping (dùng cho thanh progress bar, background, etc.)
export function getMilestoneColor(milestone: number): { bg: string; text: string; glow: string } {
    const colors: Record<number, { bg: string; text: string; glow: string }> = {
        1: { bg: 'bg-sky-400', text: 'text-sky-700', glow: 'shadow-sky-400/50' },
        2: { bg: 'bg-teal-500', text: 'text-teal-700', glow: 'shadow-teal-500/50' },
        3: { bg: 'bg-amber-500', text: 'text-amber-700', glow: 'shadow-amber-500/50' },
        4: { bg: 'bg-orange-500', text: 'text-orange-700', glow: 'shadow-orange-500/50' },
        5: { bg: 'bg-gradient-to-r from-cyan-400 to-emerald-400', text: 'text-teal-900', glow: 'shadow-teal-400/60' },
    }
    return colors[milestone] || { bg: 'bg-slate-300', text: 'text-slate-600', glow: '' }
}

export function getHeatColor(score: number): string {
    if (score >= 80) return 'text-red-500'
    if (score >= 60) return 'text-orange-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-blue-400'
}

export function maskPhone(phone: string): string {
    if (phone.length <= 4) return '****'
    return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4)
}
