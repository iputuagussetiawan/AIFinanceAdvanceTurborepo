'use client'

import { format, parseISO } from 'date-fns' // Import date-fns
import { id } from 'date-fns/locale' // Opsional: jika ingin format Indonesia

import type { IExperience } from '@/features/experience/types/experience-type'
import { cn } from '@/lib/utils'

interface ExperienceItemProps {
    experience: IExperience
    className?: string
}

const ExperienceItem = ({ experience, className }: ExperienceItemProps) => {
    // Helper function untuk memformat tanggal
    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return ''
        try {
            const date = parseISO(dateString)
            // "MMM yyyy" menghasilkan: Jan 2024
            return format(date, 'MMM yyyy')
        } catch (error) {
            return dateString // Fallback jika format date salah
        }
    }

    return (
        <div className={cn('relative mb-8 pl-4', className)}>
            <div
                className="absolute top-1 left-[-38.5px] z-10 h-3 w-3 rounded-full border-2 border-white"
                style={{ backgroundColor: '#1a1a1a' }}
            ></div>

            <h3
                className="text-[11px] font-bold tracking-wider uppercase"
                style={{ color: '#1a1a1a' }}
            >
                {experience.title}
            </h3>

            <p className="mb-2 text-[9px] font-semibold" style={{ color: '#4b5563' }}>
                {experience.companyName} | {experience.location} |{' '}
                {formatDate(experience.startDate)} —{' '}
                {experience.isCurrent ? 'Present' : formatDate(experience.endDate)}
            </p>

            <div
                className="tiptap-resume prose prose-sm prose-p:my-0 prose-li:pl-0 max-w-none text-justify text-[10px] leading-relaxed"
                style={{ color: '#4b5563' }}
                dangerouslySetInnerHTML={{
                    __html: experience.description || 'No description provided.',
                }}
            />
        </div>
    )
}

export default ExperienceItem
