'use client'

import { cn } from '@/lib/utils'
import type { IUserLanguageResponse } from '@/features/user-language/types/user-language-type'
import { Ear, Mic, PenLine } from 'lucide-react'

interface LanguageItemProps {
    language: IUserLanguageResponse
    className?: string
}

const ProficiencyBadge = ({
    icon: Icon,
    value,
}: {
    icon: React.ElementType
    value?: string
}) => {
    if (!value) return null
    return (
        <div className="flex items-center gap-1">
            <Icon className="h-2.5 w-2.5 text-muted-foreground/60" />
            <span className="text-muted-foreground text-[9px]">{value}</span>
        </div>
    )
}

const LanguageItem = ({ language, className }: LanguageItemProps) => {
    const { speaking, listening, writing, jlptLevel } = language.proficiency

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            {/* Language Name */}
            <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-gray-700" />
                <span className="text-[10px] font-medium text-muted-foreground">
                    {language.language.name}
                </span>
                {jlptLevel && (
                    <span className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-[9px] font-medium">
                        {jlptLevel}
                    </span>
                )}
            </div>

            {/* Proficiency Details */}
            {(speaking || listening || writing) && (
                <div className="ml-4 flex items-center gap-3">
                    <ProficiencyBadge icon={Mic} value={speaking} />
                    <ProficiencyBadge icon={Ear} value={listening} />
                    <ProficiencyBadge icon={PenLine} value={writing} />
                </div>
            )}
        </div>
    )
}

export default LanguageItem