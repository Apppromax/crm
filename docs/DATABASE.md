# CRM Pro V2 — Database Schema Design

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-03-14  
> **Cập nhật lần cuối:** 2026-03-14  
> **Trạng thái:** Draft  
> **Database:** PostgreSQL (Supabase)  
> **ORM:** Prisma  
> **Tham chiếu:** [SRS.md](./SRS.md) | [ARCHITECTURE.md](./ARCHITECTURE.md)  

---

## 1. Entity Relationship Diagram (ERD)

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Organization │◀────│      Team        │     │   Lead Source    │
│              │     │                  │     │                 │
│ id           │     │ id               │     │ id              │
│ name         │     │ org_id (FK)      │     │ name            │
│ settings     │     │ name             │     │ description     │
└──────┬───────┘     │ manager_id (FK)  │     └────────┬────────┘
       │             └────────┬─────────┘              │
       │                      │                         │
       │             ┌────────▼─────────┐              │
       │             │      User        │              │
       │             │                  │              │
       │             │ id               │              │
       └────────────▶│ org_id (FK)      │              │
                     │ team_id (FK)     │              │
                     │ role             │              │
                     │ email/phone      │              │
                     │ streak_count     │              │
                     └────────┬─────────┘              │
                              │                         │
                     ┌────────▼─────────────────────────▼──┐
                     │              Lead                     │
                     │                                       │
                     │ id                                    │
                     │ org_id (FK)                           │
                     │ assigned_to (FK → User)               │
                     │ team_id (FK)                          │
                     │ source_id (FK → LeadSource)           │
                     │ name, phone_encrypted                 │
                     │ current_milestone (1-5)               │
                     │ priority_score                        │
                     │ heat_score                            │
                     │ deal_value                            │
                     │ golden_72h_expires_at                 │
                     │ snooze_until                          │
                     │ consecutive_miss_count                │
                     │ status (active/pool/archived/won)     │
                     │ bant_budget, bant_authority...        │
                     │ ai_summary                            │
                     └───┬──────────┬────────────┬──────────┘
                         │          │            │
            ┌────────────▼──┐  ┌───▼──────┐  ┌──▼──────────────┐
            │  Interaction   │  │Milestone │  │   Schedule      │
            │                │  │ History  │  │                 │
            │ id             │  │          │  │ id              │
            │ lead_id (FK)   │  │ id       │  │ lead_id (FK)    │
            │ user_id (FK)   │  │ lead_id  │  │ user_id (FK)    │
            │ type           │  │ from     │  │ scheduled_at    │
            │ content        │  │ to       │  │ type            │
            │ raw_voice_text │  │ reason   │  │ status          │
            │ ai_labels[]    │  │ by_user  │  │ completed_at    │
            │ created_at     │  │ at       │  └─────────────────┘
            └────────────────┘  └──────────┘
                                                ┌───────────────┐
                                                │  SOS Alert    │
                                                │               │
                                                │ id            │
                                                │ lead_id (FK)  │
                                                │ type          │
                                                │ severity      │
                                                │ status        │
                                                │ resolved_by   │
                                                └───────────────┘
                                                ┌───────────────┐
                                                │ Manager Advice│
                                                │               │
                                                │ id            │
                                                │ lead_id (FK)  │
                                                │ from_user (FK)│
                                                │ to_user (FK)  │
                                                │ content       │
                                                │ voice_url     │
                                                │ is_read       │
                                                │ is_applied    │
                                                └───────────────┘
```

---

## 2. Prisma Schema

```prisma
// ============================================
// CRM Pro V2 — Prisma Schema
// ============================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================
// ENUMS
// ============================================

enum UserRole {
  SALE
  LEADER
  MANAGER
  ADMIN
  CEO
}

enum LeadStatus {
  ACTIVE       // Đang được xử lý bởi Sale
  POOL         // Trong kho chung (chưa phân bổ / bị thu hồi)
  ARCHIVED     // Đã xóa/rác
  WON          // Đã chốt cọc thành công
  LOST         // Mất deal (không quay lại)
}

enum SnoozeReason {
  UNREACHABLE_1   // 30 phút
  UNREACHABLE_2   // 2 tiếng
  UNREACHABLE_3   // 4 tiếng
  UNREACHABLE_4   // Sáng hôm sau
  UPDATED         // Đã cập nhật, chờ lịch hẹn
  AI_WARMUP       // AI gợi ý hâm nóng
}

