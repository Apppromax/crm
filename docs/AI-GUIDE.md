# CRM Pro V2 — AI Documentation Update Guide

> **Mục đích:** Hướng dẫn AI (và developer) cập nhật tài liệu mỗi phiên làm việc.  
> **Nguyên tắc:** Docs luôn phản ánh trạng thái THỰC TẾ của code.  
> **Ngày tạo:** 2026-03-14

---

## 1. Quy Tắc Vàng

### 🔴 BẮT BUỘC trước mỗi phiên code:
```
1. Đọc CHANGELOG.md → Biết phiên trước làm gì
2. Đọc ROADMAP.md → Biết đang ở Sprint/Task nào
3. Đọc file docs liên quan → Hiểu spec đúng
```

### 🔴 BẮT BUỘC sau mỗi phiên code:
```
1. Cập nhật CHANGELOG.md → Ghi lại những gì đã làm
2. Cập nhật ROADMAP.md → Đánh dấu task hoàn thành
3. Cập nhật docs liên quan → Nếu spec thay đổi
```

---

## 2. File Map & Dependencies

```
docs/
├── PRD.md           ← Yêu cầu sản phẩm (ít thay đổi)
├── SRS.md           ← Yêu cầu kỹ thuật (thay đổi khi thêm/sửa feature)
├── ARCHITECTURE.md  ← Kiến trúc hệ thống (thay đổi khi thêm tech/service)
├── DATABASE.md      ← Schema database (thay đổi khi thêm/sửa table)
├── API.md           ← API endpoints (thay đổi khi thêm/sửa API)
├── UI-UX.md         ← Thiết kế UI/UX (thay đổi khi thêm/sửa screen)
├── ROADMAP.md       ← Lộ trình (cập nhật tiến độ mỗi phiên)
├── CHANGELOG.md     ← Nhật ký (cập nhật MỖI PHIÊN)
└── AI-GUIDE.md      ← File hướng dẫn này (ít thay đổi)
```

### Dependency Chain (Đổi file này → Kiểm tra file kia)

| Khi thay đổi | Kiểm tra & cập nhật |
|--------------|---------------------|
| Thêm feature mới | PRD → SRS → ARCHITECTURE → DATABASE → API → UI-UX → ROADMAP |
| Thêm/sửa database table | DATABASE → API → SRS |
| Thêm/sửa API endpoint | API → SRS |
| Thêm/sửa UI screen | UI-UX → SRS |
| Thay đổi tech stack | ARCHITECTURE → ROADMAP |
| Hoàn thành task | ROADMAP → CHANGELOG |
| Sửa bug | CHANGELOG |
| Refactor | CHANGELOG → ARCHITECTURE (nếu cấu trúc thay đổi) |

---

## 3. Template Cập Nhật Theo Loại Thay Đổi

### 3.1 Khi THÊM FEATURE MỚI

**Bước 1 — SRS.md:** Thêm Functional Requirement mới
```markdown
#### FR-XXX: [Tên feature]
- **Mô tả:** ...
- **Input:** ...
- **Output:** ...
- **Actor:** ...
- **Priority:** PX
```

**Bước 2 — DATABASE.md:** Thêm table/column nếu cần
```markdown
### New: [TableName]
- Lý do thêm: ...
- Columns: ...
```

**Bước 3 — API.md:** Thêm endpoint nếu cần
```markdown
### X.Y [Endpoint Name]
\`\`\`
METHOD /api/v1/path
\`\`\`
Request: ...
Response: ...
```

**Bước 4 — UI-UX.md:** Thêm screen/component nếu cần

**Bước 5 — ROADMAP.md:** Thêm task vào sprint phù hợp

**Bước 6 — CHANGELOG.md:** Ghi nhận
```markdown
### Added
- **[Module]**: [Mô tả feature]
  - Files: `file1.ts`, `file2.ts`
```

### 3.2 Khi SỬA BUG

**Bước 1 — CHANGELOG.md:**
```markdown
### Fixed
- **[Module]**: [Mô tả bug và cách fix]
  - Root cause: [nguyên nhân gốc]
  - Files: `file1.ts`
```

**Bước 2:** Kiểm tra SRS.md, API.md xem spec có sai → sửa nếu cần

### 3.3 Khi REFACTOR

