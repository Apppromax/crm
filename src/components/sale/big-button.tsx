'use client'

import Link from 'next/link'

interface BigButtonProps {
    leadName: string
    leadId: string
}

export function BigButton({ leadName, leadId }: BigButtonProps) {
    return (
        <Link href={`/sale/leads/${leadId}`} className="block rounded-full" style={{ width: 'fit-content' }}>
            <div className="big-button-ring">
                <div className="big-button-inner">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-[15px] font-bold text-slate-900 leading-[1.2]">Chăm khách</p>
                        <p className="text-[15px] font-bold text-slate-900 leading-[1.2]">ngay</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
