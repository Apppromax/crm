// ============================================
// CRM Pro V2 — Mock Data (Development Only)
// Replace with Prisma queries when DB is ready
// ============================================

export interface MockLead {
    id: string
    name: string
    phone: string
    email: string | null
    currentMilestone: number
    status: 'ACTIVE' | 'POOL' | 'ARCHIVED' | 'WON' | 'LOST'
    heatScore: number
    priorityScore: number
    priorityReason: 'golden_72h' | 'schedule_due' | 'retry' | 'hot_lead' | 'manager_advice'
    dealValue: number | null
    bantBudget: string
    bantAuthority: string
    bantNeed: string | null
    bantTimeline: string
    aiSummary: string | null
    zaloConnected: boolean
    consecutiveMissCount: number
    hasManagerAdvice: boolean
    golden72hExpiresAt: Date | null
    snoozeUntil: Date | null
    lastInteractionAt: Date | null
    createdAt: Date
    source: string
    assigneeName: string
    teamId: string
    interactions: MockInteraction[]
    milestoneHistory: MockMilestoneHistory[]
    nextSchedule: { scheduledAt: Date; type: string } | null
    managerAdvice: string | null
}

export interface MockInteraction {
    id: string
    type: 'CALL' | 'ZALO_CHAT' | 'MEETING' | 'NOTE' | 'VOICE_NOTE' | 'SYSTEM'
    content: string
    aiLabels: string[]
    isGolden72h: boolean
    createdAt: Date
    userName: string
}

export interface MockMilestoneHistory {
    id: string
    fromMilestone: number
    toMilestone: number
    reason: string
    note: string | null
    changedAt: Date
    userName: string
}

const now = new Date()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000)
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000)
const hoursLater = (h: number) => new Date(now.getTime() + h * 3600000)

