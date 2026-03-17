'use client'

import { useState } from 'react'
import { ArrowLeft, UserPlus, Phone, Mail, DollarSign, FileText, Tag, Loader2, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createLead } from '@/app/actions/leads'

const SOURCES = ['Facebook Ads', 'Website', 'Zalo', 'Referral', 'Cold Call', 'Event', 'Khác']

interface Props {
    userId: string
    orgId: string
    teamId: string
}

export function NewLeadForm({ userId, orgId, teamId }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        source: '',
        dealValue: '',
        note: '',
    })

    function updateField(key: string, value: string) {
        setForm(prev => ({ ...prev, [key]: value }))
        setError('')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (loading) return
        setLoading(true)
        setError('')

        createLead({
            orgId,
            assignedTo: userId,
            teamId,
            name: form.name.trim(),
            phone: form.phone.trim(),
            bantNeed: form.note.trim() || undefined,
        }).then(() => {
            setSuccess(true)
            setTimeout(() => router.push('/sale'), 800)
        }).catch((err: any) => {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
            setLoading(false)
        })
    }

    if (success) {
        return (
            <div className="flex min-h-dvh flex-col items-center justify-center px-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mb-4 animate-slide-up">
                    <Check className="h-10 w-10 text-success" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Đã thêm Lead mới!</h2>
                <p className="text-sm text-slate-500">Lead sẽ xuất hiện trong Top 3 theo 72h Vàng</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-lg min-h-dvh">
            {/* Header */}
            <header className="sticky top-0 z-40 flex items-center gap-3 bg-white/20 backdrop-blur-2xl border-b border-white/30 px-4 py-3">
                <Link href="/sale" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-white/50 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-base font-semibold text-slate-800">Thêm khách mới</h1>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-4 py-5 space-y-4">
                {/* Error */}
                {error && (
                    <div className="rounded-xl bg-red-50/80 border border-red-100/60 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Name */}
                <FormField
                    icon={<UserPlus className="h-4 w-4" />}
                    label="Tên khách hàng *"
                    required
                >
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => updateField('name', e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                        className="w-full rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 focus:bg-white/70 focus:ring-2 focus:ring-primary-400/20 transition-all placeholder-slate-400"
                    />
                </FormField>

                {/* Phone */}
                <FormField
                    icon={<Phone className="h-4 w-4" />}
                    label="Số điện thoại *"
                    required
                >
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={e => updateField('phone', e.target.value)}
                        placeholder="0901234567"
                        required
                        className="w-full rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 focus:bg-white/70 focus:ring-2 focus:ring-primary-400/20 transition-all placeholder-slate-400"
                    />
                </FormField>

                {/* Email */}
                <FormField
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                >
                    <input
                        type="email"
                        value={form.email}
                        onChange={e => updateField('email', e.target.value)}
                        placeholder="email@example.com"
                        className="w-full rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 focus:bg-white/70 focus:ring-2 focus:ring-primary-400/20 transition-all placeholder-slate-400"
                    />
                </FormField>

                {/* Source */}
                <FormField
                    icon={<Tag className="h-4 w-4" />}
                    label="Nguồn lead"
                >
                    <div className="flex flex-wrap gap-2">
                        {SOURCES.map(src => (
                            <button
                                type="button"
                                key={src}
                                onClick={() => updateField('source', src)}
                                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${form.source === src
                                    ? 'border-primary-400/60 bg-primary-50/80 text-primary-700'
                                    : 'border-white/50 bg-white/30 text-slate-500 hover:bg-white/50'
                                    }`}
                            >
                                {src}
                            </button>
                        ))}
                    </div>
                </FormField>

                {/* Deal Value */}
                <FormField
                    icon={<DollarSign className="h-4 w-4" />}
                    label="Giá trị deal (VNĐ)"
                >
                    <input
                        type="number"
                        value={form.dealValue}
                        onChange={e => updateField('dealValue', e.target.value)}
                        placeholder="3,500,000,000"
                        className="w-full rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 focus:bg-white/70 focus:ring-2 focus:ring-primary-400/20 transition-all placeholder-slate-400"
                    />
                </FormField>

                {/* Note */}
                <FormField
                    icon={<FileText className="h-4 w-4" />}
                    label="Ghi chú"
                >
                    <textarea
                        value={form.note}
                        onChange={e => updateField('note', e.target.value)}
                        placeholder="Ghi chú sơ bộ về nhu cầu khách..."
                        rows={3}
                        className="w-full rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 focus:bg-white/70 focus:ring-2 focus:ring-primary-400/20 transition-all placeholder-slate-400 resize-none"
                    />
                </FormField>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || !form.name || !form.phone}
                    className="w-full rounded-xl bg-primary-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <UserPlus className="h-5 w-5" />
                            Thêm Lead
                        </>
                    )}
                </button>

                <p className="text-xs text-slate-500 text-center leading-relaxed">
                    Lead mới sẽ tự động vào <span className="font-medium text-amber-600">Quy tắc 72h Vàng</span> và được ưu tiên trong Top 3.
                </p>
            </form>
        </div>
    )
}

function FormField({ icon, label, required, children }: {
    icon: React.ReactNode
    label: string
    required?: boolean
    children: React.ReactNode
}) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-600">
                <span className="text-slate-400">{icon}</span>
                {label}
            </label>
            {children}
        </div>
    )
}
