import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

// ============================================
// CACHE TAGS — used for targeted revalidation
// ============================================
export const CACHE_TAGS = {
    user: (id: string) => `user-${id}`,
    userBySupabase: (uid: string) => `user-supa-${uid}`,
    leads: (userId: string) => `leads-${userId}`,
    leadDetail: (leadId: string) => `lead-${leadId}`,
    leadPool: (orgId: string) => `pool-${orgId}`,
    userStats: (userId: string) => `stats-${userId}`,
    dashboard: (orgId: string) => `dashboard-${orgId}`,
    sos: (orgId: string) => `sos-${orgId}`,
    team: (teamId: string) => `team-${teamId}`,
    teamPerf: (teamId: string) => `team-perf-${teamId}`,
    schedules: (userId: string) => `schedules-${userId}`,
}

const REVALIDATE_SECONDS = 120

// ============================================
// CACHED USER QUERIES
// ============================================
export const getCachedUser = (supabaseUid: string) =>
    unstable_cache(
        async () => {
            return prisma.user.findUnique({
                where: { supabaseId: supabaseUid },
                include: {
                    team: { select: { id: true, name: true } },
                    org: { select: { id: true, name: true } },
                    managedTeams: { select: { id: true, name: true } },
                },
            })
        },
        [`user-${supabaseUid}`],
        { tags: [CACHE_TAGS.userBySupabase(supabaseUid)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedUserStats = (userId: string) =>
    unstable_cache(
        async () => {
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
                }),
            ])
            return {
                totalLeads: activeLeads,
                activeLeads,
                milestone45,
                pipelineValue: pipelineAgg._sum.dealValue || 0,
                streak: user?.streakCount || 0,
            }
        },
        [`stats-${userId}`],
        { tags: [CACHE_TAGS.userStats(userId), CACHE_TAGS.leads(userId)], revalidate: REVALIDATE_SECONDS }
    )()

