import { NextResponse } from 'next/server'
import { generateWeeklySnapshot } from '@/app/actions/weekly-snapshot'
import { prisma } from '@/lib/prisma'

// GET: Generate weekly snapshot for an org
// Can be called manually or via cron
export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization')
    const url = new URL(request.url)
    const orgId = url.searchParams.get('orgId')

    // Auth check
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // If orgId provided, generate for that org
        if (orgId) {
            const snapshot = await generateWeeklySnapshot(orgId)
            return NextResponse.json(snapshot)
        }

        // Otherwise, generate for all orgs
        const orgs = await prisma.organization.findMany({
            select: { id: true, name: true },
        })

        const results = await Promise.all(
            orgs.map(async (org) => {
                const snapshot = await generateWeeklySnapshot(org.id)
                return { orgId: org.id, orgName: org.name, ...snapshot }
            })
        )

        return NextResponse.json({
            ok: true,
            timestamp: new Date().toISOString(),
            snapshots: results,
        })
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}
