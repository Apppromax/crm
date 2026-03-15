// ============================================
// CRM Pro V2 — Business Logic Engine
// Priority Score, Snooze, 72h, Anti-Hoarding
// ============================================

import type { MockLead } from './mock-data'

// ============================================
// Priority Score Calculator (FR-022)
// ============================================

interface PriorityFactors {
    golden72h: number      // +30 if within 72h window
    managerAdvice: number  // +20 if has manager command
    scheduledue: number    // +15 if appointment due within 2h
    heatScore: number      // Heat score normalized (0-15)
    milestoneBonus: number // Higher milestone = higher priority
    retryPenalty: number   // -5 per consecutive miss
    snoozePenalty: number  // -100 if currently snoozed
    stalePenalty: number   // -10 if no interaction > 48h
}

export function calculatePriorityScore(lead: MockLead): { score: number; reason: string; factors: PriorityFactors } {
    const now = new Date()
    const factors: PriorityFactors = {
        golden72h: 0,
        managerAdvice: 0,
        scheduledue: 0,
        heatScore: 0,
        milestoneBonus: 0,
        retryPenalty: 0,
        snoozePenalty: 0,
        stalePenalty: 0,
    }

    // 1. 72h Golden Rule — highest priority for new leads
    if (lead.golden72hExpiresAt && new Date(lead.golden72hExpiresAt) > now) {
        const hoursLeft = (new Date(lead.golden72hExpiresAt).getTime() - now.getTime()) / 3600000
        factors.golden72h = hoursLeft < 12 ? 35 : 30 // Extra urgency in last 12h
    }

    // 2. Manager Advice — "Lệnh sếp" boost
    if (lead.hasManagerAdvice) {
        factors.managerAdvice = 20
    }

    // 3. Schedule due — upcoming appointment
    if (lead.nextSchedule) {
        const hoursUntil = (new Date(lead.nextSchedule.scheduledAt).getTime() - now.getTime()) / 3600000
        if (hoursUntil > 0 && hoursUntil <= 2) {
            factors.scheduledue = 15
        } else if (hoursUntil > 0 && hoursUntil <= 8) {
            factors.scheduledue = 8
        }
    }

    // 4. Heat Score — normalized to 0-15
    factors.heatScore = Math.round((lead.heatScore / 100) * 15)

    // 5. Milestone bonus — higher milestones = closer to close
    const milestoneWeights: Record<number, number> = { 1: 2, 2: 5, 3: 8, 4: 12, 5: 0 }
    factors.milestoneBonus = milestoneWeights[lead.currentMilestone] || 0

    // 6. Retry penalty — consecutive misses
    factors.retryPenalty = -(lead.consecutiveMissCount * 5)

    // 7. Snooze — completely deprioritize
    if (lead.snoozeUntil && new Date(lead.snoozeUntil) > now) {
        factors.snoozePenalty = -100
    }

    // 8. Stale penalty — no interaction > 48h
    if (lead.lastInteractionAt) {
        const hoursSince = (now.getTime() - new Date(lead.lastInteractionAt).getTime()) / 3600000
        if (hoursSince > 48) {
            factors.stalePenalty = -10
        }
    }

    const score = Math.max(0, Math.min(100,
        factors.golden72h +
        factors.managerAdvice +
        factors.scheduledue +
        factors.heatScore +
        factors.milestoneBonus +
        factors.retryPenalty +
        factors.snoozePenalty +
        factors.stalePenalty
    ))

    // Determine primary reason
    let reason = 'hot_lead'
    if (factors.golden72h > 0) reason = 'golden_72h'
    else if (factors.managerAdvice > 0) reason = 'manager_advice'
    else if (factors.scheduledue > 0) reason = 'schedule_due'
    else if (lead.consecutiveMissCount > 0) reason = 'retry'

    return { score, reason, factors }
}

// ============================================
// 72h Golden Rule Timer (FR-020)
// ============================================

export interface GoldenTimer {
    isActive: boolean
    hoursLeft: number
    minutesLeft: number
    urgency: 'NORMAL' | 'WARNING' | 'CRITICAL'
    label: string
}