// ============================================
// CACHED LEAD QUERIES
// ============================================
export const getCachedTopPriorityLeads = (userId: string, limit = 3) =>
    unstable_cache(
        async () => {
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
        },
        [`top-leads-${userId}-${limit}`],
        { tags: [CACHE_TAGS.leads(userId)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedLeadsByUser = (userId: string) =>
    unstable_cache(
        async () => {
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
        },
        [`leads-${userId}`],
        { tags: [CACHE_TAGS.leads(userId)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedLeadDetail = (leadId: string) =>
    unstable_cache(
        async () => {
            return prisma.lead.findUnique({
                where: { id: leadId },
                include: {
                    source: { select: { name: true } },
                    assignee: { select: { id: true, name: true } },
                    interactions: {
                        orderBy: { createdAt: 'desc' },
                        include: { user: { select: { name: true } } },
                    },
                    milestoneHistory: {
                        orderBy: { changedAt: 'desc' },
                        include: { user: { select: { name: true } } },
                    },
                    schedules: {
                        where: { status: { in: ['PENDING', 'OVERDUE'] } },
                        orderBy: { scheduledAt: 'asc' },
                    },
                    advices: {
                        where: { isRead: false },
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        include: { fromUser: { select: { name: true } } },
                    },
                },
            })
        },
        [`lead-detail-${leadId}`],
        { tags: [CACHE_TAGS.leadDetail(leadId)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedLeadPool = (orgId: string) =>
    unstable_cache(
        async () => {
            return prisma.lead.findMany({
                where: { orgId, status: 'POOL' },
                include: {
                    source: { select: { name: true } },
                    assignee: { select: { name: true } },
                },
                orderBy: { updatedAt: 'desc' },
            })
        },
        [`pool-${orgId}`],
        { tags: [CACHE_TAGS.leadPool(orgId)], revalidate: REVALIDATE_SECONDS }
    )()

// ============================================
// CACHED DASHBOARD / TEAM QUERIES
// ============================================
export const getCachedDashboardMetrics = (orgId: string) =>
    unstable_cache(
        async () => {
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
                }),
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
        },
        [`dashboard-${orgId}`],
        { tags: [CACHE_TAGS.dashboard(orgId)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedSOSAlerts = (orgId?: string) =>
    unstable_cache(
        async () => {
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
                orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
            })
        },
        [`sos-${orgId || 'all'}`],
        { tags: [CACHE_TAGS.sos(orgId || 'all')], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedTeamMembers = (teamId: string) =>
    unstable_cache(
        async () => {
            return prisma.user.findMany({
                where: { teamId, role: 'SALE' },
                include: {
                    _count: {
                        select: { assignedLeads: { where: { status: 'ACTIVE' } } },
                    },
                },
            })
        },
        [`team-members-${teamId}`],
        { tags: [CACHE_TAGS.team(teamId)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedTeamPerformance = (teamId: string) =>
    unstable_cache(
        async () => {
            const members = await prisma.user.findMany({
                where: { teamId, role: 'SALE' },
                select: {
                    id: true,
                    name: true,
                    streakCount: true,
                    assignedLeads: {
                        where: { status: { in: ['ACTIVE', 'WON'] } },
                        select: { currentMilestone: true, dealValue: true, status: true },
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
        },
        [`team-perf-${teamId}`],
        { tags: [CACHE_TAGS.teamPerf(teamId)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedSchedules = (userId: string, includeCompleted = false) =>
    unstable_cache(
        async () => {
            return prisma.schedule.findMany({
                where: {
                    userId,
                    ...(includeCompleted ? {} : { status: { in: ['PENDING', 'OVERDUE'] } }),
                },
                include: {
                    lead: {
                        select: { id: true, name: true, currentMilestone: true, dealValue: true },
                    },
                },
                orderBy: { scheduledAt: 'asc' },
            })
        },
        [`schedules-${userId}-${includeCompleted}`],
        { tags: [CACHE_TAGS.schedules(userId)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedWonRevenue = (orgId: string) =>
    unstable_cache(
        async () => {
            const result = await prisma.lead.aggregate({
                where: { orgId, status: 'WON' },
                _sum: { dealValue: true },
            })
            return result._sum.dealValue || 0
        },
        [`won-revenue-${orgId}`],
        { tags: [CACHE_TAGS.dashboard(orgId)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedActiveLeads = (userId: string) =>
    unstable_cache(
        async () => {
            return prisma.lead.findMany({
                where: { assignedTo: userId, status: 'ACTIVE' },
                select: { id: true, name: true, currentMilestone: true, dealValue: true },
                orderBy: { priorityScore: 'desc' },
            })
        },
        [`active-leads-${userId}`],
        { tags: [CACHE_TAGS.leads(userId)], revalidate: REVALIDATE_SECONDS }
    )()

export const getCachedAllTeamPerformance = (orgId: string) =>
    unstable_cache(
        async () => {
            const members = await prisma.user.findMany({
                where: { orgId, role: 'SALE' },
                select: {
                    id: true,
                    name: true,
                    streakCount: true,
                    assignedLeads: {
                        where: { status: { in: ['ACTIVE', 'WON'] } },
                        select: { currentMilestone: true, dealValue: true, status: true },
                    },
                },
            })
            return members
                .map(m => ({
                    id: m.id,
                    name: m.name,
                    streak: m.streakCount,
                    totalLeads: m.assignedLeads.length,
                    activeLeads: m.assignedLeads.filter(l => l.status === 'ACTIVE').length,
                    wonDeals: m.assignedLeads.filter(l => l.status === 'WON').length,
                    revenue: m.assignedLeads.filter(l => l.status === 'WON').reduce((s, l) => s + (l.dealValue || 0), 0),
                    pipeline: m.assignedLeads.filter(l => l.status === 'ACTIVE').reduce((s, l) => s + (l.dealValue || 0), 0),
                    score: Math.round(
                        (m.assignedLeads.filter(l => l.status === 'WON').length * 30) +
                        (m.streakCount * 5) +
                        (m.assignedLeads.filter(l => l.status === 'ACTIVE' && l.currentMilestone >= 4).length * 10) +
                        Math.min(30, m.assignedLeads.filter(l => l.status === 'ACTIVE').length * 5)
                    ),
                }))
                .sort((a, b) => b.score - a.score)
        },
        [`all-team-perf-${orgId}`],
        { tags: [CACHE_TAGS.dashboard(orgId)], revalidate: REVALIDATE_SECONDS }
    )()

