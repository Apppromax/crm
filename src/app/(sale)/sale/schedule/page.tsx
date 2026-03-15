import { Suspense } from 'react'
import { getUserByRole } from '@/app/actions/users'
import { getSchedulesByUser } from '@/app/actions/dashboard'
import { ScheduleClient } from './schedule-client'
import Loading from '../../loading'

export default function SchedulePage() {
    return (
        <Suspense fallback={<Loading />}>
            <ScheduleDataLoader />
        </Suspense>
    )
}

async function ScheduleDataLoader() {
    const user = await getUserByRole('SALE')
    if (!user) return <div className="p-8 text-center text-slate-400">No user found</div>

    const schedules = await getSchedulesByUser(user.id)

    // Also get all active leads for "create schedule" modal
    const { prisma } = await import('@/lib/prisma')
    const activeLeads = await prisma.lead.findMany({
        where: { assignedTo: user.id, status: 'ACTIVE' },
        select: { id: true, name: true, currentMilestone: true, dealValue: true },
        orderBy: { priorityScore: 'desc' },
    })

    const serializedSchedules = schedules.map(s => ({
        id: s.id,
        leadId: s.lead.id,
        leadName: s.lead.name,
        type: s.type,
        note: s.note,
        scheduledAt: s.scheduledAt.toISOString(),
        status: s.status,
        milestone: s.lead.currentMilestone,
        dealValue: s.lead.dealValue,
    }))

    const serializedLeads = activeLeads.map(l => ({
        id: l.id,
        name: l.name,
        milestone: l.currentMilestone,
        dealValue: l.dealValue,
    }))

    return (
        <ScheduleClient
            schedules={serializedSchedules}
            leads={serializedLeads}
            userId={user.id}
        />
    )
}
