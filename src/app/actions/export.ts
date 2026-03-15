'use server'

import { prisma } from '@/lib/prisma'
import { getUserByRole } from '@/app/actions/users'

export async function exportLeadsToCSV() {
    // Authenticate
    const user = await getUserByRole('CEO')
    if (!user || user.role !== 'CEO') {
        throw new Error('Unauthorized')
    }

    // Fetch all leads for CEO's org
    const leads = await prisma.lead.findMany({
        where: { orgId: user.orgId },
        include: {
            assignee: { select: { name: true } }
        },
        orderBy: { currentMilestone: 'desc' }
    })

    // CSV Header
    const headers = [
        'ID',
        'Tên Khách Hàng',
        'SĐT',
        'Sale Phụ Trách',
        'Trạng Thái',
        'Mốc Hiện Tại',
        'Giá Trị (VNĐ)',
        'Điểm Nóng',
        'Ngày Tạo'
    ].join(',')

    // CSV Rows
    const rows = leads.map(l => {
        return [
            `"${l.id}"`,
            `"${l.name.replace(/"/g, '""')}"`,
            `"${l.phoneHash || ''}"`,
            `"${l.assignee?.name || 'Chưa gán'}"`,
            `"${l.status}"`,
            `"${l.currentMilestone}"`,
            `"${l.dealValue || 0}"`,
            `"${l.heatScore}"`,
            `"${l.createdAt.toISOString()}"`
        ].join(',')
    })

    return [headers, ...rows].join('\n')
}