export const MOCK_LEADS: MockLead[] = [
    {
        id: 'lead-001',
        name: 'Trần Thị Bảo Ngọc',
        phone: '0901234567',
        email: 'ngoc.ttb@gmail.com',
        currentMilestone: 3,
        status: 'ACTIVE',
        heatScore: 75,
        priorityScore: 95,
        priorityReason: 'golden_72h',
        dealValue: 3_500_000_000,
        bantBudget: 'HIGH',
        bantAuthority: 'HIGH',
        bantNeed: 'Ở thật, căn 2PN tầng cao view sông',
        bantTimeline: 'MEDIUM',
        aiSummary: '2 lần gọi, kết bạn Zalo, quan tâm 2PN tầng cao',
        zaloConnected: true,
        consecutiveMissCount: 0,
        hasManagerAdvice: true,
        golden72hExpiresAt: hoursLater(24),
        snoozeUntil: null,
        lastInteractionAt: hoursAgo(3),
        createdAt: daysAgo(2),
        source: 'Facebook Ads',
        assigneeName: 'Nguyễn Văn A',
        teamId: 'team-alpha',
        managerAdvice: 'Khách này phải chốt trong tuần. Mời xem nhà mẫu thứ 7. Nhấn mạnh chính sách trả góp 0%.',
        nextSchedule: { scheduledAt: hoursLater(2), type: 'FOLLOW_UP' },
        interactions: [
            {
                id: 'int-001',
                type: 'CALL',
                content: 'Gọi điện lần 2. Khách quan tâm căn A-1502 (2PN, 85m², tầng 15). Hỏi về chính sách vay NH, ngân sách khoảng 3-3.5 tỷ. Đã kết bạn Zalo để gửi brochure.',
                aiLabels: ['Tài chính', 'Nhu cầu', 'Niềm tin'],
                isGolden72h: true,
                createdAt: hoursAgo(3),
                userName: 'Nguyễn Văn A',
            },
            {
                id: 'int-002',
                type: 'ZALO_CHAT',
                content: 'Chat Zalo gửi brochure căn A-1502 và bảng giá. Khách reply "cảm ơn em, để chị xem". Chia sẻ muốn mua để ở thật cho gia đình.',
                aiLabels: ['Niềm tin', 'Nhu cầu'],
                isGolden72h: true,
                createdAt: hoursAgo(26),
                userName: 'Nguyễn Văn A',
            },
            {
                id: 'int-003',
                type: 'CALL',
                content: 'Gọi lần đầu. Khách lấy info từ FB. Quan tâm dự án, hỏi giá tổng và vị trí. Giọng nói nhẹ nhàng, lắng nghe kỹ.',
                aiLabels: ['Nhu cầu'],
                isGolden72h: true,
                createdAt: daysAgo(2),
                userName: 'Nguyễn Văn A',
            },
        ],
        milestoneHistory: [
            { id: 'mh-001', fromMilestone: 1, toMilestone: 2, reason: 'PROMOTION', note: 'Khách phản hồi tích cực về brochure', changedAt: hoursAgo(26), userName: 'Nguyễn Văn A' },
            { id: 'mh-002', fromMilestone: 2, toMilestone: 3, reason: 'PROMOTION', note: 'Kết bạn Zalo, chia sẻ lý do mua thật', changedAt: hoursAgo(3), userName: 'Nguyễn Văn A' },
        ],
    },
    {
        id: 'lead-002',
        name: 'Nguyễn Văn Đức',
        phone: '0912345678',
        email: 'duc.nv@gmail.com',
        currentMilestone: 2,
        status: 'ACTIVE',
        heatScore: 55,
        priorityScore: 88,
        priorityReason: 'schedule_due',
        dealValue: 5_000_000_000,
        bantBudget: 'VERY_HIGH',
        bantAuthority: 'HIGH',
        bantNeed: 'Đầu tư căn 3PN, cho thuê lại',
        bantTimeline: 'HIGH',
        aiSummary: 'Nhà đầu tư, ngân sách 5 tỷ, cần tính ROI',
        zaloConnected: false,
        consecutiveMissCount: 0,
        hasManagerAdvice: false,
        golden72hExpiresAt: null,
        snoozeUntil: null,
        lastInteractionAt: daysAgo(1),
        createdAt: daysAgo(5),
        source: 'Website',
        assigneeName: 'Nguyễn Văn A',
        teamId: 'team-alpha',
        managerAdvice: null,
        nextSchedule: { scheduledAt: hoursLater(1), type: 'FOLLOW_UP' },
        interactions: [
            {
                id: 'int-010',
                type: 'CALL',
                content: 'Gọi tư vấn. Khách là nhà đầu tư có kinh nghiệm, quan tâm căn 3PN để cho thuê. Hỏi về tỉ suất cho thuê khu vực.',
                aiLabels: ['Tài chính', 'Nhu cầu'],
                isGolden72h: false,
                createdAt: daysAgo(1),
                userName: 'Nguyễn Văn A',
            },
            {
                id: 'int-011',
                type: 'NOTE',
                content: 'Lead từ website, điền form hỏi giá căn 3PN.',
                aiLabels: ['Nhu cầu'],
                isGolden72h: false,
                createdAt: daysAgo(5),
                userName: 'Nguyễn Văn A',
            },
        ],
        milestoneHistory: [
            { id: 'mh-010', fromMilestone: 1, toMilestone: 2, reason: 'PROMOTION', note: 'Khách phản hồi tốt về phương án đầu tư', changedAt: daysAgo(1), userName: 'Nguyễn Văn A' },
        ],
    },
    {
        id: 'lead-003',
        name: 'Lê Thị Hương',
        phone: '0923456789',
        email: null,
        currentMilestone: 1,
        status: 'ACTIVE',
        heatScore: 30,
        priorityScore: 70,
        priorityReason: 'retry',
        dealValue: null,
        bantBudget: 'UNKNOWN',
        bantAuthority: 'UNKNOWN',
        bantNeed: null,
        bantTimeline: 'UNKNOWN',
        aiSummary: 'Lead mới, chưa liên lạc được lần 1',
        zaloConnected: false,
        consecutiveMissCount: 1,
        hasManagerAdvice: false,
        golden72hExpiresAt: hoursLater(48),
        snoozeUntil: null,
        lastInteractionAt: hoursAgo(4),
        createdAt: daysAgo(1),
        source: 'Referral',
        assigneeName: 'Nguyễn Văn A',
        teamId: 'team-alpha',
        managerAdvice: null,
        nextSchedule: null,
        interactions: [
            {
                id: 'int-020',
                type: 'SYSTEM',
                content: 'Nhấn "Chưa liên lạc được". Snooze 30 phút.',
                aiLabels: [],
                isGolden72h: true,
                createdAt: hoursAgo(4),
                userName: 'Nguyễn Văn A',
            },
        ],
        milestoneHistory: [],
    },
    {
        id: 'lead-004',
        name: 'Phạm Minh Tuấn',
        phone: '0934567890',
        email: 'tuan.pm@outlook.com',
        currentMilestone: 4,
        status: 'ACTIVE',
        heatScore: 90,
        priorityScore: 65,
        priorityReason: 'hot_lead',
        dealValue: 4_200_000_000,
        bantBudget: 'HIGH',
        bantAuthority: 'HIGH',
        bantNeed: 'Ở thật, căn 2PN+1 có phòng làm việc',
        bantTimeline: 'HIGH',
        aiSummary: 'Đã gặp mặt, tính bảng dòng tiền, sắp chốt',
        zaloConnected: true,
        consecutiveMissCount: 0,
        hasManagerAdvice: false,
        golden72hExpiresAt: null,
        snoozeUntil: null,
        lastInteractionAt: daysAgo(1),
        createdAt: daysAgo(14),
        source: 'Facebook Ads',
        assigneeName: 'Nguyễn Văn A',
        teamId: 'team-alpha',
        managerAdvice: null,
        nextSchedule: { scheduledAt: hoursLater(5), type: 'MEETING' },
        interactions: [
            {
                id: 'int-030',
                type: 'MEETING',
                content: 'Gặp mặt tại showroom. Khách rất thích căn B-2103. Đã tính bảng dòng tiền theo phương án vay 70% NH. Hẹn gặp lại thứ 7 để ký booking.',
                aiLabels: ['Tài chính', 'Nhu cầu', 'Niềm tin'],
                isGolden72h: false,
                createdAt: daysAgo(1),
                userName: 'Nguyễn Văn A',
            },
        ],
        milestoneHistory: [
            { id: 'mh-030', fromMilestone: 1, toMilestone: 2, reason: 'PROMOTION', note: null, changedAt: daysAgo(12), userName: 'Nguyễn Văn A' },
            { id: 'mh-031', fromMilestone: 2, toMilestone: 3, reason: 'PROMOTION', note: 'Kết bạn Zalo, gửi CMND', changedAt: daysAgo(7), userName: 'Nguyễn Văn A' },
            { id: 'mh-032', fromMilestone: 3, toMilestone: 4, reason: 'PROMOTION', note: 'Gặp mặt, tính dòng tiền', changedAt: daysAgo(1), userName: 'Nguyễn Văn A' },
        ],
    },
    {
        id: 'lead-005',
        name: 'Võ Thanh Hà',
        phone: '0945678901',
        email: 'ha.vt@gmail.com',
        currentMilestone: 5,
        status: 'WON',
        heatScore: 100,
        priorityScore: 0,
        priorityReason: 'hot_lead',
        dealValue: 6_800_000_000,
        bantBudget: 'VERY_HIGH',
        bantAuthority: 'HIGH',
        bantNeed: 'Penthouse cho gia đình',
        bantTimeline: 'HIGH',
        aiSummary: 'Đã chốt cọc 200tr ngày 10/3. Ký HĐMB tuần sau.',
        zaloConnected: true,
        consecutiveMissCount: 0,
        hasManagerAdvice: false,
        golden72hExpiresAt: null,
        snoozeUntil: null,
        lastInteractionAt: daysAgo(4),
        createdAt: daysAgo(30),
        source: 'Referral',
        assigneeName: 'Nguyễn Văn A',
        teamId: 'team-alpha',
        managerAdvice: null,
        nextSchedule: null,
        interactions: [],
        milestoneHistory: [
            { id: 'mh-040', fromMilestone: 4, toMilestone: 5, reason: 'PROMOTION', note: 'Chốt cọc 200 triệu', changedAt: daysAgo(4), userName: 'Nguyễn Văn A' },
        ],
    },
    {
        id: 'lead-006',
        name: 'Đặng Quốc Bảo',
        phone: '0956789012',
        email: null,
        currentMilestone: 3,
        status: 'ACTIVE',
        heatScore: 45,
        priorityScore: 40,
        priorityReason: 'hot_lead',
        dealValue: 2_800_000_000,
        bantBudget: 'MEDIUM',
        bantAuthority: 'MEDIUM',
        bantNeed: 'Căn 1PN+1 cho vợ chồng trẻ',
        bantTimeline: 'LOW',
        aiSummary: 'Quan tâm nhưng cần bàn bạc thêm với vợ',
        zaloConnected: true,
        consecutiveMissCount: 0,
        hasManagerAdvice: false,
        golden72hExpiresAt: null,
        snoozeUntil: hoursLater(12),
        lastInteractionAt: daysAgo(3),
        createdAt: daysAgo(10),
        source: 'Cold Call',
        assigneeName: 'Nguyễn Văn A',
        teamId: 'team-alpha',
        managerAdvice: null,
        nextSchedule: { scheduledAt: hoursLater(12), type: 'FOLLOW_UP' },
        interactions: [],
        milestoneHistory: [],
    },
]

