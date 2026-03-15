import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Seeding CRM Pro V2 database...')

    // 1. Organization
    const org = await prisma.organization.create({
        data: {
            name: 'CRM Pro Demo Corp',
            settings: {
                golden72h: true,
                antiHoarding: { maxDaysStale: 15, maxConsecutiveMiss: 3 },
                snoozeMaxPerDay: 3,
            },
        },
    })
    console.log('✅ Organization:', org.name)

    // 2. Lead Sources
    const sources = await Promise.all([
        prisma.leadSource.create({ data: { name: 'Facebook Ads' } }),
        prisma.leadSource.create({ data: { name: 'Google Ads' } }),
        prisma.leadSource.create({ data: { name: 'Website' } }),
        prisma.leadSource.create({ data: { name: 'Referral' } }),
        prisma.leadSource.create({ data: { name: 'Cold Call' } }),
    ])
    console.log('✅ Lead Sources:', sources.length)

    // 3. Team
    const team = await prisma.team.create({
        data: {
            orgId: org.id,
            name: 'Team Alpha',
        },
    })

    // 4. Users (3 roles: Director, Manager, Sale)
    const director = await prisma.user.create({
        data: {
            supabaseId: 'director-001',
            orgId: org.id,
            email: 'director@crmpro.vn',
            name: 'Nguyễn Đức Director',
            role: 'CEO',
            phone: '0900000001',
        },
    })

    const manager = await prisma.user.create({
        data: {
            supabaseId: 'manager-001',
            orgId: org.id,
            teamId: team.id,
            email: 'manager@crmpro.vn',
            name: 'Trần Văn Manager',
            role: 'MANAGER',
            phone: '0900000002',
        },
    })

    // Update team with manager
    await prisma.team.update({
        where: { id: team.id },
        data: { managerId: manager.id },
    })

    const saleA = await prisma.user.create({
        data: {
            supabaseId: 'sale-001',
            orgId: org.id,
            teamId: team.id,
            email: 'sale.a@crmpro.vn',
            name: 'Nguyễn Văn A',
            role: 'SALE',
            phone: '0900000003',
            streakCount: 5,
            streakLastDay: new Date(),
        },
    })

    const saleB = await prisma.user.create({
        data: {
            supabaseId: 'sale-002',
            orgId: org.id,
            teamId: team.id,
            email: 'sale.b@crmpro.vn',
            name: 'Trần Minh B',
            role: 'SALE',
            phone: '0900000004',
            streakCount: 2,
        },
    })

    const saleC = await prisma.user.create({
        data: {
            supabaseId: 'sale-003',
            orgId: org.id,
            teamId: team.id,
            email: 'sale.c@crmpro.vn',
            name: 'Lê Thị C',
            role: 'SALE',
            phone: '0900000005',
            streakCount: 0,
        },
    })
    console.log('✅ Users: Director, Manager, 3 Sales')

    // 5. Leads (6 leads for Sale A)
    const now = new Date()

    const lead1 = await prisma.lead.create({
        data: {
            orgId: org.id,
            assignedTo: saleA.id,
            teamId: team.id,
            sourceId: sources[0].id, // Facebook Ads
            name: 'Trần Thị Bảo Ngọc',
            phoneEncrypted: 'enc_0912345678',
            phoneHash: 'hash_0912345678',
            zaloConnected: true,
            currentMilestone: 3,
            dealValue: 3_500_000_000,
            priorityScore: 75,
            heatScore: 75,
            bantBudget: 'HIGH',
            bantAuthority: 'HIGH',
            bantNeed: 'Căn 2PN, view sông, tầng trung trở lên',
            bantTimeline: 'HIGH',
            golden72hExpiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
            lastInteractionAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        },
    })

    const lead2 = await prisma.lead.create({
        data: {
            orgId: org.id,
            assignedTo: saleA.id,
            teamId: team.id,
            sourceId: sources[3].id, // Referral
            name: 'Nguyễn Văn Đức',
            phoneEncrypted: 'enc_0908123456',
            phoneHash: 'hash_0908123456',
            currentMilestone: 2,
            dealValue: 5_000_000_000,
            priorityScore: 55,
            heatScore: 55,
            bantBudget: 'VERY_HIGH',
            bantAuthority: 'MEDIUM',
            bantNeed: 'Nhà đầu tư, ngân sách 5 tỷ, cần tính ROI',
            bantTimeline: 'MEDIUM',
            golden72hExpiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000),
            lastInteractionAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        },
    })

    const lead3 = await prisma.lead.create({
        data: {
            orgId: org.id,
            assignedTo: saleA.id,
            teamId: team.id,
            sourceId: sources[2].id, // Website
            name: 'Lê Thị Hương',
            phoneEncrypted: 'enc_0976543210',
            phoneHash: 'hash_0976543210',
            currentMilestone: 1,
            dealValue: 2_100_000_000,
            priorityScore: 30,
            heatScore: 25,
            bantBudget: 'UNKNOWN',
            bantTimeline: 'LOW',
            consecutiveMissCount: 1,
            lastInteractionAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        },
    })

    const lead4 = await prisma.lead.create({
        data: {
            orgId: org.id,
            assignedTo: saleA.id,
            teamId: team.id,
            sourceId: sources[1].id, // Google Ads
            name: 'Phạm Minh Tuấn',
            phoneEncrypted: 'enc_0932111222',
            phoneHash: 'hash_0932111222',
            zaloConnected: true,
            currentMilestone: 4,
            dealValue: 4_200_000_000,
            priorityScore: 85,
            heatScore: 85,
            bantBudget: 'VERY_HIGH',
            bantAuthority: 'HIGH',
            bantNeed: 'Đầu tư lướt sóng, cần view đẹp',
            bantTimeline: 'HIGH',
            lastInteractionAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        },
    })

    const lead5 = await prisma.lead.create({
        data: {
            orgId: org.id,
            assignedTo: saleB.id,
            teamId: team.id,
            sourceId: sources[0].id,
            name: 'Hoàng Anh Kiệt',
            phoneEncrypted: 'enc_0965432109',
            phoneHash: 'hash_0965432109',
            zaloConnected: true,
            currentMilestone: 4,
            dealValue: 8_200_000_000,
            priorityScore: 90,
            heatScore: 90,
            bantBudget: 'VERY_HIGH',
            bantAuthority: 'HIGH',
            bantTimeline: 'HIGH',
            lastInteractionAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        },
    })

    const lead6 = await prisma.lead.create({
        data: {
            orgId: org.id,
            assignedTo: saleC.id,
            teamId: team.id,
            sourceId: sources[4].id, // Cold Call
            name: 'Đặng Thùy Linh',
            phoneEncrypted: 'enc_0945678901',
            phoneHash: 'hash_0945678901',
            currentMilestone: 1,
            dealValue: 1_800_000_000,
            priorityScore: 20,
            heatScore: 15,
            bantBudget: 'LOW',
            bantTimeline: 'LOW',
            consecutiveMissCount: 3,
            status: 'POOL',
            lastInteractionAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        },
    })
    console.log('✅ Leads: 6 created')

    // 6. Interactions for Lead 1 (Bảo Ngọc)
    await prisma.interaction.createMany({
        data: [
            {
                leadId: lead1.id,
                userId: saleA.id,
                type: 'CALL',
                content: 'Gọi lần đầu. Khách lấy info từ FB. Quan tâm dự án, hỏi giá tổng và vị trí. Giọng nói nhẹ nhàng, lắng nghe kỹ.',
                aiLabels: ['Nhu cầu'],
                isGolden72h: true,
                createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
            },
            {
                leadId: lead1.id,
                userId: saleA.id,
                type: 'ZALO_CHAT',
                content: 'Chat Zalo gửi brochure căn A-1502 và bảng giá. Khách reply "cảm ơn em, để chị xem". Chia sẻ muốn mua để ở thật cho gia đình.',
                aiLabels: ['Niềm tin', 'Nhu cầu'],
                isGolden72h: true,
                createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            },
            {
                leadId: lead1.id,
                userId: saleA.id,
                type: 'CALL',
                content: 'Gọi điện lần 2. Khách quan tâm căn A-1502 (2PN, 85m², tầng 15). Hỏi về chính sách vay NH, ngân sách khoảng 3-3.5 tỷ. Đã kết bạn Zalo để gửi brochure.',
                aiLabels: ['Tài chính', 'Nhu cầu', 'Niềm tin'],
                isGolden72h: true,
                createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
            },
        ],
    })

    // Interactions for Lead 2 (Văn Đức)
    await prisma.interaction.createMany({
        data: [
            {
                leadId: lead2.id,
                userId: saleA.id,
                type: 'CALL',
                content: 'Gọi giới thiệu, khách là nhà đầu tư. Quan tâm ROI và thanh khoản. Hẹn gửi bảng tính dòng tiền.',
                aiLabels: ['Tài chính', 'Nhu cầu'],
                createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000),
            },
            {
                leadId: lead2.id,
                userId: saleA.id,
                type: 'NOTE',
                content: 'Gửi email bảng tính dòng tiền. Khách chưa reply. Follow-up lại sau 2 ngày.',
                aiLabels: ['Tài chính'],
                createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
            },
        ],
    })
    console.log('✅ Interactions: seeded')

    // 7. Milestone History for Lead 1
    await prisma.milestoneHistory.createMany({
        data: [
            {
                leadId: lead1.id,
                fromMilestone: 1,
                toMilestone: 2,
                reason: 'PROMOTION',
                note: 'Khách phản hồi tích cực về brochure',
                changedBy: saleA.id,
                changedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            },
            {
                leadId: lead1.id,
                fromMilestone: 2,
                toMilestone: 3,
                reason: 'PROMOTION',
                note: 'Kết bạn Zalo, chia sẻ lý do mua thật',
                changedBy: saleA.id,
                changedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
            },
        ],
    })
    console.log('✅ Milestone History: seeded')

    // 8. Schedules
    await prisma.schedule.createMany({
        data: [
            {
                leadId: lead1.id,
                userId: saleA.id,
                type: 'MEETING',
                scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
                note: 'Xem nhà mẫu The Grand Manhattan, Q1',
            },
            {
                leadId: lead2.id,
                userId: saleA.id,
                type: 'FOLLOW_UP',
                scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
                note: 'Gọi follow-up phương án tài chính',
            },
            {
                leadId: lead4.id,
                userId: saleA.id,
                type: 'MEETING',
                scheduledAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
                note: 'Gặp mặt bàn hợp đồng, VP công ty',
                status: 'OVERDUE',
            },
        ],
    })
    console.log('✅ Schedules: seeded')

    // 9. SOS Alerts
    await prisma.sOSAlert.createMany({
        data: [
            {
                leadId: lead4.id,
                type: 'HOT_NOT_CLOSED',
                severity: 'CRITICAL',
                message: 'Deal 4.2 tỷ ở Mốc 4 — 5 ngày không tương tác. Lịch hẹn bị hủy 2 lần.',
            },
            {
                leadId: lead6.id,
                type: 'STUCK_MILESTONE',
                severity: 'WARNING',
                message: 'Lead bị stuck ở Mốc 1 — 15 ngày, 3 lần gọi nhỡ liên tiếp.',
            },
        ],
    })
    console.log('✅ SOS Alerts: seeded')

    // 10. Manager Advice
    await prisma.managerAdvice.create({
        data: {
            leadId: lead1.id,
            fromUserId: manager.id,
            toUserId: saleA.id,
            content: 'Chốt trong tuần. Push mạnh — mời xem nhà mẫu.',
        },
    })
    console.log('✅ Manager Advice: seeded')

    // 11. Daily Metrics
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    await prisma.dailyMetrics.create({
        data: {
            orgId: org.id,
            teamId: team.id,
            userId: saleA.id,
            date: yesterday,
            newLeads: 2,
            processedLeads: 5,
            golden72hCompliance: 0.92,
            promotions: 1,
            closedWon: 0,
            revenueActual: 0,
            pipelineValue: 12_700_000_000,
            totalInteractions: 8,
            streakCompleted: true,
        },
    })
    console.log('✅ Daily Metrics: seeded')

    console.log('\n🎉 Seed complete! Database ready.')
    console.log(`   Organization: ${org.id}`)
    console.log(`   Director: ${director.id} (${director.email})`)
    console.log(`   Manager: ${manager.id} (${manager.email})`)
    console.log(`   Sale A: ${saleA.id} (${saleA.email})`)
    console.log(`   Sale B: ${saleB.id} (${saleB.email})`)
    console.log(`   Sale C: ${saleC.id} (${saleC.email})`)
    console.log(`   Leads: ${[lead1, lead2, lead3, lead4, lead5, lead6].length}`)
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