enum InteractionType {
  CALL
  ZALO_CHAT
  MEETING
  NOTE
  VOICE_NOTE
  SYSTEM        // Tự động (anti-hoarding, milestone change...)
}

enum MilestoneChangeReason {
  PROMOTION     // Thăng hạng (Sale xác nhận)
  DEMOTION      // Rớt mốc (từ 4/5 về 3)
  AUTO_RECLAIM  // Anti-hoarding thu hồi
  REASSIGN      // Phân bổ lại
}

enum SOSType {
  HOT_NOT_CLOSED      // Khách nóng chưa chốt (Mốc 4/5 + Nét cao)
  STUCK_MILESTONE     // Khách kẹt mốc (Mốc 1/2 > 7 ngày)
  DEMOTED             // Khách rớt mốc (4/5 → 3)
  BURNOUT_RISK        // Sale có dấu hiệu burnout
}

enum SOSSeverity {
  WARNING       // 🟡
  CRITICAL      // 🔴
}

enum SOSStatus {
  ACTIVE
  ACKNOWLEDGED
  RESOLVED
  DISMISSED
}

enum BANTLevel {
  UNKNOWN
  LOW
  MEDIUM
  HIGH
  VERY_HIGH
}

enum ScheduleType {
  FOLLOW_UP         // Lịch hẹn follow-up
  MEETING           // Gặp trực tiếp
  GOLDEN_72H        // Tương tác bắt buộc 72h
  AI_WARMUP         // AI gợi ý
}

enum ScheduleStatus {
  PENDING
  COMPLETED
  OVERDUE
  CANCELLED
}

// ============================================
// CORE MODELS
// ============================================

model Organization {
  id        String   @id @default(cuid())
  name      String
  settings  Json     @default("{}")  // Cấu hình phễu, KPI targets...
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  teams Team[]
  users User[]
  leads Lead[]

  @@map("organizations")
}

