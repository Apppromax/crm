'use client'

import Link from 'next/link'

interface BigButtonProps {
    leadName: string
    leadId: string
}

export function BigButton({ leadName, leadId }: BigButtonProps) {
    return (
        <Link href={`/sale/leads/${leadId}`} className="block group">
            <div className="relative flex items-center justify-center rounded-full p-[4px] bg-gradient-to-br from-[#18C3F5] via-[#e6fffa] to-[#fc8a62] shadow-[0_8px_32px_rgba(252,138,98,0.4)] transition-transform duration-300 group-active:scale-95 group-hover:scale-105">
                <div className="flex flex-col h-[104px] w-[104px] items-center justify-center rounded-full bg-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
                    <p className="text-[15px] font-bold text-slate-900 leading-[1.2]">Chăm khách</p>
                    <p className="text-[15px] font-bold text-slate-900 leading-[1.2]">ngay</p>
                </div>
            </div>
        </Link>
    )
}
