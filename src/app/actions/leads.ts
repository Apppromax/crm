'use server'

import { updateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { BANTLevel } from '@prisma/client'
import {
    getCachedTopPriorityLeads,
    getCachedLeadsByUser,
    getCachedLeadDetail,
    getCachedLeadPool,
    CACHE_TAGS,
} from '@/lib/cache'

// ============================================
// GET LEADS (cached)
// ============================================

export async function getTopPriorityLeads(userId: string, limit = 3) {
    return getCachedTopPriorityLeads(userId, limit)
}

export async function getLeadsByUser(userId: string) {
    return getCachedLeadsByUser(userId)
}

export async function getLeadDetail(leadId: string) {
    return getCachedLeadDetail(leadId)
}

export async function getLeadPool(orgId: string) {
    return getCachedLeadPool(orgId)
}

export async function getQueueLeads(userId: string) {
    return prisma.lead.findMany({
        where: {
            assignedTo: userId,
            status: 'ACTIVE',
            OR: [
                { snoozeUntil: null },
                { snoozeUntil: { lt: new Date() } },
            ],
        },
        select: {
            id: true,
            name: true,
            currentMilestone: true,
            heatScore: true,
            priorityScore: true,
            dealValue: true,
            consecutiveMissCount: true,
            golden72hExpiresAt: true,
            createdAt: true,
        },
        orderBy: [
            { priorityScore: 'desc' },
            { heatScore: 'desc' },
            { currentMilestone: 'asc' },
            { updatedAt: 'desc' }
        ],
        skip: 3,
        take: 20,
    })
}

// NEW ACTION: Unified slicing queue (Top 3 for UI Smart Cards + rest for Bar)
// Priority tier engine — maps to business rule:
// Tier 1: Sharpness nét (GREEN > ORANGE > RED sharpnessScore cao)
// Tier 2: Fresh Lead mới chưa gọi
// Tier 3: Due/Retry (đến hạn lịch, retry cycle)
function getLeadPriorityTier(lead: {
    status: string
    colorBadge: string | null
    sharpnessScore: number | null
    retryCount: number
    nextVisibleAt: Date | null
    createdAt: Date
}): number {
    // Tier 1: Khách nét — đã phân tích có điểm cao
    if (lead.colorBadge === 'GREEN') return 10
    if (lead.colorBadge === 'ORANGE') return 20
    if (lead.colorBadge === 'RED') return 30
    // Tier 2: Khách mới chưa gọi lần nào
    if (lead.status === 'UNPROCESSED') return 40
    // Tier 3: Đến hạn lịch hẹn / Retry cycle
    if (lead.status === 'RETRYING') return 50
    // Default (Active, đang chăm nhưng chưa phân loại)
    return 60
}

export async function getAllSmartQueueLeads(userId: string) {
    const now = new Date()
    const leads = await prisma.lead.findMany({
        where: {
            assignedTo: userId,
            NOT: { status: { in: ['WON', 'LOST', 'ARCHIVED'] } },
            OR: [
                { status: 'UNPROCESSED' },
                { snoozeUntil: { lte: now } },
                { status: 'RETRYING', nextVisibleAt: { lte: now } },
                { status: 'ACTIVE', nextGoldenPingAt: { lte: now } },
                // Fallback: Active leads with NO snooze or snooze expired
                { status: 'ACTIVE', snoozeUntil: null },
                { status: 'ACTIVE', snoozeUntil: { lte: now } },
            ]
        },
        take: 50,
    })

    // Sort theo 3 tầng ưu tiên nghiệp vụ
    return leads.sort((a, b) => {
        const tierA = getLeadPriorityTier({
            status: a.status,
            colorBadge: a.colorBadge,
            sharpnessScore: a.sharpnessScore,
            retryCount: a.retryCount,
            nextVisibleAt: a.nextVisibleAt,
            createdAt: a.createdAt,
        })
        const tierB = getLeadPriorityTier({
            status: b.status,
            colorBadge: b.colorBadge,
            sharpnessScore: b.sharpnessScore,
            retryCount: b.retryCount,
            nextVisibleAt: b.nextVisibleAt,
            createdAt: b.createdAt,
        })

        // Cùng Tier → xét thêm điểm nét (cao hơn lên trước)
        if (tierA !== tierB) return tierA - tierB
        const scoreA = a.sharpnessScore ?? a.priorityScore
        const scoreB = b.sharpnessScore ?? b.priorityScore
        if (scoreA !== scoreB) return scoreB - scoreA

        // Cùng điểm nét → Khách chờ lâu hơn được ưu tiên (FIFO)
        return a.createdAt.getTime() - b.createdAt.getTime()
    }).slice(0, 23) // 3 Smart Cards + tối đa 20 Giỏ đợi
}

// ============================================
// MUTATIONS (invalidate cache tags)
// ============================================

export async function createLead(data: {
    orgId: string
    assignedTo: string
    teamId: string
    name: string
    phone: string
    sourceId?: string
    bantBudget?: BANTLevel
    bantNeed?: string
    scenario?: 'INTERACTED' | 'UNREACHABLE' | 'LATER'
    urgency?: string
    understanding?: string
    finReadiness?: string
    productFit?: string
    note?: string
}) {
    let status = 'UNPROCESSED'
    let colorBadge = 'GRAY'
    let sharpnessScore = 0
    let nextVisibleAt: Date | null = null
    let nextGoldenPingAt: Date | null = null
    let retryCount = 0

    const scenario = data.scenario || 'LATER'

    if (scenario === 'INTERACTED') {
        status = 'ACTIVE'
        // Fallback Heuristic
        let score = 50
        if (data.urgency?.includes('gấp') || data.urgency?.includes('Gấp')) score += 15
        if (data.understanding?.includes('Rất') || data.understanding?.includes('kỹ')) score += 15
        if (data.finReadiness?.includes('Sẵn')) score += 10
        if (data.productFit?.includes('Rất') || data.productFit?.includes('Rất khớp')) score += 10

        sharpnessScore = Math.min(100, score)
        
        if (sharpnessScore >= 80) colorBadge = 'GREEN'
        else if (sharpnessScore >= 60) colorBadge = 'ORANGE'
        else colorBadge = 'RED'
        
        // Cài đặt 72h Vàng chu kỳ Ping
        nextGoldenPingAt = new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
    } else if (scenario === 'UNREACHABLE') {
        status = 'RETRYING'
        nextVisibleAt = new Date(Date.now() + 30 * 60 * 1000) // 30 mins later
        retryCount = 1
    }

    const lead = await prisma.lead.create({
        data: {
            orgId: data.orgId,
            assignedTo: data.assignedTo,
            teamId: data.teamId,
            name: data.name,
            phoneEncrypted: `enc_${data.phone}`,
            phoneHash: `hash_${data.phone}`,
            sourceId: data.sourceId || undefined,
            bantBudget: data.bantBudget || 'UNKNOWN',
            bantNeed: data.bantNeed || undefined,
            golden72hExpiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
            priorityScore: sharpnessScore > 0 ? sharpnessScore : 50,
            heatScore: 50,
            status: status as any,
            colorBadge: colorBadge as any,
            sharpnessScore,
            urgency: data.urgency,
            understanding: data.understanding,
            finReadiness: data.finReadiness,
            productFit: data.productFit,
            note: data.note,
            retryCount,
            nextVisibleAt,
            nextGoldenPingAt,
        },
    })
    updateTag(CACHE_TAGS.leads(data.assignedTo))
    updateTag(CACHE_TAGS.userStats(data.assignedTo))
    updateTag(CACHE_TAGS.dashboard(data.orgId))
    return lead
}

export async function updateMilestone(
    leadId: string,
    userId: string,
    toMilestone: number,
    note?: string,
) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) throw new Error('Lead not found')

    const [updatedLead] = await prisma.$transaction([
        prisma.lead.update({
            where: { id: leadId },
            data: {
                currentMilestone: toMilestone,
                priorityScore: Math.min(100, lead.priorityScore + 10),
            },
        }),
        prisma.milestoneHistory.create({
            data: {
                leadId,
                fromMilestone: lead.currentMilestone,
                toMilestone,
                reason: toMilestone > lead.currentMilestone ? 'PROMOTION' : 'DEMOTION',
                note,
                changedBy: userId,
            },
        }),
    ])

    updateTag(CACHE_TAGS.leadDetail(leadId))
    if (lead.assignedTo) updateTag(CACHE_TAGS.leads(lead.assignedTo))
    if (lead.orgId) updateTag(CACHE_TAGS.dashboard(lead.orgId))
    return updatedLead
}

