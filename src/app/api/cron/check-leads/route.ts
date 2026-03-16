import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Vercel Cron: runs every 15 minutes
// Checks for expired snoozes and re-activates leads
// Also checks 72h golden rule violations and creates SOS alerts

export async function GET(request: Request) {
    // Verify cron secret (prevent unauthorized access)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
        snoozeExpired: 0,
        sosCreated: 0,
        errors: [] as string[],
    }

    try {
        // 1. Expire snoozes — set snoozeUntil to null for expired leads
        const expiredSnoozes = await prisma.lead.updateMany({
            where: {
                snoozeUntil: { lt: new Date() },
                status: 'ACTIVE',
            },
            data: { snoozeUntil: null },
        })
        results.snoozeExpired = expiredSnoozes.count

        // 2. Check 72h Golden Rule violations
        const thresholdDate = new Date(Date.now() - 72 * 60 * 60 * 1000) // 72 hours ago

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

        // 3. Check stale leads (no interaction > 7 days) for M4/M5 demotion warning
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

    } catch (e) {
        results.errors.push(`Global error: ${e}`)
    }

    return NextResponse.json({
        ok: true,
        timestamp: new Date().toISOString(),
        ...results,
    })
}
