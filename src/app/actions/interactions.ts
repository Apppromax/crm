'use server'

import { updateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { InteractionType } from '@prisma/client'

import { parseInteractionNote, summarizeLeadInteractions } from '@/lib/gemini'
import { CACHE_TAGS } from '@/lib/cache'

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
        select: {
            id: true,
            name: true,
            golden72hExpiresAt: true,
            assignedTo: true,
        }
    })

    if (!lead) throw new Error('Lead not found')

    const isGolden72h = lead.golden72hExpiresAt
        ? new Date() < lead.golden72hExpiresAt
        : false

    // INSTANT SAVE — no waiting for AI
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

    updateTag(CACHE_TAGS.leadDetail(data.leadId))
    if (lead.assignedTo) updateTag(CACHE_TAGS.leads(lead.assignedTo))

    // FIRE-AND-FORGET: AI processing runs in background, does NOT block the user
    processAIInBackground(data.leadId, lead.name, data.content, data.aiLabels, interaction.id)
        .catch(err => console.error('[AI Background] Error:', err))

    return interaction
}

async function processAIInBackground(
    leadId: string,
    leadName: string,
    content: string,
    existingLabels: string[] | undefined,
    interactionId: string,
) {
    // Parse note for labels
    let aiLabels: string[] = []
    let cleanContent = content

    if (!existingLabels || existingLabels.length === 0) {
        const parsed = await parseInteractionNote(content)
        if (parsed.cleanSummary) cleanContent = parsed.cleanSummary
        if (parsed.sentiment) aiLabels.push(parsed.sentiment)
        if (parsed.actionItems && parsed.actionItems.length > 0) {
            aiLabels.push(...parsed.actionItems.map((a: string) => `TODO: ${a}`))
        }
    }

    // Fetch recent interactions for summary
    const recentInteractions = await prisma.interaction.findMany({
        where: { leadId },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { createdAt: true, type: true, content: true },
    })

    const history = recentInteractions.map(i => ({
        date: i.createdAt.toISOString(),
        type: i.type,
        content: i.content,
    }))

    const newSummary = await summarizeLeadInteractions(leadName, history)

    // Update with AI results
    await prisma.$transaction([
        prisma.interaction.update({
            where: { id: interactionId },
            data: {
                content: cleanContent,
                aiLabels: aiLabels.length > 0 ? aiLabels : undefined,
            },
        }),
        prisma.lead.update({
            where: { id: leadId },
            data: { aiSummary: newSummary },
        }),
    ])
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