export async function assignLead(leadId: string, userId: string, teamId: string) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { orgId: true, assignedTo: true } })
    const result = await prisma.lead.update({
        where: { id: leadId },
        data: {
            assignedTo: userId,
            teamId,
            status: 'ACTIVE',
            golden72hExpiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        },
    })
    updateTag(CACHE_TAGS.leads(userId))
    updateTag(CACHE_TAGS.leadDetail(leadId))
    if (lead?.orgId) {
        updateTag(CACHE_TAGS.leadPool(lead.orgId))
        updateTag(CACHE_TAGS.dashboard(lead.orgId))
    }
    if (lead?.assignedTo) updateTag(CACHE_TAGS.leads(lead.assignedTo))
    updateTag(CACHE_TAGS.team(teamId))
    return result
}

export async function snoozeLead(leadId: string, until: Date, reason: string) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { assignedTo: true } })
    const result = await prisma.lead.update({
        where: { id: leadId },
        data: {
            snoozeUntil: until,
            snoozeReason: reason as any,
        },
    })
    updateTag(CACHE_TAGS.leadDetail(leadId))
    if (lead?.assignedTo) updateTag(CACHE_TAGS.leads(lead.assignedTo))
    return result
}

// ============================================
// HOT SEAT ACTIONS
// ============================================

