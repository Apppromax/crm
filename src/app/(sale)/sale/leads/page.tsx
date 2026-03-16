import { Suspense } from 'react'
import { getLeadsByUser } from '@/app/actions/leads'
import { getUserByRole } from '@/app/actions/users'
import { LeadsListClient } from './leads-list-client'
import Loading from '@/app/(sale)/loading'

export default function MyLeadsPage() {
    return (
        <Suspense fallback={<Loading />}>
            <LeadsDataLoader />
        </Suspense>
    )
}

async function LeadsDataLoader() {
    const user = await getUserByRole('SALE')
    if (!user) return <div className="p-8 text-center text-slate-400">No sale user found</div>

    const dbLeads = await getLeadsByUser(user.id)

    const leads = dbLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        source: lead.source?.name || 'Unknown',
        currentMilestone: lead.currentMilestone,
        heatScore: lead.heatScore,
        status: lead.status,
        dealValue: lead.dealValue,
        lastInteractionAt: lead.lastInteractionAt ? (typeof lead.lastInteractionAt === 'string' ? lead.lastInteractionAt : lead.lastInteractionAt.toISOString()) : null,
        interactionCount: lead._count.interactions,
    }))

    return <LeadsListClient leads={leads} />
}
