'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function getSOSAlerts(orgId?: string) {
    return prisma.sOSAlert.findMany({
        where: {
            status: { in: ['ACTIVE', 'ACKNOWLEDGED'] },
            ...(orgId ? { lead: { orgId } } : {}),
        },
        include: {
            lead: {
                select: {
                    id: true,
                    name: true,
                    currentMilestone: true,
                    dealValue: true,
                    assignee: { select: { id: true, name: true } },
                },
            },
        },
        orderBy: [
            { severity: 'desc' },
            { createdAt: 'desc' },
        ],
    })
}

export async function resolveSOSAlert(alertId: string, userId: string) {
    const result = await prisma.sOSAlert.update({
        where: { id: alertId },
        data: {
            status: 'RESOLVED',
            resolvedBy: userId,
            resolvedAt: new Date(),
        },
    })
    revalidatePath('/manager')
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
    revalidatePath('/sale')
    revalidatePath('/manager')
    return result
}

export async function getSchedulesByUser(userId: string, includeCompleted = false) {
    return prisma.schedule.findMany({
        where: {
            userId,
            ...(includeCompleted ? {} : { status: { in: ['PENDING', 'OVERDUE'] } }),
        },
        include: {
            lead: {
                select: {
                    id: true,
                    name: true,
                    currentMilestone: true,
                    dealValue: true,
                },
            },
        },
        orderBy: { scheduledAt: 'asc' },
    })
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
    revalidatePath('/sale/schedule')
    revalidatePath('/sale')
    return result
}

export async function completeSchedule(scheduleId: string) {
    const result = await prisma.schedule.update({
        where: { id: scheduleId },
        data: {
            status: 'COMPLETED',
            completedAt: new Date(),
        },
    })
    revalidatePath('/sale/schedule')
    revalidatePath('/sale')
    return result
}

export async function getDashboardMetrics(orgId: string) {
    const [totalLeads, activeLeads, wonDeals, pipeline, sosCount, milestoneDistribution] = await Promise.all([
        prisma.lead.count({ where: { orgId } }),
        prisma.lead.count({ where: { orgId, status: 'ACTIVE' } }),
        prisma.lead.count({ where: { orgId, status: 'WON' } }),
        prisma.lead.aggregate({
            where: { orgId, status: 'ACTIVE' },
            _sum: { dealValue: true },
        }),
        prisma.sOSAlert.count({ where: { status: 'ACTIVE', lead: { orgId } } }),
        prisma.lead.groupBy({
            by: ['currentMilestone'],
            where: { orgId, status: 'ACTIVE' },
            _count: true,
            _sum: { dealValue: true },
        })
    ])

    return {
        totalLeads,
        activeLeads,
        wonDeals,
        pipelineValue: pipeline._sum.dealValue || 0,
        sosCount,
        milestoneDistribution: milestoneDistribution.map(m => ({
            milestone: m.currentMilestone,
            count: m._count,
            value: m._sum.dealValue || 0,
        })),
    }
}
