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
        // Skip top 3, get the rest
        skip: 3,
        take: 20,
    })
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

