import { Suspense } from 'react'
import { getUserByRole, getTeamMembers } from '@/app/actions/users'
import { getLeadPool } from '@/app/actions/leads'
import { LeadPoolClient } from './pool-client'
import Loading from '@/app/(manager)/loading'

export default function LeadPoolPage() {
    return (
        <Suspense fallback={<Loading />}>
            <PoolContent />
        </Suspense>
    )
}

async function PoolContent() {
    const user = await getUserByRole('MANAGER')
    if (!user) return <div className="p-8 text-center text-slate-400">No manager found</div>

    const orgId = user.org.id
    const teamId = user.team?.id || user.managedTeams?.[0]?.id

    const [poolLeads, members] = await Promise.all([
        getLeadPool(orgId),
        teamId ? getTeamMembers(teamId) : Promise.resolve([]),
    ])

    const leads = poolLeads.map(l => ({
        id: l.id,
        name: l.name,
        source: l.source?.name || 'Unknown',
        milestone: l.currentMilestone,
        heatScore: l.heatScore,
        dealValue: l.dealValue,
        previousOwner: l.assignee?.name || 'N/A',
        updatedAt: l.updatedAt.toISOString(),
    }))

    const teamMembers = members.map(m => ({
        id: m.id,
        name: m.name,
        activeLeads: m._count.assignedLeads,
    }))

    return (
        <LeadPoolClient
            leads={leads}
            teamMembers={teamMembers}
            teamId={teamId || ''}
        />
    )
}