**Bước 1 — CHANGELOG.md:**
```markdown
### Refactored
- **[Module]**: [Mô tả refactor]
  - Reason: [lý do]
  - Impact: [ảnh hưởng]
  - Files: `file1.ts`, `file2.ts`
```

**Bước 2:** Cập nhật ARCHITECTURE.md nếu cấu trúc thay đổi

### 3.4 Khi THAY ĐỔI DATABASE

**Bước 1 — DATABASE.md:** Cập nhật Prisma Schema
```markdown
// Thêm vào section 2. Prisma Schema
model NewTable {
  ...
}
```

**Bước 2 — API.md:** Cập nhật affected endpoints
**Bước 3 — CHANGELOG.md:** Ghi nhận migration

---

## 4. Prompt Mẫu Cho AI (Copy-Paste)

### 4.1 Bắt đầu phiên làm việc mới
```
Đọc các file sau để hiểu context dự án:
1. docs/CHANGELOG.md — xem phiên trước làm gì
2. docs/ROADMAP.md — xem đang ở Sprint/Task nào
3. docs/[file liên quan].md — xem spec chi tiết

Sau đó bắt đầu task: [mô tả task]
```

### 4.2 Kết thúc phiên làm việc
```
Cập nhật docs cho phiên này:
1. CHANGELOG.md: Thêm entry cho [ngày hôm nay] với những thay đổi:
   - [liệt kê thay đổi]
2. ROADMAP.md: Đánh dấu hoàn thành task [X.Y]
3. [File docs khác nếu spec thay đổi]
```

### 4.3 Khi có thay đổi scope
```
Feature [tên] cần thay đổi so với spec ban đầu:
- Thay đổi: [mô tả]
- Lý do: [tại sao]
- Ảnh hưởng: [files nào cần update]

Hãy cập nhật docs theo dependency chain trong AI-GUIDE.md
```

---

## 5. Checklist Cuối Phiên (BẮT BUỘC)

Trước khi kết thúc mỗi phiên làm việc, AI phải kiểm tra:

- [ ] **CHANGELOG.md** đã được cập nhật với entry mới?
- [ ] **ROADMAP.md** task status đã được đánh dấu? (✅ hoặc strike-through)
- [ ] Nếu thêm feature → **SRS.md** có FR mới?
- [ ] Nếu thêm table/column → **DATABASE.md** Prisma schema đã update?
- [ ] Nếu thêm API → **API.md** có endpoint mới?
- [ ] Nếu thêm screen → **UI-UX.md** có wireframe mới?
- [ ] Nếu đổi tech → **ARCHITECTURE.md** đã update?
- [ ] Docs phản ánh đúng trạng thái **THỰC TẾ** của code?

---

## 6. Convention

### 6.1 Đánh số ID
- Functional Requirements: `FR-001`, `FR-002`, ...
- Non-functional: `NFR-001`, `NFR-002`, ...
- Business Rules: `BR-001`, `BR-002`, ...
- User Stories: `US-S01` (Sale), `US-M01` (Manager), `US-D01` (Director)

### 6.2 Priority Labels
- `P0` — Must have (MVP)
- `P1` — Should have (release 1)
- `P2` — Nice to have (can delay)
- `P3` — Future/Backlog

### 6.3 Task Status (ROADMAP)
- ⬜ Not started
- 🔄 In progress
- ✅ Done
- ❌ Cancelled/Deferred

### 6.4 Version Numbering
```
0.1.0 — Phase 1 complete (MVP)
0.2.0 — Phase 2 complete (AI)
0.3.0 — Phase 3 complete (Manager & CEO)
1.0.0 — Production Launch
```

---

## 7. Lưu Ý Quan Trọng

> ⚠️ **KHÔNG BAO GIỜ** xóa nội dung cũ trong docs. Chỉ đánh dấu `[DEPRECATED]` hoặc ~~strikethrough~~.

> ⚠️ **LUÔN** ghi ngày & phiên bản khi thay đổi docs ở footer mỗi file.

> ⚠️ **Nếu spec bị sai** so với thực tế → Sửa docs cho đúng, KHÔNG sửa code cho khớp docs sai.

---

> 📌 **Lịch sử thay đổi**
> | Ngày | Phiên bản | Thay đổi | Người |
> |------|-----------|----------|-------|
> | 2026-03-14 | 1.0 | Tạo AI Documentation Guide | AI |
