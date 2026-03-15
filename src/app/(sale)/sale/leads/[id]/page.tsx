import { getLeadDetail } from '@/app/actions/leads'
import { MOCK_AI_COACH } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import { LeadDetailClient } from '@/components/sale/lead-detail-client'

interface Props {
    params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: Props) {
    const { id } = await params

    const dbLead = await getLeadDetail(id)
    if (!dbLead) notFound()

    // Transform DB lead to the shape LeadDetailClient expects (MockLead)
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

    return <LeadDetailClient lead={lead as any} aiCoach={aiCoach} />
}
