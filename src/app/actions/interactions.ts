'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { InteractionType } from '@prisma/client'

import { parseInteractionNote, summarizeLeadInteractions } from '@/lib/gemini'

export async function createInteraction(data: {
    leadId: string
    userId: string
    type: InteractionType
    content: string
    rawVoiceText?: string
    aiLabels?: string[]
}) {
    const lead = await prisma.lead.findUnique({
        where: { id: data.leadId },
        include: { interactions: { orderBy: { createdAt: 'desc' }, take: 5 } }
    })

    if (!lead) throw new Error('Lead not found')

    const isGolden72h = lead.golden72hExpiresAt
        ? new Date() < lead.golden72hExpiresAt
        : false

    // AI Processing
    let finalLabels = data.aiLabels || []
    let finalContent = data.content

    if (!data.aiLabels || data.aiLabels.length === 0) {
        const parsed = await parseInteractionNote(data.content)
        if (parsed.cleanSummary) finalContent = parsed.cleanSummary
        if (parsed.sentiment) finalLabels.push(parsed.sentiment)
        if (parsed.actionItems && parsed.actionItems.length > 0) {
            finalLabels.push(...parsed.actionItems.map((a: string) => `TODO: ${a}`))
        }
    }

    // Combine history for summary
    const history = lead.interactions.map(i => ({
        date: i.createdAt.toISOString(),
        type: i.type,
        content: i.content
    }))
    history.unshift({
        date: new Date().toISOString(),
        type: data.type,
        content: finalContent
    })

    const newSummary = await summarizeLeadInteractions(lead.name, history)

    const [interaction] = await prisma.$transaction([
        prisma.interaction.create({
            data: {
                leadId: data.leadId,
                userId: data.userId,
                type: data.type,
                content: finalContent,
                rawVoiceText: data.rawVoiceText,
                aiLabels: finalLabels,
                isGolden72h,
            },
        }),
        prisma.lead.update({
            where: { id: data.leadId },
            data: {
                lastInteractionAt: new Date(),
                consecutiveMissCount: 0,
                aiSummary: newSummary,
            },
        }),
    ])

    revalidatePath('/sale')
    revalidatePath(`/sale/leads/${data.leadId}`)
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
