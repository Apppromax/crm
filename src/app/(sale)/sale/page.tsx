import { Suspense } from 'react'
import { getTopPriorityLeads, getQueueLeads } from '@/app/actions/leads'
import { getUserByRole, getUserStats } from '@/app/actions/users'
import { SaleHomeClient } from './home-client'
import { RealtimeListener } from '@/components/realtime-listener'
import Loading from '@/app/(sale)/loading'

function determinePriorityReason(lead: any): 'diamond' | 'hot_seat' | 'net' | 'retry' | 'golden_72h' | 'schedule_due' | 'fresh' | 'manager_advice' {
    if (lead.currentMilestone === 5) return 'diamond'
    if (lead.currentMilestone === 4) return 'hot_seat' // Vùng treo
    if (lead.consecutiveMissCount > 0) return 'retry'
    if (lead.heatScore >= 80) return 'net'
    if (lead.snoozeUntil && new Date(lead.snoozeUntil) <= new Date()) return 'schedule_due'
    if (lead.golden72hExpiresAt && new Date(lead.golden72hExpiresAt) > new Date()) return 'golden_72h'
    if (lead.currentMilestone === 1 && (!lead._count || lead._count.interactions === 0)) return 'fresh'
    if (lead.heatScore >= 50) return 'net'
    return 'net'
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

    const [leads, stats, queueLeads] = await Promise.all([
        getTopPriorityLeads(user.id, 3),
        getUserStats(user.id),
        getQueueLeads(user.id),
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

    const queueItems = queueLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        currentMilestone: lead.currentMilestone,
        heatScore: lead.heatScore,
        priorityScore: lead.priorityScore,
        dealValue: lead.dealValue,
        isGolden: !!(lead.golden72hExpiresAt && new Date(lead.golden72hExpiresAt) > new Date()),
        isRetry: lead.consecutiveMissCount > 0,
    }))

    return (
        <>
            <RealtimeListener table="leads" userId={user.id} />
            <SaleHomeClient
                userId={user.id}
                topCards={topCards}
                queueItems={queueItems}
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
