'use server'

import { prisma } from '@/lib/prisma'
import { revalidateTag } from 'next/cache'

export async function getNotifications(userId: string, limit = 20) {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
    })
}

export async function getUnreadCount(userId: string) {
    return prisma.notification.count({
        where: { userId, read: false },
    })
}

export async function markNotificationRead(notificationId: string) {
    await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
    })
    revalidateTag('notifications' as any, undefined as any)
}

export async function markAllNotificationsRead(userId: string) {
    await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
    })
    revalidateTag('notifications' as any, undefined as any)
}

export async function createNotification(data: {
    userId: string
    type: 'SOS' | 'MILESTONE' | 'ADVICE' | 'SCHEDULE' | 'SYSTEM'
    title: string
    message: string
    leadId?: string
}) {
    const notif = await prisma.notification.create({
        data: {
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            leadId: data.leadId,
        },
    })
    revalidateTag('notifications' as any, undefined as any)
    return notif
}
