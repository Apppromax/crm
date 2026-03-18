# CRM Pro V2 — API Specification

> **Phiên bản:** 1.1  
> **Ngày tạo:** 2026-03-14  
> **Cập nhật lần cuối:** 2026-03-18  
> **Trạng thái:** Active  
> **Base URL:** `/api/v1` (REST) / Server Actions (Next.js)  
> **Auth:** Bearer JWT (Supabase Auth)  
> **Tham chiếu:** [SRS.md](./SRS.md) | [DATABASE.md](./DATABASE.md)  

---

## 1. Authentication

### 1.1 Login
```
POST /api/v1/auth/login
```

**Request:**
```json
{
  "email": "sale@company.com",
  "password": "********"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid_xxx",
      "name": "Nguyễn Văn A",
      "email": "sale@company.com",
      "role": "SALE",
      "teamId": "team_xxx",
      "orgId": "org_xxx",
      "avatar": "/avatars/xxx.jpg"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 1.2 Refresh Token
```
POST /api/v1/auth/refresh
```

### 1.3 Logout
```
POST /api/v1/auth/logout
```

---

## 2. Lead APIs

### 2.1 Get Top Priority Cards (Sale)
```
GET /api/v1/leads/priority
```

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | number | 3 | Số card trả về (max 10) |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "lead_xxx",
      "name": "Trần Thị B",
      "currentMilestone": 2,
      "heatScore": 75,
      "priorityScore": 95,
      "priorityReason": "golden_72h",
      "dealValue": 3500000000,
      "snoozeUntil": null,
      "golden72hExpiresAt": "2026-03-16T08:00:00Z",
      "lastInteractionAt": "2026-03-14T07:30:00Z",
      "aiSummary": "2 lần gọi, quan tâm căn 2PN, ngân sách 3-4 tỷ",
      "bantBudget": "HIGH",
      "bantNeed": "Ở thật",
      "consecutiveMissCount": 0,
      "hasManagerAdvice": true,
      "nextSchedule": {
        "scheduledAt": "2026-03-14T14:00:00Z",
        "type": "FOLLOW_UP"
      }
    }
  ]
}
```

**Authorization:** Sale (only own leads)

### 2.2 Get My Leads
```
GET /api/v1/leads
```

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | LeadStatus | ACTIVE | Filter by status |
| `milestone` | number | - | Filter by milestone (1-5) |
| `search` | string | - | Search by name or last 3 phone digits |
| `page` | number | 1 | Pagination |
| `limit` | number | 20 | Items per page (max 50) |
| `sort` | string | priorityScore | Sort field |
| `order` | string | desc | Sort order |

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Authorization:** Sale (own leads), Leader (team leads, masked phone), Manager/CEO (all)

### 2.3 Get Lead Detail
```
GET /api/v1/leads/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "lead_xxx",
    "name": "Trần Thị B",
    "phone": "0901234567",
    "email": "b@email.com",
    "currentMilestone": 3,
    "status": "ACTIVE",
    "dealValue": 3500000000,
    "heatScore": 80,
    "zaloConnected": true,
    "bantBudget": "HIGH",
    "bantAuthority": "HIGH",
    "bantNeed": "Ở thật, căn 2PN tầng cao",
    "bantTimeline": "MEDIUM",
    "aiSummary": "Khách nữ 35 tuổi, quan tâm căn 2PN...",
    "source": { "id": "src_xxx", "name": "Facebook Ads" },
    "assignee": { "id": "user_xxx", "name": "Nguyễn Văn A" },
    "interactions": [...],
    "milestoneHistory": [...],
    "nextSchedule": {...},
    "aiCoachAdvice": {
      "tip": "Gợi ý khách xem thực tế căn hộ mẫu để tăng niềm tin",
      "objectionHandler": "Nếu khách lo giá cao, nhấn mạnh chính sách trả góp 0%"
    }
  }
}
```

**Authorization:** Sale (own, full data), Leader (team, masked phone), Manager (all, shadow mode)

### 2.4 Create Lead
```
POST /api/v1/leads
```

**Request:**
```json
{
  "name": "Nguyễn Văn C",
  "phone": "0912345678",
  "email": "c@email.com",
  "sourceId": "src_xxx",
  "dealValue": 5000000000,
  "note": "Khách hỏi qua Facebook, quan tâm căn 3PN"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "lead_new",
    "currentMilestone": 1,
    "golden72hExpiresAt": "2026-03-17T09:00:00Z",
    "priorityScore": 100
  }
}
```