export function getGoldenTimer(lead: MockLead): GoldenTimer | null {
    if (!lead.golden72hExpiresAt) return null

    const now = new Date()
    const expires = new Date(lead.golden72hExpiresAt)
    const msLeft = expires.getTime() - now.getTime()

    if (msLeft <= 0) {
        return {
            isActive: false,
            hoursLeft: 0,
            minutesLeft: 0,
            urgency: 'CRITICAL',
            label: 'Hết hạn 72h!',
        }
    }

    const hoursLeft = Math.floor(msLeft / 3600000)
    const minutesLeft = Math.floor((msLeft % 3600000) / 60000)
    const urgency = hoursLeft < 6 ? 'CRITICAL' : hoursLeft < 24 ? 'WARNING' : 'NORMAL'

    return {
        isActive: true,
        hoursLeft,
        minutesLeft,
        urgency,
        label: hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m` : `${minutesLeft}m`,
    }
}

// ============================================
// Snooze Logic (FR-021)
// ============================================

export type SnoozeOption = {
    key: string
    label: string
    minutes: number
    icon: string
}

export const SNOOZE_OPTIONS: SnoozeOption[] = [
    { key: '15m', label: '15 phút', minutes: 15, icon: '⏱️' },
    { key: '30m', label: '30 phút', minutes: 30, icon: '⏱️' },
    { key: '1h', label: '1 giờ', minutes: 60, icon: '🕐' },
    { key: '2h', label: '2 giờ', minutes: 120, icon: '🕑' },
    { key: '4h', label: '4 giờ', minutes: 240, icon: '🕓' },
    { key: 'tomorrow', label: 'Ngày mai 9h', minutes: -1, icon: '📅' },
]

export function calculateSnoozeUntil(option: SnoozeOption): Date {
    if (option.key === 'tomorrow') {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(9, 0, 0, 0)
        return tomorrow
    }
    return new Date(Date.now() + option.minutes * 60000)
}

export function isCurrentlySnoozed(lead: MockLead): boolean {
    if (!lead.snoozeUntil) return false
    return new Date(lead.snoozeUntil) > new Date()
}

export function getSnoozeRemaining(lead: MockLead): string | null {
    if (!lead.snoozeUntil) return null
    const ms = new Date(lead.snoozeUntil).getTime() - Date.now()
    if (ms <= 0) return null
    const mins = Math.floor(ms / 60000)
    if (mins < 60) return `${mins}m`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

// ============================================
// Anti-Hoarding Logic (FR-040, FR-041)
// ============================================

export interface AntiHoardingAlert {
    type: 'CONSECUTIVE_MISS' | 'LONG_STALE' | 'AUTO_RECLAIM'
    severity: 'WARNING' | 'CRITICAL'
    message: string
    actionLabel: string
}

export function checkAntiHoarding(lead: MockLead): AntiHoardingAlert | null {
    // Rule 1: 3+ consecutive misses → warning
    if (lead.consecutiveMissCount >= 3) {
        return {
            type: 'CONSECUTIVE_MISS',
            severity: lead.consecutiveMissCount >= 5 ? 'CRITICAL' : 'WARNING',
            message: `Đã gọi nhỡ ${lead.consecutiveMissCount} lần liên tiếp. Lead sẽ tự động chuyển về Kho Chung sau ${5 - lead.consecutiveMissCount} lần nữa.`,
            actionLabel: lead.consecutiveMissCount >= 5 ? 'Chuyển về Kho Chung' : 'Thử lại',
        }
    }

    // Rule 2: No interaction for 15 days → auto reclaim warning
    if (lead.lastInteractionAt) {
        const daysSince = (Date.now() - new Date(lead.lastInteractionAt).getTime()) / 86400000
        if (daysSince >= 15) {
            return {
                type: 'AUTO_RECLAIM',
                severity: 'CRITICAL',
                message: `Không có tương tác trong ${Math.floor(daysSince)} ngày. Lead sẽ bị tự động thu hồi về Kho Chung.`,
                actionLabel: 'Liên lạc ngay',
            }
        }
        if (daysSince >= 10) {
            return {
                type: 'LONG_STALE',
                severity: 'WARNING',
                message: `Không tương tác ${Math.floor(daysSince)} ngày. Còn ${Math.ceil(15 - daysSince)} ngày trước khi lead bị thu hồi.`,
                actionLabel: 'Đặt lịch liên lạc',
            }
        }
    }

    return null
}

// ============================================
// Milestone Demotion Logic (FR-012)
// ============================================

export interface DemotionCheck {
    shouldDemote: boolean
    reason: string
    fromMilestone: number
    toMilestone: number
}

export function checkMilestoneDemotion(lead: MockLead): DemotionCheck | null {
    // Only demote from Milestone 4 or 5
    if (lead.currentMilestone < 4) return null

    // Check if appointment was missed/cancelled at M4/M5
    const lastInteraction = lead.interactions[0]
    if (!lastInteraction) return null

    // Simulate: if last interaction was > 7 days ago at M4/M5 → demote to M3
    if (lead.lastInteractionAt) {
        const daysSince = (Date.now() - new Date(lead.lastInteractionAt).getTime()) / 86400000
        if (daysSince > 7 && lead.currentMilestone >= 4) {
            return {
                shouldDemote: true,
                reason: `Không có tương tác > 7 ngày tại Mốc ${lead.currentMilestone}`,
                fromMilestone: lead.currentMilestone,
                toMilestone: 3, // Always fall back to M3 for nurturing
            }
        }
    }

    return null
}
