'use server'

import { prisma } from '@/lib/prisma'
import { formatCurrencyShort } from '@/lib/utils'
import { detectBurnout } from '@/lib/burnout'

interface TeamMemberReport {
    id: string
    name: string
    interactions: number
    leadsActive: number
    wonDeals: number
    burnoutLevel: 'HEALTHY' | 'WATCH' | 'WARNING' | 'CRITICAL'
}

export async function generateTeamReport(teamId: string) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const members = await prisma.user.findMany({
        where: { teamId, role: 'SALE' },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    interactions: { where: { createdAt: { gte: weekAgo } } },
                },
            },
            assignedLeads: {
                where: { status: 'ACTIVE' },
                select: { id: true },
            },
        },
    })

    const memberReports: TeamMemberReport[] = members.map(m => {
        const interactionsWeek = m._count.interactions
        const activeLeads = m.assignedLeads.length

        const burnout = detectBurnout({
            interactionsLast7Days: interactionsWeek,
            interactionsLast30Days: interactionsWeek * 4, // estimate
            avgDailyInteractions: Math.round((interactionsWeek / 7) * 10) / 10,
            streakCount: interactionsWeek > 0 ? 1 : 0,
            missedSchedules7Days: 0,
            activeLeadCount: activeLeads,
        })

        return {
            id: m.id,
            name: m.name,
            interactions: interactionsWeek,
            leadsActive: activeLeads,
            wonDeals: 0,
            burnoutLevel: burnout.level,
        }
    })

    // Team-level metrics
    const totalInteractions = memberReports.reduce((s, m) => s + m.interactions, 0)
    const totalActiveLeads = memberReports.reduce((s, m) => s + m.leadsActive, 0)
    const burnoutWarnings = memberReports.filter(m => m.burnoutLevel === 'WARNING' || m.burnoutLevel === 'CRITICAL')

    // Generate text for Zalo
    const lines = [
        `📊 BÁO CÁO TEAM TUẦN`,
        `━━━━━━━━━━━━━━━━━━`,
        ``,
        `👥 Tổng quan:`,
        `  • ${members.length} thành viên`,
        `  • ${totalInteractions} tương tác tuần này`,
        `  • ${totalActiveLeads} leads đang chăm sóc`,
        ``,
        `📋 Chi tiết:`,
        ...memberReports.map((m, i) =>
            `  ${i + 1}. ${m.name}: ${m.interactions} tương tác, ${m.leadsActive} leads ${m.burnoutLevel !== 'HEALTHY' ? `⚠️ ${m.burnoutLevel}` : '✅'}`
        ),
        ``,
    ]

    if (burnoutWarnings.length > 0) {
        lines.push(`🚨 CẦN LƯU Ý:`)
        burnoutWarnings.forEach(m => {
            lines.push(`  ⚠️ ${m.name} — ${m.burnoutLevel}`)
        })
        lines.push(``)
    }

    lines.push(`━━━━━━━━━━━━━━━━━━`)
    lines.push(`CRM Pro V2 🤖`)

    return {
        members: memberReports,
        totalInteractions,
        totalActiveLeads,
        burnoutWarnings: burnoutWarnings.length,
        textReport: lines.join('\n'),
    }
}