**Side effects:**
- Tự động set `golden72hExpiresAt = now + 72h`
- Tự động tính `priorityScore = 100` (72h rule)
- Tạo `Interaction` type `SYSTEM` ("Lead created")
- Tạo `Schedule` type `GOLDEN_72H` cho 2 lần/ngày

### 2.5 Update Lead (Snooze / Miss)
```
PATCH /api/v1/leads/:id
```

**Request (Mark unreachable):**
```json
{
  "action": "unreachable"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "lead_xxx",
    "consecutiveMissCount": 3,
    "snoozeUntil": "2026-03-14T13:00:00Z",
    "snoozeReason": "UNREACHABLE_3",
    "antiHoardingTriggered": false
  }
}
```

**Side effects (Snooze cascade):**
| Miss count | Snooze duration | Action |
|-----------|----------------|--------|
| 1 | 30 min | Snooze only |
| 2 | 2 hours | Snooze only |
| 3 | 4 hours | Snooze only |
| 4 | Next morning 8AM | Snooze only |
| 5+ | N/A | Anti-hoarding popup (FR-040) |

### 2.6 Anti-Hoarding Action
```
POST /api/v1/leads/:id/anti-hoarding
```

**Request:**
```json
{
  "action": "pool"  // "pool" | "archive"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "lead_xxx",
    "status": "POOL",
    "assignedTo": null
  }
}
```

### 2.7 Reassign Lead (Manager/Leader)
```
POST /api/v1/leads/:id/reassign
```

**Request:**
```json
{
  "toUserId": "user_yyy",
  "reason": "Sale quá tải, chuyển cho member mới"
}
```

**Authorization:** Leader (within team), Manager (any)

---

## 3. Milestone APIs

### 3.1 Promote Milestone
```
POST /api/v1/leads/:id/milestone/promote
```

**Request:**
```json
{
  "confirmed": true,
  "note": "Khách đã kết bạn Zalo và chia sẻ nhu cầu thật",
  "scheduleNext": {
    "scheduledAt": "2026-03-16T09:00:00Z",
    "type": "FOLLOW_UP"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "lead_xxx",
    "previousMilestone": 2,
    "currentMilestone": 3,
    "milestoneHistoryId": "mh_xxx"
  }
}
```

**Validation:**
- Chỉ tăng +1 (không nhảy cóc): `BR-002`
- `confirmed = true` bắt buộc

### 3.2 Demote Milestone (Rớt mốc)
```
POST /api/v1/leads/:id/milestone/demote
```

**Request:**
```json
{
  "reason": "Khách hủy lịch gặp, nghi ngờ phương án tài chính"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "previousMilestone": 4,
    "currentMilestone": 3,
    "sosAlertCreated": true
  }
}
```

**Validation:** Chỉ rớt từ Mốc 4/5 về Mốc 3: `BR-003`  
**Side effect:** Tạo SOS Alert type `DEMOTED`

### 3.3 Get Milestone Flow Data (Sankey)
```
GET /api/v1/milestones/flow
```

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `period` | string | month | week, month, quarter |
| `teamId` | string | - | Filter by team |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "2026-03",
    "flows": [
      { "from": 1, "to": 2, "count": 45 },
      { "from": 2, "to": 3, "count": 30 },
      { "from": 3, "to": 4, "count": 18 },
      { "from": 4, "to": 5, "count": 8 },
      { "from": 4, "to": 3, "count": 5 },
      { "from": 5, "to": 3, "count": 2 },
      { "from": 1, "to": "pool", "count": 12 },
      { "from": 2, "to": "pool", "count": 8 }
    ],
    "totalEntered": 60,
    "totalWon": 8,
    "totalLost": 20,
    "conversionRate": 13.3
  }
}
```

**Authorization:** Manager, CEO

---

## 4. Interaction APIs

### 4.1 Add Interaction (Text)
```
POST /api/v1/leads/:id/interactions
```

**Request:**
```json
{
  "type": "CALL",
  "content": "Gọi điện cho khách, khách quan tâm căn 2PN tầng 15..."
}
```

### 4.2 Add Interaction (Voice)
```
POST /api/v1/leads/:id/interactions/voice
```

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `audioFile` | File | WebM/WAV audio file |
| `type` | string | VOICE_NOTE |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "int_xxx",
    "rawVoiceText": "khách hỏi về căn hai phòng ngủ tầng mười lăm giá ba tỷ rưỡi...",
    "content": "Khách quan tâm căn 2PN tầng 15, ngân sách khoảng 3.5 tỷ. Đang so sánh với dự án khác.",
    "aiLabels": ["Tài chính", "Nhu cầu", "So sánh"],
    "bantUpdates": {
      "bantBudget": "HIGH",
      "bantNeed": "Căn 2PN tầng cao"
    }
  }
}
```

