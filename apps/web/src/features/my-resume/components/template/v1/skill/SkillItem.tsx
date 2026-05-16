'use client'
import { cn } from '@/lib/utils'
import type { IUserSkillResponse } from '@/features/user-skill/types/userskill-type'

interface SkillItemProps {
    skill: IUserSkillResponse
    className?: string
}

const SkillItem = ({ skill, className }: SkillItemProps) => {
    return (
          <div className={cn('mb-2', className)}>
            <div className="mb-1 flex items-center justify-between">
                <span className="text-[9px]" style={{ color: '#4b5563' }}>
                    {skill.skill.name}
                </span>
            </div>
            {/* Progress Bar Container */}
            <div className="h-1.5 w-full" style={{ backgroundColor: '#e5e7eb' }}>
                <div
                    className="h-full"
                    style={{
                        width: `${skill.percentage}%`,
                        backgroundColor: '#374151',
                    }}
                ></div>
            </div>
        </div>
    )
}

export default SkillItem
