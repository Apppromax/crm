import { Suspense } from 'react'
import { getTopPriorityLeads } from '@/app/actions/leads'
import { getUserByRole, getUserStats } from '@/app/actions/users'
import { SaleHomeClient } from './home-client'
import { RealtimeListener } from '@/components/realtime-listener'
import Loading from '../loading'

function determinePriorityReason(lead: any): 'golden_72h' | 'schedule_due' | 'retry' | 'hot_lead' | 'manager_advice' {
    if (lead.golden72hExpiresAt && new Date(lead.golden72hExpiresAt) > new Date()) return 'golden_72h'
    if (lead.heatScore >= 70) return 'hot_lead'
    if (lead.consecutiveMissCount > 0) return 'retry'
    return 'hot_lead'
}

export default function SaleHomePage() {
    return (
        <Suspense fallback={<Loading />}>
            <SaleHomeDataLoader />
        </Suspense>
    )
}

async function SaleHomeDataLoader() {
    const user = await getUserByRole('SALE')
    if (!user) return <div className="p-8 text-center text-slate-400">No sale user found</div>

    const [leads, stats] = await Promise.all([
        getTopPriorityLeads(user.id, 3),
        getUserStats(user.id),
    ])

    const topCards = leads.map(lead => ({
        id: lead.id,
        name: lead.name,
        currentMilestone: lead.currentMilestone,
        heatScore: lead.heatScore,
        priorityScore: lead.priorityScore,
        priorityReason: determinePriorityReason(lead),
        dealValue: lead.dealValue,
        aiSummary: lead.aiSummary,
        bantBudget: lead.bantBudget,
        consecutiveMissCount: lead.consecutiveMissCount,
        hasManagerAdvice: false,
        nextSchedule: null,
    }))

    return (
        <>
            <RealtimeListener table="leads" userId={user.id} />
            <SaleHomeClient
                topCards={topCards}
                stats={{
                    totalLeads: stats.activeLeads,
                    milestone45: stats.milestone45,
                    streakCount: stats.streak,
                    pipelineValue: stats.pipelineValue,
                }}
            />
        </>
    )
}
