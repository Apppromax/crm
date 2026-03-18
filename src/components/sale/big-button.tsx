'use client'

import Link from 'next/link'

interface BigButtonProps {
    leadName: string
    leadId: string
}

export function BigButton({ leadName, leadId }: BigButtonProps) {
    return (
        <Link href={`/sale/leads/${leadId}`} className="block rounded-full group active:scale-95 transition-transform duration-200" style={{ width: 'fit-content' }}>
            <div className="w-[140px] h-[140px] bg-gradient-to-br from-[#0bd1fc] via-[#10a1d7] to-[#027eba] rounded-full p-[6px] shadow-[0_16px_40px_-8px_rgba(18,161,215,0.7),inset_0_-2px_6px_rgba(0,0,0,0.2)] group-hover:shadow-[0_20px_50px_-8px_rgba(18,161,215,0.9)] transition-shadow duration-300">
                <div className="w-full h-full bg-gradient-to-br from-[#f0fbff] via-[#d5f3fd] to-[#80e0fa] rounded-full flex flex-col items-center justify-center ring-[3px] ring-white/80 shadow-[inset_0_4px_10px_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(16,161,215,0.4)] relative overflow-hidden">
                    {/* Hiệu ứng chói lóa (Glossy shine) */}
                    <div className="absolute top-0 left-[20%] right-[20%] h-[35%] bg-gradient-to-b from-white/90 to-transparent rounded-full blur-[2px]" />
                    
                    <div className="relative z-10 flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                        <span className="text-[26px] mb-[-4px]">✨</span>
                        <p className="text-[17px] font-black text-[#0f5370] leading-[1.2] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] uppercase">Chăm</p>
                        <p className="text-[14px] font-black text-[#107aa3] leading-[1.2] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">ngay</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
