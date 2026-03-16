'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
    textReport: string
}

export function CopyReportButton({ textReport }: Props) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(textReport)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea')
            textarea.value = textReport
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all active:scale-[0.98]"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4" />
                    Đã copy! Paste vào Zalo/Telegram
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    Copy báo cáo → Zalo / Telegram
                </>
            )}
        </button>
    )
}
