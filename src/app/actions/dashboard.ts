'use server'

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
    return prisma.sOSAlert.update({
        where: { id: alertId },
        data: {
            status: 'RESOLVED',
            resolvedBy: userId,
            resolvedAt: new Date(),
        },
    })
}

export async function sendAdvice(data: {
    leadId: string
    fromUserId: string
    toUserId: string
    content: string
}) {
    return prisma.managerAdvice.create({
        data: {
            leadId: data.leadId,
            fromUserId: data.fromUserId,
            toUserId: data.toUserId,
            content: data.content,
        },
    })
}

export async function getSchedulesByUser(userId: string) {
    return prisma.schedule.findMany({
        where: {
            userId,
            status: { in: ['PENDING', 'OVERDUE'] },
        },
        include: {
            lead: { select: { id: true, name: true, currentMilestone: true } },
        },
        orderBy: { scheduledAt: 'asc' },
    })
}

export async function getDashboardMetrics(orgId: string) {
    const [totalLeads, activeLeads, wonDeals, pipeline, sosCount] = await Promise.all([
        prisma.lead.count({ where: { orgId } }),
        prisma.lead.count({ where: { orgId, status: 'ACTIVE' } }),
        prisma.lead.count({ where: { orgId, status: 'WON' } }),
        prisma.lead.aggregate({
            where: { orgId, status: 'ACTIVE' },
            _sum: { dealValue: true },
        }),
        prisma.sOSAlert.count({ where: { status: 'ACTIVE', lead: { orgId } } }),
    ])

    const milestoneDistribution = await prisma.lead.groupBy({
        by: ['currentMilestone'],
        where: { orgId, status: 'ACTIVE' },
        _count: true,
        _sum: { dealValue: true },
    })

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