export const MOCK_USER = {
    id: 'user-001',
    name: 'Nguyễn Văn A',
    email: 'a.nv@crmpro.vn',
    role: 'SALE' as const,
    avatar: null,
    teamId: 'team-alpha',
    orgId: 'org-001',
    streakCount: 5,
}

export const MOCK_STATS = {
    totalLeads: MOCK_LEADS.filter(l => l.status === 'ACTIVE').length,
    milestone45: MOCK_LEADS.filter(l => l.currentMilestone >= 4 && l.status === 'ACTIVE').length,
    streakCount: 5,
    wonThisMonth: MOCK_LEADS.filter(l => l.status === 'WON').length,
    pipelineValue: MOCK_LEADS.filter(l => l.status === 'ACTIVE' && l.dealValue).reduce((sum, l) => sum + (l.dealValue || 0), 0),
}

// AI Coach mock responses per milestone
export const MOCK_AI_COACH: Record<number, { tip: string; objection: string; signal: string }> = {
    1: {
        tip: 'Hãy hỏi khách về nhu cầu cụ thể: diện tích, số phòng, tầng mong muốn. Điều này giúp xác định tài chính sơ bộ.',
        objection: 'Nếu khách nói "gửi thông tin qua email thôi": Hãy gợi ý gọi nhanh 2 phút để tư vấn đúng sản phẩm, tránh spam.',
        signal: 'Khách có trả lời câu hỏi về ngân sách hoặc thời gian mua chưa?',
    },
    2: {
        tip: 'Gợi ý khách xem căn tầng cao hơn budget để đo phản ứng tài chính thật.',
        objection: 'Nếu khách chê "xa trung tâm": Nhấn mạnh hạ tầng đang xây (metro, đường), giá sẽ tăng 20-30% khi hoàn thiện.',
        signal: 'Khách có phản hồi cụ thể (Khen/Chê/Hỏi thêm) về phương án sản phẩm chưa?',
    },
    3: {
        tip: 'Khách đã tin tưởng. Đây là lúc mời gặp trực tiếp hoặc tính bảng dòng tiền cụ thể.',
        objection: 'Nếu khách trì hoãn gặp mặt: Gợi ý "Anh/chị ghé xem nhà mẫu 15 phút tiện đường, em book lịch sẵn rồi".',
        signal: 'Khách đã đồng ý gặp mặt hoặc yêu cầu tính phương án tài chính chi tiết chưa?',
    },
    4: {
        tip: 'Khách gần chốt rồi! Tạo urgency: "Căn này chỉ còn 2 suất cuối" hoặc "Chính sách ưu đãi hết ngày X".',
        objection: 'Nếu khách muốn "suy nghĩ thêm": Hỏi cụ thể lo lắng gì — thường là tài chính. Đưa phương án vay linh hoạt.',
        signal: 'Khách đã xác nhận booking hoặc đặt cọc chưa?',
    },
    5: {
        tip: 'Chúc mừng! Hãy chăm sóc hậu mãi để nhận referral từ khách.',
        objection: '',
        signal: 'Đã hoàn tất booking/cọc.',
    },
}

export function getLeadById(id: string): MockLead | undefined {
    return MOCK_LEADS.find(l => l.id === id)
}

export function getActiveLeads(): MockLead[] {
    return MOCK_LEADS.filter(l => l.status === 'ACTIVE')
}

export function getTopPriorityCards(limit = 3): MockLead[] {
    return getActiveLeads()
        .filter(l => !l.snoozeUntil || new Date(l.snoozeUntil) <= new Date())
        .sort((a, b) => b.priorityScore - a.priorityScore)
        .slice(0, limit)
}