model Team {
  id        String   @id @default(cuid())
  orgId     String   @map("org_id")
  name      String
  managerId String?  @map("manager_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  org     Organization @relation(fields: [orgId], references: [id])
  manager User?        @relation("TeamManager", fields: [managerId], references: [id])
  members User[]       @relation("TeamMembers")
  leads   Lead[]

  @@map("teams")
}

model User {
  id            String   @id @default(cuid())
  supabaseId    String   @unique @map("supabase_id") // Link to Supabase Auth
  orgId         String   @map("org_id")
  teamId        String?  @map("team_id")
  email         String   @unique
  phone         String?
  name          String
  avatar        String?
  role          UserRole @default(SALE)
  isActive      Boolean  @default(true) @map("is_active")
  streakCount   Int      @default(0) @map("streak_count")
  streakLastDay DateTime? @map("streak_last_day") // Ngày cuối cùng hoàn thành streak
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  org            Organization    @relation(fields: [orgId], references: [id])
  team           Team?           @relation("TeamMembers", fields: [teamId], references: [id])
  managedTeams   Team[]          @relation("TeamManager")
  assignedLeads  Lead[]          @relation("AssignedTo")
  interactions   Interaction[]
  schedules      Schedule[]
  milestoneChanges MilestoneHistory[] @relation("ChangedBy")
  sentAdvices    ManagerAdvice[] @relation("AdviceFrom")
  receivedAdvices ManagerAdvice[] @relation("AdviceTo")
  resolvedSOS    SOSAlert[]      @relation("ResolvedBy")
  auditLogs      AuditLog[]

  @@index([orgId])
  @@index([teamId])
  @@index([role])
  @@map("users")
}

// ============================================
// LEAD & PIPELINE
// ============================================

model Lead {
  id                   String     @id @default(cuid())
  orgId                String     @map("org_id")
  assignedTo           String?    @map("assigned_to")
  teamId               String?    @map("team_id")
  sourceId             String?    @map("source_id")

  // Thông tin khách
  name                 String
  phoneEncrypted       String     @map("phone_encrypted") // Mã hóa SĐT
  phoneHash            String     @map("phone_hash")      // Hash để tìm kiếm trùng
  email                String?
  zaloConnected        Boolean    @default(false) @map("zalo_connected")

  // Pipeline
  currentMilestone     Int        @default(1) @map("current_milestone") // 1-5
  status               LeadStatus @default(ACTIVE)
  dealValue            Float?     @map("deal_value")      // Giá trị deal (VND)
  priorityScore        Int        @default(0) @map("priority_score")
  heatScore            Int        @default(0) @map("heat_score") // 0-100

  // BANT (AI extracted)
  bantBudget           BANTLevel  @default(UNKNOWN) @map("bant_budget")
  bantAuthority        BANTLevel  @default(UNKNOWN) @map("bant_authority")
  bantNeed             String?    @map("bant_need")       // "Ở thật", "Đầu tư"...
  bantTimeline         BANTLevel  @default(UNKNOWN) @map("bant_timeline")

  // Snooze & 72h Logic
  golden72hExpiresAt   DateTime?  @map("golden_72h_expires_at")
  snoozeUntil          DateTime?  @map("snooze_until")
  snoozeReason         SnoozeReason? @map("snooze_reason")
  consecutiveMissCount Int        @default(0) @map("consecutive_miss_count")

  // AI
  aiSummary            String?    @map("ai_summary")      // Timeline tóm tắt 1 dòng
  aiLastAnalyzed       DateTime?  @map("ai_last_analyzed")

  // Metadata
  lastInteractionAt    DateTime?  @map("last_interaction_at")
  createdAt            DateTime   @default(now()) @map("created_at")
  updatedAt            DateTime   @updatedAt @map("updated_at")

  // Relations
  org           Organization     @relation(fields: [orgId], references: [id])
  assignee      User?            @relation("AssignedTo", fields: [assignedTo], references: [id])
  team          Team?            @relation(fields: [teamId], references: [id])
  source        LeadSource?      @relation(fields: [sourceId], references: [id])
  interactions  Interaction[]
  milestoneHistory MilestoneHistory[]
  schedules     Schedule[]
  sosAlerts     SOSAlert[]
  advices       ManagerAdvice[]

  @@index([orgId, status])
  @@index([assignedTo, status])
  @@index([teamId, status])
  @@index([currentMilestone])
  @@index([priorityScore(sort: Desc)])
  @@index([golden72hExpiresAt])
  @@index([snoozeUntil])
  @@index([lastInteractionAt])
  @@index([phoneHash])
  @@map("leads")
}

model LeadSource {
  id          String   @id @default(cuid())
  name        String   // "Facebook Ads", "Referral", "Website", "Cold Call"...
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")

  leads Lead[]

  @@map("lead_sources")
}

// ============================================
// INTERACTIONS & TIMELINE
// ============================================

model Interaction {
  id           String          @id @default(cuid())
  leadId       String          @map("lead_id")
  userId       String          @map("user_id")
  type         InteractionType
  content      String          // Nội dung đã chuẩn hóa
  rawVoiceText String?         @map("raw_voice_text") // Text gốc từ voice
  voiceUrl     String?         @map("voice_url")      // URL file ghi âm (nếu lưu)
  aiLabels     String[]        @map("ai_labels")      // ["Tài chính", "Nhu cầu"]
  isGolden72h  Boolean         @default(false) @map("is_golden_72h") // Tương tác trong 72h Vàng
  createdAt    DateTime        @default(now()) @map("created_at")

  lead Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id])

  @@index([leadId, createdAt(sort: Desc)])
  @@index([userId, createdAt(sort: Desc)])
  @@index([isGolden72h])
  @@map("interactions")
}

// ============================================
// MILESTONE TRACKING
// ============================================

model MilestoneHistory {
  id            String                @id @default(cuid())
  leadId        String                @map("lead_id")
  fromMilestone Int                   @map("from_milestone")
  toMilestone   Int                   @map("to_milestone")
  reason        MilestoneChangeReason
  note          String?               // Lý do cụ thể
  changedBy     String                @map("changed_by")
  changedAt     DateTime              @default(now()) @map("changed_at")

  lead Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)
  user User  @relation("ChangedBy", fields: [changedBy], references: [id])

  @@index([leadId, changedAt(sort: Desc)])
  @@index([changedAt])
  @@index([fromMilestone, toMilestone]) // Phục vụ Sankey Diagram
  @@map("milestone_history")
}

// ============================================
// SCHEDULING
// ============================================

model Schedule {
  id          String         @id @default(cuid())
  leadId      String         @map("lead_id")
  userId      String         @map("user_id")
  type        ScheduleType
  scheduledAt DateTime       @map("scheduled_at")
  status      ScheduleStatus @default(PENDING)
  note        String?
  completedAt DateTime?      @map("completed_at")
  createdAt   DateTime       @default(now()) @map("created_at")

  lead Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id])

  @@index([userId, scheduledAt])
  @@index([status, scheduledAt])
  @@map("schedules")
}

