'use client'

import { Phone } from 'lucide-react'
import Link from 'next/link'

interface BigButtonProps {
    leadName: string
    leadId: string
}

export function BigButton({ leadName, leadId }: BigButtonProps) {
    return (
        <Link href={`/sale/leads/${leadId}`}>
            <button className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 text-white shadow-xl shadow-primary-500/25 transition-all hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 active:scale-[0.97]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:scale-110">
                    <Phone className="h-6 w-6" />
                </div>
                <div className="text-left">
                    <p className="text-lg font-bold">Gọi ngay</p>
                    <p className="text-sm text-primary-100 opacity-80">{leadName}</p>
                </div>
            </button>
        </Link>
    )
}