/** CHỐT → Card biến Kim Cương, status WON */
export async function closeDeal(leadId: string, userId: string, note?: string) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) throw new Error('Lead not found')

    const [updatedLead] = await prisma.$transaction([
        prisma.lead.update({
            where: { id: leadId },
            data: {
                currentMilestone: 5,
                status: 'WON',
                colorBadge: 'GREEN' as any,
                snoozeUntil: null,
                snoozeReason: null,
            },
        }),
        prisma.milestoneHistory.create({
            data: {
                leadId,
                fromMilestone: lead.currentMilestone,
                toMilestone: 5,
                reason: 'PROMOTION',
                note: note || 'CHỐT CỌC — Kim Cương 💎',
                changedBy: userId,
            },
        }),
    ])

    updateTag(CACHE_TAGS.leadDetail(leadId))
    if (lead.assignedTo) updateTag(CACHE_TAGS.leads(lead.assignedTo))
    if (lead.orgId) updateTag(CACHE_TAGS.dashboard(lead.orgId))
    return updatedLead
}

/** NUÔI LẠI → Tụt Mốc 3, ẩn khỏi màn hình (snooze 24h) */
export async function demoteToNurture(leadId: string, userId: string, note?: string) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) throw new Error('Lead not found')

    const [updatedLead] = await prisma.$transaction([
        prisma.lead.update({
            where: { id: leadId },
            data: {
                currentMilestone: 3,
                priorityScore: Math.max(0, lead.priorityScore - 20),
                heatScore: Math.max(0, lead.heatScore - 15),
                snoozeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Ẩn 24h
                snoozeReason: 'UPDATED' as any,
            },
        }),
        prisma.milestoneHistory.create({
            data: {
                leadId,
                fromMilestone: lead.currentMilestone,
                toMilestone: 3,
                reason: 'DEMOTION',
                note: note || 'NUÔI LẠI — Tụt về Mốc 3 Niềm tin',
                changedBy: userId,
            },
        }),
    ])

    updateTag(CACHE_TAGS.leadDetail(leadId))
    if (lead.assignedTo) updateTag(CACHE_TAGS.leads(lead.assignedTo))
    if (lead.orgId) updateTag(CACHE_TAGS.dashboard(lead.orgId))
    return updatedLead
}
