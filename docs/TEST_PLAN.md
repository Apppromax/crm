# 🧪 Kế Hoạch Kiểm Thử (Test Plan) Toàn Diện CRM Pro V2

Bản kế hoạch này được thiết kế theo đúng luồng người dùng (User Journey) trong thực tế kinh doanh với 3 phân hệ chính.

---

## 🔑 Phase 1: Authentication & Phân Quyền Vai Trò
**Mục tiêu:** Đảm bảo hệ thống bảo mật an toàn, người dùng nào thấy quyền của người dùng đấy, bị chặn truy cập màn hình vượt quyền.

- [ ] Đăng nhập bằng `director@crmpro.vn` (Mật khẩu: `password123`) -> Vào trang `/ceo`. Cố ý đổi url sang `/manager` hoặc `/sale` hệ thống có báo lỗi/chặn không?
- [ ] Đăng nhập bằng `manager@crmpro.vn` (Mật khẩu: `password123`) -> Vào trang `/manager`. CEO Dashboard `/ceo` phải bị chặn hoàn toàn.
- [ ] Đăng nhập bằng `sale.a@crmpro.vn` -> Vào trang `/sale`. Tất cả khu vực `/ceo` và `/manager` bị từ chối truy cập.
- [ ] Nhấn Đăng Xuất -> Bị đẩy ra đúng trang `/login`. Không thể Back (Quay lại) vào bên trong bằng nút lùi trên trình duyệt.

---

## 🎯 Phase 2: User Workflow (Trải nghiệm của Sale / Chuyên viên)
**Mục tiêu:** Test toàn bộ End-to-end quá trình tư vấn 1 khách hàng từ lúc vào đến lúc Chốt deal (WON) hoặc Rớt (LOST).

1. **Dashboard & Ranking:**
   - [ ] Kiểm tra số lượng Lead mới, Pipeline đang mở.
   - [ ] Kiểm tra chuỗi ngày `🔥 Steak` trên trang Home.
2. **Thêm Khách Hàng (Tạo Lead Mới):**
   - [ ] Bấm nút màu Trắng (dấu Cộng) -> Form nhập Lead.
   - [ ] Cố tình nhập sai sđt (chữ/ký tự đặc biệt), bỏ trống khung tên -> Xác thực báo lỗi đỏ?
   - [ ] Điền thông tin chuẩn -> Lead tự động rớt vào trang Danh sách chờ (`Mốc 1`).
3. **Thao Tác Tương Tác / Lịch Hẹn (Interactive CRM):**
   - [ ] Click thẻ Lead -> Mở màn chi tiết. 
   - [ ] Ghi chú một Call mới / Zalo chat mới. -> Xem Timeline Interaction thay đổi dưới cùng.
   - [ ] Tạo Thêm 2 Lịch hẹn `MEETING` và `FOLLOW_UP`.
4. **Cơ chế Thăng hạng (Milestone Pipe):**
   - [ ] Kéo dời Lead từ `Mốc 1` sang `Mốc 2` rồi `Mốc 3` (Bấm nút Mũi Tên thăng hạng).
   - [ ] Check xem AI Summary có tự động lấy nội dung tổng kết thay đổi không.
5. **Cơ chế Ngủ đông & Rớt Deal:**
   - [ ] Gửi yêu cầu `Snooze` (Chờ/Tạm ngưng) 1 Lead. -> Lead biến mất khỏi luồng Tương tác chính.
   - [ ] Chọn 1 Lead khác -> Xác nhận Rớt (LOST).
   - [ ] Chọn 1 Lead Vip -> Xác nhận CHỐT (WON) -> Kiểm tra sự bùng nổ của doanh số trên biểu đồ Dashboard (+ Streak count tăng).

---

## 🦅 Phase 3: Manager Workflow (Quản lý cấp trung \& Theo sát)
**Mục tiêu:** Kiểm tra khả năng soi chiếu của Manager xuống Sale và tính hiệu quả của chức năng cấp cứu (SOS).

1. **Top-down Heatmap:**
   - [ ] Đăng nhập bằng Manager.
   - [ ] Xem danh sách Sale bên dưới. Quan sát màu sắc biểu thị "Nhiệt độ Tuân thủ" có khớp với dữ liệu thật không? (Ví dụ: Sale bỏ rơi khách sẽ có màu sắc xấu - Đỏ/Cam).
2. **Xử Lý SOS Alert (Cấp cứu Deals):**
   - [ ] Mở thẻ cảnh báo rủi ro `SOS Alerts`. 
   - [ ] Xem lý do Cảnh báo (Golden 72h Violated hoặc Hoarding).
   - [ ] Bấm "Gửi Advice" (Chỉ đạo xử lý) -> Nhập nội dung chỉ đạo xuống cho Sale.
   - [ ] Bấm Nút Tick Xanh -> "Đã giải quyết SOS" -> SOS biến mất.