### 4.3 Get Lead Timeline
```
GET /api/v1/leads/:id/timeline
```

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Pagination |
| `limit` | number | 20 | Items per page |

**Authorization:** Sale (own lead), Manager (shadow mode)

---

## 5. AI APIs

### 5.1 Get AI Coach Advice
```
GET /api/v1/ai/coach/:leadId
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tip": "Khách đã kết bạn Zalo - dấu hiệu tin tưởng. Gợi ý mời khách xem nhà mẫu cuối tuần để đẩy lên Mốc 4.",
    "objectionHandlers": [
      {
        "objection": "Giá cao quá",
        "response": "Nhấn mạnh chính sách trả góp 0% trong 18 tháng và giá trị tăng khi hạ tầng hoàn thiện"
      }
    ],
    "milestoneSignal": "Khách đã chia sẻ lý do mua thật → Tín hiệu Mốc 3",
    "cached": false,
    "expiresAt": "2026-03-14T09:30:00Z"
  }
}
```

### 5.2 Process Voice Note (AI)
```
POST /api/v1/ai/voice-process
```

**Request:**
```json
{
  "rawText": "khách hỏi về căn hai phòng ngủ...",
  "leadId": "lead_xxx"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "standardizedText": "Khách quan tâm căn 2PN tầng 15...",
    "summary": "Quan tâm 2PN, budget 3.5 tỷ, so sánh dự án khác",
    "labels": ["Tài chính", "Nhu cầu"],
    "bantExtracted": {
      "budget": "HIGH",
      "need": "Căn 2PN tầng cao",
      "timeline": "MEDIUM"
    }
  }
}
```

### 5.3 Get Executive Summary (CEO)
```
GET /api/v1/ai/executive-summary
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "greeting": "Chào sếp, đây là tình hình dự án hôm nay:",
    "highlights": "Tỉ lệ khách từ Mốc 2 lên Mốc 3 tăng 20% nhờ kịch bản mới. Sale Nguyễn Văn A đang phong độ chốt deal xuất sắc nhất tháng.",
    "bottlenecks": "30% Lead mới đang bị kẹt ở Mốc 1 quá 24h. Cần điều phối nhân sự xử lý nhanh.",
    "opportunities": "Có 5 deal lớn ở Mốc 4 đang 'Nét' cực độ nhưng chưa chốt. Nên nhắc Manager thực hiện Jump-in ngay chiều nay.",
    "confidenceScore": 75,
    "generatedAt": "2026-03-14T08:00:00Z",
    "nextRefresh": "2026-03-14T12:00:00Z"
  }
}
```

**Authorization:** CEO only

### 5.4 Get Win-Rate Prediction
```
GET /api/v1/ai/win-rate
```

**Query params:** `period=week|month`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "2026-03 Week 2",
    "predictedDeals": 3,
    "predictedRevenue": 10500000000,
    "targetRevenue": 12000000000,
    "achievementRate": 87.5,
    "topDeals": [
      { "leadId": "lead_xxx", "name": "Trần Thị B", "value": 3500000000, "probability": 90 }
    ]
  }
}
```

**Authorization:** Manager, CEO

---

## 6. Dashboard APIs

### 6.1 Team Heatmap (Manager)
```
GET /api/v1/dashboard/heatmap
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overallStatus": "YELLOW",
    "complianceRate": 0.65,
    "teams": [
      {
        "teamId": "team_xxx",
        "teamName": "Team Alpha",
        "status": "GREEN",
        "complianceRate": 0.85,
        "activeLeads": 45,
        "overdueLeads": 3,
        "atRiskDeals": 1
      }
    ],
    "alerts": {
      "overdue48h": 12,
      "milestone45Overdue": 3,
      "demotedToday": 1
    }
  }
}
```

### 6.2 Activity Streak Board
```
GET /api/v1/dashboard/streaks
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user_xxx",
      "name": "Nguyễn Văn A",
      "avatar": "/avatars/xxx.jpg",
      "streakCount": 15,
      "badge": "fire",
      "lastCompleted": "2026-03-13"
    }
  ]
}
```

### 6.3 Revenue Pulse (CEO)
```
GET /api/v1/dashboard/revenue
```

**Query params:** `period=month|quarter|year`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "actual": 25000000000,
    "pipelineValue": 35000000000,
    "confidenceScore": 75,
    "target": 100000000000,
    "achievementRate": 25,
    "trend": "up",
    "leadBurnRate": 15.5,
    "topWarriors": [
      { "userId": "user_xxx", "name": "Nguyễn A", "effortScore": 92, "conversionSpeed": 8.5 }
    ]
  }
}
```

