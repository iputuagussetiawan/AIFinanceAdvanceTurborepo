'use client'

import React from 'react'
import { format } from 'date-fns'
import {
    Briefcase,
    GraduationCap,
    LucideIcon,
    MapPin,
    Tag,
    ToggleLeft,
    UserCircle,
} from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { useSkill } from '@/features/master/skill/hooks/use-skill'
import type { JobseekerDTO } from '@/features/onboarding/types/jobseeker-type'

const FALLBACK_ICON = '/images/icon/microsoft-copilot.svg'

const SkillIcon = ({ src, alt }: { src: string; alt: string }) => (
    <img
        src={src}
        alt={alt}
        className="h-3.5 w-3.5 object-contain"
        onError={(e) => {
            e.currentTarget.src = FALLBACK_ICON
        }}
    />
)

const ReviewStep = () => {
    const { getValues } = useFormContext<JobseekerDTO>()
    const values = getValues()

    const { skills } = useSkill('')
    const skillMap = React.useMemo(
        () => new Map(skills.map((s) => [s.id, s])),
        [skills],
    )

    // Helper to format date strings/objects safely
    const formatDate = (date: any) => {
        if (!date) return ''
        try {
            return format(new Date(date), 'MMM yyyy')
        } catch {
            return 'Invalid Date'
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold">Review & Submit</h2>
                <p className="text-muted-foreground text-sm">
                    Please verify your information before completing your profile.
                </p>
            </div>

            {/* --- Personal & Contact Section --- */}
            <section className="space-y-3">
                <h3 className="text-primary text-sm font-bold tracking-widest uppercase">
                    Professional Details
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SummaryBox icon={UserCircle} label="Headline" value={values.headline} />
                    <SummaryBox icon={Briefcase} label="Current Position" value={values.currentPosition} />
                    <SummaryBox icon={Tag} label="Industry" value={values.industry} />
                    <SummaryBox
                        icon={MapPin}
                        label="Location"
                        value={[values.city, values.state, values.country].filter(Boolean).join(' • ')}
                    />
                    <SummaryBox
                        icon={ToggleLeft}
                        label="Open to Work"
                        value={values.openToWork ? 'Yes' : 'No'}
                    />
                    {values.jobTitle && (
                        <SummaryBox icon={Briefcase} label="Job Title" value={values.jobTitle} />
                    )}
                </div>
            </section>

            {/* --- Education Section --- */}
            <section className="space-y-3">
                <h3 className="text-primary text-sm font-bold tracking-widest uppercase">
                    Education
                </h3>
                <div className="space-y-3">
                    {values.educations?.length > 0 ? (
                        values.educations.map((edu, index) => (
                            <div
                                key={index}
                                className="bg-background flex gap-4 rounded-lg border p-4 shadow-sm"
                            >
                                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                                    <GraduationCap className="text-primary h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">{edu.institutionName}</h4>
                                    <p className="text-muted-foreground text-sm">
                                        {edu.degree} in {edu.fieldOfStudy}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-xs italic">
                                        {formatDate(edu.startDate)} —{' '}
                                        {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                                    </p>
                                    {edu.grade && (
                                        <p className="text-muted-foreground mt-0.5 text-xs">
                                            GPA: {edu.grade}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm italic">
                            No education history added.
                        </p>
                    )}
                </div>
            </section>

            {/* --- Experience Section --- */}
            <section className="space-y-3">
                <h3 className="text-primary text-sm font-bold tracking-widest uppercase">
                    Professional Experience
                </h3>
                <div className="space-y-3">
                    {values.experiences?.length > 0 ? (
                        values.experiences.map((exp, index) => (
                            <div
                                key={index}
                                className="bg-background flex gap-4 rounded-lg border p-4 shadow-sm"
                            >
                                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                                    <Briefcase className="text-primary h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <h4 className="text-sm font-bold">{exp.title}</h4>
                                        <span className="bg-secondary rounded-full px-2 py-0.5 text-[10px] font-bold uppercase">
                                            {exp.employmentType}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        {exp.companyName} • {exp.location}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-xs font-medium italic">
                                        {formatDate(exp.startDate)} —{' '}
                                        {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                                    </p>
                                    {exp.skills && exp.skills.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {exp.skills.map((skillId) => {
                                                const skill = skillMap.get(skillId)
                                                return (
                                                    <span
                                                        key={skillId}
                                                        className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                                                    >
                                                        {skill?.icon && (
                                                            <SkillIcon
                                                                src={skill.icon}
                                                                alt={skill.name}
                                                            />
                                                        )}
                                                        {skill?.name ?? skillId}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm italic">
                            No work history added.
                        </p>
                    )}
                </div>
            </section>
        </div>
    )
}

// Internal Helper Component (Updated for better layout)
interface SummaryBoxProps {
    icon: LucideIcon
    label: string
    value: string
}

const SummaryBox = ({ icon: Icon, label, value }: SummaryBoxProps) => (
    <div className="bg-background flex items-center gap-3 rounded-md border p-3 shadow-sm">
        <div className="bg-primary/10 rounded-full p-2">
            <Icon className="text-primary h-4 w-4" />
        </div>
        <div className="overflow-hidden">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                {label}
            </p>
            <p className="truncate text-sm font-semibold">
                {value || (
                    <span className="text-muted-foreground/50 font-normal italic">
                        Not provided
                    </span>
                )}
            </p>
        </div>
    </div>
)

export default ReviewStep