// ============================================
// MANAGER TOOLS
// ============================================

model SOSAlert {
  id         String      @id @default(cuid())
  leadId     String      @map("lead_id")
  type       SOSType
  severity   SOSSeverity
  status     SOSStatus   @default(ACTIVE)
  message    String      // Mô tả tự động từ hệ thống
  resolvedBy String?     @map("resolved_by")
  resolvedAt DateTime?   @map("resolved_at")
  createdAt  DateTime    @default(now()) @map("created_at")

  lead     Lead  @relation(fields: [leadId], references: [id], onDelete: Cascade)
  resolver User? @relation("ResolvedBy", fields: [resolvedBy], references: [id])

  @@index([status, severity])
  @@index([createdAt(sort: Desc)])
  @@map("sos_alerts")
}

model ManagerAdvice {
  id         String   @id @default(cuid())
  leadId     String   @map("lead_id")
  fromUserId String   @map("from_user_id") // Manager
  toUserId   String   @map("to_user_id")   // Sale
  content    String
  voiceUrl   String?  @map("voice_url")
  isRead     Boolean  @default(false) @map("is_read")
  isApplied  Boolean  @default(false) @map("is_applied")
  createdAt  DateTime @default(now()) @map("created_at")

  lead     Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)
  fromUser User @relation("AdviceFrom", fields: [fromUserId], references: [id])
  toUser   User @relation("AdviceTo", fields: [toUserId], references: [id])

  @@index([toUserId, isRead])
  @@index([leadId])
  @@map("manager_advices")
}

// ============================================
// AI INSIGHTS
// ============================================

model AIInsight {
  id        String   @id @default(cuid())
  orgId     String   @map("org_id")
  type      String   // "executive_summary", "win_rate", "burnout_alert"
  data      Json     // Structured AI output
  period    String?  // "daily", "weekly", "monthly"
  validFrom DateTime @map("valid_from")
  validTo   DateTime @map("valid_to")
  createdAt DateTime @default(now()) @map("created_at")

  @@index([orgId, type, validFrom])
  @@map("ai_insights")
}

// ============================================
// ANALYTICS & AGGREGATES
// ============================================

model DailyMetrics {
  id                   String   @id @default(cuid())
  orgId                String   @map("org_id")
  teamId               String?  @map("team_id")
  userId               String?  @map("user_id")
  date                 DateTime @db.Date

  // Lead metrics
  newLeads             Int      @default(0) @map("new_leads")
  processedLeads       Int      @default(0) @map("processed_leads")
  golden72hCompliance  Float    @default(0) @map("golden_72h_compliance") // % lead xử lý trong 72h

  // Milestone metrics
  promotions           Int      @default(0)  // Số thăng hạng
  demotions            Int      @default(0)  // Số rớt mốc
  closedWon            Int      @default(0) @map("closed_won")
  closedLost           Int      @default(0) @map("closed_lost")

  // Revenue
  revenueActual        Float    @default(0) @map("revenue_actual")
  pipelineValue        Float    @default(0) @map("pipeline_value")

  // Activity
  totalInteractions    Int      @default(0) @map("total_interactions")
  streakCompleted      Boolean  @default(false) @map("streak_completed")
  antiHoardingTriggers Int      @default(0) @map("anti_hoarding_triggers")

  createdAt            DateTime @default(now()) @map("created_at")

  @@unique([orgId, teamId, userId, date])
  @@index([date])
  @@index([orgId, date])
  @@map("daily_metrics")
}

// ============================================
// SYSTEM
// ============================================

