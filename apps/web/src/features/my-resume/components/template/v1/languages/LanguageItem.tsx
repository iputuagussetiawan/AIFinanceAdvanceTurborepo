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
    const isCurrent = language.isCurrentLanguage

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            {/* Language Name & Status Indicators */}
            <div className="flex items-center gap-2">
                {/* Dot Indicator: Green if current, gray if not */}
                <span 
                    className={cn(
                        "h-2 w-2 shrink-0 rounded-full transition-colors",
                        isCurrent ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-muted-foreground/30"
                    )} 
                />
                
                {/* Language Text: Brighter if current */}
                <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    isCurrent ? "text-muted-foreground" : "text-muted-foreground"
                )}>
                    {language.language.name}
                </span>

                {/* Badges */}
                <div className="flex gap-1 items-center">
                    {jlptLevel && (
                        <span className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-[9px] font-semibold border border-border/50">
                            {jlptLevel}
                        </span>
                    )}

                    {isCurrent && (
                        <span className="bg-green-500/10 text-green-600 dark:text-green-400 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            Current
                        </span>
                    )}
                </div>
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