3. **Shadowing (Thanh tra Chéo):**
   - [ ] Xem trộm từng Lead của Sale khác. Mọi nốt ghi chú, log update phải hiện chi tiết. (Không được quyền sửa - Chỉ xem).

---

## 👑 Phase 4: Director / CEO Workflow (Mắt thần Doanh Thu)
**Mục tiêu:** Xác nhận các biểu đồ chỉ số chạy realtime khớp với dữ liệu thao tác của Sale.

- [ ] Vào CEO Dashboard.
- [ ] Quan sát Tổng Doanh Thu Hiện Tại (Tỷ VNĐ) & Giá Trị Giao Dịch Chờ Xét Duyệt (Pipeline).
- [ ] So sánh `Top Warriors` (BXH Doanh Số) -> Nó phải xếp hạng đúng người Sale vừa chốt DEAL thành công ở Phase 2.
- [ ] Tab thông báo AI Summary Box (Sẽ đọc tổng quan các rủi ro Pipeline xem có nhận diện đúng những gì đã test không).

---

## ⚡ Phase 5: Technical Edge Cases (System Core)
- **Kiểm thử Multi-Tab / Realtime:** Mở máy điện thoại bằng Sale (Đổi trạng thái 1 Lead) -> Vẫn giữ màn hình PC bằng Manager. Trạng thái Lead trên màn hình máy tính của Manager phải tự cập nhật *trong vòng 500ms* mà **Không cần F5 trình duyệt**.
- **Cơ chế 72h Vàng:** Tạo 1 Lead → Mở Prisma Studio để sửa thời hạn Golden72H lùi về 4 ngày trước → Quay lại trang Manager xem có bắn "SOS" đỏ chót không.
- **Tốc Độ Xử Lý:** Chuyển qua lại liên tục bằng Bottom Navigation Bar. Load Bar hiện < 0.3s.

---

## 🔄 Phase 6: Lead Lifecycle (Automated — E2E)
**Mục tiêu:** Kiểm thử các thao tác trung tâm trên Lead: thăng mốc, ngủ đông, đổi loại tương tác.

- [x] P6.1: Mở Lead Detail → xem AI Coach + milestone info → Ghi note → Check promotion modal
- [x] P6.2: Click Snooze → chọn thời gian → redirect về `/sale`
- [x] P6.3: Đổi loại tương tác (Note ↔ Call ↔ Zalo ↔ Meeting) → lưu interaction

---

## 🛡️ Phase 7: Manager Actions (Automated — E2E)
**Mục tiêu:** Kiểm thử hành động quản lý: resolve SOS, shadow view, lead pool.

- [x] P7.1: Resolve SOS Alert → SOS biến mất/thay đổi trạng thái
- [x] P7.2: Shadow View → xem chi tiết thành viên team (read-only)
- [x] P7.3: Lead Pool → xem danh sách lead chưa gán + nút Assign

---

## 📊 Benchmark Tốc Độ (Session 6 — 2026-03-16)

| Trang | Cold Cache | Warm Cache | Target |
|---|---|---|---|
| **Sale Home** | 102ms | ~80ms | ✅ < 300ms |
| **Sale Leads** | 203ms | ~120ms | ✅ < 300ms |
| **Sale Schedule** | 142ms | ~90ms | ✅ < 300ms |
| **Sale New** | 114ms | ~70ms | ✅ < 300ms |
| **Manager Dashboard** | 90ms | ~60ms | ✅ < 300ms |
| **Manager SOS** | 222ms | ~150ms | ✅ < 300ms |
| **Manager Team** | 98ms | ~70ms | ✅ < 300ms |
| **Manager Pool** | 185ms | ~100ms | ✅ < 300ms |
| **CEO Dashboard** | 154ms | ~80ms | ✅ < 300ms |
| **CEO Team** | 139ms | 183ms | ✅ < 300ms |

---

## ⚠️ Known Issues / Chưa Implement

| Item | Status | Ghi chú |
|---|---|---|
| Settings — Đổi mật khẩu | 🟡 Placeholder | Button chưa có handler |
| Settings — FAQ/Trợ giúp | 🟡 Placeholder | Button chưa có handler |
| Settings — Thông báo Push | 🟡 Placeholder | Cần Firebase FCM |
| Settings — Dark Mode | 🟡 Placeholder | Zustand store sẵn, chưa kết nối UI |
| Realtime Multi-tab Sync | 🔵 Manual Test | Cần Supabase Realtime subscription |
| Golden 72h SOS Trigger | 🔵 Manual Test | Cần sửa DB trực tiếp để test |

---
**🏆 Tiêu Chuẩn Pass:** Không có bất kỳ Màn hình Trắng, Không crash Server, Database hoạt động mượt mà không bị văng Pool (Error 500).
