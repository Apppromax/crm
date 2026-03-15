'use client'

import { Download, ChevronRight } from 'lucide-react'
import { exportLeadsToCSV } from '@/app/actions/export'
import { useState } from 'react'

export function ExportLeadsButton() {
    const [isExporting, setIsExporting] = useState(false)

    async function handleExport() {
        if (isExporting) return
        setIsExporting(true)
        try {
            const csvData = await exportLeadsToCSV()
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            const dateStr = new Date().toISOString().split('T')[0]
            link.setAttribute('download', `leads_export_${dateStr}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Export failed', error)
            alert('Lỗi xuất dữ liệu. Vui lòng thử lại.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors group"
        >
            <span className="text-primary-500 group-hover:text-primary-400 transition-colors">
                <Download className={`h-5 w-5 ${isExporting ? 'animate-bounce' : ''}`} />
            </span>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-300">
                    {isExporting ? 'Đang xuất dữ liệu...' : 'Export dữ liệu Leads'}
                </p>
                <p className="text-xs text-slate-600">CSV Định dạng chuẩn</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-700" />
        </button>
    )
}
