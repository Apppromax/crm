'use client'

import { useState } from 'react'
import { ArrowLeft, UserPlus, Phone, Mail, DollarSign, FileText, Tag, Loader2, Check, Sparkles, Clock, PhoneOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createLead } from '@/app/actions/leads'

const SOURCES = ['Facebook Ads', 'Website', 'Zalo', 'Referral', 'Cold Call', 'Event', 'Khác']

const URGENCY_OPTS = ['Rất gấp (Sẵn sàng cọc)', 'Gấp', 'Thong thả tìm hiểu', 'Chưa có nhu cầu ngay']
const UNDERSTANDING_OPTS = ['Rất hiểu, đã tìm hiểu kỹ', 'Có biết lướt qua', 'Mù mờ, chưa biết gì']
const FIN_OPTS = ['Sẵn sàng tiền mặt', 'Cần hỗ trợ ngân hàng', 'Đang xoay/Chờ giải ngân', 'Chưa rõ']
const FIT_OPTS = ['Rất khớp nhu cầu', 'Khớp một phần', 'Không khớp lắm']

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
    
    const [scenario, setScenario] = useState<'INTERACTED' | 'UNREACHABLE' | 'LATER'>('LATER')
    
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        source: '',
        dealValue: '',
        note: '',
        urgency: '',
        understanding: '',
        finReadiness: '',
        productFit: '',
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
            sourceId: form.source || undefined,
            scenario,
            note: form.note.trim() || undefined,
            urgency: form.urgency || undefined,
            understanding: form.understanding || undefined,
            finReadiness: form.finReadiness || undefined,
            productFit: form.productFit || undefined,
        }).then(() => {
            setSuccess(true)
            setTimeout(() => router.push('/sale'), 1200)
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
                <p className="text-sm text-slate-500 text-center max-w-xs">
                    {scenario === 'INTERACTED' && 'Thẻ đã được gán nhãn màu và cho lên Giỏ đợi theo độ nét.'}
                    {scenario === 'UNREACHABLE' && 'Leader nằm trong chu kỳ Retry đếm ngược 30 phút.'}
                    {scenario === 'LATER' && 'Lead nằm chờ dưới Trạng thái: Chưa xử lý.'}
                </p>
            </div>
        )
    }

    const renderScenarioToggle = () => (
        <div className="grid grid-cols-3 gap-2 mb-6">
            <button
                type="button"
                onClick={() => setScenario('INTERACTED')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    scenario === 'INTERACTED' ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-500/10' : 'border-slate-100 bg-white/50 text-slate-500 hover:bg-slate-50'
                }`}
            >
                <Sparkles className={`w-5 h-5 mb-1 ${scenario === 'INTERACTED' ? 'text-primary-500' : ''}`} />
                <span className="text-[11px] font-semibold text-center leading-tight">Mài giũa<br/>Lead</span>
            </button>
            <button
                type="button"
                onClick={() => setScenario('UNREACHABLE')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    scenario === 'UNREACHABLE' ? 'border-red-500 bg-red-50 text-red-700 shadow-md shadow-red-500/10' : 'border-slate-100 bg-white/50 text-slate-500 hover:bg-slate-50'
                }`}
            >
                <PhoneOff className={`w-5 h-5 mb-1 ${scenario === 'UNREACHABLE' ? 'text-red-500' : ''}`} />
                <span className="text-[11px] font-semibold text-center leading-tight">Không liên<br/>lạc được</span>
            </button>
            <button
                type="button"
                onClick={() => setScenario('LATER')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    scenario === 'LATER' ? 'border-slate-500 bg-slate-100 text-slate-700 shadow-md shadow-slate-500/10' : 'border-slate-100 bg-white/50 text-slate-500 hover:bg-slate-50'
                }`}
            >
                <Clock className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-semibold text-center leading-tight">Lưu để<br/>gọi sau</span>
            </button>
        </div>
    )

    return (
        <div className="mx-auto max-w-lg min-h-dvh">
            <header className="sticky top-0 z-40 flex items-center gap-3 bg-white/20 backdrop-blur-2xl border-b border-white/30 px-4 py-3">
                <Link href="/sale" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-white/50 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-base font-semibold text-slate-800">Thêm khách mới</h1>
            </header>

            <form onSubmit={handleSubmit} className="px-4 py-5 space-y-6">
                {error && (
                    <div className="rounded-xl bg-red-50/80 border border-red-100/60 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kịch bản xử lý</label>
                    {renderScenarioToggle()}
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Thông tin cơ bản</h3>
                    
                    <FormField icon={<UserPlus className="h-4 w-4" />} label="Tên khách hàng *" required>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => updateField('name', e.target.value)}
                            placeholder="Tên khách..."
                            required
                            className="w-full rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400 focus:bg-white/70 focus:ring-4 focus:ring-primary-400/10 transition-all font-medium"
                        />
                    </FormField>

                    <FormField icon={<Phone className="h-4 w-4" />} label="Số điện thoại *" required>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={e => updateField('phone', e.target.value)}
                            placeholder="0901234567"
                            required
                            className="w-full rounded-xl border border-white/50 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary-400 focus:bg-white/70 focus:ring-4 focus:ring-primary-400/10 transition-all font-medium"
                        />
                    </FormField>
                </div>

                {scenario === 'INTERACTED' && (
                    <div className="p-5 rounded-3xl bg-primary-50/60 border border-primary-100/60 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center gap-2 border-b border-primary-100/60 pb-3">
                            <Sparkles className="w-5 h-5 text-primary-500" />
                            <h3 className="text-sm font-bold text-primary-900">Bảng Mài giũa Lead (AI Sync)</h3>
                        </div>

                        <SelectField label="1. Độ gấp" value={form.urgency} onChange={val => updateField('urgency', val)} options={URGENCY_OPTS} />
                        <SelectField label="2. Độ hiểu dự án" value={form.understanding} onChange={val => updateField('understanding', val)} options={UNDERSTANDING_OPTS} />
                        <SelectField label="3. Sẵn sàng tài chính" value={form.finReadiness} onChange={val => updateField('finReadiness', val)} options={FIN_OPTS} />
                        <SelectField label="4. Độ khớp sản phẩm" value={form.productFit} onChange={val => updateField('productFit', val)} options={FIT_OPTS} />
                        
                        <FormField icon={<FileText className="h-4 w-4" />} label="Note định hướng (Tùy chọn)">
                            <textarea
                                value={form.note}
                                onChange={e => updateField('note', e.target.value)}
                                placeholder="Ghi chú thêm từ Sale cho AI phân tích..."
                                rows={2}
                                className="w-full rounded-xl border border-primary-100 bg-white/90 px-4 py-3 text-sm focus:border-primary-400 focus:ring-4 focus:ring-primary-400/10 resize-none outline-none font-medium"
                            />
                        </FormField>
                    </div>
                )}

                {scenario !== 'INTERACTED' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <FormField icon={<FileText className="h-4 w-4" />} label="Ghi chú (Tùy chọn)">
                            <textarea
                                value={form.note}
                                onChange={e => updateField('note', e.target.value)}
                                placeholder="Ghi chú nhắc nhở bản thân..."
                                rows={2}
                                className="w-full rounded-xl border border-white/50 bg-white/50 px-4 py-3 text-sm focus:border-primary-400 focus:ring-4 focus:ring-primary-400/10 resize-none outline-none font-medium"
                            />
                        </FormField>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !form.name || !form.phone || (scenario === 'INTERACTED' && (!form.urgency || !form.understanding || !form.finReadiness || !form.productFit))}
                    className={`w-full rounded-xl py-4 text-sm font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                        scenario === 'UNREACHABLE' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/25' : 
                        scenario === 'INTERACTED' ? 'bg-primary-500 hover:bg-primary-600 shadow-primary-500/25' : 
                        'bg-slate-700 hover:bg-slate-800 shadow-slate-500/25'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                    {loading ? (
                        <>
                           <Loader2 className="h-5 w-5 animate-spin" />
                           {scenario === 'INTERACTED' ? 'AI Đang tính điểm...' : 'Đang xử lý...'}
                        </>
                    ) : (
                        <>
                            {scenario === 'UNREACHABLE' ? <PhoneOff className="h-5 w-5" /> : 
                             scenario === 'INTERACTED' ? <Sparkles className="h-5 w-5" /> : 
                             <UserPlus className="h-5 w-5" />}
                            
                            {scenario === 'UNREACHABLE' ? 'Báo K liên lạc được' : 
                             scenario === 'INTERACTED' ? 'Lưu & Phân tích AI' : 
                             'Thêm & Lưu sau'}
                        </>
                    )}
                </button>
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
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="text-slate-400">{icon}</span>
                {label}
            </label>
            {children}
        </div>
    )
}

function SelectField({ label, value, onChange, options }: {
    label: string, value: string, onChange: (v: string) => void, options: string[]
}) {
    return (
        <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700 ml-1">{label} *</label>
            <select 
                value={value} 
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border border-white bg-white/90 px-4 py-3 text-sm text-slate-700 focus:border-primary-400 focus:ring-4 focus:ring-primary-400/10 outline-none font-medium transition-all"
            >
                <option value="" disabled>-- Chọn --</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}
