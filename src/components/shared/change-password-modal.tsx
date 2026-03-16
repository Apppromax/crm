'use client'

import { useState } from 'react'
import { X, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
    isOpen: boolean
    onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: Props) {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    if (!isOpen) return null

    const isValid = newPassword.length >= 8 && newPassword === confirmPassword && currentPassword.length > 0

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isValid) return

        setLoading(true)
        setError('')

        try {
            const supabase = createClient()
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (updateError) {
                setError(updateError.message)
            } else {
                setSuccess(true)
                setTimeout(() => {
                    onClose()
                    setSuccess(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                }, 1500)
            }
        } catch {
            setError('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary-500" />
                        <h2 className="text-base font-bold text-slate-800">Đổi mật khẩu</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {success ? (
                    <div className="px-5 py-10 text-center">
                        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-700">Đổi mật khẩu thành công!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                                    placeholder="Nhập mật khẩu cũ"
                                />
                                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Mật khẩu mới</label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                                    placeholder="Tối thiểu 8 ký tự"
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {newPassword.length > 0 && newPassword.length < 8 && (
                                <p className="text-[10px] text-red-400 mt-1">Tối thiểu 8 ký tự</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            {confirmPassword && confirmPassword !== newPassword && (
                                <p className="text-[10px] text-red-400 mt-1">Mật khẩu không khớp</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className="w-full rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
