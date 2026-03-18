import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Vercel Cron: runs every 15 minutes
// 1. Expire snoozes
// 2. 72h golden rule SOS
// 3. Stale milestone warning
// 4. Anti-hoarding: M1-2 reclaim (7 days) + 5x miss archive

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
        snoozeExpired: 0,
        sosCreated: 0,
        leadsReclaimed: 0,
        leadsArchived: 0,
        errors: [] as string[],
    }

    try {
        // 1. Expire snoozes
        const expiredSnoozes = await prisma.lead.updateMany({
            where: {
                snoozeUntil: { lt: new Date() },
                status: 'ACTIVE',
            },
            data: { snoozeUntil: null },
        })
        results.snoozeExpired = expiredSnoozes.count

        // 2. Check 72h Golden Rule violations
        const thresholdDate = new Date(Date.now() - 72 * 60 * 60 * 1000)

        const violatingLeads = await prisma.lead.findMany({
            where: {
                status: 'ACTIVE',
                createdAt: { lt: thresholdDate },
                lastInteractionAt: null,
                sosAlerts: {
                    none: { status: 'ACTIVE', type: 'HOT_NOT_CLOSED' },
                },
            },
            select: { id: true, name: true, assignedTo: true },
        })

        for (const lead of violatingLeads) {
            try {
                await prisma.sOSAlert.create({
                    data: {
                        leadId: lead.id,
                        type: 'HOT_NOT_CLOSED',
                        severity: 'CRITICAL',
                        message: `Lead "${lead.name}" vượt quá 72h không có tương tác! Cần liên lạc ngay.`,
                        status: 'ACTIVE',
                    },
                })
                results.sosCreated++
            } catch (e) {
                results.errors.push(`Failed SOS for lead ${lead.id}: ${e}`)
            }
        }

        // 3. Check stale high-milestone leads (warning only)
        const staleThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

        const staleHighMilestone = await prisma.lead.findMany({
            where: {
                status: 'ACTIVE',
                currentMilestone: { gte: 4 },
                lastInteractionAt: { lt: staleThreshold },
                sosAlerts: {
                    none: { status: 'ACTIVE', type: 'STUCK_MILESTONE' },
                },
            },
            select: { id: true, name: true, currentMilestone: true },
        })

        for (const lead of staleHighMilestone) {
            try {
                await prisma.sOSAlert.create({
                    data: {
                        leadId: lead.id,
                        type: 'STUCK_MILESTONE',
                        severity: 'WARNING',
                        message: `Lead "${lead.name}" ở Mốc ${lead.currentMilestone} nhưng > 7 ngày không tương tác. Nguy cơ rớt mốc!`,
                        status: 'ACTIVE',
                    },
                })
                results.sosCreated++
            } catch (e) {
                results.errors.push(`Failed SOS for stale lead ${lead.id}: ${e}`)
            }
        }

        // ============================================
        // 4. ANTI-HOARDING — DỌN RÁC TỰ ĐỘNG
        // ============================================

        // 4a. Mốc 1-2 + 7 ngày không tương tác → Thu hồi về Kho chung
        const reclaimThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

        const reclaimed = await prisma.lead.updateMany({
            where: {
                status: 'ACTIVE',
                currentMilestone: { lte: 2 },
                assignedTo: { not: null },
                OR: [
                    // Không có lần tương tác nào VÀ tạo > 7 ngày
                    { lastInteractionAt: null, createdAt: { lt: reclaimThreshold } },
                    // Tương tác gần nhất > 7 ngày trước
                    { lastInteractionAt: { lt: reclaimThreshold } },
                ],
            },
            data: {
                assignedTo: null,
                status: 'POOL',
                snoozeUntil: null,
            },
        })
        results.leadsReclaimed = reclaimed.count

        // 4b. Liên lạc hụt 5 lần liên tiếp → Xóa rác (ARCHIVED)
        const trashLeads = await prisma.lead.updateMany({
            where: {
                status: { in: ['RETRYING' as any, 'ACTIVE'] },
                consecutiveMissCount: { gte: 5 },
            },
            data: {
                status: 'ARCHIVED',
                snoozeUntil: null,
            },
        })
        results.leadsArchived = trashLeads.count

    } catch (e) {
        results.errors.push(`Global error: ${e}`)
    }

    return NextResponse.json({
        ok: true,
        timestamp: new Date().toISOString(),
        ...results,
    })
}
