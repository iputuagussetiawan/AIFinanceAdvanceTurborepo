'use client'
import { cn } from '@/lib/utils'
import type { IUserSkillResponse } from '@/features/jobseeker/jobseeker-skill/types/userskill-type'

interface SkillItemProps {
    skill: IUserSkillResponse
    className?: string
}

const SkillItem = ({ skill, className }: SkillItemProps) => {
    return (
        <div className={cn('mb-2', className)}>
            <div className="mb-1 flex items-center justify-between">
                <span className="text-[9px] text-gray-600">
                    {skill.skill.name}
                </span>
                <span className="text-[9px] text-gray-400">
                    {skill.level}
                </span>
            </div>
            <div className="h-1.5 w-full bg-gray-200">
                <div
                    className="h-full bg-gray-700"
                    style={{ width: `${skill.percentage}%` }}
                />
            </div>
        </div>
    )
}

export default SkillItem