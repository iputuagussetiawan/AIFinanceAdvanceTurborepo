'use client'

import React from 'react'

import type { IExperience } from '@/features/experience/types/experience-type'
import useAuth from '@/hooks/use-auth'

import ResumeSectionTitle from '../ResumeSectionTitle'
import ExperienceItem from './ExperienceItem'
import ExperienceSkeleton from './ExperienceSkeleton'

const ExperienceListing = () => {
    const { data, isLoading } = useAuth()
    const experienceList: IExperience[] = data?.user.experiences || []
    return (
        <div>
            <ResumeSectionTitle title="Experience" />
            {isLoading ? (
                <ExperienceSkeleton />
            ) : experienceList.length > 0 ? (
                experienceList.map((exp: IExperience) => (
                    <ExperienceItem key={exp.id} experience={exp} />
                ))
            ) : (
                <p className="text-[9px] text-gray-400 italic">No experience history added.</p>
            )}
        </div>
    )
}

export default ExperienceListing
