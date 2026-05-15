import React from 'react'

import { cn } from '@/lib/utils'

interface ResumeSectionTitleProps {
    title: string
    icon?: React.ReactNode // Untuk menambahkan icon di samping judul jika perlu
    className?: string
}

const ResumeSectionTitle = ({ title, icon, className }: ResumeSectionTitleProps) => {
    return (
        <div className={cn('w-full', className)}>
            <div className="mb-1 flex items-center gap-2">
                {icon && <span className="text-gray-700">{icon}</span>}
                <h2 className="text-sm font-bold tracking-[0.2em] text-[#1a1a1a] uppercase">
                    {title}
                </h2>
            </div>

            {/* Divider Line */}
            <div className="mb-6 h-px w-full bg-gray-300"></div>
        </div>
    )
}

export default ResumeSectionTitle
