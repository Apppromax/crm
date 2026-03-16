import { Suspense } from 'react'
import { getUserByRole } from '@/app/actions/users'
import { getSchedulesByUser } from '@/app/actions/dashboard'
import { ScheduleClient } from './schedule-client'
import Loading from '@/app/(sale)/loading'
import { getCachedActiveLeads } from '@/lib/cache'

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

    // PARALLEL fetch — no more waterfall
    const [schedules, activeLeads] = await Promise.all([
        getSchedulesByUser(user.id),
        getCachedActiveLeads(user.id),
    ])

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
