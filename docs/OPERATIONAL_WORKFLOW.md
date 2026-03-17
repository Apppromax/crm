# ĐẶC TẢ LUỒNG VẬN HÀNH TOÀN DIỆN (FULL OPERATIONAL WORKFLOW)

**Dự án:** CRM Pro V2 (Mobile-first)
**Phạm vi:** Hành trình từ khi "khai sinh" một Lead đến khi trở thành "Kim cương".

---

## BƯỚC 1: TIẾP NHẬN & PHÂN LOẠI ĐẦU VÀO (THE INPUT)
Khi Sale nhấn nút **Thêm khách** và nhập Tên + SĐT, hệ thống sẽ rẽ nhánh thành 3 kịch bản xử lý ngay lập tức dựa trên thông tin tương tác:

### 🌱 Kịch bản 1: Đã tương tác & Có nội dung
*   **Action:** Hệ thống mở bảng **"Mài giũa Lead"**.
*   **Input Sale:**
    *   Đánh giá 4 Dropbox chỉ số nét (BANT): (1) Độ gấp, (2) Độ hiểu dự án, (3) Sẵn sàng tài chính, (4) Độ khớp sản phẩm.
    *   Nhập Take note tự do vào Box định hướng.
*   **System Logic:** Hệ thống/AI tự động tính toán `Sharpness Score` (Điểm Nét) $\rightarrow$ Quyết định màu sắc thẻ Card (Xanh/Cam/Đỏ) $\rightarrow$ Đẩy thẻ vào **Giỏ khách đợi**.

### 📵 Kịch bản 2: Không liên lạc được
*   **Action:** Sale nhấn nút **"Không liên lạc được"**.
*   **System Logic:** Thẻ Card tự động rơi vào chu kỳ **Retry (Gọi lại)** tự động.
    *   *Quy tắc ẩn/hiện:* Tạm ẩn khỏi màn hình chính và tự động hiện lại sau khoảng thời gian tăng dần: `30 phút` $\rightarrow$ `2 giờ` $\rightarrow$ `4 giờ` $\rightarrow$ `Sáng hôm sau`.

### ⏸️ Kịch bản 3: Thêm để đấy (Gọi sau)
*   **Action:** Sale chỉ mới nhập thông tin, chưa phát sinh cuộc gọi hay nội dung trao đổi.
*   **System Logic:** Thẻ Card rơi thẳng vào **Giỏ khách đợi** với trạng thái mặc định là *"Chưa xử lý"*.

---

## BƯỚC 2: QUẢN LÝ GIỎ KHÁCH ĐỢI (THE QUEUE BAR)
Đây là thanh Bar ngang nằm ngay trên vùng nút "Chăm Khách Ngay", đóng vai trò như một phễu chờ, vận hành theo cơ chế Gamification thúc đẩy động lực:

**1. Thành phần bên trong Giỏ (Queue Items):**
*   **Lead mới tinh:** Chưa gọi lần nào (Từ kịch bản 3).
*   **Lead đến hẹn:** Đã tới lịch gọi/chăm sóc tiếp theo (Do Sale set giờ ở lần tương tác trước).
*   **Lead 72h Vàng (Kỷ luật thép):** Bất kể có set hẹn hay không, cứ trong 3 ngày đầu tiên, hệ thống sẽ tự động vớt Lead đẩy vào Giỏ chờ mỗi **4 tiếng/lần**.

**2. Hiển thị & Hành động (UI/UX Logic):**
*   **Thanh Bar Progress:** Đổi màu từ **Đỏ** (Đang quá tải/Tồn đọng) sang dần **Xanh lá** (Clear xong nhiệm vụ/Hoàn thành) dựa trên số lượng khách còn lại trong giỏ.
*   **Cơ chế "Bắn" Card:** Bất cứ khi nào màn hình chính có khoảng trống (Tức là đang có ít hơn 3 Smart Cards hiển thị), Thẻ ưu tiên nhất trong Giỏ sẽ lập tức "Bắn" ra màn hình ngoài để Sale cày tiếp.

---

## BƯỚC 3: ĐIỀU PHỐI 3 SMART CARDS (THE ACTIVE WORKSPACE)
Hệ thống là người quyết định 3 thẻ khách nào được hiện ra trước mặt Sale. Thuật toán chọn lọc từ Giỏ đợi theo đúng **Thứ tự ưu tiên** sau:

*   🥇 **Ưu tiên 1 (Nóng nhất):** Khách có `Sharpness Score` cao nhất (Khách nét — Thẻ Đỏ/Cam).
*   🥈 **Ưu tiên 2:** Khách mới tinh chưa gọi lần nào (Fresh Leads).
*   🥉 **Ưu tiên 3:** Khách đến hạn gọi hẹn (Due leads) hoặc Khách trong chu kỳ Retry.

---

