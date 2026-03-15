'use client'

import { useState } from 'react'
import { MessageSquare, X, Send, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const QUICK_COMMANDS = [
    'Chốt trong tuần, push mạnh',
    'Mời xem nhà mẫu',
    'Gửi bảng tính dòng tiền',
    'Follow-up lại sau 2 ngày',
    'Đưa phương án trả góp 0%',
    'Hẹn gặp để ký hợp đồng',
]

interface Props {
    leadName: string
    saleName: string
    onSend: (message: string) => void
    onClose: () => void
}

export function SendAdviceModal({ leadName, saleName, onSend, onClose }: Props) {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    function handleSend() {
        if (!message.trim()) return
        setSending(true)
        setTimeout(() => {
            setSending(false)
            setSent(true)
            onSend(message)
            setTimeout(onClose, 1200)
        }, 600)
    }

    if (sent) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="rounded-3xl bg-white p-8 text-center shadow-2xl animate-slide-up">
                    <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">Đã gửi lệnh!</h3>
                    <p className="text-sm text-slate-400 mt-1">{saleName} sẽ thấy ngay</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-lg rounded-t-3xl bg-white shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-center pt-3 pb-1">
                    <div className="h-1 w-10 rounded-full bg-slate-200" />
                </div>

                <div className="px-5 pb-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-indigo-500" />
                                Gửi lệnh
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Gửi chỉ thị cho <span className="font-semibold text-slate-600">{saleName}</span> về lead <span className="font-semibold text-primary-600">{leadName}</span>
                            </p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Quick Commands */}
                    <p className="text-xs font-medium text-slate-500 mb-2">Lệnh nhanh:</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {QUICK_COMMANDS.map(cmd => (
                            <button
                                key={cmd}
                                onClick={() => setMessage(cmd)}
                                className={cn(
                                    'rounded-lg border px-2.5 py-1.5 text-xs transition-all',
                                    message === cmd
                                        ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-medium'
                                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                )}
                            >
                                {cmd}
                            </button>
                        ))}
                    </div>

                    {/* Custom Message */}
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Hoặc viết lệnh tùy chỉnh..."
                        rows={3}
                        className="form-input resize-none mb-4"
                    />

                    {/* Send */}
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || sending}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-40"
                    >
                        {sending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Gửi lệnh cho {saleName}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
