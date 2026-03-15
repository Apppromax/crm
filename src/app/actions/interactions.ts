'use server'

import { prisma } from '@/lib/prisma'
import type { InteractionType } from '@prisma/client'

export async function createInteraction(data: {
    leadId: string
    userId: string
    type: InteractionType
    content: string
    rawVoiceText?: string
    aiLabels?: string[]
}) {
    const lead = await prisma.lead.findUnique({ where: { id: data.leadId } })
    if (!lead) throw new Error('Lead not found')

    const isGolden72h = lead.golden72hExpiresAt
        ? new Date() < lead.golden72hExpiresAt
        : false

    const [interaction] = await prisma.$transaction([
        prisma.interaction.create({
            data: {
                leadId: data.leadId,
                userId: data.userId,
                type: data.type,
                content: data.content,
                rawVoiceText: data.rawVoiceText,
                aiLabels: data.aiLabels || [],
                isGolden72h,
            },
        }),
        prisma.lead.update({
            where: { id: data.leadId },
            data: {
                lastInteractionAt: new Date(),
                consecutiveMissCount: 0,
            },
        }),
    ])

    return interaction
}

export async function getInteractionsByLead(leadId: string) {
    return prisma.interaction.findMany({
        where: { leadId },
        include: {
            user: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
    })
}
