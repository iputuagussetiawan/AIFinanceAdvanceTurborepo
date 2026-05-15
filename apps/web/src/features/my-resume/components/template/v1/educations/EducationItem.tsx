'use client'

import { format, parseISO } from 'date-fns'

import type { IEducation } from '@/features/education/types/education-type'
import { cn } from '@/lib/utils'

interface EducationItemProps {
    edu: IEducation
    className?: string
}

const EducationItem = ({ edu, className }: EducationItemProps) => {
    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return ''
        try {
            const date = parseISO(dateString)
            return format(date, 'yyyy')
        } catch (error) {
            return dateString
        }
    }

    return (
        <div className={cn('mb-5 last:mb-0', className)}>
            <h3
                className="text-[10px] leading-tight font-bold tracking-wide uppercase"
                style={{ color: '#1a1a1a' }}
            >
                {edu.degree}
            </h3>

            <p className="mt-0.5 text-[9px] font-medium" style={{ color: '#4b5563' }}>
                {edu.institution?.name || edu.institutionName}
                <span className="mx-1 text-gray-300">|</span>
                {edu.fieldOfStudy}
            </p>

            <p className="mt-1 text-[8px] font-medium" style={{ color: '#9ca3af' }}>
                {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : 'Present'}
            </p>
        </div>
    )
}

export default EducationItem
