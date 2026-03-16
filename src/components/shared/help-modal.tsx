'use client'

import { useState } from 'react'
import { X, HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'

interface Props {
    isOpen: boolean
    onClose: () => void
}

const FAQ_ITEMS = [
    {
        q: 'Lead là gì?',
        a: 'Lead là khách hàng tiềm năng trong pipeline bán hàng. Mỗi lead có 5 mốc thăng hạng từ Tiếp cận → Chào mồi → Niềm tin → Dồn chốt → Chốt cọc.',
    },
    {
        q: '72h Vàng hoạt động như thế nào?',
        a: 'Khi tạo lead mới, hệ thống bật bộ đếm 72 giờ. Trong thời gian này lead được ưu tiên tuyệt đối trên Top 3 Cards. Nếu không có tương tác trong 72h, SOS sẽ tự động bắn.',
    },
    {
        q: 'Snooze có nghĩa là gì?',
        a: 'Snooze tạm ẩn lead khỏi Top 3 trong một khoảng thời gian (15 phút → Ngày mai 9h). Lead sẽ tự động xuất hiện lại khi hết hạn snooze.',
    },
    {
        q: 'Anti-Hoarding là gì?',
        a: 'Hệ thống tự động phát hiện lead bị "ôm" quá lâu: gọi nhỡ 3+ lần liên tiếp hoặc không tương tác > 15 ngày → lead bị chuyển về Kho Chung.',
    },
    {
        q: 'Manager có thể làm gì?',
        a: 'Manager có thể: xem Heatmap team compliance, xử lý SOS alerts, Shadow Mode (giám sát thời gian thực), gửi "Lệnh sếp" cho Sale, phân lead từ Kho Chung.',
    },
    {
        q: 'Làm sao để cài app trên điện thoại?',
        a: 'Mở trang web trên Chrome/Safari → Nhấn nút "Chia sẻ" hoặc menu ⋮ → Chọn "Thêm vào Màn hình chính". App sẽ hoạt động như ứng dụng native.',
    },
    {
        q: 'Mốc thăng hạng có bị rớt không?',
        a: 'Có! Nếu ở Mốc 4 hoặc 5 mà không có tương tác > 7 ngày → lead tự động rớt về Mốc 3. Đây là cơ chế Milestone Demotion.',
    },
    {
        q: 'AI Coach gợi ý như thế nào?',
        a: 'AI Coach phân tích mốc hiện tại của lead và đưa ra: Tip vượt mốc, Cách xử lý từ chối, và Câu hỏi kích mốc. Nội dung thay đổi theo từng mốc.',
    },
]

export function HelpModal({ isOpen, onClose }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl animate-slide-up flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary-500" />
                        <h2 className="text-base font-bold text-slate-800">Trợ giúp & FAQ</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-2">
                    {FAQ_ITEMS.map((item, i) => (
                        <div key={i} className="rounded-xl border border-slate-100 overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50/50 transition-colors"
                            >
                                <MessageCircle className="h-4 w-4 text-primary-400 shrink-0" />
                                <span className="text-sm font-medium text-slate-700 flex-1">{item.q}</span>
                                {openIndex === i ? (
                                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                                )}
                            </button>
                            {openIndex === i && (
                                <div className="px-4 pb-3 pt-0">
                                    <p className="text-sm text-slate-500 leading-relaxed pl-7">{item.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="px-5 py-4 border-t border-slate-100 shrink-0">
                    <p className="text-xs text-slate-400 text-center">
                        Cần hỗ trợ thêm? Liên hệ: <span className="font-medium text-primary-500">support@crmpro.vn</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