---

## 7. Manager Tools APIs

### 7.1 Get SOS Alerts
```
GET /api/v1/sos
```

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | SOSStatus | ACTIVE | Filter |
| `severity` | SOSSeverity | - | Filter |

### 7.2 Resolve SOS
```
PATCH /api/v1/sos/:id/resolve
```

### 7.3 Send Quick Advice ("Lệnh sếp")
```
POST /api/v1/leads/:id/advice
```

**Request:**
```json
{
  "toUserId": "user_sale",
  "content": "Khách này phải chốt trong tuần, mời xem nhà mẫu thứ 7",
  "voiceUrl": "https://storage.xxx/voice/advice_123.webm"
}
```

---

## 8. Notification APIs

### 8.1 Get Notifications
```
GET /api/v1/notifications
```

### 8.2 Mark as Read
```
PATCH /api/v1/notifications/:id/read
```

### 8.3 Trigger Weekly Snapshot (Cron)
```
POST /api/v1/notifications/weekly-snapshot
```

**Note:** Được gọi bởi cron job mỗi sáng thứ 2, 7:00 AM  
**Action:** Gửi qua Zalo OA API / Telegram Bot API

---

## 8.4 Hot Seat Actions (Session 9)

### Close Deal (Đóng Deal - CHỐT CỌC)
```
Server Action: closeDeal(leadId, userId, note?)
```

**Logic:**
- `currentMilestone → 5`
- `status → WON`
- `colorBadge → GREEN`
- Clear snooze
- Ghi MilestoneHistory (PROMOTION, "CHỐT CỌC — Kim Cương 💎")
- Invalidate cache tags: leadDetail, leads, dashboard

### Demote to Nurture (NUÔI LẠI)
```
Server Action: demoteToNurture(leadId, userId, note?)
```

**Logic:**
- `currentMilestone → 3`  
- `priorityScore -= 20`
- `heatScore -= 15`
- `snoozeUntil = +24h` (Ẩn khỏi màn hình)
- Ghi MilestoneHistory (DEMOTION, "NUÔI LẠI — Tụt về Mốc 3")
- Invalidate cache tags: leadDetail, leads, dashboard

---

## 9. Schedule APIs

### 9.1 Create Schedule
```
POST /api/v1/leads/:id/schedule
```

**Request:**
```json
{
  "scheduledAt": "2026-03-16T09:00:00+07:00",
  "type": "FOLLOW_UP",
  "note": "Gọi lại hỏi về phương án tài chính"
}
```

### 9.2 Get My Schedules (Today)
```
GET /api/v1/schedules/today
```

---

## 10. Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead with id 'xxx' not found",
    "statusCode": 404
  }
}
```

**Common error codes:**
| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `FORBIDDEN` | 403 | Insufficient role |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid input |
| `MILESTONE_JUMP` | 422 | Trying to skip milestone |
| `MILESTONE_INVALID_DEMOTION` | 422 | Invalid demotion (not from 4/5) |
| `ANTI_HOARDING_REQUIRED` | 409 | Must handle anti-hoarding first |
| `RATE_LIMITED` | 429 | Too many requests |
| `AI_SERVICE_DOWN` | 503 | Gemini API unavailable |

---

> 📌 **Lịch sử thay đổi**
> | Ngày | Phiên bản | Thay đổi | Người |
> |------|-----------|----------|-------|
> | 2026-03-18 | 1.1 | Session 9: Hot Seat actions, search by phone, cron anti-hoarding | AI |
> | 2026-03-14 | 1.0 | Tạo API Spec ban đầu — 25+ endpoints | AI |