model AuditLog {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  action    String   // "lead.create", "milestone.promote", "lead.reassign"...
  entity    String   // "lead", "team", "user"
  entityId  String   @map("entity_id")
  oldData   Json?    @map("old_data")
  newData   Json?    @map("new_data")
  ipAddress String?  @map("ip_address")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@index([entity, entityId])
  @@index([userId, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
  @@map("audit_logs")
}

model SystemConfig {
  id    String @id @default(cuid())
  key   String @unique
  value Json
  note  String?

  @@map("system_configs")
}
```

---

## 3. Key Indexes Explained

| Index | Table | Purpose |
|-------|-------|---------|
| `[assignedTo, status]` | leads | Sale xem danh sách lead của mình |
| `[priorityScore DESC]` | leads | Top 3 priority cards |
| `[golden72hExpiresAt]` | leads | Filter lead đang trong 72h Vàng |
| `[snoozeUntil]` | leads | Tìm lead hết snooze cần hiện lại |
| `[lastInteractionAt]` | leads | Anti-hoarding: tìm lead "đứng hình" |
| `[fromMilestone, toMilestone]` | milestone_history | Sankey Diagram aggregation |
| `[status, severity]` | sos_alerts | Dashboard SOS filtering |
| `[orgId, date]` | daily_metrics | Dashboard CEO revenue |

---

## 4. Key Queries (Pseudo-code)

### 4.1 Top 3 Priority Cards (Sale)

```sql
SELECT * FROM leads
WHERE assigned_to = :userId
  AND status = 'ACTIVE'
  AND (snooze_until IS NULL OR snooze_until <= NOW())
ORDER BY priority_score DESC
LIMIT 3;
```

### 4.2 Team Heatmap (Manager)

```sql
-- Tính % lead tương tác đúng hạn
SELECT
  CASE
    WHEN compliance_rate > 0.8 THEN 'GREEN'
    WHEN compliance_rate > 0.5 THEN 'YELLOW'
    ELSE 'RED'
  END as status
FROM (
  SELECT
    COUNT(CASE WHEN last_interaction_at > NOW() - INTERVAL '48 hours' THEN 1 END)::float
    / NULLIF(COUNT(*), 0) as compliance_rate
  FROM leads
  WHERE team_id = :teamId AND status = 'ACTIVE'
);
```

### 4.3 Sankey Diagram Data (CEO)

```sql
SELECT
  from_milestone,
  to_milestone,
  COUNT(*) as count
FROM milestone_history
WHERE changed_at BETWEEN :startDate AND :endDate
GROUP BY from_milestone, to_milestone
ORDER BY from_milestone, to_milestone;
```

### 4.4 Revenue Pulse (CEO)

```sql
-- Actual Revenue
SELECT COALESCE(SUM(deal_value), 0) as actual
FROM leads
WHERE org_id = :orgId
  AND status = 'WON'
  AND updated_at BETWEEN :startOfMonth AND :endOfMonth;

-- Pipeline Value
SELECT COALESCE(SUM(deal_value), 0) as pipeline
FROM leads
WHERE org_id = :orgId
  AND status = 'ACTIVE'
  AND current_milestone IN (4, 5);
```

### 4.5 Anti-Hoarding Check (Cron Job)

```sql
-- Lead đứng hình 15 ngày ở Mốc 1-2
UPDATE leads
SET status = 'POOL', assigned_to = NULL
WHERE status = 'ACTIVE'
  AND current_milestone IN (1, 2)
  AND last_interaction_at < NOW() - INTERVAL '15 days'
RETURNING id, assigned_to;
-- → Tạo notification cho Sale & Manager
```

---

## 5. Data Migration Strategy

### 5.1 Migration Order
1. `organizations` → `teams` → `users` (Foundation)
2. `lead_sources` → `leads` (Core data)
3. `interactions` → `milestone_history` → `schedules` (Activity data)
4. `sos_alerts` → `manager_advices` (Manager tools)
5. `ai_insights` → `daily_metrics` (Analytics)
6. `audit_logs` → `system_configs` (System)

### 5.2 Seed Data
- Default `system_configs` (snooze durations, anti-hoarding thresholds...)
- Default `lead_sources` (Facebook, Zalo, Website, Referral, Cold Call)
- Demo organization + team + users (for development)

---

## 6. Encryption Strategy

### 6.1 Phone Number
```typescript
// Encrypt for storage
const encrypted = encrypt(phone, process.env.ENCRYPTION_KEY);
// Hash for search/dedup
const hash = sha256(normalizePhone(phone));

// Store both
await prisma.lead.create({
  data: {
    phoneEncrypted: encrypted,
    phoneHash: hash,
  }
});

// Search by phone
const lead = await prisma.lead.findFirst({
  where: { phoneHash: sha256(normalizePhone(searchPhone)) }
});
```

### 6.2 Data Masking for Leader Role
```typescript
function maskLeadData(lead: Lead, viewer: User): MaskedLead {
  if (viewer.role === 'LEADER' && lead.teamId !== viewer.teamId) {
    return {
      ...lead,
      phoneEncrypted: '****',
      email: lead.email ? '****@****.com' : null,
    };
  }
  return lead;
}
```

---

> 📌 **Lịch sử thay đổi**
> | Ngày | Phiên bản | Thay đổi | Người |
> |------|-----------|----------|-------|
> | 2026-03-14 | 1.0 | Tạo Database Schema ban đầu — 14 tables | AI |
