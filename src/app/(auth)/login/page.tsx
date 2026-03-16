'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError('Email hoặc mật khẩu không đúng')
            setLoading(false)
            return
        }

        router.push('/')
        router.refresh()
    }

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 px-4">
            {/* Logo / Brand */}
            <div className="mb-8 text-center animate-slide-down">
                <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 shadow-lg shadow-primary-500/30 animate-float">
                    <span className="text-2xl font-bold text-white">C</span>
                </div>
                <h1 className="text-2xl font-bold text-white">CRM Pro V2</h1>
                <p className="mt-1 text-sm text-slate-400">Hệ Điều Hành Bán Hàng BĐS</p>
            </div>

            {/* Login Form */}
            <div className="w-full max-w-sm">
                <form onSubmit={handleLogin} className="rounded-2xl bg-white/10 p-6 shadow-xl backdrop-blur-xl border border-white/10 animate-scale-in">
                    <div className="mb-5">
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="sale@company.com"
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600 hover:shadow-primary-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Đăng nhập
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-500">
                    © 2026 CRM Pro V2 — Powered by AI Gemini
                </p>
            </div>
        </div>
    )
}
