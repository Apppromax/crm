'use server'

import { prisma } from '@/lib/prisma'
import { formatCurrencyShort } from '@/lib/utils'

interface WeeklySnapshot {
    period: string
    summary: string
    metrics: {
        newLeads: number
        wonDeals: number
        lostLeads: number
        totalInteractions: number
        avgDailyInteractions: number
        revenue: number
        conversionRate: number
    }
    topPerformers: { name: string; wonDeals: number; interactions: number }[]
    milestoneMovement: { promotions: number; demotions: number }
    alerts: string[]
    textReport: string // Ready to paste into Zalo/Telegram
}

export async function generateWeeklySnapshot(orgId: string): Promise<WeeklySnapshot> {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const periodStr = `${weekAgo.toLocaleDateString('vi-VN')} — ${now.toLocaleDateString('vi-VN')}`

    // Parallel queries
    const [
        newLeads,
        wonDeals,
        lostLeads,
        interactions,
        milestoneChanges,
        topUsers,
    ] = await Promise.all([
        // New leads this week
        prisma.lead.count({
            where: { orgId, createdAt: { gte: weekAgo } },
        }),

        // Won deals (milestone 5)
        prisma.lead.count({
            where: {
                orgId,
                currentMilestone: 5,
                updatedAt: { gte: weekAgo },
            },
        }),

        // Lost leads
        prisma.lead.count({
            where: {
                orgId,
                status: { in: ['LOST', 'ARCHIVED'] },
                updatedAt: { gte: weekAgo },
            },
        }),

        // Total interactions
        prisma.interaction.count({
            where: {
                lead: { orgId },
                createdAt: { gte: weekAgo },
            },
        }),

        // Milestone changes
        prisma.milestoneHistory.findMany({
            where: {
                lead: { orgId },
                changedAt: { gte: weekAgo },
            },
            select: { fromMilestone: true, toMilestone: true },
        }),

        // Top performing users
        prisma.user.findMany({
            where: { orgId, role: 'SALE' },
            select: {
                name: true,
                _count: {
                    select: {
                        interactions: {
                            where: { createdAt: { gte: weekAgo } },
                        },
                    },
                },
            },
            orderBy: { interactions: { _count: 'desc' } },
            take: 3,
        }),
    ])

    // Calculate won revenue
    const wonLeads = await prisma.lead.findMany({
        where: {
            orgId,
            currentMilestone: 5,
            updatedAt: { gte: weekAgo },
        },
        select: { dealValue: true },
    })
    const revenue = wonLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0)

    // Milestone movement
    const promotions = milestoneChanges.filter(m => m.toMilestone > m.fromMilestone).length
    const demotions = milestoneChanges.filter(m => m.toMilestone < m.fromMilestone).length

    // Avg daily interactions
    const avgDaily = Math.round((interactions / 7) * 10) / 10

    // Conversion rate
    const totalActive = await prisma.lead.count({ where: { orgId, status: 'ACTIVE' } })
    const conversionRate = totalActive > 0 ? Math.round((wonDeals / totalActive) * 1000) / 10 : 0

    // Top performers
    const topPerformers = topUsers.map(u => ({
        name: u.name,
        wonDeals: 0, // Would need additional query for accuracy
        interactions: u._count.interactions,
    }))

    // Alerts
    const alerts: string[] = []
    if (interactions < 50) alerts.push('⚠️ Tổng tương tác thấp — dưới 50 lần.')
    if (wonDeals === 0) alerts.push('🔴 Chưa có deal won nào tuần này.')
    if (demotions > promotions) alerts.push('⚠️ Rớt mốc nhiều hơn thăng mốc.')
    if (avgDaily < 3) alerts.push('📉 Trung bình chỉ ' + avgDaily + ' tương tác/ngày.')

    // Generate text report (for Zalo/Telegram)
    const textReport = generateTextReport({
        period: periodStr,
        newLeads,
        wonDeals,
        lostLeads,
        interactions,
        avgDaily,
        revenue,
        conversionRate,
        promotions,
        demotions,
        topPerformers,
        alerts,
    })

    return {
        period: periodStr,
        summary: `Tuần ${periodStr}: ${wonDeals} deals won, ${newLeads} leads mới, ${interactions} tương tác.`,
        metrics: {
            newLeads,
            wonDeals,
            lostLeads,
            totalInteractions: interactions,
            avgDailyInteractions: avgDaily,
            revenue,
            conversionRate,
        },
        topPerformers,
        milestoneMovement: { promotions, demotions },
        alerts,
        textReport,
    }
}

function generateTextReport(data: {
    period: string
    newLeads: number
    wonDeals: number
    lostLeads: number
    interactions: number
    avgDaily: number
    revenue: number
    conversionRate: number
    promotions: number
    demotions: number
    topPerformers: { name: string; interactions: number }[]
    alerts: string[]
}): string {
    const lines = [
        `📊 BÁO CÁO TUẦN — CRM Pro V2`,
        `📅 ${data.period}`,
        `━━━━━━━━━━━━━━━━━━━━━━`,
        ``,
        `🎯 KẾT QUẢ`,
        `  • Deals won: ${data.wonDeals}`,
        `  • Doanh thu: ${formatCurrencyShort(data.revenue)}`,
        `  • Tỷ lệ chốt: ${data.conversionRate}%`,
        ``,
        `📈 HOẠT ĐỘNG`,
        `  • Leads mới: ${data.newLeads}`,
        `  • Tương tác: ${data.interactions} (${data.avgDaily}/ngày)`,
        `  • Thăng mốc: ${data.promotions} ↑ | Rớt mốc: ${data.demotions} ↓`,
        `  • Leads mất: ${data.lostLeads}`,
        ``,
    ]

    if (data.topPerformers.length > 0) {
        lines.push(`🏆 TOP PERFORMERS`)
        data.topPerformers.forEach((p, i) => {
            lines.push(`  ${i + 1}. ${p.name} — ${p.interactions} tương tác`)
        })
        lines.push(``)
    }

    if (data.alerts.length > 0) {
        lines.push(`🚨 CẦN LƯU Ý`)
        data.alerts.forEach(a => lines.push(`  ${a}`))
        lines.push(``)
    }

    lines.push(`━━━━━━━━━━━━━━━━━━━━━━`)
    lines.push(`Sent by CRM Pro V2 🤖`)

    return lines.join('\n')
}
