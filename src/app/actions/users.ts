'use server'

import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// Được cache lại để tránh gọi DB/Supabase nhiều lần trong 1 request (tăng tốc độ tải)
export const getCurrentUser = cache(async () => {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) return null

    return prisma.user.findUnique({
        where: { supabaseId: authUser.id },
        include: {
            team: { select: { id: true, name: true } },
            org: { select: { id: true, name: true } },
            managedTeams: { select: { id: true, name: true } },
        },
    })
})

export async function getUserByRole(role: 'SALE' | 'MANAGER' | 'CEO') {
    const currentUser = await getCurrentUser()
    if (!currentUser) return null

    // Ensure the user actually has the requested role
    if (currentUser.role !== role) {
        return null
    }

    return currentUser
}

export async function getUserStats(userId: string) {
    const [totalLeads, activeLeads, milestone45, pipelineAgg, user] = await Promise.all([
        prisma.lead.count({ where: { assignedTo: userId } }),
        prisma.lead.count({ where: { assignedTo: userId, status: 'ACTIVE' } }),
        prisma.lead.count({
            where: { assignedTo: userId, status: 'ACTIVE', currentMilestone: { gte: 4 } },
        }),
        prisma.lead.aggregate({
            where: { assignedTo: userId, status: 'ACTIVE' },
            _sum: { dealValue: true },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { streakCount: true },
        })
    ])

    return {
        totalLeads,
        activeLeads,
        milestone45,
        pipelineValue: pipelineAgg._sum.dealValue || 0,
        streak: user?.streakCount || 0,
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
