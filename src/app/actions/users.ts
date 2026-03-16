'use server'

import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Fast path: read supabase UID from middleware header (auth already verified)
// Slow path fallback: Supabase auth + Prisma lookup
export const getCurrentUser = cache(async () => {
    // Try fast path — middleware already verified auth and set the uid
    const headerStore = await headers()
    const supabaseUid = headerStore.get('x-supabase-uid')

    if (supabaseUid) {
        return prisma.user.findUnique({
            where: { supabaseId: supabaseUid },
            include: {
                team: { select: { id: true, name: true } },
                org: { select: { id: true, name: true } },
                managedTeams: { select: { id: true, name: true } },
            },
        })
    }

    // Fallback: full auth flow (for API routes, etc.)
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

import { redirect } from 'next/navigation'

export async function getUserByRole(role: 'SALE' | 'MANAGER' | 'CEO') {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
        redirect('/login')
    }

    // Middleware already enforces role access, but verify for safety
    let hasAccess = false;
    if (role === 'CEO' && currentUser.role === 'CEO') hasAccess = true;
    if (role === 'SALE' && currentUser.role === 'SALE') hasAccess = true;
    if (role === 'MANAGER' && ['MANAGER', 'ADMIN', 'LEADER'].includes(currentUser.role)) hasAccess = true;

    if (!hasAccess) {
        switch (currentUser.role) {
            case 'CEO': redirect('/ceo'); break;
            case 'MANAGER':
            case 'ADMIN':
            case 'LEADER': redirect('/manager'); break;
            case 'SALE': redirect('/sale'); break;
            default: redirect('/login');
        }
    }

    return currentUser
}

export async function getUserStats(userId: string) {
    const [activeLeads, milestone45, pipelineAgg, user] = await Promise.all([
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
        totalLeads: activeLeads,
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
