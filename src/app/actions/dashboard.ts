'use server'

import { updateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import {
    getCachedDashboardMetrics,
    getCachedSOSAlerts,
    getCachedSchedules,
    CACHE_TAGS,
} from '@/lib/cache'

export async function getSOSAlerts(orgId?: string) {
    return getCachedSOSAlerts(orgId)
}

export async function resolveSOSAlert(alertId: string, userId: string) {
    const alert = await prisma.sOSAlert.findUnique({
        where: { id: alertId },
        select: { lead: { select: { orgId: true } } },
    })
    const result = await prisma.sOSAlert.update({
        where: { id: alertId },
        data: {
            status: 'RESOLVED',
            resolvedBy: userId,
            resolvedAt: new Date(),
        },
    })
    if (alert?.lead?.orgId) {
        updateTag(CACHE_TAGS.sos(alert.lead.orgId))
        updateTag(CACHE_TAGS.dashboard(alert.lead.orgId))
    }
    return result
}

export async function sendAdvice(data: {
    leadId: string
    fromUserId: string
    toUserId: string
    content: string
}) {
    const result = await prisma.managerAdvice.create({
        data: {
            leadId: data.leadId,
            fromUserId: data.fromUserId,
            toUserId: data.toUserId,
            content: data.content,
        },
    })
    updateTag(CACHE_TAGS.leadDetail(data.leadId))
    return result
}

export async function getSchedulesByUser(userId: string, includeCompleted = false) {
    return getCachedSchedules(userId, includeCompleted)
}

export async function createSchedule(data: {
    leadId: string
    userId: string
    type: 'FOLLOW_UP' | 'MEETING' | 'GOLDEN_72H' | 'AI_WARMUP'
    scheduledAt: string
    note?: string
}) {
    const result = await prisma.schedule.create({
        data: {
            leadId: data.leadId,
            userId: data.userId,
            type: data.type,
            scheduledAt: new Date(data.scheduledAt),
            note: data.note || null,
        },
    })
    updateTag(CACHE_TAGS.schedules(data.userId))
    updateTag(CACHE_TAGS.leadDetail(data.leadId))
    return result
}

export async function completeSchedule(scheduleId: string) {
    const schedule = await prisma.schedule.findUnique({
        where: { id: scheduleId },
        select: { userId: true, leadId: true },
    })
    const result = await prisma.schedule.update({
        where: { id: scheduleId },
        data: {
            status: 'COMPLETED',
            completedAt: new Date(),
        },
    })
    if (schedule) {
        updateTag(CACHE_TAGS.schedules(schedule.userId))
        updateTag(CACHE_TAGS.leadDetail(schedule.leadId))
    }
    return result
}

export async function getDashboardMetrics(orgId: string) {
    return getCachedDashboardMetrics(orgId)
}

