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
        2: 'Chào mồi & Đo độ nét',
        3: 'Niềm tin',
        4: 'Dồn chốt',
        5: 'Chốt cọc',
    }
    return labels[milestone] || `Mốc ${milestone}`
}

export function getMilestonePercentage(milestone: number): number {
    return milestone * 20
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
