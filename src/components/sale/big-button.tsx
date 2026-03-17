'use client'

import Link from 'next/link'

interface BigButtonProps {
    leadName: string
    leadId: string
}

export function BigButton({ leadName, leadId }: BigButtonProps) {
    return (
        <Link href={`/sale/leads/${leadId}`} className="block">
            <div className="big-button-ring">
                <div className="big-button-inner">
                    <div className="text-center px-2">
                        <p className="text-sm font-bold text-slate-700 leading-tight">Chăm khách</p>
                        <p className="text-sm font-bold text-slate-700 leading-tight">ngay</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
