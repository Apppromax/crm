'use server'

import { prisma } from '@/lib/prisma'

export async function getUserByRole(role: 'SALE' | 'MANAGER' | 'CEO') {
    const prismaRole = role === 'CEO' ? 'CEO' : role === 'MANAGER' ? 'MANAGER' : 'SALE'
    return prisma.user.findFirst({
        where: { role: prismaRole },
        include: {
            team: { select: { id: true, name: true } },
            org: { select: { id: true, name: true } },
        },
    })
}

export async function getUserStats(userId: string) {
    const [totalLeads, activeLeads, milestone45, pipelineAgg] = await Promise.all([
        prisma.lead.count({ where: { assignedTo: userId } }),
        prisma.lead.count({ where: { assignedTo: userId, status: 'ACTIVE' } }),
        prisma.lead.count({
            where: { assignedTo: userId, status: 'ACTIVE', currentMilestone: { gte: 4 } },
        }),
        prisma.lead.aggregate({
            where: { assignedTo: userId, status: 'ACTIVE' },
            _sum: { dealValue: true },
        }),
    ])

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { streakCount: true },
    })

    return {
        totalLeads,
        activeLeads,
        milestone45,
        pipelineValue: pipelineAgg._sum.dealValue || 0,
        streakCount: user?.streakCount || 0,
    }
}

export async function getTeamMembers(teamId: string) {
    return prisma.user.findMany({
        where: { teamId, role: 'SALE' },
        include: {
            _count: {
                select: {
                    assignedLeads: { where: { status: 'ACTIVE' } },
                },
            },
        },
    })
}

export async function getTeamPerformance(teamId: string) {
    const members = await prisma.user.findMany({
        where: { teamId, role: 'SALE' },
        select: {
            id: true,
            name: true,
            streakCount: true,
            assignedLeads: {
                where: { status: { in: ['ACTIVE', 'WON'] } },
                select: {
                    currentMilestone: true,
                    dealValue: true,
                    status: true,
                },
            },
        },
    })

    return members.map(m => ({
        id: m.id,
        name: m.name,
        streak: m.streakCount,
        totalLeads: m.assignedLeads.length,
        activeLeads: m.assignedLeads.filter(l => l.status === 'ACTIVE').length,
        wonDeals: m.assignedLeads.filter(l => l.status === 'WON').length,
        revenue: m.assignedLeads
            .filter(l => l.status === 'WON')
            .reduce((s, l) => s + (l.dealValue || 0), 0),
        pipeline: m.assignedLeads
            .filter(l => l.status === 'ACTIVE')
            .reduce((s, l) => s + (l.dealValue || 0), 0),
    }))
}
