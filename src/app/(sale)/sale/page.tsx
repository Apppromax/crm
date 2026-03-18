import { Suspense } from 'react'
import { getAllSmartQueueLeads } from '@/app/actions/leads'
import { getUserByRole, getUserStats } from '@/app/actions/users'
import { SaleHomeClient } from './home-client'
import { RealtimeListener } from '@/components/realtime-listener'
import Loading from '@/app/(sale)/loading'

function determinePriorityReason(lead: any): 'diamond' | 'hot_seat' | 'net' | 'retry' | 'golden_72h' | 'schedule_due' | 'fresh' | 'manager_advice' {
    if (lead.currentMilestone === 5) return 'diamond'
    if (lead.currentMilestone === 4) return 'hot_seat' // Vùng treo
    if (lead.status === 'RETRYING' || lead.retryCount > 0) return 'retry'
    if (lead.status === 'UNPROCESSED') return 'fresh'
    if (lead.colorBadge === 'GREEN') return 'hot_seat'
    if (lead.colorBadge === 'ORANGE') return 'net'
    if (lead.snoozeUntil && new Date(lead.snoozeUntil) <= new Date()) return 'schedule_due'
    if (lead.nextGoldenPingAt && new Date(lead.nextGoldenPingAt) <= new Date()) return 'golden_72h'
    if (lead.golden72hExpiresAt && new Date(lead.golden72hExpiresAt) > new Date()) return 'golden_72h'
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

    const [stats, allQueueLeads] = await Promise.all([
        getUserStats(user.id),
        getAllSmartQueueLeads(user.id),
    ])

    const top3Leads = allQueueLeads.slice(0, 3)
    const hiddenQueue = allQueueLeads.slice(3)

    const topCards = top3Leads.map(lead => ({
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

    const queueItems = hiddenQueue.map(lead => {
        const l = lead as any
        return {
            id: l.id,
            name: l.name,
            currentMilestone: l.currentMilestone,
            heatScore: l.heatScore,
            priorityScore: l.priorityScore,
            dealValue: l.dealValue,
            isGolden: !!(l.nextGoldenPingAt && new Date(l.nextGoldenPingAt) <= new Date()),
            isRetry: (l.retryCount ?? 0) > 0 || l.status === 'RETRYING',
            colorBadge: l.colorBadge ?? null,
            sharpnessScore: l.sharpnessScore ?? null,
            isUnprocessed: l.status === 'UNPROCESSED',
        }
    })

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
