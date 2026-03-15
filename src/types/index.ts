import type {
    UserRole,
    LeadStatus,
    BANTLevel,
    InteractionType,
    SOSType,
    SOSSeverity,
    SOSStatus,
    ScheduleType,
    ScheduleStatus,
} from '@prisma/client'

// ============================================
// USER TYPES
// ============================================

export type { UserRole }

export interface UserProfile {
    id: string
    name: string
    email: string
    phone?: string | null
    avatar?: string | null
    role: UserRole
    teamId?: string | null
    orgId: string
    streakCount: number
    isActive: boolean
}

// ============================================
// LEAD TYPES
// ============================================

export type { LeadStatus, BANTLevel }

export interface LeadCard {
    id: string
    name: string
    currentMilestone: number
    heatScore: number
    priorityScore: number
    priorityReason?: string
    dealValue?: number | null
    status: LeadStatus
    snoozeUntil?: Date | null
    golden72hExpiresAt?: Date | null
    lastInteractionAt?: Date | null
    aiSummary?: string | null
    bantBudget: BANTLevel
    bantNeed?: string | null
    consecutiveMissCount: number
    hasManagerAdvice?: boolean
    nextSchedule?: {
        scheduledAt: Date
        type: ScheduleType
    } | null
}

export interface LeadDetail extends LeadCard {
    phoneEncrypted: string
    email?: string | null
    zaloConnected: boolean
    bantAuthority: BANTLevel
    bantTimeline: BANTLevel
    source?: { id: string; name: string } | null
    assignee?: { id: string; name: string; avatar?: string | null } | null
    teamId?: string | null
}

export interface LeadCreateInput {
    name: string
    phone: string
    email?: string
    sourceId?: string
    dealValue?: number
    note?: string
}

// ============================================
// INTERACTION TYPES
// ============================================

export type { InteractionType }

export interface InteractionEntry {
    id: string
    type: InteractionType
    content: string
    rawVoiceText?: string | null
    aiLabels: string[]
    isGolden72h: boolean
    createdAt: Date
    user: {
        id: string
        name: string
        avatar?: string | null
    }
}

// ============================================
// MILESTONE TYPES
// ============================================

export interface MilestoneHistoryEntry {
    id: string
    fromMilestone: number
    toMilestone: number
    reason: string
    note?: string | null
    changedAt: Date
    user: {
        id: string
        name: string
    }
}

// ============================================
// SOS TYPES
// ============================================

export type { SOSType, SOSSeverity, SOSStatus }

export interface SOSAlertItem {
    id: string
    type: SOSType
    severity: SOSSeverity
    status: SOSStatus
    message: string
    createdAt: Date
    lead: {
        id: string
        name: string
        currentMilestone: number
        heatScore: number
        assignee?: { id: string; name: string } | null
    }
}

// ============================================
// DASHBOARD TYPES
// ============================================

export type TeamHeatmapStatus = 'GREEN' | 'YELLOW' | 'RED'

export interface TeamHeatmapData {
    teamId: string
    teamName: string
    status: TeamHeatmapStatus
    complianceRate: number
    activeLeads: number
    overdueLeads: number
    atRiskDeals: number
}

export interface RevenuePulseData {
    actual: number
    pipelineValue: number
    confidenceScore: number
    target: number
    achievementRate: number
}

export interface StreakEntry {
    userId: string
    name: string
    avatar?: string | null
    streakCount: number
    badge: 'fire' | 'lightning' | 'star' | 'none'
}

// ============================================
// SCHEDULE TYPES
// ============================================

export type { ScheduleType, ScheduleStatus }

export interface ScheduleItem {
    id: string
    leadId: string
    type: ScheduleType
    scheduledAt: Date
    status: ScheduleStatus
    note?: string | null
    lead: {
        name: string
        currentMilestone: number
    }
}

// ============================================
// API RESPONSE
// ============================================

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
        statusCode: number
    }
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