## BƯỚC 4: HÀNH TRÌNH 5 MỐC (THE MILESTONES)
Thanh tiến trình (Milestone) trên Thẻ Card sẽ đổi màu từ `Lạnh` $\rightarrow$ `Nóng` theo chiều sâu chăm sóc:

*   🔵 **Mốc 1 (Tiếp cận):** Màu Xanh nhạt.
*   🟢 **Mốc 2 (Chào mồi):** Màu Xanh ngọc.
*   🟡 **Mốc 3 (Niềm tin):** Màu Vàng ấm. Hệ thống bật Pop-up gợi ý Sale thu thập các "Dấu hiệu tin tưởng" (Kết bạn Zalo, Xin CCCD, Mời được Cafe).
*   🟠 **Mốc 4 (Dồn chốt):** Màu Cam rực cháy.
*   💎 **Mốc 5 (Chốt cọc):** Màu Kim cương tuyệt đối.

---

## BƯỚC 5: TRẠNG THÁI "TREO" DỒN CHỐT (THE HOT SEAT)
Đây là trạng thái căng thẳng và hưng phấn nhất, dành riêng cho các khách hàng sát viền chốt:

*   **Điều kiện vào Hot Seat:** Khách tích lũy đủ 3 tín hiệu chốt: *(1) Đã tin tưởng Sale, (2) Thích dự án, (3) Hỏi sâu về Giá/Chính sách ráp căn.*
*   **Vị trí hiển thị:** Thẻ Card sẽ **tách biệt hoàn toàn** khỏi khu vực 3 thẻ thông thường, bị hút & treo lơ lửng lên vùng đặc biệt phía trên đỉnh màn hình chính.
*   **Visual:** Màu đỏ rực rỡ, kèm hiệu ứng **"Nhịp thở" (Pulse Glow)** chớp tắt liên tục, buộc ánh mắt và não bộ Sale phải tập trung cao độ để chốt.
*   **Kết quả xử lý:**
    *   **[Nếu CHỐT thành công]:** Card nổ hiệu ứng biến thành **Màu Kim Cương**, lưu vào kho thành tích.
    *   **[Nếu NUÔI LẠI]:** Card bị "rớt đài", tự động tụt lùi về **Mốc 3**, gỡ bỏ trạng thái Treo/Nóng, và bị ẩn khỏi màn hình cày cuốc (đưa vào lịch hẹn sau).

---

## BƯỚC 6: TÌM KIẾM NHANH & INBOUND (BOTTOM NAV)
Luồng dành cho các trường hợp khách hàng chủ động gọi lại (Inbound) hoặc Sale sực nhớ ra cần cập nhật thông tin:
*   Sale điều hướng vào tab **Kho khách hàng (Leads)** qua thanh Bottom NAV.
*   Sử dụng thanh công cụ Search: Gõ tên hoặc **3 số cuối điện thoại**.
*   Click thẳng vào Thẻ khách trong List để cập nhật ngay tương tác hoặc re-rate (đánh giá lại) độ nét mà không cần đưa ra màn hình Smart Cards.

---

## BƯỚC 7: ANTI-HOARDING (CƠ CHẾ DỌN RÁC)
Hệ thống tự động tuần tra và dọn dẹp data để chống hành vi "Om leads" (giữ khách nhưng không chăm):
*   **Rác ngủ quên (Mốc 1-2):** Đã 7 ngày trôi qua không phát sinh bất kỳ tương tác mới nào $\rightarrow$ Tịch thu khách, thả lại vào Kho chung (Pool) cho người khác nhận.
*   **Rác ảo (Thuê bao):** Hệ thống ghi nhận Sale bấm nút "Không liên lạc được" **5 lần liên tiếp** $\rightarrow$ Card bị đánh dấu là Rác, tống thẳng vào thùng rác/xóa.

---

## 🎨 TÓM TẮT TRẠNG THÁI MÀU SẮC (UI/UX COLOR CODE)

| Trạng thái | Mã Màu sắc / Visual | Hiệu ứng UI Mapping (CSS/Animation) |
| :--- | :--- | :--- |
| **Hàng đợi trống (Clear)** | 🟢 Xanh lá rực | Thanh Bar Queue phát sáng "Mission Complete". |
| **Khách Nét** | 🔴 Đỏ / 🟠 Cam rực | Vòng bao Thẻ Card có viền Neon đậm. |
| **Khách Dồn chốt (Treo)**| ⚡ Cam cháy (Burning) | Hiệu ứng nhịp thở phập phồng (Pulse / Breathe). |
| **Khách Chốt cọc (Won)** | 💎 Kim Cương (Diamond) | Hiệu ứng Lấp lánh lóa sáng, Shimmer light trượt, Particle bay. |
| **Khách Retry (Chờ gọi lại)**| 🌫️ Xám mờ | Card giảm Opacity (mờ đi), disable nhẹ, chỉ làm nổi bật Icon đếm ngược Retry. |
