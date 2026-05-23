import React from 'react'

import { cn } from '@/lib/utils'

interface CVSectionTitleProps {
    title: string
    icon?: React.ReactNode
    className?: string
}

const CVSectionTitle = ({ title, icon, className }: CVSectionTitleProps) => {
    return (
        <div className={cn('w-full', className)}>
            <div className="mb-1 flex items-center gap-2">
                {icon && <span className="text-gray-700">{icon}</span>}
                <h2 className="text-sm font-bold tracking-[0.2em] text-[#1a1a1a] uppercase">
                    {title}
                </h2>
            </div>
            <div className="mb-6 h-px w-full bg-gray-300"></div>
        </div>
    )
}

export default CVSectionTitle
