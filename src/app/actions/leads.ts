'use server'

import { prisma } from '@/lib/prisma'
import type { LeadStatus, BANTLevel } from '@prisma/client'

// ============================================
// GET LEADS
// ============================================

export async function getTopPriorityLeads(userId: string, limit = 3) {
    return prisma.lead.findMany({
        where: {
            assignedTo: userId,
            status: 'ACTIVE',
            OR: [
                { snoozeUntil: null },
                { snoozeUntil: { lt: new Date() } },
            ],
        },
        include: {
            source: { select: { name: true } },
            interactions: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: { createdAt: true, type: true },
            },
            _count: { select: { interactions: true } },
        },
        orderBy: { priorityScore: 'desc' },
        take: limit,
    })
}

export async function getLeadsByUser(userId: string) {
    return prisma.lead.findMany({
        where: {
            assignedTo: userId,
            status: { in: ['ACTIVE', 'WON'] },
        },
        include: {
            source: { select: { name: true } },
            _count: { select: { interactions: true } },
        },
        orderBy: { priorityScore: 'desc' },
    })
}

export async function getLeadDetail(leadId: string) {
    return prisma.lead.findUnique({
        where: { id: leadId },
        include: {
            source: { select: { name: true } },
            assignee: { select: { id: true, name: true } },
            interactions: {
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } },
                },
            },
            milestoneHistory: {
                orderBy: { changedAt: 'desc' },
                include: {
                    user: { select: { name: true } },
                },
            },
            schedules: {
                where: { status: { in: ['PENDING', 'OVERDUE'] } },
                orderBy: { scheduledAt: 'asc' },
            },
            advices: {
                where: { isRead: false },
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: {
                    fromUser: { select: { name: true } },
                },
            },
        },
    })
}

// ============================================
// LEAD POOL (unassigned / retracted)
// ============================================

export async function getLeadPool(orgId: string) {
    return prisma.lead.findMany({
        where: {
            orgId,
            status: 'POOL',
        },
        include: {
            source: { select: { name: true } },
            assignee: { select: { name: true } },
        },
        orderBy: { updatedAt: 'desc' },
    })
}

// ============================================
// MUTATIONS
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
}) {
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
            priorityScore: 50,
            heatScore: 50,
        },
    })
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

    return updatedLead
}

export async function assignLead(leadId: string, userId: string, teamId: string) {
    return prisma.lead.update({
        where: { id: leadId },
        data: {
            assignedTo: userId,
            teamId,
            status: 'ACTIVE',
            golden72hExpiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        },
    })
}

export async function snoozeLead(leadId: string, until: Date, reason: string) {
    return prisma.lead.update({
        where: { id: leadId },
        data: {
            snoozeUntil: until,
            snoozeReason: reason as any,
        },
    })
}
