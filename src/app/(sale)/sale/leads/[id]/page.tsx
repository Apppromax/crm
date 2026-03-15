import { Suspense } from 'react'
import { getLeadDetail } from '@/app/actions/leads'
import { getUserByRole } from '@/app/actions/users'
import { MOCK_AI_COACH } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import { LeadDetailClient } from '@/components/sale/lead-detail-client'
import Loading from '@/app/(sale)/loading'

interface Props {
    params: Promise<{ id: string }>
}

export default function LeadDetailWrapper({ params }: Props) {
    return (
        <Suspense fallback={<Loading />}>
            <LeadDetailPage params={params} />
        </Suspense>
    )
}

async function LeadDetailPage({ params }: Props) {
    const { id } = await params

    const [dbLead, user] = await Promise.all([
        getLeadDetail(id),
        getUserByRole('SALE'),
    ])

    if (!dbLead) notFound()
    if (!user) return <div className="p-8 text-center text-slate-400">No user found</div>

    const lead = {
        id: dbLead.id,
        name: dbLead.name,
        phone: dbLead.phoneEncrypted.replace('enc_', ''),
        source: dbLead.source?.name || 'Unknown',
        currentMilestone: dbLead.currentMilestone,
        heatScore: dbLead.heatScore,
        priorityScore: dbLead.priorityScore,
        bantBudget: dbLead.bantBudget,
        bantAuthority: dbLead.bantAuthority,
        bantNeed: dbLead.bantNeed,
        bantTimeline: dbLead.bantTimeline,
        dealValue: dbLead.dealValue,
        golden72hExpiresAt: dbLead.golden72hExpiresAt,
        lastInteractionAt: dbLead.lastInteractionAt,
        snoozeUntil: dbLead.snoozeUntil,
        zaloConnected: dbLead.zaloConnected,
        consecutiveMissCount: dbLead.consecutiveMissCount,
        createdAt: dbLead.createdAt,
        managerAdvice: dbLead.advices[0]?.content || null,
        assigneeId: dbLead.assignee?.id,
        interactions: dbLead.interactions.map(i => ({
            id: i.id,
            type: i.type,
            content: i.content,
            aiLabels: i.aiLabels,
            isGolden72h: i.isGolden72h,
            createdAt: i.createdAt,
        })),
        milestoneHistory: dbLead.milestoneHistory.map(m => ({
            id: m.id,
            fromMilestone: m.fromMilestone,
            toMilestone: m.toMilestone,
            note: m.note,
            changedAt: m.changedAt,
        })),
    }

    const aiCoach = MOCK_AI_COACH[lead.currentMilestone] || MOCK_AI_COACH[1]

    return <LeadDetailClient lead={lead as any} aiCoach={aiCoach} userId={user.id} />
}
